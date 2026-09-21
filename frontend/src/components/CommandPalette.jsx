import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, LayoutDashboard, Bot, Wallet, ShieldCheck, Users, 
  Folder, MessageSquareText, Settings2, Terminal, Cpu, Download, 
  Volume2, VolumeX, X, ArrowRight, ShieldAlert, Zap
} from 'lucide-react';
import { useAiProvider } from '@/contexts/AiProviderContext';
import { useToast } from '@/contexts/ToastContext';
import { toggleAudioMute, isAudioMuted, playClickSound } from '@/utils/soundEffects';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setProvider } = useAiProvider();
  const { pushToast } = useToast();

  const COMMANDS = [
    // Navigation
    { id: 'nav-dash', category: 'Navigation', title: 'Dashboard & SecOps Overview', icon: LayoutDashboard, action: () => navigate('/') },
    { id: 'nav-assistant', category: 'Navigation', title: 'AI Assistant & Zero-Trust Telemetry', icon: Bot, action: () => navigate('/assistant') },
    { id: 'nav-financial', category: 'Navigation', title: 'Gemma Financial Solvency Copilot', icon: Wallet, action: () => navigate('/financial') },
    { id: 'nav-security', category: 'Navigation', title: 'Security Center, OWASP & SIEM', icon: ShieldCheck, action: () => navigate('/security') },
    { id: 'nav-users', category: 'Navigation', title: 'Enterprise RBAC Permissions Matrix', icon: Users, action: () => navigate('/users') },
    { id: 'nav-docs', category: 'Navigation', title: 'Document Intelligence & Vector Store', icon: Folder, action: () => navigate('/documents') },
    { id: 'nav-history', category: 'Navigation', title: 'Audit History & Screened Logs', icon: MessageSquareText, action: () => navigate('/history') },
    { id: 'nav-settings', category: 'Navigation', title: 'System Security Configuration', icon: Settings2, action: () => navigate('/settings') },

    // Security & Red Team Actions
    { 
      id: 'sim-dan', 
      category: 'Security Simulations', 
      title: 'Simulate DAN 14.0 Jailbreak Attack', 
      icon: ShieldAlert, 
      action: () => {
        navigate('/assistant');
        pushToast('Simulating DAN Jailbreak attack in Assistant...', 'warning');
      } 
    },
    { 
      id: 'sim-owasp', 
      category: 'Security Simulations', 
      title: 'Run OWASP Top 10 for LLMs Vulnerability Probe', 
      icon: Terminal, 
      action: () => {
        navigate('/security');
        pushToast('Running OWASP LLM Red Team probe...', 'info');
      } 
    },
    { 
      id: 'sim-pii', 
      category: 'Security Simulations', 
      title: 'Test Client-Side Zero-Knowledge PII Masking', 
      icon: Zap, 
      action: () => {
        navigate('/assistant');
        pushToast('Testing ZK PII redactor engine...', 'info');
      } 
    },

    // Model & Tool Controls
    { 
      id: 'model-gemini', 
      category: 'AI Gateway Controls', 
      title: 'Switch Active Model to Google Gemini 1.5 Flash', 
      icon: Cpu, 
      action: () => {
        setProvider('Gemini');
        pushToast('Switched Gateway to Gemini 1.5 Flash (Enterprise)', 'success');
      } 
    },
    { 
      id: 'model-gemma', 
      category: 'AI Gateway Controls', 
      title: 'Switch Active Model to Google Gemma 2 Copilot', 
      icon: Cpu, 
      action: () => {
        setProvider('Gemma');
        pushToast('Switched Gateway to Gemma 2 Copilot (Secure)', 'success');
      } 
    },
    { 
      id: 'tool-sound', 
      category: 'System Actions', 
      title: isAudioMuted() ? 'Unmute Enterprise Sound Effects' : 'Mute Sound Effects', 
      icon: isAudioMuted() ? Volume2 : VolumeX, 
      action: () => {
        const next = toggleAudioMute();
        pushToast(next ? 'Sound effects muted' : 'Sound effects unmuted', 'info');
      } 
    },
    { 
      id: 'tool-export', 
      category: 'System Actions', 
      title: 'Export Compliance Dossier & Audit Bundle (JSON)', 
      icon: Download, 
      action: () => {
        navigate('/security');
        pushToast('Navigated to compliance bundle export', 'info');
      } 
    },
  ];

  const filtered = COMMANDS.filter((cmd) => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        playClickSound();
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <Search className="h-4 w-4 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page, simulation, or model..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <kbd className="rounded bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No enterprise commands found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playClickSound();
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition text-xs ${
                    isSelected 
                      ? 'bg-sky-500/15 border border-sky-500/30 text-white' 
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <span className="text-[10px] font-mono text-slate-500">{item.category}</span>
                    </div>
                  </div>
                  {isSelected && <ArrowRight className="h-3.5 w-3.5 text-sky-400" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px]">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px]">↵</kbd> Execute</span>
          </div>
          <span>Sentinel AI 2.0 Command Engine</span>
        </div>
      </div>
    </div>
  );
}
