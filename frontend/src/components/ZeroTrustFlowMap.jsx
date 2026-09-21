import { useState } from 'react';
import { 
  ShieldCheck, Lock, Cpu, Server, CheckCircle2, 
  Eye, Zap, AlertTriangle, ArrowRight, Shield 
} from 'lucide-react';
import GlassCard from './GlassCard';
import SectionHeader from './SectionHeader';
import { playClickSound } from '@/utils/soundEffects';

const PIPELINE_NODES = [
  {
    id: 'client',
    number: '01',
    name: 'Client Ingress',
    icon: Lock,
    status: 'ACTIVE',
    latency: '1.2ms',
    rule: 'JWT Bearer & Device Fingerprint Validation',
    detail: 'Cryptographically verifies the session token and user identity clearance level before payload release.'
  },
  {
    id: 'waf',
    number: '02',
    name: 'Edge WAF',
    icon: Server,
    status: 'ENFORCED',
    latency: '2.4ms',
    rule: 'DDoS Throttling & Geofence Protection',
    detail: 'Inspects packet headers, limits request burst rates, and filters blacklisted CIDR blocks.'
  },
  {
    id: 'pii',
    number: '03',
    name: 'ZK PII Redactor',
    icon: Zap,
    status: 'MASKING',
    latency: '1.8ms',
    rule: 'Client-Side Zero-Knowledge Entity Scrubbing',
    detail: 'Anonymizes emails, SSNs, credit cards, and confidential tokens before data touches any network proxy.'
  },
  {
    id: 'classifier',
    number: '04',
    name: 'ML Jailbreak Guard',
    icon: ShieldCheck,
    status: 'INSPECTING',
    latency: '4.6ms',
    rule: 'Neural Adversarial Classifier v2.4',
    detail: 'Detects DAN bypasses, indirect prompt injections, and system instruction leakage attempts with 99.4% precision.'
  },
  {
    id: 'gateway',
    number: '05',
    name: 'Dual LLM Gateway',
    icon: Cpu,
    status: 'ROUTING',
    latency: '8.2ms',
    rule: 'Gemini 1.5 Flash ⇄ Gemma 2 Copilot',
    detail: 'Enforces strict tenant isolation, token budgets, and zero-data-retention agreements on cloud and local engines.'
  },
  {
    id: 'egress',
    number: '06',
    name: 'Egress & Audit Seal',
    icon: Shield,
    status: 'SEALED',
    latency: '1.4ms',
    rule: 'Tamper-Evident SHA-256 Ledger',
    detail: 'Sanitizes model output, strips residual secrets, and logs immutable cryptographic audit proof to the SecOps stream.'
  }
];

export default function ZeroTrustFlowMap() {
  const [selectedNode, setSelectedNode] = useState(PIPELINE_NODES[3]); // Default to ML Jailbreak Guard

  return (
    <GlassCard className="p-6 border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <SectionHeader 
          eyebrow="Architecture Map" 
          title="Zero-Trust Defense-in-Depth Pipeline" 
          description="Interactive real-time visualization of every request checkpoint from client ingress to model egress." 
        />
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cumulative Pipeline Overhead: </span>
          <span className="font-bold text-sky-400">19.6ms</span>
        </div>
      </div>

      {/* Interactive Horizontal Pipeline */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PIPELINE_NODES.map((node, index) => {
          const Icon = node.icon;
          const isSelected = selectedNode.id === node.id;
          return (
            <div
              key={node.id}
              onClick={() => {
                playClickSound();
                setSelectedNode(node);
              }}
              className={`relative group cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                isSelected 
                  ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.15)] scale-[1.02]' 
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">{node.number}</span>
                <span className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-emerald-400">
                  {node.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className={`p-2 rounded-xl border ${
                  isSelected 
                    ? 'bg-sky-500 text-slate-950 border-sky-400' 
                    : 'bg-slate-900 text-sky-400 border-slate-800'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <h4 className="mt-3 text-xs font-semibold text-white truncate">{node.name}</h4>
              <p className="mt-0.5 font-mono text-[10px] text-slate-400">+{node.latency}</p>

              {/* Progress Connector Indicator */}
              {index < PIPELINE_NODES.length - 1 && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Telemetry Deep-Dive Drawer */}
      <div className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-bold">Checkpoint {selectedNode.number} Telemetry:</span>
            <span className="text-white font-semibold">{selectedNode.name}</span>
          </div>
          <span className="text-emerald-400 font-bold">Latency: {selectedNode.latency}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="font-mono text-[11px] text-slate-400 uppercase">Active Enforced Rule</span>
            <p className="mt-0.5 font-medium text-slate-200">{selectedNode.rule}</p>
          </div>
          <div>
            <span className="font-mono text-[11px] text-slate-400 uppercase">Security Assurance</span>
            <p className="mt-0.5 text-slate-300 leading-relaxed text-xs">{selectedNode.detail}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
