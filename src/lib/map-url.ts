/**
 * ---------------------------------------------------------------------------
 * ADRESSE D'UNE RECHERCHE CARTOGRAPHIQUE
 * ---------------------------------------------------------------------------
 *
 * UNE SEULE FONCTION CONSTRUIT CES ADRESSES, et les donnees n'en contiennent
 * aucune. Une URL complete recopiee dans `career.ts` serait cinq fois la meme
 * chaine a maintenir, et le jour ou le service change, cinq endroits a
 * corriger — dont on oublierait le cinquieme.
 *
 * POURQUOI OPENSTREETMAP. Le service est interrogeable par une simple adresse,
 * sans cle d'API, sans script a charger et sans compte. Rien n'est integre
 * dans la page : le lien ouvre un onglet, le site n'appelle personne. Un
 * fournisseur qui exigerait un traceur ou une cle contredirait ce que ce
 * portfolio dit de lui-meme.
 *
 * LA REQUETE N'EST PAS TRADUITE, et le champ qui la porte non plus. Un nom de
 * lieu designe un point sur la Terre : « Guyancourt » ne devient pas autre
 * chose parce que la page est lue en arabe, et les quatre langues doivent
 * mener exactement au meme endroit.
 * ---------------------------------------------------------------------------
 */

/**
 * Recherche de lieu chez OpenStreetMap.
 *
 * Le parametre est nomme `query` par le service ; la valeur est encodee, ce
 * qui est indispensable ici : les requetes portent des espaces, des lettres
 * accentuees et une apostrophe typographique.
 */
const MAP_SEARCH_URL = 'https://www.openstreetmap.org/search?query=';

/** Adresse de la recherche cartographique pour une requete donnee. */
export function mapUrlFor(query: string): string {
  return `${MAP_SEARCH_URL}${encodeURIComponent(query)}`;
}
