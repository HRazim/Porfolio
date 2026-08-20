import { HOME, SHARE_IMAGE } from '@/content/site-copy';
import { OG_CONTENT_TYPE, OG_SIZE, renderShareImage } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/**
 * Vignette de partage du site.
 *
 * Convention de fichier de Next.js : ce module est rendu UNE FOIS à la
 * construction et le résultat est servi en statique. Aucune requête, aucun
 * rendu à la demande, aucune dépendance à l’optimiseur d’images — le projet
 * doit rester exportable en statique.
 *
 * Les balises `og:image`, ses dimensions, son type et son texte alternatif
 * sont posées automatiquement à partir des exports ci-dessous.
 */

/**
 * Route de métadonnées : figée à la construction.
 *
 * Sans cette ligne, `output: 'export'` échoue sur « dynamic = force-static
 * not configured ». Le projet doit rester exportable en statique
 * (CLAUDE.md, règle 6) : la contrainte est vérifiée, pas supposée.
 */
export const dynamic = 'force-static';

export const alt = SHARE_IMAGE.siteAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderShareImage({
    eyebrow: SITE_NAME,
    title: HOME.headline,
    footer: SITE_URL.replace(/^https?:\/\//, ''),
  });
}
