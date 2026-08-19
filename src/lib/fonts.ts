import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

/**
 * ---------------------------------------------------------------------------
 * SYSTEME TYPOGRAPHIQUE — TROIS FAMILLES, TROIS ROLES
 * ---------------------------------------------------------------------------
 *
 * Le site precedent n'utilisait qu'Arial, sans aucune police web, et declarait
 * quatre graisses pour deux effectivement rendues (AUDIT.md section 7.3).
 * Tout est reconstruit ici, avec une regle d'or : aucune graisse n'est
 * declaree dans le systeme si elle n'est pas reellement telechargee.
 *
 * Les trois familles exposent chacune une variable CSS `--font-*-face`,
 * consommee par `@theme` dans globals.css pour composer les piles completes
 * `--font-display`, `--font-body` et `--font-mono`.
 *
 * ---------------------------------------------------------------------------
 * REGLE STRUCTURANTE — NOTATIONS MATHEMATIQUES ET SYMBOLES GRECS
 * ---------------------------------------------------------------------------
 *
 * Les notations mathematiques et les symboles grecs — notamment µ (esperance)
 * et λ (parametre de forme) — sont composes en MONOSPACE
 * (`--font-mono` / JetBrains Mono), jamais dans la famille de corps de texte.
 *
 * Deux raisons, l'une technique et l'autre semantique :
 *
 *   1. COUVERTURE DE GLYPHES. AUDIT.md section 7.6 releve que le contenu
 *      existant comporte des notations grecques qu'aucune famille de texte
 *      retenue ne couvre de maniere fiable. Instrument Sans et Instrument
 *      Serif ne chargent que les sous-ensembles `latin` et `latin-ext` : le
 *      caractere λ (U+03BB) n'y figure pas et declencherait une substitution
 *      de police par le navigateur — donc un saut de dessin et de metrique.
 *      JetBrains Mono charge en plus le sous-ensemble `greek`, qui contient
 *      λ. Le rendu est donc garanti, sans fallback.
 *
 *      Nuance a connaitre : µ existe en DEUX points de code distincts.
 *        - µ  U+00B5 SIGNE MICRO      -> present dans le sous-ensemble `latin`
 *        - μ  U+03BC LETTRE GRECQUE MU -> present dans le sous-ensemble `greek`
 *      Charger `greek` couvre les deux cas de figure quelle que soit la
 *      saisie, ce qui n'est pas vrai de `latin` seul.
 *
 *   2. COHERENCE SEMANTIQUE. Le monospace signale au lecteur « ceci est une
 *      notation, une valeur, un identifiant » — et non de la prose. Chiffres,
 *      labels, metadonnees et notations partagent ainsi une meme voix, ce qui
 *      sert directement un positionnement hybride technique / business.
 * ---------------------------------------------------------------------------
 */

/**
 * DISPLAY — titres.
 *
 * Instrument Serif ne possede qu'UNE SEULE graisse (400). C'est un choix
 * assume : la hierarchie des titres se construit par la TAILLE et
 * l'INTERLETTRAGE, jamais par la graisse. Les quatre niveaux `display-*` du
 * systeme declarent donc tous `font-weight: 400`, la seule graisse reellement
 * telechargee.
 *
 * Graisses telechargees : 400 (normal) — une seule.
 * Sous-ensembles        : latin, latin-ext.
 */
export const fontDisplay = Instrument_Serif({
  variable: '--font-display-face',
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
});

/**
 * BODY — corps de texte et interface.
 *
 * Graisses telechargees : 400 (corps), 500 (interface, labels),
 *                         600 (emphase forte).
 * Sous-ensembles        : latin, latin-ext (accents et ligatures francais :
 *                         é è à ç ù ë ï œ æ).
 */
export const fontBody = Instrument_Sans({
  variable: '--font-body-face',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal'],
  display: 'swap',
});

/**
 * MONO — metadonnees, labels, chiffres, notations techniques et grecques.
 *
 * Graisses telechargees : 400 (courant), 500 (emphase).
 * Sous-ensembles        : latin, latin-ext, GREC (obligatoire, cf. regle
 *                         structurante ci-dessus).
 */
export const fontMono = JetBrains_Mono({
  variable: '--font-mono-face',
  subsets: ['latin', 'latin-ext', 'greek'],
  weight: ['400', '500'],
  style: ['normal'],
  display: 'swap',
});

/** Classe a appliquer sur `<html>` pour exposer les trois variables. */
export const fontVariables = [
  fontDisplay.variable,
  fontBody.variable,
  fontMono.variable,
].join(' ');
