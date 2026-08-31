#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * VERIFICATION DES LIENS DE REALISATION — LE SERVICE ANNONCE, PAS LE LIBELLE
 * ---------------------------------------------------------------------------
 *
 *     npm run verify:links
 *
 * POURQUOI CE CONTROLE EXISTE. Deux liens de la realisation JTR ont pointe
 * pendant des mois vers des comptes qui n'etaient pas les bons. Rien ne
 * pouvait le voir :
 *
 *   - `verify:map` ne regarde que les liens de LIEU, et par construction
 *     ecarte tout ce qui ne vise pas le service de cartographie ;
 *   - le controle des liens internes ecarte par construction toute cible qui
 *     ne commence pas par `/` : les liens sortants ne sont jamais examines ;
 *   - `verify:a11y` juge le nom accessible, le contraste et la taille de
 *     cible. Un nom parfait sur une adresse fausse passe sans un mot ;
 *   - le compilateur garantit qu'une chaine EST une chaine. Il ne sait pas
 *     qu'un lien intitule « JTR sur TikTok » doit mener chez TikTok.
 *
 * Une erreur d'identifiant de compte reste invisible a la lecture — c'est
 * exactement ce qui s'est produit. Ce controle ne la verrait pas davantage.
 * Ce qu'il voit, en revanche, c'est un lien qui a change de SERVICE.
 *
 * ---------------------------------------------------------------------------
 * CE QU'IL COUVRE
 * ---------------------------------------------------------------------------
 *
 *   1. le libelle nomme un service connu -> l'adresse vise le domaine de ce
 *      service, et pas un autre ;
 *   2. l'adresse est en `https` ;
 *   3. l'adresse porte un chemin : la racine nue d'un service n'est jamais
 *      ce qu'un libelle annonce ;
 *   4. aucun parametre de suivi (`utm_*`, `fbclid`, `igshid`, `ref`…) ;
 *   5. les quatre langues portent EXACTEMENT la meme adresse pour un meme
 *      libelle — une URL ne se traduit pas ;
 *   6. chaque lien sortant ouvre dans un nouvel onglet avec `rel="noopener
 *      noreferrer"` et une indication accessible de ce changement de contexte.
 *
 * ---------------------------------------------------------------------------
 * CE QU'IL NE COUVRE PAS, ET IL FAUT LE DIRE
 * ---------------------------------------------------------------------------
 *
 *   - IL NE SUIT AUCUN LIEN. Aucune requete reseau n'est emise. Il ne peut
 *     donc pas dire qu'un compte existe, qu'il est actif, qu'il n'a pas ete
 *     renomme, ni qu'une page ne rend pas 404 ;
 *   - IL NE VALIDE PAS UN IDENTIFIANT DE COMPTE. « instagram.com/jtr_app »
 *     et « instagram.com/quelquun_dautre » lui sont egalement acceptables :
 *     seul le domaine est verifiable sans reseau. C'est precisement la faute
 *     d'origine, et elle resterait invisible ici ;
 *   - IL NE JUGE PAS LA COHERENCE ENTRE COMPTES. Que les quatre reseaux de
 *     JTR emploient trois identifiants differents n'est pas une faute qu'un
 *     programme puisse trancher ;
 *   - IL NE LIT QUE LES PAGES DE REALISATION. Les liens de l'en-tete et du
 *     pied de page y sont donc couverts, puisqu'ils apparaissent sur ces
 *     pages — 48 des 76 liens examines sont ces deux profils, repetes sur
 *     les vingt-quatre fiches. Mais les liens propres a l'accueil, au
 *     parcours ou a la page « a propos » ne sont pas vus.
 *
 * Sortie non nulle des la premiere faute.
 *
 * Options :
 *   --no-build   reutilise le `out/` existant
 * ---------------------------------------------------------------------------
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'out');
const NO_BUILD = process.argv.includes('--no-build');

/**
 * Services nommes dans un libelle, et le domaine qu'ils imposent.
 *
 * La cle est cherchee dans le libelle, sans egard a la casse. La valeur est
 * la liste des hotes acceptables : `x.com` accepte encore `twitter.com`, le
 * renommage n'ayant pas invalide les anciennes adresses.
 */
const SERVICES = [
  { nom: 'Google Play', hotes: ['play.google.com'] },
  { nom: 'Instagram', hotes: ['instagram.com', 'www.instagram.com'] },
  { nom: 'TikTok', hotes: ['tiktok.com', 'www.tiktok.com'] },
  { nom: 'Reddit', hotes: ['reddit.com', 'www.reddit.com'] },
  { nom: 'GitHub', hotes: ['github.com', 'www.github.com'] },
  // « X » est un mot d'une lettre : on ne le cherche pas dans le libelle,
  // il produirait un faux positif sur le moindre mot qui le contient. Le
  // libelle arabe « JTR على X » et le francais « JTR sur X » sont couverts
  // par la regle 5, qui exige la meme adresse dans les quatre langues.
];

/** Parametres de suivi refuses. */
const SUIVI = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'igshid', 'ref', 'ref_src', 'referrer',
  'mc_cid', 'mc_eid', 'msclkid', 'campaignid',
]);

/** Les quatre segments de realisation, un par langue. */
const SEGMENTS = { fr: 'realisations', en: join('en', 'projects'), es: join('es', 'proyectos'), ar: join('ar', 'projects') };

function build() {
  const next = join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');
  const result = spawnSync(process.execPath, [next, 'build'], {
    cwd: ROOT,
    env: { ...process.env, STATIC_EXPORT: '1' },
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    console.error('\nÉCHEC : la construction en export statique a échoué.');
    process.exit(result.status ?? 1);
  }
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

/** Texte lisible d'un fragment de balisage, mentions d'ecran-lecteur exclues. */
const texte = (s) =>
  decode(s.replace(/<span class="sr-only">[\s\S]*?<\/span>/g, '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

/** Fiches de realisation d'une langue : les fichiers du segment, sauf l'index. */
function fiches(segment) {
  const dossier = join(OUT, segment);
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier)
    .filter((f) => f.endsWith('.html'))
    .map((f) => join(dossier, f))
    .filter((p) => statSync(p).isFile());
}

/** Liens sortants d'une fiche : adresse, libelle, attributs. */
function liensDe(chemin) {
  const html = readFileSync(chemin, 'utf8').split('</head>')[1] ?? '';
  const out = [];
  for (const m of html.matchAll(/<a\b([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attributs = `${m[1]} ${m[3]}`;
    const href = decode(m[2]);
    // Les liens de lieu ont leur propre controle : `npm run verify:map`.
    if (new URL(href).hostname === 'www.google.com' && href.includes('/maps/')) continue;
    out.push({
      href,
      libelle: texte(m[4]),
      rel: /rel="([^"]*)"/.exec(attributs)?.[1] ?? '',
      cible: /target="([^"]*)"/.exec(attributs)?.[1] ?? '',
      indication: /<span class="sr-only">[\s\S]*?<\/span>/.test(m[4]),
    });
  }
  return out;
}

if (!NO_BUILD) build();
if (!existsSync(OUT)) {
  console.error('ÉCHEC : aucun export à vérifier. Relancez sans --no-build.');
  process.exit(1);
}

const fautes = [];
/** Par libelle francais de reference, l'adresse vue dans chaque langue. */
const parFiche = new Map();
let examines = 0;

for (const [locale, segment] of Object.entries(SEGMENTS)) {
  for (const chemin of fiches(segment)) {
    const nom = relative(OUT, chemin).split(sep).join('/');
    const slug = nom.replace(/\.html$/, '').split('/').pop();
    for (const lien of liensDe(chemin)) {
      examines += 1;
      const url = new URL(lien.href);

      // 2. protocole
      if (url.protocol !== 'https:') {
        fautes.push(`${nom} : « ${lien.libelle} » n'est pas en https — ${lien.href}`);
      }

      // 3. chemin
      if (url.pathname.replace(/\/+$/, '') === '') {
        fautes.push(`${nom} : « ${lien.libelle} » vise la racine nue de ${url.hostname}`);
      }

      // 4. parametres de suivi
      for (const [cle] of url.searchParams) {
        if (SUIVI.has(cle.toLowerCase())) {
          fautes.push(`${nom} : « ${lien.libelle} » porte le paramètre de suivi « ${cle} »`);
        }
      }

      // 1. le service nomme impose son domaine
      for (const service of SERVICES) {
        if (!lien.libelle.toLowerCase().includes(service.nom.toLowerCase())) continue;
        if (!service.hotes.includes(url.hostname)) {
          fautes.push(
            `${nom} : « ${lien.libelle} » annonce ${service.nom} mais mène à ${url.hostname}`,
          );
        }
      }

      // 6. attributs de securite et indication accessible
      if (lien.cible !== '_blank') {
        fautes.push(`${nom} : « ${lien.libelle} » n'ouvre pas dans un nouvel onglet`);
      }
      for (const jeton of ['noopener', 'noreferrer']) {
        if (!lien.rel.split(/\s+/).includes(jeton)) {
          fautes.push(`${nom} : « ${lien.libelle} » n'a pas rel="${jeton}"`);
        }
      }
      if (!lien.indication) {
        fautes.push(`${nom} : « ${lien.libelle} » n'annonce pas le changement de contexte`);
      }

      // 5. une adresse ne se traduit pas : on indexe par fiche et par rang
      const cle = `${slug}`;
      if (!parFiche.has(cle)) parFiche.set(cle, new Map());
      const parLangue = parFiche.get(cle);
      if (!parLangue.has(locale)) parLangue.set(locale, []);
      parLangue.get(locale).push(lien.href);
    }
  }
}

// 5. comparaison des quatre langues, fiche par fiche
for (const [slug, parLangue] of parFiche) {
  const langues = [...parLangue.keys()];
  if (langues.length < 2) continue;
  const reference = parLangue.get(langues[0]);
  for (const locale of langues.slice(1)) {
    const autre = parLangue.get(locale);
    if (autre.length !== reference.length) {
      fautes.push(
        `${slug} : ${langues[0]} porte ${reference.length} lien(s) sortant(s), ${locale} en porte ${autre.length}`,
      );
      continue;
    }
    for (let i = 0; i < reference.length; i += 1) {
      if (reference[i] !== autre[i]) {
        fautes.push(
          `${slug} : le lien ${i + 1} diffère entre ${langues[0]} et ${locale} — ${reference[i]} contre ${autre[i]}`,
        );
      }
    }
  }
}

console.log('\n=== DESTINATION DES LIENS DE RÉALISATION ===');
console.log(`  fiches examinées         : ${parFiche.size} × 4 langues`);
console.log(`  liens sortants vérifiés  : ${examines}`);
console.log(`  services reconnus        : ${SERVICES.map((s) => s.nom).join(', ')}`);
console.log('');
console.log('  Ce contrôle ne suit aucun lien : il ne peut pas dire qu’un compte');
console.log('  existe, ni qu’un identifiant est le bon. Il dit qu’un lien annonçant');
console.log('  un service mène bien au domaine de ce service.');
console.log('');

if (fautes.length > 0) {
  for (const faute of fautes) console.error(`  ${faute}`);
  console.error(`\nÉCHEC : ${fautes.length} lien(s) en défaut.`);
  process.exit(1);
}

console.log('SUCCÈS : chaque lien de réalisation mène au service qu’il annonce.');
