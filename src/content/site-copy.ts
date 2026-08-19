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
export type NavHref = '/' | '/realisations' | '/parcours' | '/#contact';

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
 * Page d’accueil.
 *
 * EN ATTENTE DE REDACTION — l’accroche et le texte de presentation sont
 * volontairement des espaces reserves. Le positionnement vise est un profil
 * hybride technique et business, a parts egales ; AUDIT.md section 8.2
 * conclut que l’accroche precedente (« Développeur Web | Designer | Étudiant
 * en BUT informatique ») est une enumeration sans positionnement, et que la
 * section « À propos » compte 23 balises de mise en gras pour 223 mots.
 * Ces deux textes sont donc a ecrire, pas a reprendre.
 */
export const HOME = {
  eyebrow: 'Portfolio',
  /** EN ATTENTE DE REDACTION */
  headline: 'Accroche à rédiger',
  /** EN ATTENTE DE REDACTION */
  intro:
    'Le texte de présentation reste à écrire. Il portera le positionnement hybride entre technique et business.',
  featuredHeading: 'Réalisations mises en avant',
  featuredEmpty:
    'Aucune réalisation n’est mise en avant pour le moment. Toutes restent consultables depuis l’index.',
  featuredLinkAll: 'Voir toutes les réalisations',
  contactHeading: 'Contact',
  /** EN ATTENTE DE REDACTION */
  contactIntro: 'Le texte d’introduction au contact reste à écrire.',
} as const;

export const PROJECTS_INDEX = {
  eyebrow: 'Travaux',
  heading: 'Réalisations',
  /** EN ATTENTE DE REDACTION */
  intro: 'Le texte d’introduction de l’index reste à écrire.',
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
  learningsHeading: 'Enseignements',
  learningsEmpty: 'Les enseignements de ce projet restent à rédiger.',
  linksHeading: 'Liens',
  visualsHeading: 'Visuels',
  visualsPending:
    'Les visuels de cette réalisation ne sont pas encore intégrés. Leur encodage fait l’objet d’une étape dédiée.',
  navigationLabel: 'Navigation entre les réalisations',
  previousLabel: 'Réalisation précédente',
  nextLabel: 'Réalisation suivante',
  backToIndex: 'Retour aux réalisations',
} as const;

export const CAREER = {
  eyebrow: 'Trajectoire',
  heading: 'Parcours',
  /** EN ATTENTE DE REDACTION */
  intro: 'Le texte d’introduction du parcours reste à écrire.',
  formationHeading: 'Formation',
  formationEmpty: 'La formation reste à renseigner.',
  experienceHeading: 'Expériences',
  experienceEmpty: 'Les expériences restent à renseigner.',
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
