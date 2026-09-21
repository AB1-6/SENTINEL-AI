import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendInvoiceOutreachEmail, resetTransporter, isSmtpConfigured } from '../services/emailService.js';
import { sendWhatsAppNotice, getWhatsAppStatus, isWhatsAppConfigured } from '../services/whatsappService.js';
import { sampleInvoices, financialMetrics } from '../services/financialData.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Get financial metrics and invoices
router.get('/metrics', (_req, res) => {
  res.json({ success: true, metrics: financialMetrics, invoices: sampleInvoices });
});

// Check if outbound email server is active
router.get('/smtp-status', (_req, res) => {
  res.json({
    configured: isSmtpConfigured(),
    user: process.env.SMTP_USER ? process.env.SMTP_USER.replace(/(.{3})(.*)(@.*)/, '$1***$3') : null,
    host: process.env.SMTP_HOST || 'smtp.gmail.com'
  });
});

// Check WhatsApp status (Twilio API or Direct Deep-link mode)
router.get('/whatsapp-status', (_req, res) => {
  res.json({
    success: true,
    status: getWhatsAppStatus()
  });
});

// Save SMTP credentials to .env so emails send automatically with 1 click
router.post('/save-smtp', (req, res) => {
  const { user, pass, host = 'smtp.gmail.com', port = '587' } = req.body;

  if (!user || !pass) {
    return res.status(400).json({ success: false, error: 'User and App Password are required' });
  }

  process.env.SMTP_USER = user.trim();
  process.env.SMTP_PASS = pass.trim();
  process.env.SMTP_HOST = host.trim();
  process.env.SMTP_PORT = port.toString().trim();
  resetTransporter();

  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const setEnvVar = (key, val) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${val}`);
      } else {
        envContent += `\n${key}=${val}`;
      }
    };

    setEnvVar('SMTP_USER', user.trim());
    setEnvVar('SMTP_PASS', pass.trim());
    setEnvVar('SMTP_HOST', host.trim());
    setEnvVar('SMTP_PORT', port.toString().trim());

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');
    console.log(`[Sentinel AI] Saved outbound SMTP configuration for ${user}`);

    return res.json({
      success: true,
      message: `Outbound SMTP configured for ${user}. 1-Click Automated Delivery is active!`,
      configured: true
    });
  } catch (err) {
    console.error('Failed to write .env:', err);
    return res.json({
      success: true,
      message: 'SMTP credentials loaded in memory. Active for current session.',
      configured: true
    });
  }
});

// Single invoice dispatch
router.post('/send-invoice-notice', async (req, res) => {
  const { invoiceId, clientName, to, phone, channel, tone, subject, message } = req.body;

  if (!to && !phone) {
    return res.status(400).json({ success: false, error: 'Recipient contact is required' });
  }

  let emailResult = null;
  if (channel === 'email' || channel === 'both') {
    emailResult = await sendInvoiceOutreachEmail({
      to,
      subject,
      text: message,
      clientName,
      invoiceId
    });
  }

  let whatsappResult = null;
  if (channel === 'whatsapp' || channel === 'both') {
    whatsappResult = await sendWhatsAppNotice({
      toPhone: phone,
      message,
      clientName,
      invoiceId
    });
  }

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

  return res.json({
    success: true,
    invoiceId,
    clientName,
    channel,
    tone,
    recipient: channel === 'email' ? to : phone,
    emailResult,
    whatsappResult,
    whatsappUrl,
    timestamp: new Date().toISOString(),
    message: emailResult?.success 
      ? `Email sent successfully to ${to}` 
      : emailResult?.configured
      ? `SMTP dispatch failed: ${emailResult.error}`
      : `Outreach processed. WhatsApp and Email dispatch links generated.`
  });
});

// ⚡ 1-Click Master Autonomous Batch Dispatcher
router.post('/auto-dispatch-all', async (req, res) => {
  const overdue = sampleInvoices.filter((inv) => inv.isOverdue || inv.overdueDays > 0);
  const results = [];

  for (const inv of overdue) {
    const days = inv.overdueDays || 0;
    const tone = days > 30 ? 'strict' : days > 10 ? 'medium' : 'polite';
    const amountStr = inv.formattedAmount || `₹${inv.amount.toLocaleString()}`;
    const serviceName = inv.servicePurchased || 'Sentinel AI Zero-Trust Gateway Pro';
    const company = inv.company || '';

    let subject = '';
    let message = '';

    if (tone === 'polite') {
      subject = `Friendly Follow-up: Invoice ${inv.id} (${amountStr}) - ${serviceName}`;
      message = `Dear ${inv.client}${company ? ` (${company})` : ''},\n\nHope you are having a productive week!\n\nThis is a gentle reminder regarding invoice ${inv.id} for the amount of ${amountStr} for your ${serviceName}, which reached its due date ${days} days ago.\n\nWe would appreciate it if you could verify the payment status with your accounts department.\n\nThank you for your valued partnership with Sentinel AI Technologies Inc.\n\nBest regards,\nAccounts Receivable & Finance Operations\nSentinel AI Technologies Inc.`;
    } else if (tone === 'medium') {
      subject = `Overdue Payment Notice: Invoice ${inv.id} (${amountStr}) - ${days} Days Past Due`;
      message = `Hello ${inv.client}${company ? ` (${company})` : ''},\n\nWe are writing to follow up on outstanding invoice ${inv.id} (${amountStr}) for ${company}'s active subscription to ${serviceName}, which is now ${days} days overdue.\n\nTo ensure your enterprise security gateway remains in good standing without disruption to ongoing API quotas and firewall policies, please arrange for remittance by the end of this business week.\n\nSincerely,\nCredit Control Team\nSentinel AI Technologies Inc.`;
    } else {
      subject = `FINAL NOTICE: Delinquent Invoice ${inv.id} (${amountStr}) - Service Suspension Warning`;
      message = `ATTENTION: ${inv.client.toUpperCase()}${company ? ` · ${company.toUpperCase()}` : ''}\n\nInvoice ${inv.id} for ${amountStr} covering your enterprise deployment of ${serviceName} is critically delinquent by ${days} days past the agreed settlement terms with Sentinel AI Technologies Inc.\n\nImmediate settlement is required within 48 hours. Continued failure to clear this balance will result in automatic service suspension across all Sentinel AI gateway nodes and escalation to our legal audit board.\n\nRemit payment immediately to avoid service interruption.\n\nCollections & Solvency Enforcement Bureau\nSentinel AI Technologies Inc.`;
    }

    let emailResult = null;
    if (inv.contact) {
      emailResult = await sendInvoiceOutreachEmail({
        to: inv.contact,
        subject,
        text: message,
        clientName: inv.client,
        invoiceId: inv.id
      });
    }

    let whatsappResult = null;
    if (inv.phone) {
      whatsappResult = await sendWhatsAppNotice({
        toPhone: inv.phone,
        message,
        clientName: inv.client,
        invoiceId: inv.id
      });
    }

    const cleanPhone = (inv.phone || '').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    results.push({
      invoiceId: inv.id,
      client: inv.client,
      company: inv.company,
      email: inv.contact,
      phone: inv.phone,
      daysOverdue: days,
      toneUsed: tone.toUpperCase(),
      subject,
      message,
      emailResult,
      whatsappResult,
      whatsappUrl,
      status: emailResult?.success ? 'DELIVERED_VIA_SMTP' : 'RECORDED_DISPATCH'
    });
  }

  const allDelivered = results.every(r => r.emailResult?.success);
  return res.json({
    success: true,
    count: results.length,
    allDelivered,
    smtpActive: isSmtpConfigured(),
    whatsappActive: isWhatsAppConfigured(),
    results,
    timestamp: new Date().toISOString()
  });
});

export default router;
