import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ShieldCheck, ShieldAlert, User, Key, ArrowRight, Lock } from 'lucide-react';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

const ROLES = [
  {
    id: 'admin',
    title: 'Super Administrator',
    badge: 'LEVEL 5 FULL ACCESS',
    email: 'anlinpunneli@gmail.com',
    password: 'Anlin20#69',
    icon: ShieldAlert,
    color: 'amber',
    desc: 'Full RBAC control, zero-trust emergency lockdown, and JWT key rotation.',
  },
  {
    id: 'analyst',
    title: 'Security Analyst',
    badge: 'SECOPS READ/WRITE',
    email: 'alex.mercer@sentinel.local',
    password: 'Sentinel123!',
    icon: ShieldCheck,
    color: 'cyan',
    desc: 'Threat telemetry stream inspection, prompt injection audit, and risk analytics.',
  },
  {
    id: 'employee',
    title: 'Standard Employee',
    badge: 'STANDARD USER',
    email: 'employee@sentinel.local',
    password: 'Sentinel123!',
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
  const [form, setForm] = useState({ email: ROLES[0].email, password: ROLES[0].password });
  const [loading, setLoading] = useState(false);

  const selectRolePreset = (role) => {
    playClickSound();
    setSelectedRole(role);
    setForm({ email: role.email, password: role.password });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      playChimeSound();
      pushToast(`Welcome back, ${user?.name || 'User'}! Session established.`, 'success');
      navigate('/');
    } catch {
      pushToast('Authentication failed: Invalid Credentials', 'danger');
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
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => selectRolePreset(role)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(77,215,255,0.25)]'
                      : 'border-white/10 bg-[#07101d]/80 hover:border-cyan-400/40 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#4dd7ff]" />}
                  </div>

                  <h3 className="mt-3 font-display font-semibold text-white text-sm">{role.title}</h3>
                  <span className="mt-1 inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-300">
                    {role.badge}
                  </span>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-400 line-clamp-2">{role.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-[#07101d]/90 p-6 shadow-glass">
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
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/70"
                value={form.email}
                onChange={(e) => setForm((curr) => ({ ...curr, email: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="text-xs text-slate-300">Password</span>
              <input
                type="password"
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/70"
                value={form.password}
                onChange={(e) => setForm((curr) => ({ ...curr, password: e.target.value }))}
              />
            </label>
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric px-5 py-3.5 font-medium text-black transition hover:brightness-110 disabled:opacity-60 neon-hover neon-border"
          >
            {loading ? 'Authenticating...' : `Sign In as ${selectedRole.title}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}