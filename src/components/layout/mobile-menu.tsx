'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import type { Locale } from '@/content/i18n';
import { HEADER, NAVIGATION } from '@/content/site-copy';
import { cn } from '@/lib/cn';

export interface MobileMenuProps {
  readonly locale: Locale;
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
export function MobileMenu({ locale, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
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

  /* CLIC EXTERIEUR — AJOUTE, ET IL MANQUAIT. Mesure dans un navigateur avant
     toute modification : Echap refermait, un clic hors du panneau non. Le
     selecteur de langue, lui, l’avait depuis sa creation.

     IL FAIT AUSSI L’EXCLUSION MUTUELLE, et c’est pourquoi il n’y a rien de
     plus a ecrire pour elle. Le declencheur de langue est HORS de ce panneau :
     l’ouvrir referme donc le menu. Reciproquement, le bouton de menu est hors
     du `<details>` de langue, dont l’ecouteur symetrique le referme. Deux
     panneaux flottants ancres a deux declencheurs voisins se recouvriraient a
     l’ecran : l’exclusion n’est pas un confort, elle evite un chevauchement.

     `pointerdown` et non `click` : la fermeture doit precéder la reaction de
     la cible, sinon le panneau se referme apres coup et l’on voit un battement.

     Le focus n’est PAS rendu au bouton : l’utilisateur vient de designer autre
     chose, le lui reprendre irait contre son geste. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (target instanceof Node && rootRef.current?.contains(target) === true) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // A l’ouverture, le focus entre dans le panneau. Effet de bord sur le DOM,
  // pas de mise a jour d’etat.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? HEADER.menuClose[locale] : HEADER.menuOpen[locale]}
        onClick={() => setOpen((previous) => !previous)}
        // `p-3xs` SOUS `lg` : le bouton mesure alors 32 x 32 px au lieu de 40,
        // huit pixels rendus a un en-tete qui n’en a plus. La cible reste
        // au-dessus des 24 x 24 px de WCAG 2.5.8, et l’icone ne change pas.
        className="inline-flex items-center justify-center rounded-sm p-3xs text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent lg:p-2xs"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        ref={panelRef}
        id={panelId}
        hidden={!open}
        tabIndex={-1}
        aria-label={HEADER.mobileMenuLabel[locale]}
        className="panel-enter absolute end-0 top-full z-50 mt-2xs min-w-3xl rounded-md border border-border bg-surface p-md"
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
      </nav>
    </div>
  );
}
