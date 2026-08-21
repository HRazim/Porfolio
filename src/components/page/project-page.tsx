/**
 * Ce composant sert LES QUATRE LANGUES. Il n'en choisit aucune : la langue
 * arrive par la propriete `locale`, et les quatre fichiers de route qui
 * l'appellent — un par langue — sont les seuls a la declarer.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectGallery } from '@/components/project/project-gallery';
import { ProjectStar } from '@/components/project/project-star';
import { ExternalLink } from '@/components/ui/external-link';
import { ArrowIcon, PROJECT_LINK_ICONS } from '@/components/ui/icons';
import { formatPeriod, periodDateTime } from '@/content/period';
import {
  CATEGORY_LABELS,
  getAdjacentProjects,
  getProjectBySlug,
} from '@/content/projects';
import { pathFor, type Locale } from '@/content/i18n';
import { COMMON, MAIN_CONTENT_ID, PAGE_META, PROJECT_DETAIL } from '@/content/site-copy';
import { pageMetadata } from '@/lib/page-metadata';


export interface ProjectPageProps {
  readonly locale: Locale;
  readonly slug: string;
}

/**
 * Metadonnees d'une fiche.
 *
 * La vignette est redonnee explicitement : la fiche declare un bloc
 * `openGraph`, qui remplace celui herite — image comprise.
 */
export function projectMetadata(locale: Locale, slug: string): Metadata {
  const project = getProjectBySlug(slug);
  if (project === undefined) {
    return {
      title: PAGE_META.notFound.title[locale],
      description: PAGE_META.notFound.description[locale],
    };
  }
  return pageMetadata({
    locale,
    page: 'project',
    slug: project.slug,
    title: project.title[locale],
    description: project.tagline[locale],
    type: 'article',
  });
}

export function ProjectPage({ locale, slug }: ProjectPageProps) {
  const project = getProjectBySlug(slug);

  // `dynamicParams = false` sur chaque route : aucun identifiant inconnu
  // n'arrive jusqu'ici. La garde reste, parce qu'un type ne se devine pas.
  if (project === undefined) notFound();

  const { previous, next } = getAdjacentProjects(project.slug);
  const period = formatPeriod(project.period, locale);
  const dateTime = periodDateTime(project.period);

  // Une section n’est rendue que si elle a quelque chose a montrer. Une
  // realisation non technique n’affiche pas de titre « Technologies » suivi
  // du vide, et une realisation sans cadre distinct n’affiche pas
  // « Contexte » suivi de rien.
  const hasContext = project.context !== null;
  const hasTechnologies = project.technologies.length > 0;
  const hasFeatures = project.features[locale].length > 0;
  const hasVisuals = project.visuals.length > 0;
  const hasLinks = project.links.length > 0;
  const hasPresentation = hasContext || hasTechnologies || hasFeatures;

  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{PROJECT_DETAIL.eyebrow[locale]}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{project.title[locale]}</h1>
          <Prose size="lead" className="mt-lg">
            <p>{project.tagline[locale]}</p>
          </Prose>

          <dl className="mt-2xl flex flex-wrap gap-x-2xl gap-y-md">
            <div className="flex flex-col gap-3xs">
              <dt className="font-mono text-body-sm text-ink-subtle">
                {PROJECT_DETAIL.categoryHeading[locale]}
              </dt>
              <dd className="text-body-md text-ink">{CATEGORY_LABELS[project.category][locale]}</dd>
            </div>
            <div className="flex flex-col gap-3xs">
              <dt className="font-mono text-body-sm text-ink-subtle">
                {PROJECT_DETAIL.periodHeading[locale]}
              </dt>
              <dd className="text-body-md text-ink">
                {period === null ? (
                  COMMON.toBeSpecified[locale]
                ) : dateTime === null ? (
                  // Periode non datee : un <time> sans date valide n'aurait
                  // aucun sens, on rend du texte brut.
                  period
                ) : (
                  <time dateTime={dateTime}>{period}</time>
                )}
              </dd>
            </div>
            <div className="flex max-w-measure flex-col gap-3xs">
              <dt className="font-mono text-body-sm text-ink-subtle">
                {PROJECT_DETAIL.roleHeading[locale]}
              </dt>
              <dd className="text-body-md text-ink">
                {project.role[locale]}
                {project.roleDetail === null ? null : (
                  <span className="mt-3xs block text-body-sm text-ink-muted">
                    {project.roleDetail[locale]}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      {hasPresentation ? (
        <Section background="surface">
          <Container>
            {hasContext ? (
              <>
                <h2 id="contexte" className="section-rule text-display-sm text-ink">
                  {PROJECT_DETAIL.contextHeading[locale]}
                </h2>
                <Prose className="mt-md">
                  <p>{project.context[locale]}</p>
                </Prose>
              </>
            ) : null}

            {hasTechnologies ? (
              <>
                <h2 className={`${hasContext ? 'mt-2xl' : ''} section-rule text-display-sm text-ink`}>
                  {PROJECT_DETAIL.technologiesHeading[locale]}
                </h2>
                <ul className="mt-md flex list-none flex-wrap gap-2xs p-0">
                  {project.technologies.map((technology) => (
                    <li key={technology} className="accent-chip px-sm py-2xs font-mono text-body-sm">
                      {technology}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {hasFeatures ? (
              <>
                <h2
                  className={`${hasContext || hasTechnologies ? 'mt-2xl' : ''} section-rule text-display-sm text-ink`}
                >
                  {PROJECT_DETAIL.featuresHeading[locale]}
                </h2>
                <ul className="mt-md flex max-w-measure list-disc flex-col gap-2xs pl-md text-body-md text-ink-muted">
                  {project.features[locale].map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </Container>
        </Section>
      ) : null}

      <Section background="paper" labelledBy="deroule">
        <Container>
          <h2 id="deroule" className="section-rule text-display-sm text-ink">
            {PROJECT_DETAIL.starHeading[locale]}
          </h2>
          <div className="mt-xl">
            <ProjectStar locale={locale} star={project.star} />
          </div>

          {project.outOfScope === null ? null : (
            <>
              <h2 className="section-rule mt-2xl text-display-sm text-ink">{PROJECT_DETAIL.scopeHeading[locale]}</h2>
              {/* Encadre de mise en valeur : aplat en accent doux, bord en
                  accent vif. Le texte reste en encre secondaire, qui atteint
                  5,03:1 sur cet aplat — l accent lisible n y est pas admis. */}
              <Prose className="accent-panel mt-md p-md">
                <p>{project.outOfScope[locale]}</p>
              </Prose>
            </>
          )}
        </Container>
      </Section>

      <Section background="surface" labelledBy="enseignements">
        <Container>
          <h2 id="enseignements" className="section-rule text-display-sm text-ink">
            {PROJECT_DETAIL.learningsHeading[locale]}
          </h2>
          {project.learnings[locale].length === 0 ? (
            /* EN ATTENTE DE REDACTION pour les realisations academiques :
               aucun enseignement n’est consigne dans le site precedent. */
            <Prose className="mt-md">
              <p>{PROJECT_DETAIL.learningsEmpty[locale]}</p>
            </Prose>
          ) : (
            <ul className="mt-md flex max-w-measure list-disc flex-col gap-md pl-md text-body-md text-ink-muted">
              {project.learnings[locale].map((learning) => (
                <li key={learning}>{learning}</li>
              ))}
            </ul>
          )}

          {hasVisuals ? (
            <>
              <h2 className="section-rule mt-2xl text-display-sm text-ink">{PROJECT_DETAIL.visualsHeading[locale]}</h2>
              <ProjectGallery locale={locale} visuals={project.visuals} />
            </>
          ) : null}

          {hasLinks ? (
            <>
              <h2 className="section-rule mt-2xl text-display-sm text-ink">{PROJECT_DETAIL.linksHeading[locale]}</h2>
              <ul className="mt-md flex list-none flex-col gap-2xs p-0">
                {project.links.map((link) => {
                  // Le pictogramme est choisi par table, jamais par un
                  // branchement sur une chaine a l’interieur du JSX.
                  const LinkIcon = PROJECT_LINK_ICONS[link.kind];
                  return (
                    <li key={link.href} className="flex items-center gap-2xs">
                      <LinkIcon size="sm" className="text-ink-subtle" />
                      <ExternalLink locale={locale} href={link.href}>{link.label[locale]}</ExternalLink>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
        </Container>
      </Section>

      <Section background="paper" spacing="compact">
        <Container>
          <nav aria-label={PROJECT_DETAIL.navigationLabel[locale]}>
            <ul className="flex list-none flex-col gap-md p-0 sm:flex-row sm:justify-between">
              <li>
                {previous === null ? null : (
                  <Link
                    href={pathFor('project', locale, previous.slug)}
                    className="flex flex-col gap-3xs text-ink link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
                  >
                    <span className="font-mono text-body-sm text-ink-subtle">
                      {PROJECT_DETAIL.previousLabel[locale]}
                    </span>
                    <span className="text-body-md">{previous.title[locale]}</span>
                  </Link>
                )}
              </li>
              <li>
                <Link
                  href={pathFor('projects', locale)}
                  className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
                >
                  {PROJECT_DETAIL.backToIndex[locale]}
                  <ArrowIcon size="sm" />
                </Link>
              </li>
              <li>
                {next === null ? null : (
                  <Link
                    href={pathFor('project', locale, next.slug)}
                    className="flex flex-col gap-3xs text-ink link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent sm:text-right"
                  >
                    <span className="font-mono text-body-sm text-ink-subtle">
                      {PROJECT_DETAIL.nextLabel[locale]}
                    </span>
                    <span className="text-body-md">{next.title[locale]}</span>
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
