import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/contexts/ToastContext';

const tones = {
  info: 'border-electric/30 bg-[#091525] text-electric',
  success: 'border-success/30 bg-[#0b1b14] text-success',
  warning: 'border-warning/30 bg-[#1d1507] text-warning',
  danger: 'border-danger/30 bg-[#220d13] text-danger',
};

export default function ToastHost() {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className={`rounded-2xl border px-4 py-3 shadow-glass backdrop-blur-xl ${tones[toast.tone] || tones.info}`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}