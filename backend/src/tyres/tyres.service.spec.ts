import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TyresService } from './tyres.service';
import { PrismaService } from '../prisma/prisma.service';

/** Construit un produit Prisma minimal (champs lus par le mapper). */
function fakeProduct(overrides: Record<string, unknown> = {}) {
  return {
    slug: 'power-cup',
    brand: 'MICHELIN',
    name: 'Power Cup',
    tag: 'Compétition route',
    usage: 'Course · route lisse',
    terrain: 'route',
    segment: 'PREMIUM COMPETITION LINE',
    rubber: 'GUM-X',
    sizes: '700×23 à 28C',
    pressure: '4 – 8 bar',
    tubeless: false,
    grip: 85,
    rendement: 94,
    endurance: 74,
    legerete: 89,
    weightG: 205,
    watts: 14,
    priceEur: 54.9,
    isMichelin: true,
    discontinued: false,
    races: [{ name: 'Tour de France 2024' }],
    ...overrides,
  };
}

describe('TyresService', () => {
  let service: TyresService;
  const prisma = {
    tyreProduct: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [TyresService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(TyresService);
  });

  it('projette les produits vers un résumé public (palmarès aplati)', async () => {
    prisma.tyreProduct.findMany.mockResolvedValue([fakeProduct()]);
    const result = await service.findAll({});
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('power-cup');
    expect(result[0].races).toEqual(['Tour de France 2024']);
  });

  it('exclut les gammes EOL par défaut (where.discontinued = false)', async () => {
    prisma.tyreProduct.findMany.mockResolvedValue([]);
    await service.findAll({});
    expect(prisma.tyreProduct.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ discontinued: false }),
      }),
    );
  });

  it('lève NotFoundException pour un slug inconnu', async () => {
    prisma.tyreProduct.findUnique.mockResolvedValue(null);
    await expect(service.findBySlug('inconnu')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
