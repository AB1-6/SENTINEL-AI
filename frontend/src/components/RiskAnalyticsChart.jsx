import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { ShieldAlert, TrendingUp, Lock, Zap } from 'lucide-react';

const mock24hData = [
  { time: '00:00', avgRisk: 12, jailbreaks: 1, piiRedactions: 3, rceBlocks: 0 },
  { time: '02:00', avgRisk: 8, jailbreaks: 0, piiRedactions: 1, rceBlocks: 0 },
  { time: '04:00', avgRisk: 15, jailbreaks: 2, piiRedactions: 4, rceBlocks: 1 },
  { time: '06:00', avgRisk: 10, jailbreaks: 0, piiRedactions: 2, rceBlocks: 0 },
  { time: '08:00', avgRisk: 45, jailbreaks: 8, piiRedactions: 12, rceBlocks: 3 },
  { time: '10:00', avgRisk: 78, jailbreaks: 19, piiRedactions: 28, rceBlocks: 7 },
  { time: '12:00', avgRisk: 92, jailbreaks: 34, piiRedactions: 41, rceBlocks: 12 },
  { time: '14:00', avgRisk: 64, jailbreaks: 14, piiRedactions: 22, rceBlocks: 4 },
  { time: '16:00', avgRisk: 88, jailbreaks: 29, piiRedactions: 35, rceBlocks: 9 },
  { time: '18:00', avgRisk: 52, jailbreaks: 11, piiRedactions: 18, rceBlocks: 2 },
  { time: '20:00', avgRisk: 28, jailbreaks: 4, piiRedactions: 9, rceBlocks: 1 },
  { time: '22:00', avgRisk: 18, jailbreaks: 2, piiRedactions: 5, rceBlocks: 0 },
];

export default function RiskAnalyticsChart() {
  const [viewMode, setViewMode] = useState('trend'); // 'trend' | 'breakdown'

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-[var(--panel-bg)]/80 p-5 shadow-glass">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[var(--accent)] animate-pulse" />
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              24-HOUR ZERO-TRUST RISK ANALYTICS
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time prompt risk scores, jailbreak spike tracking, and zero-knowledge PII redactions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setViewMode('trend')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'trend'
                ? 'bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Risk Score Trend
          </button>
          <button
            onClick={() => setViewMode('breakdown')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === 'breakdown'
                ? 'bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent-glow)]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Threat Category Spikes
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-3">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>Peak Risk Score</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-bold text-white">92% <span className="text-xs font-normal text-red-400">CRITICAL</span></div>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-3">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>Jailbreaks Blocked</span>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-bold text-white">124 <span className="text-xs font-normal text-amber-400">Intercepted</span></div>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>ZK PII Masked</span>
            <Lock className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-bold text-white">187 <span className="text-xs font-normal text-emerald-400">Redacted</span></div>
        </div>
        <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-3">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span>RCE / XSS Neutralized</span>
            <Zap className="h-4 w-4" />
          </div>
          <div className="mt-1 text-xl font-bold text-white">38 <span className="text-xs font-normal text-purple-400">Payloads</span></div>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'trend' ? (
            <AreaChart data={mock24hData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C8FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00C8FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#07101D',
                  borderColor: 'rgba(0,200,255,0.4)',
                  borderRadius: '16px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="avgRisk" name="Avg Prompt Risk Score (%)" stroke="#00C8FF" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" />
            </AreaChart>
          ) : (
            <BarChart data={mock24hData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#07101D',
                  borderColor: 'rgba(245,158,11,0.4)',
                  borderRadius: '16px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="jailbreaks" name="Jailbreaks" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="piiRedactions" name="PII Redactions" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rceBlocks" name="RCE/XSS Blocks" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
