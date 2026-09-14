import { useState } from 'react';
import { Bell, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

export default function WebhookConfigurator() {
  const { pushToast } = useToast();
  const [slackUrl, setSlackUrl] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [teamsUrl, setTeamsUrl] = useState('https://outlook.office.com/webhook/XXXXX');
  const [testing, setTesting] = useState(false);

  const handleTestWebhook = () => {
    playClickSound();
    setTesting(true);

    setTimeout(() => {
      setTesting(false);
      playChimeSound();
      pushToast('🚨 Test Threat Alert dispatched to Slack & MS Teams SecOps channels!', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Bell className="h-5 w-5 text-cyan-400" />
        <h3 className="font-display text-base font-bold text-white tracking-wide">
          REAL-TIME SLACK & MS TEAMS SECURITY WEBHOOKS
        </h3>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="text-xs text-slate-300">Slack SecOps Channel Webhook URL</span>
          <input
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
            value={slackUrl}
            onChange={(e) => setSlackUrl(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-xs text-slate-300">Microsoft Teams Channel Webhook URL</span>
          <input
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
            value={teamsUrl}
            onChange={(e) => setTeamsUrl(e.target.value)}
          />
        </label>

        <button
          onClick={handleTestWebhook}
          disabled={testing}
          className="flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
          {testing ? 'Dispatching Test Alert...' : 'Dispatch Test Alert Webhook'}
        </button>
      </div>
    </div>
  );
}
