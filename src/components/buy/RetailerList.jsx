import { useRef, useEffect } from 'react';
import Hoverable from '../Hoverable.jsx';

export default function RetailerList({ c, retailers, count, postal, price, activeRetailer, onSelect }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!activeRetailer || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-retailer="${CSS.escape(activeRetailer.name)}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeRetailer]);

  return (
    <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'fadeSlide .4s ease both' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: c.inkMuted }}>{count} revendeurs près de « {postal} »</div>
      {retailers.map((rt) => {
        const isActive = activeRetailer?.name === rt.name;
        const stockInk = rt.stock ? '#1c7a32' : '#9a6a00';
        const stockBg = rt.stock ? 'rgba(46,125,50,.16)' : 'rgba(249,168,37,.18)';
        const stockLabel = rt.stock ? 'En stock' : 'Sur commande';
        return (
          <Hoverable
            key={rt.name}
            data-retailer={rt.name}
            onClick={() => onSelect(isActive ? null : rt)}
            style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: isActive ? 'rgba(252,229,0,.10)' : c.panel,
              border: `1.5px solid ${isActive ? '#FCE500' : c.border}`,
              borderRadius: 14, padding: 16,
              transition: 'border-color .2s, background .2s',
              cursor: 'pointer',
            }}
            hoverStyle={{ border: `1.5px solid ${isActive ? '#FCE500' : c.borderStrong}` }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: isActive ? '#FCE500' : c.chip,
              border: `1px solid ${isActive ? '#FCE500' : c.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flex: '0 0 auto',
              transition: 'background .2s',
            }}>
              📍
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: c.ink }}>{rt.name}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c.inkFaint }}>· {rt.distance}</span>
              </div>
              <div style={{ fontSize: 13, color: c.inkMuted, marginTop: 2 }}>{rt.address} · {rt.city}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: stockInk, background: stockBg, padding: '4px 10px', borderRadius: 999 }}>{stockLabel}</span>
                <span style={{ fontSize: 15, fontWeight: 900, color: c.ink }}>{price}</span>
              </div>
            </div>
          </Hoverable>
        );
      })}
    </div>
  );
}
