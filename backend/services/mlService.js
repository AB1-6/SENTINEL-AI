import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculatePromptRisk } from '../utils/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PREDICT_SCRIPT = path.resolve(__dirname, '../../ml/predict.py');

/**
 * Executes the Scikit-Learn TF-IDF classifier via python subprocess.
 * Falls back to deterministic Zero-Trust heuristic if Python is unavailable or times out.
 */
export async function predictWithModel(prompt = '') {
  if (!prompt || typeof prompt !== 'string') {
    return calculatePromptRisk(prompt);
  }

  return new Promise((resolve) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        // Fallback gracefully on timeout to maintain 0 downtime
        const fallback = calculatePromptRisk(prompt);
        resolve({ ...fallback, mode: 'fallback_heuristic', latencyMs: 1500 });
      }
    }, 1500);

    try {
      const pyProcess = spawn('python', [PREDICT_SCRIPT, prompt], {
        windowsHide: true,
      });

      let stdoutData = '';
      let stderrData = '';

      pyProcess.stdout.on('data', (chunk) => {
        stdoutData += chunk.toString();
      });

      pyProcess.stderr.on('data', (chunk) => {
        stderrData += chunk.toString();
      });

      pyProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (resolved) return;
        resolved = true;

        if (code === 0 && stdoutData.trim()) {
          try {
            // Find valid JSON in stdout
            const lines = stdoutData.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            const parsed = JSON.parse(lastLine);

            const score = parsed.confidence ?? (parsed.label === 'JAILBREAK' ? 0.89 : 0.08);
            resolve({
              score: Number(score.toFixed(2)),
              label: parsed.label || (score >= 0.5 ? 'JAILBREAK' : 'SAFE'),
              confidence: parsed.confidence,
              mode: parsed.mode || 'model',
              threats: parsed.threats || [],
              reason: parsed.label === 'JAILBREAK' 
                ? `Zero-Trust Neural Model Intercepted (Confidence: ${Math.round(score * 100)}%)`
                : 'Zero-Trust ML heuristic scan passed',
            });
            return;
          } catch (e) {
            // JSON parse failed
          }
        }

        // Fallback to JS regex rule engine
        const fallback = calculatePromptRisk(prompt);
        resolve({ ...fallback, mode: 'heuristic' });
      });

      pyProcess.on('error', () => {
        clearTimeout(timeout);
        if (resolved) return;
        resolved = true;
        const fallback = calculatePromptRisk(prompt);
        resolve({ ...fallback, mode: 'heuristic' });
      });
    } catch (err) {
      clearTimeout(timeout);
      if (resolved) return;
      resolved = true;
      const fallback = calculatePromptRisk(prompt);
      resolve({ ...fallback, mode: 'heuristic' });
    }
  });
}
