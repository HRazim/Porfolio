# Portfolio — MAROUAN Hazim-Rayan

Code source du portfolio personnel de MAROUAN Hazim-Rayan, en ligne sur
**<https://hazim-rayan-marouan.vercel.app>**.

## Stack

| Outil        | Version | Note                                             |
| ------------ | ------- | ------------------------------------------------ |
| Node         | ≥ 20.9  | exigence de `next@16`                            |
| Next.js      | 16.3.1  | App Router, `src/`, alias `@/*`                  |
| React        | 19.2.8  |                                                  |
| Tailwind CSS | 4.3.3   | configuration CSS-first, aucun fichier JS        |
| TypeScript   | 5.9.3   | `strict: true`, `any` interdit par le linter     |
| ESLint       | 9.39.5  | configuration plate (`eslint.config.mjs`)        |

Aucune dépendance en production hors `next`, `react` et `react-dom` : ni
bibliothèque d'icônes, ni bibliothèque de composants, ni bibliothèque
d'animation.

Hébergement : Vercel.

## Démarche

Ce dépôt contient un site **entièrement refondu**. Le site précédent, écrit en
HTML, CSS et JavaScript vanilla, est archivé dans [`legacy/`](legacy/) : il
n'est jamais servi, jamais déployé, jamais importé, et une règle ESLint fait
échouer le lint sur toute tentative. Il sert de référence de contenu, rien de
plus.

La refonte n'est pas partie d'une page blanche mais d'un audit technique
exhaustif de l'existant, consigné dans [`AUDIT.md`](AUDIT.md) — 1 700 lignes,
douze chapitres, chaque constat référencé par fichier et par ligne.

Ce que l'audit a relevé, et ce qu'il en a été fait :

| Constat | Correction |
| ------- | ---------- |
| **258 Ko de polices Font Awesome** pour 17 pictogrammes (§4.5) | pictogrammes en SVG écrits à la main ; aucune bibliothèque d'icônes |
| **20 valeurs de couleur pour 8 rôles réels**, 6 paires de quasi-doublons, **zéro variable CSS** (§7.2) | onze jetons sémantiques, deux modes, valeurs résolues par calcul |
| **17 tailles de police**, rapports de 1,071 à 1,250, `rem` et `em` en collision (§7.3) | échelle modulaire de huit niveaux, raison constante 1,25, `rem` exclusivement |
| espacement de base 5 px au pas irrégulier, **5 rayons de bordure** (§7.4) | base 4 px garantie par construction, trois rayons |
| **95 caractères par ligne**, contre 45 à 75 recommandés (§7.6) | mesure bornée à 66 `ch` |
| **701 lignes de CSS sans une seule occurrence de `:focus`** (§5.4) | anneau de focus systématique, focus clavier traité partout |
| **112 lignes de balisage recopiées** sur 522, avec divergence déjà constatée (§3.6) | en-tête, navigation et pied déclarés une seule fois |
| **10 liens `target="_blank"` sans `rel`**, sans mention d'ouverture (§5.4) | un composant unique, `rel="noopener noreferrer"` et mention accessible |
| ni sitemap, ni `robots.txt`, ni canonique, ni donnée structurée, ni favicon (§6) | les six présents, alimentés par le schéma de contenu |
| **23 balises `<strong>` pour 223 mots** — une tous les 9,7 mots (§8.2) | aucune mise en gras à l'intérieur des paragraphes |
| `prefers-reduced-motion` totalement ignoré (§5.4) | animations neutralisées en bloc, contenu jamais masqué |

## Partis pris techniques

**Les valeurs littérales vivent dans un seul fichier.** Couleurs, tailles,
espacements et rayons sont déclarés dans le bloc `@theme` de
[`src/app/globals.css`](src/app/globals.css). Partout ailleurs : utilitaires
Tailwind ou `var(--jeton)`. Les espaces de noms par défaut de Tailwind sont
remis à zéro, ce qui rend `bg-blue-500` littéralement inexistant — la règle
n'est pas une discipline, elle est opposable.

**Le contenu est typé et vit hors du balisage.** Réalisations, parcours et
textes d'interface sont des données TypeScript sous
[`src/content/`](src/content/). Aucun composant ne contient de prose, ce qui
rend la contrainte vérifiable par simple recherche.

**Les images sont produites à l'avance, en AVIF et WebP.** Chaque visuel est
servi par `<picture>` avec un `srcset` par largeur réellement encodée. Aucune
dépendance à l'optimiseur d'images de Next.js, donc aucun obstacle à l'export
statique.

**L'export statique reste possible.** Aucune route API, aucune action serveur,
aucun middleware, aucune régénération incrémentale. La contrainte n'est pas
supposée : `npm run verify:export` la vérifie, et fait partie des contrôles
avant publication.

**La conformité WCAG AA est calculée, pas estimée.** Les clartés des jetons de
texte sont résolues par dichotomie jusqu'au ratio visé, puis la chroma est
poussée au bord du gamut sRGB. La page `/styleguide` recalcule tous les ratios
à l'exécution, depuis les variables CSS réelles : le tableau ne peut pas
mentir.

## Arborescence

```
├── AUDIT.md                    audit technique du site précédent
├── CLAUDE.md                   conventions du dépôt, à lire avant toute modification
├── LICENSE                     code sous licence MIT, contenu réservé
├── captures/                   captures de référence — artefacts, non versionnés
├── legacy/                     archive du site vanilla — jamais servie
├── public/                     actifs servis tels quels : images AVIF/WebP, CV
├── scripts/                    contrôles reproductibles
│   ├── verify-static-export.mjs  export statique
│   ├── verify-a11y.mjs           accessibilité, sur rendu réel
│   ├── capture-screens.mjs       captures de référence
│   ├── browser-harness.mjs       construit, sert, ouvre le navigateur
│   └── lib/                      décodeur PNG, sonde exécutée dans la page
└── src/
    ├── app/                    App Router
    │   ├── globals.css         design system — SEUL lieu des valeurs littérales
    │   ├── layout.tsx          chrome du site, métadonnées globales, JSON-LD
    │   ├── global-error.tsx    repli si la mise en page racine échoue
    │   ├── not-found.tsx       page 404
    │   ├── page.tsx            accueil
    │   ├── a-propos/           parcours personnel et lectures
    │   ├── parcours/           formation, expériences, langues
    │   ├── realisations/       index et fiches détaillées (route dynamique)
    │   ├── styleguide/         démonstration du design system — non indexée
    │   ├── opengraph-image.tsx vignette de partage, rendue à la construction
    │   ├── robots.ts           robots.txt
    │   └── sitemap.ts          sitemap.xml, alimenté par le schéma de contenu
    ├── assets/fonts/           deux polices TTF, pour les vignettes de partage
    ├── components/
    │   ├── layout/             primitives de mise en page et chrome du site
    │   ├── project/            vignettes et fiches de réalisation
    │   ├── styleguide/         composants de la page de démonstration
    │   └── ui/                 pictogrammes et liens
    ├── content/                LE CONTENU — données typées, aucune prose ailleurs
    │   ├── career.ts           formation, expériences, langues, lectures
    │   ├── period.ts           périodes datées, granularité variable
    │   ├── projects.ts         réalisations, méthode STAR
    │   └── site-copy.ts        tous les textes d'interface
    └── lib/                    utilitaires — contraste, jetons, polices, métadonnées
```

## Commandes

```bash
npm install                      # installation des dépendances
npx playwright install chromium  # navigateur de vérification, une seule fois
npm run dev                      # serveur de développement, http://localhost:3000
npm run build                    # compilation de production
npm run start                    # sert la compilation de production
npm run lint                     # ESLint
npm run verify:export            # vérifie que le projet reste exportable en statique
npm run verify:a11y              # audit d'accessibilité sur rendu réel
npm run verify:all               # les quatre contrôles, dans l'ordre
npm run capture:screens          # captures de référence dans captures/
```

### Le navigateur de vérification

`playwright` est une **dépendance de développement**. Il n'est importé que par
`scripts/`, jamais par `src/` : rien de lui n'entre dans le paquet servi, et
`npm run verify:a11y` le prouve à chaque exécution par la commande donnée plus
bas.

Il a été retenu pour trois raisons précises, et non par préférence :

- il pilote Chromium **sans interface**, donc dans une session sans écran ;
- il donne accès au **protocole de déverminage** du navigateur, seul moyen de
  forcer un état `:hover` ou `:focus-visible` sans souris et de demander à
  Chromium **son propre calcul des noms accessibles** plutôt que de le
  reconstruire ;
- il télécharge son navigateur **hors du projet**
  (`%LOCALAPPDATA%\ms-playwright`, `~/.cache/ms-playwright` ailleurs) : rien à
  ignorer, rien à versionner.

Le navigateur n'est pas installé par `npm install` : la commande
`npx playwright install chromium` doit être lancée une fois. Sans elle,
`verify:a11y` échoue en le disant.

### Vérifications avant publication

Les quatre commandes suivantes doivent passer, dans cet ordre :

```bash
npm run build          # compile, et exécute le contrôle de types TypeScript
npm run lint           # doit être muet
npm run verify:export  # doit afficher « SUCCÈS »
npm run verify:a11y    # doit afficher « ERREURS : AUCUNE »
```

`npm run verify:all` les enchaîne.

`verify:export` reconstruit le projet avec `STATIC_EXPORT=1`, ce que
`next.config.ts` traduit en `output: 'export'`. Next.js refuse alors de
construire si une seule route n'est pas entièrement statique. Le script ne
modifie aucun fichier et supprime le `out/` qu'il produit.

Ce contrôle existe parce que la règle d'export statique, inscrite depuis
l'origine, n'avait jamais été exécutée — et qu'elle était en défaut. Une règle
qu'aucune commande ne vérifie n'est pas une règle.

`verify:a11y` construit le site en export statique, le sert sur un port
éphémère, ouvre chaque page dans Chromium et **mesure les pixels réellement
peints**. Le contraste n'y est pas déduit des jetons : une passe rend tous les
textes transparents — rien d'autre ne bouge — et la capture montre alors le
fond seul, calques translucides, dégradés et opacités héritées compris. Cinq
états sont mesurés : repos, replis dépliés, survol, focus, et focus des
éléments qui n'apparaissent qu'à ce moment-là.

Il existe pour la même raison que le précédent. Le calcul depuis les jetons
déclarait `--color-accent-soft` incompatible avec l'accent — **3,87:1, chiffre
écrit dans `globals.css`** — et le sélecteur de langue posait pourtant l'un sur
l'autre. Aucun contrôle ne regardait les paires que le balisage compose
réellement ; le navigateur, lui, les voit.

## Branches

- `develop` — branche de travail. Tous les commits incrémentaux y vont.
- `main` — versions publiées uniquement. Aucun commit direct.

Les fusions `develop` → `main` se font à des jalons explicites, avec `--no-ff`
et une étiquette annotée, de sorte que `git log --first-parent main` reste une
liste de versions lisible.

Les messages suivent la convention Conventional Commits : `type: description à
l'impératif`, en anglais, en minuscules, sans point final.

## Licence

Le **code** est sous licence MIT : il peut être lu, copié et réutilisé.

Le **contenu éditorial et les images** — textes, fiches de réalisation,
portrait, captures d'écran, CV — ne sont pas réutilisables. Ils décrivent le
parcours d'une personne réelle ; les republier reviendrait à s'approprier une
biographie.

Voir [`LICENSE`](LICENSE).
