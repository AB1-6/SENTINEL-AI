import React from 'react';

export default function LaserScanOverlay({ active = false, className = '' }) {
  if (!active) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-inherit ${className}`}>
      {/* Moving Laser Beam */}
      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#4dd7ff,0_0_30px_#22a3ff] animate-laser-sweep" />
      {/* Light Scan Field */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent animate-laser-sweep opacity-50" />
    </div>
  );
}
