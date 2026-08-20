import type { MetadataRoute } from 'next';

import { getProjectSlugs } from '@/content/projects';
import { SITE_URL } from '@/lib/site';

/**
 * Sitemap, alimente par le schema de contenu.
 *
 * AUDIT.md section 6.2 : le site precedent n’avait ni sitemap.xml, ni
 * robots.txt, ni donnees structurees.
 *
 * `/styleguide` en est volontairement absent : c’est un outil de travail
 * interne, exclu de l’indexation par sa propre metadonnee `robots`.
 */

/**
 * Route de métadonnées : figée à la construction.
 *
 * Sans cette ligne, `output: 'export'` échoue sur « dynamic = force-static
 * not configured ». Le projet doit rester exportable en statique
 * (CLAUDE.md, règle 6) : la contrainte est vérifiée, pas supposée.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/a-propos`, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/realisations`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/parcours`, changeFrequency: 'yearly', priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getProjectSlugs().map((slug) => ({
    url: `${SITE_URL}/realisations/${slug}`,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
