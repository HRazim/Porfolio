import type { Locale } from '@/content/i18n';
import type { ProjectIllustration, ProjectMedia, ProjectVisual } from '@/content/projects';

export interface ProjectGalleryProps {
  readonly locale: Locale;
  readonly visuals: readonly ProjectMedia[];
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
 * DEUX SORTES DE MEDIAS, ET UN SEUL COMPOSANT
 *
 * Une capture porte `widths` : elle est matricielle et se decline en
 * resolutions. Une illustration n’en porte pas : elle est vectorielle, unique,
 * et se decline en MODES. C’est cette presence qui les separe ici — voir
 * `ProjectMedia` dans `content/projects.ts` pour la raison du choix.
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

/** Une capture porte des resolutions ; une illustration, non. */
function estCapture(media: ProjectMedia): media is ProjectVisual {
  return 'widths' in media;
}

/**
 * L’IMAGE D’UNE CAPTURE : deux encodages, deux resolutions, negociation par
 * le navigateur.
 */
function Capture({ visual, locale, index }: { visual: ProjectVisual; locale: Locale; index: number }) {
  // Repli pour un navigateur sans srcset : la plus PETITE variante.
  // Servir la plus grande a un client qui ne sait pas choisir serait
  // exactement le defaut que ce composant cherche a eviter.
  const fallbackWidth = visual.widths[0] ?? visual.width;
  return (
    <picture>
      <source srcSet={srcSet(visual, 'avif')} sizes={GALLERY_SIZES} type="image/avif" />
      <source srcSet={srcSet(visual, 'webp')} sizes={GALLERY_SIZES} type="image/webp" />
      {/* Voir l’entete : les encodages sont pre-generes et servis tels quels.
          `next/image` ne peut pas alimenter les sources d’un picture, et
          reencoderait une image deja optimisee. */}
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
  );
}

/**
 * L’IMAGE D’UNE ILLUSTRATION : les deux modes sont dans le document, la
 * feuille de style n’en montre qu’un.
 *
 * POURQUOI PAS `<source media="(prefers-color-scheme: dark)">`. Ce serait la
 * voie evidente, et elle est FAUSSE ICI : la source de verite du mode est
 * l’attribut `data-mode` pose sur `<html>`, que la bascule du site modifie.
 * Un visiteur dont le systeme est clair mais qui choisit le sombre garderait
 * l’illustration claire, et rien ne la changerait — `media` ne sait rien d’un
 * attribut. Le contraire serait aussi vrai. La bascule doit etre suivie, donc
 * c’est un selecteur CSS qui decide, pas une requete de media.
 *
 * POURQUOI PAS UNE IMAGE DE FOND. Elle ne telechargerait qu’un fichier, mais
 * perdrait `<img>` : plus de `width`/`height` pour reserver la place, plus
 * d’alternative native, et une image de contenu deviendrait decorative pour
 * qui lit le HTML. Le cout de l’autre fichier est mesure et rapporte plutot
 * que masque.
 *
 * POURQUOI L’AVERTISSEMENT DE LINT EST NEUTRALISE. `@next/next/no-img-element`
 * pousse vers `next/image`, qui est ici doublement inapplicable : l’export
 * statique interdit l’optimiseur (voir next.config.ts), et un SVG n’a rien a
 * reencoder. La regle epargne les `<img>` places dans un `<picture>` — c’est
 * pourquoi les captures ne la declenchent pas. Envelopper ces deux images
 * dans un `<picture>` vide de `<source>` les ferait taire aussi, mais par un
 * artifice de structure ; la neutralisation explicite dit la raison.
 *
 * `alt` EST PORTE PAR LES DEUX, dans la langue de la page. Le fichier SVG
 * porte son propre `<title>` en francais ; servi par `src`, ce titre reste
 * DANS le document SVG et n’entre jamais dans l’arbre d’accessibilite de la
 * page hote. C’est `alt` qui nomme l’image, et lui seul.
 */
function Illustration({ media, locale }: { media: ProjectIllustration; locale: Locale }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${media.src}-clair.svg`}
        width={media.width}
        height={media.height}
        alt={media.alt[locale]}
        decoding="async"
        className="illustration-claire h-auto w-full rounded-md border border-border bg-surface"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${media.src}-sombre.svg`}
        width={media.width}
        height={media.height}
        alt={media.alt[locale]}
        decoding="async"
        className="illustration-sombre h-auto w-full rounded-md border border-border bg-surface"
      />
    </>
  );
}

export function ProjectGallery({ locale, visuals }: ProjectGalleryProps) {
  return (
    <ul className="mt-lg grid list-none grid-cols-1 gap-xl p-0 sm:grid-cols-2">
      {visuals.map((media, index) => {
        const legende = media.caption?.[locale] ?? null;
        // UNE ILLUSTRATION PREND TOUTE LA LARGEUR. La grille est concue pour
        // des captures verticales, deux par rangee. Une illustration est
        // PAYSAGE en 1600x900 : dans une demi-colonne elle tombait a 480 px
        // de large pour 270 de haut, et la rangee restait a moitie vide,
        // puisque ces deux fiches n'en portent qu'une. `sm:col-span-2` lui
        // rend la largeur du contenu.
        //
        // POURQUOI UN OBJET REPANDU, ET NON `className={x}`. Sur une capture,
        // l'attribut doit etre ABSENT, pas vide. Une chaine vide ecrit
        // `class=""` dans le HTML ; `undefined` n'ecrit rien, mais laisse tout
        // de meme la propriete dans la charge de rehydratation — mesure a 58
        // octets de plus sur la fiche archilog. Les deux modifient les dix-neuf
        // captures des quatre autres fiches, qui ne doivent pas bouger d'un
        // octet. Repandre un objet vide n'ajoute rien du tout.
        const pleineLargeur = estCapture(media) ? {} : { className: 'sm:col-span-2' };
        return (
          <li key={media.src} {...pleineLargeur}>
            <figure className="m-0 flex flex-col gap-sm">
              {estCapture(media) ? (
                <Capture visual={media} locale={locale} index={index} />
              ) : (
                <Illustration media={media} locale={locale} />
              )}
              {legende === null ? null : (
                <figcaption className="font-mono text-body-sm text-ink-subtle">{legende}</figcaption>
              )}
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
