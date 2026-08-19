/**
 * Periode datee, partagee par les realisations et le parcours.
 *
 * Union discriminee plutot qu’un champ optionnel : le modele doit pouvoir
 * exprimer « la date n’est pas encore connue » sans inventer de valeur.
 * AUDIT.md ne date ni les deux projets, ni la formation.
 */

/** Annee-mois, format AAAA-MM. */
export type YearMonth = `${number}-${number}`;

export type Period =
  | {
      readonly kind: 'connue';
      readonly start: YearMonth;
      readonly end: YearMonth | 'en-cours';
    }
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

/** Libelle affiche pour une borne de periode. */
function formatBound(value: YearMonth): string {
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  const name = MONTHS[index];
  return name === undefined ? String(year) : `${name} ${year}`;
}

/**
 * Libelle lisible d’une periode.
 * Retourne `null` lorsque la periode n’est pas encore documentee, afin que
 * l’appelant decide quoi afficher plutot que de recevoir un texte invente.
 */
export function formatPeriod(period: Period): string | null {
  if (period.kind === 'a-preciser') return null;
  const start = formatBound(period.start);
  const end = period.end === 'en-cours' ? 'en cours' : formatBound(period.end);
  return start === end ? start : `${start} — ${end}`;
}

/** Valeur `dateTime` pour un element `<time>`. `null` si la periode est inconnue. */
export function periodDateTime(period: Period): string | null {
  if (period.kind === 'a-preciser') return null;
  return period.start;
}
