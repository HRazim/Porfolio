import type { Locale } from '@/content/i18n';
import type { ProjectVisual } from '@/content/projects';

export interface ProjectGalleryProps {
  readonly locale: Locale;
  readonly visuals: readonly ProjectVisual[];
}

/**
 * ---------------------------------------------------------------------------
 * GALERIE DE VISUELS
 * ---------------------------------------------------------------------------
 *
 * POURQUOI `<picture>` PLUTOT QUE `next/image`
 *
 * Les fichiers sont encodes a l’avance, en AVIF et en WebP, aux dimensions
 * exactes de leur affichage. Aucun optimiseur n’a donc rien a faire au
 * service, et `<picture>` sert precisement ces deux encodages par negociation
 * de type. `next/image` reencoderait a la volee une source deja optimisee,
 * n’utiliserait jamais l’AVIF produit, et rendrait le projet dependant de
 * l’optimiseur — ce que la contrainte d’export statique interdit
 * (voir next.config.ts).
 *
 * ACCESSIBILITE ET STABILITE DE MISE EN PAGE
 *
 * `width` et `height` viennent des dimensions reelles du fichier : le
 * navigateur reserve la place avant le telechargement, la page ne saute pas.
 * Le premier visuel est charge immediatement, les suivants en differe : sur
 * une fiche de sept captures, seule la premiere est plausiblement visible au
 * chargement.
 *
 * Rendu cote serveur.
 * ---------------------------------------------------------------------------
 */
/**
 * Largeur d’affichage annoncee au navigateur.
 *
 * La grille passe a deux colonnes a 40rem, et le contenu plafonne a
 * --container-page (72rem). Une colonne vaut donc au plus ~34rem. C’est cette
 * borne qui est declaree : sans elle, le navigateur suppose 100vw et
 * telecharge systematiquement la plus grande variante.
 */
const GALLERY_SIZES = '(min-width: 40rem) 34rem, 92vw';

/** `{base}-{largeur}.{extension} {largeur}w`, pour chaque largeur produite. */
function srcSet(visual: ProjectVisual, extension: 'avif' | 'webp'): string {
  return visual.widths.map((w) => `${visual.src}-${w}.${extension} ${w}w`).join(', ');
}

export function ProjectGallery({ locale, visuals }: ProjectGalleryProps) {
  return (
    <ul className="mt-lg grid list-none grid-cols-1 gap-xl p-0 sm:grid-cols-2">
      {visuals.map((visual, index) => {
        // Repli pour un navigateur sans srcset : la plus PETITE variante.
        // Servir la plus grande a un client qui ne sait pas choisir serait
        // exactement le defaut que ce composant cherche a eviter.
        const fallbackWidth = visual.widths[0] ?? visual.width;
        return (
          <li key={visual.src}>
            <figure className="m-0 flex flex-col gap-sm">
              <picture>
                <source srcSet={srcSet(visual, 'avif')} sizes={GALLERY_SIZES} type="image/avif" />
                <source srcSet={srcSet(visual, 'webp')} sizes={GALLERY_SIZES} type="image/webp" />
                {/* Voir l’entete : les encodages sont pre-generes et servis
                    tels quels. `next/image` ne peut pas alimenter les sources
                    d’un picture, et reencoderait une image deja optimisee. */}
                <img
                  src={`${visual.src}-${fallbackWidth}.webp`}
                  width={visual.width}
                  height={visual.height}
                  alt={visual.alt[locale]}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-auto w-full rounded-md border border-border bg-surface"
                />
              </picture>
              <figcaption className="font-mono text-body-sm text-ink-subtle">
                {visual.caption[locale]}
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
