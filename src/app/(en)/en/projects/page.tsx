import type { Metadata } from 'next';

import { PageShell } from '@/components/layout/page-shell';
import { ProjectsIndexPage } from '@/components/page/projects-page';
import type { Locale } from '@/content/i18n';
import { PAGE_META } from '@/content/site-copy';
import { pageMetadata } from '@/lib/page-metadata';

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'en';

export const metadata: Metadata = pageMetadata({
  locale,
  page: 'projects',
  title: PAGE_META.projects.title[locale],
  description: PAGE_META.projects.description[locale],
  type: 'website',
});

export default function Page() {
  return (
    <PageShell locale={locale} page="projects">
      <ProjectsIndexPage locale={locale} />
    </PageShell>
  );
}
