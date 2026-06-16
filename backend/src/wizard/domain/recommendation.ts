// Logique de décision pure du tunnel « Trouver mon pneu » — port de
// `frontend/src/lib/recommend.js`. Aucune dépendance framework/base : ces
// fonctions renvoient un slug de gamme (`TyreProduct.slug`) ou un calcul de pression.

/** Entrée du moteur de recommandation (les champs « profil » sont optionnels). */
export interface RecommendationInput {
  /** Type de routes choisi (libellé `RouteType.code`). */
  route: string;
  /** Fréquence de sortie choisie (libellé `Frequency.code`). */
  freq: string;
  /** Poids du cycliste en kg (étape « Mon profil »). */
  riderWeight?: number;
  /** Poids du vélo en kg. */
  bikeWeight?: number;
  /** Largeur interne de jante en mm. */
  rimWidth?: number;
  /** FTP (puissance seuil) en watts, ou null si non renseigné. */
  ftp?: number | null;
}

/** Paliers de performance. */
const FREQ_TIER: Readonly<Record<string, number>> = {
  Occasionnel: 0,
  Régulier: 1,
  Intensif: 1,
  Compétition: 2,
};

/**
 * Recommande le slug d'un pneu Michelin selon le profil d'usage.
 *
 * Les paramètres avancés (poids, jante, FTP) proviennent de l'étape « Mon profil »
 * optionnelle ; leurs valeurs par défaut reproduisent le comportement de base.
 * Paliers : 0 = endurance/loisir · 1 = standard · 2 = compétition.
 *
 * @returns Slug d'une gamme (ex. "power-cup-tlr").
 */
export function recommend({
  route,
  freq,
  riderWeight = 75,
  rimWidth = 19,
  ftp = null,
}: RecommendationInput): string {
  // Palier de base selon la fréquence.
  let tier = FREQ_TIER[freq] ?? 1;

  // La FTP relève le palier : les gros moteurs ont besoin d'adhérence à haute vitesse.
  if (ftp !== null) {
    if (ftp > 300) tier = Math.max(tier, 2);
    else if (ftp > 250) tier = Math.max(tier, 1);
  }

  // Cycliste lourd (≥ 90 kg) : durabilité plutôt que légèreté, sauf compétition explicite.
  if (riderWeight >= 90 && tier < 2) tier = 0;

  const preferTubeless = rimWidth >= 17; // jante assez large = compatible tubeless
  const isHeavy = riderWeight >= 90;

  // Gravel.
  if (route === 'Chemin / gravel') {
    if (tier === 2) return 'power-gravel-rs';
    if (tier === 1) return 'power-gravel';
    return 'power-adventure';
  }

  // Mixte.
  if (route === 'Mixte') return 'power-adventure';

  // Pavés.
  if (route === 'Pavés') return tier === 2 ? 'power-cup' : 'power-all-season';

  // Route lisse (défaut).
  if (tier === 2) return preferTubeless ? 'power-cup-tlr' : 'power-cup';
  if (tier === 1) {
    if (isHeavy) return 'power-protection-tlr'; // renforcé + anti-crevaison
    if (preferTubeless) return 'power-road-tlr';
    return 'power-road';
  }
  return 'lithion-4'; // tier 0
}

/** Pression de gonflage conseillée (bar) et dimension associée. */
export interface PressureAdvice {
  front: string;
  rear: string;
  tireMm: number;
  tubeless: boolean;
}

/**
 * Calcule la pression de gonflage optimale (méthodologie SILCA : déflexion ~15 %).
 * Pressions arrondies à 0,2 bar (précision standard pro).
 *
 * @param riderKg Poids du cycliste (kg).
 * @param bikeKg Poids du vélo (kg).
 * @param rimMm Largeur interne de jante (mm).
 */
export function calcPressure(
  riderKg: number,
  bikeKg: number,
  rimMm: number,
): PressureAdvice {
  const totalKg = riderKg + bikeKg;

  // Largeur de pneu optimale selon la jante (recommandation ETRTO : ratio 1,3–1,5×).
  const tireMm =
    rimMm <= 15
      ? 23
      : rimMm <= 18
        ? 25
        : rimMm <= 21
          ? 28
          : rimMm <= 23
            ? 32
            : 38;
  const tubeless = rimMm >= 17;

  const coef = 0.133; // bar par kg de charge, calibré pour la route
  const wCorr = (tireMm - 25) * 0.12; // correction de largeur
  const tCorr = tubeless ? 0.5 : 0; // le tubeless roule plus bas

  const front = Math.max(2.5, totalKg * 0.42 * coef - wCorr - tCorr);
  const rear = Math.max(3.0, totalKg * 0.58 * coef - wCorr - tCorr);

  return {
    front: (Math.round(front / 0.2) * 0.2).toFixed(1),
    rear: (Math.round(rear / 0.2) * 0.2).toFixed(1),
    tireMm,
    tubeless,
  };
}

/**
 * Pneu Michelin optimal pour un parcours du Guide, d'après son terrain
 * (route/gravel) et les mots-clés de surface (pavés, cols, littoral, vignes…).
 *
 * @param route Parcours avec `terrain` ('route' | 'gravel') et `surface` libre.
 * @returns Slug d'une gamme.
 */
export function optimalTyreForRoute(route: {
  terrain: string;
  surface?: string;
}): string {
  const s = (route.surface || '').toLowerCase();
  if (route.terrain === 'gravel') {
    if (/vigne|pinède|pinede|ocre/.test(s)) return 'power-adventure';
    return 'power-gravel';
  }
  if (/pavé|pave/.test(s)) return 'power-all-season';
  if (/littoral|granit|cap/.test(s)) return 'power-all-season';
  if (/col|géant|geant|gorge/.test(s)) return 'power-cup';
  return 'power-road';
}
