import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { usePointer } from '@/contexts/PointerContext';

export type SentinelCoreProps = {
  size?: number; // px, square
  className?: string;
  intensity?: number; // 0..1 for particle/glow strength
};

const DEFAULT_SIZE = 420;

export default function SentinelCore({ size = DEFAULT_SIZE, className = '', intensity = 0.8 }: SentinelCoreProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  // subtle parallax based on mouse movement (very small translation)
  const pointer = usePointer();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf: number | null = null;

    function applyTransform() {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const px = pointer.x || cx;
      const py = pointer.y || cy;
      const nx = (px - cx) / rect.width; // -0.5..0.5
      const ny = (py - cy) / rect.height;

      const tx = nx * 8; // small translate
      const ty = ny * 6;
      const maxRot = 6; // degrees
      const ry = Math.max(-maxRot, Math.min(maxRot, nx * maxRot * 1.2));
      const rx = Math.max(-maxRot, Math.min(maxRot, -ny * maxRot));

      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = null;
    }

    // schedule initial transform
    raf = requestAnimationFrame(applyTransform);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (el) el.style.transform = '';
    };
  }, [pointer.x, pointer.y]);

  // breathing glow loop for the emblem center
  useEffect(() => {
    controls.start({ opacity: [0.9, 1, 0.9], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } });
  }, [controls]);

  const viewBox = 240; // internal svg coordinate space
  const scale = size / viewBox;

  const ringStyle = { transformBox: 'fill-box' as const, transformOrigin: '50% 50%' };

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`sentinel-core pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, willChange: 'transform, opacity' }}
    >
      <svg
        viewBox={`0 0 ${viewBox} ${viewBox}`}
        width={size}
        height={size}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="sentinel-core-g1" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#4dd7ff" stopOpacity={0.32 * intensity} />
            <stop offset="70%" stopColor="#05131a" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="sentinel-line-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#4dd7ff" stopOpacity={0.95 * intensity} />
            <stop offset="100%" stopColor="#1e9fff" stopOpacity={0.18 * intensity} />
          </linearGradient>
          <filter id="sentinel-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={6 * (0.8 + intensity * 0.6)} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* very faint blueprint grid (behind everything) */}
        <g opacity={0.06 * intensity} transform="translate(0,0)">
          {/* grid lines - sparse to avoid visual noise */}
          <g stroke="#0b2130" strokeWidth="1">
            <line x1="10" y1="0" x2="10" y2={viewBox} strokeOpacity={0.02} />
            <line x1="0" y1="10" x2={viewBox} y2="10" strokeOpacity={0.02} />
          </g>
        </g>

        {/* energy platform (pulsing) */}
        <motion.g
          transform={`translate(${viewBox / 2}, ${viewBox * 0.68})`}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'url(#sentinel-glow)' }}
        >
          <ellipse cx={0} cy={0} rx={viewBox * 0.28} ry={viewBox * 0.07} fill="url(#sentinel-core-g1)" opacity={0.95 * intensity} />
          <ellipse cx={0} cy={-8} rx={viewBox * 0.14} ry={viewBox * 0.04} fill="#033140" opacity={0.6 * intensity} />
        </motion.g>

        {/* outer ring (clockwise, 20s) */}
        <motion.g
          style={ringStyle}
          transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          <circle r={viewBox * 0.27} cx={0} cy={0} fill="none" stroke="#2fb8ff" strokeWidth={1.6} strokeOpacity={0.22 * intensity} />
          {/* digital notches */}
          <g opacity={0.06 * intensity} stroke="#4dd7ff">
            <path d={`M${-viewBox * 0.27} -2 L${-viewBox * 0.22} -2`} strokeWidth={0.9} strokeOpacity={0.16 * intensity} />
            <path d={`M${viewBox * 0.27} 3 L${viewBox * 0.22} 3`} strokeWidth={0.9} strokeOpacity={0.12 * intensity} />
          </g>
        </motion.g>

        {/* middle ring (counter-clockwise, 15s) */}
        <motion.g
          style={ringStyle}
          transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`}
          animate={{ rotate: [0, -360] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
        >
          <circle r={viewBox * 0.195} cx={0} cy={0} fill="none" stroke="#50e3ff" strokeWidth={1.2} strokeOpacity={0.18 * intensity} />
        </motion.g>

        {/* inner ring (clockwise slow, 30s) */}
        <motion.g
          style={ringStyle}
          transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
        >
          <circle r={viewBox * 0.12} cx={0} cy={0} fill="none" stroke="#8ff4ff" strokeWidth={1} strokeOpacity={0.14 * intensity} />
        </motion.g>

        {/* center emblem placeholder (S2) - volumetric glow */}
        <g transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`}>
          <motion.circle
            r={viewBox * 0.065}
            fill="#9de9ff"
            opacity={0.96 * intensity}
            animate={controls}
            style={{ mixBlendMode: 'screen' }}
          />
          <circle r={viewBox * 0.032} fill="#041c24" opacity={0.6} />
          {/* subtle glass overlay */}
          <ellipse cx={0} cy={-2} rx={viewBox * 0.04} ry={viewBox * 0.015} fill="rgba(255,255,255,0.04)" />
        </g>

        {/* orbiting light dots - use parent rotation for smooth motion */}
        <motion.g
          transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
        >
          <circle cx={-viewBox * 0.27} cy={0} r={1.8} fill="#6fe8ff" opacity={0.95 * intensity} />
        </motion.g>

        <motion.g
          transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`}
          animate={{ rotate: [0, -360] }}
          transition={{ repeat: Infinity, duration: 11, ease: 'linear' }}
        >
          <circle cx={viewBox * 0.19} cy={viewBox * 0.125} r={1.3} fill="#7ef0ff" opacity={0.9 * intensity} />
        </motion.g>

        {/* floating particles (upwards, fade) */}
        <g transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`}>
          <motion.circle
            cx={-18}
            cy={-40}
            r={1.8}
            fill="#4dd7ff"
            opacity={0.9 * intensity}
            animate={{ y: [-2, -12, -2], opacity: [0.6, 0.95, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={28}
            cy={-22}
            r={1.3}
            fill="#6fe8ff"
            opacity={0.85 * intensity}
            animate={{ y: [0, -10, 0], opacity: [0.5, 0.95, 0.5] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={10}
            cy={-52}
            r={1.1}
            fill="#8ff4ff"
            opacity={0.75 * intensity}
            animate={{ y: [-2, -14, -2], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>

        {/* thin holographic scan lines (very subtle) */}
        <g opacity={0.05 * intensity}>
          <rect x={0} y={viewBox * 0.22} width={viewBox} height={0.5} fill="#4dd7ff" />
          <rect x={0} y={viewBox * 0.34} width={viewBox} height={0.5} fill="#4dd7ff" />
        </g>

        {/* circuit accents */}
        <g transform={`translate(${viewBox / 2}, ${viewBox / 2.1})`} stroke="#4dd7ff" strokeOpacity={0.06 * intensity}>
          <path d={`M${viewBox * 0.08} ${-viewBox * 0.02} L ${viewBox * 0.18} ${viewBox * 0.06}`} strokeWidth={0.8} />
          <path d={`M${-viewBox * 0.12} ${viewBox * 0.02} L ${-viewBox * 0.22} ${-viewBox * 0.06}`} strokeWidth={0.8} />
        </g>
      </svg>
    </div>
  );
}
