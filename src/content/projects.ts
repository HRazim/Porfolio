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

import type { Translated, TranslatedList } from './i18n';
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
  | 'google-play'
  | 'demo'
  | 'article'
  | 'documentation'
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'reddit';

export interface ProjectLink {
  readonly kind: ProjectLinkKind;
  readonly label: Translated;
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
  readonly alt: Translated;
  readonly caption: Translated;
}

/**
 * Methode STAR : situation, taches, actions, resultats.
 *
 * `resultats` accepte `null` : une realisation peut etre menee sans qu’aucun
 * resultat chiffre ou verifiable soit disponible. Mieux vaut un champ
 * explicitement a completer qu’une phrase de remplissage.
 */
export interface ProjectStar {
  readonly situation: Translated;
  readonly taches: Translated;
  readonly actions: Translated;
  readonly resultats: Translated | null;
}

export interface Project {
  readonly slug: ProjectSlug;
  readonly title: Translated;
  /** Accroche d’une phrase. */
  readonly tagline: Translated;
  readonly category: ProjectCategory;
  readonly period: Period;
  /** Cadre du projet. `null` si aucun cadre distinct de la situation n’est documente. */
  readonly context: Translated | null;
  /** Intitule du role. Chaine libre : la classification est portee par `category`. */
  readonly role: Translated;
  /** Perimetre du role. `null` lorsque l’intitule se suffit. */
  readonly roleDetail: Translated | null;
  /**
   * Ce que la livraison ne couvre PAS.
   *
   * Champ deliberement prevu : annoncer soi-meme la limite d’un travail vaut
   * mieux que la laisser decouvrir. `null` lorsque la question ne se pose pas.
   */
  readonly outOfScope: Translated | null;
  readonly technologies: readonly Technology[];
  readonly features: TranslatedList;
  readonly star: ProjectStar;
  readonly learnings: TranslatedList;
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
export const STAR_LABELS: Readonly<Record<keyof ProjectStar, Translated>> = {
  situation: {
    fr:
      'Situation',
    en:
      'Situation',
    es:
      'Situación',
    ar:
      'الوضع',
  },
  taches: {
    fr:
      'Tâches',
    en:
      'Tasks',
    es:
      'Tareas',
    ar:
      'المهام',
  },
  actions: {
    fr:
      'Actions',
    en:
      'Actions',
    es:
      'Acciones',
    ar:
      'الإجراءات',
  },
  resultats: {
    fr:
      'Résultats',
    en:
      'Results',
    es:
      'Resultados',
    ar:
      'النتائج',
  },
};

/** Ordre de restitution des champs STAR. */
export const STAR_ORDER: readonly (keyof ProjectStar)[] = [
  'situation',
  'taches',
  'actions',
  'resultats',
];

export const CATEGORY_LABELS: Readonly<Record<ProjectCategory, Translated>> = {
  professionnel: {
    fr: 'Professionnel',
    en: 'Professional',
    es: 'Profesional',
    ar: 'مهني',
  },
  personnel: {
    fr: 'Personnel',
    en: 'Personal',
    es: 'Personal',
    ar: 'شخصي',
  },
  academique: {
    fr: 'Académique',
    en: 'Academic',
    es: 'Académico',
    ar: 'أكاديمي',
  },
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
    title: {
      fr:
        'Système de supervision applicative — Egis',
      en:
        'Application monitoring system — Egis',
      es:
        'Sistema de supervisión de aplicaciones — Egis',
      ar:
        'نظام مراقبة التطبيقات — Egis',
    },
    tagline: {
      fr:
        'Concevoir et développer le socle d’un outil de supervision destiné à détecter les incidents avant que les clients ne les signalent.',
      en:
        'Designing and building the foundation of a monitoring tool meant to catch incidents before customers report them.',
      es:
        'Diseñar y desarrollar la base de una herramienta de supervisión destinada a detectar incidencias antes de que los clientes las comuniquen.',
      ar:
        'تصميم وتطوير أساس أداة مراقبة تهدف إلى رصد الأعطال قبل أن يبلّغ عنها العملاء.',
    },
    category: 'professionnel',
    period: { kind: 'connue', start: '2025-04-14', end: '2025-06-20' },
    context: null,
    role: {
      fr:
        'Développeur informatique, stage',
      en:
        'Software developer, internship',
      es:
        'Desarrollador informático, prácticas',
      ar:
        'مطوِّر برمجيات، تدريب',
    },
    roleDetail: {
      fr:
        'Seul développeur affecté au projet, au sein d’une équipe répartie en deux pôles, PHP d’une part, React et Node.js d’autre part.',
      en:
        'The only developer assigned to the project, within a team split into two groups, PHP on one side, React and Node.js on the other.',
      es:
        'Único desarrollador asignado al proyecto, dentro de un equipo dividido en dos polos, PHP por un lado, React y Node.js por otro.',
      ar:
        'المطوّر الوحيد المكلَّف بالمشروع، ضمن فريق موزَّع على قطبين، PHP من جهة، و React و Node.js من جهة أخرى.',
    },
    outOfScope: {
      fr:
        'L’interface web et les librairies de supervision destinées aux applications Node.js et React n’entraient pas dans le périmètre que j’ai livré à l’issue du stage.',
      en:
        'The web interface and the monitoring libraries for Node.js and React applications were not part of what I delivered at the end of the internship.',
      es:
        'La interfaz web y las librerías de supervisión destinadas a las aplicaciones Node.js y React no formaban parte de lo que entregué al final de las prácticas.',
      ar:
        'لم تكن واجهة الويب ولا مكتبات المراقبة الخاصة بتطبيقات Node.js و React ضمن ما سلّمته عند نهاية التدريب.',
    },
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
    features: { fr: [], en: [], es: [], ar: [] },
    star: {
      situation: {
        fr:
          'Egis exploite les applications de stationnement de plusieurs villes françaises, chacune disposant de la sienne. L’équipe technique n’avait aucune vue d’ensemble de leur état de fonctionnement : vérifier qu’une application allait bien supposait de l’ouvrir et de la contrôler, une par une. Les dysfonctionnements se découvraient donc en réaction, parfois signalés depuis l’extérieur avant d’avoir été détectés en interne. Il en résultait une détection tardive, un temps de résolution allongé et une charge accrue sur l’équipe.',
        en:
          'Egis runs the parking applications of several French cities, each with its own. The technical team had no overall view of how they were running: checking that an application was healthy meant opening it and inspecting it, one by one. Failures were therefore discovered reactively, sometimes reported from outside before being detected internally. The result was late detection, longer resolution times and a heavier load on the team.',
        es:
          'Egis explota las aplicaciones de estacionamiento de varias ciudades francesas, cada una con la suya. El equipo técnico no tenía ninguna visión de conjunto de su estado de funcionamiento: comprobar que una aplicación iba bien suponía abrirla y revisarla, una por una. Las incidencias se descubrían por tanto de forma reactiva, a veces señaladas desde fuera antes de haber sido detectadas internamente. De ahí una detección tardía, un tiempo de resolución más largo y una carga mayor para el equipo.',
        ar:
          'تشغّل Egis تطبيقات وقوف السيارات لعدة مدن فرنسية، ولكل مدينة تطبيقها. ولم تكن لدى الفريق التقني أي رؤية شاملة لحالة عملها: فالتأكّد من أن تطبيقًا يعمل جيدًا كان يقتضي فتحه وفحصه، واحدًا تلو الآخر. وهكذا كانت الأعطال تُكتشف بردّ الفعل، ويُبلَّغ عنها أحيانًا من الخارج قبل رصدها داخليًا. فنتج عن ذلك رصد متأخّر، ووقت حلّ أطول، وعبء أثقل على الفريق.',
      },
      taches: {
        fr:
          'Concevoir et développer un système de supervision sur mesure offrant une surveillance automatisée des applications, une détection précoce des dysfonctionnements, une vue centralisée de leur état, des alertes automatiques et une localisation rapide des erreurs.',
        en:
          'Designing and building a bespoke monitoring system providing automated surveillance of the applications, early detection of failures, a centralised view of their state, automatic alerts and quick location of errors.',
        es:
          'Diseñar y desarrollar un sistema de supervisión a medida que ofrezca vigilancia automatizada de las aplicaciones, detección temprana de las incidencias, una vista centralizada de su estado, alertas automáticas y localización rápida de los errores.',
        ar:
          'تصميم وتطوير نظام مراقبة مخصّص يوفّر متابعة آلية للتطبيقات، ورصدًا مبكرًا للأعطال، ورؤية مركزية لحالتها، وتنبيهات تلقائية، وتحديدًا سريعًا لمواضع الأخطاء.',
      },
      actions: {
        fr:
          'Traduction du besoin métier en spécifications fonctionnelles et techniques, puis modélisation complète : diagrammes de cas d’utilisation, de séquence et de classes, architecture système, modèle entité-association et définition des scénarios de test avant tout développement. Développement ensuite d’une API REST en Symfony organisée en quatre couches — entités, accès aux données, services métier, contrôleurs — avec authentification par jetons JWT, mise en cache Redis des données les plus consultées, requêtes paginées et export des métriques au format OpenMetrics pour exploitation dans Grafana. Conteneurisation complète sous Docker pour garantir un comportement identique du poste de développement à la production. Travail dans un cadre de développement d’équipe inconnu jusqu’alors : tickets Jira avec imputation des heures, développement en branche, Merge Requests soumises à revue de code obligatoire par les développeurs seniors.',
        en:
          'Translating the business need into functional and technical specifications, then full modelling: use case, sequence and class diagrams, system architecture, entity-relationship model and definition of the test scenarios before any development. Then building a REST API in Symfony organised in four layers — entities, data access, business services, controllers — with JWT token authentication, Redis caching of the most consulted data, paginated queries and export of the metrics in OpenMetrics format for use in Grafana. Full containerisation under Docker to guarantee identical behaviour from the development machine to production. Work within a team development framework I had not known until then: Jira tickets with hours booked against them, branch-based development, Merge Requests subject to mandatory code review by the senior developers.',
        es:
          'Traducción de la necesidad de negocio en especificaciones funcionales y técnicas, y después modelado completo: diagramas de casos de uso, de secuencia y de clases, arquitectura del sistema, modelo entidad-relación y definición de los escenarios de prueba antes de todo desarrollo. A continuación, desarrollo de una API REST en Symfony organizada en cuatro capas — entidades, acceso a datos, servicios de negocio, controladores — con autenticación por tokens JWT, caché Redis de los datos más consultados, consultas paginadas y exportación de las métricas en formato OpenMetrics para su explotación en Grafana. Contenerización completa con Docker para garantizar un comportamiento idéntico desde el puesto de desarrollo hasta producción. Trabajo en un marco de desarrollo en equipo hasta entonces desconocido para mí: tickets Jira con imputación de horas, desarrollo en ramas, Merge Requests sometidas a revisión de código obligatoria por los desarrolladores sénior.',
        ar:
          'ترجمة الحاجة العملية إلى مواصفات وظيفية وتقنية، ثم نمذجة كاملة: مخطّطات حالات الاستخدام والتسلسل والأصناف، وبنية النظام، ونموذج الكيان-العلاقة، وتحديد سيناريوهات الاختبار قبل أي تطوير. ثم تطوير واجهة REST بلغة Symfony منظَّمة في أربع طبقات — الكيانات والوصول إلى البيانات وخدمات الأعمال والمتحكّمات — مع مصادقة برموز JWT، وتخزين مؤقّت في Redis لأكثر البيانات استخدامًا، واستعلامات مقسَّمة إلى صفحات، وتصدير المقاييس بصيغة OpenMetrics لاستثمارها في Grafana. وحوسبة حاويات كاملة بـ Docker لضمان سلوك متطابق من محطة التطوير إلى الإنتاج. والعمل ضمن إطار تطوير جماعي لم أعرفه من قبل: تذاكر Jira مع احتساب الساعات، والتطوير على فروع، وطلبات دمج تخضع لمراجعة شيفرة إلزامية من المطوّرين الأقدم.',
      },
      resultats: {
        fr:
          'Livraison du socle technique du système : une API REST couvrant sept domaines fonctionnels — métriques, seuils d’alerte, cycle de vie des alertes, contrôle de santé, gestion des utilisateurs, génération de rapports et authentification — pour six entités métier, cinq services et sept contrôleurs, avec une configuration Docker complète et l’ensemble du dossier de conception. L’équipe technique a ensuite poursuivi le développement à partir de cette base : le tableau de bord centralise aujourd’hui l’état de santé des applications exploitées pour plusieurs villes françaises, à l’usage des équipes techniques.',
        en:
          'Delivery of the technical foundation of the system: a REST API covering seven functional areas — metrics, alert thresholds, alert lifecycle, health check, user management, report generation and authentication — for six business entities, five services and seven controllers, with a complete Docker configuration and the whole design file. The technical team then continued development from that base: the dashboard today centralises the health of the applications run for several French cities, for the use of the technical teams.',
        es:
          'Entrega de la base técnica del sistema: una API REST que cubre siete ámbitos funcionales — métricas, umbrales de alerta, ciclo de vida de las alertas, control de salud, gestión de usuarios, generación de informes y autenticación — para seis entidades de negocio, cinco servicios y siete controladores, con una configuración Docker completa y todo el expediente de diseño. El equipo técnico continuó después el desarrollo a partir de esa base: el panel centraliza hoy el estado de salud de las aplicaciones explotadas para varias ciudades francesas, para uso de los equipos técnicos.',
        ar:
          'تسليم الأساس التقني للنظام: واجهة REST تغطّي سبعة مجالات وظيفية — المقاييس وعتبات التنبيه ودورة حياة التنبيهات وفحص السلامة وإدارة المستخدمين وتوليد التقارير والمصادقة — لستة كيانات عمل وخمس خدمات وسبعة متحكّمات، مع إعداد Docker كامل وملف التصميم بأكمله. ثم واصل الفريق التقني التطوير انطلاقًا من هذا الأساس: تجمع لوحة القيادة اليوم حالة سلامة التطبيقات المشغَّلة لعدة مدن فرنسية، لاستعمال الفرق التقنية.',
      },
    },
    learnings: {
      fr: [
        'Sur une erreur d’estimation que j’assume : la phase de conception a demandé nettement plus de temps que prévu, et ce dépassement a réduit d’autant le temps de développement. La modélisation était nécessaire et déterminait la qualité de l’ensemble, mais je l’ai chiffrée trop court. Estimer une phase que l’on n’a jamais menée est un exercice qui s’apprend en le ratant une fois.',
        'Le besoin exprimé était technique, le problème réel était commercial. Ce que l’équipe subissait n’était pas une absence de métriques, c’était d’apprendre les pannes par ses clients. Comprendre cette différence change la solution que l’on propose.',
        'La revue de code systématique est un exercice de posture autant que de technique. Présenter son travail, recevoir une critique argumentée et l’intégrer sans le prendre personnellement s’apprend, et c’est ce qui m’a fait progresser le plus vite.',
        'Travailler seul sur un projet au sein d’une équipe mobilisée sur des urgences client impose d’avancer par soi-même, de préparer ses questions et de choisir le moment de les poser.',
      ],
      en: [
        'On an estimation mistake I own: the design phase took noticeably longer than planned, and that overrun cut the development time by as much. The modelling was necessary and determined the quality of the whole, but I costed it too short. Estimating a phase you have never run is an exercise you learn by getting it wrong once.',
        'The need as stated was technical, the real problem was commercial. What the team was suffering from was not an absence of metrics, it was learning about outages from its customers. Understanding that difference changes the solution you propose.',
        'Systematic code review is as much an exercise in attitude as in technique. Presenting your work, receiving a reasoned criticism and taking it on board without taking it personally is something you learn, and it is what made me progress fastest.',
        'Working alone on a project inside a team taken up with customer emergencies forces you to move forward by yourself, to prepare your questions and to choose when to ask them.',
      ],
      es: [
        'Sobre un error de estimación que asumo: la fase de diseño exigió bastante más tiempo del previsto, y ese exceso redujo en la misma medida el tiempo de desarrollo. El modelado era necesario y determinaba la calidad del conjunto, pero lo estimé demasiado corto. Estimar una fase que nunca se ha llevado a cabo es un ejercicio que se aprende fallando una vez.',
        'La necesidad expresada era técnica, el problema real era comercial. Lo que el equipo sufría no era una ausencia de métricas, era enterarse de las averías por sus clientes. Entender esa diferencia cambia la solución que uno propone.',
        'La revisión sistemática de código es un ejercicio de actitud tanto como de técnica. Presentar el propio trabajo, recibir una crítica argumentada e integrarla sin tomársela como algo personal se aprende, y es lo que me hizo progresar más deprisa.',
        'Trabajar solo en un proyecto dentro de un equipo volcado en urgencias de clientes obliga a avanzar por uno mismo, a preparar las preguntas y a elegir el momento de plantearlas.',
      ],
      ar: [
        'عن خطأ في التقدير أتحمّله: استغرقت مرحلة التصميم وقتًا أطول بكثير مما كان مقرَّرًا، وقلّص هذا التجاوز وقت التطوير بالقدر نفسه. كانت النمذجة ضرورية وهي التي تحدّد جودة العمل كلّه، لكنني قدّرت مدّتها أقصر مما ينبغي. وتقدير مرحلة لم يسبق أن خضتها تمرين لا يُتعلَّم إلا بإخفاقه مرة.',
        'كانت الحاجة المعلَنة تقنية، أما المشكلة الحقيقية فكانت تجارية. لم يكن ما يعانيه الفريق غيابَ المقاييس، بل معرفةَ الأعطال من عملائه. وفهم هذا الفارق يغيّر الحل الذي تقترحه.',
        'المراجعة المنهجية للشيفرة تمرين في الموقف بقدر ما هي تمرين تقني. فعرض عملك، وتلقّي نقد مُعلَّل، واستيعابه دون أخذه على محمل شخصي، أمور تُتعلَّم، وهي ما جعلني أتقدّم أسرع.',
        'العمل منفردًا على مشروع داخل فريق منشغل بحالات عاجلة للعملاء يفرض التقدّم بالاعتماد على النفس، وإعداد الأسئلة، واختيار وقت طرحها.',
      ],
    },
    // Depot interne a l’entreprise : aucun lien public.
    links: [],
    // Contenu propriete de l’entreprise : aucun visuel.
    visuals: [],
    featuredRank: 1,
  },
  {
    slug: 'forum-orientation-trappes',
    title: {
      fr:
        'Forum de l’orientation de Trappes',
      en:
        'Forum de l’orientation de Trappes (careers fair)',
      es:
        'Forum de l’orientation de Trappes (feria de orientación)',
      ar:
        'Forum de l’orientation de Trappes (ملتقى التوجيه)',
    },
    tagline: {
      fr:
        'Représenter les filières informatiques devant des lycéens, puis conseiller chaque profil individuellement.',
      en:
        'Representing computer science courses in front of secondary school students, then advising each of them individually.',
      es:
        'Representar los itinerarios de informática ante alumnos de secundaria y luego asesorar a cada perfil individualmente.',
      ar:
        'تمثيل مسارات المعلوماتية أمام طلاب الثانوية، ثم تقديم المشورة لكل واحد منهم على حدة.',
    },
    category: 'professionnel',
    period: { kind: 'connue', start: '2025-02', end: '2025-02' },
    context: null,
    role: {
      fr:
        'Intervenant',
      en:
        'Speaker',
      es:
        'Ponente',
      ar:
        'متحدّث',
    },
    roleDetail: null,
    outOfScope: null,
    // Realisation deliberement non technique.
    technologies: [],
    features: { fr: [], en: [], es: [], ar: [] },
    star: {
      situation: {
        fr:
          'Les lycéens et étudiants qui s’orientent connaissent mal les filières informatiques et se déterminent souvent sur des représentations approximatives du métier.',
        en:
          'Secondary school and university students choosing a course know little about computer science programmes, and often decide on a rough idea of what the job is.',
        es:
          'Los alumnos de secundaria y los estudiantes que eligen itinerario conocen mal las carreras de informática y a menudo se deciden a partir de una idea aproximada de la profesión.',
        ar:
          'يعرف طلاب الثانوية والجامعة الذين يختارون توجّههم القليل عن مسارات المعلوماتية، وكثيرًا ما يقرّرون بناءً على تصوّر تقريبي عن المهنة.',
      },
      taches: {
        fr:
          'Représenter ces filières lors du forum, devant des assemblées comme en entretien individuel.',
        en:
          'Representing those programmes at the fair, in front of audiences as well as in one-to-one conversations.',
        es:
          'Representar esos itinerarios en la feria, tanto ante el público como en entrevistas individuales.',
        ar:
          'تمثيل تلك المسارات في الملتقى، أمام الحضور وفي المقابلات الفردية على حدّ سواء.',
      },
      actions: {
        fr:
          'Prise de parole publique et présentation des filières devant des groupes de lycéens et d’étudiants. Puis accompagnement individualisé : comprendre le profil et les ambitions de chaque personne pour l’orienter vers la filière qui lui correspond réellement.',
        en:
          'Public speaking and presentation of the programmes in front of groups of secondary school and university students. Then individual guidance: understanding each person’s profile and ambitions in order to point them towards the programme that genuinely fits them.',
        es:
          'Intervenciones públicas y presentación de los itinerarios ante grupos de alumnos de secundaria y estudiantes. Después, acompañamiento individual: entender el perfil y las ambiciones de cada persona para orientarla hacia el itinerario que realmente le corresponde.',
        ar:
          'إلقاء كلمات وتقديم المسارات أمام مجموعات من طلاب الثانوية والجامعة. ثم مرافقة فردية: فهم ملف كل شخص وطموحاته لتوجيهه نحو المسار الذي يناسبه فعلًا.',
      },
      resultats: {
        fr:
          'Une quinzaine d’entretiens individuels menés dans la journée, de dix à quinze minutes chacun, en complément des présentations devant les assemblées.',
        en:
          'Around fifteen one-to-one conversations held during the day, ten to fifteen minutes each, alongside the presentations to audiences.',
        es:
          'Una quincena de entrevistas individuales realizadas durante la jornada, de diez a quince minutos cada una, además de las presentaciones ante el público.',
        ar:
          'نحو خمس عشرة مقابلة فردية أُجريت خلال اليوم، مدّة كل منها عشر إلى خمس عشرة دقيقة، إلى جانب العروض أمام الحضور.',
      },
    },
    learnings: {
      fr: [
        'Convaincre une assemblée et convaincre une personne sont deux exercices différents. Le premier demande une structure et un rythme ; le second demande d’écouter avant de proposer.',
        'Conseiller utilement suppose de comprendre l’objectif de l’interlocuteur avant de présenter une solution. Une orientation proposée sans avoir compris l’ambition de la personne est une réponse à une question qui n’a pas été posée.',
      ],
      en: [
        'Convincing an audience and convincing one person are two different exercises. The first calls for structure and pace; the second calls for listening before proposing.',
        'Advising usefully means understanding the other person’s goal before presenting a solution. A course suggested without having understood that person’s ambition is an answer to a question nobody asked.',
      ],
      es: [
        'Convencer a un público y convencer a una persona son dos ejercicios distintos. El primero exige estructura y ritmo; el segundo exige escuchar antes de proponer.',
        'Asesorar de forma útil supone entender el objetivo del interlocutor antes de presentar una solución. Una orientación propuesta sin haber entendido la ambición de la persona es una respuesta a una pregunta que no se ha hecho.',
      ],
      ar: [
        'إقناع جمهور وإقناع شخص واحد تمرينان مختلفان. الأول يتطلّب بنية وإيقاعًا؛ والثاني يتطلّب الإصغاء قبل الاقتراح.',
        'تقديم مشورة نافعة يفترض فهم هدف المحاور قبل عرض أي حل. توجيه يُقترح دون فهم طموح صاحبه هو جواب عن سؤال لم يُطرح.',
      ],
    },
    links: [],
    visuals: [],
    featuredRank: 3,
  },
  {
    slug: 'plateforme-web-calculs',
    title: {
      fr:
        'Plateforme Web de Calculs',
      en:
        'Web Calculation Platform',
      es:
        'Plataforma web de cálculos',
      ar:
        'منصّة ويب للحسابات',
    },
    tagline: {
      fr:
        'Application web déployée sur Raspberry Pi permettant d’effectuer divers types de calculs, avec gestion d’utilisateurs hiérarchisée et sécurité intégrée.',
      en:
        'A web application deployed on a Raspberry Pi for running various kinds of calculations, with a tiered user system and built-in security.',
      es:
        'Aplicación web desplegada en una Raspberry Pi que permite realizar diversos tipos de cálculos, con gestión jerarquizada de usuarios y seguridad integrada.',
      ar:
        'تطبيق ويب منشور على Raspberry Pi يتيح إجراء أنواع مختلفة من الحسابات، مع إدارة هرمية للمستخدمين وأمان مدمج.',
    },
    category: 'academique',
    period: { kind: 'connue', start: '2024-11', end: '2025-03' },
    context: {
      fr:
        'L’application couvre la page d’accueil, la création de compte, la connexion et un module de calcul de probabilité fondé sur la loi inverse-gaussienne. Les paramètres de calcul — espérance, forme, valeur t et nombre de valeurs — sont bornés afin de garantir la validité des résultats.',
      en:
        'The application covers the home page, account creation, sign-in and a probability module based on the inverse Gaussian distribution. The calculation parameters — mean, shape, t value and number of values — are bounded to keep the results valid.',
      es:
        'La aplicación cubre la página de inicio, la creación de cuenta, el inicio de sesión y un módulo de cálculo de probabilidad basado en la ley inversa gaussiana. Los parámetros de cálculo — esperanza, forma, valor t y número de valores — están acotados para garantizar la validez de los resultados.',
      ar:
        'يغطي التطبيق الصفحة الرئيسية وإنشاء الحساب وتسجيل الدخول ووحدة لحساب الاحتمال قائمة على التوزيع الغاوسي العكسي. ومعاملات الحساب — التوقّع والشكل وقيمة t وعدد القيم — محدودة لضمان صحّة النتائج.',
    },
    // Intitule de contribution, non de perimetre : la repartition des taches
    // n’est pas documentee, rien ne permet donc de revendiquer le full-stack.
    role: {
      fr:
        'Membre de l’équipe de développement',
      en:
        'Member of the development team',
      es:
        'Miembro del equipo de desarrollo',
      ar:
        'عضو في فريق التطوير',
    },
    roleDetail: {
      fr:
        'Projet mené en équipe, dans le cadre du BUT Informatique à l’IUT de Vélizy-Villacoublay.',
      en:
        'A team project, as part of the BUT Informatique (three-year computer science degree) at the IUT de Vélizy-Villacoublay.',
      es:
        'Proyecto realizado en equipo, en el marco del BUT Informatique (grado en informática) del IUT de Vélizy-Villacoublay.',
      ar:
        'مشروع أُنجز ضمن فريق، في إطار BUT Informatique (إجازة في المعلوماتية) في IUT de Vélizy-Villacoublay.',
    },
    outOfScope: null,
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript', 'Raspberry Pi', 'SSH'],
    features: {
      fr: [
        'Création de compte avec vérification du mot de passe et captcha',
        'Connexion par identifiant et mot de passe',
        'Module de calcul de probabilité fondé sur la loi inverse-gaussienne',
        'Trois méthodes d’intégration numérique : rectangles à gauche, rectangles médians et trapèzes',
        'Enregistrement et consultation de l’historique des calculs',
        'Hiérarchie d’utilisateurs : administrateurs système, administrateurs web, utilisateurs inscrits et visiteurs',
      ],
      en: [
        'Account creation with password confirmation and a captcha',
        'Sign-in with a username and a password',
        'Probability module based on the inverse Gaussian distribution',
        'Three numerical integration methods: left rectangles, midpoint rectangles and trapezoids',
        'Saving and reviewing the calculation history',
        'User hierarchy: system administrators, web administrators, registered users and visitors',
      ],
      es: [
        'Creación de cuenta con verificación de la contraseña y captcha',
        'Inicio de sesión con identificador y contraseña',
        'Módulo de cálculo de probabilidad basado en la ley inversa gaussiana',
        'Tres métodos de integración numérica: rectángulos por la izquierda, rectángulos medios y trapecios',
        'Registro y consulta del historial de cálculos',
        'Jerarquía de usuarios: administradores de sistema, administradores web, usuarios registrados y visitantes',
      ],
      ar: [
        'إنشاء حساب مع التحقّق من كلمة المرور ورمز تحقّق',
        'تسجيل الدخول باسم مستخدم وكلمة مرور',
        'وحدة لحساب الاحتمال قائمة على التوزيع الغاوسي العكسي',
        'ثلاث طرق للتكامل العددي: المستطيلات اليسرى والمستطيلات الوسطى وأشباه المنحرفات',
        'حفظ سجلّ الحسابات والاطّلاع عليه',
        'تراتبية المستخدمين: مديرو النظام ومديرو الويب والمستخدمون المسجَّلون والزوّار',
      ],
    },
    star: {
      situation: {
        fr:
          'Créer une application web pour réaliser divers types de calculs, avec une gestion des utilisateurs et une sécurité intégrée.',
        en:
          'Building a web application to run various kinds of calculations, with user management and built-in security.',
        es:
          'Crear una aplicación web para realizar diversos tipos de cálculos, con gestión de usuarios y seguridad integrada.',
        ar:
          'إنشاء تطبيق ويب لإجراء أنواع مختلفة من الحسابات، مع إدارة للمستخدمين وأمان مدمج.',
      },
      taches: {
        fr:
          'Développer une plateforme web déployée sur Raspberry Pi, comprenant des fonctionnalités de calcul et une hiérarchie d’utilisateurs.',
        en:
          'Developing a web platform deployed on a Raspberry Pi, with calculation features and a user hierarchy.',
        es:
          'Desarrollar una plataforma web desplegada en una Raspberry Pi, con funcionalidades de cálculo y una jerarquía de usuarios.',
        ar:
          'تطوير منصّة ويب منشورة على Raspberry Pi، تضمّ وظائف حسابية وتراتبية للمستخدمين.',
      },
      // Premiere personne du PLURIEL : le projet est collectif et la
      // repartition des taches n’est pas documentee. Le contenu technique est
      // strictement celui d’origine, seule la personne grammaticale change.
      actions: {
        fr:
          'Nous avons mis en place une architecture réseau, utilisé PHP et MySQL pour le backend, HTML/CSS et JavaScript pour le frontend, intégré des techniques de cryptographie pour la sécurité, et déployé sur Raspberry Pi 4 avec accès SSH.',
        en:
          'We set up a network architecture, used PHP and MySQL for the backend, HTML/CSS and JavaScript for the frontend, brought in cryptography techniques for security, and deployed on a Raspberry Pi 4 with SSH access.',
        es:
          'Pusimos en marcha una arquitectura de red, usamos PHP y MySQL para el backend, HTML/CSS y JavaScript para el frontend, integramos técnicas de criptografía para la seguridad y desplegamos en una Raspberry Pi 4 con acceso SSH.',
        ar:
          'أنشأنا بنية شبكية، واستخدمنا PHP و MySQL للواجهة الخلفية، و HTML/CSS و JavaScript للواجهة الأمامية، وأدمجنا تقنيات تعمية لأغراض الأمان، ونشرنا على Raspberry Pi 4 مع وصول عبر SSH.',
      },
      resultats: {
        fr:
          'Nous avons livré une application web permettant aux utilisateurs (administrateurs système, administrateurs web, utilisateurs inscrits, visiteurs) de s’inscrire via un captcha, de se connecter, d’effectuer des calculs, de stocker leurs résultats et de gérer leurs comptes.',
        en:
          'We delivered a web application letting users (system administrators, web administrators, registered users, visitors) sign up through a captcha, sign in, run calculations, store their results and manage their accounts.',
        es:
          'Entregamos una aplicación web que permite a los usuarios (administradores de sistema, administradores web, usuarios registrados, visitantes) registrarse mediante un captcha, iniciar sesión, efectuar cálculos, almacenar sus resultados y gestionar sus cuentas.',
        ar:
          'سلّمنا تطبيق ويب يتيح للمستخدمين (مديري النظام ومديري الويب والمستخدمين المسجَّلين والزوّار) التسجيل عبر رمز تحقّق، وتسجيل الدخول، وإجراء الحسابات، وتخزين نتائجهم، وإدارة حساباتهم.',
      },
    },
    learnings: {
      fr: [
        'Concevoir quatre profils d’utilisateurs aux droits distincts oblige à définir qui peut faire quoi avant d’écrire la première ligne. Les autorisations ne s’ajoutent pas après coup : elles structurent l’application entière.',
        'Déployer sur un Raspberry Pi impose des contraintes de ressources qu’un serveur classique fait oublier. Travailler sous contrainte matérielle force à distinguer ce qui est nécessaire de ce qui est confortable.',
      ],
      en: [
        'Designing four user profiles with distinct rights forces you to define who can do what before writing the first line. Permissions are not added afterwards: they structure the whole application.',
        'Deploying on a Raspberry Pi imposes resource constraints that a conventional server lets you forget. Working under hardware constraint forces you to tell what is necessary from what is comfortable.',
      ],
      es: [
        'Diseñar cuatro perfiles de usuario con derechos distintos obliga a definir quién puede hacer qué antes de escribir la primera línea. Los permisos no se añaden después: estructuran toda la aplicación.',
        'Desplegar en una Raspberry Pi impone limitaciones de recursos que un servidor clásico hace olvidar. Trabajar bajo restricción material obliga a distinguir lo necesario de lo cómodo.',
      ],
      ar: [
        'تصميم أربعة ملفّات مستخدمين بصلاحيات مختلفة يفرض تحديد من يفعل ماذا قبل كتابة السطر الأول. فالأذونات لا تُضاف لاحقًا: بل تبني هيكل التطبيق كلّه.',
        'النشر على Raspberry Pi يفرض قيودًا على الموارد يُنسيها الخادم التقليدي. والعمل تحت قيد مادي يُجبر على التمييز بين ما هو ضروري وما هو مريح.',
      ],
    },
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
        alt: {
          fr:
            'Page d’accueil de la plateforme, modules de calcul inaccessibles faute de compte',
          en:
            'Home page of the platform, with the calculation modules out of reach without an account',
          es:
            'Página de inicio de la plataforma, con los módulos de cálculo inaccesibles sin una cuenta',
          ar:
            'الصفحة الرئيسية للمنصّة، ووحدات الحساب غير متاحة من دون حساب',
        },
        caption: {
          fr:
            'Page d’accueil',
          en:
            'Home page',
          es:
            'Página de inicio',
          ar:
            'الصفحة الرئيسية',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/profil-connexion-inscription',
        widths: [400, 800],
        width: 800,
        height: 392,
        alt: {
          fr:
            'Menu Profil ouvert sur les entrées de connexion et d’inscription',
          en:
            'Profile menu open on the sign-in and sign-up entries',
          es:
            'Menú Perfil abierto en las entradas de inicio de sesión y registro',
          ar:
            'قائمة الملف الشخصي مفتوحة على خياري تسجيل الدخول وإنشاء الحساب',
        },
        caption: {
          fr:
            'Accès au profil',
          en:
            'Profile access',
          es:
            'Acceso al perfil',
          ar:
            'الوصول إلى الملف الشخصي',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/creation-compte',
        widths: [400, 800],
        width: 800,
        height: 390,
        alt: {
          fr:
            'Formulaire d’inscription avec champ de vérification du mot de passe',
          en:
            'Sign-up form with a password confirmation field',
          es:
            'Formulario de registro con campo de verificación de la contraseña',
          ar:
            'استمارة التسجيل مع حقل للتحقّق من كلمة المرور',
        },
        caption: {
          fr:
            'Création de compte',
          en:
            'Account creation',
          es:
            'Creación de cuenta',
          ar:
            'إنشاء حساب',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/connexion',
        widths: [400, 800],
        width: 800,
        height: 390,
        alt: {
          fr:
            'Formulaire de connexion demandant identifiant et mot de passe',
          en:
            'Sign-in form asking for a username and a password',
          es:
            'Formulario de inicio de sesión que pide identificador y contraseña',
          ar:
            'استمارة تسجيل الدخول تطلب اسم المستخدم وكلمة المرور',
        },
        caption: {
          fr:
            'Connexion',
          en:
            'Sign-in',
          es:
            'Inicio de sesión',
          ar:
            'تسجيل الدخول',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/module-probabilite',
        widths: [400, 800],
        width: 800,
        height: 391,
        alt: {
          fr:
            'Formulaire de saisie des paramètres du module de probabilité',
          en:
            'Form for entering the parameters of the probability module',
          es:
            'Formulario de entrada de los parámetros del módulo de probabilidad',
          ar:
            'استمارة إدخال معاملات وحدة الاحتمال',
        },
        caption: {
          fr:
            'Module de probabilité',
          en:
            'Probability module',
          es:
            'Módulo de probabilidad',
          ar:
            'وحدة الاحتمال',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/rectangles-gauche',
        widths: [364],
        width: 364,
        height: 354,
        alt: {
          fr:
            'Aire sous la courbe approchée par des rectangles alignés sur le bord gauche de chaque intervalle',
          en:
            'Area under the curve approximated by rectangles aligned on the left edge of each interval',
          es:
            'Área bajo la curva aproximada mediante rectángulos alineados con el borde izquierdo de cada intervalo',
          ar:
            'المساحة تحت المنحنى مقرَّبة بمستطيلات محاذية للحافة اليسرى لكل مجال',
        },
        caption: {
          fr:
            'Méthode des rectangles à gauche',
          en:
            'Left rectangle method',
          es:
            'Método de rectángulos por la izquierda',
          ar:
            'طريقة المستطيلات اليسرى',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/rectangles-medians',
        widths: [220],
        width: 220,
        height: 175,
        alt: {
          fr:
            'Aire sous la courbe approchée par des rectangles centrés sur le point médian de chaque intervalle',
          en:
            'Area under the curve approximated by rectangles centred on the midpoint of each interval',
          es:
            'Área bajo la curva aproximada mediante rectángulos centrados en el punto medio de cada intervalo',
          ar:
            'المساحة تحت المنحنى مقرَّبة بمستطيلات مركزها منتصف كل مجال',
        },
        caption: {
          fr:
            'Méthode des rectangles médians',
          en:
            'Midpoint rectangle method',
          es:
            'Método de rectángulos medios',
          ar:
            'طريقة المستطيلات الوسطى',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/trapezes',
        widths: [220],
        width: 220,
        height: 175,
        alt: {
          fr:
            'Aire sous la courbe approchée par des trapèzes reliant les extrémités de chaque intervalle',
          en:
            'Area under the curve approximated by trapezoids joining the ends of each interval',
          es:
            'Área bajo la curva aproximada mediante trapecios que unen los extremos de cada intervalo',
          ar:
            'المساحة تحت المنحنى مقرَّبة بأشباه منحرفات تصل طرفي كل مجال',
        },
        caption: {
          fr:
            'Méthode des trapèzes',
          en:
            'Trapezoid method',
          es:
            'Método de trapecios',
          ar:
            'طريقة أشباه المنحرفات',
        },
      },
      {
        src: '/images/projets/plateforme-web-calculs/historique-calculs',
        widths: [400, 800],
        width: 800,
        height: 422,
        alt: {
          fr:
            'Fiche de calcul enregistrée, accompagnée de son bouton de suppression',
          en:
            'A saved calculation record, with its delete button',
          es:
            'Ficha de cálculo guardada, con su botón de eliminación',
          ar:
            'بطاقة حساب محفوظة، ومعها زرّ الحذف',
        },
        caption: {
          fr:
            'Historique des calculs',
          en:
            'Calculation history',
          es:
            'Historial de cálculos',
          ar:
            'سجلّ الحسابات',
        },
      },
    ],
    featuredRank: null,
  },
  {
    slug: 'archilog',
    title: {
      fr:
        'Archilog — Gestion financière',
      en:
        'Archilog — Financial management',
      es:
        'Archilog — Gestión financiera',
      ar:
        'Archilog — إدارة مالية',
    },
    tagline: {
      fr:
        'Application de gestion financière développée avec Flask et SQLAlchemy Core, offrant une interface web et une interface en ligne de commande (CLI) pour manipuler les données.',
      en:
        'A financial management application built with Flask and SQLAlchemy Core, offering both a web interface and a command line interface (CLI) to work with the data.',
      es:
        'Aplicación de gestión financiera desarrollada con Flask y SQLAlchemy Core, con una interfaz web y una interfaz de línea de comandos (CLI) para manipular los datos.',
      ar:
        'تطبيق لإدارة الشؤون المالية مبني بـ Flask و SQLAlchemy Core، يوفّر واجهة ويب وواجهة سطر أوامر (CLI) للتعامل مع البيانات.',
    },
    category: 'academique',
    period: { kind: 'connue', start: '2025-01', end: '2025-03' },
    context: {
      fr:
        'Archilog est une application de gestion financière développée en Python, utilisant Flask pour l’interface web, SQLAlchemy Core pour la gestion de la base de données SQLite, et Jinja2 pour la génération de pages HTML dynamiques.',
      en:
        'Archilog is a financial management application written in Python, using Flask for the web interface, SQLAlchemy Core for the SQLite database, and Jinja2 to generate dynamic HTML pages.',
      es:
        'Archilog es una aplicación de gestión financiera desarrollada en Python, que usa Flask para la interfaz web, SQLAlchemy Core para la base de datos SQLite y Jinja2 para generar páginas HTML dinámicas.',
      ar:
        'Archilog تطبيق لإدارة الشؤون المالية مكتوب بلغة Python، يستخدم Flask لواجهة الويب و SQLAlchemy Core لقاعدة بيانات SQLite و Jinja2 لتوليد صفحات HTML ديناميكية.',
    },
    role: {
      fr:
        'Développeur full-stack',
      en:
        'Full-stack developer',
      es:
        'Desarrollador full-stack',
      ar:
        'مطوِّر full-stack',
    },
    // Rien n’etablit un travail collectif sur cette realisation : la mention
    // se limite donc au cadre de formation.
    roleDetail: {
      fr:
        'Projet réalisé dans le cadre du BUT Informatique à l’IUT de Vélizy-Villacoublay.',
      en:
        'A project carried out as part of the BUT Informatique (three-year computer science degree) at the IUT de Vélizy-Villacoublay.',
      es:
        'Proyecto realizado en el marco del BUT Informatique (grado en informática) del IUT de Vélizy-Villacoublay.',
      ar:
        'مشروع أُنجز في إطار BUT Informatique (إجازة في المعلوماتية) في IUT de Vélizy-Villacoublay.',
    },
    outOfScope: null,
    technologies: ['Python', 'Flask', 'SQLAlchemy Core', 'SQLite', 'Jinja2'],
    features: {
      fr: [
        'Affichage de toutes les entrées financières',
        'Création, modification et suppression d’entrées',
        'Importation et exportation de données au format CSV',
        'Interface web de consultation et de saisie',
        'Gestion des erreurs avec messages flash',
        'Interface en ligne de commande complète',
      ],
      en: [
        'Displaying every financial entry',
        'Creating, editing and deleting entries',
        'Importing and exporting data in CSV format',
        'Web interface for reading and entering data',
        'Error handling with flash messages',
        'A complete command line interface',
      ],
      es: [
        'Visualización de todas las entradas financieras',
        'Creación, modificación y eliminación de entradas',
        'Importación y exportación de datos en formato CSV',
        'Interfaz web de consulta y de entrada de datos',
        'Gestión de errores con mensajes flash',
        'Interfaz de línea de comandos completa',
      ],
      ar: [
        'عرض جميع القيود المالية',
        'إنشاء القيود وتعديلها وحذفها',
        'استيراد البيانات وتصديرها بصيغة CSV',
        'واجهة ويب للاطّلاع وإدخال البيانات',
        'معالجة الأخطاء برسائل عابرة',
        'واجهة سطر أوامر كاملة',
      ],
    },
    star: {
      situation: {
        fr:
          'Créer une application de gestion financière avec des interfaces web et CLI.',
        en:
          'Building a financial management application with web and CLI interfaces.',
        es:
          'Crear una aplicación de gestión financiera con interfaces web y CLI.',
        ar:
          'إنشاء تطبيق لإدارة الشؤون المالية بواجهتَي ويب وسطر أوامر.',
      },
      taches: {
        fr:
          'Développer une application utilisant Flask et SQLAlchemy Core pour gérer les données financières.',
        en:
          'Developing an application using Flask and SQLAlchemy Core to manage the financial data.',
        es:
          'Desarrollar una aplicación que use Flask y SQLAlchemy Core para gestionar los datos financieros.',
        ar:
          'تطوير تطبيق يستخدم Flask و SQLAlchemy Core لإدارة البيانات المالية.',
      },
      actions: {
        fr:
          'Mettre en œuvre l’architecture MVC pour structurer le code, utiliser SQLite pour la persistance des données, et développer une interface web ainsi qu’une interface CLI pour l’automatisation.',
        en:
          'Putting the MVC architecture in place to structure the code, using SQLite for data persistence, and building a web interface as well as a CLI for automation.',
        es:
          'Aplicar la arquitectura MVC para estructurar el código, usar SQLite para la persistencia de los datos y desarrollar una interfaz web así como una interfaz CLI para la automatización.',
        ar:
          'تطبيق بنية MVC لهيكلة الشيفرة، واستخدام SQLite لحفظ البيانات، وتطوير واجهة ويب إلى جانب واجهة سطر أوامر للأتمتة.',
      },
      resultats: {
        fr:
          'L’application permet l’affichage, la création, la modification et la suppression d’entrées financières, avec support pour l’importation/exportation de données au format CSV et une gestion des erreurs via des messages flash.',
        en:
          'The application allows financial entries to be displayed, created, edited and deleted, with support for importing and exporting data in CSV format and error handling through flash messages.',
        es:
          'La aplicación permite mostrar, crear, modificar y eliminar entradas financieras, con soporte para la importación y exportación de datos en formato CSV y una gestión de errores mediante mensajes flash.',
        ar:
          'يتيح التطبيق عرض القيود المالية وإنشاءها وتعديلها وحذفها، مع دعم استيراد البيانات وتصديرها بصيغة CSV، ومعالجة الأخطاء عبر رسائل عابرة.',
      },
    },
    learnings: {
      fr: [
        'Livrer une interface web et une interface en ligne de commande sur la même logique métier n’est possible que si la logique est séparée de la présentation. C’est l’architecture qui rend la double interface réalisable, pas l’inverse.',
        'Une interface en ligne de commande ne sert pas les mêmes usages qu’une interface web : l’une automatise, l’autre explore. Concevoir les deux oblige à se demander comment l’outil sera réellement utilisé.',
      ],
      en: [
        'Delivering a web interface and a command line interface on the same business logic is only possible if that logic is separated from the presentation. It is the architecture that makes the double interface feasible, not the other way round.',
        'A command line interface does not serve the same uses as a web interface: one automates, the other explores. Designing both forces you to ask how the tool will actually be used.',
      ],
      es: [
        'Entregar una interfaz web y una interfaz de línea de comandos sobre la misma lógica de negocio solo es posible si esa lógica está separada de la presentación. Es la arquitectura la que hace viable la doble interfaz, y no al revés.',
        'Una interfaz de línea de comandos no sirve para los mismos usos que una interfaz web: una automatiza, la otra explora. Diseñar ambas obliga a preguntarse cómo se usará realmente la herramienta.',
      ],
      ar: [
        'تسليم واجهة ويب وواجهة سطر أوامر تعملان على المنطق نفسه غير ممكن إلا إذا فُصل هذا المنطق عن العرض. فالبنية هي ما يجعل الواجهة المزدوجة ممكنة، لا العكس.',
        'واجهة سطر الأوامر لا تخدم الاستعمالات نفسها التي تخدمها واجهة الويب: إحداهما تؤتمت والأخرى تستكشف. وتصميم الاثنتين يُجبر على التساؤل كيف ستُستعمل الأداة فعلًا.',
      ],
    },
    links: [
      {
        kind: 'source',
        label: {
          fr:
            'Code source',
          en:
            'Source code',
          es:
            'Código fuente',
          ar:
            'الشيفرة المصدرية',
        },
        href: 'https://github.com/HRazim/Architecture-Logiciel',
      },
    ],
    visuals: [
      {
        src: '/images/projets/archilog/interface-web',
        widths: [400, 800],
        width: 800,
        height: 174,
        alt: {
          fr:
            'Interface web d’Archilog affichant la liste des entrées financières',
          en:
            'Archilog web interface showing the list of financial entries',
          es:
            'Interfaz web de Archilog mostrando la lista de entradas financieras',
          ar:
            'واجهة الويب لـ Archilog وهي تعرض قائمة القيود المالية',
        },
        caption: {
          fr:
            'Liste des entrées financières',
          en:
            'List of financial entries',
          es:
            'Lista de entradas financieras',
          ar:
            'قائمة القيود المالية',
        },
      },
      {
        src: '/images/projets/archilog/formulaire-entree',
        widths: [400, 800],
        width: 800,
        height: 253,
        alt: {
          fr:
            'Formulaire de création et de modification d’une entrée financière',
          en:
            'Form for creating and editing a financial entry',
          es:
            'Formulario de creación y modificación de una entrada financiera',
          ar:
            'استمارة إنشاء قيد مالي وتعديله',
        },
        caption: {
          fr:
            'Création d’une entrée',
          en:
            'Creating an entry',
          es:
            'Creación de una entrada',
          ar:
            'إنشاء قيد',
        },
      },
    ],
    featuredRank: null,
  },
  {
    slug: 'jtr',
    title: {
      fr:
        'JTR — gestionnaire de contacts privacy-first',
      en:
        'JTR — privacy-first contact manager',
      es:
        'JTR — gestor de contactos privacy-first',
      ar:
        'JTR — مدير جهات اتصال يضع الخصوصية أولًا',
    },
    tagline: {
      fr:
        'Une application Android entièrement locale qui conserve ce qui fait durer une relation, sans serveur, sans publicité et sans traceur.',
      en:
        'An entirely local Android application that keeps what makes a relationship last, with no server, no advertising and no tracker.',
      es:
        'Una aplicación Android completamente local que conserva lo que hace que una relación dure, sin servidor, sin publicidad y sin rastreadores.',
      ar:
        'تطبيق أندرويد محلي بالكامل يحفظ ما يديم العلاقة، دون خادم ودون إعلانات ودون أدوات تتبّع.',
    },
    category: 'personnel',
    // Periode fermee : l'application est publiee. La borne « en-cours »
    // disait un travail actif ; elle ne le dit plus, et la variante
    // `{ kind: 'en-cours' }` aurait en outre perdu la date de debut connue.
    period: { kind: 'connue', start: '2026-02', end: '2026-09' },
    context: null,
    role: {
      fr:
        'Concepteur et développeur unique',
      en:
        'Sole designer and developer',
      es:
        'Diseñador y desarrollador único',
      ar:
        'المصمّم والمطوّر الوحيد',
    },
    roleDetail: {
      fr:
        'Conception produit, architecture, développement, tests et publication.',
      en:
        'Product design, architecture, development, testing and release.',
      es:
        'Diseño de producto, arquitectura, desarrollo, pruebas y publicación.',
      ar:
        'تصميم المنتج والبنية والتطوير والاختبارات والنشر.',
    },
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
    features: { fr: [], en: [], es: [], ar: [] },
    star: {
      situation: {
        fr:
          'Les applications de contacts conservent un numéro et presque rien d’autre. Or ce qui nourrit une relation, ce sont les détails humains : le prénom, les dates qui comptent, ce que la personne a raconté. Les solutions existantes qui stockent ces informations les hébergent sur leurs propres serveurs, ce qui pose un problème de confidentialité sur des données intimes.',
        en:
          'Contact applications keep a number and almost nothing else. Yet what feeds a relationship is the human detail: the first name, the dates that matter, what the person told you. The existing solutions that do store this information host it on their own servers, which raises a privacy problem over intimate data.',
        es:
          'Las aplicaciones de contactos guardan un número y casi nada más. Sin embargo, lo que alimenta una relación son los detalles humanos: el nombre, las fechas que cuentan, lo que la persona contó. Las soluciones existentes que sí almacenan esa información la alojan en sus propios servidores, lo que plantea un problema de confidencialidad sobre datos íntimos.',
        ar:
          'تحتفظ تطبيقات جهات الاتصال برقم ولا شيء آخر تقريبًا. غير أن ما يغذّي العلاقة هو التفاصيل الإنسانية: الاسم، والتواريخ التي تهمّ، وما رواه الشخص. أما الحلول الموجودة التي تخزّن هذه المعلومات فتستضيفها على خوادمها الخاصة، وهو ما يطرح مشكلة خصوصية على بيانات حميمة.',
      },
      taches: {
        fr:
          'Concevoir et développer seul une application Android capable de conserver ces détails — relations, catégories, notes, photographies — et de rappeler les dates importantes, tout en garantissant que rien ne quitte l’appareil. Cible : les personnes qui entretiennent des relations durables et tiennent à leur confidentialité, du commercial qui se souvient d’un détail client à l’ami qui refuse de perdre le fil.',
        en:
          'Designing and building on my own an Android application able to keep those details — relationships, categories, notes, photographs — and to recall the important dates, while guaranteeing that nothing leaves the device. Target: people who maintain lasting relationships and care about their privacy, from the salesperson who remembers a customer detail to the friend who refuses to lose touch.',
        es:
          'Diseñar y desarrollar yo solo una aplicación Android capaz de conservar esos detalles — relaciones, categorías, notas, fotografías — y de recordar las fechas importantes, garantizando al mismo tiempo que nada salga del dispositivo. Objetivo: las personas que mantienen relaciones duraderas y cuidan su privacidad, desde el comercial que recuerda un detalle de un cliente hasta el amigo que se niega a perder el hilo.',
        ar:
          'تصميم وتطوير تطبيق أندرويد بمفردي، قادر على حفظ هذه التفاصيل — العلاقات والفئات والملاحظات والصور — والتذكير بالتواريخ المهمّة، مع ضمان ألّا يغادر شيء الجهاز. والفئة المستهدَفة: من يحافظون على علاقات دائمة ويحرصون على خصوصيتهم، من البائع الذي يتذكّر تفصيلًا عن عميل إلى الصديق الذي يرفض أن ينقطع الخيط.',
      },
      actions: {
        fr:
          'Architecture MVVM à flux de données unidirectionnel avec Jetpack Compose, séparant strictement l’état et le rendu pour rendre les ViewModels testables. Persistance en base locale Room, avec des migrations de schéma systématiquement testées et aucun repli destructif : une migration absente ou incohérente interrompt l’application plutôt que d’effacer silencieusement les données. Conception privacy-first sans aucun serveur : ni analytique, ni traceur, sauvegarde automatique désactivée, et les seuls appels réseau — tuiles cartographiques et géocodage d’une ville saisie manuellement — n’émettent jamais la position de l’appareil. Traitement des contraintes propres à la plateforme : plafonnement des alarmes exactes imposé depuis Android 13, séquence de permissions de localisation en premier plan puis en arrière-plan avec divulgation conforme aux exigences de Google Play, et internationalisation sur treize langues.',
        en:
          'MVVM architecture with a unidirectional data flow using Jetpack Compose, strictly separating state from rendering so the ViewModels are testable. Persistence in a local Room database, with schema migrations tested systematically and no destructive fallback: a missing or inconsistent migration stops the application rather than silently erasing the data. Privacy-first design with no server at all: no analytics, no tracker, automatic backup disabled, and the only network calls — map tiles and geocoding of a manually entered city — never send the device location. Handling of the constraints specific to the platform: the cap on exact alarms imposed since Android 13, the foreground then background location permission sequence with disclosure meeting Google Play requirements, and internationalisation across thirteen languages.',
        es:
          'Arquitectura MVVM con flujo de datos unidireccional usando Jetpack Compose, separando estrictamente el estado y el renderizado para que los ViewModels sean testables. Persistencia en base de datos local Room, con migraciones de esquema probadas sistemáticamente y sin ningún repliegue destructivo: una migración ausente o incoherente detiene la aplicación en vez de borrar los datos en silencio. Diseño privacy-first sin ningún servidor: ni analítica, ni rastreadores, copia de seguridad automática desactivada, y las únicas llamadas de red — teselas cartográficas y geocodificación de una ciudad introducida a mano — nunca emiten la posición del dispositivo. Tratamiento de las restricciones propias de la plataforma: el límite de alarmas exactas impuesto desde Android 13, la secuencia de permisos de ubicación en primer plano y luego en segundo plano con una divulgación conforme a las exigencias de Google Play, e internacionalización en trece idiomas.',
        ar:
          'بنية MVVM بتدفّق بيانات أحادي الاتجاه مع Jetpack Compose، تفصل بصرامة بين الحالة والعرض لجعل ViewModels قابلة للاختبار. والحفظ في قاعدة بيانات Room محلية، مع اختبار منهجي لعمليات ترحيل المخطّط ودون أي تراجع مُتلِف: فترحيل مفقود أو غير متّسق يوقف التطبيق بدل محو البيانات بصمت. وتصميم يضع الخصوصية أولًا دون أي خادم: لا تحليلات ولا أدوات تتبّع، والنسخ الاحتياطي التلقائي معطَّل، والاتصالات الشبكية الوحيدة — بلاطات الخرائط وترميز موقع مدينة أُدخلت يدويًا — لا ترسل أبدًا موقع الجهاز. ومعالجة القيود الخاصة بالمنصّة: سقف المنبّهات الدقيقة المفروض منذ Android 13، وتسلسل أذونات الموقع في المقدّمة ثم في الخلفية مع إفصاح مطابق لمتطلّبات Google Play، والتوطين بثلاث عشرة لغة.',
      },
      resultats: {
        fr:
          'Base de code d’environ vingt-six mille lignes, sans erreur d’analyse statique. Vingt-deux versions successives du schéma de base de données, dont les migrations de la onzième à la vingt-deuxième sont couvertes par des tests instrumentés incluant des contrôles négatifs. Interface traduite en treize langues. Version 7.1.65 de l’application construite et signée après un audit complet de pré-publication et une phase de durcissement. Application publiée sur Google Play.',
        en:
          'A code base of about twenty-six thousand lines, with no static analysis error. Twenty-two successive versions of the database schema, of which the migrations from the eleventh to the twenty-second are covered by instrumented tests including negative checks. Interface translated into thirteen languages. Version 7.1.65 of the application built and signed after a full pre-release audit and a hardening phase. Application published on Google Play.',
        es:
          'Base de código de unas veintiséis mil líneas, sin errores de análisis estático. Veintidós versiones sucesivas del esquema de base de datos, de las cuales las migraciones de la undécima a la vigesimosegunda están cubiertas por pruebas instrumentadas que incluyen controles negativos. Interfaz traducida a trece idiomas. Versión 7.1.65 de la aplicación compilada y firmada tras una auditoría completa previa a la publicación y una fase de endurecimiento. Aplicación publicada en Google Play.',
        ar:
          'قاعدة شيفرة تناهز ستة وعشرين ألف سطر، دون أي خطأ في التحليل الساكن. واثنتان وعشرون نسخة متعاقبة من مخطّط قاعدة البيانات، عمليات الترحيل فيها من الحادية عشرة إلى الثانية والعشرين مغطّاة باختبارات مُجهَّزة تتضمّن فحوصًا سلبية. وواجهة مترجَمة إلى ثلاث عشرة لغة. والإصدار 7.1.65 من التطبيق مبني وموقَّع بعد تدقيق كامل سابق للنشر ومرحلة تحصين. والتطبيق منشور على Google Play.',
      },
    },
    learnings: {
      fr: [
        'Un arbitrage d’intégrité que je défends : sur une application dont toute la valeur réside dans la donnée locale, une interruption récupérable vaut mieux qu’une perte définitive. J’ai donc écarté tout repli destructif sur les migrations de base de données, au prix d’une expérience dégradée dans le cas rare où une migration échoue.',
        'La confidentialité se décide à la conception, pas après coup. L’absence de serveur n’est pas une économie d’infrastructure : c’est ce qui rend la promesse vérifiable.',
        'Prouver qu’un test peut échouer vaut mieux que le voir passer. Les contrôles négatifs sur les migrations sont ce qui donne une valeur réelle à la couverture.',
        'La validation sur appareil réel est irremplaçable. Un qualificatif de ressource linguistique erroné pour l’indonésien, invisible en analyse statique comme en émulateur, n’a été révélé que sur un téléphone physique.',
      ],
      en: [
        'An integrity trade-off I stand by: on an application whose entire value lies in local data, a recoverable interruption is worth more than a definitive loss. I therefore ruled out any destructive fallback on the database migrations, at the cost of a degraded experience in the rare case where a migration fails.',
        'Privacy is decided at design time, not afterwards. Having no server is not an infrastructure saving: it is what makes the promise verifiable.',
        'Proving that a test can fail is worth more than watching it pass. The negative checks on the migrations are what give the coverage any real value.',
        'Validation on a real device is irreplaceable. A wrong language resource qualifier for Indonesian, invisible to static analysis and to the emulator alike, only showed up on a physical phone.',
      ],
      es: [
        'Un arbitraje de integridad que defiendo: en una aplicación cuyo valor reside por completo en los datos locales, una interrupción recuperable vale más que una pérdida definitiva. Por eso descarté todo repliegue destructivo en las migraciones de base de datos, al precio de una experiencia degradada en el raro caso de que una migración falle.',
        'La confidencialidad se decide en el diseño, no después. La ausencia de servidor no es un ahorro de infraestructura: es lo que hace la promesa verificable.',
        'Demostrar que una prueba puede fallar vale más que verla pasar. Los controles negativos sobre las migraciones son lo que da un valor real a la cobertura.',
        'La validación en un dispositivo real es insustituible. Un calificador de recurso lingüístico erróneo para el indonesio, invisible tanto en el análisis estático como en el emulador, solo se reveló en un teléfono físico.',
      ],
      ar: [
        'مفاضلة تتعلّق بسلامة البيانات أدافع عنها: في تطبيق تكمن قيمته كلها في البيانات المحلية، يبقى التوقّف القابل للاسترجاع خيرًا من فقدان نهائي. لذلك استبعدت أي تراجع مُتلِف في عمليات ترحيل قاعدة البيانات، على حساب تجربة أقل جودة في الحالة النادرة التي يفشل فيها الترحيل.',
        'تُقرَّر الخصوصية عند التصميم، لا بعده. وغياب الخادم ليس توفيرًا في البنية التحتية: بل هو ما يجعل الوعد قابلًا للتحقّق.',
        'إثبات أن الاختبار يمكن أن يفشل خير من رؤيته ينجح. والفحوص السلبية على عمليات الترحيل هي ما يمنح التغطية قيمة حقيقية.',
        'التحقّق على جهاز حقيقي لا بديل عنه. فمُحدِّد مورد لغوي خاطئ للإندونيسية، لم يظهر في التحليل الساكن ولا في المحاكي، لم ينكشف إلا على هاتف فعلي.',
      ],
    },
    links: [
      /* LA FICHE PUBLIQUE VIENT EN PREMIER. C'est la destination la plus
         utile de la liste : elle mene a l'application elle-meme, la ou les
         quatre autres menent a son code ou a ses comptes.

         ADRESSE SANS PARAMETRE DE CAMPAGNE. Google Play accepte un
         identifiant de partage a la suite de l'identifiant d'application ;
         il trace l'origine du clic et n'a rien a faire dans un lien
         permanent ecrit une fois pour toutes. L'adresse se reduit donc a
         ce qui designe l'application, et rien de plus.

         LE LIBELLE DIT CE QU'ON TROUVE A DESTINATION, et non ou l'on va :
         c'est la fiche de l'application, pas un telechargement immediat. */
      {
        kind: 'google-play',
        label: {
          fr:
            'Fiche de l’application sur Google Play',
          en:
            'App listing on Google Play',
          es:
            'Ficha de la aplicación en Google Play',
          ar:
            'صفحة التطبيق على Google Play',
        },
        href: 'https://play.google.com/store/apps/details?id=com.jtr.app',
      },
      {
        kind: 'source',
        label: {
          fr:
            'Code source',
          en:
            'Source code',
          es:
            'Código fuente',
          ar:
            'الشيفرة المصدرية',
        },
        href: 'https://github.com/HRazim/JTR',
      },
      {
        kind: 'instagram',
        label: {
          fr:
            'JTR sur Instagram',
          en:
            'JTR on Instagram',
          es:
            'JTR en Instagram',
          ar:
            'JTR على Instagram',
        },
        href: 'https://www.instagram.com/justtorememberapp/',
      },
      {
        kind: 'x',
        label: {
          fr:
            'JTR sur X',
          en:
            'JTR on X',
          es:
            'JTR en X',
          ar:
            'JTR على X',
        },
        href: 'https://x.com/JusToRememberr',
      },
      {
        kind: 'tiktok',
        label: {
          fr:
            'JTR sur TikTok',
          en:
            'JTR on TikTok',
          es:
            'JTR en TikTok',
          ar:
            'JTR على TikTok',
        },
        href: 'https://www.tiktok.com/@justtoremember_app',
      },
      {
        kind: 'reddit',
        label: {
          fr:
            'JTR sur Reddit',
          en:
            'JTR on Reddit',
          es:
            'JTR en Reddit',
          ar:
            'JTR على Reddit',
        },
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
        alt: {
          fr:
            'Liste de contacts sur téléphone : chaque ligne porte une photographie, un nom, une ville, une date de naissance et une étoile de mise en favori, deux contacts étant marqués.',
          en:
            'Contact list on a phone: each row carries a photograph, a name, a city, a date of birth and a favourite star, two contacts being marked.',
          es:
            'Lista de contactos en un teléfono: cada fila lleva una fotografía, un nombre, una ciudad, una fecha de nacimiento y una estrella de favorito, con dos contactos marcados.',
          ar:
            'قائمة جهات الاتصال على الهاتف: كل سطر يحمل صورة واسمًا ومدينة وتاريخ ميلاد ونجمة للمفضّلة، مع تمييز جهتَي اتصال.',
        },
        caption: {
          fr:
            'Liste des contacts, avec favoris, ville et date de naissance',
          en:
            'Contact list, with favourites, city and date of birth',
          es:
            'Lista de contactos, con favoritos, ciudad y fecha de nacimiento',
          ar:
            'قائمة جهات الاتصال، مع المفضّلة والمدينة وتاريخ الميلاد',
        },
      },
      {
        src: '/images/jtr/fiche-contact',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: {
          fr:
            'Fiche d’un contact : photographie, catégorie, date d’anniversaire avec rappel, relation vers un autre contact, courriel, origine, ville et zone de notes libres.',
          en:
            'A contact record: photograph, category, birthday with a reminder, link to another contact, email, origin, city and a free notes area.',
          es:
            'Ficha de un contacto: fotografía, categoría, fecha de cumpleaños con recordatorio, relación con otro contacto, correo electrónico, origen, ciudad y zona de notas libres.',
          ar:
            'بطاقة جهة اتصال: صورة وفئة وتاريخ ميلاد مع تذكير وصلة بجهة اتصال أخرى وبريد إلكتروني وأصل ومدينة ومساحة لملاحظات حرّة.',
        },
        caption: {
          fr:
            'Fiche détaillée d’un contact, avec relations, origine et notes',
          en:
            'Detailed contact record, with relationships, origin and notes',
          es:
            'Ficha detallada de un contacto, con relaciones, origen y notas',
          ar:
            'بطاقة مفصَّلة لجهة اتصال، مع العلاقات والأصل والملاحظات',
        },
      },
      {
        src: '/images/jtr/carte-localisation',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: {
          fr:
            'Bas d’une fiche de contact : téléphone, courriel, employeur, origine et ville, suivis d’une carte affichant un repère sur la ville renseignée.',
          en:
            'Bottom of a contact record: phone, email, employer, origin and city, followed by a map showing a marker on the recorded city.',
          es:
            'Parte inferior de una ficha de contacto: teléfono, correo electrónico, empleador, origen y ciudad, seguidos de un mapa con una marca sobre la ciudad indicada.',
          ar:
            'أسفل بطاقة جهة اتصال: الهاتف والبريد الإلكتروني وجهة العمل والأصل والمدينة، تليها خريطة تُظهر علامة على المدينة المسجَّلة.',
        },
        caption: {
          fr:
            'Localisation d’un contact sur une carte',
          en:
            'A contact located on a map',
          es:
            'Ubicación de un contacto en un mapa',
          ar:
            'موقع جهة اتصال على خريطة',
        },
      },
      {
        src: '/images/jtr/vue-grille',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: {
          fr:
            'Contacts présentés en grille de deux colonnes, chaque vignette montrant la photographie en pleine largeur avec le nom et la ville superposés.',
          en:
            'Contacts shown in a two-column grid, each tile showing the photograph full width with the name and city laid over it.',
          es:
            'Contactos presentados en una cuadrícula de dos columnas; cada tarjeta muestra la fotografía a todo el ancho con el nombre y la ciudad superpuestos.',
          ar:
            'جهات الاتصال معروضة في شبكة من عمودين، وكل بطاقة تُظهر الصورة بعرض كامل مع الاسم والمدينة فوقها.',
        },
        caption: {
          fr:
            'Vue en grille des contacts',
          en:
            'Grid view of contacts',
          es:
            'Vista en cuadrícula de los contactos',
          ar:
            'عرض شبكي لجهات الاتصال',
        },
      },
      {
        src: '/images/jtr/categories-relations',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: {
          fr:
            'Écran des catégories : trois vignettes illustrées, Favoris, Amis et Travail, chacune indiquant le nombre de contacts qu’elle regroupe.',
          en:
            'Categories screen: three illustrated tiles, Favourites, Friends and Work, each showing how many contacts it holds.',
          es:
            'Pantalla de categorías: tres tarjetas ilustradas, Favoritos, Amigos y Trabajo, cada una indicando cuántos contactos agrupa.',
          ar:
            'شاشة الفئات: ثلاث بطاقات مصوَّرة، المفضّلة والأصدقاء والعمل، وكل واحدة تُظهر عدد جهات الاتصال التي تضمّها.',
        },
        caption: {
          fr:
            'Organisation par catégories et par relations',
          en:
            'Organised by categories and relationships',
          es:
            'Organización por categorías y relaciones',
          ar:
            'التنظيم حسب الفئات والعلاقات',
        },
      },
      {
        src: '/images/jtr/selecteur-langue',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: {
          fr:
            'Sélecteur de langue déroulé, l’option Langue du système étant cochée, suivie des langues proposées écrites dans leur propre alphabet.',
          en:
            'Language selector expanded, with the System language option ticked, followed by the available languages written in their own script.',
          es:
            'Selector de idioma desplegado, con la opción Idioma del sistema marcada, seguida de los idiomas disponibles escritos en su propio alfabeto.',
          ar:
            'قائمة اختيار اللغة مفتوحة، وخيار «لغة النظام» محدَّد، تليه اللغات المتاحة مكتوبة بأبجديتها.',
        },
        caption: {
          fr:
            'Sélecteur de langue, treize langues disponibles',
          en:
            'Language selector, thirteen languages available',
          es:
            'Selector de idioma, trece idiomas disponibles',
          ar:
            'اختيار اللغة، ثلاث عشرة لغة متاحة',
        },
      },
      {
        src: '/images/jtr/theme-couleurs',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: {
          fr:
            'Réglages ouverts sur un panneau de palettes de couleurs, six choix présentés par des pastilles, la palette active étant cochée.',
          en:
            'Settings open on a colour palette panel, six choices shown as swatches, with the active palette ticked.',
          es:
            'Ajustes abiertos en un panel de paletas de colores, seis opciones presentadas mediante muestras, con la paleta activa marcada.',
          ar:
            'الإعدادات مفتوحة على لوحة ألوان، ستة خيارات معروضة على شكل عيّنات، مع تحديد اللوحة النشطة.',
        },
        caption: {
          fr:
            'Choix du thème de couleurs',
          en:
            'Choosing the colour theme',
          es:
            'Elección del tema de colores',
          ar:
            'اختيار سمة الألوان',
        },
      },
      {
        src: '/images/jtr/sauvegarde-confidentialite',
        widths: [400, 800],
        width: 800,
        height: 1422,
        alt: {
          fr:
            'Réglages ouverts sur une boîte de dialogue de sauvegarde : elle propose d’exporter toutes les données vers un fichier unique ou de restaurer une sauvegarde précédente, par-dessus les réglages de notification et l’entrée menant à la politique de confidentialité.',
          en:
            'Settings open on a backup dialogue: it offers to export all the data to a single file or to restore a previous backup, over the notification settings and the entry leading to the privacy policy.',
          es:
            'Ajustes abiertos en un cuadro de diálogo de copia de seguridad: propone exportar todos los datos a un único archivo o restaurar una copia anterior, sobre los ajustes de notificación y la entrada que lleva a la política de privacidad.',
          ar:
            'الإعدادات مفتوحة على مربّع حوار للنسخ الاحتياطي: يقترح تصدير كل البيانات إلى ملف واحد أو استعادة نسخة سابقة، فوق إعدادات الإشعارات والمدخل المؤدّي إلى سياسة الخصوصية.',
        },
        caption: {
          fr:
            'Sauvegarde locale et paramètres de confidentialité',
          en:
            'Local backup and privacy settings',
          es:
            'Copia de seguridad local y ajustes de privacidad',
          ar:
            'النسخ الاحتياطي المحلي وإعدادات الخصوصية',
        },
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
 * Technologies retenues pour une VIGNETTE COMPACTE.
 *
 * TROIS, ET AUCUN COMPTEUR. La version precedente en montrait jusqu’a quatre
 * puis annoncait le reste par une pastille « +12 ». Ce nombre ne se lisait
 * pas : il ressemblait a une technologie, il occupait la meme place qu’elle,
 * et il ne disait ni lesquelles ni pourquoi celles-la. Une vignette d’accueil
 * invite a ouvrir, elle ne fait pas l’inventaire ; l’inventaire est sur la
 * fiche, a une tabulation de distance.
 *
 * LES TROIS PREMIERES SONT LES BONNES parce que l’ordre de declaration est
 * deja un ordre d’importance : la pile principale d’abord, l’infrastructure
 * ensuite, l’outillage en dernier. « PHP 8.3, Symfony 6.4 LTS, Doctrine ORM »
 * dit ce qu’est le projet ; « Jira, UML » ne le dirait pas.
 *
 * Le budget en caracteres qui bornait la rangee est parti avec le compteur :
 * il n’existait que pour lui reserver sa place en bout de ligne. Les
 * pastilles se replient d’elles-memes quand la carte est etroite, et la
 * hauteur commune des trois cartes absorbe le repli.
 */
const CARD_TECHNOLOGIES_MAX = 3;

/** Les technologies affichees sur une vignette d’accueil, dans l’ordre. */
export function pickCardTechnologies(project: Project): readonly string[] {
  return project.technologies.slice(0, CARD_TECHNOLOGIES_MAX);
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
