import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import { tyres, competitors, metricDefs } from '../../lib/data.js';
import { scrollToId } from '../../lib/scroll.js';
import Hoverable from '../Hoverable.jsx';
import TyreSelect from './TyreSelect.jsx';

const ALL = { ...tyres, ...competitors };

function Bar({ c, label, val, pct, fill, valInk, flag }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: c.inkMuted, fontWeight: 600 }}>{label}</span>
        <span style={{ color: valInk, fontWeight: 800 }}>{val}{flag ? ` ${flag}` : ''}</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: c.track, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct, borderRadius: 999, background: fill, transformOrigin: 'left', animation: 'growBar .7s cubic-bezier(.4,0,.2,1) both' }} />
      </div>
    </div>
  );
}

const WIN_GREEN = '#84BD00';
const LOSE_RED = '#E12B2B';

// Compare a tyre's metric against the opposite tyre: better → green ▲, worse → red ▼,
// equal → neutral.
function compareMetric(mine, other, c) {
  if (mine > other) return { valInk: WIN_GREEN, flag: '▲' };
  if (mine < other) return { valInk: LOSE_RED, flag: '▼' };
  return { valInk: c.ink, flag: '' };
}

function Stat({ c, label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: c.inkFaint, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: c.ink }}>{value || '—'}</div>
    </div>
  );
}

function Stats({ c, tyre }) {
  const specs = [tyre.rubber, tyre.sizes, tyre.tubeless != null ? (tyre.tubeless ? 'Tubeless Ready' : 'Chambre à air') : null].filter(Boolean);
  return (
    <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', gap: 18 }}>
        <Stat c={c} label="Poids" value={tyre.weight} />
        <Stat c={c} label="Pression" value={tyre.pressure} />
        <Stat c={c} label="Prix" value={tyre.price} />
      </div>
      {specs.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: c.inkMuted }}>{specs.join(' · ')}</div>
      )}
    </div>
  );
}

function OtherBadge({ c }) {
  return <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.06em', color: c.inkMuted, background: c.chip, border: `1px solid ${c.border}`, padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase' }}>Autre marque</span>;
}

export default function Comparator() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const hasReco = !!state.recommended;
  const leftT = ALL[state.compareLeft] || tyres['power-road'];
  const rightT = ALL[state.compareRight] || competitors['continental-gp5000'];
  const leftIsOther = !!competitors[state.compareLeft];
  const rightIsOther = !!competitors[state.compareRight];
  const leftIsReco = hasReco && state.compareLeft === state.recommended;

  const compareIntro = leftIsReco
    ? `Votre ${leftT.name} est déjà chargé à gauche. Choisissez un second pneu — Michelin ou autre marque — pour lancer la comparaison.`
    : 'Choisissez deux pneus, de la même marque ou non, pour les comparer sur leurs caractéristiques clés. Le test « Trouver mon pneu » pré-remplit automatiquement le slot de gauche.';

  let wins = 0;
  metricDefs.forEach(([, key]) => { if (leftT[key] >= rightT[key]) wins += 1; });
  const verdict = `Le ${leftT.name} devance sur ${wins} des 4 critères face au ${rightT.brand} ${rightT.name}.`;

  return (
    <section id="compare" style={{ position: 'relative', padding: '96px 32px', background: c.sectionB, transition: 'background .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.3em', color: '#FCE500', textTransform: 'uppercase', marginBottom: 14 }}>Face à face</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px,4vw,52px)', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1, color: c.ink }}>Comparateur</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.6, color: c.inkMuted }}>{compareIntro}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr', gap: 0, alignItems: 'stretch', marginTop: 40 }}>
          {/* LEFT card */}
          <div style={{ background: c.panel, border: `1.5px solid ${leftIsReco ? '#FCE500' : c.borderStrong}`, borderRadius: '20px 0 0 20px', padding: 28, position: 'relative' }}>
            {leftIsReco && (
              <span style={{ position: 'absolute', top: -12, left: 24, fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#00205B', background: '#FCE500', padding: '5px 12px', borderRadius: 999 }}>Recommandé pour vous</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'radial-gradient(circle at 50% 38%,#16335f,#060f22 72%)', border: '9px solid #0a1a36', flex: '0 0 auto' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: c.inkFaint, textTransform: 'uppercase' }}>{leftT.brand}</span>
                  {leftIsOther && <OtherBadge c={c} />}
                </div>
                <TyreSelect c={c} value={state.compareLeft} onChange={actions.onCompareLeftChange} />
                <div style={{ fontSize: 13, color: c.inkMuted, marginTop: 4 }}>{leftT.usage}</div>
              </div>
            </div>
            {metricDefs.map(([label, key]) => (
              <Bar key={key} c={c} label={label} val={leftT[key]} pct={`${leftT[key]}%`} fill="linear-gradient(90deg,#FCE500,#fff3a0)" valInk={c.ink} />
            ))}
            <Stats c={c} tyre={leftT} />
          </div>

          {/* VS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.sectionB }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: c.ink, color: c.sectionB, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, letterSpacing: '-.02em', zIndex: 2, boxShadow: '0 8px 20px rgba(0,0,0,.25)' }}>VS</div>
          </div>

          {/* RIGHT card */}
          <div style={{ background: c.panel, border: `1.5px solid ${c.border}`, borderRadius: '0 20px 20px 0', padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
              <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'radial-gradient(circle at 50% 38%,#3a3f47,#15171c 72%)', border: '9px solid #0d0f12', flex: '0 0 auto' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: c.inkFaint, textTransform: 'uppercase' }}>{rightT.brand}</span>
                  {rightIsOther && <OtherBadge c={c} />}
                </div>
                <TyreSelect c={c} value={state.compareRight} onChange={actions.onCompareChange} />
                <div style={{ fontSize: 13, color: c.inkMuted, marginTop: 4 }}>{rightT.usage}</div>
              </div>
            </div>
            {metricDefs.map(([label, key]) => {
              const { valInk, flag } = compareMetric(rightT[key], leftT[key], c);
              return (
                <Bar key={key} c={c} label={label} val={rightT[key]} pct={`${rightT[key]}%`} fill={c.blue} valInk={valInk} flag={flag} />
              );
            })}
            <Stats c={c} tyre={rightT} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: c.inkMuted }}>{verdict}</span>
          <Hoverable
            as="button"
            onClick={() => scrollToId('guide')}
            style={{ background: 'transparent', color: c.ink, border: `1px solid ${c.borderStrong}`, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: '12px 22px', borderRadius: 999, cursor: 'pointer' }}
            hoverStyle={{ border: '1px solid #FCE500' }}
          >
            Voir les parcours adaptés →
          </Hoverable>
        </div>
      </div>
    </section>
  );
}
