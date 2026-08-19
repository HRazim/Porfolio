import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ArrowIcon } from '@/components/ui/icons';
import { MAIN_CONTENT_ID, NOT_FOUND, PAGE_META } from '@/content/site-copy';

export const metadata: Metadata = {
  title: PAGE_META.notFound.title,
  description: PAGE_META.notFound.description,
  robots: { index: false, follow: true },
};

/** Page 404 sur mesure. Rendu cote serveur, statiquement. */
export default function NotFoundPage() {
  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container>
          <p className="font-mono text-body-sm text-ink-subtle">{NOT_FOUND.eyebrow}</p>
          <h1 className="mt-sm text-display-lg text-ink">{NOT_FOUND.heading}</h1>
          <Prose size="lead" className="mt-lg">
            <p>{NOT_FOUND.message}</p>
          </Prose>

          <ul className="mt-2xl flex list-none flex-col gap-sm p-0 sm:flex-row sm:gap-lg">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent underline decoration-from-font underline-offset-2 transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
              >
                {NOT_FOUND.homeLink}
                <ArrowIcon size="sm" />
              </Link>
            </li>
            <li>
              <Link
                href="/realisations"
                className="inline-flex items-center gap-2xs font-mono text-body-sm text-accent underline decoration-from-font underline-offset-2 transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
              >
                {NOT_FOUND.projectsLink}
                <ArrowIcon size="sm" />
              </Link>
            </li>
          </ul>
        </Container>
      </Section>
    </main>
  );
}
