import Hoverable from '../Hoverable.jsx';

export default function RouteCard({ c, route }) {
  return (
    <Hoverable
      as="article"
      style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'transform .25s, border-color .25s' }}
      hoverStyle={{ transform: 'translateY(-6px)', borderColor: c.borderStrong }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/11', background: route.img, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 40%,rgba(0,8,30,.7))' }} />
        <span style={{ position: 'absolute', top: 14, left: 14, fontSize: 11, fontWeight: 800, letterSpacing: '.08em', color: '#00205B', background: '#FCE500', padding: '5px 11px', borderRadius: 999 }}>{route.surface}</span>
        <span style={{ position: 'absolute', bottom: 12, left: 16, fontSize: 14, letterSpacing: '.1em', color: '#FCE500' }}>{route.stars}</span>
        <span style={{ position: 'absolute', bottom: 12, right: 16, fontFamily: 'ui-monospace,monospace', fontSize: 10, color: 'rgba(255,255,255,.55)' }}>[ paysage ]</span>
      </div>
      <div style={{ padding: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', color: c.inkFaint, textTransform: 'uppercase' }}>{route.region} · {route.distance}</div>
        <h3 style={{ margin: '7px 0 10px', fontSize: 21, fontWeight: 900, letterSpacing: '-.01em', color: c.ink }}>{route.title}</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: c.inkMuted }}>{route.blurb}</p>
      </div>
    </Hoverable>
  );
}
