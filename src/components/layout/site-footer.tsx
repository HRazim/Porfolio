import { SocialLinks } from '@/components/ui/social-links';
import type { Locale } from '@/content/i18n';
import { FOOTER } from '@/content/site-copy';
import { SITE_FOUNDED_YEAR, SITE_NAME } from '@/lib/site';

import { Container } from './container';

/**
 * Pied de page unique.
 *
 * AUDIT.md section 3.6 : le pied de page etait recopie trois fois, et les
 * copies avaient deja divergé — sur `plateformeWeb.html`, le paragraphe de
 * copyright etait a l’interieur du conteneur, a l’exterieur sur les deux
 * autres pages.
 *
 * Rendu cote serveur.
 */
export function SiteFooter({ locale }: { readonly locale: Locale }) {
  const currentYear = new Date().getFullYear();
  const years =
    currentYear > SITE_FOUNDED_YEAR ? `${SITE_FOUNDED_YEAR}–${currentYear}` : `${SITE_FOUNDED_YEAR}`;

  // `bg-paper`, ET NON `bg-surface`. Le systeme n’a que deux fonds : `paper`
  // est celui de la page, `surface` est celui qui se souleve. Le pied portait
  // le second — il etait donc le bloc le plus appuye de la page, pour son
  // contenu le moins important, et sur l’accueil il pesait plus lourd que la
  // section de contact qui le precede.
  //
  // Sur `paper`, il se confond avec le fond du document, et c’est ce qu’on lui
  // demande. Ce qui le separe de ce qui precede n’est plus une couleur mais un
  // filet : assez pour une cloture, trop peu pour attirer l’oeil. L’alternance
  // des sections, elle, ne change pas.
  //
  // Le rythme suit : `py-xl` au lieu de `py-2xl`. Soixante-quatre pixels de
  // part et d’autre d’une ligne de mentions legales revenaient a lui donner
  // l’amplitude d’une section de contenu.
  return (
    <footer className="border-t border-border bg-paper py-xl">
      <Container className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-body-sm text-ink-subtle">
          {`© ${years} ${SITE_NAME}. ${FOOTER.copyright[locale]}`}
        </p>
        <SocialLinks locale={locale} label={FOOTER.socialLabel[locale]} />
      </Container>
    </footer>
  );
}
