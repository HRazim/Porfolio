/**
 * ---------------------------------------------------------------------------
 * TEXTES DE L’INTERFACE — QUATRE LANGUES
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
 * ---------------------------------------------------------------------------
 * UNE CHAINE PORTE SES QUATRE VARIANTES
 * ---------------------------------------------------------------------------
 *
 * Chaque valeur traduisible est un `Translated`, c’est-a-dire un
 * `Record<Locale, string>` : les quatre langues ou rien. Il n’existe pas de
 * fichier par langue, et donc pas de fichier qui prendrait du retard sur les
 * autres — une traduction oubliee est une erreur de COMPILATION, pas un vide
 * decouvert en production.
 *
 * Le francais fait foi. Aucune traduction n’ajoute, ne retire ni ne nuance une
 * affirmation ; les formulations dont la traduction s’est averee ambigue sont
 * signalees dans le rapport de mise en place, pas tranchees en silence.
 *
 * ---------------------------------------------------------------------------
 * CONVENTIONS TYPOGRAPHIQUES, PAR LANGUE
 * ---------------------------------------------------------------------------
 *   francais   apostrophe U+2019, guillemets « », espace insecable avant : ; ! ?
 *   anglais    apostrophe U+2019, pas d’espace avant la ponctuation double
 *   espagnol   apostrophe U+2019, ¿ ¡ ouvrants, pas d’espace avant : ;
 *   arabe      virgule ،  point-virgule ؛  point d’interrogation ؟
 *              chiffres occidentaux (0-9), lisibles par tous les lecteurs
 * ---------------------------------------------------------------------------
 */

import type { Route } from 'next';

import { contactHrefFor, pathFor, type Locale, type Translated, type TranslatedList } from './i18n';

/** Une entree de navigation : un chemin par langue, un libelle par langue. */
export interface NavItem {
  readonly key: 'about' | 'projects' | 'career' | 'contact';
  readonly label: Translated;
  /** Chemin resolu pour une langue donnee. */
  readonly href: (locale: Locale) => Route;
}

/**
 * Navigation principale, declaree une seule fois.
 * AUDIT.md section 3.6 releve 112 lignes de balisage recopiees sur trois
 * pages, avec une divergence deja constatee entre deux copies.
 *
 * Les chemins ne sont plus des litteraux mais des fonctions de la langue :
 * la table des routes de i18n.ts en est l’unique source.
 *
 * PAS D’ENTREE « ACCUEIL », ET C’EST LE NOM DU SITE QUI LA REMPLACE. Les deux
 * ont coexiste : deux liens vers la meme adresse, l’un derriere l’autre dans
 * l’ordre de tabulation, qu’un lecteur d’ecran annonce tous les deux. Des
 * deux, celui qui part est l’entree de navigation, parce que cliquer le nom
 * en haut a gauche pour revenir a l’accueil est une convention que personne
 * n’a besoin d’apprendre — et que les quatre entrees restantes sont les
 * quatre SECTIONS du site. L’accueil n’est pas une section, c’est le site.
 *
 * Le libelle n’a pas disparu pour autant : il est devenu `HEADER.homeLink`,
 * ou il nomme la destination du lien du nom du site.
 */
export const NAVIGATION: readonly NavItem[] = [
  {
    key: 'about',
    label: { fr: 'À propos', en: 'About', es: 'Acerca de', ar: 'عني' },
    href: (locale) => pathFor('about', locale),
  },
  {
    key: 'projects',
    label: { fr: 'Réalisations', en: 'Projects', es: 'Proyectos', ar: 'الأعمال' },
    href: (locale) => pathFor('projects', locale),
  },
  {
    key: 'career',
    label: { fr: 'Parcours', en: 'Career', es: 'Trayectoria', ar: 'المسار' },
    href: (locale) => pathFor('career', locale),
  },
  {
    key: 'contact',
    label: { fr: 'Contact', en: 'Contact', es: 'Contacto', ar: 'تواصل' },
    href: (locale) => contactHrefFor(locale),
  },
];

/** Identifiant du conteneur principal, cible du lien d’évitement. */
export const MAIN_CONTENT_ID = 'contenu';

export const COMMON = {
  skipToContent: {
    fr: 'Aller au contenu',
    en: 'Skip to content',
    es: 'Ir al contenido',
    ar: 'تخطّي إلى المحتوى',
  },
  /** Mention accessible ajoutee a tout lien ouvrant un nouvel onglet. */
  newWindow: {
    fr: 'nouvelle fenêtre',
    en: 'new window',
    es: 'nueva ventana',
    ar: 'نافذة جديدة',
  },
  /** Affiche a la place d’une donnee non encore documentee. */
  toBeSpecified: {
    fr: 'À préciser',
    en: 'To be specified',
    es: 'Por precisar',
    ar: 'يُحدَّد لاحقًا',
  },
} as const satisfies Readonly<Record<string, Translated>>;

/**
 * Unités de poids de fichier.
 *
 * Elles vivent ICI et non dans le formateur, pour la même raison que le reste :
 * une chaîne lue par un humain est du contenu, et le contenu porte ses quatre
 * variantes ou ne compile pas. Le formateur, lui, ne sait que diviser et
 * arrondir — voir `formatBytes` dans src/lib/public-asset.ts.
 *
 * Le défaut corrigé était exactement celui-là : l’abréviation était écrite
 * dans le formateur, donc hors du système de traduction, et le lien de
 * téléchargement annonçait « PDF, 129 Ko » en anglais, en espagnol et en
 * arabe.
 *
 * L’arabe emploie le mot entier plutôt qu’une abréviation : « ك.ب » existe
 * mais ne se lit pas de soi, alors que كيلوبايت est le terme courant.
 */
export const BYTE_UNITS = {
  /** 1 024 octets. */
  kibibyte: { fr: 'Ko', en: 'KB', es: 'KB', ar: 'كيلوبايت' },
  /** 1 048 576 octets. */
  mebibyte: { fr: 'Mo', en: 'MB', es: 'MB', ar: 'ميغابايت' },
} as const satisfies Readonly<Record<string, Translated>>;

/**
 * Bascule clair / sombre.
 *
 * Le libelle annonce l’ACTION a venir et non l’etat courant : un bouton dit
 * ce qu’il fera, `aria-pressed` dit ou l’on en est.
 */
export const THEME_TOGGLE = {
  toLight: {
    fr: 'Passer au mode clair',
    en: 'Switch to light mode',
    es: 'Cambiar al modo claro',
    ar: 'التبديل إلى الوضع الفاتح',
  },
  toDark: {
    fr: 'Passer au mode sombre',
    en: 'Switch to dark mode',
    es: 'Cambiar al modo oscuro',
    ar: 'التبديل إلى الوضع الداكن',
  },
} as const satisfies Readonly<Record<string, Translated>>;

/**
 * Selecteur de langue.
 *
 * `label` nomme le groupe de liens. Le nom de chaque langue, lui, vit dans
 * LOCALE_META de i18n.ts,
 * et il est ecrit DANS cette langue : un lecteur reconnait « العربية », pas
 * « arabe » ecrit en francais.
 */
export const LANGUAGE_PICKER = {
  label: {
    fr: 'Choix de la langue',
    en: 'Language',
    es: 'Idioma',
    ar: 'اللغة',
  },
  /**
   * Libelle accessible du declencheur de deploiement, dans l’en-tete.
   *
   * `{langue}` est remplace par le nom de la langue COURANTE, ecrit dans
   * cette langue. Meme convention que `{poids}` et `{years}` ailleurs.
   *
   * Le declencheur n’affiche que le code court — « FR » — qui ne dit pas de
   * lui-meme ce qu’il commande. Ce libelle le dit, et il CONTIENT le texte
   * visible plutot que de le remplacer : le critere WCAG 2.5.3 « Label in
   * Name » l’exige, et c’est pourquoi ce n’est pas un `aria-label`.
   */
  trigger: {
    fr: 'Langue : {langue}',
    en: 'Language: {langue}',
    es: 'Idioma: {langue}',
    ar: 'اللغة: {langue}',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const HEADER = {
  /** Libelle accessible de la balise nav principale. */
  navLabel: {
    fr: 'Navigation principale',
    en: 'Main navigation',
    es: 'Navegación principal',
    ar: 'التنقّل الرئيسي',
  },
  /**
   * Destination du lien porte par le nom du site, dite pour ceux qui ne
   * voient pas ou il se trouve.
   *
   * CE SONT LES QUATRE LIBELLES DE L’ANCIENNE ENTREE « ACCUEIL » de la
   * navigation, deplaces ici. Aucun mot n’a ete invente : l’entree est
   * partie, son libelle a change d’emploi.
   *
   * IL S’AJOUTE AU NOM VISIBLE, IL NE LE REMPLACE PAS. Un `aria-label`
   * ecraserait « MAROUAN Hazim-Rayan » et le rendrait introuvable pour un
   * lecteur d’ecran alors qu’il est ecrit a l’ecran — c’est ce que le
   * critere WCAG 2.5.3 « Label in Name » (niveau A) interdit, et c’est le
   * defaut qui avait deja ete corrige une fois ici. Rendu dans un element
   * hors ecran a l’interieur du lien, le libelle s’ajoute : le nom
   * accessible devient « MAROUAN Hazim-Rayan — Accueil », qui CONTIENT le
   * texte visible et dit ou le lien mene.
   *
   * `homeDestination` et non `homeLink` : `NOT_FOUND.homeLink` existe deja et
   * porte tout autre chose — « Retour à l’accueil », un libelle VISIBLE sur
   * la page 404. Deux cles de meme nom pour deux textes differents finiraient
   * par etre confondues.
   */
  homeDestination: {
    fr: 'Accueil',
    en: 'Home',
    es: 'Inicio',
    ar: 'الرئيسية',
  },
  menuOpen: {
    fr: 'Ouvrir le menu',
    en: 'Open menu',
    es: 'Abrir el menú',
    ar: 'فتح القائمة',
  },
  menuClose: {
    fr: 'Fermer le menu',
    en: 'Close menu',
    es: 'Cerrar el menú',
    ar: 'إغلاق القائمة',
  },
  /** Libelle accessible du panneau de navigation mobile. */
  mobileMenuLabel: {
    fr: 'Menu',
    en: 'Menu',
    es: 'Menú',
    ar: 'القائمة',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const FOOTER = {
  socialLabel: {
    fr: 'Réseaux sociaux',
    en: 'Social links',
    es: 'Redes sociales',
    ar: 'الشبكات الاجتماعية',
  },
  /** `{years}` est remplace par l’annee ou la plage d’annees. */
  copyright: {
    fr: 'Tous droits réservés.',
    en: 'All rights reserved.',
    es: 'Todos los derechos reservados.',
    ar: 'جميع الحقوق محفوظة.',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const HOME = {
  /**
   * ACCROCHE — LA FORMULATION RETENUE.
   *
   * Deux autres l'ont accompagnee ici le temps d'etre comparees : une qui
   * situait la personne entre deux mondes, une qui posait une methode. Le
   * proprietaire a tranche en faveur de celle-ci ; les deux autres ont ete
   * retirees avec leurs traductions, plutot que de dormir dans le fichier en
   * se faisant traduire a chaque passe.
   *
   * LES ESPACES INSECABLES NE SONT PAS DECORATIVES. Elles lient les groupes
   * de mots que la composition ne doit jamais briser — le titre de metier
   * avant tout. Sans elles, `text-wrap: balance` coupe la ligne francaise
   * apres « ingenieur » : c'est la coupe qui egalise le mieux les deux
   * lignes, et c'est la pire au sens du sens.
   *
   * Chaque groupe lie a ete mesure sur la fonte reellement servie : le plus
   * large, « ingenieur d'affaires », vaut 300 px a la plus petite taille du
   * systeme, contre 328 px de colonne a 360 px de large. Il tient.
   */
  headline: {
    fr: 'Développeur formé, ingénieur d’affaires en devenir.',
    en: 'Trained as a developer, becoming a business engineer.',
    es: 'Formado como desarrollador, futuro ingeniero de negocios.',
    ar: 'مطوِّر بالتكوين، ومهندس أعمال في الطريق.',
  },
  /**
   * UNE phrase de contexte, pas davantage. Le developpement appartient
   * desormais a la page « À propos », vers laquelle pointe le renvoi
   * ci-dessous. L’accueil presente, il ne raconte pas.
   *
   * « Master Ingénierie d’Affaires » est un intitule de diplome francais : il
   * est conserve tel quel dans les quatre langues, avec une glose entre
   * parentheses la ou il ne se comprend pas de lui-meme.
   */
  lede: {
    fr: 'Trois ans d’informatique, une année d’études au Québec, un stage en développement, et un Master Ingénierie d’Affaires à Paris School of Business.',
    en: 'Three years of computer science, a year of study in Quebec, a development internship, and a Master Ingénierie d’Affaires (business engineering) at Paris School of Business.',
    es: 'Tres años de informática, un año de estudios en Quebec, unas prácticas en desarrollo y un Master Ingénierie d’Affaires (ingeniería de negocios) en Paris School of Business.',
    ar: 'ثلاث سنوات في المعلوماتية، وسنة دراسية في كيبيك، وتدريب في التطوير، وماجستير Master Ingénierie d’Affaires (هندسة الأعمال) في Paris School of Business.',
  },
  /** Renvoi vers la page « À propos », sous la phrase de contexte. */
  aboutLinkLabel: {
    fr: 'À propos de moi',
    en: 'About me',
    es: 'Sobre mí',
    ar: 'نبذة عني',
  },
  /* --- Vignette compacte de realisation ---------------------------------
     Elle ne dit pas tout : elle donne envie d’ouvrir. */
  /**
   * Invitation a ouvrir, au bas de la vignette d’accueil.
   *
   * Elle etait reservee aux lecteurs d’ecran, accolee au titre pour
   * expliquer une fleche. Elle est desormais ECRITE : une carte qui invite
   * doit le dire, et le dire au meme endroit pour tout le monde.
   */
  featuredCardCta: {
    fr: 'Ouvrir la fiche',
    en: 'Open the project',
    es: 'Abrir la ficha',
    ar: 'فتح الصفحة',
  },
  /** Separateur entre la categorie et la periode. Purement visuel. */
  featuredCardSeparator: { fr: '·', en: '·', es: '·', ar: '·' },
  featuredHeading: {
    fr: 'Réalisations',
    en: 'Projects',
    es: 'Proyectos',
    ar: 'الأعمال',
  },
  featuredEmpty: {
    fr: 'Aucune réalisation n’est mise en avant pour le moment. Toutes restent consultables depuis l’index.',
    en: 'No project is featured at the moment. They all remain available from the index.',
    es: 'Por ahora no hay ningún proyecto destacado. Todos siguen disponibles desde el índice.',
    ar: 'لا يوجد عمل مميَّز في الوقت الحالي. تبقى جميع الأعمال متاحة من الفهرس.',
  },
  featuredLinkAll: {
    fr: 'Voir toutes les réalisations',
    en: 'See all projects',
    es: 'Ver todos los proyectos',
    ar: 'عرض جميع الأعمال',
  },
  contactHeading: {
    fr: 'Contact',
    en: 'Contact',
    es: 'Contacto',
    ar: 'تواصل',
  },
  /** Texte alternatif du portrait. Decrit le sujet, sans le qualifier. */
  portraitAlt: {
    fr: 'Portrait de MAROUAN Hazim-Rayan',
    en: 'Portrait of MAROUAN Hazim-Rayan',
    es: 'Retrato de MAROUAN Hazim-Rayan',
    ar: 'صورة شخصية لـ MAROUAN Hazim-Rayan',
  },
  cvLabel: {
    fr: 'Télécharger mon CV',
    en: 'Download my CV',
    es: 'Descargar mi CV',
    ar: 'تنزيل سيرتي الذاتية',
  },
  /**
   * Mention accessible : format et poids, annonces avant le declenchement.
   * `{poids}` est remplace par la taille REELLE du fichier, lue au build.
   * Meme convention que `{years}` dans FOOTER.copyright.
   */
  cvMeta: { fr: 'PDF, {poids}', en: 'PDF, {poids}', es: 'PDF, {poids}', ar: 'PDF، {poids}' },
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
 *
 * Les quatre versions disent la MEME chose. Le registre y est identique :
 * sobre, factuel, premiere personne, aucun superlatif.
 * ---------------------------------------------------------------------------
 */
export const ABOUT = {
  eyebrow: {
    fr: 'Qui je suis',
    en: 'Who I am',
    es: 'Quién soy',
    ar: 'من أنا',
  },
  heading: {
    fr: 'À propos',
    en: 'About',
    es: 'Acerca de',
    ar: 'نبذة عني',
  },
  readingsHeading: {
    fr: 'Lectures',
    en: 'Reading',
    es: 'Lecturas',
    ar: 'قراءات',
  },
  readingsIntro: {
    fr: 'Quatre livres qui ont changé ma façon de travailler.',
    en: 'Four books that changed the way I work.',
    es: 'Cuatro libros que cambiaron mi forma de trabajar.',
    ar: 'أربعة كتب غيّرت طريقتي في العمل.',
  },
  readingsEmpty: {
    fr: 'Les lectures restent à renseigner.',
    en: 'The reading list has yet to be filled in.',
    es: 'Las lecturas están por completar.',
    ar: 'قائمة القراءات لم تُستكمل بعد.',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const ABOUT_PARAGRAPHS: TranslatedList = {
  fr: [
    'J’ai passé trois ans en informatique, dont une année à l’Université du Québec à Chicoutimi, vécue seul et loin de chez moi. C’est un stage en entreprise qui a tranché : ce qui me retient n’est pas d’écrire le code, c’est de comprendre le besoin qui le déclenche. J’ai donc choisi l’ingénierie d’affaires.',
    'J’ai nagé sept ans en compétition, de sept à quatorze ans. J’en ai gardé la rigueur, la discipline et la persévérance : l’habitude d’un effort qui ne produit ses effets qu’à long terme, et qu’il faut fournir sans rien voir venir. Je pratique aujourd’hui la calisthénie.',
    'Ce que le sport m’a surtout appris, c’est de repartir d’en bas. Entrer dans une discipline nouvelle, c’est revenir au rang de débutant et reprendre la progression à zéro. Cela ne m’effraie pas : je l’ai déjà fait, et je sais ce que cela demande. C’est ce qui rend le passage de la technique au commerce naturel plutôt que risqué.',
    'J’apprends en continu et je lis beaucoup. J’aime construire par moi-même : j’ai conçu, développé et publié seul JTR, une application Android de gestion de contacts. À terme, je veux entreprendre, dans un domaine où la technique et le commerce se rencontrent. C’est la raison de ce double parcours : savoir ce qu’un produit demande à construire, et savoir à qui il s’adresse.',
  ],
  en: [
    'I spent three years studying computer science, including a year at the Université du Québec à Chicoutimi, lived alone and far from home. An internship settled it: what holds my attention is not writing the code, it is understanding the need that calls for it. So I chose business engineering.',
    'I swam competitively for seven years, from the age of seven to fourteen. What I kept from it is rigour, discipline and perseverance: the habit of an effort that only pays off in the long run, and that has to be made with nothing yet to show for it. I practise calisthenics today.',
    'What sport taught me above all is how to start again from the bottom. Entering a new discipline means going back to being a beginner and starting the climb from zero. That does not frighten me: I have done it before, and I know what it takes. It is what makes the move from engineering to business feel natural rather than risky.',
    'I keep learning and I read a great deal. I like building things myself: I designed, developed and published JTR on my own, an Android contact manager. In time I want to start a company, in a field where engineering and business meet. That is the reason for this double path: knowing what a product takes to build, and knowing who it is for.',
  ],
  es: [
    'Pasé tres años estudiando informática, entre ellos un año en la Université du Québec à Chicoutimi, viviendo solo y lejos de casa. Unas prácticas en empresa lo decidieron: lo que me retiene no es escribir el código, sino entender la necesidad que lo origina. Por eso elegí la ingeniería de negocios.',
    'Nadé siete años en competición, de los siete a los catorce. De ahí conservo el rigor, la disciplina y la perseverancia: la costumbre de un esfuerzo que solo da frutos a largo plazo, y que hay que sostener sin ver todavía nada.  Hoy practico calistenia.',
    'Lo que el deporte me enseñó sobre todo es a empezar de nuevo desde abajo. Entrar en una disciplina nueva es volver a ser principiante y rehacer el camino desde cero. Eso no me asusta: ya lo he hecho, y sé lo que exige. Es lo que hace que el paso de la técnica al comercio me parezca natural y no arriesgado.',
    'Aprendo de forma continua y leo mucho. Me gusta construir por mí mismo: diseñé, desarrollé y publiqué yo solo JTR, una aplicación Android de gestión de contactos. A largo plazo quiero emprender, en un ámbito donde la técnica y el comercio se encuentran. Esa es la razón de esta doble trayectoria: saber lo que un producto exige construir, y saber a quién se dirige.',
  ],
  ar: [
    'أمضيت ثلاث سنوات في دراسة المعلوماتية، منها سنة في Université du Québec à Chicoutimi، عشتها وحدي بعيدًا عن بيتي. تدريب في إحدى الشركات هو ما حسم الأمر: ما يشدّني ليس كتابة الشيفرة، بل فهم الحاجة التي تستدعيها. لذلك اخترت هندسة الأعمال.',
    'سبحت سبع سنوات في المنافسات، من السابعة إلى الرابعة عشرة. ما بقي منها هو الانضباط والصرامة والمثابرة: عادة بذل جهد لا تظهر آثاره إلا على المدى الطويل، ويجب مواصلته دون أن يلوح شيء في الأفق. أمارس اليوم رياضة الكاليسثينكس.',
    'ما علّمتني إياه الرياضة قبل كل شيء هو أن أبدأ من جديد من الأسفل. الدخول في مجال جديد يعني العودة إلى مرتبة المبتدئ واستئناف التقدّم من الصفر. هذا لا يخيفني: فقد فعلته من قبل، وأعرف ما يتطلّبه. وهو ما يجعل الانتقال من التقنية إلى التجارة أمرًا طبيعيًا لا مخاطرة.',
    'أتعلّم باستمرار وأقرأ كثيرًا. أحبّ أن أبني بنفسي: صمّمت وطوّرت ونشرت وحدي تطبيق JTR، وهو تطبيق أندرويد لإدارة جهات الاتصال. على المدى البعيد أريد أن أؤسّس مشروعي الخاص، في مجال تلتقي فيه التقنية بالتجارة. هذا هو سبب هذا المسار المزدوج: أن أعرف ما يتطلّبه بناء منتج، وأن أعرف لمن هو موجَّه.',
  ],
};

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
 *
 * IL RESTE EN FRANCAIS, ET C’EST UNE LIMITE ASSUMEE. Ce composant REMPLACE la
 * mise en page racine, donc celle qui portait la langue : au moment ou il
 * s’affiche, plus rien dans l’arbre ne sait quelle langue etait servie. Le
 * traduire supposerait de deviner, et deviner une langue vaut moins qu’en
 * afficher une, connue, avec un lien vers l’accueil.
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
  siteAlt: {
    fr: 'Vignette de partage : le nom MAROUAN Hazim-Rayan et l’accroche du site, en lettres claires sur un fond bleu nuit.',
    en: 'Share image: the name MAROUAN Hazim-Rayan and the site’s tagline, in light lettering on a midnight blue background.',
    es: 'Imagen para compartir: el nombre MAROUAN Hazim-Rayan y el lema del sitio, en letras claras sobre un fondo azul noche.',
    ar: 'صورة المشاركة: اسم MAROUAN Hazim-Rayan وشعار الموقع، بحروف فاتحة على خلفية زرقاء داكنة.',
  },
  /** Unique : voir l’en-tete de l’image de partage des fiches. */
  projectAlt: {
    fr: 'Vignette de partage d’une réalisation, au nom de MAROUAN Hazim-Rayan, en lettres claires sur un fond bleu nuit.',
    en: 'Share image for a project, under the name MAROUAN Hazim-Rayan, in light lettering on a midnight blue background.',
    es: 'Imagen para compartir de un proyecto, a nombre de MAROUAN Hazim-Rayan, en letras claras sobre un fondo azul noche.',
    ar: 'صورة مشاركة لأحد الأعمال، باسم MAROUAN Hazim-Rayan، بحروف فاتحة على خلفية زرقاء داكنة.',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const PROJECTS_INDEX = {
  eyebrow: { fr: 'Travaux', en: 'Work', es: 'Trabajos', ar: 'أعمال' },
  heading: { fr: 'Réalisations', en: 'Projects', es: 'Proyectos', ar: 'الأعمال' },
  intro: {
    fr: 'Projets professionnels, académiques et personnels, groupés par nature.',
    en: 'Professional, academic and personal projects, grouped by kind.',
    es: 'Proyectos profesionales, académicos y personales, agrupados por tipo.',
    ar: 'مشاريع مهنية وأكاديمية وشخصية، مصنَّفة حسب نوعها.',
  },
  empty: {
    fr: 'Aucune réalisation n’est publiée pour le moment.',
    en: 'No project is published at the moment.',
    es: 'Por ahora no hay ningún proyecto publicado.',
    ar: 'لا توجد أعمال منشورة في الوقت الحالي.',
  },
  /** `{count}` est remplace par le nombre de realisations de la categorie. */
  countOne: { fr: 'réalisation', en: 'project', es: 'proyecto', ar: 'عمل' },
  countMany: { fr: 'réalisations', en: 'projects', es: 'proyectos', ar: 'أعمال' },
  readMore: {
    fr: 'Consulter la réalisation',
    en: 'View the project',
    es: 'Ver el proyecto',
    ar: 'الاطّلاع على العمل',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const PROJECT_DETAIL = {
  eyebrow: { fr: 'Réalisation', en: 'Project', es: 'Proyecto', ar: 'عمل' },
  contextHeading: { fr: 'Contexte', en: 'Context', es: 'Contexto', ar: 'السياق' },
  roleHeading: { fr: 'Rôle', en: 'Role', es: 'Rol', ar: 'الدور' },
  periodHeading: { fr: 'Période', en: 'Period', es: 'Periodo', ar: 'الفترة' },
  categoryHeading: { fr: 'Catégorie', en: 'Category', es: 'Categoría', ar: 'الفئة' },
  technologiesHeading: {
    fr: 'Technologies',
    en: 'Technologies',
    es: 'Tecnologías',
    ar: 'التقنيات',
  },
  featuresHeading: {
    fr: 'Fonctionnalités',
    en: 'Features',
    es: 'Funcionalidades',
    ar: 'الوظائف',
  },
  starHeading: {
    fr: 'Déroulé du projet',
    en: 'How the project unfolded',
    es: 'Desarrollo del proyecto',
    ar: 'مجريات المشروع',
  },
  /** Intitule neutre : ce que la livraison ne couvre pas. */
  scopeHeading: { fr: 'Périmètre', en: 'Scope', es: 'Alcance', ar: 'النطاق' },
  learningsHeading: {
    fr: 'Enseignements',
    en: 'What I took from it',
    es: 'Lo que aprendí',
    ar: 'ما تعلّمته',
  },
  learningsEmpty: {
    fr: 'Les enseignements de ce projet restent à rédiger.',
    en: 'What I took from this project has yet to be written up.',
    es: 'Lo aprendido en este proyecto está por redactar.',
    ar: 'ما تعلّمته من هذا المشروع لم يُكتب بعد.',
  },
  linksHeading: { fr: 'Liens', en: 'Links', es: 'Enlaces', ar: 'روابط' },
  visualsHeading: { fr: 'Visuels', en: 'Screens', es: 'Imágenes', ar: 'صور' },
  navigationLabel: {
    fr: 'Navigation entre les réalisations',
    en: 'Navigation between projects',
    es: 'Navegación entre proyectos',
    ar: 'التنقّل بين الأعمال',
  },
  previousLabel: {
    fr: 'Réalisation précédente',
    en: 'Previous project',
    es: 'Proyecto anterior',
    ar: 'العمل السابق',
  },
  nextLabel: {
    fr: 'Réalisation suivante',
    en: 'Next project',
    es: 'Proyecto siguiente',
    ar: 'العمل التالي',
  },
  backToIndex: {
    fr: 'Retour aux réalisations',
    en: 'Back to projects',
    es: 'Volver a los proyectos',
    ar: 'العودة إلى الأعمال',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const CAREER = {
  eyebrow: { fr: 'Trajectoire', en: 'Path', es: 'Trayectoria', ar: 'المسار' },
  /**
   * Declencheur de la description d’une entree de parcours.
   *
   * Il dit ce qu’il OUVRE, et non ce qu’il fait : « En savoir plus » nommerait
   * l’action et laisserait deviner sur quoi elle porte. Pose sous le titre
   * d’une entree, « Le détail » ne peut designer que cette entree-la.
   */
  entryDetails: {
    fr: 'Le détail',
    en: 'The detail',
    es: 'El detalle',
    ar: 'التفاصيل',
  },
  heading: { fr: 'Parcours', en: 'Career', es: 'Trayectoria', ar: 'المسار' },
  intro: {
    fr: 'Formation, expériences et langues.',
    en: 'Education, experience and languages.',
    es: 'Formación, experiencia e idiomas.',
    ar: 'التكوين والخبرات واللغات.',
  },
  formationHeading: { fr: 'Formation', en: 'Education', es: 'Formación', ar: 'التكوين' },
  formationEmpty: {
    fr: 'La formation reste à renseigner.',
    en: 'Education has yet to be filled in.',
    es: 'La formación está por completar.',
    ar: 'التكوين لم يُستكمل بعد.',
  },
  experienceHeading: {
    fr: 'Expériences',
    en: 'Experience',
    es: 'Experiencia',
    ar: 'الخبرات',
  },
  experienceEmpty: {
    fr: 'Les expériences restent à renseigner.',
    en: 'Experience has yet to be filled in.',
    es: 'La experiencia está por completar.',
    ar: 'الخبرات لم تُستكمل بعد.',
  },
  languagesHeading: { fr: 'Langues', en: 'Languages', es: 'Idiomas', ar: 'اللغات' },
  languagesEmpty: {
    fr: 'Les langues restent à renseigner.',
    en: 'Languages have yet to be filled in.',
    es: 'Los idiomas están por completar.',
    ar: 'اللغات لم تُستكمل بعد.',
  },
} as const satisfies Readonly<Record<string, Translated>>;

export const NOT_FOUND = {
  eyebrow: { fr: 'Erreur 404', en: 'Error 404', es: 'Error 404', ar: 'خطأ 404' },
  heading: {
    fr: 'Page introuvable',
    en: 'Page not found',
    es: 'Página no encontrada',
    ar: 'الصفحة غير موجودة',
  },
  message: {
    fr: 'Cette adresse ne correspond à aucune page du site. Elle a pu être déplacée ou mal recopiée.',
    en: 'This address does not match any page on the site. It may have moved, or been copied incorrectly.',
    es: 'Esta dirección no corresponde a ninguna página del sitio. Puede que se haya movido o copiado mal.',
    ar: 'هذا العنوان لا يطابق أي صفحة في الموقع. ربما نُقلت الصفحة أو نُسخ العنوان خطأً.',
  },
  homeLink: {
    fr: 'Retour à l’accueil',
    en: 'Back to home',
    es: 'Volver al inicio',
    ar: 'العودة إلى الصفحة الرئيسية',
  },
  projectsLink: {
    fr: 'Voir les réalisations',
    en: 'See the projects',
    es: 'Ver los proyectos',
    ar: 'عرض الأعمال',
  },
} as const satisfies Readonly<Record<string, Translated>>;

/**
 * Metadonnees par page.
 *
 * `title` est le segment insere dans le gabarit defini par la mise en page
 * racine ; le nom complet y est ajoute automatiquement. AUDIT.md section 6.3
 * releve qu’aucune des trois pages precedentes ne contenait le nom, alors
 * que c’est l’unique requete a forte intention pour un portfolio personnel.
 */
export interface PageMeta {
  readonly title: Translated;
  readonly description: Translated;
}

export const PAGE_META: Readonly<Record<string, PageMeta>> = {
  home: {
    title: { fr: 'Portfolio', en: 'Portfolio', es: 'Portafolio', ar: 'أعمالي' },
    description: {
      fr: 'Portfolio de MAROUAN Hazim-Rayan : réalisations, parcours et coordonnées.',
      en: 'Portfolio of MAROUAN Hazim-Rayan: projects, career and contact details.',
      es: 'Portafolio de MAROUAN Hazim-Rayan: proyectos, trayectoria y datos de contacto.',
      ar: 'أعمال MAROUAN Hazim-Rayan: المشاريع والمسار وبيانات التواصل.',
    },
  },
  about: {
    title: { fr: 'À propos', en: 'About', es: 'Acerca de', ar: 'نبذة عني' },
    description: {
      fr: 'MAROUAN Hazim-Rayan : de l’informatique à l’ingénierie d’affaires, ce que sept ans de natation en compétition ont construit, et ce qui l’anime au quotidien.',
      en: 'MAROUAN Hazim-Rayan: from computer science to business engineering, what seven years of competitive swimming built, and what drives him day to day.',
      es: 'MAROUAN Hazim-Rayan: de la informática a la ingeniería de negocios, lo que construyeron siete años de natación en competición y lo que le mueve a diario.',
      ar: 'MAROUAN Hazim-Rayan: من المعلوماتية إلى هندسة الأعمال، وما بنته سبع سنوات من السباحة التنافسية، وما يحرّكه يوميًا.',
    },
  },
  projects: {
    title: { fr: 'Réalisations', en: 'Projects', es: 'Proyectos', ar: 'الأعمال' },
    description: {
      fr: 'Réalisations de MAROUAN Hazim-Rayan : projets académiques, personnels et professionnels, détaillés selon la méthode STAR.',
      en: 'Projects by MAROUAN Hazim-Rayan: academic, personal and professional work, set out using the STAR method.',
      es: 'Proyectos de MAROUAN Hazim-Rayan: trabajos académicos, personales y profesionales, detallados con el método STAR.',
      ar: 'أعمال MAROUAN Hazim-Rayan: مشاريع أكاديمية وشخصية ومهنية، مفصَّلة وفق منهجية STAR.',
    },
  },
  career: {
    title: { fr: 'Parcours', en: 'Career', es: 'Trayectoria', ar: 'المسار' },
    description: {
      fr: 'Formation et expériences de MAROUAN Hazim-Rayan.',
      en: 'Education and experience of MAROUAN Hazim-Rayan.',
      es: 'Formación y experiencia de MAROUAN Hazim-Rayan.',
      ar: 'تكوين MAROUAN Hazim-Rayan وخبراته.',
    },
  },
  notFound: {
    title: {
      fr: 'Page introuvable',
      en: 'Page not found',
      es: 'Página no encontrada',
      ar: 'الصفحة غير موجودة',
    },
    description: {
      fr: 'Cette adresse ne correspond à aucune page du site.',
      en: 'This address does not match any page on the site.',
      es: 'Esta dirección no corresponde a ninguna página del sitio.',
      ar: 'هذا العنوان لا يطابق أي صفحة في الموقع.',
    },
  },
  styleguide: {
    title: {
      fr: 'Design system',
      en: 'Design system',
      es: 'Design system',
      ar: 'Design system',
    },
    description: {
      fr: 'Page de démonstration interne du design system.',
      en: 'Internal demonstration page for the design system.',
      es: 'Página interna de demostración del design system.',
      ar: 'صفحة داخلية لعرض نظام التصميم.',
    },
  },
};
