/**
 * Ce composant sert LES QUATRE LANGUES. Il n'en choisit aucune : la langue
 * arrive par la propriete `locale`, et les quatre fichiers de route qui
 * l'appellent — un par langue — sont les seuls a la declarer.
 */
import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { formatPeriod, periodDateTime } from '@/content/period';
import {
  type CareerEntry,
  type CareerKind,
  formatLanguageQualification,
  getCareerEntriesByKind,
  getLanguages,
} from '@/content/career';
import type { Locale } from '@/content/i18n';
import { CAREER, COMMON, MAIN_CONTENT_ID } from '@/content/site-copy';

interface CareerSectionProps {
  readonly locale: Locale;
  readonly kind: CareerKind;
  readonly headingId: string;
  readonly heading: string;
  readonly emptyMessage: string;
}

/** Liste semantique d’entrees de parcours. Aucun libelle n’est ecrit ici. */
function CareerSection({ locale, kind, headingId, heading, emptyMessage }: CareerSectionProps) {
  const entries: readonly CareerEntry[] = getCareerEntriesByKind(kind);

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-rule text-display-sm text-ink">
        {heading}
      </h2>

      {entries.length === 0 ? (
        <Prose className="mt-md">
          <p>{emptyMessage}</p>
        </Prose>
      ) : (
        <ul className="mt-lg flex list-none flex-col gap-lg p-0">
          {entries.map((entry) => {
            const period = formatPeriod(entry.period, locale);
            const dateTime = periodDateTime(entry.period);

            return (
              <li
                key={entry.id}
                className="flex flex-col gap-2xs rounded-md border border-border bg-paper p-md"
              >
                <p className="font-mono text-body-sm text-ink-subtle">
                  {period === null ? (
                    COMMON.toBeSpecified[locale]
                  ) : (
                    <time dateTime={dateTime ?? undefined}>{period}</time>
                  )}
                </p>
                <h3 className="text-body-xl text-ink">{entry.title[locale]}</h3>
                {entry.organisation === null && entry.location === null ? null : (
                  <p className="font-mono text-body-sm text-ink-subtle">
                    {entry.organisation?.[locale] ?? COMMON.toBeSpecified[locale]}
                    {entry.location === null ? null : ` — ${entry.location[locale]}`}
                  </p>
                )}
                {entry.summary === null ? null : (
                  <p className="max-w-measure text-body-md text-ink-muted">{entry.summary[locale]}</p>
                )}
                {entry.highlights[locale].length === 0 ? null : (
                  <ul className="mt-2xs flex max-w-measure list-disc flex-col gap-3xs ps-md text-body-md text-ink-muted">
                    {entry.highlights[locale].map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Langues, avec leur niveau et, le cas echeant, leur certification. */
function LanguagesSection({ locale }: { readonly locale: Locale }) {
  const languages = getLanguages();

  return (
    <section aria-labelledby="langues">
      <h2 id="langues" className="section-rule text-display-sm text-ink">
        {CAREER.languagesHeading[locale]}
      </h2>

      {languages.length === 0 ? (
        <Prose className="mt-md">
          <p>{CAREER.languagesEmpty[locale]}</p>
        </Prose>
      ) : (
        <ul className="mt-lg flex list-none flex-wrap gap-md p-0">
          {languages.map((language) => (
            <li
              key={language.id}
              className="flex flex-col gap-3xs rounded-md border border-border bg-paper px-md py-sm"
            >
              <span className="text-body-md text-ink">{language.name[locale]}</span>
              <span dir="ltr" className="font-mono text-body-sm text-ink-subtle">
                {formatLanguageQualification(language, locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Parcours : formation, experiences et langues.
 *
 * Les lectures ont rejoint la page « À propos » : elles disent ce qui a
 * change une facon de travailler, pas ce qui a ete valide par un jury. Elles
 * detonnaient entre les diplomes et les niveaux de langue.
 *
 * Les trois listes sont alimentees par src/content/career.ts. Aucune ville
 * n’est deduite d’un nom d’etablissement et aucun mois n’est ajoute a une
 * annee : la granularite affichee est celle de la donnee disponible.
 *
 * Rendu cote serveur, statiquement.
 */
export function CareerPage({ locale }: { readonly locale: Locale }) {
  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{CAREER.eyebrow[locale]}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{CAREER.heading[locale]}</h1>
          <Prose size="lead" className="mt-lg">
            <p>{CAREER.intro[locale]}</p>
          </Prose>
        </Container>
      </Section>

      <Section background="surface">
        <Container>
          <div className="flex flex-col gap-3xl">
            <CareerSection
              locale={locale}
              kind="formation"
              headingId="formation"
              heading={CAREER.formationHeading[locale]}
              emptyMessage={CAREER.formationEmpty[locale]}
            />
            <CareerSection
              locale={locale}
              kind="experience"
              headingId="experiences"
              heading={CAREER.experienceHeading[locale]}
              emptyMessage={CAREER.experienceEmpty[locale]}
            />
            <LanguagesSection locale={locale} />
          </div>
        </Container>
      </Section>
    </main>
  );
}
