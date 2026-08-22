import { LOCALE_META, LOCALES, pathFor, type Locale, type PageKey } from '@/content/i18n';
import { LANGUAGE_PICKER } from '@/content/site-copy';
import { cn } from '@/lib/cn';

/**
 * ---------------------------------------------------------------------------
 * SÉLECTEUR DE LANGUE — QUATRE LIENS, AUCUN ÉTAT
 * ---------------------------------------------------------------------------
 *
 * RENDU CÔTÉ SERVEUR, et c’est le point important. Changer de langue, ici,
 * c’est changer de page : chaque option est un `<a href>` vers l’URL de la
 * même page dans la langue visée. Un moteur d’indexation peut la suivre, un
 * visiteur peut l’ouvrir dans un nouvel onglet, et la copier depuis la barre
 * d’adresse donne un lien qui fonctionne. Aucun bouton, aucun gestionnaire
 * d’événement, aucun composant client.
 *
 * La destination est calculée par `pathFor`, à partir de la table des routes.
 * Le sélecteur ne connaît donc aucune URL : il reçoit l’identité de la page
 * et laisse la table décider. C’est ce qui garantit que `/parcours` mène à
 * `/en/career` et non à `/en/parcours`.
 *
 * LA PERSISTANCE N’EST PAS ICI. Elle est dans le script d’amorçage de
 * src/content/i18n.ts : la page d’arrivée enregistre sa propre langue. Un
 * gestionnaire de clic sur ces liens aurait exigé un composant client pour
 * une écriture que la page suivante fait de toute façon.
 *
 * ---------------------------------------------------------------------------
 * NOM ACCESSIBLE
 * ---------------------------------------------------------------------------
 *
 * Chaque option porte SES DEUX libellés : le code court et le nom de la langue
 * écrit dans cette langue. L’un est visible, l’autre réservé aux lecteurs
 * d’écran, selon la variante — mais tous deux comptent dans le nom accessible.
 *
 * Ce n’est pas de la redondance. Si le code court était masqué par
 * `aria-hidden`, le nom accessible de l’option arabe serait « العربية » alors
 * que l’écran affiche « AR » : le critère WCAG 2.5.3 « Label in Name »
 * (niveau A) exige que le nom accessible CONTIENNE le texte visible. En les
 * gardant tous les deux, il le contient toujours.
 *
 * `lang` sur le nom natif fait basculer la voix de synthèse : « Français »
 * n’est pas prononçable par une voix arabe, ni « العربية » par une voix
 * française.
 *
 * `hrefLang` annonce la langue de la RESSOURCE VISÉE, ce qui n’est pas la même
 * information — l’un décrit le texte de l’élément, l’autre ce qu’il y a au
 * bout du lien.
 * ---------------------------------------------------------------------------
 */

/** `compact` pour l’en-tête — codes courts ; `full` pour le menu mobile. */
export type LanguagePickerVariant = 'compact' | 'full';

export interface LanguagePickerProps {
  readonly locale: Locale;
  /**
   * Page vers laquelle pointer dans les autres langues.
   *
   * `null` pour une page sans équivalent traduit — le guide de style et la
   * page 404. Les options mènent alors à l’accueil de la langue visée, seule
   * destination qu’on puisse promettre sans mentir.
   */
  readonly page: PageKey | null;
  /** Identifiant de réalisation, pour une fiche. */
  readonly slug?: string;
  readonly variant?: LanguagePickerVariant;
  readonly className?: string;
}

const LIST_CLASS: Record<LanguagePickerVariant, string> = {
  compact: 'flex-row items-center gap-3xs',
  full: 'flex-col items-start gap-2xs',
};

const LINK_CLASS: Record<LanguagePickerVariant, string> = {
  compact: 'rounded-sm px-2xs py-3xs font-mono text-body-sm',
  full: 'rounded-sm px-2xs py-2xs text-body-md',
};

export function LanguagePicker({
  locale,
  page,
  slug,
  variant = 'compact',
  className,
}: LanguagePickerProps) {
  return (
    <nav aria-label={LANGUAGE_PICKER.label[locale]} className={className}>
      <ul className={cn('flex list-none p-0', LIST_CLASS[variant])}>
        {LOCALES.map((target) => {
          const meta = LOCALE_META[target];
          const isCurrent = target === locale;
          const compact = variant === 'compact';

          // Le meme habillage pour les deux formes : seule change la nature de
          // l’element, jamais son apparence.
          const shell = cn(
            LINK_CLASS[variant],
            'inline-block transition-colors duration-[var(--duration-fast)] ease-out',
            // `text-ink` ET NON `text-accent` SUR CET APLAT. Mesure sur les
            // pixels rendus : l’accent sur `--color-accent-soft` donne 3,87:1
            // dans les deux thèmes — sous les 4,5:1 exigés. Le chiffre était
            // déjà écrit dans `globals.css`, qui interdit nommément cette
            // paire ; le calcul depuis les jetons ne l’a jamais vue parce
            // qu’il vérifie les paires que le système DÉCLARE, non celles que
            // deux utilitaires forment ici. L’encre pleine sur le même aplat
            // vaut 10,91:1 en clair et 10,05:1 en sombre.
            isCurrent ? 'bg-accent-soft text-ink' : 'text-ink-muted hover:text-accent',
          );
          const labels = (
            <>
              <span className={compact ? undefined : 'sr-only'}>{meta.shortLabel}</span>
              <span lang={meta.htmlLang} className={compact ? 'sr-only' : undefined}>
                {meta.nativeName}
              </span>
            </>
          );

          return (
            <li key={target}>
              {isCurrent ? (
                /* LA LANGUE COURANTE N’EST PAS UN LIEN, ET C’EST UNE
                   CORRECTION. Elle pointait vers la page ou l’on se trouve
                   deja : un arret de tabulation par page qui ne mene nulle
                   part, dans les quatre langues.

                   MESURE QUI L’A REVELE : sur l’accueil francais, sous 1024 px
                   ou la navigation est repliee, ce lien vers « / » suivait
                   IMMEDIATEMENT celui du nom du site, qui mene au meme
                   endroit. Deux liens consecutifs vers une seule destination —
                   l’alerte meme que ce projet vient de corriger ailleurs.
                   Reordonner les langues l’aurait deplacee ; la retirer la
                   supprime, et sur les trente-six pages a la fois.

                   `aria-current` RESTE, sur un element qui n’est plus
                   interactif : l’attribut n’exige pas de l’etre, et c’est lui
                   qui dit « vous y etes ». La forme reste identique a l’oeil —
                   meme aplat, meme encre, meme boite. */
                <span aria-current="true" className={shell}>
                  {labels}
                </span>
              ) : (
                /* UN `<a>` ORDINAIRE, ET NON `next/link`. Chaque langue a sa
                   propre mise en page racine ; Next.js documente qu'une
                   navigation entre deux racines provoque un CHARGEMENT COMPLET
                   du document. `Link` promettrait une transition cote client
                   qu'il ne peut pas tenir, et préchargerait au passage les
                   trois autres langues de chaque page visitée.

                   Note de lecture du HTML produit : React 19 serialise cette
                   propriete telle quelle, `hrefLang`, casse melangee — avec
                   `<a>` comme avec `Link`, verifie sur les deux. Ce n'est pas
                   un defaut : la specification HTML rend les noms d'attributs
                   insensibles a la casse, et tout analyseur — navigateur ou
                   robot — expose donc bien `hreflang`. */
                <a
                  href={page === null ? pathFor('home', target) : pathFor(page, target, slug)}
                  hrefLang={meta.htmlLang}
                  className={shell}
                >
                  {labels}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
