import { HOME, SHARE_IMAGE } from '@/content/site-copy';
import { LOCALE_META, type Locale } from '@/content/i18n';
import { OG_CONTENT_TYPE, OG_SIZE, renderShareImage } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

/**
 * Vignette de partage de cette page, dans sa langue.
 *
 * POURQUOI UNE PAR SEGMENT DE PAGE. Verifie sur le HTML produit : la
 * convention de fichier n'alimente que le segment ou elle vit, et une page qui
 * declare son propre bloc `openGraph` ne recoit AUCUNE vignette si son segment
 * n'en porte pas. L'URL injectee porte par ailleurs une empreinte
 * imprevisible depuis le code — la seule facon de ne jamais l'ecrire faux est
 * de ne jamais l'ecrire.
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
