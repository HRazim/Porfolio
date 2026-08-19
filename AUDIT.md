# AUDIT TECHNIQUE — Portfolio MAROUAN Hazim-Rayan

**Date de l'audit :** 19 août 2026
**Commit audité :** `4324aeb` — « FINAL Portfolio » (19 mars 2025)
**Branche :** `main`
**Périmètre :** 19 fichiers versionnés, 1 325 lignes de code source, 3 464 367 octets
**Nature du document :** constat uniquement. Aucune correction de code n'est proposée ici.

---

## 1. Synthèse exécutive

Le site fonctionne et son contenu est réel, mais il repose sur des fondations fragiles.
Une seule photo pèse 2,3 Mo, soit 86 % du poids de la page d'accueil : le site est
donc environ dix fois plus lourd qu'il ne devrait l'être. Une bibliothèque d'icônes
externe télécharge 360 Ko de polices pour n'afficher que 17 pictogrammes.
Le menu mobile est impossible à ouvrir au clavier, ce qui exclut une partie des
visiteurs. Sur les deux pages de projet, le script JavaScript produit une erreur à
chaque mouvement de défilement. Côté référencement, il n'existe ni description, ni
image de partage, ni favicon, ni plan de site : partagé sur LinkedIn, le lien
n'affichera aucun aperçu. Enfin, l'en-tête et le pied de page sont recopiés à
l'identique dans les trois pages, et un tiers des styles ne correspond à aucun
élément affiché. Rien de tout cela n'est bloquant pour une refonte : au contraire,
le contenu rédactionnel est récupérable et l'absence totale d'identité typographique
laisse le champ entièrement libre.

---

## 2. Étape 1 — Cartographie de l'existant

### 2.1 Inventaire des fichiers (hors `.git`)

| Fichier | Octets | Type |
|---|---:|---|
| `index.html` | 12 222 | HTML |
| `pages/plateformeWeb.html` | 11 189 | HTML |
| `pages/archilog.html` | 3 821 | HTML |
| `styles/style.css` | 12 771 | CSS |
| `js/script.js` | 3 386 | JS |
| `pdf/cv.pdf` | 386 977 | PDF |
| `img/profile.jpg` | 2 331 031 | Image |
| `img/archilog_screenshot2.png` | 120 798 | Image |
| `img/profile-connection-inscription.png` | 95 077 | Image |
| `img/accueil.png` | 89 971 | Image |
| `img/archilog_screenshot1.png` | 87 302 | Image |
| `img/creation-compte.png` | 68 285 | Image |
| `img/Porbability.png` | 65 979 | Image |
| `img/module-probabilite.png` | 57 085 | Image |
| `img/login.png` | 54 433 | Image |
| `img/fiche.png` | 44 566 | Image |
| `img/rectangles-gauche.PNG` | 10 484 | Image |
| `img/trapezes.png` | 4 709 | Image |
| `img/rectangles-medians.png` | 4 281 | Image |
| **TOTAL** | **3 464 367** | 19 fichiers |

Volumétrie en lignes : `index.html` 229, `pages/plateformeWeb.html` 208,
`pages/archilog.html` 85, `styles/style.css` 701, `js/script.js` 102 — **1 325 lignes**.

**Fichiers structurants absents** (vérifiés un par un) : `package.json`, `.gitignore`,
`README.md`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `CNAME`, `.nojekyll`,
`LICENSE`, `netlify.toml`, `vercel.json`. Aucun dossier `.github/`.

### 2.2 État du dépôt

```
$ git rev-list --count HEAD
9

$ git status
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean

$ git branch -a
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main

$ git remote -v
origin	https://github.com/HRazim/Porfolio.git (fetch)
origin	https://github.com/HRazim/Porfolio.git (push)
```

- **9 commits**, tous du même auteur (`HRazim`), entre le 11 mars 2025 et le 19 mars 2025.
- **1 seule branche locale** (`main`), 1 branche distante (`origin/main`). Aucune branche de travail.
- **Aucune modification non commitée** au moment du lancement de l'audit.
- Le dernier commit (`4324aeb`) est un déplacement massif : les fichiers étaient dans
  un sous-dossier `Portfolio/` et ont été remontés à la racine (19 entrées `R100`/`R09x`).
- `git config core.ignorecase` = **`true`** (poste Windows) : une divergence de casse
  dans un chemin d'image passerait inaperçue en local et casserait sur un hébergeur Linux.
- Deux commits consécutifs portent le même message « FINAL Portfolio » (`91835a9`, `4324aeb`).
- `README.md` a été créé au commit initial puis supprimé au commit `0a4a75b`.

### 2.3 Fichiers HTML

#### `index.html` (229 lignes)

**Sections** (toutes des `<section>` enfants directs de `<body>`, sans `<main>`) :

| Ligne | Balise | `id` | `class` |
|---:|---|---|---|
| 12 | `header` | — | — |
| 33 | `section` | `accueil` | `hero` |
| 56 | `section` | `a-propos` | `about` |
| 80 | `section` | `skills` | `skills` |
| 117 | `section` | `projects` | `projects` |
| 165 | `section` | `contact` | `contact` |
| 211 | `footer` | — | — |

**Identifiants déclarés :** `accueil` (33), `a-propos` (56), `skills` (80),
`projects` (117), `contact` (165). Aucun autre `id` sur la page.

**Classes employées :** `logo` (13), `hamburger` (24), `bar` (25-27), `hero` (33),
`hero-content` (34), `hero-image` (35), `hero-text` (38), `social-icons` (41, 213),
`sr-only` (44, 48, 216, 220), `about` (56), `container` (57, 81, 118, 212),
`section-title` (58, 82, 119, 167), `about-content` (59), `project-info` (60, 69, 123, 143),
`skills` (80), `skills-container` (83), `skill-card` (84, 88, 92, 96, 100, 104, 108),
`projects` (117), `projects-grid` (120), `project-card` (122, 142),
`project-links` (134, 154), `contact` (165), `content` (166), `row` (168),
`card` (169, 178, 187, 196), `reveal` (169, 178, 187, 196),
`contact-icon` (170, 179, 188, 197), `info` (173, 182, 191, 200).

**Dépendances CDN :** une seule — `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` (ligne 8).

**Polices :** aucune police web déclarée. Aucun `<link>` vers Google Fonts, aucun `@font-face`.
La seule famille est celle du CSS local (`styles/style.css:9`).

**Bibliothèque d'icônes :** Font Awesome 6.4.0, familles `fab` (brands) et `fas` (solid).

#### `pages/archilog.html` (85 lignes)

| Ligne | Balise | `id` | `class` |
|---:|---|---|---|
| 13 | `header` | — | — |
| 32 | `main` | — | — (**jamais fermée**, cf. §3.7) |
| 33 | `section` | — | `about` |
| 48 | `section` | — | `about` |
| 67 | `footer` | — | — |

**Aucun `id`** sur toute la page. Classes : `logo`, `hamburger`, `bar`, `about`,
`container` (34, 49, 68), `section-title` (36, 50), `about-content` (37, 51),
`highlight-text` (38), `section-image` (40), `feature-image` (41, 61),
`social-icons` (69), `sr-only` (72, 76).
**CDN :** Font Awesome 6.4.0 (ligne 9). **Métadonnée `description`** présente (ligne 6).

#### `pages/plateformeWeb.html` (208 lignes)

| Ligne | Balise | `id` | `class` |
|---:|---|---|---|
| 12 | `header` | — | — |
| 32 | `main` | — | — |
| 34 | `section` | `page-accueil` | `about` |
| 49 | `section` | `creation-compte` | `about` |
| 77 | `section` | `login` | `about` |
| 95 | `section` | `module-probabilite` | `feature-section` |
| 134 | `article` | `methode-rectangles-gauche` | `method-card` |
| 145 | `article` | `methode-rectangles-medians` | `method-card` |
| 156 | `article` | `methode-trapezes` | `method-card` |
| 191 | `footer` | — | — |

**7 identifiants**, dont **aucun n'est la cible d'un lien** dans le site (cf. §3.5).
Classes additionnelles : `highlight-text` (56), `alert-box warning` (62),
`intro-text` (102), `parameters-card` (106), `parameter-list` (108), `info-note` (122),
`method-intro` (127), `methods-container` (132), `method-image` (136, 147, 158),
`method-description` (137, 148, 159), `user-actions` (167), `btn-highlight` (169, 175, 178 ×2),
`fiche-container` (182), `feature-section` (95), `section-image`, `feature-image`.
**CDN :** Font Awesome 6.4.0 (ligne 8).

### 2.4 Feuille de style `styles/style.css` (701 lignes)

**105 blocs de règles** au total. Sélecteurs de premier niveau, dans l'ordre du fichier :

| L. | Sélecteur | L. | Sélecteur | L. | Sélecteur |
|---:|---|---:|---|---:|---|
| 2 | `*` | 253 | `.project-info p` | 475 | `article` |
| 8 | `body` | 259 | `.project-info ul` | 484 | `article:hover` |
| 14 | `.container` | 264 | `.project-info li` | 488 | `article h2` |
| 20 | `section` | 271 | `.project-info li strong` | 496 | `article h2::after` |
| 24 | `a` | 275 | `.project-links` | 506 | `article img` |
| 29 | `.section-title` | 281 | `.project-links a` | 513 | `article p` |
| 36 | `.section-title::after` | 294 | `.project-links a:first-child` | 519 | `.about-content ul` |
| 46 | `header` | 300 | `.project-links a:hover` | 525 | `.about-content ul li` |
| 61 | `header .logo h1` | 305 | `.project-links a:first-child:hover` | 536 | `.about .container` |
| 67 | `nav ul` | 312 | `.projects-grid` | 542 | `.about img` |
| 72 | `nav ul li` | 316 | `.project-card` | 546 | `article` |
| 76 | `nav ul li a` | 323 | `.contact .content` | 553 | `article h2` |
| 82 | `nav ul li a:hover` | 332 | `.contact .content .row` | 557 | `article:nth-child(odd) img` |
| 86 | `.hamburger` | 339 | `… .row .card` | 561 | `article:nth-child(even) img` |
| 91 | `.bar` | 352 | `… .card .contact-icon` | 567 | `.container` |
| 100 | `.hero` | 360 | `… .card:hover .contact-icon` | 574 | `.fiche-container` |
| 109 | `.hero-content` | 364 | `… .card .info` | 584 | `from` / 585 `to` |
| 118 | `.hero-image img` | 368 | `… .card .info h3` | 588 | `section` |
| 127 | `.hero-text h2` | 375 | `… .card .info span` | 592 | `section:nth-child(2)` |
| 133 | `.hero-text p` | 380 | `.contact-form` | 593 | `section:nth-child(3)` |
| 139 | `.social-icons` | 389 | `.contact-form h3` | 594 | `section:nth-child(4)` |
| 145 | `.social-icons a` | 397 | `.contact-form .input-box` | 597 | `button, .btn` |
| 158 | `.social-icons a:hover` | 403 | `… input, … textarea` | 608 | `button:hover, .btn:hover` |
| 164 | `.about` | 416 | `… .send-btn` | 618 | `footer` |
| 168 | `.about-content` | 430 | `… .send-btn:hover` | 627 | `.section-title` |
| 175 | `.about-content p` | 436 | `.section-image, .fiche-container` | 631 | `.hero-text h2` |
| 180 | `.skills` | 444 | `img` | 637 | `header` |
| 184 | `.skills-container` | 455 | `img:hover` | 641 | `nav ul` |
| 191 | `.skill-card` | 461 | `section` | 654 | `nav ul.active` |
| 201 | `.skill-card:hover` | 466 | `section:nth-child(even)` | 658 | `nav ul li` |
| 205 | `.skill-card i` | 470 | `section:nth-child(odd)` | 662 | `.hamburger` |
| 211 | `.skill-card h3` | 217 | `.project-image img` | 666 | `.hero-content` |
| 224 | `.project-card:hover .project-image img` | 228 | `.project-info` | 671 | `.hero-text h2` |
| 235 | `.project-info h3` | 243 | `.project-info h3::after` | 675 | `.section-title` |
| 679 | `.contact-content` | 685 | `.hero-image img` | 690 | `.hero-text h2` |
| 694 | `.hero-text p` | 698 | `.section-title` | | |

**Aucun sélecteur `#id`** dans toute la feuille (0 occurrence).
**Aucune variable CSS** (`--*`) : 0 occurrence. **Aucune couche** (`@layer`), aucun `:root`.

**Couleurs en dur — 20 valeurs distinctes, 71 occurrences :**

| Valeur | Occ. | Lignes |
|---|---:|---|
| `#fff` | 14 | 123, 152, 165, 192, 285, 295, 340, 381, 417, 471, 476, 575, 620, 647 |
| `#4285f4` | 13 | 41, 64, 83, 151, 207, 250, 284, 296, 297, 489, 503, 529, 598 |
| `#333` | 8 | 11, 26, 94, 130, 159, 238, 272, 619 |
| `#111` | 4 | 369, 390, 405, 411 |
| `#3367d6` | 4 | 301, 307, 308, 609 |
| `rgba(0, 0, 0, 0.1)` | 4 | 56, 124, 448, 578 |
| `#666` | 3 | 135, 254, 376 |
| `#f9f9f9` | 3 | 105, 181, 329 |
| `rgba(0, 0, 0, 0.05)` | 3 | 195, 478, 531 |
| `#3a6cf4` | 2 | 353, 418 |
| `#555` | 2 | 265, 515 |
| `#f8f9fa` | 2 | 467, 528 |
| `rgba(1, 1, 1, 0.15)` | 2 | 348, 386 |
| `#235bf6` | 1 | 431 |
| `#eee` | 1 | 510 |
| `#f5f9ff` | 1 | 306 |
| `rgba(0, 0, 0, 0.15)` | 1 | 457 |
| `rgba(255, 255, 255, 0.95)` | 1 | 55 |
| `rgba(66, 133, 244, 0.3)` | 1 | 611 |
| `white` (mot-clé) | 1 | 599 |

**Familles de polices — 1 seule déclaration :** `font-family: 'Arial', sans-serif`
(`styles/style.css:9`). Aucune autre déclaration `font-family` dans le fichier.

**Points de rupture des media queries — 4 blocs, 3 seuils :**

| Ligne | Requête | Règles contenues |
|---:|---|---|
| 311 | `@media (max-width: 768px)` | `.projects-grid`, `.project-card` |
| 535 | `@media (min-width: 768px)` | `.about .container`, `.about img`, `article`, `article h2`, `article:nth-child(odd/even) img` |
| 626 | `@media (max-width: 992px)` | `.section-title`, `.hero-text h2` |
| 636 | `@media (max-width: 768px)` | `header`, `nav ul`, `nav ul.active`, `nav ul li`, `.hamburger`, `.hero-content`, `.hero-text h2`, `.section-title`, `.contact-content` |
| 684 | `@media (max-width: 480px)` | `.hero-image img`, `.hero-text h2`, `.hero-text p` |

À la largeur **exacte de 768 px**, le bloc `min-width: 768px` (ligne 535) et les blocs
`max-width: 768px` (lignes 311 et 636) s'appliquent **simultanément** : le layout mobile
et le layout desktop coexistent à ce point précis.

**Unités employées :** `px` (131 occurrences), `rem` (19), `s` (18 — durées),
`em` (5), `%` (13), `fr` (3), `vh` (2 — lignes 101 et 646), `calc()` (1 occurrence :
`calc(100vh - 70px)` ligne 646), mots-clés `auto` (lignes 16, 170, 278, 318, 446, 569).

### 2.5 JavaScript `js/script.js` (102 lignes)

**Fonctionnalités implémentées — 8 blocs :**

| Lignes | Fonctionnalité |
|---:|---|
| 2-8 | Ouverture/fermeture du menu hamburger (bascule de classe `active`) |
| 11-16 | Fermeture du menu au clic sur un lien de navigation |
| 19-28 | Réduction du `padding` et changement d'ombre du header au défilement |
| 31-45 | Défilement doux vers les ancres internes, avec décalage de 70 px |
| 48-57 | Animation de barres de compétences au défilement |
| 60-69 | Révélation des cartes projet au défilement |
| 72-78 | Fonction utilitaire de détection de visibilité dans le viewport |
| 81-101 | Validation et soumission simulée d'un formulaire de contact |

**Écouteurs d'événements — 7 attachements :**

| Ligne | Cible | Événement | Options |
|---:|---|---|---|
| 5 | `.hamburger` | `click` | aucune |
| 12 | chaque `nav a` (5 par page) | `click` | aucune |
| 19 | `window` | `scroll` | **aucune** (ni `passive`, ni throttle) |
| 32 | chaque `a[href^="#"]` | `click` | aucune |
| 51 | `window` | `scroll` | **aucune** |
| 62 | `window` | `scroll` | **aucune** |
| 84 | `.contact-form` | `submit` | aucune (bloc gardé par un `if` ligne 83) |

**Aucun écouteur `resize`.** Aucune occurrence de `throttle`, `debounce`,
`requestAnimationFrame`, `IntersectionObserver`, `DOMContentLoaded` ou `passive`
dans le fichier (0 résultat sur chacun de ces motifs).

**Sélecteurs DOM interrogés — 11 requêtes :**

| Ligne | Requête | Résultat sur `index.html` | Sur `pages/*.html` |
|---:|---|---|---|
| 2 | `document.querySelector('.hamburger')` | 1 élément | 1 élément |
| 3 | `document.querySelector('nav ul')` | 1 élément | 1 élément |
| 11 | `document.querySelectorAll('nav a')` | 5 éléments | 5 éléments |
| 20 | `document.querySelector('header')` | 1 élément | 1 élément |
| 31 | `document.querySelectorAll('a[href^="#"]')` | 5 éléments | **0 élément** |
| 36 | `document.querySelector(targetId)` | dynamique | non atteint |
| 48 | `document.querySelector('.skills')` | 1 élément | **`null`** |
| 49 | `document.querySelectorAll('.skill-progress')` | **0 élément** | **0 élément** |
| 60 | `document.querySelectorAll('.project-card')` | 2 éléments | **0 élément** |
| 81 | `document.querySelector('.contact-form')` | **`null`** | **`null`** |
| 87-90 | `getElementById('name' / 'email' / 'subject' / 'message')` | **inexistants** | **inexistants** |

**Fonctions déclarées — 1 seule fonction nommée :** `isElementInViewport(el)` (ligne 72).
Toutes les autres unités sont des fonctions anonymes ou fléchées passées en callback
(lignes 5, 12, 19, 32, 51, 53, 62, 63, 84).

---

## 3. Étape 2 — Code mort et incohérences

### 3.1 Sélecteurs JavaScript sans correspondance HTML

| Ligne JS | Sélecteur | Constat |
|---:|---|---|
| 49 | `.skill-progress` | **Aucune occurrence** dans les 3 fichiers HTML. La boucle ligne 53-55 ne s'exécute jamais. |
| 81 | `.contact-form` | **Aucune occurrence** dans les 3 fichiers HTML. Le bloc 83-101 (19 lignes) est intégralement mort. |
| 87 | `#name` | **Aucune occurrence.** Inaccessible (dans le bloc mort). |
| 88 | `#email` | **Aucune occurrence.** Inaccessible. |
| 89 | `#subject` | **Aucune occurrence.** Inaccessible. |
| 90 | `#message` | **Aucune occurrence.** Inaccessible. |
| 48 | `.skills` | Présent sur `index.html:80`, **absent** de `pages/archilog.html` et `pages/plateformeWeb.html` → retourne `null` sur ces deux pages. |
| 60 | `.project-card` | Présent sur `index.html:122, 142`, **absent** des deux pages de projet → `NodeList` vide. |

**Conséquence critique de `.skills` = `null` :** sur `pages/archilog.html` et
`pages/plateformeWeb.html`, l'écouteur `scroll` de `js/script.js:51` appelle
`isElementInViewport(skillsSection)` avec `skillsSection === null`, ce qui déclenche
`null.getBoundingClientRect()` à la ligne 73 → **`TypeError` levée à chaque événement
de défilement**, sur les deux pages de projet. Les autres écouteurs continuent de
fonctionner (chaque callback est indépendant), mais la console est saturée d'erreurs
et le travail du gestionnaire est perdu.

### 3.2 Règles CSS sans correspondance HTML

Comparaison automatisée des 34 classes citées dans `styles/style.css` avec les 65
classes présentes dans les 3 fichiers HTML.

| Classe CSS | Lignes CSS | Constat |
|---|---|---|
| `.contact-form` | 380-387, 389-395, 397-401, 403-414, 416-428, 430-432 | **53 lignes de CSS mort.** Aucun formulaire n'existe dans le site. |
| `.input-box` | 397, 403, 404, 416, 430 | Mort (dépend de `.contact-form`). |
| `.send-btn` | 416, 430 | Mort. |
| `.project-image` | 217-222, 224-226 | **Aucune occurrence** de `project-image` en HTML. La règle de zoom au survol des visuels de projet ne s'applique à rien. |
| `.contact-content` | 679-681 | **Aucune occurrence** en HTML. Règle morte dans le bloc `max-width: 768px`. |
| `.btn` | 597, 608 | **Aucune occurrence** en HTML. Le sélecteur `button` associé est également sans cible : aucune balise `<button>` dans le site. |
| `.active` | 654 (`nav ul.active`) | Utilisée, mais **uniquement** sur `nav ul`. Le JS applique aussi `active` sur `.hamburger` (`js/script.js:6`) sans qu'aucune règle `.hamburger.active` existe → le bouton ne change jamais d'apparence quand le menu est ouvert. |

**Total du CSS mort identifié : environ 75 lignes sur 701, soit 10,7 % du fichier.**

Symétriquement, **20 classes présentes en HTML n'ont aucune règle CSS** (hors classes
Font Awesome `fa*`, qui sont fournies par le CDN) :

`alert-box` (plateformeWeb:62), `btn-highlight` (plateformeWeb:169, 175, 178×2),
`feature-image` (archilog:41, 61 ; plateformeWeb:38, 53, 67, 81, 99),
`feature-section` (plateformeWeb:95), `highlight-text` (archilog:38 ; plateformeWeb:56),
`info-note` (plateformeWeb:122), `intro-text` (plateformeWeb:102),
`method-card` (plateformeWeb:134, 145, 156), `method-description` (plateformeWeb:137, 148, 159),
`method-image` (plateformeWeb:136, 147, 158), `method-intro` (plateformeWeb:127),
`methods-container` (plateformeWeb:132), `parameter-list` (plateformeWeb:108),
`parameters-card` (plateformeWeb:106), `projects` (index:117),
`reveal` (index:169, 178, 187, 196), `sr-only` (index:44, 48, 216, 220 ;
archilog:72, 76 ; plateformeWeb:196, 200), `user-actions` (plateformeWeb:167),
`warning` (plateformeWeb:62).

Deux cas méritent d'être isolés :

- **`.sr-only` (8 occurrences, 3 pages)** — c'est la classe conventionnelle de masquage
  visuel pour lecteurs d'écran. Elle n'est **définie nulle part** dans `styles/style.css`
  (0 résultat sur `sr-only`). Les libellés « GitHub » et « LinkedIn » sont donc **rendus
  visibles** à l'intérieur des pastilles rondes de 40 × 40 px (`styles/style.css:149-150`),
  par-dessus l'icône. Impact visuel direct sur les trois pages.
- **`.reveal` (index.html:169, 178, 187, 196)** — ni règle CSS, ni lecture JavaScript.
  Vestige d'une animation d'apparition jamais implémentée.

### 3.3 Attributs `data-*` lus par le JavaScript et absents du HTML

| Ligne JS | Attribut | Constat |
|---:|---|---|
| 54 | `data-progress` | Lu via `bar.parentElement.getAttribute('data-progress')`. **Aucune occurrence de `data-progress`** dans les 3 fichiers HTML. |

C'est le seul attribut `data-*` lu par le script, et il n'existe pas. Le site ne contient
aucun attribut `data-*` (0 occurrence tous fichiers confondus). Le bloc `js/script.js:48-57`
est donc mort deux fois : ni `.skill-progress`, ni `data-progress`.

### 3.4 Styles en ligne posés par le JavaScript en conflit avec le CSS

| Ligne JS | Style en ligne | Règle CSS concurrente | Conséquence |
|---:|---|---|---|
| 22 | `header.style.padding = '10px 40px'` | `styles/style.css:54` (`padding: 20px 40px`) **et** `styles/style.css:638` (`padding: 20px`, bloc `max-width: 768px`) | **Conflit réel.** Un style en ligne l'emporte sur toute règle de feuille de style, y compris celles d'une media query. Dès le premier défilement sur mobile, le `padding` horizontal du header repasse à 40 px et **annule définitivement** le `padding: 20px` prévu pour les petits écrans. Le header devient plus étroit en contenu utile sur les écrans où la place manque le plus. |
| 25 | `header.style.padding = '20px 40px'` | `styles/style.css:638` | Même conflit, en position haute de page : la valeur mobile est écrasée en permanence. |
| 23 / 26 | `header.style.boxShadow = …` | `styles/style.css:56` | Écrasement permanent de la règle de feuille de style, sans conflit visuel (mêmes valeurs à l'état haut de page) mais l'ombre n'est plus pilotable depuis le CSS. |
| 54 | `bar.style.width = … + '%'` | — | Aucun conflit : le bloc ne s'exécute jamais (§3.3). |
| 65-66 | `card.style.opacity = '1'` et `card.style.transform = 'translateY(0)'` | Aucune règle ne pose `opacity: 0` ni de `transform` initial sur `.project-card` | **Aucun effet visuel** : les cartes sont déjà opaques et non translatées. Le code écrit deux propriétés en ligne sur chaque carte, à chaque événement de défilement, pour un résultat nul. Effet de bord : ces deux propriétés deviennent non pilotables depuis le CSS. |

**Conséquence de performance associée :** le gestionnaire de la ligne 19 **écrit** des
styles, celui de la ligne 51 **lit** ensuite une géométrie (`getBoundingClientRect`,
ligne 73), celui de la ligne 62 **lit** puis **écrit** à nouveau (lignes 64-66). Cette
alternance lecture/écriture force le navigateur à recalculer la mise en page de manière
synchrone plusieurs fois par événement de défilement, sans aucun étranglement. C'est le
schéma classique de *layout thrashing*.

### 3.5 Liens internes, ancres et chemins d'images

**Chemins d'images — les 13 références ont été vérifiées fichier par fichier :
aucune n'est cassée.**

| Référence | Fichier source | Cible | État |
|---|---|---|---|
| `img/profile.jpg` | index.html:36 | existe | OK |
| `../img/archilog_screenshot1.png` | archilog.html:41 | existe | OK |
| `../img/archilog_screenshot2.png` | archilog.html:61 | existe | OK |
| `../img/accueil.png` | plateformeWeb.html:38 | existe | OK |
| `../img/profile-connection-inscription.png` | plateformeWeb.html:53 | existe | OK |
| `../img/creation-compte.png` | plateformeWeb.html:67 | existe | OK |
| `../img/login.png` | plateformeWeb.html:81 | existe | OK |
| `../img/module-probabilite.png` | plateformeWeb.html:99 | existe | OK |
| `../img/rectangles-gauche.PNG` | plateformeWeb.html:136 | existe (casse identique) | OK |
| `../img/rectangles-medians.png` | plateformeWeb.html:147 | existe | OK |
| `../img/trapezes.png` | plateformeWeb.html:158 | existe | OK |
| `../img/fiche.png` | plateformeWeb.html:183 | existe | OK |

**Actif orphelin :** `img/Porbability.png` (65 979 octets, 1920 × 1079) est versionné
(`git ls-files`) mais **n'est référencé nulle part** (0 résultat de la recherche du motif
`Porbability` dans les fichiers HTML, CSS et JS). Son nom comporte de plus une inversion
de lettres (« Porbability » au lieu de « Probability »).

**Ancres internes :** les 5 ancres de `index.html:18-22` (`#accueil`, `#a-propos`,
`#skills`, `#projects`, `#contact`) pointent toutes vers un `id` existant
(lignes 33, 56, 80, 117, 165). **Aucune ancre cassée.**

**Ancres définies mais jamais ciblées — 7 identifiants inertes :**
`page-accueil` (plateformeWeb:34), `creation-compte` (49), `login` (77),
`module-probabilite` (95), `methode-rectangles-gauche` (134),
`methode-rectangles-medians` (145), `methode-trapezes` (156). Aucun lien du site ne
pointe vers eux, et aucune règle CSS ne les cible (0 sélecteur `#` dans la feuille).
`pages/plateformeWeb.html` est la page la plus longue du site (208 lignes, 578 mots)
et ne dispose d'aucun sommaire.

**Liens internes :** `index.html:135` → `pages/plateformeWeb.html` (existe),
`index.html:155` → `pages/archilog.html` (existe), `index.html:202` → `pdf/cv.pdf` (existe).
Les 10 liens `../index.html#…` des deux sous-pages résolvent correctement depuis `pages/`.

**Incohérence de lien :** `index.html:14` pointe vers `index.html` (sans ancre) tandis que
`pages/archilog.html:15` et `pages/plateformeWeb.html:14` pointent vers `../index.html#accueil`
(avec ancre). Le logo n'a donc pas le même comportement selon la page.

**Absence de lien retour :** aucune des deux pages de projet ne propose de lien vers
`#projects`, ni de lien croisé vers l'autre projet. Le seul chemin de retour est la
navigation principale.

**Point d'attribution :** `index.html:136` désigne comme « Code source » du projet
« Plateforme Web de Calculs » le dépôt `https://github.com/Ethan-Da/PROBABILITY`, hébergé
sur un compte tiers. Aucune mention du caractère collectif du projet ni du rôle exact de
l'auteur n'apparaît sur la page.

### 3.6 Duplications entre fichiers HTML

**En-tête + navigation — 19 lignes dupliquées 3 fois (57 lignes au total) :**

| Fichier | Lignes | Différences relevées |
|---|---|---|
| `index.html` | 12-30 | référence |
| `pages/archilog.html` | 13-31 | **6 attributs `href`** seulement (préfixe `../index.html`) |
| `pages/plateformeWeb.html` | 12-30 | **strictement identique à `archilog.html`** après normalisation de l'indentation (diff vide) |

**Pied de page — 15 lignes dupliquées 3 fois (45 lignes au total) :**

| Fichier | Lignes | Différences relevées |
|---|---|---|
| `index.html` | 211-225 | référence |
| `pages/archilog.html` | 67-81 | **strictement identique** après normalisation de l'indentation (diff vide) |
| `pages/plateformeWeb.html` | 191-205 | **divergence structurelle** : le `<p>` de copyright est placé **à l'intérieur** de `.container` (ligne 203, avant le `</div>` ligne 204), alors qu'il est **à l'extérieur** dans les deux autres pages (`index.html:224`, `archilog.html:80`). |

**Bloc « icônes sociales » — 10 lignes dupliquées 4 fois** (`index.html:41-50` dans le hero,
`index.html:213-221` dans le footer, `archilog.html:69-78`, `plateformeWeb.html:193-202`).

**Bilan de duplication : environ 112 lignes de balisage recopiées sur 522 lignes de HTML
au total, soit 21 % du HTML du site.** Toute modification de la navigation ou du pied de
page implique trois éditions manuelles synchronisées — et la divergence déjà observée sur
le `<p>` du footer démontre que cette synchronisation a déjà échoué.

### 3.7 Autres incohérences structurelles relevées

| Fichier:ligne | Constat |
|---|---|
| `pages/archilog.html:32` | Balise `<main>` **ouverte et jamais fermée**. Aucune occurrence de `</main>` dans le fichier (vérifié par recherche). Le navigateur ferme implicitement `<main>` à `</body>`, ce qui place le `<footer>` (lignes 67-81) **à l'intérieur du contenu principal**. |
| `index.html` | **Aucune balise `<main>`** sur la page d'accueil. Les 5 `<section>` sont enfants directs de `<body>` (lignes 33, 56, 80, 117, 165). |
| `index.html:60, 69` | La classe `project-info` — dont le rôle CSS est celui d'un conteneur de carte projet (`styles/style.css:228-233` : `padding: 25px; display: flex; flex-direction: column; flex-grow: 1`) — est appliquée à deux `<h3>` (« Passion », « Ambition »). Ces titres deviennent des conteneurs flex avec 25 px de remplissage. La règle `.project-info h3` (ligne 235) ne les atteint pas : le `h3` **est** le `.project-info`, il n'en est pas descendant. |
| `index.html:61` | `<p>` ouvert et non fermé (les paragraphes suivants, lignes 63, 65, 67, le sont). Le parseur HTML5 le referme implicitement à l'ouverture du `<p>` ligne 63 ; le rendu est correct, la source est incohérente. |
| `styles/style.css:14-18` et `567-571` | Bloc `.container` **déclaré deux fois à l'identique** (mêmes trois propriétés, mêmes valeurs). |
| `styles/style.css:20-22` et `461-464` | Bloc `section` déclaré deux fois : le second redéclare `padding: 80px 0` et ajoute `position: relative`. |
| `styles/style.css:105` et `181` | `background-color: #f9f9f9` déclaré sur `.hero` et `.skills` — **jamais appliqué** : `section:nth-child(even)` (ligne 466, spécificité 0-1-1) l'emporte sur `.hero` / `.skills` (spécificité 0-1-0) et impose `#f8f9fa`. Sur `index.html`, `#accueil` est le 2ᵉ enfant de `<body>` et `#skills` le 4ᵉ : tous deux « pairs ». Les deux déclarations `#f9f9f9` sont donc inertes. |
| `styles/style.css:466-472` | L'alternance de fonds est pilotée par la **position dans le DOM** (`nth-child`), pas par une classe. Toute insertion ou réorganisation de section inverse silencieusement les fonds de toutes les sections suivantes. Même remarque pour les `animation-delay` (lignes 592-594) et pour `article:nth-child(odd/even) img { order }` (lignes 557-563). |
| `styles/style.css:329` vs `467` | `.contact .content` a un fond `#f9f9f9` posé dans un `<section>` dont le fond est `#f8f9fa`, avec `margin-top: 20px` (ligne 328) : une bande de 20 px d'un gris différent apparaît au-dessus du bloc contact. Les deux gris ont un contraste mutuel de 1,00 — la bande est techniquement présente mais imperceptible. |
| `js/script.js:40` vs `styles/style.css:106, 643, 646` | **Trois valeurs différentes** pour la hauteur supposée du header fixe : `70` (décalage de défilement JS), `60px` (`.hero { padding-top }`), `70px` (`nav ul { top }` et `calc(100vh - 70px)`). Aucune ne correspond à une hauteur calculée par le CSS ; la hauteur réelle dépend du `padding` (20 px × 2) et de la hauteur de ligne du `h1` à 1.8 rem — et varie de surcroît au défilement à cause du style en ligne posé en `js/script.js:22`. |
| `js/script.js:33` | `e.preventDefault()` sur tous les liens d'ancre supprime la mise à jour du fragment d'URL. Les sections du site **ne sont pas partageables par lien direct** et le bouton « précédent » du navigateur ne restaure pas la position. |
| `styles/style.css:312-314` | `.projects-grid { grid-template-columns: 1fr }` n'existe **que** dans `@media (max-width: 768px)`. Aucune règle de base ne déclare `display: grid` sur `.projects-grid`. La propriété `grid-template-columns` est donc **sans effet** : le conteneur `index.html:120` reste un bloc normal et les deux cartes s'empilent verticalement à toutes les largeurs. |
| `styles/style.css:316-319` | `.project-card` n'a **aucune règle de base** — uniquement `max-width: 500px; margin: 0 auto` dans la media query mobile. Aucune carte visuelle n'est dessinée (ni fond, ni ombre, ni bordure, ni rayon), contrairement à `.skill-card` (lignes 191-199) et `.card` (lignes 339-350). |

---

## 4. Étape 3 — Performance et actifs

### 4.1 Poids total par catégorie

| Catégorie | Fichiers | Octets | Part |
|---|---:|---:|---:|
| Images | 13 | 3 034 001 | **87,58 %** |
| PDF | 1 | 386 977 | 11,17 % |
| HTML | 3 | 27 232 | 0,79 % |
| CSS | 1 | 12 771 | 0,37 % |
| JavaScript | 1 | 3 386 | 0,10 % |
| **TOTAL** | **19** | **3 464 367** | 100 % |

### 4.2 Poids transféré par page (première visite, cache vide, non compressé)

| Page | HTML | CSS local | JS | Images | Font Awesome | **Total** |
|---|---:|---:|---:|---:|---:|---:|
| `index.html` | 12 222 | 12 771 | 3 386 | 2 331 031 | 360 169 | **2 719 579** (2,59 Mio) |
| `pages/plateformeWeb.html` | 11 189 | 12 771 | 3 386 | 428 891 | 360 169 | **816 406** (797 Kio) |
| `pages/archilog.html` | 3 821 | 12 771 | 3 386 | 208 100 | 360 169 | **588 247** (575 Kio) |

Sur la page d'accueil, **`img/profile.jpg` représente à lui seul 85,7 % du poids transféré**.
Sur `pages/archilog.html`, **Font Awesome représente 61,2 % du poids transféré**.

### 4.3 Inventaire détaillé des images

Dimensions d'affichage déduites du CSS : `.container` = `max-width: 1200px` moins
`padding: 0 20px` (`styles/style.css:15-17`) → **1 160 px** ; `.about-content` =
`max-width: 800px` (ligne 169) → **800 px** ; `.fiche-container` = 800 px moins
`padding: 20px` (ligne 577) → **760 px** ; `article` en grille `1fr 1fr` avec `gap: 25px`
à partir de 768 px (lignes 546-551) à l'intérieur de `.about-content` et d'un `padding: 25px`
(ligne 479) → **≈ 362 px par colonne**. Toutes les images héritent de
`img { max-width: 100%; height: auto }` (`styles/style.css:445-446`), qui **réduit** mais
n'agrandit jamais.

| Fichier | Poids | Dimensions réelles | Format | Affichage CSS | Sur-résolution | WebP q80 mesuré | AVIF q50 mesuré |
|---|---:|---|---|---|---|---:|---:|
| `profile.jpg` | 2 331 031 | 4032 × 3024 | JPEG | **220 × 220** (`style.css:119-120`) ; 180 × 180 sous 480 px (`685-687`) | **× 18,3 en largeur, × 252 en pixels** | **10 824** (−99,5 %) | **5 898** |
| `archilog_screenshot2.png` | 120 798 | 1637 × 517 | PNG-24 | 1 160 px (`archilog.html:61`, `.container`) | × 1,41 | 18 880 (−84,4 %) | 11 963 |
| `profile-connection-inscription.png` | 95 077 | 1920 × 942 | PNG-32 | 1 160 px (`plateformeWeb.html:53`, `.container`) | × 1,66 | 17 388 (−81,7 %) | 11 381 |
| `accueil.png` | 89 971 | 1909 × 939 | PNG-32 | 1 160 px (`plateformeWeb.html:38`, `.container`) | × 1,65 | 15 016 (−83,3 %) | 10 265 |
| `archilog_screenshot1.png` | 87 302 | 1635 × 356 | PNG-24 | 1 160 px (`archilog.html:41`, `.container`) | × 1,41 | 13 824 (−84,2 %) | 8 557 |
| `creation-compte.png` | 68 285 | 1912 × 932 | PNG-32 | **800 px** (`plateformeWeb.html:67`, dans `.about-content`) | **× 2,39** | 8 618 (−87,4 %) | 6 198 |
| `Porbability.png` | 65 979 | 1920 × 1079 | PNG-24 | **jamais affichée** | actif orphelin | — | — |
| `module-probabilite.png` | 57 085 | 1918 × 938 | PNG-32 | 1 160 px (`plateformeWeb.html:99`) | × 1,65 | 13 508 (−76,3 %) | 8 714 |
| `login.png` | 54 433 | 1920 × 936 | PNG-32 | 1 160 px (`plateformeWeb.html:81`) | × 1,66 | 12 242 (−77,5 %) | 7 525 |
| `fiche.png` | 44 566 | 1227 × 648 | PNG-32 | 760 px (`plateformeWeb.html:183`, `.fiche-container`) | × 1,61 | 11 054 (−75,2 %) | 6 199 |
| `rectangles-gauche.PNG` | 10 484 | 364 × 354 | PNG-32 | ≈ 362 px (`plateformeWeb.html:136`, colonne d'`article`) | **× 1,00 — sous-résolution en écran haute densité** | 2 884 (−72,5 %) | 1 810 |
| `trapezes.png` | 4 709 | 220 × 175 | PNG-32 | 220 px (largeur intrinsèque, colonne de 362 px non remplie) | **× 1,00 — sous-résolution** | 2 922 (−37,9 %) | 789 |
| `rectangles-medians.png` | 4 281 | 220 × 175 | PNG-32 | 220 px (idem) | **× 1,00 — sous-résolution** | 2 576 (−39,8 %) | 749 |

*Méthode : redimensionnement Lanczos à la largeur d'affichage × 2 (cible écran haute densité),
puis encodage WebP qualité 80 (méthode 6) et AVIF qualité 50, réalisé hors du dépôt.
Les nombres de la colonne « mesuré » sont des tailles de fichiers effectivement produites,
pas des estimations.*

**Gain mesuré sur les 12 images réellement affichées :**

| | Octets | Gain |
|---|---:|---:|
| État actuel | 2 968 022 | — |
| WebP q80, redimensionné ×2 | **129 736** | **−95,6 %** (−2,84 Mo) |
| AVIF q50, redimensionné ×2 | **80 048** | **−97,3 %** (−2,89 Mo) |

En ajoutant la suppression de l'orphelin `Porbability.png` (65 979 o), le poids images du
dépôt passerait de 3 034 001 o à **129 736 o en WebP**, soit **−95,7 %**.

**Constats particuliers :**

- `profile.jpg` est un fichier **brut d'appareil photo** : 4032 × 3024 est la résolution
  native d'un capteur de smartphone (12,2 mégapixels). Il est affiché dans un cercle de
  220 px de diamètre. Le navigateur télécharge, décode et rééchantillonne 12,2 Mpx pour en
  afficher 0,048 Mpx.
- Les trois schémas de méthodes numériques (`rectangles-gauche.PNG` 364 × 354,
  `rectangles-medians.png` 220 × 175, `trapezes.png` 220 × 175) sont présentés comme une
  série homogène (`plateformeWeb.html:134-164`) mais ont des dimensions et des rapports de
  forme différents. Comme `img { max-width: 100% }` ne les agrandit pas, ils s'affichent à
  des tailles différentes (364 px contre 220 px) dans des colonnes identiques.
- **Aucune image ne porte d'attribut `width` / `height`** (0 occurrence de `height=` dans
  les 3 fichiers HTML). Sans dimensions intrinsèques déclarées, le navigateur ne peut pas
  réserver l'espace avant chargement → décalage de mise en page cumulatif (CLS).
- **Aucun `loading="lazy"`** (0 occurrence). Les 9 images de `plateformeWeb.html` sont
  toutes demandées immédiatement, y compris celles situées loin sous la ligne de flottaison.
- **Aucun `srcset`, aucune balise `<picture>`** (0 occurrence). Une seule résolution est
  servie à tous les appareils.

### 4.4 Écouteurs `scroll` / `resize` sans étranglement

**3 écouteurs `scroll` sur `window`, aucun étranglé, aucun `passive: true`.
Aucun écouteur `resize`.**

| Ligne | Gestionnaire | Travail effectué par événement | Risque concret |
|---:|---|---|---|
| 19-28 | Réduction du header | 1 comparaison sur `window.scrollY` + **2 écritures de style en ligne** (`padding`, `boxShadow`) à chaque événement, y compris quand la valeur est inchangée | Chaque écriture invalide la mise en page du header, qui est `position: fixed` et donc dans sa propre couche : le navigateur doit recalculer le style et repeindre à chaque *frame* de défilement. La transition CSS `all 0.3s ease` (`style.css:58`) porte sur **toutes** les propriétés, y compris `padding`, ce qui ajoute une animation de mise en page (et non de composition) à chaque bascule. |
| 51-57 | Animation des compétences | 1 appel `getBoundingClientRect()` (ligne 73) | **Lecture de géométrie forcée immédiatement après les écritures du gestionnaire précédent** → recalcul de mise en page synchrone (*forced synchronous layout*) à chaque événement. Sur `index.html`, ce coût est intégralement gaspillé : la boucle qui suit porte sur une `NodeList` vide. Sur les deux pages de projet, la ligne 73 lève une `TypeError` (§3.1). |
| 62-69 | Révélation des cartes projet | `getBoundingClientRect()` × nombre de cartes (2 sur l'accueil), suivi de **2 écritures de style en ligne par carte** | Nouvelle alternance lecture → écriture → lecture dans le même événement. Sur `index.html` : 3 lectures de géométrie et 6 écritures de style par événement de défilement. Le résultat visuel est nul (§3.4). Sur les pages de projet : `NodeList` vide, coût nul mais code inutile. |

**Absence d'`IntersectionObserver`** (0 occurrence) : les deux gestionnaires de révélation
réimplémentent manuellement, et de façon synchrone, ce que l'API navigateur fait de manière
asynchrone et hors du fil principal.

**Absence de `{ passive: true }`** : sans cette option, le navigateur doit attendre la fin
de l'exécution du gestionnaire avant de savoir s'il peut faire défiler la page, car le
gestionnaire pourrait appeler `preventDefault()`. Sur mobile, cela se traduit par un
défilement qui « accroche ».

### 4.5 Ressources bloquant le rendu et dépendances CDN

| Ressource | Position | Poids réel mesuré | Bloque le rendu |
|---|---|---:|---|
| `styles/style.css` | `<head>` (index:7, archilog:8, plateformeWeb:7) | 12 771 o | **Oui** |
| Font Awesome `all.min.css` (cdnjs) | `<head>` (index:8, archilog:9, plateformeWeb:8) | **102 025 o** brut / **21 631 o** transférés (gzip) | **Oui** |
| `fa-solid-900.woff2` | découvert après analyse du CSS FA | **150 124 o** | Non (bloque l'affichage des icônes) |
| `fa-brands-400.woff2` | idem | **108 020 o** | Non (idem) |
| `js/script.js` | fin de `<body>` (index:227, archilog:83, plateformeWeb:207) | 3 386 o | Non, mais **sans `defer` ni `async`** : bloque `DOMContentLoaded`. |

*Poids obtenus par requêtes `HEAD` sur `cdnjs.cloudflare.com` le 19 août 2026.*

**Constats :**

- **Cascade de requêtes en série :** HTML → CSS Font Awesome (domaine tiers) → fichiers
  `.woff2`. Les polices d'icônes ne peuvent être demandées **qu'après** le téléchargement
  et l'analyse du CSS distant. Trois allers-retours réseau séquentiels, dont deux vers un
  domaine tiers.
- **Aucun `<link rel="preconnect">` ni `dns-prefetch`** vers `cdnjs.cloudflare.com`
  (0 occurrence) : le coût DNS + TCP + TLS du domaine tiers est payé dans le chemin critique.
- **258 144 octets de polices d'icônes pour 17 glyphes distincts.** Décompte exhaustif :
  - `fab` (brands, 108 020 o) — 8 glyphes : `fa-github` (index:43, 215 ; archilog:71 ;
    plateformeWeb:195), `fa-linkedin` (index:47, 219 ; archilog:75 ; plateformeWeb:199),
    `fa-html5` (index:85), `fa-css3-alt` (index:89), `fa-js` (index:93),
    `fa-python` (index:97), `fa-java` (index:101), `fa-php` (index:105).
  - `fas` (solid, 150 124 o) — 9 glyphes : `fa-database` (index:109),
    `fa-map-marker-alt` (index:171), `fa-phone` (index:180), `fa-envelope` (index:189),
    `fa-file-alt` (index:198), `fa-exclamation-triangle` (plateformeWeb:64),
    `fa-sliders-h` (plateformeWeb:107), `fa-chart-bar` (plateformeWeb:135, 146),
    `fa-chart-area` (plateformeWeb:157).

  Soit **≈ 15 Ko de police téléchargés par pictogramme affiché.** Sur `pages/archilog.html`,
  qui n'affiche que 2 icônes (`fa-github` et `fa-linkedin`, toutes deux de la famille
  *brands*), la famille *solid* de 150 124 octets est **également téléchargée** dès qu'une
  règle `.fas` correspond — et le CSS de 102 Ko est chargé pour 2 pictogrammes.

- **Animation d'apparition sur le contenu critique :** `styles/style.css:588-590` applique
  `animation: fadeIn 0.6s ease-out forwards` à **toutes** les `<section>`, et
  `@keyframes fadeIn` (583-586) démarre à `opacity: 0`. La ligne 592 ajoute un
  `animation-delay: 0.1s` à `section:nth-child(2)` — c'est-à-dire, sur `index.html`, à la
  section `#accueil` qui contient la photo de profil, donc très probablement l'élément LCP.
  Le plus grand élément de contenu de la page est donc **volontairement invisible pendant
  100 ms puis fondu sur 600 ms**, en plus du temps de téléchargement des 2,3 Mo de l'image.

- **Compression :** ne peut être vérifiée par lecture du code (dépend de la configuration
  serveur). Voir §10.

### 4.6 Nommage des fichiers

| Fichier | Anomalie |
|---|---|
| `img/Porbability.png` | **Faute d'orthographe** (inversion : « Porbability » pour « Probability »). Fichier par ailleurs orphelin. |
| `img/rectangles-gauche.PNG` | **Extension en majuscules** — seul cas sur 13 images. Les 12 autres utilisent `.png` ou `.jpg` en minuscules. La référence `plateformeWeb.html:136` respecte la casse, donc le lien fonctionne ; mais `core.ignorecase = true` sur le poste de développement (§2.2) masquerait toute future divergence, qui casserait sur un hébergeur Linux. |
| `pages/plateformeWeb.html` | **`camelCase`** — seul fichier du dépôt dans cette convention. Les autres utilisent le `kebab-case` (`archilog.html`, `creation-compte.png`, `module-probabilite.png`, `profile-connection-inscription.png`, `rectangles-gauche.PNG`) ou un mot simple (`index.html`, `style.css`, `script.js`, `cv.pdf`, `login.png`, `fiche.png`, `trapezes.png`, `accueil.png`, `profile.jpg`). Le `camelCase` dans une URL est de surcroît sensible à la casse sur un serveur Linux. |
| `img/archilog_screenshot1.png`, `img/archilog_screenshot2.png` | **`snake_case`** — seuls fichiers du dépôt à utiliser le tiret bas. Troisième convention de nommage cohabitant dans le même dossier. |
| **Le dépôt lui-même** | Nommé **`Porfolio`** (remote : `https://github.com/HRazim/Porfolio.git`) — faute d'orthographe pour « Portfolio ». Ce nom apparaîtrait dans l'URL publique d'un site GitHub Pages de projet. |

Trois conventions de nommage coexistent dans le dossier `img/` : `kebab-case` (6 fichiers),
`snake_case` (2 fichiers), mot simple (4 fichiers), plus une capitalisation initiale
(`Porbability.png`).

---

## 5. Étape 4 — Accessibilité et sémantique

### 5.1 Hiérarchie des titres

**`index.html` — 1 `h1`, aucun saut de niveau.**

| Ligne | Niveau | Contenu |
|---:|---|---|
| 14 | h1 | MAROUAN Hazim-Rayan *(dans le logo, à l'intérieur d'un `<a>`)* |
| 39 | h2 | MAROUAN Hazim-Rayan *(hero — **texte identique au h1**)* |
| 58 | h2 | À propos de moi |
| 60, 69 | h3 | Passion, Ambition |
| 82 | h2 | Mes compétences |
| 86, 90, 94, 98, 102, 106, 110 | h3 | HTML, CSS, JavaScript, Python, Java, PHP, SQL |
| 119 | h2 | Mes Projets |
| 124, 144 | h3 | Plateforme Web de Calculs, Archilog - Gestion Financière |
| 167 | h2 | Contacts |
| 174, 183, 192, 201 | h3 | Adresse, Téléphone, Email, Télécharger mon CV |

Constat : le `h1` (ligne 14) et le premier `h2` (ligne 39) portent **le même texte**.
Le `h1` de la page — donc son titre principal aux yeux d'un lecteur d'écran et d'un moteur
de recherche — est le logo de l'en-tête, répété à l'identique sur les trois pages.

**`pages/archilog.html` — 1 `h1`, aucun saut.** h1:15 (logo), h2:36 « Archilog »,
h2:50 « Fonctionnalités principales ». Le titre de la page est un `h2` ; le `h1` est le logo.

**`pages/plateformeWeb.html` — 1 `h1`, aucun saut de niveau numérique, mais un plan aplati.**
h1:14 (logo), h2:36, h2:51, h2:79, h2:97 « Module de Probabilité », h3:107 « Paramètres de
calcul », puis **h2:135, h2:146, h2:157** pour les trois méthodes numériques. Ces trois
titres sont imbriqués dans la section « Module de Probabilité » (ligne 95) mais placés au
**même niveau de plan** que celle-ci. Un lecteur d'écran présentera « La méthode des
rectangles gauche » comme une section sœur de « Module de Probabilité », et non comme sa
sous-partie. Le style qui les cible est d'ailleurs `article h2` (`styles/style.css:488`),
ce qui confirme que le choix du niveau a été dicté par le CSS et non par la structure.

**Aucune page ne comporte plusieurs `h1`.** Aucun saut de niveau numérique
(h2 → h4) sur aucune page.

### 5.2 Attributs `alt`

**Les 13 images du site portent un attribut `alt`.** Aucun n'est manquant.

| Fichier:ligne | `alt` | Pertinence |
|---|---|---|
| index.html:36 | « Photo de profil de MAROUAN Hazim-Rayan » | **Adéquat.** |
| archilog.html:41 | « Capture d'écran du projet Archilog » | **Non distinctif** — identique à celui de la ligne 61 pour une image différente. |
| archilog.html:61 | « Capture d'écran du projet Archilog » | **Doublon exact** du précédent. Deux visuels différents décrits par la même phrase. |
| plateformeWeb.html:38 | « Page d'accueil » | Redondant avec le `h2` ligne 36 (texte strictement identique). |
| plateformeWeb.html:53 | « Profile pour connection et inscription » | **Deux erreurs de langue** : « Profile » (anglais) pour « Profil », « connection » (anglais) pour « connexion ». |
| plateformeWeb.html:67 | « Création de compte » | Redondant avec le `h2` ligne 51. |
| plateformeWeb.html:81 | « Login site web » | Redondant avec le `h2` ligne 79. |
| plateformeWeb.html:99 | « Module de Probabilité » | Redondant avec le `h2` ligne 97. |
| plateformeWeb.html:136 | « Méthode des rectangles gauche » | Redondant avec le `h2` ligne 135. |
| plateformeWeb.html:147 | « Méthode des rectangles médians » | Redondant avec le `h2` ligne 146. |
| plateformeWeb.html:158 | « Méthode des trapèzes » | Redondant avec le `h2` ligne 157. |
| plateformeWeb.html:183 | « Supprimer la fiche » | **Décrit une action, pas l'image.** Un lecteur d'écran annoncera une commande de suppression là où se trouve une capture d'écran. |

Bilan : 1 `alt` adéquat, 1 doublon exact, 7 redondances avec le titre adjacent (le contenu
de l'image n'est jamais décrit), 1 `alt` incorrect, 2 fautes de langue.

### 5.3 Ratios de contraste (WCAG 2.1)

Calculs effectués selon la formule de luminance relative de la WCAG. Seuils :
**AA texte normal 4,5:1** ; **AA grand texte 3:1** (≥ 24 px, ou ≥ 18,66 px en gras) ;
AAA respectivement 7:1 et 4,5:1.

| Combinaison | Avant-plan | Fond | Taille rendue | Ratio | AA | AAA | Référence |
|---|---|---|---|---:|---|---|---|
| Texte courant sur blanc | `#333` | `#fff` | 16 px | **12,63** | ✅ | ✅ | `style.css:11` / `:471` |
| Texte courant sur section paire | `#333` | `#f8f9fa` | 16 px | **11,99** | ✅ | ✅ | `style.css:11` / `:467` |
| Sous-titre hero / descriptifs projet / valeurs contact | `#666` | `#fff` | 19,2 px / 16 px | **5,74** | ✅ | ❌ | `style.css:135, 254, 376` |
| Sous-titre hero sur fond de section paire | `#666` | `#f8f9fa` | 19,2 px | **5,45** | ✅ | ❌ | `style.css:135` / `:467` |
| Listes STAR / paragraphes d'article | `#555` | `#fff` | 16 px | **7,46** | ✅ | ✅ | `style.css:265, 515` |
| Titres des cartes contact | `#111` | `#fff` | 19,2 px gras | **18,88** | ✅ | ✅ | `style.css:369` / `:340` |
| Logo de l'en-tête | `#4285f4` | `#fff` | 28,8 px gras | **3,56** | ✅ *(grand)* | ❌ | `style.css:64` / `:55` |
| Titres d'`article` | `#4285f4` | `#fff` | 24 px | **3,56** | ✅ *(grand, à la limite exacte)* | ❌ | `style.css:489` / `:471` |
| Icônes de compétence (48 px) | `#4285f4` | `#fff` | 48 px | **3,56** | ✅ *(grand)* | ❌ | `style.css:207` / `:192` |
| **Bouton « Voir le projet » (CTA secondaire)** | `#4285f4` | `#fff` | **14,4 px, graisse 500** | **3,56** | ❌ **ÉCHEC** | ❌ | `style.css:287, 288, 295, 296` |
| **Bouton « Code source » (CTA principal)** | `#fff` | `#4285f4` | **14,4 px, graisse 500** | **3,56** | ❌ **ÉCHEC** | ❌ | `style.css:284, 285, 287, 288` |
| **Lien de navigation au survol** | `#4285f4` | `#fff` (header à 95 %) | **17,6 px, graisse 600** | **3,56** | ❌ **ÉCHEC** *(17,6 px < seuil 18,66 px)* | ❌ | `style.css:83` / `:55` |
| **Icônes sociales (glyphe blanc sur pastille bleue)** | `#fff` | `#4285f4` | 20,8 px | **3,56** | ❌ **ÉCHEC** *(< 24 px et non gras)* | ❌ | `style.css:151, 152, 154` |
| Bouton principal au survol | `#fff` | `#3367d6` | 14,4 px | **5,18** | ✅ | ❌ | `style.css:301` |
| Bouton secondaire au survol | `#3367d6` | `#f5f9ff` | 14,4 px | **4,91** | ✅ | ❌ | `style.css:306, 307` |
| Icônes de contact (64 px) | `#3a6cf4` | `#fff` | 64 px | **4,53** | ✅ | ✅ | `style.css:353` / `:340` |
| Pied de page | `#fff` | `#333` | 16 px | **12,63** | ✅ | ✅ | `style.css:619, 620` |
| Lien « Télécharger mon CV » | `#333` | `#fff` | 19,2 px gras | **12,63** | ✅ | ✅ | `style.css:26` / `:340` |
| *(CSS mort)* bouton d'envoi au survol | `#fff` | `#235bf6` | 17,6 px | **5,39** | ✅ | ❌ | `style.css:417, 431` |

**4 combinaisons échouent au niveau AA**, toutes causées par la même couleur `#4285f4`
(`rgb(66, 133, 244)`), dont le contraste sur blanc est de **3,56:1** — suffisant pour du
grand texte, insuffisant pour tout texte inférieur à 24 px non gras.

**Fait notable :** les états **survolés** de ces mêmes boutons sont conformes
(`#3367d6` → 5,18:1 et 4,91:1). Le site est donc plus lisible au survol qu'au repos —
et l'état survolé est inaccessible au tactile.

### 5.4 Navigation au clavier, focus, ordre de tabulation, ARIA

| Constat | Référence | Détail |
|---|---|---|
| **Le menu mobile est inutilisable au clavier** | `index.html:24`, `archilog.html:25`, `plateformeWeb.html:24` | Le déclencheur est un `<div class="hamburger">`. Un `<div>` n'est pas focalisable par défaut. Il ne porte **ni `tabindex`** (0 occurrence dans le site), **ni `role="button"`** (les seuls `role=` du site sont les 3 `role="navigation"`), et l'écouteur `js/script.js:5` n'écoute que `click` — pas `keydown`. Sous 768 px, **aucun utilisateur au clavier ne peut ouvrir la navigation.** |
| **Aucun état d'ouverture communiqué** | `index.html:24` et équivalents | Pas d'`aria-expanded` (0 occurrence), pas d'`aria-controls`, pas d'`aria-hidden` sur `nav ul`. Une technologie d'assistance ne peut pas savoir si le menu est ouvert ou fermé. |
| **Le menu fermé reste dans l'ordre de tabulation** | `styles/style.css:641-652` | Sous 768 px, `nav ul` est masqué par `left: -100%`, c'est-à-dire déplacé hors écran — **et non retiré du flux d'accessibilité**. Les 5 liens restent focalisables. La tabulation déplace donc le focus vers des éléments invisibles, sans indicateur visible à l'écran. |
| **Aucun état de focus personnalisé** | `styles/style.css` (fichier entier) | **0 occurrence** de `:focus`, `:focus-visible` ou `:focus-within`. Seul l'anneau de focus par défaut du navigateur subsiste — non supprimé (le seul `outline: none`, ligne 410, est dans le bloc mort `.contact-form`), mais non renforcé non plus. Sur les liens de navigation, dont `text-decoration` est supprimée (ligne 25) et dont la couleur est `#333` sur fond quasi-blanc, l'anneau par défaut est le **seul** indicateur de position. |
| **Aucun lien d'évitement** | 3 fichiers HTML | 0 occurrence de « skip ». Aucun lien « Aller au contenu ». Sur chaque page, un utilisateur au clavier doit traverser les 6 liens de l'en-tête (logo + 5 liens de navigation) avant d'atteindre le contenu, **sur chaque page**. |
| **Aucune cible pour un lien d'évitement sur l'accueil** | `index.html` | Aucune balise `<main>` (§3.7) : il n'existe aucun repère de contenu principal vers lequel pointer. |
| **`prefers-reduced-motion` non respecté** | `styles/style.css` (fichier entier), `js/script.js:41` | **0 occurrence** de `prefers-reduced-motion`. Sont concernés : l'animation `fadeIn` appliquée à **toutes** les sections (`style.css:588-590`), 11 transitions (`style.css:58, 79, 96, 155, 198, 221, 289, 356, 427, 450, 481, 605, 651`), les `transform: translateY()` au survol (lignes 160, 202, 302, 361, 485, 610), le `transform: scale()` sur **toutes** les images (ligne 456), et le défilement `behavior: 'smooth'` de `js/script.js:41`. |
| **Rôle ARIA redondant** | `index.html:16`, `archilog.html:17`, `plateformeWeb.html:16` | `<nav role="navigation">` : la balise `<nav>` porte déjà implicitement ce rôle. Sans conséquence négative, mais signale un balisage ARIA ajouté sans méthode. |
| **`aria-label` sur un élément non interactif** | `index.html:24` et équivalents | `<div class="hamburger" aria-label="Menu">` : un `aria-label` sur un `<div>` sans rôle n'est généralement pas restitué par les lecteurs d'écran. L'intention est correcte, la mise en œuvre inopérante. |
| **Libellés destinés aux lecteurs d'écran rendus visibles** | 8 occurrences (§3.2) | `.sr-only` non défini → les mots « GitHub » et « LinkedIn » s'affichent par-dessus les icônes. S'y ajoute une **double annonce** : l'`aria-label` du lien (« GitHub Profile ») **et** le texte du `<span>` (« GitHub »). |
| **Cibles tactiles sous le seuil recommandé** | `styles/style.css:76-80`, `91-97` | Les liens de navigation sont des `<a>` en ligne sans remplissage : hauteur ≈ 28 px (17,6 px × interlignage 1,6). Le bouton hamburger mesure 25 px de large (ligne 92) pour ≈ 29 px de haut. Le seuil WCAG 2.5.8 (AA) de 24 × 24 px est atteint de justesse ; le seuil AAA (44 × 44 px) et la recommandation des systèmes mobiles ne le sont pas. |
| **Coordonnées non actionnables** | `index.html:184`, `index.html:193` | Le numéro de téléphone et l'adresse e-mail sont dans des `<span>`, sans lien `tel:` ni `mailto:`. Sur mobile, l'appel direct est impossible. |
| **Lien non identifiable comme lien** | `index.html:202` | « Télécharger mon CV » est un `<a>` sans soulignement (`style.css:25`), de couleur `#333` (`style.css:26`) au milieu de titres `#111` (`style.css:369`). La différence de couleur est de 1,49:1 entre les deux — imperceptible. Rien ne distingue visuellement ce lien d'un titre, en dehors de sa position. |
| **`target="_blank"` sans `rel`** | index:42, 46, 136, 156, 214, 218 ; archilog:70, 74 ; plateformeWeb:194, 198 | 10 occurrences, aucune `rel="noopener noreferrer"` (0 occurrence). Les navigateurs récents appliquent `noopener` implicitement ; `noreferrer` reste absent. Aucune indication n'est par ailleurs donnée à l'utilisateur qu'un nouvel onglet va s'ouvrir. |

### 5.5 Balises `<div>` là où une balise sémantique conviendrait

| Fichier:ligne | Élément actuel | Balise appropriée | Justification |
|---|---|---|---|
| `index.html:122`, `142` | `<div class="project-card">` | `<article>` | Contenu autonome et distribuable (un projet). |
| `index.html:84, 88, 92, 96, 100, 104, 108` | 7 × `<div class="skill-card">` | `<li>` dans un `<ul>` | Énumération de 7 éléments de même nature ; le nombre d'items n'est pas annoncé aux lecteurs d'écran. |
| `index.html:83` | `<div class="skills-container">` | `<ul>` | Conteneur de la liste ci-dessus. |
| `index.html:169, 178, 187, 196` | 4 × `<div class="card reveal">` | `<li>` dans un `<ul>`, ou `<address>` pour le bloc de coordonnées | Énumération de coordonnées ; `<address>` est la balise dédiée aux informations de contact de l'auteur. |
| `index.html:41`, `213` ; archilog:69 ; plateformeWeb:193 | `<div class="social-icons">` | `<ul>` dans un `<nav aria-label="Réseaux sociaux">` | Liste de liens de navigation externe. |
| `index.html:34` | `<div class="hero-content">` | conteneur de mise en page — acceptable | Seul usage purement présentationnel légitime. |
| `index.html:120` | `<div class="projects-grid">` | `<ul>` | Liste de projets. |
| `plateformeWeb.html:132` | `<div class="methods-container">` | `<ul>` ou `<ol>` | Énumération de 3 méthodes présentées comme un ensemble comparable. |
| `plateformeWeb.html:62` | `<div class="alert-box warning">` | `<aside>` ou `role="note"` | Encart d'avertissement hors du flux principal. |
| `plateformeWeb.html:106` | `<div class="parameters-card">` | `<section>` (titrée par le `h3` ligne 107) | Bloc de contenu doté d'un titre propre. |
| `plateformeWeb.html:169, 175, 178` | `<span class="btn-highlight">` | `<kbd>` | Désigne des commandes de l'interface décrite (« Calculer », « Retour », « Sauvegarder », « consulter »). |
| `plateformeWeb.html:182` | `<div class="fiche-container">` | `<figure>` (+ `<figcaption>`) | Image illustrative légendable. |
| `plateformeWeb.html:37, 52, 66, 80, 98` ; archilog:40 | 6 × `<div class="section-image">` | `<figure>` | Idem. |
| `pages/archilog.html:32` | `<main>` non fermée | — | Repère de contenu principal invalide (§3.7). |
| `index.html` (page entière) | aucun `<main>` | `<main>` | Repère de contenu principal absent. |

---

## 6. Étape 5 — SEO et métadonnées

### 6.1 Relevé par page

| Élément | `index.html` | `pages/archilog.html` | `pages/plateformeWeb.html` |
|---|---|---|---|
| `<title>` | ✅ « Mon Portfolio » (L6) | ✅ « Archilog - Présentation » (L7) | ✅ « Plateforme Web de Calcul » (L6) |
| `<meta name="description">` | ❌ **ABSENTE** | ✅ « Présentation du projet Archilog » (L6) | ❌ **ABSENTE** |
| `<meta name="viewport">` | ✅ (L5) | ✅ (L5) | ✅ (L5) |
| `<meta charset>` | ✅ UTF-8 (L4) | ✅ UTF-8 (L4) | ✅ UTF-8 (L4) |
| Attribut `lang` | ✅ `lang="fr"` (L2) | ✅ `lang="fr"` (L2) | ✅ `lang="fr"` (L2) |
| Open Graph (`og:*`) | ❌ **ABSENT** | ❌ **ABSENT** | ❌ **ABSENT** |
| Twitter Card | ❌ **ABSENT** | ❌ **ABSENT** | ❌ **ABSENT** |
| Favicon | ❌ **ABSENT** | ❌ **ABSENT** | ❌ **ABSENT** |
| `<link rel="canonical">` | ❌ **ABSENT** | ❌ **ABSENT** | ❌ **ABSENT** |
| `<meta name="robots">` | ❌ absent | ❌ absent | ❌ absent |
| `<meta name="author">` | ❌ absent | ❌ absent | ❌ absent |
| `<meta name="theme-color">` | ❌ absent | ❌ absent | ❌ absent |

Recherches exhaustives : `og:` → **0 occurrence** ; `twitter:` → **0 occurrence** ;
`canonical` → **0 occurrence** ; `favicon` → **0 occurrence** ; aucun `<link rel="icon">`.

**Conséquence directe des Open Graph absents :** partagé sur LinkedIn, X, Slack, Discord
ou WhatsApp, le lien n'affiche **aucun aperçu enrichi** — ni titre, ni description, ni
image. Pour un portfolio dont le canal de diffusion principal est LinkedIn, c'est un
défaut fonctionnel, pas un raffinement.

**Conséquence directe du favicon absent :** l'onglet du navigateur affiche l'icône
générique de document. Le site est non identifiable dans une barre d'onglets, dans les
favoris et dans l'historique.

### 6.2 Fichiers de référencement

| Fichier | État |
|---|---|
| `robots.txt` | ❌ **ABSENT** (vérifié à la racine) |
| `sitemap.xml` | ❌ **ABSENT** |
| Données structurées JSON-LD | ❌ **ABSENTES** — 0 occurrence de `application/ld+json` dans les 3 fichiers HTML |

L'absence de JSON-LD signifie qu'aucun schéma `Person`, `CreativeWork` ou `BreadcrumbList`
n'est déclaré. Un moteur de recherche ne dispose d'aucune donnée structurée sur l'identité
de l'auteur, ses compétences ou ses réalisations.

### 6.3 Qualité rédactionnelle des `title` et `description` existants

| Élément | Valeur | Longueur | Évaluation |
|---|---|---:|---|
| `index.html:6` — `<title>` | « Mon Portfolio » | 13 car. | **Le pire cas possible pour la page d'accueil.** Ne contient ni le nom de la personne, ni son métier, ni sa spécialité, ni sa localisation. Aucune requête de recherche n'y correspond, hors recherche nominative — que le titre ne satisfait pas non plus puisque le nom n'y figure pas. Longueur exploitable : 13 caractères sur les ~60 affichables. Le déterminant possessif « Mon » n'apporte aucune information indexable. |
| `pages/archilog.html:7` — `<title>` | « Archilog - Présentation » | 24 car. | **Insuffisant.** Ne contient pas le nom de l'auteur, ni la technologie (Flask, Python, SQLAlchemy), ni la nature du projet (gestion financière) — toutes informations pourtant présentes dans le corps de la page (ligne 38). Le mot « Présentation » est du remplissage sans valeur de recherche. « Archilog » seul est un nom propre non recherché. |
| `pages/plateformeWeb.html:6` — `<title>` | « Plateforme Web de Calcul » | 25 car. | **Insuffisant et incohérent.** Ne contient ni le nom de l'auteur, ni les technologies (PHP, MySQL, Raspberry Pi), pourtant listées en `index.html:131`. **Incohérence de nommage :** le projet s'appelle « Plateforme Web de Calcul**s** » (pluriel) en `index.html:124` et « Plateforme Web de Calcul » (singulier) ici. |
| `pages/archilog.html:6` — `description` | « Présentation du projet Archilog » | 32 car. | **Trop courte et sans valeur incitative.** Les moteurs affichent jusqu'à ~155 caractères : 123 caractères sont perdus. La description ne contient aucun des éléments différenciants disponibles dans la page (Python, Flask, SQLAlchemy Core, SQLite, Jinja2, interface CLI, import/export CSV — tous présents lignes 38 et 53-58). Elle paraphrase le `<title>` au lieu de le compléter. |

**Aucune des trois pages ne comporte le nom « MAROUAN Hazim-Rayan » dans son `<title>`**,
alors que ce nom est l'unique requête de recherche à forte intention pour un portfolio
personnel.

---

## 7. Étape 6 — Cohérence visuelle

### 7.1 Couleurs regroupées par usage supposé

**Bleu — rôle d'accentuation / action : 4 valeurs distinctes**

| Valeur | Occ. | Usage constaté | Lignes |
|---|---:|---|---|
| `#4285f4` | 13 | Accent principal : soulignés de titre, logo, icônes de compétence, fonds de bouton, bordures | 41, 64, 83, 151, 207, 250, 284, 296, 297, 489, 503, 529, 598 |
| `#3367d6` | 4 | État survolé des boutons | 301, 307, 308, 609 |
| `#3a6cf4` | 2 | Icônes de contact, fond du bouton d'envoi *(CSS mort)* | 353, 418 |
| `#235bf6` | 1 | Survol du bouton d'envoi *(CSS mort)* | 431 |
| `rgba(66, 133, 244, 0.3)` | 1 | Ombre de bouton — c'est `#4285f4` à 30 % | 611 |

**Gris de texte : 4 valeurs distinctes**

| Valeur | Occ. | Usage constaté | Lignes |
|---|---:|---|---|
| `#333` | 8 | Texte courant, liens, barres du hamburger, titres hero, fond du pied de page | 11, 26, 94, 130, 159, 238, 272, 619 |
| `#111` | 4 | Titres de carte contact, textes de formulaire *(partiellement mort)* | 369, 390, 405, 411 |
| `#555` | 2 | Éléments de liste de projet, paragraphes d'article | 265, 515 |
| `#666` | 3 | Textes secondaires | 135, 254, 376 |

**Fonds : 5 valeurs distinctes**

| Valeur | Occ. | Usage constaté | Lignes |
|---|---:|---|---|
| `#fff` | 14 | Fond de carte, fond de section impaire, bordure de photo, textes sur bleu | 123, 152, 165, 192, 285, 295, 340, 381, 417, 471, 476, 575, 620, 647 |
| `white` | 1 | **Même couleur, notation différente** — texte de bouton | 599 |
| `#f9f9f9` | 3 | Fond de section (**inerte** sur `.hero` et `.skills`, cf. §3.7) | 105, 181, 329 |
| `#f8f9fa` | 2 | Fond de section paire, fond d'élément de liste | 467, 528 |
| `#f5f9ff` | 1 | Survol du bouton secondaire | 306 |
| `#eee` | 1 | Bordure d'image d'article | 510 |

**Ombres : 5 valeurs distinctes**

`rgba(0, 0, 0, 0.1)` (56, 124, 448, 578), `rgba(0, 0, 0, 0.05)` (195, 478, 531),
`rgba(0, 0, 0, 0.15)` (457), `rgba(1, 1, 1, 0.15)` (348, 386),
`rgba(255, 255, 255, 0.95)` (55 — fond translucide du header).

### 7.2 Quasi-doublons identifiés

| Paire | Valeurs RGB | Distance euclidienne RGB | Contraste mutuel | Verdict |
|---|---|---:|---:|---|
| `#f9f9f9` (105, 181, 329) vs `#f8f9fa` (467, 528) | (249,249,249) vs (248,249,250) | **1,4** | **1,00** | **Quasi-doublon strict.** Écart d'un point sur deux canaux. Perceptuellement identiques. Deux valeurs pour le même rôle de « gris de fond ». |
| `#fff` (14 occ.) vs `white` (599) | (255,255,255) vs (255,255,255) | **0,0** | 1,00 | **Doublon exact**, deux notations. |
| `rgba(0, 0, 0, 0.15)` (457) vs `rgba(1, 1, 1, 0.15)` (348, 386) | (0,0,0) vs (1,1,1) | **1,7** | 1,00 | **Quasi-doublon strict.** Une ombre noire écrite de deux manières. |
| `#4285f4` (13 occ.) vs `#3a6cf4` (353, 418) | (66,133,244) vs (58,108,244) | 26,2 | 1,27 | **Doublon fonctionnel.** Deux bleus d'accent différents pour le même rôle. Distinguables côte à côte, incohérents à l'échelle du site : le bleu des icônes de contact (`#3a6cf4`) diffère du bleu de tout le reste (`#4285f4`) sans raison identifiable. |
| `#3a6cf4` (353, 418) vs `#235bf6` (431) | (58,108,244) vs (35,91,246) | 28,7 | 1,19 | Couple base/survol d'un composant mort. Ne s'articule avec aucun autre couple du site. |
| `#333` (8 occ.) vs `#111` (369, 390, 405, 411) | (51,51,51) vs (17,17,17) | 58,9 | 1,49 | **Doublon fonctionnel** pour le rôle « texte foncé ». Conséquence visible : le lien « Télécharger mon CV » (`#333` via `style.css:26`) et les titres de carte voisins (`#111` via `style.css:369`) diffèrent d'un écart imperceptible dans le même bloc (§5.4). |

**Bilan couleurs : 20 valeurs déclarées pour ce qui correspond à 8 rôles réels**
(accent, accent-survol, texte fort, texte moyen, texte faible, fond clair, fond très clair,
ombre). Soit **2,5 valeurs par rôle**. Aucune variable CSS n'est définie (0 occurrence de
`--`), donc aucune valeur n'est nommée par son rôle : chaque changement de charte imposerait
71 remplacements manuels.

### 7.3 Échelle typographique

**Tailles de police — 17 valeurs distinctes, dans deux unités mélangées :**

| Valeur | Lignes | Valeur | Lignes |
|---|---|---|---|
| `0.9rem` | 287 | `1em` | 408 |
| `1rem` | 695 | `1.1em` | 420 |
| `1.1rem` | 77, 171 | `1.2em` | 370 |
| `1.2rem` | 134, 213 | `1.6em` | 391 |
| `1.3rem` | 154 | `4em` | 354 |
| `1.4rem` | 236 | | |
| `1.5rem` | 490, 699 | | |
| `1.8rem` | 62, 676, 691 | | |
| `2rem` | 628, 672 | | |
| `2.5rem` | 32, 632 | | |
| `2.8rem` | 128 | | |
| `3rem` | 206 | | |

**Rapports entre valeurs `rem` consécutives :**

| Transition | Rapport | Transition | Rapport |
|---|---:|---|---:|
| 0.9 → 1 | 1,111 | 1.4 → 1.5 | 1,071 |
| 1 → 1.1 | 1,100 | 1.5 → 1.8 | **1,200** |
| 1.1 → 1.2 | 1,091 | 1.8 → 2 | 1,111 |
| 1.2 → 1.3 | 1,083 | 2 → 2.5 | **1,250** |
| 1.3 → 1.4 | 1,077 | 2.5 → 2.8 | 1,120 |
| | | 2.8 → 3 | 1,071 |

Une échelle modulaire présenterait un rapport **constant** (1,125 « seconde majeure »,
1,200 « tierce mineure », 1,250 « tierce majeure », 1,333 « quarte »). Ici les rapports
s'échelonnent de **1,071 à 1,250**, soit une amplitude de 17 %. Le segment 0,9 → 1,5 rem
est un simple pas additif de +0,1 rem (six valeurs pour un intervalle de 9,6 px, où deux
suffiraient), tandis que le haut de l'échelle procède par sauts arbitraires.

**Conclusion : il n'existe aucune échelle typographique. Les valeurs sont empiriques.**

**Mélange d'unités pour des valeurs équivalentes — 3 collisions :**
`1rem` (695) / `1em` (408) ; `1.1rem` (77, 171) / `1.1em` (420) ;
`1.2rem` (134, 213) / `1.2em` (370). Or `em` est relatif au parent et `rem` à la racine :
`1.2em` sur `.card .info h3` (ligne 370) et `1.2rem` sur `.skill-card h3` (ligne 213)
donnent la même valeur ici par coïncidence — le parent est à la taille par défaut — mais
divergeraient dès qu'un ancêtre changerait de taille.

**Graisses — 4 valeurs déclarées, 2 rendues :**

| Valeur | Lignes |
|---|---|
| `400` | 409 *(CSS mort)* |
| `500` | 288, 377, 421 |
| `600` | 78, 392, 604 |
| `700` | 63, 371 |

La seule famille déclarée est `'Arial', sans-serif` (ligne 9). Arial, dans son installation
standard sur Windows et macOS, ne fournit que les variantes **Regular (400)** et **Bold (700)**.
Selon l'algorithme d'appariement de CSS Fonts Level 4, une demande de `500` se résout vers
`400` et une demande de `600` vers `700`. **Les 6 déclarations de graisses 500 et 600 ne
produisent donc aucune graisse distincte** : le site rend deux graisses là où quatre sont
écrites. *(Ce point dépend des polices installées sur le poste du visiteur et n'est pas
vérifiable par lecture du seul dépôt — voir §10.)*

**Hauteurs de ligne — 5 valeurs, sans corrélation avec la taille de police :**

| Valeur | Ligne | Cible | Taille de police effective |
|---|---:|---|---|
| `1.4` | 268 | `.project-info li` | 16 px (héritée) |
| `1.5` | 256 | `.project-info p` | 16 px (héritée) |
| `1.6` | 10 | `body` | 16 px |
| `1.7` | 514 | `article p` | 16 px (héritée) |
| `1.8` | 172 | `.about-content` | 17,6 px (`1.1rem`, ligne 171) |

**Preuve directe de l'arbitraire :** `.project-info p` (ligne 253) et `article p` (ligne 513)
rendent tous deux du texte à **16 px** et reçoivent des interlignages **différents**
(1,5 et 1,7). Une règle typographique cohérente lierait l'interlignage à la taille et à la
longueur de ligne, pas au composant.

**Interlettrage — 1 seule déclaration dans tout le fichier :** `letter-spacing: 2px`
(ligne 423), située **dans le bloc mort** `.contact-form .input-box .send-btn`. Le site
rendu ne comporte donc **aucun réglage d'interlettrage**, y compris sur les titres de
2,5 rem (`.section-title`, ligne 32) et de 2,8 rem (`.hero-text h2`, ligne 128), où un
resserrement optique est pourtant la norme.

### 7.4 Espacements et rythme vertical

**Valeurs d'espacement distinctes relevées (`margin`, `padding`, `gap`) : 12**

| Valeur | Occurrences | Lignes |
|---|---:|---|
| `5px` | 1 | 95 |
| **`8px`** | 1 | 266 |
| `10px` | 8 | 42, 240, 283, 372, 407, 493, 526, 527, 601 |
| `15px` | 9 | 73, 142, 208, 212, 237, 255, 277, 491, 507, 526, 659 |
| **`18px`** | 1 | 283 |
| `20px` | 14 | 17, 136, 176, 260, 261, 328, 342, 400, 440, 449, 522, 570, 577, 579, 621, 638 |
| `25px` | 4 | 229, 343, 479, 549 |
| `30px` | 2 | 188, 480 |
| `40px` | 3 | 31, 54, 114, 394 |
| `50px` | 1 | 383, 384 |
| `60px` | 1 | 106 |
| `80px` | 2 | 21, 462 |

**10 valeurs sur 12 sont des multiples de 5 px** (83 %). **Deux exceptions rompent la
grille : `8px`** (`margin-bottom` de `.project-info li`, ligne 266) **et `18px`**
(`padding` horizontal de `.project-links a`, ligne 283).

Mais l'adhésion à une grille de 5 px ne suffit pas à faire un rythme : **le pas n'est pas
constant.** La progression est 5 → 10 → 15 → 20 → 25 → 30 (pas de +5), puis 30 → 40 → 50
(pas de +10), puis 50 → 60 → 80 (pas de +10 puis +20). Aucune base de 4 px ni de 8 px
n'est respectée (`25px`, présent 4 fois, n'est multiple ni de 4 ni de 8). Aucune
progression géométrique.

**Rayons de bordure — 5 valeurs distinctes**, également sans système :
`5px` (286, 412, 602), `8px` (447, 530), `10px` (194, 349, 385, 578), `12px` (477),
`50%` (121, 153). Trois composants de même nature reçoivent trois rayons différents :
`.skill-card` = 10 px (194), `article` = 12 px (477), `.fiche-container` = 8 px (578).

**Aucun rythme vertical n'est établi.** Le `line-height` de base est 1.6 sur une police de
16 px, soit une ligne de base de **25,6 px**. Aucun espacement relevé n'est un multiple de
25,6 px, ni de sa moitié (12,8 px). Les espacements verticaux (80 px de `padding` de
section, 40 px de `margin-bottom` de titre, 20 px de `margin-bottom` de paragraphe) sont
construits sur une grille de 20 px sans relation avec la grille de texte.

### 7.5 Conclusion : design system implicite ou valeurs empiriques ?

**Verdict : les valeurs sont empiriques. Il n'existe aucun design system, même implicite.**

Justification chiffrée :

| Critère | Attendu d'un design system | Constat |
|---|---|---|
| Jetons nommés | Variables CSS ou équivalent | **0 variable CSS** (`--`) dans 701 lignes |
| Couleurs | ~8 rôles → ~10-14 valeurs | **20 valeurs pour 8 rôles**, dont **6 paires de quasi-doublons** |
| Échelle typographique | Rapport constant | **Rapports de 1,071 à 1,250** — amplitude de 17 % |
| Unité typographique | Une seule (`rem`) | **2 unités mélangées** (`rem` et `em`), avec 3 valeurs numériques en collision |
| Graisses | Toutes rendues | **4 déclarées, 2 rendues** |
| Interlignage | Lié à la taille | **5 valeurs**, dont 3 différentes pour la même taille de 16 px |
| Interlettrage | Réglé sur les grands titres | **1 déclaration, dans du code mort** |
| Espacements | Base 4 ou 8 px, progression régulière | **Base 5 px à 83 %**, pas non constant, 2 valeurs hors grille |
| Rayons | 2-3 valeurs | **5 valeurs**, 3 composants comparables → 3 rayons différents |
| Composants | Règles de base + variantes | `.project-card` et `.projects-grid` n'ont **aucune règle de base** — uniquement des surcharges en media query |
| Couplage structure/style | Aucun | **3 mécanismes reposent sur `nth-child`** (fonds, délais d'animation, ordre des images) |

Le CSS a été écrit **par accrétion**, chaque section ajoutant ses valeurs sans référence à
celles déjà posées. Deux blocs sont déclarés en double (`.container` lignes 14 et 567 ;
`section` lignes 20 et 461), ce qui confirme l'absence de vue d'ensemble au moment de la
rédaction. La présence de 75 lignes de CSS pour un formulaire qui n'existe pas indique un
copier-coller depuis une source externe non adaptée.

**Bonne nouvelle pour la refonte :** il n'y a aucun système à désapprendre, aucune
convention établie à préserver, aucune dette de nommage à porter. La construction d'un
design system se fera sur une page blanche.

### 7.6 Caractère de la typographie et adéquation à une direction artistique éditoriale

**Caractère actuel :** il n'y en a pas.

- **Une seule famille déclarée**, `'Arial', sans-serif` (ligne 9) — une linéale grotesque
  neutre de 1982, conçue comme substitut d'Helvetica pour l'impression bureautique. C'est
  la valeur par défaut *de facto* du web des années 2000.
- **Aucune police web** : 0 `@font-face`, 0 lien Google Fonts, aucun fichier de police
  dans le dépôt. La seule ressource typographique téléchargée est la police **d'icônes**
  Font Awesome (258 Ko), c'est-à-dire l'inverse d'un investissement typographique.
- **Aucun contraste de famille** : pas de duo display/texte, pas de serif, pas de mono
  (alors que le contenu parle de PHP, SQL, Flask, SQLAlchemy — un mono aurait une fonction).
- **Aucun réglage fin** : 0 `letter-spacing` actif, 0 `font-feature-settings`,
  0 `font-variant`, 0 `text-wrap`, 0 `hyphens`, 0 `font-optical-sizing`.
- **La seule intention graphique typographique** est le trait bleu de 50 × 4 px sous les
  titres de section (`styles/style.css:36-43`) et de 50 × 3 px sous les `h3` de projet
  (243-251) — une convention de gabarit gratuit de la décennie 2010, non un parti pris.
- **Mesure de ligne :** `.about-content` est limité à 800 px (ligne 169) pour une police
  de 17,6 px, soit environ **95 caractères par ligne**. La plage de lisibilité admise en
  typographie éditoriale est de 45 à 75 caractères. Le corps de texte le plus long du site
  est donc réglé 27 % au-delà de la limite haute.

**Adéquation à une direction artistique éditoriale à forte identité : nulle, mais sans
obstacle.**

L'existant n'oppose aucune résistance à une refonte typographique : il n'y a ni charte à
respecter, ni police sous licence à conserver, ni composant dont la mise en page dépendrait
de métriques particulières. Une DA éditoriale devra tout construire — choix de familles,
échelle, graisses, interlettrage, mesure, rythme vertical, hiérarchie — et **la totalité
des 17 tailles, 4 graisses et 5 interlignages actuels est à remplacer**, aucune valeur
n'étant justifiée par un système.

Trois points de vigilance pour la future DA, issus du contenu existant :

1. Le corps de texte réel est long (§9) : 223 mots pour « À propos », 578 mots pour la page
   `plateformeWeb`. Une DA éditoriale doit y répondre par une mesure de ligne maîtrisée
   — le réglage actuel (95 caractères) est le premier point à corriger.
2. Le contenu comporte des **notations mathématiques** (« Espérance (µ) », « Forme (λ) »,
   `plateformeWeb.html:110, 113`) et des **termes de commande** (« Calculer », « Retour »,
   « Sauvegarder », lignes 169-178). Une famille sans glyphes grecs correctement dessinés
   ou sans compagnon monospace dégradera ces passages.
3. Le nom « MAROUAN Hazim-Rayan » est actuellement composé en capitales pour le patronyme
   (`index.html:14`, `39`). Ce choix, répété 6 fois dans le site, sera un point de départ
   fort ou un obstacle selon la famille retenue — les capitales exigent un interlettrage
   positif que le CSS actuel ne fournit pas.

---

## 8. Étape 7 — Évaluation de la migration vers Next.js

### 8.1 Environnement et compatibilité

| Élément | Version installée | Exigence Next.js | Verdict |
|---|---|---|---|
| Node.js | **v24.15.0** | `next@16.3.1` → `engines: { node: '>=20.9.0' }` | ✅ **Compatible** |
| npm | **11.12.1** | aucune contrainte publiée | ✅ Compatible |
| npx | 11.12.1 | — | ✅ Disponible |
| Git | 2.51.0.windows.1 | — | ✅ |

Dernière version stable de Next.js au moment de l'audit : **16.3.1**. React associé : **19.2.8**.
Node 24 est une ligne LTS ; la marge est confortable (exigence 20.9, installé 24.15).

**Aucune dépendance n'est installée et aucun `package.json` n'existe** : le projet part de zéro
côté outillage. Aucun conflit de version, aucune migration de dépendances à prévoir.

### 8.2 Contenu récupérable, à restructurer, à réécrire

**Récupérable tel quel** (transposition directe, sans réécriture éditoriale) :

| Contenu | Source | Volume |
|---|---|---|
| Les 4 blocs STAR du projet « Plateforme Web » | `index.html:129-132` | 4 items, 1 041 caractères |
| Les 4 blocs STAR du projet « Archilog » | `index.html:149-152` | 4 items, 705 caractères |
| Le pas-à-pas fonctionnel de la plateforme web | `plateformeWeb.html:42-184` | 578 mots, 12 paragraphes, 3 articles |
| La liste des fonctionnalités d'Archilog | `archilog.html:53-58` | 6 items |
| Le descriptif technique d'Archilog | `archilog.html:38` | 1 paragraphe |
| Les 4 contraintes de paramètres de calcul | `plateformeWeb.html:110-120` | 4 items |
| Coordonnées et liens externes | `index.html:175, 184, 193` ; `42, 46, 136, 156` | 3 + 4 entrées |
| Les 12 visuels de projet | `img/*` | à ré-encoder (§4.3) |

**À restructurer** (le contenu reste, sa forme change) :

| Contenu | Source | Transformation requise |
|---|---|---|
| En-tête + navigation | 3 × 19 lignes | → un composant unique dans `app/layout.tsx` |
| Pied de page | 3 × 15 lignes | → un composant unique |
| Blocs STAR en `<ul><li><strong>Situation :</strong>…` | `index.html:128-133`, `148-153` | → champs typés (`situation`, `taches`, `actions`, `resultats`), la mise en forme cessant d'être portée par le balisage |
| Liste des 7 compétences | `index.html:84-111` | → tableau de données + jeu d'icônes SVG (abandon de Font Awesome) |
| Les 2 fiches projet | `index.html:122-159` + les 2 pages détaillées | → contenu typé, une source unique alimentant la vignette et la page |
| Les 4 cartes de contact | `index.html:169-205` | → données ; téléphone et e-mail deviennent actionnables (`tel:`, `mailto:`) |

**À réécrire intégralement** (le contenu actuel ne sert pas le positionnement visé) :

| Contenu | Source | Motif |
|---|---|---|
| Les 3 `<title>` et la seule `description` | index:6 ; archilog:6-7 ; plateformeWeb:6 | Aucun ne contient le nom de l'auteur (§6.3) |
| Section « À propos » | `index.html:61-73` | **223 mots, 23 balises `<strong>`** — soit un passage en gras tous les 9,7 mots. À cette densité, la mise en gras ne hiérarchise plus rien. Le propos (développement personnel, lecture, sport, ambition entrepreneuriale en IA) est générique, à la première personne, sans preuve, sans chiffre, sans contexte professionnel. Pour un positionnement hybride technique/business, ce texte n'apporte aucun élément de différenciation. |
| L'accroche | `index.html:40` | « Développeur Web \| Designer \| Étudiant en BUT informatique » — énumération séparée par des barres verticales, sans positionnement. Le titre « Designer » n'est étayé par aucun contenu du site. |
| Section « Mes compétences » | `index.html:82-112` | 7 logos sans niveau, sans contexte, sans lien vers une réalisation. **9 mots au total** pour une section entière. Aucune compétence business, alors que le positionnement visé est hybride. |
| Titre « Contacts » | `index.html:167` | Pluriel inapproprié pour une section de coordonnées. |
| Le libellé « Taches » | `index.html:130, 150` | Faute d'accentuation (« Tâches »), présente **deux fois**. |
| Les `alt` des 12 images | §5.2 | 1 doublon, 7 redondances, 1 incorrect, 2 fautes de langue |

**Volume éditorial total du site : 8 073 caractères de texte visible**
(`index.html` 3 786 / 563 mots ; `plateformeWeb.html` 3 620 / 578 mots ;
`archilog.html` 667 / 92 mots). C'est un volume que la réécriture peut absorber
intégralement.

**Point d'hygiène à traiter à la migration : mélange d'apostrophes.** Le site utilise
l'apostrophe typographique `’` (U+2019) en `index.html:130, 132, 151, 152` et l'apostrophe
droite `'` (U+0027) dans **26 autres passages** répartis sur les trois pages. De même,
`plateformeWeb.html:64` et `85` emploient des guillemets droits `"` là où le français
appelle des chevrons. Sans normalisation à la migration, cette incohérence sera reconduite
dans le nouveau contenu.

### 8.3 Fonctionnalités JavaScript face à React

| Bloc JS | Lignes | Devenir | Justification |
|---|---:|---|---|
| Bascule du menu hamburger | 2-8 | **Réimplémentation** (composant client, `useState`) | La logique est nécessaire ; l'implémentation par manipulation de classe ne l'est pas. À reprendre **avec** l'accessibilité clavier absente aujourd'hui (§5.4). |
| Fermeture du menu au clic sur un lien | 11-16 | **Réimplémentation** (gestionnaire sur le lien, ou effet sur `usePathname`) | Idem. |
| Réduction du header au défilement | 19-28 | **Réimplémentation obligatoire** | Le mécanisme actuel (écriture de styles en ligne) est incompatible avec React, qui ne réconcilie pas les styles en ligne posés hors de son cycle. À reconstruire sur un `IntersectionObserver` avec sentinelle, ou en CSS pur. |
| Défilement doux vers les ancres | 31-45 | **DEVIENT INUTILE** | `scroll-behavior: smooth` en CSS et `scroll-margin-top` sur les cibles couvrent le besoin nativement — **et rétablissent** la mise à jour du fragment d'URL et l'historique, que le `preventDefault()` de la ligne 33 supprime aujourd'hui (§3.7). |
| Animation des barres de compétences | 48-57 | **DEVIENT INUTILE — code mort** | Ni `.skill-progress` ni `data-progress` n'existent (§3.1, §3.3). Rien à migrer. |
| Révélation des cartes projet | 60-69 | **Réimplémentation facultative** | L'effet est aujourd'hui nul (aucun état initial n'est posé, §3.4). Si l'effet est souhaité, `IntersectionObserver` dans un petit composant client, ou `animation-timeline: view()` en CSS pur. |
| `isElementInViewport` | 72-78 | **DEVIENT INUTILE** | Remplacée intégralement par `IntersectionObserver`, asynchrone et sans recalcul de mise en page forcé. |
| Formulaire de contact | 81-101 | **DEVIENT INUTILE — code mort** | Aucun formulaire n'existe (§3.2). Si un formulaire est ajouté, il relèvera d'une Server Action avec validation serveur, pas d'un `alert()` client. |

**Bilan : sur 102 lignes de JavaScript, 40 lignes sont mortes (39 %), 15 lignes deviennent
inutiles par équivalent natif, et 47 lignes correspondent à 3 comportements à
réimplémenter** — dont deux (menu, header) doivent l'être de toute façon pour corriger les
défauts relevés aux §3.4 et §5.4.

### 8.4 Arborescence de composants React proposée

```
.
├─ app/
│  ├─ layout.tsx                  # <html lang="fr">, metadata globale, polices, Header, Footer, SkipLink
│  ├─ page.tsx                    # accueil — assemble les sections
│  ├─ opengraph-image.tsx         # image de partage générée (absente aujourd'hui, §6.1)
│  ├─ icon.tsx                    # favicon (absent aujourd'hui, §6.1)
│  ├─ sitemap.ts                  # sitemap.xml (absent aujourd'hui, §6.2)
│  ├─ robots.ts                   # robots.txt (absent aujourd'hui, §6.2)
│  ├─ not-found.tsx
│  └─ projets/
│     ├─ page.tsx                 # index des projets (n'existe pas aujourd'hui)
│     └─ [slug]/
│        ├─ page.tsx              # generateStaticParams + generateMetadata
│        └─ opengraph-image.tsx
│
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx               # serveur — remplace 3 × 19 lignes dupliquées (§3.6)
│  │  ├─ Nav.tsx                  # serveur — liste des liens
│  │  ├─ MobileMenu.tsx           # CLIENT — état ouvert/fermé, <button>, aria-expanded, piège de focus
│  │  ├─ HeaderScrollState.tsx    # CLIENT — IntersectionObserver, remplace js/script.js:19-28
│  │  ├─ Footer.tsx               # serveur — remplace 3 × 15 lignes dupliquées (§3.6)
│  │  └─ SkipLink.tsx             # n'existe pas aujourd'hui (§5.4)
│  │
│  ├─ sections/
│  │  ├─ Hero.tsx                 # ex-index.html:33-53
│  │  ├─ About.tsx                # ex-index.html:56-77 (contenu à réécrire)
│  │  ├─ Skills.tsx               # ex-index.html:80-114 → <ul> sémantique
│  │  ├─ ProjectList.tsx          # ex-index.html:117-162 → <ul> sémantique
│  │  └─ Contact.tsx              # ex-index.html:165-208 → <address>
│  │
│  ├─ project/
│  │  ├─ ProjectCard.tsx          # <article> — vignette
│  │  ├─ ProjectStar.tsx          # rend les 4 champs Situation/Tâches/Actions/Résultats
│  │  └─ ProjectGallery.tsx       # <figure> + <figcaption> + next/image
│  │
│  └─ ui/
│     ├─ SectionTitle.tsx
│     ├─ Prose.tsx                # conteneur éditorial — mesure de ligne maîtrisée (§7.6)
│     ├─ Button.tsx / LinkButton.tsx
│     ├─ Card.tsx
│     ├─ SocialLinks.tsx          # remplace 4 blocs dupliqués (§3.6)
│     ├─ Icon.tsx                 # SVG en ligne — remplace 258 Ko de Font Awesome (§4.5)
│     └─ Figure.tsx
│
├─ content/
│  └─ projets/
│     ├─ plateforme-web-calculs.mdx
│     └─ archilog.mdx
│
├─ lib/
│  ├─ projects.ts                 # lecture + typage du contenu
│  └─ site.ts                     # nom, URL canonique, liens sociaux — source unique
│
├─ styles/
│  ├─ globals.css
│  └─ tokens.css                  # variables CSS — 0 existe aujourd'hui (§7.5)
│
├─ public/
│  ├─ images/                     # sources ré-encodées (§4.3)
│  └─ cv.pdf
│
├─ package.json                   # absent aujourd'hui
├─ .gitignore                     # absent aujourd'hui
├─ next.config.ts
├─ tsconfig.json
└─ AUDIT.md
```

**Composants clients (`'use client'`) requis : 2 seulement** — `MobileMenu` et
`HeaderScrollState`. Tout le reste peut être rendu côté serveur. Le site n'a aucune
interactivité au-delà du menu et de l'effet de header.

### 8.5 Risques concrets et points de vigilance

| # | Risque | Fondement dans le dépôt | Gravité |
|---:|---|---|---|
| 1 | **Rupture d'URL.** `pages/plateformeWeb.html` et `pages/archilog.html` deviendraient `/projets/<slug>`. Tout lien entrant existant se casse. | `index.html:135, 155` | Majeur |
| 2 | **Redirections impossibles en export statique.** Si la cible est GitHub Pages, les redirections `next.config` (serveur) ne sont pas appliquées ; il faudrait des pages de redirection HTML. | `output: 'export'` désactive `redirects()` | Majeur |
| 3 | **`next/image` neutralisé en export statique.** Avec `output: 'export'`, l'optimisation d'image à la demande est indisponible : `images.unoptimized: true` ou chargeur personnalisé. Sans pré-optimisation au build, **les gains du §4.3 sont perdus**. | Contrainte connue de Next.js | Majeur |
| 4 | **`basePath` sur GitHub Pages de projet.** Le site serait servi sous `/<nom-du-dépôt>/`, imposant `basePath` + `assetPrefix`. | remote = `.../Porfolio.git` | Moyen |
| 5 | **Le nom du dépôt contient une faute.** `Porfolio` apparaîtrait dans l'URL publique. Le renommer change l'URL canonique — décision à prendre **avant** toute indexation. | `git remote -v` (§2.2) | Majeur |
| 6 | **Jekyll ignore les dossiers préfixés par `_`.** GitHub Pages passe par Jekyll par défaut ; le dossier `_next/` généré par Next.js serait **exclu du site publié** sans fichier `.nojekyll`. Ce fichier est **absent** (§2.1). | `.nojekyll` absent | **Critique si GitHub Pages** |
| 7 | **`.gitignore` absent.** Un premier `npm install` sans `.gitignore` proposerait `node_modules/` et `.next/` au commit. | `.gitignore` absent (§2.1) | Majeur |
| 8 | **`profile.jpg` de 2,3 Mo ne doit pas être committé tel quel.** Il est déjà dans l'historique Git (commit `79a099b`) ; le placer dans `public/` sans ré-encodage reconduirait le problème. | §4.3 | Majeur |
| 9 | **Font Awesome en React reste lourd.** Les paquets `@fortawesome/*` réintroduisent un moteur d'icônes. Le remplacement par des SVG en ligne pour 17 glyphes est un choix de conception à acter tôt. | §4.5 | Moyen |
| 10 | **Mélange d'apostrophes et de guillemets.** À normaliser lors de la migration du contenu, sous peine de reconduction. | §8.2 | Mineur |
| 11 | **Aucun test, aucun lint, aucune CI.** Rien ne détectera les régressions. Aucun dossier `.github/`. | §2.1 | Moyen |
| 12 | **Aucun `README.md`.** Supprimé au commit `0a4a75b`. Un projet Next.js sans instructions de démarrage. | §2.2 | Mineur |
| 13 | **Sensibilité à la casse.** `core.ignorecase = true` en local, hébergeurs sous Linux sensibles à la casse. `rectangles-gauche.PNG` et `plateformeWeb.html` sont les deux cas à surveiller. | §2.2, §4.6 | Moyen |
| 14 | **Le contenu réel est court.** 8 073 caractères pour tout le site. Une refonte technique n'améliorera pas un portfolio dont le fond est mince : la réécriture éditoriale est le facteur limitant, pas la stack. | §8.2 | Majeur |

### 8.6 Compatibilité du mode de déploiement actuel

**Mode de déploiement actuel :** fichiers statiques servis depuis la racine du dépôt, avec
`index.html` à la racine et chemins relatifs (`styles/style.css`, `js/script.js`,
`img/…`, `../index.html`).

**Ce qui est vérifiable dans le dépôt :**

| Indice | État |
|---|---|
| `CNAME` (domaine personnalisé GitHub Pages) | ❌ absent |
| `.nojekyll` | ❌ absent |
| `.github/workflows/` | ❌ absent |
| Branche `gh-pages` | ❌ absente (`git branch -a` ne liste que `main`) |
| `netlify.toml`, `vercel.json` | ❌ absents |
| Chemins absolus commençant par `/` | ❌ aucun — tous les chemins sont relatifs |
| Remote | `https://github.com/HRazim/Porfolio.git` |

**Ce qui n'est pas vérifiable par lecture du code :** l'activation effective de GitHub Pages
et la source configurée (branche `main` racine, `main` + `/docs`, ou déploiement par action)
sont des réglages côté GitHub, absents du dépôt. Voir §10.

**Incompatibilités identifiées, sous l'hypothèse GitHub Pages :**

1. **Sans `.nojekyll`, le dossier `_next/` produit par Next.js serait exclu de la
   publication.** Jekyll ignore par convention tout fichier ou dossier préfixé par `_`.
   Le site se déploierait sans aucun JavaScript ni CSS. C'est l'incompatibilité la plus
   sévère et la plus fréquemment rencontrée.
2. **Un site de projet GitHub Pages est servi sous `/<dépôt>/`**, ce qui exige `basePath`
   et `assetPrefix`. Les chemins relatifs actuels fonctionnent aujourd'hui **parce qu'ils
   sont relatifs** ; les chemins générés par Next.js sont absolus.
3. **GitHub Pages ne sert que des fichiers statiques.** Sont donc exclus : Server Actions,
   Route Handlers, `middleware.ts`, ISR, `redirects()` / `rewrites()` / `headers()`, et
   l'optimisation d'image à la demande. Un formulaire de contact fonctionnel imposerait un
   service tiers ou un changement d'hébergeur.
4. **Aucun en-tête HTTP n'est configurable** sur GitHub Pages : ni CSP, ni
   `Cache-Control` personnalisé, ni `Strict-Transport-Security`.

**Aucune incompatibilité si l'hébergement bascule vers une plateforme supportant le
rendu serveur.** Dans ce cas, les points 1 à 4 disparaissent, `output: 'export'` devient
inutile, `next/image` retrouve son optimisation, et les redirections 301 depuis les
anciennes URL `.html` deviennent triviales.

---

## 9. Étape 8 — Inventaire exhaustif du contenu existant

*Restitution fidèle, sans reformulation ni jugement. Volume total : 8 073 caractères de
texte visible.*

### 9.1 `index.html`

#### En-tête (L12-30)
- **Logo (L14)** : « MAROUAN Hazim-Rayan » — lien vers `index.html`
- **Navigation (L18-22)** : « Accueil » (`#accueil`) · « À propos » (`#a-propos`) ·
  « Skills » (`#skills`) · « Projets » (`#projects`) · « Contact » (`#contact`)
- **Bouton menu (L24)** : `aria-label="Menu"`

#### Section Accueil — `#accueil` (L33-53)
- **Image (L36)** : `img/profile.jpg`, alt « Photo de profil de MAROUAN Hazim-Rayan »
- **Titre (L39)** : « MAROUAN Hazim-Rayan »
- **Accroche (L40)** : « Développeur Web | Designer | Étudiant en BUT informatique »
- **Liens sociaux (L42-49)** :
  - GitHub → `https://github.com/HRazim` (`aria-label="GitHub Profile"`, libellé « GitHub »)
  - LinkedIn → `https://www.linkedin.com/in/hazim-rayan-marouan-8bb382338` (`aria-label="LinkedIn Profile"`, libellé « LinkedIn »)

#### Section À propos — `#a-propos` (L56-77)
- **Titre de section (L58)** : « À propos de moi »
- **Sous-titre (L60)** : « Passion »
- **Paragraphe 1 (L61)** : « Je suis passionné par le **développement personnel**, la **lecture** et le **sport**. Ces trois éléments rythment ma vie et me poussent à atteindre mes objectifs. »
- **Paragraphe 2 (L63)** : « Tout d'abord, le **développement personnel** m'aide à devenir une personne plus **humaine**. Il me permet de me **recentrer**, non seulement sur moi-même, mais aussi sur les autres. L'**apprentissage** est essentiel pour moi, car il me permet de me **découvrir** un peu plus chaque jour. »
- **Paragraphe 3 (L65)** : « Ensuite, la **lecture** occupe une place **fondamentale** dans ma vie. Elle m'aide à acquérir de nouvelles **connaissances** dans des domaines variés et enrichit mon **vocabulaire**. »
- **Paragraphe 4 (L67)** : « Enfin, le **sport** joue un rôle clé dans mon équilibre. Il m'aide à **réguler** mes émotions, à réduire mon **stress** et à repousser mes **limites**. Étroitement lié à la santé mentale et physique, il représente un véritable **atout** pour mon **bien-être**. »
- **Sous-titre (L69)** : « Ambition »
- **Paragraphe 5 (L70)** : « Plus tard, je souhaite devenir **entrepreneur** dans le domaine de l'**intelligence artificielle**. Avec l'essor de l'IA et l'émergence massive de nouveaux métiers, je perçois une opportunité unique de créer mon **entreprise** dans un secteur qui bouleversera notre quotidien. C'est pourquoi je m'attache à acquérir des compétences en **développement**, afin de me spécialiser dans ce domaine innovant. »
- **Paragraphe 6 (L72)** : « Je suis conscient qu'il me reste encore beaucoup à apprendre, mais mes ambitions élevées sont le reflet de ma **détermination** et de mon engagement à agir concrètement pour les réaliser. »

#### Section Skills — `#skills` (L80-114)
- **Titre de section (L82)** : « Mes compétences »
- **Compétences listées (L84-111)**, chacune avec une icône Font Awesome et un `h3` :
  1. **HTML** (L86, icône `fab fa-html5`)
  2. **CSS** (L90, icône `fab fa-css3-alt`)
  3. **JavaScript** (L94, icône `fab fa-js`)
  4. **Python** (L98, icône `fab fa-python`)
  5. **Java** (L102, icône `fab fa-java`)
  6. **PHP** (L106, icône `fab fa-php`)
  7. **SQL** (L110, icône `fas fa-database`)

#### Section Projets — `#projects` (L117-162)
- **Titre de section (L119)** : « Mes Projets »

**Projet 1 (L122-139)**
- **Titre (L124)** : « Plateforme Web de Calculs »
- **Résumé (L126)** : « Application web déployée sur Raspberry Pi permettant d'effectuer divers types de calculs, avec gestion d'utilisateurs hiérarchisée et sécurité intégrée. »
- **Situation (L129)** : « Créer une application web pour réaliser divers types de calculs, avec une gestion des utilisateurs et une sécurité intégrée. »
- **Taches (L130)** : « Développer une plateforme web déployée sur Raspberry Pi, comprenant des fonctionnalités de calcul et une hiérarchie d'utilisateurs. »
- **Actions (L131)** : « Mettre en place une architecture réseau, utiliser PHP et MySQL pour le backend, HTML/CSS et JavaScript pour le frontend, intégrer des techniques de cryptographie pour la sécurité, et déployer sur Raspberry Pi 4 avec accès SSH. »
- **Résultats (L132)** : « Application web opérationnelle permettant aux utilisateurs (administrateurs système, administrateurs web, utilisateurs inscrits, visiteurs) de s'inscrire via un captcha, de se connecter de manière sécurisée, d'effectuer des calculs, de stocker leurs résultats et de gérer leurs comptes, dans un environnement optimisé et sécurisé. »
- **Liens (L135-136)** : « Voir le projet » → `pages/plateformeWeb.html` · « Code source » → `https://github.com/Ethan-Da/PROBABILITY`

**Projet 2 (L142-159)**
- **Titre (L144)** : « Archilog - Gestion Financière »
- **Résumé (L146)** : « Application de gestion financière développée avec Flask et SQLAlchemy Core, offrant une interface web et une interface en ligne de commande (CLI) pour manipuler les données. »
- **Situation (L149)** : « Créer une application de gestion financière avec des interfaces web et CLI. »
- **Taches (L150)** : « Développer une application utilisant Flask et SQLAlchemy Core pour gérer les données financières. »
- **Actions (L151)** : « Mettre en œuvre l'architecture MVC pour structurer le code, utiliser SQLite pour la persistance des données, et développer une interface web intuitive ainsi qu'une interface CLI pour l'automatisation. »
- **Résultats (L152)** : « Application opérationnelle permettant l'affichage, la création, la modification et la suppression d'entrées financières, avec support pour l'importation/exportation de données au format CSV et une gestion des erreurs via des messages flash. »
- **Liens (L155-156)** : « Voir le projet » → `pages/archilog.html` · « Code source » → `https://github.com/HRazim/Architecture-Logiciel`

#### Section Contact — `#contact` (L165-208)
- **Titre de section (L167)** : « Contacts »
- **Carte 1 (L169-177)** — icône `fas fa-map-marker-alt` — **« Adresse »** : « Paris, France »
- **Carte 2 (L178-186)** — icône `fas fa-phone` — **« Téléphone »** : « +33 7 49 02 97 20 »
- **Carte 3 (L187-195)** — icône `fas fa-envelope` — **« Email »** : « rhazim@gmx.com »
- **Carte 4 (L196-205)** — icône `fas fa-file-alt` — **« Télécharger mon CV »** → `pdf/cv.pdf` (attribut `download`)

#### Pied de page (L211-225)
- GitHub → `https://github.com/HRazim` (L214) · LinkedIn → `https://www.linkedin.com/in/hazim-rayan-marouan-8bb382338` (L218)
- **Copyright (L224)** : « © 2025 MAROUAN Hazim-Rayan. Tous droits réservés. »

### 9.2 `pages/archilog.html`

- **`<title>` (L7)** : « Archilog - Présentation »
- **`meta description` (L6)** : « Présentation du projet Archilog »
- **En-tête / pied de page** : identiques à `index.html` (§9.1), liens préfixés `../index.html`

#### Section 1 (L33-45)
- **Titre (L36)** : « Archilog »
- **Paragraphe (L38)** : « Archilog est une application de gestion financière développée en Python, utilisant Flask pour l'interface web, SQLAlchemy Core pour la gestion de la base de données SQLite, et Jinja2 pour la génération de pages HTML dynamiques. »
- **Image (L41)** : `../img/archilog_screenshot1.png`, alt « Capture d'écran du projet Archilog »

#### Section 2 (L48-63)
- **Titre (L50)** : « Fonctionnalités principales »
- **Liste (L53-58)** :
  1. « **Affichage** de toutes les entrées financières »
  2. « **Création**, **modification** et **suppression** d'entrées »
  3. « **Importation** et **exportation** de données au format CSV »
  4. « Interface web intuitive »
  5. « Gestion des erreurs avec messages flash »
  6. « Interface en ligne de commande complète »
- **Image (L61)** : `../img/archilog_screenshot2.png`, alt « Capture d'écran du projet Archilog »

### 9.3 `pages/plateformeWeb.html`

- **`<title>` (L6)** : « Plateforme Web de Calcul »
- **En-tête / pied de page** : identiques à `index.html` (§9.1), liens préfixés `../index.html`

#### I. Page d'accueil — `#page-accueil` (L34-46)
- **Titre (L36)** : « Page d'accueil »
- **Image (L38)** : `../img/accueil.png`, alt « Page d'accueil »
- **Paragraphe (L42)** : « L'utilisateur arrive sur la page d'accueil. Il ne peut pas utiliser les différents modules car il ne dispose pas de compte. Même s'il essaie de cliquer sur les modules, cela ne fonctionnera pas. »

#### II. Création de compte — `#creation-compte` (L49-74)
- **Titre (L51)** : « Création de compte »
- **Image (L53)** : `../img/profile-connection-inscription.png`, alt « Profile pour connection et inscription »
- **Paragraphe (L57)** : « Pour créer un compte, l'utilisateur appuie sur Profil, puis sur Inscription. »
- **Paragraphe (L60)** : « L'utilisateur peut maintenant choisir un login et un mot de passe. Il doit bien sûr vérifier son mot de passe pour pouvoir s'inscrire. »
- **Encart d'avertissement (L64)** : « Si les mots de passe ne sont pas les mêmes, un message d'erreur s'affiche : "Les mots de passe ne sont pas les mêmes". De plus, si le login existe déjà, un message d'erreur s'affiche : "Le login existe déjà". »
- **Image (L67)** : `../img/creation-compte.png`, alt « Création de compte »
- **Paragraphe (L70)** : « Après inscription, il peut utiliser tous les modules et se déconnecter s'il le désire en appuyant sur le Profil. »

#### III. Login — `#login` (L77-92)
- **Titre (L79)** : « Login »
- **Image (L81)** : `../img/login.png`, alt « Login site web »
- **Paragraphe (L85)** : « Si l'utilisateur dispose déjà d'un compte et veut se connecter, il appuie sur Profil puis sur "Connexion". »
- **Paragraphe (L88)** : « L'utilisateur entre son login et son mot de passe. »

#### IV. Module de Probabilité — `#module-probabilite` (L95-187)
- **Titre (L97)** : « Module de Probabilité »
- **Image (L99)** : `../img/module-probabilite.png`, alt « Module de Probabilité »
- **Introduction (L103)** : « Pour accéder aux modules de calcul, l'utilisateur doit sélectionner le Calcul Proba, où il peut saisir les paramètres nécessaires au calcul : Espérance, Forme, Valeur t et Nombre de valeurs. Toutefois, ces paramètres sont soumis à des contraintes précises pour garantir la validité des calculs. »

**Bloc « Paramètres de calcul » (L106-125)**
- **Titre (L107)** : « Paramètres de calcul »
- **Espérance (µ) (L110)** : « Doit être strictement positive, avec une valeur minimale de zéro, car l'espérance représente une moyenne qui est toujours positive. »
- **Forme (λ) (L113)** : « Doit être strictement supérieure à zéro et inférieure ou égale à 100, pour influencer la précision des calculs et la dispersion des données. »
- **Valeur t (L116)** : « Représente la borne supérieure de l'intégrale et doit être supérieure à 0. »
- **Nombre de valeurs (L119)** : « Doit être compris entre 100 et 10 000 pour garantir une précision suffisante sans surcharge. »
- **Note (L122-124)** : « Ces limitations garantissent la cohérence et la fiabilité des calculs tout en évitant les erreurs dues à des saisies non valides. »

**Transition (L127-129)** : « De plus, l'utilisateur peut choisir la méthode désirée parmi les méthodes numériques disponibles : »

**Méthode 1 — `#methode-rectangles-gauche` (L134-142)**
- **Titre (L135)** : « La méthode des rectangles gauche »
- **Image (L136)** : `../img/rectangles-gauche.PNG`, alt « Méthode des rectangles gauche »
- **Description (L139)** : « Cette méthode consiste à approcher l'aire sous la courbe de la fonction de densité de probabilité en utilisant des rectangles dont la hauteur est déterminée par la valeur de la fonction au bord gauche de chaque intervalle. »

**Méthode 2 — `#methode-rectangles-medians` (L145-153)**
- **Titre (L146)** : « La méthode des rectangles "médians" »
- **Image (L147)** : `../img/rectangles-medians.png`, alt « Méthode des rectangles médians »
- **Description (L150)** : « Dans cette méthode, l'aire sous la courbe est approximée en utilisant des rectangles dont la hauteur est déterminée par la valeur de la fonction au point médian de chaque intervalle, pouvant offrir une meilleure approximation dans certains cas. »

**Méthode 3 — `#methode-trapezes` (L156-164)**
- **Titre (L157)** : « La méthode des trapèzes »
- **Image (L158)** : `../img/trapezes.png`, alt « Méthode des trapèzes »
- **Description (L161)** : « Cette méthode utilise des trapèzes au lieu de rectangles pour approcher l'aire sous la courbe, formant des trapèzes en reliant les points de la fonction aux extrémités de chaque intervalle pour une approximation plus précise. »

**Actions utilisateur (L167-180)**
- **(L169)** : « Ensuite, l'utilisateur appuie sur **Calculer** pour afficher la courbe, la loi inverse-gaussienne et la valeur de probabilité. »
- **(L172)** : « L'utilisateur peut faire flotter sa souris sur la courbe pour afficher les valeurs précises de f(x) et x. Il dispose d'une valeur de probabilité comprise entre 0 et 1 ainsi que des paramètres entrés (espérance, forme et valeur t) et de l'écart-type. »
- **(L175)** : « En appuyant sur **Retour**, il retourne au formulaire de départ. De plus, l'utilisateur connecté peut enregistrer le résultat, la forme et l'espérance avec la date d'enregistrement. »
- **(L178)** : « En appuyant sur **Sauvegarder**, il a accès à son historique de calcul. S'il appuie sur **consulter**, il peut voir ses calculs enregistrés. »
- **Image (L183)** : `../img/fiche.png`, alt « Supprimer la fiche »

### 9.4 Récapitulatif des données transversales

**Coordonnées de contact** (toutes issues d'`index.html`) :

| Donnée | Valeur | Ligne | Actionnable |
|---|---|---:|---|
| Localisation | Paris, France | 175 | — |
| Téléphone | +33 7 49 02 97 20 | 184 | ❌ (texte brut) |
| E-mail | rhazim@gmx.com | 193 | ❌ (texte brut) |
| CV | `pdf/cv.pdf` (386 977 o, PDF 1.4, 1 page, produit avec Canva, 1 image intégrée) | 202 | ✅ (`download`) |

**Liens externes — 4 destinations distinctes, 12 occurrences :**

| Destination | Occurrences |
|---|---|
| `https://github.com/HRazim` | index:42, index:214, archilog:70, plateformeWeb:194 |
| `https://www.linkedin.com/in/hazim-rayan-marouan-8bb382338` | index:46, index:218, archilog:74, plateformeWeb:198 |
| `https://github.com/Ethan-Da/PROBABILITY` | index:136 |
| `https://github.com/HRazim/Architecture-Logiciel` | index:156 |
| `https://cdnjs.cloudflare.com/…/font-awesome/6.4.0/css/all.min.css` | index:8, archilog:9, plateformeWeb:8 |

**Technologies citées dans le contenu :** HTML, CSS, JavaScript, Python, Java, PHP, SQL
(index:86-110) ; MySQL, Raspberry Pi 4, SSH, cryptographie, captcha (index:131-132) ;
Flask, SQLAlchemy Core, SQLite, MVC, CSV, Jinja2, CLI (index:146-152, archilog:38).

---

## 10. Tableau récapitulatif des problèmes identifiés

| # | Problème | Fichier et ligne | Gravité | Effort |
|---:|---|---|---|---|
| 1 | `TypeError` levée à chaque événement de défilement : `.skills` est `null` sur les deux pages de projet, et `isElementInViewport` appelle `getBoundingClientRect()` dessus | `js/script.js:48, 52, 73` (déclenché sur `pages/archilog.html` et `pages/plateformeWeb.html`) | **Critique** | Faible |
| 2 | Menu mobile impossible à ouvrir au clavier : le déclencheur est un `<div>` sans `tabindex`, sans `role`, avec un écouteur `click` uniquement | `index.html:24`, `pages/archilog.html:25`, `pages/plateformeWeb.html:24`, `js/script.js:5` | **Critique** | Moyen |
| 3 | `img/profile.jpg` : 2 331 031 octets, 4032 × 3024 px, affiché en 220 × 220 px — 85,7 % du poids de la page d'accueil | `index.html:36`, `styles/style.css:119-120` | **Critique** | Faible |
| 4 | Classe `.sr-only` utilisée 8 fois mais jamais définie : les libellés « GitHub » et « LinkedIn » s'affichent par-dessus les icônes sur les 3 pages | `index.html:44, 48, 216, 220` ; `archilog.html:72, 76` ; `plateformeWeb.html:196, 200` ; absente de `styles/style.css` | **Critique** | Faible |
| 5 | 258 144 octets de polices d'icônes téléchargés pour 17 glyphes distincts, via un CDN tiers sans `preconnect`, en cascade de 3 requêtes | `index.html:8`, `archilog.html:9`, `plateformeWeb.html:8` | **Critique** | Moyen |
| 6 | Aucune balise Open Graph ni Twitter Card sur aucune page : le lien partagé n'affiche aucun aperçu | 3 fichiers HTML, `<head>` | **Critique** | Faible |
| 7 | `<title>Mon Portfolio</title>` — ne contient ni nom, ni métier, ni spécialité | `index.html:6` | **Critique** | Faible |
| 8 | `meta description` absente sur `index.html` et `plateformeWeb.html` | `index.html:3-9`, `plateformeWeb.html:3-9` | **Majeur** | Faible |
| 9 | 3 écouteurs `scroll` sans throttle, debounce, `requestAnimationFrame`, `IntersectionObserver` ni `passive`, avec alternance lecture/écriture de mise en page | `js/script.js:19, 51, 62` | **Majeur** | Moyen |
| 10 | Style en ligne `header.style.padding` écrase définitivement le `padding: 20px` de la media query mobile | `js/script.js:22, 25` contre `styles/style.css:638` | **Majeur** | Faible |
| 11 | `<main>` ouverte et jamais fermée : le `<footer>` se retrouve dans le contenu principal | `pages/archilog.html:32` | **Majeur** | Faible |
| 12 | Aucune balise `<main>` sur la page d'accueil ; aucune cible pour un lien d'évitement | `index.html` (page entière) | **Majeur** | Faible |
| 13 | Aucun lien d'évitement vers le contenu principal sur aucune page | 3 fichiers HTML | **Majeur** | Faible |
| 14 | `prefers-reduced-motion` ignoré : 1 animation d'apparition sur toutes les sections, 13 transitions, 6 `translateY`, 1 `scale` global sur images, 1 défilement doux JS | `styles/style.css:588-590, 58, 96, 155, 198, 221, 289, 356, 427, 450, 456, 481, 605, 651` ; `js/script.js:41` | **Majeur** | Faible |
| 15 | 4 combinaisons de couleurs échouent au niveau WCAG AA (3,56:1), toutes dues à `#4285f4` sur du texte < 24 px | `styles/style.css:83, 151-154, 284-288, 295-296` | **Majeur** | Faible |
| 16 | Aucun état de focus personnalisé : 0 occurrence de `:focus` / `:focus-visible` dans 701 lignes | `styles/style.css` (fichier entier) | **Majeur** | Faible |
| 17 | Menu mobile masqué par `left: -100%` : les 5 liens restent focalisables hors écran | `styles/style.css:641-652` | **Majeur** | Faible |
| 18 | 112 lignes de balisage dupliquées sur 3 pages (en-tête 3 × 19, pied de page 3 × 15, icônes sociales 4 × 10), avec divergence déjà constatée | `index.html:12-30, 211-225` ; `archilog.html:13-31, 67-81` ; `plateformeWeb.html:12-30, 191-205` | **Majeur** | Élevé |
| 19 | Aucune image ne porte d'attribut `width` / `height` : décalage de mise en page au chargement | `index.html:36` ; `archilog.html:41, 61` ; `plateformeWeb.html:38, 53, 67, 81, 99, 136, 147, 158, 183` | **Majeur** | Faible |
| 20 | Aucune image ne porte `loading="lazy"` : les 9 visuels de `plateformeWeb.html` sont chargés immédiatement | `plateformeWeb.html:38, 53, 67, 81, 99, 136, 147, 158, 183` | **Majeur** | Faible |
| 21 | L'animation `fadeIn` retarde volontairement l'affichage de l'élément LCP de 700 ms | `styles/style.css:583-594` appliqué à `index.html:33` | **Majeur** | Faible |
| 22 | Aucun favicon sur aucune page | 3 fichiers HTML | **Majeur** | Faible |
| 23 | `robots.txt`, `sitemap.xml` et données structurées JSON-LD absents | racine du dépôt | **Majeur** | Faible |
| 24 | `.projects-grid` : `display: grid` jamais déclaré ; `grid-template-columns` sans effet | `styles/style.css:312-314`, `index.html:120` | **Majeur** | Faible |
| 25 | `.project-card` n'a aucune règle de base : aucune carte n'est dessinée | `styles/style.css:316-319`, `index.html:122, 142` | **Majeur** | Faible |
| 26 | 20 couleurs pour 8 rôles, 6 paires de quasi-doublons, 0 variable CSS. Quasi-doublons : `styles/style.css:105/467`, `599/123`, `348/457`, `353/151`, `369/11` | `styles/style.css:11, 26, 41, 55, 56, 64, 83, 94, 105, 123, 124, 130, 135, 151, 152, 159, 165, 181, 192, 195, 207, 238, 250, 254, 265, 272, 284, 285, 295, 296, 297, 301, 306, 307, 308, 329, 340, 348, 353, 369, 376, 381, 386, 390, 405, 411, 417, 418, 431, 448, 457, 467, 471, 476, 478, 489, 503, 510, 515, 528, 529, 531, 575, 578, 598, 599, 609, 611, 619, 620, 647` (71 occurrences) | **Majeur** | Élevé |
| 27 | Aucune échelle typographique : 17 tailles, rapports de 1,071 à 1,250, 2 unités mélangées (`rem`/`em` en collision aux lignes 408/695, 420/77, 370/134) | `styles/style.css:32, 62, 77, 128, 134, 154, 171, 206, 213, 236, 287, 354, 370, 391, 408, 420, 490, 628, 632, 672, 676, 691, 695, 699` | **Majeur** | Élevé |
| 28 | Section « À propos » : 23 balises `<strong>` pour 223 mots (une tous les 9,7 mots) | `index.html:61-73` | **Majeur** | Moyen |
| 29 | 75 lignes de CSS mort (`.contact-form` et dépendances, `.project-image`, `.contact-content`, `.btn`), soit 10,7 % du fichier | `styles/style.css:217-226, 380-432, 597-613, 679-681` | **Majeur** | Faible |
| 30 | 40 lignes de JS mort (39 % du fichier) : `.skill-progress`, `data-progress`, `.contact-form`, `#name`/`#email`/`#subject`/`#message` | `js/script.js:48-57, 81-101` | **Majeur** | Faible |
| 31 | `.gitignore` absent — bloquant avant tout `npm install` | racine du dépôt | **Majeur** | Faible |
| 32 | `.nojekyll` absent — le dossier `_next/` serait exclu par Jekyll sur GitHub Pages | racine du dépôt | **Majeur** *(si GitHub Pages)* | Faible |
| 33 | Le dépôt est nommé `Porfolio` (faute d'orthographe) et ce nom apparaîtrait dans l'URL publique | remote `https://github.com/HRazim/Porfolio.git` | **Majeur** | Moyen |
| 34 | `e.preventDefault()` sur les ancres supprime le fragment d'URL : sections non partageables, historique cassé | `js/script.js:33` | **Majeur** | Faible |
| 35 | Téléphone et e-mail en texte brut, sans `tel:` ni `mailto:` | `index.html:184, 193` | **Majeur** | Faible |
| 36 | `#f9f9f9` déclaré 2 fois mais jamais appliqué : `section:nth-child(even)` l'emporte | `styles/style.css:105, 181` contre `:466-468` | Mineur | Faible |
| 37 | Trois mécanismes de style couplés à la position DOM (`nth-child`) : fonds, délais d'animation, ordre des images | `styles/style.css:466-472, 592-594, 557-563` | Mineur | Moyen |
| 38 | Blocs `.container` (14/567) et `section` (20/461) déclarés en double | `styles/style.css:14-18, 567-571, 20-22, 461-464` | Mineur | Faible |
| 39 | À 768 px exactement, les blocs `min-width: 768px` et `max-width: 768px` s'appliquent simultanément | `styles/style.css:311, 535, 636` | Mineur | Faible |
| 40 | Classe `project-info` (conteneur flex avec 25 px de remplissage) appliquée à deux `<h3>` | `index.html:60, 69` contre `styles/style.css:228-233` | Mineur | Faible |
| 41 | `img/Porbability.png` : 65 979 octets orphelins, nom mal orthographié | `img/Porbability.png` | Mineur | Faible |
| 42 | Trois conventions de nommage cohabitent : `kebab-case`, `snake_case`, `camelCase` | `img/*`, `pages/plateformeWeb.html` | Mineur | Moyen |
| 43 | `img/rectangles-gauche.PNG` : seule extension en majuscules, avec `core.ignorecase = true` en local | `img/rectangles-gauche.PNG`, `plateformeWeb.html:136` | Mineur | Faible |
| 44 | Le `h1` de chaque page est le logo, dont le texte est identique au premier `h2` de l'accueil | `index.html:14` et `:39` | Mineur | Faible |
| 45 | Les trois `h2` de méthodes sont au même niveau de plan que la section qui les contient | `plateformeWeb.html:97, 135, 146, 157` | Mineur | Faible |
| 46 | 9 attributs `alt` sur 12 sont redondants avec le titre voisin, en doublon exact, ou incorrects | `archilog.html:41, 61` ; `plateformeWeb.html:38, 53, 67, 81, 99, 136, 147, 158, 183` | Mineur | Faible |
| 47 | 10 liens `target="_blank"` sans `rel="noopener noreferrer"`, sans indication d'ouverture en nouvel onglet | index:42, 46, 136, 156, 214, 218 ; archilog:70, 74 ; plateformeWeb:194, 198 | Mineur | Faible |
| 48 | Divergence structurelle du pied de page : le `<p>` est dans `.container` sur une page, hors sur les deux autres | `plateformeWeb.html:203-204` contre `index.html:223-224` et `archilog.html:79-80` | Mineur | Faible |
| 49 | Nommage du projet incohérent : « Calculs » (pluriel) sur l'accueil, « Calcul » (singulier) dans le `<title>` | `index.html:124` contre `plateformeWeb.html:6` | Mineur | Faible |
| 50 | « Taches » sans accent circonflexe, deux occurrences | `index.html:130, 150` | Mineur | Faible |
| 51 | `alt` « Profile pour connection et inscription » : deux anglicismes | `plateformeWeb.html:53` | Mineur | Faible |
| 52 | Apostrophes typographiques (4 occurrences) et droites (26 occurrences) mélangées ; guillemets droits en français | `index.html:130, 132, 151, 152` et 26 autres ; `plateformeWeb.html:64, 85` | Mineur | Faible |
| 53 | Trois valeurs contradictoires pour la hauteur du header fixe : 60 px, 70 px, 70 | `styles/style.css:106, 643, 646` ; `js/script.js:40` | Mineur | Faible |
| 54 | `js/script.js:65-66` écrit `opacity` et `transform` en ligne sur chaque carte à chaque défilement, pour un effet nul | `js/script.js:60-69` | Mineur | Faible |
| 55 | 7 identifiants définis sur `plateformeWeb.html` (page la plus longue du site) ne sont la cible d'aucun lien | `plateformeWeb.html:34, 49, 77, 95, 134, 145, 156` | Mineur | Faible |
| 56 | Le logo pointe vers `index.html` sans ancre sur l'accueil, avec `#accueil` sur les sous-pages | `index.html:14` contre `archilog.html:15`, `plateformeWeb.html:14` | Mineur | Faible |
| 57 | Aucun lien retour vers les projets ni lien croisé depuis les deux pages de projet | `archilog.html`, `plateformeWeb.html` | Mineur | Faible |
| 58 | `.hamburger.active` : la classe est posée par le JS mais aucune règle CSS ne l'exploite | `js/script.js:6`, absente de `styles/style.css` | Mineur | Faible |
| 59 | Classe `.reveal` posée 4 fois : ni règle CSS, ni lecture JS | `index.html:169, 178, 187, 196` | Mineur | Faible |
| 60 | 20 classes présentes en HTML sans aucune règle CSS (hors classes Font Awesome) | `index.html:117, 169, 178, 187, 196` ; `archilog.html:38, 41, 61` ; `plateformeWeb.html:56, 62, 95, 102, 106, 108, 122, 127, 132, 134, 136, 137, 145, 147, 148, 156, 158, 159, 167, 169, 175, 178` | Mineur | Faible |
| 61 | Mesure de ligne du corps de texte à ~95 caractères, contre 45-75 recommandés | `styles/style.css:169-172` | Mineur | Faible |
| 62 | Trois rayons de bordure différents pour trois composants de même nature (10 / 12 / 8 px) | `styles/style.css:194, 477, 578` | Mineur | Faible |
| 63 | 4 graisses déclarées pour 2 rendues (Arial ne fournit que Regular et Bold) | `styles/style.css:9, 78, 288, 377, 392, 409, 421, 604` | Mineur | Faible |
| 64 | Trois schémas de méthodes présentés en série mais de dimensions différentes (364 px contre 220 px) | `plateformeWeb.html:136, 147, 158` | Mineur | Moyen |
| 65 | `README.md` supprimé au commit `0a4a75b` : aucune documentation du projet | racine du dépôt | Mineur | Faible |
| 66 | `<p>` non fermé alors que les paragraphes voisins le sont | `index.html:61` | Mineur | Faible |
| 67 | `role="navigation"` redondant sur `<nav>`, et `aria-label` sur un `<div>` sans rôle | index:16, 24 ; archilog:17, 25 ; plateformeWeb:16, 24 | Mineur | Faible |
| 68 | Le lien « Télécharger mon CV » n'est visuellement pas identifiable comme un lien | `index.html:202`, `styles/style.css:25-26, 369` | Mineur | Faible |
| 69 | Le dépôt de « code source » du projet 1 appartient à un compte tiers, sans mention du contexte collectif | `index.html:136` | Mineur | Faible |
| 70 | 14 groupes de `<div>` sémantiquement remplaçables (listes, articles, figures, adresse) — détail au §5.5 | `index.html:41, 83, 84, 88, 92, 96, 100, 104, 108, 120, 122, 142, 169, 178, 187, 196, 213` ; `archilog.html:40, 69` ; `plateformeWeb.html:37, 52, 62, 66, 80, 98, 106, 132, 169, 175, 178, 182, 193` | Mineur | Moyen |

**Répartition : 7 Critiques · 28 Majeurs · 35 Mineurs — 70 problèmes.**

*Note sur les références : 57 des 70 entrées citent un fichier **et** un ou plusieurs
numéros de ligne. Les 13 restantes (#6, 12, 13, 16, 22, 23, 31, 32, 33, 41, 42, 57, 65)
sont des **constats d'absence** — balise, règle ou fichier manquant — pour lesquels aucun
numéro de ligne ne peut exister par nature. Chacune cite alors le fichier ou l'emplacement
exact où l'élément est attendu.*

---

## 11. Recommandations, classées par rapport impact / effort

*Les 8 premières lignes représentent, cumulées, plus de 95 % du gain de poids et
la correction de tous les problèmes critiques, pour un effort faible.*

| Rang | Recommandation | Impact | Effort | Problèmes couverts |
|---:|---|---|---|---|
| 1 | Ré-encoder les 12 images utilisées en WebP ou AVIF à la résolution d'affichage ×2, et retirer l'orphelin `Porbability.png` | **−2,90 Mo, soit −95,7 % du poids images** ; poids de l'accueil ramené de 2,59 Mio à ~250 Kio | **Faible** | 3, 41 |
| 2 | Remplacer Font Awesome par 17 SVG en ligne | **−360 Ko par page**, suppression d'une dépendance tierce et de 3 requêtes en cascade ; sur `archilog.html`, **−61 % du poids** | **Faible** | 5 |
| 3 | Rédiger les `<title>`, `meta description`, Open Graph, Twitter Card et favicon des 3 pages | Rend le site partageable et identifiable ; condition d'existence sur LinkedIn | **Faible** | 6, 7, 8, 22 |
| 4 | Définir `.sr-only` et corriger la garde de `.skills` dans le script | Supprime un défaut visuel présent sur les 3 pages et une erreur JS à chaque défilement sur 2 pages | **Faible** | 1, 4 |
| 5 | Ajouter `width`, `height` et `loading="lazy"` sur les 13 images | Supprime le décalage de mise en page ; diffère 8 des 9 images de `plateformeWeb.html` | **Faible** | 19, 20 |
| 6 | Ajouter un bloc `@media (prefers-reduced-motion: reduce)` et retirer le délai d'animation de la section d'accueil | Conformité WCAG 2.3.3 ; **−700 ms sur le LCP** | **Faible** | 14, 21 |
| 7 | Passer `#4285f4` à `#3367d6` (déjà présent dans la feuille) pour les 4 usages en texte < 24 px | Résout les 4 échecs de contraste AA d'un seul geste, sans nouvelle couleur | **Faible** | 15 |
| 8 | Ajouter `.gitignore`, `robots.txt`, `sitemap.xml` et un bloc JSON-LD `Person` | Prépare l'outillage et rend le site indexable correctement | **Faible** | 23, 31 |
| 9 | Rendre le menu accessible au clavier : `<button>`, `aria-expanded`, `aria-controls`, retrait du menu fermé de l'ordre de tabulation, états `:focus-visible` | Rend le site utilisable au clavier ; corrige le seul défaut réellement excluant | **Moyen** | 2, 16, 17 |
| 10 | Supprimer les 115 lignes de code mort (75 CSS + 40 JS) | Réduit la surface à migrer de 9 % avant de commencer | **Faible** | 29, 30, 58, 59 |
| 11 | Étrangler les 3 écouteurs `scroll` ou les remplacer par un `IntersectionObserver`, et supprimer les écritures de style en ligne | Supprime le *layout thrashing* et le conflit permanent avec la media query mobile | **Moyen** | 9, 10, 54 |
| 12 | Rendre le téléphone et l'e-mail actionnables, ajouter les liens retour et un sommaire sur `plateformeWeb.html` | Complète les parcours manquants sans toucher au design | **Faible** | 35, 55, 57 |
| 13 | Fermer `<main>` sur `archilog.html`, en ajouter une sur `index.html`, ajouter un lien d'évitement sur les 3 pages | Rétablit la structure de repères ; condition d'un lien d'évitement fonctionnel | **Faible** | 11, 12, 13, 66 |
| 14 | Corriger les fautes de contenu : « Taches », alt « Profile / connection », singulier/pluriel du nom de projet, apostrophes et guillemets | Crédibilité éditoriale immédiate | **Faible** | 49, 50, 51, 52 |
| 15 | Réécrire les 12 `alt`, et normaliser `rel="noopener noreferrer"` | Accessibilité et hygiène des liens externes | **Faible** | 46, 47 |
| 16 | Réécrire la section « À propos » et l'accroche pour le positionnement hybride technique/business | Le contenu est le facteur limitant du portfolio, pas la technique | **Moyen** | 28 |
| 17 | **Puis seulement** : migrer vers Next.js avec composants `Header` / `Footer` uniques | Supprime 112 lignes de duplication et le risque de divergence déjà constaté | **Élevé** | 18, 48, 56, 70 |
| 18 | Construire le design system : variables CSS, échelle typographique modulaire, échelle d'espacement de base 4 ou 8 px, 2 rayons | Condition préalable à toute direction artistique éditoriale | **Élevé** | 26, 27, 37, 38, 62, 63 |
| 19 | Choisir et intégrer les familles typographiques (avec glyphes grecs et compagnon monospace), régler mesure et interlettrage | Porte l'identité éditoriale visée | **Élevé** | 61, §7.6 |
| 20 | Renommer le dépôt `Porfolio` → `portfolio` et arbitrer l'hébergement (`.nojekyll` + `basePath` si GitHub Pages, ou plateforme avec rendu serveur) | Décision structurante à prendre **avant** toute indexation du site | **Moyen** | 32, 33, 42, 43 |

---

## 12. Limites de l'audit

Les points suivants **n'ont pas pu être vérifiés**, et pour quel motif précis.

### Nécessitant une exécution dans un navigateur

1. **Hauteur réelle du header fixe.** Elle dépend du rendu de la police du système
   (`'Arial', sans-serif`, `styles/style.css:9`) appliquée au `h1` de 1.8 rem. Les valeurs
   de décalage 60 px / 70 px (§3.7) sont donc constatées comme mutuellement incohérentes,
   mais l'écart avec la hauteur réelle n'est pas chiffré ici.
2. **Métriques Core Web Vitals mesurées** (LCP, CLS, INP, TBT). Les constats du §4 sont des
   causes identifiées dans le code, pas des mesures. Un audit Lighthouse ou une campagne
   WebPageTest est nécessaire pour les quantifier.
3. **Décalage de mise en page effectif (CLS).** L'absence de `width`/`height` est certaine ;
   l'ampleur du décalage dépend de la vitesse du réseau et de la fenêtre.
4. **Rendu réel des libellés `.sr-only`.** Leur superposition aux icônes est déduite de
   l'absence de règle CSS et des dimensions des pastilles (40 × 40 px, `style.css:149-150`).
   La forme exacte du défaut visuel n'a pas été observée.
5. **Résolution effective des graisses 500 et 600.** Elle dépend des variantes d'Arial
   installées sur le poste du visiteur, information extérieure au dépôt (§7.3).
6. **Comportement à 768 px exactement.** La superposition des media queries `min-width` et
   `max-width` est certaine par lecture ; le résultat visuel n'a pas été observé.
7. **Restitution par lecteur d'écran.** Les constats ARIA sont fondés sur les
   spécifications, non sur des tests NVDA / JAWS / VoiceOver.

### Nécessitant un accès à la configuration d'hébergement

8. **Mode de déploiement effectif.** L'activation de GitHub Pages, la branche source et le
   dossier source sont des réglages côté GitHub, absents du dépôt. Aucun `CNAME`,
   `.nojekyll`, `.github/workflows/` ni branche `gh-pages` ne permet de trancher (§8.6).
   Les incompatibilités du §8.6 sont énoncées **sous l'hypothèse** GitHub Pages.
9. **URL publique du site.** Inconnue. Aucun `canonical`, aucun `CNAME`. Aucun test de
   redirection, de HTTPS ou de disponibilité n'a donc pu être mené.
10. **Compression HTTP (gzip / Brotli)** sur les fichiers du site. Dépend du serveur.
    Les poids du §4 sont donnés **non compressés** ; seul le poids transféré du CSS Font
    Awesome (21 631 o gzip) a pu être mesuré, car servi par un CDN public interrogeable.
11. **En-têtes de cache** des ressources du site. Seuls ceux de cdnjs ont été relevés.
12. **Statistiques d'audience et liens entrants existants.** Le risque de rupture d'URL
    (§8.5, point 1) est donc qualitatif, non chiffré.

### Contenus non analysés

13. **Contenu du fichier `pdf/cv.pdf`.** Seules ses métadonnées techniques ont été relevées
    (386 977 octets, PDF 1.4, 1 page, producteur « Canva », 1 image intégrée). Son contenu
    rédactionnel n'est pas restitué dans l'inventaire du §9 : il s'agit d'un actif
    téléchargeable, non d'un contenu rendu par le site. Sa cohérence avec le contenu des
    pages n'a donc pas été vérifiée.
14. **Contenu des deux dépôts GitHub liés** (`Ethan-Da/PROBABILITY`, `HRazim/Architecture-Logiciel`).
    La véracité des descriptions de projet (§9.1) et la part de contribution personnelle
    sur le projet 1 n'ont pas été vérifiées.
15. **Validité des liens externes.** Les 4 destinations du §9.4 n'ont pas été appelées.
16. **Contenu de la feuille Font Awesome.** Seuls le poids et les fichiers de police
    référencés ont été mesurés ; la liste exhaustive des glyphes qu'elle définit n'a pas
    été extraite.

### Vérifications volontairement non effectuées

17. **Validation W3C du HTML et du CSS.** Nécessiterait un envoi des fichiers à un service
    externe. Les anomalies structurelles relevées (`<main>` non fermée `archilog.html:32`,
    `<p>` non fermé `index.html:61`) l'ont été par lecture.
18. **Aucune modification du dépôt.** Conformément au périmètre : aucun fichier existant
    modifié, supprimé, renommé ou déplacé ; aucune dépendance installée ; aucune branche
    créée. Les conversions d'images du §4.3 ont été produites **hors du dépôt**, dans un
    répertoire temporaire, et ne sont pas versionnées.
19. **Estimations d'effort du §10.** Elles reposent sur le volume de code à modifier
    (Faible : moins d'une heure ; Moyen : une demi-journée ; Élevé : plusieurs jours),
    sans connaissance du niveau de maîtrise de la stack cible par l'auteur.
20. **13 entrées du tableau du §10 ne citent pas de numéro de ligne** (#6, 12, 13, 16, 22,
    23, 31, 32, 33, 41, 42, 57, 65). Ce sont des constats d'absence : une balise, une règle
    ou un fichier qui n'existe pas ne peut pas être localisé par une ligne. Chacune cite le
    fichier ou l'emplacement exact où l'élément est attendu. Les 57 autres entrées citent
    un fichier et au moins un numéro de ligne.

---

*Fin de l'audit. Document produit le 19 août 2026 sur le commit `4324aeb`.
Aucun fichier source du dépôt n'a été modifié.*
