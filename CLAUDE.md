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
- `prefers-reduced-motion: reduce` neutralise transitions et animations.

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

Tous les fichiers et dossiers, sans exception : `theme-toggle.tsx`,
`design-tokens.ts`, `use-token-values.ts`.

Motif : la configuration Git locale est insensible à la casse
(`core.ignorecase = true`) alors que la construction Vercel s'exécute sous
Linux, qui y est sensible. Une divergence de casse passerait inaperçue en
local et casserait le déploiement (AUDIT.md §4.6).

### 6. Compatibilité export statique

Le projet doit rester exportable en statique (`output: 'export'`) sans
réécriture, même si Vercel n'y oblige pas. Sont donc **interdits** :

- route API (`app/api/**`, Route Handlers) ;
- server action (`'use server'`) ;
- middleware (`middleware.ts`) ;
- régénération incrémentale (ISR, `revalidate`).

Toute page doit être rendue statiquement au build.

### 7. TypeScript

`strict: true`. Le type `any` est interdit — la règle
`@typescript-eslint/no-explicit-any` est en erreur.

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
