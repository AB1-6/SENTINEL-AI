import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import { securityLogs, securityAlerts } from '@/services/mockData';

const statusCards = [
  { label: 'Zero Trust Status', value: 'Active', delta: 'Protected', tone: 'success' },
  { label: 'JWT Status', value: 'Enabled', delta: 'Verified', tone: 'info' },
  { label: 'RBAC Status', value: 'Enabled', delta: 'Policy enforced', tone: 'info' },
  { label: 'ML Detection', value: 'Online', delta: 'Classifier loaded', tone: 'success' },
];

export default function SecurityCenterPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassCard className="p-5">
          <SectionHeader eyebrow="Security" title="Blocked Prompts" description="Prompt injection and jailbreak attempts intercepted by the gateway." />
          <div className="mt-5 space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-white">{alert.title}</p>
                <p className="mt-1 text-sm text-slate-300">{alert.detail}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionHeader eyebrow="Logs" title="Security Telemetry" description="Every request leaves an audit trail for compliance and incident response." />
          <div className="mt-5 space-y-3">
            {securityLogs.map((log) => (
              <div key={`${log.time}-${log.action}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <div>
                  <p className="text-white">{log.action}</p>
                  <p className="text-xs text-slate-400">{log.source}</p>
                </div>
                <div className="text-right">
                  <p className="text-electric">Risk {log.risk}</p>
                  <p className="text-xs text-slate-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}