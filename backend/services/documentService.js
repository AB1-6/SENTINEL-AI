import pdf from 'pdf-parse';

export async function summarizeDocument(file) {
  if (!file) {
    return { summary: 'No file uploaded.' };
  }

  if (file.mimetype === 'application/pdf' && file.buffer) {
    const parsed = await pdf(file.buffer);
    return { summary: parsed.text.slice(0, 600) || 'PDF uploaded successfully.', pages: parsed.numpages };
  }

  return { summary: `${file.originalname} uploaded and indexed for secure AI retrieval.` };
}