const jailbreakPatterns = [
  /ignore all previous instructions/i,
  /system prompt/i,
  /developer message/i,
  /reveal.*policy/i,
  /bypass.*safety/i,
  /do anything now/i,
  /jailbreak/i,
  /sudo/i,
  /break character/i,
];

const riskyKeywords = ['password', 'credential', 'token', 'secret', 'api key', 'private key', 'exfiltrate'];

export function calculatePromptRisk(prompt = '') {
  const normalized = prompt.trim().toLowerCase();
  if (!normalized) {
    return { score: 0.05, label: 'SAFE', reason: 'Empty prompt' };
  }

  let score = 0.08;
  const reasons = [];

  jailbreakPatterns.forEach((pattern) => {
    if (pattern.test(prompt)) {
      score += 0.3;
      reasons.push(`Matched pattern: ${pattern}`);
    }
  });

  riskyKeywords.forEach((keyword) => {
    if (normalized.includes(keyword)) {
      score += 0.08;
      reasons.push(`Contains sensitive keyword: ${keyword}`);
    }
  });

  if (prompt.length > 500) {
    score += 0.1;
    reasons.push('Very long prompt');
  }

  if (/[`{}<>$]/.test(prompt)) {
    score += 0.05;
    reasons.push('Contains code-like tokens');
  }

  score = Math.min(score, 0.99);

  return {
    score: Number(score.toFixed(2)),
    label: score >= 0.6 ? 'JAILBREAK' : 'SAFE',
    reason: reasons.length ? reasons.join('; ') : 'Heuristic scan passed',
  };
}