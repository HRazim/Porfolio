import type { Metadata } from 'next';

import { alternatesFor, OG_LOCALE, pathFor, type Locale, type PageKey } from '@/content/i18n';
import { PAGE_META } from '@/content/site-copy';

import { pageTitle, SITE_DESCRIPTION, SITE_NAME, SITE_URL, TITLE_TEMPLATE } from './site';

/**
 * ---------------------------------------------------------------------------
 * MÉTADONNÉES — UNE SEULE FABRIQUE, QUATRE LANGUES
 * ---------------------------------------------------------------------------
 *
 * LE DÉFAUT QUE CE FICHIER REND IMPOSSIBLE. Déclarer un bloc `openGraph` sur
 * une page REMPLACE celui hérité de la mise en page — il ne le complète pas.
 * Une page qui déclarait son titre Open Graph perdait donc, en silence, sa
 * vignette et son `og:locale`. Le défaut avait déjà coûté son aperçu à
 * `/a-propos` ; il coûtait son `og:locale` à quatre gabarits de page sur six,
 * ce que le contrôle page par page de ce prompt a mis au jour.
 *
 * Une seule fonction compose désormais tous les blocs. Ce qu’elle oublierait,
 * elle l’oublierait partout — donc visiblement — au lieu de le perdre sur une
 * page qu’on ne regarde jamais.
 *
 * TOUT EST DÉRIVÉ DE LA LANGUE. Le titre, la description, `og:locale`, la
 * canonique et le chemin de la vignette : aucune de ces valeurs n’est écrite,
 * toutes viennent de la langue passée en paramètre. Une page ne peut donc pas
 * hériter d’une métadonnée rédigée dans une autre langue que la sienne.
 * ---------------------------------------------------------------------------
 */

/**
 * URL absolue d’un chemin du site.
 *
 * L’accueil français vaut `/` : concaténé tel quel, il produirait une adresse
 * terminée par une barre, différente de celle que le site publie depuis son
 * origine. La racine est donc réduite à la chaîne vide.
 */
function absolute(path: string): string {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

/**
 * Métadonnées de la mise en page racine d’une langue.
 *
 * Chacune des quatre mises en page racine appelle cette fonction avec la
 * sienne. C’est d’elle que les pages qui ne déclarent aucun bloc `openGraph`
 * héritent leur langue.
 */
export function rootMetadata(locale: Locale): Metadata {
  const home = pathFor('home', locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: TITLE_TEMPLATE,
    },
    description: SITE_DESCRIPTION[locale],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    alternates: {
      canonical: home,
    },
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[locale],
      url: absolute(home),
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION[locale],
    },
  };
}

/**
 * Accueil.
 *
 * Il ne déclare PAS de bloc `openGraph`, et c’est délibéré : il hérite
 * intégralement de celui de sa mise en page racine, qui décrit déjà le site
 * dans la bonne langue. Déclarer un bloc ici reviendrait à recopier ce que la
 * racine dit mieux, avec le risque d’en perdre une ligne au passage.
 */
export function homeMetadata(locale: Locale): Metadata {
  return {
    title: { absolute: pageTitle(PAGE_META.home.title[locale]) },
    description: PAGE_META.home.description[locale],
    alternates: {
      canonical: pathFor('home', locale),
      languages: alternatesFor('home'),
    },
  };
}

export type OpenGraphType = 'website' | 'profile' | 'article';

export interface PageMetadataInput {
  readonly locale: Locale;
  readonly page: PageKey;
  readonly slug?: string;
  readonly title: string;
  readonly description: string;
  readonly type: OpenGraphType;
}

/**
 * Métadonnées d’une page intérieure, dans sa langue.
 *
 * AUCUNE VIGNETTE N’EST DÉCLARÉE ICI, et c’est le résultat d’une mesure.
 * Trois comportements de Next.js ont été vérifiés sur le HTML produit :
 *
 *   - `images: undefined` n’est PAS la même chose qu’une clé absente. La clé
 *     présente supprime la vignette ; la clé absente laisse Next l’injecter.
 *   - la convention de fichier n’alimente que LE SEGMENT OÙ ELLE VIT. Une
 *     vignette placée à la racine d’une langue n’atteint pas `/a-propos`.
 *   - l’URL injectée porte une empreinte — `/opengraph-image-35za9p?…` —
 *     imprévisible depuis le code.
 *
 * D’où la règle : chaque segment de page porte son propre
 * `opengraph-image.tsx`, et personne n’écrit jamais l’URL d’une vignette.
 * Elle ne peut donc pas être fausse.
 */
export function pageMetadata({
  locale,
  page,
  slug,
  title,
  description,
  type,
}: PageMetadataInput): Metadata {
  const canonical = pathFor(page, locale, slug);
  const fullTitle = pageTitle(title);
  return {
    title,
    description,
    alternates: {
      canonical,
      // LES QUATRE EQUIVALENTS, PLUS `x-default`. Ils sont produits par la
      // table des routes, pas ecrits : une page ne peut donc pas se declarer
      // une alternative qui n'existe pas, ni en oublier une. La reciprocite
      // en decoule — A designe B parce que la table les lie tous deux.
      languages: alternatesFor(page, slug),
    },
    openGraph: {
      type,
      locale: OG_LOCALE[locale],
      title: fullTitle,
      description,
      url: absolute(canonical),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  };
}
