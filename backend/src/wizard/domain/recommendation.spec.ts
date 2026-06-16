import { recommend, optimalTyreForRoute } from './recommendation';

describe('recommend', () => {
  it('oriente le gravel intensif vers Power Gravel, occasionnel vers Power Adventure', () => {
    expect(recommend({ route: 'Chemin / gravel', freq: 'Intensif' })).toBe(
      'power-gravel',
    );
    expect(recommend({ route: 'Chemin / gravel', freq: 'Compétition' })).toBe(
      'power-gravel',
    );
    expect(recommend({ route: 'Chemin / gravel', freq: 'Occasionnel' })).toBe(
      'power-adventure',
    );
  });

  it('gère la route lisse selon la fréquence', () => {
    expect(recommend({ route: 'Route lisse', freq: 'Compétition' })).toBe(
      'power-cup',
    );
    expect(recommend({ route: 'Route lisse', freq: 'Intensif' })).toBe(
      'power-road',
    );
    expect(recommend({ route: 'Route lisse', freq: 'Occasionnel' })).toBe(
      'lithion-4',
    );
    expect(recommend({ route: 'Route lisse', freq: 'Régulier' })).toBe(
      'power-road',
    );
  });

  it('gère pavés et mixte', () => {
    expect(recommend({ route: 'Pavés', freq: 'Compétition' })).toBe(
      'power-cup',
    );
    expect(recommend({ route: 'Pavés', freq: 'Régulier' })).toBe(
      'power-all-season',
    );
    expect(recommend({ route: 'Mixte', freq: 'Régulier' })).toBe(
      'power-adventure',
    );
  });

  it('retombe sur power-road par défaut', () => {
    expect(recommend({ route: 'Inconnu', freq: 'Inconnu' })).toBe('power-road');
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
