/**
 * Sentinel AI 2.0 - Enterprise Chat History Service
 * Provides persistent multi-session conversation storage, search, rename, delete, resume, and export.
 */

const STORAGE_KEY = 'sentinel.chatThreads';
const ACTIVE_THREAD_KEY = 'sentinel.activeThreadId';

export const DEFAULT_THREADS = [
  {
    id: 'thread-debtors-audit',
    title: 'Outstanding Debtors & Collections Audit',
    preview: 'Analysis of overdue invoices for Angel Rose Biju, Diya Joy, and Anlin totaling ₹2,43,000.',
    updatedAt: 'Today at 08:45 PM',
    timestamp: Date.now() - 3600000,
    messages: [
      {
        role: 'user',
        content: 'who all are there to pay money?',
        meta: { timestamp: '08:44 PM', riskScore: 4 }
      },
      {
        role: 'assistant',
        content: `### 📋 Outstanding Client Receivables & Debtors\n\nThere are currently **3 client accounts with overdue payments**, totaling **₹2,43,000** in uncollected revenue:\n\n| Client & Company | Invoice ID | Amount Due | Delay / Overdue | Risk Tier | Action Tier |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Angel Rose Biju**<br>*Rosewood Cloud Systems Inc.* | \`INV-2026-002\` | **₹1,20,000** | **18 days overdue** | 🟡 Medium | Medium Firm Follow-up |\n| **Diya Joy**<br>*JoyNex Digital Retail Ltd.* | \`INV-2026-003\` | **₹78,000** | **42 days overdue** | 🔴 Critical | Strict Final Notice |\n| **Anlin**<br>*Apex CyberLogix Solutions Pvt. Ltd.* | \`INV-2026-001\` | **₹45,000** | **6 days overdue** | 🟢 Low | Polite Check-in |\n\n#### 📊 Portfolio Overview & Cashflow Impact:\n- **Total Overdue Receivables**: **₹2,43,000** across 3 accounts\n- **Current Operational Cash**: **₹85,000** (61 days of runway)\n- **Top Financial Exposure**: **Angel Rose Biju / Rosewood Cloud Systems** (₹1,20,000 — **49.4%** of total overdue)\n- **Longest Delinquency**: **Diya Joy / JoyNex Digital Retail** (₹78,000 — **42 days overdue**)\n- **Runway Post-Collection**: Collecting all 3 accounts extends runway from **61 Days to 234 Days (~7.8 months)**!`,
        meta: { verified: true, latency: 18, model: 'Sentinel Gateway', timestamp: '08:45 PM' }
      }
    ]
  },
  {
    id: 'thread-company-policy',
    title: 'Company Policy & Rules (POL-2026-V2.0)',
    preview: 'Review of Net-30 credit terms, delay penalty tiers, and Level 1-5 RBAC security matrix.',
    updatedAt: 'Today at 03:15 PM',
    timestamp: Date.now() - 21600000,
    messages: [
      {
        role: 'user',
        content: 'what is our company policy on payment delays?',
        meta: { timestamp: '03:14 PM', riskScore: 4 }
      },
      {
        role: 'assistant',
        content: `### 📜 Sentinel AI Technologies Inc. — Corporate Policy (Doc #POL-2026-V2.0)\n\nUnder **Article III: Enterprise Invoicing & Credit Terms (Net-30 Standard)**:\n- **Standard Term**: Net-30 from invoice issuance.\n- **Slight Delay (1-10 Days)**: Friendly AP courtesy check-in (Polite Message). Grace period applies.\n- **Moderate Delay (11-30 Days)**: Firm notice with requirement for payment UTR verification within 5 business days.\n- **Critical Delay (30+ Days)**: Automatic 48-hour cure notice warning of Copilot API quota suspension and legal escalation.\n- **Official Financial Remittance Contact**: \`sentinalai2.0@gmail.com\`.`,
        meta: { verified: true, latency: 22, model: 'Sentinel Gateway', timestamp: '03:15 PM' }
      }
    ]
  },
  {
    id: 'thread-stress-test',
    title: 'Cash Runway & 30-Day Delay Stress Test',
    preview: 'Evaluation of 61-day baseline runway and top client 30-day payment delay impact.',
    updatedAt: 'Yesterday at 05:20 PM',
    timestamp: Date.now() - 86400000,
    messages: [
      {
        role: 'user',
        content: 'What happens if our top client delays payment by 30 days?',
        meta: { timestamp: '05:19 PM', riskScore: 5 }
      },
      {
        role: 'assistant',
        content: `### ⚠️ Stress Test: 30-Day Top Client Payment Delay\n\n- **Client**: Angel Rose Biju (Rosewood Cloud Systems Inc. — ₹1,20,000)\n- **Baseline Liquid Balance**: ₹85,000 (61 days runway)\n- **Impact at Day 30**: Operational balance plunges to **₹7,000** (runway collapses from 61 days to **~5 days**).\n- **Risk Classification**: **CRITICAL INSOLVENCY ALERT**.\n- **Recommended Action**: Trigger 1-Click Autonomous Solvency Auto-Pilot immediately from Financial Operations.`,
        meta: { verified: true, latency: 19, model: 'Sentinel Gateway', timestamp: '05:20 PM' }
      }
    ]
  }
];

function notifyStorageChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sentinel-chat-history-updated'));
  }
}

export const chatHistoryService = {
  getThreads() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_THREADS));
        return DEFAULT_THREADS;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_THREADS));
        return DEFAULT_THREADS;
      }
      return parsed.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (e) {
      console.warn('Failed to read chat threads:', e);
      return DEFAULT_THREADS;
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
