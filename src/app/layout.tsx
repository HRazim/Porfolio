import type { Metadata } from 'next';

import { fontVariables } from '@/lib/fonts';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fondations',
    template: '%s · Fondations',
  },
  description:
    'Fondations techniques et visuelles du portfolio en cours de refonte : design system, echelle typographique et primitives de mise en page.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-theme` est la source de verite unique du theme (voir globals.css).
    // `suppressHydrationWarning` : l'attribut est reecrit cote client par la
    // bascule de theme, apres hydratation.
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <body className={fontVariables}>{children}</body>
    </html>
  );
}
