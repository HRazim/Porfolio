import { statSync } from 'node:fs';
import { join } from 'node:path';

import { LOCALE_META, type Locale } from '@/content/i18n';
import { BYTE_UNITS } from '@/content/site-copy';

/**
 * ---------------------------------------------------------------------------
 * TAILLE REELLE D’UN ACTIF DE public/
 * ---------------------------------------------------------------------------
 *
 * Annoncer « PDF, 129 Ko » a cote d’un lien de telechargement engage : la
 * mention doit donc etre LUE sur le fichier, jamais recopiee a la main. Une
 * valeur ecrite en dur devient fausse au premier remplacement du fichier, et
 * rien ne le signale.
 *
 * La lecture a lieu pendant le rendu statique, au build : le module n’est
 * importe que par des Server Components, aucun octet de `node:fs` n’atteint
 * le navigateur. Aucune route dynamique, aucune regeneration — la valeur est
 * figee dans le HTML produit, exactement comme le reste de la page.
 * ---------------------------------------------------------------------------
 */

/** Racine des actifs servis tels quels. */
const PUBLIC_DIR = 'public';

/** Un kibioctet. Les tailles de fichier se comptent en puissances de 1024. */
const KIB = 1024;

/**
 * Taille d’un fichier de public/, en octets.
 *
 * @param publicPath chemin servi, racine du site comprise — « /cv.pdf ».
 */
export function publicAssetBytes(publicPath: string): number {
  const relative = publicPath.replace(/^\//, '');
  return statSync(join(process.cwd(), PUBLIC_DIR, relative)).size;
}

/**
 * Poids lisible, DANS LA LANGUE DE LA PAGE.
 *
 * Arrondi a l’unite : la decimale d’un poids de fichier n’informe personne,
 * et une valeur trop precise donne l’illusion d’une mesure qu’elle n’est pas.
 * Au-dela du mebioctet, une decimale redevient utile — « 1,4 Mo » et
 * « 1 Mo » ne disent pas la meme chose.
 *
 * La langue est un PARAMETRE OBLIGATOIRE, et non un parametre par defaut :
 * la version precedente ecrivait « Ko » en dur, ce qui n’etait faux que dans
 * trois langues sur quatre et ne se voyait donc pas depuis le francais. Une
 * valeur par defaut aurait laisse la meme faute possible, silencieusement.
 *
 * Ce qui varie tient en deux valeurs, chacune prise dans sa table :
 *   - l’unite,      dans BYTE_UNITS   (contenu, quatre langues obligatoires) ;
 *   - la virgule,   dans LOCALE_META  (format, une entree par langue).
 * Aucune des deux n’est ecrite ici.
 */
export function formatBytes(bytes: number, locale: Locale): string {
  if (bytes < KIB * KIB) {
    return `${Math.round(bytes / KIB)} ${BYTE_UNITS.kibibyte[locale]}`;
  }
  // `toFixed` produit toujours un point : c’est la representation machine du
  // nombre, pas son ecriture. La marque decimale de la langue la remplace.
  const value = (bytes / (KIB * KIB)).toFixed(1).replace('.', LOCALE_META[locale].decimalSeparator);
  return `${value} ${BYTE_UNITS.mebibyte[locale]}`;
}
