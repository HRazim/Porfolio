'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { ChevronDownIcon } from '@/components/ui/icons';
import { LOCALE_META, type Locale } from '@/content/i18n';
import { LANGUAGE_PICKER } from '@/content/site-copy';
import { cn } from '@/lib/cn';

export interface LanguageDisclosureProps {
  readonly locale: Locale;
  /** Le sélecteur lui-même, rendu côté serveur et passé tel quel. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * ---------------------------------------------------------------------------
 * DÉPLOIEMENT DU SÉLECTEUR DE LANGUE — COMPOSANT CLIENT
 * ---------------------------------------------------------------------------
 *
 * L’en-tête affichait les quatre langues en permanence. Il n’en affiche plus
 * qu’une — la langue courante — et déploie les autres à la demande.
 *
 * ---------------------------------------------------------------------------
 * POURQUOI `<details>` ET NON UN BOUTON À ÉTAT
 * ---------------------------------------------------------------------------
 *
 * `<details>` déploie SANS JAVASCRIPT. C’est décisif ici : le principe du
 * projet est que tout contenu reste atteignable même si aucun script ne
 * s’exécute. Un panneau piloté par `useState` et masqué par `hidden` ne
 * s’ouvrirait jamais dans un document où React n’a pas démarré, et les trois
 * autres langues deviendraient inatteignables — le défaut même que ce projet
 * s’interdit depuis l’audit.
 *
 * `<summary>` est un élément interactif NATIF : focalisable sans `tabindex`,
 * activable à l’Entrée et à l’Espace sans gestionnaire, et exposé par les
 * lecteurs d’écran avec son état déplié ou replié. Rien de tout cela n’est
 * écrit ici, et c’est pourquoi rien de tout cela ne peut être oublié.
 *
 * AUCUN `aria-expanded` N’EST POSÉ, volontairement. L’état viendrait de React,
 * donc figé à « replié » dans un document sans script — un attribut ARIA qui
 * ment est pire que pas d’attribut du tout, puisqu’il gagne contre la
 * correspondance native. `<details>` porte déjà `open` dans le DOM, et c’est
 * cet attribut que la correspondance native lit.
 *
 * ---------------------------------------------------------------------------
 * CE QUE LE SCRIPT AJOUTE, ET RIEN DE PLUS
 * ---------------------------------------------------------------------------
 *
 * `<details>` ignore la touche d’échappement et le clic extérieur : un panneau
 * ouvert le reste jusqu’à ce qu’on retourne cliquer sur son déclencheur. Ces
 * deux comportements sont exigés, et ils n’ont AUCUN équivalent déclaratif.
 * C’est la seule raison d’être de ce composant client.
 *
 * L’état n’est pas dupliqué dans React : on lit et on écrit `details.open`,
 * qui est déjà la source de vérité du navigateur. Un `useState` en parallèle
 * aurait créé deux vérités pour une seule question.
 *
 * Le sélecteur, lui, reste RENDU CÔTÉ SERVEUR : il arrive par `children`.
 * Ses quatre liens figurent donc dans le HTML servi, panneau fermé compris,
 * et un moteur d’indexation les suit sans exécuter une ligne de script.
 * ---------------------------------------------------------------------------
 */
export function LanguageDisclosure({ locale, children, className }: LanguageDisclosureProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const details = detailsRef.current;
    if (details === null) return;

    const close = (giveBackFocus: boolean): void => {
      if (!details.open) return;
      details.open = false;
      if (giveBackFocus) summaryRef.current?.focus();
    };

    // Échap referme et REND LE FOCUS au déclencheur : sans cela, le focus
    // resterait sur un lien qui vient de disparaître, et la tabulation
    // repartirait du début du document.
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close(true);
    };

    // `pointerdown` plutôt que `click` : un clic hors du panneau doit fermer
    // AVANT que la cible ne réagisse, sinon le panneau se referme après coup
    // et l’on voit un battement.
    //
    // Le focus n’est PAS rendu au déclencheur ici : l’utilisateur vient de
    // désigner autre chose, le lui reprendre irait contre son geste.
    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (target instanceof Node && details.contains(target)) return;
      close(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  const meta = LOCALE_META[locale];

  return (
    <details ref={detailsRef} className={cn('relative', className)}>
      <summary
        ref={summaryRef}
        /* `px-3xs` SOUS `lg`, ET NON `px-2xs` : le declencheur entre desormais
           dans un en-tete qui compte quatre elements a 320 px de large, ou il
           ne reste rien. Huit pixels repris ici sont huit pixels rendus au nom
           du site, qui sinon se coupe en deux lignes.

           LA CIBLE RESTE AU-DESSUS DU MINIMUM : 46 x 28 px, la ou WCAG 2.5.8
           demande 24 x 24. Ce qui est repris est de la marge, jamais de la
           surface cliquable utile. */
        className="disclosure-trigger inline-flex items-center gap-2xs rounded-sm px-3xs py-3xs font-mono text-body-sm text-ink-muted transition-colors duration-[var(--duration-fast)] ease-out hover:text-accent lg:px-2xs"
      >
        {/* Le code court est VISIBLE, le rôle du bouton est annoncé. Les deux
            comptent dans le nom accessible : le critère WCAG 2.5.3 « Label in
            Name » exige que le nom contienne le texte visible, et « FR » seul
            ne dirait pas ce que fait le déclencheur. */}
        <span>{meta.shortLabel}</span>
        <span className="sr-only">
          {LANGUAGE_PICKER.trigger[locale].replace('{langue}', meta.nativeName)}
        </span>
        <ChevronDownIcon size="sm" className="disclosure-mark" />
      </summary>

      {/* `end-0`, et non son equivalent physique : le panneau s’aligne sur la
          FIN de la ligne, donc a droite en ecriture latine et a gauche en
          arabe.

          Le nom de la classe physique n’est pas ecrit ici, meme en
          commentaire : Tailwind analyse le fichier entier, commentaires
          compris, et le citer suffirait a faire entrer une regle
          directionnelle physique dans la feuille compilee. */}
      <div className="panel-enter absolute end-0 top-full z-50 mt-2xs min-w-3xl rounded-md border border-border bg-surface p-sm">
        {children}
      </div>
    </details>
  );
}
