import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import WizardSummary from './WizardSummary.jsx';
import WizardIntro from './WizardIntro.jsx';
import WizardSteps from './WizardSteps.jsx';
import WizardResults from './WizardResults.jsx';

export default function Wizard() {
  const { state } = useApp();
  const c = getColors(state.theme);

  let panel;
  if (!state.started) panel = <WizardIntro />;
  else if (state.step <= 6) panel = <WizardSteps />;
  else panel = <WizardResults />;

  return (
    <section id="wizard" style={{ position: 'relative', padding: '96px 32px', background: c.sectionA, transition: 'background .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 44 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.3em', color: '#FCE500', textTransform: 'uppercase', marginBottom: 14 }}>Étape par étape</div>
            <h2 style={{ margin: 0, fontSize: 'clamp(34px,4vw,52px)', fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1, color: c.ink }}>Trouver mon pneu</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.6, color: c.inkMuted }}>Six questions sur votre vélo et votre usage, plus une étape optionnelle pour affiner. À la clé : la recommandation Michelin la plus juste.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr', gap: 28, alignItems: 'stretch' }}>
          <WizardSummary />
          <div style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 20, minHeight: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {panel}
          </div>
        </div>
      </div>
    </section>
  );
}
