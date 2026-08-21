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

/**
 * Rang dans une cascade d'entree.
 *
 * L'union est FERMEE sur les quatre rangs que globals.css declare : un rang
 * qui n'existe pas dans la feuille ne produirait aucun delai, et la cascade
 * s'ecraserait en silence. Ici, elle ne compile pas.
 */
export type SectionEnterRank = 1 | 2 | 3 | 4;

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
  /**
   * Rang d'entree dans la cascade de la page. Absent, la section est peinte
   * avec la page, sans animation — c'est le defaut, et c'est ce qu'on veut
   * pour tout ce qui doit se lire tout de suite.
   */
  enter?: SectionEnterRank;
  className?: string;
}

/**
 * Rythme vertical, fluide.
 *
 * Les trois jetons sont definis dans globals.css et interpolent entre deux
 * valeurs de l'echelle nommee ; aucune valeur n'est ecrite ici.
 *
 *   compact   24px -> 48px   (etait 64px fixe)
 *   default   32px -> 64px   (etait 96px fixe)
 *   spacious  48px -> 96px   (etait 128px fixe)
 */
const SPACING_CLASS: Record<SectionSpacing, string> = {
  compact: 'py-section-compact',
  default: 'py-section-default',
  spacious: 'py-section-spacious',
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
  enter,
  className,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      data-enter={enter}
      className={cn(SPACING_CLASS[spacing], BACKGROUND_CLASS[background], className)}
    >
      {children}
    </Tag>
  );
}
