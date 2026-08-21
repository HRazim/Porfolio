/**
 * Ce composant sert LES QUATRE LANGUES. Il n'en choisit aucune : la langue
 * arrive par la propriete `locale`, et les quatre fichiers de route qui
 * l'appellent — un par langue — sont les seuls a la declarer.
 */
import { Container } from '@/components/layout/container';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectCard } from '@/components/project/project-card';
import { CATEGORY_LABELS, getProjectsByCategory } from '@/content/projects';
import type { Locale } from '@/content/i18n';
import { MAIN_CONTENT_ID, PROJECTS_INDEX } from '@/content/site-copy';

/**
 * Index des realisations, groupees par categorie.
 *
 * Le regroupement vient des donnees (`getProjectsByCategory`), jamais d’un
 * selecteur positionnel. AUDIT.md section 3.7 releve trois mecanismes de
 * style couples a `nth-child` dans le site precedent.
 *
 * Rendu cote serveur, statiquement.
 */
export function ProjectsIndexPage({ locale }: { readonly locale: Locale }) {
  const groups = getProjectsByCategory();

  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{PROJECTS_INDEX.eyebrow[locale]}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{PROJECTS_INDEX.heading[locale]}</h1>
          <Prose size="lead" className="mt-lg">
            <p>{PROJECTS_INDEX.intro[locale]}</p>
          </Prose>
        </Container>
      </Section>

      <Section background="surface">
        <Container>
          {groups.length === 0 ? (
            <Prose>
              <p>{PROJECTS_INDEX.empty[locale]}</p>
            </Prose>
          ) : (
            <div className="flex flex-col gap-3xl">
              {groups.map((group) => {
                const headingId = `categorie-${group.category}`;
                const count = group.projects.length;
                const countLabel =
                  count === 1 ? PROJECTS_INDEX.countOne[locale] : PROJECTS_INDEX.countMany[locale];

                return (
                  <section key={group.category} aria-labelledby={headingId}>
                    <div className="flex flex-wrap items-baseline gap-sm">
                      <h2 id={headingId} className="section-rule text-display-sm text-ink">
                        {CATEGORY_LABELS[group.category][locale]}
                      </h2>
                      <p className="font-mono text-body-sm text-ink-subtle">
                        {`${count} ${countLabel}`}
                      </p>
                    </div>

                    <Grid as="ul" columns={2} gap="lg" className="mt-lg">
                      {group.projects.map((project) => (
                        <li key={project.slug}>
                          <ProjectCard locale={locale} project={project} headingLevel={3} />
                        </li>
                      ))}
                    </Grid>
                  </section>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
