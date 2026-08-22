/**
 * ---------------------------------------------------------------------------
 * LECTURE DES PIXELS D'UNE CAPTURE PNG
 * ---------------------------------------------------------------------------
 *
 * POURQUOI CE FICHIER EXISTE. L'audit de contraste doit lire la couleur
 * REELLEMENT PEINTE derriere un texte, et non celle que l'on deduit des
 * feuilles de style. Un degrade, une image de fond, un calque translucide, un
 * `opacity` pose sur un ancetre : rien de tout cela ne se lit dans
 * `getComputedStyle`, et c'est precisement ce que le calcul depuis les jetons
 * ne couvrait pas.
 *
 * Playwright rend une capture ; encore faut-il la decoder. Aucune bibliotheque
 * tierce n'est ajoutee pour cela : `zlib` fait partie de Node, et le format
 * produit par Chromium est le sous-ensemble le plus simple du PNG.
 *
 * CE QUI EST GERE : profondeur 8 bits, sans entrelacement, couleur vraie avec
 * ou sans canal alpha (types 2 et 6) et niveaux de gris (types 0 et 4).
 * CE QUI NE L'EST PAS : palette (type 3), 16 bits, entrelacement Adam7. Le
 * decodeur echoue alors franchement plutot que de rendre des couleurs fausses.
 * ---------------------------------------------------------------------------
 */
import { inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Nombre de canaux par type de couleur PNG. */
const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };

/**
 * Annule le filtrage d'une ligne. Le PNG filtre chaque ligne par rapport a la
 * precedente pour mieux se comprimer ; il faut donc reconstruire dans l'ordre,
 * chaque ligne s'appuyant sur celle d'au-dessus.
 */
function unfilter(type, line, previous, bpp) {
  switch (type) {
    case 0:
      break;
    case 1:
      for (let i = bpp; i < line.length; i += 1) line[i] = (line[i] + line[i - bpp]) & 0xff;
      break;
    case 2:
      for (let i = 0; i < line.length; i += 1) line[i] = (line[i] + previous[i]) & 0xff;
      break;
    case 3:
      for (let i = 0; i < line.length; i += 1) {
        const left = i >= bpp ? line[i - bpp] : 0;
        line[i] = (line[i] + ((left + previous[i]) >> 1)) & 0xff;
      }
      break;
    case 4:
      for (let i = 0; i < line.length; i += 1) {
        const a = i >= bpp ? line[i - bpp] : 0;
        const b = previous[i];
        const c = i >= bpp ? previous[i - bpp] : 0;
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        line[i] = (line[i] + pred) & 0xff;
      }
      break;
    default:
      throw new Error(`filtre PNG inconnu : ${type}`);
  }
}

/**
 * Decode un PNG en un tableau RGBA de `width * height * 4` octets.
 *
 * @param {Buffer} buffer capture rendue par le navigateur
 * @returns {{ width: number, height: number, data: Uint8ClampedArray }}
 */
export function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error('ce n’est pas un PNG');

  let offset = 8;
  let header = null;
  const parts = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const start = offset + 8;
    if (type === 'IHDR') {
      header = {
        width: buffer.readUInt32BE(start),
        height: buffer.readUInt32BE(start + 4),
        depth: buffer[start + 8],
        colour: buffer[start + 9],
        interlace: buffer[start + 12],
      };
    } else if (type === 'IDAT') {
      parts.push(buffer.subarray(start, start + length));
    } else if (type === 'IEND') {
      break;
    }
    offset = start + length + 4;
  }

  if (header === null) throw new Error('PNG sans en-tete IHDR');
  if (header.depth !== 8) throw new Error(`profondeur ${header.depth} non geree`);
  if (header.interlace !== 0) throw new Error('PNG entrelace non gere');
  const channels = CHANNELS[header.colour];
  if (channels === undefined) throw new Error(`type de couleur ${header.colour} non gere`);

  const { width, height } = header;
  const raw = inflateSync(Buffer.concat(parts));
  const bpp = channels;
  const stride = width * bpp;
  const data = new Uint8ClampedArray(width * height * 4);

  let previous = Buffer.alloc(stride);
  for (let y = 0; y < height; y += 1) {
    const at = y * (stride + 1);
    const line = Buffer.from(raw.subarray(at + 1, at + 1 + stride));
    unfilter(raw[at], line, previous, bpp);
    for (let x = 0; x < width; x += 1) {
      const s = x * bpp;
      const d = (y * width + x) * 4;
      if (channels >= 3) {
        data[d] = line[s];
        data[d + 1] = line[s + 1];
        data[d + 2] = line[s + 2];
        data[d + 3] = channels === 4 ? line[s + 3] : 255;
      } else {
        data[d] = line[s];
        data[d + 1] = line[s];
        data[d + 2] = line[s];
        data[d + 3] = channels === 2 ? line[s + 1] : 255;
      }
    }
    previous = line;
  }

  return { width, height, data };
}

/** Couleur d'un pixel, en composantes 0-255. Hors cadre : `null`. */
export function pixelAt(image, x, y) {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || py < 0 || px >= image.width || py >= image.height) return null;
  const i = (py * image.width + px) * 4;
  return [image.data[i], image.data[i + 1], image.data[i + 2], image.data[i + 3]];
}
