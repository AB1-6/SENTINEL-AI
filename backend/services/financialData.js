/**
 * Sentinel AI 2.0 - Canonical Financial Dataset & Calculation Service (Backend)
 * Shared source of truth across the Financial Operations page, What-If simulator, and AI Assistant.
 */

export const financialMetrics = {
  liquidCash: 85000,
  monthlyNetBurn: 42000,
  currency: 'INR',
  currencySymbol: '₹',
  dailyBurn: Math.round(42000 / 30), // ~₹1,400 / day
  runwayDays: 61, // ~2.02 months
  runwayMonths: 2.02,
  accountsBreakdown: {
    operatingHdfc: 52000,
    payrollReserveSbi: 25000,
    pettyCashLiquid: 8000,
  },
  monthlyExpenses: {
    payroll: 28000,
    softwareSaas: 8500,
    utilitiesOffice: 5500,
  },
  monthlyInflows: 110000,
};

export const sampleInvoices = [
  {
    id: 'INV-2026-001',
    client: 'Anlin',
    company: 'Apex CyberLogix Solutions Pvt. Ltd.',
    designation: 'Chief Technology Officer',
    servicePurchased: 'Sentinel AI Gateway Pro (Prompt Injection Firewall & 2.5M Quota)',
    billingCycle: 'Quarterly SaaS License',
    amount: 45000,
    formattedAmount: '₹45,000',
    overdueDays: 6,
    delayLevel: 'Slight Delay (1-10d)',
    recommendedTone: 'polite',
    delayReason: 'Standard AP quarterly cycle processing delay (within grace period).',
    status: 'Overdue (6d)',
    risk: 'Low',
    isOverdue: true,
    isTopClient: false,
    dueDate: '6 days ago (2026-03-11)',
    invoiceDate: '36 days ago (2026-02-09)',
    contact: 'anlin224923@sahrdaya.ac.in',
    phone: '+91 80754 06544',
    notes: 'Recent overdue account (delayed by 6 days). Recommended: Polite Message (friendly check-in).',
  },
  {
    id: 'INV-2026-002',
    client: 'Angel Rose Biju',
    company: 'Rosewood Cloud Systems Inc.',
    designation: 'VP of Cloud Engineering',
    servicePurchased: 'Sentinel Enterprise Cluster & Client-Side PII Redactor (99.99% SLA)',
    billingCycle: 'Half-Yearly Security Retainer',
    amount: 120000,
    formattedAmount: '₹1,20,000',
    overdueDays: 18,
    delayLevel: 'Moderate Delay (11-30d)',
    recommendedTone: 'medium',
    delayReason: 'Fiscal mid-quarter ERP invoice signoff bottleneck (>2 weeks overdue).',
    status: 'Overdue (18d)',
    risk: 'Medium',
    isOverdue: true,
    isTopClient: true,
    dueDate: '18 days ago (2026-02-27)',
    invoiceDate: '48 days ago (2026-01-30)',
    contact: 'angel224906@sahrdaya.ac.in',
    phone: '+91 89217 25591',
    notes: 'Enterprise account past due by 18 days. Recommended: Medium Polite / Firm Follow-Up.',
  },
  {
    id: 'INV-2026-003',
    client: 'Diya Joy',
    company: 'JoyNex Digital Retail Ltd.',
    designation: 'Director of Supply Chain & Ops',
    servicePurchased: 'Gemma SME Cashflow Copilot & AI Support Shield (Vector Doc Search)',
    billingCycle: 'Annual Enterprise Tier',
    amount: 78000,
    formattedAmount: '₹78,000',
    overdueDays: 42,
    delayLevel: 'Critical Delay (30d+)',
    recommendedTone: 'strict',
    delayReason: 'Chronic unresponsiveness; aging past 6 weeks without remittance.',
    status: 'Overdue (42d)',
    risk: 'Critical',
    isOverdue: true,
    isTopClient: false,
    dueDate: '42 days ago (2026-02-03)',
    invoiceDate: '72 days ago (2025-12-23)',
    contact: 'diya224056@sahrdaya.ac.in',
    phone: '+91 96562 32490',
    notes: 'Delinquent balance overdue by 42 days (6+ weeks). Recommended: Not-So-Polite / Urgent Final Notice warning of service suspension.',
  },
];

export function formatCurrency(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

export function getOverdueInvoices() {
  return sampleInvoices.filter((inv) => inv.isOverdue || inv.overdueDays > 0);
}

export function getPendingInvoices() {
  return sampleInvoices.filter((inv) => inv.status !== 'Paid');
}

export function getTotalOverdueAmount() {
  return getOverdueInvoices().reduce((sum, inv) => sum + inv.amount, 0);
}

export function getCashRunway() {
  const days = financialMetrics.runwayDays;
  const months = financialMetrics.runwayMonths;
  return {
    days,
    months,
    liquidCash: financialMetrics.liquidCash,
    monthlyNetBurn: financialMetrics.monthlyNetBurn,
    dailyBurn: financialMetrics.dailyBurn,
    solvencyStatus: days > 60 ? 'Healthy (60+ days)' : days > 30 ? 'Caution (30-60 days)' : 'Critical (<30 days)',
  };
}

export function getFollowUpPriority() {
  const overdue = getOverdueInvoices();
  const topAmount = [...overdue].sort((a, b) => b.amount - a.amount)[0];
  const longestAging = [...overdue].sort((a, b) => b.overdueDays - a.overdueDays)[0];

  return {
    primaryRecommendation: topAmount,
    longestAging,
    orderedList: [
      {
        priority: 1,
        invoice: topAmount,
        reason: `Highest financial exposure (${topAmount.formattedAmount}) representing ${(
          (topAmount.amount / getTotalOverdueAmount()) *
          100
        ).toFixed(1)}% of all overdue receivables. Immediate collection extends cash runway by ~85 days.`,
        recommendedAction: 'Trigger Gemma AI WhatsApp & Email outreach with executive discount/payment plan.',
      },
      {
        priority: 2,
        invoice: longestAging,
        reason: `Longest delinquency (${longestAging.overdueDays} days overdue, ${longestAging.formattedAmount}). High risk of uncollectible default if aging exceeds 45 days.`,
        recommendedAction: 'Send formal demand notice and place temporary hold on active order fulfillments.',
      },
      {
        priority: 3,
        invoice: overdue.find((inv) => inv.id === 'INV-2026-003' || inv.id === 'INV-003') || overdue[2] || overdue[0],
        reason: `Recent delinquency (5 days overdue, ₹78,000). Low resistance account.`,
        recommendedAction: 'Send automated polite courtesy reminder via WhatsApp.',
      },
    ],
  };
}

export function simulateScenario({ topClientDelayDays = 30, supplierExtensionDays = 0, newHires = 0 } = {}) {
  const baseBalance = financialMetrics.liquidCash;
  const monthlyBurn = financialMetrics.monthlyNetBurn;
  const hireImpact = newHires * 6000;
  const netBurn = monthlyBurn + hireImpact;
  const delayShortfall = topClientDelayDays * 1200;
  const extensionRelief = supplierExtensionDays * 800;

  const projectedBalance30d = baseBalance - netBurn - delayShortfall + extensionRelief;
  const isAtRisk = projectedBalance30d < 15000;
  const insolvencyDate = isAtRisk ? (projectedBalance30d <= 0 ? 'Day 20 (Crisis)' : 'July 28') : 'None (Solvent)';
  const runwayDaysRemaining = Math.max(0, Math.round((projectedBalance30d / (netBurn / 30))));

  return {
    baseBalance,
    monthlyBurn,
    topClientDelayDays,
    delayShortfall,
    supplierExtensionDays,
    extensionRelief,
    newHires,
    hireImpact,
    netBurn,
    projectedBalance30d,
    isAtRisk,
    insolvencyDate,
    runwayDaysRemaining,
  };
}

export function getFinancialSummary() {
  const runway = getCashRunway();
  const overdue = getOverdueInvoices();
  const totalOverdue = getTotalOverdueAmount();
  const priority = getFollowUpPriority();

  return {
    liquidCash: formatCurrency(financialMetrics.liquidCash),
    monthlyBurn: formatCurrency(financialMetrics.monthlyNetBurn) + ' / mo',
    runway: `${runway.days} Days (~${runway.months} months)`,
    solvencyStatus: runway.solvencyStatus,
    overdueCount: overdue.length,
    totalOverdueAmount: formatCurrency(totalOverdue),
    overdueInvoices: overdue,
    priorityClient: priority.primaryRecommendation.client,
    priorityAmount: priority.primaryRecommendation.formattedAmount,
  };
}

export function getOutstandingInvoices() {
  return sampleInvoices.filter((inv) => inv.status !== 'Paid');
}

export function getFinancialRisks() {
  const overdue = getOverdueInvoices();
  const totalOverdue = getTotalOverdueAmount();
  const topExposure = [...overdue].sort((a, b) => b.amount - a.amount)[0];
  const oldest = [...overdue].sort((a, b) => b.overdueDays - a.overdueDays)[0];

  return {
    risks: [
      {
        title: 'Receivables Concentration Risk',
        severity: 'CRITICAL',
        description: `₹2,43,000 is trapped in 3 delinquent accounts, which is ~2.86x our current liquid cash balance (₹85,000). Failure to collect threatens operational solvency within 60 days.`,
      },
      {
        title: 'Top Client Exposure (Rosewood Cloud Systems Inc.)',
        severity: 'CRITICAL',
        description: `Rosewood Cloud Systems Inc. (Angel Rose Biju · INV-2026-002) owes ₹1,20,000 for Sentinel Enterprise Cluster, representing 49.4% of total overdue receivables and 141% of total liquid cash. Continued delinquency drops effective runway to ~5 days.`,
      },
      {
        title: 'Chronic Aging & Default Vulnerability (JoyNex Digital Retail Ltd.)',
        severity: 'HIGH',
        description: `JoyNex Digital Retail Ltd. (Diya Joy · INV-2026-003) is critically overdue by 42 days on ₹78,000. Invoices past 35 days show a 45% increased likelihood of transitioning into uncollectible bad debt without immediate legal / suspension escalation.`,
      },
      {
        title: 'Tight Baseline Cash Runway Buffer',
        severity: 'MODERATE',
        description: `With liquid cash at ₹85,000 and a net monthly burn of ₹42,000, baseline runway is 61 days (~2.02 months). Any operational disruption or revenue decline will accelerate the depletion curve.`,
      },
    ],
    totalOverdue,
    topExposure,
    oldest,
  };
}

export function simulateRevenueDrop(dropPercent = 20) {
  const baseMonthlyInflows = financialMetrics.monthlyInflows || 110000;
  const baseBurn = financialMetrics.monthlyNetBurn;
  const currentCash = financialMetrics.liquidCash;

  const revenueLoss = Math.round(baseMonthlyInflows * (dropPercent / 100));
  const revisedMonthlyBurn = baseBurn + revenueLoss;
  const revisedRunwayDays = Math.max(0, Math.round((currentCash / (revisedMonthlyBurn / 30))));
  const revisedRunwayMonths = (revisedRunwayDays / 30.4).toFixed(1);

  return {
    dropPercent,
    baseCash: currentCash,
    baseBurn,
    baseMonthlyInflows,
    revenueLoss,
    revisedMonthlyBurn,
    revisedRunwayDays,
    revisedRunwayMonths,
    runwayReductionDays: financialMetrics.runwayDays - revisedRunwayDays,
    status: revisedRunwayDays < 30 ? 'CRITICAL (Insolvency Alert)' : revisedRunwayDays < 60 ? 'CAUTION (Restricted)' : 'STABLE',
  };
}
