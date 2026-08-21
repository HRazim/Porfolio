'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import type { Locale, PageKey } from '@/content/i18n';
import { HEADER, NAVIGATION } from '@/content/site-copy';
import { cn } from '@/lib/cn';

import { LanguagePicker } from './language-picker';

export interface MobileMenuProps {
  readonly locale: Locale;
  /** Page courante, transmise au sélecteur de langue du panneau. */
  readonly page: PageKey | null;
  readonly slug?: string;
  readonly className?: string;
}

/**
 * ---------------------------------------------------------------------------
 * MENU MOBILE — COMPOSANT CLIENT 1 SUR 2
 * ---------------------------------------------------------------------------
 *
 * AUDIT.md section 5.4 classe le menu du site precedent comme defaut
 * CRITIQUE : son declencheur etait un `<div>` sans `tabindex` ni `role`,
 * ecoutant uniquement `click`. Sous 768 px, aucun utilisateur au clavier ne
 * pouvait ouvrir la navigation.
 *
 * Corrections apportees ici :
 *   - le declencheur est un `<button type="button">`, focalisable et
 *     activable au clavier par nature ;
 *   - il porte `aria-expanded` et `aria-controls`, absents du site
 *     precedent, qui n’exposait donc aucun etat ;
 *   - le panneau ferme porte l’attribut `hidden`, ce qui le retire
 *     REELLEMENT de l’arbre d’accessibilite et de l’ordre de tabulation.
 *     Le site precedent le deplacait hors ecran avec `left: -100%`, si bien
 *     que ses cinq liens restaient focalisables et invisibles ;
 *   - la touche Echap referme le panneau et rend le focus au declencheur.
 * ---------------------------------------------------------------------------
 */
export function MobileMenu({ locale, page, slug, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Echap referme. Le setState vit dans un ecouteur, jamais dans le corps de
  // l’effet : le compilateur React refuse un rendu en cascade.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  // A l’ouverture, le focus entre dans le panneau. Effet de bord sur le DOM,
  // pas de mise a jour d’etat.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? HEADER.menuClose[locale] : HEADER.menuOpen[locale]}
        onClick={() => setOpen((previous) => !previous)}
        className="inline-flex items-center justify-center rounded-sm p-2xs text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        ref={panelRef}
        id={panelId}
        hidden={!open}
        tabIndex={-1}
        aria-label={HEADER.mobileMenuLabel[locale]}
        className="absolute right-0 top-full z-50 mt-2xs min-w-3xl rounded-md border border-border bg-surface p-md"
      >
        <ul className="flex list-none flex-col gap-sm p-0">
          {NAVIGATION.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href(locale)}
                onClick={() => setOpen(false)}
                className="link-sweep inline-block py-2xs text-body-md text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent"
              >
                {item.label[locale]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Les langues s’ecrivent ici en toutes lettres — « Français »,
            « English », « Español », « العربية » — la ou l’en-tete n’a la
            place que des codes courts. Ce sont les memes liens : le selecteur
            ne devient pas un composant client parce qu’il est monte dans un
            panneau qui, lui, en est un. */}
        <div className="mt-md border-t border-border pt-md">
          <LanguagePicker locale={locale} page={page} slug={slug} variant="full" />
        </div>
      </nav>
    </div>
  );
}
