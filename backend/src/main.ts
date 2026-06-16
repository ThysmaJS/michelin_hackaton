import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Point d'entrée de l'API Michelin Vélo.
 *
 * Configure les protections transverses (en-têtes HTTP, CORS, validation stricte
 * des entrées, format d'erreur unifié) avant d'écouter les requêtes.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // En-têtes de sécurité HTTP (XSS, clickjacking, sniffing…).
  app.use(helmet());

  // CORS restreint à l'origine du frontend.
  app.enableCors({
    origin: config.get<string>('FRONTEND_ORIGIN'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Préfixe commun pour toutes les routes de l'API.
  app.setGlobalPrefix('api');

  // Validation + transformation automatiques des DTO ; rejette tout champ inconnu.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Format d'erreur homogène pour toute l'application.
  app.useGlobalFilters(new AllExceptionsFilter());

  // Fermeture propre des connexions (Prisma) sur SIGINT/SIGTERM.
  app.enableShutdownHooks();

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);
  Logger.log(`API démarrée sur http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();
