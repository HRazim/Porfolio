import Link from 'next/link';

import type { Locale } from '@/content/i18n';
import { HEADER, NAVIGATION } from '@/content/site-copy';
import { cn } from '@/lib/cn';

export interface SiteNavProps {
  readonly locale: Locale;
  readonly className?: string;
  /** Oriente la liste. `horizontal` pour l’en-tete, `vertical` pour le menu mobile. */
  readonly orientation?: 'horizontal' | 'vertical';
}

const ORIENTATION_CLASS: Record<'horizontal' | 'vertical', string> = {
  horizontal: 'flex-row items-center gap-md',
  vertical: 'flex-col items-start gap-sm',
};

/**
 * Navigation principale.
 *
 * Declaree une seule fois, consommee par l’en-tete et par le menu mobile.
 * AUDIT.md section 3.6 : 112 lignes de balisage etaient recopiees sur trois
 * pages, et les copies avaient deja divergé.
 *
 * Rendu cote serveur.
 */
export function SiteNav({ locale, className, orientation = 'horizontal' }: SiteNavProps) {
  return (
    <nav aria-label={HEADER.navLabel[locale]} className={className}>
      <ul className={cn('flex list-none p-0', ORIENTATION_CLASS[orientation])}>
        {NAVIGATION.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href(locale)}
              className="link-sweep inline-block py-2xs text-body-sm text-ink-muted transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
            >
              {item.label[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
