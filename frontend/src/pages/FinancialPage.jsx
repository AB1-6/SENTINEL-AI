import { useState } from 'react';
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
import { Wallet, TrendingUp, AlertCircle, Send, CheckCircle2, Clock } from 'lucide-react';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

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

const sampleInvoices = [
  { id: 'INV-001', client: 'Kavya Boutique', amount: '₹45,000', overdueDays: 38, status: 'Overdue (38d)', risk: 'High' },
  { id: 'INV-002', client: 'Sree Fabrics', amount: '₹1,20,000', overdueDays: 14, status: 'Overdue (14d)', risk: 'Critical' },
  { id: 'INV-003', client: 'Nexus Retailers', amount: '₹78,000', overdueDays: 5, status: 'Overdue (5d)', risk: 'Moderate' },
];

export default function FinancialPage() {
  const [scenario, setScenario] = useState('crunch');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const handleOpenCollection = (inv) => {
    playClickSound();
    setSelectedInvoice(inv);
    setCollectionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <InvoiceCollectionModal
        isOpen={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        invoice={selectedInvoice}
      />

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
      <GlassCard className="p-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">OVERDUE INVOICE AGING MANAGER</h3>
            <p className="text-xs text-slate-400">Trigger automated Gemma AI WhatsApp & Email payment reminders.</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {sampleInvoices.map((inv) => (
            <div key={inv.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{inv.client}</span>
                    <span className="font-mono text-xs text-slate-400">({inv.id})</span>
                  </div>
                  <p className="text-xs text-slate-300">Amount Due: <strong className="text-amber-400">{inv.amount}</strong> · {inv.status}</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenCollection(inv)}
                className="flex items-center gap-2 rounded-xl bg-electric px-4 py-2 text-xs font-bold text-black neon-hover neon-border transition"
              >
                <Send className="h-3.5 w-3.5" />
                Trigger AI Collection Outreach
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
