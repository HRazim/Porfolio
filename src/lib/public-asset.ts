import { statSync } from 'node:fs';
import { join } from 'node:path';

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
 * Poids lisible, en kibioctets entiers.
 *
 * Arrondi a l’unite : la decimale d’un poids de fichier n’informe personne,
 * et une valeur trop precise donne l’illusion d’une mesure qu’elle n’est pas.
 * Au-dela du mebioctet, une decimale redevient utile — « 1,4 Mo » et
 * « 1 Mo » ne disent pas la meme chose.
 */
export function formatBytes(bytes: number): string {
  if (bytes < KIB * KIB) return `${Math.round(bytes / KIB)} Ko`;
  return `${(bytes / (KIB * KIB)).toFixed(1).replace('.', ',')} Mo`;
}
