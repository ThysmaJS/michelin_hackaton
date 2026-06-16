// Theme-aware design tokens. Two modes: "editorial" (light) and "immersive" (dark).

export function getColors(theme) {
  const im = theme === 'immersive';
  return im
    ? {
        pageBg: '#00102f', headerBg: 'rgba(0,12,52,0.72)', headerBorder: 'rgba(255,255,255,0.10)',
        sectionA: 'linear-gradient(180deg,#000C34 0%,#001a52 100%)', sectionB: '#000920',
        ink: '#ffffff', inkMuted: 'rgba(255,255,255,0.64)', inkFaint: 'rgba(255,255,255,0.42)',
        panel: 'rgba(255,255,255,0.05)', panel2: 'rgba(255,255,255,0.08)', menuBg: '#0a1c44',
        border: 'rgba(255,255,255,0.13)', borderStrong: 'rgba(255,255,255,0.26)',
        field: 'rgba(255,255,255,0.07)', fieldBorder: 'rgba(255,255,255,0.18)',
        track: 'rgba(255,255,255,0.14)', blue: '#87A4D0', chip: 'rgba(255,255,255,0.07)',
        mapBg: '#071736', mapLine: 'rgba(255,255,255,0.05)', mapRoad: 'rgba(255,255,255,0.16)',
      }
    : {
        pageBg: '#ffffff', headerBg: 'rgba(255,255,255,0.85)', headerBorder: '#E8E8E8',
        sectionA: '#ffffff', sectionB: '#F4F5F7',
        ink: '#0D0D0D', inkMuted: '#5b6470', inkFaint: '#9aa0a6',
        panel: '#ffffff', panel2: '#F6F7F9', menuBg: '#ffffff',
        border: '#E8E8E8', borderStrong: '#CDD3DB',
        field: '#F2F3F5', fieldBorder: '#D8DCE2',
        track: '#E5E7EB', blue: '#27509b', chip: '#EEF2F9',
        mapBg: '#EAF0F8', mapLine: 'rgba(39,80,155,0.07)', mapRoad: 'rgba(39,80,155,0.18)',
      };
}

export function getHero(theme) {
  const im = theme === 'immersive';
  return im
    ? {
        bg: '#00060f',
        grad: 'radial-gradient(120% 90% at 78% 18%, #1c4a96 0%, #062456 38%, #000b25 72%, #00060f 100%)',
        overlay: 'linear-gradient(125deg, rgba(0,6,15,.92) 0%, rgba(0,6,15,.45) 42%, rgba(0,6,15,.15) 70%, rgba(0,32,91,.35) 100%)',
        ink: '#ffffff', accent: '#FCE500', body: 'rgba(255,255,255,0.78)',
        eyebrow: '#FCE500', line: '#FCE500',
        statNum: '#ffffff', statLabel: 'rgba(255,255,255,0.55)',
        secBg: 'rgba(255,255,255,0.08)', secBorder: 'rgba(255,255,255,0.22)', secInk: '#ffffff',
        cueInk: 'rgba(255,255,255,0.55)', cueBorder: 'rgba(255,255,255,0.4)',
        noise: '0.35', speed: 'rgba(255,255,255,.05)',
        stageBg: 'linear-gradient(160deg,#0c356f 0%,#04132f 75%)', stageBorder: 'rgba(255,255,255,0.10)',
        stageGlow: 'radial-gradient(70% 55% at 64% 32%, rgba(125,160,216,.45), transparent 62%)',
        pedestal: 'radial-gradient(circle at 50% 35%, #15407e, #061227 72%)', pedestalRing: 'rgba(0,0,0,0.45)',
        tyreRing: '#0b1d3e', cardBg: 'rgba(8,22,52,0.78)', cardBorder: 'rgba(255,255,255,0.12)',
        labelInk: 'rgba(255,255,255,0.78)', labelSub: 'rgba(255,255,255,0.45)',
        chip3d: 'rgba(255,255,255,0.10)', chip3dInk: '#cfe0ff',
      }
    : {
        bg: '#ffffff',
        grad: 'radial-gradient(120% 90% at 80% 16%, #e7eefb 0%, #f2f6fc 44%, #ffffff 80%)',
        overlay: 'linear-gradient(125deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.4) 44%, rgba(255,255,255,0) 72%)',
        ink: '#0D0D0D', accent: '#27509b', body: '#525a66',
        eyebrow: '#27509b', line: '#27509b',
        statNum: '#0D0D0D', statLabel: '#8a909a',
        secBg: '#F1F3F7', secBorder: '#E1E5EC', secInk: '#0D0D0D',
        cueInk: '#8a909a', cueBorder: 'rgba(0,0,0,0.2)',
        noise: '0', speed: 'rgba(39,80,155,.05)',
        stageBg: 'linear-gradient(160deg,#eaf1fc 0%,#dbe6f7 80%)', stageBorder: 'rgba(39,80,155,0.12)',
        stageGlow: 'radial-gradient(70% 55% at 64% 32%, rgba(39,80,155,.16), transparent 62%)',
        pedestal: 'radial-gradient(circle at 50% 35%, #ffffff, #d6e2f4 75%)', pedestalRing: 'rgba(39,80,155,0.10)',
        tyreRing: '#1c3a72', cardBg: 'rgba(255,255,255,0.86)', cardBorder: 'rgba(39,80,155,0.12)',
        labelInk: '#27509b', labelSub: '#8a909a',
        chip3d: '#ffffff', chip3dInk: '#27509b',
      };
}

export function getFoot(theme) {
  const im = theme === 'immersive';
  return im
    ? {
        bg: '#000C34', ink: '#ffffff', muted: 'rgba(255,255,255,0.6)', faint: 'rgba(255,255,255,0.4)',
        border: 'rgba(255,255,255,0.12)', logoBg: '#ffffff', logoDot: '#000C34',
        socialBorder: 'rgba(255,255,255,0.18)', linkMuted: 'rgba(255,255,255,0.66)',
        tagline: 'rgba(255,255,255,0.6)',
      }
    : {
        bg: '#F4F5F7', ink: '#0D0D0D', muted: '#525a66', faint: '#8a909a',
        border: '#E2E5EB', logoBg: '#0D0D0D', logoDot: '#F4F5F7',
        socialBorder: '#D3D8E0', linkMuted: '#525a66',
        tagline: '#525a66',
      };
}
