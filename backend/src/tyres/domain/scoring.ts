// Dérivation déterministe des 4 scores radar (0–100) à partir des attributs réels
// du catalogue Michelin 2026 — port de `frontend/src/lib/scoring.js`.
//
// Le catalogue ne fournit aucun indice de performance : ces scores sont calculés
// de façon documentée à partir de l'usage, de la gomme, du poids, du segment et
// du terrain. C'est cette fonction qui alimente les colonnes grip/rendement/
// endurance/legerete au moment du seed.
//
// Adaptations vs le frontend (valeurs catalogue réelles) :
//   • gomme : comparaison par `includes` ("MAGI-X GREEN", "GUM-X3D"… au lieu de l'égalité stricte) ;
//   • segment : `includes('PERFORMANCE' | 'ACCESS')` (libellés "PREMIUM PERFORMANCE LINE"…).

/** Borne une valeur dans [lo, hi] après arrondi. */
const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, Math.round(v)));

/** Rendement de base selon l'usage déclaré (colonne « Use » du catalogue). */
export const USE_RENDEMENT: Readonly<Record<string, number>> = {
  RACING: 94,
  SPEED: 88,
  'ALL ROAD': 84,
  'E-ROAD': 82,
  ENDURANCE: 82,
  VERSATILE: 74,
  TOURING: 72,
  TREKKING: 71,
  TRAIL: 68,
  CYCLOCROSS: 76,
  LEISURE: 62,
};

/** Attributs réels d'une gamme, en entrée du calcul de scores. */
export interface ScoringAttributes {
  /** Tokens d'usage (ex. ["RACING"], ["ENDURANCE", "ALL ROAD"]). */
  uses?: string[];
  /** Terrain normalisé. */
  terrain?: 'route' | 'gravel' | 'city' | 'mtb';
  /** Technologie de gomme (ex. "GUM-X", "MAGI-X GREEN"). */
  rubber?: string | null;
  /** Poids unitaire en grammes (variante de référence). */
  weight: number;
  /** Segment commercial (ex. "PREMIUM PERFORMANCE LINE", "ACCESS LINE"). */
  segment?: string | null;
  /** Présence d'une technologie de renfort. */
  reinforced?: boolean;
  /** Nom de la gamme (pour le bonus contre-la-montre). */
  name?: string;
}

/** Les 4 scores radar normalisés sur 0–100. */
export interface RadarScores {
  grip: number;
  rendement: number;
  endurance: number;
  legerete: number;
}

/**
 * Calcule les 4 scores radar d'une gamme à partir de ses attributs catalogue.
 *
 * @param a Attributs réels de la gamme.
 * @returns Les scores `grip`, `rendement`, `endurance`, `legerete` (0–100).
 */
export function deriveScores(a: ScoringAttributes): RadarScores {
  const {
    uses = [],
    terrain,
    rubber,
    weight,
    segment,
    reinforced,
    name = '',
  } = a;
  const rubberUp = (rubber ?? '').toUpperCase();
  const segmentUp = (segment ?? '').toUpperCase();
  const nameUp = name.toUpperCase();

  // Rendement : meilleur usage, bonus poids plume / CLM, malus terrain meuble.
  let rendement = uses.length
    ? Math.max(...uses.map((u) => USE_RENDEMENT[u] ?? 72))
    : 72;
  if (weight < 210) rendement += 3;
  if (nameUp.includes('TIME TRIAL')) rendement += 2;
  if (terrain === 'gravel') rendement -= 4;
  rendement = clamp(rendement, 55, 97);

  // Adhérence : gomme tendre (MAGI-X) > polyvalente (GUM-X), bonus offroad / toutes saisons.
  let grip = 76;
  if (rubberUp.includes('MAGI-X')) grip += 14;
  else if (rubberUp.includes('GUM-X')) grip += 9;
  if (terrain === 'gravel') grip += 4;
  if (uses.includes('ALL ROAD')) grip += 3;
  grip = clamp(grip, 55, 96);

  // Endurance : renfort/protection, lignes endurance/accès, masse ; malus compétition fine.
  let endurance = 70;
  if (reinforced) endurance += 10;
  if (segmentUp.includes('PERFORMANCE') || segmentUp.includes('ACCESS'))
    endurance += 8;
  if (
    uses.some((u) =>
      ['ENDURANCE', 'ALL ROAD', 'TOURING', 'TREKKING', 'VERSATILE'].includes(u),
    )
  ) {
    endurance += 8;
  }
  if (uses.includes('RACING')) endurance -= 6;
  endurance += Math.round((weight - 220) / 35);
  endurance = clamp(endurance, 55, 95);

  // Légèreté : inversement proportionnelle au poids réel (g).
  const legerete = clamp(112 - weight * 0.105, 38, 97);

  return { grip, rendement, endurance, legerete };
}
