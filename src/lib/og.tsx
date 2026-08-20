import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

/**
 * ---------------------------------------------------------------------------
 * IMAGE DE PARTAGE — RENDUE À LA CONSTRUCTION
 * ---------------------------------------------------------------------------
 *
 * LE PROBLÈME. Une image Open Graph est peinte par Satori, qui ne connaît ni
 * les feuilles de style du site, ni les variables CSS : `var(--color-paper)`
 * n’y veut rien dire. Écrire les couleurs en dur dans ce fichier serait la
 * solution évidente, et la mauvaise : l’identité colorée dériverait dès la
 * première retouche de palette, et personne ne s’en apercevrait — une image de
 * partage ne se regarde pas, elle se poste.
 *
 * LA SOLUTION. Ce module LIT `globals.css` pendant la construction et en
 * extrait les jetons dont il a besoin. Il n’y a donc toujours qu’une seule
 * source de vérité, et l’image ne peut pas diverger du site : si un jeton
 * change, elle change ; si un jeton disparaît, la construction échoue.
 *
 * Même procédé que src/lib/public-asset.ts, qui lit le poids réel du CV plutôt
 * que de le recopier.
 *
 * LES POLICES sont lues dans src/assets/fonts. Satori exige du TTF, OTF ou
 * WOFF ; `next/font/google` ne livre que du WOFF2, inexploitable ici. Les deux
 * fichiers sont donc versionnés — ils sont sous licence SIL Open Font, qui
 * autorise explicitement la redistribution. C’est la seule façon d’obtenir la
 * typographie du site sans appel réseau pendant la construction : une image de
 * partage ne doit pas pouvoir faire échouer un déploiement parce qu’un serveur
 * de polices est indisponible.
 * ---------------------------------------------------------------------------
 */

/**
 * Dimensions recommandées par le protocole Open Graph, et non un jeton de
 * design : elles décrivent un format d’échange, pas une intention graphique.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Chemin de la vignette du site, produite par src/app/opengraph-image.tsx.
 *
 * Il n'est utile qu'aux pages qui declarent leur propre bloc `openGraph` :
 * Next.js REMPLACE alors le bloc herite, images comprises, et la vignette
 * du site doit etre redonnee explicitement. Les autres pages l'heritent
 * sans rien declarer.
 */
export const OG_SHARE_PATH = '/opengraph-image';

const GLOBALS_CSS = join(process.cwd(), 'src', 'app', 'globals.css');
const FONT_DIR = join(process.cwd(), 'src', 'assets', 'fonts');
const ROOT_FONT_SIZE = 16;

let stylesheetCache: string | null = null;

function stylesheet(): string {
  if (stylesheetCache === null) stylesheetCache = readFileSync(GLOBALS_CSS, 'utf8');
  return stylesheetCache;
}

function fail(what: string): never {
  throw new Error(
    `Image de partage : ${what} introuvable dans src/app/globals.css. ` +
      'Le jeton a été renommé ou supprimé ; corriger la référence plutôt ' +
      'que d’écrire une valeur en dur.',
  );
}

/**
 * Couleur du MODE SOMBRE.
 *
 * Le mode sombre, et non le clair : une vignette de partage est vue au milieu
 * d’un fil de publications qui sont, elles, sur fond blanc. Un fond bleu nuit
 * s’en détache ; un fond très pâle s’y fondrait.
 */
export function ogColor(name: string): string {
  // Ancre de debut de ligne : sans elle, la premiere correspondance serait
  // `:root[data-mode='dark'] { color-scheme: dark; }`, qui ne porte aucune
  // couleur. C'est le bloc NON ancre a `:root` que l'on cherche.
  const block = /^\[data-mode='dark'\]\s*\{([\s\S]*?)\}/m.exec(stylesheet());
  if (block === null) fail('le bloc [data-mode=\'dark\']');
  const found = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,8})\\s*;`).exec(block[1] ?? '');
  return found?.[1] ?? fail(`la couleur --color-${name}`);
}

/**
 * Taille de police, en pixels, prise à la BORNE HAUTE de l’échelle fluide.
 * Une image de 1200 pixels de large est une grande fenêtre : c’est la borne
 * haute de `clamp()` qui s’y applique.
 */
export function ogText(level: string): number {
  const found = new RegExp(
    `--text-${level}:\\s*clamp\\([^;]*?,\\s*([\\d.]+)rem\\s*\\)\\s*;`,
  ).exec(stylesheet());
  if (found?.[1] === undefined) fail(`la taille --text-${level}`);
  return Number.parseFloat(found[1]) * ROOT_FONT_SIZE;
}

/** Espacement, en pixels, puisé dans l’échelle de base 4. */
export function ogSpace(name: string): number {
  const found = new RegExp(`--spacing-${name}:\\s*([\\d.]+)rem\\s*;`).exec(stylesheet());
  if (found?.[1] === undefined) fail(`l’espacement --spacing-${name}`);
  return Number.parseFloat(found[1]) * ROOT_FONT_SIZE;
}

const SERIF = readFileSync(join(FONT_DIR, 'instrument-serif-400.ttf'));
const MONO = readFileSync(join(FONT_DIR, 'jetbrains-mono-400.ttf'));

export interface ShareImageProps {
  /** Ligne de surtitre, en monospace. */
  readonly eyebrow: string;
  /** Ligne principale, en serif display. */
  readonly title: string;
  /** Pied de vignette, en monospace. */
  readonly footer: string;
}

/**
 * La vignette : filet d’accent, surtitre, titre, pied.
 *
 * Rien n’est écrit ici — les trois lignes viennent des données, les couleurs
 * et les mesures des jetons.
 */
export function renderShareImage({ eyebrow, title, footer }: ShareImageProps): ImageResponse {
  const paper = ogColor('paper');
  const ink = ogColor('ink');
  const inkSubtle = ogColor('ink-subtle');
  const accentVivid = ogColor('accent-vivid');
  const pad = ogSpace('3xl');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: paper,
          padding: pad,
          fontFamily: 'JetBrains Mono',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              width: ogSpace('2xl'),
              height: ogSpace('3xs'),
              backgroundColor: accentVivid,
              borderRadius: ogSpace('3xs'),
            }}
          />
          <div
            style={{
              display: 'flex',
              marginTop: ogSpace('lg'),
              fontSize: ogText('body-lg'),
              color: inkSubtle,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: ogSpace('sm'),
              fontFamily: 'Instrument Serif',
              fontSize: ogText('display-xl'),
              lineHeight: 1.05,
              color: ink,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: ogText('body-md'), color: inkSubtle }}>
          {footer}
        </div>
      </div>
    ),
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      fonts: [
        { name: 'Instrument Serif', data: SERIF, style: 'normal', weight: 400 },
        { name: 'JetBrains Mono', data: MONO, style: 'normal', weight: 400 },
      ],
    },
  );
}
