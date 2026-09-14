import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import RotatingShield from './RotatingShield';
import SecurityDiagnosticModal from './SecurityDiagnosticModal';
import AdminControlModal from './AdminControlModal';
import { LayoutDashboard, Bot, Folder, MessageSquareText, ShieldCheck, Users, Settings2, ShieldAlert, LogOut, Wallet, Layers } from 'lucide-react';
import { playChimeSound, playClickSound } from '@/utils/soundEffects';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Enterprise Assistant', to: '/assistant', icon: Bot },
  { label: 'Financial Operations', to: '/financial', icon: Wallet },
  { label: 'Presentation Deck', to: '/presentation', icon: Layers },
  { label: 'Documents', to: '/documents', icon: Folder },
  { label: 'Chat History', to: '/history', icon: MessageSquareText },
  { label: 'Security Center', to: '/security', icon: ShieldCheck },
  { label: 'User Management', to: '/users', icon: Users },
  { label: 'Settings', to: '/settings', icon: Settings2 },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [diagOpen, setDiagOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const handleHeaderClick = () => {
    playChimeSound();
    setDiagOpen(true);
  };

  const handleAdminClick = () => {
    playChimeSound();
    setAdminOpen(true);
  };

  return (
    <>
      <SecurityDiagnosticModal isOpen={diagOpen} onClose={() => setDiagOpen(false)} />
      <AdminControlModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      <aside className="hidden w-[274px] flex-col border-r border-cyan-500/12 bg-[var(--panel-bg)]/85 px-4 py-4 shadow-[inset_-1px_0_0_rgba(34,163,255,0.12)] backdrop-blur-2xl xl:flex sidebar-glass">
        <div
          className="futuristic-panel group relative cursor-pointer overflow-hidden rounded-3xl px-4 py-4 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(77,215,255,0.25)]"
          onClick={handleHeaderClick}
          role="button"
          title="Click to open Zero-Trust Diagnostics"
        >
          {/* Subtle Cyber Shimmer Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex items-center gap-3">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/8 shadow-[0_0_24px_rgba(0,200,255,0.16)] transition-transform duration-300 group-hover:scale-105">
              <RotatingShield size={54} compact />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[20px] font-semibold tracking-wide text-white transition-colors group-hover:text-cyan-200">
                SENTINEL AI
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[11px] font-medium tracking-[0.28em] text-cyan-300/90">VERSION 2.0</span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative sidebar-link group flex items-center gap-3 rounded-2xl border px-4 py-3 text-[15px] transition-all duration-200 ease-out ${isActive ? 'border-cyan-400/35 bg-[linear-gradient(90deg,rgba(0,200,255,0.10),rgba(0,200,255,0.03))] text-white shadow-[0_6px_30px_rgba(34,163,255,0.10)]' : 'border-transparent text-slate-300 hover:border-cyan-400/14 hover:bg-white/[0.03] hover:text-white'}`
              }
            >
              <span className="sidebar-indicator" aria-hidden="true" />
              <item.icon className="h-5 w-5 text-cyan-300 transition-colors duration-200 group-hover:text-cyan-200" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}

          {/* Role-Specific Sidebar Features */}
          {user?.role === 'Super Administrator' || user?.email === 'anlinpunneli@gmail.com' ? (
            <button
              onClick={handleAdminClick}
              className="w-full relative sidebar-link group flex items-center justify-between rounded-2xl border border-[var(--accent)]/35 bg-[var(--accent)]/10 px-4 py-3 text-[15px] text-[var(--accent)] transition-all duration-200 hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/20 hover:shadow-[0_0_24px_var(--accent-glow)]"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-[var(--accent)] animate-pulse" />
                <span className="font-semibold text-white tracking-wide">Admin Controls</span>
              </div>
              <span className="rounded-md border border-[var(--accent)]/40 bg-[var(--accent)]/20 px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                LEVEL 5
              </span>
            </button>
          ) : user?.role === 'Security Analyst' ? (
            <div className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-xs text-cyan-300">
              <span className="font-medium">SecOps Audit Mode</span>
              <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-1.5 py-0.5 font-bold text-cyan-300">ANALYST</span>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-300">
              <span className="font-medium">Standard Employee</span>
              <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-1.5 py-0.5 font-bold text-emerald-300">USER</span>
            </div>
          )}
        </nav>

      <div className="futuristic-panel mt-auto rounded-2xl p-4 text-sm text-slate-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f8fafc,#9ca3af_55%,#0f172a_100%)]" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border border-[#07101d] bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.85)]" />
            </div>
            <div>
              <div className="font-display text-[15px] font-semibold text-white">{user?.name || 'Anlin Punne'}</div>
              <div className="text-[11px] font-medium text-[var(--accent)]">{user?.role || 'Super Administrator'}</div>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              logout();
              navigate('/login');
            }}
            title="Sign Out / Switch Login Role"
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}