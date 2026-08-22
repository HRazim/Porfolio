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
        <Container className="flex items-center justify-between gap-md py-xs">
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
          <span className="inline-block font-mono text-body-sm font-medium tracking-wide text-ink">
            {SITE_NAME}
          </span>

          {/* LE POINT DE RUPTURE REVIENT A `lg`, ou il etait avant que le
              selecteur n’entre dans l’en-tete. Le deploiement replie ne coute
              plus que la largeur d’un code court et d’un chevron — la ou quatre
              options ecrites cote a cote en demandaient environ 130 px — mais
              les cinq entrees de navigation, elles, n’ont pas maigri : ce sont
              elles qui fixent le seuil.

              Sous 1024 px, navigation et langues passent donc ensemble derriere
              le bouton de menu, ou les langues s’ecrivent en toutes lettres et
              n’ont pas besoin d’etre repliees. */}
          <div className="flex items-center gap-md">
            <SiteNav locale={locale} className="hidden lg:block" />
            <LanguageDisclosure locale={locale} className="hidden lg:block">
              <LanguagePicker locale={locale} page={page} slug={slug} variant="full" />
            </LanguageDisclosure>
            <ModeToggle locale={locale} />
            <MobileMenu locale={locale} page={page} slug={slug} className="lg:hidden" />
          </div>
        </Container>
      </header>
    </>
  );
}
