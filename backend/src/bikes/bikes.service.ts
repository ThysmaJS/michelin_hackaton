import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Marque de vélo (autocomplétion étape 1 du wizard). */
export interface BrandResponse {
  name: string;
  slug: string;
}

/** Modèle de vélo (autocomplétion étape 2). */
export interface ModelResponse {
  name: string;
  type: string;
}

/** Accès lecture aux marques et modèles de vélos. */
@Injectable()
export class BikesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liste les marques, filtrables par préfixe de recherche (autocomplétion).
   * @param search Texte saisi par l'utilisateur (optionnel).
   */
  async findBrands(search?: string): Promise<BrandResponse[]> {
    const where: Prisma.BikeBrandWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};
    const brands = await this.prisma.bikeBrand.findMany({
      where,
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    });
    return brands;
  }

  /**
   * Liste les modèles d'une marque (filtrables par recherche).
   * @throws NotFoundException si le slug de marque est inconnu.
   */
  async findModelsByBrand(
    slug: string,
    search?: string,
  ): Promise<ModelResponse[]> {
    const brand = await this.prisma.bikeBrand.findUnique({ where: { slug } });
    if (!brand) {
      throw new NotFoundException(`Marque introuvable : ${slug}`);
    }
    const models = await this.prisma.bikeModel.findMany({
      where: {
        brandId: brand.id,
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      },
      orderBy: { name: 'asc' },
      select: { name: true, type: true },
    });
    return models;
  }

  /**
   * Liste les modèles génériques (repli quand la marque n'est pas référencée).
   */
  async findGenericModels(): Promise<ModelResponse[]> {
    return this.prisma.bikeModel.findMany({
      where: { isGeneric: true },
      orderBy: { name: 'asc' },
      select: { name: true, type: true },
    });
  }
}
