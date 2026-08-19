/**
 * REGISTRE DES JETONS — NOMS ET INTENTIONS UNIQUEMENT.
 *
 * Ce fichier ne contient AUCUNE valeur : ni couleur, ni taille, ni
 * espacement. Il ne declare que les noms de variables CSS et leur role.
 * Les valeurs sont lues a l'execution sur les jetons reels par la page
 * /styleguide, ce qui garantit qu'aucune donnee affichee ne peut diverger
 * de globals.css — seul et unique lieu de definition.
 */

/** Role d'un jeton de couleur dans le systeme. */
export type ColorTokenKind = 'background' | 'text' | 'line';

export interface ColorToken {
  /** Suffixe du jeton, tel qu'utilise dans les utilitaires Tailwind. */
  readonly name: string;
  /** Variable CSS correspondante. */
  readonly cssVar: string;
  /** Intention, en francais. */
  readonly role: string;
  readonly kind: ColorTokenKind;
}

export const COLOR_TOKENS: readonly ColorToken[] = [
  {
    name: 'paper',
    cssVar: '--color-paper',
    role: 'Fond papier — blanc casse chaud, jamais #ffffff',
    kind: 'background',
  },
  {
    name: 'surface',
    cssVar: '--color-surface',
    role: 'Fond de surface — tres subtil, cartes et encarts',
    kind: 'background',
  },
  {
    name: 'border',
    cssVar: '--color-border',
    role: 'Bordure — filet decoratif, tres subtil',
    kind: 'line',
  },
  {
    name: 'ink',
    cssVar: '--color-ink',
    role: 'Encre principale — noir profond chaud, jamais #000000',
    kind: 'text',
  },
  {
    name: 'ink-muted',
    cssVar: '--color-ink-muted',
    role: 'Encre secondaire — texte de support',
    kind: 'text',
  },
  {
    name: 'ink-subtle',
    cssVar: '--color-ink-subtle',
    role: 'Encre tertiaire — metadonnees, legendes',
    kind: 'text',
  },
  {
    name: 'accent',
    cssVar: '--color-accent',
    role: 'Accent unique et chaud — a employer avec parcimonie',
    kind: 'text',
  },
  {
    name: 'accent-contrast',
    cssVar: '--color-accent-contrast',
    role: 'Encre posee sur le fond accent',
    kind: 'text',
  },
] as const;

/** Niveau de l'echelle typographique. */
export interface TypeToken {
  readonly name: string;
  readonly cssVar: string;
  /** Famille effectivement appliquee a ce niveau. */
  readonly family: 'display' | 'body';
  /** Usage prevu, en francais. */
  readonly usage: string;
}

export const TYPE_TOKENS: readonly TypeToken[] = [
  {
    name: 'display-xl',
    cssVar: '--text-display-xl',
    family: 'display',
    usage: "Titre d'ouverture, un seul par page",
  },
  {
    name: 'display-lg',
    cssVar: '--text-display-lg',
    family: 'display',
    usage: 'Titre de page secondaire',
  },
  {
    name: 'display-md',
    cssVar: '--text-display-md',
    family: 'display',
    usage: 'Titre de section',
  },
  {
    name: 'display-sm',
    cssVar: '--text-display-sm',
    family: 'display',
    usage: 'Titre de sous-section, titre de carte',
  },
  {
    name: 'body-xl',
    cssVar: '--text-body-xl',
    family: 'body',
    usage: "Chapo, phrase d'accroche",
  },
  {
    name: 'body-lg',
    cssVar: '--text-body-lg',
    family: 'body',
    usage: 'Paragraphe d’introduction',
  },
  {
    name: 'body-md',
    cssVar: '--text-body-md',
    family: 'body',
    usage: 'Corps de texte courant — ancrage de l’echelle',
  },
  {
    name: 'body-sm',
    cssVar: '--text-body-sm',
    family: 'body',
    usage: 'Legende, metadonnee, mention',
  },
] as const;

export interface SpacingToken {
  readonly name: string;
  readonly cssVar: string;
  /** Multiplicateur de l'unite de base (4px). */
  readonly multiplier: number;
}

export const SPACING_TOKENS: readonly SpacingToken[] = [
  { name: '3xs', cssVar: '--spacing-3xs', multiplier: 1 },
  { name: '2xs', cssVar: '--spacing-2xs', multiplier: 2 },
  { name: 'xs', cssVar: '--spacing-xs', multiplier: 3 },
  { name: 'sm', cssVar: '--spacing-sm', multiplier: 4 },
  { name: 'md', cssVar: '--spacing-md', multiplier: 6 },
  { name: 'lg', cssVar: '--spacing-lg', multiplier: 8 },
  { name: 'xl', cssVar: '--spacing-xl', multiplier: 12 },
  { name: '2xl', cssVar: '--spacing-2xl', multiplier: 16 },
  { name: '3xl', cssVar: '--spacing-3xl', multiplier: 24 },
  { name: '4xl', cssVar: '--spacing-4xl', multiplier: 32 },
] as const;

export interface RadiusToken {
  readonly name: string;
  readonly cssVar: string;
  readonly usage: string;
}

export const RADIUS_TOKENS: readonly RadiusToken[] = [
  { name: 'sm', cssVar: '--radius-sm', usage: 'Filets, puces, petits encarts' },
  { name: 'md', cssVar: '--radius-md', usage: 'Cartes, surfaces' },
  { name: 'full', cssVar: '--radius-full', usage: 'Pastilles et jetons circulaires' },
] as const;

export interface MotionToken {
  readonly name: string;
  readonly cssVar: string;
  readonly usage: string;
}

export const DURATION_TOKENS: readonly MotionToken[] = [
  { name: 'none', cssVar: '--duration-none', usage: 'Mouvement reduit — effectivement nul' },
  { name: 'fast', cssVar: '--duration-fast', usage: 'Survol, changement de couleur' },
  { name: 'base', cssVar: '--duration-base', usage: 'Bascule de theme, apparition' },
  { name: 'slow', cssVar: '--duration-slow', usage: 'Deplacement de bloc' },
] as const;

export const EASING_TOKENS: readonly MotionToken[] = [
  { name: 'out', cssVar: '--ease-out', usage: 'Entree, decompression' },
  { name: 'in-out', cssVar: '--ease-in-out', usage: 'Aller-retour, bascule' },
] as const;

/** Familles typographiques exposees par le systeme. */
export interface FontToken {
  readonly name: string;
  readonly cssVar: string;
  readonly family: string;
  readonly role: string;
  /** Graisses REELLEMENT telechargees. Aucune autre ne doit etre employee. */
  readonly weights: readonly number[];
  readonly subsets: readonly string[];
}

export const FONT_TOKENS: readonly FontToken[] = [
  {
    name: 'display',
    cssVar: '--font-display',
    family: 'Instrument Serif',
    role: 'Titres — la hierarchie se construit par la taille et l’interlettrage',
    weights: [400],
    subsets: ['latin', 'latin-ext'],
  },
  {
    name: 'body',
    cssVar: '--font-body',
    family: 'Instrument Sans',
    role: 'Corps de texte et interface',
    weights: [400, 500, 600],
    subsets: ['latin', 'latin-ext'],
  },
  {
    name: 'mono',
    cssVar: '--font-mono',
    family: 'JetBrains Mono',
    role: 'Metadonnees, labels, chiffres, notations techniques et grecques',
    weights: [400, 500],
    subsets: ['latin', 'latin-ext', 'greek'],
  },
] as const;

/**
 * Combinaisons a verifier au contraste.
 *
 * `kind: 'text'` -> seuil WCAG AA de 4.5:1 (texte < 24px non gras).
 * `kind: 'line'` -> filet decoratif, non porteur d'information : aucun seuil
 *                   de texte ne s'applique. La valeur est reportee a titre
 *                   informatif. Toute BORDURE D'ELEMENT INTERACTIF doit
 *                   utiliser `--color-ink-subtle` et non `--color-border`.
 */
export interface ContrastPair {
  readonly foreground: string;
  readonly background: string;
  readonly label: string;
  readonly kind: 'text' | 'line';
}

export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  { foreground: '--color-ink', background: '--color-paper', label: 'ink sur paper', kind: 'text' },
  { foreground: '--color-ink', background: '--color-surface', label: 'ink sur surface', kind: 'text' },
  { foreground: '--color-ink-muted', background: '--color-paper', label: 'ink-muted sur paper', kind: 'text' },
  { foreground: '--color-ink-muted', background: '--color-surface', label: 'ink-muted sur surface', kind: 'text' },
  { foreground: '--color-ink-subtle', background: '--color-paper', label: 'ink-subtle sur paper', kind: 'text' },
  { foreground: '--color-ink-subtle', background: '--color-surface', label: 'ink-subtle sur surface', kind: 'text' },
  { foreground: '--color-accent', background: '--color-paper', label: 'accent sur paper', kind: 'text' },
  { foreground: '--color-accent', background: '--color-surface', label: 'accent sur surface', kind: 'text' },
  { foreground: '--color-accent-contrast', background: '--color-accent', label: 'accent-contrast sur accent', kind: 'text' },
  { foreground: '--color-border', background: '--color-paper', label: 'border sur paper', kind: 'line' },
] as const;

/** Pangrammes francais, un par famille. */
export const PANGRAMS: readonly string[] = [
  'Portez ce vieux whisky au juge blond qui fume.',
  'Voix ambiguë d’un cœur qui au zéphyr préfère les jattes de kiwis.',
  'Bâchez la queue du wagon-taxi avec les pyjamas du fakir.',
] as const;

/**
 * Ligne de test de couverture de glyphes.
 * Contient les symboles grecs, les diacritiques francais, la ligature œ,
 * les guillemets francais et l’apostrophe typographique.
 */
export const GLYPH_TEST_LINE = 'µ λ μ é è à ç œ æ ù î ë « guillemets » l’apostrophe';
