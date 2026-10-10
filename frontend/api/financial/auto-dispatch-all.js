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
    client: 'Diya Eldho',
    company: 'Vanguard Cognitive Defense Ltd.',
    amount: 85000,
    formattedAmount: '₹85,000',
    overdueDays: 34,
    isOverdue: true,
    contact: 'diya224915@sahrdaya.ac.in',
    phone: '+91 98470 98765'
  }
];

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
    const subject = `Overdue Payment Notice: Invoice ${inv.id} (${amountStr})`;
    const text = `Dear ${inv.client} (${inv.company}),\n\nThis is an automated payment notice regarding invoice ${inv.id} for ${amountStr}, overdue by ${days} days.\n\nPlease remit payment to avoid service interruption.\n\nAccounts Receivable\nSentinel AI Technologies Inc. (${user})`;

    let emailResult = null;
    try {
      const info = await transporter.sendMail({
        from: `"Sentinel AI Finance Ops" <${user}>`,
        to: inv.contact,
        subject,
        text
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
