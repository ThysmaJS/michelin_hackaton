import { useApp } from '../../../store/AppContext.jsx';
import { useData } from '../../../store/DataContext.jsx';
import { getColors } from '../../../lib/theme.js';
import Hoverable from '../../Hoverable.jsx';

export default function RouteStep() {
  const { state, actions } = useApp();
  const { routeList } = useData();
  const c = getColors(state.theme);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, maxWidth: 560 }}>
      {routeList.map(([label, sub, icon]) => {
        const sel = state.route === label;
        return (
          <Hoverable
            key={label}
            as="button"
            onClick={() => actions.setRoute(label)}
            style={{ position: 'relative', textAlign: 'left', background: sel ? c.panel2 : c.field, border: `1.5px solid ${sel ? '#FCE500' : c.fieldBorder}`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}
            hoverStyle={{ border: '1.5px solid #27509b' }}
          >
            <span style={{ position: 'absolute', top: 14, right: 14, width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sel ? '#FCE500' : c.borderStrong}`, background: sel ? '#FCE500' : 'transparent', display: 'block' }} />
            <span style={{ fontSize: 24 }}>{icon}</span>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: c.ink, marginTop: 10, paddingRight: 24 }}>{label}</span>
            <span style={{ display: 'block', fontSize: 12, color: c.inkMuted, marginTop: 2 }}>{sub}</span>
          </Hoverable>
        );
      })}
    </div>
  );
}
