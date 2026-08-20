import Link from 'next/link';

import { HEADER } from '@/content/site-copy';
import { SITE_NAME } from '@/lib/site';

import { Container } from './container';
import { HeaderScrollState } from './header-scroll-state';
import { MobileMenu } from './mobile-menu';
import { SiteNav } from './site-nav';
import { ModeToggle } from './mode-toggle';

/**
 * En-tete unique du site.
 *
 * AUDIT.md section 3.6 : l’en-tete etait recopie a l’identique sur trois
 * pages, 19 lignes a chaque fois, et le pied de page avait deja diverge
 * entre deux copies.
 *
 * Le nom n’est PAS un `<h1>` : AUDIT.md section 5.1 releve que le `h1` du
 * site precedent etait le logo, repete a l’identique sur chaque page, et
 * qu’il doublonnait le premier `h2` de l’accueil. Le `h1` appartient
 * desormais au titre de la page.
 *
 * Rendu cote serveur. Seuls les deux composants clients qu’il monte —
 * l’etat de defilement et le menu mobile — s’executent dans le navigateur.
 */
export function SiteHeader() {
  return (
    <>
      <HeaderScrollState />
      <header
        data-site-header
        className="sticky top-0 z-40 bg-paper"
      >
        <Container className="flex items-center justify-between gap-md py-xs">
          <Link
            href="/"
            aria-label={HEADER.homeLinkLabel}
            className="link-sweep inline-block font-mono text-body-sm font-medium tracking-wide text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
          >
            {SITE_NAME}
          </Link>

          <div className="flex items-center gap-md">
            <SiteNav className="hidden md:block" />
            <ModeToggle />
            <MobileMenu className="md:hidden" />
          </div>
        </Container>
      </header>
    </>
  );
}
