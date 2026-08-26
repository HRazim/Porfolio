/**
 * Ce composant sert LES QUATRE LANGUES. Il n'en choisit aucune : la langue
 * arrive par la propriete `locale`, et les quatre fichiers de route qui
 * l'appellent — un par langue — sont les seuls a la declarer.
 */
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ArrowIcon } from '@/components/ui/icons';
import { pathFor, type Locale } from '@/content/i18n';
import { MAIN_CONTENT_ID, NOT_FOUND } from '@/content/site-copy';

/** Page 404 sur mesure. Rendu cote serveur, statiquement. */
export function NotFoundPage({ locale }: { readonly locale: Locale }) {
  return (
    /* CASCADE D'ARRIVEE. Elle est le mecanisme de transition des navigations
       INTERNES a une langue : le routeur remplace le `<main>`, l'animation
       repart. `cascade-tight` la cadence a `--duration-base`, un pas de
       `--duration-stagger` : rang 1 a 200 ms, rang 2 a 280 ms.

       LE SURTITRE ET LE TITRE N'ONT AUCUN RANG. Ils sont peints avec la page,
       a l'instant zero : le contenu est lisible avant que la cascade ne
       commence, et elle ne retarde donc jamais la lecture. */
    <main id={MAIN_CONTENT_ID} className="cascade-tight">
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{NOT_FOUND.eyebrow[locale]}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{NOT_FOUND.heading[locale]}</h1>
          <Prose size="lead" className="mt-lg">
            <p data-enter="1">{NOT_FOUND.message[locale]}</p>
          </Prose>

          {/* LES REALISATIONS D'ABORD, ET C'EST UNE CORRECTION.
              L'en-tete porte deja un lien vers l'accueil : le nom du site, en
              haut a gauche. Sur une vue telephone, la navigation se replie
              derriere un bouton, et plus AUCUN lien ne s'intercale entre ce
              nom et le premier lien du corps. Les deux menaient a la meme
              adresse, l'un derriere l'autre : c'est le motif que la technique
              WCAG H2 signale, et que l'audit a releve six fois — deux themes,
              trois langues.

              LA 404 FRANCAISE LE PORTAIT DEPUIS TOUJOURS SANS QUE RIEN NE LE
              VOIE : `404.html` et `_not-found.html` sont declares hors
              contenu dans le harnais, donc jamais audites. Les trois pages
              par prefixe, elles, sont des pages ordinaires — et l'ont
              revele.

              Intervertir suffit : l'index des realisations s'intercale, les
              deux liens vers l'accueil ne se suivent plus. Et sur une page
              introuvable, l'action utile est celle que l'en-tete n'offre
              pas. */}
          <ul
            data-enter="2"
            className="mt-2xl flex list-none flex-col gap-sm p-0 sm:flex-row sm:gap-lg"
          >
            <li>
              <Link
                href={pathFor('projects', locale)}
                className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
              >
                {NOT_FOUND.projectsLink[locale]}
                <ArrowIcon size="sm" />
              </Link>
            </li>
            <li>
              <Link
                href={pathFor('home', locale)}
                className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
              >
                {NOT_FOUND.homeLink[locale]}
                <ArrowIcon size="sm" />
              </Link>
            </li>
          </ul>
        </Container>
      </Section>
    </main>
  );
}
