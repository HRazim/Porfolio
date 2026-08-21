import type { Metadata } from 'next';

import { PageShell } from '@/components/layout/page-shell';
import { HomePage } from '@/components/page/home-page';
import type { Locale } from '@/content/i18n';
import { homeMetadata } from '@/lib/page-metadata';

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'en';

export const metadata: Metadata = homeMetadata(locale);

export default function Page() {
  return (
    <PageShell locale={locale} page="home">
      <HomePage locale={locale} />
    </PageShell>
  );
}
