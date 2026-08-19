# Portfolio

Refonte du portfolio personnel en Next.js 16 (App Router, TypeScript,
Tailwind CSS v4). Direction artistique éditoriale, portée par la typographie.

## Démarrer

```bash
npm install
npm run dev     # http://localhost:3000
```

Autres scripts :

```bash
npm run build   # compilation de production
npm run start   # sert la compilation de production
npm run lint    # ESLint
```

## Repères

| Chemin                     | Rôle                                              |
| -------------------------- | ------------------------------------------------- |
| `src/app/globals.css`      | design system — seul lieu des valeurs littérales   |
| `src/lib/fonts.ts`         | les trois familles typographiques                 |
| `src/components/layout/`   | primitives de mise en page                        |
| `/styleguide`              | démonstration du design system (non indexée)      |
| `legacy/`                  | archive du site précédent — jamais servie          |
| `AUDIT.md`                 | audit technique du site précédent                 |
| `CLAUDE.md`                | conventions du dépôt                              |

## Contribuer

Lire `CLAUDE.md` avant toute modification. En résumé : jetons sémantiques
uniquement, aucun import depuis `legacy/`, aucune bibliothèque d'icônes,
nommage en kebab-case, compatibilité export statique préservée.

Branches : `develop` pour le travail, `main` pour les versions publiées.
