import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/**
 * robots.txt.
 *
 * `/styleguide` est explicitement interdit : outil de travail interne, il
 * ne doit apparaitre dans aucun index. Il porte de surcroit une metadonnee
 * `robots: noindex, nofollow` et n’est pas dans le sitemap.
 */

/**
 * Route de métadonnées : figée à la construction.
 *
 * Sans cette ligne, `output: 'export'` échoue sur « dynamic = force-static
 * not configured ». Le projet doit rester exportable en statique
 * (CLAUDE.md, règle 6) : la contrainte est vérifiée, pas supposée.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/styleguide',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
