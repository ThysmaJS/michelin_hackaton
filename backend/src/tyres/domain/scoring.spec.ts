import { deriveScores } from './scoring';

describe('deriveScores', () => {
  it("valorise le rendement et la légèreté d'un pneu de course léger (Power Cup)", () => {
    const s = deriveScores({
      uses: ['RACING'],
      terrain: 'route',
      rubber: 'GUM-X',
      weight: 215,
      segment: 'PREMIUM COMPETITION LINE',
      reinforced: false,
      name: 'Power Cup',
    });
    expect(s.rendement).toBe(94); // RACING, sans bonus poids (>=210)
    expect(s.grip).toBe(85); // 76 + 9 (GUM-X)
    expect(s.legerete).toBeGreaterThan(85);
    expect(s.endurance).toBeLessThan(75); // malus RACING
  });

  it('applique les bonus gravel (adhérence) et le malus de rendement', () => {
    const route = deriveScores({
      uses: ['RACING'],
      terrain: 'route',
      rubber: 'GUM-X',
      weight: 300,
    });
    const gravel = deriveScores({
      uses: ['RACING'],
      terrain: 'gravel',
      rubber: 'GUM-X',
      weight: 300,
    });
    expect(gravel.grip).toBe(route.grip + 4);
    expect(gravel.rendement).toBe(route.rendement - 4);
  });

  it('reconnaît les gommes réelles du catalogue par inclusion (MAGI-X GREEN)', () => {
    const magix = deriveScores({
      uses: ['CYCLOCROSS'],
      terrain: 'gravel',
      rubber: 'MAGI-X GREEN',
      weight: 470,
    });
    const gumx = deriveScores({
      uses: ['CYCLOCROSS'],
      terrain: 'gravel',
      rubber: 'GUM-X3D',
      weight: 470,
    });
    expect(magix.grip).toBeGreaterThan(gumx.grip); // MAGI-X (+14) > GUM-X (+9)
  });

  it('borne les scores dans leurs plages respectives', () => {
    const heavy = deriveScores({
      uses: ['LEISURE'],
      terrain: 'city',
      rubber: null,
      weight: 900,
    });
    expect(heavy.legerete).toBe(38); // plancher légèreté
    expect(heavy.grip).toBeGreaterThanOrEqual(55);
    expect(heavy.endurance).toBeLessThanOrEqual(95);
  });
});
