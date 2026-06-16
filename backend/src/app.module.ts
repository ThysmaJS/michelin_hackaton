import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationSchema } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { TyresModule } from './tyres/tyres.module';
import { BikesModule } from './bikes/bikes.module';
import { WizardModule } from './wizard/wizard.module';
import { ComparatorModule } from './comparator/comparator.module';
import { GuideModule } from './guide/guide.module';
import { RetailersModule } from './retailers/retailers.module';
import { ReferenceModule } from './reference/reference.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';

/**
 * Module racine de l'application.
 *
 * Branche la configuration validée, le rate limiting global, l'accès base
 * (Prisma) et les modules métier.
 */
@Module({
  imports: [
    // Configuration globale + validation des variables d'environnement.
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),

    // Rate limiting global (protection anti-abus / déni de service léger).
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),

    PrismaModule,

    // Modules métier.
    TyresModule,
    BikesModule,
    WizardModule,
    ComparatorModule,
    GuideModule,
    RetailersModule,
    ReferenceModule,
    BootstrapModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Applique le throttler à toutes les routes.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
