import type { Locale, PageKey } from '@/content/i18n';
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
          {/* LE NOM N’EST PLUS UN LIEN, ET C’EST UNE CORRECTION.
              Il menait a l’accueil, et l’entree « Accueil » de la navigation
              le suit IMMEDIATEMENT dans l’ordre du document : deux liens
              consecutifs vers la meme adresse, qu’un lecteur d’ecran annonce
              l’un apres l’autre. Mesure sur rendu reel : 72 rendus sur 144,
              soit les 36 pages dans les deux themes A LA LARGEUR DE BUREAU —
              sous 1024 px la navigation passe derriere le menu et les deux
              liens ne se suivent plus.

              DES DEUX LIENS, C’EST CELUI-CI QUI PART. Son nom accessible est
              un nom de personne : il ne dit pas ou il mene, et sa destination
              ne se devine que du contexte. « Accueil » la dit, dans les quatre
              langues, et reste joignable partout — la navigation de bureau
              sous 1024 px, le menu au-dessus.

              L’AUTRE ISSUE A ETE ECARTEE. Garder le lien en le retirant de
              l’arbre d’accessibilite — `aria-hidden` et `tabindex="-1"` —
              aurait preserve la convention a la souris, mais laisse a l’ecran
              un lien souligne au survol que le clavier ne peut pas atteindre.
              Ce site ne pose pas d’element qui ment sur ce qu’il est.

              AUCUN `aria-label` NON PLUS, quand il etait encore un lien : il
              REMPLACE le texte au lieu de s’y ajouter, et annoncer « Retour à
              l’accueil » sur un element qui affiche un nom violait le critere
              WCAG 2.5.3 « Label in Name ». */}
          {/* L’INTERLETTRAGE ELARGI NE VAUT QU’A PARTIR DE `lg`. Sous cette
              largeur, le nom retombe sur celui de son echelon typographique —
              aucune valeur n’est inventee ici, l’utilitaire est simplement
              retire. Il coutait 0,015 em sur dix-neuf caracteres, soit quatre
              pixels : exactement ce qui manquait pour que le nom tienne sur
              une ligne a 320 px. */}
          <span className="inline-block font-mono text-body-sm font-medium text-ink lg:tracking-wide">
            {SITE_NAME}
          </span>

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
