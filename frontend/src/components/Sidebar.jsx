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
      <aside className="hidden w-[268px] flex-col border-r border-slate-800/80 bg-[#090d16]/95 px-3.5 py-4 shadow-xl backdrop-blur-2xl xl:flex">
        <div
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-3 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90"
          onClick={handleHeaderClick}
          role="button"
          title="Click to open Zero-Trust Diagnostics"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-950 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <RotatingShield size={38} compact />
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-[15px] font-bold tracking-tight text-white transition-colors group-hover:text-sky-300">
                SENTINEL AI
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-medium tracking-wider text-slate-400">ZERO-TRUST 2.0</span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-2.5 rounded-xl border px-3 py-2 text-[13.5px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'border-sky-500/30 bg-sky-500/10 text-sky-400 font-semibold shadow-sm'
                    : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/60 hover:text-slate-100'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-sky-300" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}

          {/* Role-Specific Sidebar Features */}
          {user?.role === 'Super Administrator' || user?.email === 'anlinpunneli@gmail.com' ? (
            <div className="pt-2">
              <button
                onClick={handleAdminClick}
                className="w-full flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20 hover:border-sky-500/50"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-sky-400" />
                  <span className="text-white">Admin Controls</span>
                </div>
                <span className="rounded bg-sky-500/20 border border-sky-500/30 px-1.5 py-0.5 font-mono text-[9px] font-bold text-sky-300">
                  L5
                </span>
              </button>
            </div>
          ) : user?.role === 'Security Analyst' ? (
            <div className="pt-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
                <span className="font-medium">SecOps Audit Mode</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-300">ANALYST</span>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
                <span className="font-medium">Standard Employee</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-400">USER</span>
              </div>
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