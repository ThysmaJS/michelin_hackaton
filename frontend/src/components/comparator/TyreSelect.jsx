import { useData } from '../../store/DataContext.jsx';
import Hoverable from '../Hoverable.jsx';

export default function TyreSelect({ c, value, onChange }) {
  const { tyres, competitors } = useData();
  const michelinOpts = Object.keys(tyres).map((k) => ({ value: k, label: `Michelin ${tyres[k].name}` }));
  const otherOpts = Object.keys(competitors).map((k) => ({ value: k, label: `${competitors[k].brand} ${competitors[k].name}` }));

  return (
    <Hoverable
      as="select"
      value={value}
      onChange={onChange}
      style={{ width: '100%', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, color: c.ink, background: c.field, border: `1.5px solid ${c.fieldBorder}`, borderRadius: 14, padding: '12px 14px', outline: 'none', cursor: 'pointer', transition: 'border-color .2s', marginTop: 6, marginBottom: 4 }}
      hoverStyle={{ border: '1.5px solid #27509b' }}
      focusStyle={{ border: '1.5px solid #27509b' }}
    >
      <optgroup label="Michelin">
        {michelinOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </optgroup>
      <optgroup label="Autres marques">
        {otherOpts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </optgroup>
    </Hoverable>
  );
}
