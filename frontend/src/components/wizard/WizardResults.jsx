import { useApp } from '../../store/AppContext.jsx';
import { useData } from '../../store/DataContext.jsx';
import { getColors } from '../../lib/theme.js';
import { scrollToId } from '../../lib/scroll.js';
import Hoverable from '../Hoverable.jsx';

const hasAdvancedData = (s) =>
  s.ftp !== null || s.riderWeight !== 75 || s.bikeWeight !== 8 || s.rimWidth !== 19;

function buildWhy(recT, state) {
  const terrain = state.route || 'route lisse';
  const freq    = state.freq   || 'régulier';
  const base    = `Pour un usage « ${terrain} » à un rythme « ${freq} »`;

  if (!hasAdvancedData(state)) {
    return `${base}, le ${recT.name} offre le meilleur équilibre adhérence / rendement / longévité de la gamme.`;
  }

  const insights = [];

  if (state.ftp !== null && state.ftp > 300) {
    insights.push(`à ${state.ftp} W de FTP, le grip en descente est critique — la gomme GUM-X du ${recT.name} garantit l'adhérence à haute vitesse`);
  } else if (state.ftp !== null && state.ftp > 250) {
    insights.push(`votre niveau de puissance (${state.ftp} W) oriente vers un pneu à grip optimisé pour les courbes rapides`);
  }

  if (state.riderWeight >= 90) {
    insights.push(`sa structure renforcée est adaptée à votre gabarit (${state.riderWeight} kg) pour une longévité maximale`);
  }

  if (state.rimWidth >= 17) {
    insights.push(recT.tubeless
      ? `il est Tubeless Ready — compatible avec vos jantes ${state.rimWidth} mm pour rouler à pression optimisée`
      : `sélectionné pour son rapport performance / poids sur votre setup`);
  }

  if (!insights.length) {
    return `${base}, le ${recT.name} offre le meilleur équilibre adhérence / rendement / longévité de la gamme.`;
  }

  return `${base}, le ${recT.name} s'impose : ${insights.join(' ; ')}.`;
}

function AdvancedSummary({ state, c }) {
  if (!hasAdvancedData(state)) return null;

  const chips = [
    `${state.riderWeight + state.bikeWeight} kg (total)`,
    `Jante ${state.rimWidth} mm`,
    state.ftp !== null ? `FTP ${state.ftp} W` : null,
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#FCE500', letterSpacing: '.1em', textTransform: 'uppercase' }}>
        Profil avancé
      </span>
      {chips.map((chip) => (
        <span key={chip} style={{ fontSize: 12, fontWeight: 700, color: c.ink, background: c.chip, border: `1px solid ${c.border}`, padding: '4px 10px', borderRadius: 999 }}>
          {chip}
        </span>
      ))}
    </div>
  );
}

export default function WizardResults() {
  const { state, actions } = useApp();
  const { tyres } = useData();
  const c = getColors(state.theme);

  const recT    = tyres[state.recommended] || tyres['power-road'];
  const why     = buildWhy(recT, state);
  const advanced = hasAdvancedData(state);
  // La pression conseillée est calculée par l'API (POST /wizard/recommend).
  const pressure = advanced ? state.pressureAdvice : null;

  const tags = [
    recT.usage,
    `Poids ${recT.weight}`,
    recT.sizes,
    `${recT.pressure}`,
    `Gomme ${recT.rubber}`,
    recT.tubeless ? 'Tubeless Ready' : 'Chambre à air',
  ];

  return (
    <div style={{ flex: 1, padding: 40, animation: 'fadeSlide .5s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: '#FCE500' }}>✓ Votre recommandation</span>
        <button
          onClick={actions.resetWizard}
          style={{ marginLeft: 'auto', background: 'transparent', border: 0, color: c.inkFaint, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          ↺ Refaire le test
        </button>
      </div>

      <AdvancedSummary state={state} c={c} />

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28, alignItems: 'center', background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 18, padding: 26 }}>
        {/* Tire visual placeholder */}
        <div style={{ aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle at 50% 38%, #16335f, #050d1f 72%)', border: '24px solid #0a1a36', boxShadow: 'inset 0 0 40px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 18, borderRadius: '50%', border: '2px dashed rgba(252,229,0,.4)' }} />
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, color: 'rgba(255,255,255,.5)', textAlign: 'center' }}>visuel<br />pneu</span>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: c.inkFaint, textTransform: 'uppercase' }}>{recT.tag}</div>
          <h3 style={{ margin: '6px 0 10px', fontSize: 30, fontWeight: 900, letterSpacing: '-.02em', color: c.ink }}>{recT.name}</h3>
          <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.55, color: c.inkMuted, maxWidth: 440 }}>{why}</p>

          {/* Advanced stats grid */}
          {advanced && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ background: c.chip, border: `1px solid ${c.border}`, borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: c.ink }}>{recT.watts}W</div>
                <div style={{ fontSize: 10, color: c.inkFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Rés. roulement</div>
              </div>
              {pressure && (
                <>
                  <div style={{ background: c.chip, border: `1.5px solid #FCE500`, borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: c.ink }}>{pressure.front} bar</div>
                    <div style={{ fontSize: 10, color: c.inkFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Pression Avant</div>
                  </div>
                  <div style={{ background: c.chip, border: `1.5px solid #FCE500`, borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: c.ink }}>{pressure.rear} bar</div>
                    <div style={{ fontSize: 10, color: c.inkFaint, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Pression Arrière</div>
                  </div>
                </>
              )}
              {recT.tubeless && (
                <div style={{ background: 'rgba(132,189,0,.12)', border: '1px solid #84BD00', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#84BD00' }}>◉ TLR</div>
                  <div style={{ fontSize: 10, color: '#84BD00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Tubeless</div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {tags.map((t) => (
              <span key={t} style={{ fontSize: 12, fontWeight: 700, color: c.ink, background: c.chip, border: `1px solid ${c.border}`, padding: '6px 12px', borderRadius: 999 }}>{t}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: c.ink }}>{recT.price}</span>
            <Hoverable
              as="button"
              onClick={() => scrollToId('compare')}
              style={{ background: '#FCE500', color: '#00205B', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 14, padding: '13px 24px', borderRadius: 999, cursor: 'pointer', transition: 'transform .2s' }}
              hoverStyle={{ transform: 'translateY(-2px)' }}
            >
              Comparer ce pneu →
            </Hoverable>
            <button
              onClick={() => scrollToId('buy')}
              style={{ background: 'transparent', color: c.ink, border: `1px solid ${c.borderStrong}`, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: '13px 22px', borderRadius: 999, cursor: 'pointer' }}
            >
              Où l'acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
