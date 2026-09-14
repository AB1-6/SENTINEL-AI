import React from 'react';
import { ShieldCheck, Cpu, HardDrive, Lock, Activity, X, Zap } from 'lucide-react';
import GlassCard from './GlassCard';

export default function SecurityDiagnosticModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <GlassCard className="relative w-full max-w-lg p-6 futuristic-panel border-cyan-400/30 shadow-[0_0_60px_rgba(77,215,255,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_20px_rgba(77,215,255,0.2)]">
            <ShieldCheck className="h-6 w-6 text-cyan-300" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">SENTINEL AI DIAGNOSTICS</h3>
            <p className="text-xs text-cyan-300/80">Zero-Trust System Telemetry & Encryption Status</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl border border-white/8 bg-black/40 p-3.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Gateway Pipeline</span>
            </div>
            <p className="mt-2 font-display text-sm font-semibold text-emerald-400">OPERATIONAL (100%)</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/40 p-3.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>Cipher Engine</span>
            </div>
            <p className="mt-2 font-display text-sm font-semibold text-cyan-300">AES-256-GCM / TLS 1.3</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/40 p-3.5">
            <div className="flex items-center gap-2 text-slate-400">
              <HardDrive className="h-4 w-4 text-cyan-400" />
              <span>Persistence Layer</span>
            </div>
            <p className="mt-2 font-display text-sm font-semibold text-emerald-400">In-Memory Demo Active</p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/40 p-3.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span>ML Classifier</span>
            </div>
            <p className="mt-2 font-display text-sm font-semibold text-cyan-300">Jailbreak Guard v2.4</p>
          </div>
        </div>

        {/* Active Protection Status */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span>Zero-Trust Shield Active & Enforcing Policies</span>
          </div>
          <span className="font-mono font-semibold">100Hz LIVE</span>
        </div>
      </GlassCard>
    </div>
  );
}
