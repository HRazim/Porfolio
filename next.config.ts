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
 * CETTE CONTRAINTE EST DESORMAIS VERIFIABLE, ET VERIFIEE.
 *
 *     npm run verify:export
 *
 * Le script construit le projet avec `STATIC_EXPORT=1` et echoue si la
 * construction echoue. Il n'ecrit rien dans ce fichier : la bascule passe par
 * une variable d'environnement, de sorte que le controle soit reproductible et
 * ne puisse pas laisser le depot dans un etat intermediaire.
 *
 * La regle avait ete ecrite ici des l'origine et jamais executee. Elle etait en
 * defaut : `robots.ts` n'exportait pas `dynamic = 'force-static'`. Une regle
 * qu'aucune commande ne verifie n'est pas une regle, c'est une intention.
 * ---------------------------------------------------------------------------
 */
const nextConfig: NextConfig = {
  /**
   * Export statique a la demande, pilote par l'environnement.
   *
   * Hors verification, la valeur est `undefined` : Vercel sert le rendu
   * serveur, exactement comme avant. Sous `STATIC_EXPORT=1`, Next.js produit
   * `out/` — et refuse de construire si une seule route n'est pas statique.
   */
  output: process.env.STATIC_EXPORT === '1' ? 'export' : undefined,

  typedRoutes: true,

  /**
   * Page 404 globale.
   *
   * NECESSAIRE DEPUIS QUE LE SITE A QUATRE MISES EN PAGE RACINES. Une adresse
   * qui ne correspond a aucune route n'appartient a aucune langue : Next.js ne
   * peut donc pas choisir la racine dans laquelle composer la 404, et sert sa
   * page par defaut — sans styles, sans en-tete, sans un mot ecrit ici. La
   * documentation nomme ce cas explicitement et donne ce drapeau pour reponse.
   *
   * Constate, pas suppose : sans lui, `_not-found.html` faisait 7,9 Ko et ne
   * portait meme pas d'attribut `lang`.
   *
   * Le drapeau est marque experimental par Next.js. Il n'active aucune
   * fonctionnalite dynamique et ne compromet pas l'export statique, que
   * `npm run verify:export` continue de verifier.
   */
  experimental: {
    globalNotFound: true,
  },

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
