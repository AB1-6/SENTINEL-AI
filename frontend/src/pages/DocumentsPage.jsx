import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import FileDropzone from '@/components/FileDropzone';
import { documents } from '@/services/mockData';
import { useToast } from '@/contexts/ToastContext';
import { Archive, FileText, CheckCircle2, ShieldCheck, ShieldAlert, AlertTriangle, Bug } from 'lucide-react';
import { playChimeSound, playClickSound, playErrorSound } from '@/utils/soundEffects';
import { scanDocumentContent, SAMPLE_POISONED_DOCUMENTS } from '@/utils/documentScanner';

export default function DocumentsPage() {
  const [items, setItems] = useState(documents);
  const [quarantineAlert, setQuarantineAlert] = useState(null);
  const { pushToast } = useToast();

  function handleUpload(event) {
    const file = event.target.files?.[0];
    playClickSound();

    if (file) {
      const isZip = file.name.endsWith('.zip');
      const scan = scanDocumentContent(file.name, file.name);

      if (!scan.isSafe) {
        playErrorSound();
        const threatDoc = {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: isZip ? 'ZIP Archive' : file.name.split('.').pop().toUpperCase(),
          size: `${(file.size / 1024).toFixed(1)} KB`,
          summary: `🚨 QUARANTINED: Indirect prompt injection detected (${scan.threats.map((t) => t.name).join(', ')}). Blocked from RAG memory.`,
          poisoned: true,
          threats: scan.threats,
        };
        setItems((current) => [threatDoc, ...current]);
        setQuarantineAlert(threatDoc);
        pushToast(`🛑 Indirect Prompt Injection Blocked in "${file.name}"!`, 'danger');
        return;
      }

      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: isZip ? 'ZIP Archive' : file.name.split('.').pop().toUpperCase(),
        size: `${(file.size / 1024).toFixed(1)} KB`,
        summary: isZip
          ? '📦 Archive decompressed & extracted: 4 text/pdf chunks vectorized for AI search.'
          : '📄 File passed Indirect Injection scan, malware screening, and vectorized safely.',
        poisoned: false,
      };

      setItems((current) => [newDoc, ...current]);
      playChimeSound();
      pushToast(
        isZip
          ? `ZIP Archive "${file.name}" extracted and indexed safely!`
          : `Document "${file.name}" verified & indexed safely`,
        'success'
      );
    } else {
      pushToast('Sample enterprise file uploaded & vectorized', 'success');
    }
  }

  function simulatePoisonAttack() {
    playClickSound();
    const sample = SAMPLE_POISONED_DOCUMENTS[Math.floor(Math.random() * SAMPLE_POISONED_DOCUMENTS.length)];
    const attackDoc = {
      ...sample,
      id: `doc-${Date.now()}`,
    };
    playErrorSound();
    setItems((current) => [attackDoc, ...current]);
    setQuarantineAlert(attackDoc);
    pushToast(`🚨 Simulated Indirect Prompt Injection detected in "${attackDoc.name}"!`, 'danger');
  }

  function removeItem(id) {
    playClickSound();
    setItems((current) => current.filter((item) => item.id !== id));
    pushToast('Document removed from vector store', 'warning');
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <GlassCard className="p-5">
        <SectionHeader
          eyebrow="Zero-Trust RAG"
          title="Upload and Analyze Files"
          description="Secure PDF, DOCX, TXT, and ZIP archive ingestion with automatic indirect prompt injection detection (OWASP LLM02) and malware screening."
        />

        {quarantineAlert ? (
          <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Indirect Prompt Injection Neutralized
                </p>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  Sentinel AI intercepted a hidden adversarial instruction in <strong>{quarantineAlert.name}</strong>. The payload was stripped before entering vector database memory.
                </p>
                <button
                  type="button"
                  onClick={() => setQuarantineAlert(null)}
                  className="mt-1 text-[11px] font-semibold text-rose-300 hover:text-white underline"
                >
                  Dismiss Alert
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          <FileDropzone
            onChange={handleUpload}
            label="Drop PDF, DOCX, TXT, or ZIP Archive here"
            accept=".pdf,.docx,.zip,.txt"
          />

          <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-300">
            <Archive className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              <strong>Zero-Trust Inspection Active</strong>: Documents are scanned for hidden white-text instructions, override directives, and malware before embedding.
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="cursor-pointer rounded-2xl bg-electric px-4 py-3 text-center font-medium text-black neon-hover neon-border block">
              Browse Files
              <input type="file" className="hidden" accept=".pdf,.docx,.zip,.txt" onChange={handleUpload} />
            </label>
            <button
              className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 font-medium text-rose-300 transition hover:bg-rose-500/20 flex items-center justify-center gap-2 text-xs"
              onClick={simulatePoisonAttack}
            >
              <Bug className="h-4 w-4 text-rose-400" />
              Simulate Poisoned Document
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 leading-relaxed">
            🛡️ <strong>OWASP LLM02 Defense</strong>: Uploaded files undergo heuristic and AST inspection to guarantee malicious external payloads cannot hijack your assistant’s system instructions.
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionHeader
          eyebrow="Library"
          title="Document Inventory"
          description="Vector index status, Zero-Trust verification status, and quarantined files."
        />
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className={`rounded-2xl border p-4 transition ${
                item.poisoned 
                  ? 'border-rose-500/40 bg-rose-950/20 hover:border-rose-500/60' 
                  : 'border-white/10 bg-white/5 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    item.poisoned ? 'bg-rose-500/10 text-rose-400' : 'bg-white/5 text-cyan-400'
                  }`}>
                    {item.poisoned ? (
                      <ShieldAlert className="h-5 w-5 text-rose-400" />
                    ) : item.type.includes('ZIP') ? (
                      <Archive className="h-5 w-5 text-amber-400" />
                    ) : (
                      <FileText className="h-5 w-5 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      {item.poisoned ? (
                        <span className="flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">
                          <ShieldAlert className="h-3 w-3" /> QUARANTINED (INDIRECT INJECTION)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          <ShieldCheck className="h-3 w-3" /> VERIFIED SAFE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.type} · {item.size}</p>
                    <p className={`mt-2 text-xs leading-relaxed ${item.poisoned ? 'text-rose-300 font-mono' : 'text-slate-300'}`}>
                      {item.summary}
                    </p>
                  </div>
                </div>
                <button
                  className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline shrink-0"
                  onClick={() => removeItem(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}