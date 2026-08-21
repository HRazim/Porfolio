/**
 * ---------------------------------------------------------------------------
 * LIER LA FIN D’UNE LIGNE
 * ---------------------------------------------------------------------------
 *
 * Un titre qui se termine par un mot seul sur sa dernière ligne se lit mal :
 * l’œil descend d’une ligne entière pour un mot. Le remède typographique est
 * l’espace insécable — elle refuse la coupure, donc la dernière ligne emporte
 * toujours au moins deux mots.
 *
 * POURQUOI UNE FONCTION ET NON DES INSÉCABLES DANS LES DONNÉES. Les titres de
 * réalisation sont rendus à trois endroits : la vignette d’accueil, la
 * vignette de l’index et le titre de la fiche. Les trois n’ont ni la même
 * largeur ni la même échelle, et seule la vignette d’accueil pose le
 * problème. Poser l’insécable dans `projects.ts` la propagerait aux deux
 * autres, où elle n’est pas demandée. La liaison est donc une décision de
 * PRÉSENTATION, prise là où elle s’applique.
 *
 * POURQUOI DEUX MOTS PORTEURS DE LETTRES, et non les deux derniers jetons.
 * « Système de supervision applicative — Egis » se termine par « — » et
 * « Egis » : lier ces deux-là laisserait une dernière ligne qui vaut un tiret
 * et un mot, ce qui ne vaut pas mieux qu’un mot seul. La ponctuation isolée
 * est donc absorbée, et la liaison remonte jusqu’au deuxième mot réel.
 *
 * `text-wrap: balance`, que la couche de base pose sur tous les titres, va
 * dans le même sens mais ne garantit rien : il équilibre les lignes là où il
 * est implémenté, et ne fait rien ailleurs. L’insécable, elle, est comprise
 * partout depuis toujours.
 * ---------------------------------------------------------------------------
 */

/** U+00A0. Écrite en séquence d’échappement : à l’œil nu, c’est une espace. */
const NO_BREAK_SPACE = '\u00a0';

/** Un jeton compte comme un mot s’il porte au moins une lettre, toute écriture. */
const CARRIES_A_LETTER = /\p{L}/u;

/** Nombre de mots que la dernière ligne doit emporter au minimum. */
const TAIL_WORDS = 2;

/**
 * Lie la fin d’une chaîne pour qu’aucune ligne ne se réduise à un seul mot.
 *
 * Renvoie la chaîne inchangée lorsqu’elle compte moins de deux mots : il n’y
 * a alors rien à lier, et rien à craindre — une ligne d’un seul mot qui est
 * aussi la seule ligne n’est pas une ligne isolée.
 */
export function bindTail(text: string): string {
  const tokens = text.split(' ');
  let words = 0;
  let from = tokens.length;

  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (CARRIES_A_LETTER.test(tokens[index])) words += 1;
    from = index;
    if (words === TAIL_WORDS) break;
  }

  if (words < TAIL_WORDS) return text;

  return [...tokens.slice(0, from), tokens.slice(from).join(NO_BREAK_SPACE)].join(' ');
}
