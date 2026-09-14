import { useState, useEffect } from 'react';
import { Bot, ShieldCheck, DollarSign, FileCheck, CheckCircle2 } from 'lucide-react';

const agents = [
  {
    id: 'financial',
    name: 'Financial Analyst Agent',
    role: 'Gemma Cashflow Copilot',
    icon: DollarSign,
    color: 'emerald',
    status: 'ACTIVE AUDITING',
    lastTask: 'Analyzed 30-day runway projection (61 Days Solvent). Identified ₹1,20,000 late invoice collection opportunity.',
  },
  {
    id: 'security',
    name: 'Security Bouncer Agent',
    role: 'Sentinel Zero-Trust Gateway',
    icon: ShieldCheck,
    color: 'cyan',
    status: 'REAL-TIME FILTERING',
    lastTask: 'Neutralized 124 prompt injection attempts and masked 187 credit card/PII inputs client-side.',
  },
  {
    id: 'compliance',
    name: 'Compliance Auditor Agent',
    role: 'SOC2 & GDPR Sentinel',
    icon: FileCheck,
    color: 'purple',
    status: 'REPORT READY',
    lastTask: 'Compiled weekly executive compliance report with 99.98% zero-trust gateway uptime.',
  },
];

export default function MultiAgentSwarm() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((curr) => (curr + 1) % agents.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-[var(--panel-bg)]/85 p-5 shadow-glass">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-400" />
          <h3 className="font-display text-base font-bold text-white tracking-wide">
            MULTI-AGENT AUTONOMOUS SECURITY & FINANCIAL SWARM
          </h3>
        </div>
        <span className="rounded-md border border-purple-500/40 bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
          3 AGENTS PARALLEL
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {agents.map((agent, idx) => {
          const Icon = agent.icon;
          const isActive = idx === activeStep;
          return (
            <div
              key={agent.id}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                isActive
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,200,255,0.2)]'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> {agent.status}
                </span>
              </div>

              <h4 className="font-display font-semibold text-white text-sm mt-3">{agent.name}</h4>
              <p className="text-[11px] text-cyan-300 font-mono">{agent.role}</p>

              <div className="mt-2.5 rounded-xl bg-black/40 p-2.5 text-[11px] leading-relaxed text-slate-300 border border-white/5">
                {agent.lastTask}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
