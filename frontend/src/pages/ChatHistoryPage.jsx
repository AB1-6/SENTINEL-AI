import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { chatHistoryService } from '@/services/chatHistoryService';
import { useToast } from '@/contexts/ToastContext';
import { playClickSound, playChimeSound, playErrorSound } from '@/utils/soundEffects';
import {
  Search, Plus, MessageSquare, Trash2, Edit3, Download, ExternalLink,
  ChevronDown, ChevronUp, Check, X, Clock, ShieldCheck, ShieldAlert,
  FileText, Sparkles, RefreshCw, Archive, Database
} from 'lucide-react';

export default function ChatHistoryPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [threads, setThreads] = useState([]);
  const [search, setSearch] = useState('');
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  // Load threads and subscribe to storage updates
  const loadThreads = () => {
    const list = chatHistoryService.getThreads();
    setThreads(list);
    setActiveThreadId(chatHistoryService.getActiveThreadId());
  };

  useEffect(() => {
    loadThreads();
    const handleUpdate = () => loadThreads();
    window.addEventListener('sentinel-chat-history-updated', handleUpdate);
    return () => window.removeEventListener('sentinel-chat-history-updated', handleUpdate);
  }, []);

  // Filtered threads
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return threads;
    return threads.filter((item) => {
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchPreview = item.preview?.toLowerCase().includes(q);
      const matchMessages = item.messages?.some(
        (m) => m.content?.toLowerCase().includes(q)
      );
      return matchTitle || matchPreview || matchMessages;
    });
  }, [threads, search]);

  // Aggregate statistics
  const totalMessages = useMemo(() => {
    return threads.reduce((sum, t) => sum + (t.messages?.length || 0), 0);
  }, [threads]);

  // Actions
  const handleOpenThread = (thread) => {
    playClickSound();
    chatHistoryService.setActiveThreadId(thread.id);
    pushToast(`Resumed session: "${thread.title}"`, 'info');
    navigate('/assistant');
  };

  const handleStartNewChat = () => {
    playClickSound();
    const newThread = chatHistoryService.createThread({
      title: 'New Conversation',
      messages: []
    });
    pushToast('Started fresh Enterprise Assistant session', 'success');
    navigate('/assistant');
  };

  const handleDeleteThread = (e, threadId, title) => {
    e.stopPropagation();
    playClickSound();
    const ok = window.confirm(`Are you sure you want to permanently delete session "${title}"?`);
    if (!ok) return;

    const deleted = chatHistoryService.deleteThread(threadId);
    if (deleted) {
      playErrorSound();
      pushToast(`Deleted session: "${title}"`, 'danger');
      loadThreads();
    }
  };

  const handleStartRename = (e, thread) => {
    e.stopPropagation();
    playClickSound();
    setEditingThreadId(thread.id);
    setEditTitleInput(thread.title);
  };

  const handleSaveRename = (e, threadId) => {
    e.stopPropagation();
    if (!editTitleInput.trim()) return;
    playChimeSound();
    chatHistoryService.renameThread(threadId, editTitleInput.trim());
    pushToast('Session title updated successfully', 'success');
    setEditingThreadId(null);
    loadThreads();
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingThreadId(null);
  };

  const handleToggleExpand = (e, threadId) => {
    e.stopPropagation();
    playClickSound();
    setExpandedThreadId((prev) => (prev === threadId ? null : threadId));
  };

  const handleExportMd = (e, thread) => {
    e.stopPropagation();
    playChimeSound();
    chatHistoryService.exportThreadAsMarkdown(thread);
    pushToast(`Exported "${thread.title}" as Markdown (.md)`, 'success');
  };

  const handleExportJson = (e, thread) => {
    e.stopPropagation();
    playChimeSound();
    chatHistoryService.exportThreadAsJson(thread);
    pushToast(`Exported "${thread.title}" as JSON (.json)`, 'success');
  };

  const handleExportAll = () => {
    playChimeSound();
    chatHistoryService.exportAllThreadsAsJson();
    pushToast('Exported complete conversation archive', 'success');
  };

  const handleClearAll = () => {
    playClickSound();
    const ok = window.confirm('Are you sure you want to delete ALL saved conversations? This cannot be undone.');
    if (!ok) return;
    chatHistoryService.clearAllThreads();
    playErrorSound();
    pushToast('Cleared all chat history', 'info');
    loadThreads();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview Card */}
      <GlassCard className="p-6 border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <SectionHeader
              eyebrow="Enterprise Audit & Telemetry"
              title="Conversation History"
              description="Review, resume, rename, export, and search through verified Zero-Trust AI sessions."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleStartNewChat}
              className="flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
            >
              <Plus className="h-4 w-4" />
              New Conversation
            </button>

            <button
              type="button"
              onClick={handleExportAll}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              Export Archive (.json)
            </button>

            {threads.length > 0 ? (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1.5 rounded-xl border border-rose-900/40 bg-rose-950/30 px-3 py-2.5 text-xs font-medium text-rose-400 transition hover:bg-rose-900/50"
                title="Clear all stored conversation sessions"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            ) : null}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center justify-between text-xs text-sky-400">
              <span>Saved AI Sessions</span>
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="mt-1.5 text-xl font-bold text-white">{threads.length}</div>
            <p className="text-[11px] text-slate-500">Persistent client-side browser records</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span>Total Messages Logged</span>
              <Database className="h-4 w-4" />
            </div>
            <div className="mt-1.5 text-xl font-bold text-white">{totalMessages}</div>
            <p className="text-[11px] text-slate-500">Prompts & neural responses stored</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center justify-between text-xs text-amber-400">
              <span>Security Validation</span>
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="mt-1.5 text-xl font-bold text-emerald-400 flex items-center gap-1">
              Zero-Trust Verified
            </div>
            <p className="text-[11px] text-slate-500">ZK PII masked & threat-screened</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions by topic, question ('who all are there to pay money', 'policy'), or response..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-sky-500"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </GlassCard>

      {/* Threads List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Archive className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">No Matching Conversations</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm">
              {search
                ? `No conversation history found matching "${search}". Try clearing your search filter.`
                : 'No conversation sessions saved yet. Start a new conversation with the Enterprise Assistant.'}
            </p>
            <button
              type="button"
              onClick={search ? () => setSearch('') : handleStartNewChat}
              className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400"
            >
              {search ? 'Clear Search Filter' : 'Start First AI Conversation'}
            </button>
          </GlassCard>
        ) : (
          filtered.map((thread) => {
            const isEditing = editingThreadId === thread.id;
            const isExpanded = expandedThreadId === thread.id;
            const isCurrentActive = activeThreadId === thread.id;
            const msgCount = thread.messages?.length || 0;

            return (
              <GlassCard
                key={thread.id}
                className={`overflow-hidden transition-all duration-200 border-slate-800 hover:border-slate-700 ${
                  isCurrentActive ? 'ring-1 ring-sky-500/40' : ''
                }`}
              >
                {/* Main Card Header / Row */}
                <div
                  onClick={() => handleOpenThread(thread)}
                  className="flex flex-col gap-3 p-5 cursor-pointer sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 mt-0.5">
                      <MessageSquare className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitleInput}
                            onChange={(e) => setEditTitleInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(e, thread.id);
                              if (e.key === 'Escape') handleCancelRename(e);
                            }}
                            className="rounded-lg border border-sky-500 bg-slate-950 px-2.5 py-1 text-sm font-semibold text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={(e) => handleSaveRename(e, thread.id)}
                            className="rounded-md bg-emerald-500/20 p-1.5 text-emerald-400 hover:bg-emerald-500/30"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelRename}
                            className="rounded-md bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-white truncate max-w-md hover:text-sky-300 transition">
                            {thread.title}
                          </h4>
                          {isCurrentActive ? (
                            <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                              Active in Assistant
                            </span>
                          ) : null}
                          <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 font-mono">
                            {msgCount} {msgCount === 1 ? 'message' : 'messages'}
                          </span>
                        </div>
                      )}

                      <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                        {thread.preview || 'No preview available.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Meta */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className="text-[11px] text-slate-500 mr-2 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {thread.updatedAt}
                    </span>

                    {/* Resume / Open Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenThread(thread);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-400 border border-sky-500/20 hover:bg-sky-500 hover:text-slate-950 transition"
                      title="Open and resume this session in the Assistant"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Resume
                    </button>

                    {/* Inspect Transcript Accordion Toggle */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleExpand(e, thread.id)}
                      className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 hover:border-slate-700 hover:text-white transition"
                      title={isExpanded ? 'Collapse Transcript' : 'Inspect Transcript'}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {/* Rename Button */}
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(e, thread)}
                      className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 hover:border-slate-700 hover:text-white transition"
                      title="Rename session"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* Export Markdown */}
                    <button
                      type="button"
                      onClick={(e) => handleExportMd(e, thread)}
                      className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 hover:border-slate-700 hover:text-emerald-400 transition"
                      title="Export transcript as Markdown (.md)"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteThread(e, thread.id, thread.title)}
                      className="rounded-lg border border-rose-900/30 bg-rose-950/20 p-1.5 text-rose-400 hover:border-rose-500/40 hover:bg-rose-900/40 transition"
                      title="Delete session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Transcript Preview Drawer */}
                {isExpanded ? (
                  <div className="border-t border-slate-800 bg-slate-950/70 p-5 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-sky-400" />
                        Session Transcript Preview ({thread.messages?.length || 0} items):
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleExportMd(e, thread)}
                          className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" /> Download .md
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          type="button"
                          onClick={(e) => handleExportJson(e, thread)}
                          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" /> Download .json
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {thread.messages && thread.messages.length > 0 ? (
                        thread.messages.map((msg, idx) => {
                          const isUser = msg.role === 'user';
                          return (
                            <div
                              key={idx}
                              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs ${
                                  isUser
                                    ? 'bg-sky-600 text-white font-normal'
                                    : 'border border-slate-800 bg-slate-900/90 text-slate-200'
                                }`}
                              >
                                {isUser ? (
                                  <p>{msg.content}</p>
                                ) : (
                                  <div className="prose prose-invert max-w-none text-xs">
                                    <MarkdownRenderer>{msg.content || ' '}</MarkdownRenderer>
                                  </div>
                                )}
                              </div>
                              <div className="mt-1 px-1 text-[10px] text-slate-500 font-mono">
                                {isUser ? '👤 You' : '💡 Sentinel AI'} • {msg.meta?.timestamp || 'Step ' + (idx + 1)}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic">No messages recorded in this session.</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}