import { useState } from 'react';
import { useApp } from '../../store/AppContext.jsx';
import { useData } from '../../store/DataContext.jsx';
import { getColors } from '../../lib/theme.js';
import useBreakpoint from '../../hooks/useBreakpoint.js';
import Hoverable from '../Hoverable.jsx';
import RetailerList from './RetailerList.jsx';
import Map from './Map.jsx';

export default function Buy() {
  const { state, actions } = useApp();
  const { tyres, competitors } = useData();
  const c = getColors(state.theme);
  const [activeRetailer, setActiveRetailer] = useState(null);

  const { isMobile } = useBreakpoint();
  const ALL = { ...tyres, ...competitors };
  const leftT = ALL[state.compareLeft] || tyres['power-road'];
  // Revendeurs issus de la recherche API (state.retailers).
  const retailers = state.retailers;
  const pins = retailers.map((r) => ({ lat: r.lat, lng: r.lng, label: r.name, stock: r.stock }));

  return (
    <section id="buy" style={{ position: 'relative', padding: isMobile ? '60px 16px' : '96px 32px', background: c.sectionB, transition: 'background .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.3em', color: '#FCE500', textTransform: 'uppercase', marginBottom: 14 }}>Où acheter</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(22px,5vw,52px)', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1.1, color: c.ink }}>Trouver un revendeur</h2>
          </div>
          {!isMobile && <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.6, color: c.inkMuted }}>Localisez les points de vente proposant <strong style={{ color: c.ink }}>{leftT.name}</strong> près de chez vous.</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '380px 1fr', gap: 20, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
              <Hoverable
                as="input"
                value={state.postal}
                onChange={actions.onPostalChange}
                placeholder="Code postal ou ville"
                style={{ flex: 1, minWidth: 0, fontFamily: 'inherit', fontSize: 16, fontWeight: 600, color: c.ink, background: c.panel, border: `1.5px solid ${c.fieldBorder}`, borderRadius: 14, padding: '15px 18px', outline: 'none', transition: 'border-color .2s' }}
                focusStyle={{ border: '1.5px solid #27509b' }}
              />
              <Hoverable
                as="button"
                onClick={actions.doSearch}
                style={{ background: '#27509b', color: '#fff', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: '15px 24px', borderRadius: 14, cursor: 'pointer', transition: 'background .2s' }}
                hoverStyle={{ background: '#1d4185' }}
              >
                Rechercher
              </Hoverable>
            </div>

            {state.searched && retailers.length > 0 ? (
              <RetailerList c={c} retailers={retailers} count={retailers.length} postal={state.postal} price={leftT.price} activeRetailer={activeRetailer} onSelect={setActiveRetailer} />
            ) : (
              <div style={{ background: c.panel, border: `1px dashed ${c.borderStrong}`, borderRadius: 14, padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{state.searched ? '🗺' : '🔍'}</div>
                <p style={{ margin: 0, fontSize: 14, color: c.inkMuted }}>
                  {state.searching
                    ? 'Recherche des revendeurs…'
                    : state.searched
                      ? 'Aucun revendeur référencé pour cette zone. Essayez une grande ville (ex. Lyon, 69003).'
                      : 'Saisissez votre code postal pour afficher les revendeurs, leur stock et le prix.'}
                </p>
              </div>
            )}
          </div>

          <Map
            c={c}
            searched={state.searched}
            pins={pins}
            activeRetailer={activeRetailer}
            onPinClick={(label) => setActiveRetailer((prev) => prev?.name === label ? null : retailers.find((r) => r.name === label) ?? null)}
          />
        </div>
      </div>
    </section>
  );
}
