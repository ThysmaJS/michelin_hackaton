import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

/** Informations de santé renvoyées par l'endpoint racine. */
export interface HealthStatus {
  status: 'ok' | 'degraded';
  database: 'up' | 'down';
  timestamp: string;
}

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Vérifie l'état de l'API et la connectivité à la base.
   * @returns Un statut agrégé, exploitable par une sonde de healthcheck.
   */
  async getHealth(): Promise<HealthStatus> {
    let database: 'up' | 'down' = 'up';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }

    return {
      status: database === 'up' ? 'ok' : 'degraded',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
