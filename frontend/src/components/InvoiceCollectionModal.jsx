import { useState, useEffect } from 'react';
import { Send, X, MessageSquare, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import GlassCard from './GlassCard';
import { useToast } from '@/contexts/ToastContext';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

export default function InvoiceCollectionModal({ isOpen, onClose, invoice }) {
  const { pushToast } = useToast();
  const [tone, setTone] = useState('firm'); // 'polite' | 'firm' | 'urgent'
  const [channel, setChannel] = useState('whatsapp'); // 'whatsapp' | 'email'
  const [sending, setSending] = useState(false);

  if (!isOpen || !invoice) return null;

  const drafts = {
    polite: `Hi ${invoice.client}, hope business is going great! Just a gentle nudge regarding ${invoice.id} (${invoice.amount}) which is slightly past due. Would you be able to confirm when payment will be cleared? Thank you!`,
    firm: `Hello ${invoice.client}, this is a reminder that invoice ${invoice.id} (${invoice.amount}) is currently ${invoice.overdueDays} days overdue. Please ensure payment is transferred by Friday to keep your account in good standing.`,
    urgent: `URGENT NOTICE: Invoice ${invoice.id} (${invoice.amount}) is significantly overdue by ${invoice.overdueDays} days. Please arrange payment within 48 hours to avoid account suspension or legal collection action.`,
  };

  const handleSend = () => {
    playClickSound();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      playChimeSound();
      pushToast(
        `AI Payment Reminder dispatched via ${channel.toUpperCase()} to ${invoice.client}!`,
        'success'
      );
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <GlassCard className="relative w-full max-w-lg p-6 futuristic-panel border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.25)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white tracking-wide">
              AUTOMATED INVOICE REMINDER BOT
            </h3>
            <p className="text-xs text-slate-300">Client: {invoice.client} · {invoice.id} ({invoice.amount})</p>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-300">Select AI Reminder Tone:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'polite', label: 'Polite Nudge' },
              { id: 'firm', label: 'Firm Reminder' },
              { id: 'urgent', label: 'Urgent Final Notice' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  tone === t.id
                    ? t.id === 'urgent'
                      ? 'border-red-500 bg-red-500/20 text-red-300'
                      : 'border-amber-400 bg-amber-500/20 text-amber-300'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Channel Selector */}
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="font-semibold">Dispatch Channel:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="channel"
                checked={channel === 'whatsapp'}
                onChange={() => setChannel('whatsapp')}
                className="accent-emerald-400"
              />
              <span className="text-emerald-400 font-medium">WhatsApp Business</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="channel"
                checked={channel === 'email'}
                onChange={() => setChannel('email')}
                className="accent-cyan-400"
              />
              <span className="text-cyan-400 font-medium">Corporate Email</span>
            </label>
          </div>

          {/* Draft Preview Box */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-slate-200">
            <div className="text-[10px] text-slate-400 font-sans mb-1 font-bold uppercase">Gemma AI Draft Preview:</div>
            {drafts[tone]}
          </div>

          {/* Dispatch Action */}
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-electric px-4 py-3 font-bold text-black neon-hover neon-border transition disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {sending ? 'Dispatching Outreach...' : `Send ${tone.toUpperCase()} ${channel.toUpperCase()} Outreach`}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
