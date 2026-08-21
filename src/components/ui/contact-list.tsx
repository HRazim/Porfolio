import type { Locale } from '@/content/i18n';
import { CONTACT_POINTS, type ContactKind } from '@/lib/site';

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
/**
 * Quelle coordonnee reste de gauche a droite en toute langue ?
 *
 * Une adresse electronique est un IDENTIFIANT : elle s'ecrit dans le meme
 * sens partout, et l'arobase comme le point qui l'entourent sont des
 * caracteres neutres que l'algorithme bidirectionnel deplacerait dans une
 * phrase arabe. Une localite, elle, est un nom de lieu : « باريس، فرنسا »
 * s'ecrit de droite a gauche comme le reste de la page.
 *
 * Une table plutot qu'un branchement dans le JSX : la question se pose une
 * fois par nature de coordonnee, et la reponse se lit d'un coup d'oeil.
 */
const LATIN_VALUE: Readonly<Record<ContactKind, boolean>> = {
  email: true,
  location: false,
};

export function ContactList({ locale }: { readonly locale: Locale }) {
  return (
    <address className="not-italic">
      {/* EN COLONNE SOUS `sm`, EN LIGNE AU-DESSUS. Deux coordonnees empilees
          occupaient deux etages pour dire deux choses courtes, et poussaient le
          bouton du CV a flotter seul en face. En ligne, elles forment un groupe
          avec lui. `flex-wrap` les laisse repasser a la ligne si la place
          manque — en arabe, ou les libelles sont plus longs, cela arrive. */}
      <ul className="flex list-none flex-col gap-sm p-0 sm:flex-row sm:flex-wrap sm:items-start sm:gap-lg">
        {CONTACT_POINTS.map((point) => {
          const Icon = CONTACT_ICONS[point.kind];
          const dir = LATIN_VALUE[point.kind] ? 'ltr' : undefined;
          return (
            <li key={point.kind} className="flex items-start gap-sm">
              <Icon size="sm" className="mt-3xs text-ink-subtle" />
              <span className="flex flex-col gap-3xs">
                <span className="font-mono text-body-sm text-ink-subtle">{point.label[locale]}</span>
                {point.href === null ? (
                  <span dir={dir} className="text-body-md text-ink">
                    {point.display[locale]}
                  </span>
                ) : (
                  <a
                    dir={dir}
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
