import { useState, useEffect } from 'react';
import { Bot, ShieldCheck, DollarSign, FileCheck, Terminal, Cpu, Zap, Activity } from 'lucide-react';
import GlassCard from './GlassCard';

const AGENTS = [
  {
    id: 'security',
    name: 'Sentinel-Alpha',
    role: 'Zero-Trust Gatekeeper',
    icon: ShieldCheck,
    status: 'REAL-TIME FILTERING',
    color: 'sky',
    summary: 'Intercepted 1,482 prompt injections; masked 847 PII tokens client-side.',
    heartbeat: 'Operational (0.8ms poll)'
  },
  {
    id: 'financial',
    name: 'Gemma-Finance',
    role: 'Autonomous Cashflow Copilot',
    icon: DollarSign,
    status: 'SOLVENCY MONITORING',
    color: 'emerald',
    summary: 'Modeled 30-day runway (61 Days Solvent). Flagged ₹1,20,000 late invoice for collection.',
    heartbeat: 'Operational (2.1s cycle)'
  },
  {
    id: 'redteam',
    name: 'RedTeam-Probe',
    role: 'Continuous Jailbreak Fuzzer',
    icon: Zap,
    status: 'ACTIVE FUZZING',
    color: 'amber',
    summary: 'Stress-tested 420 adversarial payloads; 0 successful zero-trust bypasses.',
    heartbeat: 'Fuzzing Suite Active'
  },
  {
    id: 'auditor',
    name: 'Auditor-Ledger',
    role: 'SOC 2 & Tamper-Proof Cryptography',
    icon: FileCheck,
    status: 'IMMUTABLE RECORDING',
    color: 'purple',
    summary: 'Cryptographically sealed 48,910 prompt transactions with SHA-256 hashes.',
    heartbeat: 'Ledger Synced'
  },
];

const INITIAL_LOGS = [
  { time: '10:44:02', agent: 'Sentinel-Alpha', msg: 'Zero-Knowledge PII Masking applied on incoming prompt stream (0ms data leak).' },
  { time: '10:43:58', agent: 'Gemma-Finance', msg: '30-Day Solvency Runway evaluated at 61 Days. Invoice reminder queue updated.' },
  { time: '10:43:41', agent: 'RedTeam-Probe', msg: 'Fuzzing payload with Base64 DAN 14.0 variant... Intercepted by ML filter [Rule 401].' },
  { time: '10:43:20', agent: 'Auditor-Ledger', msg: 'Block sealed with cryptographic proof: 0x7f2c8d4e9a19... Status: IMMUTABLE.' },
];

export default function MultiAgentSwarm() {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  // Rotate active agent indicator
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((curr) => (curr + 1) % AGENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <GlassCard className="p-6 border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Autonomous Multi-Agent Security & Copilot Swarm</h3>
            <p className="text-[11px] text-slate-400">Coordinated specialized agents executing continuous defense, financial modeling, and audit sealing.</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          4 AGENTS COOPERATING
        </span>
      </div>

      {/* 4-Agent Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AGENTS.map((agent, idx) => {
          const Icon = agent.icon;
          const isActive = idx === activeStep;
          return (
            <div
              key={agent.id}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                isActive 
                  ? 'border-sky-500/40 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.12)]' 
                  : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sky-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{agent.name}</h4>
                    <p className="text-[10px] text-slate-400">{agent.role}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <span className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-400">
                  {agent.status}
                </span>
                <p className="mt-2 text-[11px] text-slate-300 leading-relaxed font-sans">{agent.summary}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Heartbeat:</span>
                <span className="text-slate-400">{agent.heartbeat}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Agent Terminal Stream */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Terminal className="h-3.5 w-3.5 text-sky-400" />
            Live Swarm Telemetry Terminal:
          </span>
          <span className="text-[10px] text-emerald-400">WebSocket Connected (127.0.0.1)</span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-slate-500 shrink-0">{log.time}</span>
              <span className="text-sky-400 font-bold shrink-0">[{log.agent}]:</span>
              <span className="text-slate-300">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
