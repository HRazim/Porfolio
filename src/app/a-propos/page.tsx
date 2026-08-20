import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { getReadings } from '@/content/career';
import { ABOUT, MAIN_CONTENT_ID, PAGE_META } from '@/content/site-copy';
import { pageTitle } from '@/lib/site';

export const metadata: Metadata = {
  title: PAGE_META.about.title,
  description: PAGE_META.about.description,
  alternates: { canonical: '/a-propos' },
  openGraph: {
    type: 'profile',
    title: pageTitle(PAGE_META.about.title),
    description: PAGE_META.about.description,
    url: '/a-propos',
  },
};

/**
 * ---------------------------------------------------------------------------
 * À PROPOS
 * ---------------------------------------------------------------------------
 *
 * La page existait, dispersée : quatre lignes sur l’accueil, les lectures
 * égarées au bas du parcours. Elle est ici, entière.
 *
 * DEUX SECTIONS, dans cet ordre : qui je suis, puis ce qui m’a formé sans
 * diplôme à la clé. Les lectures viennent après le texte parce qu’elles
 * l’illustrent — les mettre avant serait annoncer la conclusion.
 *
 * MESURE DE LIGNE — `Container width="measure"` borne la colonne à 66ch, soit
 * 60 à 75 caractères pour du français composé en Instrument Sans. Quatre
 * paragraphes de prose se lisent, ils ne se balaient pas.
 *
 * Aucun texte n’est écrit ici : tout vient de src/content/site-copy.ts et de
 * src/content/career.ts.
 *
 * Rendu côté serveur, statiquement.
 * ---------------------------------------------------------------------------
 */
export default function AboutPage() {
  const readings = getReadings();

  return (
    <main id={MAIN_CONTENT_ID}>
      <Section spacing="spacious" background="paper">
        <Container width="measure">
          <p className="font-mono text-body-sm text-ink-subtle">{ABOUT.eyebrow}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{ABOUT.heading}</h1>
          <Prose className="mt-xl">
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </Container>
      </Section>

      <Section background="surface" labelledBy="lectures">
        <Container>
          <h2 id="lectures" className="section-rule text-display-md text-ink">
            {ABOUT.readingsHeading}
          </h2>
          <Prose className="mt-md">
            <p>{ABOUT.readingsIntro}</p>
          </Prose>

          {readings.length === 0 ? (
            <Prose className="mt-md">
              <p>{ABOUT.readingsEmpty}</p>
            </Prose>
          ) : (
            <ul className="mt-lg grid list-none grid-cols-1 gap-md p-0 sm:grid-cols-2">
              {readings.map((reading) => (
                <li
                  key={reading.id}
                  className="flex flex-col gap-2xs rounded-md border border-border bg-paper px-md py-md"
                >
                  <h3 className="text-body-xl text-ink">{reading.title}</h3>
                  <p className="font-mono text-body-sm text-ink-subtle">{reading.author}</p>
                  <p className="max-w-measure text-body-md text-ink-muted">{reading.takeaway}</p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </main>
  );
}
