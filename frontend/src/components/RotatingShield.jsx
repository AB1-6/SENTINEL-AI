import React from 'react';
import { motion } from 'framer-motion';

export default function RotatingShield({ size = 48, className = '', compact = false }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle ambient back-glow */}
      <div 
        className="absolute inset-[10%] rounded-full bg-sky-500/15 blur-md pointer-events-none"
      />

      <svg
        viewBox="0 0 100 100"
        className="relative z-10 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sentinelShieldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="sentinelInnerGrad" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
          </linearGradient>

          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hex-Shield Outline */}
        <polygon
          points="50,10 85,26 85,62 50,90 15,62 15,26"
          fill="url(#sentinelInnerGrad)"
          stroke="url(#sentinelShieldGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Geometric Shield Facet */}
        <polygon
          points="50,22 74,34 74,58 50,78 26,58 26,34"
          fill="rgba(15, 23, 42, 0.6)"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeOpacity="0.5"
          strokeLinejoin="round"
        />

        {/* Central Zero-Trust Neural Core */}
        <motion.circle
          cx="50"
          cy="48"
          r="7"
          fill="#38bdf8"
          filter="url(#subtleGlow)"
          animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Neural Circuit Lines connecting core to vertices */}
        <path
          d="M50 41 L50 22 M50 55 L50 78 M43 48 L26 48 M57 48 L74 48"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="2 2"
        />

        {/* Emerald Live Operational Status Dot at Top Right */}
        <circle cx="82" cy="18" r="3" fill="#10b981" />
        <circle cx="82" cy="18" r="5" stroke="#10b981" strokeWidth="0.8" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}