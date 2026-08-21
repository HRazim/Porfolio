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
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{NOT_FOUND.eyebrow[locale]}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{NOT_FOUND.heading[locale]}</h1>
          <Prose size="lead" className="mt-lg">
            <p>{NOT_FOUND.message[locale]}</p>
          </Prose>

          <ul className="mt-2xl flex list-none flex-col gap-sm p-0 sm:flex-row sm:gap-lg">
            <li>
              <Link
                href={pathFor('home', locale)}
                className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
              >
                {NOT_FOUND.homeLink[locale]}
                <ArrowIcon size="sm" />
              </Link>
            </li>
            <li>
              <Link
                href={pathFor('projects', locale)}
                className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent link-sweep transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
              >
                {NOT_FOUND.projectsLink[locale]}
                <ArrowIcon size="sm" />
              </Link>
            </li>
          </ul>
        </Container>
      </Section>
    </main>
  );
}
