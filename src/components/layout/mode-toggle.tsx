'use client';

import { useCallback, useSyncExternalStore } from 'react';

import { MoonIcon, SunIcon } from '@/components/ui/icons';
import { THEME_TOGGLE } from '@/content/site-copy';
import {
  DEFAULT_MODE,
  isColorMode,
  MODE_ATTRIBUTE,
  MODE_STORAGE_KEY,
  MODE_TRANSITION_ATTRIBUTE,
  type ColorMode,
} from '@/lib/theme';

/**
 * ---------------------------------------------------------------------------
 * BASCULE CLAIR / SOMBRE
 * ---------------------------------------------------------------------------
 *
 * Un seul bouton. Il remplace le selecteur de palette, dont il n'etait qu'une
 * moitie : le choix d'une teinte parmi cinq a ete retire, le choix du mode
 * reste — ce n'est pas un gout mais un confort de lecture.
 *
 * ETAT — l'attribut `data-mode` de <html> est la source de verite, exactement
 * comme le declare globals.css. On s'y ABONNE via `useSyncExternalStore`
 * plutot que d'en tenir une copie dans un etat React : aucune
 * desynchronisation n'est possible, et le script d'amorcage peut poser
 * l'attribut avant que React n'existe sans que rien ne diverge.
 *
 * ACCESSIBILITE — `aria-pressed` porte l'etat, le libelle masque annonce
 * l'ACTION a venir et non l'etat courant. Un bouton natif est atteignable au
 * clavier sans `tabindex`.
 *
 * MOUVEMENT — la transition passe par un jeton de duree, neutralise en bloc
 * sous `prefers-reduced-motion: reduce` dans globals.css.
 * ---------------------------------------------------------------------------
 */

function subscribe(onStoreChange: () => void): () => void {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [MODE_ATTRIBUTE],
  });
  return () => observer.disconnect();
}

function readMode(): ColorMode {
  const value = document.documentElement.getAttribute(MODE_ATTRIBUTE);
  return isColorMode(value) ? value : DEFAULT_MODE;
}

/* Le serveur rend le mode par defaut : l'hydratation concorde. */
const serverMode = (): ColorMode => DEFAULT_MODE;

/**
 * Duree du fondu de bascule, LUE DANS LE JETON.
 *
 * Aucune milliseconde n'est ecrite ici : `--duration-base` reste l'unique
 * source. On la lit au moment du clic, ce qui garantit qu'un changement du
 * jeton se repercute sans toucher a ce fichier.
 */
function transitionMs(root: HTMLElement): number {
  const raw = getComputedStyle(root).getPropertyValue('--duration-base').trim();
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return 0;
  return raw.endsWith('ms') ? value : value * 1000;
}

export function ModeToggle() {
  const mode = useSyncExternalStore(subscribe, readMode, serverMode);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: ColorMode = readMode() === 'dark' ? 'light' : 'dark';

    // Le fondu des couleurs n'est arme QUE le temps du basculement. Une
    // transition globale permanente ferait trainer chaque survol derriere lui.
    root.setAttribute(MODE_TRANSITION_ATTRIBUTE, '');
    window.setTimeout(
      () => root.removeAttribute(MODE_TRANSITION_ATTRIBUTE),
      transitionMs(root),
    );

    root.setAttribute(MODE_ATTRIBUTE, next);
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* Stockage refuse : le choix reste valable pour la session en cours. */
    }
  }, []);

  const isDark = mode === 'dark';
  const Icon = isDark ? SunIcon : MoonIcon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className="inline-flex items-center rounded-full border border-border p-2xs text-ink-subtle transition-colors duration-[var(--duration-fast)] ease-out hover:border-accent-vivid hover:text-accent"
    >
      <Icon size="sm" />
      <span className="sr-only">
        {isDark ? THEME_TOGGLE.toLight : THEME_TOGGLE.toDark}
      </span>
    </button>
  );
}
