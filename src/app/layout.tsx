import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import { fontVariables } from '@/lib/fonts';
import { SITE_LANG } from '@/lib/site';

import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-theme` est la source de verite unique du theme (voir globals.css).
    // `suppressHydrationWarning` : l'attribut est reecrit cote client par la
    // bascule de theme du styleguide, apres hydratation.
    <html lang={SITE_LANG} data-theme="light" suppressHydrationWarning>
      <body className={fontVariables}>
        <SkipLink />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
