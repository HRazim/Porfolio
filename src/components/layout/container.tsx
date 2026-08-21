import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Balises autorisees pour un conteneur. Union fermee : pas de polymorphisme non type. */
export type ContainerTag = 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'aside' | 'nav';

/**
 * Largeur maximale du conteneur.
 * - `page`    : 72rem — largeur de page standard
 * - `measure` : 66ch  — colonne de texte long (voir Prose)
 * - `full`    : aucune contrainte, seules les marges laterales s'appliquent
 */
export type ContainerWidth = 'page' | 'measure' | 'full';

export interface ContainerProps {
  children: ReactNode;
  /** Balise rendue. Defaut : `div`. */
  as?: ContainerTag;
  /** Largeur maximale. Defaut : `page`. */
  width?: ContainerWidth;
  className?: string;
  id?: string;
}

const WIDTH_CLASS: Record<ContainerWidth, string> = {
  page: 'max-w-page',
  // Voir `.container-measure` dans globals.css : la borne inclut les marges,
  // pour que la LIGNE fasse la mesure et non la boite.
  measure: 'container-measure',
  full: '',
};

/**
 * Conteneur de page : largeur maximale controlee et marges laterales
 * responsives.
 *
 * Les marges viennent du jeton `--spacing-gutter`, une interpolation
 * `clamp()` entre 16px et 64px : aucune media query n'est necessaire.
 *
 * Rendu cote serveur.
 */
export function Container({
  children,
  as: Tag = 'div',
  width = 'page',
  className,
  id,
}: ContainerProps) {
  return (
    <Tag id={id} className={cn('mx-auto w-full px-gutter', WIDTH_CLASS[width], className)}>
      {children}
    </Tag>
  );
}
