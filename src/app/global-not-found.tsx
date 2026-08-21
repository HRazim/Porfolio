import type { Metadata } from 'next';

import { PageShell } from '@/components/layout/page-shell';
import { SiteDocument } from '@/components/layout/site-document';
import { NotFoundPage } from '@/components/page/not-found-page';
import { DEFAULT_LOCALE, type Locale } from '@/content/i18n';
import { PAGE_META } from '@/content/site-copy';
import { rootMetadata } from '@/lib/page-metadata';
import { pageTitle } from '@/lib/site';

import './globals.css';

/**
 * ---------------------------------------------------------------------------
 * PAGE 404 GLOBALE — UNE SEULE, DANS LA LANGUE PAR DÉFAUT
 * ---------------------------------------------------------------------------
 *
 * POURQUOI CE FICHIER EXISTE. Le site a quatre mises en page racines, une par
 * langue. Une adresse qui ne correspond à aucune route n’appartient à aucune
 * d’elles : Next.js ne peut donc pas choisir dans laquelle composer la 404, et
 * sert la sienne — sans feuille de style, sans en-tête, sans un mot écrit ici.
 * La documentation nomme ce cas et donne `global-not-found` pour réponse.
 *
 * IL CONTOURNE LES MISES EN PAGE, ce qui est le contrat de la convention : il
 * doit donc importer lui-même la feuille de style et rendre le document
 * entier. C’est la raison de l’import de `globals.css` ci-dessus, et de
 * `SiteDocument`, qui pose `<html>`, `<body>` et les scripts d’amorçage.
 *
 * POURQUOI ELLE N’EST PAS TRADUITE. Une 404 répond à une adresse inconnue :
 * sa langue n’est pas connue à la construction. Un export statique sert un
 * unique `404.html` pour tout le site, sans redirection ni détection côté
 * serveur — les deux sont exclues par la règle 6 du dépôt. Le français est la
 * langue par défaut, celle que `x-default` désignera pour tout visiteur dont
 * la langue n’est pas couverte : même question, même réponse.
 *
 * Le sélecteur de langue y figure malgré tout, avec `page={null}` : il mène à
 * l’accueil de chaque langue. Un visiteur égaré retrouve donc la sienne en un
 * clic, ce qu’aucune redirection statique ne saurait faire pour lui.
 * ---------------------------------------------------------------------------
 */
const locale: Locale = DEFAULT_LOCALE;

/**
 * Contourner les mises en page, c’est aussi n’hériter d’AUCUNE métadonnée.
 * Sans cette reprise explicite, la page 404 perdait `application-name`,
 * `author`, `creator`, la canonique, le bloc Open Graph, la carte Twitter —
 * et le nom du site dans son titre, que la règle du dépôt exige dans CHAQUE
 * balise `title`. Constaté sur le HTML produit, et corrigé ici.
 *
 * `title` est composé à la main : un gabarit de titre vit dans une mise en
 * page, et il n’y en a pas au-dessus de ce fichier.
 *
 * LA VIGNETTE RESTE ABSENTE, seule métadonnée non reprise. La convention de
 * fichier ne peut pas l’injecter dans une page qui contourne les mises en
 * page, et son URL porte une empreinte de construction qu’aucun code ne peut
 * prédire. Une 404 est `noindex, nofollow` : ce n’est pas une page que l’on
 * partage.
 */
export const metadata: Metadata = {
  ...rootMetadata(locale),
  title: pageTitle(PAGE_META.notFound.title[locale]),
  description: PAGE_META.notFound.description[locale],
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <SiteDocument locale={locale}>
      <PageShell locale={locale} page={null}>
        <NotFoundPage locale={locale} />
      </PageShell>
    </SiteDocument>
  );
}
