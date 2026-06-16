import { useApp } from '../../../store/AppContext.jsx';
import { getColors } from '../../../lib/theme.js';
import { modelsByBrand, genericModels } from '../../../lib/data.js';
import Autocomplete from '../Autocomplete.jsx';
import Hoverable from '../../Hoverable.jsx';

export default function ModelStep() {
  const { state, actions } = useApp();
  const c = getColors(state.theme);

  const modelList = modelsByBrand[state.marque] || genericModels;
  const dq = state.modeleQuery.trim().toLowerCase();
  const suggestions = (dq ? modelList.filter((m) => m[0].toLowerCase().includes(dq)) : modelList).slice(0, 6);
  const open = state.modeleFocus && !state.modele && suggestions.length > 0;
  const placeholder = state.marque ? `Modèles ${state.marque}…` : "Choisissez d'abord une marque";

  return (
    <Autocomplete
      c={c}
      value={state.modeleQuery}
      onChange={actions.onModeleChange}
      onFocus={actions.onModeleFocus}
      placeholder={placeholder}
      open={open}
      hint={`⌁ Filtré selon « ${state.marque} ».`}
    >
      {suggestions.map((m) => (
        <Hoverable
          key={m[0]}
          as="button"
          onClick={() => actions.pickModele(m[0])}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%', textAlign: 'left', background: 'transparent', border: 0, fontFamily: 'inherit', padding: '12px 13px', borderRadius: 10, cursor: 'pointer', transition: 'background .15s' }}
          hoverStyle={{ background: c.chip }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, color: c.ink }}>{m[0]}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: c.inkFaint }}>{m[1]}</span>
        </Hoverable>
      ))}
    </Autocomplete>
  );
}
