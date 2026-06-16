# Michelin Vélo — Trouver mon pneu

Landing page premium qui aide les cyclistes à choisir le pneu Michelin adapté à
leur vélo et à leur usage : assistant de recommandation, comparateur, Guide Route
façon Guide Michelin, et localisation des revendeurs.

Le projet est un **monorepo** :

```
michelin_hackaton/
├── frontend/   React 18 + Vite — la SPA (UI premium, thème immersif/éditorial, hero 3D)
├── backend/    NestJS 11 + Prisma 6 + PostgreSQL — l'API REST + le catalogue réel Michelin
└── README.md   ← ce fichier
```

Le frontend ne contient plus aucune donnée métier : **tout est servi par l'API**
(catalogue de pneus issu du vrai catalogue produit Michelin 2026, parcours du Guide,
revendeurs, contenus d'interface).

---

## 1. Prérequis

| Outil | Version conseillée | Vérifier |
|-------|--------------------|----------|
| Node.js | ≥ 20 (testé en 22) | `node -v` |
| npm | ≥ 10 | `npm -v` |
| Docker + Docker Compose | récent (Compose v2/v5) | `docker compose version` |
| Git | — | `git --version` |

> Docker héberge PostgreSQL + pgAdmin. Pas besoin d'installer PostgreSQL en local.

---

## 2. Récupérer le projet

```bash
git clone https://github.com/ThysmaJS/michelin_hackaton.git
cd michelin_hackaton
```

---

## 3. Lancer le projet (ordre recommandé)

L'ordre compte : **base de données → backend → frontend** (le backend a besoin de la
base, le frontend a besoin de l'API).

### 3.1 — Backend + base de données

```bash
cd backend

# a. Variables d'environnement (valeurs de dev fournies)
cp .env.example .env

# b. Démarrer PostgreSQL + pgAdmin (Docker)
npm run db:up

# c. Installer les dépendances
npm install

# d. Créer le schéma de la base
npm run db:migrate

# e. Importer les données (catalogue Excel + contenus)
npm run db:seed

# f. Démarrer l'API en mode watch → http://localhost:3000/api
npm run start:dev
```

> Détails et liste complète des endpoints : [backend/README.md](backend/README.md).

### 3.2 — Frontend

Dans un **second terminal** :

```bash
cd frontend

# a. Variables d'environnement (URL de l'API)
cp .env.example .env

# b. Installer les dépendances
npm install

# c. Démarrer la SPA → http://localhost:5173
npm run dev
```

Ouvrir ensuite **http://localhost:5173**.

---

## 4. Accès & ports

| Service | URL / Port | Identifiants |
|---------|-----------|--------------|
| Frontend (Vite) | http://localhost:5173 | — |
| API (NestJS) | http://localhost:3000/api | — |
| pgAdmin | http://localhost:5050 | `admin@michelin.local` / `admin` |
| PostgreSQL (hôte) | `localhost:5433` | `michelin` / `michelin` · base `michelin_velo` |

> Le port **5433** côté hôte évite tout conflit avec un PostgreSQL déjà installé sur 5432.

### Se connecter à la base depuis pgAdmin

1. Ouvrir http://localhost:5050 et se connecter (`admin@michelin.local` / `admin`).
2. **Add New Server** → onglet *General* : nom libre (ex. `Michelin`).
3. Onglet *Connection* :
   - **Host name/address** : `postgres` *(nom du conteneur — pgAdmin et Postgres sont sur le même réseau Docker)*
   - **Port** : `5432` *(port interne, pas 5433)*
   - **Username** : `michelin` · **Password** : `michelin`
4. Sauvegarder → la base `michelin_velo` apparaît avec ses tables.

---

## 5. Modifier le contenu (pneus, parcours, marques…)

⚠️ **La source de contenu a déménagé dans le backend.** Le frontend n'a plus de
fichier `data.js`.

- Pour modifier le **catalogue de pneus, les marques/modèles de vélo, les options
  du wizard, les revendeurs, les contenus d'UI** → éditer
  [backend/prisma/seed-data/data.mjs](backend/prisma/seed-data/data.mjs).
- Pour modifier les **parcours du Guide** (segments, tracé, KOM…) → éditer
  [backend/prisma/seed-data/guideData.mjs](backend/prisma/seed-data/guideData.mjs).
- Puis **réinjecter en base** :

  ```bash
  cd backend && npm run db:seed
  ```

  *(`db:seed` est idempotent : il purge puis recharge tout.)*

- Le **catalogue Michelin réel** provient de l'Excel
  `backend/data/2W Bicycle Product Catalog v4 - 2026.xlsx` (feuille `ACTIVE PRODUCTS`).
  Les 4 scores radar y sont **calculés** à partir des attributs réels ; les 13 gammes
  vitrines reprennent les scores curatés.

### Logique de recommandation

`frontend/src/lib/recommend.js` (logique pure : moteur de reco, calcul de pression,
code postal → région) a un **jumeau côté backend** dans
`backend/src/wizard/domain/recommendation.ts`. Si vous modifiez l'un,
**reportez la modification sur l'autre** pour garder le comportement cohérent
(l'API `POST /wizard/recommend` s'appuie sur la version backend).

---

## 6. Scripts utiles

### Backend (`cd backend`)

| Script | Rôle |
|--------|------|
| `npm run db:up` / `db:down` | démarrer / arrêter Postgres + pgAdmin |
| `npm run db:migrate` | appliquer / créer les migrations Prisma |
| `npm run db:seed` | (ré)alimenter la base |
| `npm run db:reset` | reset complet + migrations + seed |
| `npm run db:studio` | explorer la base (Prisma Studio) |
| `npm run start:dev` | API en watch |
| `npm test` / `npm run test:e2e` | tests unitaires / e2e |

### Frontend (`cd frontend`)

| Script | Rôle |
|--------|------|
| `npm run dev` | serveur de dev (HMR) |
| `npm run build` | build de production (`dist/`) |
| `npm run preview` | prévisualiser le build |

---

## 7. Stack technique

- **Frontend** : React 18, Vite, Leaflet (cartes). État global via Context + reducer ;
  données chargées une fois depuis `GET /api/bootstrap` (cf. `src/store/DataContext.jsx`).
- **Backend** : NestJS 11, Prisma 6, PostgreSQL 16. Sécurité : Helmet, CORS restreint,
  validation stricte des entrées (class-validator + Joi), rate limiting.
- **Infra** : Docker Compose (PostgreSQL + pgAdmin).

---

## 8. Dépannage

| Problème | Solution |
|----------|----------|
| `API injoignable` au chargement du front | Vérifier que le backend tourne (`npm run start:dev` dans `backend/`). |
| Port 5432 déjà utilisé | Le conteneur publie sur **5433** ; adapter `POSTGRES_PORT`/`DATABASE_URL` dans `backend/.env` si besoin. |
| Le seed échoue | Vérifier que Docker tourne (`npm run db:up`) et que la migration est passée (`npm run db:migrate`). |
| Données pas à jour après édition | Relancer `npm run db:seed`, puis rafraîchir le front. |
