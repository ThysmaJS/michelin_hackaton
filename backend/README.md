# Michelin Vélo — API (backend)

API REST **NestJS 11 + PostgreSQL (Prisma 6)** qui alimente la landing page « Trouver mon pneu ».
Toutes les données auparavant codées en dur dans le frontend (`data.js`, `guideData.js`,
`recommend.js`, `scoring.js`) sont désormais servies par cette API, à partir d'une base
seedée avec le **catalogue produit réel Michelin 2026** (Excel) et les contenus du frontend.

## Stack

| Couche            | Choix |
|-------------------|-------|
| Framework         | NestJS 11 |
| Base de données   | PostgreSQL 16 (Docker) |
| ORM               | Prisma 6 |
| Admin BDD         | pgAdmin 4 (Docker) |
| Validation        | class-validator / class-transformer + Joi (env) |
| Sécurité          | Helmet, CORS restreint, rate limiting (`@nestjs/throttler`) |
| Tests             | Jest (unitaires + e2e) |

> ⚠️ Prisma est **épinglé en 6.x** : la 7.x supprime `url` dans `datasource` (driver adapters obligatoires).

## Démarrage rapide

```bash
# 1. Lancer PostgreSQL + pgAdmin
npm run db:up

# 2. Installer les dépendances
npm install

# 3. Créer le schéma de base
npm run db:migrate

# 4. Importer le catalogue + les données frontend
npm run db:seed

# 5. Démarrer l'API (http://localhost:3000/api)
npm run start:dev
```

Copier `.env.example` vers `.env` si nécessaire (valeurs de dev par défaut fournies).

> **Port 5432 déjà pris ?** Le conteneur est publié sur **5433** côté hôte (cf. `.env`) pour
> cohabiter avec un PostgreSQL local. Adapter `POSTGRES_PORT` et `DATABASE_URL` au besoin.

### pgAdmin

http://localhost:5050 — login `admin@michelin.local` / `admin`.
Connexion serveur : hôte `postgres`, port `5432`, user/mdp `michelin`, base `michelin_velo`.

## Scripts

| Script | Rôle |
|--------|------|
| `npm run start:dev`   | API en watch mode |
| `npm run db:up` / `db:down` | conteneurs Postgres + pgAdmin |
| `npm run db:migrate`  | applique/crée les migrations Prisma |
| `npm run db:seed`     | (ré)alimente la base (idempotent) |
| `npm run db:reset`    | reset complet + migrations + seed |
| `npm run db:studio`   | Prisma Studio |
| `npm test` / `npm run test:e2e` | tests unitaires / e2e |
| `npm run lint`        | ESLint (+ fix) |

## Architecture

```
prisma/
  schema.prisma         Modèle de données
  seed.ts               Seed : Excel (Michelin) + frontend (concurrents, vélos, guide…)
src/
  prisma/               PrismaService global
  config/               Validation des variables d'environnement (Joi)
  common/filters/       Filtre d'exceptions global
  tyres/                Catalogue (gammes + variantes) — domain/scoring.ts (calcul des scores)
  bikes/                Marques & modèles (autocomplétion)
  wizard/               Recommandation — domain/recommendation.ts (logique pure)
  comparator/           Comparaison de 2 pneus
  guide/                Régions & parcours du Guide
  retailers/            Revendeurs par localisation — domain/geo.ts + geo.service.ts
  reference/            Contenus UI (étapes, métriques, hero, footer)
```

La **logique métier pure** (scoring, recommandation, géo) est isolée dans des fichiers
`domain/` sans dépendance framework, et couverte par des tests unitaires.

### Sources de données & scores

- **Catalogue Michelin** : importé de l'Excel `data/` (441 SKU → ~96 gammes + variantes).
  Les 4 scores radar sont **calculés** par `deriveScores()` à partir des attributs réels
  (usage, gomme, poids, segment, renfort).
- **Gammes vitrines** (présentes dans le frontend) : scores curatés du frontend + statut actif.
- **Concurrents, vélos, parcours, revendeurs, contenus UI** : seedés depuis le frontend.

## Endpoints principaux (préfixe `/api`)

| Méthode & route | Description |
|-----------------|-------------|
| `GET /api` | Health check (état + base) |
| `GET /tyres?terrain=&brand=&search=&includeDiscontinued=` | Liste des gammes |
| `GET /tyres/competitors` | Gammes concurrentes |
| `GET /tyres/:slug` | Détail d'une gamme (+ variantes) |
| `GET /bikes/brands?search=` | Marques (autocomplétion) |
| `GET /bikes/brands/:slug/models?search=` | Modèles d'une marque |
| `GET /bikes/models/generic` | Modèles génériques |
| `POST /wizard/recommend` | Pneu recommandé `{ route, freq, … }` |
| `GET /comparator?left=&right=` | Comparaison de 2 pneus |
| `GET /guide/regions` | Régions |
| `GET /guide/regions/:key/routes` | Parcours d'une région |
| `GET /guide/routes?tyre=` | Parcours recommandant un pneu |
| `GET /guide/routes/:title` | Détail d'un parcours |
| `GET /retailers?postal=&tyre=` | Revendeurs proches |
| `GET /reference/wizard \| metrics \| hero \| footer` | Contenus UI |
