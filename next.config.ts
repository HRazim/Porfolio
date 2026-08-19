import type { NextConfig } from 'next';

/**
 * ---------------------------------------------------------------------------
 * CONTRAINTE D'ARCHITECTURE — COMPATIBILITE EXPORT STATIQUE
 * ---------------------------------------------------------------------------
 *
 * Cible de deploiement : Vercel (rendu serveur disponible).
 * Contrainte maintenue : le projet doit rester exportable en statique
 * (`output: 'export'`) sans reecriture. Voir AUDIT.md section 8.6.
 *
 * En consequence, les fonctionnalites suivantes sont INTERDITES dans ce
 * projet, y compris lorsque Vercel les rendrait disponibles :
 *
 *   - Aucune route API        (app/api/**, Route Handlers)
 *   - Aucune server action    ('use server')
 *   - Aucun middleware        (middleware.ts)
 *   - Aucune regeneration incrementale (ISR, `revalidate`, `unstable_cache`)
 *
 * Sont egalement exclus, pour la meme raison :
 *   - `redirects()`, `rewrites()`, `headers()` — non appliques a l'export
 *   - `next/image` avec optimisation a la demande : toute image devra etre
 *     pre-optimisee a la source, ou `images.unoptimized` devra etre active
 *     au moment de la bascule.
 *
 * Toute page doit donc etre rendue statiquement au build
 * (Server Component sans donnee dynamique, ou `generateStaticParams`).
 *
 * Pour basculer en export statique : ajouter `output: 'export'` ci-dessous
 * et `images: { unoptimized: true }`. Aucune autre modification ne doit
 * etre necessaire — c'est le critere de conformite de cette contrainte.
 * ---------------------------------------------------------------------------
 */
const nextConfig: NextConfig = {
  // `output: 'export'` non active : Vercel sert le rendu serveur.
  // La contrainte ci-dessus garantit que l'activer reste un changement
  // d'une ligne.

  typedRoutes: true,

  /**
   * PAS de bloc `images`, et c'est delibere.
   *
   * Un plafond `deviceSizes` / `imageSizes` a existe ici tant que le portrait
   * de la page d'accueil passait par `next/image`. Le portrait est desormais
   * rendu par un element `<picture>`, comme les visuels de realisation : plus
   * aucune image du site n'emprunte l'optimiseur, et ces reglages ne
   * gouvernaient donc plus rien.
   *
   * Consequence utile : toutes les images sont pre-encodees en AVIF et WebP,
   * aux largeurs exactes de leur affichage, et servies telles quelles. Le
   * passage a `output: 'export'` ne demande plus `images.unoptimized` — la
   * bascule redevient l'ajout d'une seule ligne, comme l'exige la contrainte
   * rappelee en tete de fichier.
   */
};

export default nextConfig;
