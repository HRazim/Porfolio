import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Amplitude du rythme vertical. */
export type SectionSpacing = 'compact' | 'default' | 'spacious';

/**
 * Fond de la section.
 *
 * IMPORTANT — le fond est TOUJOURS pilote par cette prop, jamais par la
 * position de la section dans le DOM. AUDIT.md section 3.7 releve trois
 * mecanismes de style couples a `nth-child` dans le site precedent :
 * alternance des fonds, delais d'animation et ordre des images. Toute
 * insertion ou reorganisation de section inversait silencieusement le rendu
 * de toutes les suivantes. Cette dependance est interdite ici.
 */
export type SectionBackground = 'paper' | 'surface';

export type SectionTag =
  | 'section'
  | 'div'
  | 'article'
  | 'main'
  | 'footer'
  | 'header'
  | 'aside';

export interface SectionProps {
  children: ReactNode;
  /** Balise rendue. Defaut : `section`. */
  as?: SectionTag;
  /** Amplitude du rythme vertical. Defaut : `default`. */
  spacing?: SectionSpacing;
  /** Fond, explicite et jamais deduit de la position. Defaut : `paper`. */
  background?: SectionBackground;
  /** Ancre de la section. */
  id?: string;
  /** Identifiant du titre qui nomme la section, pour `aria-labelledby`. */
  labelledBy?: string;
  className?: string;
}

/** Toutes les valeurs proviennent de l'echelle d'espacement de base 4px. */
const SPACING_CLASS: Record<SectionSpacing, string> = {
  compact: 'py-2xl', //  64px
  default: 'py-3xl', //  96px
  spacious: 'py-4xl', // 128px
};

const BACKGROUND_CLASS: Record<SectionBackground, string> = {
  paper: 'bg-paper',
  surface: 'bg-surface',
};

/**
 * Bande horizontale de page, porteuse du rythme vertical.
 *
 * Rendu cote serveur.
 */
export function Section({
  children,
  as: Tag = 'section',
  spacing = 'default',
  background = 'paper',
  id,
  labelledBy,
  className,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn(SPACING_CLASS[spacing], BACKGROUND_CLASS[background], className)}
    >
      {children}
    </Tag>
  );
}
