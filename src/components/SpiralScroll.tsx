import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SpiralScroll.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// SPIRAL SCROLL — 3D Helix revolving around a central axis
//
// The helix is drawn centered in its strip.
// As the user scrolls, the rotation offset increases —
// making the coil appear to spin around the vertical center line.
//
// Front-facing wire segments are bright gold + thick.
// Back-facing wire segments are dim + thin.
// A faint vertical axis line anchors the center.
// ============================================================

const NUM_LOOPS    = 16;
const POINTS_PER   = 120;     // smoothness per loop
const TOTAL_ROT    = Math.PI * 12;  // ~6 full rotations over full scroll
const INERTIA      = 0.06;

export default function SpiralScroll() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const targetRot  = useRef(0);
  const currentRot = useRef(0);
  const rafRef     = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Resize canvas to physical pixels ──
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap!.offsetWidth;
      const h = wrap!.offsetHeight;
      canvas!.width  = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width  = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.resetTransform();
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Main draw function ──
    function draw(rotOffset: number) {
      const W  = wrap!.offsetWidth;
      const H  = wrap!.offsetHeight;
      ctx!.clearRect(0, 0, W, H);

      const cx        = W / 2;          // center X of the strip
      const radius    = W * 0.38;       // helix swings 38% of strip width each side
      const padTop    = 48;
      const padBottom = 48;
      const drawH     = H - padTop - padBottom;
      const totalPts  = NUM_LOOPS * POINTS_PER;

      // ── Faint vertical center axis ──
      ctx!.beginPath();
      ctx!.moveTo(cx, padTop);
      ctx!.lineTo(cx, H - padBottom);
      ctx!.strokeStyle = 'rgba(201, 168, 76, 0.08)';
      ctx!.lineWidth = 1;
      ctx!.stroke();

      // ── Draw the helix wire ──
      for (let i = 0; i < totalPts - 1; i++) {
        const t0 = (i       / totalPts) * NUM_LOOPS * Math.PI * 2;
        const t1 = ((i + 1) / totalPts) * NUM_LOOPS * Math.PI * 2;

        // Screen positions — sin drives the X oscillation around center
        const x0 = cx + Math.sin(t0 + rotOffset) * radius;
        const y0 = padTop + (i       / totalPts) * drawH;
        const x1 = cx + Math.sin(t1 + rotOffset) * radius;
        const y1 = padTop + ((i + 1) / totalPts) * drawH;

        // cos tells us depth: +1 = front, -1 = back
        const depth = Math.cos(t0 + rotOffset);
        const t     = (depth + 1) / 2;          // normalise 0→1

        // Front: bright gold, thick — Back: dim, thin
        const alpha  = 0.1  + t * 0.90;
        const lw     = 0.7  + t * 2.3;

        ctx!.beginPath();
        ctx!.moveTo(x0, y0);
        ctx!.lineTo(x1, y1);
        ctx!.strokeStyle = `rgba(201, 168, 76, ${alpha.toFixed(3)})`;
        ctx!.lineWidth   = lw;
        ctx!.lineCap     = 'round';
        ctx!.stroke();
      }

      // ── Draw loop-end caps (small circles, like the reference photo) ──
      for (let loop = 0; loop <= NUM_LOOPS; loop++) {
        const t      = (loop / NUM_LOOPS) * NUM_LOOPS * Math.PI * 2;
        const x      = cx + Math.sin(t + rotOffset) * radius;
        const y      = padTop + (loop / NUM_LOOPS) * drawH;
        const depth  = Math.cos(t + rotOffset);
        const norm   = (depth + 1) / 2;
        const alpha  = 0.12 + norm * 0.88;
        const capR   = 2 + norm * 2;               // front caps bigger

        // Cap body
        ctx!.beginPath();
        ctx!.arc(x, y, capR, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201, 168, 76, ${alpha.toFixed(3)})`;
        ctx!.fill();

        // Inner highlight on front-facing caps
        if (depth > 0.2) {
          ctx!.beginPath();
          ctx!.arc(x - 0.6, y - 0.6, capR * 0.45, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 240, 180, ${(norm * 0.55).toFixed(3)})`;
          ctx!.fill();
        }
      }

      // ── Top & bottom fade masks ──
      const fade = 72;
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

    // ── GSAP ScrollTrigger → drives rotation target ──
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start:   'top top',
      end:     'bottom bottom',
      onUpdate: (self) => {
        targetRot.current = self.progress * TOTAL_ROT;
      },
    });

    // ── RAF loop with smooth inertia ──
    function animate() {
      currentRot.current += (targetRot.current - currentRot.current) * INERTIA;
      draw(currentRot.current);
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      trigger.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="spiral-wrap" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="spiral-canvas" />
    </div>
  );
}
