import type { Metadata } from 'next';

import { SiteDocument } from '@/components/layout/site-document';
import type { Locale } from '@/content/i18n';
import { rootMetadata } from '@/lib/page-metadata';

import '../globals.css';

/**
 * ---------------------------------------------------------------------------
 * MISE EN PAGE RACINE — ARABE
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
const locale: Locale = 'ar';

export const metadata: Metadata = rootMetadata(locale);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LA FONTE ARABE EST IMPORTEE ICI, ET NULLE PART AILLEURS — c'est la seule
  // racine qui en a besoin, et le corps commun du document n'a donc pas a la
  // connaitre.
  //
  // Ce n'est PAS ce qui l'empeche d'etre telechargee ailleurs : le projet ne
  // produit qu'une feuille de style, partagee par les quatre langues, et les
  // regles `@font-face` y figurent toutes. Ce qui l'empeche, ce sont deux
  // barrieres verifiees sur le HTML produit :
  //   - aucun `<link rel="preload">` ne la designe, sur aucune des 39 pages ;
  //   - son `unicode-range` ne couvre que l'arabe, et un navigateur ne va
  //     chercher un fichier de fonte que si la page contient un caractere
  //     qu'il couvre.
  // La variable `--font-arabic-face`, elle, n'est exposee que sur les pages
  // arabes : c'est la troisieme barriere, et la seule qu'une recherche
  // textuelle sur le HTML puisse constater.
  return (
    <SiteDocument locale={locale}>
      {children}
    </SiteDocument>
  );
}
