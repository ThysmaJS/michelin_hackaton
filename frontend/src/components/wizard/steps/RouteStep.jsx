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
            style={{ position: 'relative', textAlign: 'left', background: sel ? c.panel2 : c.field, border: `1.5px solid ${sel ? '#FCE500' : c.fieldBorder}`, borderRadius: 16, padding: 18, cursor: 'pointer', fontFamily: 'inherit', overflow: 'hidden', transition: 'all .2s' }}
            hoverStyle={{ border: '1.5px solid #27509b' }}
          >
            <span style={{ position: 'absolute', right: -10, top: -10, width: 70, height: 70, borderRadius: '50%', background: sel ? 'rgba(252,229,0,.18)' : c.chip }} />
            <span style={{ fontSize: 26 }}>{icon}</span>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: c.ink, marginTop: 10 }}>{label}</span>
            <span style={{ display: 'block', fontSize: 12, color: c.inkMuted, marginTop: 2 }}>{sub}</span>
          </Hoverable>
        );
      })}
    </div>
  );
}
