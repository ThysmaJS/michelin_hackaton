// Logique de décision pure du tunnel « Trouver mon pneu » — port de
// `frontend/src/lib/recommend.js`. Aucune dépendance framework/base : ces
// fonctions renvoient un slug de gamme (`TyreProduct.slug`).

/** Entrée minimale du moteur de recommandation issue du wizard. */
export interface RecommendationInput {
  /** Type de routes choisi (libellé `RouteType.code`). */
  route: string;
  /** Fréquence de sortie choisie (libellé `Frequency.code`). */
  freq: string;
}

/**
 * Détermine le slug du pneu Michelin recommandé selon le terrain et la fréquence.
 *
 * @param input Choix du wizard (`route`, `freq`).
 * @returns Slug d'une gamme (ex. "power-cup").
 */
export function recommend({ route, freq }: RecommendationInput): string {
  if (route === 'Chemin / gravel') {
    return freq === 'Intensif' || freq === 'Compétition'
      ? 'power-gravel'
      : 'power-adventure';
  }
  if (route === 'Mixte') return 'power-adventure';
  if (route === 'Pavés')
    return freq === 'Compétition' ? 'power-cup' : 'power-all-season';
  if (route === 'Route lisse') {
    if (freq === 'Compétition') return 'power-cup';
    if (freq === 'Intensif') return 'power-road';
    if (freq === 'Occasionnel') return 'lithion-4';
    return 'power-road';
  }
  return 'power-road';
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
    // Surfaces roulantes/damées → Adventure ; sinon Gravel polyvalent.
    if (/vigne|pinède|pinede|ocre/.test(s)) return 'power-adventure';
    return 'power-gravel';
  }
  // Route.
  if (/pavé|pave/.test(s)) return 'power-all-season'; // pavés → robustesse
  if (/littoral|granit|cap/.test(s)) return 'power-all-season'; // côtier/humide → adhérence
  if (/col|géant|geant|gorge/.test(s)) return 'power-cup'; // cols & descentes → compétition
  return 'power-road'; // plat roulant → performance
}
