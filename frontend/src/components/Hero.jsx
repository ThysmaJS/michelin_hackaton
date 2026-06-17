import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { getHero } from '../lib/theme.js';
import { useApp } from '../store/AppContext.jsx';
import { useData } from '../store/DataContext.jsx';
import { scrollToId } from '../lib/scroll.js';
import useHeroTilt from '../hooks/useHeroTilt.js';
import useBreakpoint from '../hooks/useBreakpoint.js';
import Hoverable from './Hoverable.jsx';

const voltageAssetUrls = import.meta.glob('../../OBJ/*.{png,jpg,jpeg,webp,mtl,obj}', { eager: true, import: 'default' });
const voltageAssetByName = Object.fromEntries(
  Object.entries(voltageAssetUrls).map(([path, url]) => [path.split('/').pop(), url]),
);
const voltageObjUrl = voltageAssetByName['voltage.obj'];
const voltageMtlUrl = voltageAssetByName['voltage.mtl'];

function VoltageModel() {
  const materials = useLoader(MTLLoader, voltageMtlUrl, (loader) => {
    loader.manager.setURLModifier((url) => voltageAssetByName[url] ?? voltageAssetByName[url.split('/').pop()] ?? url);
  });
  const object = useLoader(OBJLoader, voltageObjUrl, (loader) => {
    loader.setMaterials(materials);
  });
  const groupRef = useRef(null);

  useEffect(() => {
    object.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const box = new Box3().setFromObject(object);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    object.position.sub(center);
    const maxSize = Math.max(size.x, size.y, size.z) || 1;
    object.scale.setScalar(3.2 / maxSize);
    object.rotation.set(0.02, Math.PI * 0.38, -0.06);
  }, [object]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.28) * 0.22;
    groupRef.current.rotation.x = -0.14 + Math.sin(t * 0.2) * 0.04;
    groupRef.current.position.y = Math.sin(t * 0.52) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <primitive object={object} />
    </group>
  );
}

// Inline 3D stage (kept local to the hero — purely decorative).
function HeroStage({ hero, tiltRef }) {
  return (
    <div style={{ position: 'absolute', right: '-1%', top: '50%', transform: 'translateY(-50%)', width: '50%', height: '82%', perspective: 1200, pointerEvents: 'none', zIndex: 1 }}>
      <div ref={tiltRef} style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', transition: 'transform .25s cubic-bezier(.2,.7,.3,1)', willChange: 'transform' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d', animation: 'float3d 7s ease-in-out infinite' }}>
          <div style={{ position: 'absolute', inset: '8% 6% 10%', borderRadius: 32, overflow: 'hidden', filter: 'drop-shadow(0 36px 70px rgba(0,0,0,.32))' }}>
            <Canvas
              shadows
              dpr={[1, 1.5]}
              camera={{ position: [0, 1.05, 6.5], fov: 28 }}
              gl={{ antialias: true, alpha: true }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <ambientLight intensity={1.55} />
              <directionalLight position={[5, 7, 8]} intensity={2.1} castShadow />
              <directionalLight position={[-4, 1, 4]} intensity={0.65} />
              <spotLight position={[0, 6, 4]} intensity={1.2} angle={0.55} penumbra={0.7} castShadow />
              <Suspense fallback={null}>
                <VoltageModel />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { state } = useApp();
  const { heroStats } = useData();
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
