# Michelin Vélo — Frontend (React + Vite)

SPA premium : thème **Immersif / Éditorial**, hero 3D parallax, assistant de
recommandation (6 questions + 1 étape « Mon profil » optionnelle), comparateur,
Guide Route géolocalisé et recherche de revendeurs.

> **Mise en route complète (base + API + front)** : voir le [README racine](../README.md).
> Ici on ne documente que le frontend.

## Démarrer

```bash
cp .env.example .env   # VITE_API_URL → http://localhost:3000/api
npm install
npm run dev            # http://localhost:5173 (nécessite l'API backend démarrée)
npm run build          # build de production dans dist/
npm run preview        # prévisualise le build
```

## Données : tout vient de l'API

Le frontend ne contient **aucune donnée métier**. Au démarrage, `DataProvider`
charge tout le contenu via **`GET /api/bootstrap`** (catalogue, parcours, contenus
d'UI) et l'expose via `useData()`. La recommandation (`POST /wizard/recommend`) et
la recherche de revendeurs (`GET /retailers`) sont des appels API.

Pour **modifier le contenu**, éditer la source côté backend
(`backend/prisma/seed-data/*.mjs`) puis `npm run db:seed` — cf. README racine.

## Architecture

L'état partagé (thème, assistant, comparateur, guide, revendeurs) vit dans un
**Context + reducer** unique : les sections sont interconnectées (la recommandation
pré-remplit le comparateur, dont le pneu de gauche alimente le Guide Route et la page
« Acheter »).

```
src/
  main.jsx                 Point d'entrée : <DataProvider> → <AppProvider> → <App>
  App.jsx                  Compose les sections dans le conteneur thémé
  index.css                Reset + keyframes globales
  store/
    DataContext.jsx        Charge /api/bootstrap une fois ; useData()
    AppContext.jsx         État global (useReducer) + actions (reco/recherche async)
  lib/
    api.js                 Client HTTP vers l'API (fetch, base VITE_API_URL)
    gradients.js           Dégradés de fond du Guide (présentationnel)
    recommend.js           Logique pure : reco, calcPressure, code postal → région
                           (jumeau backend : src/wizard/domain/recommendation.ts)
    theme.js               Tokens de design par thème (getColors/getHero/getFoot)
    scroll.js              Helpers de défilement
  hooks/useHeroTilt.js     Parallaxe 3D du hero
  components/              Header, Hero, Footer, wizard/, comparator/, guide/, buy/
  pages/GuidePage.jsx      Page Guide Route complète
```

## Choix de design

- **Styles inline pilotés par le thème** : l'objet de couleurs est recalculé selon le
  thème (fidélité 1:1 et transitions de thème animées « gratuites »).
- `Hoverable` gère les états `hover` / `focus` impossibles en style inline pur.
- Champs `<input>` contrôlés → autocomplétion réactive.
