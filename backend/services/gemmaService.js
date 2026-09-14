export async function generateGemmaResponse(prompt, context = {}) {
  // If no API key provided, return a mock/demo response for local testing.
  if (!process.env.GEMMA_API_KEY) {
    return {
      text: `Gemma (demo) reply for: ${prompt}`,
      provider: 'mock-gemma',
      citations: context.documentNames ? [`Referenced documents: ${context.documentNames.join(', ')}`] : [],
    };
  }

  const endpoint = process.env.GEMMA_API_ENDPOINT || process.env.GEMMA_ENDPOINT || 'https://api.gemma.ai/v1/generate';
  const model = process.env.GEMMA_MODEL || 'gemma-default';

  const payload = {
    model,
    prompt,
    max_tokens: 1024,
    temperature: 0.2,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GEMMA_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemma request failed: ${errText}`);
  }

  const data = await res.json();

  // Attempt to extract text from common response shapes.
  let text = '';
  if (typeof data === 'string') text = data;
  else if (data.output) text = data.output;
  else if (data.choices && data.choices[0]) text = data.choices[0].text || JSON.stringify(data.choices[0]);
  else if (data.data && data.data[0]) text = data.data[0].text || JSON.stringify(data.data[0]);
  else text = JSON.stringify(data);

  return { text, provider: 'gemma', raw: data };
}

export default generateGemmaResponse;
