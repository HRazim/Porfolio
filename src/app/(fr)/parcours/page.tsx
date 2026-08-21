import type { Metadata } from 'next';

import { PageShell } from '@/components/layout/page-shell';
import { CareerPage } from '@/components/page/career-page';
import type { Locale } from '@/content/i18n';
import { PAGE_META } from '@/content/site-copy';
import { pageMetadata } from '@/lib/page-metadata';

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'fr';

export const metadata: Metadata = pageMetadata({
  locale,
  page: 'career',
  title: PAGE_META.career.title[locale],
  description: PAGE_META.career.description[locale],
  type: 'profile',
});

export default function Page() {
  return (
    <PageShell locale={locale} page="career">
      <CareerPage locale={locale} />
    </PageShell>
  );
}
