import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeoService } from './geo.service';

/** Point de vente renvoyé au client. */
export interface RetailerResponse {
  name: string;
  address: string;
  city: string;
  distance: string;
  stock: boolean;
  lat: number;
  lng: number;
}

/** Résultat d'une recherche de revendeurs. */
export interface RetailerSearchResult {
  /** Région résolue depuis la saisie (null si non reconnue). */
  region: string | null;
  retailers: RetailerResponse[];
}

const RETAILER_SELECT = {
  name: true,
  address: true,
  city: true,
  distance: true,
  stock: true,
  lat: true,
  lng: true,
} as const;

/** Recherche de revendeurs proches d'une localisation. */
@Injectable()
export class RetailersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geo: GeoService,
  ) {}

  /**
   * Recherche les revendeurs proches d'un code postal / d'une ville.
   *
   * La saisie est d'abord résolue en région ; les revendeurs de cette région
   * sont alors renvoyés, triés par disponibilité du stock.
   *
   * @param postal Code postal ou ville.
   * @returns La région résolue et la liste des revendeurs correspondants.
   */
  async search(postal: string): Promise<RetailerSearchResult> {
    const region = await this.geo.resolveRegion(postal);
    if (!region) {
      return { region: null, retailers: [] };
    }
    const retailers = await this.prisma.retailer.findMany({
      where: { regionKey: region },
      // `distance` est un libellé ("1,2 km") : on priorise le stock, puis le nom.
      orderBy: [{ stock: 'desc' }, { name: 'asc' }],
      select: RETAILER_SELECT,
    });
    return { region, retailers };
  }
}
