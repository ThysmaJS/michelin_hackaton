import { getColors, getHero } from '../lib/theme.js';
import { useApp } from '../store/AppContext.jsx';
import { useData } from '../store/DataContext.jsx';
import { scrollToId } from '../lib/scroll.js';
import useHeroTilt from '../hooks/useHeroTilt.js';
import useBreakpoint from '../hooks/useBreakpoint.js';
import Hoverable from './Hoverable.jsx';

// Inline 3D stage (kept local to the hero — purely decorative).
function HeroStage({ hero, tiltRef }) {
  return (
    <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-50%)', width: '50%', height: '82%', perspective: 1200, pointerEvents: 'none', zIndex: 1 }}>
      <div ref={tiltRef} style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform .25s cubic-bezier(.2,.7,.3,1)', willChange: 'transform' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', animation: 'float3d 7s ease-in-out infinite' }}>
          {/* back stage plane */}
          <div style={{ position: 'absolute', left: '6%', top: '6%', right: '6%', bottom: '6%', borderRadius: 28, background: hero.stageBg, border: `1px solid ${hero.stageBorder}`, boxShadow: '0 40px 90px rgba(0,0,0,.35)', transform: 'translateZ(-70px)', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: hero.stageGlow }} />
            <div style={{ position: 'absolute', right: '-22%', top: '-26%', width: '80%', height: '80%', borderRadius: '50%', border: `34px solid ${hero.pedestalRing}` }} />
          </div>
          {/* pedestal disc */}
          <div style={{ position: 'absolute', left: '50%', top: '62%', width: '62%', height: '24%', transform: 'translate(-50%,-50%) translateZ(-10px) rotateX(72deg)', borderRadius: '50%', background: hero.pedestal, opacity: 0.85, filter: 'blur(.5px)' }} />
          {/* floating tyre ring */}
          <div style={{ position: 'absolute', left: '30%', top: '30%', width: '44%', height: '44%', transform: 'translateZ(40px)', borderRadius: '50%', border: `26px solid ${hero.tyreRing}`, boxShadow: '0 24px 50px rgba(0,0,0,.4), inset 0 0 30px rgba(0,0,0,.4)', animation: 'spinSlow 26s linear infinite' }} />
          {/* cyclist placeholder card */}
          <div style={{ position: 'absolute', left: '50%', top: '48%', width: '58%', transform: 'translate(-50%,-50%) translateZ(95px)', borderRadius: 20, background: hero.cardBg, border: `1px dashed ${hero.cardBorder}`, backdropFilter: 'blur(4px)', padding: 24, textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,.3)' }}>
            <div style={{ fontSize: 34, lineHeight: 1, marginBottom: 10 }}>🚴</div>
            <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, fontWeight: 700, letterSpacing: '.04em', color: hero.labelInk }}>[ rendu 3D — cycliste ]</div>
            <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, color: hero.labelSub, marginTop: 5 }}>déposez le modèle / l'image 3D ici</div>
          </div>
          {/* floating accent chips */}
          <div style={{ position: 'absolute', left: '8%', top: '24%', transform: 'translateZ(130px)', background: '#FCE500', color: '#00205B', fontSize: 11, fontWeight: 800, letterSpacing: '.04em', padding: '7px 12px', borderRadius: 999, boxShadow: '0 14px 28px rgba(0,0,0,.3)', animation: 'float3dB 5.5s ease-in-out infinite' }}>Power Cup</div>
          <div style={{ position: 'absolute', right: '6%', bottom: '20%', transform: 'translateZ(120px)', background: hero.chip3d, color: hero.chip3dInk, fontSize: 11, fontWeight: 800, letterSpacing: '.04em', padding: '7px 12px', borderRadius: 999, boxShadow: '0 14px 28px rgba(0,0,0,.25)', animation: 'float3d 6.5s ease-in-out infinite' }}>215 g · 92 grip</div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { state } = useApp();
  const { heroStats } = useData();
  const c = getColors(state.theme);
  const hero = getHero(state.theme);
  const { heroRef, tiltRef } = useHeroTilt();
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <section
      id="hero"
      ref={heroRef}
      style={{ position: 'relative', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', overflow: 'hidden', background: hero.bg, transition: 'background .5s ease' }}
    >
      {/* animated backdrop layers */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: hero.grad, animation: 'heroPan 18s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: hero.overlay }} />
        <div style={{ position: 'absolute', left: '50%', top: '58%', width: '170%', height: '60%', transform: 'translateX(-50%) rotate(-7deg)', background: `repeating-linear-gradient(90deg, ${hero.speed} 0 2px, transparent 2px 64px)`, maskImage: 'linear-gradient(180deg,transparent,#000 40%,#000 60%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,transparent,#000 40%,#000 60%,transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: hero.noise, mixBlendMode: 'overlay', backgroundImage: 'radial-gradient(rgba(255,255,255,.5) .5px,transparent .5px),radial-gradient(rgba(255,255,255,.3) .5px,transparent .5px)', backgroundSize: '4px 4px,7px 7px', backgroundPosition: '0 0,2px 3px' }} />
      </div>

      {!isMobile && !isTablet && <HeroStage hero={hero} tiltRef={tiltRef} />}

      <div style={{ position: 'relative', maxWidth: 1280, width: '100%', margin: '0 auto', padding: isMobile ? '60px 20px' : '0 32px', zIndex: 2 }}>
        <div style={{ maxWidth: isMobile ? '100%' : 660, animation: 'fadeSlide .9s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
            <span style={{ width: 34, height: 2, background: hero.line }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.32em', color: hero.eyebrow, textTransform: 'uppercase' }}>Michelin · Vélo</span>
          </div>
          <h1 style={{ margin: 0, fontSize: isMobile ? 'clamp(38px,10vw,56px)' : 'clamp(44px,6vw,82px)', lineHeight: 0.98, fontWeight: 900, letterSpacing: '-.025em', color: hero.ink, textWrap: 'balance' }}>
            Chaque route mérite<br />le <span style={{ color: hero.accent }}>bon pneu</span>.
          </h1>
          <p style={{ margin: '24px 0 0', maxWidth: 500, fontSize: isMobile ? 16 : 19, lineHeight: 1.6, color: hero.body }}>
            Trouvez en moins d'une minute le pneu Michelin taillé pour votre vélo, votre terrain et votre façon de rouler. Comparez, découvrez les plus beaux parcours, achetez près de chez vous.
          </p>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: 14, marginTop: 36 }}>
            <Hoverable
              as="button"
              onClick={() => scrollToId('wizard')}
              style={{ background: '#FCE500', color: '#00205B', border: 0, fontFamily: 'inherit', fontWeight: 800, fontSize: 16, padding: '17px 32px', borderRadius: 999, cursor: 'pointer', boxShadow: '0 10px 30px rgba(252,229,0,.32)', transition: 'transform .2s,box-shadow .2s', textAlign: 'center' }}
              hoverStyle={{ transform: 'translateY(-3px)', boxShadow: '0 16px 40px rgba(252,229,0,.45)' }}
            >
              Trouver mon pneu →
            </Hoverable>
            <Hoverable
              as="button"
              onClick={() => scrollToId('compare')}
              style={{ background: hero.secBg, color: hero.secInk, border: `1px solid ${hero.secBorder}`, fontFamily: 'inherit', fontWeight: 700, fontSize: 16, padding: '17px 30px', borderRadius: 999, cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'background .2s,transform .2s', textAlign: 'center' }}
              hoverStyle={{ transform: 'translateY(-3px)' }}
            >
              Comparer des pneus
            </Hoverable>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 24 : 36, marginTop: 48 }}>
            {heroStats.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 900, color: hero.statNum, letterSpacing: '-.02em' }}>{s.num}</div>
                <div style={{ fontSize: 13, color: hero.statLabel, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isMobile && (
        <div onClick={() => scrollToId('wizard')} style={{ position: 'absolute', left: '50%', bottom: 28, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', zIndex: 2 }}>
          <span style={{ fontSize: 11, letterSpacing: '.26em', color: hero.cueInk, textTransform: 'uppercase' }}>Défiler</span>
          <span style={{ width: 26, height: 42, border: `1.5px solid ${hero.cueBorder}`, borderRadius: 14, display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <span style={{ width: 3, height: 8, borderRadius: 2, background: '#FCE500', animation: 'scrollCue 1.6s ease-in-out infinite' }} />
          </span>
        </div>
      )}
    </section>
  );
}
