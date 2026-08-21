import Link from 'next/link';

import { ArrowIcon } from '@/components/ui/icons';
import { pathFor, type Locale } from '@/content/i18n';
import { formatPeriodYears } from '@/content/period';
import { CATEGORY_LABELS, pickCardTechnologies, type Project } from '@/content/projects';
import { COMMON, HOME } from '@/content/site-copy';

export interface ProjectCardCompactProps {
  readonly locale: Locale;
  readonly project: Project;
  /** Niveau du titre, pour ne jamais sauter de rang dans le plan de la page. */
  readonly headingLevel: 2 | 3;
}

/**
 * ---------------------------------------------------------------------------
 * VIGNETTE COMPACTE — PAGE D’ACCUEIL UNIQUEMENT
 * ---------------------------------------------------------------------------
 *
 * `ProjectCard` reste la vignette de l’index des réalisations, inchangée.
 * Celle-ci ne la remplace pas : elle répond à une autre question.
 *
 * SUR L’INDEX, on compare des réalisations entre elles — la vignette doit donc
 * porter de quoi choisir. SUR L’ACCUEIL, on ne compare rien : trois vignettes
 * annoncent qu’il y a du travail derrière, et le visiteur ouvre celle qui
 * l’intrigue. Une vignette d’accueil doit donner envie d’ouvrir, pas tout
 * dire. Celle-ci affiche six informations, l’ancienne en affichait jusqu’à
 * dix-neuf.
 *
 * CE QU’ELLE MONTRE — catégorie, période à l’année, titre, accroche sur deux
 * lignes, jusqu’à quatre technologies, et une invitation.
 *
 * CE QU’ELLE NE MONTRE PAS — le contexte, le rôle, le bloc
 * situation-tâches-actions-résultats, les enseignements, les visuels et les
 * liens externes. Tout cela vit sur la fiche, à une tabulation de distance.
 *
 * UN SEUL LIEN — le titre. Son pseudo-élément `.card-stretch` recouvre la
 * carte entière : elle est cliquable de bord à bord, et pourtant elle ne coûte
 * qu’une tabulation. Aucun lien n’est imbriqué dans un autre.
 *
 * TRONCATURE — `line-clamp-2` coupe visuellement l’accroche. Le texte reste
 * ENTIER dans le document : il est lu intégralement par une synthèse vocale,
 * trouvé par une recherche dans la page et indexé. Rien n’est retiré, seule la
 * hauteur est bornée.
 *
 * Rendu côté serveur.
 * ---------------------------------------------------------------------------
 */
export function ProjectCardCompact({ locale, project, headingLevel }: ProjectCardCompactProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const years = formatPeriodYears(project.period, locale);
  const { shown, extra } = pickCardTechnologies(project);

  return (
    <article className="project-card group relative flex h-full flex-col gap-2xs p-xs">
      <p className="flex flex-wrap items-center gap-x-2xs font-mono text-body-sm text-ink-subtle">
        <span>{CATEGORY_LABELS[project.category][locale]}</span>
        <span aria-hidden="true">{HOME.featuredCardSeparator[locale]}</span>
        <span>{years ?? COMMON.toBeSpecified[locale]}</span>
      </p>

      {/* Le `line-clamp` est posé sur un span À L’INTÉRIEUR du lien, jamais
          sur un ancêtre. `line-clamp` implique `overflow: hidden`, et un
          ancêtre qui rogne pourrait emporter le pseudo-élément qui étend le
          lien à toute la carte. Ici l’élément rognant est un DESCENDANT du
          lien : il ne peut rien rogner de ce que le lien engendre. Le titre
          est donc borné à deux lignes sans mettre la zone cliquable en jeu. */}
      <Heading className="text-body-md text-ink">
        <Link
          href={pathFor('project', locale, project.slug)}
          className="card-stretch transition-colors duration-[var(--duration-fast)] ease-out group-hover:text-accent"
        >
          <span className="line-clamp-2">
            {project.title[locale]}
            {/* L’invitation tient dans la flèche : une ligne de texte de plus
                coûterait vingt-sept pixels sur une carte qui en compte deux
                cent trente-neuf. Le libellé complet reste annoncé aux lecteurs
                d’écran, qui n’ont que faire d’un pictogramme. */}
            <ArrowIcon size="sm" className="ms-2xs inline-block" />
            <span className="sr-only">{HOME.featuredCardCta[locale]}</span>
          </span>
        </Link>
      </Heading>

      <p className="line-clamp-2 text-body-sm text-ink-muted">{project.tagline[locale]}</p>

      {shown.length === 0 ? null : (
        <ul className="mt-auto flex list-none flex-wrap gap-3xs p-0">
          {shown.map((technology) => (
            <li key={technology} dir="ltr" className="accent-chip px-2xs py-3xs font-mono text-body-sm">
              {technology}
            </li>
          ))}
          {extra === 0 ? null : (
            <li className="accent-chip px-2xs py-3xs font-mono text-body-sm">
              <span aria-hidden="true">
                {HOME.featuredCardMore[locale].replace('{count}', String(extra))}
              </span>
              <span className="sr-only">
                {HOME.featuredCardMoreLabel[locale].replace('{count}', String(extra))}
              </span>
            </li>
          )}
        </ul>
      )}
    </article>
  );
}
