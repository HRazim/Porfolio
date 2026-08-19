/**
 * Calcul de contraste WCAG 2.1.
 *
 * Ces fonctions sont volontairement pures et sans valeur codee en dur : la
 * page /styleguide les alimente avec les valeurs LUES sur les jetons CSS
 * reels. Aucun ratio n'est donc transcrit a la main, et le tableau de
 * conformite ne peut pas diverger de la palette.
 */

export type Rgb = readonly [number, number, number];

/** Seuils WCAG 2.1, niveau AA. */
export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3;

/**
 * Analyse une valeur de couleur CSS.
 * Formes acceptees : `#abc`, `#aabbcc`, `rgb(r g b)`, `rgb(r, g, b)`,
 * `rgba(r, g, b, a)`. Retourne `null` si la forme n'est pas reconnue.
 */
export function parseCssColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();

  if (value.startsWith('#')) {
    const digits = value.slice(1);
    if (digits.length === 3) {
      const expanded = digits
        .split('')
        .map((digit) => digit + digit)
        .join('');
      return hexPairsToRgb(expanded);
    }
    if (digits.length === 6 || digits.length === 8) {
      return hexPairsToRgb(digits.slice(0, 6));
    }
    return null;
  }

  if (value.startsWith('rgb')) {
    const open = value.indexOf('(');
    const close = value.lastIndexOf(')');
    if (open === -1 || close === -1) return null;
    const parts = value
      .slice(open + 1, close)
      .replace(/\//g, ' ')
      .split(/[\s,]+/)
      .filter(Boolean)
      .slice(0, 3)
      .map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return [parts[0] as number, parts[1] as number, parts[2] as number];
  }

  return null;
}

function hexPairsToRgb(sixDigits: string): Rgb | null {
  const channels: number[] = [];
  for (let index = 0; index < 6; index += 2) {
    const channel = Number.parseInt(sixDigits.slice(index, index + 2), 16);
    if (Number.isNaN(channel)) return null;
    channels.push(channel);
  }
  return [channels[0] as number, channels[1] as number, channels[2] as number];
}

/** Luminance relative WCAG d'un canal 0-255. */
function linearize(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

/** Luminance relative WCAG d'une couleur. */
export function relativeLuminance([red, green, blue]: Rgb): number {
  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}

/** Ratio de contraste WCAG entre deux couleurs. Retourne `null` si l'une est illisible. */
export function contrastRatio(foreground: string, background: string): number | null {
  const front = parseCssColor(foreground);
  const back = parseCssColor(background);
  if (!front || !back) return null;

  const lightest = Math.max(relativeLuminance(front), relativeLuminance(back));
  const darkest = Math.min(relativeLuminance(front), relativeLuminance(back));
  return (lightest + 0.05) / (darkest + 0.05);
}

export type WcagVerdict = 'AA' | 'AA-large' | 'fail';

/** Verdict WCAG AA pour un ratio donne. */
export function wcagVerdict(ratio: number): WcagVerdict {
  if (ratio >= WCAG_AA_NORMAL) return 'AA';
  if (ratio >= WCAG_AA_LARGE) return 'AA-large';
  return 'fail';
}

/**
 * Extrait les deux bornes d'une expression `clamp(min, prefere, max)`.
 * Retourne les valeurs en rem. `null` si l'expression n'est pas un clamp.
 */
export function parseClampBounds(input: string): { min: number; max: number } | null {
  const value = input.trim();
  if (!value.startsWith('clamp(')) return null;

  const inner = value.slice('clamp('.length, value.lastIndexOf(')'));
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const character of inner) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += character;
  }
  parts.push(current);
  if (parts.length !== 3) return null;

  const min = Number.parseFloat((parts[0] as string).trim());
  const max = Number.parseFloat((parts[2] as string).trim());
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return { min, max };
}
