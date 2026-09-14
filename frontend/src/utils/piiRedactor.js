export function redactPII(text = '') {
  if (!text || typeof text !== 'string') return { redactedText: text, count: 0, types: [] };

  let count = 0;
  const typesSet = new Set();
  let redactedText = text;

  // Credit Cards (13-16 digits)
  const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
  if (ccRegex.test(redactedText)) {
    redactedText = redactedText.replace(ccRegex, '[REDACTED_CREDIT_CARD]');
    count += 1;
    typesSet.add('Credit Card');
  }

  // SSN (xxx-xx-xxxx)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  if (ssnRegex.test(redactedText)) {
    redactedText = redactedText.replace(ssnRegex, '[REDACTED_SSN]');
    count += 1;
    typesSet.add('SSN');
  }

  // IBAN / Bank Accounts
  const ibanRegex = /\b[A-Z]{2}\d{2}[A-Z0-9]{11,26}\b/g;
  if (ibanRegex.test(redactedText)) {
    redactedText = redactedText.replace(ibanRegex, '[REDACTED_BANK_ACCOUNT]');
    count += 1;
    typesSet.add('Bank IBAN');
  }

  // Passwords / API Secret Keys
  const keyRegex = /(api[_-]?key|secret|password|auth_token)\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{12,})['"]?/gi;
  if (keyRegex.test(redactedText)) {
    redactedText = redactedText.replace(keyRegex, '$1: "[REDACTED_SECRET_KEY]"');
    count += 1;
    typesSet.add('API Secret Key');
  }

  return {
    redactedText,
    count,
    types: Array.from(typesSet),
  };
}
