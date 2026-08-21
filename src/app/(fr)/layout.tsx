import type { Metadata } from 'next';

import { SiteDocument } from '@/components/layout/site-document';
import type { Locale } from '@/content/i18n';
import { rootMetadata } from '@/lib/page-metadata';

import '../globals.css';

/**
 * ---------------------------------------------------------------------------
 * MISE EN PAGE RACINE — FRANCAIS
 * ---------------------------------------------------------------------------
 *
 * Une racine par langue. Elles sont quatre parce que `<html lang>` ne peut
 * porter qu'une valeur et n'est rendu que par une racine ; Next.js autorise
 * cette configuration au moyen de groupes de routes, a condition qu'aucun
 * `layout` de premier niveau ne subsiste.
 *
 * Tout ce qu'elles ont en commun vit dans SiteDocument. Ici, la langue.
 * ---------------------------------------------------------------------------
 */
/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'fr';

export const metadata: Metadata = rootMetadata(locale);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteDocument locale={locale}>{children}</SiteDocument>;
}
