import { generateAiResponse } from './geminiService.js';

export async function generateGemmaResponse(prompt, context = {}) {
  // If no API key provided, route to the deterministic financial engine for local/demo testing.
  if (!process.env.GEMMA_API_KEY) {
    const aiResp = await generateAiResponse(prompt, context);
    return {
      text: aiResp.text,
      provider: 'gemma-local-engine',
      citations: context.documentNames && context.documentNames.length > 0 ? [`Referenced documents: ${context.documentNames.join(', ')}`] : [],
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

  try {
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
      console.error(`Gemma API error: ${res.status} ${errText}`);
      // Clean fallback to deterministic engine
      const aiResp = await generateAiResponse(prompt, context);
      return { text: aiResp.text, provider: 'gemma-local-engine', fallbackReason: `Gemma API: ${res.status}` };
    }

    const data = await res.json();
    let text = '';
    if (typeof data === 'string') text = data;
    else if (data.output) text = data.output;
    else if (data.choices && data.choices[0]) text = data.choices[0].text || JSON.stringify(data.choices[0]);
    else if (data.data && data.data[0]) text = data.data[0].text || JSON.stringify(data.data[0]);
    else text = JSON.stringify(data);

    return { text, provider: 'gemma', raw: data };
  } catch (err) {
    console.error('Error in generateGemmaResponse:', err.message);
    const aiResp = await generateAiResponse(prompt, context);
    return { text: aiResp.text, provider: 'gemma-local-engine', fallbackReason: err.message };
  }
}

export default generateGemmaResponse;
