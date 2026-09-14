import test from 'node:test';
import assert from 'node:assert/strict';
import { generateClaudeResponse } from '../services/claudeService.js';

test('generateClaudeResponse falls back to mock mode when no API key is set', async () => {
  delete process.env.CLAUDE_API_KEY;

  const response = await generateClaudeResponse('Hello from Sentinel', { documentNames: ['Policy.pdf'] });

  assert.equal(response.provider, 'mock-claude');
  assert.match(response.text, /demo response/i);
});
