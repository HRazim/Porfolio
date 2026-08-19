import Link from 'next/link';

import { Container } from '@/components/layout/container';
import { Prose } from '@/components/layout/prose';
import { Section } from '@/components/layout/section';

/**
 * Page d'accueil — espace reserve.
 *
 * Aucun contenu reel du portfolio n'apparait a ce stade : ni nom, ni projet,
 * ni coordonnees, ni photographie. Le contenu fera l'objet d'une etape
 * ulterieure.
 */
export default function HomePage() {
  return (
    <Section as="main" spacing="spacious">
      <Container>
        <p className="font-mono text-body-sm text-ink-subtle">Espace reserve</p>
        <h1 className="mt-sm text-display-lg text-ink">Fondations</h1>
        <Prose size="lead" className="mt-lg">
          <p>
            Le systeme typographique, la palette, l’echelle d’espacement et les
            primitives de mise en page sont en place. Le contenu editorial sera
            pose lors d’une etape ulterieure.
          </p>
          <p>
            <Link href="/styleguide">Consulter la page de demonstration du design system</Link>
          </p>
        </Prose>
      </Container>
    </Section>
  );
}
