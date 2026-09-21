import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ShieldCheck, ShieldAlert, User, Lock, ArrowRight, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { playClickSound, playChimeSound, playErrorSound } from '@/utils/soundEffects';
import { isUserSuspended, subscribeUserSecurity, getUser } from '@/services/userSecurityService';

const ROLES = [
  {
    id: 'admin',
    title: 'Super Administrator',
    badge: 'LEVEL 5 FULL ACCESS',
    email: 'anlinpunneli@gmail.com',
    icon: ShieldAlert,
    color: 'amber',
    desc: 'Full RBAC control, zero-trust emergency lockdown, and JWT key rotation.',
  },
  {
    id: 'analyst',
    title: 'Security Analyst',
    badge: 'SECOPS READ/WRITE',
    email: 'alex.mercer@sentinel.local',
    icon: ShieldCheck,
    color: 'cyan',
    desc: 'Threat telemetry stream inspection, prompt injection audit, and risk analytics.',
  },
  {
    id: 'employee',
    title: 'Standard Employee',
    badge: 'STANDARD USER',
    email: 'employee@sentinel.local',
    icon: User,
    color: 'emerald',
    desc: 'Access to AI Assistant chat, document intelligence, and history.',
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();

  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [form, setForm] = useState({ email: ROLES[0].email, password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quarantineError, setQuarantineError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    return subscribeUserSecurity(() => {
      setRefreshKey((k) => k + 1);
    });
  }, []);

  const selectRolePreset = (role) => {
    playClickSound();
    setSelectedRole(role);
    setForm((curr) => ({ ...curr, email: role.email, password: '' }));
    setQuarantineError(null);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setQuarantineError(null);

    // Pre-check for suspended status
    if (isUserSuspended(form.email)) {
      playErrorSound();
      const secUser = getUser(form.email);
      setQuarantineError(
        `Access Quarantined: Account "${form.email}" has been locked after 3 Zero-Trust Security Violations. Only the Super Administrator (anlinpunneli@gmail.com) can readmit this account from the User Management console.`
      );
      pushToast('Access Quarantined: 3 Zero-Trust Violations recorded', 'danger');
      return;
    }

    if (!form.password.trim()) {
      playErrorSound();
      pushToast('Please enter your security password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = await login(form);
      playChimeSound();
      pushToast(`Welcome back, ${user?.name || 'User'}! Session established.`, 'success');
      navigate('/');
    } catch (err) {
      playErrorSound();
      if (err.message?.includes('ACCOUNT_SUSPENDED')) {
        setQuarantineError(err.message.replace('ACCOUNT_SUSPENDED: ', ''));
        pushToast('Account Suspended: Zero-Trust Quarantined', 'danger');
      } else {
        pushToast('Authentication failed: Invalid Credentials', 'danger');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl space-y-6">
        {/* Role Menu Switcher */}
        <div>
          <h2 className="text-[26px] font-bold text-white tracking-wide">ENTERPRISE ACCESS MENU</h2>
          <p className="mt-1 text-sm text-slate-400">Select an enterprise persona or enter custom zero-trust credentials.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {ROLES.map((role) => {
              const isSelected = selectedRole.id === role.id;
              const isSuspended = isUserSuspended(role.email);
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => selectRolePreset(role)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSuspended
                      ? 'border-red-500/40 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                      : isSelected
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(77,215,255,0.25)]'
                      : 'border-white/10 bg-[#07101d]/80 hover:border-cyan-400/40 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSuspended ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-cyan-300'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSuspended ? (
                      <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                    ) : isSelected ? (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#4dd7ff]" />
                    ) : null}
                  </div>

                  <h3 className="mt-3 font-display font-semibold text-white text-sm">{role.title}</h3>
                  {isSuspended ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      QUARANTINED (3/3)
                    </span>
                  ) : (
                    <span className="mt-1 inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-300">
                      {role.badge}
                    </span>
                  )}
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400 line-clamp-2">{role.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-[#07101d]/90 p-6 shadow-glass">
          {quarantineError && (
            <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-4 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-red-500/20 p-2 text-red-400 mt-0.5 shrink-0">
                  <AlertTriangle className="h-5 w-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-sm text-red-200 uppercase tracking-wider">
                    Zero-Trust Security Lockdown: Account Quarantined
                  </h4>
                  <p className="text-xs text-red-300/90 leading-relaxed">
                    {quarantineError}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400 font-mono">
                    Requires Super Administrator clearance (<span className="text-cyan-300 font-semibold">anlinpunneli@gmail.com</span>) in User Management to reinstate access.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span className="font-display text-sm font-semibold text-white">SELECTED ROLE: {selectedRole.title.toUpperCase()}</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">JWT SECURE GATEWAY</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs text-slate-300">Email Address</span>
              <input
                type="email"
                required
                autoComplete="username"
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/70"
                value={form.email}
                onChange={(e) => {
                  setForm((curr) => ({ ...curr, email: e.target.value }));
                  setQuarantineError(null);
                }}
                placeholder="Enter enterprise email"
              />
            </label>
            <label className="block">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Password</span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider">ZERO-TRUST ENCRYPTED</span>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400/70"
                  value={form.password}
                  onChange={(e) => setForm((curr) => ({ ...curr, password: e.target.value }))}
                  placeholder="Enter security password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-medium transition cursor-pointer ${
              isUserSuspended(form.email)
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-electric text-black hover:brightness-110 disabled:opacity-60 neon-hover neon-border'
            }`}
          >
            {isUserSuspended(form.email) ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                Account Quarantined (Locked Out)
              </>
            ) : loading ? (
              'Authenticating...'
            ) : (
              <>
                Sign In as {selectedRole.title}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}