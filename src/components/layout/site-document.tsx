import type { ReactNode } from 'react';

import { localeBootScript, LOCALE_META, type Locale } from '@/content/i18n';
import { fontVariables } from '@/lib/fonts';
import { SITE_ADDRESS, SITE_NAME, SITE_URL, SOCIAL_LINKS, STRUCTURED_CONTACT } from '@/lib/site';
import { DEFAULT_MODE, THEME_BOOT_SCRIPT } from '@/lib/theme';

/**
 * ---------------------------------------------------------------------------
 * DOCUMENT — CE QUE LES QUATRE MISES EN PAGE RACINES ONT EN COMMUN
 * ---------------------------------------------------------------------------
 *
 * POURQUOI QUATRE MISES EN PAGE RACINES. L’attribut `lang` vit sur `<html>`,
 * et `<html>` n’est rendu que par une mise en page racine. Une seule ne peut
 * donc porter qu’une seule langue. Next.js autorise plusieurs racines à
 * condition de supprimer le `layout` de premier niveau et d’en placer un dans
 * chaque groupe de routes — c’est exactement ce que fait `src/app/(fr)`,
 * `(en)`, `(es)` et `(ar)`.
 *
 * L’alternative aurait été un segment dynamique `[locale]`, qu’un
 * `generateStaticParams` aurait alimenté. Elle est écartée : les segments
 * d’URL sont TRADUITS — `/en/about`, `/es/acerca-de` — et un segment
 * dynamique unique ne peut pas produire deux mots différents.
 *
 * CE FICHIER N’EST PAS UNE MISE EN PAGE. Il est le corps commun que les
 * quatre appellent, pour que la langue soit leur SEULE différence. Ce qui est
 * écrit ici l’est une fois ; ce qui diffère est un paramètre.
 * ---------------------------------------------------------------------------
 */
export interface SiteDocumentProps {
  readonly locale: Locale;
  /**
   * Classe de fonte supplementaire, apportee par la mise en page racine.
   *
   * Le corps commun du document ne connait donc AUCUNE fonte propre a une
   * langue : la racine arabe apporte la sienne, les trois autres n'en
   * apportent aucune. La classe n'apparait ainsi que sur les documents
   * arabes, ce qu'une recherche sur le HTML produit suffit a constater —
   * contrairement au comportement du navigateur, qui, lui, ne se lit pas.
   */
  readonly extraFontClass?: string;
  readonly children: ReactNode;
}

export function SiteDocument({ locale, extraFontClass, children }: SiteDocumentProps) {
  const meta = LOCALE_META[locale];
  /**
   * Données structurées `Person`.
   *
   * Elles suivent la langue de la page par leurs champs traduisibles : la
   * ville est « Paris », « París » ou « باريس » selon le document. Les autres
   * valeurs — nom, adresse électronique, profils — sont des noms propres et
   * des identifiants, identiques dans les quatre langues par nature.
   */
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL,
    email: STRUCTURED_CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_ADDRESS.locality[locale],
      addressCountry: SITE_ADDRESS.countryCode,
    },
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  } as const;

  return (
    // `data-mode` est la source de verite unique du theme (voir globals.css).
    // Le serveur rend le mode par defaut ; le script d’amorcage ci-dessous le
    // corrige AVANT la premiere peinture si l’utilisateur a deja choisi, ou si
    // le systeme demande le mode sombre. `suppressHydrationWarning` : cet
    // attribut est donc reecrit hors de React, et c’est voulu.
    <html
      lang={meta.htmlLang}
      data-mode={DEFAULT_MODE}
      suppressHydrationWarning
    >
      {/* `<Head />` de `next/head` appartient au routeur `pages`, qui n’existe
          pas ici : dans l’App Router, une mise en page racine rend `<head>`
          elle-meme. La regle ne se declenche que parce que ce corps commun vit
          dans `src/components` et non dans `src/app` — le greffon ne peut pas
          savoir qu’il est appele par quatre mises en page racines. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* Synchrone et place avant tout contenu : le navigateur suspend la
            construction du document pour l’executer. Les attributs sont donc
            poses avant qu’une seule regle de couleur ne soit peinte, ce qui
            supprime le scintillement qu’un effet React ne peut pas eviter. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        {/* Meme mecanique, pour la langue : il memorise celle de la page
            visitee, et ne redirige que depuis la racine nue. Voir la
            justification complete dans src/content/i18n.ts. */}
        <script dangerouslySetInnerHTML={{ __html: localeBootScript(locale) }} />
      </head>
      <body className={extraFontClass === undefined ? fontVariables : `${fontVariables} ${extraFontClass}`}>
        <script
          type="application/ld+json"
          // Donnees produites par le projet, jamais par une saisie utilisateur.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
