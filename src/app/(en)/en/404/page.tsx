import type { Metadata } from 'next';

import { PageShell } from '@/components/layout/page-shell';
import { NotFoundPage } from '@/components/page/not-found-page';
import type { Locale } from '@/content/i18n';
import { PAGE_META } from '@/content/site-copy';
import { rootMetadata } from '@/lib/page-metadata';
import { pageTitle } from '@/lib/site';

/**
 * ---------------------------------------------------------------------------
 * DOCUMENT 404 DU PREFIXE /en — ECRIT SUR LE DISQUE, PAS DEDUIT
 * ---------------------------------------------------------------------------
 *
 * POURQUOI UNE PAGE, ET NON `not-found.tsx`. La convention `not-found` rend
 * quand un segment renonce PENDANT une requete. Un export statique n'a pas de
 * requete : mesure faite, `next build` avec `STATIC_EXPORT=1` n'ecrit aucun
 * document pour ces fichiers-la. Ils restent utiles a `next start`, ils ne
 * produisent rien a servir.
 *
 * Un hebergeur de fichiers statiques, lui, sait faire une chose : quand une
 * adresse ne correspond a aucun fichier, chercher un `404.html`. Encore
 * faut-il qu'il en existe un a cote. Cette page en depose un sous `/en`,
 * dans la langue de ce prefixe.
 *
 * CE QUE CELA SUPPOSE DE L'HEBERGEUR, et qui n'est pas verifiable d'ici : il
 * doit servir le `404.html` LE PLUS PROCHE du chemin demande, et non celui de
 * la racine. Les hebergeurs ne s'accordent pas sur ce point. Le document
 * existe donc dans tous les cas ; sa mise en service depend d'une
 * configuration qui n'appartient pas a ce depot.
 *
 * `noindex` COMME LA 404 GLOBALE. Elle porte une adresse reelle — un robot
 * pourrait la trouver — et elle ne doit pas etre indexee pour autant. Elle
 * n'entre pas au sitemap : celui-ci est derive des cles de page, et « 404 »
 * n'en est pas une.
 * ---------------------------------------------------------------------------
 */

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'en';

/**
 * Metadonnees reprises de la racine, comme la 404 globale : sans elles, la
 * page perdrait le nom du site dans son titre, sa canonique et son bloc Open
 * Graph. `title` est compose a la main, faute de gabarit applicable.
 */
export const metadata: Metadata = {
  ...rootMetadata(locale),
  title: pageTitle(PAGE_META.notFound.title[locale]),
  description: PAGE_META.notFound.description[locale],
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <PageShell locale={locale} page={null}>
      <NotFoundPage locale={locale} />
    </PageShell>
  );
}
