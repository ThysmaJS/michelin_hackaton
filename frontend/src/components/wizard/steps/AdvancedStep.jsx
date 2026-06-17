import { useState } from 'react';
import { useApp } from '../../../store/AppContext.jsx';
import { getColors } from '../../../lib/theme.js';
import { calcPressure } from '../../../lib/recommend.js';
import useBreakpoint from '../../../hooks/useBreakpoint.js';
import Hoverable from '../../Hoverable.jsx';

// Internal rim width presets with ETRTO-compatible tire ranges
const RIM_PRESETS = [
  { val: 15, label: '≤15 mm', tireRange: '23–25 mm', tubeless: false, note: 'Jantes classiques' },
  { val: 17, label: '17 mm',  tireRange: '23–28 mm', tubeless: true,  note: 'Standard route' },
  { val: 19, label: '19 mm',  tireRange: '25–32 mm', tubeless: true,  note: 'Route moderne' },
  { val: 21, label: '21 mm',  tireRange: '28–35 mm', tubeless: true,  note: 'Endurance / all-road' },
  { val: 25, label: '25 mm+', tireRange: '35 mm+',   tubeless: true,  note: 'Gravel / Adventure' },
];

function PressureCard({ riderKg, bikeKg, rimMm, c }) {
  const p = calcPressure(riderKg, bikeKg, rimMm);
  return (
    <div style={{
      marginTop: 16, padding: '14px 16px', borderRadius: 14,
      background: c.panel2, border: `1.5px solid #FCE500`,
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 120 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.2em', color: '#FCE500', textTransform: 'uppercase', marginBottom: 4 }}>
          Pression recommandée
        </div>
        <div style={{ fontSize: 11, color: c.inkFaint, lineHeight: 1.5 }}>
          Pneus {p.tireMm} mm · {p.tubeless ? 'Tubeless' : 'Chambre à air'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
        {[['Avant', p.front], ['Arrière', p.rear]].map(([axle, val]) => (
          <div key={axle} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-.02em', color: c.ink, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 10, color: c.inkFaint, fontWeight: 700, marginTop: 4, whiteSpace: 'nowrap' }}>
              bar · {axle}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdvancedStep() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  // FTP slider is shown only when the user opts in
  const [ftpActive, setFtpActive] = useState(state.ftp !== null);
  const ftpValue = state.ftp ?? 200;

  function toggleFtp() {
    if (ftpActive) {
      setFtpActive(false);
      actions.patch({ ftp: null });
    } else {
      setFtpActive(true);
      actions.patch({ ftp: ftpValue });
    }
  }

  const { isMobile } = useBreakpoint();
  const selectedRim = RIM_PRESETS.find((r) => r.val === state.rimWidth) ?? RIM_PRESETS[2];

  return (
    <div style={{ maxWidth: 560 }}>

      {/* ── 1. Poids ── */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: c.ink, marginBottom: 14 }}>
          Poids cycliste + vélo
        </div>

        {/* Rider weight */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 13, color: c.inkMuted, fontWeight: 600 }}>Cycliste</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: c.ink }}>{state.riderWeight} kg</span>
          </div>
          <input
            type="range" min="50" max="130" step="1" value={state.riderWeight}
            onChange={(e) => actions.patch({ riderWeight: parseInt(e.target.value, 10) })}
            style={{ width: '100%', accentColor: '#FCE500', height: 5, cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: c.inkFaint }}>
            <span>50 kg</span><span>90 kg</span><span>130 kg</span>
          </div>
        </div>

        {/* Bike weight */}
        <div style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 13, color: c.inkMuted, fontWeight: 600 }}>Vélo</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: c.ink }}>{state.bikeWeight} kg</span>
          </div>
          <input
            type="range" min="4" max="15" step="0.5" value={state.bikeWeight}
            onChange={(e) => actions.patch({ bikeWeight: parseFloat(e.target.value) })}
            style={{ width: '100%', accentColor: '#FCE500', height: 5, cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: c.inkFaint }}>
            <span>4 kg</span><span>~8 kg</span><span>15 kg</span>
          </div>
        </div>

        {/* Live pressure calculation */}
        <PressureCard riderKg={state.riderWeight} bikeKg={state.bikeWeight} rimMm={state.rimWidth} c={c} />
      </div>

      {/* ── 2. Largeur de jante ── */}
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: c.ink, marginBottom: 6 }}>
          Largeur de jante interne
        </div>
        <div style={{ fontSize: 12, color: c.inkFaint, marginBottom: 12 }}>
          Détermine la compatibilité pneu et le setup tubeless.
        </div>

        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {RIM_PRESETS.map((rim) => {
            const sel = state.rimWidth === rim.val;
            return (
              <Hoverable
                key={rim.val}
                as="button"
                onClick={() => actions.patch({ rimWidth: rim.val })}
                style={{
                  flex: 1, minWidth: isMobile ? 56 : 80, padding: '10px 8px 9px', textAlign: 'center',
                  background: sel ? c.panel2 : c.field,
                  border: `1.5px solid ${sel ? '#FCE500' : c.fieldBorder}`,
                  borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
                }}
                hoverStyle={{ border: `1.5px solid ${sel ? '#FCE500' : '#27509b'}` }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: c.ink }}>{rim.label}</div>
                <div style={{ fontSize: 10, color: c.inkFaint, marginTop: 3 }}>{rim.note}</div>
              </Hoverable>
            );
          })}
        </div>

        {/* Compatibility info for selected rim */}
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: c.chip, border: `1px solid ${c.border}`, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 11, color: c.inkFaint, fontWeight: 700 }}>Pneus compatibles : </span>
            <span style={{ fontSize: 12, color: c.ink, fontWeight: 700 }}>{selectedRim.tireRange}</span>
          </div>
          <div>
            <span style={{ fontSize: 11, color: c.inkFaint, fontWeight: 700 }}>Tubeless : </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: selectedRim.tubeless ? '#84BD00' : c.inkFaint }}>
              {selectedRim.tubeless ? '◉ Compatible' : '✕ Non compatible'}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. FTP ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: c.ink }}>Puissance FTP</div>
            <div style={{ fontSize: 12, color: c.inkFaint, marginTop: 2 }}>
              Au-delà de 250 W, le grip en descente devient critique.
            </div>
          </div>
          <Hoverable
            as="button"
            onClick={toggleFtp}
            style={{
              padding: '8px 14px', borderRadius: 999, fontFamily: 'inherit',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .2s',
              background: ftpActive ? '#FCE500' : c.field,
              color: ftpActive ? '#00205B' : c.inkMuted,
              border: `1.5px solid ${ftpActive ? '#FCE500' : c.fieldBorder}`,
            }}
            hoverStyle={{ border: `1.5px solid ${ftpActive ? '#FCE500' : '#27509b'}` }}
          >
            {ftpActive ? '✓ Renseigné' : 'Renseigner'}
          </Hoverable>
        </div>

        {ftpActive && (
          <div style={{ animation: 'fadeIn .2s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0 8px' }}>
              <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-.03em', color: c.ink, lineHeight: 1 }}>
                {ftpValue}
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: c.inkMuted }}>W</span>
              {ftpValue > 300 && <span style={{ fontSize: 12, fontWeight: 800, color: '#FCE500', background: 'rgba(252,229,0,.12)', border: '1px solid rgba(252,229,0,.3)', padding: '3px 10px', borderRadius: 999, marginLeft: 4 }}>Élite</span>}
              {ftpValue > 250 && ftpValue <= 300 && <span style={{ fontSize: 12, fontWeight: 800, color: '#84BD00', background: 'rgba(132,189,0,.1)', border: '1px solid rgba(132,189,0,.3)', padding: '3px 10px', borderRadius: 999, marginLeft: 4 }}>Performance</span>}
            </div>
            <input
              type="range" min="80" max="500" step="5"
              value={ftpValue}
              onChange={(e) => actions.patch({ ftp: parseInt(e.target.value, 10) })}
              style={{ width: '100%', accentColor: '#FCE500', height: 6, cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 11, color: c.inkFaint }}>
              <span>80 W</span><span>250 W</span><span>500 W</span>
            </div>
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: c.chip, border: `1px solid ${c.border}`, fontSize: 12, color: c.inkMuted, lineHeight: 1.5 }}>
              {ftpValue > 300
                ? <><strong style={{ color: c.ink }}>Grip maximal prioritaire.</strong> GUM-X compound et pneus de compétition recommandés pour tenir les descentes à haute vitesse.</>
                : ftpValue > 250
                ? <><strong style={{ color: c.ink }}>Grip optimisé.</strong> La résistance au roulement et l'adhérence en courbe sont pris en compte dans la sélection.</>
                : <><strong style={{ color: c.ink }}>Endurance et confort.</strong> La longévité et la régularité sont prioritaires sur la légèreté extrême.</>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
