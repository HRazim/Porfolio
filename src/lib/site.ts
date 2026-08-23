/**
 * ---------------------------------------------------------------------------
 * SOURCE UNIQUE DE VERITE — IDENTITE DU SITE
 * ---------------------------------------------------------------------------
 *
 * Nom, URL canonique, coordonnees et liens sociaux ne sont ecrits QU’ICI.
 * AUDIT.md section 9.4 releve 12 occurrences pour 4 destinations distinctes
 * dans le site precedent, recopiees a la main sur trois pages.
 *
 * Toute page, tout composant et toute metadonnee lit ces constantes.
 * ---------------------------------------------------------------------------
 */

import type { Translated } from '@/content/i18n';

/** Nom complet, tel qu’il doit apparaitre dans chaque balise title. */
export const SITE_NAME = 'MAROUAN Hazim-Rayan';

/** Langue et region du document. */
/* SITE_LOCALE et SITE_LANG ont ete retires : ils affirmaient que le site
   n'a qu'une langue. La langue d'un document vient desormais de
   LOCALE_META, et son code Open Graph de OG_LOCALE — voir i18n.ts. */

/**
 * URL canonique.
 *
 * Sous-domaine Vercel gratuit, arbitre pour la mise en ligne. La valeur reste
 * surchargeable sans toucher au code via NEXT_PUBLIC_SITE_URL, inlinee au
 * build (compatible export statique) : le jour ou un domaine propre est pris,
 * seule la variable d’environnement change.
 *
 * `metadataBase`, le sitemap et toutes les balises canoniques lisent cette
 * constante et elle seule.
 */
const FALLBACK_SITE_URL = 'https://hazim-rayan-marouan.vercel.app';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;

/**
 * Description de reference du site.
 *
 * C’EST LA PHRASE LA PLUS VUE DU SITE, et de loin : elle sert de description
 * Open Graph par defaut, donc c’est elle qui s’affiche sous le lien partout ou
 * le lien est partage — la ou l’on decide de cliquer ou non.
 *
 * Elle annoncait << etudiant en BUT informatique >>. Le diplome est acheve.
 * Une description qui se perime est pire qu’une description vague : elle est
 * fausse, et personne ne la relit. Celle-ci ne nomme donc AUCUN diplome et
 * AUCUNE date — elle dit une trajectoire, qui, elle, reste vraie.
 *
 * 148 caracteres : sous la limite de 155 au-dela de laquelle les moteurs
 * tronquent, et au-dessus de 120, en deca desquels ils completent eux-memes.
 */
export const SITE_DESCRIPTION: Translated = {
  fr:
  'Portfolio de MAROUAN Hazim-Rayan, développeur de formation qui se destine ' +
  'à l’ingénierie d’affaires : un parcours entre la technique et le commerce.',
  en:
    'Portfolio of MAROUAN Hazim-Rayan, a developer by training heading for ' +
    'business engineering: a path between engineering and commerce.',
  es:
    'Portafolio de MAROUAN Hazim-Rayan, desarrollador de formación que se ' +
    'dirige hacia la ingeniería de negocios: una trayectoria entre la ' +
    'técnica y el comercio.',
  ar:
    'أعمال MAROUAN Hazim-Rayan، مطوِّر بالتكوين يتّجه نحو هندسة الأعمال: ' +
    'مسار بين التقنية والتجارة.',
};

/**
 * Composition des titres de page.
 *
 * AUDIT.md section 6.3 : aucune des trois pages precedentes ne contenait le
 * nom, alors que c’est l’unique requete a forte intention pour un portfolio
 * personnel. Le separateur et le gabarit ne sont ecrits qu’ici.
 *
 * Attention : le `template` d’une mise en page ne s’applique PAS au segment
 * ou il est defini. La page d’accueil doit donc composer son titre avec
 * `pageTitle`, sans quoi elle serait la seule page sans le nom.
 */
export const TITLE_SEPARATOR = ' · ';
export const TITLE_TEMPLATE = `%s${TITLE_SEPARATOR}${SITE_NAME}`;

export function pageTitle(segment: string): string {
  return `${segment}${TITLE_SEPARATOR}${SITE_NAME}`;
}

/**
 * Actifs statiques servis depuis public/.
 * Ecrits ici pour la meme raison que les liens : une seule source.
 */
export const CV_PATH = '/cv-marouan-hazim-rayan.pdf';

/**
 * Portrait : chemin de base, SANS suffixe de largeur ni extension — meme
 * convention que les visuels de realisation. La page en derive un `srcset`
 * par largeur et par encodage.
 */
export const PORTRAIT_PATH = '/images/portrait-marouan-hazim-rayan';
/** Largeurs produites, croissantes. */
export const PORTRAIT_WIDTHS: readonly number[] = [400, 800];
/** Cote du plus grand fichier, en pixels. Le portrait est carre. */
export const PORTRAIT_SIZE = 800;
/**
 * Largeur d’affichage annoncee au navigateur.
 *
 * TROIS PALIERS, exactement ceux du portrait : `--container-portrait-sm` en
 * pile, `--container-portrait` des que l’en-tete passe en colonnes (`lg`,
 * 64rem), `--container-portrait-lg` au-dela de `xl` (80rem). Une divergence
 * ici ferait telecharger une variante qui ne correspond pas a la place
 * reellement occupee — trop petite, elle se verrait ; trop grande, elle se
 * paierait.
 *
 * Les conditions sont ecrites de la plus large a la plus etroite : le
 * navigateur retient la PREMIERE qui correspond.
 */
export const PORTRAIT_SIZES = '(min-width: 80rem) 15rem, (min-width: 64rem) 13rem, 8rem';

/** Type de lien social connu du systeme. */
export type SocialNetwork = 'github' | 'linkedin';

export interface SocialLink {
  readonly network: SocialNetwork;
  readonly label: string;
  readonly href: string;
  /**
   * Nom d’utilisateur, tel qu’il apparait dans l’adresse du profil.
   *
   * IL DOIT SUIVRE `href`, ET IL NE L’A PAS FAIT : l’adresse LinkedIn a change
   * sans que ce champ bouge, et les deux ont designe deux profils differents
   * jusqu’a ce qu’un controle les compare.
   *
   * Aucune surface ne le lit aujourd’hui — les donnees structurees publient
   * `href`, pas lui. C’est precisement ce qui a permis a la divergence de
   * passer inapercue : un champ que rien n’emploie ne se contredit jamais a
   * l’ecran.
   */
  readonly handle: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    network: 'github',
    label: 'GitHub',
    href: 'https://github.com/HRazim',
    handle: 'HRazim',
  },
  {
    network: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/hazimryn/',
    handle: 'hazimryn',
  },
];

/**
 * Adresse, sous forme structuree.
 *
 * Sert a la fois l’affichage et les donnees structurees JSON-LD : la valeur
 * n’est ecrite qu’une seule fois.
 */
export const SITE_ADDRESS = {
  /**
   * Un nom de lieu se traduit, contrairement a un nom de personne :
   * « Paris » s’ecrit باريس en arabe, et « France » devient Francia en
   * espagnol. Le `countryCode`, lui, est une norme, pas une langue.
   */
  locality: {
    fr: 'Paris',
    en: 'Paris',
    es: 'París',
    ar: 'باريس',
  } satisfies Translated,
  country: {
    fr: 'France',
    en: 'France',
    es: 'Francia',
    ar: 'فرنسا',
  } satisfies Translated,
  /** Code ISO 3166-1 alpha-2, pour schema.org. */
  countryCode: 'FR',
} as const;

/**
 * Nature d’une coordonnee. Determine le schema d’URL et le pictogramme.
 *
 * DEUX VARIANTES ONT DISPARU, chacune avec sa donnee. Un membre d’union
 * qu’aucune coordonnee ne peut produire decrirait mal la donnee.
 *
 * `document` : le CV est une piece a telecharger, pas un moyen de joindre
 * quelqu’un, et `<address>` decrit des moyens de contact. Son lien vit dans la
 * section de contact, avec son format et son poids.
 *
 * `phone` : le numero a ete retire du site. Sur une page publique et indexee,
 * un numero en clair — et plus encore un champ `telephone` dans les donnees
 * structurees, qui est la forme la plus aisement moissonnee — se retrouve
 * aspire. Le courriel suffit a etre joint, et le CV porte le reste.
 */
export type ContactKind = 'email' | 'location';

export interface ContactPoint {
  readonly kind: ContactKind;
  readonly label: Translated;
  /**
   * Valeur affichee, mise en forme pour la lecture humaine.
   *
   * Traduite parce qu’une localite l’est : « Paris, France » devient
   * « باريس، فرنسا ». Un courriel, lui, porte la meme chaine dans les
   * quatre langues — c’est une adresse, pas du texte.
   */
  readonly display: Translated;
  /** Cible du lien. `null` lorsque la coordonnee n’est pas actionnable. */
  readonly href: string | null;
}

/** Valeur brute du courriel, reutilisee par le lien et par le JSON-LD. */
const EMAIL = 'rhazim@gmx.com';

/**
 * AUDIT.md section 5.4 : dans le site precedent, le courriel etait un simple
 * `<span>`, donc inutilisable d’un clic. Il porte desormais un schema mailto:.
 */
export const CONTACT_POINTS: readonly ContactPoint[] = [
  {
    kind: 'email',
    label: {
      fr: 'Courriel',
      en: 'Email',
      es: 'Correo electrónico',
      ar: 'البريد الإلكتروني',
    },
    display: { fr: EMAIL, en: EMAIL, es: EMAIL, ar: EMAIL },
    href: `mailto:${EMAIL}`,
  },
  {
    kind: 'location',
    label: {
      fr: 'Localisation',
      en: 'Location',
      es: 'Ubicación',
      ar: 'الموقع',
    },
    display: {
      fr: `${SITE_ADDRESS.locality.fr}, ${SITE_ADDRESS.country.fr}`,
      en: `${SITE_ADDRESS.locality.en}, ${SITE_ADDRESS.country.en}`,
      es: `${SITE_ADDRESS.locality.es}, ${SITE_ADDRESS.country.es}`,
      // La virgule arabe (U+060C) remplace la virgule latine, comme le
      // veut la ponctuation de cette ecriture.
      ar: `${SITE_ADDRESS.locality.ar}، ${SITE_ADDRESS.country.ar}`,
    },
    href: null,
  },
];

/** Valeurs brutes, pour les donnees structurees. */
export const STRUCTURED_CONTACT = {
  email: EMAIL,
} as const;

/** Annee de depart du copyright. */
export const SITE_FOUNDED_YEAR = 2025;
