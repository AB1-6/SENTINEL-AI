const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

function createPresentation() {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';

  // Theme Colors
  const C_DARK = '07101D';
  const C_CARD = '0F172A';
  const C_CYAN = '00C8FF';
  const C_AMBER = 'F59E0B';
  const C_WHITE = 'FFFFFF';
  const C_MUTED = '94A3B8';
  const C_RED = 'EF4444';

  // Slide 1: Title Slide
  const s1 = pptx.addSlide();
  s1.background = { color: C_DARK };
  s1.addText('SENTINEL AI 2.0', { x: 0.8, y: 1.8, fontSize: 38, bold: true, color: C_WHITE });
  s1.addText('Enterprise Zero-Trust AI Security Gateway & Financial Operations Platform', { x: 0.8, y: 2.6, fontSize: 18, color: C_CYAN, bold: true });
  s1.addText('Unifying Real-Time Threat Interception with Gemma SME Cashflow Intelligence', { x: 0.8, y: 3.3, fontSize: 14, color: C_MUTED });
  s1.addText('Presented by: Anlin Punne | Super Administrator (Level 5 Access)', { x: 0.8, y: 5.5, fontSize: 12, color: C_WHITE });

  // Helper Banner Function
  function addSlideHeader(slide, title, category) {
    slide.background = { color: C_DARK };
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 0.9, fill: '0B1528' });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0.88, w: '100%', h: 0.04, fill: C_CYAN });
    slide.addText('SENTINEL AI 2.0', { x: 0.6, y: 0.2, fontSize: 18, bold: true, color: C_WHITE });
    slide.addText(category.toUpperCase(), { x: 0.6, y: 0.52, fontSize: 10, bold: true, color: C_CYAN });
    slide.addText(title, { x: 4.5, y: 0.35, fontSize: 16, bold: true, color: C_WHITE });
  }

  // Slide 2: Problem Statement
  const s2 = pptx.addSlide();
  addSlideHeader(s2, 'Executive Summary & The Problem Statement', 'Problem Analysis');
  s2.addText('Two Critical Challenges Facing Enterprise AI Adoption:', { x: 0.6, y: 1.2, fontSize: 16, bold: true, color: C_CYAN });

  // Card 1
  s2.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 5.8, h: 4.5, fill: C_CARD, line: { color: C_RED, width: 1.5 } });
  s2.addText('1. Severe Security & Data Leak Risks', { x: 0.8, y: 2.0, fontSize: 14, bold: true, color: C_RED });
  s2.addText('• Accidental PII Exposure: Employees pasting credit cards, IBAN bank accounts, and passwords into AI prompts.\n• Adversarial Jailbreaks: Hackers tricking LLMs into ignoring safety guidelines and dumping secret user records.\n• Code Injection Exploits: Remote Code Execution (RCE), XSS scripts, and SQL injections submitted via prompt payloads.', { x: 0.8, y: 2.5, w: 5.4, h: 3.5, fontSize: 12, color: C_MUTED, lineSpacing: 18 });

  // Card 2
  s2.addShape(pptx.shapes.RECTANGLE, { x: 6.8, y: 1.8, w: 5.8, h: 4.5, fill: C_CARD, line: { color: C_AMBER, width: 1.5 } });
  s2.addText('2. Financial Cashflow Uncertainty', { x: 7.0, y: 2.0, fontSize: 14, bold: true, color: C_AMBER });
  s2.addText('• Runway Visibility Shortfalls: SMEs struggle to forecast 30-day cash positions and predict insolvency dates.\n• Unpaid Invoice Aging: Money trapped in overdue client invoices (30, 60, 90+ days late).\n• Lack of Scenario Intelligence: Business owners cannot simulate payment delays or supplier payables in real time.', { x: 7.0, y: 2.5, w: 5.4, h: 3.5, fontSize: 12, color: C_MUTED, lineSpacing: 18 });

  // Slide 3: Unified Solution
  const s3 = pptx.addSlide();
  addSlideHeader(s3, 'The Unified Solution — Sentinel AI Platform', 'Platform Concept');
  s3.addText('A Dual Shield Platform Connecting Security & Financial Intelligence', { x: 0.6, y: 1.2, fontSize: 16, bold: true, color: C_CYAN });

  s3.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 12.0, h: 4.5, fill: C_CARD, line: { color: C_CYAN, width: 1.5 } });
  s3.addText('🛡️ ZERO-TRUST SECURITY FIREWALL + 💼 GEMMA CASHFLOW COPILOT', { x: 0.9, y: 2.1, fontSize: 15, bold: true, color: C_WHITE });
  s3.addText('Sentinel AI acts as a Zero-Trust Bouncer sitting between users and LLMs (Google Gemini 2.5 / Gemma).\nEvery financial query, invoice reminder draft, and prompt passes through real-time ML screening first.', { x: 0.9, y: 2.7, w: 11.4, fontSize: 13, color: C_MUTED });

  s3.addText('Key Pillars:', { x: 0.9, y: 3.8, fontSize: 13, bold: true, color: C_CYAN });
  s3.addText('1. 100Hz Real-Time ML Prompt Risk Scoring (0.00 to 1.00)\n2. Zero-Knowledge Client-Side PII Masking ([REDACTED_PII])\n3. Gemma 30-Day Cashflow Runway & Insolvency Predictor\n4. Automated AI Payment Reminders (Polite, Firm, Urgent)\n5. Level 5 Emergency System Isolation (Lockdown Mode)', { x: 0.9, y: 4.2, w: 11.4, fontSize: 12, color: C_WHITE, lineSpacing: 16 });

  // Slide 4: System Architecture
  const s4 = pptx.addSlide();
  addSlideHeader(s4, 'Technical System Architecture & Data Flow', 'Architecture');
  s4.addText('End-to-End Execution Sequence:', { x: 0.6, y: 1.2, fontSize: 16, bold: true, color: C_CYAN });

  const steps = [
    { title: '1. CLIENT INPUT', desc: 'React 19 / Vite UI captures prompt.' },
    { title: '2. ZK PII REDACTOR', desc: 'Client-side AST replaces cards/IBANs with [REDACTED_PII].' },
    { title: '3. GATEWAY GUARD', desc: 'Node/Express validates 256-bit signed JWT Bearer Tokens.' },
    { title: '4. ML RISK SCORER', desc: '100Hz engine scores prompt risk (0 to 100).' },
    { title: '5. ENFORCEMENT', desc: 'Risk >= 0.50 ? Intercepted! Risk < 0.50 ? Sent to Gemini/Gemma.' },
  ];

  steps.forEach((st, idx) => {
    const xPos = 0.6 + idx * 2.45;
    s4.addShape(pptx.shapes.RECTANGLE, { x: xPos, y: 2.0, w: 2.3, h: 4.0, fill: C_CARD, line: { color: C_CYAN, width: 1 } });
    s4.addText(st.title, { x: xPos + 0.1, y: 2.2, w: 2.1, fontSize: 11, bold: true, color: C_CYAN });
    s4.addText(st.desc, { x: xPos + 0.1, y: 3.0, w: 2.1, fontSize: 11, color: C_MUTED });
  });

  // Slide 5: Machine Learning Pillars
  const s5 = pptx.addSlide();
  addSlideHeader(s5, 'Machine Learning & AI Foundation (4 Pillars)', 'ML Architecture');

  const mlPillars = [
    { title: '1. ML Prompt Risk Scoring', desc: 'Calculates real-time Risk Scores (0.00-1.00) using prompt entropy, semantic vectors, and keyword density.' },
    { title: '2. Vector Embeddings (RAG)', desc: 'Converts uploaded PDFs/ZIPs into 768-dim vector embeddings. Uses Cosine Similarity for document context retrieval.' },
    { title: '3. Gemma LoRA Fine-Tuning', desc: 'Fine-tunes Google Gemma-2B/7B with Low-Rank Adaptation (r=16, alpha=32) across 10,000+ financial/security prompts.' },
    { title: '4. Multi-Agent Swarm', desc: 'Runs 3 parallel autonomous subagents: Financial Analyst, Security Bouncer, and Compliance Auditor.' },
  ];

  mlPillars.forEach((p, idx) => {
    const col = idx % 2 === 0 ? 0.6 : 6.8;
    const row = idx < 2 ? 1.8 : 4.3;
    s5.addShape(pptx.shapes.RECTANGLE, { x: col, y: row, w: 5.8, h: 2.2, fill: C_CARD, line: { color: C_CYAN, width: 1 } });
    s5.addText(p.title, { x: col + 0.2, y: row + 0.2, fontSize: 13, bold: true, color: C_WHITE });
    s5.addText(p.desc, { x: col + 0.2, y: row + 0.7, w: 5.4, fontSize: 11, color: C_MUTED });
  });

  // Slide 6: Dual Security Barrier
  const s6 = pptx.addSlide();
  addSlideHeader(s6, 'Dual Security Barrier — 8 Protection Layers', 'Security Matrix');

  s6.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 5.8, h: 4.5, fill: C_CARD, line: { color: C_CYAN, width: 1 } });
  s6.addText('Input & Code Attack Barriers:', { x: 0.8, y: 2.0, fontSize: 14, bold: true, color: C_CYAN });
  s6.addText('• Layer 1: AST Payload Scanner (eval, exec, <script>, DROP TABLE)\n• Layer 2: Output XSS Sanitization (Escapes HTML before DOM render)\n• Layer 3: Parameterized DB Queries (Neutralizes SQL/NoSQL injection)\n• Layer 4: Isolated Static Sandboxing (Code renders without execution)', { x: 0.8, y: 2.6, w: 5.4, fontSize: 12, color: C_MUTED, lineSpacing: 16 });

  s6.addShape(pptx.shapes.RECTANGLE, { x: 6.8, y: 1.8, w: 5.8, h: 4.5, fill: C_CARD, line: { color: C_RED, width: 1 } });
  s6.addText('External Outside Server Barriers:', { x: 7.0, y: 2.0, fontSize: 14, bold: true, color: C_RED });
  s6.addText('• Barrier 1: JWT Bearer Token Gatekeeper (Rejects unauthenticated REST)\n• Barrier 2: Level 5 System Isolation (1-Click Emergency Lockdown)\n• Barrier 3: Strict CORS Boundary Shield (Blocks cross-origin forgery)\n• Barrier 4: TLS/SSL HTTPS Tunneling (Encrypted stream + payload caps)', { x: 7.0, y: 2.6, w: 5.4, fontSize: 12, color: C_MUTED, lineSpacing: 16 });

  // Slide 7: Gemma Financial Engine
  const s7 = pptx.addSlide();
  addSlideHeader(s7, 'Gemma SME Financial Operations Center', 'Financial Engine');

  s7.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 12.0, h: 4.5, fill: C_CARD, line: { color: C_AMBER, width: 1.5 } });
  s7.addText('💼 Cashflow Forecasting & AI Invoice Collection', { x: 0.9, y: 2.1, fontSize: 15, bold: true, color: C_AMBER });
  s7.addText('• 30-Day Interactive Runway Chart: Visualizes liquid balance (Rs 85,000) and monthly burn (Rs 42,000).\n• 3 Macro Scenario Switcher: Toggle between Optimistic, Crunch, and Crisis mode.\n• Interactive "What-If" Calculator: Live sliders for Client Payment Delays, Supplier Extensions, and Hires.\n• Automated Invoice Collection Bot: Generates 3 AI reminder tones (Polite, Firm, Urgent) via WhatsApp/Email.', { x: 0.9, y: 2.7, w: 11.4, fontSize: 13, color: C_WHITE, lineSpacing: 18 });

  // Slide 8: Visual Dashboards & Features
  const s8 = pptx.addSlide();
  addSlideHeader(s8, 'Visual Dashboards & Flagship Features', 'User Interface');

  const uiCards = [
    { title: '🌐 3D Threat Heatmap', desc: 'Interactive global radar globe displaying real-time blocked cyber threat nodes across Tokyo, Frankfurt, NYC, and London.' },
    { title: '📈 24h Risk Analytics Chart', desc: 'Recharts area/bar chart tracking average prompt risk scores, jailbreak spikes, ZK PII redactions, and RCE payload blocks.' },
    { title: '📄 Executive PDF Audit Export', desc: '1-click button to compile and download formal executive security & financial compliance PDF audit reports.' },
    { title: '🔔 Slack & Teams Webhooks', desc: 'SecOps integration sending instant threat alert notifications directly to company Slack or Teams channels.' },
  ];

  uiCards.forEach((c, idx) => {
    const col = idx % 2 === 0 ? 0.6 : 6.8;
    const row = idx < 2 ? 1.8 : 4.3;
    s8.addShape(pptx.shapes.RECTANGLE, { x: col, y: row, w: 5.8, h: 2.2, fill: C_CARD, line: { color: C_CYAN, width: 1 } });
    s8.addText(c.title, { x: col + 0.2, y: row + 0.2, fontSize: 13, bold: true, color: C_CYAN });
    s8.addText(c.desc, { x: col + 0.2, y: row + 0.7, w: 5.4, fontSize: 11, color: C_MUTED });
  });

  // Slide 9: Business Impact
  const s9 = pptx.addSlide();
  addSlideHeader(s9, 'Business Impact & Enterprise Value', 'ROI & Impact');

  s9.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 3.8, h: 4.5, fill: C_CARD, line: { color: C_CYAN, width: 1 } });
  s9.addText('🔒 100% Data Protection', { x: 0.8, y: 2.1, fontSize: 14, bold: true, color: C_CYAN });
  s9.addText('Zero sensitive data leaks or PII exposure. Full compliance with SOC2, GDPR, and enterprise AI safety regulations.', { x: 0.8, y: 2.7, w: 3.4, fontSize: 12, color: C_MUTED });

  s9.addShape(pptx.shapes.RECTANGLE, { x: 4.7, y: 1.8, w: 3.8, h: 4.5, fill: C_CARD, line: { color: C_AMBER, width: 1 } });
  s9.addText('📈 Zero Insolvency Surprises', { x: 4.9, y: 2.1, fontSize: 14, bold: true, color: C_AMBER });
  s9.addText('SMEs gain 30-day runway visibility and automate late invoice collections in seconds instead of hours.', { x: 4.9, y: 2.7, w: 3.4, fontSize: 12, color: C_MUTED });

  s9.addShape(pptx.shapes.RECTANGLE, { x: 8.8, y: 1.8, w: 3.8, h: 4.5, fill: C_CARD, line: { color: C_RED, width: 1 } });
  s9.addText('🛡️ Instant Attack Lockdown', { x: 9.0, y: 2.1, fontSize: 14, bold: true, color: C_RED });
  s9.addText('Super Admins freeze non-admin prompt traffic in 1 second during an active cyber attack.', { x: 9.0, y: 2.7, w: 3.4, fontSize: 12, color: C_MUTED });

  // Slide 10: Conclusion & Demo Links
  const s10 = pptx.addSlide();
  addSlideHeader(s10, 'Conclusion & Live Demo Access', 'Live Demo');

  s10.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.8, w: 12.0, h: 4.5, fill: C_CARD, line: { color: C_CYAN, width: 1.5 } });
  s10.addText('🚀 LIVE ACCESS ENDPOINTS & DEMO CREDENTIALS', { x: 0.9, y: 2.1, fontSize: 16, bold: true, color: C_CYAN });
  s10.addText('• Live Public Website (Global): https://6672966b1c976a.lhr.life\n• Local Network (Same Wi-Fi): http://192.168.18.86:5173/\n• Local Host Web App: http://localhost:5173/\n\nRole Credentials:\n• Super Administrator: anlinpunneli@gmail.com / Anlin20#69\n• Security Analyst: alex.mercer@sentinel.local / Sentinel123!\n• Standard Employee: employee@sentinel.local / Sentinel123!', { x: 0.9, y: 2.7, w: 11.4, fontSize: 13, color: C_WHITE, lineSpacing: 18 });

  const targetPath = path.join(process.cwd(), 'Sentinel_AI_2.0_Presentation.pptx');
  const artifactPath = path.join('C:\\Users\\HP\\.gemini\\antigravity\\brain\\193e59cd-d697-46f9-b7d3-7f0e06df9368', 'Sentinel_AI_2.0_Presentation.pptx');

  pptx.writeFile({ fileName: targetPath }).then(() => {
    console.log('PPTX successfully created at:', targetPath);
    fs.copyFileSync(targetPath, artifactPath);
    console.log('PPTX successfully copied to artifact at:', artifactPath);
  });
}

createPresentation();
