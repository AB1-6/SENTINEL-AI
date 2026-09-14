const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

function generateRedesignedKeynotePPT() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9'; // Widescreen 13.33" x 7.5"

  // Premium Cyber Palette (Microsoft Build / Google Cloud / Apple Keynote)
  const C_BG = '081120';
  const C_HEADER_BG = '0D1A30';
  const C_CARD_BG = '0F1F38';
  const C_CYAN = '00E5FF';
  const C_BLUE = '3B82F6';
  const C_PURPLE = '7C3AED';
  const C_WHITE = 'FFFFFF';
  const C_MUTED = '94A3B8';
  const C_RED = 'EF4444';
  const C_GREEN = '10B981';
  const C_AMBER = 'F59E0B';

  // 12-Column Grid Alignment Rules
  const MARGIN_LEFT = 0.8;
  const SLIDE_WIDTH = 11.73;

  function addSlideHeader(slide, title, category) {
    slide.background = { color: C_BG };
    
    // Top HUD Accent Bar
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: 0.05, fill: C_CYAN });
    
    // Fixed Title & Subtitle Position (Symmetrical across ALL slides)
    slide.addText(title, {
      x: MARGIN_LEFT,
      y: 0.45,
      w: SLIDE_WIDTH,
      h: 0.55,
      fontSize: 28,
      bold: true,
      color: C_WHITE,
      fontFace: 'Helvetica',
    });

    slide.addText(category.toUpperCase(), {
      x: MARGIN_LEFT,
      y: 1.05,
      w: SLIDE_WIDTH,
      h: 0.35,
      fontSize: 12,
      bold: true,
      color: C_CYAN,
      fontFace: 'Helvetica',
    });

    // Subtle horizontal divider line
    slide.addShape(pptx.shapes.RECTANGLE, { x: MARGIN_LEFT, y: 1.45, w: SLIDE_WIDTH, h: 0.015, fill: '1E293B' });
  }

  // ==========================================
  // SLIDE 1: PROJECT IDEA
  // ==========================================
  const s1 = pptx.addSlide();
  addSlideHeader(s1, 'What is Sentinel AI?', 'Project Idea & Enterprise Vision');

  s1.addText('Companies are rapidly adopting AI tools like Google Gemini and ChatGPT.', {
    x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.35, fontSize: 15, color: C_WHITE, bold: true
  });

  // 2 Equal Column Problem Cards
  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: MARGIN_LEFT, y: 2.15, w: 5.7, h: 2.2, fill: '1C0D17', line: { color: C_RED, width: 1.5 }, rectRadius: 0.1 });
  s1.addText('🔒 Sensitive Data Exposure', { x: MARGIN_LEFT + 0.3, y: 2.35, fontSize: 16, bold: true, color: C_RED });
  s1.addText('• Employees paste passwords, bank accounts, or financial reports into AI prompts.\n• Creates severe compliance violations under GDPR, HIPAA, and SOC2.', { x: MARGIN_LEFT + 0.3, y: 2.85, w: 5.1, fontSize: 12, color: C_MUTED, lineSpacing: 16 });

  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.83, y: 2.15, w: 5.7, h: 2.2, fill: '1C160B', line: { color: C_AMBER, width: 1.5 }, rectRadius: 0.1 });
  s1.addText('⚠️ AI Jailbreaks & Attacks', { x: 7.13, y: 2.35, fontSize: 16, bold: true, color: C_AMBER });
  s1.addText('• Hackers manipulate LLMs using prompt injection and jailbreak payloads.\n• Tricks AI into bypassing safety boundaries and dumping secret data.', { x: 7.13, y: 2.85, w: 5.1, fontSize: 12, color: C_MUTED, lineSpacing: 16 });

  s1.addText('Sentinel AI sits between employees and the AI model, scanning every prompt before it reaches the AI.', {
    x: MARGIN_LEFT, y: 4.55, w: SLIDE_WIDTH, h: 0.35, fontSize: 13, bold: true, color: C_CYAN
  });

  // 4 Equal Flow Nodes
  const flowNodes = [
    { label: '👤 Employee', bg: '0F172A', border: C_MUTED },
    { label: '🛡️ Sentinel AI', bg: '0B2847', border: C_CYAN },
    { label: '🤖 Google Gemini', bg: '1E1B4B', border: C_PURPLE },
    { label: '✅ Safe Response', bg: '064E3B', border: C_GREEN },
  ];
  flowNodes.forEach((node, idx) => {
    const xPos = MARGIN_LEFT + idx * 2.98;
    s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: xPos, y: 5.05, w: 2.78, h: 1.7, fill: node.bg, line: { color: node.border, width: 1.5 }, rectRadius: 0.1 });
    s1.addText(node.label, { x: xPos + 0.1, y: 5.7, w: 2.58, fontSize: 13, bold: true, color: C_WHITE, align: 'center' });
  });

  // ==========================================
  // SLIDE 2: WHAT IS ZERO TRUST?
  // ==========================================
  const s2 = pptx.addSlide();
  addSlideHeader(s2, 'Zero Trust Security Architecture', 'Core Security Principle');

  // Principle Banner
  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.8, fill: '1E1B4B', line: { color: C_PURPLE, width: 1.5 }, rectRadius: 0.1 });
  s2.addText('"Never Trust. Always Verify."', { x: MARGIN_LEFT + 0.3, y: 1.88, fontSize: 18, bold: true, color: C_CYAN });
  s2.addText('Every prompt request is verified before accessing the AI model.', { x: 5.5, y: 1.9, fontSize: 13, color: C_MUTED });

  // 2 Equal Column Cards
  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: MARGIN_LEFT, y: 2.65, w: 5.7, h: 4.2, fill: C_CARD_BG, line: { color: C_CYAN, width: 1 }, rectRadius: 0.1 });
  s2.addText('Core Zero Trust Features:', { x: MARGIN_LEFT + 0.3, y: 2.9, fontSize: 15, bold: true, color: C_CYAN });
  s2.addText('• Verify every prompt in real time\n• Detect sensitive PII and credentials\n• Detect malicious prompt injection\n• Block unsafe requests instantly (Risk >= 0.50)\n• Allow only safe, sanitized prompts', {
    x: MARGIN_LEFT + 0.3, y: 3.45, w: 5.1, fontSize: 13, color: C_WHITE, lineSpacing: 22
  });

  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.83, y: 2.65, w: 5.7, h: 4.2, fill: '0B1C33', line: { color: C_CYAN, width: 1.5 }, rectRadius: 0.1 });
  s2.addText('🛡️ HOLOGRAPHIC VERIFICATION FLOW', { x: 7.13, y: 2.9, w: 5.1, fontSize: 13, bold: true, color: C_CYAN, align: 'center' });
  s2.addText('User Prompt Payload\n↓\n[ 100Hz Verification Engine ]\n↓', { x: 7.13, y: 3.5, w: 5.1, fontSize: 12, color: C_MUTED, align: 'center', lineSpacing: 16 });

  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 7.23, y: 5.4, w: 2.3, h: 1.1, fill: '064E3B', line: { color: C_GREEN, width: 1.5 }, rectRadius: 0.1 });
  s2.addText('✅ ALLOW\n(Safe Prompt)', { x: 7.23, y: 5.65, w: 2.3, fontSize: 12, bold: true, color: C_GREEN, align: 'center' });

  s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 9.83, y: 5.4, w: 2.3, h: 1.1, fill: '450A0A', line: { color: C_RED, width: 1.5 }, rectRadius: 0.1 });
  s2.addText('❌ BLOCK\n(Risk Score >= 0.50)', { x: 9.83, y: 5.65, w: 2.3, fontSize: 12, bold: true, color: C_RED, align: 'center' });

  // ==========================================
  // SLIDE 3: JWT AUTHENTICATION
  // ==========================================
  const s3 = pptx.addSlide();
  addSlideHeader(s3, 'Secure Role-Based Authentication', 'Identity & Access Control');

  s3.addText('JWT (JSON Web Token) securely verifies every user identity and session authorization.', {
    x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.35, fontSize: 14, color: C_WHITE
  });

  // 3 Equal Column Role Cards
  const roles = [
    { title: '👑 Super Admin', subtitle: 'Level 5 Access', desc: 'Full System Control, Emergency Lockdown Mode, Cryptographic Re-keying.', color: C_CYAN },
    { title: '🛡️ Security Analyst', subtitle: 'SecOps Audit', desc: 'Real-time Telemetry Stream Inspection & Security Policy Review.', color: C_BLUE },
    { title: '👤 Standard Employee', subtitle: 'Standard User', desc: 'Filtered Assistant Access with Client-Side PII Masking Enforcement.', color: C_PURPLE },
  ];

  roles.forEach((r, idx) => {
    const xPos = MARGIN_LEFT + idx * 3.98;
    s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: xPos, y: 2.15, w: 3.77, h: 3.0, fill: C_CARD_BG, line: { color: r.color, width: 1.5 }, rectRadius: 0.1 });
    s3.addText(r.title, { x: xPos + 0.2, y: 2.4, fontSize: 16, bold: true, color: r.color });
    s3.addText(r.subtitle, { x: xPos + 0.2, y: 2.8, fontSize: 11, bold: true, color: C_MUTED });
    s3.addText(r.desc, { x: xPos + 0.2, y: 3.35, w: 3.37, fontSize: 12, color: C_WHITE, lineSpacing: 16 });
  });

  // Benefits Bar
  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: MARGIN_LEFT, y: 5.35, w: SLIDE_WIDTH, h: 1.5, fill: '0F1B2F', line: { color: C_CYAN, width: 1 }, rectRadius: 0.1 });
  s3.addText('KEY AUTHENTICATION BENEFITS:', { x: MARGIN_LEFT + 0.3, y: 5.55, fontSize: 12, bold: true, color: C_CYAN });
  s3.addText('✔ Secure Login  |  ✔ Session Authentication  |  ✔ Role-Based Access  |  ✔ Prevent Unauthorized Access', {
    x: MARGIN_LEFT + 0.3, y: 6.05, w: 11.13, fontSize: 13, bold: true, color: C_WHITE
  });

  // ==========================================
  // SLIDE 4: WHAT IS GEMMA FLOWPILOT?
  // ==========================================
  const s4 = pptx.addSlide();
  addSlideHeader(s4, 'Gemma FlowPilot — AI Financial Copilot', 'Financial Intelligence');

  s4.addText('Gemma FlowPilot is an AI Financial Copilot that helps businesses manage their finances.', {
    x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.35, fontSize: 14, color: C_WHITE
  });

  const finFeatures = [
    { title: '📊 30-Day Cashflow Forecast', desc: 'Predicts liquid balance (₹85,000) vs net monthly burn rate (₹42,000/mo).' },
    { title: '📈 Business Runway Prediction', desc: 'Monitors solvency timeline, alerting managers 61 days before liquidity crunch.' },
    { title: '🎛️ AI What-If Simulation', desc: 'Live sliders for payment delays (0-60d), supplier extensions, and staff hires.' },
    { title: '✉️ Invoice Collection Assistant', desc: 'Automated payment reminder outreach via WhatsApp Business & Corporate Email.' },
    { title: '💡 Decision Support Engine', desc: 'Provides real-time recommendations to optimize working capital and payables.' },
  ];

  finFeatures.forEach((f, idx) => {
    const col = idx % 2 === 0 ? MARGIN_LEFT : 6.83;
    const row = idx < 2 ? 2.15 : idx < 4 ? 3.85 : 5.55;
    const width = idx === 4 ? SLIDE_WIDTH : 5.7;
    const height = idx === 4 ? 1.3 : 1.5;
    s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: col, y: row, w: width, h: height, fill: C_CARD_BG, line: { color: C_AMBER, width: 1 }, rectRadius: 0.1 });
    s4.addText(f.title, { x: col + 0.2, y: row + 0.2, fontSize: 14, bold: true, color: C_AMBER });
    s4.addText(f.desc, { x: col + 0.2, y: row + 0.65, w: width - 0.4, fontSize: 12, color: C_MUTED });
  });

  // ==========================================
  // SLIDE 5: THREE BUSINESS SCENARIOS
  // ==========================================
  const s5 = pptx.addSlide();
  addSlideHeader(s5, 'Scenario Simulation Engine', 'Macro Financial Modeling');

  s5.addText('Simulates three glowing financial macroeconomic states on the 30-Day Runway Chart:', {
    x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.35, fontSize: 14, color: C_WHITE
  });

  const scenarios = [
    { title: '😊 Optimistic', subtitle: 'Healthy Solvency', desc: '• Customers pay on time.\n• Cash balance rises to ₹1,55,000.\n• Business remains financially healthy.', color: C_GREEN, fill: '064E3B' },
    { title: '😐 Crunch', subtitle: 'Tight Cashflow', desc: '• Some customers delay payments.\n• Cashflow balance drops to ₹18,000.\n• Working capital becomes tighter.', color: C_AMBER, fill: '451A03' },
    { title: '🚨 Crisis', subtitle: 'Insolvency Risk', desc: '• Many invoices remain unpaid.\n• Balance drops below zero (-₹24,000).\n• Business receives an early warning.', color: C_RED, fill: '450A0A' },
  ];

  scenarios.forEach((sc, idx) => {
    const xPos = MARGIN_LEFT + idx * 3.98;
    s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: xPos, y: 2.15, w: 3.77, h: 4.7, fill: sc.fill, line: { color: sc.color, width: 2 }, rectRadius: 0.1 });
    s5.addText(sc.title, { x: xPos + 0.3, y: 2.45, fontSize: 20, bold: true, color: sc.color });
    s5.addText(sc.subtitle, { x: xPos + 0.3, y: 2.95, fontSize: 12, bold: true, color: C_WHITE });
    s5.addText(sc.desc, { x: xPos + 0.3, y: 3.6, w: 3.17, fontSize: 13, color: C_MUTED, lineSpacing: 20 });
  });

  // ==========================================
  // SLIDE 6: AUTOMATED AI REMINDERS
  // ==========================================
  const s6 = pptx.addSlide();
  addSlideHeader(s6, 'AI Invoice Collection Bot', 'Automated Customer Outreach');

  s6.addText('Gemma automatically reminds overdue customers through WhatsApp Business & Corporate Email:', {
    x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.35, fontSize: 14, color: C_WHITE
  });

  const levels = [
    { title: '🟢 Friendly Reminder', subtitle: 'Gentle Nudge', desc: '"Hi Sree Fabrics, hope business is going great! Just a gentle check-in regarding invoice INV-002 (₹1,20,000)..."', color: C_GREEN, fill: '064E3B' },
    { title: '🟡 Firm Reminder', subtitle: '5-Day Deadline', desc: '"Hello Kavya Boutique, invoice INV-001 (₹45,000) is 38 days overdue. Please arrange payment by Friday..."', color: C_AMBER, fill: '451A03' },
    { title: '🔴 Final Notice', subtitle: '48-Hour Warning', desc: '"URGENT NOTICE: Invoice INV-001 is 38 days overdue. Please remit within 48 hours to avoid legal action..."', color: C_RED, fill: '450A0A' },
  ];

  levels.forEach((l, idx) => {
    const xPos = MARGIN_LEFT + idx * 3.98;
    s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: xPos, y: 2.15, w: 3.77, h: 4.7, fill: l.fill, line: { color: l.color, width: 2 }, rectRadius: 0.1 });
    s6.addText(l.title, { x: xPos + 0.3, y: 2.45, fontSize: 17, bold: true, color: l.color });
    s6.addText(l.subtitle, { x: xPos + 0.3, y: 2.95, fontSize: 12, bold: true, color: C_WHITE });
    s6.addText(l.desc, { x: xPos + 0.3, y: 3.6, w: 3.17, fontSize: 12, italic: true, color: C_MUTED, lineSpacing: 18 });
  });

  // ==========================================
  // SLIDE 7: HOW HACKERS ATTACK AI
  // ==========================================
  const s7 = pptx.addSlide();
  addSlideHeader(s7, 'Common AI Threats & Attack Vectors', 'Security Threat Analysis');

  s7.addText('Four major adversarial attack vectors targeting enterprise AI implementations:', {
    x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.35, fontSize: 14, color: C_RED
  });

  const threats = [
    { title: '1. Prompt Injection', desc: 'Attempting to override system instructions and force the AI into unintended actions.' },
    { title: '2. Jailbreak Attacks', desc: 'Using roleplay tricks ("DAN - Do Anything Now") to bypass AI safety guidelines.' },
    { title: '3. Sensitive Data Extraction', desc: 'Tricking the LLM into dumping secret system prompts, API keys, or user records.' },
    { title: '4. Malicious Code Injection', desc: 'Sending harmful scripts such as Remote Code Execution (eval/exec) or XSS payloads.' },
  ];

  threats.forEach((t, idx) => {
    const col = idx % 2 === 0 ? MARGIN_LEFT : 6.83;
    const row = idx < 2 ? 2.15 : 4.65;
    s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: col, y: row, w: 5.7, h: 2.2, fill: '2D0B0B', line: { color: C_RED, width: 1.5 }, rectRadius: 0.1 });
    s7.addText(t.title, { x: col + 0.3, y: row + 0.25, fontSize: 15, bold: true, color: C_RED });
    s7.addText(t.desc, { x: col + 0.3, y: row + 0.75, w: 5.1, fontSize: 12, color: C_MUTED, lineSpacing: 16 });
  });

  // ==========================================
  // SLIDE 8: HOW SENTINEL AI STOPS ATTACKS
  // ==========================================
  const s8 = pptx.addSlide();
  addSlideHeader(s8, 'AI Security Pipeline Workflow', 'Defense Engine');

  s8.addText('End-to-End Inspection Pipeline:', {
    x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 0.35, fontSize: 14, bold: true, color: C_CYAN
  });

  const pipeSteps = [
    { step: '1. User Prompt', desc: 'Input captured in UI' },
    { step: '2. PII Detection', desc: 'Client-side ZK Redactor' },
    { step: '3. Jailbreak Check', desc: 'AST & Pattern Scanner' },
    { step: '4. Risk Scoring', desc: '100Hz ML Risk Engine' },
    { step: '5. Decision Engine', desc: 'Allow or Block' },
  ];

  pipeSteps.forEach((p, idx) => {
    const xPos = MARGIN_LEFT + idx * 2.38;
    s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: xPos, y: 2.15, w: 2.2, h: 2.4, fill: C_CARD_BG, line: { color: C_CYAN, width: 1 }, rectRadius: 0.1 });
    s8.addText(p.step, { x: xPos + 0.1, y: 2.35, w: 2.0, fontSize: 12, bold: true, color: C_CYAN, align: 'center' });
    s8.addText(p.desc, { x: xPos + 0.1, y: 3.1, w: 2.0, fontSize: 11, color: C_MUTED, align: 'center' });
  });

  // Decision Box
  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: MARGIN_LEFT, y: 4.85, w: 5.7, h: 2.0, fill: '064E3B', line: { color: C_GREEN, width: 1.5 }, rectRadius: 0.1 });
  s8.addText('✅ Safe Prompt (Risk < 0.50)', { x: MARGIN_LEFT + 0.3, y: 5.1, fontSize: 14, bold: true, color: C_GREEN });
  s8.addText('Forwarded to Google Gemini / Gemma Model for normal response generation.', { x: MARGIN_LEFT + 0.3, y: 5.6, w: 5.1, fontSize: 12, color: C_WHITE });

  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.83, y: 4.85, w: 5.7, h: 2.0, fill: '450A0A', line: { color: C_RED, width: 1.5 }, rectRadius: 0.1 });
  s8.addText('❌ Unsafe Prompt (Risk >= 0.50)', { x: 7.13, y: 5.1, fontSize: 14, bold: true, color: C_RED });
  s8.addText('Blocked instantly! Triggers Web Audio alarm and 0.96 Critical Alert.', { x: 7.13, y: 5.6, w: 5.1, fontSize: 12, color: C_WHITE });

  // ==========================================
  // SLIDE 9: FEATURES OVERVIEW
  // ==========================================
  const s9 = pptx.addSlide();
  addSlideHeader(s9, 'Platform Features Overview', '10 Flagship Features');

  const fList = [
    '🛡️ Zero Trust Gateway',
    '🔑 JWT Authentication',
    '🙈 PII Masking Redactor',
    '🚨 Prompt Injection Scanner',
    '🛑 Jailbreak Interceptor',
    '📈 Risk Scoring Engine',
    '📊 Cashflow Forecast',
    '🎛️ Scenario Simulation',
    '✉️ Invoice Reminder Bot',
    '📄 Executive PDF Export',
  ];

  fList.forEach((item, idx) => {
    const col = idx % 2 === 0 ? MARGIN_LEFT : 6.83;
    const row = 1.75 + Math.floor(idx / 2) * 0.98;
    s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: col, y: row, w: 5.7, h: 0.82, fill: C_CARD_BG, line: { color: C_CYAN, width: 1 }, rectRadius: 0.1 });
    s9.addText(item, { x: col + 0.3, y: row + 0.22, fontSize: 13, bold: true, color: C_WHITE });
  });

  // ==========================================
  // SLIDE 10: TECHNOLOGY STACK
  // ==========================================
  const s10 = pptx.addSlide();
  addSlideHeader(s10, 'Technology Stack & Architecture', 'Cyber Architecture');

  const techStack = [
    { cat: 'Frontend', name: 'React 19, Tailwind CSS, Vite', color: C_CYAN },
    { cat: 'Backend', name: 'Node.js, Express.js REST API', color: C_BLUE },
    { cat: 'Database', name: 'MongoDB / In-Memory Store', color: C_GREEN },
    { cat: 'AI Models', name: 'Google Gemini 1.5, Gemma 2B/7B', color: C_PURPLE },
    { cat: 'Security Layer', name: 'JWT Bearer, Zero Trust, PII Scanner', color: C_RED },
    { cat: 'Analytics & Charts', name: 'Recharts Responsive Engine', color: C_AMBER },
  ];

  techStack.forEach((t, idx) => {
    const col = idx % 2 === 0 ? MARGIN_LEFT : 6.83;
    const row = 1.75 + Math.floor(idx / 2) * 1.65;
    s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: col, y: row, w: 5.7, h: 1.45, fill: C_CARD_BG, line: { color: t.color, width: 1.5 }, rectRadius: 0.1 });
    s10.addText(t.cat.toUpperCase(), { x: col + 0.25, y: row + 0.25, fontSize: 11, bold: true, color: t.color });
    s10.addText(t.name, { x: col + 0.25, y: row + 0.65, fontSize: 14, bold: true, color: C_WHITE });
  });

  // ==========================================
  // SLIDE 11: REAL-WORLD APPLICATIONS
  // ==========================================
  const s11 = pptx.addSlide();
  addSlideHeader(s11, 'Real-World Enterprise Applications', 'Industry Use Cases');

  const industries = [
    '🏦 Banks & Finance',
    '🏥 Healthcare Providers',
    '🛡️ Insurance Companies',
    '🏛️ Government Agencies',
    '💻 IT & Tech Enterprise',
    '🎓 Universities & Higher Ed',
    '🏪 Small & Medium SMEs',
    '🏭 Manufacturing Companies',
  ];

  industries.forEach((ind, idx) => {
    const col = idx % 2 === 0 ? MARGIN_LEFT : 6.83;
    const row = 1.75 + Math.floor(idx / 2) * 1.25;
    s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: col, y: row, w: 5.7, h: 1.05, fill: C_CARD_BG, line: { color: C_CYAN, width: 1 }, rectRadius: 0.1 });
    s11.addText(ind, { x: col + 0.3, y: row + 0.35, fontSize: 14, bold: true, color: C_WHITE });
  });

  // ==========================================
  // SLIDE 12: WHY SENTINEL AI? (COMPARISON TABLE)
  // ==========================================
  const s12 = pptx.addSlide();
  addSlideHeader(s12, 'Why Sentinel AI? (Comparison Matrix)', 'Competitive Advantage');

  const tableRows = [
    [{ text: 'Feature Criteria', options: { bold: true, color: C_CYAN, fill: '0D1A30' } }, { text: 'Traditional AI Tools', options: { bold: true, color: C_RED, fill: '0D1A30' } }, { text: 'Sentinel AI 2.0', options: { bold: true, color: C_GREEN, fill: '0D1A30' } }],
    [{ text: 'Core Capability', options: { color: C_WHITE } }, { text: 'Answers Questions Only', options: { color: C_MUTED } }, { text: 'Answers + Protects Data', options: { color: C_GREEN, bold: true } }],
    [{ text: 'Zero Trust Gateway', options: { color: C_WHITE } }, { text: '❌ No Zero Trust Gateway', options: { color: C_RED } }, { text: '✅ 100Hz Zero Trust Inspection', options: { color: C_GREEN, bold: true } }],
    [{ text: 'PII Protection', options: { color: C_WHITE } }, { text: '❌ No PII Redaction', options: { color: C_RED } }, { text: '✅ Automatic ZK PII Masking', options: { color: C_GREEN, bold: true } }],
    [{ text: 'Attack Detection', options: { color: C_WHITE } }, { text: '❌ No Jailbreak Detection', options: { color: C_RED } }, { text: '✅ 0.96 Critical Jailbreak Alert', options: { color: C_GREEN, bold: true } }],
    [{ text: 'Financial Copilot', options: { color: C_WHITE } }, { text: '❌ No Financial Intelligence', options: { color: C_RED } }, { text: '✅ Gemma 30-Day Runway AI', options: { color: C_GREEN, bold: true } }],
    [{ text: 'Invoice Follow-up', options: { color: C_WHITE } }, { text: '❌ Manual Invoice Follow-up', options: { color: C_RED } }, { text: '✅ AI WhatsApp & Email Reminders', options: { color: C_GREEN, bold: true } }],
  ];

  s12.addTable(tableRows, { x: MARGIN_LEFT, y: 1.65, w: SLIDE_WIDTH, h: 5.2, fontSize: 11, border: { pt: 1, color: '1E293B' } });

  // ==========================================
  // SLIDE 13: FUTURE SCOPE
  // ==========================================
  const s13 = pptx.addSlide();
  addSlideHeader(s13, 'Strategic Future Roadmap', 'Next-Gen Expansion');

  const roadmap = [
    '🎙️ Voice AI Security',
    '📄 OCR Document Protection',
    '📱 Mobile Security App',
    '🌐 Multi-Language Support',
    '🤖 ChatGPT + Claude + Gemini',
    '📊 Enterprise SIEM Integration',
    '✉️ Phishing Detection',
    '☁️ Enterprise Cloud Deployment',
    '🔮 Predictive AI Analytics',
  ];

  roadmap.forEach((rItem, idx) => {
    const col = idx % 3 === 0 ? MARGIN_LEFT : idx % 3 === 1 ? 4.78 : 8.76;
    const row = 1.75 + Math.floor(idx / 3) * 1.65;
    s13.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: col, y: row, w: 3.77, h: 1.45, fill: C_CARD_BG, line: { color: C_PURPLE, width: 1.5 }, rectRadius: 0.1 });
    s13.addText(rItem, { x: col + 0.2, y: row + 0.45, w: 3.37, fontSize: 13, bold: true, color: C_WHITE, align: 'center' });
  });

  // Output Paths (saving with _Redesigned suffix to prevent EBUSY open file locks)
  const rootPptPath = path.join('c:\\Users\\HP\\Desktop\\SENTINEL', 'ppt sentinal ai_Redesigned.pptx');
  const customPptPath = path.join('c:\\Users\\HP\\Desktop\\SENTINEL', 'Sentinel_AI_2.0_Redesigned_Presentation.pptx');
  const artifactPath = path.join('C:\\Users\\HP\\.gemini\\antigravity\\brain\\193e59cd-d697-46f9-b7d3-7f0e06df9368', 'Sentinel_AI_2.0_Redesigned_Presentation.pptx');

  pptx.writeFile({ fileName: customPptPath }).then(() => {
    console.log('Redesigned Keynote PPTX created at:', customPptPath);
    try { fs.copyFileSync(customPptPath, rootPptPath); } catch(e){}
    try { fs.copyFileSync(customPptPath, artifactPath); } catch(e){}
  });
}

generateRedesignedKeynotePPT();
