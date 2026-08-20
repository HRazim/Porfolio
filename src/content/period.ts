/**
 * Periode datee, partagee par les realisations et le parcours.
 *
 * Union discriminee plutot qu’un champ optionnel : le modele doit pouvoir
 * exprimer « la date n’est pas encore connue » sans inventer de valeur, et
 * distinguer ce cas d’un projet actif dont on ignore la date de debut.
 */

/** Annee seule, format AAAA. */
export type Year = `${number}`;

/** Annee-mois, format AAAA-MM. */
export type YearMonth = `${number}-${number}`;

/** Date complete, format AAAA-MM-JJ. */
export type YearMonthDay = `${number}-${number}-${number}`;

/**
 * Borne de periode.
 *
 * La granularite est celle de la donnee disponible, jamais plus fine : une
 * formation annoncee « 2026-2028 » se note en annees, un stage « du 14 avril
 * au 20 juin 2025 » se note au jour. Preciser un mois inconnu serait inventer.
 */
export type DatePoint = Year | YearMonth | YearMonthDay;

/**
 * Trois etats, et non deux :
 *   `connue`      la periode est datee, avec la granularite disponible ;
 *   `en-cours`    le travail est actif, sa date de debut n’est pas etablie —
 *                 c’est une information, pas une absence d’information ;
 *   `a-preciser`  rien n’est etabli.
 */
export type Period =
  | {
      readonly kind: 'connue';
      readonly start: DatePoint;
      readonly end: DatePoint | 'en-cours';
    }
  | { readonly kind: 'en-cours' }
  | { readonly kind: 'a-preciser' };

const MONTHS: readonly string[] = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

/** Libelle d’un travail actif, quelle que soit sa forme. */
const ONGOING = 'en cours';
const ONGOING_CAPITALISED = 'En cours';

/** Libelle affiche pour une borne de periode. */
function formatBound(value: DatePoint): string {
  const [year, month, day] = value.split('-');
  if (month === undefined) return String(year);
  const monthName = MONTHS[Number(month) - 1];
  if (monthName === undefined) return String(year);
  if (day === undefined) return `${monthName} ${year}`;
  return `${Number(day)} ${monthName} ${year}`;
}

/**
 * Libelle lisible d’une periode.
 * Retourne `null` uniquement lorsque rien n’est etabli, afin que l’appelant
 * decide quoi afficher plutot que de recevoir un texte invente.
 */
export function formatPeriod(period: Period): string | null {
  if (period.kind === 'a-preciser') return null;
  if (period.kind === 'en-cours') return ONGOING_CAPITALISED;

  const start = formatBound(period.start);
  const end = period.end === 'en-cours' ? ONGOING : formatBound(period.end);
  if (start === end) return start;

  // Deux bornes dans le meme mois : « 14 au 20 juin 2025 » plutot que la
  // repetition du mois et de l’annee.
  const startParts = period.start.split('-');
  const endParts = typeof period.end === 'string' && period.end !== 'en-cours' ? period.end.split('-') : [];
  const sameMonth =
    startParts.length === 3 &&
    endParts.length === 3 &&
    startParts[0] === endParts[0] &&
    startParts[1] === endParts[1];
  if (sameMonth) return `${Number(startParts[2])} — ${end}`;

  return `${start} — ${end}`;
}

/**
 * Libelle ANNUEL d’une periode, pour les surfaces contraintes.
 *
 * La vignette compacte de l’accueil dispose d’environ trente-quatre caracteres
 * monospace par ligne. « 14 avril 2025 — 20 juin 2025 » en occupe vingt-huit a
 * lui seul et repousse la categorie sur une seconde ligne. On retombe donc a
 * l’annee : « 2025 ». Ce n’est pas une troncature arbitraire, c’est la
 * granularite qu’une vignette peut porter — la date exacte reste sur la fiche
 * et dans l’index, ou la place ne manque pas.
 *
 * Meme contrat de retour que `formatPeriod` : `null` quand rien n’est etabli.
 */
export function formatPeriodYears(period: Period): string | null {
  if (period.kind === 'a-preciser') return null;
  if (period.kind === 'en-cours') return ONGOING_CAPITALISED;

  const startYear = period.start.split('-')[0];
  const endYear = period.end === 'en-cours' ? ONGOING : period.end.split('-')[0];
  if (startYear === endYear) return String(startYear);
  return `${startYear} — ${endYear}`;
}

/**
 * Valeur `dateTime` pour un element `<time>`.
 * `null` lorsque la periode n’est pas datee : l’appelant doit alors rendre du
 * texte brut, un `<time>` sans date valide n’ayant aucun sens.
 */
export function periodDateTime(period: Period): string | null {
  if (period.kind !== 'connue') return null;
  return period.start;
}
