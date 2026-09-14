import { useEffect, useRef } from 'react';
import { usePointer } from '@/contexts/PointerContext';

export default function CanvasNebula() {
  const ref = useRef(null);
  const pointer = usePointer();
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    pointerRef.current.x = pointer.x;
    pointerRef.current.y = pointer.y;
  }, [pointer.x, pointer.y]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let raf = null;
    let mouse = { x: w / 2, y: h / 2 };
    let particles = [];
    let currentIntensity = document.getElementById('root')?.dataset.intensity || 'medium';

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function buildParticles() {
      particles = [];
      const base = Math.floor((w * h) / 90000);
      const countMult = currentIntensity === 'low' ? 0.4 : currentIntensity === 'high' ? 1.25 : 1.0;
      const particleCount = Math.max(14, Math.floor(base * countMult));
      const currentTheme = document.documentElement.dataset.theme || document.getElementById('root')?.dataset.theme || 'Dark Glass';

      let hueMin = 180, hueMax = 210;
      if (currentTheme === 'Enterprise Contrast') {
        hueMin = 225; hueMax = 255;
      } else if (currentTheme === 'Midnight Blue') {
        hueMin = 205; hueMax = 235;
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: rand(-0.3, 0.3) * (currentIntensity === 'high' ? 1.5 : 1.0),
          vy: rand(-0.18, 0.18) * (currentIntensity === 'high' ? 1.5 : 1.0),
          r: rand(25, 70),
          hue: Math.floor(rand(hueMin, hueMax)),
          opacity: rand(0.012, 0.035),
        });
      }
    }

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      buildParticles();
    }

    function onMove(event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, 'rgba(2,5,12,0.4)');
      g.addColorStop(1, 'rgba(2,5,12,0.85)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const speedFactor = currentIntensity === 'low' ? 0.4 : currentIntensity === 'high' ? 1.5 : 1.0;
      const pointerX = pointerRef.current.x || mouse.x;
      const pointerY = pointerRef.current.y || mouse.y;

      for (const p of particles) {
        const dx = pointerX - p.x;
        const dy = pointerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const force = Math.min(30 / dist, 0.12);
        p.vx += (dx / dist) * force * 0.0008 * speedFactor;
        p.vy += (dy / dist) * force * 0.0006 * speedFactor;

        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        if (p.x < -150) p.x = w + 150;
        if (p.x > w + 150) p.x = -150;
        if (p.y < -150) p.y = h + 150;
        if (p.y > h + 150) p.y = -150;

        const radial = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        radial.addColorStop(0, `hsla(${p.hue},85%,50%,${p.opacity})`);
        radial.addColorStop(0.6, `hsla(${(p.hue + 30) % 360},75%,35%,${p.opacity * 0.4})`);
        radial.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    }

    buildParticles();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', resize);

    const root = document.getElementById('root');
    let mo = null;
    if (root) {
      mo = new MutationObserver(() => {
        const nextIntensity = root.dataset.intensity || 'medium';
        const nextTheme = document.documentElement.dataset.theme || root.dataset.theme;
        currentIntensity = nextIntensity;
        buildParticles();
      });
      mo.observe(root, { attributes: true, attributeFilter: ['data-intensity', 'data-theme'] });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    raf = requestAnimationFrame(draw);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      if (mo) mo.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="canvas-nebula fixed inset-0 -z-10 pointer-events-none opacity-90" />;
}
