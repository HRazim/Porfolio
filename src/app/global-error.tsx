'use client';

import { GLOBAL_ERROR } from '@/content/site-copy';
import { fontVariables } from '@/lib/fonts';

import './globals.css';

/**
 * ---------------------------------------------------------------------------
 * REPLI D’ERREUR GLOBAL
 * ---------------------------------------------------------------------------
 *
 * Affiché lorsque la MISE EN PAGE RACINE elle-même a échoué. Ce composant la
 * remplace entièrement : il rend donc son propre `<html>` et son propre
 * `<body>`, ce qu’aucun autre composant du projet ne fait.
 *
 * IL EST CLIENT PAR OBLIGATION. Next.js impose `'use client'` sur
 * `global-error`, qui s’appuie sur une frontière d’erreur React — un mécanisme
 * qui n’existe que dans le navigateur. Ce n’est pas un choix d’architecture :
 * c’est le seul composant client que le projet n’a pas décidé.
 *
 * ---------------------------------------------------------------------------
 * CE QUE CE COMPOSANT GARANTIT, ET CE QU’IL NE GARANTIT PAS
 * ---------------------------------------------------------------------------
 *
 * GARANTI, quoi qu’il arrive :
 *   - le texte est en français et il est LISIBLE. La structure est du HTML
 *     sémantique — un `<h1>`, un paragraphe, deux actions — qui reste
 *     compréhensible sans une seule règle de style ;
 *   - la langue du document est déclarée, donc une synthèse vocale prononce
 *     correctement ;
 *   - le lien vers l’accueil est un `<a href="/">` ordinaire, PAS un
 *     `next/link` : il fonctionne même si le routeur est ce qui a échoué ;
 *   - aucune valeur littérale n’est écrite ici. Les styles passent par les
 *     utilitaires du système, comme partout ailleurs.
 *
 * NON GARANTI :
 *   - que la feuille de style soit chargée. Elle est importée ici pour être
 *     rattachée au graphe de ce module, mais si l’échec vient d’elle, rien ne
 *     peut la ressusciter. La page s’affiche alors sans identité visuelle —
 *     noir sur blanc, et parfaitement lisible ;
 *   - que les polices web soient disponibles. Les piles typographiques du
 *     système déclarent toutes un repli réel (Georgia, system-ui,
 *     ui-monospace) : à défaut d’Instrument Serif, le titre se compose dans
 *     un serif système. C’est une dégradation, pas une panne ;
 *   - que le mode sombre soit respecté. Le script d’amorçage vit dans la mise
 *     en page racine, celle qui vient d’échouer : cet écran s’affiche donc
 *     toujours en mode clair.
 *
 * Autrement dit : l’identité est un bonus, la lisibilité est le contrat.
 * ---------------------------------------------------------------------------
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang={GLOBAL_ERROR.lang}>
      <body className={fontVariables}>
        <main className="mx-gutter flex min-h-svh max-w-measure flex-col justify-center py-section-spacious">
          <p className="font-mono text-body-sm text-ink-subtle">{GLOBAL_ERROR.eyebrow}</p>
          <h1 className="section-rule mt-sm text-display-lg text-ink">
            {GLOBAL_ERROR.heading}
          </h1>
          <p className="mt-lg max-w-measure text-body-lg text-ink-muted">
            {GLOBAL_ERROR.message}
          </p>

          <div className="mt-2xl flex flex-col items-start gap-sm sm:flex-row sm:items-center sm:gap-lg">
            {/* `reset` rejoue le rendu sans recharger la page. C’est la seule
                action que le framework met a disposition ici. */}
            <button
              type="button"
              onClick={reset}
              className="button-primary inline-flex items-center px-md py-sm font-mono text-body-sm"
            >
              {GLOBAL_ERROR.retryLabel}
            </button>
            {/* Ancre ordinaire, et non `next/link` : si le routeur est en
                cause, seule une navigation complete du navigateur aboutit.
                La regle `no-html-link-for-pages` existe pour eviter un
                rechargement complet lors d'une navigation ordinaire ; ici le
                rechargement complet est precisement ce que l'on cherche, et
                c'est ce que la documentation de Next.js montre elle-meme dans
                ses exemples de `global-error`. Exception assumee, pas
                contournement. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="link-underline font-mono text-body-sm text-accent transition-colors duration-[var(--duration-fast)] ease-out hover:text-ink"
            >
              {GLOBAL_ERROR.homeLink}
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
