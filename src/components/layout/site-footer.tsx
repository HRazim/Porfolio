import { SocialLinks } from '@/components/ui/social-links';
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
export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const years =
    currentYear > SITE_FOUNDED_YEAR ? `${SITE_FOUNDED_YEAR}–${currentYear}` : `${SITE_FOUNDED_YEAR}`;

  return (
    <footer className="border-t border-border bg-surface py-2xl">
      <Container className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-body-sm text-ink-subtle">
          {`© ${years} ${SITE_NAME}. ${FOOTER.copyright}`}
        </p>
        <SocialLinks label={FOOTER.socialLabel} />
      </Container>
    </footer>
  );
}
