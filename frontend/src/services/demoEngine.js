export function classifyPrompt(prompt = '') {
  const normalized = prompt.toLowerCase();
  const threats = [
    'forget all',
    'ignore all',
    'ignore guidelines',
    'forget guidelines',
    'give me users details',
    'users details',
    'system prompt',
    'bypass',
    'jailbreak',
    'reveal policy',
    'reveal users',
    'sudo',
    'override',
    'show passwords',
    'secret key',
    'admin access',
    'hack',
    'dump database',
    'sql injection',
    'eval(',
    'exec(',
    '<script',
    'system(',
    'rm -rf',
    'drop table',
    'select * from',
    'process.env',
    'shell_exec',
    'import os',
    'subprocess',
    'fetch(',
  ];
  const matches = threats.filter((item) => normalized.includes(item));
  const score = Math.min(0.98, 0.08 + matches.length * 0.44 + (prompt.length > 300 ? 0.1 : 0));
  return {
    score: Number(score.toFixed(2)),
    label: matches.length > 0 || score >= 0.5 ? 'JAILBREAK' : 'SAFE',
    reason: matches.length ? `Threat patterns detected: ${matches.join(', ')}` : 'Heuristic zero-trust scan passed',
  };
}

export function generateResponse(prompt = '') {
  const q = prompt.trim().toLowerCase();

  // 1. Code Attack / Script Injection Attempt
  if (
    q.includes('<script') ||
    q.includes('eval(') ||
    q.includes('exec(') ||
    q.includes('system(') ||
    q.includes('rm -rf') ||
    q.includes('drop table') ||
    q.includes('process.env') ||
    q.includes('shell_exec') ||
    q.includes('subprocess')
  ) {
    return `🚨 **CODE INJECTION & RCE PAYLOAD BLOCKED**\n\n**Sentinel Zero-Trust Exploit Detection Engine**\n\n- **Exploit Type**: Remote Code Execution (RCE) / XSS / Malicious Script Payload\n- **Target Prompt**: *"${prompt}"*\n- **Risk Score**: **CRITICAL (0.98)**\n- **Defensive Barrier**: Sandboxed & Intercepted before code parsing.\n- **Action Taken**: Payload neutralized. IP address flagged in real-time threat stream.`;
  }

  // 2. Jailbreak / Security Override Attempts
  if (
    q.includes('forget') ||
    q.includes('ignore') ||
    q.includes('bypass') ||
    q.includes('jailbreak') ||
    q.includes('system prompt')
  ) {
    return `🛡️ **ACCESS BLOCKED BY SENTINEL AI SECURITY GATEWAY**\n\n**Security Threat Detected**: Unauthorized Administrative Escalation & Prompt Injection Attempt\n\n- **Target Prompt**: *"${prompt}"*\n- **Risk Level**: **CRITICAL (0.96)**\n- **Enforcement Action**: The Zero-Trust Security Gateway intercepted this request before it reached the model.\n- **Policy Enforcement**: User credentials, PII data, and system guidelines are cryptographically protected.\n\n*This event has been logged to the Live Security Telemetry Stream.*`;
  }

  // 3. Registered Users & Accounts Query
  if (q.includes('user') || q.includes('users') || q.includes('who are the users') || q.includes('account') || q.includes('member')) {
    return `### 👥 Registered Enterprise Users & Roles\n\nThere are currently **4 active enterprise user accounts** in Sentinel AI 2.0:\n\n1. 👑 **Anlin Punne** — *Super Administrator (anlinpunneli@gmail.com - Level 5 Full Control)*\n2. 🛡️ **Alex Mercer** — *Lead Security Engineer (alex.mercer@sentinel.local - SecOps Audit)*\n3. 👤 **David Kim** — *Standard Employee (employee@sentinel.local - Standard User)*\n4. 📄 **Elena Rostova** — *Compliance Officer (Audit Read-Only)*\n\nAll accounts enforce multi-factor authentication (MFA) and 256-bit signed JWT zero-trust session validation.`;
  }

  // 4. Financial, Cash Flow, Burn Rate & Invoice Questions
  if (
    q.includes('cashflow') ||
    q.includes('cash flow') ||
    q.includes('runway') ||
    q.includes('burn') ||
    q.includes('invoice') ||
    q.includes('balance') ||
    q.includes('money') ||
    q.includes('financial') ||
    q.includes('revenue') ||
    q.includes('pay')
  ) {
    return `### 💼 Financial & Cash Flow Intelligence\n\nRegarding **"${prompt}"**:\n\n- **Liquid Cash Balance**: **₹85,000** available across operational accounts.\n- **Monthly Net Burn Rate**: **₹42,000 / month** (payroll, software SaaS, payables).\n- **Projected Cash Runway**: **61 Days** before mandatory invoice collection.\n- **Pending Collections**: 3 overdue invoices totaling **₹2,43,000** (Kavya Boutique, Sree Fabrics, Nexus Retailers).\n\n*Recommendation*: Trigger automated AI payment reminders for overdue invoices on the **Financial Operations** page to extend liquidity!`;
  }

  // 5. Coding & Software Development Questions (Python, JS, React, Node, SQL, APIs)
  if (
    q.includes('code') ||
    q.includes('python') ||
    q.includes('javascript') ||
    q.includes('react') ||
    q.includes('node') ||
    q.includes('api') ||
    q.includes('sql') ||
    q.includes('function') ||
    q.includes('programming') ||
    q.includes('how to code')
  ) {
    return `### 💻 Software Development & Code Intelligence\n\nHere is technical guidance regarding **"${prompt}"**:\n\n\`\`\`javascript\n// Example Sentinel AI Secure API Integration\nasync function fetchSecureData(endpoint, token) {\n  const response = await fetch(endpoint, {\n    headers: {\n      'Authorization': \`Bearer \${token}\`,\n      'Content-Type': 'application/json'\n    }\n  });\n  return await response.json();\n}\n\`\`\`\n\n- **Best Practices**:\n  1. Always enforce 256-bit JWT token authentication for REST endpoints.\n  2. Use parameterized queries for database calls to eliminate SQL injection.\n  3. Sanitize user inputs client-side and server-side before execution.`;
  }

  // 6. Cyber Security, Zero Trust & Attack Defense Questions
  if (
    q.includes('zero trust') ||
    q.includes('security') ||
    q.includes('attack') ||
    q.includes('defense') ||
    q.includes('xss') ||
    q.includes('rce') ||
    q.includes('jwt') ||
    q.includes('firewall') ||
    q.includes('vulnerability')
  ) {
    return `### 🛡️ Cyber Security & Threat Intelligence\n\nRegarding **"${prompt}"**:\n\n- **Zero-Trust Principle**: *"Never Trust, Always Verify"*. Every request requires cryptographic JWT token validation regardless of network origin.\n- **Defensive Barriers**:\n  1. **Input AST Payload Scanning** — Blocks \`eval\`, \`exec\`, \`<script>\`, \`system()\`, and SQL injection payloads.\n  2. **Output XSS Sanitization** — HTML tags are escaped into plain text.\n  3. **Level 5 Emergency Lockdown** — 1-click Super Admin freeze of non-admin prompt traffic.`;
  }

  // 7. Indexed Documents & Knowledge Base Query
  if (q.includes('document') || q.includes('file') || q.includes('handbook') || q.includes('playbook') || q.includes('pdf') || q.includes('docx')) {
    return `### 📄 Indexed Enterprise Knowledge Base\n\nThe following documents are currently indexed in the secure RAG vector store:\n\n- 📄 **Employee Handbook.pdf** (General IT & HR security guidelines)\n- 🛡️ **Security Playbook.pdf** (Incident response & threat mitigation protocols)\n- 📈 **Q3 Strategy.docx** (Enterprise product roadmap & architecture)\n\nYou can upload custom PDF, DOCX, TXT, or ZIP archives in the Documents library!`;
  }

  // 8. General Greetings (Only if short greeting without specific questions)
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'greetings' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.startsWith('hey ')
  ) {
    return `Hello! I am **Sentinel AI 2.0**, your enterprise zero-trust security & financial assistant.\n\nI am actively monitoring request telemetry, performing ML prompt risk scoring, and protecting your AI gateway.\n\n**How can I help you today?**\n- 👥 Ask: *"Which users are registered?"*\n- 💼 Ask: *"What is our cashflow runway balance?"*\n- 💻 Ask: *"Write a secure JavaScript API fetch function"*\n- 🛡️ Ask: *"How does zero-trust defense work?"*`;
  }

  // 9. Dynamic Comprehensive Answer for ANY general question
  const topicTitle = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  return `### 🤖 Sentinel AI Intelligence Output\n\nHere is a comprehensive breakdown regarding **"${prompt}"**:\n\n- **Subject Analysis**: **${topicTitle}**\n- **Zero-Trust Security Status**: **SAFE (0.04 Risk Score)** — Evaluated through Sentinel Gateway.\n\n#### Key Key Takeaways & Information:\n1. **Core Concept**: "${prompt}" has been analyzed for security compliance, policy alignment, and factual accuracy.\n2. **Enterprise Guidance**: When integrating or implementing concepts related to ${prompt}, ensure zero-trust access controls and encrypted data storage are enforced.\n3. **Actionable Next Steps**: You can query specific files in the Document library, inspect live telemetry on the Dashboard, or simulate financial scenarios in Financial Operations!`;
}

export function streamChunks(text, onChunk, delay = 18) {
  const segments = text.split(' ');
  let index = 0;
  const timer = window.setInterval(() => {
    if (index >= segments.length) {
      window.clearInterval(timer);
      return;
    }
    onChunk(`${segments[index]} `);
    index += 1;
  }, delay);
  return () => window.clearInterval(timer);
}