import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export type ProseTag = 'div' | 'article' | 'section';

/** Taille du corps de texte. `lead` sert les chapos et introductions. */
export type ProseSize = 'default' | 'lead';

export interface ProseProps {
  children: ReactNode;
  /** Balise rendue. Defaut : `div`. */
  as?: ProseTag;
  /** Taille du corps. Defaut : `default`. */
  size?: ProseSize;
  className?: string;
}

const SIZE_CLASS: Record<ProseSize, string> = {
  default: 'text-body-md',
  lead: 'text-body-lg',
};

/**
 * Conteneur de texte long.
 *
 * MESURE DE LIGNE : bornee par le jeton `--container-measure` (66ch), ce qui
 * place la longueur de ligne entre 60 et 75 caracteres pour du francais
 * compose en Instrument Sans. AUDIT.md section 7.6 mesure 95 caracteres sur
 * le site precedent, soit 27 % au-dela de la limite haute de lisibilite
 * admise en typographie editoriale.
 *
 * Le rythme interne (marges de paragraphe, listes, liens) est defini par la
 * classe `.prose` dans globals.css, en jetons exclusivement.
 *
 * Rendu cote serveur.
 */
export function Prose({ children, as: Tag = 'div', size = 'default', className }: ProseProps) {
  return (
    <Tag className={cn('prose max-w-measure text-ink-muted', SIZE_CLASS[size], className)}>
      {children}
    </Tag>
  );
}
