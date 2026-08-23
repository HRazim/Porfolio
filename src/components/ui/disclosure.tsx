import type { ReactNode } from 'react';

import { ChevronDownIcon } from './icons';
import { cn } from '@/lib/cn';

export interface DisclosureProps {
  /** Texte du declencheur. Il dit ce qui S'OUVRE, pas ce qu'il fait. */
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * ---------------------------------------------------------------------------
 * REPLI — `<details>` NATIF, RENDU COTE SERVEUR
 * ---------------------------------------------------------------------------
 *
 * CE COMPOSANT N'INVENTE RIEN : il EXTRAIT le mecanisme qui servait deja aux
 * descriptions de parcours, ecrit alors en clair dans la page. Un second
 * repliant ailleurs aurait signifie recopier ce balisage, et AUDIT.md section
 * 3.6 documente ce que devient un balisage recopie — deux copies qui ont deja
 * diverge.
 *
 * `<details>` DEPLOIE SANS JAVASCRIPT, et c'est la raison de ce choix. Le
 * principe du projet est que tout contenu reste atteignable meme si aucun
 * script ne s'execute : un panneau pilote par `useState` et masque par
 * `hidden` ne s'ouvrirait jamais dans un document ou React n'a pas demarre.
 * Ici, le contenu est dans le HTML servi, replie compris, et un moteur
 * d'indexation le lit sans executer une ligne.
 *
 * `<summary>` est un element interactif NATIF : focalisable sans `tabindex`,
 * activable a l'Entree et a l'Espace sans gestionnaire, expose avec son etat
 * deplie ou replie. Rien de tout cela n'est ecrit ici, et c'est pourquoi rien
 * ne peut en etre oublie.
 *
 * AUCUN `aria-expanded`, volontairement : `<details>` porte deja `open` dans
 * le DOM, et c'est cet attribut que la correspondance native lit.
 *
 * PAS D'ECHAPPEMENT NI DE CLIC EXTERIEUR, contrairement au selecteur de
 * langue : ce repli pose du texte DANS le flux, il ne recouvre rien et
 * n'attrape pas le focus. Il n'a donc besoin d'aucun script — et reste un
 * composant serveur.
 * ---------------------------------------------------------------------------
 */
export function Disclosure({ label, children, className }: DisclosureProps) {
  return (
    <details className={cn('mt-2xs', className)}>
      <summary className="disclosure-trigger inline-flex items-center gap-2xs rounded-sm font-mono text-body-sm text-accent transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink">
        {label}
        <ChevronDownIcon size="sm" className="disclosure-mark" />
      </summary>
      <div className="panel-enter mt-2xs">{children}</div>
    </details>
  );
}
