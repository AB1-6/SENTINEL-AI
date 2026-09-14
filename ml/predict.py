from __future__ import annotations

import json
import sys
from pathlib import Path

import joblib


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / 'model.pkl'
VECTORIZER_PATH = BASE_DIR / 'vectorizer.pkl'


def heuristic_prediction(prompt: str) -> dict[str, object]:
    normalized = prompt.lower()
    jailbreak_terms = ['ignore all previous instructions', 'system prompt', 'developer mode', 'bypass', 'jailbreak']
    matched = [term for term in jailbreak_terms if term in normalized]
    score = min(0.98, 0.12 + (0.26 * len(matched)))
    label = 'JAILBREAK' if score >= 0.6 else 'SAFE'
    return {'label': label, 'confidence': round(score, 2), 'mode': 'heuristic'}


def predict(prompt: str) -> dict[str, object]:
    if not MODEL_PATH.exists() or not VECTORIZER_PATH.exists():
      return heuristic_prediction(prompt)

    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    features = vectorizer.transform([prompt])
    label = model.predict(features)[0]

    if hasattr(model, 'predict_proba'):
        confidence = float(max(model.predict_proba(features)[0]))
    else:
        confidence = 0.5

    return {'label': str(label), 'confidence': round(confidence, 2), 'mode': 'model'}


def main() -> None:
    prompt = ' '.join(sys.argv[1:]).strip()
    if not prompt:
        payload = sys.stdin.read().strip()
        prompt = payload or 'empty prompt'

    result = predict(prompt)
    print(json.dumps(result))


if __name__ == '__main__':
    main()