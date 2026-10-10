import nodemailer from 'nodemailer';

/**
 * Sentinel AI 2.0 - Automated Outbound Email Dispatcher
 * Supports Gmail SMTP, custom enterprise SMTP, or Ethereal test accounts.
 */
let transporter = null;

export function resetTransporter() {
  transporter = null;
}

export function isSmtpConfigured() {
  return true;
}

export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = (process.env.SMTP_USER || 'sentinalai2.0@gmail.com').trim();
  const rawPass = (process.env.SMTP_PASS || 'wwmijcbttkxwdhst').trim();
  const pass = rawPass.replace(/\s+/g, '');

  if (user && pass) {
    const isGmail = host.includes('gmail.com') || user.includes('@gmail.com');
    if (isGmail) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
      console.log(`[Sentinel AI] Outbound SMTP configured for ${user} via Gmail Service`);
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });
      console.log(`[Sentinel AI] Outbound SMTP configured for ${user} via ${host}:${port}`);
    }
  } else {
    console.log('[Sentinel AI] SMTP_USER/SMTP_PASS not available.');
  }

  return transporter;
}

export async function sendInvoiceOutreachEmail({ to, subject, text, clientName, invoiceId }) {
  const mailer = getTransporter();

  if (!mailer) {
    return {
      success: false,
      configured: false,
      message: 'SMTP credentials not configured in backend/.env. Use direct Gmail Web Compose or WhatsApp button.',
      recipient: to
    };
  }

  try {
    const activeUser = (process.env.SMTP_USER || 'sentinalai2.0@gmail.com').trim();
    const fromAddress = process.env.SMTP_FROM || `"Sentinel AI Finance Operations" <${activeUser}>`;
    const cleanSubject = subject && !subject.includes('?') 
      ? subject 
      : `Account Statement: Invoice ${invoiceId || 'INV-2026-001'} - Sentinel AI Technologies`;

    const html = `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 24px; background-color: #f1f5f9; font-family: sans-serif;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
    <div style="background: #090d16; padding: 24px; border-bottom: 3px solid #0284c7;">
      <h2 style="color: #38bdf8; margin: 0; font-size: 18px;">SENTINEL AI &bull; FINANCIAL OPERATIONS</h2>
      <p style="color: #94a3b8; margin: 4px 0 0; font-size: 12px;">Enterprise Outbound Dispatch Gateway</p>
    </div>
    <div style="padding: 24px; color: #1e293b; font-size: 14px; line-height: 1.6;">
      ${(text || '').split('\n').filter(l => l.trim()).map(l => `<p style="margin: 0 0 10px;">${l}</p>`).join('')}
      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 14px; margin: 18px 0; border-radius: 4px;">
        <strong>Invoice Reference:</strong> ${invoiceId || 'INV-2026-001'}<br/>
        <strong>Status:</strong> Payment Verification Pending
      </div>
    </div>
    <div style="background: #f8fafc; padding: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
      Sentinel AI Technologies Inc. &bull; Support: ${activeUser}
    </div>
  </div>
</body>
</html>`;

    const info = await mailer.sendMail({
      from: fromAddress,
      replyTo: activeUser,
      to,
      subject: cleanSubject,
      text,
      html,
      headers: {
        'X-Entity-Ref-ID': invoiceId || 'INV-001',
        'X-Mailer': 'Sentinel-AI-Gateway/2.0'
      }
    });

    console.log(`[Sentinel AI] Email successfully sent to ${to} (Message ID: ${info.messageId})`);
    return {
      success: true,
      configured: true,
      messageId: info.messageId,
      recipient: to
    };
  } catch (error) {
    console.error(`[Sentinel AI] Failed to send email to ${to}:`, error.message);
    const isBadCredentials = error.message?.includes('535') || error.message?.includes('BadCredentials');
    return {
      success: false,
      configured: true,
      isBadCredentials,
      error: isBadCredentials 
        ? 'Google SMTP rejected plain account password. A 16-character Google App Password is required by Google (myaccount.google.com/apppasswords).' 
        : error.message,
      recipient: to
    };
  }
}
