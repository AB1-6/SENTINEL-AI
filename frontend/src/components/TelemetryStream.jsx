import React, { useEffect, useState } from 'react';
import { Terminal, Shield, RefreshCw } from 'lucide-react';
import GlassCard from './GlassCard';

const INITIAL_LOGS = [
  { id: 1, type: 'JWT', status: 'VERIFIED', text: 'Admin identity bearer token validated via zero-trust provider.', tone: 'cyan' },
  { id: 2, type: 'INSPECT', status: 'PASS', text: 'Prompt sanitized. Jailbreak score 0.01 / 1.00 [SAFE].', tone: 'emerald' },
  { id: 3, type: 'GATEWAY', status: 'ROUTE', text: 'Encrypted request routed to Gemini 2.5 Pro via TLS 1.3.', tone: 'cyan' },
  { id: 4, type: 'RBAC', status: 'ENFORCED', text: 'User role Administrator validated for execution.', tone: 'emerald' },
  { id: 5, type: 'AUDIT', status: 'LOGGED', text: 'Encrypted SHA-256 session hash stored in audit memory.', tone: 'slate' },
];

const STREAM_EVENTS = [
  { type: 'INSPECT', status: 'PASS', text: 'Context memory analyzed. Zero data leakage detected.', tone: 'emerald' },
  { type: 'MODEL', status: 'LATENCY', text: 'Response streaming at 42 tokens/sec (latency 94ms).', tone: 'cyan' },
  { type: 'SHIELD', status: 'ACTIVE', text: 'Real-time prompt filter inspecting active session stream.', tone: 'emerald' },
  { type: 'TLS', status: 'ENCRYPT', text: 'Payload TLS 1.3 frame handshake verified.', tone: 'cyan' },
];

export default function TelemetryStream({ className = '' }) {
  const [logs, setLogs] = useState(INITIAL_LOGS);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomEvent = STREAM_EVENTS[Math.floor(Math.random() * STREAM_EVENTS.length)];
      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setLogs((prev) => [
        { ...randomEvent, id: Date.now(), time: now },
        ...prev.slice(0, 7), // keep last 8 logs
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className={`p-5 futuristic-panel ${className}`}>
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4.5 w-4.5 text-cyan-300" />
          <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-white">
            Zero-Trust Telemetry Stream
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          LIVE 100Hz
        </div>
      </div>

      <div className="mt-3 font-mono text-xs space-y-2 max-h-[220px] overflow-y-auto hide-scrollbar">
        {logs.map((log) => (
          <div key={log.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/5 bg-black/40 px-3 py-2 transition-all duration-300">
            <span className="text-[10px] text-slate-500">{log.time || 'JUST NOW'}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                log.tone === 'emerald'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              [{log.type}:{log.status}]
            </span>
            <span className="text-slate-300 truncate max-w-full">{log.text}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
