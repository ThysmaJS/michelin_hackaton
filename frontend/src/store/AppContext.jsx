import { createContext, useContext, useMemo, useReducer, useCallback } from 'react';
import { recommend } from '../lib/recommend.js';

const initialState = {
  theme: 'editorial',
  page: 'home',
  started: false,
  step: 0, // 0..5 questions, 6 = results
  marque: '', marqueQuery: '', marqueFocus: false,
  modele: '', modeleQuery: '', modeleFocus: false,
  currentTyre: '',
  freq: '', route: '', km: 200,
  // Advanced profiling (optional step 6)
  riderWeight: 75,  // kg, slider 50-130
  bikeWeight: 8,    // kg, slider 4-15
  rimWidth: 19,     // mm internal width: 15 | 17 | 19 | 21 | 25
  ftp: null,        // W (number) or null = not known
  recommended: null,
  compareLeft: 'power-road',
  compareRight: 'continental-gp5000',
  postal: '', searched: false,
  guideRegion: '',
  guideSelectedTitle: null,
};

function canAdvance(state) {
  switch (state.step) {
    case 0: return !!state.marque;
    case 1: return !!state.modele;
    case 2: return !!state.currentTyre;
    case 3: return !!state.freq;
    case 4: return !!state.route;
    case 5: return true; // km is always valid
    case 6: return true; // advanced step is optional
    default: return false;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'PATCH':
      return { ...state, ...action.patch };

    case 'START_WIZARD':
      return { ...state, started: true, step: 0 };

    case 'RESET_WIZARD':
      return {
        ...state, started: false, step: 0,
        marque: '', marqueQuery: '', modele: '', modeleQuery: '',
        currentTyre: '', freq: '', route: '', km: 200,
        riderWeight: 75, bikeWeight: 8, rimWidth: 19, ftp: null,
        recommended: null,
      };

    case 'NEXT_STEP': {
      if (!canAdvance(state)) return state;
      if (state.step < 6) return { ...state, step: state.step + 1 };
      // step 6 (advanced, optional) → compute recommendation → results at step 7
      const rec = recommend(state);
      return { ...state, recommended: rec, compareLeft: rec, step: 7 };
    }

    case 'PREV_STEP': {
      if (state.step === 0) return { ...state, started: false };
      if (state.step === 7) return { ...state, step: 6 };
      return { ...state, step: state.step - 1 };
    }

    case 'JUMP_TO':
      return state.started ? { ...state, step: action.index } : state;

    case 'SEARCH':
      return state.postal.trim() ? { ...state, searched: true } : state;

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'immersive' ? 'editorial' : 'immersive' };

    case 'NAVIGATE':
      return { ...state, page: action.page, guideSelectedTitle: action.selectedTitle ?? null };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const patch = useCallback((p) => dispatch({ type: 'PATCH', patch: p }), []);

  const actions = useMemo(() => ({
    patch,
    setTheme: (theme) => patch({ theme }),
    setImmersive: () => patch({ theme: 'immersive' }),
    setEditorial: () => patch({ theme: 'editorial' }),
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),

    startWizard: () => dispatch({ type: 'START_WIZARD' }),
    resetWizard: () => dispatch({ type: 'RESET_WIZARD' }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    jumpTo: (index) => dispatch({ type: 'JUMP_TO', index }),

    // marque autocomplete
    onMarqueChange: (e) => patch({ marqueQuery: e.target.value, marqueFocus: true, marque: '' }),
    onMarqueFocus: () => patch({ marqueFocus: true }),
    pickMarque: (name) => patch({ marque: name, marqueQuery: name, marqueFocus: false, modele: '', modeleQuery: '' }),

    // modele autocomplete
    onModeleChange: (e) => patch({ modeleQuery: e.target.value, modeleFocus: true, modele: '' }),
    onModeleFocus: () => patch({ modeleFocus: true }),
    pickModele: (name) => patch({ modele: name, modeleQuery: name, modeleFocus: false }),

    // single-choice steps
    setCurrent: (name) => patch({ currentTyre: name }),
    setFreq: (v) => patch({ freq: v }),
    setRoute: (v) => patch({ route: v }),
    onKmChange: (e) => patch({ km: parseInt(e.target.value, 10) }),

    navigate: (page) => dispatch({ type: 'NAVIGATE', page }),
    navigateToRoute: (title) => dispatch({ type: 'NAVIGATE', page: 'guide', selectedTitle: title }),

    // comparator
    onCompareLeftChange: (e) => patch({ compareLeft: e.target.value }),
    onCompareChange: (e) => patch({ compareRight: e.target.value }),

    // guide + buy
    onGuideRegionChange: (e) => patch({ guideRegion: e.target.value }),
    onPostalChange: (e) => patch({ postal: e.target.value, searched: false }),
    doSearch: () => dispatch({ type: 'SEARCH' }),
  }), [patch]);

  const value = useMemo(() => ({ state, actions, canAdvance: canAdvance(state) }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
