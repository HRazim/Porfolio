import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Nombre de colonnes vise sur grand ecran. */
export type GridColumns = 1 | 2 | 3 | 4;

/** Gouttiere, puisee dans l'echelle d'espacement de base 4px. */
export type GridGap = 'sm' | 'md' | 'lg' | 'xl';

export type GridTag = 'div' | 'ul' | 'ol' | 'section';

export interface GridProps {
  children: ReactNode;
  /** Balise rendue. Defaut : `div`. Utiliser `ul` pour une vraie liste. */
  as?: GridTag;
  /** Colonnes sur grand ecran. Defaut : 2. */
  columns?: GridColumns;
  /** Gouttiere. Defaut : `md`. */
  gap?: GridGap;
  className?: string;
}

/**
 * Progression responsive par nombre de colonnes cible.
 *
 * Les classes sont ecrites en toutes lettres, jamais construites par
 * interpolation : Tailwind analyse le source statiquement et ne verrait pas
 * une classe assemblee a l'execution.
 */
const COLUMNS_CLASS: Record<GridColumns, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

const GAP_CLASS: Record<GridGap, string> = {
  sm: 'gap-sm', // 16px
  md: 'gap-md', // 24px
  lg: 'gap-lg', // 32px
  xl: 'gap-xl', // 48px
};

/**
 * Grille responsive.
 *
 * `display: grid` et `grid-template-columns: 1fr` sont declares dans la REGLE
 * DE BASE (`grid grid-cols-1`), pas seulement dans une media query. AUDIT.md
 * section 3.7 releve que la grille de projets du site precedent ne declarait
 * `grid-template-columns` que dans `@media (max-width: 768px)`, sans jamais
 * poser `display: grid` : la propriete etait donc sans aucun effet et les
 * cartes s'empilaient a toutes les largeurs.
 *
 * Rendu cote serveur.
 */
export function Grid({
  children,
  as: Tag = 'div',
  columns = 2,
  gap = 'md',
  className,
}: GridProps) {
  return (
    <Tag
      className={cn(
        'grid grid-cols-1',
        COLUMNS_CLASS[columns],
        GAP_CLASS[gap],
        Tag === 'ul' || Tag === 'ol' ? 'list-none p-0' : '',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
