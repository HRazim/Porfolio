import type { Metadata } from 'next';

import { PageShell } from '@/components/layout/page-shell';
import { ProjectPage, projectMetadata } from '@/components/page/project-page';
import type { Locale } from '@/content/i18n';
import { getProjectSlugs } from '@/content/projects';

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'fr';

interface RouteProps {
  readonly params: Promise<{ readonly slug: string }>;
}

/** Une route statique par realisation, alimentee par le schema de contenu. */
export function generateStaticParams(): { slug: string }[] {
  return getProjectSlugs().map((slug) => ({ slug }));
}

/** Aucune route hors de celles generees : rien n'est rendu a la demande. */
export const dynamicParams = false;

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  return projectMetadata(locale, slug);
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;

  return (
    <PageShell locale={locale} page="project" slug={slug}>
      <ProjectPage locale={locale} slug={slug} />
    </PageShell>
  );
}
