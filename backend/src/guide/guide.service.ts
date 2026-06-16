import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RouteDetail,
  RouteSummary,
  toRouteDetail,
  toRouteSummary,
} from './dto/guide-response';

/** Région cyclable du Guide. */
export interface RegionResponse {
  key: string;
  label: string;
}

const TYRE_INCLUDE = { recommendedTyre: { include: { races: true } } } as const;

/** Accès lecture au Guide Michelin (régions et parcours). */
@Injectable()
export class GuideService {
  constructor(private readonly prisma: PrismaService) {}

  /** Liste les régions disponibles. */
  async findRegions(): Promise<RegionResponse[]> {
    return this.prisma.region.findMany({
      orderBy: { label: 'asc' },
      select: { key: true, label: true },
    });
  }

  /**
   * Liste les parcours d'une région.
   * @throws NotFoundException si la région est inconnue.
   */
  async findRoutesByRegion(key: string): Promise<RouteSummary[]> {
    const region = await this.prisma.region.findUnique({ where: { key } });
    if (!region) {
      throw new NotFoundException(`Région introuvable : ${key}`);
    }
    const routes = await this.prisma.route.findMany({
      where: { regionId: region.id },
      include: TYRE_INCLUDE,
      orderBy: { title: 'asc' },
    });
    return routes.map(toRouteSummary);
  }

  /**
   * Liste les parcours qui recommandent un pneu donné (lien Guide ↔ pneu choisi).
   * @param slug Slug du pneu.
   */
  async findRoutesByTyre(slug: string): Promise<RouteSummary[]> {
    const routes = await this.prisma.route.findMany({
      where: { recommendedTyre: { slug } },
      include: TYRE_INCLUDE,
      orderBy: { title: 'asc' },
    });
    return routes.map(toRouteSummary);
  }

  /**
   * Récupère le détail éditorial d'un parcours par son titre.
   * @throws NotFoundException si le titre est inconnu.
   */
  async findRouteByTitle(title: string): Promise<RouteDetail> {
    const route = await this.prisma.route.findUnique({
      where: { title },
      include: {
        region: true,
        segments: true,
        waypoints: true,
        ...TYRE_INCLUDE,
      },
    });
    if (!route) {
      throw new NotFoundException(`Parcours introuvable : ${title}`);
    }
    return toRouteDetail(route);
  }
}
