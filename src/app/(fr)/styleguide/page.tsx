import type { Metadata } from 'next';

import { Container } from '@/components/layout/container';
import { PageShell } from '@/components/layout/page-shell';
import { Grid } from '@/components/layout/grid';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';
import {
  AccentComparison,
  ColorTokenGrid,
  ContrastTable,
  ModeMatrix,
} from '@/components/styleguide/color-tokens';
import { ScalarTokenList } from '@/components/styleguide/scalar-token-list';
import { SpacingScale } from '@/components/styleguide/spacing-scale';
import { ModeToggle } from '@/components/layout/mode-toggle';
import { TypeSpecimen } from '@/components/styleguide/type-specimen';
import type { Locale } from '@/content/i18n';
import { MAIN_CONTENT_ID, PAGE_META } from '@/content/site-copy';
import {
  DURATION_TOKENS,
  EASING_TOKENS,
  FONT_TOKENS,
  GLYPH_TEST_LINE,
  PANGRAMS,
  RADIUS_TOKENS,
  RULE_TOKENS,
  SHIFT_TOKENS,
} from '@/lib/design-tokens';

/**
 * Outil de travail interne : exclu de l’indexation.
 *
 * Le canonique est reecrit vers cette page elle-meme. Sans cette ligne, la
 * route heritait du `alternates.canonical: '/'` de la mise en page racine et
 * declarait donc au robot que le styleguide EST la page d’accueil — une
 * affirmation fausse, et bien plus dommageable que l’absence de balise.
 *
 * Reecrire plutot que supprimer : `noindex` et `canonical` ne repondent pas a
 * la meme question, un robot reste libre d’ignorer le premier, et le jour ou
 * l’exclusion sautera, un canonique auto-referent restera juste. Une balise
 * qui ne ment jamais coute une ligne.
 */
/**
 * Langue de cette route.
 *
 * Declaree en constante plutot que deduite : chaque route de langue porte
 * la sienne, et le composant de page n'a jamais a la deviner.
 */
const locale: Locale = 'fr';

export const metadata: Metadata = {
  title: PAGE_META.styleguide.title[locale],
  description: PAGE_META.styleguide.description[locale],
  alternates: { canonical: '/styleguide' },
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
const RULE_VARS = RULE_TOKENS.map((token) => token.cssVar);
const SHIFT_VARS = SHIFT_TOKENS.map((token) => token.cssVar);

/**
 * Densite verticale des sections, avant et apres.
 *
 * Les deux etats sont rendus par de VRAIES classes, jamais par une valeur
 * ecrite ici : l'ancienne emploie les utilitaires d'echelle d'origine, la
 * nouvelle les jetons fluides. Comparer deux blocs cote a cote dit plus qu'un
 * tableau de nombres.
 */
const SECTION_DENSITY = [
  {
    name: 'compact',
    before: 'avant — 64 px fixes',
    after: 'après — 24 → 48 px fluides',
    beforeClass: 'py-2xl',
    afterClass: 'py-section-compact',
  },
  {
    name: 'default',
    before: 'avant — 96 px fixes',
    after: 'après — 32 → 64 px fluides',
    beforeClass: 'py-3xl',
    afterClass: 'py-section-default',
  },
  {
    name: 'spacious',
    before: 'avant — 128 px fixes',
    after: 'après — 48 → 96 px fluides',
    beforeClass: 'py-4xl',
    afterClass: 'py-section-spacious',
  },
] as const;

const FAMILY_CLASS: Record<string, string> = {
  display: 'font-display',
  body: 'font-body',
  mono: 'font-mono',
};

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="section-rule text-display-md text-ink">
      {children}
    </h2>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-body-sm text-ink-subtle">{children}</p>;
}

export default function StyleguidePage() {
  return (
    /* `page={null}` : cette page n'existe qu'en francais. Le selecteur de
       langue renvoie donc a l'accueil de la langue visee — la seule
       destination qu'on puisse promettre sans mentir. */
    <PageShell locale={locale} page={null}>
    <main id={MAIN_CONTENT_ID}>
      {/* ------------------------------------------------------------------ */}
      <Section spacing="spacious" background="paper">
        <Container>
          <Eyebrow>Outil interne · non indexé</Eyebrow>
          <h1 className="section-rule mt-sm text-display-xl text-ink">Design system</h1>
          <Prose size="lead" className="mt-lg">
            <p>
              Cette page rend visibles les jetons du système. Toutes les valeurs
              affichées sont lues à l’exécution sur les variables CSS réelles :
              rien n’est transcrit à la main, donc rien ne peut diverger de la
              définition.
            </p>
          </Prose>
          <div className="mt-xl">
            <ModeToggle locale={locale} />
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
              Onze jetons sémantiques, aucun nom littéral. L’espace de noms de
              couleurs de Tailwind est remis à zéro : <code>bg-blue-500</code>{' '}
              n’existe pas, et le bleu du site précédent est structurellement
              inatteignable. Les valeurs ont été résolues, non choisies : pour
              chaque jeton soumis à un seuil, la clarté est cherchée par
              dichotomie jusqu’au ratio visé, puis la chroma est poussée au bord
              du gamut sRGB à clarté constante.
            </p>
          </Prose>

          <div className="mt-xl">
            <ColorTokenGrid />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Conformité WCAG</h3>
          <div className="mt-md">
            <ContrastTable />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Les deux accents</h3>
          <Prose className="mt-2xs">
            <p>
              L’accent lisible porte le texte et reste soumis au seuil de
              4,5:1, ce qui l’oblige à rester profond. L’accent vif porte les
              surfaces — filets de titre, bords de carte, encadrés, puces,
              soulignements — et n’est donc tenu qu’à se détacher du fond. Les
              deux sont posés côte à côte, sur le fond réel de leur mode. Leur
              écart perceptuel dépasse désormais dix unités OKLab dans les deux
              modes ; il n’était que de 2,1 en mode sombre, soit le seuil même
              de la perception.
            </p>
          </Prose>
          <div className="mt-xl">
            <AccentComparison />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Les deux modes</h3>
          <Prose className="mt-2xs">
            <p>
              Les onze jetons, dans les deux modes. Chaque pastille montre le
              jeton tel que le navigateur l’applique, sa valeur et son ratio sur
              le fond qui le concerne. Toute case sous 4,5:1 est cerclée
              d’accent vif et porte la mention <code>ÉCHEC AA</code>.
            </p>
          </Prose>
          <div className="mt-xl">
            <ModeMatrix />
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

          <h3 className="mt-2xl text-display-sm text-ink">
            Densité verticale des sections
          </h3>
          <Prose className="mt-2xs">
            <p>
              Les trois amplitudes du composant <code>Section</code>, avant et
              après. L’ancienne colonne emploie les utilitaires d’origine, la
              nouvelle les jetons fluides : les deux sont rendues côte à côte,
              donc la comparaison porte sur le rendu réel et non sur des
              chiffres.
            </p>
          </Prose>
          <ul className="mt-xl grid list-none grid-cols-1 gap-lg p-0 sm:grid-cols-3">
            {SECTION_DENSITY.map((variant) => (
              <li key={variant.name} className="flex flex-col gap-2xs">
                <p className="font-mono text-body-sm font-medium text-ink">{variant.name}</p>
                <p className="font-mono text-body-sm text-ink-subtle">{variant.before}</p>
                <div className={`${variant.beforeClass} rounded-md border border-border bg-surface`}>
                  <p className="text-center font-mono text-body-sm text-ink-muted">avant</p>
                </div>
                <p className="mt-2xs font-mono text-body-sm text-ink-subtle">{variant.after}</p>
                <div className={`${variant.afterClass} rounded-md border border-accent-vivid bg-accent-soft`}>
                  <p className="text-center font-mono text-body-sm text-ink">après</p>
                </div>
              </li>
            ))}
          </ul>

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

          <h3 className="mt-2xl text-display-sm text-ink">Épaisseurs de filet</h3>
          <div className="mt-md">
            <ScalarTokenList tokens={RULE_TOKENS} cssVars={RULE_VARS} />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Amplitudes de mouvement</h3>
          <div className="mt-md">
            <ScalarTokenList tokens={SHIFT_TOKENS} cssVars={SHIFT_VARS} />
          </div>

          <h3 className="mt-2xl text-display-sm text-ink">Les cinq animations</h3>
          <Prose className="mt-2xs">
            <p>
              Aucune ne retarde la lecture : le contenu est rendu statiquement
              et présent dans le HTML servi. Aucune ne conditionne une
              fonction. Toutes puisent leurs durées et leurs courbes dans les
              jetons ci-dessus. Surtout, <strong>aucune ne pose une opacité
              nulle en état de repos</strong> : la seule opacité nulle du
              projet est le premier keyframe de <code>enter-rise</code>, dans
              une animation à durée finie qui se termine d’elle-même.
            </p>
            <ul>
              <li>
                Entrée en cascade de l’en-tête, au chargement — quatre rangs
                déclarés par <code>data-enter</code>, trois pas de{' '}
                <code>--duration-stagger</code>, durée{' '}
                <code>--duration-slow</code> : 560 ms au total. Une sixième
                animation a existé, une apparition des sections au défilement ;
                elle masquait le contenu et confiait sa révélation à un
                observateur. Elle a été retirée.
              </li>
              <li>
                Soulignement balayé des liens de navigation et de fiche —{' '}
                <code>--duration-base</code>, au survol et au focus.
              </li>
              <li>
                Élévation des cartes de réalisation —{' '}
                <code>--duration-base</code>, translation{' '}
                <code>--shift-lift</code>, bordure en accent vif.
              </li>
              <li>
                Retour visuel du bouton d’action — anneau en accent vif au
                survol, retour au repos à l’activation.
              </li>
              <li>
                Fondu des couleurs à la bascule de mode —{' '}
                <code>--duration-base</code>, armé le temps du basculement
                seulement.
              </li>
            </ul>
            <p>
              Les cinq sont neutralisées par{' '}
              <code>prefers-reduced-motion: reduce</code>, avec le défilement
              doux. Sous cette préférence le script d’amorçage ne pose même pas{' '}
              <code>data-motion</code>.
            </p>
          </Prose>

          <h3 className="mt-2xl text-display-sm text-ink">L’accent en situation</h3>
          <Prose className="mt-2xs">
            <p>
              Les cinq surfaces qui portent l’accent vif. Survolez-les, et
              parcourez-les au clavier : le focus reçoit le même retour visuel
              que la souris.
            </p>
          </Prose>
          <div className="mt-xl flex flex-col gap-lg">
            <div className="accent-panel p-md">
              <p className="text-body-md text-ink-muted">
                Encadré de mise en valeur : aplat en accent doux, bord en accent
                vif, épaissi du côté du texte.
              </p>
            </div>

            <ul className="flex list-none flex-wrap gap-2xs p-0">
              {['accent-chip', 'accent-soft', 'accent-vivid'].map((label) => (
                <li key={label} className="accent-chip px-sm py-2xs font-mono text-body-sm">
                  {label}
                </li>
              ))}
            </ul>

            <div className="project-card p-md">
              <p className="text-body-md text-ink-muted">
                Carte : bord supérieur en accent vif au repos, pourtour entier au
                survol, élévation de <code>--shift-lift</code>.
              </p>
            </div>

            <p>
              <button type="button" className="button-primary inline-flex items-center gap-2xs px-md py-sm font-mono text-body-sm">
                Action principale
              </button>
            </p>

            <p>
              <a
                href="#espacement"
                className="link-sweep inline-block font-mono text-body-sm text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
              >
                Soulignement balayé
              </a>
              <a
                href="#espacement"
                className="link-underline ms-md font-mono text-body-sm text-accent transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
              >
                Soulignement natif, décoration en accent vif
              </a>
            </p>
          </div>
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
    </PageShell>
  );
}
