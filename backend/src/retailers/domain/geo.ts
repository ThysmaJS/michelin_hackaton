// Helpers géographiques purs pour la résolution « code postal / ville → région ».
// Port de la partie déterministe de `frontend/src/lib/recommend.js`.
//
// Le mapping département → région est stocké en base (table PostalDepartment) ;
// ne restent ici que la logique d'extraction et les correspondances par nom de
// ville (intrinsèquement du code, donc testées en pur).

/**
 * Extrait le code département (2 chiffres) d'un code postal / d'une saisie libre.
 *
 * @param input Saisie utilisateur (code postal ou ville).
 * @returns Les 2 premiers chiffres, ou chaîne vide si aucun chiffre.
 */
export function extractDepartmentCode(
  input: string | null | undefined,
): string {
  return (input || '').replace(/\D/g, '').slice(0, 2);
}

/** Correspondances nom de ville → clé de région (repli quand le code postal est absent). */
const CITY_MATCHERS: ReadonlyArray<readonly [string, RegExp]> = [
  [
    'aura',
    /lyon|grenoble|annecy|chambér|clermont|valence|st[- ]?étienne|saint[- ]?étienne/,
  ],
  ['paca', /marseille|nice|toulon|aix|avignon|cannes/],
  ['idf', /paris|versailles|boulogne|nanterre|créteil/],
  ['bretagne', /rennes|brest|quimper|vannes|lorient|st[- ]?malo/],
  ['occitanie', /toulouse|montpellier|nîmes|perpignan|albi/],
  ['aquitaine', /bordeaux|biarritz|pau|bayonne|arcachon|limoges/],
];

/**
 * Résout une région à partir d'un nom de ville saisi.
 *
 * @param input Saisie utilisateur.
 * @returns Clé de région (ex. "aura") ou `null` si aucune correspondance.
 */
export function matchCityToRegion(
  input: string | null | undefined,
): string | null {
  const c = (input || '').toLowerCase();
  if (!c) return null;
  for (const [key, re] of CITY_MATCHERS) {
    if (re.test(c)) return key;
  }
  return null;
}
