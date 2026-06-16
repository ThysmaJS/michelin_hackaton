import { useApp } from '../../store/AppContext.jsx';
import { getColors } from '../../lib/theme.js';
import { stepMeta } from '../../lib/data.js';
import Hoverable from '../Hoverable.jsx';
import BrandStep from './steps/BrandStep.jsx';
import ModelStep from './steps/ModelStep.jsx';
import CurrentTyreStep from './steps/CurrentTyreStep.jsx';
import FrequencyStep from './steps/FrequencyStep.jsx';
import RouteStep from './steps/RouteStep.jsx';
import MileageStep from './steps/MileageStep.jsx';

const STEP_COMPONENTS = [BrandStep, ModelStep, CurrentTyreStep, FrequencyStep, RouteStep, MileageStep];

export default function WizardSteps() {
  const { state, actions, canAdvance } = useApp();
  const c = getColors(state.theme);

  const meta = stepMeta[Math.min(state.step, 5)];
  const StepBody = STEP_COMPONENTS[Math.min(state.step, 5)];
  const onLast = state.step === 5;
  const nextLabel = onLast ? 'Voir ma recommandation →' : 'Suivant →';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* step header */}
      <div style={{ padding: '26px 40px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#FCE500', background: 'rgba(252,229,0,.12)', border: '1px solid rgba(252,229,0,.3)', padding: '4px 10px', borderRadius: 999 }}>{meta.block}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: c.inkFaint }}>{`Question ${state.step + 1} / 6`}</span>
        </div>
        <Hoverable
          as="button"
          onClick={actions.resetWizard}
          style={{ background: 'transparent', border: 0, color: c.inkFaint, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          hoverStyle={{ color: c.ink }}
        >
          ↺ Recommencer
        </Hoverable>
      </div>

      <div style={{ flex: 1, padding: '22px 40px 0' }}>
        <div>
          <h3 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, letterSpacing: '-.02em', color: c.ink }}>{meta.title}</h3>
          <p style={{ margin: '0 0 26px', fontSize: 15, color: c.inkMuted }}>{meta.hint}</p>
          <StepBody />
        </div>
      </div>

      {/* nav footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 40px 30px', gap: 16, marginTop: 'auto' }}>
        <Hoverable
          as="button"
          onClick={actions.prevStep}
          style={{ background: 'transparent', border: `1px solid ${c.border}`, color: c.inkMuted, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '13px 22px', borderRadius: 999, cursor: 'pointer', transition: 'all .2s' }}
          hoverStyle={{ borderColor: c.borderStrong, color: c.ink }}
        >
          ← Précédent
        </Hoverable>
        <button
          onClick={actions.nextStep}
          style={{ background: canAdvance ? '#FCE500' : c.field, color: canAdvance ? '#00205B' : c.inkFaint, border: 0, fontFamily: 'inherit', fontSize: 15, fontWeight: 800, padding: '14px 30px', borderRadius: 999, cursor: canAdvance ? 'pointer' : 'not-allowed', opacity: canAdvance ? 1 : 0.6, boxShadow: canAdvance ? '0 8px 20px rgba(252,229,0,.28)' : 'none', transition: 'all .2s' }}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
