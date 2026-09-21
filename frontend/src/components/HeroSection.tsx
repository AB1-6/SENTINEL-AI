import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Activity, Cpu, ArrowRight, Lock, Server } from 'lucide-react';

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="overflow-hidden p-6 lg:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        {/* Left Column: Executive Value Proposition */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Zero-Trust AI Defense Layer Active
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[40px] leading-tight">
            Every prompt, file, and model session screened before execution.
          </h1>

          <p className="mt-3.5 text-sm leading-relaxed text-slate-300 max-w-xl">
            Sentinel AI 2.0 intercepts adversarial jailbreaks, client-side PII leaks, and unauthorized document access across Google Gemini and Gemma 2 Copilots.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/assistant"
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-400 shadow-md"
            >
              Open Assistant Console
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/security"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              Security Center & OWASP
            </Link>
            <Link
              to="/financial"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
            >
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              Gemma Copilot
            </Link>
          </div>
        </div>

        {/* Right Column: High-Tech Enterprise Telemetry & Gateway Cluster */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-sky-400" />
              <span className="font-mono text-xs font-semibold text-white">Edge Cluster: us-east-01</span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              OPERATIONAL
            </span>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
              <span className="text-[10px] uppercase text-slate-400">Gate Overhead</span>
              <p className="mt-1 text-base font-bold text-white">12.4ms</p>
              <span className="text-[10px] text-emerald-400">⚡ Sub-15ms Latency</span>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
              <span className="text-[10px] uppercase text-slate-400">Defense Rate</span>
              <p className="mt-1 text-base font-bold text-sky-400">99.8%</p>
              <span className="text-[10px] text-slate-400">Zero-Trust SLA</span>
            </div>
          </div>

          {/* Active Model Stack */}
          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2 border border-slate-800/60">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                Gemini 1.5 Flash (Cloud Gateway)
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">ONLINE</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2 border border-slate-800/60">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Gemma 2 9B (Secure SME Copilot)
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">ENFORCING</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-sans">
            <span className="flex items-center gap-1 text-slate-300">
              <Lock className="h-3 w-3 text-sky-400" />
              Continuous Verification Mode
            </span>
            <span className="font-mono text-slate-500">SHA-256 Verified</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
