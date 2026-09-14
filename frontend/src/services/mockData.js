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
  { id: 'doc-1', name: 'Employee-Handbook.pdf', type: 'PDF', size: '1.5 MB', summary: 'Company handbook with policies and security guidance.' },
  { id: 'doc-2', name: 'Q3-Strategy.docx', type: 'DOCX', size: '860 KB', summary: 'Strategic planning deck for the quarter.' },
  { id: 'doc-3', name: 'Security-Playbook.pdf', type: 'PDF', size: '2.4 MB', summary: 'Incident response and enterprise defense playbook.' },
];

export const chatThreads = [
  { id: 'chat-1', title: 'Summarize HR Policy', preview: 'I need a concise summary of the employee handbook.', updatedAt: '10:42 AM' },
  { id: 'chat-2', title: 'Draft Security Notice', preview: 'Create a company-wide reminder about phishing.', updatedAt: '09:18 AM' },
  { id: 'chat-3', title: 'Analyze Vendor Contract', preview: 'Extract risk factors from the attached contract.', updatedAt: 'Yesterday' },
];

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