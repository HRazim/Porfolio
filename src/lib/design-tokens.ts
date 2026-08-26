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
  /**
   * Fond contre lequel ce jeton doit etre mesure.
   *
   * Absent, c'est le fond principal. Une encre destinee a se poser sur un
   * accent n'a aucun sens mesuree contre le papier : elle ne s'y pose jamais.
   * Ce champ evite d'afficher un ratio vrai mais hors sujet.
   */
  readonly against?: string;
}

export const COLOR_TOKENS: readonly ColorToken[] = [
  {
    name: 'paper',
    cssVar: '--color-paper',
    role: 'Fond principal — legerement teinte, jamais un blanc pur',
    kind: 'background',
  },
  {
    name: 'surface',
    cssVar: '--color-surface',
    role: 'Fond de surface — perceptiblement distinct du fond principal',
    kind: 'background',
  },
  {
    name: 'border',
    cssVar: '--color-border',
    role: 'Bordure — filet perceptible, decoratif',
    kind: 'line',
  },
  {
    name: 'ink',
    cssVar: '--color-ink',
    role: 'Encre principale — legerement teintee, jamais un noir pur',
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
    role: 'Accent lisible — texte et liens, soumis au seuil AA',
    kind: 'text',
  },
  {
    name: 'accent-contrast',
    cssVar: '--color-accent-contrast',
    role: 'Encre posee sur le fond accent',
    kind: 'text',
    against: '--color-accent',
  },
  {
    name: 'accent-vivid',
    cssVar: '--color-accent-vivid',
    role: 'Accent vif — surfaces decoratives seules, jamais de texte dessus',
    // `background` et non `text` : ce jeton n'est PAS soumis au seuil de
    // 4.5:1, et l'annoter autrement ferait apparaitre un faux echec.
    kind: 'background',
  },
  {
    name: 'accent-vivid-contrast',
    cssVar: '--color-accent-vivid-contrast',
    role: 'Encre posee sur l accent vif, si le cas se presente',
    kind: 'text',
    against: '--color-accent-vivid',
  },
  {
    name: 'accent-soft',
    cssVar: '--color-accent-soft',
    role: 'Accent secondaire — fond de mise en valeur legere',
    kind: 'background',
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
  { name: 'base', cssVar: '--duration-base', usage: 'Bascule de mode, soulignement, elevation' },
  { name: 'slow', cssVar: '--duration-slow', usage: 'Entree en cascade de l entete' },
  { name: 'stagger', cssVar: '--duration-stagger', usage: 'Pas de decalage d une cascade' },
] as const;

/** Epaisseurs de filet. Deux valeurs, distinctes de l anneau de focus. */
export const RULE_TOKENS: readonly MotionToken[] = [
  { name: 'rule-width', cssVar: '--rule-width', usage: 'Soulignement, bord superieur de carte' },
  { name: 'rule-width-strong', cssVar: '--rule-width-strong', usage: 'Bord d encadre de mise en valeur' },
] as const;

/** Amplitudes de mouvement. Elles reprennent l echelle d espacement. */
export const SHIFT_TOKENS: readonly MotionToken[] = [
  { name: 'shift-reveal', cssVar: '--shift-reveal', usage: 'Translation d entree de l entete — spacing-sm' },
  { name: 'shift-lift', cssVar: '--shift-lift', usage: 'Elevation au survol — spacing-3xs' },
] as const;

export const EASING_TOKENS: readonly MotionToken[] = [
  { name: 'out', cssVar: '--ease-out', usage: 'Entree, decompression' },
  { name: 'in-out', cssVar: '--ease-in-out', usage: 'Aller-retour, bascule' },
] as const;

/**
 * ---------------------------------------------------------------------------
 * INVENTAIRE DU MOUVEMENT
 * ---------------------------------------------------------------------------
 *
 * Chaque mouvement du site, avec le jeton qui en fixe la duree, celui qui en
 * fixe la courbe, et ce qui le declenche. La table est ici, et non dans le
 * balisage du guide de style, pour une raison : une enumeration ecrite a la
 * main dans du JSX ne se relit pas, elle se perime. Celle-ci se compare a la
 * feuille compilee.
 *
 * `demo` dit si le guide de style peut MONTRER le mouvement sur place. Trois
 * ne le peuvent pas : une transition de page suppose qu'on change de page, et
 * l'ouverture d'un panneau suppose le panneau, qui vit dans l'entete.
 * ---------------------------------------------------------------------------
 */
export interface MotionEntry {
  /** Ce qui bouge, nomme du point de vue du lecteur. */
  readonly label: string;
  /** Selecteur ou attribut qui porte la regle, tel qu'il est ecrit. */
  readonly target: string;
  /** Proprietes animees. */
  readonly properties: string;
  /** Jeton de duree. */
  readonly duration: string;
  /** Jeton de courbe. */
  readonly easing: string;
  readonly trigger: string;
  /** Le guide de style peut-il le montrer sur place ? */
  readonly demo: boolean;
}

export const MOTION_INVENTORY: readonly MotionEntry[] = [
  {
    label: 'Entree en cascade',
    target: '[data-enter]',
    properties: 'opacite + translation de bloc',
    duration: '--duration-slow',
    easing: '--ease-out',
    trigger: 'ouverture de page',
    demo: true,
  },
  {
    label: 'Entree en cascade, resserree',
    target: '.cascade-tight [data-enter]',
    properties: 'opacite + translation de bloc',
    duration: '--duration-base',
    easing: '--ease-out',
    trigger: 'ouverture d une fiche',
    demo: true,
  },
  {
    label: 'Transition de page',
    target: '::view-transition-old / new (root)',
    properties: 'capture de page',
    duration: '--duration-base',
    easing: '--ease-in-out',
    trigger: 'navigation entre documents',
    demo: false,
  },
  {
    label: 'Entete et pied, persistants',
    target: '::view-transition-* (site-header, site-footer)',
    properties: 'capture nommee',
    duration: '--duration-base',
    easing: '--ease-in-out',
    trigger: 'navigation entre documents',
    demo: false,
  },
  {
    label: 'Ouverture d un panneau',
    target: '.panel-enter',
    properties: 'opacite',
    duration: '--duration-fast',
    easing: '--ease-out',
    trigger: 'selecteur de langue, menu mobile',
    demo: false,
  },
  {
    label: 'Elevation d une carte',
    target: '.project-card, .project-card-compact',
    properties: 'transform, box-shadow, border-color',
    duration: '--duration-base',
    easing: '--ease-out',
    trigger: 'survol et focus',
    demo: true,
  },
  {
    label: 'Retour du bouton d action',
    target: '.button-primary',
    properties: 'transform, box-shadow',
    duration: '--duration-base',
    easing: '--ease-out',
    trigger: 'survol, focus, appui',
    demo: true,
  },
  {
    label: 'Soulignement balaye',
    target: '.link-sweep::after',
    properties: 'transform',
    duration: '--duration-base',
    easing: '--ease-out',
    trigger: 'survol et focus',
    demo: true,
  },
  {
    label: 'Soulignement natif',
    target: '.link-underline, .prose a',
    properties: 'color, text-decoration-color, epaisseur',
    duration: '--duration-fast / --duration-base',
    easing: '--ease-out',
    trigger: 'survol et focus',
    demo: true,
  },
  {
    label: 'Lien d evitement',
    target: '.skip-link',
    properties: 'transform',
    duration: '--duration-fast',
    easing: '--ease-out',
    trigger: 'focus',
    demo: false,
  },
  {
    label: 'Chevron du selecteur',
    target: '.disclosure-mark',
    properties: 'rotate',
    duration: '--duration-fast',
    easing: '--ease-out',
    trigger: 'ouverture du selecteur',
    demo: false,
  },
  {
    label: 'Fond de l entete',
    target: '[data-site-header]',
    properties: 'background-color, border-color',
    duration: '--duration-base',
    easing: '--ease-out',
    trigger: 'defilement',
    demo: false,
  },
  {
    label: 'Bascule clair / sombre',
    target: '[data-mode-changing] *',
    properties: 'couleurs, fill, box-shadow',
    duration: '--duration-base',
    easing: '--ease-in-out',
    trigger: 'bascule de mode',
    demo: true,
  },
] as const;

/** Familles typographiques exposees par le systeme. */
export interface FontToken {
  readonly name: string;
  readonly cssVar: string;
  /** Pile complete, telle que globals.css la declare. */
  readonly family: string;
  readonly role: string;
}

/**
 * AUCUNE POLICE WEB. Les trois roles s'appuient sur les familles du systeme
 * du visiteur : rien n'est telecharge, rien n'est prechargee, et le rendu
 * varie donc d'une machine a l'autre. Ni graisse ni sous-ensemble ne figurent
 * plus ici — il n'y a plus de fichier dont on puisse les affirmer.
 */
export const FONT_TOKENS: readonly FontToken[] = [
  {
    name: 'display',
    cssVar: '--font-display',
    family: "'Iowan Old Style', Georgia, 'Times New Roman', serif",
    role: 'Titres — serif du systeme',
  },
  {
    name: 'body',
    cssVar: '--font-body',
    family: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    role: 'Corps de texte et interface — sans-serif du systeme',
  },
  {
    name: 'mono',
    cssVar: '--font-mono',
    family: "ui-monospace, 'SFMono-Regular', Menlo, 'Cascadia Mono', monospace",
    role: 'Metadonnees, labels, chiffres et notations — monospace du systeme',
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
  { foreground: '--color-ink', background: '--color-accent-soft', label: 'ink sur accent-soft', kind: 'text' },
  { foreground: '--color-ink-muted', background: '--color-accent-soft', label: 'ink-muted sur accent-soft', kind: 'text' },
  { foreground: '--color-accent-vivid-contrast', background: '--color-accent-vivid', label: 'accent-vivid-contrast sur accent-vivid', kind: 'text' },
  { foreground: '--color-accent-vivid', background: '--color-paper', label: 'accent-vivid sur paper (non textuel)', kind: 'line' },
  { foreground: '--color-accent-vivid', background: '--color-surface', label: 'accent-vivid sur surface (non textuel)', kind: 'line' },
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
