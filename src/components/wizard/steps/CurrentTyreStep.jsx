import { useApp } from '../../../store/AppContext.jsx';
import { getColors } from '../../../lib/theme.js';
import { currentTyreList } from '../../../lib/data.js';
import Hoverable from '../../Hoverable.jsx';

export default function CurrentTyreStep() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, maxWidth: 560 }}>
      {currentTyreList.map(([label, sub]) => {
        const sel = state.currentTyre === label;
        return (
          <Hoverable
            key={label}
            as="button"
            onClick={() => actions.setCurrent(label)}
            style={{ textAlign: 'left', background: sel ? c.panel2 : c.field, border: `1.5px solid ${sel ? '#FCE500' : c.fieldBorder}`, borderRadius: 14, padding: 16, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
            hoverStyle={{ borderColor: '#27509b' }}
          >
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: c.ink }}>{label}</span>
            <span style={{ display: 'block', fontSize: 12, color: c.inkMuted, marginTop: 3 }}>{sub}</span>
          </Hoverable>
        );
      })}
    </div>
  );
}
