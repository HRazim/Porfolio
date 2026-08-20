import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectCardCompact } from '@/components/project/project-card-compact';
import { ContactList } from '@/components/ui/contact-list';
import { ArrowIcon, DocumentIcon } from '@/components/ui/icons';
import { getFeaturedProjects } from '@/content/projects';
import { HOME, MAIN_CONTENT_ID, PAGE_META } from '@/content/site-copy';
import { formatBytes, publicAssetBytes } from '@/lib/public-asset';
import {
  CV_PATH,
  pageTitle,
  PORTRAIT_PATH,
  PORTRAIT_SIZE,
  PORTRAIT_SIZES,
  PORTRAIT_WIDTHS,
  SITE_NAME,
} from '@/lib/site';

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
 * ---------------------------------------------------------------------------
 * ACCUEIL
 * ---------------------------------------------------------------------------
 *
 * TROIS SECTIONS, dans l'ordre ou un visiteur se pose ses questions :
 *   1. Entete    — qui est-ce ?          portrait, nom, accroche, une phrase
 *   2. Travaux   — qu'a-t-il fait ?      trois vignettes, puis l'index complet
 *   3. Contact   — comment le joindre ?  coordonnees et CV
 *
 * LA SECTION « À propos de moi » A QUITTE CETTE PAGE. Elle occupait le
 * deuxieme ecran avec trois paragraphes que personne ne lit avant d'avoir
 * decide si la personne l'interesse. Elle a desormais sa propre page, et
 * l'accueil n'en garde qu'un renvoi.
 *
 * ORDRE DU DOM — le portrait PRECEDE le texte dans le balisage, et se place a
 * gauche sur large ecran par le seul jeu de `flex-row`. Aucun `order-*`, aucun
 * placement de grille : l'ordre visuel et l'ordre de lecture coincident, donc
 * la navigation clavier et la lecture d'ecran suivent ce que l'oeil voit.
 *
 * Tous les textes viennent de src/content/site-copy.ts. Ce fichier assemble
 * des primitives, il ne redige pas.
 *
 * Rendu cote serveur, statiquement.
 * ---------------------------------------------------------------------------
 */
export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <main id={MAIN_CONTENT_ID}>
      {/* 1 — ENTETE -------------------------------------------------------
          Cascade d’entree au chargement, par `data-enter`, dont le rang est
          declare ici et non deduit d’un `nth-child`. Quatre rangs, trois pas
          de 80 ms, 320 ms de duree : 560 ms au total, sous la limite de
          600 ms.

          Elle est SANS RISQUE, contrairement a l’apparition au defilement qui
          a ete retiree : c’est une animation CSS a duree finie, qui se termine
          d’elle-meme. Elle ne depend d’aucun evenement, d’aucune hydratation,
          d’aucun observateur. Le contenu est dans le HTML servi et visible au
          plus tard 560 ms apres le premier rendu — immediatement si le
          mouvement est refuse ou si JavaScript ne s’execute pas. */}
      <Section spacing="spacious" background="paper">
        <Container>
          <div className="flex flex-col gap-lg md:flex-row md:items-center md:gap-3xl">
            {/* Element le plus grand de la page : charge en priorite, jamais
                en differe. Les deux encodages sont produits a l’avance et
                servis tels quels, aucun optimiseur n’intervient. Le repli
                pointe vers la PLUS PETITE variante : un client incapable de
                lire `srcset` ne doit pas heriter du plus gros fichier.

                Le rang d’entree est pose sur l’IMAGE et non sur `<picture>` :
                `<picture>` est un element en ligne non remplace, sur lequel
                `transform` ne s’applique pas. */}
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
                data-enter="1"
                className="w-portrait-sm shrink-0 rounded-md border border-border md:w-portrait"
              />
            </picture>

            <div className="min-w-0 flex-1">
              <p data-enter="2" className="font-mono text-body-sm text-ink-subtle">
                {SITE_NAME}
              </p>
              {/* Un cran d’echelle plus bas sous `md`, et non une taille
                  inventee : `display-xl` vaut 61 px des 360 px de large, ou il
                  etale l’accroche sur cinq lignes et repousse la phrase de
                  contexte hors du premier ecran. `display-lg` la ramene a
                  quatre lignes. Les deux jetons existent deja ; seule change
                  celui qui est applique. */}
              <h1
                data-enter="3"
                className="section-rule mt-2xs text-display-lg text-ink md:text-display-xl"
              >
                {HOME.headline}
              </h1>
              <Prose size="lead" className="mt-md">
                <p data-enter="4">{HOME.lede}</p>
              </Prose>
              {/* Le developpement part sur sa propre page. L’accueil garde une
                  phrase et un renvoi : c’est ce qu’une page d’accueil doit
                  faire, presenter puis laisser choisir. */}
              <p className="mt-md">
                <Link
                  href="/a-propos"
                  className="link-sweep inline-flex items-center gap-2xs font-mono text-body-sm text-accent transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
                >
                  {HOME.aboutLinkLabel}
                  <ArrowIcon size="sm" />
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2 — REALISATIONS ------------------------------------------------- */}
      <Section background="surface" labelledBy="realisations">
        <Container>
          {/* Aucune phrase d’introduction : le titre porte, les cartes
              montrent. Une glose entre les deux ne fait que retarder. */}
          <h2 id="realisations" className="section-rule text-display-md text-ink">
            {HOME.featuredHeading}
          </h2>

          {featured.length === 0 ? (
            <Prose className="mt-lg">
              <p>{HOME.featuredEmpty}</p>
            </Prose>
          ) : (
            <Grid as="ul" columns={3} gap="lg" className="mt-lg">
              {featured.map((project) => (
                <li key={project.slug}>
                  <ProjectCardCompact project={project} headingLevel={3} />
                </li>
              ))}
            </Grid>
          )}

          <p className="mt-lg">
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
            >
              {HOME.featuredLinkAll}
              <ArrowIcon size="sm" />
            </Link>
          </p>
        </Container>
      </Section>

      {/* 3 — CONTACT ------------------------------------------------------ */}
      <Section id="contact" background="paper" labelledBy="contact-titre">
        <Container>
          <h2 id="contact-titre" className="section-rule text-display-md text-ink">
            {HOME.contactHeading}
          </h2>
          <div className="mt-lg flex flex-col items-start gap-lg sm:flex-row sm:items-center sm:justify-between">
            <ContactList />
            {/* `download` plutot qu’une ouverture d’onglet : le fichier est
                destine a etre conserve, pas consulte au vol. Format et poids
                sont annonces avant le declenchement. */}
            <a
              href={CV_PATH}
              download
              className="button-primary inline-flex shrink-0 items-center gap-2xs px-md py-sm font-mono text-body-sm"
            >
              <DocumentIcon size="sm" />
              {HOME.cvLabel}
              <span>{` (${CV_META})`}</span>
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}
