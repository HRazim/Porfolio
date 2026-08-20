/**
 * ---------------------------------------------------------------------------
 * MECANIQUE DU THEME — MODE CLAIR OU SOMBRE
 * ---------------------------------------------------------------------------
 *
 * UNE SEULE DIMENSION. Le site a porte cinq palettes selectionnables ; elles
 * ont ete retirees. Azur est desormais l'identite coloree du site, et le seul
 * reglage qui subsiste est le mode.
 *
 * Le mode n'est pas un gout mais une preference d'usage — confort de lecture,
 * sensibilite a la luminosite, reglage systeme. C'est pourquoi il survit au
 * menage, avec sa persistance et son script d'amorcage.
 *
 * Ce module ne contient AUCUNE valeur de couleur : les deux jeux de jetons
 * sont definis dans globals.css, seul endroit du projet autorise a en porter.
 * Ici vivent l'attribut, la cle de stockage et le script d'amorcage.
 *
 * Les libelles affiches vivent dans src/content/site-copy.ts avec le reste de
 * la prose.
 * ---------------------------------------------------------------------------
 */

export type ColorMode = 'light' | 'dark';

export const COLOR_MODES: readonly ColorMode[] = ['light', 'dark'];

/** Mode rendu par le serveur, et repli si le stockage est vide. */
export const DEFAULT_MODE: ColorMode = 'light';

/** Attribut porte par <html>. Source de verite unique, comme en CSS. */
export const MODE_ATTRIBUTE = 'data-mode';

export const MODE_STORAGE_KEY = 'portfolio-mode';

export function isColorMode(value: unknown): value is ColorMode {
  return value === 'light' || value === 'dark';
}

/**
 * ---------------------------------------------------------------------------
 * MOUVEMENT — LES DEUX ATTRIBUTS
 * ---------------------------------------------------------------------------
 *
 * Aucun de ces noms n'apparait en clair ailleurs qu'ici et dans globals.css.
 *
 * `data-motion` (sur <html>) — pose par le script d'amorcage, et seulement si
 *   JavaScript s'execute ET si l'utilisateur n'a pas demande un mouvement
 *   reduit. Il decide qu'une entree soit JOUEE ou non.
 *
 *   IL NE PEUT RIEN CACHER. C'etait le cas, et cela a coute une regression
 *   bloquante : il armait le masquage des sections, dont la revelation
 *   dependait d'un observateur. Trois attributs de plus vivaient ici —
 *   `data-reveal`, `data-revealed`, `data-reveal-ready` — ils ont disparu
 *   avec l'apparition au defilement. Ce qui reste est une animation a duree
 *   finie qui se termine seule ; qu'il soit pose ou non, l'etat final est le
 *   meme : le contenu est visible.
 *
 * `data-mode-changing` (sur <html>) — pose le temps d'un basculement de mode,
 *   pour adoucir le changement de couleurs. Hors de cet instant, aucune
 *   transition globale n'est armee.
 * ---------------------------------------------------------------------------
 */
export const MOTION_ATTRIBUTE = 'data-motion';
export const MODE_TRANSITION_ATTRIBUTE = 'data-mode-changing';

/**
 * Script d'amorcage, injecte tel quel dans <head>.
 *
 * POURQUOI IL EVITE LE SCINTILLEMENT — il est SYNCHRONE et place avant tout
 * contenu. Le navigateur suspend la construction du document, l'execute, et
 * l'attribut est donc pose sur <html> AVANT que la premiere regle de couleur
 * ne soit peinte. Il n'y a pas d'instant ou la page existe en clair alors que
 * l'utilisateur a choisi le sombre.
 *
 * Un `useEffect` ne peut pas rendre ce service : il s'execute apres le premier
 * rendu, donc apres une peinture — c'est exactement ce qui produit le
 * clignotement clair puis sombre que l'on cherche a eviter.
 *
 * En l'absence de choix explicite, le mode suit `prefers-color-scheme`.
 * Le tout est enveloppe dans un try/catch : un stockage refuse (navigation
 * privee, cookies bloques) ne doit pas empecher la page de s'afficher.
 *
 * IL POSE AUSSI `data-motion`, qui autorise l'entree en cascade de l'entete.
 * Il n'est pas pose si l'utilisateur a demande un mouvement reduit — premiere
 * des deux barrieres, la seconde etant le bloc `prefers-reduced-motion`.
 *
 * CE QU'IL NE FAIT PLUS : armer un masquage. Aucun attribut pose ici ne peut
 * rendre du contenu invisible. Qu'il s'execute, echoue ou soit bloque, l'etat
 * final du document est le meme — tout est lisible.
 *
 * Ecrit a la main plutot que compile : ce fragment doit rester lisible et
 * minuscule, aucun outil ne le transforme.
 */
export const THEME_BOOT_SCRIPT = [
  '(function(){var e=document.documentElement;try{',
  `var m=localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)});`,
  "if(m!=='light'&&m!=='dark')",
  "m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';",
  `e.setAttribute(${JSON.stringify(MODE_ATTRIBUTE)},m);`,
  '}catch(x){}try{',
  "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)",
  `e.setAttribute(${JSON.stringify(MOTION_ATTRIBUTE)},'on');`,
  '}catch(x){}})()',
].join('');
