import { createContext, useContext, useEffect, useState } from 'react';
import { getBootstrap } from '../lib/api.js';

/**
 * Fournit les données de contenu (catalogue, guide, référence) chargées une fois
 * depuis l'API au démarrage. Les enfants ne sont montés qu'une fois les données
 * disponibles : `useData()` renvoie donc toujours un objet complet.
 */
const DataContext = createContext(null);

/** Écran de chargement pendant la récupération du bootstrap. */
function LoadingScreen() {
  return (
    <div style={screenStyle}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '5px solid rgba(255,255,255,.15)', borderTopColor: '#FCE500', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: 22, fontSize: 14, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
        Chargement du catalogue Michelin…
      </p>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

/** Écran d'erreur si l'API est injoignable. */
function ErrorScreen({ message, onRetry }) {
  return (
    <div style={screenStyle}>
      <div style={{ fontSize: 40 }}>⚠️</div>
      <h1 style={{ margin: '16px 0 6px', fontSize: 22, fontWeight: 900 }}>API injoignable</h1>
      <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,.6)', maxWidth: 420, textAlign: 'center' }}>{message}</p>
      <p style={{ margin: '8px 0 22px', fontSize: 13, color: 'rgba(255,255,255,.45)' }}>
        Vérifiez que le backend tourne (<code>npm run start:dev</code> dans /backend).
      </p>
      <button
        onClick={onRetry}
        style={{ background: '#FCE500', color: '#00205B', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 14, padding: '12px 26px', borderRadius: 999, cursor: 'pointer' }}
      >
        Réessayer
      </button>
    </div>
  );
}

const screenStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(160deg,#00060f,#001540 60%,#002070)',
  color: '#fff',
  fontFamily: "'Noto Sans',system-ui,sans-serif",
  padding: 24,
};

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setData(null);
    getBootstrap()
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  if (error) return <ErrorScreen message={error.message} onRetry={() => setAttempt((a) => a + 1)} />;
  if (!data) return <LoadingScreen />;
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

/** Accède aux données de contenu chargées depuis l'API. */
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData doit être utilisé dans un DataProvider');
  return ctx;
}
