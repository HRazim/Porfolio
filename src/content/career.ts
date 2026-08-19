/**
 * ---------------------------------------------------------------------------
 * SCHEMA DE CONTENU — PARCOURS
 * ---------------------------------------------------------------------------
 *
 * Formation et experiences, en donnees typees. La page /parcours n’ecrit
 * aucun libelle a la main : elle rend ce fichier.
 *
 * ETAT DES DONNEES
 * Le site precedent ne documente le parcours que par une seule mention,
 * l’accroche « Développeur Web | Designer | Étudiant en BUT informatique »
 * (AUDIT.md section 9.1, index.html:40). Ni etablissement, ni dates, ni
 * experience n’y figurent.
 *
 * Rien n’est donc invente ici : l’unique entree de formation ne porte que
 * ce qui est verifiable, et les champs inconnus valent `null`. Les
 * experiences restent vides. La passe editoriale completera l’ensemble.
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
  readonly location: string | null;
  readonly period: Period;
  /** Resume en une a deux phrases. `null` tant que la redaction n’a pas eu lieu. */
  readonly summary: string | null;
  /** Points saillants. Tableau vide plutot que champ optionnel. */
  readonly highlights: readonly string[];
}

const CAREER_ENTRIES: readonly CareerEntry[] = [
  {
    id: 'but-informatique',
    kind: 'formation',
    title: 'BUT Informatique',
    organisation: null,
    location: null,
    period: { kind: 'a-preciser' },
    summary: null,
    highlights: [],
  },
];

/** Toutes les entrees, formation et experiences confondues. */
export function getCareerEntries(): readonly CareerEntry[] {
  return CAREER_ENTRIES;
}

/** Les entrees d’une nature donnee, les plus recentes d’abord. */
export function getCareerEntriesByKind(kind: CareerKind): readonly CareerEntry[] {
  return CAREER_ENTRIES.filter((entry) => entry.kind === kind);
}

/** Vrai si aucune entree n’est encore renseignee pour cette nature. */
export function isCareerSectionEmpty(kind: CareerKind): boolean {
  return getCareerEntriesByKind(kind).length === 0;
}
