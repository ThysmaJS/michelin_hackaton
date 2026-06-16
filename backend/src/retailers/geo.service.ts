import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { extractDepartmentCode, matchCityToRegion } from './domain/geo';

/** Résolution « code postal / ville → région » (table départements + repli ville). */
@Injectable()
export class GeoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Détermine la région correspondant à une saisie.
   *
   * Priorité au code postal (2 premiers chiffres → table PostalDepartment) ;
   * à défaut, repli sur la reconnaissance du nom de ville.
   *
   * @param input Code postal ou ville.
   * @returns Clé de région (ex. "aura") ou `null` si non résolu.
   */
  async resolveRegion(input: string): Promise<string | null> {
    const code = extractDepartmentCode(input);
    if (code.length === 2) {
      const dept = await this.prisma.postalDepartment.findUnique({
        where: { code },
      });
      if (dept) return dept.regionKey;
    }
    return matchCityToRegion(input);
  }
}
