'use client';

import { SPACING_TOKENS } from '@/lib/design-tokens';

import { useRootFontSize, useTokenValues } from './use-token-values';

const SPACING_VARS = SPACING_TOKENS.map((token) => token.cssVar);
const PLACEHOLDER = '—';

/**
 * Representation visuelle de l'echelle d'espacement.
 * La largeur de chaque barre EST la valeur du jeton : rien n'est simule.
 */
export function SpacingScale() {
  const values = useTokenValues(SPACING_VARS);
  const rootFontSize = useRootFontSize();

  return (
    <ul className="flex list-none flex-col gap-2xs p-0">
      {SPACING_TOKENS.map((token) => {
        const raw = values[token.cssVar];
        const rem = raw ? Number.parseFloat(raw) : null;
        const pixels =
          rem !== null && rootFontSize !== null ? `${Math.round(rem * rootFontSize)} px` : PLACEHOLDER;

        return (
          <li key={token.cssVar} className="flex items-center gap-sm">
            <span className="w-xl shrink-0 font-mono text-body-sm font-medium text-ink">
              {token.name}
            </span>
            <span
              aria-hidden="true"
              className="h-xs shrink-0 rounded-sm bg-accent"
              style={{ width: `var(${token.cssVar})` }}
            />
            <span className="font-mono text-body-sm text-ink-subtle">
              {pixels} · {token.multiplier} × base
            </span>
          </li>
        );
      })}
    </ul>
  );
}
