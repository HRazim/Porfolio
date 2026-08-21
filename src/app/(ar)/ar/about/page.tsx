import type { Metadata } from 'next';

import { PageShell } from '@/components/layout/page-shell';
import { AboutPage } from '@/components/page/about-page';
import type { Locale } from '@/content/i18n';
import { PAGE_META } from '@/content/site-copy';
import { pageMetadata } from '@/lib/page-metadata';

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'ar';

export const metadata: Metadata = pageMetadata({
  locale,
  page: 'about',
  title: PAGE_META.about.title[locale],
  description: PAGE_META.about.description[locale],
  type: 'profile',
});

export default function Page() {
  return (
    <PageShell locale={locale} page="about">
      <AboutPage locale={locale} />
    </PageShell>
  );
}
