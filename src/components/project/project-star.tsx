import type { Locale } from '@/content/i18n';
import { COMMON } from '@/content/site-copy';
import { STAR_LABELS, STAR_ORDER, type ProjectStar as ProjectStarData } from '@/content/projects';

export interface ProjectStarProps {
  readonly locale: Locale;
  readonly star: ProjectStarData;
}

/**
 * Deroule STAR : situation, taches, actions, resultats.
 *
 * AUDIT.md section 8.2 : ces quatre champs etaient stockes dans du balisage,
 * sous la forme `<li><strong>Situation :</strong> …</li>`. La mise en forme
 * portait la structure, ce qui rendait le contenu inexploitable ailleurs.
 * Ils sont desormais des champs types, restitues par une liste de
 * definitions — la structure semantique prevue pour un couple terme/valeur.
 *
 * Un champ a `null` reste affiche, avec la mention « a preciser » : le
 * lecteur voit que l’etape existe et que son bilan n’est pas encore etabli.
 * C’est plus honnete que de masquer l’etape ou d’inventer une phrase.
 *
 * Rendu cote serveur.
 */
export function ProjectStar({ locale, star }: ProjectStarProps) {
  return (
    <dl className="flex flex-col gap-md">
      {STAR_ORDER.map((field) => {
        const value = star[field];
        return (
          <div key={field} className="flex flex-col gap-3xs border-l border-border pl-md">
            <dt className="font-mono text-body-sm font-medium text-ink-subtle">
              {STAR_LABELS[field][locale]}
            </dt>
            <dd
              className={
                value === null
                  ? 'font-mono text-body-sm text-ink-subtle'
                  : 'max-w-measure text-body-md text-ink-muted'
              }
            >
              {value?.[locale] ?? COMMON.toBeSpecified[locale]}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
