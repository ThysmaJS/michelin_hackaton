// Client HTTP léger vers l'API Michelin Vélo.
// L'URL de base provient de VITE_API_URL (cf. .env), avec repli sur le port de dev.

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Exécute une requête JSON et lève une Error lisible en cas d'échec.
 * @param {string} path Chemin relatif (ex. "/bootstrap").
 * @param {RequestInit} [options] Options fetch.
 * @returns {Promise<any>} Le corps JSON de la réponse.
 */
async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new Error(message || `Erreur ${res.status}`);
  }
  return res.json();
}

/** Charge tout le contenu de la landing page (catalogue, guide, référence…). */
export const getBootstrap = () => request('/bootstrap');

/**
 * Demande la recommandation de pneu pour un profil d'usage.
 * @param {object} payload { route, freq, riderWeight?, bikeWeight?, rimWidth?, ftp? }
 */
export const recommend = (payload) =>
  request('/wizard/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

/**
 * Recherche les revendeurs proches d'une localisation.
 * @param {string} postal Code postal ou ville.
 * @param {string} [tyre] Slug du pneu recherché (contexte).
 */
export const searchRetailers = (postal, tyre) => {
  const params = new URLSearchParams({ postal });
  if (tyre) params.set('tyre', tyre);
  return request(`/retailers?${params.toString()}`);
};
