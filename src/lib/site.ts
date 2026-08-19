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

/** Nom complet, tel qu’il doit apparaitre dans chaque balise title. */
export const SITE_NAME = 'MAROUAN Hazim-Rayan';

/** Langue et region du document. */
export const SITE_LOCALE = 'fr_FR';
export const SITE_LANG = 'fr';

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
 * PROVISOIRE : redaction editoriale a venir. Construite ici uniquement a
 * partir de faits verifiables (AUDIT.md section 9.1), sans promesse ni
 * qualificatif.
 */
export const SITE_DESCRIPTION =
  'Portfolio de MAROUAN Hazim-Rayan, étudiant en BUT informatique. ' +
  'Réalisations, parcours et coordonnées.';

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
 * Doit rester alignee sur --container-portrait-sm / --container-portrait et
 * sur le point de rupture `md` (48rem), sans quoi le navigateur telecharge
 * une variante qui ne correspond pas a la place reellement occupee.
 */
export const PORTRAIT_SIZES = '(min-width: 48rem) 20rem, 12rem';

/** Type de lien social connu du systeme. */
export type SocialNetwork = 'github' | 'linkedin';

export interface SocialLink {
  readonly network: SocialNetwork;
  readonly label: string;
  readonly href: string;
  /** Nom d’utilisateur, pour les donnees structurees. */
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
    href: 'https://www.linkedin.com/in/hazim-rayan-marouan-8bb382338',
    handle: 'hazim-rayan-marouan',
  },
];

/**
 * Adresse, sous forme structuree.
 *
 * Sert a la fois l’affichage et les donnees structurees JSON-LD : la valeur
 * n’est ecrite qu’une seule fois.
 */
export const SITE_ADDRESS = {
  locality: 'Paris',
  country: 'France',
  /** Code ISO 3166-1 alpha-2, pour schema.org. */
  countryCode: 'FR',
} as const;

/** Nature d’une coordonnee. Determine le schema d’URL et le pictogramme. */
export type ContactKind = 'email' | 'phone' | 'location' | 'document';

export interface ContactPoint {
  readonly kind: ContactKind;
  readonly label: string;
  /** Valeur affichee, mise en forme pour la lecture humaine. */
  readonly display: string;
  /** Cible du lien. `null` lorsque la coordonnee n’est pas actionnable. */
  readonly href: string | null;
}

/** Valeur brute du courriel, reutilisee par le lien et par le JSON-LD. */
const EMAIL = 'rhazim@gmx.com';
/** Numero au format E.164, pour le lien tel: et le JSON-LD. */
const PHONE_E164 = '+33749029720';

/**
 * AUDIT.md section 5.4 : dans le site precedent, telephone et courriel
 * etaient de simples `<span>`, donc inutilisables sur mobile. Ils portent
 * desormais un schema tel: et mailto:.
 */
export const CONTACT_POINTS: readonly ContactPoint[] = [
  {
    kind: 'email',
    label: 'Courriel',
    display: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    kind: 'phone',
    label: 'Téléphone',
    display: '+33 7 49 02 97 20',
    href: `tel:${PHONE_E164}`,
  },
  {
    kind: 'location',
    label: 'Localisation',
    display: `${SITE_ADDRESS.locality}, ${SITE_ADDRESS.country}`,
    href: null,
  },
  {
    kind: 'document',
    label: 'Curriculum vitae',
    display: 'Télécharger le CV',
    // Chemin cible. Le fichier sera place lors du prompt dedie aux actifs :
    // rien n’est copie depuis legacy/ a ce stade.
    href: '/documents/cv.pdf',
  },
];

/** Valeurs brutes, pour les donnees structurees. */
export const STRUCTURED_CONTACT = {
  email: EMAIL,
  phone: PHONE_E164,
} as const;

/** Une coordonnee par sa nature. `undefined` si elle n’est pas declaree. */
export function getContactPoint(kind: ContactKind): ContactPoint | undefined {
  return CONTACT_POINTS.find((point) => point.kind === kind);
}

/** Annee de depart du copyright. */
export const SITE_FOUNDED_YEAR = 2025;
