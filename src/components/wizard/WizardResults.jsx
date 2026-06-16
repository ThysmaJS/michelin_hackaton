import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import { tyres } from '../../lib/data.js';
import { scrollToId } from '../../lib/scroll.js';
import Hoverable from '../Hoverable.jsx';

export default function WizardResults() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const recT = tyres[state.recommended || 'power-road'];
  const tags = [
    recT.usage,
    `Poids ${recT.weight}`,
    recT.sizes,
    `${recT.pressure}`,
    `Gomme ${recT.rubber}`,
    recT.tubeless ? 'Tubeless Ready' : 'Chambre à air',
  ];
  const why = `Pour un usage « ${state.route || 'route lisse'} » à un rythme « ${state.freq || 'régulier'} », le ${recT.name} offre le meilleur équilibre adhérence / rendement / longévité de la gamme.`;

  return (
    <div style={{ flex: 1, padding: 40, animation: 'fadeSlide .5s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: '#FCE500' }}>✓ Votre recommandation</span>
        <button onClick={actions.resetWizard} style={{ marginLeft: 'auto', background: 'transparent', border: 0, color: c.inkFaint, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>↺ Refaire le test</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28, alignItems: 'center', background: c.panel2, border: `1px solid ${c.border}`, borderRadius: 18, padding: 26 }}>
        <div style={{ aspectRatio: '1', borderRadius: '50%', background: 'radial-gradient(circle at 50% 38%, #16335f, #050d1f 72%)', border: '24px solid #0a1a36', boxShadow: 'inset 0 0 40px rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 18, borderRadius: '50%', border: '2px dashed rgba(252,229,0,.4)' }} />
          <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, color: 'rgba(255,255,255,.5)', textAlign: 'center' }}>visuel<br />pneu</span>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: c.inkFaint, textTransform: 'uppercase' }}>{recT.tag}</div>
          <h3 style={{ margin: '6px 0 10px', fontSize: 30, fontWeight: 900, letterSpacing: '-.02em', color: c.ink }}>{recT.name}</h3>
          <p style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.55, color: c.inkMuted, maxWidth: 440 }}>{why}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {tags.map((t) => (
              <span key={t} style={{ fontSize: 12, fontWeight: 700, color: c.ink, background: c.chip, border: `1px solid ${c.border}`, padding: '6px 12px', borderRadius: 999 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: c.ink }}>{recT.price}</span>
            <Hoverable
              as="button"
              onClick={() => scrollToId('compare')}
              style={{ background: '#FCE500', color: '#00205B', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 14, padding: '13px 24px', borderRadius: 999, cursor: 'pointer', transition: 'transform .2s' }}
              hoverStyle={{ transform: 'translateY(-2px)' }}
            >
              Comparer ce pneu →
            </Hoverable>
            <button onClick={() => scrollToId('buy')} style={{ background: 'transparent', color: c.ink, border: `1px solid ${c.borderStrong}`, fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: '13px 22px', borderRadius: 999, cursor: 'pointer' }}>Où l'acheter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
