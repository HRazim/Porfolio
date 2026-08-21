import { HOME, SHARE_IMAGE } from '@/content/site-copy';
import { LOCALE_META, type Locale } from '@/content/i18n';
import { OG_CONTENT_TYPE, OG_SIZE, renderShareImage } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/**
 * Vignette de partage du site, DANS SA LANGUE.
 *
 * Convention de fichier de Next.js : ce module est rendu UNE FOIS a la
 * construction et le resultat est servi en statique. Une vignette par langue,
 * parce qu'elle peint l'accroche : servir la francaise sur une page anglaise
 * reviendrait a lui donner une metadonnee redigee dans une autre langue.
 */

/**
 * Route de metadonnees : figee a la construction.
 *
 * Sans cette ligne, `output: 'export'` echoue sur « dynamic = force-static
 * not configured ». Le projet doit rester exportable en statique
 * (CLAUDE.md, regle 6) : la contrainte est verifiee, pas supposee.
 */
export const dynamic = 'force-static';

/**
 * Langue de cette route. Declaree, jamais deduite : c'est le SEUL role de ce
 * fichier, avec le montage du composant de page partage.
 */
const locale: Locale = 'ar';

export const alt = SHARE_IMAGE.siteAlt[locale];
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  const footer = SITE_URL.replace(/^https?:\/\//, '');

  return renderShareImage({
    eyebrow: SITE_NAME,
    title: HOME.headline[locale],
    footer,
    direction: LOCALE_META[locale].direction,
  });
}
