import { getProjectBySlug, getProjectSlugs } from '@/content/projects';
import { LOCALE_META, type Locale } from '@/content/i18n';
import { SHARE_IMAGE } from '@/content/site-copy';
import { OG_CONTENT_TYPE, OG_SIZE, renderShareImage } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

interface ImageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

/**
 * Vignette de partage propre a chaque realisation, dans la langue de la fiche.
 *
 * `generateStaticParams` est redeclare ici : une route d'image de metadonnees
 * a ses propres parametres et ne reprend pas ceux de la page. Sans lui, la
 * vignette serait rendue a la demande, ce qui ferait tomber la compatibilite
 * avec l'export statique.
 *
 * POURQUOI PAS `generateImageMetadata`, QUI DONNERAIT UN TEXTE ALTERNATIF PAR
 * REALISATION — parce qu'elle introduit un segment dynamique supplementaire,
 * `[__metadata_id__]`, que `output: 'export'` exige d'enumerer et que
 * `generateStaticParams` ne parvient pas a renseigner : la construction echoue
 * sur « returned incomplete params ». Verifie, pas suppose.
 */
export const dynamic = 'force-static';

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'en';

export const alt = SHARE_IMAGE.projectAlt[locale];
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const footer = SITE_URL.replace(/^https?:\/\//, '');

  return renderShareImage({
    eyebrow: SITE_NAME,
    title: project?.title[locale] ?? SITE_NAME,
    footer,
    direction: LOCALE_META[locale].direction,
  });
}
