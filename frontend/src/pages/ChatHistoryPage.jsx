import { useMemo, useState } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import { chatThreads } from '@/services/mockData';

export default function ChatHistoryPage() {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => chatThreads.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.preview.toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <GlassCard className="p-5">
      <SectionHeader eyebrow="History" title="Conversation History" description="Search, rename, delete, and export secure AI sessions." />
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
      <div className="mt-5 grid gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-300">{item.preview}</p>
              </div>
              <div className="text-right text-xs text-slate-400">{item.updatedAt}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}