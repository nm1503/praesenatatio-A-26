import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CenterSpiral.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// CENTER SPIRAL — True 3D Volumetric Metallic Helix (Projected 3D Mesh)
// ============================================================

const NUM_LOOPS   = 16;
const POINTS_PER  = 120;
const TOTAL_ROT   = Math.PI * 12;
const INERTIA     = 0.08;

interface CenterSpiralProps {
  /** The section element to use as the ScrollTrigger trigger */
  sectionRef: React.RefObject<HTMLElement | null>;
}

export default function CenterSpiral({ sectionRef }: CenterSpiralProps) {
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
      const W = wrap!.offsetWidth;
      const H = wrap!.offsetHeight;
      ctx!.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      const radius3D = Math.min(W * 0.45, 52);
      const drawH    = H * 0.88;
      const totalPts = NUM_LOOPS * POINTS_PER;

      // 3D Camera Parameters
      const pitch = 0.28; // ~16° 3D tilt angle opens loops into volumetric 3D ovals
      const cosP  = Math.cos(pitch);
      const sinP  = Math.sin(pitch);
      const camDist = 420;

      interface Segment {
        x0: number; y0: number; z0: number;
        x1: number; y1: number; z1: number;
        zAvg: number;
        alpha: number;
        lw: number;
        isFront: boolean;
      }

      const segments: Segment[] = [];

      for (let i = 0; i < totalPts - 1; i++) {
        const t0 = (i       / totalPts) * NUM_LOOPS * Math.PI * 2;
        const t1 = ((i + 1) / totalPts) * NUM_LOOPS * Math.PI * 2;

        const ang0 = t0 + rotOffset;
        const ang1 = t1 + rotOffset;

        // 3D World space coordinates (centered around 0,0,0)
        const wx0 = Math.sin(ang0) * radius3D;
        const wy0 = ((i / totalPts) - 0.5) * drawH;
        const wz0 = Math.cos(ang0) * radius3D;

        const wx1 = Math.sin(ang1) * radius3D;
        const wy1 = (((i + 1) / totalPts) - 0.5) * drawH;
        const wz1 = Math.cos(ang1) * radius3D;

        // Apply 3D Camera Pitch Rotation
        const rx0 = wx0;
        const ry0 = wy0 * cosP - wz0 * sinP;
        const rz0 = wy0 * sinP + wz0 * cosP;

        const rx1 = wx1;
        const ry1 = wy1 * cosP - wz1 * sinP;
        const rz1 = wy1 * sinP + wz1 * cosP;

        // 3D Perspective Projection
        const scale0 = camDist / (camDist - rz0);
        const scale1 = camDist / (camDist - rz1);

        const x0 = cx + rx0 * scale0;
        const y0 = cy + ry0 * scale0;

        const x1 = cx + rx1 * scale1;
        const y1 = cy + ry1 * scale1;

        const zAvg      = (rz0 + rz1) / 2;
        const depthNorm = (wz0 / radius3D + 1) / 2; // 0 (back) to 1 (front)
        const alpha     = 0.18 + depthNorm * 0.82;
        const lw        = (0.8 + depthNorm * 2.8) * scale0;

        segments.push({
          x0, y0, z0: rz0,
          x1, y1, z1: rz1,
          zAvg,
          alpha,
          lw,
          isFront: wz0 >= 0,
        });
      }

      // Pass 1: Render Back Wire Loops (behind central axis)
      for (const seg of segments) {
        if (!seg.isFront) {
          ctx!.beginPath();
          ctx!.moveTo(seg.x0, seg.y0);
          ctx!.lineTo(seg.x1, seg.y1);
          ctx!.strokeStyle = `rgba(175, 135, 45, ${seg.alpha.toFixed(3)})`;
          ctx!.lineWidth   = seg.lw;
          ctx!.lineCap     = 'round';
          ctx!.stroke();
        }
      }

      // Pass 2: Render Central 3D Metallic Axis Rod in 3D perspective
      const topRodY    = cy + (-0.5 * drawH * cosP) * (camDist / (camDist - (-0.5 * drawH * sinP)));
      const bottomRodY = cy + (0.5 * drawH * cosP) * (camDist / (camDist - (0.5 * drawH * sinP)));

      ctx!.beginPath();
      ctx!.moveTo(cx, topRodY);
      ctx!.lineTo(cx, bottomRodY);
      ctx!.strokeStyle = 'rgba(212, 175, 55, 0.28)';
      ctx!.lineWidth   = 1.8;
      ctx!.stroke();

      // Pass 3: Render Front Wire Loops (glowing golden 3D arcs coming forward)
      for (const seg of segments) {
        if (seg.isFront) {
          ctx!.beginPath();
          ctx!.moveTo(seg.x0, seg.y0);
          ctx!.lineTo(seg.x1, seg.y1);
          ctx!.strokeStyle = `rgba(255, 215, 0, ${seg.alpha.toFixed(3)})`;
          ctx!.lineWidth   = seg.lw;
          ctx!.lineCap     = 'round';
          ctx!.stroke();
        }
      }

      // Pass 4: Render 3D Metallic Spherical Nodes at turnpoints
      for (let loop = 0; loop <= NUM_LOOPS; loop++) {
        const t   = (loop / NUM_LOOPS) * NUM_LOOPS * Math.PI * 2;
        const ang = t + rotOffset;

        const wx = Math.sin(ang) * radius3D;
        const wy = ((loop / NUM_LOOPS) - 0.5) * drawH;
        const wz = Math.cos(ang) * radius3D;

        const rx = wx;
        const ry = wy * cosP - wz * sinP;
        const rz = wy * sinP + wz * cosP;

        const scale = camDist / (camDist - rz);

        const x = cx + rx * scale;
        const y = cy + ry * scale;
        const norm = (wz / radius3D + 1) / 2;

        if (wz > -radius3D * 0.4) {
          const capR  = (2.2 + norm * 2.8) * scale;
          const alpha = 0.25 + norm * 0.75;

          // Outer Gold Sphere Body
          ctx!.beginPath();
          ctx!.arc(x, y, capR, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 215, 0, ${alpha.toFixed(3)})`;
          ctx!.fill();

          // 3D Specular Highlight on front sphere caps
          if (wz > 0) {
            ctx!.beginPath();
            ctx!.arc(x - capR * 0.25, y - capR * 0.25, capR * 0.45, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(255, 255, 235, ${(norm * 0.85).toFixed(3)})`;
            ctx!.fill();
          }
        }
      }
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
  }, [sectionRef]);

  return (
    <div className="center-spiral" ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="center-spiral-canvas" />
    </div>
  );
}
