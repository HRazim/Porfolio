import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { formatPeriod, periodDateTime } from '@/content/period';
import { type CareerEntry, type CareerKind, getCareerEntriesByKind } from '@/content/career';
import { CAREER, COMMON, MAIN_CONTENT_ID, PAGE_META } from '@/content/site-copy';

export const metadata: Metadata = {
  title: PAGE_META.career.title,
  description: PAGE_META.career.description,
  alternates: { canonical: '/parcours' },
};

interface CareerSectionProps {
  readonly kind: CareerKind;
  readonly headingId: string;
  readonly heading: string;
  readonly emptyMessage: string;
}

/** Liste semantique d’entrees de parcours. Aucun libelle n’est ecrit ici. */
function CareerSection({ kind, headingId, heading, emptyMessage }: CareerSectionProps) {
  const entries: readonly CareerEntry[] = getCareerEntriesByKind(kind);

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-display-sm text-ink">
        {heading}
      </h2>

      {entries.length === 0 ? (
        /* EN ATTENTE DE RENSEIGNEMENT — voir l’entete de src/content/career.ts */
        <Prose className="mt-md">
          <p>{emptyMessage}</p>
        </Prose>
      ) : (
        <ul className="mt-lg flex list-none flex-col gap-lg p-0">
          {entries.map((entry) => {
            const period = formatPeriod(entry.period);
            const dateTime = periodDateTime(entry.period);

            return (
              <li
                key={entry.id}
                className="flex flex-col gap-2xs rounded-md border border-border bg-paper p-md"
              >
                <p className="font-mono text-body-sm text-ink-subtle">
                  {period === null ? (
                    COMMON.toBeSpecified
                  ) : (
                    <time dateTime={dateTime ?? undefined}>{period}</time>
                  )}
                </p>
                <h3 className="text-body-xl text-ink">{entry.title}</h3>
                <p className="font-mono text-body-sm text-ink-subtle">
                  {entry.organisation ?? COMMON.toBeSpecified}
                  {entry.location === null ? null : ` — ${entry.location}`}
                </p>
                {entry.summary === null ? null : (
                  <p className="max-w-measure text-body-md text-ink-muted">{entry.summary}</p>
                )}
                {entry.highlights.length === 0 ? null : (
                  <ul className="mt-2xs flex max-w-measure list-disc flex-col gap-3xs pl-md text-body-md text-ink-muted">
                    {entry.highlights.map((highlight) => (
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

/**
 * Parcours : formation et experiences.
 *
 * Les deux listes sont alimentees par src/content/career.ts. Le site
 * precedent ne documente le parcours que par la mention « Étudiant en BUT
 * informatique » (AUDIT.md section 9.1) : rien d’autre n’a ete ajoute, et
 * rien n’a ete invente.
 *
 * Rendu cote serveur, statiquement.
 */
export default function CareerPage() {
  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{CAREER.eyebrow}</p>
          <h1 className="mt-sm text-display-lg text-ink">{CAREER.heading}</h1>
          {/* EN ATTENTE DE REDACTION — voir CAREER.intro */}
          <Prose size="lead" className="mt-lg">
            <p>{CAREER.intro}</p>
          </Prose>
        </Container>
      </Section>

      <Section background="surface">
        <Container>
          <div className="flex flex-col gap-3xl">
            <CareerSection
              kind="formation"
              headingId="formation"
              heading={CAREER.formationHeading}
              emptyMessage={CAREER.formationEmpty}
            />
            <CareerSection
              kind="experience"
              headingId="experiences"
              heading={CAREER.experienceHeading}
              emptyMessage={CAREER.experienceEmpty}
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
