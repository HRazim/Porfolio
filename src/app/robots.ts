import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/**
 * robots.txt.
 *
 * `/styleguide` est explicitement interdit : outil de travail interne, il
 * ne doit apparaitre dans aucun index. Il porte de surcroit une metadonnee
 * `robots: noindex, nofollow` et n’est pas dans le sitemap.
 */
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
