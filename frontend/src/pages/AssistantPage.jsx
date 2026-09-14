import { useMemo, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import FileDropzone from '@/components/FileDropzone';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import RiskMeter from '@/components/RiskMeter';
import LaserScanOverlay from '@/components/LaserScanOverlay';
import api from '@/services/api';
import { classifyPrompt, generateResponse } from '@/services/demoEngine';
import { useToast } from '@/contexts/ToastContext';
import { useAiProvider } from '@/contexts/AiProviderContext';
import { playClickSound, playScanSound, playErrorSound, playChimeSound } from '@/utils/soundEffects';

import { redactPII } from '@/utils/piiRedactor';

const initialMessages = [
  { role: 'assistant', content: 'Welcome to Sentinel AI 2.0. Submit a prompt and every request will be screened before reaching the model.' },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [prompt, setPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentScore, setCurrentScore] = useState(4);
  const { pushToast } = useToast();
  const { provider: selectedProvider } = useAiProvider();

  const conversationSummary = useMemo(() => messages.filter((message) => message.role === 'user').length, [messages]);

  async function sendPrompt(event) {
    event.preventDefault();
    if (!prompt.trim()) return;

    // Zero-Knowledge Client-Side PII Masking
    const piiResult = redactPII(prompt);
    if (piiResult.count > 0) {
      playChimeSound();
      pushToast(`🛡️ ZK PII Masked: ${piiResult.types.join(', ')} automatically redacted!`, 'success');
    }

    const processedPrompt = piiResult.redactedText;

    playScanSound();
    const classification = classifyPrompt(processedPrompt);
    const riskScore = Math.min(100, Math.max(0, Math.floor(classification.score * 100)));
    setCurrentScore(riskScore);

    const userMessage = { role: 'user', content: processedPrompt };
    setMessages((current) => [...current, userMessage]);
    setPrompt('');

    if (classification.label === 'JAILBREAK') {
      playErrorSound();
      pushToast('Prompt blocked by zero-trust security layer', 'danger');
      setMessages((current) => [...current, { role: 'assistant', content: generateResponse(userMessage.content) }]);
      return;
    }

    setIsStreaming(true);
    setMessages((current) => [...current, { role: 'assistant', content: '...' }]);

    try {
      const selected = selectedProvider || window.localStorage.getItem('sentinel.aiProvider') || 'Gemini';
      const provider = (selected || 'Gemini').toLowerCase() === 'gemma' ? 'gemma' : 'gemini';
      const res = await api.post('/chat', { prompt: userMessage.content, provider, documentNames: [] });
      const data = res.data?.data || res.data;
      const respText = (data && data.response && data.response.text) || (res.data && res.data.data && res.data.data.response && res.data.data.response.text) || (res.data && res.data.response && res.data.response.text) || (res.data && res.data.data && res.data.data.text) || '';
      setMessages((current) => {
        const cloned = [...current];
        cloned[cloned.length - 1] = { role: 'assistant', content: respText || data?.response?.text || data?.text || generateResponse(userMessage.content) };
        return cloned;
      });
      playChimeSound();
      pushToast(`Secure prompt accepted. Risk score ${classification.score}`, 'success');
    } catch (err) {
      // Fall back to built-in secure demo response if unauthenticated or server unreachable
      const fallbackText = generateResponse(userMessage.content);
      setMessages((current) => {
        const cloned = [...current];
        cloned[cloned.length - 1] = { role: 'assistant', content: fallbackText };
        return cloned;
      });
      playChimeSound();
      pushToast(`Secure prompt accepted (Demo Gateway). Risk score ${classification.score}`, 'success');
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <GlassCard className="relative flex flex-col p-5">
        <LaserScanOverlay active={isStreaming} />
        <SectionHeader eyebrow="Enterprise AI Assistant" title="Secure Chat Interface" description="Markdown rendering, typing animation, upload support, and secure gateway controls." />

        <div className="mt-4 min-h-[220px] max-h-[360px] space-y-4 overflow-y-auto rounded-3xl border border-white/8 bg-[#08111f]/70 p-4 hide-scrollbar">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-3xl px-4 py-3 ${message.role === 'user' ? 'bg-electric text-black' : 'border border-white/10 bg-white/5 text-white'}`}>
                {message.role === 'assistant' ? <MarkdownRenderer>{message.content || ' '}</MarkdownRenderer> : <p className="text-sm leading-6">{message.content}</p>}
              </div>
            </div>
          ))}
          {isStreaming ? <div className="text-sm text-electric animate-pulse">Typing secure response...</div> : null}
        </div>

        <form onSubmit={sendPrompt} className="mt-4 space-y-3">
          <textarea
            rows="2"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask Sentinel AI to summarize a policy, analyze a document, draft a response, or explain a security issue..."
            className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-electric/70"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-2xl bg-electric px-5 py-3 font-medium text-black transition hover:brightness-110 neon-hover neon-border">Send Prompt</button>
            <label className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/10">
              Upload File
              <input type="file" className="hidden" accept=".pdf,.docx" />
            </label>
            <span className="text-xs text-slate-400">{conversationSummary} user messages secured in this session</span>
          </div>
        </form>
      </GlassCard>

      <div className="space-y-6">
        <RiskMeter score={currentScore} />
        <GlassCard className="p-5">
          <SectionHeader eyebrow="Security Layer" title="Zero Trust Flow" description="The request path is enforced before the model receives any text." />
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {['JWT Verification', 'Role Verification', 'Session Validation', 'Rate Limiting', 'ML Prompt Classification', 'Risk Scoring', 'Gemini Forwarding'].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-electric/15 text-xs text-electric">{index + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionHeader eyebrow="Active Context" title="Document Intelligence" description="Ask questions across uploaded files with secure retrieval controls." />
          <div className="mt-4 grid gap-3">
            {['Employee Handbook.pdf', 'Security Playbook.pdf', 'Q3 Strategy.docx'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">{item}</div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-400">Responses are streamed in the UI after the security gateway approves the request.</div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionHeader eyebrow="Model Access" title="Gemini Gateway" description="The adapter can call Gemini in production or fall back to demo mode locally." />
          <div className="mt-4 rounded-2xl border border-electric/20 bg-electric/10 p-4 text-sm text-slate-200">All prompt traffic is logged, risk scored, and protected before the LLM call. If the prompt is unsafe, the system returns a security warning instead of a model answer.</div>
        </GlassCard>
      </div>
    </div>
  );
}