import { useState, useRef, useEffect } from 'react';
import { useData } from '../../store/DataContext.jsx';
import Hoverable from '../Hoverable.jsx';

export default function TyreSelect({ c, value, onChange }) {
  const { tyres, competitors } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const michelinOpts = Object.keys(tyres).map((k) => ({ value: k, label: tyres[k].name, brand: 'Michelin' }));
  const otherOpts    = Object.keys(competitors).map((k) => ({ value: k, label: competitors[k].name, brand: competitors[k].brand }));
  const ALL = [...michelinOpts, ...otherOpts];
  const selected = ALL.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const pick = (val) => { onChange({ target: { value: val } }); setOpen(false); };

  const Group = ({ label, opts }) => (
    <>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.15em', color: c.inkFaint, textTransform: 'uppercase', padding: '8px 13px 4px' }}>{label}</div>
      {opts.map((o) => (
        <Hoverable
          key={o.value}
          as="button"
          onClick={() => pick(o.value)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', textAlign: 'left', background: value === o.value ? c.chip : 'transparent', border: 0, fontFamily: 'inherit', padding: '10px 13px', borderRadius: 10, cursor: 'pointer', transition: 'background .15s' }}
          hoverStyle={{ background: c.chip }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: c.ink }}>{o.brand} {o.label}</span>
          {value === o.value && <span style={{ fontSize: 11, color: '#FCE500', fontWeight: 800, flexShrink: 0 }}>✓</span>}
        </Hoverable>
      ))}
    </>
  );

  return (
    <div ref={ref} style={{ position: 'relative', marginTop: 6, marginBottom: 4 }}>
      <Hoverable
        as="button"
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, color: c.ink, background: c.field, border: `1.5px solid ${open ? '#27509b' : c.fieldBorder}`, borderRadius: 14, padding: '12px 14px', outline: 'none', cursor: 'pointer', transition: 'border-color .2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, textAlign: 'left' }}
        hoverStyle={{ border: '1.5px solid #27509b' }}
      >
        <span>{selected ? `${selected.brand} ${selected.label}` : '—'}</span>
        <span style={{ fontSize: 10, color: c.inkFaint, flexShrink: 0, display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▼</span>
      </Hoverable>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 30, background: c.menuBg, border: `1px solid ${c.borderStrong}`, borderRadius: 14, padding: 6, boxShadow: '0 18px 44px rgba(0,0,0,.28)', maxHeight: 300, overflow: 'auto', animation: 'fadeSlide .2s ease both' }}>
          <Group label="Michelin" opts={michelinOpts} />
          <div style={{ borderTop: `1px solid ${c.border}`, margin: '4px 0' }} />
          <Group label="Autres marques" opts={otherOpts} />
        </div>
      )}
    </div>
  );
}
