import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RotatingShield from '@/components/RotatingShield';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const BOOT_STAGES = [
  'INITIALIZING ZERO-TRUST CORE...',
  'LOADING ML PROMPT SECURITY MODELS...',
  'VERIFYING JWT ENCRYPTION KEYS...',
  'ESTABLISHING ENTERPRISE ENCLAVE...',
  'AUTHENTICATION GATEWAY READY',
];

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        const next = prev + 5;
        const newStage = Math.min(Math.floor((next / 100) * (BOOT_STAGES.length - 1)), BOOT_STAGES.length - 1);
        setStageIndex(newStage);
        return next;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setProgress(100);
    if (onComplete) onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#02040c]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(34,163,255,0.35)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(77,215,255,0.15),transparent_60%)] pointer-events-none" />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 text-center max-w-lg px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <RotatingShield size={240} />

        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-cyan-400 font-mono">Sentinel AI 2.0</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl font-display">Enterprise AI Assistant</h1>
          <p className="mt-1 text-sm text-slate-400">Zero-Trust Intelligence & LLM Security Gateway</p>
        </div>

        {/* Boot Status & Progress Bar */}
        <div className="w-full space-y-3 mt-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
              {BOOT_STAGES[stageIndex]}
            </span>
            <span className="text-cyan-400 font-bold">{progress}%</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_12px_#4dd7ff]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Quick Access Button */}
        <button
          onClick={handleSkip}
          className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors py-1 px-3 rounded-full border border-white/10 hover:border-cyan-400/40 bg-white/5"
        >
          <span>ENTER ACCESS PORTAL NOW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
}