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
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
    console.log(`[Sentinel AI] Outbound SMTP configured for ${user} via ${host}:${port}`);
  } else {
    console.log('[Sentinel AI] SMTP_USER/SMTP_PASS not set in backend/.env. Direct webmail/WhatsApp dispatch active.');
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
    const fromAddress = process.env.SMTP_FROM || `"Sentinel AI Finance Ops" <${process.env.SMTP_USER}>`;
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
