import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import GlassCard from './GlassCard';

export default function RiskMeter({ score = 4, details = null, className = '' }) {
  // score ranges 0-100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine status color & label
  let statusLabel = 'SAFE';
  let color = '#4dd7ff';
  let glowColor = 'rgba(77,215,255,0.4)';
  let Icon = ShieldCheck;

  if (normalizedScore > 50) {
    statusLabel = 'HIGH RISK';
    color = '#ff4d6d';
    glowColor = 'rgba(255,77,109,0.4)';
    Icon = ShieldAlert;
  } else if (normalizedScore > 20) {
    statusLabel = 'ELEVATED';
    color = '#ffb703';
    glowColor = 'rgba(255,183,3,0.4)';
    Icon = AlertTriangle;
  }

  // SVG Gauge calculations
  // Arc angle from -120deg to 120deg (240 deg span)
  const angle = -120 + (normalizedScore / 100) * 240;

  return (
    <GlassCard className={`p-5 futuristic-panel ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" style={{ color }} />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.25em]" style={{ color }}>
            Zero-Trust Risk Engine
          </span>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
          style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}40` }}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center sm:flex-row sm:justify-around sm:gap-6">
        {/* SVG Circular Arc Gauge */}
        <div className="relative flex h-36 w-36 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="8"
              strokeDasharray="226 75"
              strokeDashoffset="-38"
              strokeLinecap="round"
            />
            {/* Active Gauge Arc */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray="301"
              strokeDashoffset={301 - (normalizedScore / 100) * 200}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.4s ease',
                filter: `drop-shadow(0 0 8px ${glowColor})`,
              }}
            />
          </svg>

          {/* Center Score readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-3xl font-bold tracking-tight text-white">{normalizedScore}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400">Risk Score</span>
          </div>
        </div>

        {/* Breakdown Details */}
        <div className="mt-3 sm:mt-0 space-y-2 text-xs w-full max-w-[200px]">
          <div className="flex justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
            <span className="text-slate-400">Prompt Injection</span>
            <span className="font-mono font-medium text-emerald-400">0.01</span>
          </div>
          <div className="flex justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
            <span className="text-slate-400">PII Leak Risk</span>
            <span className="font-mono font-medium text-cyan-300">0.00</span>
          </div>
          <div className="flex justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2">
            <span className="text-slate-400">Jailbreak Threat</span>
            <span className="font-mono font-medium text-emerald-400">PASSED</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
