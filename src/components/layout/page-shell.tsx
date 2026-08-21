import type { ReactNode } from 'react';

import type { Locale, PageKey } from '@/content/i18n';

import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { SkipLink } from './skip-link';

/**
 * ---------------------------------------------------------------------------
 * COQUE DE PAGE — LIEN D’ÉVITEMENT, EN-TÊTE, CONTENU, PIED
 * ---------------------------------------------------------------------------
 *
 * ELLE ÉTAIT DANS LA MISE EN PAGE. Elle est descendue d’un cran, dans les
 * pages, POUR UNE SEULE RAISON : le sélecteur de langue doit pointer vers la
 * MÊME page dans la langue visée, et une mise en page ne sait pas quelle page
 * elle enveloppe. Elle reçoit `children`, pas leur identité.
 *
 * Les deux façons d’y remédier :
 *
 *   1. lire l’adresse courante dans le navigateur avec `usePathname`, donc
 *      faire du sélecteur un composant client, et parier sur ce que ce
 *      module renvoie pendant le prérendu d’une route dynamique ;
 *
 *   2. faire descendre l’en-tête là où l’identité de la page est connue —
 *      dans la page.
 *
 * La seconde ne coûte rien et ne suppose rien : les quatre liens sont écrits
 * dans le HTML servi, exacts, suivables par un robot, sans une ligne de
 * JavaScript. C’est celle-ci.
 *
 * LE DOM NE CHANGE PAS. La mise en page rendait `SkipLink`, `SiteHeader`,
 * `children`, `SiteFooter` dans cet ordre ; cette coque rend la même suite.
 * Seule change la profondeur à laquelle React la compose.
 * ---------------------------------------------------------------------------
 */
export interface PageShellProps {
  readonly locale: Locale;
  /**
   * Identité de la page, transmise au sélecteur de langue.
   *
   * `null` pour une page sans équivalent dans les autres langues — le guide
   * de style et la page 404.
   */
  readonly page: PageKey | null;
  /** Identifiant de réalisation, pour une fiche. */
  readonly slug?: string;
  readonly children: ReactNode;
}

export function PageShell({ locale, page, slug, children }: PageShellProps) {
  return (
    <>
      <SkipLink locale={locale} />
      <SiteHeader locale={locale} page={page} slug={slug} />
      {children}
      <SiteFooter locale={locale} />
    </>
  );
}
