import { useApp } from '../../../store/AppContext.jsx';
import { getColors } from '../../../lib/theme.js';

function kmProfile(km) {
  if (km < 80)  return 'loisir';
  if (km < 250) return 'régulier';
  if (km < 500) return 'assidu';
  return 'grand rouleur';
}

export default function MileageStep() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-.03em', color: c.ink }}>{state.km}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: c.inkMuted }}>km / mois</span>
      </div>
      <input
        type="range"
        min="0"
        max="800"
        step="10"
        value={state.km}
        onChange={actions.onKmChange}
        style={{ width: '100%', accentColor: '#FCE500', height: 6, cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: c.inkFaint }}>
        <span>0</span><span>200</span><span>400</span><span>600</span><span>800+</span>
      </div>
      <div style={{ marginTop: 20, padding: '14px 16px', borderRadius: 12, background: c.panel2, border: `1px solid ${c.border}`, fontSize: 14, color: c.inkMuted }}>
        Profil estimé : <strong style={{ color: c.ink }}>{kmProfile(state.km)}</strong>
      </div>
    </div>
  );
}
