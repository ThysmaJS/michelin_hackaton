# Michelin Vélo — Trouver mon pneu

Portage React (Vite) de la maquette HTML standalone `Michelin Velo.html`.
Reproduit à l'identique : thème **Immersif / Éditorial**, hero 3D parallax,
assistant en 6 étapes, comparateur, Guide Route géolocalisé et recherche de
revendeurs.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # prévisualise le build
```

## Architecture

L'état partagé (thème, assistant, comparateur, guide, revendeurs) vit dans un
**Context + reducer** unique, car les sections sont interconnectées : la
recommandation de l'assistant pré-remplit le comparateur, dont le pneu de
gauche alimente à son tour le Guide Route et la page « Acheter ».

```
src/
  main.jsx                 Point d'entrée + <AppProvider>
  App.jsx                  Compose les sections dans le conteneur thémé
  index.css                Reset + keyframes globales
  store/
    AppContext.jsx         État global (useReducer) + actions
  lib/
    data.js                Catalogue : pneus, marques, régions, parcours…
    theme.js               Tokens de design par thème (getColors/getHero/getFoot)
    recommend.js           Moteur de reco + code postal → région
    scroll.js              Helpers de défilement
  hooks/
    useHeroTilt.js         Parallaxe 3D du hero (mousemove)
  components/
    Hoverable.jsx          Élément générique gérant style-hover / style-focus
    Header.jsx  Hero.jsx  Footer.jsx
    wizard/                Assistant : intro, étapes, résultats, résumé
      steps/               Une étape par question
    comparator/            Cartes face à face + sélecteurs de pneus
    guide/                 Guide Route + carte de parcours
    buy/                   Recherche revendeur + carte
```

## Choix de portage

- **Styles inline pilotés par le thème** : la maquette d'origine génère tout son
  style à partir d'un objet de couleurs recalculé selon le thème. On conserve
  cette approche (fidélité 1:1 et transitions de thème animées « gratuites »).
- `Hoverable` réimplémente les attributs `style-hover` / `style-focus` du
  format d'origine, impossibles à exprimer en style inline pur.
- Les `<input>` deviennent des champs contrôlés React (`onChange` par frappe),
  ce qui rend l'autocomplétion plus réactive que le `onchange` HTML d'origine.
