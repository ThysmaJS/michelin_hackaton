import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * Tests end-to-end de l'API : exercent la vraie pile HTTP + base PostgreSQL.
 * Prérequis : la base de dev doit tourner et être seedée (`docker compose up` + `npm run db:seed`).
 */
describe('API Michelin Vélo (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Reproduit la configuration de main.ts (préfixe + validation stricte).
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api — health check OK', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.database).toBe('up');
      });
  });

  it('GET /api/tyres — renvoie une liste non vide de pneus', () => {
    return request(app.getHttpServer())
      .get('/api/tyres?terrain=route')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('slug');
        expect(res.body[0]).toHaveProperty('grip');
      });
  });

  it('GET /api/tyres/:slug inconnu — 404', () => {
    return request(app.getHttpServer())
      .get('/api/tyres/pneu-inexistant')
      .expect(404);
  });

  it('POST /api/wizard/recommend — recommande un pneu cohérent', () => {
    return request(app.getHttpServer())
      .post('/api/wizard/recommend')
      .send({ route: 'Route lisse', freq: 'Compétition' })
      .expect(201)
      .expect((res) => {
        expect(res.body.recommendedSlug).toBe('power-cup');
        expect(res.body.tyre.name).toBe('Power Cup');
      });
  });

  it('POST /api/wizard/recommend — entrée invalide rejetée (400)', () => {
    return request(app.getHttpServer())
      .post('/api/wizard/recommend')
      .send({ route: 'Route lisse' }) // freq manquant
      .expect(400);
  });
});
