#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * CAPTURES DE REFERENCE
 * ---------------------------------------------------------------------------
 *
 *     npm run capture:screens
 *
 * Une capture de chaque page, dans les quatre langues, en clair et en sombre,
 * a trois largeurs — dont celle d'un telephone. Elles servent de reference
 * VISUELLE : ce que ni le HTML produit ni la feuille de style ne montrent.
 *
 * CE SONT DES ARTEFACTS, PAS DU CONTENU. Elles vont dans `captures/`, ignore
 * par Git : les versionner ferait grossir le depot d'un poids qui se
 * regenere en une commande.
 *
 * Chaque capture est ANALYSEE en meme temps qu'elle est prise, sur ses pixels :
 *
 *   - debordement horizontal : le document est-il plus large que la fenetre ;
 *   - element coupe : une boite sort-elle du document ;
 *   - chevauchement : deux blocs de texte se recouvrent-ils ;
 *   - zone vide inattendue : une bande uniforme de plus de 480 px de haut.
 *
 * Options :
 *   --no-build       reutilise le `out/` existant
 *   --pages <motif>  ne capture que les routes contenant ce motif
 * ---------------------------------------------------------------------------
 */
import { mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { withSite } from './browser-harness.mjs';
import { decodePng } from './lib/png.mjs';
import { probePage } from './lib/a11y-probe.mjs';

const ARGS = process.argv.slice(2);
const NO_BUILD = ARGS.includes('--no-build');
const FILTER = ARGS.includes('--pages') ? ARGS[ARGS.indexOf('--pages') + 1] : null;

const DIR = join(process.cwd(), 'captures');
const WIDTHS = [
  { name: 'telephone', width: 390, height: 844 },
  { name: 'tablette', width: 834, height: 1112 },
  { name: 'bureau', width: 1440, height: 900 },
];
const MODES = ['light', 'dark'];

/** Une bande uniforme trop haute trahit un bloc vide ou un contenu manquant. */
function emptyBands(image, minHeight) {
  const rowColour = (y) => {
    const first = (y * image.width) * 4;
    const r = image.data[first];
    const g = image.data[first + 1];
    const b = image.data[first + 2];
    for (let x = 1; x < image.width; x += 1) {
      const i = (y * image.width + x) * 4;
      if (image.data[i] !== r || image.data[i + 1] !== g || image.data[i + 2] !== b) return null;
    }
    return `${r},${g},${b}`;
  };
  const bands = [];
  let start = null;
  let colour = null;
  for (let y = 0; y < image.height; y += 1) {
    const c = rowColour(y);
    if (c !== null && c === colour) continue;
    if (start !== null && colour !== null && y - start >= minHeight) {
      bands.push({ from: start, to: y, height: y - start, colour });
    }
    start = c === null ? null : y;
    colour = c;
  }
  if (start !== null && colour !== null && image.height - start >= minHeight) {
    bands.push({ from: start, to: image.height, height: image.height - start, colour });
  }
  return bands;
}

/** Deux blocs de texte qui se recouvrent : ni l'un ni l'autre n'est lisible. */
function overlaps(texts) {
  const found = [];
  for (let i = 0; i < texts.length; i += 1) {
    for (let j = i + 1; j < texts.length; j += 1) {
      const a = texts[i].rect;
      const b = texts[j].rect;
      const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (w <= 2 || h <= 2) continue;
      const area = w * h;
      const smaller = Math.min(a.w * a.h, b.w * b.h);
      // Un parent contient son enfant : ce n'est pas un chevauchement.
      if (area >= smaller * 0.98) continue;
      if (area > smaller * 0.25) {
        found.push(`${texts[i].path} × ${texts[j].path}`);
      }
    }
  }
  return found;
}

const code = await withSite(
  async ({ browser, origin, pages }) => {
    mkdirSync(DIR, { recursive: true });
    const targets = pages
      .filter((p) => p.isContent)
      .filter((p) => FILTER === null || p.route.includes(FILTER));

    const rows = [];
    const anomalies = [];

    for (const page of targets) {
      for (const mode of MODES) {
        for (const size of WIDTHS) {
          const context = await browser.newContext({
            colorScheme: mode,
            viewport: { width: size.width, height: size.height },
            deviceScaleFactor: 1,
            reducedMotion: 'no-preference',
          });
          const tab = await context.newPage();
          await tab.goto(`${origin}${page.route}`, { waitUntil: 'networkidle' });
          await tab
            .evaluate(
              () =>
                new Promise((resolve) => {
                  Promise.race([
                    Promise.all(
                      document.getAnimations().map((a) => a.finished.catch(() => undefined)),
                    ),
                    new Promise((r) => setTimeout(r, 1500)),
                  ]).then(() => requestAnimationFrame(() => resolve()));
                }),
            )
            .catch(() => undefined);

          const probe = await tab.evaluate(probePage);
          const shot = await tab.screenshot({ fullPage: true, type: 'png', animations: 'disabled' });
          const slug = page.route === '/' ? 'accueil' : page.route.slice(1).replace(/\//g, '-');
          const name = `${slug}--${mode}--${size.name}.png`;
          writeFileSync(join(DIR, name), shot);
          const image = decodePng(shot);

          const problems = [];
          if (probe.meta.scrollWidth > probe.meta.clientWidth + 1) {
            problems.push(
              `débordement horizontal : ${probe.meta.scrollWidth} px pour ${probe.meta.clientWidth} px`,
            );
          }
          for (const text of probe.texts) {
            if (text.rect.x < -1 || text.rect.x + text.rect.w > probe.meta.scrollWidth + 1) {
              problems.push(`élément coupé : ${text.path}`);
              break;
            }
          }
          for (const pair of overlaps(probe.texts).slice(0, 2)) {
            problems.push(`chevauchement : ${pair}`);
          }
          for (const band of emptyBands(image, 480)) {
            problems.push(`zone vide de ${band.height} px (y ${band.from}→${band.to})`);
          }

          rows.push({
            name,
            width: image.width,
            height: image.height,
            bytes: statSync(join(DIR, name)).size,
            problems,
          });
          if (problems.length > 0) anomalies.push({ name, problems });

          await context.close();
        }
      }
    }

    process.stdout.write('=== CAPTURES DE RÉFÉRENCE ===\n');
    process.stdout.write(`  dossier : captures/  (ignoré par Git)\n`);
    process.stdout.write(
      `  ${targets.length} pages × ${MODES.length} modes × ${WIDTHS.length} largeurs = ${rows.length} captures\n\n`,
    );
    process.stdout.write(`  ${'fichier'.padEnd(46)}${'dimensions'.padEnd(14)}poids\n`);
    for (const row of rows) {
      process.stdout.write(
        `  ${row.name.padEnd(46)}${`${row.width}×${row.height}`.padEnd(14)}` +
          `${(row.bytes / 1024).toFixed(0)} Kio\n`,
      );
    }
    const total = rows.reduce((n, r) => n + r.bytes, 0);
    process.stdout.write(
      `\n  total : ${rows.length} fichiers, ${(total / 1024 / 1024).toFixed(1)} Mio\n`,
    );
    process.stdout.write(
      `  hauteur : de ${Math.min(...rows.map((r) => r.height))} à ` +
        `${Math.max(...rows.map((r) => r.height))} px\n`,
    );

    process.stdout.write('\n=== ANOMALIES DE RENDU ===\n');
    if (anomalies.length === 0) {
      process.stdout.write('  AUCUNE : aucun débordement, aucun chevauchement, aucune zone vide\n');
    } else {
      for (const anomaly of anomalies) {
        process.stdout.write(`  ${anomaly.name}\n`);
        for (const problem of anomaly.problems) process.stdout.write(`      ! ${problem}\n`);
      }
    }
    return 0;
  },
  { build: !NO_BUILD },
);

process.exit(code);
