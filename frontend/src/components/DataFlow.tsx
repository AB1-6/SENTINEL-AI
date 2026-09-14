import React from 'react';

type DataFlowProps = {
  className?: string;
  opacity?: number; // 0..1
  animate?: boolean;
};

export default function DataFlow({ className = '', opacity = 0.15, animate = false }: DataFlowProps) {
  return (
    <svg
      className={`data-flow pointer-events-none ${className}`}
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: -20, opacity }}
    >
      <defs>
        <linearGradient id="df-grad" x1="0" x2="1">
          <stop offset="0%" stopColor="#4dd7ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#22a3ff" stopOpacity="0.18" />
        </linearGradient>
        <filter id="df-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* paths (connect logical hero area left to grid areas) */}
      <g stroke="url(#df-grad)" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={opacity} filter="url(#df-soft)">
        <path id="p1" d="M140 120 C 220 150, 320 150, 420 220" />
        <path id="p2" d="M420 220 C 520 280, 640 300, 760 220" />
        <path id="p3" d="M420 220 C 520 180, 640 120, 760 160" />
        <path id="p4" d="M420 220 C 520 350, 640 420, 880 420" />
      </g>

      {/* optional pulses along paths (disabled by default for professional look) */}
      {animate && (
        <g className="pulses" fill="#4dd7ff" opacity={0.95} style={{ pointerEvents: 'none' }}>
          <g>
            <circle r="3" fill="#9feeff" opacity="0.95">
              <animateMotion dur="6s" repeatCount="indefinite">
                <mpath xlinkHref="#p1" />
              </animateMotion>
            </circle>
          </g>

          <g>
            <circle r="2.6" fill="#7fe8ff" opacity="0.9">
              <animateMotion dur="8s" repeatCount="indefinite">
                <mpath xlinkHref="#p2" />
              </animateMotion>
            </circle>
          </g>

          <g>
            <circle r="2.2" fill="#6fe0ff" opacity="0.85">
              <animateMotion dur="10s" repeatCount="indefinite">
                <mpath xlinkHref="#p4" />
              </animateMotion>
            </circle>
          </g>
        </g>
      )}
    </svg>
  );
}
