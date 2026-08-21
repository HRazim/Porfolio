import Link from 'next/link';

import { pathFor, type Locale, type PageKey } from '@/content/i18n';
import { SITE_NAME } from '@/lib/site';

import { Container } from './container';
import { HeaderScrollState } from './header-scroll-state';
import { LanguagePicker } from './language-picker';
import { MobileMenu } from './mobile-menu';
import { SiteNav } from './site-nav';
import { ModeToggle } from './mode-toggle';

export interface SiteHeaderProps {
  readonly locale: Locale;
  /** Page courante, pour que le sélecteur de langue vise son équivalent. */
  readonly page: PageKey | null;
  readonly slug?: string;
}

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
export function SiteHeader({ locale, page, slug }: SiteHeaderProps) {
  return (
    <>
      <HeaderScrollState />
      <header
        data-site-header
        className="sticky top-0 z-40 bg-paper"
      >
        <Container className="flex items-center justify-between gap-md py-xs">
          {/* AUCUN `aria-label` ICI. Il y en avait un, et il nuisait : un
              `aria-label` REMPLACE le texte de l’element au lieu de s’y
              ajouter. Le lien affichait « MAROUAN Hazim-Rayan » et annoncait
              « Retour à l’accueil » — deux libelles disjoints, ce que le
              critere WCAG 2.5.3 « Label in Name » (niveau A) interdit.

              Le defaut etait latent tant que l’accueil repetait le nom en
              surtitre. Ce surtitre a ete retire comme redondant : le nom ne
              subsiste que dans ce lien, et il doit donc y etre annonce. Sans
              `aria-label`, le nom accessible du lien est son propre texte. */}
          <Link
            href={pathFor('home', locale)}
            className="link-sweep inline-block font-mono text-body-sm font-medium tracking-wide text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
          >
            {SITE_NAME}
          </Link>

          {/* LE SECOND SELECTEUR A DEPLACE LE POINT DE RUPTURE, de `md` a
              `lg`. Ce n’est pas un gout : a 768 px, la largeur de contenu vaut
              707 px et le nom, les cinq entrees de navigation et la bascule de
              mode en occupent deja pres de 640. Quatre options de langue en
              demandent 130 de plus. Sous 1024 px, la navigation et les langues
              passent donc toutes deux derriere le bouton de menu, ou elles ont
              la place de s’ecrire en toutes lettres. */}
          <div className="flex items-center gap-md">
            <SiteNav locale={locale} className="hidden lg:block" />
            <LanguagePicker locale={locale} page={page} slug={slug} className="hidden lg:block" />
            <ModeToggle locale={locale} />
            <MobileMenu locale={locale} page={page} slug={slug} className="lg:hidden" />
          </div>
        </Container>
      </header>
    </>
  );
}
