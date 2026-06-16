import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryTyresDto } from './dto/query-tyres.dto';
import {
  TyreDetail,
  TyreSummary,
  toTyreDetail,
  toTyreSummary,
} from './dto/tyre-response';

/** Accès lecture au catalogue de pneus (gammes + variantes). */
@Injectable()
export class TyresService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liste les gammes selon les filtres (terrain, marque, recherche, EOL).
   * @returns Résumés triés par nom.
   */
  async findAll(query: QueryTyresDto): Promise<TyreSummary[]> {
    const where: Prisma.TyreProductWhereInput = {};
    if (query.terrain) where.terrain = query.terrain;
    if (query.brand) where.brand = { equals: query.brand, mode: 'insensitive' };
    if (query.search)
      where.name = { contains: query.search, mode: 'insensitive' };
    if (!query.includeDiscontinued) where.discontinued = false;

    const products = await this.prisma.tyreProduct.findMany({
      where,
      include: { races: true },
      orderBy: [{ isMichelin: 'desc' }, { name: 'asc' }],
    });
    return products.map(toTyreSummary);
  }

  /**
   * Récupère les pneus concurrents (hors Michelin) pour le comparateur.
   * @returns Résumés des gammes concurrentes.
   */
  async findCompetitors(): Promise<TyreSummary[]> {
    const products = await this.prisma.tyreProduct.findMany({
      where: { isMichelin: false },
      include: { races: true },
      orderBy: { name: 'asc' },
    });
    return products.map(toTyreSummary);
  }

  /**
   * Récupère le détail d'une gamme par son slug (variantes incluses).
   * @throws NotFoundException si le slug est inconnu.
   */
  async findBySlug(slug: string): Promise<TyreDetail> {
    const product = await this.prisma.tyreProduct.findUnique({
      where: { slug },
      include: { races: true, variants: { orderBy: { weightG: 'asc' } } },
    });
    if (!product) {
      throw new NotFoundException(`Pneu introuvable : ${slug}`);
    }
    return toTyreDetail(product);
  }
}
