import { calculatePromptRisk } from '../utils/security.js';
import { createRecord, listCollection } from './dataStore.js';

export function evaluatePrompt(prompt, context = {}) {
  const result = calculatePromptRisk(prompt);
  const severity = result.score >= 0.8 ? 'critical' : result.score >= 0.6 ? 'high' : result.score >= 0.35 ? 'medium' : 'low';

  const logEntry = createRecord('securityLogs', {
    userId: context.userId || 'anonymous',
    prompt,
    score: result.score,
    label: result.label,
    action: result.label === 'JAILBREAK' ? 'blocked' : 'allowed',
    reason: result.reason,
    route: context.route || '/api/chat',
    ip: context.ip || '127.0.0.1',
    severity,
  });

  if (result.label === 'JAILBREAK') {
    createRecord('alerts', {
      type: 'prompt_injection',
      severity,
      title: 'Prompt injection attempt blocked',
      message: result.reason,
      status: 'open',
    });
  }

  return { ...result, severity, logEntry };
}

export function buildSecurityStatus() {
  const logs = listCollection('securityLogs');
  const blocked = logs.filter((entry) => entry.action === 'blocked').length;
  return {
    zeroTrust: 'Active',
    jwt: 'Enabled',
    rbac: 'Enabled',
    mlDetection: 'Online',
    blockedPrompts: blocked,
    riskScore: Math.min(100, Math.round(logs.slice(-20).reduce((sum, entry) => sum + (entry.score || 0), 0) * 5)),
    securityLogs: logs,
    alerts: listCollection('alerts'),
  };
}