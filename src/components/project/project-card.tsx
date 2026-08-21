import Link from 'next/link';

import { ArrowIcon } from '@/components/ui/icons';
import { pathFor, type Locale } from '@/content/i18n';
import { formatPeriod } from '@/content/period';
import { CATEGORY_LABELS, type Project } from '@/content/projects';
import { COMMON, PROJECTS_INDEX } from '@/content/site-copy';

export interface ProjectCardProps {
  readonly locale: Locale;
  readonly project: Project;
  /** Niveau du titre, pour ne jamais sauter de rang dans le plan de la page. */
  readonly headingLevel: 2 | 3;
}

/**
 * Vignette de realisation.
 *
 * C’est un `<article>` : AUDIT.md section 5.5 releve que les deux fiches
 * projet du site precedent etaient des `<div>`, alors qu’il s’agit de
 * contenu autonome et distribuable.
 *
 * La liste de technologies n’est rendue que si elle contient quelque chose :
 * une realisation non technique ne doit pas afficher de conteneur vide.
 *
 * Rendu cote serveur.
 */
export function ProjectCard({ locale, project, headingLevel }: ProjectCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const period = formatPeriod(project.period, locale);

  return (
    <article className="project-card flex h-full flex-col gap-sm p-md">
      <p className="flex flex-wrap items-center gap-x-sm gap-y-3xs font-mono text-body-sm text-ink-subtle">
        <span>{CATEGORY_LABELS[project.category][locale]}</span>
        <span>{period ?? COMMON.toBeSpecified[locale]}</span>
      </p>

      <Heading className="text-display-sm text-ink">
        <Link
          href={pathFor('project', locale, project.slug)}
          className="link-sweep inline-block transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
        >
          {project.title[locale]}
        </Link>
      </Heading>

      <p className="text-body-md text-ink-muted">{project.tagline[locale]}</p>

      {project.technologies.length === 0 ? null : (
        <ul className="flex list-none flex-wrap gap-2xs p-0">
          {project.technologies.map((technology) => (
            <li
              key={technology}
              dir="ltr"
              className="accent-chip px-2xs py-3xs font-mono text-body-sm"
            >
              {technology}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-auto flex items-center gap-2xs font-mono text-body-sm text-accent">
        <span aria-hidden="true">{PROJECTS_INDEX.readMore[locale]}</span>
        <ArrowIcon size="sm" />
      </p>
    </article>
  );
}
