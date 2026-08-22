/**
 * ---------------------------------------------------------------------------
 * SONDE EXECUTEE DANS LA PAGE
 * ---------------------------------------------------------------------------
 *
 * Ce module n'exporte pas du code appele ici : il exporte des FONCTIONS QUI
 * SERONT SERIALISEES ET EXECUTEES DANS LE NAVIGATEUR. Elles ne peuvent donc
 * rien refermer sur leur module — ni import, ni constante exterieure. Tout ce
 * dont elles ont besoin est defini a l'interieur.
 *
 * Elles ne jugent rien. Elles relevent : ou se trouve chaque texte, de quelle
 * couleur il est peint, quelle opacite le traverse, quels liens se suivent,
 * quels elements peuvent recevoir le focus. Le verdict est rendu ailleurs, sur
 * la capture reelle — c'est la toute la difference avec les controles
 * precedents, qui concluaient depuis les jetons sans jamais regarder l'ecran.
 * ---------------------------------------------------------------------------
 */

/**
 * Releve l'etat de la page. Executee dans le contexte du document.
 *
 * @returns {object} le releve brut, juge cote Node
 */
export function probePage() {
  /** Chemin lisible d'un element, pour que le rapport soit actionnable. */
  function pathOf(node) {
    const steps = [];
    let el = node;
    while (el !== null && el.nodeType === 1 && steps.length < 4) {
      let step = el.tagName.toLowerCase();
      if (el.id !== '') {
        steps.unshift(`#${el.id}`);
        break;
      }
      const classes = String(el.getAttribute('class') ?? '')
        .split(/\s+/)
        .filter((c) => c !== '' && !c.includes('__'))
        .slice(0, 2);
      if (classes.length > 0) step += `.${classes.join('.')}`;
      steps.unshift(step);
      el = el.parentElement;
    }
    return steps.join(' > ');
  }

  function parseColour(value) {
    const m = String(value).match(/-?[\d.]+/g);
    if (m === null) return null;
    const [r, g, b, a] = m.map(Number);
    return [r, g, b, a === undefined ? 1 : a];
  }

  /** Opacite cumulee des ancetres : elle traverse le texte comme le fond. */
  function chainOpacity(node) {
    let total = 1;
    let el = node;
    while (el !== null && el.nodeType === 1) {
      const o = Number(getComputedStyle(el).opacity);
      if (!Number.isNaN(o)) total *= o;
      el = el.parentElement;
    }
    return total;
  }

  /** Fond deduit des styles — conserve pour COMPARER au pixel reel. */
  function stackedBackground(node) {
    let el = node;
    let out = [255, 255, 255];
    let hasImage = false;
    const layers = [];
    while (el !== null && el.nodeType === 1) {
      const style = getComputedStyle(el);
      if (style.backgroundImage !== 'none') hasImage = true;
      const c = parseColour(style.backgroundColor);
      if (c !== null && c[3] > 0) {
        layers.push(c);
        if (c[3] === 1) break;
      }
      el = el.parentElement;
    }
    for (let i = layers.length - 1; i >= 0; i -= 1) {
      const [r, g, b, a] = layers[i];
      out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)];
    }
    return { colour: out, hasImage };
  }

  /**
   * L'ELEMENT EST-IL REELLEMENT PEINT ?
   *
   * `checkVisibility` est la seule reponse fiable : elle tient compte de
   * l'opacite d'un ANCETRE et de `content-visibility`, donc du contenu d'un
   * `<details>` replie — que le navigateur conserve dans le document mais ne
   * peint pas. Un premier jet lisait `display` et `visibility` sur le seul
   * element, et mesurait le contraste de textes que personne ne voit :
   * quatorze fausses erreurs sur la seule page de parcours.
   */
  function isPainted(el) {
    if (
      !el.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
        contentVisibilityAuto: true,
      })
    ) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width >= 1 && rect.height >= 1;
  }

  /** Un texte hors ecran destine aux lecteurs d'ecran n'est pas peint. */
  function isScreenReaderOnly(el) {
    let node = el;
    while (node !== null && node.nodeType === 1) {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      if (style.clipPath !== 'none' && rect.width <= 1 && rect.height <= 1) return true;
      if (String(style.clip).replace(/\s/g, '') === 'rect(0px,0px,0px,0px)') return true;
      node = node.parentElement;
    }
    return false;
  }

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height };
  };

  // --- textes -------------------------------------------------------------
  const texts = [];
  let serial = 0;
  for (const el of document.body.querySelectorAll('*')) {
    const own = Array.from(el.childNodes).filter(
      (n) => n.nodeType === 3 && n.textContent.trim() !== '',
    );
    if (own.length === 0) continue;
    if (!isPainted(el) || isScreenReaderOnly(el)) continue;

    const style = getComputedStyle(el);
    const colour = parseColour(style.color);
    if (colour === null || colour[3] === 0) continue;
    const size = parseFloat(style.fontSize);
    const weight = Number(style.fontWeight) || 400;
    const opacity = chainOpacity(el);
    if (opacity === 0) continue;
    const bg = stackedBackground(el);

    serial += 1;
    texts.push({
      id: `t${serial}`,
      tag: el.tagName.toLowerCase(),
      path: pathOf(el),
      insideDetails: el.closest('details') !== null,
      interactive: el.closest('a,button,summary,[tabindex]') !== null,
      text: own
        .map((n) => n.textContent.trim())
        .join(' ')
        .slice(0, 52),
      rect: rectOf(el),
      colour,
      opacity,
      size,
      weight,
      // Un « grand texte » au sens WCAG : 24 px, ou 18,66 px en gras.
      large: size >= 24 || (size >= 18.66 && weight >= 700),
      styleBackground: bg.colour,
      backgroundHasImage: bg.hasImage,
    });
  }

  // --- liens, dans l'ordre du document ------------------------------------
  const links = [];
  document.querySelectorAll('a[href]').forEach((el, index) => {
    const painted = isPainted(el);
    links.push({
      id: `a${index}`,
      order: index,
      href: el.href,
      path: pathOf(el),
      text: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 46),
      ariaHidden: el.closest('[aria-hidden="true"]') !== null,
      inTabOrder: el.tabIndex >= 0 && painted,
      painted,
      rect: rectOf(el),
    });
  });

  // --- elements focalisables ----------------------------------------------
  const FOCUSABLE = 'a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])';
  const focusables = [];
  document.querySelectorAll(FOCUSABLE).forEach((el, index) => {
    const style = getComputedStyle(el);
    focusables.push({
      id: `f${index}`,
      order: index,
      tag: el.tagName.toLowerCase(),
      path: pathOf(el),
      text: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 34),
      rect: rectOf(el),
      painted: isPainted(el),
      tabindex: el.getAttribute('tabindex'),
      // Liseret de focus, pour le contraste NON TEXTUEL (WCAG 1.4.11) : il se
      // dessine hors de la boite, a `offset` pixels, sur l'epaisseur `width`.
      outline: {
        width: parseFloat(style.outlineWidth) || 0,
        offset: parseFloat(style.outlineOffset) || 0,
        style: style.outlineStyle,
      },
      // Un lien pose dans une phrase est exempte de taille de cible (WCAG 2.5.8).
      inlineInText:
        style.display === 'inline' &&
        el.closest('p,li') !== null &&
        el.parentElement !== null &&
        el.parentElement.textContent.trim() !== (el.textContent ?? '').trim(),
      display: style.display,
    });
  });

  // --- images --------------------------------------------------------------
  const images = [];
  document.querySelectorAll('img').forEach((el) => {
    images.push({
      path: pathOf(el),
      src: (el.getAttribute('src') ?? '').slice(-52),
      hasAlt: el.hasAttribute('alt'),
      alt: el.getAttribute('alt') ?? '',
    });
  });

  // --- titres --------------------------------------------------------------
  const headings = [];
  document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((el) => {
    headings.push({ level: Number(el.tagName.slice(1)), path: pathOf(el) });
  });

  return {
    meta: {
      title: document.title,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir || getComputedStyle(document.body).direction,
      mode: document.documentElement.getAttribute('data-mode'),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      detailsCount: document.querySelectorAll('details').length,
    },
    texts,
    links,
    focusables,
    images,
    headings,
  };
}

/**
 * Rend chaque texte transparent, sans rien deplacer.
 *
 * C'EST LA CLE DE LA MESURE SUR PIXELS REELS. Une capture prise dans cet etat
 * montre le FOND SEUL — degrades, images, calques translucides et opacites
 * heritees compris. Il suffit alors de lire le pixel sous chaque texte pour
 * connaitre le fond contre lequel il est vraiment peint, au lieu de le
 * reconstruire depuis les feuilles de style.
 *
 * `color` seul suffit : ni la mise en page ni les fonds ne bougent.
 */
export function hideTextSource() {
  const style = document.createElement('style');
  style.id = 'audit-texte-transparent';
  style.textContent =
    '*, *::before, *::after { color: transparent !important;' +
    ' text-shadow: none !important; -webkit-text-stroke-color: transparent !important; }';
  document.head.append(style);
}

/** Retire le masque de texte pose ci-dessus. */
export function showTextSource() {
  document.getElementById('audit-texte-transparent')?.remove();
}

/**
 * Deplie tous les replis de la page.
 *
 * SANS CELA, LA MOITIE DU CONTENU N'EST JAMAIS AUDITEE : le panneau du
 * selecteur de langue et les descriptions de parcours vivent dans un
 * `<details>`, et un `<details>` replie n'est pas peint. Le lire replie ne dit
 * rien de son contraste ; il faut l'ouvrir.
 */
export function openDisclosures() {
  const all = document.querySelectorAll('details');
  all.forEach((d) => {
    d.open = true;
  });
  return all.length;
}
