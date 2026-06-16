import { useApp } from '../../../store/AppContext.jsx';
import { getColors } from '../../../lib/theme.js';
import { freqList } from '../../../lib/data.js';
import Hoverable from '../../Hoverable.jsx';

export default function FrequencyStep() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, maxWidth: 540 }}>
      {freqList.map(([label, sub, icon]) => {
        const sel = state.freq === label;
        return (
          <Hoverable
            key={label}
            as="button"
            onClick={() => actions.setFreq(label)}
            style={{ display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', background: sel ? c.panel2 : c.field, border: `1.5px solid ${sel ? '#FCE500' : c.fieldBorder}`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
            hoverStyle={{ border: '1.5px solid #27509b' }}
          >
            <span style={{ fontSize: 24 }}>{icon}</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: c.ink }}>{label}</span>
              <span style={{ display: 'block', fontSize: 13, color: c.inkMuted }}>{sub}</span>
            </span>
            <span style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${sel ? '#FCE500' : c.borderStrong}`, background: sel ? '#FCE500' : 'transparent', flex: '0 0 auto' }} />
          </Hoverable>
        );
      })}
    </div>
  );
}
