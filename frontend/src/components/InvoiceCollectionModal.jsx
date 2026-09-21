import { useState, useEffect } from 'react';
import { 
  Send, X, MessageSquare, Mail, Phone, CheckCircle2, 
  Clock, ExternalLink, ShieldCheck, Copy, Check, Info, Sparkles, AlertTriangle
} from 'lucide-react';
import GlassCard from './GlassCard';
import { useToast } from '@/contexts/ToastContext';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

export default function InvoiceCollectionModal({ isOpen, onClose, invoice }) {
  const { pushToast } = useToast();
  
  // Calculate recommended tone based on exact delay thresholds
  const getRecommendedTone = (inv) => {
    if (!inv) return 'polite';
    if (inv.recommendedTone) return inv.recommendedTone;
    const d = inv.overdueDays || 0;
    if (d > 30) return 'urgent';
    if (d > 10) return 'medium';
    return 'polite';
  };

  const [tone, setTone] = useState(() => getRecommendedTone(invoice));
  const [channel, setChannel] = useState('email'); // 'email' | 'whatsapp'
  const [sending, setSending] = useState(false);
  const [dispatchLog, setDispatchLog] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync tone whenever modal opens or invoice changes
  useEffect(() => {
    if (invoice && isOpen) {
      const rec = getRecommendedTone(invoice);
      setTone(rec);
      setDispatchLog(null);
    }
  }, [invoice?.id, isOpen]);

  if (!isOpen || !invoice) return null;

  const clientName = invoice.client || 'Client';
  const companyName = invoice.company || '';
  const serviceName = invoice.servicePurchased || 'Sentinel AI Zero-Trust Gateway Pro';
  const billingCycle = invoice.billingCycle || 'Enterprise Subscription';
  const delayReason = invoice.delayReason || 'Pending accounts payable clearance';
  const amountStr = invoice.formattedAmount || `₹${invoice.amount?.toLocaleString()}`;
  const days = invoice.overdueDays || 0;
  const clientEmail = invoice.contact || 'accounts@client.com';
  const clientPhone = invoice.phone || '+91 90000 00000';
  const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
  const recommendedTone = getRecommendedTone(invoice);
  const isRecommended = tone === recommendedTone;

  const drafts = {
    polite: {
      title: 'Polite Courtesy Check-in',
      badge: 'Recommended for 1–10 Days Delay',
      color: 'emerald',
      subject: `Friendly Follow-up: Invoice ${invoice.id} (${amountStr}) - ${serviceName}`,
      message: `Dear ${clientName}${companyName ? ` (${companyName})` : ''},\n\nHope you are having a productive week!\n\nThis is a gentle reminder regarding invoice ${invoice.id} for the amount of ${amountStr} for your ${serviceName} (${billingCycle}), which reached its due date ${days} days ago.\n\nWe understand accounts payable schedules can experience brief processing delays. We would appreciate it if you could verify the payment status with your accounts department.\n\nThank you for your valued partnership with Sentinel AI Technologies Inc.\n\nBest regards,\nAccounts Receivable & Finance Operations\nSentinel AI Technologies Inc. (sentinalai2.0@gmail.com)`
    },
    medium: {
      title: 'Medium Polite Formal Reminder',
      badge: 'Recommended for 11–30 Days Delay',
      color: 'amber',
      subject: `Overdue Payment Notice: Invoice ${invoice.id} (${amountStr}) - ${days} Days Past Due`,
      message: `Hello ${clientName}${companyName ? ` (${companyName})` : ''},\n\nWe are writing to follow up on outstanding invoice ${invoice.id} (${amountStr}) for ${companyName}'s active subscription to ${serviceName} (${billingCycle}), which is now ${days} days overdue.\n\nOur records indicate this balance has been delayed past standard credit terms (${delayReason}). To ensure your enterprise security gateway remains in good standing without disruption to ongoing API quotas and firewall policies, please arrange for remittance by the end of this business week.\n\nIf remittance has already been scheduled, kindly share the payment UTR / reference number.\n\nSincerely,\nCredit Control Team\nSentinel AI Technologies Inc. (sentinalai2.0@gmail.com)`
    },
    urgent: {
      title: 'Strict Demand & Suspension Notice',
      badge: 'Recommended for 30+ Days Delay',
      color: 'rose',
      subject: `FINAL NOTICE: Delinquent Invoice ${invoice.id} (${amountStr}) - Service Suspension Warning`,
      message: `ATTENTION: ${clientName.toUpperCase()}${companyName ? ` · ${companyName.toUpperCase()}` : ''}\n\nInvoice ${invoice.id} for ${amountStr} covering your enterprise deployment of ${serviceName} (${billingCycle}) is critically delinquent by ${days} days past the agreed settlement terms with Sentinel AI Technologies Inc.\n\nThis account is flagged for chronic delay: ${delayReason}.\n\nImmediate settlement is required within 48 hours. Continued failure to clear this outstanding balance will result in automatic service suspension across all Sentinel AI gateway nodes, revoking of enterprise credit terms, and immediate escalation to our legal audit and debt recovery counsel.\n\nRemit payment immediately to avoid service interruption.\n\nCollections & Solvency Enforcement Bureau\nSentinel AI Technologies Inc. (sentinalai2.0@gmail.com)`
    }
  };

  const activeDraft = drafts[tone] || drafts.polite;

  // Real Web Dispatch URLs
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}&su=${encodeURIComponent(activeDraft.subject)}&body=${encodeURIComponent(activeDraft.message)}`;
  const mailtoLink = `mailto:${clientEmail}?subject=${encodeURIComponent(activeDraft.subject)}&body=${encodeURIComponent(activeDraft.message)}`;
  const whatsappWebLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(activeDraft.message)}`;

  const handleCopyMessage = () => {
    playClickSound();
    navigator.clipboard.writeText(activeDraft.message);
    setCopied(true);
    pushToast('Message copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    playClickSound();
    setSending(true);

    // Call backend API for record keeping
    try {
      const apiEndpoint = 'http://localhost:8080/api/financial/send-invoice-notice';
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.id,
          clientName,
          to: clientEmail,
          phone: clientPhone,
          channel,
          tone,
          subject: activeDraft.subject,
          message: activeDraft.message
        })
      }).catch(() => {
        return fetch('/api/financial/send-invoice-notice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId: invoice.id,
            clientName,
            to: clientEmail,
            phone: clientPhone,
            channel,
            tone,
            subject: activeDraft.subject,
            message: activeDraft.message
          })
        });
      });
    } catch (e) {
      console.warn('Backend notice sync:', e);
    }

    // Automatically open real Gmail Web or WhatsApp pre-filled!
    if (channel === 'email') {
      window.open(gmailLink, '_blank');
    } else {
      window.open(whatsappWebLink, '_blank');
    }

    setSending(false);
    playChimeSound();
    setDispatchLog({
      recipient: clientName,
      email: clientEmail,
      phone: clientPhone,
      channel: channel.toUpperCase(),
      tone: tone.toUpperCase(),
      timestamp: new Date().toLocaleTimeString()
    });
    pushToast(
      `Outreach launched for ${clientName}! Opened ${channel === 'email' ? 'Gmail Web' : 'WhatsApp'} with your notice pre-filled.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 animate-fade-in overflow-y-auto">
      <GlassCard className="relative w-full max-w-5xl max-h-[92vh] flex flex-col p-5 sm:p-6 border-slate-700/80 shadow-2xl overflow-hidden rounded-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-700 bg-slate-800/90 p-1.5 text-slate-400 hover:text-white transition z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Automated Collection Outreach Dispatcher
              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-mono text-sky-300 font-bold">
                SENTINEL SOLVENCY BOT
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous legal notice generator with multi-channel direct dispatch.
            </p>
          </div>
        </div>

        {/* 2-Column Responsive Layout (Balanced 16:9 Screen Ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto pr-1 flex-1">
          
          {/* Left Column: Account Details & Outreach Settings */}
          <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Account Summary Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Client Account</span>
                    <h4 className="text-sm font-bold text-white">
                      {clientName}
                    </h4>
                    {companyName && (
                      <span className="text-xs font-medium text-slate-300 block">
                        {companyName}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-sky-400 block">{invoice.id}</span>
                    <span className="text-xs font-bold text-white block">{amountStr}</span>
                  </div>
                </div>

                {/* Delay Severity Pill */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">Overdue Duration:</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                    days > 30 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                      : days > 10 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    <Clock className="h-3 w-3" />
                    Delayed {days} Days
                  </span>
                </div>

                {/* Contact Coordinates */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{clientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Product & Delay Context */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Service Under Contract</span>
                  <span className="text-sky-300 font-medium text-[11px] block">{serviceName}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-800/60">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Delay Rationale & Context</span>
                  <span className="text-amber-300/90 text-[11px] block">{delayReason}</span>
                </div>
              </div>

              {/* Tone Rationale Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-200">
                    Message Intensity Rationale:
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    Auto-tuned to {days}d delay
                  </span>
                </div>
                <div className="space-y-1.5">
                  {/* Option 1: Polite */}
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setTone('polite'); }}
                    className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition ${
                      tone === 'polite'
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-sm ring-1 ring-emerald-500/50'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-emerald-400 flex items-center gap-1.5">
                        <span>1. Polite Message</span>
                        {recommendedTone === 'polite' && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300 font-bold border border-emerald-500/30">
                            ★ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">Gentle check-in (Ideal for 1–10d delay)</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">1–10d</span>
                  </button>

                  {/* Option 2: Medium */}
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setTone('medium'); }}
                    className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition ${
                      tone === 'medium'
                        ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm ring-1 ring-amber-500/50'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-amber-400 flex items-center gap-1.5">
                        <span>2. Medium Polite</span>
                        {recommendedTone === 'medium' && (
                          <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-mono text-amber-300 font-bold border border-amber-500/30">
                            ★ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">Firm reminder (Ideal for 11–30d delay)</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">11–30d</span>
                  </button>

                  {/* Option 3: Not-So-Polite */}
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setTone('urgent'); }}
                    className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition ${
                      tone === 'urgent'
                        ? 'border-rose-500 bg-rose-500/15 text-white shadow-sm ring-1 ring-rose-500/50'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-rose-400 flex items-center gap-1.5">
                        <span>3. Not-So-Polite</span>
                        {recommendedTone === 'urgent' && (
                          <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-mono text-rose-300 font-bold border border-rose-500/30">
                            ★ RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">Strict final warning (30+ days overdue)</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">30+d</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Channel Switcher */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">Dispatch Channel:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { playClickSound(); setChannel('email'); }}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                    channel === 'email'
                      ? 'border-sky-500 bg-sky-500/20 text-sky-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Corporate Email
                </button>
                <button
                  type="button"
                  onClick={() => { playClickSound(); setChannel('whatsapp'); }}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                    channel === 'whatsapp'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp Web / App
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Draft Preview & Instant Dispatch Action */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            
            {/* Draft Preview Container */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs flex flex-col flex-1 shadow-inner">
              
              {/* Draft Header & Rationale Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{activeDraft.title}</span>
                  {isRecommended ? (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-bold border border-emerald-500/30">
                      <Sparkles className="h-2.5 w-2.5" /> Aligned with {days}d Delay
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-bold border border-amber-500/30">
                      <AlertTriangle className="h-2.5 w-2.5" /> Manual Tone Escalation
                    </span>
                  )}
                </div>
                <span className="text-slate-400">{activeDraft.badge}</span>
              </div>

              {/* Subject (for email) */}
              {channel === 'email' && (
                <div className="py-2 border-b border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1">
                  <span className="text-slate-500 shrink-0">Subject:</span>
                  <span className="text-sky-300 font-semibold">{activeDraft.subject}</span>
                </div>
              )}

              {/* Message Body (Scrollable if lengthy) */}
              <div className="my-2 p-3 rounded-lg bg-slate-900/80 text-slate-200 whitespace-pre-line text-xs font-mono leading-relaxed border border-slate-800/80 overflow-y-auto max-h-56 flex-1">
                {activeDraft.message}
              </div>

              {/* Channel helper info */}
              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="h-3 w-3 text-sky-400 shrink-0" />
                <span>
                  {channel === 'email'
                    ? `Clicking dispatch launches Gmail Web compose pre-filled to ${clientEmail}`
                    : `Clicking dispatch launches WhatsApp directly with +${cleanPhone} and message pre-typed`}
                </span>
              </div>
            </div>

            {/* Action Bar (Always Visible at Bottom of Right Column) */}
            <div className="space-y-2 shrink-0 pt-1">
              
              {/* Sent Confirmation Toast */}
              {dispatchLog && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs font-mono text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      Dispatched {dispatchLog.tone} notice to <strong>{dispatchLog.recipient}</strong> via {dispatchLog.channel} at {dispatchLog.timestamp}.
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Primary Send Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold text-slate-950 transition shadow-lg ${
                    channel === 'email' 
                      ? 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 shadow-sky-500/20' 
                      : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 shadow-emerald-500/20'
                  } disabled:opacity-50`}
                >
                  <Send className="h-4 w-4" />
                  {channel === 'email' 
                    ? `Send via Gmail Web (${tone.toUpperCase()})` 
                    : `Send via WhatsApp Web (${tone.toUpperCase()})`}
                </button>

                {/* Copy Text Button */}
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
                  title="Copy text to clipboard"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Direct Web Links Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
                <span>Direct Web Launchers:</span>
                <div className="flex items-center gap-2.5">
                  <a
                    href={gmailLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sky-400 hover:underline"
                  >
                    <Mail className="h-3 w-3" /> Gmail <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  <span>•</span>
                  <a
                    href={whatsappWebLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:underline"
                  >
                    <Phone className="h-3 w-3" /> WhatsApp <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  <span>•</span>
                  <a
                    href={mailtoLink}
                    className="flex items-center gap-1 text-slate-400 hover:underline"
                  >
                    Mail App <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </GlassCard>
    </div>
  );
}
