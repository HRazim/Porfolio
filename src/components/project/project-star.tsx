import { STAR_LABELS, STAR_ORDER, type ProjectStar as ProjectStarData } from '@/content/projects';

export interface ProjectStarProps {
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
 * Rendu cote serveur.
 */
export function ProjectStar({ star }: ProjectStarProps) {
  return (
    <dl className="flex flex-col gap-md">
      {STAR_ORDER.map((field) => (
        <div key={field} className="flex flex-col gap-3xs border-l border-border pl-md">
          <dt className="font-mono text-body-sm font-medium text-ink-subtle">
            {STAR_LABELS[field]}
          </dt>
          <dd className="max-w-measure text-body-md text-ink-muted">{star[field]}</dd>
        </div>
      ))}
    </dl>
  );
}
