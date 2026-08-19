import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import { ColorTokenGrid, ContrastTable } from '@/components/styleguide/color-tokens';
import { ScalarTokenList } from '@/components/styleguide/scalar-token-list';
import { SpacingScale } from '@/components/styleguide/spacing-scale';
import { ThemeToggle } from '@/components/styleguide/theme-toggle';
import { TypeSpecimen } from '@/components/styleguide/type-specimen';
import { MAIN_CONTENT_ID, PAGE_META } from '@/content/site-copy';
import {
  DURATION_TOKENS,
  EASING_TOKENS,
  FONT_TOKENS,
  GLYPH_TEST_LINE,
  PANGRAMS,
  RADIUS_TOKENS,
} from '@/lib/design-tokens';

/** Outil de travail interne : exclu de l’indexation. */
export const metadata: Metadata = {
  title: PAGE_META.styleguide.title,
  description: PAGE_META.styleguide.description,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const RADIUS_VARS = RADIUS_TOKENS.map((token) => token.cssVar);
const DURATION_VARS = DURATION_TOKENS.map((token) => token.cssVar);
const EASING_VARS = EASING_TOKENS.map((token) => token.cssVar);

const FAMILY_CLASS: Record<string, string> = {
  display: 'font-display',
  body: 'font-body',
  mono: 'font-mono',
};

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-display-md text-ink">
      {children}
    </h2>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-body-sm text-ink-subtle">{children}</p>;
}

export default function StyleguidePage() {
  return (
    <main id={MAIN_CONTENT_ID}>
      {/* ------------------------------------------------------------------ */}
      <Section spacing="spacious" background="paper">
        <Container>
          <Eyebrow>Outil interne · non indexé</Eyebrow>
          <h1 className="mt-sm text-display-xl text-ink">Design system</h1>
          <Prose size="lead" className="mt-lg">
            <p>
              Cette page rend visibles les jetons du système. Toutes les valeurs
              affichées sont lues à l’exécution sur les variables CSS réelles :
              rien n’est transcrit à la main, donc rien ne peut diverger de la
              définition.
            </p>
          </Prose>
          <div className="mt-xl">
            <ThemeToggle />
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section background="surface" labelledBy="familles">
        <Container>
          <Eyebrow>01</Eyebrow>
          <SectionHeading id="familles">Familles typographiques</SectionHeading>
          <ul className="mt-xl flex list-none flex-col gap-2xl p-0">
            {FONT_TOKENS.map((font, index) => (
              <li key={font.cssVar} className="border-t border-border pt-lg">
                <div className="flex flex-wrap items-baseline gap-x-md gap-y-3xs font-mono text-body-sm text-ink-subtle">
                  <span className="font-medium text-ink">{font.cssVar}</span>
                  <span>{font.family}</span>
                  <span>graisses : {font.weights.join(', ')}</span>
                  <span>sous-ensembles : {font.subsets.join(', ')}</span>
                </div>
                <p className="mt-2xs text-body-sm text-ink-muted">{font.role}</p>

                <p className={`${FAMILY_CLASS[font.name] ?? ''} mt-md text-display-sm text-ink`}>
                  {PANGRAMS[index] ?? PANGRAMS[0]}
                </p>

                <p className="mt-md font-mono text-body-sm text-ink-subtle">
                  Couverture de glyphes
                </p>
                <p className={`${FAMILY_CLASS[font.name] ?? ''} text-body-lg text-ink`}>
                  {GLYPH_TEST_LINE}
                </p>
              </li>
            ))}
          </ul>

          <Prose className="mt-2xl">
            <p>
              <strong>Règle structurante.</strong> Les notations mathématiques et
              les symboles grecs — <code>µ</code> et <code>λ</code> — sont
              composés en monospace, jamais dans la famille de corps de texte.
              Seule <code>--font-mono</code> charge le sous-ensemble grec ; sur
              les deux autres familles, <code>λ</code> déclencherait une
              substitution de police.
            </p>
          </Prose>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section background="paper" labelledBy="echelle">
        <Container>
          <Eyebrow>02</Eyebrow>
          <SectionHeading id="echelle">Échelle typographique</SectionHeading>
          <Prose className="mt-md">
            <p>
              Huit niveaux, raison constante 1,25. La borne haute de chaque
              niveau est exactement la borne basse du niveau supérieur : chaque
              taille parcourt donc un pas d’échelle entre 360 px et 1440 px de
              largeur de fenêtre, par <code>clamp()</code> et sans aucune media
              query.
            </p>
          </Prose>
          <div className="mt-xl">
            <TypeSpecimen />
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section background="surface" labelledBy="couleurs">
        <Container>
          <Eyebrow>03</Eyebrow>
          <SectionHeading id="couleurs">Couleurs</SectionHeading>
          <Prose className="mt-md">
            <p>
              Huit jetons sémantiques, aucun nom littéral. L’espace de noms de
              couleurs de Tailwind est remis à zéro : <code>bg-blue-500</code>{' '}
              n’existe pas, et le bleu du site précédent est structurellement
              inatteignable.
            </p>
          </Prose>

          <div className="mt-xl">
            <ColorTokenGrid />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Conformité WCAG</h3>
          <div className="mt-md">
            <ContrastTable />
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section background="paper" labelledBy="espacement">
        <Container>
          <Eyebrow>04</Eyebrow>
          <SectionHeading id="espacement">Espacement, rayons, mouvement</SectionHeading>

          <h3 className="mt-xl text-display-sm text-ink">Espacement — base 4 px</h3>
          <Prose className="mt-2xs">
            <p>
              Multiplicateurs 1, 2, 3, 4, 6, 8, 12, 16, 24, 32 : la suite de
              doublement entrelacée de ses points milieux à 1,5×.
            </p>
          </Prose>
          <div className="mt-md">
            <SpacingScale />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Rayons — trois valeurs</h3>
          <div className="mt-md">
            <ScalarTokenList tokens={RADIUS_TOKENS} cssVars={RADIUS_VARS} showRadiusPreview />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Durées</h3>
          <div className="mt-md">
            <ScalarTokenList tokens={DURATION_TOKENS} cssVars={DURATION_VARS} />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Courbes d’accélération</h3>
          <div className="mt-md">
            <ScalarTokenList tokens={EASING_TOKENS} cssVars={EASING_VARS} />
          </div>

          <Prose className="mt-2xl">
            <p>
              L’ensemble des transitions, animations et du défilement doux est
              neutralisé sous <code>prefers-reduced-motion: reduce</code>.
            </p>
          </Prose>
        </Container>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section background="surface" labelledBy="primitives">
        <Container>
          <Eyebrow>05</Eyebrow>
          <SectionHeading id="primitives">Primitives de mise en page</SectionHeading>

          <h3 className="mt-xl text-display-sm text-ink">Container</h3>
          <p className="mt-2xs font-mono text-body-sm text-ink-subtle">
            width=&quot;page&quot; · 72rem · marges latérales clamp(16px, 4vw, 64px)
          </p>
          <div className="mt-md border border-dashed border-ink-subtle">
            <Container width="page" className="bg-paper py-md">
              <p className="font-mono text-body-sm text-ink-muted">
                Le trait pointillé marque la fenêtre ; le bloc clair marque le
                conteneur et ses marges.
              </p>
            </Container>
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Prose</h3>
          <p className="mt-2xs font-mono text-body-sm text-ink-subtle">
            max-w-measure · 66ch · mesure entre 60 et 75 caractères
          </p>
          <Prose className="mt-md">
            <p>
              La mesure de ligne est bornée pour rester lisible. Le site
              précédent composait son corps de texte sur environ quatre-vingt-quinze
              caractères, soit vingt-sept pour cent au-delà de la limite haute
              admise en typographie éditoriale. Ce paragraphe existe pour rendre
              la contrainte visible : la ligne se brise avant de fatiguer l’œil,
              quelle que soit la largeur de la fenêtre.
            </p>
          </Prose>

          <h3 className="mt-2xl text-display-sm text-ink">Section</h3>
          <p className="mt-2xs font-mono text-body-sm text-ink-subtle">
            background piloté par une prop, jamais par nth-child
          </p>
          <div className="mt-md overflow-hidden rounded-md border border-border">
            <Section as="div" spacing="compact" background="paper">
              <Container>
                <p className="font-mono text-body-sm text-ink-muted">
                  background=&quot;paper&quot; · spacing=&quot;compact&quot;
                </p>
              </Container>
            </Section>
            <Section as="div" spacing="compact" background="surface">
              <Container>
                <p className="font-mono text-body-sm text-ink-muted">
                  background=&quot;surface&quot; · spacing=&quot;compact&quot;
                </p>
              </Container>
            </Section>
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Grid</h3>
          <p className="mt-2xs font-mono text-body-sm text-ink-subtle">
            display: grid déclaré dans la règle de base · columns=3 · gap=&quot;md&quot;
          </p>
          <Grid as="ul" columns={3} gap="md" className="mt-md">
            {['Alpha', 'Bêta', 'Gamma', 'Delta', 'Epsilon', 'Zêta'].map((label) => (
              <li
                key={label}
                className="rounded-md border border-border bg-paper p-md font-mono text-body-sm text-ink-muted"
              >
                {label}
              </li>
            ))}
          </Grid>
        </Container>
      </Section>
    </main>
  );
}
