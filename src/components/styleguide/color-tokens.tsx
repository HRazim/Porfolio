'use client';

import { COLOR_TOKENS, CONTRAST_PAIRS } from '@/lib/design-tokens';
import { contrastRatio, wcagVerdict, WCAG_AA_LARGE } from '@/lib/contrast';

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
