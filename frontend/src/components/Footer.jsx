import { useApp } from '../store/AppContext.jsx';
import { useData } from '../store/DataContext.jsx';
import { getFoot } from '../lib/theme.js';
import useBreakpoint from '../hooks/useBreakpoint.js';
import Hoverable from './Hoverable.jsx';

export default function Footer() {
  const { state } = useApp();
  const { socials, footerCols, legalLinks } = useData();
  const foot = getFoot(state.theme);
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <footer style={{ background: foot.bg, color: foot.ink, padding: isMobile ? '48px 16px 28px' : '72px 32px 36px', borderTop: `1px solid ${foot.border}`, transition: 'background .5s ease,color .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? '1.4fr 1fr 1fr' : '1.4fr 1fr 1fr 1fr', gap: isMobile ? '32px 20px' : 40, paddingBottom: 40, borderBottom: `1px solid ${foot.border}` }}>
          <div style={isMobile ? { gridColumn: '1 / -1' } : {}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: foot.logoBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: foot.logoDot }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: '.14em', color: foot.ink }}>MICHELIN</span>
              <span style={{ fontWeight: 600, fontSize: 11, letterSpacing: '.28em', color: '#0D0D0D', background: '#FCE500', borderRadius: 3, padding: '3px 7px' }}>VÉLO</span>
            </div>
            <p style={{ margin: '0 0 22px', maxWidth: 280, fontSize: 14, lineHeight: 1.65, color: foot.tagline }}>La vie est meilleure en mouvement. Innover pour une meilleure vie en mouvement.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {socials.map((s, i) => (
                <Hoverable
                  key={i}
                  as="a"
                  href="#"
                  style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${foot.socialBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: foot.ink, textDecoration: 'none', fontSize: 14, fontWeight: 700, transition: 'background .2s,border-color .2s' }}
                  hoverStyle={{ border: '1px solid #FCE500' }}
                >
                  {s}
                </Hoverable>
              ))}
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#27509b', marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map((lk) => (
                  <Hoverable
                    key={lk}
                    as="a"
                    href="#"
                    style={{ fontSize: 14, color: foot.linkMuted, textDecoration: 'none', transition: 'color .2s' }}
                    hoverStyle={{ color: foot.ink }}
                  >
                    {lk}
                  </Hoverable>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, paddingTop: 26, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            {legalLinks.map((l) => (
              <Hoverable
                key={l}
                as="a"
                href="#"
                style={{ fontSize: 13, color: foot.faint, textDecoration: 'none' }}
                hoverStyle={{ color: foot.ink }}
              >
                {l}
              </Hoverable>
            ))}
          </div>
          <span style={{ fontSize: 13, color: foot.faint }}>© 2026 Compagnie Générale des Établissements Michelin · Maquette concept</span>
        </div>
      </div>
    </footer>
  );
}
