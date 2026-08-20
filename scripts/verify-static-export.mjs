#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * VERIFICATION DE LA COMPATIBILITE EXPORT STATIQUE
 * ---------------------------------------------------------------------------
 *
 * POURQUOI CE SCRIPT EXISTE. `CLAUDE.md` impose depuis l'origine que le projet
 * reste exportable en statique. Cette regle n'avait jamais ete executee, et
 * elle etait en defaut : `robots.ts` n'exportait pas `dynamic = 'force-static'`
 * et faisait echouer l'export. Une regle qu'aucune commande ne verifie n'est
 * pas une regle, c'est une intention.
 *
 * CE QU'IL FAIT. Il lance `next build` avec `STATIC_EXPORT=1`, ce que
 * `next.config.ts` traduit en `output: 'export'`. Next.js refuse alors de
 * construire si une seule route n'est pas entierement statique : route rendue
 * a la demande, parametre dynamique non enumere, route de metadonnees sans
 * `dynamic = 'force-static'`. Le code de sortie du script est celui de la
 * construction — zero si elle passe, non nul sinon.
 *
 * CE QU'IL NE FAIT PAS. Il ne modifie aucun fichier. La bascule passe par
 * l'environnement, jamais par une reecriture de `next.config.ts` : un controle
 * qui edite le depot peut le laisser dans un etat intermediaire s'il echoue au
 * mauvais moment.
 *
 * Le repertoire `out/` produit est supprime a la fin, qu'il y ait echec ou non.
 * ---------------------------------------------------------------------------
 */
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'out');

/** Nettoie `out/`, avant comme apres : le controle part d'un etat connu. */
function clean() {
  rmSync(OUT_DIR, { recursive: true, force: true });
}

console.log('Verification de la compatibilite export statique (STATIC_EXPORT=1)…\n');

clean();

/**
 * Le binaire local de Next est appele par Node, sans passer par un shell :
 * `shell: true` concatene les arguments au lieu de les echapper, ce que Node
 * signale desormais par un avertissement de depreciation. Aucun shell, aucun
 * avertissement, et un comportement identique sur les trois systemes.
 */
const NEXT_BIN = join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');

const build = spawnSync(process.execPath, [NEXT_BIN, 'build'], {
  cwd: ROOT,
  env: { ...process.env, STATIC_EXPORT: '1' },
  stdio: 'inherit',
});

clean();

if (build.error !== undefined) {
  console.error('\nÉCHEC : la construction n’a pas pu être lancée.');
  console.error(build.error.message);
  process.exit(1);
}

if (build.status !== 0) {
  console.error(
    '\nÉCHEC : le projet n’est pas exportable en statique. ' +
      'Voir la règle 6 de CLAUDE.md.',
  );
  process.exit(build.status ?? 1);
}

console.log('\nSUCCÈS : le projet est exportable en statique.');
