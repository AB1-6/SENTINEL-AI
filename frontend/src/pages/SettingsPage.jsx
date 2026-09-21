import { useEffect, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import { settingsDefaults } from '@/services/mockData';
import { useTheme } from '@/contexts/ThemeContext';
import { useAiProvider } from '@/contexts/AiProviderContext';

import WebhookConfigurator from '@/components/WebhookConfigurator';

export default function SettingsPage() {
  const [settings, setSettings] = useState(settingsDefaults);
  const { theme, setTheme } = useTheme();
  const { setProvider } = useAiProvider();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('sentinel.settings');
      if (raw) setSettings(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('sentinel.settings', JSON.stringify(settings));
      // also persist ai provider separately for quick access
      if (settings?.aiProvider) {
        window.localStorage.setItem('sentinel.aiProvider', settings.aiProvider);
        try {
          setProvider(settings.aiProvider);
        } catch (e) {}
      }
    } catch (e) {}
  }, [settings]);

  return (
    <div className="space-y-6">
      <GlassCard className="p-5">
        <SectionHeader eyebrow="Settings" title="Platform Settings" description="Theme, AI provider, notifications, animations, and security controls." />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <span className="text-sm text-slate-300">Theme</span>
            <select className="mt-3 w-full rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3 text-white" value={theme} onChange={(event) => setTheme(event.target.value)}>
              <option>Dark Glass</option>
              <option>Midnight Blue</option>
              <option>Enterprise Contrast</option>
            </select>
          </label>
          <label className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <span className="text-sm text-slate-300">AI Provider</span>
            <select className="mt-3 w-full rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3 text-white" value={settings.aiProvider} onChange={(event) => setSettings((current) => ({ ...current, aiProvider: event.target.value }))}>
              <option>Gemini</option>
              <option>Gemma</option>
              <option>OpenAI</option>
              <option>Azure OpenAI</option>
            </select>
          </label>
          <label className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <span className="text-sm text-slate-300">Security Mode</span>
            <select className="mt-3 w-full rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3 text-white" value={settings.security} onChange={(event) => setSettings((current) => ({ ...current, security: event.target.value }))}>
              <option>Strict</option>
              <option>Balanced</option>
              <option>Lenient</option>
            </select>
          </label>
        </div>

        {/* Gemini API Key Configuration Section */}
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white">Google Gemini API Key (Full Automation)</h4>
              <p className="text-xs text-slate-400">Unlock real-time generative intelligence to answer any open-domain question, generate code, and analyze data.</p>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-electric hover:underline"
            >
              Get Free Key at Google AI Studio ↗
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="password"
              value={settings.geminiApiKey || ''}
              onChange={(e) => {
                const val = e.target.value;
                setSettings((current) => ({ ...current, geminiApiKey: val }));
                try {
                  window.localStorage.setItem('sentinel.geminiApiKey', val);
                } catch (err) {}
              }}
              placeholder="Paste Google AI Studio Key (AIzaSy...)"
              className="flex-1 rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3 font-mono text-xs text-white placeholder:text-slate-500 focus:border-electric focus:outline-none"
            />
          </div>
        </div>
      </GlassCard>

      <WebhookConfigurator />
    </div>
  );
}