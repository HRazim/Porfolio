import Link from 'next/link';

import { pathFor, type Locale, type PageKey } from '@/content/i18n';
import { HEADER } from '@/content/site-copy';
import { SITE_NAME } from '@/lib/site';

import { Container } from './container';
import { HeaderScrollState } from './header-scroll-state';
import { LanguageDisclosure } from './language-disclosure';
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
        {/* L’ECART EST UN MINIMUM, PAS UNE MARGE. `justify-between` pousse le
            nom et le groupe aux deux bouts : l’espace reel entre eux est ce
            qui reste, et il vaut plusieurs centaines de pixels sur un ecran
            ordinaire. La valeur declaree ici ne se voit qu’a l’instant ou la
            place manque — a 320 px — et c’est precisement la qu’elle doit
            ceder. La resserrer sous `lg` ne change donc RIEN visuellement,
            sauf d’empecher le nom du site de se couper en deux lignes. */}
        <Container className="flex items-center justify-between gap-3xs py-xs lg:gap-md">
          {/* LE NOM REDEVIENT UN LIEN, ET C’EST L’ENTREE DE NAVIGATION QUI
              CEDE. Les deux menaient a l’accueil et se suivaient dans l’ordre
              de tabulation : un lecteur d’ecran annoncait deux liens pour une
              seule destination. Le correctif precedent avait retire celui-ci —
              il retirait le mauvais. Cliquer le nom en haut a gauche pour
              revenir a l’accueil ne s’apprend pas, et ce qui ne s’apprend pas
              ne se remplace pas par une entree de menu. Les quatre entrees
              restantes sont les quatre SECTIONS du site ; l’accueil n’est pas
              une section, c’est le site.

              LE NOM D’UNE PERSONNE NE DIT PAS OU MENE UN LIEN. La destination
              est donc ecrite DANS le lien, dans un element hors ecran, et non
              dans un `aria-label` : celui-ci REMPLACERAIT « MAROUAN
              Hazim-Rayan » au lieu de s’y ajouter, et le texte affiche a
              l’ecran deviendrait introuvable pour un lecteur d’ecran — ce que
              le critere WCAG 2.5.3 « Label in Name » (niveau A) interdit, et
              qui avait deja du etre corrige ici une fois. Le nom accessible
              vaut « MAROUAN Hazim-Rayan — Accueil » : il CONTIENT le texte
              visible, et il dit la destination.

              `aria-current="page"` SUR L’ACCUEIL LUI-MEME : le lien y pointe
              vers la page ou l’on se trouve deja, et l’annoncer coute un
              attribut. `page` et non `true` — c’est une page, pas un element
              courant dans un ensemble.

              L’INTERLETTRAGE ELARGI NE VAUT QU’A PARTIR DE `lg`. Sous cette
              largeur, le nom retombe sur celui de son echelon typographique —
              aucune valeur n’est inventee ici, l’utilitaire est simplement
              retire. Il coutait 0,015 em sur dix-neuf caracteres, soit quatre
              pixels : exactement ce qui manquait pour que le nom tienne sur
              une ligne a 320 px. */}
          <Link
            href={pathFor('home', locale)}
            aria-current={page === 'home' ? 'page' : undefined}
            className="link-sweep inline-block font-mono text-body-sm font-medium text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent lg:tracking-wide"
          >
            {SITE_NAME}
            <span className="sr-only"> — {HEADER.homeDestination[locale]}</span>
          </Link>

          {/* SEULE LA NAVIGATION PASSE ENCORE DERRIERE LE BOUTON DE MENU.
              Le selecteur de langue en est sorti : mesure dans un navigateur,
              le menu deplie faisait 576 px de haut a 320 px de large et
              descendait a 637 px sur un ecran de 844 — les trois quarts de la
              hauteur pour cinq entrees et quatre langues. Les langues sont
              desormais dans l’en-tete a TOUTES les largeurs, et le menu ne
              porte plus que ce qu’il doit porter.

              LE SEUIL RESTE `lg`, et il est fixe par les cinq entrees de
              navigation, non par les langues : le declencheur replie ne coute
              qu’un code court et un chevron.

              LES ECARTS SE RESSERRENT SOUS `lg`, et c’est la reduction la plus
              economique — voir plus bas pourquoi elle ne suffit pas seule. */}
          <div className="flex items-center gap-2xs lg:gap-md">
            <SiteNav locale={locale} className="hidden lg:block" />
            <LanguageDisclosure locale={locale}>
              <LanguagePicker locale={locale} page={page} slug={slug} variant="full" />
            </LanguageDisclosure>
            <ModeToggle locale={locale} />
            <MobileMenu locale={locale} className="lg:hidden" />
          </div>
        </Container>
      </header>
    </>
  );
}
