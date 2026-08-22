#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * AUDIT D'ACCESSIBILITE SUR RENDU REEL
 * ---------------------------------------------------------------------------
 *
 *     npm run verify:a11y
 *
 * CE QUE CE CONTROLE APPORTE, ET QUE LES AUTRES N'APPORTAIENT PAS. Le projet
 * verifiait deja ses contrastes — en calculant les couleurs depuis les jetons.
 * Un tel calcul ne voit que ce qui est ecrit dans la feuille de style. Il ne
 * voit pas :
 *
 *   - un fond compose de plusieurs calques translucides ;
 *   - une opacite posee sur un ancetre, qui delave le texte ET son fond ;
 *   - un degrade ou une image sous le texte ;
 *   - l'etat SURVOLE et l'etat FOCALISE, ou les couleurs changent ;
 *   - un texte pose sur un fond qui n'est pas celui de son parent direct ;
 *   - un contenu qui n'apparait qu'une fois un repli ouvert.
 *
 * Ici, le fond n'est pas deduit : il est LU DANS LA CAPTURE. Une passe rend
 * tous les textes transparents — rien d'autre ne bouge — et la capture montre
 * alors le fond seul. Le pixel sous chaque texte est le fond reel.
 *
 * CINQ ETATS SONT MESURES : repos, replis deplies, survol, focus des elements
 * deja visibles, focus des elements qui n'apparaissent qu'au focus — le lien
 * d'evitement. Ce dernier est mesure a part : force en meme temps que les
 * autres, il se superpose a l'en-tete et fausserait les fonds voisins.
 *
 * Le meme banc releve les liens redondants, les noms accessibles manquants —
 * demandes a Chromium lui-meme par le protocole de deverminage, et non
 * reconstruits —, les cibles trop petites, les images sans alternative et
 * l'ordre de tabulation.
 *
 * Sortie non nulle des qu'une ERREUR subsiste. Les ALERTES n'echouent pas :
 * elles signalent ce qu'un humain doit trancher.
 *
 * Options :
 *   --no-build       reutilise le `out/` existant
 *   --pages <motif>  n'audite que les routes contenant ce motif
 *   --quiet          n'affiche que le bilan
 *   --json <chemin>  ecrit le releve complet, pour comparer avant et apres
 * ---------------------------------------------------------------------------
 */
import { writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { withSite } from './browser-harness.mjs';
import { decodePng, pixelAt } from './lib/png.mjs';
import {
  probePage,
  hideTextSource,
  showTextSource,
  openDisclosures,
} from './lib/a11y-probe.mjs';

const ARGS = process.argv.slice(2);
const NO_BUILD = ARGS.includes('--no-build');
const QUIET = ARGS.includes('--quiet');
const FILTER = ARGS.includes('--pages') ? ARGS[ARGS.indexOf('--pages') + 1] : null;
const JSON_OUT = ARGS.includes('--json') ? ARGS[ARGS.indexOf('--json') + 1] : null;

/** Largeurs auditees. La premiere porte les etats survole et focalise. */
const WIDTHS = [
  { name: 'bureau', width: 1280, height: 900, states: true },
  { name: 'telephone', width: 390, height: 844, states: false },
];
const MODES = ['light', 'dark'];

/** Doit rester identique au selecteur de la sonde : les index sont apparies. */
const FOCUSABLE = 'a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';

/**
 * L'OUTIL DE VERIFICATION N'ENTRE PAS DANS CE QUI EST SERVI.
 *
 * La contrainte se verifie, elle ne se promet pas : `playwright` doit figurer
 * dans les dependances de DEVELOPPEMENT, n'etre importe par aucun fichier de
 * `src/`, et n'apparaitre dans aucun octet de l'export. Le troisieme point est
 * le seul qui prouve vraiment quelque chose : il regarde le resultat, pas
 * l'intention.
 */
function checkNotShipped() {
  const lines = [];
  let clean = true;

  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  const inDev = Object.keys(manifest.devDependencies ?? {}).includes('playwright');
  const inProd = Object.keys(manifest.dependencies ?? {}).includes('playwright');
  clean = clean && inDev && !inProd;
  lines.push(
    `  dépendances de production   : ${Object.keys(manifest.dependencies ?? {}).join(', ')}`,
  );
  lines.push(`  playwright y figure-t-il    : ${inProd ? 'OUI — FAUTE' : 'NON'}`);
  lines.push(`  playwright en développement : ${inDev ? 'oui' : 'NON — FAUTE'}`);

  const TEXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.xml', '.svg', '.ts', '.tsx']);
  const scan = (dir, state) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(full, state);
      } else if (TEXT.has(extname(entry.name))) {
        state.read += 1;
        if (readFileSync(full, 'utf8').includes('playwright')) state.hits.push(full);
      }
    }
    return state;
  };

  const source = scan('src', { read: 0, hits: [] });
  const exported = scan('out', { read: 0, hits: [] });
  clean = clean && source.hits.length === 0 && exported.hits.length === 0;
  lines.push(
    `  src/    : ${source.read} fichiers relus, occurrences de « playwright » : ` +
      `${source.hits.length === 0 ? 'AUCUNE' : source.hits.join(', ')}`,
  );
  lines.push(
    `  out/    : ${exported.read} fichiers relus, occurrences de « playwright » : ` +
      `${exported.hits.length === 0 ? 'AUCUNE' : exported.hits.join(', ')}`,
  );
  return { clean, lines };
}

// --- contraste --------------------------------------------------------------
function channel(value) {
  const s = value / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
function luminance([r, g, b]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
/** Le texte est peint AVEC son alpha et l'opacite heritee, sur le fond reel. */
function composite([r, g, b, a], alpha, background) {
  const k = a * alpha;
  return [
    r * k + background[0] * (1 - k),
    g * k + background[1] * (1 - k),
    b * k + background[2] * (1 - k),
  ];
}
const hex = ([r, g, b]) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/**
 * Lit le fond reel sous un texte, dans la capture ou tous les textes sont
 * transparents. Renvoie la couleur dominante et la pire couleur trouvee : une
 * boite peut chevaucher deux fonds, et l'ecart merite d'etre signale.
 */
function sampleBackground(image, rect, foreground) {
  const inset = 1;
  const x0 = rect.x + inset;
  const y0 = rect.y + inset;
  const x1 = rect.x + rect.w - inset;
  const y1 = rect.y + rect.h - inset;
  if (x1 <= x0 || y1 <= y0) return null;

  // LE FOND SE LIT DANS LA BANDE DES LETTRES, PAS SUR TOUTE LA BOITE. Un
  // soulignement, une bordure ou un liset de focus occupent le bas ou le haut
  // du rectangle sans jamais passer DERRIERE le texte : les inclure faisait
  // conclure a un fond non uni la ou il n'y a qu'une decoration.
  const bandTop = y0 + (y1 - y0) * 0.15;
  const bandBottom = y0 + (y1 - y0) * 0.7;
  const counts = new Map();
  const steps = 5;
  for (let i = 0; i < steps; i += 1) {
    for (let j = 0; j < steps; j += 1) {
      const pixel = pixelAt(
        image,
        x0 + ((x1 - x0) * (i + 0.5)) / steps,
        bandTop + ((bandBottom - bandTop) * (j + 0.5)) / steps,
      );
      if (pixel === null) continue;
      const key = `${pixel[0]},${pixel[1]},${pixel[2]}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  if (counts.size === 0) return null;

  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  const parse = (key) => key.split(',').map(Number);
  const dominant = parse(entries[0][0]);
  let worst = dominant;
  let worstRatio = contrast(foreground, dominant);
  for (const [key, n] of entries) {
    if (n / total < 0.15) continue;
    const colour = parse(key);
    const ratio = contrast(foreground, colour);
    if (ratio < worstRatio) {
      worstRatio = ratio;
      worst = colour;
    }
  }
  return { dominant, worst, uniform: entries.length === 1 };
}

/**
 * Couleur dominante d'un anneau trace a `expand` pixels autour d'une boite.
 * Sert a lire un liseret de focus, qui se peint HORS de l'element.
 *
 * LES POINTS SE SERRENT AU MILIEU DE CHAQUE COTE, ET C'EST NECESSAIRE. Un
 * liseret suit le rayon de bordure de l'element : autour d'un bouton
 * circulaire, il decrit un cercle, et le coin du rectangle englobant ne le
 * rencontre jamais. Un premier jet echantillonnait aux quarts de chaque cote :
 * quatre points sur douze tombaient sur le liseret, huit sur le fond, et
 * l'audit annoncait qu'aucun liseret n'etait peint autour du bouton de theme
 * — alors qu'il l'etait, en accent, a quatre pixels du bord.
 *
 * Le milieu d'un cote appartient a l'anneau quel que soit le rayon.
 */
function sampleRing(image, rect, expand) {
  const counts = new Map();
  const x0 = rect.x - expand;
  const y0 = rect.y - expand;
  const x1 = rect.x + rect.w + expand;
  const y1 = rect.y + rect.h + expand;
  const points = [];
  for (const part of [0.45, 0.5, 0.55]) {
    const fx = x0 + (x1 - x0) * part;
    const fy = y0 + (y1 - y0) * part;
    points.push([fx, y0], [fx, y1], [x0, fy], [x1, fy]);
  }
  for (const [x, y] of points) {
    const pixel = pixelAt(image, x, y);
    if (pixel === null) continue;
    const key = `${pixel[0]},${pixel[1]},${pixel[2]}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return best[0].split(',').map(Number);
}

/**
 * CONTRASTE NON TEXTUEL DU LISERET DE FOCUS (WCAG 1.4.11, niveau AA).
 *
 * Mesure sur pixels, et non sur la regle CSS : le liseret est lu dans la
 * capture prise focus force, le fond adjacent dans celle de l'etat de repos,
 * AUX MEMES COORDONNEES. Ce que l'on compare est donc ce qui apparait a
 * l'ecran quand le focus arrive, contre ce qui s'y trouvait avant lui.
 */
function focusRingIssues(focusables, focusImage, restImage) {
  const issues = [];
  for (const el of focusables) {
    if (!el.painted) continue;
    const ring = el.outline;
    if (ring === undefined || ring.width <= 0 || ring.style === 'none') continue;
    const expand = ring.offset + ring.width / 2;
    const drawn = sampleRing(focusImage, el.rect, expand);
    const behind = sampleRing(restImage, el.rect, expand);
    if (drawn === null || behind === null) continue;
    // Si rien n'a change a cet endroit, aucun liseret n'y est peint.
    const changed =
      Math.abs(drawn[0] - behind[0]) + Math.abs(drawn[1] - behind[1]) + Math.abs(drawn[2] - behind[2]) > 12;
    if (!changed) {
      issues.push({
        level: 'alerte',
        detail:
          `aucun liseret peint : ${hex(drawn)} au focus comme au repos, a ` +
          `${expand.toFixed(1)} px du bord · ${el.path} « ${el.text} »`,
      });
      continue;
    }
    const ratio = contrast(drawn, behind);
    if (ratio < 3) {
      issues.push({
        level: 'erreur',
        detail:
          `${ratio.toFixed(2)}:1 < 3:1 · liseret ${hex(drawn)} sur ${hex(behind)} · ` +
          `${el.path} « ${el.text} »`,
      });
    }
  }
  return issues;
}

// --- protocole de deverminage ----------------------------------------------
async function focusableNodeIds(cdp) {
  const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', {
    nodeId: root.nodeId,
    selector: FOCUSABLE,
  });
  return nodeIds;
}

async function setPseudo(cdp, nodeIds, classes) {
  for (const nodeId of nodeIds) {
    await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: classes });
  }
}

/** Noms accessibles calcules par Chromium — pas reconstruits a la main. */
async function missingNames(cdp) {
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  const ROLES = new Set(['link', 'button', 'textbox', 'combobox', 'checkbox', 'menuitem']);
  const found = [];
  for (const node of nodes) {
    if (node.ignored === true) continue;
    const role = node.role?.value;
    if (!ROLES.has(role)) continue;
    if ((node.name?.value ?? '').trim() !== '') continue;
    let snippet = '(element non resolu)';
    try {
      const html = await cdp.send('DOM.getOuterHTML', { backendNodeId: node.backendDOMNodeId });
      snippet = html.outerHTML.replace(/\s+/g, ' ').slice(0, 110);
    } catch {
      // L'element a disparu du document entre-temps.
    }
    found.push({ role, snippet });
  }
  return found;
}

// --- regles -----------------------------------------------------------------
/**
 * Liens redondants : deux liens QUI SE SUIVENT dans l'ordre de tabulation et
 * menent au meme endroit. Un lecteur d'ecran les annonce l'un apres l'autre,
 * et l'utilisateur les parcourt tous les deux pour aboutir a la meme page.
 */
function redundantLinks(links) {
  const ordered = links.filter((l) => l.inTabOrder && !l.ariaHidden);
  const groups = [];
  let run = [];
  for (const link of ordered) {
    if (run.length > 0 && run[run.length - 1].href === link.href) {
      run.push(link);
      continue;
    }
    if (run.length > 1) groups.push(run);
    run = [link];
  }
  if (run.length > 1) groups.push(run);
  return groups;
}

/**
 * Taille de cible (WCAG 2.2, 2.5.8, niveau AA). Vingt-quatre pixels, SAUF si
 * la cible est un lien pose dans une phrase, ou si l'espace autour d'elle
 * suffit : un disque de 24 px centre sur la cible ne doit alors rencontrer
 * aucune autre cible. C'est l'exception d'espacement, et elle evite de
 * signaler comme defaut une rangee de liens largement espaces.
 */
function targetSizeIssues(focusables) {
  const targets = focusables.filter((f) => f.painted);
  const centre = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
  const issues = [];
  for (const target of targets) {
    if (target.rect.w >= 24 && target.rect.h >= 24) continue;
    if (target.inlineInText) continue;
    const c = centre(target.rect);
    let crowded = false;
    for (const other of targets) {
      if (other === target) continue;
      const o = other.rect;
      const nx = Math.max(o.x, Math.min(c.x, o.x + o.w));
      const ny = Math.max(o.y, Math.min(c.y, o.y + o.h));
      if (Math.hypot(c.x - nx, c.y - ny) < 12) {
        crowded = true;
        break;
      }
    }
    if (crowded) {
      issues.push({
        path: target.path,
        text: target.text,
        size: `${Math.round(target.rect.w)}x${Math.round(target.rect.h)}`,
      });
    }
  }
  return issues;
}

/** Regressions visuelles de l'ordre de tabulation. */
function tabOrderIssues(focusables, dir) {
  const rows = focusables.filter((f) => f.painted);
  const issues = [];
  for (const el of rows) {
    if (el.tabindex !== null && Number(el.tabindex) > 0) {
      issues.push({ kind: 'tabindex positif', path: el.path, detail: `tabindex=${el.tabindex}` });
    }
  }
  for (let i = 1; i < rows.length; i += 1) {
    const previous = rows[i - 1];
    const current = rows[i];
    if (current.rect.y + current.rect.h < previous.rect.y - 4) {
      issues.push({
        kind: 'ordre visuel',
        path: current.path,
        detail: `suit « ${previous.text || previous.path} » mais se trouve au-dessus`,
      });
      continue;
    }
    if (Math.abs(current.rect.y - previous.rect.y) <= 4) {
      const backwards =
        dir === 'rtl'
          ? current.rect.x > previous.rect.x + 4
          : current.rect.x + current.rect.w < previous.rect.x - 4;
      if (backwards) {
        issues.push({
          kind: 'ordre visuel',
          path: current.path,
          detail: `sur la meme ligne que « ${previous.text || previous.path} », mais avant lui`,
        });
      }
    }
  }
  return issues;
}

/**
 * ATTEND QUE TOUT MOUVEMENT SOIT FINI.
 *
 * Indispensable, et decouvert en le manquant : la cascade d'arrivee, le
 * depliement d'un `<details>` et surtout les transitions de couleur declenchees
 * par le survol durent quelques centaines de millisecondes. Mesure sans
 * attendre, la couleur relevee est celle d'un instant intermediaire — un
 * declencheur a rendu 2,30:1 puis 5,45:1 selon la largeur, pour la meme regle
 * CSS. Ce n'etait pas un defaut du site, c'etait un defaut de la mesure.
 *
 * Une course contre la montre protege d'une animation infinie, qui ne finirait
 * jamais.
 */
async function settle(tab) {
  await tab
    .evaluate(
      () =>
        new Promise((resolve) => {
          const done = Promise.all(
            document.getAnimations().map((a) => a.finished.catch(() => undefined)),
          );
          const guard = new Promise((r) => setTimeout(r, 1500));
          Promise.race([done, guard]).then(() => requestAnimationFrame(() => resolve()));
        }),
    )
    .catch(() => undefined);
}

// --- audit d'un rendu -------------------------------------------------------
async function auditRender(browser, origin, page, mode, size) {
  const context = await browser.newContext({
    colorScheme: mode,
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const tab = await context.newPage();
  const findings = [];
  const contrasts = [];
  const add = (level, rule, detail) => findings.push({ level, rule, detail });

  try {
    const response = await tab.goto(`${origin}${page.route}`, { waitUntil: 'networkidle' });
    if (response === null || !response.ok()) {
      add('erreur', 'page', 'document non servi');
      return { findings, contrasts, meta: null };
    }
    await settle(tab);

    const cdp = await context.newCDPSession(tab);
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');
    await cdp.send('Accessibility.enable');

    /** Un releve + la capture du fond seul, dans l'etat courant. */
    const snapshot = async () => {
      const probe = await tab.evaluate(probePage);
      await tab.evaluate(hideTextSource);
      const shot = await tab.screenshot({ fullPage: true, type: 'png', animations: 'disabled' });
      await tab.evaluate(showTextSource);
      return { probe, image: decodePng(shot) };
    };

    const measure = (state, entries, image) => {
      for (const text of entries) {
        const sample = sampleBackground(image, text.rect, [
          text.colour[0],
          text.colour[1],
          text.colour[2],
        ]);
        if (sample === null) continue;
        const front = composite(text.colour, text.opacity, sample.dominant);
        const ratio = contrast(front, sample.dominant);
        const threshold = text.large ? 3 : 4.5;
        contrasts.push({
          state,
          path: text.path,
          text: text.text,
          size: text.size,
          large: text.large,
          foreground: hex(front),
          background: hex(sample.dominant),
          styleBackground: hex(text.styleBackground),
          ratio,
          threshold,
          uniform: sample.uniform,
        });
        if (ratio < threshold) {
          add(
            'erreur',
            'contraste',
            `${state} · ${ratio.toFixed(2)}:1 < ${threshold}:1 · ${hex(front)} sur ` +
              `${hex(sample.dominant)} · ${text.path} · « ${text.text} »`,
          );
        } else if (!sample.uniform) {
          const worstFront = composite(text.colour, text.opacity, sample.worst);
          const worstRatio = contrast(worstFront, sample.worst);
          if (worstRatio < threshold) {
            add(
              'alerte',
              'contraste',
              `${state} · fond non uni : ${worstRatio.toFixed(2)}:1 sur ${hex(sample.worst)} · ` +
                `${text.path} · « ${text.text} »`,
            );
          }
        }
      }
    };

    // --- 1. etat de repos --------------------------------------------------
    const rest = await snapshot();
    measure('repos', rest.probe.texts, rest.image);

    // --- 2. replis deplies -------------------------------------------------
    if (rest.probe.meta.detailsCount > 0) {
      await tab.evaluate(openDisclosures);
      await settle(tab);
      const opened = await snapshot();
      measure(
        'deplie',
        opened.probe.texts.filter((t) => t.insideDetails),
        opened.image,
      );
      for (const group of redundantLinks(opened.probe.links)) {
        if (redundantLinks(rest.probe.links).some((g) => g[0].path === group[0].path)) continue;
        add(
          'alerte',
          'lien redondant',
          `${group.length} liens consecutifs vers ${new URL(group[0].href).pathname} (replis ouverts) · ` +
            group.map((l) => `${l.path} « ${l.text} »`).join(' | '),
        );
      }
      await tab.evaluate(() => {
        document.querySelectorAll('details').forEach((d) => {
          d.open = false;
        });
      });
    }

    // --- 3. survol et focus ------------------------------------------------
    if (size.states) {
      const nodeIds = await focusableNodeIds(cdp);

      /* QUI SE DEPLACE AU FOCUS ? Le lien d'evitement est hors champ au repos
         et revient a sa place au focus. Force en meme temps que les autres, il
         recouvre l'en-tete : le fond lu sous le logo devenait celui du lien
         d'evitement, et l'audit annoncait 2,82:1 la ou il n'y a rien. Le
         critere n'est donc pas « invisible au repos » — le lien l'est au sens
         du navigateur — mais « son rectangle bouge ». */
      await setPseudo(cdp, nodeIds, ['focus', 'focus-visible']);
      await settle(tab);
      const moved = await tab.evaluate(probePage);
      const shifts = nodeIds.map((_, i) => {
        const a = rest.probe.focusables[i]?.rect;
        const b = moved.focusables[i]?.rect;
        if (a === undefined || b === undefined) return false;
        return Math.abs(a.x - b.x) > 4 || Math.abs(a.y - b.y) > 4;
      });
      /* CHAQUE PASSE REPART D'UN DOCUMENT NEUF, ET CE N'EST PAS UNE
         PRECAUTION GRATUITE. Un etat force puis relache, sur un document qui
         a entre-temps recu et perdu une feuille de style et vu ses replis
         s'ouvrir puis se fermer, ne se laisse pas reposer : les passes
         suivantes n'appliquaient plus rien. Le liseret de focus n'apparaissait
         alors sur aucune capture, et l'audit concluait qu'il n'existait pas.
         Il existe — mesure a 4 px du bord, accent sur papier.

         Le rechargement coute une demi-seconde par passe et supprime toute
         une classe de mesures fausses. Les coordonnees restent comparables :
         la mise en page est deterministe. */
      const state = async (label, pick, classes, only) => {
        await tab.reload({ waitUntil: 'networkidle' });
        await settle(tab);
        const ids = (await focusableNodeIds(cdp)).filter((_, i) => pick(i));
        if (ids.length === 0) return;
        await setPseudo(cdp, ids, classes);
        await settle(tab);
        const shot = await snapshot();
        if (label === 'focus') {
          // Seuls les elements REELLEMENT forces dans cette passe : ceux qui se
          // deplacent au focus sont mesures a part, ailleurs.
          const forced = shot.probe.focusables.filter((_, i) => shifts[i] === false);
          for (const issue of focusRingIssues(forced, shot.image, rest.image)) {
            add(issue.level, 'contraste non textuel', issue.detail);
          }
        }
        const keep = shot.probe.texts.filter((t) => {
          if (!t.interactive) return false;
          if (only === undefined) return true;
          // Le texte doit appartenir a l'element deplace, et non se trouver
          // dessous : sinon on mesurerait le logo contre le lien qui le couvre.
          const cx = t.rect.x + t.rect.w / 2;
          const cy = t.rect.y + t.rect.h / 2;
          return only.some(
            (r) => cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h,
          );
        });
        measure(label, keep, shot.image);
      };

      await state('survol', (i) => shifts[i] === false, ['hover']);
      await state('focus', (i) => shifts[i] === false, ['focus', 'focus-visible']);
      // Le lien d'evitement n'existe qu'au focus : force avec les autres, il
      // recouvre l'en-tete et fausse les fonds voisins. Il passe donc seul, et
      // seuls SES textes sont mesures.
      await state(
        'focus-revele',
        (i) => shifts[i] === true,
        ['focus', 'focus-visible'],
        nodeIds
          .map((_, i) => (shifts[i] ? moved.focusables[i].rect : null))
          .filter((r) => r !== null),
      );
    }

    // --- 4. regles hors contraste -----------------------------------------
    for (const group of redundantLinks(rest.probe.links)) {
      add(
        'alerte',
        'lien redondant',
        `${group.length} liens consecutifs vers ${new URL(group[0].href).pathname} · ` +
          group.map((l) => `${l.path} « ${l.text} »`).join(' | '),
      );
    }

    for (const missing of await missingNames(cdp)) {
      add('erreur', 'nom accessible', `${missing.role} sans nom · ${missing.snippet}`);
    }

    for (const image of rest.probe.images) {
      if (!image.hasAlt) {
        add('erreur', 'alternative', `img sans attribut alt · ${image.path} · ${image.src}`);
      }
    }

    for (const issue of targetSizeIssues(rest.probe.focusables)) {
      add('alerte', 'taille de cible', `${issue.size} px · ${issue.path} « ${issue.text} »`);
    }

    for (const issue of tabOrderIssues(rest.probe.focusables, rest.probe.meta.dir)) {
      add('alerte', 'ordre de tabulation', `${issue.kind} · ${issue.path} · ${issue.detail}`);
    }

    if (rest.probe.meta.scrollWidth > rest.probe.meta.clientWidth + 1) {
      add(
        'erreur',
        'debordement',
        `document large de ${rest.probe.meta.scrollWidth} px pour ` +
          `${rest.probe.meta.clientWidth} px de fenetre`,
      );
    }

    return { findings, contrasts, meta: rest.probe.meta };
  } finally {
    await context.close();
  }
}

// --- programme --------------------------------------------------------------
const code = await withSite(
  async ({ browser, origin, pages }) => {
    const targets = pages
      .filter((p) => p.isContent)
      .filter((p) => FILTER === null || p.route.includes(FILTER));

    const all = [];
    let errors = 0;
    let alerts = 0;

    const shipped = checkNotShipped();
    process.stdout.write('=== L’OUTIL DE VÉRIFICATION EST-IL SERVI ? ===\n');
    for (const line of shipped.lines) process.stdout.write(`${line}\n`);
    process.stdout.write(
      `  VERDICT : ${shipped.clean ? 'playwright n’atteint pas le paquet servi' : 'FAUTE'}\n\n`,
    );

    process.stdout.write('=== AUDIT D’ACCESSIBILITÉ SUR RENDU RÉEL ===\n');
    process.stdout.write(
      `  ${targets.length} pages × ${MODES.length} modes × ${WIDTHS.length} largeurs\n\n`,
    );

    for (const page of targets) {
      for (const mode of MODES) {
        for (const size of WIDTHS) {
          const result = await auditRender(browser, origin, page, mode, size);
          const e = result.findings.filter((f) => f.level === 'erreur');
          const a = result.findings.filter((f) => f.level === 'alerte');
          errors += e.length;
          alerts += a.length;
          all.push({ route: page.route, locale: page.locale, mode, size: size.name, ...result });
          if (!QUIET) {
            const label = `${page.route} · ${mode} · ${size.name}`;
            process.stdout.write(
              `  ${label.padEnd(46)} ${String(e.length).padStart(2)} erreur(s)  ` +
                `${String(a.length).padStart(2)} alerte(s)\n`,
            );
            for (const finding of [...e, ...a]) {
              process.stdout.write(
                `      ${finding.level === 'erreur' ? '✗' : '!'} [${finding.rule}] ${finding.detail}\n`,
              );
            }
          }
        }
      }
    }

    // --- bilan ------------------------------------------------------------
    const byRule = new Map();
    for (const render of all) {
      for (const finding of render.findings) {
        const key = `${finding.level}/${finding.rule}`;
        byRule.set(key, (byRule.get(key) ?? 0) + 1);
      }
    }
    const measured = all.reduce((n, r) => n + r.contrasts.length, 0);
    process.stdout.write('\n=== BILAN ===\n');
    process.stdout.write(`  rendus audités              : ${all.length}\n`);
    process.stdout.write(`  textes mesurés sur pixels   : ${measured}\n`);
    for (const [key, count] of [...byRule.entries()].sort()) {
      process.stdout.write(`  ${key.padEnd(28)}: ${count}\n`);
    }
    process.stdout.write(`  ERREURS                     : ${errors === 0 ? 'AUCUNE' : errors}\n`);
    process.stdout.write(`  alertes                     : ${alerts === 0 ? 'aucune' : alerts}\n`);

    const worst = all
      .flatMap((r) => r.contrasts.map((c) => ({ ...c, mode: r.mode, route: r.route })))
      .sort((a, b) => a.ratio - b.ratio)
      .slice(0, 15);
    process.stdout.write('\n=== LES QUINZE CONTRASTES LES PLUS FAIBLES ===\n');
    process.stdout.write(
      `  ${'ratio'.padEnd(9)}${'seuil'.padEnd(7)}${'mode'.padEnd(7)}${'état'.padEnd(15)}` +
        `${'texte / fond'.padEnd(20)}route · sélecteur\n`,
    );
    for (const c of worst) {
      process.stdout.write(
        `  ${`${c.ratio.toFixed(2)}:1`.padEnd(9)}${`${c.threshold}:1`.padEnd(7)}` +
          `${c.mode.padEnd(7)}${c.state.padEnd(15)}` +
          `${`${c.foreground} / ${c.background}`.padEnd(20)}${c.route} · ${c.path}\n`,
      );
    }

    if (JSON_OUT !== null) {
      writeFileSync(JSON_OUT, JSON.stringify(all, null, 1), 'utf8');
      process.stdout.write(`\n  relevé complet écrit dans ${JSON_OUT}\n`);
    }

    return errors === 0 && shipped.clean ? 0 : 1;
  },
  { build: !NO_BUILD },
);

process.exit(code);
