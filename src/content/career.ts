/**
 * ---------------------------------------------------------------------------
 * SCHEMA DE CONTENU — PARCOURS
 * ---------------------------------------------------------------------------
 *
 * Formation, experiences et langues, en donnees typees. La page /parcours
 * n’ecrit aucun libelle a la main : elle rend ce fichier.
 *
 * REGLE DE REMPLISSAGE
 * Un champ non documente vaut `null`. Aucune ville n’est deduite d’un nom
 * d’etablissement, aucun mois n’est ajoute a une annee. La granularite des
 * periodes est exactement celle de la donnee disponible.
 *
 * Convention typographique francaise : voir l’entete de projects.ts.
 * ---------------------------------------------------------------------------
 */

import type { Period } from './period';

export type CareerKind = 'formation' | 'experience';

export interface CareerEntry {
  /** Identifiant stable, en kebab-case. Sert de cle de rendu. */
  readonly id: string;
  readonly kind: CareerKind;
  /** Intitule du diplome ou du poste. */
  readonly title: string;
  /** Etablissement ou employeur. `null` tant que la donnee n’est pas etablie. */
  readonly organisation: string | null;
  /** Ville. `null` lorsqu’elle n’est pas documentee separement. */
  readonly location: string | null;
  readonly period: Period;
  /** Resume en une a deux phrases. `null` tant que la redaction n’a pas eu lieu. */
  readonly summary: string | null;
  /** Points saillants. Tableau vide plutot que champ optionnel. */
  readonly highlights: readonly string[];
}

/**
 * Entrees de parcours, les plus recentes en premier a l’interieur de chaque
 * nature.
 */
const CAREER_ENTRIES: readonly CareerEntry[] = [
  {
    id: 'master-ingenierie-affaires',
    kind: 'formation',
    title: 'Master Ingénierie d’Affaires',
    organisation: 'Paris School of Business',
    location: null,
    period: { kind: 'connue', start: '2026', end: '2028' },
    summary: null,
    highlights: ['En alternance : quatre jours en entreprise, un jour en formation'],
  },
  {
    id: 'but-informatique',
    kind: 'formation',
    title: 'BUT Informatique, double diplôme',
    organisation: 'IUT de Vélizy-Villacoublay — Université Paris-Saclay',
    location: null,
    period: { kind: 'connue', start: '2023', end: '2026' },
    summary: null,
    // L’annee au Quebec est une composante du double diplome, pas une
    // formation distincte : elle est donc rattachee a cette entree.
    highlights: [
      'Année à l’Université du Québec à Chicoutimi en 2025-2026, au titre du double diplôme',
    ],
  },
  {
    id: 'baccalaureat-sti2d',
    kind: 'formation',
    title: 'Baccalauréat STI2D',
    organisation: 'Lycée Saint-François d’Assise',
    location: 'Montigny-le-Bretonneux',
    period: { kind: 'connue', start: '2020', end: '2023' },
    summary: null,
    highlights: ['Mention Bien'],
  },
  {
    id: 'egis-developpeur',
    kind: 'experience',
    title: 'Développeur informatique, stage',
    organisation: 'Egis',
    location: 'Guyancourt',
    period: { kind: 'connue', start: '2025-04-14', end: '2025-06-20' },
    summary: null,
    highlights: [],
  },
  {
    id: 'forum-orientation-trappes',
    kind: 'experience',
    title: 'Intervenant',
    organisation: 'Forum de l’orientation',
    location: 'Trappes',
    period: { kind: 'connue', start: '2025-02', end: '2025-02' },
    summary: null,
    highlights: [],
  },
];

/**
 * Niveau de maitrise linguistique.
 * `langue-maternelle` n’est pas un niveau du cadre europeen : il est distingue
 * pour cette raison.
 */
export type LanguageLevel = 'langue-maternelle' | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';

export const LANGUAGE_LEVEL_LABELS: Readonly<Record<LanguageLevel, string>> = {
  'langue-maternelle': 'Langue maternelle',
  C2: 'C2',
  C1: 'C1',
  B2: 'B2',
  B1: 'B1',
  A2: 'A2',
  A1: 'A1',
};

export interface LanguageSkill {
  /** Identifiant stable, en kebab-case. */
  readonly id: string;
  readonly name: string;
  /**
   * Niveau du cadre europeen. `null` lorsqu’un score certifie le remplace :
   * un chiffre verifiable vaut mieux qu’une auto-evaluation posee a cote.
   */
  readonly level: LanguageLevel | null;
  /** Certification obtenue. `null` en l’absence de certification documentee. */
  readonly certification: string | null;
}

const LANGUAGES: readonly LanguageSkill[] = [
  {
    id: 'francais',
    name: 'Français',
    level: 'langue-maternelle',
    certification: null,
  },
  {
    id: 'anglais',
    name: 'Anglais',
    // Le score se suffit : une equivalence CECRL posee a cote serait une
    // interpretation de ma part, la que le chiffre est verifiable.
    level: null,
    certification: 'TOEIC 870',
  },
  {
    id: 'espagnol',
    name: 'Espagnol',
    level: 'B2',
    certification: null,
  },
  {
    id: 'arabe',
    name: 'Arabe',
    level: 'B1',
    certification: null,
  },
];

/** Les entrees d’une nature donnee, les plus recentes d’abord. */
export function getCareerEntriesByKind(kind: CareerKind): readonly CareerEntry[] {
  return CAREER_ENTRIES.filter((entry) => entry.kind === kind);
}

/** Les langues maitrisees, dans l’ordre de declaration. */
export function getLanguages(): readonly LanguageSkill[] {
  return LANGUAGES;
}

/**
 * Lecture marquante.
 *
 * `takeaway` n’est pas un resume du livre : c’est ce que la lecture a change
 * dans la facon de travailler. Un resume se trouve partout ailleurs.
 */
export interface Reading {
  /** Identifiant stable, en kebab-case. */
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly takeaway: string;
}

const READINGS: readonly Reading[] = [
  {
    id: 'lois-nature-humaine',
    title: 'Les lois de la nature humaine',
    author: 'Robert Greene',
    takeaway:
      'Écouter ce qui n’est pas dit. En entretien comme en négociation, l’information utile est rarement celle qu’on vous donne.',
  },
  {
    id: 'psychologie-argent',
    title: 'La psychologie de l’argent',
    author: 'Morgan Housel',
    takeaway:
      'Les décisions financières sont d’abord des décisions humaines. Comprendre le comportement avant les chiffres.',
  },
  {
    id: 'outlive',
    title: 'Outlive',
    author: 'Peter Attia',
    takeaway:
      'Raisonner en horizon long plutôt qu’en résultat immédiat, et l’appliquer ailleurs qu’à la santé.',
  },
  {
    id: 'notre-derniere-invention',
    title: 'Notre dernière invention',
    author: 'James Barrat',
    takeaway:
      'S’intéresser à ce qu’une technologie rend possible avant de s’enthousiasmer pour ce qu’elle fait déjà.',
  },
];

/** Les lectures marquantes, dans l’ordre de declaration. */
export function getReadings(): readonly Reading[] {
  return READINGS;
}

/**
 * Qualification affichee pour une langue : niveau, certification, ou les
 * deux. La composition vit ici et non dans le composant, celui-ci ne
 * redigeant rien.
 */
export function formatLanguageQualification(language: LanguageSkill): string {
  const parts: string[] = [];
  if (language.level !== null) parts.push(LANGUAGE_LEVEL_LABELS[language.level]);
  if (language.certification !== null) parts.push(language.certification);
  return parts.join(' — ');
}
