import { getProjectBySlug, getProjectSlugs } from '@/content/projects';
import { SHARE_IMAGE } from '@/content/site-copy';
import { OG_CONTENT_TYPE, OG_SIZE, renderShareImage } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

interface ImageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

/**
 * Vignette de partage propre à chaque réalisation.
 *
 * `generateStaticParams` est redéclaré ici : une route d’image de métadonnées
 * a ses propres paramètres et ne reprend pas ceux de la page. Sans lui, la
 * vignette serait rendue à la demande, ce qui ferait tomber la compatibilité
 * avec l’export statique.
 *
 * POURQUOI PAS `generateImageMetadata`, QUI DONNERAIT UN TEXTE ALTERNATIF PAR
 * RÉALISATION — parce qu’elle introduit un segment dynamique supplémentaire,
 * `[__metadata_id__]`, que `output: 'export'` exige d’énumérer et que
 * `generateStaticParams` ne parvient pas à renseigner : la construction échoue
 * sur « returned incomplete params ». Vérifié, pas supposé. Le texte alternatif
 * est donc unique et décrit le GENRE de vignette ; le titre de la réalisation,
 * lui, est peint dans l’image et repris par `og:title`.
 */

/**
 * Route de métadonnées : figée à la construction.
 *
 * Sans cette ligne, `output: 'export'` échoue sur « dynamic = force-static
 * not configured ». Le projet doit rester exportable en statique
 * (CLAUDE.md, règle 6) : la contrainte est vérifiée, pas supposée.
 */
export const dynamic = 'force-static';

export const alt = SHARE_IMAGE.projectAlt;
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  return renderShareImage({
    eyebrow: SITE_NAME,
    title: project?.title ?? SITE_NAME,
    footer: SITE_URL.replace(/^https?:\/\//, ''),
  });
}
