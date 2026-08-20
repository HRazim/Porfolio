import type { ReactNode } from 'react';

import { COMMON } from '@/content/site-copy';
import { cn } from '@/lib/cn';

import { ExternalLinkIcon } from './icons';

export interface ExternalLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  /** Affiche le pictogramme de lien sortant. Defaut : vrai. */
  readonly showIcon?: boolean;
}

/**
 * Lien ouvrant un nouvel onglet.
 *
 * AUDIT.md section 5.4 : les 10 liens `target="_blank"` du site precedent
 * ne portaient aucun `rel`, et rien n’indiquait a l’utilisateur qu’un
 * nouvel onglet allait s’ouvrir. Les deux manques sont corriges ici, en un
 * seul endroit.
 *
 * Rendu cote serveur.
 */
export function ExternalLink({ href, children, className, showIcon = true }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2xs text-accent link-underline transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink',
        className,
      )}
    >
      {children}
      {showIcon ? <ExternalLinkIcon size="sm" /> : null}
      <span className="sr-only">{` (${COMMON.newWindow})`}</span>
    </a>
  );
}
