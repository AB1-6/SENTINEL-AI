import { useState, useMemo } from 'react';
import { Sliders, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';

export default function WhatIfCalculator() {
  const [delayDays, setDelayDays] = useState(15);
  const [supplierExtension, setSupplierExtension] = useState(5);
  const [newHires, setNewHires] = useState(1);

  // Base financial state
  const baseBalance = 85000;
  const monthlyBurn = 42000;

  // Calculation
  const calculatedRunway = useMemo(() => {
    const hireImpact = newHires * 6000;
    const netBurn = monthlyBurn + hireImpact;
    const delayShortfall = delayDays * 1200;
    const extensionRelief = supplierExtension * 800;

    const projectedBalance30d = baseBalance - netBurn - delayShortfall + extensionRelief;
    const isAtRisk = projectedBalance30d < 15000;
    const insolvencyDate = isAtRisk ? 'July 28' : 'None (Solvent)';

    return {
      projectedBalance30d,
      isAtRisk,
      insolvencyDate,
      netBurn,
    };
  }, [delayDays, supplierExtension, newHires]);

  return (
    <div className="space-y-4 rounded-3xl border border-amber-500/30 bg-[#07101d]/90 p-5 shadow-glass">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-amber-400" />
          <h3 className="font-display text-base font-bold text-white tracking-wide">
            "WHAT-IF" FINANCIAL SCENARIO SIMULATOR
          </h3>
        </div>
        <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
          GEMMA CASHFLOW ENGINE
        </span>
      </div>

      {/* Sliders Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Top Client Payment Delay</span>
            <span className="font-bold text-amber-400">{delayDays} Days</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={delayDays}
            onChange={(e) => setDelayDays(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">Simulate delayed invoice collection (INV-002)</p>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Supplier Extension</span>
            <span className="font-bold text-emerald-400">+{supplierExtension} Days</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            value={supplierExtension}
            onChange={(e) => setSupplierExtension(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">Negotiate delayed accounts payable relief</p>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>New Staff Hires</span>
            <span className="font-bold text-cyan-400">+{newHires} Staff</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            value={newHires}
            onChange={(e) => setNewHires(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">Simulate monthly payroll expansion</p>
        </div>
      </div>

      {/* Outcome Metric Card */}
      <div className={`flex flex-wrap items-center justify-between rounded-2xl border p-4 transition-all ${
        calculatedRunway.isAtRisk ? 'border-red-500/50 bg-red-500/10' : 'border-emerald-500/50 bg-emerald-500/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            calculatedRunway.isAtRisk ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {calculatedRunway.isAtRisk ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-base">
                Projected 30-Day Cash Position: ₹{calculatedRunway.projectedBalance30d.toLocaleString()}
              </span>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                calculatedRunway.isAtRisk ? 'border-red-500/40 bg-red-500/20 text-red-300' : 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
              }`}>
                {calculatedRunway.isAtRisk ? 'LIQUIDITY CRUNCH' : 'SOLVENT'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Net Monthly Burn: ₹{calculatedRunway.netBurn.toLocaleString()} · Liquidity Risk Date: {calculatedRunway.insolvencyDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
