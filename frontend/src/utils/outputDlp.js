/**
 * Sentinel AI 2.0 - Client-Side Bidirectional Output DLP Guardrail
 * Scans output text from neural models for secret leaks, API keys, credentials, and sensitive PII.
 */

const DLP_PATTERNS = [
  {
    type: 'Google Gemini / Cloud API Key',
    regex: /\bAIza[0-9A-Za-z-_]{35}\b/g,
    replacement: '[REDACTED_GOOGLE_API_KEY]',
  },
  {
    type: 'OpenAI Secret Key',
    regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/g,
    replacement: '[REDACTED_OPENAI_API_KEY]',
  },
  {
    type: 'AWS Access Key ID',
    regex: /\b(?:AKIA|ASIA|AROA)[0-9A-Z]{16}\b/g,
    replacement: '[REDACTED_AWS_ACCESS_KEY]',
  },
  {
    type: 'Cryptographic Private Key',
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    replacement: '[REDACTED_PRIVATE_CRYPTOGRAPHIC_KEY]',
  },
  {
    type: 'Database Connection URI',
    regex: /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s"'`<>]+/gi,
    replacement: '[REDACTED_DATABASE_CONNECTION_URI]',
  },
  {
    type: 'Payment Card Number (PCI-DSS)',
    regex: /\b(?:\d{4}[ -]?){3}\d{4}\b/g,
    replacement: '[REDACTED_PAYMENT_CARD_PCI_DSS]',
  },
  {
    type: 'US Social Security Number (PII)',
    regex: /\b\d{3}-\d{2}-\d{4}\b/g,
    replacement: '[REDACTED_SSN_PII]',
  },
  {
    type: 'Hardcoded Password / Credential',
    regex: /(?:password|passwd|pwd|db_pass|secret_key|jwt_secret)\s*[:=]\s*['"][^'"]{6,}['"]/gi,
    replacement: 'password: "[REDACTED_INTERNAL_CREDENTIAL]"',
  },
  {
    type: 'Generic Bearer Token',
    regex: /Bearer\s+[a-zA-Z0-9_\-\.]{25,}/gi,
    replacement: 'Bearer [REDACTED_AUTH_BEARER_TOKEN]',
  },
];

export function redactOutputSecrets(text = '') {
  if (!text || typeof text !== 'string') {
    return { text: '', wasRedacted: false, redactedTypes: [], totalRedactions: 0 };
  }

  let sanitized = text;
  const redactedTypes = [];
  let totalRedactions = 0;

  for (const rule of DLP_PATTERNS) {
    const matches = sanitized.match(rule.regex);
    if (matches && matches.length > 0) {
      totalRedactions += matches.length;
      redactedTypes.push(`${rule.type} (${matches.length})`);
      sanitized = sanitized.replace(rule.regex, rule.replacement);
    }
  }

  return {
    text: sanitized,
    wasRedacted: totalRedactions > 0,
    redactedTypes,
    totalRedactions,
  };
}
