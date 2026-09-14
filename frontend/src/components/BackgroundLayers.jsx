import { useEffect, useRef } from 'react';

export default function BackgroundLayers() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 28 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + 0.6 }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // subtle blueprint grid
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 72) {
        ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 72) {
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke();
      }

      // tiny nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(77,215,255,0.06)';
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        // slight drift
        n.x += (Math.random() - 0.5) * 0.6;
        n.y += (Math.random() - 0.5) * 0.6;
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0;
        if (n.y < 0) n.y = h; if (n.y > h) n.y = 0;
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={ref} className="background-layers fixed inset-0 -z-30 pointer-events-none" />
  );
}
