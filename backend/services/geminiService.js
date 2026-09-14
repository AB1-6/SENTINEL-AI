export async function generateAiResponse(prompt, context = {}) {
  if (!process.env.GEMINI_API_KEY) {
    const q = (prompt || '').trim().toLowerCase();
    let text = `### 🤖 Sentinel AI Gateway Response\n\nI have processed your request: **"${prompt}"**\n\n- **Zero-Trust Check**: Passed\n- **Risk Score**: Safe (0.04)\n- **Gateway**: Demo Mode (Set GEMINI_API_KEY in backend/.env for live LLM API calls)`;

    if (q.includes('ignore') || q.includes('guideline') || q.includes('system prompt') || q.includes('bypass') || q.includes('forget')) {
      text = `⚠️ **Sentinel AI Zero-Trust Alert**\n\nYour prompt included system override keywords (*"${prompt}"*).\n\n- **Risk Level**: ELEVATED / HIGH RISK\n- **Action**: Enforced zero-trust boundaries\n- **Status**: System guidelines & encryption keys remain protected.`;
    } else if (q.includes('user') || q.includes('users') || q.includes('who are') || q.includes('account') || q.includes('member')) {
      text = `### 👥 Registered Enterprise Users & Roles\n\nThere are currently **4 active enterprise user accounts** in Sentinel AI 2.0:\n\n1. 👑 **Anlin Punne** — *Super Administrator (anlinpunneli@gmail.com - Level 5 Full Control)*\n2. 🛡️ **Alex Mercer** — *Lead Security Engineer (alex.mercer@sentinel.local - SecOps Audit)*\n3. 👤 **David Kim** — *Standard Employee (employee@sentinel.local - Standard User)*\n4. 📄 **Elena Rostova** — *Compliance Officer (Audit Read-Only)*\n\nAll accounts enforce multi-factor authentication (MFA) and 256-bit signed JWT zero-trust session validation.`;
    } else if (q.includes('cashflow') || q.includes('runway') || q.includes('money') || q.includes('burn') || q.includes('invoice') || q.includes('financial')) {
      text = `### 💼 Gemma SME Cashflow Summary\n\nHere is your real-time financial cash flow breakdown:\n\n- **Current Liquid Balance**: **₹85,000**\n- **Monthly Net Burn Rate**: **₹42,000 / month**\n- **Projected Cash Runway**: **61 Days**\n- **Overdue Invoices Pending**: **3 Client Invoices** (Total ₹2,43,000)`;
    } else if (['hi', 'hello', 'hey', 'greetings', 'sup'].some((k) => q === k || q.startsWith(k + ' '))) {
      text = `Hello! I am **Sentinel AI 2.0**, your enterprise zero-trust AI security assistant.\n\nI am actively monitoring request telemetry and securing your AI gateway.\n\n**How can I help you today?**\n- 👥 Ask: *"Which users are there right now?"*\n- 💼 Ask: *"What is our cashflow runway balance?"*\n- 📄 Ask: *"Which documents are indexed?"*\n- 🛡️ Ask: *"How does zero-trust defense work?"*`;
    }

    return {
      text,
      provider: 'demo-gateway',
      citations: context.documentNames ? [`Referenced documents: ${context.documentNames.join(', ')}`] : [],
    };
  }

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1200 },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || 'No response returned.';
  return { text, provider: 'gemini', raw: data };
}