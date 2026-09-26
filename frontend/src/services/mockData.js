export const demoUser = {
  name: 'Anlin Punne',
  email: 'anlinpunneli@gmail.com',
  role: 'Super Administrator',
  title: 'Super Administrator (RBAC)',
  avatar: 'AP',
};

export const dashboardStats = [
  { label: 'AI Conversations', value: '2,847', delta: '+12% this week', tone: 'info' },
  { label: 'Documents', value: '1,234', delta: '+5 new today', tone: 'info' },
  { label: 'Security Events', value: '156', delta: 'All clear', tone: 'success' },
  { label: 'Active Users', value: '89', delta: '12 online now', tone: 'info' },
];

export const recentAiActivity = [
  { time: '10:42 AM', title: 'Document Uploaded', detail: 'Security scan completed successfully on API_Spec.pdf', badge: 'SCAN CLEAR' },
  { time: '09:15 AM', title: 'AI Conversation Started', detail: 'User #4092 established Zero-Trust JWT session', badge: 'JWT AUTH' },
  { time: '08:30 AM', title: 'Policy Update', detail: 'Jailbreak detection model signatures updated to v2.4', badge: 'GATEWAY' },
  { time: 'Yesterday', title: 'RBAC Check Approved', detail: 'Sarah Jenkins requested audit reports from Security Center', badge: 'RBAC CLR' },
];

export const securityAlerts = [
  { tone: 'danger', title: 'Jailbreak attempt flagged by Security Gateway', detail: 'Assistant Chat #81', time: '3m ago' },
  { tone: 'warning', title: 'Unauthorized document read request blocked', detail: 'RBAC / User #82', time: '1h ago' },
  { tone: 'success', title: 'API Token successfully rotated (JWT)', detail: 'System Cron', time: '2h ago' },
  { tone: 'success', title: 'ML security signature check cleared', detail: 'Gateway Engine', time: '4h ago' },
];

export const quickActions = [
  { title: 'New Conversation', description: 'Create a fresh secure chat', route: '/assistant' },
  { title: 'Upload File', description: 'Add a document for analysis', route: '/documents' },
  { title: 'Run Security Scan', description: 'Inspect a prompt or session', route: '/security' },
  { title: 'Manage Users', description: 'Update roles and access', route: '/users' },
];

export const documents = [
  { 
    id: 'doc-1', 
    name: 'Sentinel_Company_Policy_Rules_and_Regulations_2026.pdf', 
    type: 'PDF', 
    size: '2.8 MB', 
    summary: 'Sentinel AI Technologies Inc. official corporate governance, zero-trust security rules, employee conduct, client confidentiality, and credit collection policies.' 
  },
  { 
    id: 'doc-2', 
    name: 'SaaS_Agreement_Apex_CyberLogix_INV-2026-001.pdf', 
    type: 'PDF', 
    size: '1.4 MB', 
    summary: 'Quarterly SaaS Agreement for Apex CyberLogix Solutions Pvt. Ltd. (Anlin, CTO). Sentinel AI Gateway Pro & Prompt Injection Firewall. ₹45,000 / qtr.' 
  },
  { 
    id: 'doc-3', 
    name: 'Enterprise_Cluster_SLA_Rosewood_Cloud_INV-2026-002.pdf', 
    type: 'PDF', 
    size: '3.2 MB', 
    summary: 'Enterprise dedicated cluster & Client-Side PII Redactor agreement for Rosewood Cloud Systems Inc. (Angel Rose Biju, VP Eng). ₹1,20,000 / half-year with 99.99% uptime SLA.' 
  },
  { 
    id: 'doc-4', 
    name: 'FinOps_Copilot_Master_Agreement_JoyNex_Retail_INV-2026-003.pdf', 
    type: 'PDF', 
    size: '2.1 MB', 
    summary: 'Gemma SME Cashflow Copilot & AI Support Shield agreement with JoyNex Digital Retail Ltd. (Diya Joy, Ops Dir). Annual tier ₹78,000 with critical default escalation clause.' 
  },
  { 
    id: 'doc-5', 
    name: 'Company_Identity_Products_and_Clients.pdf', 
    type: 'PDF', 
    size: '1.8 MB', 
    summary: 'Sentinel AI Technologies Inc. corporate identity specifications, 4 commercial products, customer contracts, SLAs, and delinquency outreach tiers.' 
  },
  { 
    id: 'doc-6', 
    name: 'Sentinel_AI_2.0_Machine_Learning_and_Security_Blueprint.pdf', 
    type: 'PDF', 
    size: '2.4 MB', 
    summary: 'Machine Learning architecture, 4 ML pillars (Heuristic scoring, RAG 768-dim embeddings, RLHF guardrails, 100Hz telemetry), 8 cyber attack defenses, and PEFT/LoRA fine-tuning.' 
  },
  { 
    id: 'doc-7', 
    name: 'Sentinel_AI_Architecture_and_System_Design.pdf', 
    type: 'PDF', 
    size: '1.2 MB', 
    summary: 'Full system architecture, 8-step request flow pipeline, technology layers (React, Node, scikit-learn, MongoDB), and 7 primary database collections.' 
  },
];

export const chatThreads = [];

export const users = [
  { id: 'user-1', name: 'Anlin Punne', email: 'anlinpunneli@gmail.com', role: 'Super Administrator (RBAC)', status: 'Active (Owner)' },
  { id: 'user-2', name: 'Alex Mercer', email: 'alex.mercer@sentinel.local', role: 'Lead Security Engineer', status: 'Active' },
  { id: 'user-3', name: 'Elena Rostova', email: 'elena.rostova@sentinel.local', role: 'Compliance Officer', status: 'Active' },
  { id: 'user-4', name: 'David Kim', email: 'david.kim@sentinel.local', role: 'DevOps Specialist', status: 'Active' },
];

export const securityLogs = [
  { time: '10:36 AM', action: 'Blocked prompt injection', risk: '0.92', source: 'Chat' },
  { time: '10:22 AM', action: 'Failed login throttled', risk: '0.71', source: 'Auth' },
  { time: '09:58 AM', action: 'Document access validated', risk: '0.18', source: 'Documents' },
  { time: '09:30 AM', action: 'AI request allowed', risk: '0.09', source: 'Gateway' },
];

export const settingsDefaults = {
  theme: 'Dark Glass',
  aiProvider: 'Gemini',
  notifications: true,
  animations: true,
  security: 'Strict',
};

export const assistantGreeting = `Welcome back, Admin. Sentinel AI 2.0 is ready to secure every request before it reaches the model.`;