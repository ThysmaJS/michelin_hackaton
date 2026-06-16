import { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../store/AppContext.jsx';
import { useData } from '../store/DataContext.jsx';
import { getColors } from '../lib/theme.js';
import { gRoute, gGravel } from '../lib/gradients.js';
import { optimalTyreForRoute } from '../lib/recommend.js';
import Hoverable from '../components/Hoverable.jsx';
import RouteMap from '../components/guide/RouteMap.jsx';

// All colors from the official Michelin digital charter
const SEGMENT_DOT = {
  depart:  { bg: '#84BD00', border: '#84BD00', label: 'Départ' },    // Vert Généreux
  sommet:  { bg: '#582C83', border: '#582C83', label: 'Sommet' },    // Violet Engagé
  arrivee: { bg: '#00205B', border: '#00205B', label: 'Arrivée' },   // Bleu Foncé Michelin
  cle:     { bg: '#FCE500', border: '#c9b800', label: 'Point clé' }, // Jaune Michelin
  descente:{ bg: '#53565A', border: '#53565A', label: 'Descente' },  // Gris Responsable
};

function StarRow({ stars, size = 18 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 3, color: '#FCE500', lineHeight: 1 }}>{stars}</span>
  );
}

function InfoChip({ label, c }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 700, color: c.ink, background: c.chip, border: `1px solid ${c.border}`, borderRadius: 999, padding: '5px 12px', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function SegmentTimeline({ segments, c }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {segments.map((seg, i) => {
        const dot = SEGMENT_DOT[seg.type] || SEGMENT_DOT.cle;
        const isLast = i === segments.length - 1;
        return (
          <div key={seg.name} style={{ display: 'flex', gap: 14 }}>
            {/* Timeline column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 18 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: dot.bg, border: `2px solid ${dot.border}`, flexShrink: 0, marginTop: 2 }} />
              {!isLast && <div style={{ flex: 1, width: 2, background: c.border, margin: '3px 0' }} />}
            </div>
            {/* Content */}
            <div style={{ paddingBottom: isLast ? 0 : 20, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: c.ink }}>{seg.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.inkFaint, background: c.chip, padding: '2px 8px', borderRadius: 999 }}>km {seg.km}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: dot.border === '#c9b800' ? '#9a6a00' : dot.border, background: dot.bg === '#FCE500' ? 'rgba(252,229,0,.15)' : `${dot.bg}22`, padding: '2px 8px', borderRadius: 999 }}>{dot.label}</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.6, color: c.inkMuted }}>{seg.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RouteDetail({ route, c, onScrollToMap, tyres, routeDetails }) {
  const details = routeDetails[route.title];
  const tyreKey = details?.tyreKey || route.tyreKey;
  const tyre = tyres[tyreKey];
  const hasWaypoints = details?.waypoints?.length > 0;

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${c.border}`, animation: 'fadeIn .3s ease both' }}>
      {/* Gradient header */}
      <div style={{ background: route.img, minHeight: 220, padding: '32px 32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,8,30,.15) 0%,rgba(0,8,30,.75) 100%)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ marginBottom: 10 }}>
            <StarRow stars={route.stars} size={22} />
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 900, letterSpacing: '-.02em', color: '#fff', lineHeight: 1.1 }}>{route.title}</h2>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>{route.loc} · {route.distance}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 32px', background: c.panel }}>
        {/* Scroll-to-map button — top of body */}
        {hasWaypoints && onScrollToMap && (
          <Hoverable
            as="button"
            onClick={onScrollToMap}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22,
              padding: '9px 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
              border: `1.5px solid ${c.border}`, borderRadius: 10,
              background: 'transparent', color: c.inkMuted, cursor: 'pointer', transition: 'all .2s',
            }}
            hoverStyle={{ border: '1.5px solid #27509b', color: '#27509b', background: 'rgba(39,80,155,.06)' }}
          >
            <span style={{ fontSize: 15 }}>🗺</span>
            Voir le tracé sur la carte
            <span style={{ opacity: 0.5 }}>↓</span>
          </Hoverable>
        )}

        {/* Info chips */}
        {details && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <InfoChip label={`↑ ${details.elevation}`} c={c} />
            <InfoChip label={details.difficulty} c={c} />
            <InfoChip label={`Saison : ${details.season}`} c={c} />
            <InfoChip label={route.surface} c={c} />
          </div>
        )}

        {/* Tire recommendation */}
        {tyre && (
          <div style={{ background: c.sectionB || c.panel2, border: `1.5px solid ${c.borderStrong}`, borderLeft: '4px solid #FCE500', borderRadius: 14, padding: '20px 22px', marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.3em', color: '#FCE500', textTransform: 'uppercase', marginBottom: 8 }}>Pneu recommandé</div>
            {(tyre.races?.length > 0 || tyre.proTeams?.length > 0) && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {tyre.races?.map((r) => (
                  <span key={r} style={{ fontSize: 11, fontWeight: 800, color: '#00205B', background: '#FCE500', border: '1px solid rgba(0,0,0,.08)', borderRadius: 999, padding: '3px 9px', whiteSpace: 'nowrap' }}>🏆 {r}</span>
                ))}
                {tyre.proTeams?.map((team) => (
                  <span key={team} style={{ fontSize: 11, fontWeight: 800, color: '#27509B', background: 'rgba(39,80,155,.08)', border: '1px solid rgba(39,80,155,.25)', borderRadius: 999, padding: '3px 9px', whiteSpace: 'nowrap' }}>◉ {team}</span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: c.ink, letterSpacing: '-.01em' }}>{tyre.name}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.inkFaint, marginBottom: 10 }}>{tyre.tag || tyre.usage}</div>
                {details?.tyreReason && (
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: c.inkMuted }}>{details.tyreReason}</p>
                )}
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.inkFaint }}>À partir de</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: c.ink }}>{tyre.price}</div>
                {tyre.tubeless && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#84BD00', marginTop: 4 }}>TUBELESS</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* KOM storytelling */}
        {details?.kom && (
          <div style={{ background: c.panel2, border: `1.5px solid ${c.borderStrong}`, borderLeft: '4px solid #582C83', borderRadius: 14, padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.3em', color: '#582C83', textTransform: 'uppercase', marginBottom: 10 }}>Record · Segment principal</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.02em', color: c.ink, lineHeight: 1 }}>{details.kom.time}</div>
                <div style={{ fontSize: 12, color: c.inkFaint, marginTop: 3, fontWeight: 600 }}>{details.kom.holder}</div>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 12.5, color: c.inkMuted, lineHeight: 1.6 }}>
                  <span style={{ fontWeight: 700, color: c.ink }}>{details.kom.tyre}</span> · {details.kom.context} · {details.kom.year}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Segments */}
        {details?.segments?.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.3em', color: c.inkFaint, textTransform: 'uppercase', marginBottom: 16 }}>Segments</div>
            <SegmentTimeline segments={details.segments} c={c} />
          </>
        )}

        {/* Pro Tips */}
        {tyre?.proTips?.length > 0 && (
          <div style={{ marginTop: 20, padding: '18px 20px', background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.3em', color: '#27509B', textTransform: 'uppercase', marginBottom: 4 }}>Pro Tips · {tyre.name}</div>
            <div style={{ fontSize: 11, color: c.inkFaint, marginBottom: 12 }}>Ce que font les mécanos des équipes WorldTour</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tyre.proTips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'rgba(39,80,155,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#27509B' }}>{i + 1}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: c.inkMuted }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blurb */}
        <div style={{ marginTop: 20, padding: '16px 18px', background: c.chip, border: `1px solid ${c.border}`, borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: c.inkMuted, fontStyle: 'italic' }}>{route.blurb}</p>
        </div>
      </div>
    </div>
  );
}

function RouteListCard({ route, isActive, onClick, c, tyres, routeDetails }) {
  const tyreKey = routeDetails[route.title]?.tyreKey || route.tyreKey;
  const tyre = tyres[tyreKey];
  const terrainLabel = route.surface?.split(' · ')[0] || (route.t === 'gravel' ? 'Gravel' : 'Route');

  return (
    <Hoverable
      onClick={onClick}
      style={{
        display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px',
        border: `1.5px solid ${isActive ? '#FCE500' : c.border}`,
        borderRadius: 14,
        background: isActive ? 'rgba(252,229,0,.08)' : c.panel,
        cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
      }}
      hoverStyle={{ border: `1.5px solid ${isActive ? '#FCE500' : c.borderStrong}` }}
    >
      {/* Left: gradient thumb */}
      <div style={{ width: 48, height: 48, borderRadius: 10, background: route.img, flexShrink: 0, overflow: 'hidden', border: `1px solid ${c.border}` }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
          <StarRow stars={route.stars} size={12} />
          <span style={{ fontSize: 10, fontWeight: 700, color: route.t === 'gravel' ? '#84BD00' : '#27509b', background: route.t === 'gravel' ? 'rgba(132,189,0,.15)' : 'rgba(39,80,155,.12)', padding: '2px 7px', borderRadius: 999, flexShrink: 0 }}>{terrainLabel}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: c.ink, lineHeight: 1.2, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{route.title}</div>
        <div style={{ fontSize: 12, color: c.inkFaint }}>{route.loc} · {route.distance}</div>
        {tyre && (
          <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#00205B', background: '#FCE500', padding: '2px 8px', borderRadius: 999 }}>
            🏅 {tyre.name}
          </div>
        )}
      </div>
    </Hoverable>
  );
}

export default function GuidePage() {
  const { state } = useApp();
  const { tyres, regions, regionRoutes, routeDetails } = useData();
  const c = getColors(state.theme);

  // Aplatit tous les parcours et leur attribue un dégradé de fond (placeholder paysage).
  const ALL_ROUTES = useMemo(() => {
    const result = [];
    let ri = 0; let gi = 0;
    regions.forEach(({ key }) => {
      (regionRoutes[key] || []).forEach((r) => {
        const tyreKey = routeDetails[r.title]?.tyreKey || optimalTyreForRoute(r);
        const img = r.t === 'gravel' ? gGravel[gi++ % gGravel.length] : gRoute[ri++ % gRoute.length];
        result.push({ ...r, regionKey: key, tyreKey, img });
      });
    });
    return result;
  }, [regions, regionRoutes, routeDetails]);

  const [filterRegion, setFilterRegion] = useState('all');
  const [filterTerrain, setFilterTerrain] = useState('all');
  // Lazy initializer: honour navigation intent, fallback to first route
  const [selectedRoute, setSelectedRoute] = useState(() =>
    (state.guideSelectedTitle
      ? ALL_ROUTES.find((r) => r.title === state.guideSelectedTitle)
      : null) || ALL_ROUTES[0] || null
  );

  const mapSectionRef = useRef(null);
  const scrollToMap = () => mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  const filtered = useMemo(() => ALL_ROUTES.filter((r) => {
    if (filterRegion !== 'all' && r.regionKey !== filterRegion) return false;
    if (filterTerrain !== 'all' && r.t !== filterTerrain) return false;
    return true;
  }), [filterRegion, filterTerrain, ALL_ROUTES]);

  // Keep selection valid when filters change; preserve if still in list
  useEffect(() => {
    setSelectedRoute((prev) => {
      if (prev && filtered.find((r) => r.title === prev.title)) return prev;
      return filtered[0] || null;
    });
  }, [filtered]);

  const im = state.theme === 'immersive';

  const filterBarBg = im ? 'rgba(0,9,32,.95)' : 'rgba(255,255,255,.95)';
  const heroBg = im
    ? 'linear-gradient(160deg,#00060f 0%,#001540 60%,#002070 100%)'
    : 'linear-gradient(160deg,#00205B 0%,#1a3d80 60%,#27509b 100%)';

  return (
    <div>
      {/* Page hero */}
      <div style={{ background: heroBg, padding: '72px 32px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <span style={{ width: 32, height: 1.5, background: '#FCE500' }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.4em', color: '#FCE500', textTransform: 'uppercase' }}>Le Guide</span>
          <span style={{ width: 32, height: 1.5, background: '#FCE500' }} />
        </div>
        <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(38px,6vw,68px)', fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1, color: '#fff' }}>
          Guide Michelin<br />
          <span style={{ color: '#FCE500' }}>des Routes Cyclistes</span>
        </h1>
        <p style={{ margin: '0 auto 40px', maxWidth: 560, fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,.72)' }}>
          Nos experts sélectionnent les plus beaux parcours d'exception — et, pour chacun, le pneu Michelin qui en révèle tout le potentiel.
        </p>

        {/* Star legend */}
        <div style={{ display: 'inline-flex', gap: 24, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.16)', borderRadius: 14, padding: '16px 28px' }}>
          {[['★★★', 'Parcours d\'exception'], ['★★', 'Parcours remarquable'], ['★', 'Parcours recommandé']].map(([stars, label]) => (
            <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: '#FCE500', letterSpacing: 2 }}>{stars}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{ position: 'sticky', top: 72, zIndex: 50, background: filterBarBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${c.border}`, padding: '14px 32px', transition: 'background .5s ease' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Region */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: c.inkFaint, letterSpacing: '.05em' }}>Région</span>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: c.ink, background: c.chip, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: '7px 12px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">Toutes les régions</option>
              {regions.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>

          {/* Terrain tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', 'Tous'], ['route', '🛣 Route'], ['gravel', '🏞 Gravel']].map(([val, label]) => (
              <Hoverable
                key={val}
                as="button"
                onClick={() => setFilterTerrain(val)}
                style={{
                  fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
                  padding: '7px 14px', borderRadius: 999, border: 0, cursor: 'pointer',
                  background: filterTerrain === val ? '#FCE500' : c.chip,
                  color: filterTerrain === val ? '#00205B' : c.inkMuted,
                  transition: 'background .15s, color .15s',
                }}
                hoverStyle={filterTerrain !== val ? { background: c.panel2 || c.chip, color: c.ink } : {}}
              >
                {label}
              </Hoverable>
            ))}
          </div>

          {/* Count */}
          <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: c.inkFaint }}>
            {filtered.length} parcours
          </span>
        </div>
      </div>

      {/* Main content: list + detail */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 40px', display: 'grid', gridTemplateColumns: '380px 1fr', gap: 28, alignItems: 'start' }}>

        {/* Left: scrollable route list */}
        <div style={{
          position: 'sticky', top: 140,
          display: 'flex', flexDirection: 'column', gap: 10,
          height: 'calc(100vh - 156px)',
          overflowY: 'auto',
          paddingRight: 6,
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: c.inkMuted, fontSize: 14 }}>
              Aucun parcours pour ces filtres.
            </div>
          ) : (
            filtered.map((route) => (
              <RouteListCard
                key={route.title}
                route={route}
                isActive={selectedRoute?.title === route.title}
                onClick={() => setSelectedRoute(route)}
                c={c}
                tyres={tyres}
                routeDetails={routeDetails}
              />
            ))
          )}
        </div>

        {/* Right: sticky detail */}
        <div style={{ position: 'sticky', top: 140 }}>
          {selectedRoute ? (
            <RouteDetail
              key={selectedRoute.title}
              route={selectedRoute}
              c={c}
              tyres={tyres}
              routeDetails={routeDetails}
              onScrollToMap={routeDetails[selectedRoute.title]?.waypoints ? scrollToMap : null}
            />
          ) : (
            <div style={{ borderRadius: 20, border: `1px dashed ${c.border}`, padding: '80px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>★</div>
              <p style={{ margin: 0, fontSize: 15, color: c.inkMuted }}>Sélectionnez un parcours pour afficher ses détails et le pneu recommandé.</p>
            </div>
          )}
        </div>
      </div>

      {/* Route map section — full width, always visible when a route with waypoints is selected */}
      {selectedRoute && routeDetails[selectedRoute.title]?.waypoints && (
        <div ref={mapSectionRef} style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 80px' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${c.border}` }}>
            {/* Map header */}
            <div style={{ padding: '20px 28px', background: c.panel, borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 20 }}>🗺</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: c.ink }}>Tracé · {selectedRoute.title}</div>
                <div style={{ fontSize: 12, color: c.inkFaint, fontWeight: 600, marginTop: 2 }}>{selectedRoute.loc} · {selectedRoute.distance}</div>
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['Départ', '#84BD00'], ['Point clé', '#FCE500'], ['Sommet', '#582C83'], ['Arrivée', '#00205B']].map(([label, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: c.inkFaint }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, border: '2px solid #fff', boxShadow: '0 0 0 1px rgba(0,0,0,.18)', flexShrink: 0 }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <RouteMap
              waypoints={routeDetails[selectedRoute.title].waypoints}
              segments={routeDetails[selectedRoute.title].segments}
              height={420}
            />
          </div>
        </div>
      )}
    </div>
  );
}
