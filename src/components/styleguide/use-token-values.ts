'use client';

import { useMemo, useSyncExternalStore } from 'react';

/**
 * Lecture des jetons CSS reels.
 *
 * C'est le mecanisme qui garantit qu'AUCUNE valeur de jeton n'est transcrite
 * dans le TSX : la page /styleguide affiche ce que globals.css definit
 * reellement, jamais une copie.
 *
 * Implemente avec `useSyncExternalStore` et non avec `useState` + `useEffect` :
 * les variables CSS sont un etat EXTERNE a React, et c'est exactement le cas
 * d'usage de cette primitive. Elle evite le rendu en cascade que provoque un
 * `setState` synchrone dans un effet.
 */

type TokenSnapshot = Readonly<Record<string, string>>;

const EMPTY_SNAPSHOT: TokenSnapshot = Object.freeze({});

interface TokenStore {
  subscribe: (onStoreChange: () => void) => () => void;
  getSnapshot: () => TokenSnapshot;
  getServerSnapshot: () => TokenSnapshot;
}

/**
 * Cree un magasin qui lit les variables demandees sur <html> et se
 * reinvalide a chaque changement de mode.
 *
 * L'instantane est mis en cache : `useSyncExternalStore` exige qu'un
 * instantane inchange soit referentiellement identique, faute de quoi React
 * boucle indefiniment.
 */
function createTokenStore(cssVars: readonly string[]): TokenStore {
  let snapshot: TokenSnapshot | null = null;

  const read = (): TokenSnapshot => {
    const styles = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const name of cssVars) {
      next[name] = styles.getPropertyValue(name).trim();
    }
    return next;
  };

  return {
    subscribe(onStoreChange) {
      const observer = new MutationObserver(() => {
        snapshot = null;
        onStoreChange();
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-mode'],
      });
      return () => observer.disconnect();
    },
    getSnapshot() {
      snapshot ??= read();
      return snapshot;
    },
    getServerSnapshot() {
      // Le serveur ne peut pas connaitre une valeur calculee : les composants
      // affichent un tiret cadratin tant que l'hydratation n'a pas eu lieu.
      return EMPTY_SNAPSHOT;
    },
  };
}

/**
 * Valeurs calculees des variables CSS demandees, relues a chaque changement de
 * mode.
 *
 * `cssVars` doit etre une constante de module (identite stable).
 */
export function useTokenValues(cssVars: readonly string[]): TokenSnapshot {
  const store = useMemo(() => createTokenStore(cssVars), [cssVars]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/** La taille de police racine ne change pas : aucun abonnement n'est necessaire. */
function subscribeToNothing(): () => void {
  return () => {};
}

function readRootFontSize(): number | null {
  const parsed = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isNaN(parsed) ? null : parsed;
}

function serverRootFontSize(): number | null {
  return null;
}

/**
 * Taille de police racine en pixels, pour convertir les rem en px.
 * `null` cote serveur et pendant l'hydratation.
 */
export function useRootFontSize(): number | null {
  return useSyncExternalStore(subscribeToNothing, readRootFontSize, serverRootFontSize);
}
