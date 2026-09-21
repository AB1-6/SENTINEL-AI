import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import {
  ShieldCheck,
  Zap,
  Lock,
  Wallet,
  AlertTriangle,
  MessageSquare,
  Flame,
  CheckCircle2,
  Server,
  Layers,
  Globe,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 13;

  const nextSlide = () => {
    playClickSound();
    setCurrentSlide((curr) => Math.min(totalSlides, curr + 1));
  };

  const prevSlide = () => {
    playClickSound();
    setCurrentSlide((curr) => Math.max(1, curr - 1));
  };

  const handleDownloadPPT = () => {
    playChimeSound();
    const link = document.createElement('a');
    link.href = '/Sentinel_AI_2.0_Redesigned_Presentation.pptx';
    link.download = 'Sentinel_AI_2.0_Redesigned_Presentation.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 relative">
      {/* Top Banner Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-cyan-500/30 bg-[#07101D]/90 p-4 backdrop-blur-md shadow-glass">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
            <Zap className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white tracking-wide">
              FUTURISTIC ENTERPRISE PRESENTATION
            </h2>
            <p className="text-xs text-slate-400">
              Sentinel AI 2.0 + Gemma FlowPilot · Slide {currentSlide} of {totalSlides}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>

          <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            {currentSlide} / {totalSlides}
          </span>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={handleDownloadPPT}
            className="flex items-center gap-2 rounded-xl bg-electric px-4 py-2 text-xs font-bold text-black neon-hover neon-border transition"
          >
            <Download className="h-3.5 w-3.5" /> Download PPTX
          </button>
        </div>
      </div>

      {/* Main Slide Viewer Canvas */}
      <GlassCard className="min-h-[520px] p-8 futuristic-panel border-cyan-500/30 relative overflow-hidden">
        {/* Animated Cyber Hologram Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* SLIDE 1: PROJECT IDEA */}
        {currentSlide === 1 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 1 · PROJECT IDEA
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">What is Sentinel AI?</h1>
            <p className="text-sm text-slate-300">
              Companies are rapidly adopting AI tools like Google Gemini and ChatGPT. This creates two major challenges:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <Lock className="h-4 w-4" /> 🔒 Sensitive Company Data Risk
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Employees may accidentally share sensitive passwords, customer bank accounts, or financial reports with AI models.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Flame className="h-4 w-4" /> ⚠️ AI Jailbreaks & Hacks
                </div>
                <p className="mt-2 text-xs text-slate-300">
                  Hackers may try to manipulate AI models using prompt injection attacks, roleplay exploits, and jailbreaks.
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-cyan-300">
              Sentinel AI sits between employees and the AI model, scanning every prompt before it reaches the AI. It protects sensitive data while providing AI-powered financial intelligence for businesses.
            </p>

            {/* Workflow Diagram */}
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10">
              {['👤 Employee Input', '🛡️ Sentinel AI Gateway', '🤖 Google Gemini / Gemma', '✅ Safe Verified Response'].map((step, idx) => (
                <div key={step} className={`rounded-xl border p-3 text-center text-xs font-bold ${
                  idx === 1 ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]' : 'border-white/10 bg-white/5 text-white'
                }`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLIDE 2: ZERO TRUST */}
        {currentSlide === 2 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 2 · ZERO TRUST SECURITY
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Zero Trust Security Architecture</h1>

            <div className="rounded-2xl border border-purple-500/40 bg-purple-500/20 p-4 text-center">
              <span className="font-display text-2xl font-bold text-cyan-300">"Never Trust. Always Verify."</span>
              <p className="mt-1 text-xs text-slate-300">Every single prompt request is cryptographically verified before accessing AI.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
                <h4 className="font-bold text-cyan-400 text-sm mb-2">Core Zero-Trust Functions:</h4>
                <p>• Verify every prompt payload in real-time</p>
                <p>• Detect and mask sensitive PII / passwords automatically</p>
                <p>• Detect malicious prompt injection & code attacks</p>
                <p>• Block unsafe requests instantly (Risk Score ≥ 0.50)</p>
                <p>• Allow only safe, sanitized prompts to reach Gemini</p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-cyan-500/30 bg-[#050C1A] p-4 text-center">
                <ShieldCheck className="h-12 w-12 text-cyan-400 animate-pulse" />
                <span className="mt-2 font-mono text-xs font-bold text-cyan-300">HOLOGRAPHIC VERIFICATION SHIELD</span>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-[11px] font-bold text-emerald-300">ALLOW (Safe)</span>
                  <span className="rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-1 text-[11px] font-bold text-red-300">BLOCK (Unsafe)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: JWT AUTHENTICATION */}
        {currentSlide === 3 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 3 · JWT AUTHENTICATION
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Secure Role-Based Authentication</h1>
            <p className="text-sm text-slate-300">JWT (JSON Web Token) securely verifies every user identity and session privilege.</p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4">
                <h4 className="font-bold text-white text-base">👑 Super Admin</h4>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">LEVEL 5 ACCESS</span>
                <p className="mt-2 text-xs text-slate-300">Full System Control, Emergency Lockdown Mode, JWT Re-keying.</p>
              </div>

              <div className="rounded-2xl border border-blue-400/40 bg-blue-500/10 p-4">
                <h4 className="font-bold text-white text-base">🛡️ Security Analyst</h4>
                <span className="text-[10px] font-mono text-blue-300 font-bold">SECOPS AUDIT</span>
                <p className="mt-2 text-xs text-slate-300">Real-time Telemetry Stream Inspection & Security Policy Review.</p>
              </div>

              <div className="rounded-2xl border border-purple-400/40 bg-purple-500/10 p-4">
                <h4 className="font-bold text-white text-base">👤 Employee</h4>
                <span className="text-[10px] font-mono text-purple-300 font-bold">STANDARD USER</span>
                <p className="mt-2 text-xs text-slate-300">Filtered Assistant Access with Client-Side PII Masking.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-around gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-bold text-emerald-400">
              <span>✔ Secure Login</span>
              <span>✔ 256-Bit Session Authentication</span>
              <span>✔ Role-Based Access</span>
              <span>✔ Prevent Unauthorized Access</span>
            </div>
          </div>
        )}

        {/* SLIDE 4: GEMMA FLOWPILOT */}
        {currentSlide === 4 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest">
              SLIDE 4 · FINANCIAL COPILOT
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Gemma FlowPilot — AI Financial Copilot</h1>
            <p className="text-sm text-slate-300">Gemma FlowPilot helps business owners and CFOs manage cashflow and predict solvency runway.</p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-amber-500/30 bg-white/5 p-4">
                <h4 className="font-bold text-amber-400 text-sm">📊 30-Day Cashflow Forecast</h4>
                <p className="text-xs text-slate-300 mt-1">Predicts liquid cash balances (₹85,000) vs net monthly burn rate (₹42,000/mo).</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-white/5 p-4">
                <h4 className="font-bold text-amber-400 text-sm">📈 Business Runway Prediction</h4>
                <p className="text-xs text-slate-300 mt-1">Monitors solvency timeline, alerting managers 61 days before liquidity crunch.</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-white/5 p-4">
                <h4 className="font-bold text-amber-400 text-sm">🎛️ AI What-If Simulation</h4>
                <p className="text-xs text-slate-300 mt-1">Live sliders for payment delays (0-60d), supplier extensions, and staff hires.</p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-white/5 p-4">
                <h4 className="font-bold text-amber-400 text-sm">✉️ Invoice Collection Assistant</h4>
                <p className="text-xs text-slate-300 mt-1">Automated payment reminder outreach via WhatsApp Business & Corporate Email.</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: THREE BUSINESS SCENARIOS */}
        {currentSlide === 5 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest">
              SLIDE 5 · SCENARIO ENGINE
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Three Macroeconomic Business Scenarios</h1>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-5">
                <h3 className="font-display text-xl font-bold text-emerald-400">😊 Optimistic</h3>
                <p className="mt-2 text-xs font-semibold text-white">Customers pay on time.</p>
                <p className="mt-1 text-xs text-slate-300">Cash balance rises to ₹1,55,000. Business remains solvent and financially healthy.</p>
              </div>

              <div className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-5">
                <h3 className="font-display text-xl font-bold text-amber-400">😐 Crunch</h3>
                <p className="mt-2 text-xs font-semibold text-white">Some customers delay payments.</p>
                <p className="mt-1 text-xs text-slate-300">Cashflow becomes tighter (₹18,000 balance). Requires working capital management.</p>
              </div>

              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-5">
                <h3 className="font-display text-xl font-bold text-red-400">🚨 Crisis</h3>
                <p className="mt-2 text-xs font-semibold text-white">Many invoices remain unpaid.</p>
                <p className="mt-1 text-xs text-slate-300">Cash balance drops below zero (-₹24,000). Business receives an early insolvency alert.</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 6: AUTOMATED AI REMINDERS */}
        {currentSlide === 6 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 uppercase tracking-widest">
              SLIDE 6 · AI INVOICE BOT
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">AI Invoice Collection Bot</h1>
            <p className="text-sm text-slate-300">Gemma automatically reminds overdue customers through WhatsApp Business & Email:</p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                <span className="font-bold text-emerald-400 text-sm">🟢 Polite Check-in (1–10d)</span>
                <p className="mt-2 text-xs italic text-slate-300">"Dear Anlin (Apex CyberLogix Solutions), gentle reminder regarding invoice INV-2026-001 (₹45,000) for Sentinel AI Gateway Pro (delayed 6d)..."</p>
              </div>
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
                <span className="font-bold text-amber-400 text-sm">🟡 Firm Notice (11–30d)</span>
                <p className="mt-2 text-xs italic text-slate-300">"Hello Angel Rose Biju (Rosewood Cloud Systems), invoice INV-2026-002 (₹1,20,000) for Sentinel Enterprise Cluster is 18 days overdue..."</p>
              </div>
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <span className="font-bold text-red-400 text-sm">🔴 Final Notice (30+d)</span>
                <p className="mt-2 text-xs italic text-slate-300">"ATTENTION: DIYA JOY (JoyNex Digital Retail), invoice INV-2026-003 (₹78,000) is 42 days overdue. Immediate settlement required to prevent service suspension..."</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 7: HOW HACKERS ATTACK AI */}
        {currentSlide === 7 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 uppercase tracking-widest">
              SLIDE 7 · AI THREAT VECTORS
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Common AI Security Threats</h1>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <h4 className="font-bold text-red-400 text-sm">1. Prompt Injection</h4>
                <p className="mt-1 text-xs text-slate-300">Attempting to override system instructions and force the AI into unintended actions.</p>
              </div>
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <h4 className="font-bold text-red-400 text-sm">2. Jailbreak Attacks</h4>
                <p className="mt-1 text-xs text-slate-300">Using roleplay tricks ("DAN - Do Anything Now") to bypass AI safety guidelines.</p>
              </div>
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <h4 className="font-bold text-red-400 text-sm">3. Sensitive Data Extraction</h4>
                <p className="mt-1 text-xs text-slate-300">Tricking the LLM into dumping secret system prompts, API keys, or user records.</p>
              </div>
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <h4 className="font-bold text-red-400 text-sm">4. Malicious Code Injection</h4>
                <p className="mt-1 text-xs text-slate-300">Sending harmful scripts such as Remote Code Execution (eval/exec) or XSS payloads.</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 8: HOW SENTINEL STOPS ATTACKS */}
        {currentSlide === 8 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 8 · SECURITY PIPELINE
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">AI Security Pipeline Workflow</h1>

            <div className="grid grid-cols-5 gap-2 pt-2">
              {['1. User Prompt', '2. PII Detection', '3. Jailbreak Check', '4. Risk Scoring', '5. Decision Engine'].map((p, idx) => (
                <div key={p} className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-center">
                  <span className="font-bold text-cyan-300 text-xs">{p}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 pt-4">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                <span className="font-bold text-emerald-400 text-sm">✅ Safe Prompt (Risk &lt; 0.50)</span>
                <p className="mt-1 text-xs text-slate-300">Forwarded to Google Gemini / Gemma Model for normal response generation.</p>
              </div>
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
                <span className="font-bold text-red-400 text-sm">❌ Unsafe Prompt (Risk ≥ 0.50)</span>
                <p className="mt-1 text-xs text-slate-300">Blocked instantly! Triggers Web Audio alarm and 0.96 Critical Alerting.</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 9: FEATURES OVERVIEW */}
        {currentSlide === 9 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 9 · FEATURES OVERVIEW
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">10 Flagship Platform Features</h1>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                '🛡️ Zero Trust Gateway',
                '🔑 JWT Authentication',
                '🙈 PII Masking Redactor',
                '🚨 Prompt Injection Scanner',
                '🛑 Jailbreak Interceptor',
                '📈 100Hz Risk Scoring Engine',
                '📊 30-Day Cashflow Forecast',
                '🎛️ Scenario Simulation Engine',
                '✉️ Invoice Reminder Bot',
                '📄 Executive PDF Audit Export',
              ].map((f) => (
                <div key={f} className="rounded-xl border border-cyan-500/30 bg-white/5 p-3 text-xs font-bold text-white">
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLIDE 10: TECHNOLOGY STACK */}
        {currentSlide === 10 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 10 · TECH STACK
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Technology Stack & Cyber Architecture</h1>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-cyan-400/40 bg-white/5 p-4">
                <span className="text-[10px] font-bold text-cyan-300 uppercase">Frontend</span>
                <p className="mt-1 font-bold text-white text-sm">React 19, Tailwind CSS, Vite</p>
              </div>
              <div className="rounded-2xl border border-blue-400/40 bg-white/5 p-4">
                <span className="text-[10px] font-bold text-blue-300 uppercase">Backend</span>
                <p className="mt-1 font-bold text-white text-sm">Node.js, Express.js REST API</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/40 bg-white/5 p-4">
                <span className="text-[10px] font-bold text-emerald-300 uppercase">Database</span>
                <p className="mt-1 font-bold text-white text-sm">MongoDB / In-Memory Store</p>
              </div>
              <div className="rounded-2xl border border-purple-400/40 bg-white/5 p-4">
                <span className="text-[10px] font-bold text-purple-300 uppercase">AI Models</span>
                <p className="mt-1 font-bold text-white text-sm">Google Gemini 1.5, Gemma 2B/7B</p>
              </div>
              <div className="rounded-2xl border border-red-400/40 bg-white/5 p-4">
                <span className="text-[10px] font-bold text-red-400 uppercase">Security Layer</span>
                <p className="mt-1 font-bold text-white text-sm">JWT Bearer, Zero Trust, PII AST Scanner</p>
              </div>
              <div className="rounded-2xl border border-amber-400/40 bg-white/5 p-4">
                <span className="text-[10px] font-bold text-amber-300 uppercase">Analytics & Charts</span>
                <p className="mt-1 font-bold text-white text-sm">Recharts Responsive Data Engine</p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 11: REAL-WORLD APPLICATIONS */}
        {currentSlide === 11 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 11 · INDUSTRY APPLICATIONS
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Real-World Enterprise Applications</h1>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {[
                '🏦 Banks & Finance',
                '🏥 Healthcare Providers',
                '🛡️ Insurance Companies',
                '🏛️ Government Agencies',
                '💻 IT & Tech Enterprise',
                '🎓 Universities & Higher Ed',
                '🏪 Small & Medium SMEs',
                '🏭 Manufacturing',
              ].map((ind) => (
                <div key={ind} className="rounded-2xl border border-cyan-500/30 bg-white/5 p-4 text-center text-xs font-bold text-white">
                  {ind}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLIDE 12: WHY SENTINEL AI? (COMPARISON TABLE) */}
        {currentSlide === 12 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              SLIDE 12 · COMPARISON MATRIX
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Why Sentinel AI? (Traditional AI vs Sentinel)</h1>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1B32] text-cyan-300 font-bold uppercase">
                  <tr>
                    <th className="p-3">Feature Criteria</th>
                    <th className="p-3 text-red-400">Traditional AI Tools</th>
                    <th className="p-3 text-emerald-400">Sentinel AI 2.0</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-200">
                  <tr>
                    <td className="p-3 font-semibold text-white">Core Capability</td>
                    <td className="p-3 text-slate-400">Answers Questions Only</td>
                    <td className="p-3 font-bold text-emerald-400">Answers + Protects Enterprise Data</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Zero Trust Gateway</td>
                    <td className="p-3 text-red-400">❌ No Zero Trust Gateway</td>
                    <td className="p-3 font-bold text-emerald-400">✅ 100Hz Zero Trust Inspection</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">PII Protection</td>
                    <td className="p-3 text-red-400">❌ No PII Redaction</td>
                    <td className="p-3 font-bold text-emerald-400">✅ Automatic ZK PII Masking</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Attack Detection</td>
                    <td className="p-3 text-red-400">❌ No Jailbreak Detection</td>
                    <td className="p-3 font-bold text-emerald-400">✅ 0.96 Critical Jailbreak Alert</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Financial Copilot</td>
                    <td className="p-3 text-red-400">❌ No Financial Intelligence</td>
                    <td className="p-3 font-bold text-emerald-400">✅ Gemma 30-Day Runway & What-If</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Invoice Follow-up</td>
                    <td className="p-3 text-red-400">❌ Manual Invoice Follow-up</td>
                    <td className="p-3 font-bold text-emerald-400">✅ AI WhatsApp & Email Reminders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SLIDE 13: FUTURE SCOPE */}
        {currentSlide === 13 && (
          <div className="space-y-6 animate-fade-in">
            <span className="rounded-md border border-purple-500/40 bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-300 uppercase tracking-widest">
              SLIDE 13 · FUTURE ROADMAP
            </span>
            <h1 className="font-display text-3xl font-extrabold text-white">Strategic Future Roadmap</h1>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                '🎙️ Voice AI Security',
                '📄 OCR Document Protection',
                '📱 Mobile Security App',
                '🌐 Multi-Language Support',
                '🤖 ChatGPT + Claude + Gemini',
                '📊 Enterprise SIEM Integration',
                '✉️ Phishing Detection',
                '☁️ Enterprise Cloud Deployment',
                '🔮 Predictive AI Analytics',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-4 text-xs font-bold text-white">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
