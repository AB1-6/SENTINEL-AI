import { useState, useEffect } from 'react';
import { Globe, ShieldAlert, Zap, Radio } from 'lucide-react';

const mockThreatLocations = [
  { city: 'Tokyo (AP-EAST)', attackType: 'XSS Injection', ip: '103.22.18.42', status: 'BLOCKED' },
  { city: 'Frankfurt (EU-CENTRAL)', attackType: 'Prompt Jailbreak', ip: '185.12.88.19', status: 'INTERCEPTED' },
  { city: 'New York (US-EAST)', attackType: 'RCE Payload', ip: '198.51.100.2', status: 'NEUTRALIZED' },
  { city: 'London (EU-WEST)', attackType: 'PII Exfiltration', ip: '81.2.109.11', status: 'MASKED' },
  { city: 'Singapore (AP-SOUTHEAST)', attackType: 'DDoS Burst', ip: '128.199.44.7', status: 'THROTTLED' },
];

export default function ThreatHeatmap() {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((curr) => (curr + 1) % mockThreatLocations.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 rounded-3xl border border-cyan-500/20 bg-[var(--panel-bg)]/85 p-5 shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-cyan-400 animate-spin-slow" />
          <h3 className="font-display text-base font-bold text-white tracking-wide">
            GLOBAL CYBER THREAT HEATMAP (3D)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-bold">100Hz GLOBAL WATCH</span>
        </div>
      </div>

      {/* SVG Interactive Globe Graphic */}
      <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#050B14]">
        {/* Animated Radial Radar Rings */}
        <div className="absolute h-44 w-44 rounded-full border border-cyan-500/20 animate-ping" />
        <div className="absolute h-32 w-32 rounded-full border border-cyan-400/30" />
        <div className="absolute h-20 w-20 rounded-full border border-cyan-400/40" />

        {/* Floating Globe SVG Elements */}
        <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 500 200">
          <path
            d="M 50,100 Q 150,40 250,100 T 450,100"
            fill="none"
            stroke="#00C8FF"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 80,140 Q 200,80 320,140 T 480,140"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Node Points */}
          <circle cx="100" cy="80" r="4" fill="#EF4444" />
          <circle cx="200" cy="120" r="4" fill="#00C8FF" />
          <circle cx="300" cy="70" r="4" fill="#F59E0B" />
          <circle cx="400" cy="110" r="4" fill="#10B981" />
        </svg>

        {/* Center Live Active Node HUD Banner */}
        <div className="relative z-10 rounded-2xl border border-cyan-400/40 bg-[#07101D]/90 px-4 py-2.5 text-center shadow-[0_0_24px_rgba(0,200,255,0.3)]">
          <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
            ACTIVE BLOCKED ATTACK NODE
          </div>
          <div className="mt-0.5 text-sm font-bold text-white">
            {mockThreatLocations[pulseIndex].city}
          </div>
          <div className="text-xs text-red-400 font-semibold">
            {mockThreatLocations[pulseIndex].attackType} ({mockThreatLocations[pulseIndex].ip})
          </div>
        </div>
      </div>

      {/* Threat Stream Feed Cards */}
      <div className="grid gap-2 sm:grid-cols-2">
        {mockThreatLocations.slice(0, 4).map((loc, idx) => (
          <div key={loc.city} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${idx === pulseIndex ? 'bg-red-500 animate-ping' : 'bg-cyan-400'}`} />
              <span className="text-slate-300 font-medium">{loc.city}</span>
            </div>
            <span className="font-mono text-cyan-300 font-bold">{loc.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
