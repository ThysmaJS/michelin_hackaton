import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import { tyres, competitors, retailerData } from '../../lib/data.js';
import Hoverable from '../Hoverable.jsx';
import RetailerList from './RetailerList.jsx';
import MapPlaceholder from './MapPlaceholder.jsx';

const ALL = { ...tyres, ...competitors };
const pins = retailerData.map((r) => ({ x: r.x, y: r.y, label: r.name }));

export default function Buy() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const leftT = ALL[state.compareLeft] || tyres['power-road'];

  return (
    <section id="buy" style={{ position: 'relative', padding: '96px 32px', background: c.sectionB, transition: 'background .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.3em', color: '#FCE500', textTransform: 'uppercase', marginBottom: 14 }}>Où acheter</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px,4vw,52px)', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1, color: c.ink }}>Trouver un revendeur</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.6, color: c.inkMuted }}>Localisez les points de vente proposant <strong style={{ color: c.ink }}>{leftT.name}</strong> près de chez vous.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 24, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Hoverable
                as="input"
                value={state.postal}
                onChange={actions.onPostalChange}
                placeholder="Code postal ou ville"
                style={{ flex: 1, fontFamily: 'inherit', fontSize: 16, fontWeight: 600, color: c.ink, background: c.panel, border: `1.5px solid ${c.fieldBorder}`, borderRadius: 14, padding: '15px 18px', outline: 'none', transition: 'border-color .2s' }}
                focusStyle={{ borderColor: '#27509b' }}
              />
              <Hoverable
                as="button"
                onClick={actions.doSearch}
                style={{ background: '#27509b', color: '#fff', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 15, padding: '0 24px', borderRadius: 14, cursor: 'pointer', transition: 'background .2s' }}
                hoverStyle={{ background: '#1d4185' }}
              >
                Rechercher
              </Hoverable>
            </div>

            {state.searched ? (
              <RetailerList c={c} retailers={retailerData} count={retailerData.length} postal={state.postal} price={leftT.price} />
            ) : (
              <div style={{ background: c.panel, border: `1px dashed ${c.borderStrong}`, borderRadius: 14, padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>🔍</div>
                <p style={{ margin: 0, fontSize: 14, color: c.inkMuted }}>Saisissez votre code postal pour afficher les revendeurs, leur stock et le prix.</p>
              </div>
            )}
          </div>

          <MapPlaceholder c={c} searched={state.searched} pins={pins} />
        </div>
      </div>
    </section>
  );
}
