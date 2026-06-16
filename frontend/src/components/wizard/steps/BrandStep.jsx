import { useApp } from '../../../store/AppContext.jsx';
import { getColors } from '../../../lib/theme.js';
import { brands } from '../../../lib/data.js';
import Autocomplete from '../Autocomplete.jsx';
import Hoverable from '../../Hoverable.jsx';

export default function BrandStep() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const mq = state.marqueQuery.trim().toLowerCase();
  const uniqBrands = [...new Set(brands)];
  const suggestions = (mq ? uniqBrands.filter((b) => b.toLowerCase().includes(mq)) : uniqBrands).slice(0, 6);
  const open = state.marqueFocus && mq.length > 0 && !state.marque && suggestions.length > 0;

  return (
    <Autocomplete
      c={c}
      value={state.marqueQuery}
      onChange={actions.onMarqueChange}
      onFocus={actions.onMarqueFocus}
      placeholder="Ex. Trek, Specialized, Canyon…"
      open={open}
      hint="⌁ Autocomplétion en temps réel — cliquez une suggestion."
    >
      {suggestions.map((name) => (
        <Hoverable
          key={name}
          as="button"
          onClick={() => actions.pickMarque(name)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', background: 'transparent', border: 0, fontFamily: 'inherit', padding: '12px 13px', borderRadius: 10, cursor: 'pointer', transition: 'background .15s' }}
          hoverStyle={{ background: c.chip }}
        >
          <span style={{ width: 30, height: 30, borderRadius: 8, background: c.chip, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: c.blue }}>{name[0]}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: c.ink }}>{name}</span>
        </Hoverable>
      ))}
    </Autocomplete>
  );
}
