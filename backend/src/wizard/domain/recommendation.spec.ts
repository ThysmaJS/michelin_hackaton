import { recommend, calcPressure, optimalTyreForRoute } from './recommendation';

describe('recommend', () => {
  it('mappe la fréquence sur les paliers gravel', () => {
    expect(recommend({ route: 'Chemin / gravel', freq: 'Compétition' })).toBe(
      'power-gravel-rs',
    );
    expect(recommend({ route: 'Chemin / gravel', freq: 'Intensif' })).toBe(
      'power-gravel',
    );
    expect(recommend({ route: 'Chemin / gravel', freq: 'Occasionnel' })).toBe(
      'power-adventure',
    );
  });

  it('route lisse : le palier + la jante orientent vers le tubeless', () => {
    // Jante large par défaut (19 mm ≥ 17) → versions tubeless.
    expect(recommend({ route: 'Route lisse', freq: 'Compétition' })).toBe(
      'power-cup-tlr',
    );
    expect(recommend({ route: 'Route lisse', freq: 'Intensif' })).toBe(
      'power-road-tlr',
    );
    // Jante étroite → versions à chambre.
    expect(
      recommend({ route: 'Route lisse', freq: 'Compétition', rimWidth: 15 }),
    ).toBe('power-cup');
    expect(
      recommend({ route: 'Route lisse', freq: 'Intensif', rimWidth: 15 }),
    ).toBe('power-road');
    // Occasionnel → entrée de gamme.
    expect(
      recommend({ route: 'Route lisse', freq: 'Occasionnel', rimWidth: 15 }),
    ).toBe('lithion-4');
  });

  it('la FTP élevée relève le palier (≥ compétition au-delà de 300 W)', () => {
    expect(
      recommend({
        route: 'Route lisse',
        freq: 'Occasionnel',
        rimWidth: 15,
        ftp: 320,
      }),
    ).toBe('power-cup');
  });

  it("le cycliste lourd est redirigé vers l'endurance (sauf compétition)", () => {
    expect(
      recommend({
        route: 'Route lisse',
        freq: 'Intensif',
        riderWeight: 95,
        rimWidth: 15,
      }),
    ).toBe('lithion-4');
  });

  it('gère pavés, mixte et le défaut', () => {
    expect(recommend({ route: 'Pavés', freq: 'Compétition' })).toBe(
      'power-cup',
    );
    expect(recommend({ route: 'Pavés', freq: 'Régulier' })).toBe(
      'power-all-season',
    );
    expect(recommend({ route: 'Mixte', freq: 'Régulier' })).toBe(
      'power-adventure',
    );
    expect(recommend({ route: 'Inconnu', freq: 'Inconnu' })).toBe(
      'power-road-tlr',
    ); // tier 1 + jante large
  });
});

describe('calcPressure', () => {
  it('calcule des pressions cohérentes (75 kg, jante 19 mm, tubeless)', () => {
    const p = calcPressure(75, 8, 19);
    expect(p.tireMm).toBe(28);
    expect(p.tubeless).toBe(true);
    expect(p.front).toBe('3.8');
    expect(p.rear).toBe('5.6');
    // L'arrière est toujours plus gonflé que l'avant (répartition du poids).
    expect(Number(p.rear)).toBeGreaterThan(Number(p.front));
  });

  it('jante étroite (< 17 mm) → pneu fin, pas de tubeless', () => {
    const p = calcPressure(60, 7, 14);
    expect(p.tireMm).toBe(23);
    expect(p.tubeless).toBe(false);
  });
});

describe('optimalTyreForRoute', () => {
  it('choisit le pneu route selon les mots-clés de surface', () => {
    expect(
      optimalTyreForRoute({ terrain: 'route', surface: 'Route · grand col' }),
    ).toBe('power-cup');
    expect(
      optimalTyreForRoute({ terrain: 'route', surface: 'Route · littoral' }),
    ).toBe('power-all-season');
    expect(
      optimalTyreForRoute({ terrain: 'route', surface: 'Route · fleuve' }),
    ).toBe('power-road');
  });

  it('choisit le pneu gravel selon la surface', () => {
    expect(
      optimalTyreForRoute({ terrain: 'gravel', surface: 'Gravel · vignes' }),
    ).toBe('power-adventure');
    expect(
      optimalTyreForRoute({ terrain: 'gravel', surface: 'Gravel · causse' }),
    ).toBe('power-gravel');
  });
});
