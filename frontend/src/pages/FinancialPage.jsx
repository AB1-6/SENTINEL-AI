import { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import WhatIfCalculator from '@/components/WhatIfCalculator';
import InvoiceCollectionModal from '@/components/InvoiceCollectionModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { 
  Wallet, TrendingUp, AlertCircle, Send, CheckCircle2, Clock,
  Zap, Sparkles, X, MailCheck, Settings, Play, RefreshCw, Key, Check, ExternalLink, Phone
} from 'lucide-react';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';
import { sampleInvoices, financialMetrics, formatCurrency } from '@/services/financialData';
import { useToast } from '@/contexts/ToastContext';

const scenarioData = {
  optimistic: [
    { day: 'Day 1', balance: 85000 },
    { day: 'Day 5', balance: 92000 },
    { day: 'Day 10', balance: 110000 },
    { day: 'Day 15', balance: 105000 },
    { day: 'Day 20', balance: 135000 },
    { day: 'Day 25', balance: 128000 },
    { day: 'Day 30', balance: 155000 },
  ],
  crunch: [
    { day: 'Day 1', balance: 85000 },
    { day: 'Day 5', balance: 74000 },
    { day: 'Day 10', balance: 61000 },
    { day: 'Day 15', balance: 45000 },
    { day: 'Day 20', balance: 28000 },
    { day: 'Day 25', balance: 12000 },
    { day: 'Day 30', balance: 18000 },
  ],
  crisis: [
    { day: 'Day 1', balance: 85000 },
    { day: 'Day 5', balance: 62000 },
    { day: 'Day 10', balance: 41000 },
    { day: 'Day 15', balance: 18000 },
    { day: 'Day 20', balance: -5000 },
    { day: 'Day 25', balance: -18000 },
    { day: 'Day 30', balance: -24000 },
  ],
};

export default function FinancialPage() {
  const { pushToast } = useToast();
  const [scenario, setScenario] = useState('crunch');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  // 1-Click Automated Batch Auto-Pilot State
  const [autoDispatching, setAutoDispatching] = useState(false);
  const [batchResults, setBatchResults] = useState(null);
  const [smtpStatus, setSmtpStatus] = useState({ configured: false, user: null });
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [savingSmtp, setSavingSmtp] = useState(false);

  const apiFetch = async (path, options = {}) => {
    try {
      const res = await fetch(`http://localhost:8080${path}`, options);
      return res;
    } catch (_) {
      return fetch(path, options);
    }
  };

  // Fetch SMTP status on load
  const checkSmtpStatus = async () => {
    try {
      const res = await apiFetch('/api/financial/smtp-status');
      if (res.ok) {
        const data = await res.json();
        setSmtpStatus(data);
      }
    } catch (e) {
      console.warn('Could not fetch SMTP status:', e);
    }
  };

  useEffect(() => {
    checkSmtpStatus();
  }, []);

  const handleSaveSmtp = async (e) => {
    e.preventDefault();
    if (!smtpUser || !smtpPass) {
      pushToast('Please enter both your email and App Password', 'error');
      return;
    }
    setSavingSmtp(true);
    playClickSound();
    try {
      const res = await apiFetch('/api/financial/save-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: smtpUser, pass: smtpPass })
      });
      const data = await res.json();
      if (data.success) {
        playChimeSound();
        pushToast(data.message, 'success');
        setShowSmtpModal(false);
        checkSmtpStatus();
      } else {
        pushToast(data.error || 'Failed to save SMTP credentials', 'error');
      }
    } catch (err) {
      pushToast('Failed to connect to backend server', 'error');
    } finally {
      setSavingSmtp(false);
    }
  };

  const handle1ClickAutoDispatch = async () => {
    playClickSound();
    setAutoDispatching(true);
    setBatchResults(null);
    try {
      const res = await apiFetch('/api/financial/auto-dispatch-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setBatchResults(data);
      playChimeSound();
      if (data.allDelivered) {
        pushToast('⚡ 1-Click Auto-Pilot SUCCESS: Real emails delivered to all customers via SMTP!', 'success');
      } else if (data.smtpActive) {
        pushToast('⚡ 1-Click Auto-Pilot executed! Dispatches recorded.', 'success');
      } else {
        pushToast('⚡ 1-Click Auto-Pilot evaluated all delays! Connect your Gmail in 1-click for silent delivery.', 'info');
      }
    } catch (err) {
      pushToast('Error executing autonomous dispatch run', 'error');
    } finally {
      setAutoDispatching(false);
    }
  };

  const handleOpenAllWhatsApp = () => {
    playClickSound();
    if (!batchResults?.results) return;
    const overdueWithPhones = batchResults.results.filter((r) => r.phone);
    if (overdueWithPhones.length === 0) {
      pushToast('No customer phone numbers found in batch results', 'warning');
      return;
    }

    pushToast(`Opening ${overdueWithPhones.length} WhatsApp chats with pre-filled legal notices...`, 'info');
    overdueWithPhones.forEach((r, idx) => {
      const clean = r.phone.replace(/[^0-9]/g, '');
      const url = r.whatsappUrl || `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(r.message || r.subject)}`;
      setTimeout(() => {
        window.open(url, '_blank');
      }, idx * 600);
    });
  };

  const handleOpenCollection = (inv) => {
    playClickSound();
    setSelectedInvoice(inv);
    setCollectionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {collectionModalOpen && selectedInvoice && (
        <InvoiceCollectionModal
          isOpen={collectionModalOpen}
          onClose={() => setCollectionModalOpen(false)}
          invoice={selectedInvoice}
        />
      )}

      <SectionHeader
        eyebrow="Financial Operations"
        title="Gemma SME Cashflow Copilot"
        description="30-Day interactive cashflow forecasting, insolvency risk detection, and automated AI invoice collection."
      />

      {/* Top Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>Current Liquid Balance</span>
            <Wallet className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">₹85,000</div>
          <p className="mt-1 text-xs text-slate-400">Available across enterprise operational accounts</p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>Monthly Net Burn Rate</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">₹42,000 / mo</div>
          <p className="mt-1 text-xs text-slate-400">Payroll, software SaaS, and supplier payables</p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Projected Cash Runway</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">61 Days</div>
          <p className="mt-1 text-xs text-slate-400">Estimated solvency before required collection</p>
        </GlassCard>
      </div>

      {/* 30-Day Runway Forecast Chart & Scenario Switcher */}
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">30-DAY CASHFLOW FORECAST CHART</h3>
            <p className="text-xs text-slate-400">AI-predicted cash balances under varying macroeconomic scenarios.</p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            {['optimistic', 'crunch', 'crisis'].map((sc) => (
              <button
                key={sc}
                onClick={() => {
                  playClickSound();
                  setScenario(sc);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  scenario === sc
                    ? sc === 'crisis'
                      ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : sc === 'crunch'
                      ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                      : 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {sc} Scenario
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scenarioData[scenario]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={scenario === 'crisis' ? '#EF4444' : scenario === 'crunch' ? '#F59E0B' : '#10B981'}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={scenario === 'crisis' ? '#EF4444' : scenario === 'crunch' ? '#F59E0B' : '#10B981'}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#07101D',
                  borderColor: scenario === 'crisis' ? '#EF4444' : '#F59E0B',
                  borderRadius: '16px',
                  color: '#FFF',
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                name="Projected Balance (₹)"
                stroke={scenario === 'crisis' ? '#EF4444' : scenario === 'crunch' ? '#F59E0B' : '#10B981'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cashGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* What-If Calculator Component */}
      <WhatIfCalculator />

      {/* Overdue Invoice Aging Manager */}
      <GlassCard className="p-6 border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <SectionHeader
              eyebrow="Accounts Receivable"
              title="Automated Invoice Delay & Outreach Manager"
              description="Monitor invoice delay levels and trigger automated polite, medium polite, or strict final notices."
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSmtpModal(true)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-mono font-medium transition ${
                smtpStatus.configured 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' 
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <Key className="h-3 w-3" />
              {smtpStatus.configured 
                ? `Server Mail: Active (${smtpStatus.user})` 
                : 'Connect Gmail (1-Click Setup)'}
            </button>
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-xs font-bold text-amber-400">
              3 ACCOUNTS PENDING COLLECTION
            </span>
          </div>
        </div>

        {/* ⚡ 1-Click Master Autonomous Solvency Auto-Pilot Banner */}
        <div className="mt-4 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  1-Click Autonomous Solvency Auto-Pilot
                  <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-300">
                    SME RECOVERY BOT
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Scans all overdue accounts, auto-assigns tones based on delay days, and executes immediate batch dispatch.
                </p>
              </div>
            </div>

            <button
              onClick={handle1ClickAutoDispatch}
              disabled={autoDispatching}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-sky-300 hover:to-blue-400 transition shadow-lg shadow-sky-500/20 disabled:opacity-50"
            >
              {autoDispatching ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Auto-Dispatching 3 Accounts...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-slate-950" />
                  ⚡ Run 1-Click Autonomous Dispatch
                </>
              )}
            </button>
          </div>

          {/* Live Batch Execution Audit Card */}
          {batchResults && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs font-mono animate-fade-in shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
                <span className="text-white font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Autonomous Batch Complete ({batchResults.count} Accounts Evaluated)
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleOpenAllWhatsApp}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition shadow-sm"
                    title="Open WhatsApp chats for all overdue clients with notice pre-filled"
                  >
                    <Phone className="h-3.5 w-3.5" /> 📲 Launch All WhatsApp Chats
                  </button>
                  <span className="text-slate-400 text-[11px]">
                    {batchResults.timestamp ? new Date(batchResults.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {batchResults.results?.map((r) => (
                  <div key={r.invoiceId} className="flex flex-wrap items-center justify-between gap-2 rounded bg-slate-900/80 p-2.5 border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        r.toneUsed === 'STRICT' ? 'bg-rose-400' : r.toneUsed === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <strong className="text-white font-semibold">{r.client}</strong>
                      <span className="text-slate-400 font-sans">({r.company})</span>
                      <span className="text-sky-400 font-bold">[{r.toneUsed} NOTICE]</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-slate-300">
                      <span>Delayed {r.daysOverdue}d</span>
                      <span>➔</span>
                      <span className="text-sky-300">{r.email}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        r.status === 'DELIVERED_VIA_SMTP' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {r.status === 'DELIVERED_VIA_SMTP' ? 'EMAIL SENT (SMTP)' : r.status}
                      </span>
                      {r.phone && (
                        <a
                          href={r.whatsappUrl || `https://api.whatsapp.com/send?phone=${String(r.phone).replace(/[^0-9]/g, '')}&text=${encodeURIComponent(r.message || r.subject || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded bg-emerald-500/25 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 transition shadow-sm"
                          title={`Send WhatsApp to ${r.phone}`}
                        >
                          <Phone className="h-3 w-3" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Channel Status Footer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-sky-300/90">
                  <MailCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <strong>Corporate Email:</strong> Delivered via Google SMTP ({smtpStatus.user || 'sentinalai2.0@gmail.com'})
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400/90">
                  <Phone className="h-3.5 w-3.5 text-emerald-400" />
                  <strong>WhatsApp:</strong> 1-Click pre-loaded chat links ready for all clients
                </span>
              </div>

              {!batchResults.smtpActive && (
                <div className="pt-1 flex items-center justify-between text-[11px] text-amber-300/90">
                  <span>💡 Server SMTP is not yet configured for background silent delivery.</span>
                  <button 
                    onClick={() => setShowSmtpModal(true)}
                    className="underline hover:text-white font-semibold"
                  >
                    Connect Gmail in 1 Click ➔
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-5 space-y-3">
          {sampleInvoices.filter((i) => i.isOverdue).map((inv) => {
            const isCrit = inv.overdueDays > 30;
            const isMed = inv.overdueDays > 10;
            return (
              <div 
                key={inv.id} 
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-sky-500/40 hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                    isCrit 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : isMed 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{inv.client}</span>
                      {inv.company && (
                        <span className="text-xs text-slate-300 font-medium">
                          ({inv.company})
                        </span>
                      )}
                      <span className="font-mono text-xs text-sky-400 font-semibold">({inv.id})</span>
                      
                      {/* Delay Tag */}
                      <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        isCrit 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : isMed 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        Delayed by {inv.overdueDays} Days
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Amount Due: <strong className="text-white font-mono">{inv.formattedAmount || inv.amount}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{inv.contact}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{inv.phone}</span>
                    </div>

                    {inv.servicePurchased && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-sky-500/10 px-1.5 py-0.5 font-mono text-[10px] text-sky-300 border border-sky-500/20">
                          {inv.servicePurchased}
                        </span>
                        <span className="text-[11px] text-slate-400 italic">
                          ({inv.delayReason})
                        </span>
                      </div>
                    )}

                    <p className="mt-1 text-[11px] text-slate-400 font-sans">{inv.notes}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCollection(inv)}
                  className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-sky-400 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  Select Message & Dispatch
                </button>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Outbound SMTP Setup Modal for 1-Click Silent Delivery */}
      {showSmtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <GlassCard className="relative w-full max-w-md p-6 border-slate-700 shadow-2xl space-y-4">
            <button
              onClick={() => setShowSmtpModal(false)}
              className="absolute right-4 top-4 rounded-full border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Configure 1-Click Silent Email Sender</h3>
                <p className="text-xs text-slate-400">Allows Sentinel AI to send real emails silently in background.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSmtp} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Sender Email (e.g. Gmail):</label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="anlinpunneli@gmail.com"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-white font-mono placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Google App Password (16 Letters):
                </label>
                <input
                  type="password"
                  value={smtpPass}
                  onChange={(e) => setSmtpPass(e.target.value)}
                  placeholder="abcd efgh ijkl mnop"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-white font-mono placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Generate in 30 seconds at <strong className="text-sky-300">myaccount.google.com/apppasswords</strong> (Select App: "Sentinel AI").
                </p>
              </div>

              <div className="rounded-lg bg-sky-500/10 border border-sky-500/20 p-2.5 text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-sky-400 block">⚡ Zero Extra Steps Once Saved:</span>
                <p className="text-slate-400">
                  Every click on "Run 1-Click Autonomous Dispatch" will silently deliver the notice directly into <strong className="text-white">anlin224923@sahrdaya.ac.in</strong>'s inbox with zero tabs opening!
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSmtp}
                  className="flex-1 rounded-xl bg-sky-400 py-2.5 font-bold text-slate-950 hover:bg-sky-300 transition disabled:opacity-50"
                >
                  {savingSmtp ? 'Saving Credentials...' : 'Save & Enable 1-Click Delivery'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSmtpModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
