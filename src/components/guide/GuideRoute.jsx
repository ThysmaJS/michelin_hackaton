import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import { tyres, competitors, regions, regionRoutes, gRoute, gGravel } from '../../lib/data.js';
import { postalToRegion } from '../../lib/recommend.js';
import Hoverable from '../Hoverable.jsx';
import RouteCard from './RouteCard.jsx';

const ALL = { ...tyres, ...competitors };

export default function GuideRoute() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const leftT = ALL[state.compareLeft] || tyres['power-road'];
  const terrain = leftT.terrain || 'route';

  const detected = postalToRegion(state.postal);
  const regionKey = state.guideRegion || detected || 'aura';
  const regionObj = regions.find((r) => r.key === regionKey) || regions[0];
  const regionSource = state.guideRegion ? 'manuel' : detected ? "d'après votre localisation" : 'sélection par défaut';

  // terrain-aware ordering, then assign placeholder gradients per surface
  const rawRoutes = (regionRoutes[regionKey] || regionRoutes.aura).slice();
  rawRoutes.sort((a, b) => (a.t === terrain ? 0 : 1) - (b.t === terrain ? 0 : 1));
  let ri = 0;
  let gi = 0;
  const guideRoutes = rawRoutes.map((r) => ({
    title: r.title, region: r.loc, distance: r.distance, surface: r.surface, stars: r.stars, blurb: r.blurb,
    img: r.t === 'gravel' ? gGravel[gi++ % gGravel.length] : gRoute[ri++ % gRoute.length],
  }));

  const guideIntro = `Sélection éditoriale de parcours d'exception, à la manière du Guide Michelin — autour de ${regionObj.label}, choisis pour révéler tout le potentiel de votre ${leftT.name}.`;

  return (
    <section id="guide" style={{ position: 'relative', padding: '96px 32px', background: c.sectionA, transition: 'background .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 12px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 24, height: 1.5, background: '#FCE500' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.3em', color: '#FCE500', textTransform: 'uppercase' }}>Guide Route</span>
            <span style={{ width: 24, height: 1.5, background: '#FCE500' }} />
          </div>
          <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(34px,4vw,52px)', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1.02, color: c.ink }}>Roulez les plus beaux parcours</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: c.inkMuted }}>{guideIntro}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.04em', color: c.inkFaint }}>📍 Parcours autour de</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: c.panel, border: `1.5px solid ${c.borderStrong}`, borderRadius: 999, padding: '8px 8px 8px 18px' }}>
            <select value={regionKey} onChange={actions.onGuideRegionChange} style={{ fontFamily: 'inherit', fontSize: 15, fontWeight: 800, color: c.ink, background: 'transparent', border: 0, outline: 'none', cursor: 'pointer', paddingRight: 4 }}>
              {regions.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: c.inkFaint, background: c.chip, border: `1px solid ${c.border}`, padding: '5px 11px', borderRadius: 999 }}>{regionSource}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22, marginTop: 36 }}>
          {guideRoutes.map((r) => <RouteCard key={r.title} c={c} route={r} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <Hoverable
            as="button"
            style={{ background: '#FCE500', color: '#00205B', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 16, padding: '17px 34px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 10px 28px rgba(252,229,0,.28)', transition: 'transform .2s' }}
            hoverStyle={{ transform: 'translateY(-3px)' }}
          >
            Découvrir le Guide Route complet →
          </Hoverable>
          <p style={{ margin: '14px 0 0', fontSize: 12, color: c.inkFaint }}>Parcours sélectionnés pour votre {leftT.name} · page dédiée à venir</p>
        </div>
      </div>
    </section>
  );
}
