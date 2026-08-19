/**
 * Concatenation conditionnelle de classes.
 *
 * Ecrit a la main plutot qu'importe : le projet n'admet aucune dependance
 * de composants, d'icones ou d'animation (voir AUDIT.md section 4.5, ou
 * 258 Ko de polices d'icones etaient telecharges pour 17 glyphes).
 */
export function cn(...parts: ReadonlyArray<string | false | null | undefined>): string {
  return parts.filter((part): part is string => Boolean(part)).join(' ');
}
