import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectCard } from '@/components/project/project-card';
import { CATEGORY_LABELS, getProjectsByCategory } from '@/content/projects';
import { MAIN_CONTENT_ID, PAGE_META, PROJECTS_INDEX } from '@/content/site-copy';
import { OG_SHARE_PATH } from '@/lib/og';
import { pageTitle } from '@/lib/site';

export const metadata: Metadata = {
  title: PAGE_META.projects.title,
  description: PAGE_META.projects.description,
  alternates: { canonical: '/realisations' },
  openGraph: {
    type: 'website',
    title: pageTitle(PAGE_META.projects.title),
    description: PAGE_META.projects.description,
    url: '/realisations',
  // Declarer un bloc `openGraph` REMPLACE celui herite de la mise en page
  // racine — images comprises. Sans `images`, la page perdrait sa vignette
  // de partage et un lien s’afficherait sans apercu. Le defaut a deja ete
  // rencontre sur /a-propos ; il est ici evite explicitement.
    images: [OG_SHARE_PATH],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle(PAGE_META.projects.title),
    description: PAGE_META.projects.description,
    images: [OG_SHARE_PATH],
  },
};

/**
 * Index des realisations, groupees par categorie.
 *
 * Le regroupement vient des donnees (`getProjectsByCategory`), jamais d’un
 * selecteur positionnel. AUDIT.md section 3.7 releve trois mecanismes de
 * style couples a `nth-child` dans le site precedent.
 *
 * Rendu cote serveur, statiquement.
 */
export default function ProjectsIndexPage() {
  const groups = getProjectsByCategory();

  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{PROJECTS_INDEX.eyebrow}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{PROJECTS_INDEX.heading}</h1>
          <Prose size="lead" className="mt-lg">
            <p>{PROJECTS_INDEX.intro}</p>
          </Prose>
        </Container>
      </Section>

      <Section background="surface">
        <Container>
          {groups.length === 0 ? (
            <Prose>
              <p>{PROJECTS_INDEX.empty}</p>
            </Prose>
          ) : (
            <div className="flex flex-col gap-3xl">
              {groups.map((group) => {
                const headingId = `categorie-${group.category}`;
                const count = group.projects.length;
                const countLabel =
                  count === 1 ? PROJECTS_INDEX.countOne : PROJECTS_INDEX.countMany;

                return (
                  <section key={group.category} aria-labelledby={headingId}>
                    <div className="flex flex-wrap items-baseline gap-sm">
                      <h2 id={headingId} className="section-rule text-display-sm text-ink">
                        {CATEGORY_LABELS[group.category]}
                      </h2>
                      <p className="font-mono text-body-sm text-ink-subtle">
                        {`${count} ${countLabel}`}
                      </p>
                    </div>

                    <Grid as="ul" columns={2} gap="lg" className="mt-lg">
                      {group.projects.map((project) => (
                        <li key={project.slug}>
                          <ProjectCard project={project} headingLevel={3} />
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
