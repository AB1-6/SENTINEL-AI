import { Bell, ChevronDown, Search, Sparkles, Shield, Zap, Volume2, VolumeX, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAiProvider } from '@/contexts/AiProviderContext';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';
import IntensityControl from './IntensityControl';
import AdminControlModal from './AdminControlModal';
import CommandPalette from './CommandPalette';
import { isAudioMuted, toggleAudioMute, playClickSound, playChimeSound } from '@/utils/soundEffects';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { provider, setProvider } = useAiProvider();
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [muted, setMuted] = useState(isAudioMuted);
  const badgeRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!badgeRef.current) return;
      if (badgeRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  // Global Command Palette hotkey (Cmd+K / Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSoundToggle = () => {
    const nextState = toggleAudioMute();
    setMuted(nextState);
    if (!nextState) playChimeSound();
  };

  return (
    <>
      <AdminControlModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <header className="flex flex-col gap-4 border-b border-cyan-500/10 bg-[var(--panel-bg)]/70 px-4 py-4 backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex w-full min-w-0 flex-wrap items-center gap-3 xl:w-auto xl:flex-none xl:flex-nowrap xl:gap-4">
          <div className="topbar-search-wrapper w-full min-w-[240px] max-w-[360px] xl:w-[360px]">
            <GlassCard 
              className="futuristic-panel flex min-w-0 w-full items-center gap-3 rounded-full px-4 py-3 cursor-pointer hover:border-sky-500/40"
              onClick={() => {
                playClickSound();
                setCmdOpen(true);
              }}
            >
              <Search className="h-4.5 w-4.5 text-cyan-300" />
              <input 
                className="topbar-search-input cursor-pointer" 
                placeholder="Search commands, tools, docs..." 
                readOnly
                onClick={() => setCmdOpen(true)}
              />
              <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] font-medium text-slate-400 font-mono">⌘ K</span>
            </GlassCard>
          </div>

          <GlassCard
            className="futuristic-panel hidden shrink-0 items-center gap-2 rounded-full px-4 py-3 xl:flex model-badge"
            role="button"
            aria-haspopup="menu"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => {
              playClickSound();
              setOpen((v) => !v);
            }}
            ref={badgeRef}
          >
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span className="model-name">{provider}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 chev-rot ${open ? 'rotate-180' : ''}`} />
          </GlassCard>

          <GlassCard className="futuristic-panel hidden shrink-0 items-center gap-2 rounded-full px-4 py-3 xl:flex status-badge">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="font-display whitespace-nowrap text-sm">All Systems Operational</span>
          </GlassCard>

          <GlassCard className="futuristic-panel hidden shrink-0 items-center gap-2 rounded-full px-4 py-3 xl:flex">
            <Shield className="h-4 w-4 text-cyan-300" />
            <span className="font-display whitespace-nowrap text-sm text-white">Zero Trust Active</span>
          </GlassCard>

      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-3 xl:flex">
          <IntensityControl />
        </div>

        {/* Sci-Fi Sound Effects Toggle */}
        <GlassCard
          className="futuristic-panel hidden items-center justify-center rounded-full p-2.5 xl:flex cursor-pointer hover:border-cyan-400/40"
          role="button"
          onClick={handleSoundToggle}
          title={muted ? 'Unmute UI Sound Effects' : 'Mute UI Sound Effects'}
        >
          {muted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-cyan-300" />}
        </GlassCard>

        {/* Theme toggle */}
        <GlassCard className="futuristic-panel hidden items-center gap-2 rounded-full px-2.5 py-2 xl:flex theme-toggle-pill" role="button">
          <ThemeToggle />
        </GlassCard>
        <GlassCard className="futuristic-panel relative flex items-center gap-3 rounded-full px-4 py-3 notif-pill">
          <div className="notif-icon-wrap relative flex items-center">
            <Bell className="h-4.5 w-4.5 text-slate-200" />
            <span className="notif-badge">3</span>
          </div>
        </GlassCard>

        <GlassCard className="futuristic-panel flex items-center gap-3 rounded-full px-3.5 py-2">
          <div className="profile-pill flex items-center gap-2.5">
            <div className="profile-avatar">
              <div className="h-8 w-8 rounded-full bg-[radial-gradient(circle_at_35%_35%,#4dd7ff,#22a3ff_55%,#050816_100%)] flex items-center justify-center font-bold text-xs text-black">
                {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'AP')}
              </div>
            </div>
            <div className="min-w-0 pr-1">
              <p className="font-display truncate text-xs font-semibold text-white">{user?.name || 'Anlin Punne'}</p>
              <p className="truncate text-[10px] text-cyan-300 font-medium">{user?.role || 'Super Admin'}</p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                logout();
                navigate('/login');
              }}
              title="Lock Session & Return to Login Menu"
              className="ml-1 rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </GlassCard>
      </div>
    </header>
    </>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const getIcon = () => {
    switch (theme) {
      case 'Midnight Blue':
        return <Sparkles className="h-4 w-4 text-cyan-300" />;
      case 'Enterprise Contrast':
        return <Zap className="h-4 w-4 text-amber-300" />;
      case 'Dark Glass':
      default:
        return <Shield className="h-4 w-4 text-cyan-200" />;
    }
  };

  return (
    <button onClick={toggle} className="theme-toggle-button flex items-center gap-2 rounded-full px-2 py-1 text-slate-200 hover:text-white" title="Click to cycle theme">
      {getIcon()}
      <span className="text-sm font-medium">{theme}</span>
    </button>
  );
}

function displayModelName(provider) {
  if (!provider) return 'Unknown Model';
  const key = provider.toLowerCase();
  switch (key) {
    case 'gemini':
      return 'Gemini 1.5 Flash (Enterprise)';
    case 'gemma':
      return 'Gemma 2 Copilot (Secure)';
    case 'openai':
      return 'OpenAI GPT-4o';
    case 'azure openai':
    case 'azureopenai':
      return 'Azure OpenAI (GovCloud)';
    default:
      return provider;
  }
}

const PROVIDERS = ['Gemini', 'Gemma', 'OpenAI', 'Azure OpenAI'];