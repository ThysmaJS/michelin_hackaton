import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Client Prisma partagé, géré par le cycle de vie NestJS.
 *
 * Ouvre la connexion au démarrage du module et la ferme proprement à l'arrêt,
 * afin d'éviter les fuites de connexions PostgreSQL.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  /** Connecte le client à la base au démarrage du module. */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Connexion PostgreSQL établie');
  }

  /** Ferme la connexion lors de l'arrêt de l'application. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
