import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import SentinelCore from './SentinelCore';

type Props = {
  duration?: number; // milliseconds until reveal
  onSidebarShow?: () => void;
  onFinish?: () => void;
};

export default function SplashScreen({ duration = 3000, onSidebarShow, onFinish }: Props) {
  const containerControls = useAnimation();
  const coreControls = useAnimation();

  useEffect(() => {
    let mounted = true;

    async function sequence() {
      // initial: full black. Fade overlay quickly to reveal core
      await containerControls.start({ opacity: 1 });

      // reveal core
      await coreControls.start({ opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } });

      // increase glow slightly
      coreControls.start({ boxShadow: '0 20px 60px rgba(34,163,255,0.16)', transition: { duration: 1.2 } });

      // wait for requested duration
      await new Promise((r) => setTimeout(r, duration));

      // notify parent to reveal sidebar/dashboard
      if (onSidebarShow) onSidebarShow();

      // exit animation for splash
      await containerControls.start({ opacity: 0, y: -12, transition: { duration: 0.6, ease: 'easeInOut' } });

      if (!mounted) return;
      if (onFinish) onFinish();
    }

    // start with core hidden and small
    coreControls.set({ opacity: 0, scale: 0.92, boxShadow: '0 6px 18px rgba(34,163,255,0.06)' });
    containerControls.set({ opacity: 1, y: 0 });
    sequence();

    return () => {
      mounted = false;
    };
  }, [containerControls, coreControls, duration, onSidebarShow, onFinish]);

  return (
    <motion.div
      aria-hidden={false}
      initial={{ opacity: 1 }}
      animate={containerControls}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
          style={{ willChange: 'transform' }}
        >
          <motion.div animate={coreControls} className="relative">
            <div className="mx-auto" style={{ width: 340, height: 340 }}>
              <SentinelCore size={320} intensity={0.7} />
            </div>
            {/* energy platform */}
            <motion.div
              initial={{ scaleX: 0.6, scaleY: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 0.85 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute left-1/2 top-[74%] -translate-x-1/2 -translate-y-1/2 h-6 w-[320px] rounded-full bg-gradient-to-r from-cyan-400/10 via-cyan-300/8 to-transparent blur-[14px]"
            />
          </motion.div>
        </motion.div>

        {/* subtle particle field */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <div className="relative w-full h-full overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="absolute block rounded-full bg-white/8"
                style={{
                  width: `${4 + (i % 4)}px`,
                  height: `${4 + (i % 4)}px`,
                  left: `${(i * 73) % 100}%`,
                  top: `${20 + (i * 37) % 60}%`,
                  animation: `splashFloat ${(8 + (i % 6))}s ease-in-out ${-(i % 5)}s infinite`,
                  filter: 'blur(6px)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splashFloat {
          0% { transform: translateY(0) translateX(0); opacity: 0.06 }
          50% { transform: translateY(-18px) translateX(6px); opacity: 0.18 }
          100% { transform: translateY(0) translateX(0); opacity: 0.06 }
        }
      `}</style>
    </motion.div>
  );
}
