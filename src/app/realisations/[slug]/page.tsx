import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectStar } from '@/components/project/project-star';
import { ExternalLink } from '@/components/ui/external-link';
import { ArrowIcon } from '@/components/ui/icons';
import { formatPeriod, periodDateTime } from '@/content/period';
import {
  CATEGORY_LABELS,
  getAdjacentProjects,
  getProjectBySlug,
  getProjectSlugs,
} from '@/content/projects';
import { COMMON, MAIN_CONTENT_ID, PAGE_META, PROJECT_DETAIL } from '@/content/site-copy';
import { pageTitle, SITE_URL } from '@/lib/site';

interface ProjectPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

/**
 * Une route statique par realisation, alimentee par le schema de contenu.
 * Le nombre de routes produites est donc, par construction, egal au nombre
 * d’entrees du tableau de donnees.
 */
export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

/** Aucune route hors de celles generees : rien n’est rendu a la demande. */
export const dynamicParams = false;

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (project === undefined) {
    return { title: PAGE_META.notFound.title, description: PAGE_META.notFound.description };
  }

  const canonical = `/realisations/${project.slug}`;

  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: pageTitle(project.title),
      description: project.tagline,
      url: `${SITE_URL}${canonical}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle(project.title),
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (project === undefined) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);
  const period = formatPeriod(project.period);
  const dateTime = periodDateTime(project.period);

  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{PROJECT_DETAIL.eyebrow}</p>
          <h1 className="mt-sm text-display-lg text-ink">{project.title}</h1>
          <Prose size="lead" className="mt-lg">
            <p>{project.tagline}</p>
          </Prose>

          <dl className="mt-2xl flex flex-wrap gap-x-2xl gap-y-md">
            <div className="flex flex-col gap-3xs">
              <dt className="font-mono text-body-sm text-ink-subtle">
                {PROJECT_DETAIL.categoryHeading}
              </dt>
              <dd className="text-body-md text-ink">{CATEGORY_LABELS[project.category]}</dd>
            </div>
            <div className="flex flex-col gap-3xs">
              <dt className="font-mono text-body-sm text-ink-subtle">
                {PROJECT_DETAIL.periodHeading}
              </dt>
              <dd className="text-body-md text-ink">
                {period === null ? (
                  COMMON.toBeSpecified
                ) : (
                  <time dateTime={dateTime ?? undefined}>{period}</time>
                )}
              </dd>
            </div>
            <div className="flex flex-col gap-3xs">
              <dt className="font-mono text-body-sm text-ink-subtle">
                {PROJECT_DETAIL.roleHeading}
              </dt>
              <dd className="text-body-md text-ink">{project.role}</dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section background="surface" labelledBy="contexte">
        <Container>
          <h2 id="contexte" className="text-display-sm text-ink">
            {PROJECT_DETAIL.contextHeading}
          </h2>
          <Prose className="mt-md">
            <p>{project.context}</p>
          </Prose>

          <h2 className="mt-3xl text-display-sm text-ink">
            {PROJECT_DETAIL.technologiesHeading}
          </h2>
          <ul className="mt-md flex list-none flex-wrap gap-2xs p-0">
            {project.technologies.map((technology) => (
              <li
                key={technology}
                className="rounded-sm border border-border bg-paper px-sm py-2xs font-mono text-body-sm text-ink-muted"
              >
                {technology}
              </li>
            ))}
          </ul>

          <h2 className="mt-3xl text-display-sm text-ink">{PROJECT_DETAIL.featuresHeading}</h2>
          <ul className="mt-md flex max-w-measure list-disc flex-col gap-2xs pl-md text-body-md text-ink-muted">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section background="paper" labelledBy="deroule">
        <Container>
          <h2 id="deroule" className="text-display-sm text-ink">
            {PROJECT_DETAIL.starHeading}
          </h2>
          <div className="mt-xl">
            <ProjectStar star={project.star} />
          </div>
        </Container>
      </Section>

      <Section background="surface" labelledBy="enseignements">
        <Container>
          <h2 id="enseignements" className="text-display-sm text-ink">
            {PROJECT_DETAIL.learningsHeading}
          </h2>
          {project.learnings.length === 0 ? (
            /* EN ATTENTE DE REDACTION — aucun enseignement n’est consigne
               dans le site precedent (AUDIT.md section 9). */
            <Prose className="mt-md">
              <p>{PROJECT_DETAIL.learningsEmpty}</p>
            </Prose>
          ) : (
            <ul className="mt-md flex max-w-measure list-disc flex-col gap-2xs pl-md text-body-md text-ink-muted">
              {project.learnings.map((learning) => (
                <li key={learning}>{learning}</li>
              ))}
            </ul>
          )}

          <h2 className="mt-3xl text-display-sm text-ink">{PROJECT_DETAIL.visualsHeading}</h2>
          {/* Les fichiers ne sont pas encore places sous public/ : seule la
              declaration existe. L’encodage fait l’objet d’un prompt dedie. */}
          <Prose className="mt-md">
            <p>{PROJECT_DETAIL.visualsPending}</p>
          </Prose>
          <ul className="mt-md flex list-none flex-col gap-2xs p-0">
            {project.visuals.map((visual) => (
              <li key={visual.src} className="font-mono text-body-sm text-ink-subtle">
                {visual.caption}
              </li>
            ))}
          </ul>

          {project.links.length === 0 ? null : (
            <>
              <h2 className="mt-3xl text-display-sm text-ink">{PROJECT_DETAIL.linksHeading}</h2>
              <ul className="mt-md flex list-none flex-col gap-2xs p-0">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <ExternalLink href={link.href}>{link.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Container>
      </Section>

      <Section background="paper" spacing="compact">
        <Container>
          <nav aria-label={PROJECT_DETAIL.navigationLabel}>
            <ul className="flex list-none flex-col gap-md p-0 sm:flex-row sm:justify-between">
              <li>
                {previous === null ? null : (
                  <Link
                    href={`/realisations/${previous.slug}`}
                    className="flex flex-col gap-3xs text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
                  >
                    <span className="font-mono text-body-sm text-ink-subtle">
                      {PROJECT_DETAIL.previousLabel}
                    </span>
                    <span className="text-body-md">{previous.title}</span>
                  </Link>
                )}
              </li>
              <li>
                <Link
                  href="/realisations"
                  className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent underline decoration-from-font underline-offset-2 transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
                >
                  {PROJECT_DETAIL.backToIndex}
                  <ArrowIcon size="sm" />
                </Link>
              </li>
              <li>
                {next === null ? null : (
                  <Link
                    href={`/realisations/${next.slug}`}
                    className="flex flex-col gap-3xs text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent sm:text-right"
                  >
                    <span className="font-mono text-body-sm text-ink-subtle">
                      {PROJECT_DETAIL.nextLabel}
                    </span>
                    <span className="text-body-md">{next.title}</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </Container>
      </Section>
    </main>
  );
}
