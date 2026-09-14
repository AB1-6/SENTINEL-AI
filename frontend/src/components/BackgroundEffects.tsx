import React, { useEffect, useRef } from 'react';
import { usePointer } from '@/contexts/PointerContext';

type Props = {
  className?: string;
  intensity?: number; // 0..1 - scales opacity and particle activity
};

export default function BackgroundEffects({ className = '', intensity = 0.08 }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointer = usePointer();
  const pointerRef = useRef({ x: null, y: null });

  // keep pointerRef updated without re-creating the canvas effect
  useEffect(() => {
    pointerRef.current.x = pointer.x;
    pointerRef.current.y = pointer.y;
  }, [pointer.x, pointer.y]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = Math.max(window.innerWidth, 320));
    let h = (canvas.height = Math.max(window.innerHeight, 240));
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    function resize() {
      w = canvas.width = Math.max(window.innerWidth, 320);
      h = canvas.height = Math.max(window.innerHeight, 240);
      const pw = Math.floor(w * dpr);
      const ph = Math.floor(h * dpr);
      canvas.width = pw;
      canvas.height = ph;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initElements();
    }

    window.addEventListener('resize', resize);

    // nodes and particles
    const nodes: { x: number; y: number; r: number; alpha: number }[] = [];
    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    const circuits: { x1: number; y1: number; x2: number; y2: number; cx: number; cy: number }[] = [];

    function initElements() {
      nodes.length = 0;
      particles.length = 0;
      circuits.length = 0;

      const nodeCount = Math.max(12, Math.floor((w * h) / 90000)); // adapt to screen
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + 0.6, alpha: 0.04 + Math.random() * 0.06 });
      }

      const particleCount = Math.max(14, Math.floor((w * h) / 140000) * (intensity > 0.5 ? 2 : 1));
      for (let i = 0; i < particleCount; i++) {
        particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.2, vy: -0.1 - Math.random() * 0.25, r: Math.random() * 1.4 + 0.6, alpha: 0.15 + Math.random() * 0.25 });
      }

      // create a handful of circuit traces connecting nodes
      for (let i = 0; i < Math.min(10, nodeCount / 2); i++) {
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        const cx = (a.x + b.x) / 2 + (Math.random() - 0.5) * 80;
        const cy = (a.y + b.y) / 2 + (Math.random() - 0.5) * 60;
        circuits.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, cx, cy });
      }
    }

    initElements();

    // draw loop
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // soft gradient background
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `rgba(3,12,22,${0.03 * intensity})`);
      g.addColorStop(1, `rgba(2,6,12,${0.02 * intensity})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // blueprint grid (very faint)
      ctx.strokeStyle = `rgba(77,215,255,${0.02 * intensity})`;
      ctx.lineWidth = 1;
      const gap = 72;
      ctx.beginPath();
      for (let x = 0; x < w; x += gap) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
      }
      for (let y = 0; y < h; y += gap) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }
      ctx.stroke();

      // circuit traces
      ctx.lineWidth = 1;
      for (const c of circuits) {
        const grad = ctx.createLinearGradient(c.x1, c.y1, c.x2, c.y2);
        grad.addColorStop(0, `rgba(77,215,255,${0.0 * intensity})`);
        grad.addColorStop(0.5, `rgba(77,215,255,${0.08 * intensity})`);
        grad.addColorStop(1, `rgba(34,163,255,${0.03 * intensity})`);
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(c.x1, c.y1);
        ctx.quadraticCurveTo(c.cx, c.cy, c.x2, c.y2);
        ctx.stroke();
      }

      // holographic thin connection lines (static, professional)
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(68,200,255,${0.04 * intensity})`;
      ctx.beginPath();
      // draw a small set of static connector lines for visual structure (no animation)
      for (let i = 0; i < 6; i++) {
        const sx = (i + 1) * (w / 7);
        const sy = h * 0.22 + (i % 2 === 0 ? -4 : 4);
        const ex = sx + 40;
        const ey = h * 0.5 + (i % 3 === 0 ? 6 : -6);
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
      }
      ctx.stroke();

      // tiny glowing nodes
      for (const n of nodes) {
        const rg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        rg.addColorStop(0, `rgba(77,215,255,${0.12 * intensity * n.alpha})`);
        rg.addColorStop(1, `rgba(3,12,20,0)`);
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // particles - move and fade (react to pointer subtly)
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      for (const p of particles) {
        // very subtle attraction/repel based on pointer distance
        if (px !== null && py !== null) {
          const dx = px - p.x;
          const dy = py - p.y;
          const dist2 = dx * dx + dy * dy;
          const influence = Math.max(0, 1 - dist2 / (120 * 120));
          // small velocity adjustment towards pointer
          p.vx += (dx / 1000) * influence * (0.6 + intensity * 0.6);
          p.vy += (dy / 1500) * influence * (0.6 + intensity * 0.6);
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const alpha = 0.12 * intensity * p.alpha + (Math.min(0.25, Math.max(0, Math.hypot((px || 0) - p.x, (py || 0) - p.y) < 80 ? 0.08 : 0)));
        ctx.fillStyle = `rgba(77,215,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ambient soft lighting vignette
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.08, 0, w * 0.5, h * 0.08, Math.max(w, h) * 0.9);
      vg.addColorStop(0, `rgba(4,24,38,${0.06 * intensity})`);
      vg.addColorStop(1, `rgba(2,6,12,0)`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    }

    // reference to pointer from context; updated on each frame via closure
    const pointer = usePointer ? usePointer() : null;
    const pointerRef = { current: { x: null, y: null } };
    if (pointer) {
      pointerRef.current.x = pointer.x;
      pointerRef.current.y = pointer.y;
    }

    rafRef.current = requestAnimationFrame(function loop() {
      // update pointerRef each frame from context
      if (pointer) {
        pointerRef.current.x = pointer.x;
        pointerRef.current.y = pointer.y;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      className={`background-effects fixed inset-0 -z-30 pointer-events-none ${className}`}
      style={{ opacity: Math.min(0.1, intensity), width: '100%', height: '100%' }}
    />
  );
}
