import { describe, it, expect } from 'vitest';
import { recommend, calcPressure, optimalTyreForRoute, postalToRegion } from './recommend.js';

// ─── recommend() ───────────────────────────────────────────────────────────────

describe('recommend — gravel', () => {
  it('retourne power-gravel-rs pour un compétiteur sur gravel', () => {
    expect(recommend({ route: 'Chemin / gravel', freq: 'Compétition' })).toBe('power-gravel-rs');
  });

  it('retourne power-gravel pour un pratiquant régulier sur gravel', () => {
    expect(recommend({ route: 'Chemin / gravel', freq: 'Régulier' })).toBe('power-gravel');
  });

  it('retourne power-adventure pour un occasionnel sur gravel', () => {
    expect(recommend({ route: 'Chemin / gravel', freq: 'Occasionnel' })).toBe('power-adventure');
  });
});

describe('recommend — route mixte et pavés', () => {
  it('retourne power-adventure pour mixte (quel que soit le niveau)', () => {
    expect(recommend({ route: 'Mixte', freq: 'Compétition' })).toBe('power-adventure');
    expect(recommend({ route: 'Mixte', freq: 'Occasionnel' })).toBe('power-adventure');
  });

  it('retourne power-cup pour un compétiteur sur pavés', () => {
    expect(recommend({ route: 'Pavés', freq: 'Compétition' })).toBe('power-cup');
  });

  it('retourne power-all-season pour un non-compétiteur sur pavés', () => {
    expect(recommend({ route: 'Pavés', freq: 'Régulier' })).toBe('power-all-season');
  });
});

describe('recommend — route lisse', () => {
  it('retourne power-cup-tlr pour un compétiteur avec jante large (tubeless)', () => {
    expect(recommend({ route: 'Route lisse', freq: 'Compétition', rimWidth: 19 })).toBe('power-cup-tlr');
  });

  it('retourne power-cup sans tubeless si jante étroite', () => {
    expect(recommend({ route: 'Route lisse', freq: 'Compétition', rimWidth: 15 })).toBe('power-cup');
  });

  it('retourne power-road-tlr pour un régulier avec jante tubeless', () => {
    expect(recommend({ route: 'Route lisse', freq: 'Régulier', rimWidth: 19 })).toBe('power-road-tlr');
  });

  it('force lithion-4 pour un cycliste lourd (≥90 kg) non compétiteur', () => {
    // riderWeight ≥90 && tier < 2 → tier forcé à 0 (durabilité > légèreté)
    expect(recommend({ route: 'Route lisse', freq: 'Intensif', riderWeight: 95, rimWidth: 19 })).toBe('lithion-4');
  });

  it('ignore le downgrade lourd si tier compétition (FTP > 300)', () => {
    // tier 2 : la condition riderWeight>=90&&tier<2 ne s'applique pas
    expect(recommend({ route: 'Route lisse', freq: 'Compétition', riderWeight: 95, rimWidth: 19 })).toBe('power-cup-tlr');
  });

  it('retourne lithion-4 pour un occasionnel léger', () => {
    expect(recommend({ route: 'Route lisse', freq: 'Occasionnel', riderWeight: 70, rimWidth: 15 })).toBe('lithion-4');
  });
});

describe('recommend — overrides FTP', () => {
  it('un FTP > 300 force le tier compétition', () => {
    expect(recommend({ route: 'Route lisse', freq: 'Occasionnel', ftp: 350, rimWidth: 19 })).toBe('power-cup-tlr');
  });

  it('un FTP entre 250 et 300 monte au tier standard minimum', () => {
    // Occasionnel (tier 0) + ftp 260 → tier 1 + jante narrow → power-road
    expect(recommend({ route: 'Route lisse', freq: 'Occasionnel', ftp: 260, rimWidth: 15 })).toBe('power-road');
  });
});

// ─── calcPressure() ─────────────────────────────────────────────────────────

describe('calcPressure', () => {
  it('calcule des pressions cohérentes (arrière > avant)', () => {
    const { front, rear } = calcPressure(75, 8, 19);
    expect(parseFloat(rear)).toBeGreaterThan(parseFloat(front));
  });

  it('détecte tubeless pour jante ≥17 mm', () => {
    expect(calcPressure(75, 8, 17).tubeless).toBe(true);
    expect(calcPressure(75, 8, 16).tubeless).toBe(false);
  });

  it('sélectionne la bonne largeur de pneu selon la jante', () => {
    expect(calcPressure(75, 8, 15).tireMm).toBe(23);
    expect(calcPressure(75, 8, 19).tireMm).toBe(28);
    expect(calcPressure(75, 8, 25).tireMm).toBe(38);
  });

  it('ne descend jamais sous les minimums de sécurité', () => {
    // Cycliste très léger
    const { front, rear } = calcPressure(40, 5, 25);
    expect(parseFloat(front)).toBeGreaterThanOrEqual(2.5);
    expect(parseFloat(rear)).toBeGreaterThanOrEqual(3.0);
  });
});

// ─── optimalTyreForRoute() ──────────────────────────────────────────────────

describe('optimalTyreForRoute', () => {
  it('retourne power-adventure pour un parcours gravel viticole', () => {
    expect(optimalTyreForRoute({ t: 'gravel', surface: 'Vignes et pinède' })).toBe('power-adventure');
  });

  it('retourne power-gravel pour un gravel générique', () => {
    expect(optimalTyreForRoute({ t: 'gravel', surface: 'Forêt' })).toBe('power-gravel');
  });

  it('retourne power-all-season pour une route pavée', () => {
    expect(optimalTyreForRoute({ t: 'route', surface: 'Pavés historiques' })).toBe('power-all-season');
  });

  it('retourne power-cup pour un col de montagne', () => {
    expect(optimalTyreForRoute({ t: 'route', surface: 'Col du Géant' })).toBe('power-cup');
  });

  it('retourne power-road par défaut', () => {
    expect(optimalTyreForRoute({ t: 'route', surface: 'Route départementale' })).toBe('power-road');
  });
});

// ─── postalToRegion() ───────────────────────────────────────────────────────

describe('postalToRegion', () => {
  it('résout un code postal par département', () => {
    expect(postalToRegion('69001')).toBe('aura');
    expect(postalToRegion('75008')).toBe('idf');
    expect(postalToRegion('33000')).toBe('aquitaine');
  });

  it('résout une ville connue en texte libre', () => {
    expect(postalToRegion('Lyon')).toBe('aura');
    expect(postalToRegion('Bordeaux')).toBe('aquitaine');
    expect(postalToRegion('Paris')).toBe('idf');
  });

  it('retourne null pour une entrée inconnue', () => {
    expect(postalToRegion('00000')).toBeNull();
    expect(postalToRegion('Berlin')).toBeNull();
    expect(postalToRegion('')).toBeNull();
  });
});
