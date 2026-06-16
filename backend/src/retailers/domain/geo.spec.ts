import { extractDepartmentCode, matchCityToRegion } from './geo';

describe('extractDepartmentCode', () => {
  it("extrait les 2 premiers chiffres d'un code postal", () => {
    expect(extractDepartmentCode('69003')).toBe('69');
    expect(extractDepartmentCode('Lyon 69001')).toBe('69');
  });

  it('renvoie une chaîne vide sans chiffre', () => {
    expect(extractDepartmentCode('Bordeaux')).toBe('');
    expect(extractDepartmentCode(null)).toBe('');
  });
});

describe('matchCityToRegion', () => {
  it('reconnaît les grandes villes', () => {
    expect(matchCityToRegion('Lyon')).toBe('aura');
    expect(matchCityToRegion('Saint-Étienne')).toBe('aura');
    expect(matchCityToRegion('Marseille')).toBe('paca');
    expect(matchCityToRegion('Bordeaux')).toBe('aquitaine');
  });

  it('renvoie null pour une ville inconnue ou une saisie vide', () => {
    expect(matchCityToRegion('Tokyo')).toBeNull();
    expect(matchCityToRegion('')).toBeNull();
  });
});
