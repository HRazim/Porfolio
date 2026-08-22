/**
 * ---------------------------------------------------------------------------
 * BANC D'ESSAI NAVIGATEUR — CONSTRUIRE, SERVIR, OUVRIR, VERIFIER
 * ---------------------------------------------------------------------------
 *
 * POURQUOI CE FICHIER EXISTE. Depuis l'origine de ce projet, aucune page
 * n'avait ete observee dans un navigateur : tous les controles portaient sur
 * le HTML produit, la feuille de style compilee et des modeles de composition.
 * Un modele ne voit pas ce qu'un moteur de rendu peint. Deux erreurs de
 * contraste et un lien redondant ont traverse tous ces controles.
 *
 * CE QU'IL FAIT. Il construit le site en EXPORT STATIQUE — donc exactement les
 * fichiers qu'un hebergeur servirait —, les sert sur un port ephemere, ouvre
 * un navigateur sans interface, et passe la main a une fonction de
 * verification. Il rend ensuite la main proprement : le navigateur est ferme
 * et le port libere, que la verification reussisse, echoue ou leve.
 *
 * POURQUOI L'EXPORT STATIQUE ET NON `next start`. Le contrat du projet est que
 * le site reste servable en fichiers plats (regle 6 de CLAUDE.md). Auditer ce
 * qu'un serveur Next rendrait laisserait un ecart possible entre ce qui est
 * verifie et ce qui est publie. Ici, il n'y en a aucun.
 *
 * DEPENDANCE DE DEVELOPPEMENT UNIQUEMENT. `playwright` n'est jamais importe
 * par `src/`, et rien de ce fichier n'entre dans le paquet servi : `scripts/`
 * est hors du perimetre de compilation de Next.
 * ---------------------------------------------------------------------------
 */
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join, extname, relative, sep } from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'out');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

/** Les trois documents qui ne sont pas des pages du site. */
const NOT_PAGES = new Set(['404.html', '_not-found.html', 'styleguide.html']);

/** Construit le site en export statique. Le code de sortie est celui de Next. */
export function buildStaticSite() {
  const next = join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');
  const build = spawnSync(process.execPath, [next, 'build'], {
    cwd: ROOT,
    env: { ...process.env, STATIC_EXPORT: '1' },
    stdio: 'inherit',
  });
  if (build.status !== 0) {
    throw new Error('la construction en export statique a echoue');
  }
}

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

/**
 * Enumere les pages du site depuis `out/`, plutot que de les ecrire a la main.
 * Une liste ecrite a la main se desynchronise en silence : la page ajoutee
 * hier ne serait auditee par personne.
 */
export async function listPages() {
  const files = (await walk(OUT_DIR)).sort();
  return files.map((file) => {
    const rel = relative(OUT_DIR, file).split(sep).join('/');
    const route = rel === 'index.html' ? '/' : `/${rel.replace(/\.html$/, '')}`;
    const locale = /^(en|es|ar)(\/|\.html$)/.test(rel) ? rel.slice(0, 2) : 'fr';
    return {
      file: rel,
      route,
      locale,
      isContent: !NOT_PAGES.has(rel),
    };
  });
}

/** Sert `out/` sur un port ephemere de la boucle locale. */
async function serveOut() {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    const path = decodeURIComponent(url.pathname);
    const candidates =
      path.endsWith('/')
        ? [join(OUT_DIR, path, 'index.html')]
        : [join(OUT_DIR, path), join(OUT_DIR, `${path}.html`), join(OUT_DIR, path, 'index.html')];

    (async () => {
      for (const candidate of candidates) {
        // Le chemin demande ne doit jamais sortir de `out/`.
        if (!candidate.startsWith(OUT_DIR)) break;
        try {
          const info = await stat(candidate);
          if (!info.isFile()) continue;
          response.writeHead(200, {
            'content-type': MIME[extname(candidate)] ?? 'application/octet-stream',
            'cache-control': 'no-store',
          });
          createReadStream(candidate).pipe(response);
          return;
        } catch {
          // Candidat suivant.
        }
      }
      response.writeHead(404, { 'content-type': MIME['.html'] });
      createReadStream(join(OUT_DIR, '404.html')).pipe(response);
    })();
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();
  return {
    origin: `http://127.0.0.1:${port}`,
    async close() {
      await new Promise((resolve) => {
        server.closeAllConnections?.();
        server.close(() => resolve());
      });
    },
  };
}

/**
 * Construit, sert, ouvre un navigateur, et passe la main.
 *
 * LE NETTOYAGE EST INCONDITIONNEL. Le `finally` ferme le navigateur puis le
 * serveur, et les signaux d'interruption font de meme : un port laisse ouvert
 * par un echec rendrait la verification suivante impossible a lancer.
 *
 * @param {(context: {
 *   browser: import('playwright').Browser,
 *   origin: string,
 *   pages: Array<{ file: string, route: string, locale: string, isContent: boolean }>,
 * }) => Promise<number | void>} run
 * @param {{ build?: boolean }} options
 */
export async function withSite(run, { build = true } = {}) {
  if (build) buildStaticSite();

  const server = await serveOut();
  let browser = null;
  const shutdown = async () => {
    if (browser !== null) await browser.close().catch(() => {});
    await server.close();
  };
  const onSignal = () => {
    shutdown().finally(() => process.exit(130));
  };
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  try {
    browser = await chromium.launch();
    const pages = await listPages();
    return await run({ browser, origin: server.origin, pages });
  } finally {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
    await shutdown();
  }
}
