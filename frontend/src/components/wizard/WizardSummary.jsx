import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';


export default function WizardSummary() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const kmDone = state.started && state.step >= 5;
  const progressCount = [state.marque, state.modele, state.currentTyre, state.freq, state.route].filter(Boolean).length + (kmDone ? 1 : 0);
  const progressPct = `${Math.round((progressCount / 6) * 100)}%`;
  const progressLabel = `${progressCount}/6`;

  const defs = [
    { label: 'Marque',        value: state.marque,                    i: 0 },
    { label: 'Modèle',        value: state.modele,                    i: 1 },
    { label: 'Pneus actuels', value: state.currentTyre,               i: 2 },
    { label: 'Fréquence',     value: state.freq,                      i: 3 },
    { label: 'Type de routes', value: state.route,                    i: 4 },
    { label: 'Kilométrage',   value: kmDone ? `${state.km} km/mois` : '', i: 5 },
  ];

  const hasAdvanced = state.step >= 6 ||
    state.ftp !== null || state.riderWeight !== 75 || state.bikeWeight !== 8 || state.rimWidth !== 19;
  const advancedChips = [
    state.ftp !== null ? `FTP ${state.ftp} W` : null,
    state.riderWeight !== 75 ? `${state.riderWeight} kg` : null,
    state.rimWidth !== 19 ? `Jante ${state.rimWidth} mm` : null,
  ].filter(Boolean);

  return (
    <aside style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: c.inkFaint }}>Votre profil</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: c.ink }}>{progressLabel}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: c.track, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: '100%', width: progressPct, borderRadius: 999, background: 'linear-gradient(90deg,#27509b,#FCE500)', transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
      </div>

      {/* Main 6 steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {defs.map((d) => {
          const done = !!d.value;
          const active = state.started && state.step === d.i;
          return (
            <button
              key={d.label}
              onClick={() => actions.jumpTo(d.i)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', background: active ? c.panel2 : 'transparent', border: `1px solid ${active ? c.borderStrong : c.border}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .2s' }}
            >
              <span style={{ flex: '0 0 auto', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: done ? '#FCE500' : active ? c.panel2 : 'transparent', color: done ? '#00205B' : c.inkMuted, border: `1px solid ${done ? '#FCE500' : c.border}` }}>
                {done ? '✓' : d.i + 1}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '.04em', color: c.inkFaint, textTransform: 'uppercase' }}>{d.label}</span>
                <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: done ? c.ink : c.inkFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{done ? d.value : '—'}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Optional advanced row */}
      {hasAdvanced && (
        <button
          onClick={() => actions.jumpTo(6)}
          style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', background: state.step === 6 ? c.panel2 : 'transparent', border: `1px solid ${state.step === 6 ? '#84BD00' : c.border}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background .2s' }}
        >
          <span style={{ flex: '0 0 auto', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, background: advancedChips.length ? 'rgba(132,189,0,.2)' : 'transparent', color: '#84BD00', border: '1px solid rgba(132,189,0,.4)' }}>
            {advancedChips.length ? '✓' : '★'}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.04em', color: '#84BD00', textTransform: 'uppercase' }}>Profil avancé · Optionnel</span>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.inkFaint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {advancedChips.length ? advancedChips.join(' · ') : 'Poids, jantes, niveau'}
            </span>
          </span>
        </button>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <div style={{ display: 'flex', gap: 9, padding: 14, borderRadius: 14, background: c.panel2, border: `1px solid ${c.border}` }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>🛈</span>
          <span style={{ fontSize: 12, lineHeight: 1.5, color: c.inkMuted }}>Vos réponses alimentent automatiquement le comparateur, le Guide Route et la recherche de revendeurs.</span>
        </div>
      </div>
    </aside>
  );
}
