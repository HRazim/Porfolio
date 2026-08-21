/**
 * Ce composant sert LES QUATRE LANGUES. Il n'en choisit aucune : la langue
 * arrive par la propriete `locale`, et les quatre fichiers de route qui
 * l'appellent — un par langue — sont les seuls a la declarer.
 */
import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { getReadings } from '@/content/career';
import type { Locale } from '@/content/i18n';
import { ABOUT, ABOUT_PARAGRAPHS, MAIN_CONTENT_ID } from '@/content/site-copy';

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
export function AboutPage({ locale }: { readonly locale: Locale }) {
  const readings = getReadings();

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
        <Container width="measure">
          <p className="font-mono text-body-sm text-ink-subtle">{ABOUT.eyebrow[locale]}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">{ABOUT.heading[locale]}</h1>
          <Prose className="mt-xl">
            {ABOUT_PARAGRAPHS[locale].map((paragraph) => (
              <p key={paragraph} data-enter="1">
                {paragraph}
              </p>
            ))}
          </Prose>
        </Container>
      </Section>

      <Section background="surface" labelledBy="lectures" enter={2}>
        <Container>
          <h2 id="lectures" className="section-rule text-display-md text-ink">
            {ABOUT.readingsHeading[locale]}
          </h2>
          <Prose className="mt-md">
            <p>{ABOUT.readingsIntro[locale]}</p>
          </Prose>

          {readings.length === 0 ? (
            <Prose className="mt-md">
              <p>{ABOUT.readingsEmpty[locale]}</p>
            </Prose>
          ) : (
            <ul className="mt-lg grid list-none grid-cols-1 gap-md p-0 sm:grid-cols-2">
              {readings.map((reading) => (
                <li
                  key={reading.id}
                  className="flex flex-col gap-2xs rounded-md border border-border bg-paper px-md py-md"
                >
                  <h3 className="text-body-xl text-ink">{reading.title[locale]}</h3>
                  <p className="font-mono text-body-sm text-ink-subtle">{reading.author[locale]}</p>
                  <p className="max-w-measure text-body-md text-ink-muted">{reading.takeaway[locale]}</p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </main>
  );
}
