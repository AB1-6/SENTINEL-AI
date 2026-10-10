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
    const fromAddress = process.env.SMTP_FROM || `"Sentinel AI Finance Ops" <${activeUser}>`;
    const info = await mailer.sendMail({
      from: fromAddress,
      to,
      subject,
      text
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
