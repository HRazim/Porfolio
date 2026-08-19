'use client';

import { useEffect, useRef } from 'react';

/**
 * ---------------------------------------------------------------------------
 * ETAT DE DEFILEMENT DE L’EN-TETE — COMPOSANT CLIENT 2 SUR 2
 * ---------------------------------------------------------------------------
 *
 * AUDIT.md section 3.4 : le site precedent ecrivait `header.style.padding`
 * en ligne a chaque evenement de defilement. Un style en ligne l’emporte sur
 * toute regle de feuille de style, media query comprise : des le premier
 * defilement sur mobile, le `padding: 20px` prevu pour les petits ecrans
 * etait ecrase definitivement par `20px 40px`. Trois ecouteurs `scroll` non
 * etrangles provoquaient de surcroit un recalcul de mise en page synchrone
 * par evenement (section 4.4).
 *
 * Ici :
 *   - une sentinelle d’un pixel, placee en tete de flux, est observee par un
 *     `IntersectionObserver` — asynchrone, hors du fil principal, aucun
 *     ecouteur `scroll` ;
 *   - l’etat est expose par l’attribut `data-scrolled` sur `<html>`, consomme
 *     en CSS. Aucun style n’est ecrit en ligne, donc rien n’echappe a la
 *     feuille de style.
 * ---------------------------------------------------------------------------
 */
export function HeaderScrollState() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel === null) return;

    const root = document.documentElement;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry === undefined) return;
      root.dataset.scrolled = entry.isIntersecting ? 'false' : 'true';
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      delete root.dataset.scrolled;
    };
  }, []);

  return <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />;
}
