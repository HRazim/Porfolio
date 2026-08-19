import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectCard } from '@/components/project/project-card';
import { ContactList } from '@/components/ui/contact-list';
import { ArrowIcon, DocumentIcon } from '@/components/ui/icons';
import {
  CV_PATH,
  PORTRAIT_PATH,
  PORTRAIT_SIZE,
  PORTRAIT_SIZES,
  PORTRAIT_WIDTHS,
} from '@/lib/site';
import { getFeaturedProjects } from '@/content/projects';
import { HOME, MAIN_CONTENT_ID, PAGE_META } from '@/content/site-copy';
import { formatBytes, publicAssetBytes } from '@/lib/public-asset';
import { pageTitle } from '@/lib/site';

/**
 * Poids du CV, lu sur le fichier pendant le rendu statique.
 * Voir src/lib/public-asset.ts : la mention affichee ne peut pas diverger du
 * fichier reellement servi.
 */
const CV_META = HOME.cvMeta.replace('{poids}', formatBytes(publicAssetBytes(CV_PATH)));

/** `{base}-{largeur}.{extension} {largeur}w`, pour chaque largeur produite. */
function portraitSrcSet(extension: 'avif' | 'webp'): string {
  return PORTRAIT_WIDTHS.map((w) => `${PORTRAIT_PATH}-${w}.${extension} ${w}w`).join(', ');
}

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
          <div className="flex flex-col gap-2xl md:flex-row md:items-start md:gap-3xl">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-body-sm text-ink-subtle">{HOME.eyebrow}</p>
              <h1 className="mt-sm text-display-xl text-ink">{HOME.headline}</h1>
              <Prose size="lead" className="mt-lg">
                {HOME.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </Prose>
            </div>
            {/* Element le plus grand de la page : charge en priorite, jamais
                en differe. Meme mecanique que la galerie de realisation — les
                deux encodages sont produits a l’avance et servis tels quels,
                aucun optimiseur n’intervient. Le repli pointe vers la PLUS
                PETITE variante : un client incapable de lire `srcset` ne doit
                pas heriter du plus gros fichier. */}
            <picture>
              <source srcSet={portraitSrcSet('avif')} sizes={PORTRAIT_SIZES} type="image/avif" />
              <source srcSet={portraitSrcSet('webp')} sizes={PORTRAIT_SIZES} type="image/webp" />
              <img
                src={`${PORTRAIT_PATH}-${PORTRAIT_WIDTHS[0]}.webp`}
                alt={HOME.portraitAlt}
                width={PORTRAIT_SIZE}
                height={PORTRAIT_SIZE}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-portrait-sm shrink-0 rounded-md border border-border md:w-portrait"
              />
            </picture>
          </div>
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
          <Prose className="mt-md">
            <p>{HOME.contactIntro}</p>
          </Prose>
          <div className="mt-xl">
            <ContactList />
          </div>
          <p className="mt-xl">
            {/* `download` plutot qu’une ouverture d’onglet : le fichier est
                destine a etre conserve, pas consulte au vol. Format et poids
                sont annonces avant le declenchement. */}
            <a
              href={CV_PATH}
              download
              className="inline-flex items-center gap-2xs rounded-sm border border-border px-md py-sm font-mono text-body-sm text-accent transition-colors duration-[var(--duration-fast)] ease-out hover:border-accent hover:text-ink"
            >
              <DocumentIcon size="sm" />
              {HOME.cvLabel}
              <span className="text-ink-subtle">{` (${CV_META})`}</span>
            </a>
          </p>
        </Container>
      </Section>
    </main>
  );
}
