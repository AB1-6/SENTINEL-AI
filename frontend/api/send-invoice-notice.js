import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { invoiceId, clientName, to, subject, message } = req.body || {};

  if (!to) {
    return res.status(400).json({ success: false, error: 'Recipient contact is required' });
  }

  try {
    const user = (process.env.SMTP_USER || 'sentinalai2.0@gmail.com').trim();
    const rawPass = (process.env.SMTP_PASS || 'wwmijcbttkxwdhst').trim();
    const pass = rawPass.replace(/\s+/g, '');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    const info = await transporter.sendMail({
      from: `"Sentinel AI Finance Ops" <${user}>`,
      to,
      subject: subject || `Overdue Payment Notice: Invoice ${invoiceId}`,
      text: message
    });

    console.log(`[Sentinel AI Vercel] Email sent to ${to} (ID: ${info.messageId})`);

    return res.status(200).json({
      success: true,
      invoiceId,
      clientName,
      recipient: to,
      emailResult: {
        success: true,
        messageId: info.messageId,
        recipient: to
      }
    });
  } catch (err) {
    console.error('[Sentinel AI Vercel] Send error:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
      emailResult: {
        success: false,
        error: err.message
      }
    });
  }
}
