from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
DATASET = BASE_DIR / 'dataset' / 'prompts.csv'
MODEL_PATH = BASE_DIR / 'model.pkl'
VECTORIZER_PATH = BASE_DIR / 'vectorizer.pkl'


def clean_text(text: str) -> str:
    return ' '.join(text.lower().strip().split())


def load_dataset(path: Path) -> pd.DataFrame:
    rows = []
    with path.open('r', encoding='utf-8') as handle:
        for raw_line in handle:
            line = raw_line.strip()
            if not line:
                continue
            normalized = line.lower()
            if normalized in {'text,label', 'text|label'}:
                continue
            if ',' not in line:
                continue
            text, label = line.rsplit(',', 1)
            if text.strip().lower() == 'text' and label.strip().lower() == 'label':
                continue
            rows.append({'text': text.strip().strip('"'), 'label': label.strip()})
    return pd.DataFrame(rows)


def main() -> None:
    frame = load_dataset(DATASET)
    frame['text'] = frame['text'].astype(str).map(clean_text)

    x_train, x_test, y_train, y_test = train_test_split(
        frame['text'],
        frame['label'],
        test_size=0.25,
        random_state=42,
        stratify=frame['label'],
    )

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1500)
    classifier = LogisticRegression(max_iter=1000)

    x_train_vectors = vectorizer.fit_transform(x_train)
    x_test_vectors = vectorizer.transform(x_test)

    classifier.fit(x_train_vectors, y_train)
    predictions = classifier.predict(x_test_vectors)

    accuracy = accuracy_score(y_test, predictions)
    print(f'Accuracy: {accuracy:.2f}')
    print(classification_report(y_test, predictions, zero_division=0))

    joblib.dump(classifier, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)
    print(f'Saved model to {MODEL_PATH}')
    print(f'Saved vectorizer to {VECTORIZER_PATH}')


if __name__ == '__main__':
    main()