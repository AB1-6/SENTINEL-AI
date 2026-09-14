import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function SentinelCore({ className = '' }) {
  const rootRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    function onMove(e) {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // small parallax
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      // GPU-accelerated transform
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // breathe glow loop
  useEffect(() => {
    controls.start({ opacity: [0.85, 0.95, 0.85], transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } });
  }, [controls]);

  const devBoost = import.meta.env.DEV ? 1.6 : 1.0;

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className={`sentinel-core pointer-events-none ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      <svg viewBox="0 0 240 240" className="w-full h-full" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g1" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#4dd7ff" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#072033" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* background scan lines (very subtle) */}
        <g opacity="0.06" transform="translate(0,0)">
          <rect x="0" y="34" width="240" height="1" fill="#4dd7ff" opacity="0.04" />
          <rect x="0" y="58" width="240" height="1" fill="#4dd7ff" opacity="0.03" />
          <rect x="0" y="82" width="240" height="1" fill="#4dd7ff" opacity="0.025" />
        </g>

        {/* energy platform w/ gentle pulse */}
        <motion.g transform="translate(120,150)" animate={{ scale: [1, 1.04, 1], opacity: [0.95, 1, 0.95] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <ellipse cx="0" cy="0" rx="70" ry="18" fill="url(#g1)" opacity="0.9" />
          <motion.g filter="url(#glow)" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <circle cx="0" cy="-8" r="36" fill="#053b53" opacity="0.6" />
          </motion.g>
        </motion.g>

        {/* rings with Framer Motion rotations */}
        <motion.g transform="translate(120,90)" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}>
          <circle r="64" cx="0" cy="0" fill="none" stroke="#2fb8ff" strokeWidth="1.5" strokeOpacity={0.22 * devBoost} />
          {/* subtle digital notches */}
          <g opacity="0.06" stroke="#4dd7ff">
            <path d="M-64 -2 L-56 -2" strokeWidth="1" strokeOpacity="0.16" />
            <path d="M64 3 L56 3" strokeWidth="1" strokeOpacity="0.12" />
          </g>
        </motion.g>

        <motion.g transform="translate(120,90)" animate={{ rotate: [0, -360] }} transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}>
          <circle r="46" cx="0" cy="0" fill="none" stroke="#50e3ff" strokeWidth="1.2" strokeOpacity={0.18 * (import.meta.env.DEV ? 1.6 : 1.0)} />
        </motion.g>

        <motion.g transform="translate(120,90)" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}>
          <circle r="28" cx="0" cy="0" fill="none" stroke="#8ff4ff" strokeWidth="1" strokeOpacity={0.14 * (import.meta.env.DEV ? 1.6 : 1.0)} />
        </motion.g>

        {/* center emblem placeholder (S2) with soft volumetric glow */}
        <g transform="translate(120,90)">
          <motion.circle r="16" fill="#9de9ff" opacity="0.98" animate={controls} style={{ mixBlendMode: 'screen' }} />
          <circle r="8" fill="#052330" opacity="0.6" />
          {/* glass overlay */}
          <ellipse cx="0" cy="-2" rx="9" ry="4" fill="rgba(255,255,255,0.04)" />
        </g>

        {/* orbit dots - rotate around center via parent group animation */}
        <motion.g transform="translate(120,90)" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}>
          <circle cx="-64" cy="0" r="1.6" fill="#6fe8ff" opacity="0.95" />
        </motion.g>

        <motion.g transform="translate(120,90)" animate={{ rotate: [0, -360] }} transition={{ repeat: Infinity, duration: 11, ease: 'linear' }}>
          <circle cx="46" cy="30" r="1.2" fill="#7ef0ff" opacity="0.88" />
        </motion.g>

        {/* floating particles */}
        <g transform="translate(120,90)">
          <motion.circle cx="-18" cy="-40" r="1.8" fill="#4dd7ff" opacity={0.9} animate={{ y: [-2, -10, -2], opacity: [0.6, 0.95, 0.6] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle cx="28" cy="-22" r="1.2" fill="#6fe8ff" opacity={0.85} animate={{ y: [0, -8, 0], opacity: [0.5, 0.95, 0.5] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.circle cx="10" cy="-52" r="1.1" fill="#8ff4ff" opacity={0.75} animate={{ y: [-2, -12, -2], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        </g>

        {/* thin circuit accents */}
        <g transform="translate(120,90)" opacity="0.06" stroke="#4dd7ff">
          <path d="M30 10 L46 22" strokeWidth="0.8" />
          <path d="M-22 -6 L-38 -14" strokeWidth="0.8" />
        </g>
      </svg>
    </motion.div>
  );
}
