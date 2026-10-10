import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';
import {
  getAnalystNotifications,
  subscribeAnalystNotifications,
  markAnalystNotificationRead,
  markAllAnalystNotificationsRead,
  deleteAnalystNotification,
  clearAllAnalystNotifications,
  resetThreatIncidents,
} from '@/services/incidentResponseService';
import {
  ShieldAlert,
  Bell,
  Clock,
  User,
  Flame,
  Check,
  Copy,
  Trash2,
  CheckCheck,
  RotateCcw,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function SecOpsNotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [notifications, setNotifications] = useState(() => getAnalystNotifications());
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UNREAD' | 'CRITICAL' | 'JAILBREAK'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    return subscribeAnalystNotifications((updated) => {
      setNotifications(updated);
    });
  }, []);

  // Check Clearance: Only Security Analyst and Super Administrator can view SecOps notifications
  const isAuthorized =
    user?.role === 'Security Analyst' ||
    user?.role === 'Super Administrator' ||
    user?.email === 'alex.mercer@sentinel.local' ||
    user?.email === 'anlinpunneli@gmail.com';

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const criticalCount = useMemo(
    () => notifications.filter((n) => (n.riskScore || 0) >= 85 || n.severity === 'CRITICAL').length,
    [notifications]
  );
  const avgRisk = useMemo(() => {
    if (notifications.length === 0) return 0;
    const sum = notifications.reduce((acc, curr) => acc + (curr.riskScore || 90), 0);
    return Math.round(sum / notifications.length);
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Tab filter
      if (activeTab === 'UNREAD' && n.read) return false;
      if (activeTab === 'CRITICAL' && (n.riskScore || 0) < 85 && n.severity !== 'CRITICAL') return false;
      if (activeTab === 'JAILBREAK' && (n.classification || '').toUpperCase() !== 'JAILBREAK') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = [
          n.userFlagged,
          n.userName,
          n.userRole,
          n.userEmail,
          n.incidentId,
          n.incidentIdFormatted,
          n.prompt,
          n.rawPayload,
          n.classification,
          n.rule,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const handleCopyPrompt = (id, text) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    pushToast('Prompt copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleCopyReport = (n) => {
    playClickSound();
    const report = [
      `==================================================`,
      `SENTINEL AI 2.0 - SECOPS INCIDENT REPORT`,
      `==================================================`,
      `User Flagged: ${n.userFlagged || `${n.userName} (${n.userRole} • ${n.userEmail})`}`,
      `Incident Time: ${n.incidentTime || n.formattedTime}`,
      `Incident ID: ${n.incidentIdFormatted || `${n.incidentId} (Logged to Threat System Incident Response)`}`,
      `Live SecOps Alert: ${n.liveSecOpsAlert || '🚨 Live-notified to Alex Mercer (Security Analyst - SecOps Level 4)'}`,
      `Risk Score: ${n.riskScore}/100`,
      `Classification: ${n.classification || 'JAILBREAK'}`,
      `Zero-Trust Strikes: ${n.strikes || '1/3 Violations — Warning Recorded'}`,
      `Policy Action: ${n.policyAction || 'Zero-Trust gateway intercepted request prior to neural model transmission'}`,
      `--------------------------------------------------`,
      `Prompt Typed:`,
      `"${n.rawPayload || n.prompt}"`,
      `==================================================`,
    ].join('\n');

    navigator.clipboard.writeText(report);
    pushToast('Full SecOps Incident Report copied to clipboard', 'success');
  };

  // If unauthorized employee user
  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-4">
        <GlassCard className="border border-rose-500/40 bg-slate-950/90 p-8 text-center backdrop-blur-2xl shadow-2xl rounded-3xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <Lock className="h-8 w-8" />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 font-mono text-xs font-bold text-rose-400 uppercase tracking-widest">
            CLEARANCE LEVEL 4 (SECOPS) REQUIRED
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white tracking-tight">Access Restricted to Security Analyst</h2>
          <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            This incident notification feed contains real-time adversarial telemetry and is restricted strictly to
            <strong className="text-white"> Alex Mercer (Security Analyst)</strong> and Super Administrators.
          </p>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4 max-w-md mx-auto text-left text-xs font-mono space-y-1.5 text-slate-400">
            <div>Current User: <span className="text-white font-semibold">{user?.name || 'Standard Employee'}</span></div>
            <div>Role: <span className="text-sky-300">{user?.role || 'Standard Employee'}</span></div>
            <div>Clearance: <span className="text-amber-400">Level 2 (Workspace Standard)</span></div>
            <div>Policy Status: <span className="text-emerald-400">Enforced by Zero-Trust Gateway</span></div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/assistant')}
              className="rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-sky-400 transition"
            >
              Return to Enterprise Assistant
            </button>
            <button
              onClick={() => navigate('/')}
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-0.5 font-mono text-[11px] font-bold text-rose-400 uppercase tracking-wider">
              <ShieldAlert className="h-3.5 w-3.5" /> CLEARANCE LEVEL 4 • SECOPS NOTIFICATIONS
            </span>
            {unreadCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold text-white font-mono animate-pulse">
                {unreadCount} NEW UNREAD
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white lg:text-3xl">
            SecOps Threat Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time adversarial prompt interceptions & Zero-Trust gateway dispatches routed to{' '}
            <strong className="text-cyan-300">Alex Mercer (Security Analyst - SecOps Level 4)</strong>.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllAnalystNotificationsRead();
                playChimeSound();
                pushToast('All SecOps notifications marked as read', 'success');
              }}
              className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/15 px-3.5 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/25 transition"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              resetThreatIncidents();
              pushToast('Threat stream reloaded from verified baseline', 'info');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
            title="Reset verified baseline incident stream"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reload Dataset
          </button>

          <button
            onClick={() => navigate('/security')}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            Open Security Center
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <GlassCard className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Recorded Alerts</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-white">{notifications.length}</span>
            <span className="text-xs text-slate-500 font-mono">interceptions</span>
          </div>
        </GlassCard>

        <GlassCard className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-4">
          <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">Unread Dispatches</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-rose-300">{unreadCount}</span>
            <span className="text-xs text-rose-400 font-mono">awaiting review</span>
          </div>
        </GlassCard>

        <GlassCard className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4">
          <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">Critical Jailbreaks</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-amber-300">{criticalCount}</span>
            <span className="text-xs text-amber-400 font-mono">risk &gt; 85/100</span>
          </div>
        </GlassCard>

        <GlassCard className="rounded-2xl border border-sky-500/30 bg-sky-950/15 p-4">
          <div className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">Avg Intercepted Risk</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-sky-300">{avgRisk}</span>
            <span className="text-xs text-sky-400 font-mono">/ 100</span>
          </div>
        </GlassCard>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: `All Alerts (${notifications.length})` },
              { id: 'UNREAD', label: `Unread (${unreadCount})` },
              { id: 'CRITICAL', label: `Critical (${criticalCount})` },
              { id: 'JAILBREAK', label: 'Jailbreaks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(tab.id);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, payload, ID..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-rose-500/50 focus:outline-none"
            />
          </div>
        </div>
      </GlassCard>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <GlassCard className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-white">No Security Alerts Match Filter</h3>
            <p className="mt-1 text-xs text-slate-400">
              Zero-Trust guardrail perimeter is secure. No alerts found in current view.
            </p>
          </GlassCard>
        ) : (
          filteredNotifications.map((notif) => {
            const rawText = notif.rawPayload || notif.prompt || notif.promptSnippet || '';
            const uFlagged =
              notif.userFlagged ||
              `${notif.userName || 'David Kim'} (${notif.userRole || 'Standard Employee'} • ${notif.userEmail || 'employee@sentinel.local'})`;
            const iTime = notif.incidentTime || notif.formattedTime || 'Oct 10, 2026 • 10:07:08 PM';
            const iId = notif.incidentIdFormatted || `${notif.incidentId || notif.id} (Logged to Threat System Incident Response)`;
            const secAlert = notif.liveSecOpsAlert || '🚨 Live-notified to Alex Mercer (Security Analyst - SecOps Level 4)';
            const rScore = notif.riskScore || 87;
            const classLabel = notif.classification || 'JAILBREAK';
            const strikesText = notif.strikes || '1/3 Violations — Warning Recorded';
            const polAction =
              notif.policyAction ||
              notif.action ||
              'Zero-Trust gateway intercepted request prior to neural model transmission';

            return (
              <GlassCard
                key={notif.id}
                className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${
                  !notif.read
                    ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/25 via-slate-900/60 to-slate-900/40 shadow-lg shadow-rose-950/20'
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                {/* Unread Accent Pill on left border */}
                {!notif.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-amber-500" />
                )}

                <div className="space-y-3.5">
                  {/* Row 1: Badges & Incident Time Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-rose-500/40 bg-rose-500/20 px-2.5 py-0.5 font-mono text-[11px] font-bold text-rose-300">
                        {notif.severity || 'CRITICAL'}
                      </span>
                      <span className="font-mono text-xs font-bold text-white tracking-wide">
                        Incident ID: <span className="text-sky-300">{iId}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>Incident Time: <strong className="text-slate-200">{iTime}</strong></span>
                      {!notif.read && (
                        <span className="rounded bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.2 text-[9px] font-bold text-rose-300 uppercase">
                          UNREAD
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Live SecOps Alert Banner */}
                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 px-3.5 py-2 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-rose-200 font-mono">
                      <span className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">
                        Live SecOps Alert:
                      </span>
                      <span className="text-white font-medium">{secAlert}</span>
                    </div>
                    <span className="shrink-0 rounded bg-slate-950/80 border border-rose-500/30 px-2 py-0.5 text-[10px] font-mono text-rose-300">
                      SecOps Level 4 Dispatched
                    </span>
                  </div>

                  {/* Row 3: User Flagged Header */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-500/30">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 mr-2 font-bold tracking-wider">
                          User Flagged:
                        </span>
                        <span className="font-bold text-white text-xs">{uFlagged}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                      <span>Gateway IP: <strong className="text-slate-200">{notif.ip || '198.51.100.42'}</strong></span>
                      <span>•</span>
                      <span>Rule: <strong className="text-sky-300">{notif.rule || 'RULE-401_ADVERSARIAL_JAILBREAK'}</strong></span>
                    </div>
                  </div>

                  {/* Row 4: Attempted Prompt Typed Box */}
                  <div className="rounded-xl border border-rose-500/30 bg-slate-950 p-3.5 shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-500/20 mb-2">
                      <span className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                        <Flame className="h-3.5 w-3.5 text-rose-400" />
                        Prompt Typed:
                      </span>

                      <button
                        onClick={() => handleCopyPrompt(notif.id, rawText)}
                        className="flex items-center gap-1 rounded bg-slate-900 border border-slate-700 px-2 py-1 text-[10px] font-mono text-sky-400 hover:text-sky-300 hover:border-sky-500 transition"
                      >
                        {copiedId === notif.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="font-mono text-xs text-rose-200 leading-relaxed break-words whitespace-pre-wrap bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20">
                      "{rawText}"
                    </div>
                  </div>

                  {/* Row 5: 4-Column Zero-Trust Telemetry Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
                    {/* Risk Score */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                      <div className="text-[10px] uppercase text-slate-400">Risk Score</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-bold text-rose-400 text-sm">{rScore}/100</span>
                        <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-bold text-rose-300">
                          {rScore >= 80 ? 'CRITICAL' : 'ELEVATED'}
                        </span>
                      </div>
                    </div>

                    {/* Classification */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                      <div className="text-[10px] uppercase text-slate-400">Classification</div>
                      <div className="mt-1 font-bold text-amber-300 text-sm truncate">
                        {classLabel}
                      </div>
                    </div>

                    {/* Zero-Trust Strikes */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                      <div className="text-[10px] uppercase text-slate-400">Zero-Trust Strikes</div>
                      <div className="mt-1 font-bold text-sky-300 text-xs truncate">
                        {strikesText}
                      </div>
                    </div>

                    {/* Policy Action */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2.5">
                      <div className="text-[10px] uppercase text-slate-400">Policy Action</div>
                      <div className="mt-1 font-medium text-emerald-400 text-[11px] truncate" title={polAction}>
                        {polAction}
                      </div>
                    </div>
                  </div>

                  {/* Row 6: Card Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      {!notif.read ? (
                        <button
                          onClick={() => {
                            playClickSound();
                            markAnalystNotificationRead(notif.id);
                            pushToast('Marked as read', 'info');
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          Mark as Read
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                          <CheckCheck className="h-3.5 w-3.5 text-slate-500" /> Reviewed by Analyst
                        </span>
                      )}

                      <button
                        onClick={() => handleCopyReport(notif)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy SecOps Report
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          playClickSound();
                          deleteAnalystNotification(notif.id);
                          pushToast('Notification dismissed', 'info');
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Dismiss notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => navigate('/security')}
                        className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
                      >
                        Inspect Forensic in Security Center
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
