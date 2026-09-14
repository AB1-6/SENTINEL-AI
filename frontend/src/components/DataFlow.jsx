export default function DataFlow({ className = '' }) {
  return (
    <svg className={`data-flow pointer-events-none ${className}`} viewBox="0 0 1200 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#4dd7ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22a3ff" stopOpacity="0.2" />
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* sample connectors flowing top-left to various columns */}
      <g stroke="url(#lineGrad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.15" filter="url(#soft)">
        <path className="flow-path" d="M140 120 C 220 150, 320 150, 420 220" />
        <path className="flow-path" d="M420 220 C 520 280, 640 300, 760 220" />
        <path className="flow-path" d="M420 220 C 520 180, 640 120, 760 160" />
        <path className="flow-path" d="M420 220 C 520 350, 640 420, 880 420" />
      </g>

      {/* moving pulses */}
      <g className="pulses" fill="#4dd7ff" opacity="0.9">
        <circle r="3" className="pulse pulse-1" cx="140" cy="120" />
        <circle r="2.6" className="pulse pulse-2" cx="420" cy="220" />
        <circle r="2.2" className="pulse pulse-3" cx="760" cy="220" />
      </g>
    </svg>
  );
}
