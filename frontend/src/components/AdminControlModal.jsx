import React, { useState } from 'react';
import { ShieldAlert, Zap, Trash2, Key, X, Lock, RefreshCw } from 'lucide-react';
import GlassCard from './GlassCard';
import { useToast } from '@/contexts/ToastContext';
import { playClickSound, playChimeSound, playErrorSound } from '@/utils/soundEffects';

export default function AdminControlModal({ isOpen, onClose }) {
  const { pushToast } = useToast();
  const [lockdown, setLockdown] = useState(false);
  const [unlimitedRate, setUnlimitedRate] = useState(true);
  const [rotatingKey, setRotatingKey] = useState(false);

  if (!isOpen) return null;

  const handleToggleLockdown = () => {
    const nextState = !lockdown;
    setLockdown(nextState);
    if (nextState) {
      playErrorSound();
      pushToast('🚨 EMERGENCY LOCKDOWN ACTIVE: All non-admin traffic suspended!', 'danger');
    } else {
      playChimeSound();
      pushToast('Zero-Trust Gateway restored to standard operation', 'success');
    }
  };

  const handleRotateKey = () => {
    playClickSound();
    setRotatingKey(true);
    setTimeout(() => {
      setRotatingKey(false);
      playChimeSound();
      pushToast('JWT Cryptographic Keypair Rotated Successfully (256-bit)', 'success');
    }, 1200);
  };

  const handlePurgeLogs = () => {
    playClickSound();
    pushToast('Audit & Telemetry Logs Purged & Archived to Cold Storage', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <GlassCard className="relative w-full max-w-xl p-6 futuristic-panel border-[var(--card-border)] shadow-[0_0_80px_var(--accent-glow)] bg-[var(--panel-bg)]/90">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 shadow-[0_0_24px_var(--accent-glow)]">
            <ShieldAlert className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold tracking-wide text-white">SUPER ADMIN CONTROL PANEL</h3>
              <span className="rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                LEVEL 5
              </span>
            </div>
            <p className="text-xs text-slate-300">Authorized Session: anlinpunneli@gmail.com</p>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="mt-5 space-y-3">
          {/* Emergency Lockdown */}
          <div className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${lockdown ? 'border-red-500/50 bg-red-500/15' : 'border-white/10 bg-white/5'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Emergency System Isolation</p>
                <p className="text-xs text-slate-400">Freeze all non-admin API prompts and lock zero-trust gateway</p>
              </div>
            </div>
            <button
              onClick={handleToggleLockdown}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${lockdown ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border border-white/20 bg-white/10 text-slate-200 hover:bg-white/20'}`}
            >
              {lockdown ? 'LOCKDOWN ACTIVE' : 'ENABLE LOCKDOWN'}
            </button>
          </div>

          {/* Rate Limit Override */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Unlimited Super Admin Bandwidth</p>
                <p className="text-xs text-slate-400">Bypass 100 req/min rate limit for admin prompts</p>
              </div>
            </div>
            <button
              onClick={() => {
                setUnlimitedRate(!unlimitedRate);
                playClickSound();
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${unlimitedRate ? 'bg-[var(--accent)] text-black shadow-[0_0_20px_var(--accent-glow)]' : 'border border-white/20 bg-white/10 text-slate-200'}`}
            >
              {unlimitedRate ? 'UNLIMITED (ON)' : 'STANDARD'}
            </button>
          </div>

          {/* JWT Key Rotation */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Rotate JWT Signing Key</p>
                <p className="text-xs text-slate-400">Invalidate active sessions and re-key authorization tokens</p>
              </div>
            </div>
            <button
              onClick={handleRotateKey}
              disabled={rotatingKey}
              className="flex items-center gap-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2 text-xs font-bold text-[var(--accent)] transition hover:bg-[var(--accent)]/20"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${rotatingKey ? 'animate-spin' : ''}`} />
              {rotatingKey ? 'ROTATING...' : 'ROTATE KEY'}
            </button>
          </div>

          {/* Purge Security Logs */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/20 text-slate-300">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Archive & Purge Telemetry Logs</p>
                <p className="text-xs text-slate-400">Compress audit stream and save to cold encrypted storage</p>
              </div>
            </div>
            <button
              onClick={handlePurgeLogs}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/20"
            >
              PURGE LOGS
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
