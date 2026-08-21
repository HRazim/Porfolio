/**
 * ---------------------------------------------------------------------------
 * SCHEMA DE CONTENU — PARCOURS
 * ---------------------------------------------------------------------------
 *
 * Formation, experiences et langues, en donnees typees. La page /parcours
 * n’ecrit aucun libelle a la main : elle rend ce fichier.
 *
 * REGLE DE REMPLISSAGE
 * Un champ non documente vaut `null`. Aucune ville n’est deduite d’un nom
 * d’etablissement, aucun mois n’est ajoute a une annee. La granularite des
 * periodes est exactement celle de la donnee disponible.
 *
 * Convention typographique francaise : voir l’entete de projects.ts.
 * ---------------------------------------------------------------------------
 */

import { invariant, type Locale, type Translated, type TranslatedList } from './i18n';
import type { Period } from './period';

export type CareerKind = 'formation' | 'experience';

export interface CareerEntry {
  /** Identifiant stable, en kebab-case. Sert de cle de rendu. */
  readonly id: string;
  readonly kind: CareerKind;
  /** Intitule du diplome ou du poste. */
  readonly title: Translated;
  /** Etablissement ou employeur. `null` tant que la donnee n’est pas etablie. */
  readonly organisation: Translated | null;
  /** Ville. `null` lorsqu’elle n’est pas documentee separement. */
  readonly location: Translated | null;
  readonly period: Period;
  /** Resume en une a deux phrases. `null` tant que la redaction n’a pas eu lieu. */
  readonly summary: Translated | null;
  /** Points saillants. Tableau vide plutot que champ optionnel. */
  readonly highlights: TranslatedList;
  /**
   * Description longue, depliable sous l'entree.
   *
   * ELLE N'EST PAS UN SECOND `summary`. Le resume tient en une ou deux
   * phrases et s'affiche toujours ; la description developpe, et ne s'ouvre
   * que si on la demande. Une page de parcours qui deroule tout n'est plus
   * une liste, c'est un texte.
   *
   * UNE LISTE DE PARAGRAPHES, et non une chaine unique. Un texte de cette
   * longueur en compte plusieurs, et une chaine unique aurait exige un
   * separateur convenu dans la donnee — que le composant aurait ensuite du
   * connaitre. `TranslatedList` porte la structure la ou elle appartient.
   *
   * TABLEAU VIDE plutot que `null`, comme `highlights` juste au-dessus : une
   * entree sans description a une description vide, pas une description
   * absente. Le composant ne rend alors rien du tout.
   */
  readonly description: TranslatedList;
}

/**
 * Entrees de parcours, les plus recentes en premier a l’interieur de chaque
 * nature.
 */
const CAREER_ENTRIES: readonly CareerEntry[] = [
  {
    id: 'master-ingenierie-affaires',
    kind: 'formation',
    title: {
      fr: 'Master Ingénierie d’Affaires',
      en: 'Master Ingénierie d’Affaires (business engineering)',
      es: 'Master Ingénierie d’Affaires (ingeniería de negocios)',
      ar: 'Master Ingénierie d’Affaires (هندسة الأعمال)',
    },
    organisation: invariant('Paris School of Business'),
    location: null,
    period: { kind: 'connue', start: '2026', end: '2028' },
    summary: null,
    highlights: {
      fr: ['En alternance : quatre jours en entreprise, un jour en formation'],
      en: ['Work-study: four days in the company, one day in class'],
      es: ['En alternancia: cuatro días en la empresa, un día de formación'],
      ar: ['بالتناوب: أربعة أيام في الشركة، ويوم في التكوين'],
    },
    description: { fr: [], en: [], es: [], ar: [] },
  },
  {
    id: 'but-informatique',
    kind: 'formation',
    title: {
      fr: 'BUT Informatique, double diplôme',
      en: 'BUT Informatique (three-year computer science degree), double degree',
      es: 'BUT Informatique (grado en informática), doble titulación',
      ar: 'BUT Informatique (إجازة في المعلوماتية)، شهادة مزدوجة',
    },
    organisation: invariant('IUT de Vélizy-Villacoublay — Université Paris-Saclay'),
    location: null,
    period: { kind: 'connue', start: '2023', end: '2026' },
    summary: null,
    // L’annee au Quebec est une composante du double diplome, pas une
    // formation distincte : elle est donc rattachee a cette entree.
    highlights: {
      fr: ['Année à l’Université du Québec à Chicoutimi en 2025-2026, au titre du double diplôme'],
      en: ['Year at the Université du Québec à Chicoutimi in 2025-2026, as part of the double degree'],
      es: ['Año en la Université du Québec à Chicoutimi en 2025-2026, dentro de la doble titulación'],
      ar: ['سنة في Université du Québec à Chicoutimi في 2025-2026، ضمن الشهادة المزدوجة'],
    },
    description: {
      fr: [
        'Une année d’études à l’Université du Québec à Chicoutimi, seul, à cinq mille kilomètres. Informatique mobile, cloud, systèmes d’exploitation, gestion de projet, et deux projets menés jusqu’au bout.',
        'Ce que j’en retiens tient moins aux cours qu’au reste : gérer un logement, un budget et des démarches administratives dans un pays qu’on ne connaît pas, et reconstruire un cercle à partir de rien. J’y suis arrivé sans connaître personne ; entre le basketball hebdomadaire et le club de plein air, j’en suis reparti avec des amis. Loin de tous ses repères, on n’a plus qu’une direction possible : devant.',
      ],
      en: [
        'A year of study at the Université du Québec à Chicoutimi, alone, five thousand kilometres away. Mobile computing, cloud, operating systems, project management, and two projects carried through to the end.',
        'What I take from it has less to do with the courses than with the rest: managing a place to live, a budget and administrative procedures in a country you do not know, and rebuilding a circle from nothing. I arrived knowing no one; between weekly basketball and the outdoors club, I left with friends. Far from all your bearings, you are left with only one possible direction: forward.',
      ],
      es: [
        'Un año de estudios en la Université du Québec à Chicoutimi, solo, a cinco mil kilómetros. Informática móvil, cloud, sistemas operativos, gestión de proyectos y dos proyectos llevados hasta el final.',
        'Lo que me queda tiene menos que ver con los cursos que con el resto: gestionar un alojamiento, un presupuesto y trámites administrativos en un país que no se conoce, y reconstruir un círculo desde cero. Llegué sin conocer a nadie; entre el baloncesto semanal y el club de actividades al aire libre, me fui con amigos. Lejos de todos sus puntos de referencia, uno ya no tiene más que una dirección posible: adelante.',
      ],
      ar: [
        'سنة دراسية في Université du Québec à Chicoutimi، وحدي، على بُعد خمسة آلاف كيلومتر. حوسبة محمولة، وسحابة، وأنظمة تشغيل، وإدارة مشاريع، ومشروعان أُنجزا حتى النهاية.',
        'ما أحتفظ به يرتبط بالباقي أكثر ممّا يرتبط بالدروس: تدبير سكن وميزانية وإجراءات إدارية في بلد لا تعرفه، وإعادة بناء دائرة من الصفر. وصلت دون أن أعرف أحدًا؛ وبين كرة السلة الأسبوعية ونادي الأنشطة في الهواء الطلق، غادرت ولي أصدقاء. لم يعد أمام المرء، بعيدًا عن كل معالمه، سوى اتجاه واحد ممكن: إلى الأمام.',
      ],
    },
  },
  {
    id: 'baccalaureat-sti2d',
    kind: 'formation',
    title: {
      fr: 'Baccalauréat STI2D',
      en: 'Baccalauréat STI2D (French secondary school diploma, engineering track)',
      es: 'Baccalauréat STI2D (bachillerato francés, itinerario tecnológico)',
      ar: 'Baccalauréat STI2D (البكالوريا الفرنسية، مسار تكنولوجي)',
    },
    organisation: invariant('Lycée Saint-François d’Assise'),
    location: invariant('Montigny-le-Bretonneux'),
    period: { kind: 'connue', start: '2020', end: '2023' },
    summary: null,
    highlights: {
      fr: ['Mention Bien'],
      en: ['Mention Bien (French grading, 14 to 16 out of 20)'],
      es: ['Mention Bien (calificación francesa, de 14 a 16 sobre 20)'],
      ar: ['Mention Bien (التقدير الفرنسي، من 14 إلى 16 من 20)'],
    },
    description: { fr: [], en: [], es: [], ar: [] },
  },
  {
    id: 'egis-developpeur',
    kind: 'experience',
    title: {
      fr: 'Développeur informatique, stage',
      en: 'Software developer, internship',
      es: 'Desarrollador informático, prácticas',
      ar: 'مطوِّر برمجيات، تدريب',
    },
    organisation: invariant('Egis'),
    location: invariant('Guyancourt'),
    period: { kind: 'connue', start: '2025-04-14', end: '2025-06-20' },
    summary: null,
    highlights: { fr: [], en: [], es: [], ar: [] },
    description: { fr: [], en: [], es: [], ar: [] },
  },
  {
    id: 'forum-orientation-trappes',
    kind: 'experience',
    title: {
      fr: 'Intervenant',
      en: 'Speaker',
      es: 'Ponente',
      ar: 'متحدّث',
    },
    organisation: invariant('Forum de l’orientation'),
    location: invariant('Trappes'),
    period: { kind: 'connue', start: '2025-02', end: '2025-02' },
    summary: null,
    highlights: { fr: [], en: [], es: [], ar: [] },
    description: { fr: [], en: [], es: [], ar: [] },
  },
];

/**
 * Niveau de maitrise linguistique.
 * `langue-maternelle` n’est pas un niveau du cadre europeen : il est distingue
 * pour cette raison.
 */
export type LanguageLevel = 'langue-maternelle' | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';

export const LANGUAGE_LEVEL_LABELS: Readonly<Record<LanguageLevel, Translated>> = {
  'langue-maternelle': {
    fr: 'Langue maternelle',
    en: 'Native language',
    es: 'Lengua materna',
    ar: 'اللغة الأم',
  },
  // Les codes du cadre europeen sont des codes, pas des mots : identiques
  // dans toutes les langues.
  C2: invariant('C2'),
  C1: invariant('C1'),
  B2: invariant('B2'),
  B1: invariant('B1'),
  A2: invariant('A2'),
  A1: invariant('A1'),
};

export interface LanguageSkill {
  /** Identifiant stable, en kebab-case. */
  readonly id: string;
  readonly name: Translated;
  /**
   * Niveau du cadre europeen. `null` lorsqu’un score certifie le remplace :
   * un chiffre verifiable vaut mieux qu’une auto-evaluation posee a cote.
   */
  readonly level: LanguageLevel | null;
  /** Certification obtenue. `null` en l’absence de certification documentee. */
  readonly certification: Translated | null;
}

const LANGUAGES: readonly LanguageSkill[] = [
  {
    id: 'francais',
    name: {
      fr: 'Français',
      en: 'French',
      es: 'Francés',
      ar: 'الفرنسية',
    },
    level: 'langue-maternelle',
    certification: null,
  },
  {
    id: 'anglais',
    name: {
      fr: 'Anglais',
      en: 'English',
      es: 'Inglés',
      ar: 'الإنجليزية',
    },
    // Le score se suffit : une equivalence CECRL posee a cote serait une
    // interpretation de ma part, la que le chiffre est verifiable.
    level: null,
    certification: invariant('TOEIC 870'),
  },
  {
    id: 'espagnol',
    name: {
      fr: 'Espagnol',
      en: 'Spanish',
      es: 'Español',
      ar: 'الإسبانية',
    },
    level: 'B2',
    certification: null,
  },
  {
    id: 'arabe',
    name: {
      fr: 'Arabe',
      en: 'Arabic',
      es: 'Árabe',
      ar: 'العربية',
    },
    level: 'B1',
    certification: null,
  },
];

/** Les entrees d’une nature donnee, les plus recentes d’abord. */
export function getCareerEntriesByKind(kind: CareerKind): readonly CareerEntry[] {
  return CAREER_ENTRIES.filter((entry) => entry.kind === kind);
}

/** Les langues maitrisees, dans l’ordre de declaration. */
export function getLanguages(): readonly LanguageSkill[] {
  return LANGUAGES;
}

/**
 * Lecture marquante.
 *
 * `takeaway` n’est pas un resume du livre : c’est ce que la lecture a change
 * dans la facon de travailler. Un resume se trouve partout ailleurs.
 */
export interface Reading {
  /** Identifiant stable, en kebab-case. */
  readonly id: string;
  readonly title: Translated;
  readonly author: Translated;
  readonly takeaway: Translated;
}

const READINGS: readonly Reading[] = [
  {
    id: 'lois-nature-humaine',
    title: {
      fr: 'Les lois de la nature humaine',
      en: 'The Laws of Human Nature',
      es: 'Las leyes de la naturaleza humana',
      ar: 'قوانين الطبيعة البشرية',
    },
    author: invariant('Robert Greene'),
    takeaway: {
      fr:
        'Écouter ce qui n’est pas dit. En entretien comme en négociation, l’information utile est rarement celle qu’on vous donne.',
      en:
        'Listen to what is not said. In an interview as in a negotiation, the useful piece of information is rarely the one you are handed.',
      es:
        'Escuchar lo que no se dice. En una entrevista como en una negociación, la información útil rara vez es la que te dan.',
      ar:
        'الإصغاء إلى ما لا يُقال. في المقابلة كما في التفاوض، نادرًا ما تكون المعلومة المفيدة هي تلك التي تُعطى لك.',
    },
  },
  {
    id: 'psychologie-argent',
    title: {
      fr: 'La psychologie de l’argent',
      en: 'The Psychology of Money',
      es: 'La psicología del dinero',
      ar: 'سيكولوجية المال',
    },
    author: invariant('Morgan Housel'),
    takeaway: {
      fr:
        'Les décisions financières sont d’abord des décisions humaines. Comprendre le comportement avant les chiffres.',
      en:
        'Financial decisions are human decisions first. Understand the behaviour before the numbers.',
      es:
        'Las decisiones financieras son ante todo decisiones humanas. Entender el comportamiento antes que las cifras.',
      ar:
        'القرارات المالية هي قرارات بشرية قبل كل شيء. فهم السلوك قبل الأرقام.',
    },
  },
  {
    id: 'outlive',
    title: invariant('Outlive'),
    author: invariant('Peter Attia'),
    takeaway: {
      fr:
        'Raisonner en horizon long plutôt qu’en résultat immédiat, et l’appliquer ailleurs qu’à la santé.',
      en:
        'Think in long horizons rather than immediate results, and apply it beyond health.',
      es:
        'Razonar a largo plazo en vez de buscar el resultado inmediato, y aplicarlo más allá de la salud.',
      ar:
        'التفكير على المدى الطويل بدل النتيجة الفورية، وتطبيق ذلك في غير مجال الصحة.',
    },
  },
  {
    id: 'notre-derniere-invention',
    title: {
      fr: 'Notre dernière invention',
      en: 'Our Final Invention',
      es: 'Nuestra invención final',
      ar: 'اختراعنا الأخير',
    },
    author: invariant('James Barrat'),
    takeaway: {
      fr:
        'S’intéresser à ce qu’une technologie rend possible avant de s’enthousiasmer pour ce qu’elle fait déjà.',
      en:
        'Take an interest in what a technology makes possible before getting excited about what it already does.',
      es:
        'Interesarse por lo que una tecnología hace posible antes de entusiasmarse por lo que ya hace.',
      ar:
        'الاهتمام بما تتيحه التقنية قبل الحماس لما تفعله بالفعل.',
    },
  },
];

/** Les lectures marquantes, dans l’ordre de declaration. */
export function getReadings(): readonly Reading[] {
  return READINGS;
}

/**
 * Qualification affichee pour une langue : niveau, certification, ou les
 * deux. La composition vit ici et non dans le composant, celui-ci ne
 * redigeant rien.
 */
export function formatLanguageQualification(
  language: LanguageSkill,
  locale: Locale,
): string {
  const parts: string[] = [];
  if (language.level !== null) parts.push(LANGUAGE_LEVEL_LABELS[language.level][locale]);
  if (language.certification !== null) parts.push(language.certification[locale]);
  return parts.join(' — ');
}
