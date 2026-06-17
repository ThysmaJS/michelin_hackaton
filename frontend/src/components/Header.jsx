import { useApp } from '../store/AppContext.jsx';
import { useData } from '../store/DataContext.jsx';
import { getColors } from '../lib/theme.js';
import { scrollToId, scrollToTop } from '../lib/scroll.js';
import Hoverable from './Hoverable.jsx';
import useBreakpoint from '../hooks/useBreakpoint.js';

const HOME_NAV = [
  { label: 'Trouver mon pneu', target: 'wizard' },
  { label: 'Comparateur', target: 'compare' },
  { label: 'Acheter', target: 'buy' },
];

function Logo({ c }) {
  return (
    <div onClick={scrollToTop} style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: c.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.headerBg }} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 21, letterSpacing: '.14em', color: c.ink }}>MICHELIN</span>
      <span style={{ fontWeight: 600, fontSize: 11, letterSpacing: '.28em', color: '#FCE500', border: '1px solid #FCE500', borderRadius: 3, padding: '3px 7px' }}>VÉLO</span>
    </div>
  );
}

export default function Header() {
  const { state, actions } = useApp();
  const { tyres } = useData();
  const c = getColors(state.theme);
  const { isMobile } = useBreakpoint();
  const im = state.theme === 'immersive';
  const onGuide = state.page === 'guide';
  const hasReco = !!state.recommended;
  const recoShortName = (tyres[state.recommended] || tyres['power-road'])?.name;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 60, background: c.headerBg, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: `1px solid ${c.headerBorder}`, transition: 'background .5s ease,border-color .5s ease' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px', height: 64, display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 28 }}>
        <Logo c={c} />

        {!isMobile && (
          <nav style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            {onGuide ? (
              <Hoverable
                as="button"
                onClick={() => actions.navigate('home')}
                style={{ background: 'transparent', border: 0, color: c.inkMuted, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '9px 14px', borderRadius: 8, cursor: 'pointer', transition: 'color .2s,background .2s', display: 'flex', alignItems: 'center', gap: 6 }}
                hoverStyle={{ background: c.chip, color: c.ink }}
              >
                ← Retour à l'accueil
              </Hoverable>
            ) : (
              <>
                {HOME_NAV.map((item) => (
                  <Hoverable
                    key={item.target}
                    as="button"
                    onClick={() => scrollToId(item.target)}
                    style={{ background: 'transparent', border: 0, color: c.inkMuted, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '9px 14px', borderRadius: 8, cursor: 'pointer', transition: 'color .2s,background .2s' }}
                    hoverStyle={{ background: c.chip, color: c.ink }}
                  >
                    {item.label}
                  </Hoverable>
                ))}
                <Hoverable
                  as="button"
                  onClick={() => actions.navigate('guide')}
                  style={{ background: 'transparent', border: 0, color: '#FCE500', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '9px 14px', borderRadius: 8, cursor: 'pointer', transition: 'color .2s,background .2s', display: 'flex', alignItems: 'center', gap: 5 }}
                  hoverStyle={{ background: c.chip }}
                >
                  ★ Guide Michelin
                </Hoverable>
              </>
            )}
          </nav>
        )}

        {isMobile && onGuide && (
          <button
            onClick={() => actions.navigate('home')}
            style={{ background: 'transparent', border: 0, color: c.inkMuted, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, padding: '9px 0', cursor: 'pointer' }}
          >
            ← Accueil
          </button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16 }}>
          {!isMobile && !onGuide && hasReco && (
            <div onClick={() => scrollToId('compare')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: c.chip, border: `1px solid ${c.border}`, borderRadius: 999, padding: '6px 8px 6px 14px', cursor: 'pointer', animation: 'fadeIn .4s ease both' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: c.inkFaint, textTransform: 'uppercase' }}>Votre pneu</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.ink }}>{recoShortName}</span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FCE500' }} />
            </div>
          )}

          <button
            onClick={actions.toggleTheme}
            title={im ? 'Passer en mode clair' : 'Passer en mode sombre'}
            aria-label={im ? 'Passer en mode clair' : 'Passer en mode sombre'}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, width: 64, height: 32, padding: 0, background: c.chip, border: `1px solid ${c.border}`, borderRadius: 999, cursor: 'pointer', transition: 'background .3s,border-color .3s' }}
          >
            <span style={{ position: 'absolute', top: 2, left: 2, width: 26, height: 26, borderRadius: '50%', background: '#FCE500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, lineHeight: 1, transform: im ? 'translateX(32px)' : 'translateX(0)', transition: 'transform .3s cubic-bezier(.4,0,.2,1)', boxShadow: '0 2px 6px rgba(0,0,0,.25)' }}>
              {im ? '🌙' : '☀️'}
            </span>
          </button>

          {!isMobile && (
            <Hoverable
              as="button"
              onClick={() => scrollToId('wizard')}
              style={{ background: '#FCE500', color: '#00205B', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 14, padding: '11px 20px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 6px 18px rgba(252,229,0,.28)', transition: 'transform .2s, box-shadow .2s' }}
              hoverStyle={{ transform: 'translateY(-2px)', boxShadow: '0 10px 26px rgba(252,229,0,.4)' }}
            >
              Trouver mon pneu
            </Hoverable>
          )}
        </div>
      </div>
    </header>
  );
}
