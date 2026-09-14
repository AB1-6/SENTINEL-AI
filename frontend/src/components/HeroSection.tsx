import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SentinelCore from './SentinelCore';
import StatusItem from './StatusItem';

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="overflow-hidden p-6 lg:p-8 hero-glass"
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-electric/80">Command Center</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-white lg:text-5xl">
            Sentinel AI 2.0 keeps every request, file, and session under control.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
            Secure, intelligent AI for observability, data protection, and policy enforcement across your stack.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/assistant" className="rounded-2xl px-5 py-3 text-sm font-medium text-black transition neon-hover" style={{ background: 'linear-gradient(90deg,#4dd7ff,#22a3ff)', boxShadow: '0 8px 30px rgba(34,163,255,0.12)' }}>
              Start Secure Chat
            </Link>
            <Link to="/documents" className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 glass-btn">
              Review Documents
            </Link>
          </div>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-[#08111f]/80 p-5 shadow-[0_0_40px_rgba(0,200,255,0.08)] card-tilt">
          {/* SentinelCore positioned visually to the top-right of this panel, but mounted inside hero so it doesn't affect layout */}
          <div className="absolute right-6 top-6 pointer-events-none">
            <SentinelCore size={260} intensity={0.85} />
          </div>

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Live Status</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <StatusItem label="Gateway" value="Online" tone="success" updated="Just now" />
              <StatusItem label="Model Routing" value="Protected" tone="electric" updated="2m ago" />
              <StatusItem label="RBAC" value="Enforced" tone="success" updated="5m ago" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
