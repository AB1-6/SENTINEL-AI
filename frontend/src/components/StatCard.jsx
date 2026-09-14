import GlassCard from './GlassCard';

const tones = {
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  info: 'text-electric',
};

export default function StatCard({ label, value, delta, tone = 'info' }) {
  return (
    <GlassCard className="p-5">
      <p className="text-sm text-slate-300">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold text-white">{value}</div>
        <div className={`text-sm font-medium ${tones[tone] || tones.info}`}>{delta}</div>
      </div>
    </GlassCard>
  );
}