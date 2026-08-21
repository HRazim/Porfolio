import type { MetadataRoute } from 'next';

import { alternatesFor, LOCALES, pathFor, type PageKey } from '@/content/i18n';
import { getProjectSlugs } from '@/content/projects';
import { SITE_URL } from '@/lib/site';

/**
 * ---------------------------------------------------------------------------
 * SITEMAP — TRENTE-SIX PAGES, CHACUNE AVEC SES ALTERNATIVES
 * ---------------------------------------------------------------------------
 *
 * AUDIT.md section 6.2 : le site precedent n’avait ni sitemap.xml, ni
 * robots.txt, ni donnees structurees.
 *
 * IL EST DERIVE, JAMAIS ECRIT. Les adresses viennent de `pathFor` et les
 * alternatives de `alternatesFor` — la meme table qui alimente la navigation,
 * le selecteur de langue et les balises `hreflang` des pages. Un sitemap
 * recopie a la main derive de ce qu’il decrit ; celui-ci ne le peut pas.
 *
 * CHAQUE LANGUE Y FIGURE, et chaque entree porte les quatre equivalents.
 * C’est ce que demande la documentation de Google : une page qui declare ses
 * alternatives doit les declarer PARTOUT ou elle est declaree, sitemap
 * compris, et chaque alternative doit renvoyer la politesse. La reciprocite
 * est ici structurelle, puisque les quatre entrees d’un meme gabarit
 * partagent le meme jeu d’alternatives.
 *
 * DEUX PAGES EN SONT ABSENTES, et pour la meme raison : elles sont exclues de
 * l’indexation par leur propre metadonnee `robots`. Le guide de style est un
 * outil de travail interne ; la page 404 repond a une adresse qui n’existe
 * pas. Inscrire au sitemap une page qu’on demande aux robots d’ignorer serait
 * se contredire dans deux fichiers a la fois.
 * ---------------------------------------------------------------------------
 */

/**
 * Route de métadonnées : figée à la construction.
 *
 * Sans cette ligne, `output: 'export'` échoue sur « dynamic = force-static
 * not configured ». Le projet doit rester exportable en statique
 * (CLAUDE.md, règle 6) : la contrainte est vérifiée, pas supposée.
 */
export const dynamic = 'force-static';

/**
 * Frequence de mise a jour et priorite, par GABARIT de page.
 *
 * Elles ne dependent pas de la langue : les quatre versions d’une page ont le
 * meme contenu et changent ensemble. Declarer l’anglais moins prioritaire que
 * le francais reviendrait a dire au robot que la traduction vaut moins que
 * l’original, ce qui n’est pas ce que le site affirme.
 */
const RANK: Readonly<Record<PageKey, { frequency: 'monthly' | 'yearly'; priority: number }>> = {
  home: { frequency: 'monthly', priority: 1 },
  about: { frequency: 'yearly', priority: 0.8 },
  projects: { frequency: 'monthly', priority: 0.8 },
  career: { frequency: 'yearly', priority: 0.6 },
  project: { frequency: 'yearly', priority: 0.7 },
};

/** Adresse absolue. La racine vaut `/` : concatenee telle quelle, elle
    produirait une adresse terminee par une barre, differente de la canonique. */
function absolute(path: string): string {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

/** Les quatre equivalents d’une page, en adresses absolues. */
function languages(page: PageKey, slug?: string): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const [tag, path] of Object.entries(alternatesFor(page, slug))) {
    entries[tag] = absolute(path);
  }
  return entries;
}

function entriesFor(page: PageKey, slug?: string): MetadataRoute.Sitemap {
  const { frequency, priority } = RANK[page];
  return LOCALES.map((locale) => ({
    url: absolute(pathFor(page, locale, slug)),
    changeFrequency: frequency,
    priority,
    alternates: { languages: languages(page, slug) },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: PageKey[] = ['home', 'about', 'projects', 'career'];

  return [
    ...pages.flatMap((page) => entriesFor(page)),
    ...getProjectSlugs().flatMap((slug) => entriesFor('project', slug)),
  ];
}
