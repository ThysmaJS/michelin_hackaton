import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import useBreakpoint from '../../hooks/useBreakpoint.js';
import Hoverable from '../Hoverable.jsx';

export default function WizardIntro() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);
  const { isMobile } = useBreakpoint();

  const blockChip = {
    fontSize: 13, fontWeight: 700, color: c.ink, background: c.chip,
    border: `1px solid ${c.border}`, padding: '6px 13px', borderRadius: 999,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: isMobile ? 20 : 56, animation: 'fadeSlide .5s ease both' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: c.inkFaint, marginBottom: 16 }}>≈ 45 secondes · 6 questions</div>
      <h3 style={{ margin: '0 0 14px', fontSize: 32, fontWeight: 900, letterSpacing: '-.02em', color: c.ink }}>Prêt à rouler juste ?</h3>
      <p style={{ margin: '0 0 32px', maxWidth: 440, fontSize: 16, lineHeight: 1.6, color: c.inkMuted }}>On commence par votre vélo, puis votre façon de rouler. Aucune création de compte nécessaire.</p>
      <Hoverable
        as="button"
        onClick={actions.startWizard}
        style={{ background: '#FCE500', color: '#00205B', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 16, padding: '16px 30px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 8px 22px rgba(252,229,0,.28)', transition: 'transform .2s' }}
        hoverStyle={{ transform: 'translateY(-2px)' }}
      >
        Commencer →
      </Hoverable>
      <div style={{ display: 'flex', gap: 10, marginTop: 34 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: c.inkFaint, textTransform: 'uppercase', alignSelf: 'center' }}>Blocs</span>
        <span style={blockChip}>🚲 Mon vélo</span>
        <span style={blockChip}>🛣 Mon usage</span>
      </div>
    </div>
  );
}
