import { useEffect, useRef } from 'react';

/**
 * Parallax tilt for the hero 3D stage. Tracks the mouse over the hero section
 * and applies a rotateX/rotateY transform to the returned tilt ref.
 * Returns { heroRef, tiltRef } to attach to the hero <section> and the tilted
 * inner wrapper respectively.
 */
export default function useHeroTilt() {
  const heroRef = useRef(null);
  const tiltRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const hero = heroRef.current;
      const tilt = tiltRef.current;
      if (!hero || !tilt) return;
      const r = hero.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `rotateY(${(px * 18).toFixed(2)}deg) rotateX(${(-py * 14).toFixed(2)}deg)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return { heroRef, tiltRef };
}
