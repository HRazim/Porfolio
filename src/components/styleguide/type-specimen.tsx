'use client';

import { TYPE_TOKENS } from '@/lib/design-tokens';
import { parseClampBounds } from '@/lib/contrast';

import { useRootFontSize, useTokenValues } from './use-token-values';

const TYPE_VARS = TYPE_TOKENS.map((token) => token.cssVar);

/**
 * Classes ecrites en toutes lettres : Tailwind analyse le source
 * statiquement et ne verrait pas une classe assemblee a l'execution.
 */
const LEVEL_CLASS: Record<string, string> = {
  'display-xl': 'text-display-xl font-display',
  'display-lg': 'text-display-lg font-display',
  'display-md': 'text-display-md font-display',
  'display-sm': 'text-display-sm font-display',
  'body-xl': 'text-body-xl font-body',
  'body-lg': 'text-body-lg font-body',
  'body-md': 'text-body-md font-body',
  'body-sm': 'text-body-sm font-body',
};

const SAMPLE = 'La forme suit la matière';
const PLACEHOLDER = '—';

/** Les huit niveaux de l'echelle, avec les deux bornes reelles de leur clamp(). */
export function TypeSpecimen() {
  const values = useTokenValues(TYPE_VARS);
  const rootFontSize = useRootFontSize();

  return (
    <ul className="flex list-none flex-col gap-xl p-0">
      {TYPE_TOKENS.map((token) => {
        const raw = values[token.cssVar];
        const bounds = raw ? parseClampBounds(raw) : null;
        const rangeLabel =
          bounds && rootFontSize !== null
            ? `${(bounds.min * rootFontSize).toFixed(2)} px → ${(bounds.max * rootFontSize).toFixed(2)} px`
            : PLACEHOLDER;

        return (
          <li key={token.cssVar} className="flex flex-col gap-2xs border-t border-border pt-md">
            <div className="flex flex-wrap items-baseline gap-x-md gap-y-3xs font-mono text-body-sm text-ink-subtle">
              <span className="font-medium text-ink">{token.name}</span>
              <span>{rangeLabel}</span>
              <span>
                {bounds ? `${bounds.min}rem → ${bounds.max}rem` : PLACEHOLDER}
              </span>
              <span>famille : {token.family}</span>
            </div>
            <p className="text-body-sm text-ink-muted">{token.usage}</p>
            <p className={`${LEVEL_CLASS[token.name] ?? ''} text-ink`}>{SAMPLE}</p>
          </li>
        );
      })}
    </ul>
  );
}
