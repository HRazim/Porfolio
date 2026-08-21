import type { Route } from 'next';

/**
 * ---------------------------------------------------------------------------
 * INTERNATIONALISATION — QUATRE LANGUES, AUCUNE BIBLIOTHÈQUE
 * ---------------------------------------------------------------------------
 *
 * Le site est servi en français, anglais, espagnol et arabe. Il n’y a ni
 * bibliothèque d’internationalisation, ni détection côté serveur, ni route
 * dynamique de langue : chaque page de chaque langue est un fichier de route
 * distinct, prégénéré à la construction. Le projet doit rester exportable en
 * statique, et `npm run verify:export` le vérifie.
 *
 * ---------------------------------------------------------------------------
 * CE QUI REND L’OUBLI D’UNE LANGUE IMPOSSIBLE
 * ---------------------------------------------------------------------------
 *
 * Une chaîne traduisible n’est pas une `string`, c’est un `Translated` :
 *
 *     export type Translated = Readonly<Record<Locale, string>>;
 *
 * `Record<Locale, string>` exige les quatre clés. Une traduction manquante
 * n’est pas un texte vide affiché en production, c’est une erreur de
 * compilation — le contrôle de types de `npm run build` la refuse.
 *
 * ---------------------------------------------------------------------------
 * LE FRANÇAIS N’A PAS DE PRÉFIXE
 * ---------------------------------------------------------------------------
 *
 * `/`, `/a-propos`, `/realisations/jtr` restent ce qu’elles étaient : les
 * liens déjà partagés ne doivent pas se casser. Les trois autres langues
 * vivent sous `/en`, `/es` et `/ar`, avec des segments TRADUITS — `/en/about`
 * plutôt que `/en/a-propos`. Un segment français sous préfixe anglais
 * n’aiderait ni le lecteur ni le référencement.
 *
 * L’arabe fait exception et garde des segments latins translittérés :
 * `/ar/about`. Un segment en écriture arabe serait encodé en pourcents dans
 * toute URL partagée, illisible partout où le lien se copie.
 * ---------------------------------------------------------------------------
 */

export const LOCALES = ['fr', 'en', 'es', 'ar'] as const;

export type Locale = (typeof LOCALES)[number];

/** Langue par défaut : celle qui occupe la racine, sans préfixe. */
export const DEFAULT_LOCALE: Locale = 'fr';

/**
 * Une chaîne dans ses quatre langues.
 *
 * C’est LE type du contenu traduisible. Il n’existe pas de variante partielle :
 * `Record<Locale, string>` exige les quatre clés, et le compilateur refuse
 * tout objet qui en omet une.
 */
export type Translated = Readonly<Record<Locale, string>>;

/**
 * Une valeur DELIBEREMENT identique dans les quatre langues.
 *
 * Un nom propre ne se traduit pas — MAROUAN Hazim-Rayan, Egis, Kotlin,
 * Guyancourt, TOEIC 870. Recopier quatre fois la meme chaine a la main
 * ressemblerait a un oubli ; cette fonction dit que c’en est l’inverse, tout
 * en conservant la garantie de type : la valeur porte bien ses quatre langues.
 */
export function invariant(value: string): Translated {
  return { fr: value, en: value, es: value, ar: value };
}

/** Un tableau de chaînes dans ses quatre langues — paragraphes, listes. */
export type TranslatedList = Readonly<Record<Locale, readonly string[]>>;

/** Sens d’écriture. L’arabe est la seule langue de droite à gauche ici. */
export type Direction = 'ltr' | 'rtl';

export interface LocaleMeta {
  /** Valeur de l’attribut `lang` du document. */
  readonly htmlLang: string;
  readonly direction: Direction;
  /**
   * Nom de la langue DANS CETTE LANGUE.
   *
   * « Français », pas « French ». Un lecteur qui cherche sa langue dans une
   * liste la reconnaît sous son propre nom, pas sous celui que lui donne une
   * langue qu’il ne lit pas.
   */
  readonly nativeName: string;
  /** Code court affiché dans le sélecteur, en majuscules. */
  readonly shortLabel: string;
  /**
   * Marque décimale de la langue.
   *
   * L’anglais sépare par un point, le français et l’espagnol par une virgule.
   * L’arabe dispose d’une marque propre — ٫, U+066B — mais elle accompagne les
   * chiffres arabo-indiens ; le site a tranché pour les chiffres occidentaux,
   * et c’est donc la virgule qui va avec, comme dans l’usage maghrébin.
   *
   * Cette valeur ne remplace pas `Intl.NumberFormat`, qui n’est pas employé
   * ici : le seul nombre décimal du site est un poids de fichier à une
   * décimale. Une table de quatre entrées suffit, et elle est lisible.
   */
  readonly decimalSeparator: string;
}

export const LOCALE_META: Readonly<Record<Locale, LocaleMeta>> = {
  fr: {
    htmlLang: 'fr',
    direction: 'ltr',
    nativeName: 'Français',
    shortLabel: 'FR',
    decimalSeparator: ',',
  },
  en: {
    htmlLang: 'en',
    direction: 'ltr',
    nativeName: 'English',
    shortLabel: 'EN',
    decimalSeparator: '.',
  },
  es: {
    htmlLang: 'es',
    direction: 'ltr',
    nativeName: 'Español',
    shortLabel: 'ES',
    decimalSeparator: ',',
  },
  ar: {
    htmlLang: 'ar',
    direction: 'rtl',
    nativeName: 'العربية',
    shortLabel: 'AR',
    decimalSeparator: ',',
  },
};

/**
 * Codes de langue au format Open Graph, pour `og:locale`.
 * L’arabe n’est pas régionalisé : le contenu est en arabe standard moderne,
 * qu’aucun pays ne revendique en propre.
 */
export const OG_LOCALE: Readonly<Record<Locale, string>> = {
  fr: 'fr_FR',
  en: 'en_US',
  es: 'es_ES',
  ar: 'ar_AR',
};

/* ---------------------------------------------------------------------------
   TABLE DES ROUTES
   ---------------------------------------------------------------------------
   Une seule source pour les URL du site. Les liens de navigation, les liens
   alternatifs, les canoniques et le sitemap en sont tous dérivés : une route
   ne peut pas être juste ici et fausse ailleurs.
   --------------------------------------------------------------------------- */

/** Les cinq gabarits de page du site. */
export type PageKey = 'home' | 'about' | 'career' | 'projects' | 'project';

/**
 * Segment d’URL par page et par langue. Chaîne vide pour l’accueil, qui n’a
 * pas de segment propre.
 */
const ROUTE_SEGMENTS: Readonly<Record<PageKey, Translated>> = {
  home: { fr: '', en: '', es: '', ar: '' },
  about: { fr: 'a-propos', en: 'about', es: 'acerca-de', ar: 'about' },
  career: { fr: 'parcours', en: 'career', es: 'trayectoria', ar: 'career' },
  projects: { fr: 'realisations', en: 'projects', es: 'proyectos', ar: 'projects' },
  project: { fr: 'realisations', en: 'projects', es: 'proyectos', ar: 'projects' },
};

/**
 * Chemin d’une page, dans une langue.
 *
 * Le français n’a pas de préfixe ; les autres langues en portent un. Les
 * identifiants de réalisation, eux, ne se traduisent PAS : `jtr` ou `archilog`
 * sont des noms propres, et changer l’identifiant d’une ressource selon la
 * langue casserait l’équivalence entre les versions.
 */
export function pathFor(page: PageKey, locale: Locale, slug?: string): Route {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const segment = ROUTE_SEGMENTS[page][locale];
  const tail = slug === undefined ? '' : `/${slug}`;
  const path = `${prefix}${segment === '' ? '' : `/${segment}`}${tail}`;
  // `typedRoutes` verifie les `href` contre l’union des routes existantes.
  // Les chemins sont composes a partir de la table ci-dessus, qui EST la
  // source de ces routes : l’assertion dit au compilateur ce que la table
  // garantit deja.
  return (path === '' ? '/' : path) as Route;
}

/** Ancre de la section Contact, qui vit sur l’accueil de chaque langue. */
export function contactHrefFor(locale: Locale): Route {
  return `${pathFor('home', locale)}#contact` as Route;
}

/**
 * Les quatre équivalents d’une page, pour les liens alternatifs.
 * Clé `x-default` comprise : elle désigne la version servie à un visiteur dont
 * la langue n’est pas couverte, et c’est le français.
 */
export function alternatesFor(
  page: PageKey,
  slug?: string,
): Readonly<Record<string, string>> {
  const entries: Record<string, string> = {};
  for (const locale of LOCALES) {
    entries[LOCALE_META[locale].htmlLang] = pathFor(page, locale, slug);
  }
  entries['x-default'] = pathFor(page, DEFAULT_LOCALE, slug);
  return entries;
}

/* ---------------------------------------------------------------------------
   PERSISTANCE DU CHOIX DE LANGUE
   ---------------------------------------------------------------------------
   Même mécanique que le mode clair / sombre : un attribut sur <html>, une clé
   de stockage, et un script d’amorçage synchrone. Voir src/lib/theme.ts.

   DIFFÉRENCE ESSENTIELLE avec le mode : la langue est une ROUTE, pas un
   attribut d’affichage. Le script d’amorçage ne réécrit donc RIEN — il se
   contente de mémoriser la langue de la page visitée. Rediriger d’autorité
   depuis un script priverait le visiteur de la page qu’il a demandée et
   servirait au robot d’indexation un contenu qui n’est pas celui de l’URL.
   --------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
   IL N'Y A PLUS DE REDIRECTION DE LANGUE, ET C'EST LA CORRECTION.
   ---------------------------------------------------------------------------
   Un script d'amorcage vivait ici. Il memorisait la langue de chaque page
   visitee, et, sur la racine nue, renvoyait vers la langue memorisee.

   IL RENDAIT LE FRANCAIS INATTEIGNABLE. Le francais est la seule langue sans
   prefixe : sa racine est `/`, c'est-a-dire exactement l'adresse que le script
   traitait comme une arrivee sans intention. Apres une visite en arabe, cliquer
   « Francais » menait a `/`, ou le script lisait « arabe » et repartait vers
   `/ar`. Le lien ne pouvait pas aboutir. L'anglais et l'espagnol, eux,
   fonctionnaient — leur racine porte un prefixe, que le script laissait passer.

   LA DISTINCTION N'EST PAS RATTRAPABLE SUR UN SITE STATIQUE. Pour ne rediriger
   que les arrivees sans intention, le script devrait savoir si le visiteur a
   DEMANDE `/` ou s'il y a simplement atterri. Aucun signal disponible dans le
   document ne repond a cette question :

     - `location` est identique dans les deux cas — c'est tout le probleme ;
     - `document.referrer` est vide depuis un signet comme depuis un lien
       externe, et il est couramment ampute par une politique de referent ;
     - le type de navigation (`performance`) distingue rechargement, retour
       arriere et navigation, jamais une intention de langue ;
     - un drapeau de session dirait « ce n'est pas la premiere page de cet
       onglet », ce qui est une autre question : ouvrir `/` deliberement dans
       un nouvel onglet redeviendrait indiscernable d'une arrivee subie.

   Restait a marquer les liens du selecteur — `/?hl=fr`, `/#fr`. Cela
   fonctionnerait, au prix d'une verrue dans la barre d'adresse a chaque
   changement de langue, et d'une adresse partageable differente de l'adresse
   canonique.

   LE CHOIX EST DONC FAIT : plus de redirection. Une redirection qui empeche
   d'atteindre une page coute plus cher que le confort qu'elle rendait, lequel
   ne jouait que sur une seule adresse.

   Le stockage part avec elle : rien d'autre ne le lisait, et une preference
   que personne ne consulte n'est pas une preference, c'est du code mort.

   CE QUI RESTE. Les quatre langues sont atteignables par leur adresse, le
   selecteur mene toujours ou il dit, et le document ne porte plus qu'un seul
   script d'amorcage — celui du theme, qui, lui, ne navigue pas.
   --------------------------------------------------------------------------- */
