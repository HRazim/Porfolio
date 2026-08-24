#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * VERIFICATION DES LIENS DE LIEU — LA DESTINATION, PAS SEULEMENT LE LIEN
 * ---------------------------------------------------------------------------
 *
 *     npm run verify:map
 *
 * POURQUOI CE CONTROLE EXISTE. Un lien qui mene au MAUVAIS endroit est
 * indetectable par tout ce que ce projet verifiait jusqu'ici :
 *
 *   - `liens.py` ne regarde que les liens INTERNES, et ecarte par construction
 *     toute cible qui ne commence pas par `/` : les liens sortants ne sont
 *     jamais examines ;
 *   - `verify:a11y` verifie qu'un lien porte un nom accessible, un contraste,
 *     une taille de cible. Un nom parfait sur une adresse fausse passe ;
 *   - la compilation et les types garantissent qu'une chaine EST une chaine.
 *     Ils ne savent pas qu'« Egis » n'est pas a Trappes ;
 *   - l'audit par navigateur mesure des pixels. Il ne suit aucun lien.
 *
 * Aucun de ces controles ne pouvait voir deux entrees qui menent au meme
 * endroit, ni une requete attribuee a la mauvaise entree. Celui-ci le voit.
 *
 * CE QU'IL VERIFIE, SUR LE HTML GENERE et non sur la source :
 *
 *   1. chaque lien de lieu vise le service de cartographie attendu ;
 *   2. sa requete NOMME l'etablissement de l'entree qui le porte — ou, a
 *      defaut d'etablissement identifiable, se reduit exactement a la localite
 *      affichee ;
 *   3. sa requete contient la localite affichee ;
 *   4. deux entrees d'une meme page ne mènent jamais au meme endroit ;
 *   5. les quatre langues portent EXACTEMENT le meme jeu de destinations —
 *      une requete ne se traduit pas.
 *
 * Sortie non nulle des la premiere faute.
 *
 * Options :
 *   --no-build   reutilise le `out/` existant
 * ---------------------------------------------------------------------------
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'out');
const NO_BUILD = process.argv.includes('--no-build');

/** Hote attendu des liens de lieu. Voir `src/lib/map-url.ts`. */
const MAP_HOST = 'www.google.com';

const PAGES = {
  fr: 'parcours.html',
  en: join('en', 'career.html'),
  es: join('es', 'trayectoria.html'),
  ar: join('ar', 'career.html'),
};

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

/** Texte lisible d'un fragment de balisage. */
const texte = (s) =>
  decode(s.replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Les entrees de parcours d'une page, avec ce que le document en dit.
 *
 * L'etablissement est lu DANS LE DOCUMENT, pas dans les donnees : le controle
 * doit pouvoir contredire la source, sans quoi il ne ferait que la recopier.
 */
function entries(html) {
  const items = [...html.matchAll(
    /<li class="flex flex-col gap-2xs rounded-md[\s\S]*?<\/li>\s*(?=<li class="flex flex-col gap-2xs|<\/ul>)/g,
  )].map((m) => m[0]);

  return items.map((item) => {
    const titre = /<h3[^>]*>([\s\S]*?)<\/h3>/.exec(item);
    const bloc = /<p class="font-mono text-body-sm text-ink-subtle">([\s\S]*?)<\/p>/g;
    // Le premier de ces paragraphes est la periode ; le second, s'il existe,
    // porte l'etablissement et la localite.
    const paragraphes = [...item.matchAll(bloc)].map((m) => m[1]);
    const identite = paragraphes[1] ?? '';
    const lien = /<a href="([^"]*)"[^>]*target="_blank"[\s\S]*?<span dir="ltr">([\s\S]*?)<\/span>/.exec(identite);
    const etablissement = texte(identite.split('<a ')[0]).replace(/[—-]\s*$/, '').trim();
    return {
      titre: texte(titre?.[1] ?? ''),
      etablissement,
      lien:
        lien === null
          ? null
          : { href: decode(lien[1]), localite: texte(lien[2]) },
    };
  });
}

/** La requete portee par une adresse de recherche cartographique. */
function requete(href) {
  const url = new URL(href);
  return url.searchParams.get('query') ?? url.searchParams.get('q') ?? '';
}

/**
 * Premier segment d'un nom d'etablissement : ce qui precede la premiere
 * virgule ou le premier tiret cadratin.
 *
 * « IUT de Vélizy-Villacoublay — UVSQ, Université Paris-Saclay » se ramene a
 * « IUT de Vélizy-Villacoublay », qui est ce qu'une requete cartographique
 * peut raisonnablement nommer. La tutelle universitaire, elle, n'a rien a
 * faire dans une recherche d'adresse.
 */
const noyau = (nom) => nom.split(/\s*[—,]\s*/)[0].trim();

if (!NO_BUILD) build();
if (!existsSync(OUT)) {
  console.error('ÉCHEC : aucun export à vérifier. Relancez sans --no-build.');
  process.exit(1);
}

const fautes = [];
const parLangue = {};
let liens = 0;

for (const [locale, rel] of Object.entries(PAGES)) {
  const html = readFileSync(join(OUT, rel), 'utf8');
  const items = entries(html);
  const vues = new Map();
  parLangue[locale] = [];

  for (const item of items) {
    if (item.lien === null) continue;
    liens += 1;
    const { href, localite } = item.lien;
    const q = requete(href);
    parLangue[locale].push(q);

    let hote = '';
    try {
      hote = new URL(href).host;
    } catch {
      fautes.push(`${locale} · ${item.titre} : adresse illisible — ${href}`);
      continue;
    }
    if (hote !== MAP_HOST) {
      fautes.push(`${locale} · ${item.titre} : service ${hote}, attendu ${MAP_HOST}`);
    }
    if (q === '') {
      fautes.push(`${locale} · ${item.titre} : aucune requête dans l’adresse`);
      continue;
    }
    if (!q.includes(localite)) {
      fautes.push(
        `${locale} · ${item.titre} : la requête « ${q} » ne nomme pas la localité affichée « ${localite} »`,
      );
    }
    const cle = noyau(item.etablissement);
    if (cle !== '' && !q.includes(cle) && q !== localite) {
      fautes.push(
        `${locale} · ${item.titre} : la requête « ${q} » ne nomme ni l’établissement ` +
          `« ${cle} » ni la seule localité « ${localite} »`,
      );
    }
    const deja = vues.get(q);
    if (deja !== undefined) {
      fautes.push(
        `${locale} : « ${deja} » et « ${item.titre} » mènent au MÊME endroit — ${q}`,
      );
    }
    vues.set(q, item.titre);
  }
}

// Les requetes ne se traduisent pas : les quatre langues doivent porter le
// meme jeu, dans le meme ordre.
const reference = JSON.stringify(parLangue.fr);
for (const [locale, list] of Object.entries(parLangue)) {
  if (JSON.stringify(list) !== reference) {
    fautes.push(`${locale} : jeu de destinations différent du français`);
  }
}

process.stdout.write('=== DESTINATION DES LIENS DE LIEU ===\n');
process.stdout.write(`  service attendu          : ${MAP_HOST}\n`);
process.stdout.write(`  pages examinées          : ${Object.keys(PAGES).length}\n`);
process.stdout.write(`  liens de lieu vérifiés   : ${liens}\n`);
process.stdout.write(
  `  destinations par page    : ${parLangue.fr.length}, deux à deux distinctes\n`,
);
for (const q of parLangue.fr) process.stdout.write(`      ${q}\n`);

if (fautes.length > 0) {
  process.stdout.write(`\n  FAUTES : ${fautes.length}\n`);
  for (const faute of fautes) process.stdout.write(`      ✗ ${faute}\n`);
  console.error('\nÉCHEC : au moins un lien de lieu ne mène pas où il devrait.');
  process.exit(1);
}

process.stdout.write('\nSUCCÈS : chaque lien de lieu mène à son propre établissement.\n');
