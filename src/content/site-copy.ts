/**
 * ---------------------------------------------------------------------------
 * TEXTES DE L’INTERFACE
 * ---------------------------------------------------------------------------
 *
 * TOUTE chaine visible par un utilisateur vit ici. Aucun composant ne
 * contient de prose : un composant assemble des primitives et consomme des
 * donnees, il ne redige pas.
 *
 * Cela rend verifiable la contrainte « aucun contenu redactionnel dans du
 * JSX » par simple recherche textuelle, et cela prepare la passe editoriale :
 * un seul fichier a relire.
 *
 * Convention typographique francaise : voir l’entete de projects.ts.
 * ---------------------------------------------------------------------------
 */

/** Routes de navigation. Union fermee : un lien mort ne compile pas. */
export type NavHref = '/' | '/a-propos' | '/realisations' | '/parcours' | '/#contact';

export interface NavItem {
  readonly href: NavHref;
  readonly label: string;
}

/**
 * Navigation principale, declaree une seule fois.
 * AUDIT.md section 3.6 releve 112 lignes de balisage recopiees sur trois
 * pages, avec une divergence deja constatee entre deux copies.
 */
export const NAVIGATION: readonly NavItem[] = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/parcours', label: 'Parcours' },
  { href: '/#contact', label: 'Contact' },
];

/** Identifiant du conteneur principal, cible du lien d’évitement. */
export const MAIN_CONTENT_ID = 'contenu';

export const COMMON = {
  skipToContent: 'Aller au contenu',
  /** Mention accessible ajoutee a tout lien ouvrant un nouvel onglet. */
  newWindow: 'nouvelle fenêtre',
  /** Affiche a la place d’une donnee non encore documentee. */
  toBeSpecified: 'À préciser',
  backToTop: 'Revenir en haut',
} as const;

/**
 * Bascule clair / sombre.
 *
 * Le libelle annonce l’ACTION a venir et non l’etat courant : un bouton dit
 * ce qu’il fera, `aria-pressed` dit ou l’on en est.
 */
export const THEME_TOGGLE = {
  toLight: 'Passer au mode clair',
  toDark: 'Passer au mode sombre',
} as const;

export const HEADER = {
  /** Libelle accessible de la balise nav principale. */
  navLabel: 'Navigation principale',
  /** Libelle accessible du lien du logo. */
  homeLinkLabel: 'Retour à l’accueil',
  menuOpen: 'Ouvrir le menu',
  menuClose: 'Fermer le menu',
  /** Libelle accessible du panneau de navigation mobile. */
  mobileMenuLabel: 'Menu',
} as const;

export const FOOTER = {
  socialLabel: 'Réseaux sociaux',
  contactLabel: 'Coordonnées',
  /** `{years}` est remplace par l’annee ou la plage d’annees. */
  copyright: 'Tous droits réservés.',
} as const;

/**
 * ---------------------------------------------------------------------------
 * ACCROCHE — TROIS FORMULATIONS, UNE SEULE RENDUE
 * ---------------------------------------------------------------------------
 *
 * LE PROPRIETAIRE TRANCHERA. Les trois sont conservees ici pour etre
 * comparees ; changer d’option consiste a faire pointer `HOME.headline` vers
 * une autre entree, sans toucher a une seule ligne de JSX.
 *
 * Chacune tient sous soixante caracteres, sans superlatif, sans mot creux et
 * sans promesse invérifiable. Chacune explore une direction differente.
 * ---------------------------------------------------------------------------
 */
const HEADLINE_OPTIONS = {
  /** Identite franche : nomme les deux competences, sans revendiquer de titre. */
  identite: 'Développeur formé, ingénieur d’affaires en devenir.',
  /** Tension : situe la personne entre deux mondes plutot que de l’etiqueter. */
  tension: 'Entre ceux qui construisent et ceux qui vendent.',
  /** Apport : ce que l’interlocuteur y gagne, pose comme une methode. */
  apport: 'Comprendre le besoin avant d’écrire la solution.',
} as const;

export const HOME = {
  headlineOptions: HEADLINE_OPTIONS,
  /** Formulation rendue. Les deux autres attendent dans HEADLINE_OPTIONS. */
  headline: HEADLINE_OPTIONS.identite,
  /**
   * UNE phrase de contexte, pas davantage. Le developpement appartient
   * desormais a la page « À propos », vers laquelle pointe le renvoi
   * ci-dessous. L’accueil presente, il ne raconte pas.
   */
  lede: 'Trois ans d’informatique, une année d’études au Québec, un stage en développement, et un Master Ingénierie d’Affaires à Paris School of Business.',
  /** Renvoi vers la page « À propos », sous la phrase de contexte. */
  aboutLinkLabel: 'À propos de moi',
  /* --- Vignette compacte de realisation ---------------------------------
     Elle ne dit pas tout : elle donne envie d’ouvrir. */
  featuredCardCta: 'Ouvrir la fiche',
  /** Separateur entre la categorie et la periode. Purement visuel. */
  featuredCardSeparator: '·',
  /** `{count}` est remplace par le nombre de technologies non affichees. */
  featuredCardMore: '+{count}',
  /** Meme information, en toutes lettres, pour les lecteurs d’ecran. */
  featuredCardMoreLabel: '{count} technologies supplémentaires',
  featuredHeading: 'Réalisations',
  featuredEmpty:
    'Aucune réalisation n’est mise en avant pour le moment. Toutes restent consultables depuis l’index.',
  featuredLinkAll: 'Voir toutes les réalisations',
  contactHeading: 'Contact',
  /** Texte alternatif du portrait. Decrit le sujet, sans le qualifier. */
  portraitAlt: 'Portrait de MAROUAN Hazim-Rayan',
  cvLabel: 'Télécharger mon CV',
  /**
   * Mention accessible : format et poids, annonces avant le declenchement.
   * `{poids}` est remplace par la taille REELLE du fichier, lue au build.
   * Meme convention que `{years}` dans FOOTER.copyright.
   */
  cvMeta: 'PDF, {poids}',
} as const;

/**
 * ---------------------------------------------------------------------------
 * PAGE « À PROPOS »
 * ---------------------------------------------------------------------------
 *
 * Quatre paragraphes courts, a la premiere personne, chacun sous quatre-vingt-dix
 * mots. Le premier est repris MOT POUR MOT de l’ancienne section de l’accueil :
 * il avait ete ecrit, relu et valide, le reecrire n’aurait servi qu’a le degrader.
 *
 * AUCUNE mise en gras a l’interieur : AUDIT.md section 8.2 releve 23 balises de
 * mise en gras pour 223 mots sur le site precedent, ce qui ne hierarchisait plus
 * rien. Aucun superlatif non plus, et aucun des mots creux dont ces pages sont
 * habituellement faites.
 *
 * Les lectures viennent de la page Parcours, ou elles detonnaient entre les
 * langues et les diplomes. Elles disent ce qui a change une facon de travailler :
 * leur place est ici.
 * ---------------------------------------------------------------------------
 */
export const ABOUT = {
  eyebrow: 'Qui je suis',
  heading: 'À propos',
  paragraphs: [
    'J’ai passé trois ans en informatique, dont une année à l’Université du Québec à Chicoutimi, vécue seul et loin de chez moi. C’est un stage en entreprise qui a tranché : ce qui me retient n’est pas d’écrire le code, c’est de comprendre le besoin qui le déclenche. J’ai donc choisi l’ingénierie d’affaires.',
    'J’ai nagé sept ans en compétition, de sept à quatorze ans. J’en ai gardé la rigueur, la discipline et la persévérance : l’habitude d’un effort qui ne produit ses effets qu’à long terme, et qu’il faut fournir sans rien voir venir. Je pratique aujourd’hui la calisthénie.',
    'Ce que le sport m’a surtout appris, c’est de repartir d’en bas. Entrer dans une discipline nouvelle, c’est revenir au rang de débutant et reprendre la progression à zéro. Cela ne m’effraie pas : je l’ai déjà fait, et je sais ce que cela demande. C’est ce qui rend le passage de la technique au commerce naturel plutôt que risqué.',
    'J’apprends en continu et je lis beaucoup. J’aime construire par moi-même : j’ai conçu, développé et publié seul JTR, une application Android de gestion de contacts. À terme, je veux entreprendre, dans un domaine où la technique et le commerce se rencontrent. C’est la raison de ce double parcours : savoir ce qu’un produit demande à construire, et savoir à qui il s’adresse.',
  ],
  readingsHeading: 'Lectures',
  readingsIntro: 'Quatre livres qui ont changé ma façon de travailler.',
  readingsEmpty: 'Les lectures restent à renseigner.',
} as const;

/**
 * ---------------------------------------------------------------------------
 * REPLI D’ERREUR GLOBAL
 * ---------------------------------------------------------------------------
 *
 * Affiche lorsque la MISE EN PAGE RACINE elle-meme a echoue. C’est le dernier
 * ecran avant la page blanche : il doit donc dire ce qui se passe, et proposer
 * les deux seules actions qui aient un sens — reessayer, ou revenir a
 * l’accueil.
 *
 * Le texte ne promet pas que le probleme vient du visiteur, parce que ce n’est
 * pas le cas : une erreur de mise en page racine est une defaillance du site.
 * ---------------------------------------------------------------------------
 */
export const GLOBAL_ERROR = {
  eyebrow: 'Erreur',
  heading: 'Le site n’a pas pu s’afficher',
  message:
    'Une erreur a interrompu le chargement de la page. Elle ne vient pas de l’adresse demandée : réessayer suffit parfois, et sinon l’accueil reste accessible.',
  retryLabel: 'Réessayer',
  homeLink: 'Retour à l’accueil',
  /** Langue du document, ce repli rendant son propre <html>. */
  lang: 'fr',
} as const;

/**
 * Textes alternatifs des vignettes de partage.
 *
 * Une vignette Open Graph est une IMAGE : sans texte alternatif, un lecteur
 * d’ecran n’annonce rien du tout la ou un visiteur voit un titre. Ces libelles
 * decrivent ce que la vignette montre, pas ce qu’elle promeut.
 */
export const SHARE_IMAGE = {
  siteAlt:
    'Vignette de partage : le nom MAROUAN Hazim-Rayan et l’accroche du site, en lettres claires sur un fond bleu nuit.',
  /** Unique : voir l’en-tete de l’image de partage des fiches. */
  projectAlt:
    'Vignette de partage d’une réalisation, au nom de MAROUAN Hazim-Rayan, en lettres claires sur un fond bleu nuit.',
} as const;

export const PROJECTS_INDEX = {
  eyebrow: 'Travaux',
  heading: 'Réalisations',
  intro: 'Projets professionnels, académiques et personnels, groupés par nature.',
  empty: 'Aucune réalisation n’est publiée pour le moment.',
  /** `{count}` est remplace par le nombre de realisations de la categorie. */
  countOne: 'réalisation',
  countMany: 'réalisations',
  readMore: 'Consulter la réalisation',
} as const;

export const PROJECT_DETAIL = {
  eyebrow: 'Réalisation',
  contextHeading: 'Contexte',
  roleHeading: 'Rôle',
  periodHeading: 'Période',
  categoryHeading: 'Catégorie',
  technologiesHeading: 'Technologies',
  featuresHeading: 'Fonctionnalités',
  starHeading: 'Déroulé du projet',
  /** Intitule neutre : ce que la livraison ne couvre pas. */
  scopeHeading: 'Périmètre',
  learningsHeading: 'Enseignements',
  learningsEmpty: 'Les enseignements de ce projet restent à rédiger.',
  linksHeading: 'Liens',
  visualsHeading: 'Visuels',
  navigationLabel: 'Navigation entre les réalisations',
  previousLabel: 'Réalisation précédente',
  nextLabel: 'Réalisation suivante',
  backToIndex: 'Retour aux réalisations',
} as const;

export const CAREER = {
  eyebrow: 'Trajectoire',
  heading: 'Parcours',
  intro: 'Formation, expériences et langues.',
  formationHeading: 'Formation',
  formationEmpty: 'La formation reste à renseigner.',
  experienceHeading: 'Expériences',
  experienceEmpty: 'Les expériences restent à renseigner.',
  languagesHeading: 'Langues',
  languagesEmpty: 'Les langues restent à renseigner.',
} as const;

export const NOT_FOUND = {
  eyebrow: 'Erreur 404',
  heading: 'Page introuvable',
  message:
    'Cette adresse ne correspond à aucune page du site. Elle a pu être déplacée ou mal recopiée.',
  homeLink: 'Retour à l’accueil',
  projectsLink: 'Voir les réalisations',
} as const;

/**
 * Metadonnees par page.
 *
 * `title` est le segment insere dans le gabarit defini par la mise en page
 * racine ; le nom complet y est ajoute automatiquement. AUDIT.md section 6.3
 * releve qu’aucune des trois pages precedentes ne contenait le nom, alors
 * que c’est l’unique requete a forte intention pour un portfolio personnel.
 */
export const PAGE_META = {
  home: {
    title: 'Portfolio',
    description:
      'Portfolio de MAROUAN Hazim-Rayan : réalisations, parcours et coordonnées.',
  },
  about: {
    title: 'À propos',
    description:
      'MAROUAN Hazim-Rayan : de l’informatique à l’ingénierie d’affaires, ce que sept ans de natation en compétition ont construit, et ce qui l’anime au quotidien.',
  },
  projects: {
    title: 'Réalisations',
    description:
      'Réalisations de MAROUAN Hazim-Rayan : projets académiques, personnels et professionnels, détaillés selon la méthode STAR.',
  },
  career: {
    title: 'Parcours',
    description: 'Formation et expériences de MAROUAN Hazim-Rayan.',
  },
  notFound: {
    title: 'Page introuvable',
    description: 'Cette adresse ne correspond à aucune page du site.',
  },
  styleguide: {
    title: 'Design system',
    description: 'Page de démonstration interne du design system.',
  },
} as const;
