export default function MapPlaceholder({ c, searched, pins }) {
  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: `1px solid ${c.border}`, background: c.mapBg, minHeight: 440 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${c.mapLine} 1px,transparent 1px),linear-gradient(90deg,${c.mapLine} 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />
      <div style={{ position: 'absolute', left: '18%', top: '62%', width: '60%', height: 8, background: c.mapRoad, borderRadius: 99, transform: 'rotate(-18deg)' }} />
      <div style={{ position: 'absolute', left: '30%', top: '30%', width: '48%', height: 7, background: c.mapRoad, borderRadius: 99, transform: 'rotate(12deg)' }} />
      {searched && (
        <div style={{ position: 'absolute', inset: 0, animation: 'fadeIn .5s ease both' }}>
          {pins.map((p) => (
            <div key={p.label} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ background: '#00205B', color: '#FCE500', fontSize: 11, fontWeight: 800, padding: '5px 9px', borderRadius: 8, whiteSpace: 'nowrap', boxShadow: '0 6px 14px rgba(0,0,0,.3)' }}>{p.label}</div>
              <div style={{ width: 14, height: 14, borderRadius: '50% 50% 50% 0', transform: 'rotate(45deg)', background: '#FCE500', border: '2px solid #00205B', marginTop: -2 }} />
            </div>
          ))}
        </div>
      )}
      <span style={{ position: 'absolute', bottom: 14, right: 16, fontFamily: 'ui-monospace,monospace', fontSize: 10, color: c.inkFaint, background: c.chip, padding: '5px 9px', borderRadius: 6 }}>[ carte interactive — intégration à venir ]</span>
    </div>
  );
}
