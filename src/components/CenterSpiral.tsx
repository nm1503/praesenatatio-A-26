import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CenterSpiral.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// CENTER SPIRAL
// A canvas-based 3D helix that sits at the CENTER of the
// domain drum carousel — acting as the visual axis pole
// that the three cards (Dramatics, Literature, Oration) orbit.
//
// Same helix math as SpiralScroll but:
//   - position: absolute, centered in its parent
//   - narrower strip (fits between cards)
//   - slightly larger radius to fill its container width
//   - scroll-driven rotation via GSAP ScrollTrigger
//   - trigger: the parent section, not the full document
// ============================================================

const NUM_LOOPS   = 18;
const POINTS_PER  = 100;
const TOTAL_ROT   = Math.PI * 10;
const INERTIA     = 0.07;

interface CenterSpiralProps {
  /** The section element to use as the ScrollTrigger trigger */
  sectionRef: React.RefObject<HTMLElement | null>;
  /** The 3D drum ref to sync horizontal rotation with */
  drumRef?: React.RefObject<HTMLDivElement | null>;
}

export default function CenterSpiral({ sectionRef, drumRef }: CenterSpiralProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const targetRot  = useRef(0);
  const currentRot = useRef(0);
  const rafRef     = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas  = canvasRef.current;
    const wrap    = wrapRef.current;
    const section = sectionRef.current;
    if (!canvas || !wrap || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to physical pixels
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w   = wrap!.offsetWidth;
      const h   = wrap!.offsetHeight;
      canvas!.width  = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width  = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.resetTransform();
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(rotOffset: number) {
      const W  = wrap!.offsetWidth;
      const H  = wrap!.offsetHeight;
      ctx!.clearRect(0, 0, W, H);

      const cx        = W / 2;
      const radius    = W * 0.36;  // swing 36% each side of center
      const padTop    = 32;
      const padBottom = 32;
      const drawH     = H - padTop - padBottom;
      const totalPts  = NUM_LOOPS * POINTS_PER;

      // Faint center axis
      ctx!.beginPath();
      ctx!.moveTo(cx, padTop);
      ctx!.lineTo(cx, H - padBottom);
      ctx!.strokeStyle = 'rgba(201, 168, 76, 0.10)';
      ctx!.lineWidth   = 1;
      ctx!.stroke();

      // Wire segments
      for (let i = 0; i < totalPts - 1; i++) {
        const t0 = (i       / totalPts) * NUM_LOOPS * Math.PI * 2;
        const t1 = ((i + 1) / totalPts) * NUM_LOOPS * Math.PI * 2;

        const x0 = cx + Math.sin(t0 + rotOffset) * radius;
        const y0 = padTop + (i       / totalPts) * drawH;
        const x1 = cx + Math.sin(t1 + rotOffset) * radius;
        const y1 = padTop + ((i + 1) / totalPts) * drawH;

        const depth = Math.cos(t0 + rotOffset);
        const t     = (depth + 1) / 2;
        const alpha = 0.12 + t * 0.88;
        const lw    = 0.8  + t * 2.2;

        ctx!.beginPath();
        ctx!.moveTo(x0, y0);
        ctx!.lineTo(x1, y1);
        ctx!.strokeStyle = `rgba(201, 168, 76, ${alpha.toFixed(3)})`;
        ctx!.lineWidth   = lw;
        ctx!.lineCap     = 'round';
        ctx!.stroke();
      }

      // Loop-end caps
      for (let loop = 0; loop <= NUM_LOOPS; loop++) {
        const t     = (loop / NUM_LOOPS) * NUM_LOOPS * Math.PI * 2;
        const x     = cx + Math.sin(t + rotOffset) * radius;
        const y     = padTop + (loop / NUM_LOOPS) * drawH;
        const depth = Math.cos(t + rotOffset);
        const norm  = (depth + 1) / 2;
        const alpha = 0.15 + norm * 0.85;
        const capR  = 2 + norm * 2;

        ctx!.beginPath();
        ctx!.arc(x, y, capR, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201, 168, 76, ${alpha.toFixed(3)})`;
        ctx!.fill();

        if (depth > 0.2) {
          ctx!.beginPath();
          ctx!.arc(x - 0.6, y - 0.6, capR * 0.4, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 240, 180, ${(norm * 0.5).toFixed(3)})`;
          ctx!.fill();
        }
      }

      // Top/bottom fade
      const fade = 60;
      const gt = ctx!.createLinearGradient(0, 0, 0, fade);
      gt.addColorStop(0, 'rgba(8,8,8,1)');
      gt.addColorStop(1, 'rgba(8,8,8,0)');
      ctx!.fillStyle = gt;
      ctx!.fillRect(0, 0, W, fade);

      const gb = ctx!.createLinearGradient(0, H - fade, 0, H);
      gb.addColorStop(0, 'rgba(8,8,8,0)');
      gb.addColorStop(1, 'rgba(8,8,8,1)');
      ctx!.fillStyle = gb;
      ctx!.fillRect(0, H - fade, W, fade);
    }

    // ScrollTrigger on the parent section
    const trigger = ScrollTrigger.create({
      trigger: section,
      start:   'top bottom',
      end:     'bottom top',
      onUpdate: (self) => {
        targetRot.current = self.progress * TOTAL_ROT;
      },
    });

    function animate() {
      let drumRad = 0;
      if (drumRef?.current) {
        const drumY = (gsap.getProperty(drumRef.current, 'rotateY') as number) || 0;
        drumRad = (-drumY * Math.PI) / 180;
      }
      const desiredRot = targetRot.current + drumRad;
      currentRot.current += (desiredRot - currentRot.current) * INERTIA;
      draw(currentRot.current);
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      trigger.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef]);

  return (
    <div className="center-spiral" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="center-spiral-canvas" />
    </div>
  );
}
