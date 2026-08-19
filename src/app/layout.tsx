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
  telephone: STRUCTURED_CONTACT.phone,
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
    // `data-theme` est la source de verite unique du theme (voir globals.css).
    // `suppressHydrationWarning` : l’attribut est reecrit cote client par la
    // bascule de theme du styleguide, apres hydratation.
    <html lang={SITE_LANG} data-theme="light" suppressHydrationWarning>
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
