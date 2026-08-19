'use client';

import { useTokenValues } from './use-token-values';

interface ScalarToken {
  readonly name: string;
  readonly cssVar: string;
  readonly usage: string;
}

interface ScalarTokenListProps {
  readonly tokens: readonly ScalarToken[];
  /** Constante de module : identite stable exigee par `useTokenValues`. */
  readonly cssVars: readonly string[];
  /** Affiche un apercu carre demontrant le rayon. */
  readonly showRadiusPreview?: boolean;
}

const PLACEHOLDER = '—';

/** Liste nom / valeur reelle / usage, pour les jetons scalaires. */
export function ScalarTokenList({ tokens, cssVars, showRadiusPreview = false }: ScalarTokenListProps) {
  const values = useTokenValues(cssVars);

  return (
    <ul className="flex list-none flex-col gap-2xs p-0">
      {tokens.map((token) => (
        <li key={token.cssVar} className="flex flex-wrap items-center gap-sm">
          {showRadiusPreview ? (
            <span
              aria-hidden="true"
              className="size-lg shrink-0 border border-ink-subtle bg-surface"
              style={{ borderRadius: `var(${token.cssVar})` }}
            />
          ) : null}
          <span className="w-xl shrink-0 font-mono text-body-sm font-medium text-ink">
            {token.name}
          </span>
          <span className="font-mono text-body-sm text-ink-subtle">
            {values[token.cssVar] || PLACEHOLDER}
          </span>
          <span className="text-body-sm text-ink-muted">{token.usage}</span>
        </li>
      ))}
    </ul>
  );
}
