const jailbreakPatterns = [
  // 1. Instruction Override / Jailbreak (typo tolerant: ignore, ingone, ingore, ignre, ignone, igore, disregard, override, bypass, etc.)
  { 
    pattern: /(?:ignore|ingone|ingore|ignre|ignone|igore|disregard|disreguard|override|overide|over-ride|neglect|circumvent|bypass|bypas|forget|drop|cancel|disable|turn\s*off|stop\s+following|do\s+not\s+follow|dont\s+follow|abandon)\s+(?:all\s+)?(?:previous\s+|prior\s+|system\s+|established\s+|current\s+)?(?:instructions|guidelines|rules|prompts|policies|constraints|guardrails|safety|security|checks)/i, 
    label: 'Instruction Override' 
  },
  { 
    pattern: /(?:forget|reset|clear|wipe)\s+(?:all\s+)?(?:previous\s+|prior\s+)?(?:instructions|guidelines|rules|prompts|memory|context|policies)/i, 
    label: 'Memory Reset Injection' 
  },
  { 
    pattern: /(?:enter|switch\s+to|activate|enable)\s+(?:developer\s+mode|dev\s+mode|god\s+mode|unrestricted\s+mode|dan\s+mode|debug\s+mode|superadmin\s+mode)/i, 
    label: 'Developer Mode Escalation' 
  },
  { 
    pattern: /(?:bypass|circumvent|disable|skip|override|break|ignore)(\s+all)?\s+(?:security|safety|restrictions|filters|controls|guardrails|policies|protections)/i, 
    label: 'Safety Guardrail Bypass' 
  },
  { 
    pattern: /jailbreak|do\s+anything\s+now|dan\s+mode|always\s+comply|never\s+refuse|unrestricted\s+ai|jailbroken/i, 
    label: 'Jailbreak Payload' 
  },
  // 2. Proprietary Source Code & System Architecture Extraction
  { 
    pattern: /(?:what\s+is|whats|show|give|reveal|dump|leak|share|print|output|display|provide|extract)\s+(?:me\s+)?(?:all\s+)?(?:the\s+)?(?:your\s+)?(?:system\s+prompt|initialization\s+instructions|hidden\s+instructions|internal\s+policy|secret\s+instructions)/i, 
    label: 'System Prompt Extraction' 
  },
  { 
    pattern: /(?:what\s+is|whats|show|give|reveal|dump|leak|share|print|output|display|provide|extract)\s+(?:me\s+)?(?:all\s+)?(?:the\s+)?(?:your\s+)?(?:source\s+)?code\s+(?:for|of|behind|in)\s+(?:this\s+ai|this\s+assistant|this\s+app|this\s+system|this\s+model|sentinel)/i, 
    label: 'Proprietary Source Code Extraction (CWE-200)' 
  },
  { 
    pattern: /(?:show|give|reveal|dump|leak|extract|print|share|provide)\s+(?:me\s+)?(?:all\s+)?(?:your\s+)?(?:source\s+code|codebase|underlying\s+code|backend\s+code|model\s+weights|internal\s+algorithms)/i, 
    label: 'Proprietary Codebase Extraction (CWE-200)' 
  },
  { 
    pattern: /(?:how\s+are\s+you|how\s+is\s+this\s+ai|how\s+is\s+sentinel)\s+(?:coded|programmed|built\s+under\s+the\s+hood|implemented\s+internally)/i, 
    label: 'Internal Architecture Extraction' 
  },
  // 3. Confidential Data & Corporate Info Exfiltration
  { 
    pattern: /(?:show|give|dump|reveal|exfiltrate|leak|extract|print|share|tell)\s+(?:me\s+)?(?:all\s+)?(?:confidential|secret|private|classified|internal|restricted|sensitive)?\s*(?:company\s+info|company\s+data|company\s+secrets|internal\s+info|confidential\s+info|private\s+info|financial\s+secrets|employee\s+passwords|user\s+credentials|tokens|api\s+keys|credentials|passwords)/i, 
    label: 'Confidential Data Exfiltration' 
  },
  { 
    pattern: /(?:give|show|dump|reveal|leak|tell|share|extract)\s+(?:me\s+)?(?:all\s+)?(?:the\s+)?(?:company\s+info|company\s+secrets|internal\s+records|internal\s+data)/i, 
    label: 'Unauthorized Corporate Info Disclosure' 
  },
  { pattern: /dump\s+(database|db|users|credentials|passwords|accounts|tokens)/i, label: 'Database Exfiltration' },
  { pattern: /drop\s+table|select\s+\*\s+from|union\s+select/i, label: 'SQL Injection Token' },
  { pattern: /eval\(|exec\(|subprocess|shell_exec|import\s+os|system\(/i, label: 'Remote Code Execution Payload' },
  { pattern: /<script|document\.cookie|javascript:/i, label: 'XSS Script Payload' },
  { pattern: /rm\s+-rf|format\s+c:/i, label: 'Destructive OS Command' },
  { pattern: /sudo\s+|break\s+character/i, label: 'Privilege Escalation' },
  { pattern: /process\.env|api[_-]?key|secret[_-]?key|jwt[_-]?secret|hmac[_-]?key/i, label: 'Environment / Secret Probing' },
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