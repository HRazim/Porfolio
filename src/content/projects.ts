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
 * ---------------------------------------------------------------------------
 * REGLE DE REMPLISSAGE
 * ---------------------------------------------------------------------------
 * Un champ dont la valeur n’est pas etablie vaut `null`, ou reste un tableau
 * vide. Aucune approximation, aucune date deduite, aucune URL supposee, aucun
 * chiffre arrondi. Les composants savent taire une section vide plutot que
 * d’afficher un titre sans contenu.
 *
 * Ces fiches decrivent des experiences reelles, verifiables aupres des
 * organisations concernees. Toute formulation qui majore un resultat est une
 * dette payable en entretien.
 * ---------------------------------------------------------------------------
 */

import type { Period } from './period';

/** Identifiants d’URL. Union fermee : une route inconnue ne compile pas. */
export type ProjectSlug =
  | 'egis-systeme-supervision'
  | 'forum-orientation-trappes'
  | 'plateforme-web-calculs'
  | 'archilog'
  | 'jtr';

/**
 * Categorie de la realisation.
 *
 * C’est ELLE qui porte la classification, et elle seule. L’intitule du role
 * est libre : une union fermee de roles s’etait revelee intenable des lors
 * que le portfolio melange des travaux techniques et non techniques
 * (« Concepteur et developpeur unique » et « Intervenant » n’ont aucun
 * vocabulaire commun a partager).
 */
export type ProjectCategory = 'professionnel' | 'personnel' | 'academique';

/** Technologies connues du systeme. Ajouter une entree ici avant de l’employer. */
export type Technology =
  | 'HTML'
  | 'CSS'
  | 'JavaScript'
  | 'PHP'
  | 'PHP 8.3'
  | 'Symfony 6.4 LTS'
  | 'Doctrine ORM'
  | 'MySQL'
  | 'MySQL 8'
  | 'Redis'
  | 'Docker'
  | 'Apache'
  | 'API REST'
  | 'JWT'
  | 'Prometheus'
  | 'Sentry'
  | 'GitLab'
  | 'Jira'
  | 'UML'
  | 'Raspberry Pi'
  | 'SSH'
  | 'Python'
  | 'Flask'
  | 'SQLAlchemy Core'
  | 'SQLite'
  | 'Jinja2'
  | 'Kotlin'
  | 'Jetpack Compose'
  | 'MVVM'
  | 'Room'
  | 'Coroutines'
  | 'Flow'
  | 'Material 3'
  | 'Android';

/**
 * Nature d’un lien sortant. Determine le pictogramme.
 * Les reseaux sont nommes un par un : une valeur « social » fourre-tout
 * obligerait a rebrancher sur une chaine dans le JSX pour choisir l’icone.
 */
export type ProjectLinkKind =
  | 'source'
  | 'demo'
  | 'article'
  | 'documentation'
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'reddit';

export interface ProjectLink {
  readonly kind: ProjectLinkKind;
  readonly label: string;
  readonly href: string;
}

/**
 * Visuel de realisation.
 *
 * `src` est un chemin de base sous public/, SANS suffixe de largeur ni
 * extension. La galerie en derive un `srcset` par largeur, dans les deux
 * encodages : `{src}-{largeur}.avif` et `{src}-{largeur}.webp`. Tout est
 * produit a l’avance, aucun optimiseur n’intervient au service — ce qui
 * preserve la compatibilite export statique.
 *
 * `widths` liste les largeurs REELLEMENT produites, croissantes. Une source
 * plus petite que le palier n’est jamais agrandie : elle n’a alors qu’une
 * seule entree.
 *
 * `width` et `height` sont les dimensions du plus grand fichier. Elles sont
 * obligatoires : sans elles le navigateur ne peut pas reserver la place de
 * l’image, et la page saute au chargement.
 */
export interface ProjectVisual {
  readonly src: `/images/${string}`;
  readonly widths: readonly number[];
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly caption: string;
}

/**
 * Methode STAR : situation, taches, actions, resultats.
 *
 * `resultats` accepte `null` : une realisation peut etre menee sans qu’aucun
 * resultat chiffre ou verifiable soit disponible. Mieux vaut un champ
 * explicitement a completer qu’une phrase de remplissage.
 */
export interface ProjectStar {
  readonly situation: string;
  readonly taches: string;
  readonly actions: string;
  readonly resultats: string | null;
}

export interface Project {
  readonly slug: ProjectSlug;
  readonly title: string;
  /** Accroche d’une phrase. */
  readonly tagline: string;
  readonly category: ProjectCategory;
  readonly period: Period;
  /** Cadre du projet. `null` si aucun cadre distinct de la situation n’est documente. */
  readonly context: string | null;
  /** Intitule du role. Chaine libre : la classification est portee par `category`. */
  readonly role: string;
  /** Perimetre du role. `null` lorsque l’intitule se suffit. */
  readonly roleDetail: string | null;
  /**
   * Ce que la livraison ne couvre PAS.
   *
   * Champ deliberement prevu : annoncer soi-meme la limite d’un travail vaut
   * mieux que la laisser decouvrir. `null` lorsque la question ne se pose pas.
   */
  readonly outOfScope: string | null;
  readonly technologies: readonly Technology[];
  readonly features: readonly string[];
  readonly star: ProjectStar;
  readonly learnings: readonly string[];
  /** Tableau vide plutot que champ optionnel : un absent se lit, il ne se devine pas. */
  readonly links: readonly ProjectLink[];
  readonly visuals: readonly ProjectVisual[];
  /**
   * Rang de mise en avant sur l’accueil. `null` = non mise en avant.
   *
   * Un rang explicite plutot qu’un booleen : l’ordre d’affichage devient une
   * donnee, il ne depend plus de la position dans le tableau.
   */
  readonly featuredRank: number | null;
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
 * L’ordre de declaration suit l’ordre de lecture de l’index — professionnel,
 * academique, personnel — de sorte que la navigation precedent/suivant d’une
 * fiche a l’autre reproduise le parcours de l’index.
 *
 * L’ordre de mise en avant sur l’accueil, lui, est porte par `featuredRank`
 * et ne depend pas de cet ordre.
 *
 * Les deux realisations academiques sont migrees depuis AUDIT.md section 9,
 * SANS reecriture editoriale. Corrections objectives uniquement :
 *   - « Taches » devient « Tâches »                      (AUDIT.md 10, #50)
 *   - « Calcul » devient « Calculs »                     (AUDIT.md 10, #49)
 *   - quatre attributs alt reecrits                      (AUDIT.md 5.2)
 *   - ponctuation francaise normalisee partout           (AUDIT.md 8.2)
 * ---------------------------------------------------------------------------
 */
const PROJECTS: readonly Project[] = [
  {
    slug: 'egis-systeme-supervision',
    title: 'Système de supervision applicative — Egis',
    tagline:
      'Concevoir et développer le socle d’un outil de supervision destiné à détecter les incidents avant que les clients ne les signalent.',
    category: 'professionnel',
    period: { kind: 'connue', start: '2025-04-14', end: '2025-06-20' },
    context: null,
    role: 'Développeur informatique, stage',
    roleDetail:
      'Seul développeur affecté au projet, au sein d’une équipe répartie en deux pôles, PHP d’une part, React et Node.js d’autre part.',
    outOfScope:
      'L’interface web et les librairies de supervision destinées aux applications Node.js et React n’entraient pas dans le périmètre que j’ai livré à l’issue du stage.',
    technologies: [
      'PHP 8.3',
      'Symfony 6.4 LTS',
      'Doctrine ORM',
      'MySQL 8',
      'Redis',
      'Docker',
      'Apache',
      'API REST',
      'JWT',
      'Prometheus',
      'Sentry',
      'GitLab',
      'Jira',
      'UML',
    ],
    features: [],
    star: {
      situation:
        'Egis exploite les applications de stationnement de plusieurs villes françaises, chacune disposant de la sienne. L’équipe technique n’avait aucune vue d’ensemble de leur état de fonctionnement : vérifier qu’une application allait bien supposait de l’ouvrir et de la contrôler, une par une. Les dysfonctionnements se découvraient donc en réaction, parfois signalés depuis l’extérieur avant d’avoir été détectés en interne. Il en résultait une détection tardive, un temps de résolution allongé et une charge accrue sur l’équipe.',
      taches:
        'Concevoir et développer un système de supervision sur mesure offrant une surveillance automatisée des applications, une détection précoce des dysfonctionnements, une vue centralisée de leur état, des alertes automatiques et une localisation rapide des erreurs.',
      actions:
        'Traduction du besoin métier en spécifications fonctionnelles et techniques, puis modélisation complète : diagrammes de cas d’utilisation, de séquence et de classes, architecture système, modèle entité-association et définition des scénarios de test avant tout développement. Développement ensuite d’une API REST en Symfony organisée en quatre couches — entités, accès aux données, services métier, contrôleurs — avec authentification par jetons JWT, mise en cache Redis des données les plus consultées, requêtes paginées et export des métriques au format OpenMetrics pour exploitation dans Grafana. Conteneurisation complète sous Docker pour garantir un comportement identique du poste de développement à la production. Travail dans un cadre de développement d’équipe inconnu jusqu’alors : tickets Jira avec imputation des heures, développement en branche, Merge Requests soumises à revue de code obligatoire par les développeurs seniors.',
      resultats:
        'Livraison du socle technique du système : une API REST couvrant sept domaines fonctionnels — métriques, seuils d’alerte, cycle de vie des alertes, contrôle de santé, gestion des utilisateurs, génération de rapports et authentification — pour six entités métier, cinq services et sept contrôleurs, avec une configuration Docker complète et l’ensemble du dossier de conception. L’équipe technique a ensuite poursuivi le développement à partir de cette base : le tableau de bord centralise aujourd’hui l’état de santé des applications exploitées pour plusieurs villes françaises, à l’usage des équipes techniques.',
    },
    learnings: [
      'Sur une erreur d’estimation que j’assume : la phase de conception a demandé nettement plus de temps que prévu, et ce dépassement a réduit d’autant le temps de développement. La modélisation était nécessaire et déterminait la qualité de l’ensemble, mais je l’ai chiffrée trop court. Estimer une phase que l’on n’a jamais menée est un exercice qui s’apprend en le ratant une fois.',
      'Le besoin exprimé était technique, le problème réel était commercial. Ce que l’équipe subissait n’était pas une absence de métriques, c’était d’apprendre les pannes par ses clients. Comprendre cette différence change la solution que l’on propose.',
      'La revue de code systématique est un exercice de posture autant que de technique. Présenter son travail, recevoir une critique argumentée et l’intégrer sans le prendre personnellement s’apprend, et c’est ce qui m’a fait progresser le plus vite.',
      'Travailler seul sur un projet au sein d’une équipe mobilisée sur des urgences client impose d’avancer par soi-même, de préparer ses questions et de choisir le moment de les poser.',
    ],
    // Depot interne a l’entreprise : aucun lien public.
    links: [],
    // Contenu propriete de l’entreprise : aucun visuel.
    visuals: [],
    featuredRank: 1,
  },
  {
    slug: 'forum-orientation-trappes',
    title: 'Forum de l’orientation de Trappes',
    tagline:
      'Représenter les filières informatiques devant des lycéens, puis conseiller chaque profil individuellement.',
    category: 'professionnel',
    period: { kind: 'connue', start: '2025-02', end: '2025-02' },
    context: null,
    role: 'Intervenant',
    roleDetail: null,
    outOfScope: null,
    // Realisation deliberement non technique.
    technologies: [],
    features: [],
    star: {
      situation:
        'Les lycéens et étudiants qui s’orientent connaissent mal les filières informatiques et se déterminent souvent sur des représentations approximatives du métier.',
      taches:
        'Représenter ces filières lors du forum, devant des assemblées comme en entretien individuel.',
      actions:
        'Prise de parole publique et présentation des filières devant des groupes de lycéens et d’étudiants. Puis accompagnement individualisé : comprendre le profil et les ambitions de chaque personne pour l’orienter vers la filière qui lui correspond réellement.',
      resultats:
        'Une quinzaine d’entretiens individuels menés dans la journée, de dix à quinze minutes chacun, en complément des présentations devant les assemblées.',
    },
    learnings: [
      'Convaincre une assemblée et convaincre une personne sont deux exercices différents. Le premier demande une structure et un rythme ; le second demande d’écouter avant de proposer.',
      'Conseiller utilement suppose de comprendre l’objectif de l’interlocuteur avant de présenter une solution. Une orientation proposée sans avoir compris l’ambition de la personne est une réponse à une question qui n’a pas été posée.',
    ],
    links: [],
    visuals: [],
    featuredRank: 3,
  },
  {
    slug: 'plateforme-web-calculs',
    title: 'Plateforme Web de Calculs',
    tagline:
      'Application web déployée sur Raspberry Pi permettant d’effectuer divers types de calculs, avec gestion d’utilisateurs hiérarchisée et sécurité intégrée.',
    category: 'academique',
    period: { kind: 'connue', start: '2024-11', end: '2025-03' },
    context:
      'L’application couvre la page d’accueil, la création de compte, la connexion et un module de calcul de probabilité fondé sur la loi inverse-gaussienne. Les paramètres de calcul — espérance, forme, valeur t et nombre de valeurs — sont bornés afin de garantir la validité des résultats.',
    // Intitule de contribution, non de perimetre : la repartition des taches
    // n’est pas documentee, rien ne permet donc de revendiquer le full-stack.
    role: 'Membre de l’équipe de développement',
    roleDetail:
      'Projet mené en équipe, dans le cadre du BUT Informatique à l’IUT de Vélizy-Villacoublay.',
    outOfScope: null,
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Raspberry Pi', 'SSH'],
    features: [
      'Création de compte avec vérification du mot de passe et captcha',
      'Connexion par identifiant et mot de passe',
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
      // Premiere personne du PLURIEL : le projet est collectif et la
      // repartition des taches n’est pas documentee. Le contenu technique est
      // strictement celui d’origine, seule la personne grammaticale change.
      actions:
        'Nous avons mis en place une architecture réseau, utilisé PHP et MySQL pour le backend, HTML/CSS et JavaScript pour le frontend, intégré des techniques de cryptographie pour la sécurité, et déployé sur Raspberry Pi 4 avec accès SSH.',
      resultats:
        'Nous avons livré une application web permettant aux utilisateurs (administrateurs système, administrateurs web, utilisateurs inscrits, visiteurs) de s’inscrire via un captcha, de se connecter, d’effectuer des calculs, de stocker leurs résultats et de gérer leurs comptes.',
    },
    learnings: [
      'Concevoir quatre profils d’utilisateurs aux droits distincts oblige à définir qui peut faire quoi avant d’écrire la première ligne. Les autorisations ne s’ajoutent pas après coup : elles structurent l’application entière.',
      'Déployer sur un Raspberry Pi impose des contraintes de ressources qu’un serveur classique fait oublier. Travailler sous contrainte matérielle force à distinguer ce qui est nécessaire de ce qui est confortable.',
    ],
    // Le depot public appartient au compte GitHub d’un membre de l’equipe :
    // le presenter comme « le code source » de cette realisation serait
    // ambigu sur la propriete du travail. Aucun lien, donc.
    links: [],
    visuals: [
      {
        src: '/images/projets/plateforme-web-calculs/accueil',
        widths: [400, 800],
        width: 800,
        height: 394,
        alt: 'Page d’accueil de la plateforme, modules de calcul inaccessibles faute de compte',
        caption: 'Page d’accueil',
      },
      {
        src: '/images/projets/plateforme-web-calculs/profil-connexion-inscription',
        widths: [400, 800],
        width: 800,
        height: 392,
        alt: 'Menu Profil ouvert sur les entrées de connexion et d’inscription',
        caption: 'Accès au profil',
      },
      {
        src: '/images/projets/plateforme-web-calculs/creation-compte',
        widths: [400, 800],
        width: 800,
        height: 390,
        alt: 'Formulaire d’inscription avec champ de vérification du mot de passe',
        caption: 'Création de compte',
      },
      {
        src: '/images/projets/plateforme-web-calculs/connexion',
        widths: [400, 800],
        width: 800,
        height: 390,
        alt: 'Formulaire de connexion demandant identifiant et mot de passe',
        caption: 'Connexion',
      },
      {
        src: '/images/projets/plateforme-web-calculs/module-probabilite',
        widths: [400, 800],
        width: 800,
        height: 391,
        alt: 'Formulaire de saisie des paramètres du module de probabilité',
        caption: 'Module de probabilité',
      },
      {
        src: '/images/projets/plateforme-web-calculs/rectangles-gauche',
        widths: [364],
        width: 364,
        height: 354,
        alt: 'Aire sous la courbe approchée par des rectangles alignés sur le bord gauche de chaque intervalle',
        caption: 'Méthode des rectangles à gauche',
      },
      {
        src: '/images/projets/plateforme-web-calculs/rectangles-medians',
        widths: [220],
        width: 220,
        height: 175,
        alt: 'Aire sous la courbe approchée par des rectangles centrés sur le point médian de chaque intervalle',
        caption: 'Méthode des rectangles médians',
      },
      {
        src: '/images/projets/plateforme-web-calculs/trapezes',
        widths: [220],
        width: 220,
        height: 175,
        alt: 'Aire sous la courbe approchée par des trapèzes reliant les extrémités de chaque intervalle',
        caption: 'Méthode des trapèzes',
      },
      {
        src: '/images/projets/plateforme-web-calculs/historique-calculs',
        widths: [400, 800],
        width: 800,
        height: 422,
        alt: 'Fiche de calcul enregistrée, accompagnée de son bouton de suppression',
        caption: 'Historique des calculs',
      },
    ],
    featuredRank: null,
  },
  {
    slug: 'archilog',
    title: 'Archilog — Gestion financière',
    tagline:
      'Application de gestion financière développée avec Flask et SQLAlchemy Core, offrant une interface web et une interface en ligne de commande (CLI) pour manipuler les données.',
    category: 'academique',
    period: { kind: 'connue', start: '2025-01', end: '2025-03' },
    context:
      'Archilog est une application de gestion financière développée en Python, utilisant Flask pour l’interface web, SQLAlchemy Core pour la gestion de la base de données SQLite, et Jinja2 pour la génération de pages HTML dynamiques.',
    role: 'Développeur full-stack',
    // Rien n’etablit un travail collectif sur cette realisation : la mention
    // se limite donc au cadre de formation.
    roleDetail:
      'Projet réalisé dans le cadre du BUT Informatique à l’IUT de Vélizy-Villacoublay.',
    outOfScope: null,
    technologies: ['Python', 'Flask', 'SQLAlchemy Core', 'SQLite', 'Jinja2'],
    features: [
      'Affichage de toutes les entrées financières',
      'Création, modification et suppression d’entrées',
      'Importation et exportation de données au format CSV',
      'Interface web de consultation et de saisie',
      'Gestion des erreurs avec messages flash',
      'Interface en ligne de commande complète',
    ],
    star: {
      situation:
        'Créer une application de gestion financière avec des interfaces web et CLI.',
      taches:
        'Développer une application utilisant Flask et SQLAlchemy Core pour gérer les données financières.',
      actions:
        'Mettre en œuvre l’architecture MVC pour structurer le code, utiliser SQLite pour la persistance des données, et développer une interface web ainsi qu’une interface CLI pour l’automatisation.',
      resultats:
        'L’application permet l’affichage, la création, la modification et la suppression d’entrées financières, avec support pour l’importation/exportation de données au format CSV et une gestion des erreurs via des messages flash.',
    },
    learnings: [
      'Livrer une interface web et une interface en ligne de commande sur la même logique métier n’est possible que si la logique est séparée de la présentation. C’est l’architecture qui rend la double interface réalisable, pas l’inverse.',
      'Une interface en ligne de commande ne sert pas les mêmes usages qu’une interface web : l’une automatise, l’autre explore. Concevoir les deux oblige à se demander comment l’outil sera réellement utilisé.',
    ],
    links: [
      {
        kind: 'source',
        label: 'Code source',
        href: 'https://github.com/HRazim/Architecture-Logiciel',
      },
    ],
    visuals: [
      {
        src: '/images/projets/archilog/interface-web',
        widths: [400, 800],
        width: 800,
        height: 174,
        alt: 'Interface web d’Archilog affichant la liste des entrées financières',
        caption: 'Liste des entrées financières',
      },
      {
        src: '/images/projets/archilog/formulaire-entree',
        widths: [400, 800],
        width: 800,
        height: 253,
        alt: 'Formulaire de création et de modification d’une entrée financière',
        caption: 'Création d’une entrée',
      },
    ],
    featuredRank: null,
  },
  {
    slug: 'jtr',
    title: 'JTR — gestionnaire de contacts privacy-first',
    tagline:
      'Une application Android entièrement locale qui conserve ce qui fait durer une relation, sans serveur, sans publicité et sans traceur.',
    category: 'personnel',
    // Debut date, fin non arretee : la borne « en-cours » dit exactement
    // cela, la ou la variante `{ kind: 'en-cours' }` perdait la date connue.
    period: { kind: 'connue', start: '2026-02', end: 'en-cours' },
    context: null,
    role: 'Concepteur et développeur unique',
    roleDetail:
      'Conception produit, architecture, développement, tests et préparation à la publication.',
    outOfScope: null,
    technologies: [
      'Kotlin',
      'Jetpack Compose',
      'MVVM',
      'Room',
      'Coroutines',
      'Flow',
      'Material 3',
      'Android',
    ],
    features: [],
    star: {
      situation:
        'Les applications de contacts conservent un numéro et presque rien d’autre. Or ce qui nourrit une relation, ce sont les détails humains : le prénom, les dates qui comptent, ce que la personne a raconté. Les solutions existantes qui stockent ces informations les hébergent sur leurs propres serveurs, ce qui pose un problème de confidentialité sur des données intimes.',
      taches:
        'Concevoir et développer seul une application Android capable de conserver ces détails — relations, catégories, notes, photographies — et de rappeler les dates importantes, tout en garantissant que rien ne quitte l’appareil. Cible : les personnes qui entretiennent des relations durables et tiennent à leur confidentialité, du commercial qui se souvient d’un détail client à l’ami qui refuse de perdre le fil.',
      actions:
        'Architecture MVVM à flux de données unidirectionnel avec Jetpack Compose, séparant strictement l’état et le rendu pour rendre les ViewModels testables. Persistance en base locale Room, avec des migrations de schéma systématiquement testées et aucun repli destructif : une migration absente ou incohérente interrompt l’application plutôt que d’effacer silencieusement les données. Conception privacy-first sans aucun serveur : ni analytique, ni traceur, sauvegarde automatique désactivée, et les seuls appels réseau — tuiles cartographiques et géocodage d’une ville saisie manuellement — n’émettent jamais la position de l’appareil. Traitement des contraintes propres à la plateforme : plafonnement des alarmes exactes imposé depuis Android 13, séquence de permissions de localisation en premier plan puis en arrière-plan avec divulgation conforme aux exigences de Google Play, et internationalisation sur treize langues.',
      resultats:
        'Base de code d’environ vingt-six mille lignes, sans erreur d’analyse statique. Vingt-deux versions successives du schéma de base de données, dont les migrations de la onzième à la vingt-deuxième sont couvertes par des tests instrumentés incluant des contrôles négatifs. Interface traduite en treize langues. Version 7.1.65 de l’application construite et signée après un audit complet de pré-publication et une phase de durcissement. Application soumise à Google Play, mise en test fermé, accès à la production demandé.',
    },
    learnings: [
      'Un arbitrage d’intégrité que je défends : sur une application dont toute la valeur réside dans la donnée locale, une interruption récupérable vaut mieux qu’une perte définitive. J’ai donc écarté tout repli destructif sur les migrations de base de données, au prix d’une expérience dégradée dans le cas rare où une migration échoue.',
      'La confidentialité se décide à la conception, pas après coup. L’absence de serveur n’est pas une économie d’infrastructure : c’est ce qui rend la promesse vérifiable.',
      'Prouver qu’un test peut échouer vaut mieux que le voir passer. Les contrôles négatifs sur les migrations sont ce qui donne une valeur réelle à la couverture.',
      'La validation sur appareil réel est irremplaçable. Un qualificatif de ressource linguistique erroné pour l’indonésien, invisible en analyse statique comme en émulateur, n’a été révélé que sur un téléphone physique.',
    ],
    links: [
      {
        kind: 'source',
        label: 'Code source',
        href: 'https://github.com/HRazim/JTR',
      },
      {
        kind: 'instagram',
        label: 'JTR sur Instagram',
        href: 'https://www.instagram.com/justtorememberapp/',
      },
      {
        kind: 'x',
        label: 'JTR sur X',
        href: 'https://x.com/JusToRememberr',
      },
      {
        kind: 'tiktok',
        label: 'JTR sur TikTok',
        href: 'https://www.tiktok.com/@justtoremember_app',
      },
      {
        kind: 'reddit',
        label: 'JTR sur Reddit',
        href: 'https://www.reddit.com/user/JTR_app/',
      },
    ],
    // Captures issues de la fiche Google Play. Le titre incruste dans chaque
    // image est en anglais et n’est lu par aucune technologie d’assistance :
    // le texte alternatif decrit donc l’ECRAN, jamais ce titre.
    visuals: [
      {
        src: '/images/jtr/liste-contacts',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Liste de contacts sur téléphone : chaque ligne porte une photographie, un nom, une ville, une date de naissance et une étoile de mise en favori, deux contacts étant marqués.',
        caption: 'Liste des contacts, avec favoris, ville et date de naissance',
      },
      {
        src: '/images/jtr/fiche-contact',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Fiche d’un contact : photographie, catégorie, date d’anniversaire avec rappel, relation vers un autre contact, courriel, origine, ville et zone de notes libres.',
        caption: 'Fiche détaillée d’un contact, avec relations, origine et notes',
      },
      {
        src: '/images/jtr/carte-localisation',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Bas d’une fiche de contact : téléphone, courriel, employeur, origine et ville, suivis d’une carte affichant un repère sur la ville renseignée.',
        caption: 'Localisation d’un contact sur une carte',
      },
      {
        src: '/images/jtr/vue-grille',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Contacts présentés en grille de deux colonnes, chaque vignette montrant la photographie en pleine largeur avec le nom et la ville superposés.',
        caption: 'Vue en grille des contacts',
      },
      {
        src: '/images/jtr/categories-relations',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Écran des catégories : trois vignettes illustrées, Favoris, Amis et Travail, chacune indiquant le nombre de contacts qu’elle regroupe.',
        caption: 'Organisation par catégories et par relations',
      },
      {
        src: '/images/jtr/selecteur-langue',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Sélecteur de langue déroulé, l’option Langue du système étant cochée, suivie des langues proposées écrites dans leur propre alphabet.',
        caption: 'Sélecteur de langue, treize langues disponibles',
      },
      {
        src: '/images/jtr/theme-couleurs',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Réglages ouverts sur un panneau de palettes de couleurs, six choix présentés par des pastilles, la palette active étant cochée.',
        caption: 'Choix du thème de couleurs',
      },
      {
        src: '/images/jtr/sauvegarde-confidentialite',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: 'Réglages ouverts sur une boîte de dialogue de sauvegarde : elle propose d’exporter toutes les données vers un fichier unique ou de restaurer une sauvegarde précédente, par-dessus les réglages de notification et l’entrée menant à la politique de confidentialité.',
        caption: 'Sauvegarde locale et paramètres de confidentialité',
      },
    ],
    featuredRank: 2,
  },
];

/* -------------------------------------------------------------------------
   ACCES
   ------------------------------------------------------------------------- */

/** Une realisation par son identifiant d’URL. `undefined` si inconnue. */
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/**
 * Les realisations mises en avant sur l’accueil, triees par rang explicite.
 * L’ordre ne depend pas de la position dans le tableau.
 */
export function getFeaturedProjects(): readonly Project[] {
  return PROJECTS.filter(
    (project): project is Project & { featuredRank: number } => project.featuredRank !== null,
  ).sort((a, b) => a.featuredRank - b.featuredRank);
}

/**
 * Technologies retenues pour une VIGNETTE COMPACTE, et le reste en compteur.
 *
 * Deux bornes, et une seule raison : la vignette de l’accueil dispose d’une
 * rangee de pastilles, pas de quatre.
 *
 *   - QUATRE au maximum. C’est un teaser, pas un inventaire ; la liste
 *     complete est sur la fiche.
 *   - VINGT-HUIT CARACTERES de budget cumule. La colonne de l’accueil porte
 *     environ trente-quatre caracteres monospace ; six sont reserves au
 *     compteur. Une pastille « Symfony 6.4 LTS » consomme a elle seule la
 *     moitie du budget, et c’est normal : mieux vaut deux technologies sur
 *     une ligne que quatre sur deux lignes.
 *
 * Ces deux nombres sont des bornes de MISE EN PAGE, pas des jetons de design :
 * ils ne decrivent ni une couleur, ni une taille, ni un espacement. Ils vivent
 * ici, avec la donnee qu’ils decoupent, plutot que dans le composant.
 */
const CARD_TECHNOLOGIES_MAX = 4;
const CARD_TECHNOLOGIES_BUDGET = 28;

export interface CardTechnologies {
  /** Les pastilles effectivement affichees, dans l’ordre de declaration. */
  readonly shown: readonly string[];
  /** Nombre de technologies non affichees. `0` quand tout tient. */
  readonly extra: number;
}

export function pickCardTechnologies(project: Project): CardTechnologies {
  const shown: string[] = [];
  let budget = CARD_TECHNOLOGIES_BUDGET;

  for (const technology of project.technologies) {
    if (shown.length === CARD_TECHNOLOGIES_MAX) break;
    // + 3 : les deux caracteres d’encadrement de la pastille et la gouttiere.
    const cost = technology.length + 3;
    if (cost > budget) break;
    budget -= cost;
    shown.push(technology);
  }

  return { shown, extra: project.technologies.length - shown.length };
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
