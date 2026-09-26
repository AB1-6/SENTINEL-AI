/**
 * Sentinel AI 2.0 - Enterprise Chat History Service
 * Provides persistent multi-session conversation storage, search, rename, delete, resume, and export.
 */

const STORAGE_KEY = 'sentinel.chatThreads';
const ACTIVE_THREAD_KEY = 'sentinel.activeThreadId';

export const DEFAULT_THREADS = [];

function notifyStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sentinel-chat-history-updated'));
  }
}

export const chatHistoryService = {
  getThreads() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (e) {
      console.warn('Failed to read chat threads:', e);
      return [];
    }
  },

  getThread(id) {
    if (!id) return null;
    const threads = this.getThreads();
    return threads.find((t) => t.id === id) || null;
  },

  getActiveThreadId() {
    try {
      return window.localStorage.getItem(ACTIVE_THREAD_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  setActiveThreadId(id) {
    try {
      if (id) {
        window.localStorage.setItem(ACTIVE_THREAD_KEY, id);
      } else {
        window.localStorage.removeItem(ACTIVE_THREAD_KEY);
      }
      notifyStorageChange();
    } catch (e) {
      console.warn('Failed to set active thread:', e);
    }
  },

  createThread({ title = 'New Conversation', messages = [] } = {}) {
    const newId = `session-${Date.now()}`;
    const now = new Date();
    const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newThread = {
      id: newId,
      title,
      preview: messages.find((m) => m.role === 'user')?.content?.slice(0, 80) || 'Started a new conversation session.',
      updatedAt: timeStr,
      timestamp: Date.now(),
      messages,
    };

    const threads = this.getThreads();
    const updated = [newThread, ...threads];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      this.setActiveThreadId(newId);
      notifyStorageChange();
    } catch (e) {
      console.warn('Failed to create thread:', e);
    }
    return newThread;
  },

  saveThread({ id, title, messages = [] }) {
    if (!id) {
      return this.createThread({ title, messages });
    }

    const threads = this.getThreads();
    const index = threads.findIndex((t) => t.id === id);
    const now = new Date();
    const timeStr = `Today at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Generate dynamic title if default or empty
    const firstUserMsg = messages.find((m) => m.role === 'user');
    let dynamicTitle = title;
    if (!dynamicTitle || dynamicTitle === 'New Conversation' || dynamicTitle.startsWith('session-')) {
      if (firstUserMsg && firstUserMsg.content) {
        const clean = firstUserMsg.content.trim().replace(/[#*`_]/g, '');
        dynamicTitle = clean.length > 38 ? clean.slice(0, 38) + '...' : clean;
      } else {
        dynamicTitle = 'Enterprise Assistant Session';
      }
    }

    // Dynamic preview from last user or assistant message
    const lastUserOrAsst = [...messages].reverse().find((m) => m.content && m.content !== '...');
    const preview = lastUserOrAsst
      ? lastUserOrAsst.content.replace(/[#*`_]/g, '').trim().slice(0, 90) + '...'
      : 'Active zero-trust conversation.';

    const updatedThread = {
      id,
      title: dynamicTitle,
      preview,
      updatedAt: timeStr,
      timestamp: Date.now(),
      messages,
    };

    let updatedList;
    if (index >= 0) {
      updatedList = [...threads];
      updatedList[index] = updatedThread;
    } else {
      updatedList = [updatedThread, ...threads];
    }

    // Sort so most recent is first
    updatedList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      this.setActiveThreadId(id);
      notifyStorageChange();
    } catch (e) {
      console.warn('Failed to save thread:', e);
    }

    return updatedThread;
  },

  renameThread(id, newTitle) {
    if (!id || !newTitle.trim()) return false;
    const threads = this.getThreads();
    const index = threads.findIndex((t) => t.id === id);
    if (index === -1) return false;

    threads[index].title = newTitle.trim();
    threads[index].timestamp = Date.now();
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
      notifyStorageChange();
      return true;
    } catch (e) {
      console.warn('Failed to rename thread:', e);
      return false;
    }
  },

  deleteThread(id) {
    if (!id) return false;
    const threads = this.getThreads();
    const filtered = threads.filter((t) => t.id !== id);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      if (this.getActiveThreadId() === id) {
        this.setActiveThreadId(null);
      }
      notifyStorageChange();
      return true;
    } catch (e) {
      console.warn('Failed to delete thread:', e);
      return false;
    }
  },

  clearAllThreads() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      this.setActiveThreadId(null);
      notifyStorageChange();
      return true;
    } catch (e) {
      console.warn('Failed to clear threads:', e);
      return false;
    }
  },

  exportThreadAsMarkdown(thread) {
    if (!thread) return;
    let md = `# ${thread.title}\n\n`;
    md += `*Session ID*: \`${thread.id}\`  \n`;
    md += `*Last Updated*: ${thread.updatedAt}  \n`;
    md += `*Platform*: Sentinel AI 2.0 Zero-Trust Gateway  \n\n`;
    md += `---\n\n`;

    (thread.messages || []).forEach((msg, idx) => {
      const isUser = msg.role === 'user';
      md += `### ${isUser ? '👤 User Prompt' : '💡 Sentinel AI Assistant'} (${msg.meta?.timestamp || 'Step ' + (idx + 1)})\n\n`;
      md += `${msg.content}\n\n`;
      if (msg.meta) {
        md += `> *Metadata: Model: ${msg.meta.model || 'Gemini 1.5'} | Risk Score: ${msg.meta.riskScore ?? 4}/100 | Latency: ${msg.meta.latency ?? 15}ms*\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${thread.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_transcript.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportThreadAsJson(thread) {
    if (!thread) return;
    const jsonStr = JSON.stringify(thread, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${thread.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportAllThreadsAsJson() {
    const threads = this.getThreads();
    const jsonStr = JSON.stringify(threads, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentinel_ai_chat_history_archive_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
