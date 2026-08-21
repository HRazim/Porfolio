import type { Locale } from '@/content/i18n';
import { COMMON, MAIN_CONTENT_ID } from '@/content/site-copy';

/**
 * Lien d’evitement vers le contenu principal.
 *
 * Premier element focalisable de chaque page, invisible tant qu’il n’a pas
 * le focus. AUDIT.md section 5.4 : le site precedent n’en possedait aucun,
 * et obligeait un utilisateur au clavier a traverser les six liens de
 * l’en-tete sur chacune des trois pages.
 *
 * Rendu cote serveur.
 */
export function SkipLink({ locale }: { readonly locale: Locale }) {
  return (
    <a href={`#${MAIN_CONTENT_ID}`} className="skip-link">
      {COMMON.skipToContent[locale]}
    </a>
  );
}
