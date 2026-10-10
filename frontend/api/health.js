export default function handler(req, res) {
  res.status(200).json({ ok: true, service: 'sentinel-ai-2.0-serverless', time: new Date().toISOString() });
}
