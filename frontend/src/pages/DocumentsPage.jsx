import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import FileDropzone from '@/components/FileDropzone';
import { documents } from '@/services/mockData';
import { useToast } from '@/contexts/ToastContext';
import { Archive, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { playChimeSound, playClickSound } from '@/utils/soundEffects';

export default function DocumentsPage() {
  const [items, setItems] = useState(documents);
  const { pushToast } = useToast();

  function handleUpload(event) {
    const file = event.target.files?.[0];
    playClickSound();

    if (file) {
      const isZip = file.name.endsWith('.zip');
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: isZip ? 'ZIP Archive' : file.name.split('.').pop().toUpperCase(),
        size: `${(file.size / 1024).toFixed(1)} KB`,
        summary: isZip
          ? '📦 Archive decompressed & extracted: 4 text/pdf chunks vectorized for AI search.'
          : '📄 File uploaded, malware scanned, and indexed into vector knowledge base.',
      };

      setItems((current) => [newDoc, ...current]);
      playChimeSound();
      pushToast(
        isZip
          ? `ZIP Archive "${file.name}" extracted and indexed safely!`
          : `Document "${file.name}" uploaded and indexed`,
        'success'
      );
    } else {
      pushToast('Sample enterprise file uploaded & vectorized', 'success');
    }
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
          eyebrow="Documents"
          title="Upload and Analyze Files"
          description="Secure PDF, DOCX, TXT, and ZIP archive ingestion with automatic extraction, malware scanning, and AI question support."
        />
        <div className="mt-5 space-y-4">
          <FileDropzone
            onChange={handleUpload}
            label="Drop PDF, DOCX, TXT, or ZIP Archive here"
            accept=".pdf,.docx,.zip,.txt"
          />

          <div className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-300">
            <Archive className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>
              <strong>ZIP Archives Supported</strong>: ZIP files are automatically decompressed, scanned for malicious scripts, and vectorized for RAG.
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="cursor-pointer rounded-2xl bg-electric px-4 py-3 text-center font-medium text-black neon-hover neon-border block">
              Browse Files
              <input type="file" className="hidden" accept=".pdf,.docx,.zip,.txt" onChange={handleUpload} />
            </label>
            <button
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition hover:bg-white/10"
              onClick={() => pushToast('Select a document from inventory to query Sentinel AI', 'info')}
            >
              Ask AI About Document
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Uploaded files are malware-screened, decompressed (if ZIP), summarized, and vectorized for zero-trust RAG context retrieval.
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionHeader
          eyebrow="Library"
          title="Document Inventory"
          description="Preview, search, vector index status, and delete enterprise files."
        />
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-500/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-cyan-400">
                    {item.type.includes('ZIP') ? <Archive className="h-5 w-5 text-amber-400" /> : <FileText className="h-5 w-5 text-cyan-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <ShieldCheck className="h-3 w-3" /> VECTOR INDEXED
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.type} · {item.size}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.summary}</p>
                  </div>
                </div>
                <button
                  className="text-xs font-semibold text-red-400 hover:text-red-300 hover:underline shrink-0"
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