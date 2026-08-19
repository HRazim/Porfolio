'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'styleguide-theme';

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

/**
 * L'attribut `data-theme` sur <html> est la source de verite unique du theme,
 * exactement comme le declare globals.css. On s'y abonne plutot que d'en
 * tenir une copie dans un etat React : aucune desynchronisation possible.
 */
function subscribeToTheme(onStoreChange: () => void): () => void {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function serverTheme(): Theme {
  // <html data-theme="light"> est le rendu serveur : l'hydratation concorde.
  return 'light';
}

/**
 * Bascule entre theme clair et theme sombre.
 *
 * Rendu cote client : il manipule le DOM et lit le stockage local. C'est,
 * avec les composants de lecture de jetons, le seul code client de cette
 * etape.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, serverTheme);

  // Restaure la preference apres hydratation. Ecrit dans le DOM, jamais dans
  // un etat React : l'abonnement ci-dessus declenche le rendu.
  useEffect(() => {
    const stored = readStoredTheme();
    if (stored !== null) {
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* stockage indisponible : la bascule reste fonctionnelle pour la session */
    }
  }, []);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      // `duration-[var(--duration-fast)]` et non `duration-fast` : Tailwind v4
      // n'expose pas d'espace de noms de theme pour la duree de transition.
      // La valeur reste un jeton, jamais un nombre litteral.
      className="inline-flex items-center gap-2xs rounded-md border border-ink-subtle bg-surface px-sm py-2xs font-mono text-body-sm font-medium text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:bg-paper"
    >
      <span aria-hidden="true" className="inline-block size-xs rounded-full bg-accent" />
      {isDark ? 'Thème sombre' : 'Thème clair'}
    </button>
  );
}
