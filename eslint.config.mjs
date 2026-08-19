import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * ---------------------------------------------------------------------------
 * INTERDICTION D'IMPORTER DEPUIS legacy/ — CHOIX DOCUMENTE
 * ---------------------------------------------------------------------------
 *
 * Deux mecanismes etaient possibles (voir AUDIT.md section 8.5) :
 *
 *   a) Exclusion tsconfig  — `"exclude": ["legacy"]`
 *   b) Regle ESLint        — `no-restricted-imports`
 *
 * MECANISME RETENU : la regle ESLint (b), comme garde-fou effectif.
 *
 * Motif : `exclude` dans tsconfig retire seulement `legacy/` du programme
 * analyse par defaut. Il n'empeche PAS une importation explicite : TypeScript
 * resout et rattache tout fichier importe nommement, meme exclu. Comme
 * `allowJs: true` est actif et que `legacy/js/script.js` est un module
 * JavaScript valide, `import '../legacy/js/script.js'` compilerait sans
 * broncher. Seul ESLint refuse l'import et fait echouer la CI.
 *
 * L'exclusion tsconfig est neanmoins conservee, en defense en profondeur :
 * elle evite que les 3 fichiers HTML et le CSS de legacy/ soient parcourus
 * inutilement, et empeche l'auto-import propose par l'editeur.
 *
 * LIMITE CONNUE : `no-restricted-imports` couvre les declarations `import`
 * statiques. Elle ne couvre ni `require()` ni `import()` dynamique avec
 * chemin calcule. Aucun de ces deux mecanismes n'est utilise dans ce projet.
 * ---------------------------------------------------------------------------
 */
const LEGACY_IMPORT_MESSAGE =
  "Import interdit depuis legacy/. Ce dossier est une archive de reference " +
  "du site precedent : il n'est jamais servi, jamais deploye, jamais importe. " +
  'Recopiez le contenu utile dans src/ plutot que de le referencer.';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    // Ignores par defaut de eslint-config-next :
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Archive du site precedent : hors perimetre de lint.
    'legacy/**',
  ]),

  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'legacy',
                'legacy/**',
                '**/legacy',
                '**/legacy/**',
                '@/legacy',
                '@/legacy/**',
              ],
              message: LEGACY_IMPORT_MESSAGE,
            },
          ],
        },
      ],
      // Contrainte du projet : aucun usage du type `any`.
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);

export default eslintConfig;
