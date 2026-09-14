import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import { assistantGreeting, dashboardStats, quickActions, recentAiActivity, securityAlerts } from '@/services/mockData';
import DataFlow from '@/components/DataFlow.tsx';
import BackgroundLayers from '@/components/BackgroundLayers';
import HeroSection from '@/components/HeroSection';
import TelemetryStream from '@/components/TelemetryStream';
import RiskMeter from '@/components/RiskMeter';

import RiskAnalyticsChart from '@/components/RiskAnalyticsChart';
import ThreatHeatmap from '@/components/ThreatHeatmap';
import MultiAgentSwarm from '@/components/MultiAgentSwarm';
import ComplianceReportGenerator from '@/components/ComplianceReportGenerator';

export default function DashboardPage() {
  return (
    <div className="space-y-6 relative">
      <BackgroundLayers />
      <DataFlow />
      <GlassCard>
        <div className="p-4 flex items-center justify-between flex-wrap gap-4">
          <HeroSection />
          <ComplianceReportGenerator />
        </div>
      </GlassCard>

      <MultiAgentSwarm />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <RiskAnalyticsChart />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <ThreatHeatmap />
          <TelemetryStream />
          <GlassCard className="p-6">
          <SectionHeader eyebrow="Activity" title="Recent AI Activity" description="A compact view of secure platform events and assistant usage." />
          <div className="mt-5 space-y-3">
            {recentAiActivity.map((item) => (
              <div key={`${item.time}-${item.title}`} className="flex gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-4">
                <div className="w-24 shrink-0 text-xs uppercase tracking-[0.25em] text-cyan-300/80">{item.time}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white">{item.title}</p>
                    <span className="rounded-full border border-electric/20 bg-electric/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.2em] text-electric">{item.badge}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        </div>

        <div className="space-y-6">
          <RiskMeter score={8} />
          <GlassCard className="p-6">
            <SectionHeader eyebrow="Actions" title="Quick Actions" description="Jump to the most common security and productivity workflows." />
            <div className="mt-5 grid gap-3">
              {quickActions.map((action) => (
                <Link key={action.route} to={action.route} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-electric/30 hover:bg-electric/8 neon-hover neon-border">
                  <div className="font-medium text-white">{action.title}</div>
                  <div className="mt-1 text-sm text-slate-300">{action.description}</div>
                </Link>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <SectionHeader eyebrow="Security" title="Active Alerts" description="The latest protected events recorded by the platform." />
            <div className="mt-5 space-y-3">
              {securityAlerts.map((alert) => (
                <div key={`${alert.time}-${alert.title}`} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{alert.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{alert.detail}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${alert.tone === 'danger' ? 'bg-danger/10 text-danger' : alert.tone === 'warning' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      {alert.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}