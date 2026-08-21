/**
 * Ce composant sert LES QUATRE LANGUES. Il n'en choisit aucune : la langue
 * arrive par la propriete `locale`, et les quatre fichiers de route qui
 * l'appellent — un par langue — sont les seuls a la declarer.
 */
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ProjectCardCompact } from '@/components/project/project-card-compact';
import { ContactList } from '@/components/ui/contact-list';
import { ArrowIcon, DocumentIcon } from '@/components/ui/icons';
import { getFeaturedProjects } from '@/content/projects';
import { pathFor, type Locale } from '@/content/i18n';
import { HOME, MAIN_CONTENT_ID } from '@/content/site-copy';
import { formatBytes, publicAssetBytes } from '@/lib/public-asset';
import {
  CV_PATH,
  PORTRAIT_PATH,
  PORTRAIT_SIZE,
  PORTRAIT_SIZES,
  PORTRAIT_WIDTHS,
} from '@/lib/site';

/** `{base}-{largeur}.{extension} {largeur}w`, pour chaque largeur produite. */
function portraitSrcSet(extension: 'avif' | 'webp'): string {
  return PORTRAIT_WIDTHS.map((w) => `${PORTRAIT_PATH}-${w}.${extension} ${w}w`).join(', ');
}

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
export function HomePage({ locale }: { readonly locale: Locale }) {
  const featured = getFeaturedProjects();
  /* Poids du CV, lu sur le fichier pendant le rendu statique.
     Voir src/lib/public-asset.ts : la mention affichee ne peut pas
     diverger du fichier reellement servi. */
  const cvMeta = HOME.cvMeta[locale].replace('{poids}', formatBytes(publicAssetBytes(CV_PATH)));

  return (
    <main id={MAIN_CONTENT_ID}>
      {/* 1 — ENTETE -------------------------------------------------------
          Cascade d’entree au chargement, par `data-enter`, dont le rang est
          declare ici et non deduit d’un `nth-child`. Trois rangs, deux pas
          de 80 ms, 320 ms de duree : 480 ms au total, sous la limite de
          600 ms. Le rang 4 existe toujours dans le systeme, decrit par le
          guide de style ; l’accueil n’a plus que trois elements a faire
          entrer depuis le retrait du surtitre.

          Elle est SANS RISQUE, contrairement a l’apparition au defilement qui
          a ete retiree : c’est une animation CSS a duree finie, qui se termine
          d’elle-meme. Elle ne depend d’aucun evenement, d’aucune hydratation,
          d’aucun observateur. Le contenu est dans le HTML servi et visible au
          plus tard 560 ms apres le premier rendu — immediatement si le
          mouvement est refuse ou si JavaScript ne s’execute pas. */}
      <Section spacing="spacious" background="paper">
        <Container>
          {/* MISE EN COLONNES A `lg`, ET NON A `md`. Le passage cote a cote
              est commande par la place qu’il laisse au titre, pas par la
              largeur de l’ecran. A 768 px, la colonne de texte ne mesurait
              que 291 px : l’accroche s’y composait sur quatre a cinq lignes.
              Empilee, elle dispose de toute la largeur de contenu — 707 px —
              et tient sur deux lignes des 640 px.

              ALIGNEMENT PAR LE HAUT, et non centre. Le bloc de texte est plus
              haut que le portrait, et il change de hauteur d’une langue a
              l’autre. Centrer fait donc descendre le portrait d’une valeur
              qui depend du texte : c’est ce decalage qui se voyait. Aligner
              par le haut ancre le portrait sur l’accroche, et l’ancrage ne
              bouge plus quelle que soit la langue.

              L’ecart passe de 6 rem a 3 rem : chaque pixel repris ici va a la
              colonne de texte, seule variable qui decide du nombre de lignes. */}
          <div className="flex flex-col gap-lg lg:flex-row lg:items-start lg:gap-xl">
            {/* Element le plus grand de la page : charge en priorite, jamais
                en differe. Les deux encodages sont produits a l’avance et
                servis tels quels, aucun optimiseur n’intervient. Le repli
                pointe vers la PLUS PETITE variante : un client incapable de
                lire `srcset` ne doit pas heriter du plus gros fichier.

                Le rang d’entree est pose sur l’IMAGE et non sur `<picture>` :
                `<picture>` est un element en ligne non remplace, sur lequel
                `transform` ne s’applique pas. */}
            {/* Le decalage optique est porte par `<picture>`, seul element de
                cette paire a etre un enfant du conteneur flexible : une marge
                verticale posee sur l’image, qui reste en ligne, ne produirait
                aucun effet de mise en page.

                8 px, soit --spacing-2xs. Ce n’est pas un ajustement au juge :
                l’interlignage de `display-xl` vaut 1, la boite de ligne vaut
                donc 1 em pendant que la fonte en occupe 1,30 ; le demi-
                interlignage vaut -0,15 em, et le haut des capitales tombe a
                -0,15 + 0,99 - 0,72 = 0,12 em sous le haut de la boite. Entre
                70 et 76 px de corps, cela fait 8,4 a 9,2 px. Le portrait a un
                bord franc, l’accroche n’en a pas : sans ce decalage, le bord
                du portrait s’aligne sur du vide et parait monter. */}
            <picture className="shrink-0 lg:mt-2xs">
              <source srcSet={portraitSrcSet('avif')} sizes={PORTRAIT_SIZES} type="image/avif" />
              <source srcSet={portraitSrcSet('webp')} sizes={PORTRAIT_SIZES} type="image/webp" />
              <img
                src={`${PORTRAIT_PATH}-${PORTRAIT_WIDTHS[0]}.webp`}
                alt={HOME.portraitAlt[locale]}
                width={PORTRAIT_SIZE}
                height={PORTRAIT_SIZE}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                data-enter="1"
                className="w-portrait-sm shrink-0 rounded-md border border-border lg:w-portrait"
              />
            </picture>

            <div className="min-w-0 flex-1">
              {/* LE NOM N’EST PLUS REPETE ICI. Il figurait en surtitre, a
                  quelques centimetres du logo qui le porte deja sur toutes
                  les pages : deux occurrences du meme nom dans le meme champ
                  de vision. Le logo suffit, et lui seul le montre desormais.

                  Un cran d’echelle plus bas sous `md`, et non une taille
                  inventee : `display-xl` vaut 61 px des 360 px de large, ou il
                  etale l’accroche sur quatre lignes et repousse la phrase de
                  contexte hors du premier ecran. `display-lg` la ramene a
                  trois. Les deux jetons existent deja ; seule change celui qui
                  est applique.

                  `break-words` n’agit jamais aux largeurs servies : il ne se
                  declenche que si un mot — ici un groupe lie par une espace
                  insecable — ne tient pas seul sur une ligne. Cela n’arrive
                  qu’en dessous de 352 px de large, sous la plus petite largeur
                  de reference du projet. C’est un filet : mieux vaut une coupe
                  laide qu’un debordement hors de l’ecran. */}
              <h1
                data-enter="2"
                className="section-rule break-words text-display-lg text-ink md:text-display-xl"
              >
                {HOME.headline[locale]}
              </h1>
              <Prose size="lead" className="mt-md">
                <p data-enter="3">{HOME.lede[locale]}</p>
              </Prose>
              {/* Le developpement part sur sa propre page. L’accueil garde une
                  phrase et un renvoi : c’est ce qu’une page d’accueil doit
                  faire, presenter puis laisser choisir. */}
              <p className="mt-md">
                <Link
                  href={pathFor('about', locale)}
                  className="link-sweep inline-flex items-center gap-2xs font-mono text-body-sm text-accent transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
                >
                  {HOME.aboutLinkLabel[locale]}
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
            {HOME.featuredHeading[locale]}
          </h2>

          {featured.length === 0 ? (
            <Prose className="mt-lg">
              <p>{HOME.featuredEmpty[locale]}</p>
            </Prose>
          ) : (
            <Grid as="ul" columns={3} gap="lg" className="mt-lg">
              {featured.map((project) => (
                <li key={project.slug}>
                  <ProjectCardCompact locale={locale} project={project} headingLevel={3} />
                </li>
              ))}
            </Grid>
          )}

          <p className="mt-lg">
            <Link
              href={pathFor('projects', locale)}
              className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
            >
              {HOME.featuredLinkAll[locale]}
              <ArrowIcon size="sm" />
            </Link>
          </p>
        </Container>
      </Section>

      {/* 3 — CONTACT ------------------------------------------------------ */}
      <Section id="contact" background="paper" labelledBy="contact-titre">
        <Container>
          <h2 id="contact-titre" className="section-rule text-display-md text-ink">
            {HOME.contactHeading[locale]}
          </h2>
          <div className="mt-lg flex flex-col items-start gap-lg sm:flex-row sm:items-center sm:justify-between">
            <ContactList locale={locale} />
            {/* `download` plutot qu’une ouverture d’onglet : le fichier est
                destine a etre conserve, pas consulte au vol. Format et poids
                sont annonces avant le declenchement. */}
            <a
              href={CV_PATH}
              download
              className="button-primary inline-flex shrink-0 items-center gap-2xs px-md py-sm font-mono text-body-sm"
            >
              <DocumentIcon size="sm" />
              {HOME.cvLabel[locale]}
              {/* La mention est entierement latine — « PDF, 129 Ko » dans les
                  quatre langues — alors que la page qui la porte peut etre
                  arabe. Isolee de gauche a droite, elle s’y compose dans le
                  bon sens. */}
              <span dir="ltr">{` (${cvMeta})`}</span>
            </a>
          </div>
        </Container>
      </Section>
    </main>
  );
}
