/**
 * ---------------------------------------------------------------------------
 * ADRESSE D'UNE RECHERCHE CARTOGRAPHIQUE
 * ---------------------------------------------------------------------------
 *
 * UNE SEULE FONCTION CONSTRUIT CES ADRESSES, et les donnees n'en contiennent
 * aucune. Une URL complete recopiee dans `career.ts` serait cinq fois la meme
 * chaine a maintenir, et le jour ou le service change, cinq endroits a
 * corriger — dont on oublierait le cinquieme. Ce jour est arrive : le service
 * a change, et il n'y a eu qu'une ligne a reecrire.
 *
 * POURQUOI GOOGLE MAPS. La forme employee est celle des « Maps URLs » : une
 * simple adresse avec `api=1`, sans cle d'interface de programmation, sans
 * script a charger, sans compte. Rien n'est integre dans la page — le lien
 * ouvre un onglet, et le site lui-meme n'appelle personne. C'est la seule
 * condition qui compte ici : un fournisseur qui exigerait un traceur ou un
 * script contredirait ce que ce portfolio dit de lui-meme, et Google Maps sous
 * cette forme n'en exige aucun.
 *
 * `api=1` N'EST PAS DECORATIF. Il est ce qui garantit le contrat de l'URL :
 * la documentation de Google promet qu'une adresse portant ce parametre
 * continuera de fonctionner. Sans lui, la forme relevait de l'usage et pouvait
 * changer sans preavis.
 *
 * LA REQUETE N'EST PAS TRADUITE, et le champ qui la porte non plus. Un nom de
 * lieu designe un point sur la Terre : « Guyancourt » ne devient pas autre
 * chose parce que la page est lue en arabe, et les quatre langues doivent
 * mener exactement au meme endroit.
 * ---------------------------------------------------------------------------
 */

/**
 * Recherche de lieu chez Google Maps, forme documentee et stable.
 *
 * La valeur est encodee, ce qui est indispensable ici : les requetes portent
 * des espaces, des virgules, des lettres accentuees et une apostrophe
 * typographique.
 */
const MAP_SEARCH_URL = 'https://www.google.com/maps/search/?api=1&query=';

/** Adresse de la recherche cartographique pour une requete donnee. */
export function mapUrlFor(query: string): string {
  return `${MAP_SEARCH_URL}${encodeURIComponent(query)}`;
}
