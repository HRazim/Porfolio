'use client';

import { useSyncExternalStore } from 'react';

import { COLOR_TOKENS, CONTRAST_PAIRS } from '@/lib/design-tokens';
import { contrastRatio, wcagVerdict, WCAG_AA_LARGE, WCAG_AA_NORMAL } from '@/lib/contrast';
import { COLOR_MODES, type ColorMode } from '@/lib/theme';

import { useTokenValues } from './use-token-values';

const COLOR_VARS = COLOR_TOKENS.map((token) => token.cssVar);
const PAIR_VARS = Array.from(
  new Set(CONTRAST_PAIRS.flatMap((pair) => [pair.foreground, pair.background])),
);

const PLACEHOLDER = '—';

/** Pastilles de couleur : nom semantique, valeur reelle, contraste sur le fond papier. */
export function ColorTokenGrid() {
  const values = useTokenValues(COLOR_VARS);
  const paper = values['--color-paper'];

  return (
    <ul className="grid list-none grid-cols-1 gap-md p-0 sm:grid-cols-2 lg:grid-cols-4">
      {COLOR_TOKENS.map((token) => {
        const value = values[token.cssVar];
        const ratio = value && paper ? contrastRatio(value, paper) : null;

        return (
          <li
            key={token.cssVar}
            className="flex flex-col gap-2xs rounded-md border border-border bg-surface p-sm"
          >
            <span
              aria-hidden="true"
              className="block h-2xl w-full rounded-sm border border-border"
              style={{ backgroundColor: `var(${token.cssVar})` }}
            />
            <span className="font-mono text-body-sm font-medium text-ink">{token.name}</span>
            <span className="font-mono text-body-sm text-ink-subtle">
              {value || PLACEHOLDER}
            </span>
            <span className="text-body-sm text-ink-muted">{token.role}</span>
            <span className="font-mono text-body-sm text-ink-subtle">
              {ratio === null ? PLACEHOLDER : `${ratio.toFixed(2)}:1 sur paper`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------------------------------------------------------------------
   LES DEUX MODES
   ---------------------------------------------------------------------------
   Les valeurs ne sont PAS transcrites : pour chaque mode, une sonde invisible
   portant `data-mode` est inseree dans le document, `getComputedStyle` y lit
   les onze jetons, puis la sonde est retiree. C'est possible parce que les
   blocs de mode de globals.css ne sont pas ancres a `:root` — n'importe quel
   element portant l'attribut redefinit les jetons pour lui-meme.

   Consequence : ce tableau ne peut pas mentir. S'il affiche une valeur, c'est
   celle que le navigateur applique reellement. Et il montre le mode sombre
   sans qu'il faille y basculer.
   --------------------------------------------------------------------------- */

type Matrix = Readonly<Record<ColorMode, Readonly<Record<string, string>>>>;

const EMPTY_MATRIX = Object.freeze({}) as Matrix;

let matrixCache: Matrix | null = null;

function readMatrix(): Matrix {
  if (matrixCache !== null) return matrixCache;

  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.position = 'absolute';
  host.style.visibility = 'hidden';
  host.style.pointerEvents = 'none';
  document.body.appendChild(host);

  const result: Record<string, Record<string, string>> = {};
  for (const mode of COLOR_MODES) {
    const probe = document.createElement('div');
    probe.setAttribute('data-mode', mode);
    host.appendChild(probe);
    const computed = getComputedStyle(probe);
    const tokens: Record<string, string> = {};
    for (const token of COLOR_TOKENS) {
      tokens[token.cssVar] = computed.getPropertyValue(token.cssVar).trim();
    }
    result[mode] = tokens;
  }

  host.remove();
  matrixCache = result as Matrix;
  return matrixCache;
}

/** Les valeurs sont statiques : aucun changement a observer. */
function subscribeToNothing(): () => void {
  return () => {};
}

const serverMatrix = (): Matrix => EMPTY_MATRIX;

const MODE_LABEL: Readonly<Record<ColorMode, string>> = {
  light: 'clair',
  dark: 'sombre',
};

/** Les onze jetons, dans les deux modes, avec leur valeur et leur ratio. */
export function ModeMatrix() {
  const matrix = useSyncExternalStore(subscribeToNothing, readMatrix, serverMatrix);

  return (
    <div className="flex flex-col gap-lg">
      {COLOR_MODES.map((mode) => {
        const tokens = matrix[mode];

        return (
          <section key={mode} data-mode={mode} aria-labelledby={`mode-${mode}`}>
            <div className="rounded-md border border-border bg-paper p-md">
              <h4 id={`mode-${mode}`} className="font-mono text-body-sm text-ink-subtle">
                {MODE_LABEL[mode]}
              </h4>
              <ul className="mt-sm grid list-none grid-cols-1 gap-2xs p-0 sm:grid-cols-3">
                {COLOR_TOKENS.map((token) => {
                  // Chaque jeton est mesure contre le fond qui le concerne :
                  // une encre d'accent contre son accent, tout le reste contre
                  // le fond principal.
                  const value = tokens?.[token.cssVar];
                  const against = tokens?.[token.against ?? '--color-paper'];
                  const ratio =
                    value && against && token.kind === 'text'
                      ? contrastRatio(value, against)
                      : null;
                  const fails = ratio !== null && ratio < WCAG_AA_NORMAL;

                  return (
                    <li
                      key={token.cssVar}
                      className={`flex items-center gap-2xs rounded-sm border p-2xs ${
                        fails ? 'border-accent-vivid bg-accent-soft' : 'border-border'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="block size-md shrink-0 rounded-sm border border-border"
                        style={{ backgroundColor: `var(${token.cssVar})` }}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-mono text-body-sm text-ink">{token.name}</span>
                        <span className="font-mono text-body-sm text-ink-subtle">
                          {value || PLACEHOLDER}
                        </span>
                        <span className="font-mono text-body-sm text-ink-muted">
                          {ratio === null
                            ? PLACEHOLDER
                            : `${ratio.toFixed(2)}:1${fails ? ' — ÉCHEC AA' : ''}`}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   LES DEUX ACCENTS, COTE A COTE
   ---------------------------------------------------------------------------
   La question a trancher d'un coup d'oeil : l'accent vif est-il effectivement
   vif ? Les deux pastilles sont donc posees l'une contre l'autre, a taille
   egale, sur le fond reel de leur mode. Sous chacune, sa valeur, son role
   et — pour celui qui y est soumis — son ratio.
   --------------------------------------------------------------------------- */

const ACCENT_ROLES = [
  {
    cssVar: '--color-accent',
    name: 'accent',
    role: 'texte, liens, survols — seuil AA de 4,5:1',
    measured: true,
  },
  {
    cssVar: '--color-accent-vivid',
    name: 'accent-vivid',
    role: 'aplats, pastilles, bordures — aucun texte, aucun seuil textuel',
    measured: false,
  },
] as const;

/** Les deux accents, dans les deux modes. */
export function AccentComparison() {
  const matrix = useSyncExternalStore(subscribeToNothing, readMatrix, serverMatrix);

  return (
    <ul className="grid list-none grid-cols-1 gap-lg p-0 sm:grid-cols-2">
      {COLOR_MODES.map((mode) => {
        const tokens = matrix[mode];
        const paper = tokens?.['--color-paper'];

        return (
            <li
              key={mode}
              data-mode={mode}
              className="rounded-md border border-border bg-paper p-md"
            >
              <p className="font-mono text-body-sm text-ink-subtle">{MODE_LABEL[mode]}</p>

              <div className="mt-sm flex gap-2xs">
                {ACCENT_ROLES.map((accent) => (
                  <span
                    key={accent.cssVar}
                    aria-hidden="true"
                    className="block h-3xl flex-1 rounded-sm border border-border"
                    style={{ backgroundColor: `var(${accent.cssVar})` }}
                  />
                ))}
              </div>

              <dl className="mt-sm flex flex-col gap-2xs">
                {ACCENT_ROLES.map((accent) => {
                  const value = tokens?.[accent.cssVar];
                  const ratio =
                    accent.measured && value && paper ? contrastRatio(value, paper) : null;

                  return (
                    <div key={accent.cssVar} className="flex flex-col gap-3xs">
                      <dt className="font-mono text-body-sm font-medium text-ink">
                        {accent.name}
                        <span className="ml-2xs font-normal text-ink-subtle">
                          {value || PLACEHOLDER}
                        </span>
                      </dt>
                      <dd className="text-body-sm text-ink-muted">
                        {accent.role}
                        {ratio === null ? null : (
                          <span className="font-mono text-ink-subtle">
                            {` — ${ratio.toFixed(2)}:1 sur paper`}
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </li>
        );
      })}
    </ul>
  );
}

/** Tableau de conformite WCAG, calcule en direct sur les jetons du theme actif. */
export function ContrastTable() {
  const values = useTokenValues(PAIR_VARS);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="pb-sm text-left text-body-sm text-ink-subtle">
          Ratios calcules a l’execution depuis les variables CSS du theme actif.
          Seuil AA : 4,5:1 pour un texte inferieur a 24 px non gras, 3:1 pour du
          grand texte.
        </caption>
        <thead>
          <tr className="border-b border-ink-subtle">
            <th scope="col" className="py-2xs pr-md font-mono text-body-sm font-medium text-ink">
              Combinaison
            </th>
            <th scope="col" className="py-2xs pr-md font-mono text-body-sm font-medium text-ink">
              Ratio
            </th>
            <th scope="col" className="py-2xs font-mono text-body-sm font-medium text-ink">
              Verdict
            </th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((pair) => {
            const foreground = values[pair.foreground];
            const background = values[pair.background];
            const ratio = foreground && background ? contrastRatio(foreground, background) : null;

            let verdict = PLACEHOLDER;
            if (ratio !== null) {
              if (pair.kind === 'line') {
                // Filet purement decoratif : aucun seuil de texte ne s'applique.
                // Le seuil de 3:1 (WCAG 1.4.11) ne vise que les elements
                // d'interface porteurs d'information — pour ceux-la, le systeme
                // impose --color-ink-subtle, jamais --color-border.
                verdict = `decoratif — hors seuil de texte (reference AA grand texte : ${WCAG_AA_LARGE}:1)`;
              } else {
                const result = wcagVerdict(ratio);
                verdict =
                  result === 'AA'
                    ? 'AA — conforme'
                    : result === 'AA-large'
                      ? 'AA grand texte uniquement'
                      : 'ECHEC';
              }
            }

            return (
              <tr key={pair.label} className="border-b border-border">
                <th
                  scope="row"
                  className="py-2xs pr-md font-mono text-body-sm font-normal text-ink-muted"
                >
                  {pair.label}
                </th>
                <td className="py-2xs pr-md font-mono text-body-sm text-ink">
                  {ratio === null ? PLACEHOLDER : `${ratio.toFixed(2)}:1`}
                </td>
                <td className="py-2xs text-body-sm text-ink-muted">{verdict}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
