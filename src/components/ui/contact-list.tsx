import type { Locale } from '@/content/i18n';
import { CONTACT_POINTS } from '@/lib/site';

import { CONTACT_ICONS } from './icons';

/**
 * Coordonnees, dans un element `<address>`.
 *
 * AUDIT.md section 5.4 et 5.5 : le site precedent posait le telephone et le
 * courriel dans de simples `<span>`, donc inutilisables sur mobile, et
 * empilait quatre `<div class="card">` la ou une liste dans un `<address>`
 * est la structure prevue.
 *
 * Rendu cote serveur.
 */
export function ContactList({ locale }: { readonly locale: Locale }) {
  return (
    <address className="not-italic">
      <ul className="flex list-none flex-col gap-sm p-0">
        {CONTACT_POINTS.map((point) => {
          const Icon = CONTACT_ICONS[point.kind];
          return (
            <li key={point.kind} className="flex items-start gap-sm">
              <Icon size="sm" className="mt-3xs text-ink-subtle" />
              <span className="flex flex-col gap-3xs">
                <span className="font-mono text-body-sm text-ink-subtle">{point.label[locale]}</span>
                {point.href === null ? (
                  <span className="text-body-md text-ink">
                    {point.display[locale]}
                  </span>
                ) : (
                  <a
                    href={point.href}
                    className="text-body-md text-ink link-underline transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
                  >
                    {point.display[locale]}
                  </a>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </address>
  );
}
