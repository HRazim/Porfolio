import type { Metadata } from 'next';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import { fontVariables } from '@/lib/fonts';
import {
  SITE_ADDRESS,
  SITE_DESCRIPTION,
  SITE_LANG,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
  STRUCTURED_CONTACT,
  TITLE_TEMPLATE,
} from '@/lib/site';
import { DEFAULT_MODE, THEME_BOOT_SCRIPT } from '@/lib/theme';

import './globals.css';

/**
 * Metadonnees globales.
 *
 * AUDIT.md section 6 releve, sur le site precedent : aucune `description`
 * sur deux pages sur trois, aucune balise Open Graph, aucune Twitter Card,
 * aucun favicon, aucune canonique, aucun sitemap, aucun robots.txt, aucune
 * donnee structuree.
 *
 * Le gabarit de titre garantit la contrainte de la section 6.3 : le nom
 * « MAROUAN Hazim-Rayan » figure dans CHAQUE balise title, alors qu’aucune
 * des trois pages precedentes ne le contenait.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

/**
 * Donnees structurees `Person`.
 * Toutes les valeurs proviennent de src/lib/site.ts : aucune n’est ecrite
 * une seconde fois.
 */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  url: SITE_URL,
  email: STRUCTURED_CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE_ADDRESS.locality,
    addressCountry: SITE_ADDRESS.countryCode,
  },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-mode` est la source de verite unique du theme (voir globals.css).
    // Le serveur rend le mode par defaut ; le script d’amorcage ci-dessous le
    // corrige AVANT la premiere peinture si l’utilisateur a deja choisi, ou si
    // le systeme demande le mode sombre. `suppressHydrationWarning` : cet
    // attribut est donc reecrit hors de React, et c’est voulu.
    <html
      lang={SITE_LANG}
      data-mode={DEFAULT_MODE}
      suppressHydrationWarning
    >
      <head>
        {/* Synchrone et place avant tout contenu : le navigateur suspend la
            construction du document pour l’executer. Les attributs sont donc
            poses avant qu’une seule regle de couleur ne soit peinte, ce qui
            supprime le scintillement qu’un effet React ne peut pas eviter. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className={fontVariables}>
        <script
          type="application/ld+json"
          // Donnees produites par le projet, jamais par une saisie utilisateur.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
