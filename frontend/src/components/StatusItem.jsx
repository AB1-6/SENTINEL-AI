import { motion } from 'framer-motion';

export default function StatusItem({ label, value, tone = 'neutral', updated = null }) {
  const colorClass = tone === 'success' ? 'bg-green-400' : tone === 'electric' ? 'bg-electric' : tone === 'neutral' ? 'bg-slate-400' : 'bg-yellow-400';

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <motion.span
          className={`inline-block rounded-full w-3 h-3 ${colorClass}`}
          animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.5, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-sm">{label}</span>
      </div>

      <div className="text-right">
        <div className="text-sm font-medium text-white">{value}</div>
        {updated ? <div className="mt-0.5 text-[11px] text-slate-300">{updated}</div> : null}
      </div>
    </div>
  );
}
