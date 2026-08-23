/**
 * Periode datee, partagee par les realisations et le parcours.
 *
 * Union discriminee plutot qu’un champ optionnel : le modele doit pouvoir
 * exprimer « la date n’est pas encore connue » sans inventer de valeur, et
 * distinguer ce cas d’un projet actif dont on ignore la date de debut.
 *
 * ---------------------------------------------------------------------------
 * UNE DATE NE SE TRADUIT PAS, ELLE SE RECOMPOSE
 * ---------------------------------------------------------------------------
 *
 * Les quatre langues ne rangent pas les elements d’une date de la meme facon,
 * et deux d’entre elles insèrent des mots :
 *
 *   fr   14 avril 2025        avril 2025
 *   en   14 April 2025        April 2025
 *   es   14 de abril de 2025  abril de 2025      <- deux « de »
 *   ar   14 أبريل 2025         أبريل 2025
 *
 * D’ou un gabarit par langue plutot qu’une simple table de noms de mois : une
 * traduction mot a mot produirait « 14 abril 2025 », que personne n’ecrit.
 *
 * CHIFFRES OCCIDENTAUX EN ARABE. Les chiffres indo-arabes (٠١٢٣) sont corrects
 * mais loin d’etre universels : l’arabe standard moderne s’ecrit couramment
 * avec 0-9, notamment au Maghreb. On garde donc les memes chiffres partout,
 * ce qui rend une date lisible meme par un visiteur qui ne lit pas l’arabe.
 */

import type { Locale, Translated } from './i18n';

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

/**
 * Noms de mois, dans les quatre langues.
 *
 * L’arabe emploie les formes translitterees (يناير، فبراير…), comprises dans
 * tout le monde arabophone, plutot que les formes levantines (كانون الثاني…)
 * qui ne le sont que regionalement.
 */
const MONTHS: Readonly<Record<Locale, readonly string[]>> = {
  fr: [
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
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  es: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ],
  ar: [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
};

/** Libelle d’un travail actif, quelle que soit sa forme. */
const ONGOING: Translated = {
  fr: 'en cours',
  en: 'ongoing',
  es: 'en curso',
  ar: 'جارٍ',
};

const ONGOING_CAPITALISED: Translated = {
  fr: 'En cours',
  en: 'Ongoing',
  es: 'En curso',
  ar: 'جارٍ',
};

/** Separateur de bornes, identique dans les quatre langues. */
const RANGE_SEPARATOR = '—';

/**
 * Gabarits de date, par langue.
 * L’espagnol est la seule langue a inserer des mots entre les elements.
 */
function monthYear(monthName: string, year: string, locale: Locale): string {
  return locale === 'es' ? `${monthName} de ${year}` : `${monthName} ${year}`;
}

function dayMonthYear(day: number, monthName: string, year: string, locale: Locale): string {
  return locale === 'es'
    ? `${day} de ${monthName} de ${year}`
    : `${day} ${monthName} ${year}`;
}

/** Libelle affiche pour une borne de periode. */
function formatBound(value: DatePoint, locale: Locale): string {
  const [year, month, day] = value.split('-');
  if (month === undefined) return String(year);
  const monthName = MONTHS[locale][Number(month) - 1];
  if (monthName === undefined) return String(year);
  if (day === undefined) return monthYear(monthName, String(year), locale);
  return dayMonthYear(Number(day), monthName, String(year), locale);
}

/**
 * Libelle lisible d’une periode.
 * Retourne `null` uniquement lorsque rien n’est etabli, afin que l’appelant
 * decide quoi afficher plutot que de recevoir un texte invente.
 */
export function formatPeriod(period: Period, locale: Locale): string | null {
  if (period.kind === 'a-preciser') return null;
  if (period.kind === 'en-cours') return ONGOING_CAPITALISED[locale];

  const start = formatBound(period.start, locale);
  const end = period.end === 'en-cours' ? ONGOING[locale] : formatBound(period.end, locale);
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
  if (sameMonth) return `${Number(startParts[2])} ${RANGE_SEPARATOR} ${end}`;

  return `${start} ${RANGE_SEPARATOR} ${end}`;
}

/**
 * Libelle d’une DATE ISOLEE, hors de toute periode.
 *
 * Une date d’obtention ou de fin de validite n’est pas une periode : elle n’a
 * ni debut ni fin, elle est un point. Elle se compose pourtant exactement
 * comme une borne — meme gabarit par langue, memes noms de mois, memes
 * chiffres occidentaux en arabe — et il n’y avait aucune raison d’en ecrire
 * une seconde mecanique a cote de celle-ci.
 *
 * `formatBound` restait interne : cette fonction l’expose sous le nom qui dit
 * ce qu’elle sert, sans dupliquer une ligne.
 */
export function formatDate(value: DatePoint, locale: Locale): string {
  return formatBound(value, locale);
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
export function formatPeriodYears(period: Period, locale: Locale): string | null {
  if (period.kind === 'a-preciser') return null;
  if (period.kind === 'en-cours') return ONGOING_CAPITALISED[locale];

  const startYear = period.start.split('-')[0];
  const endYear = period.end === 'en-cours' ? ONGOING[locale] : period.end.split('-')[0];
  if (startYear === endYear) return String(startYear);
  return `${startYear} ${RANGE_SEPARATOR} ${endYear}`;
}

/**
 * Valeur `dateTime` pour un element `<time>`.
 * `null` lorsque la periode n’est pas datee : l’appelant doit alors rendre du
 * texte brut, un `<time>` sans date valide n’ayant aucun sens.
 *
 * Elle ne depend d’AUCUNE langue : `2025-04-14` est une date au format ISO
 * 8601, lue par une machine, jamais par un humain.
 */
export function periodDateTime(period: Period): string | null {
  if (period.kind !== 'connue') return null;
  return period.start;
}
