# Portfolio — guide du dépôt

Refonte du portfolio en Next.js. L'audit du site précédent fait référence :
voir `AUDIT.md` à la racine pour tout constat cité ici.

## Stack

| Outil        | Version | Note                                        |
| ------------ | ------- | ------------------------------------------- |
| Node         | ≥ 20.9  | exigence de `next@16`                       |
| Next.js      | 16.3.1  | App Router, `src/`, alias `@/*`             |
| React        | 19.2.8  |                                             |
| Tailwind CSS | 4.3.3   | configuration CSS-first, aucun fichier JS   |
| TypeScript   | 5.9.3   | `strict: true`                              |
| ESLint       | 9.39.5  | config plate (`eslint.config.mjs`)          |

Hébergement cible : Vercel.

## Règles du projet

### 1. Tailwind v4, configuration CSS-first

Toute la configuration vit dans le bloc `@theme` de `src/app/globals.css`.
**Ne crée jamais de `tailwind.config.ts` / `.js` / `.mjs`.**

Le périmètre d'analyse est restreint explicitement :
`@import 'tailwindcss' source(none);` puis `@source '../../src';`.
Sans cela, Tailwind balaie la racine et compile des classes trouvées dans
`legacy/` et dans la prose de `AUDIT.md`.

### 2. Jetons sémantiques, jamais de valeur littérale

`src/app/globals.css` est le **seul** fichier autorisé à contenir une valeur
de couleur, de taille, d'espacement ou de rayon. Partout ailleurs : uniquement
des utilitaires Tailwind ou `var(--jeton)`.

Les jetons portent un nom d'**intention**, jamais de valeur : `--color-ink`,
`--color-paper`, `--color-accent`. Aucune échelle numérique de type
`blue-500`. Les espaces de noms Tailwind par défaut sont remis à zéro
(`--color-*: initial`, etc.), ce qui rend `bg-blue-500` littéralement
inexistant.

Contraintes acquises, à ne pas régresser (AUDIT.md §7.2, §7.3, §7.4) :

- échelle typographique modulaire, raison constante 1,25, huit niveaux ;
- `rem` exclusivement pour les tailles de police — `em` est proscrit
  (`em` reste correct pour `letter-spacing`) ;
- espacement en base 4 px ;
- trois rayons de bordure, pas un de plus ;
- WCAG AA sur toute combinaison texte/fond, thème clair et thème sombre ;
- `prefers-reduced-motion: reduce` neutralise transitions et animations ;
- **aucune règle ne pose `opacity: 0` en état de repos.** Une apparition au
  défilement l'a fait, et vingt-neuf sections du site pouvaient rester
  invisibles pour toujours : le masquage dépendait d'un événement JavaScript,
  et le filet de sécurité était désarmé par l'hydratation. La seule opacité
  nulle autorisée est un premier keyframe, dans une animation à durée finie
  qui se termine sans dépendre de quoi que ce soit.

### 3. `legacy/` ne s'importe pas

`legacy/` archive le site vanilla précédent. Il sert de **référence de contenu
et de visuels**. Il n'est jamais servi, jamais déployé, jamais importé, jamais
analysé par Tailwind.

La règle ESLint `no-restricted-imports` fait échouer le lint sur tout import
depuis ce dossier. Recopie ce qui est utile dans `src/`, ne le référence pas.

### 4. Aucune bibliothèque d'icônes, de composants ou d'animation

Le site précédent téléchargeait 258 Ko de polices Font Awesome pour 17
pictogrammes (AUDIT.md §4.5). Les icônes sont des SVG en ligne, écrits à la
main. Font Awesome ne doit réapparaître sous aucune forme, paquet React
compris.

### 5. Nommage en kebab-case minuscule

Tous les fichiers et dossiers, sans exception : `mode-toggle.tsx`,
`design-tokens.ts`, `use-token-values.ts`.

Motif : la configuration Git locale est insensible à la casse
(`core.ignorecase = true`) alors que la construction Vercel s'exécute sous
Linux, qui y est sensible. Une divergence de casse passerait inaperçue en
local et casserait le déploiement (AUDIT.md §4.6).

### 6. Compatibilité export statique

Le projet doit rester exportable en statique (`output: 'export'`) sans
réécriture, même si Vercel n'y oblige pas. Sont donc **interdits** :

- route API (`app/api/**`) et tout Route Handler écrit à la main ;
- server action (`'use server'`) ;
- middleware (`middleware.ts`) ;
- régénération incrémentale (ISR, `revalidate`).

Toute page doit être rendue statiquement au build.

**Exception : les routes de métadonnées.** `robots.ts`, `sitemap.ts` et les
`opengraph-image.tsx` sont compilés en Route Handlers par Next.js, et ils sont
nécessaires. Ils sont autorisés à deux conditions, apprises en le vérifiant :

1. chacune **doit** exporter `dynamic = 'force-static'`, faute de quoi l'export
   échoue sur « dynamic = force-static not configured » ;
2. une route d'image sous segment dynamique **doit** déclarer son propre
   `generateStaticParams`, et ne peut pas employer `generateImageMetadata` —
   celle-ci ajoute un segment `[__metadata_id__]` que l'export exige
   d'énumérer et que `generateStaticParams` ne parvient pas à renseigner.

**La règle se vérifie par une commande, et cette commande fait partie des
contrôles avant publication :**

```bash
npm run build          # compile et contrôle les types
npm run lint           # doit être muet
npm run verify:export  # doit afficher « SUCCÈS »
npm run verify:map     # doit afficher « SUCCÈS »
npm run verify:a11y    # doit afficher « ERREURS : AUCUNE »
```

`verify:map` vérifie **la destination** des liens de lieu, pas leur existence.
Un lien qui mène au mauvais endroit était invisible pour tout le reste : le
contrôle des liens internes écarte par construction les cibles qui ne
commencent pas par `/`, l'audit d'accessibilité juge le nom et le contraste
d'un lien sans jamais le suivre, et le compilateur ne sait pas qu'Egis n'est
pas à Trappes. **Un contrôle qui n'a jamais échoué ne prouve rien** : celui-ci
a été vérifié en intervertissant deux requêtes, ce qu'il signale seize fois —
deux entrées, deux règles, quatre langues.

`verify:export` construit avec `STATIC_EXPORT=1`, que `next.config.ts` traduit
en `output: 'export'`. Il ne modifie aucun fichier et nettoie le `out/` produit.

Elle a été prise en défaut une fois : `robots.ts` la violait depuis sa
création, sans que personne l'ait constaté — parce que rien ne la vérifiait.

### 7. Polices versionnées

`src/assets/fonts/` contient deux fichiers TTF — Instrument Serif et JetBrains
Mono. Ils ne sont **pas** servis au navigateur : `next/font/google` s'en
charge, en WOFF2. Ils existent parce que Satori, qui peint les vignettes de
partage, n'accepte ni WOFF2 ni variable CSS. Sans eux, les vignettes seraient
composées dans une police de repli, ou dépendraient d'un appel réseau pendant
la construction.

Les deux sont sous SIL Open Font License, qui autorise la redistribution.

### 8. TypeScript

`strict: true`. Le type `any` est interdit — la règle
`@typescript-eslint/no-explicit-any` est en erreur.

### 9. Ce qui se voit se mesure dans un navigateur

Pendant toute la construction de ce site, aucune page n'a été observée dans un
navigateur : les contrôles portaient sur le HTML produit, la feuille de style
compilée et des modèles de composition. Un modèle ne voit pas ce qu'un moteur
de rendu peint.

Il l'a prouvé. `globals.css` documente que `--color-accent-soft` ne porte
jamais l'accent lisible, **et donne le chiffre : 3,87:1**. Le sélecteur de
langue posait exactement cette paire depuis sa création. Aucun contrôle ne l'a
vu, parce qu'aucun ne regardait les paires que le BALISAGE compose : le calcul
depuis les jetons vérifie les paires que le système déclare, pas celles que
deux utilitaires Tailwind forment en se rencontrant dans un fichier TSX.

```bash
npm run verify:a11y      # audit sur rendu réel — bloquant avant publication
npm run capture:screens  # captures de référence dans captures/, non versionnées
```

`playwright` est une **dépendance de développement**, importée par `scripts/`
et par rien d'autre. Elle ne doit jamais apparaître dans `src/`. Son navigateur
se télécharge hors du projet (`npx playwright install chromium`, une fois) : il
n'y a rien à ignorer pour lui, contrairement à `captures/`.

Trois principes tenus par l'audit, à ne pas régresser :

- **le fond n'est pas déduit, il est lu.** Une passe rend tous les textes
  transparents et la capture montre le fond seul — calques translucides,
  dégradés, opacités héritées compris ;
- **les états comptent.** Repos, replis dépliés, survol, focus, et focus des
  éléments qui n'apparaissent qu'alors. Un contraste juste au repos peut être
  faux au survol ;
- **il faut attendre la fin du mouvement.** Mesurer sans attendre les
  transitions donne des couleurs intermédiaires : le même déclencheur a rendu
  2,30:1 puis 5,45:1 selon la largeur, pour une seule règle CSS. Ce n'était pas
  un défaut du site, c'était un défaut de la mesure ;
- **une mesure fausse se démontre comme un défaut.** Trois des quatre constats
  initiaux de cet audit venaient de la sonde, pas du site : du texte compté
  dans un repli fermé, un lien d'évitement révélé qui recouvrait l'en-tête, un
  liseret circulaire échantillonné aux coins d'un rectangle. Chacun a été
  reproduit au pixel avant d'être corrigé. Un audit qui crie au loup est aussi
  inutile qu'un audit muet.

## Stratégie de branches

- `develop` — branche de travail. Tous les commits incrémentaux y vont.
- `main` — versions publiées uniquement. Aucun commit direct.

Les fusions `develop` → `main` se font à des jalons explicites, avec
`--no-ff` et une étiquette annotée.

Commits au format Conventional Commits : `type: description à l'impératif`,
en anglais, en minuscules, sans point final.

## Note Next.js

Cette version de Next.js comporte des changements de rupture : APIs,
conventions et structure de fichiers peuvent différer de ce que tu connais.
Lis le guide concerné dans `node_modules/next/dist/docs/` avant d'écrire du
code, et tiens compte des avis de dépréciation.

`next dev` régénère un fichier `AGENTS.md` à la racine à chaque lancement. Il
est volontairement listé dans `.gitignore` : son contenu utile est repris
ci-dessus.
