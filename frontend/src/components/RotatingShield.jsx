import React from 'react';
import { motion } from 'framer-motion';

export default function RotatingShield({ size = 220, className = '', compact = false }) {
  const scaleFactor = compact ? 0.75 : 1;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Floor Glow */}
      <motion.div
        className="absolute bottom-[2%] h-4 w-[70%] rounded-full bg-[var(--accent)]/20 blur-xl pointer-events-none"
        animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Core Radial Atmosphere */}
      <motion.div
        className="absolute inset-[15%] rounded-full bg-[var(--accent)]/15 blur-2xl pointer-events-none"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.08, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* SVG Vector Master Animated Logo */}
      <motion.svg
        viewBox="0 0 200 200"
        className="relative z-10 w-full h-full drop-shadow-[0_0_20px_var(--accent-glow)]"
        style={{ transform: `scale(${scaleFactor})` }}
      >
        <defs>
          {/* Cyber Gradient Definitions */}
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent, #4dd7ff)" stopOpacity="1" />
            <stop offset="50%" stopColor="var(--accent-2, #22a3ff)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#030816" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="coreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="var(--accent, #4dd7ff)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent-2, #22a3ff)" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Counter-Rotating HUD Tick Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle cx="100" cy="100" r="92" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 9" strokeOpacity="0.4" />
          <circle cx="100" cy="100" r="86" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="40 18 12 18" strokeOpacity="0.6" />
          {/* Orbital Nodes */}
          <circle cx="100" cy="8" r="3" fill="var(--accent)" filter="url(#neonGlow)" />
          <circle cx="192" cy="100" r="2.5" fill="var(--accent-2)" />
          <circle cx="100" cy="192" r="3" fill="var(--accent)" filter="url(#neonGlow)" />
          <circle cx="8" cy="100" r="2.5" fill="var(--accent-2)" />
        </motion.g>

        {/* Inner Clockwise Tech Ring */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 100px' }}
        >
          <circle cx="100" cy="100" r="78" fill="none" stroke="var(--accent-2)" strokeWidth="1.5" strokeDasharray="60 30" strokeOpacity="0.5" />
          <polygon points="100,24 104,30 96,30" fill="var(--accent)" />
          <polygon points="100,176 104,170 96,170" fill="var(--accent)" />
        </motion.g>

        {/* Outer Stealth Shield Frame */}
        <motion.polygon
          points="100,28 158,54 158,112 100,168 42,112 42,54"
          fill="rgba(5, 12, 26, 0.65)"
          stroke="url(#shieldGrad)"
          strokeWidth="3.5"
          strokeLinejoin="round"
          filter="url(#neonGlow)"
          animate={{ strokeWidth: [3.5, 4.5, 3.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Inner Tech Circuit Lines */}
        <polygon
          points="100,42 144,62 144,106 100,150 56,106 56,62"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          strokeDasharray="8 4"
        />

        {/* Secondary Inner Layer */}
        <polygon
          points="100,52 134,68 134,102 100,136 66,102 66,68"
          fill="rgba(77, 215, 255, 0.08)"
          stroke="var(--accent-2)"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />

        {/* Central Quantum Lock Core Emblem */}
        <motion.g
          animate={{ y: [0, -3, 0], scale: [0.98, 1.03, 0.98] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 92px' }}
        >
          {/* Lock Shackle */}
          <path
            d="M 88 84 V 75 A 12 12 0 0 1 112 75 V 84"
            fill="none"
            stroke="url(#coreGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#neonGlow)"
          />
          {/* Lock Body Shield */}
          <rect
            x="82"
            y="82"
            width="36"
            height="32"
            rx="8"
            fill="url(#shieldGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
            filter="url(#neonGlow)"
          />
          {/* Glowing Keyhole Node */}
          <circle cx="100" cy="94" r="3.5" fill="#ffffff" />
          <polygon points="98.5,95 101.5,95 102.5,103 97.5,103" fill="#ffffff" />
        </motion.g>

        {/* Dynamic Sweeping Sci-Fi Laser Scan Bar */}
        <motion.line
          x1="45"
          y1="50"
          x2="155"
          y2="50"
          stroke="url(#laserGrad)"
          strokeWidth="2.5"
          animate={{ y: [10, 110, 10], opacity: [0.2, 0.9, 0.2] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    </div>
  );
}