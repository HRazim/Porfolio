import Link from 'next/link';

import { ArrowIcon } from '@/components/ui/icons';
import { pathFor, type Locale } from '@/content/i18n';
import { formatPeriodYears } from '@/content/period';
import { CATEGORY_LABELS, pickCardTechnologies, type Project } from '@/content/projects';
import { COMMON, HOME } from '@/content/site-copy';
import { bindTail } from '@/lib/no-break';

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
 * l’intrigue.
 *
 * ---------------------------------------------------------------------------
 * CE QUI A ÉTÉ CORRIGÉ, ET POURQUOI
 * ---------------------------------------------------------------------------
 *
 * PLUS AUCUNE TRONCATURE. `line-clamp-2` coupait l’accroche par des points de
 * suspension, souvent au milieu d’une phrase. Une phrase coupée est une phrase
 * qu’on ne lit pas : on la saute, et la vignette perd son seul argument.
 * L’accroche est écrite pour tenir en UNE phrase — elle est donc affichée
 * entière. Les trois cartes appartiennent à une grille : la plus haute donne
 * sa hauteur aux deux autres, et une accroche longue ne déforme rien.
 *
 * PLUS DE COMPTEUR « +12 ». Voir `pickCardTechnologies` : un nombre nu ne dit
 * pas ce qu’il recouvre.
 *
 * LA FLÈCHE A QUITTÉ LE TITRE. Accolée au dernier mot, elle atterrissait au
 * milieu d’une ligne dès que le titre en occupait deux, et coupait la lecture
 * en son point le plus fort. L’invitation descend au bas de la carte, où elle
 * appartient : on lit, puis on ouvre.
 *
 * ELLE EST `aria-hidden` — et c’est un choix, pas un oubli. Le lien porte déjà
 * le titre pour nom accessible, et un lecteur d’écran annonce « lien ». Répéter
 * « Ouvrir la fiche » derrière chaque titre ajouterait un bruit que l’œil, lui,
 * ne subit pas : la ligne visible est une affordance, pas une information.
 *
 * LE TITRE EST LIÉ PAR LA FIN. Voir `bindTail` : la dernière ligne emporte
 * toujours au moins deux mots.
 *
 * ---------------------------------------------------------------------------
 * UN SEUL LIEN — le titre. Son pseudo-élément `.card-stretch` recouvre la
 * carte entière : elle est cliquable de bord à bord, et pourtant elle ne coûte
 * qu’une tabulation. Aucun lien n’est imbriqué dans un autre, et rien d’autre
 * dans la carte n’est focalisable.
 *
 * Rendu côté serveur.
 * ---------------------------------------------------------------------------
 */
export function ProjectCardCompact({ locale, project, headingLevel }: ProjectCardCompactProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const years = formatPeriodYears(project.period, locale);
  const technologies = pickCardTechnologies(project);

  return (
    <article className="project-card-compact group relative flex h-full flex-col gap-xs p-md">
      <p className="flex flex-wrap items-center gap-x-2xs font-mono text-body-sm text-ink-subtle">
        <span>{CATEGORY_LABELS[project.category][locale]}</span>
        <span aria-hidden="true">{HOME.featuredCardSeparator[locale]}</span>
        <span>{years ?? COMMON.toBeSpecified[locale]}</span>
      </p>

      {/* LE TITRE EST CE QUI DOIT ACCROCHER L’ŒIL EN PREMIER, avant le cadre.
          Il monte donc d’un cran d’échelle — `body-lg` au lieu de `body-md` —
          et prend l’encre pleine, quand tout le reste de la carte est en encre
          atténuée. La famille display lui est déjà posée par la couche de
          base, avec `text-wrap: balance`.

          `hyphens-auto` remplace la coupure forcée qui occupait cette place.
          Elle coupait un mot n’importe où et sans trait d’union ; la césure
          coupe aux syllabes et le pose. Elle ne se déclenche de toute façon
          qu’à l’étroit : le groupe lié le plus large mesure 164 px contre une
          carte qui en offre 228 au minimum. */}
      <Heading className="hyphens-auto text-body-lg text-ink">
        <Link
          href={pathFor('project', locale, project.slug)}
          className="card-stretch transition-colors duration-[var(--duration-fast)] ease-out group-hover:text-accent"
        >
          {bindTail(project.title[locale])}
        </Link>
      </Heading>

      <p className="text-body-sm text-ink-muted">{project.tagline[locale]}</p>

      {/* Le pied est poussé en bas par `mt-auto`, quel que soit le volume de
          texte au-dessus : les trois invitations s’alignent donc entre elles
          au lieu de flotter chacune à sa hauteur. */}
      <div className="mt-auto flex flex-col gap-xs pt-2xs">
        {technologies.length === 0 ? null : (
          <ul className="flex list-none flex-wrap gap-3xs p-0">
            {technologies.map((technology) => (
              <li key={technology} dir="ltr" className="card-chip px-2xs py-3xs font-mono text-body-sm">
                {technology}
              </li>
            ))}
          </ul>
        )}

        <p
          aria-hidden="true"
          className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent transition-colors duration-[var(--duration-fast)] ease-out group-hover:text-ink"
        >
          {HOME.featuredCardCta[locale]}
          <ArrowIcon size="sm" />
        </p>
      </div>
    </article>
  );
}
