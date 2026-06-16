import { useData } from '../../store/DataContext.jsx';

export default function TyreSelect({ c, value, onChange }) {
  const { tyres, competitors } = useData();
  const michelinOpts = Object.keys(tyres).map((k) => ({ value: k, label: `Michelin ${tyres[k].name}` }));
  const otherOpts = Object.keys(competitors).map((k) => ({ value: k, label: `${competitors[k].brand} ${competitors[k].name}` }));

  return (
    <select
      value={value}
      onChange={onChange}
      style={{ marginTop: 3, width: '100%', fontFamily: 'inherit', fontSize: 19, fontWeight: 900, letterSpacing: '-.01em', color: c.ink, background: 'transparent', border: 0, borderBottom: `1.5px dashed ${c.borderStrong}`, padding: '2px 0', outline: 'none', cursor: 'pointer' }}
    >
      <optgroup label="Michelin">
        {michelinOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </optgroup>
      <optgroup label="Autres marques">
        {otherOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </optgroup>
    </select>
  );
}
