import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import { tyres, competitors, metricDefs } from '../../lib/data.js';
import { scrollToId } from '../../lib/scroll.js';
import Hoverable from '../Hoverable.jsx';
import TyreSelect from './TyreSelect.jsx';

const ALL = { ...tyres, ...competitors };

const WIN  = '#84BD00';
const LOSE = '#E12B2B';

// higher = better (grip, rendement, endurance, legerete)
function cmpHigh(mine, other) {
  if (mine > other) return { ink: WIN,  flag: '▲' };
  if (mine < other) return { ink: LOSE, flag: '▼' };
  return { ink: null, flag: '' };
}
// lower = better (watts)
function cmpLow(mine, other) {
  if (mine < other) return { ink: WIN,  flag: '▲' };
  if (mine > other) return { ink: LOSE, flag: '▼' };
  return { ink: null, flag: '' };
}

function MetricBar({ c, label, val, pct, fill, cmp, isLeft }) {
  const ink = cmp.ink || c.ink;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: c.inkMuted, fontWeight: 600 }}>{label}</span>
        <span style={{ color: ink, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
          {!isLeft && cmp.flag && <span style={{ fontSize: 10 }}>{cmp.flag}</span>}
          {val}
          {isLeft && cmp.flag && <span style={{ fontSize: 10 }}>{cmp.flag}</span>}
        </span>
      </div>
      <div style={{ height: 7, borderRadius: 999, background: c.track, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct, borderRadius: 999, background: fill, transformOrigin: 'left', animation: 'growBar .7s cubic-bezier(.4,0,.2,1) both' }} />
      </div>
    </div>
  );
}

function RaceBadge({ race }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, letterSpacing: '.03em', color: '#00205B', background: '#FCE500', padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap' }}>
      🏆 {race}
    </span>
  );
}

function TubelessBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: '#fff', background: '#16a34a', padding: '3px 9px', borderRadius: 999 }}>
      ◉ TUBELESS
    </span>
  );
}

function StatGrid({ c, tyre, other }) {
  const wCmp = cmpLow(tyre.watts, other?.watts);

  const cell = (label, value, cmpResult) => (
    <div>
      <div style={{ fontSize: 11, color: c.inkFaint, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: cmpResult?.ink || c.ink, display: 'flex', alignItems: 'center', gap: 4 }}>
        {value || '—'}
        {cmpResult?.flag && <span style={{ fontSize: 11 }}>{cmpResult.flag}</span>}
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${c.border}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
        {cell('Rés. roulement', tyre.watts != null ? `${tyre.watts} W` : '—', wCmp)}
        {cell('Poids', tyre.weight, null)}
        {cell('Pression', tyre.pressure, null)}
        {cell('Prix', tyre.price, null)}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {tyre.tubeless && <TubelessBadge />}
        {[tyre.rubber, tyre.sizes].filter(Boolean).map((v) => (
          <span key={v} style={{ fontSize: 11, color: c.inkFaint }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

function MarginalGains({ c, leftT, rightT }) {
  const lw = leftT.watts;
  const rw = rightT.watts;
  if (!lw || !rw || lw === rw) return null;

  // Which is better?
  const leftWins = lw < rw;
  const winner = leftWins ? leftT : rightT;
  const loser  = leftWins ? rightT : leftT;
  const deltaW = Math.abs(lw - rw);

  // 1W saved on a 1h climb at 250W ≈ 14.4s; on Ventoux (1h30) ≈ 22s
  const totalSec = Math.round(deltaW * 22);
  const min = Math.floor(totalSec / 60);
  const sec  = totalSec % 60;
  const timeStr = min > 0 ? `${min} min ${sec > 0 ? `${sec} s` : ''}` : `${sec} s`;

  // Weight delta per pair
  const lGr = leftT.weightG;
  const rGr = rightT.weightG;
  const deltaGr = lGr && rGr ? Math.abs((lGr - rGr) * 2) : 0;
  const lighterName = lGr && rGr && lGr < rGr ? leftT.name : rightT.name;

  const accent = '#FCE500';

  return (
    <div style={{ marginTop: 28, background: `linear-gradient(120deg,#00205B,#002d80)`, borderRadius: 20, padding: '28px 32px', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.35em', color: 'rgba(252,229,0,.7)', textTransform: 'uppercase', marginBottom: 10 }}>Marginal Gains</div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#fff' }}>
          Le <strong style={{ color: accent }}>{winner.name}</strong> roule à{' '}
          <strong style={{ color: accent }}>{deltaW}W de moins</strong>{' '}
          que le {loser.brand} {loser.name} — soit{' '}
          <strong style={{ color: accent }}>≈ {timeStr} gagnées</strong>{' '}
          sur une ascension de type Ventoux (1h30 à 250W).
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, flexShrink: 0, flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: accent, lineHeight: 1 }}>−{deltaW}W</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 600, marginTop: 4 }}>résistance roulement</div>
        </div>
        {deltaGr > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: accent, lineHeight: 1 }}>−{deltaGr}g</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 600, marginTop: 4 }}>la paire · {lighterName}</div>
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: accent, lineHeight: 1 }}>≈{timeStr}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 600, marginTop: 4 }}>gagnées / Ventoux</div>
        </div>
      </div>
    </div>
  );
}

export default function Comparator() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const hasReco = !!state.recommended;
  const leftT  = ALL[state.compareLeft]  || tyres['power-road'];
  const rightT = ALL[state.compareRight] || competitors['continental-gp5000'];
  const leftIsOther  = !!competitors[state.compareLeft];
  const rightIsOther = !!competitors[state.compareRight];
  const leftIsReco   = hasReco && state.compareLeft === state.recommended;

  const compareIntro = leftIsReco
    ? `Votre ${leftT.name} est chargé à gauche. Choisissez un second pneu pour mesurer les gains réels.`
    : 'Choisissez deux pneus et comparez-les sur leurs performances terrain, leur résistance au roulement et l\'impact sur votre chrono.';

  // Wins on the 4 subjective metrics
  let wins = 0;
  metricDefs.forEach(([, key]) => { if (leftT[key] >= rightT[key]) wins += 1; });

  // Delta watts (for VS column)
  const lw = leftT.watts;
  const rw = rightT.watts;
  const deltaWatts = (lw != null && rw != null) ? rw - lw : null; // positive = left better
  const lGr = leftT.weightG;
  const rGr = rightT.weightG;
  const deltaGrPair = (lGr && rGr) ? (rGr - lGr) * 2 : null; // positive = left lighter

  const OtherBadge = () => (
    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.06em', color: c.inkMuted, background: c.chip, border: `1px solid ${c.border}`, padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase' }}>
      Autre marque
    </span>
  );

  const cardHeader = (t, isOther, isReco, selector, onChangeFn) => (
    <div style={{ marginBottom: 22 }}>
      {/* Race badges */}
      {t.races?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {t.races.map((r) => <RaceBadge key={r} race={r} />)}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: isOther ? 'radial-gradient(circle at 50% 38%,#3a3f47,#15171c 72%)' : 'radial-gradient(circle at 50% 38%,#16335f,#060f22 72%)', border: isOther ? '8px solid #0d0f12' : '8px solid #0a1a36', flex: '0 0 auto' }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: c.inkFaint, textTransform: 'uppercase' }}>{t.brand}</span>
            {isOther && <OtherBadge />}
          </div>
          {selector}
          <div style={{ fontSize: 12, color: c.inkMuted, marginTop: 3 }}>{t.usage}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="compare" style={{ position: 'relative', padding: '96px 32px', background: c.sectionB, transition: 'background .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.3em', color: '#FCE500', textTransform: 'uppercase', marginBottom: 14 }}>Face à face</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px,4vw,52px)', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1, color: c.ink }}>Comparateur</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.6, color: c.inkMuted }}>{compareIntro}</p>
        </div>

        {/* Three-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 96px 1fr', alignItems: 'stretch', marginTop: 40 }}>

          {/* LEFT */}
          <div style={{ background: c.panel, border: `1.5px solid ${leftIsReco ? '#FCE500' : c.borderStrong}`, borderRadius: '20px 0 0 20px', padding: 28, position: 'relative' }}>
            {leftIsReco && (
              <span style={{ position: 'absolute', top: -12, left: 24, fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#00205B', background: '#FCE500', padding: '5px 12px', borderRadius: 999 }}>Recommandé pour vous</span>
            )}
            {cardHeader(leftT, leftIsOther, leftIsReco,
              <TyreSelect c={c} value={state.compareLeft} onChange={actions.onCompareLeftChange} />,
            )}
            {metricDefs.map(([label, key]) => {
              const cmp = cmpHigh(leftT[key], rightT[key]);
              return (
                <MetricBar key={key} c={c} label={label} val={leftT[key]} pct={`${leftT[key]}%`}
                  fill={cmp.ink === WIN ? 'linear-gradient(90deg,#84BD00,#b8e04a)' : 'linear-gradient(90deg,#FCE500,#fff3a0)'}
                  cmp={cmp} isLeft={true}
                />
              );
            })}
            <StatGrid c={c} tyre={leftT} other={rightT} />
          </div>

          {/* VS column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: c.sectionB, padding: '20px 0' }}>
            {deltaWatts != null && deltaWatts !== 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: deltaWatts > 0 ? WIN : LOSE }}>
                  {deltaWatts > 0 ? '▲' : '▼'} {Math.abs(deltaWatts)}W
                </div>
                <div style={{ fontSize: 10, color: c.inkFaint, fontWeight: 600, marginTop: 2 }}>rés. roulement</div>
              </div>
            )}

            <div style={{ width: 52, height: 52, borderRadius: '50%', background: c.ink, color: c.sectionB, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, letterSpacing: '-.02em', boxShadow: '0 8px 20px rgba(0,0,0,.25)' }}>VS</div>

            {deltaGrPair != null && deltaGrPair !== 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: deltaGrPair > 0 ? WIN : LOSE }}>
                  {deltaGrPair > 0 ? '▲' : '▼'} {Math.abs(deltaGrPair)}g
                </div>
                <div style={{ fontSize: 10, color: c.inkFaint, fontWeight: 600, marginTop: 2 }}>la paire</div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ background: c.panel, border: `1.5px solid ${c.border}`, borderRadius: '0 20px 20px 0', padding: 28 }}>
            {cardHeader(rightT, rightIsOther, false,
              <TyreSelect c={c} value={state.compareRight} onChange={actions.onCompareChange} />,
            )}
            {metricDefs.map(([label, key]) => {
              const cmp = cmpHigh(rightT[key], leftT[key]);
              return (
                <MetricBar key={key} c={c} label={label} val={rightT[key]} pct={`${rightT[key]}%`}
                  fill={cmp.ink === WIN ? `linear-gradient(90deg,#84BD00,#b8e04a)` : (c.blue || 'linear-gradient(90deg,#27509b,#4a7fd4)')}
                  cmp={cmp} isLeft={false}
                />
              );
            })}
            <StatGrid c={c} tyre={rightT} other={leftT} />
          </div>
        </div>

        {/* Marginal gains banner */}
        <MarginalGains c={c} leftT={leftT} rightT={rightT} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: c.inkMuted }}>
            Le {leftT.name} devance sur {wins}/4 critères · résistance roulement à {lw ?? '—'}W vs {rw ?? '—'}W
          </span>
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
