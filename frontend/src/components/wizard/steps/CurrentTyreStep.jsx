import { useApp } from '../../../store/AppContext.jsx';
import { useData } from '../../../store/DataContext.jsx';
import { getColors } from '../../../lib/theme.js';
import Hoverable from '../../Hoverable.jsx';

export default function CurrentTyreStep() {
  const { state, actions } = useApp();
  const { currentTyreList } = useData();
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
            style={{ position: 'relative', textAlign: 'left', background: sel ? c.panel2 : c.field, border: `1.5px solid ${sel ? '#FCE500' : c.fieldBorder}`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
            hoverStyle={{ border: '1.5px solid #27509b' }}
          >
            <span style={{ position: 'absolute', top: 14, right: 14, width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sel ? '#FCE500' : c.borderStrong}`, background: sel ? '#FCE500' : 'transparent', display: 'block' }} />
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: c.ink, paddingRight: 24 }}>{label}</span>
            <span style={{ display: 'block', fontSize: 12, color: c.inkMuted, marginTop: 3 }}>{sub}</span>
          </Hoverable>
        );
      })}
    </div>
  );
}
