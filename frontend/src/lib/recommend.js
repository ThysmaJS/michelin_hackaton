// Pure decision logic: recommendation engine + pressure calculator + region mapping.

/**
 * Recommends a tire key based on usage profile.
 * Advanced params come from the optional step 6; defaults produce the same result
 * as simple freq-only logic.
 *
 * Performance tiers: 0 = endurance/loisir · 1 = standard · 2 = competition
 */
export function recommend({ route, freq, riderWeight = 75, bikeWeight = 8, rimWidth = 19, ftp = null }) {
  // Base tier from riding frequency
  let tier = { Occasionnel: 0, Régulier: 1, Intensif: 1, Compétition: 2 }[freq] ?? 1;

  // FTP overrides tier: high-power riders need grip at speed
  if (ftp !== null) {
    if (ftp > 300) tier = Math.max(tier, 2);       // always competition grade
    else if (ftp > 250) tier = Math.max(tier, 1);  // at least standard
  }

  // Heavy rider (≥90 kg): durability over lightness unless explicitly racing
  if (riderWeight >= 90 && tier < 2) tier = 0;

  const preferTubeless = rimWidth >= 17; // wide enough rim = tubeless capable
  const isHeavy        = riderWeight >= 90;

  // Gravel
  if (route === 'Chemin / gravel') {
    if (tier === 2) return 'power-gravel-rs';
    if (tier === 1) return 'power-gravel';
    return 'power-adventure';
  }

  // Mixed
  if (route === 'Mixte') return 'power-adventure';

  // Cobblestones
  if (route === 'Pavés') {
    return tier === 2 ? 'power-cup' : 'power-all-season';
  }

  // Route lisse (default)
  if (tier === 2) return preferTubeless ? 'power-cup-tlr' : 'power-cup';

  if (tier === 1) {
    if (isHeavy) return 'power-protection-tlr'; // reinforced + puncture-proof
    if (preferTubeless) return 'power-road-tlr';
    return 'power-road';
  }

  // tier 0
  return 'lithion-4';
}

/**
 * Calculates the optimal tire pressure for a given rider + bike weight and rim width.
 * Based on SILCA methodology: optimal contact patch at 15% tire deflection.
 * Returns pressures rounded to 0.2 bar (pro standard precision).
 *
 * @returns {{ front: string, rear: string, tireMm: number, tubeless: boolean }}
 */
export function calcPressure(riderKg, bikeKg, rimMm) {
  const totalKg = riderKg + bikeKg;

  // Optimal tire width from internal rim width (ETRTO recommendation: 1.3–1.5× ratio)
  const tireMm =
    rimMm <= 15 ? 23 :
    rimMm <= 18 ? 25 :
    rimMm <= 21 ? 28 :
    rimMm <= 23 ? 32 : 38;

  const tubeless = rimMm >= 17;

  // Pressure coefficient (bar per kg of load) calibrated for road cycling
  const coef = 0.133;
  // Width correction: narrower than 25mm → more pressure, wider → less
  const wCorr = (tireMm - 25) * 0.12;
  // Tubeless runs lower pressure (better compliance, no pinch flat risk)
  const tCorr = tubeless ? 0.5 : 0;

  const front = Math.max(2.5, totalKg * 0.42 * coef - wCorr - tCorr);
  const rear  = Math.max(3.0, totalKg * 0.58 * coef - wCorr - tCorr);

  return {
    front:   (Math.round(front / 0.2) * 0.2).toFixed(1),
    rear:    (Math.round(rear  / 0.2) * 0.2).toFixed(1),
    tireMm,
    tubeless,
  };
}

/**
 * Optimal Michelin tire for a given guide route based on terrain keywords.
 */
export function optimalTyreForRoute(route) {
  const s = (route.surface || '').toLowerCase();
  if (route.t === 'gravel') {
    if (/vigne|pinède|pinede|ocre/.test(s)) return 'power-adventure';
    return 'power-gravel';
  }
  if (/pavé|pave/.test(s))               return 'power-all-season';
  if (/littoral|granit|cap/.test(s))     return 'power-all-season';
  if (/col|géant|geant|gorge/.test(s))   return 'power-cup';
  return 'power-road';
}

const departmentMap = {
  aura:      ['69', '01', '03', '07', '15', '26', '38', '42', '43', '63', '73', '74'],
  paca:      ['04', '05', '06', '13', '83', '84'],
  idf:       ['75', '77', '78', '91', '92', '93', '94', '95'],
  bretagne:  ['22', '29', '35', '56'],
  occitanie: ['09', '11', '12', '30', '31', '32', '34', '46', '48', '65', '66', '81', '82'],
  aquitaine: ['16', '17', '19', '23', '24', '33', '40', '47', '64', '79', '86', '87'],
};

const cityMatchers = [
  ['aura',      /lyon|grenoble|annecy|chambér|clermont|valence|st[- ]?étienne|saint[- ]?étienne/],
  ['paca',      /marseille|nice|toulon|aix|avignon|cannes/],
  ['idf',       /paris|versailles|boulogne|nanterre|créteil/],
  ['bretagne',  /rennes|brest|quimper|vannes|lorient|st[- ]?malo/],
  ['occitanie', /toulouse|montpellier|nîmes|perpignan|albi/],
  ['aquitaine', /bordeaux|biarritz|pau|bayonne|arcachon|limoges/],
];

export function postalToRegion(p) {
  const d = (p || '').replace(/\D/g, '').slice(0, 2);
  for (const key in departmentMap) {
    if (departmentMap[key].includes(d)) return key;
  }
  const c = (p || '').toLowerCase();
  for (const [key, re] of cityMatchers) {
    if (re.test(c)) return key;
  }
  return null;
}
