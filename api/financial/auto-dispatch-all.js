import nodemailer from 'nodemailer';

const sampleInvoices = [
  {
    id: 'INV-2026-001',
    client: 'Anlin',
    company: 'Apex CyberLogix Solutions Pvt. Ltd.',
    amount: 45000,
    formattedAmount: '₹45,000',
    overdueDays: 6,
    isOverdue: true,
    contact: 'anlin224923@sahrdaya.ac.in',
    phone: '+91 80754 06544'
  },
  {
    id: 'INV-2026-002',
    client: 'Angel Rose Biju',
    company: 'Rosewood Cloud Systems Inc.',
    amount: 120000,
    formattedAmount: '₹1,20,000',
    overdueDays: 18,
    isOverdue: true,
    contact: 'angel224906@sahrdaya.ac.in',
    phone: '+91 94961 23456'
  },
  {
    id: 'INV-2026-003',
    client: 'Diya Joy',
    company: 'JoyNex Digital Retail Ltd.',
    amount: 78000,
    formattedAmount: '₹78,000',
    overdueDays: 42,
    isOverdue: true,
    contact: 'diya224056@sahrdaya.ac.in',
    phone: '+91 96562 32490'
  }
];

function generateBatchHtml({ inv, user }) {
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
              <p style="font-size: 15px; margin-top: 0; color: #0f172a;">Dear <strong>${inv.client}</strong> (${inv.company}),</p>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                This is an automated statement regarding invoice <strong>${inv.id}</strong> (${inv.formattedAmount}), currently showing an overdue status of ${inv.overdueDays} days.
              </p>
              <div style="margin: 24px 0; background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px; padding: 18px 20px;">
                <table width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px;">
                  <tr>
                    <td style="color: #64748b; padding: 4px 0;">Invoice ID:</td>
                    <td style="font-weight: 700; color: #0f172a; text-align: right;">${inv.id}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 4px 0;">Amount:</td>
                    <td style="font-weight: 700; color: #0284c7; text-align: right;">${inv.formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; padding: 4px 0;">Overdue Delay:</td>
                    <td style="font-weight: 600; color: #d97706; text-align: right;">${inv.overdueDays} Days</td>
                  </tr>
                </table>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-top: 24px;">
                Please coordinate with your finance department to verify settlement status. If remittance has already been initiated, kindly disregard this notice.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.6;">
              <p style="margin: 0;">Sentinel AI Technologies Inc. &bull; Finance Operations Center</p>
              <p style="margin: 4px 0 0 0;">Outbound Dispatcher: ${user} &bull; Verified Delivery</p>
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

  const user = (process.env.SMTP_USER || 'sentinalai2.0@gmail.com').trim();
  const rawPass = (process.env.SMTP_PASS || 'wwmijcbttkxwdhst').trim();
  const pass = rawPass.replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  const results = [];

  for (const inv of sampleInvoices) {
    const days = inv.overdueDays;
    const tone = days > 30 ? 'STRICT' : days > 10 ? 'MEDIUM' : 'POLITE';
    const amountStr = inv.formattedAmount;
    const subject = `Account Statement: Invoice ${inv.id} - Sentinel AI Technologies`;
    const text = `Dear ${inv.client} (${inv.company}),\n\nThis is an automated payment statement regarding invoice ${inv.id} for ${amountStr}, overdue by ${days} days.\n\nPlease remit payment to avoid service interruption.\n\nAccounts Receivable\nSentinel AI Technologies Inc. (${user})`;
    const html = generateBatchHtml({ inv, user });

    let emailResult = null;
    try {
      const info = await transporter.sendMail({
        from: `"Sentinel AI Finance Operations" <${user}>`,
        replyTo: user,
        to: inv.contact,
        subject,
        text,
        html,
        headers: {
          'X-Entity-Ref-ID': inv.id,
          'X-Mailer': 'Sentinel-AI-Gateway/2.0'
        }
      });
      emailResult = { success: true, messageId: info.messageId, recipient: inv.contact };
    } catch (e) {
      emailResult = { success: false, error: e.message, recipient: inv.contact };
    }

    results.push({
      invoiceId: inv.id,
      client: inv.client,
      company: inv.company,
      email: inv.contact,
      phone: inv.phone,
      daysOverdue: days,
      toneUsed: tone,
      subject,
      message: text,
      emailResult,
      status: emailResult.success ? 'DELIVERED_VIA_SMTP' : 'FAILED'
    });
  }

  return res.status(200).json({
    success: true,
    count: results.length,
    allDelivered: results.every((r) => r.emailResult?.success),
    results,
    timestamp: new Date().toISOString()
  });
}
