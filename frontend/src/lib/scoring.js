// Dérivation des 4 scores radar (0–100) à partir des attributs réels du catalogue
// Michelin 2026. Le catalogue ne fournit pas d'indices de performance : ces scores sont
// donc calculés de façon déterministe et documentée à partir de l'usage, de la gomme,
// du poids, du segment et du terrain. Les valeurs présentes dans `tyres` (data.js) ont
// été générées avec cette fonction ; elle est conservée ici pour transparence et pour
// recalculer la grille si le catalogue évolue.

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));

// Rendement de base selon l'usage déclaré (colonne « Use » du catalogue).
const USE_RENDEMENT = {
  RACING: 94, SPEED: 88, 'ALL ROAD': 84, 'E-ROAD': 82, ENDURANCE: 82,
  VERSATILE: 74, TOURING: 72, TREKKING: 71, TRAIL: 68, CYCLOCROSS: 76, LEISURE: 62,
};

/**
 * @param {object} a  Attributs réels : { uses[], terrain, rubber, weight, segment, tubeless, reinforced, name }
 * @returns {{ grip:number, rendement:number, endurance:number, legerete:number }}
 */
export function deriveScores(a) {
  const { uses = [], terrain, rubber, weight, segment, reinforced, name = '' } = a;

  // Rendement : meilleur usage, bonus poids plume / CLM, malus terrain meuble.
  let rendement = Math.max(...uses.map((u) => USE_RENDEMENT[u] ?? 72));
  if (weight < 210) rendement += 3;
  if (name.includes('Time Trial')) rendement += 2;
  if (terrain === 'gravel') rendement -= 4;
  rendement = clamp(rendement, 55, 97);

  // Adhérence : gomme tendre (MAGI-X) > polyvalente (GUM-X), bonus offroad / toutes saisons.
  let grip = 76;
  if (rubber === 'MAGI-X') grip += 14;
  else if (rubber === 'GUM-X') grip += 9;
  if (terrain === 'gravel') grip += 4;
  if (uses.includes('ALL ROAD')) grip += 3;
  grip = clamp(grip, 55, 96);

  // Endurance : renfort/protection, lignes endurance, masse ; malus compétition fine.
  let endurance = 70;
  if (reinforced) endurance += 10;
  if (segment === 'Access Line' || segment === 'Performance Line') endurance += 8;
  if (uses.some((u) => ['ENDURANCE', 'ALL ROAD', 'TOURING', 'TREKKING', 'VERSATILE'].includes(u))) endurance += 8;
  if (uses.includes('RACING')) endurance -= 6;
  endurance += Math.round((weight - 220) / 35);
  endurance = clamp(endurance, 55, 95);

  // Légèreté : inversement proportionnelle au poids réel (g).
  const legerete = clamp(112 - weight * 0.105, 38, 97);

  return { grip, rendement, endurance, legerete };
}
