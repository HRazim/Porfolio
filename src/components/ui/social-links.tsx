import { COMMON } from '@/content/site-copy';
import { cn } from '@/lib/cn';
import { SOCIAL_LINKS } from '@/lib/site';

import { SOCIAL_ICONS } from './icons';

export interface SocialLinksProps {
  /** Libelle accessible de la liste. */
  readonly label: string;
  readonly className?: string;
}

/**
 * Liens sociaux.
 *
 * AUDIT.md section 3.6 : ce bloc etait recopie quatre fois dans le site
 * precedent. Section 3.2 : la classe `.sr-only` y etait employee huit fois
 * sans jamais etre definie, si bien que les mots « GitHub » et « LinkedIn »
 * s’affichaient par-dessus les pictogrammes.
 *
 * Rendu cote serveur.
 */
export function SocialLinks({ label, className }: SocialLinksProps) {
  return (
    <ul aria-label={label} className={cn('flex list-none items-center gap-sm p-0', className)}>
      {SOCIAL_LINKS.map((link) => {
        const Icon = SOCIAL_ICONS[link.network];
        return (
          <li key={link.network}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep inline-flex items-center gap-2xs rounded-sm p-2xs text-ink-muted transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
            >
              <Icon size="sm" />
              <span className="sr-only">{`${link.label} (${COMMON.newWindow})`}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
