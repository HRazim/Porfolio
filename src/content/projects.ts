/**
 * ---------------------------------------------------------------------------
 * SCHEMA DE CONTENU — REALISATIONS
 * ---------------------------------------------------------------------------
 *
 * Le contenu ne vit jamais dans du JSX. Il vit ici, type, et les composants
 * le consomment. AUDIT.md section 8.2 releve que les blocs STAR du site
 * precedent etaient stockes dans du balisage, ce qui rendait impossible
 * toute reutilisation, tout tri et toute reprise editoriale.
 *
 * ---------------------------------------------------------------------------
 * CONVENTION TYPOGRAPHIQUE FRANCAISE, appliquee a TOUTES les chaines
 * ---------------------------------------------------------------------------
 *   apostrophe            U+2019      jamais U+0027
 *   guillemets            U+00AB et U+00BB
 *   espace insecable      U+00A0      avant le deux-points, dans les chevrons
 *   espace fine insecable U+202F      avant point-virgule, exclamation, question
 *
 * AUDIT.md section 8.2 releve 4 apostrophes typographiques melangees a
 * 26 apostrophes droites dans le site precedent, et des guillemets droits
 * la ou le francais appelle des chevrons.
 * ---------------------------------------------------------------------------
 */

import type { Period } from './period';

/** Identifiants d’URL. Union fermee : une route inconnue ne compile pas. */
export type ProjectSlug = 'plateforme-web-calculs' | 'archilog';

export type ProjectCategory = 'professionnel' | 'personnel' | 'academique';

/** Role tenu. Union fermee pour garantir un vocabulaire stable. */
export type ProjectRole =
  | 'Développeur full-stack'
  | 'Développeur back-end'
  | 'Développeur front-end'
  | 'Architecte logiciel';

/** Technologies connues du systeme. Ajouter une entree ici avant de l’employer. */
export type Technology =
  | 'HTML'
  | 'CSS'
  | 'JavaScript'
  | 'PHP'
  | 'MySQL'
  | 'Raspberry Pi'
  | 'SSH'
  | 'Python'
  | 'Flask'
  | 'SQLAlchemy Core'
  | 'SQLite'
  | 'Jinja2';

export type ProjectLinkKind = 'source' | 'demo' | 'article' | 'documentation';

export interface ProjectLink {
  readonly kind: ProjectLinkKind;
  readonly label: string;
  readonly href: string;
}

/**
 * Visuel de realisation.
 *
 * `src` pointe vers le chemin CIBLE sous public/. Aucun fichier n’est copie
 * depuis legacy/ a ce stade : l’encodage et le placement des images font
 * l’objet d’un prompt dedie.
 */
export interface ProjectVisual {
  readonly src: `/images/projets/${string}`;
  readonly alt: string;
  readonly caption: string;
}

/** Methode STAR : situation, taches, actions, resultats. */
export interface ProjectStar {
  readonly situation: string;
  readonly taches: string;
  readonly actions: string;
  readonly resultats: string;
}

export interface Project {
  readonly slug: ProjectSlug;
  readonly title: string;
  /** Accroche d’une phrase. */
  readonly tagline: string;
  readonly category: ProjectCategory;
  readonly period: Period;
  readonly context: string;
  readonly role: ProjectRole;
  readonly technologies: readonly Technology[];
  readonly features: readonly string[];
  readonly star: ProjectStar;
  /** Enseignements tires. Tableau vide tant que la redaction n’a pas eu lieu. */
  readonly learnings: readonly string[];
  /** Tableau vide plutot que champ optionnel : un absent se lit, il ne se devine pas. */
  readonly links: readonly ProjectLink[];
  readonly visuals: readonly ProjectVisual[];
  readonly featured: boolean;
}

/** Libelles des quatre champs STAR. Aucun texte affiche ne vit dans un composant. */
export const STAR_LABELS: Readonly<Record<keyof ProjectStar, string>> = {
  situation: 'Situation',
  taches: 'Tâches',
  actions: 'Actions',
  resultats: 'Résultats',
};

/** Ordre de restitution des champs STAR. */
export const STAR_ORDER: readonly (keyof ProjectStar)[] = [
  'situation',
  'taches',
  'actions',
  'resultats',
];

export const CATEGORY_LABELS: Readonly<Record<ProjectCategory, string>> = {
  professionnel: 'Professionnel',
  personnel: 'Personnel',
  academique: 'Académique',
};

/** Ordre d’affichage des categories dans l’index. */
export const CATEGORY_ORDER: readonly ProjectCategory[] = [
  'professionnel',
  'academique',
  'personnel',
];

/**
 * ---------------------------------------------------------------------------
 * DONNEES
 * ---------------------------------------------------------------------------
 * Migrees depuis AUDIT.md section 9, SANS reecriture editoriale.
 *
 * Corrections objectives appliquees, et elles seules :
 *   - « Taches » devient « Tâches »                      (AUDIT.md 10, #50)
 *   - « Calcul » devient « Calculs »                     (AUDIT.md 10, #49)
 *   - alt « Profile pour connection et inscription »
 *     devient « Profil : ecrans de connexion et d’inscription »
 *                                                        (AUDIT.md 10, #51)
 *   - alt « Supprimer la fiche » remplace : il decrivait
 *     une action, pas l’image                            (AUDIT.md 5.2)
 *   - les deux alt en doublon exact d’archilog sont differencies
 *                                                        (AUDIT.md 5.2)
 *   - ponctuation francaise normalisee partout           (AUDIT.md 8.2)
 *
 * Restent EN ATTENTE de la passe editoriale :
 *   - `period` : AUDIT.md ne date aucun des deux projets
 *   - `learnings` : aucun enseignement n’est consigne dans le site precedent
 *   - `role` : deduit des actions documentees, a confirmer
 * ---------------------------------------------------------------------------
 */
const PROJECTS: readonly Project[] = [
  {
    slug: 'plateforme-web-calculs',
    title: 'Plateforme Web de Calculs',
    tagline:
      'Application web déployée sur Raspberry Pi permettant d’effectuer divers types de calculs, avec gestion d’utilisateurs hiérarchisée et sécurité intégrée.',
    category: 'academique',
    period: { kind: 'a-preciser' },
    context:
      'L’application couvre la page d’accueil, la création de compte, la connexion et un module de calcul de probabilité fondé sur la loi inverse-gaussienne. Les paramètres de calcul — espérance, forme, valeur t et nombre de valeurs — sont bornés afin de garantir la validité des résultats.',
    role: 'Développeur full-stack',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Raspberry Pi', 'SSH'],
    features: [
      'Création de compte avec vérification du mot de passe et captcha',
      'Connexion sécurisée par identifiant et mot de passe',
      'Module de calcul de probabilité fondé sur la loi inverse-gaussienne',
      'Trois méthodes d’intégration numérique : rectangles à gauche, rectangles médians et trapèzes',
      'Enregistrement et consultation de l’historique des calculs',
      'Hiérarchie d’utilisateurs : administrateurs système, administrateurs web, utilisateurs inscrits et visiteurs',
    ],
    star: {
      situation:
        'Créer une application web pour réaliser divers types de calculs, avec une gestion des utilisateurs et une sécurité intégrée.',
      taches:
        'Développer une plateforme web déployée sur Raspberry Pi, comprenant des fonctionnalités de calcul et une hiérarchie d’utilisateurs.',
      actions:
        'Mettre en place une architecture réseau, utiliser PHP et MySQL pour le backend, HTML/CSS et JavaScript pour le frontend, intégrer des techniques de cryptographie pour la sécurité, et déployer sur Raspberry Pi 4 avec accès SSH.',
      resultats:
        'Application web opérationnelle permettant aux utilisateurs (administrateurs système, administrateurs web, utilisateurs inscrits, visiteurs) de s’inscrire via un captcha, de se connecter de manière sécurisée, d’effectuer des calculs, de stocker leurs résultats et de gérer leurs comptes, dans un environnement optimisé et sécurisé.',
    },
    learnings: [],
    links: [
      {
        kind: 'source',
        label: 'Code source',
        href: 'https://github.com/Ethan-Da/PROBABILITY',
      },
    ],
    visuals: [
      {
        src: '/images/projets/plateforme-web-calculs/accueil.webp',
        alt: 'Page d’accueil de la plateforme, modules de calcul inaccessibles faute de compte',
        caption: 'Page d’accueil',
      },
      {
        src: '/images/projets/plateforme-web-calculs/profil-connexion-inscription.webp',
        alt: 'Menu Profil ouvert sur les entrées de connexion et d’inscription',
        caption: 'Accès au profil',
      },
      {
        src: '/images/projets/plateforme-web-calculs/creation-compte.webp',
        alt: 'Formulaire d’inscription avec champ de vérification du mot de passe',
        caption: 'Création de compte',
      },
      {
        src: '/images/projets/plateforme-web-calculs/connexion.webp',
        alt: 'Formulaire de connexion demandant identifiant et mot de passe',
        caption: 'Connexion',
      },
      {
        src: '/images/projets/plateforme-web-calculs/module-probabilite.webp',
        alt: 'Formulaire de saisie des paramètres du module de probabilité',
        caption: 'Module de probabilité',
      },
      {
        src: '/images/projets/plateforme-web-calculs/rectangles-gauche.webp',
        alt: 'Aire sous la courbe approchée par des rectangles alignés sur le bord gauche de chaque intervalle',
        caption: 'Méthode des rectangles à gauche',
      },
      {
        src: '/images/projets/plateforme-web-calculs/rectangles-medians.webp',
        alt: 'Aire sous la courbe approchée par des rectangles centrés sur le point médian de chaque intervalle',
        caption: 'Méthode des rectangles médians',
      },
      {
        src: '/images/projets/plateforme-web-calculs/trapezes.webp',
        alt: 'Aire sous la courbe approchée par des trapèzes reliant les extrémités de chaque intervalle',
        caption: 'Méthode des trapèzes',
      },
      {
        src: '/images/projets/plateforme-web-calculs/historique-calculs.webp',
        alt: 'Fiche de calcul enregistrée, accompagnée de son bouton de suppression',
        caption: 'Historique des calculs',
      },
    ],
    featured: false,
  },
  {
    slug: 'archilog',
    title: 'Archilog — Gestion financière',
    tagline:
      'Application de gestion financière développée avec Flask et SQLAlchemy Core, offrant une interface web et une interface en ligne de commande (CLI) pour manipuler les données.',
    category: 'academique',
    period: { kind: 'a-preciser' },
    context:
      'Archilog est une application de gestion financière développée en Python, utilisant Flask pour l’interface web, SQLAlchemy Core pour la gestion de la base de données SQLite, et Jinja2 pour la génération de pages HTML dynamiques.',
    role: 'Développeur full-stack',
    technologies: ['Python', 'Flask', 'SQLAlchemy Core', 'SQLite', 'Jinja2'],
    features: [
      'Affichage de toutes les entrées financières',
      'Création, modification et suppression d’entrées',
      'Importation et exportation de données au format CSV',
      'Interface web intuitive',
      'Gestion des erreurs avec messages flash',
      'Interface en ligne de commande complète',
    ],
    star: {
      situation:
        'Créer une application de gestion financière avec des interfaces web et CLI.',
      taches:
        'Développer une application utilisant Flask et SQLAlchemy Core pour gérer les données financières.',
      actions:
        'Mettre en œuvre l’architecture MVC pour structurer le code, utiliser SQLite pour la persistance des données, et développer une interface web intuitive ainsi qu’une interface CLI pour l’automatisation.',
      resultats:
        'Application opérationnelle permettant l’affichage, la création, la modification et la suppression d’entrées financières, avec support pour l’importation/exportation de données au format CSV et une gestion des erreurs via des messages flash.',
    },
    learnings: [],
    links: [
      {
        kind: 'source',
        label: 'Code source',
        href: 'https://github.com/HRazim/Architecture-Logiciel',
      },
    ],
    visuals: [
      {
        src: '/images/projets/archilog/interface-web.webp',
        alt: 'Interface web d’Archilog affichant la liste des entrées financières',
        caption: 'Liste des entrées financières',
      },
      {
        src: '/images/projets/archilog/formulaire-entree.webp',
        alt: 'Formulaire de création et de modification d’une entrée financière',
        caption: 'Création d’une entrée',
      },
    ],
    featured: false,
  },
];

/* -------------------------------------------------------------------------
   ACCES
   ------------------------------------------------------------------------- */

/** Toutes les realisations, dans l’ordre de declaration. */
export function getAllProjects(): readonly Project[] {
  return PROJECTS;
}

/** Une realisation par son identifiant d’URL. `undefined` si inconnue. */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** Les realisations mises en avant sur l’accueil. */
export function getFeaturedProjects(): readonly Project[] {
  return PROJECTS.filter((project) => project.featured);
}

/** Tous les identifiants d’URL, pour generateStaticParams. */
export function getProjectSlugs(): readonly ProjectSlug[] {
  return PROJECTS.map((project) => project.slug);
}

export interface ProjectGroup {
  readonly category: ProjectCategory;
  readonly projects: readonly Project[];
}

/** Realisations groupees par categorie, dans l’ordre de CATEGORY_ORDER. */
export function getProjectsByCategory(): readonly ProjectGroup[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    projects: PROJECTS.filter((project) => project.category === category),
  })).filter((group) => group.projects.length > 0);
}

export interface AdjacentProjects {
  readonly previous: Project | null;
  readonly next: Project | null;
}

/** Realisation precedente et suivante, pour la navigation de bas de page. */
export function getAdjacentProjects(slug: ProjectSlug): AdjacentProjects {
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: PROJECTS[index - 1] ?? null,
    next: PROJECTS[index + 1] ?? null,
  };
}
