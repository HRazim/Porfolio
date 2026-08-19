import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectCard } from '@/components/project/project-card';
import { ContactList } from '@/components/ui/contact-list';
import { ArrowIcon } from '@/components/ui/icons';
import { getFeaturedProjects } from '@/content/projects';
import { HOME, MAIN_CONTENT_ID, PAGE_META } from '@/content/site-copy';
import { pageTitle } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: pageTitle(PAGE_META.home.title) },
  description: PAGE_META.home.description,
  alternates: { canonical: '/' },
};

/**
 * Accueil.
 *
 * Tous les textes viennent de src/content/site-copy.ts : ce fichier assemble
 * des primitives, il ne redige pas. `HOME.intro` est un tableau, le
 * decoupage en paragraphes etant une donnee editoriale et non une decision
 * de mise en page.
 *
 * Rendu cote serveur, statiquement.
 */
export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{HOME.eyebrow}</p>
          <h1 className="mt-sm text-display-xl text-ink">{HOME.headline}</h1>
          <Prose size="lead" className="mt-lg">
            {HOME.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Container>
      </Section>

      <Section background="surface" labelledBy="realisations-mises-en-avant">
        <Container>
          <h2 id="realisations-mises-en-avant" className="text-display-md text-ink">
            {HOME.featuredHeading}
          </h2>
          <Prose className="mt-md">
            <p>{HOME.featuredIntro}</p>
          </Prose>

          {featured.length === 0 ? (
            <Prose className="mt-md">
              <p>{HOME.featuredEmpty}</p>
            </Prose>
          ) : (
            <Grid as="ul" columns={3} gap="lg" className="mt-xl">
              {featured.map((project) => (
                <li key={project.slug}>
                  <ProjectCard project={project} headingLevel={3} />
                </li>
              ))}
            </Grid>
          )}

          <p className="mt-xl">
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent underline decoration-from-font underline-offset-2 transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
            >
              {HOME.featuredLinkAll}
              <ArrowIcon size="sm" />
            </Link>
          </p>
        </Container>
      </Section>

      <Section id="contact" background="paper" labelledBy="contact-titre">
        <Container>
          <h2 id="contact-titre" className="text-display-md text-ink">
            {HOME.contactHeading}
          </h2>
          {/* EN ATTENTE DE REDACTION — voir HOME.contactIntro */}
          <Prose className="mt-md">
            <p>{HOME.contactIntro}</p>
          </Prose>
          <div className="mt-xl">
            <ContactList />
          </div>
        </Container>
      </Section>
    </main>
  );
}
