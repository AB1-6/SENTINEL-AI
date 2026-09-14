import { motion } from 'framer-motion';
import RotatingShield from '@/components/RotatingShield';
import brandHorizontal from '@/assets/logo-horizontal.svg';

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,163,255,0.24),_transparent_28%),linear-gradient(180deg,#0b1326_0%,#050816_70%)]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_center,_rgba(77,215,255,0.22),_transparent_70%)] blur-3xl" />
      <motion.div
        className="relative z-10 grid min-h-screen place-items-center px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6 text-white">
            <div className="flex items-center gap-4">
              <RotatingShield size={100} compact />
              <img src={brandHorizontal} alt="Sentinel AI 2.0" className="h-12 drop-shadow-[0_0_24px_rgba(34,163,255,0.22)]" />
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-electric/20 bg-white/5 px-4 py-2 text-sm text-electric backdrop-blur-xl">
              Sentinel AI 2.0 Enterprise Security Layer
            </div>
            <h1 className="font-display max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">Enterprise AI, guarded by Zero Trust before every LLM request.</h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">JWT authentication, RBAC, ML jailbreak detection, prompt risk scoring, security logging, document intelligence, and an AI gateway wrapped in a commercial-grade interface.</p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Zero Trust</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">JWT + RBAC</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">ML Jailbreak Detection</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">Gemini Gateway</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}