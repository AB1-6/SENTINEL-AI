const jailbreakPatterns = [
  { pattern: /ignore\s+(all\s+)?(previous\s+)?(instructions|guidelines|rules|prompts)/i, label: 'Instruction Override' },
  { pattern: /forget\s+(all\s+)?(previous\s+)?(instructions|guidelines|rules|prompts|memory)/i, label: 'Memory Reset Injection' },
  { pattern: /enter\s+(developer\s+mode|dev\s+mode|god\s+mode|unrestricted\s+mode)/i, label: 'Developer Mode Escalation' },
  { pattern: /bypass(\s+all)?\s+(security|safety|restrictions|filters|controls|guardrails)/i, label: 'Safety Guardrail Bypass' },
  { pattern: /jailbreak|do\s+anything\s+now|dan\s+mode/i, label: 'Jailbreak Payload' },
  { pattern: /(reveal|show|dump|leak)\s+(your\s+)?(system\s+prompt|hidden\s+instructions|internal\s+policy)/i, label: 'System Prompt Extraction' },
  { pattern: /(show|give|dump|reveal|exfiltrate)\s+(me\s+)?(confidential|secret|private|classified)\s+(information|data|keys|records|credentials|passwords)/i, label: 'Confidential Data Exfiltration' },
  { pattern: /dump\s+(database|db|users|credentials|passwords)/i, label: 'Database Exfiltration' },
  { pattern: /drop\s+table|select\s+\*\s+from|union\s+select/i, label: 'SQL Injection Token' },
  { pattern: /eval\(|exec\(|subprocess|shell_exec|import\s+os|system\(/i, label: 'Remote Code Execution Payload' },
  { pattern: /<script|document\.cookie|javascript:/i, label: 'XSS Script Payload' },
  { pattern: /rm\s+-rf|format\s+c:/i, label: 'Destructive OS Command' },
  { pattern: /sudo\s+|break\s+character/i, label: 'Privilege Escalation' },
];

const riskyKeywords = ['password', 'credential', 'secret key', 'api key', 'private key', 'exfiltrate'];

export function calculatePromptRisk(prompt = '') {
  const normalized = (prompt || '').trim().toLowerCase();
  if (!normalized) {
    return { score: 0.05, label: 'SAFE', reason: 'Empty prompt' };
  }

  let score = 0.04;
  const reasons = [];

  jailbreakPatterns.forEach((item) => {
    if (item.pattern.test(prompt)) {
      score = Math.max(score, 0.85);
      reasons.push(`Pattern detected: ${item.label}`);
    }
  });

  riskyKeywords.forEach((keyword) => {
    if (normalized.includes(keyword)) {
      score += 0.15;
      reasons.push(`Sensitive keyword: ${keyword}`);
    }
  });

  if (prompt.length > 800) {
    score += 0.1;
    reasons.push('High token volume payload');
  }

  score = Math.min(score, 0.99);

  return {
    score: Number(score.toFixed(2)),
    label: score >= 0.5 ? 'JAILBREAK' : 'SAFE',
    reason: reasons.length ? reasons.join('; ') : 'Zero-Trust AST heuristic scan passed',
  };
}