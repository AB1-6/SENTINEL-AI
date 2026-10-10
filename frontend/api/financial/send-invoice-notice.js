import nodemailer from 'nodemailer';

function generateInvoiceHtml({ invoiceId, clientName, message, user }) {
  const formattedMsg = (message || '')
    .split('\n')
    .filter(line => line.trim())
    .map(line => `<p style="margin: 0 0 12px 0; line-height: 1.6; color: #334155;">${line}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Statement - Sentinel AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color: #090d16; padding: 28px 32px; border-bottom: 3px solid #0284c7;">
              <span style="font-size: 20px; font-weight: 800; color: #38bdf8; letter-spacing: 1px;">SENTINEL AI</span>
              <span style="font-size: 11px; background: rgba(56,189,248,0.15); color: #38bdf8; padding: 3px 8px; border-radius: 4px; margin-left: 8px; font-family: monospace; font-weight: bold;">ENTERPRISE</span>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">Autonomous Zero-Trust Intelligence &amp; Financial Operations</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <div style="font-size: 14px; color: #1e293b;">
                ${formattedMsg}
              </div>
              <div style="margin: 24px 0; background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px; padding: 18px 20px;">
                <table width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px;">
                  <tr>
                    <td style="color: #64748b; padding: 4px 0;">Reference ID:</td>
                    <td style="font-weight: 700; color: #0f172a; text-align: right;">${invoiceId || 'INV-2026-001'}</td>
                  </tr>
                  ${clientName ? `
                  <tr>
                    <td style="color: #64748b; padding: 4px 0;">Account Name:</td>
                    <td style="font-weight: 600; color: #0f172a; text-align: right;">${clientName}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="color: #64748b; padding: 4px 0;">Status:</td>
                    <td style="font-weight: 600; color: #0284c7; text-align: right;">Payment Verification Pending</td>
                  </tr>
                </table>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px;">
                If payment has already been remitted, please disregard this automated notification. You may reply directly to this email with any remittance verification details.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.6;">
              <p style="margin: 0;">Sentinel AI Technologies Inc. &bull; Finance Operations Center</p>
              <p style="margin: 4px 0 0 0;">Outbound Dispatcher: ${user} &bull; Automated Delivery</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
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

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) {}
  }

  const { invoiceId, clientName, to, subject, message } = body || {};

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

    const cleanSubject = subject && !subject.includes('?') 
      ? subject 
      : `Sentinel AI - Service update for ${invoiceId || 'INV-2026-001'}`;

    const htmlContent = generateInvoiceHtml({
      invoiceId,
      clientName,
      message,
      user
    });

    const info = await transporter.sendMail({
      from: `"Sentinel AI" <${user}>`,
      replyTo: user,
      to: to.trim(),
      subject: cleanSubject,
      text: message,
      html: htmlContent,
      headers: {
        'List-Unsubscribe': `<mailto:${user}?subject=unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'X-Entity-Ref-ID': invoiceId || 'INV-001',
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'X-Mailer': 'Sentinel-AI-Gateway/2.0'
      }
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
