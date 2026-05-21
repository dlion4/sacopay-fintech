import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ══════════════════════════════════════════════════════════════
   INTERFACES
   ══════════════════════════════════════════════════════════════ */
export interface Plan {
  id: string;
  name: string;
  price: number;
  billingLabel: string;
  memberLimit: string;
  description: string;
  features: string[];
  tag?: string;
  tagColor?: string;
  popular?: boolean;
  category: 'sacco' | 'micro';
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  category: string;
  selected?: boolean;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  extra: number | null;
  included?: boolean;
}

export interface BillingHistoryItem {
  id: string;
  description: string;
  invoiceRef: string;
  contractRef?: string;
  paymentMethod?: string;
  note?: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Completed' | 'Cancelled';
}

export interface ContractDuration {
  months: number;
  label: string;
  discount: number;
  tag?: string;
}

export interface PaygInstallment {
  num: number;
  date: string;
  amount: number;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */
@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription.html',
  styleUrls: ['./subscription.scss'],
})
export class SubscriptionComponent {

  /* ── Sidebar Navigation ────────────────────────────────────── */
  navItems = [
    { section: 'MAIN MENU' },
    { label: 'Dashboard', icon: '⊞', href: '#' },
    { label: 'Analytics', icon: '↗', href: '#' },
    { section: 'MEMBERS & KYC' },
    { label: 'Members', icon: '👥', href: '#' },
    { label: 'KYC Verification', icon: '⊙', href: '#', badge: 12 },
    { section: 'FINANCIAL OPERATIONS' },
    { label: 'Transactions', icon: '⇄', href: '#' },
    { label: 'Loan Disbursements', icon: '⊕', href: '#' },
    { label: 'Loan Repayments', icon: '↺', href: '#', badge: 3 },
    { label: 'Savings', icon: '⊓', href: '#' },
    { label: 'Wallets', icon: '◈', href: '#' },
    { section: 'BILLING' },
    { label: 'Subscription & Billing', icon: '◉', href: '#', active: true },
    { label: 'Reports', icon: '≡', href: '#' },
    { section: 'SETTINGS' },
    { label: 'Settings', icon: '⚙', href: '#' },
    { label: 'Notifications', icon: '🔔', href: '#' },
  ];

  /* ── Help Footer Items ──────────────────────────────────────── */
  helpItems = [
    { icon: '💬', label: 'Talk to Support', sub: 'Available 24/7', color: '#e6faf4', border: '#00d08455' },
    { icon: '📖', label: 'Documentation', sub: 'Guides & tutorials', color: '#e3f2fd', border: '#2196f355' },
    { icon: '⚡', label: 'Live Chat', sub: 'Quick questions', color: '#f3e5f5', border: '#9c27b055' },
    { icon: '📅', label: 'Schedule Call', sub: 'Book a demo', color: '#fff3e0', border: '#ff980055' },
  ];

  /* ── Plans ─────────────────────────────────────────────────── */
  plans: Plan[] = [
    // Micro / Community Plans
    {
      id: 'micro-payg', name: 'Community Starter', price: 0,
      billingLabel: 'No monthly fee', memberLimit: 'Up to 30 members',
      description: 'Perfect for chamas, village groups & unregistered SACCOs. No upfront subscription — just a one-time KES 1,000 activation fee. Pay only when you transact.',
      features: [
        'KES 1,000 one-time activation fee', 'PAYG: 1.5% fee per transaction processed',
        'Member registration & contribution tracking', 'Basic loan requests & repayments',
        'M-Pesa C2B collection (Safaricom Paybill)', 'WhatsApp notifications (basic)',
        'Member self-service portal', 'Up to 2 admin users',
        'Onboard extra members anytime (KES 50/member)', 'Upgrade to Standard plan at any time',
      ],
      tag: 'No Upfront Cost', tagColor: 'orange', category: 'micro',
    },
    {
      id: 'micro-basic', name: 'Chama Pro', price: 2500,
      billingLabel: '/mo', memberLimit: 'Up to 80 members',
      description: 'For growing chamas & investment groups ready for a light subscription model. Includes compliance basics and expanded reporting.',
      features: [
        'Everything in Community Starter', 'Flat monthly fee — no per-transaction charges',
        'Member statements (PDF)', 'SASRA-lite compliance reports',
        'Group savings & fixed deposits', 'Bulk SMS alerts (500 SMS/mo)',
        '3 admin users', 'Basic audit trail', 'Priority email support',
      ],
      tag: 'Best for Chamas', tagColor: 'teal', category: 'micro',
    },
    // Official SACCO Plans
    {
      id: 'starter', name: 'Starter', price: 35000,
      billingLabel: '/mo', memberLimit: 'Up to 300 members',
      description: 'For newly registered SACCOs starting digital operations.',
      features: [
        'Member Registry (200)', 'M-Pesa Integration', 'SASRA Basic Reports', '1 Branch',
        '2 Admin Users', 'Basic Loan Processing', 'Savings & Deposits', 'SSL + 2FA security',
      ],
      category: 'sacco',
    },
    {
      id: 'basic', name: 'Basic', price: 55000,
      billingLabel: '/mo', memberLimit: 'Up to 500 members',
      description: 'For small SACCOs with growing operations.',
      features: [
        'Member Registry (500)', 'Full Loan Management', 'Guarantor Tracking', 'SASRA Full Reports',
        'Up to 3 Branches', '5 Admin Users', 'Basic CRM Suite', 'Automated Interest Calc',
      ],
      category: 'sacco',
    },
    {
      id: 'growth', name: 'Growth', price: 75000,
      billingLabel: '/mo', memberLimit: 'Up to 2,500 members',
      description: 'For mid-sized SACCOs with full operational needs.',
      features: [
        'Member Registry (2,500)', 'All Mobile Money + Banks', 'HR & Staff Management',
        'Advanced Analytics', 'Advanced Loan Portfolio', 'Full CRM Suite',
        'Unlimited Branches', 'Unlimited Admin Users',
      ],
      popular: true, tag: 'Most Popular', tagColor: 'green', category: 'sacco',
    },
    {
      id: 'professional', name: 'Professional', price: 110000,
      billingLabel: '/mo', memberLimit: 'Up to 10,000 members',
      description: 'For large SACCOs with diaspora & API needs.',
      features: [
        'Everything in Growth', 'Multi-Currency Support', 'Custom Branding', 'Audit & Compliance Module',
        'Diaspora & Cross-Border', 'Full API Access', 'Priority 24/7 Support', 'White-label Member App',
      ],
      category: 'sacco',
    },
    {
      id: 'enterprise', name: 'Enterprise', price: 180000,
      billingLabel: '/mo', memberLimit: 'Unlimited members',
      description: 'For SACCO federations & national cooperatives.',
      features: [
        'Everything in Professional', 'Custom Integrations', 'Unlimited Sub-SACCOs',
        'Dedicated Account Manager', 'Virtual Staff Training', 'Compliance Advisory',
        'Quarterly Business Reviews', 'SLA Guarantees',
      ],
      tag: 'Full Power', tagColor: 'purple', category: 'sacco',
    },
  ];

  /* ── Addons ────────────────────────────────────────────────── */
  addons: Addon[] = [
    { id: 'bulk-sms', name: 'Bulk SMS Suite', price: 3500, description: 'Custom Sender ID across Safaricom, Airtel & Telkom. 1,000 SMS/mo.', details: 'Reach all members instantly via SMS. Includes sender ID registration, delivery reports, and message templates.', category: 'Communication', selected: true },
    { id: 'whatsapp-api', name: 'WhatsApp Business API', price: 4200, description: 'Rich messages for loan approvals, reminders, statements. 2,000 msgs/mo.', details: 'Two-way WhatsApp messaging with chatbot support, automated loan notifications, and statement delivery.', category: 'Communication', selected: true },
    { id: 'bulk-email', name: 'Bulk Email Campaigns', price: 2800, description: 'Branded newsletters, AGM notices, dividend announcements. 10,000 emails/mo.', details: 'Drag-and-drop email builder with analytics, member segmentation, and automated campaign scheduling.', category: 'Communication' },
    { id: 'employment-verification', name: 'Employment Verification API', price: 5500, description: 'Verify member employment status in real-time. 500 checks/mo.', details: 'Integrated with NSSF, HELB, and major employers to verify payslips and employment status for loan applications.', category: 'Compliance' },
    { id: 'credit-bureau', name: 'Credit Bureau Checks', price: 6000, description: 'CRB, Metropol & TransUnion Integration. 300 checks/mo.', details: "Automated credit scoring and blacklist checks via Kenya's leading credit bureaus for better loan risk management.", category: 'Compliance' },
    { id: 'iprs-verification', name: 'IPRS Live Verification', price: 4500, description: 'Real-time national ID validation via IPRS Kenya. 500 verifications/mo.', details: "Instant KYC verification against the National Registration Bureau's IPRS database for foolproof member onboarding.", category: 'Compliance', selected: true },
    { id: 'mpesa-paybill', name: 'M-Pesa Paybill Integration', price: 5500, description: 'Live paybill with real-time posting, scheduled auto-reconciliation daily.', details: 'Dedicated Paybill account management with real-time transaction posting and automated end-of-day reconciliation.', category: 'Payments', selected: true },
    { id: 'bank-reconciliation', name: 'Bank Reconciliation (Extra)', price: 4000, description: 'Live reconciliation with Equity, KCB, Co-op, Family Bank, DTB.', details: 'Automated bank statement import, transaction matching, and reconciliation reports for all major Kenyan banks.', category: 'Payments' },
    { id: 'ussd', name: 'Dedicated USSD Code', price: 8500, description: 'Your own USSD short code for balance checks, loans, statements.', details: 'Custom USSD short code (*XXX#) with full member self-service functionality — works on any mobile phone, no internet required.', category: 'Payments' },
    { id: 'bi-dashboard', name: 'Advanced BI Dashboard', price: 5000, description: '50+ custom reports, scheduled email reports, exportable PDF/Excel.', details: 'Executive-level analytics with KPI scorecards, trend analysis, portfolio health monitoring, and automated report delivery.', category: 'Analytics', selected: true },
    { id: 'ai-credit', name: 'AI Credit Scoring', price: 7500, description: 'ML-based assessment using savings history & repayment behaviour.', details: 'Machine learning model trained on SACCO data to predict loan default risk and recommend optimal loan limits per member.', category: 'Analytics' },
    { id: 'account-manager', name: 'Dedicated Account Manager', price: 6000, description: 'Named contact, monthly strategy calls, priority issue resolution.', details: 'A dedicated SACCOPay success manager who knows your SACCO, conducts monthly reviews, and resolves issues within 2 hours.', category: 'Support' },
  ];

  addonCategories = ['All', 'Communication', 'Compliance', 'Payments', 'Analytics', 'Support'];

  /* ── Regions ───────────────────────────────────────────────── */
  regions: Region[] = [
    { id: 'kenya', name: 'Kenya Only (Local)', description: 'M-Pesa, Airtel Money, bank transfers within Kenya', extra: null, included: true },
    { id: 'east-africa', name: 'East Africa Region', description: 'Uganda, Tanzania, Rwanda — mobile money & banks', extra: 1500 },
    { id: 'uk-europe', name: 'UK / Europe', description: 'Diaspora remittances, SEPA, international wires', extra: 3000 },
    { id: 'usa-canada', name: 'USA / Canada', description: 'ACH, wire transfers, diaspora member contributions', extra: 3000 },
    { id: 'middle-east', name: 'Middle East (UAE, Qatar, Saudi)', description: 'Remittance corridors from Gulf states', extra: 2000 },
    { id: 'rest-world', name: 'Rest of World', description: 'Australia, Asia, other African countries', extra: 4000 },
  ];

  /* ── Contract Durations ────────────────────────────────────── */
  contractDurations: ContractDuration[] = [
    { months: 1, label: 'Monthly', discount: 0 },
    { months: 3, label: '3 Months', discount: 5, tag: '5% off' },
    { months: 6, label: '6 Months', discount: 10, tag: '10% off' },
    { months: 12, label: '12 Months', discount: 15, tag: '15% off — Best Value' },
  ];

  /* ── Billing History ───────────────────────────────────────── */
  billingHistory: BillingHistoryItem[] = [
    { id: '1', description: 'Growth Plan — April 2026 (Installment 3/3)', invoiceRef: 'INV-2026-0048', contractRef: 'SP-2026-0091', amount: 52500, date: 'Apr 1, 2026', status: 'Paid' },
    { id: '2', description: 'Growth Plan — March 2026 (Installment 2/3)', invoiceRef: 'INV-2026-0032', paymentMethod: 'Wallet Payment', amount: 52500, date: 'Mar 1, 2026', status: 'Paid' },
    { id: '3', description: 'Growth Plan — February 2026 (Installment 1/3)', invoiceRef: 'INV-2026-0015', paymentMethod: 'M-Pesa', note: 'Contract signed Feb 1, 2026', amount: 58575, date: 'Feb 1, 2026', status: 'Paid' },
    { id: '4', description: 'Basic Plan — Contract #SP-2025-0044 (Completed)', invoiceRef: 'INV-2025-0141', note: '3-month contract · Nov 2025–Jan 2026 · KES 35,000/mo · Fully settled', amount: 105000, date: 'Jan 31, 2026', status: 'Completed' },
    { id: '5', description: 'Basic Plan — Contract #SP-2025-0033 (Installment 3/3)', invoiceRef: 'INV-2025-0099', contractRef: 'SP-2025-0033', amount: 35000, date: 'Nov 1, 2025', status: 'Paid' },
    { id: '6', description: 'Basic Plan — Contract #SP-2025-0033 (Installment 2/3)', invoiceRef: 'INV-2025-0067', contractRef: 'SP-2025-0033', amount: 35000, date: 'Oct 1, 2025', status: 'Paid' },
    { id: '7', description: 'Basic Plan — Contract #SP-2025-0033 (Installment 1/3)', invoiceRef: 'INV-2025-0041', contractRef: 'SP-2025-0033', paymentMethod: 'Bank Transfer', amount: 38675, date: 'Sep 1, 2025', status: 'Paid' },
    { id: '8', description: 'Starter Plan — Annual Contract #SP-2024-0012', invoiceRef: 'INV-2024-0188', note: '12-month contract · Sep 2024–Aug 2025 · KES 28,000/mo', amount: 336000, date: 'Sep 1, 2024', status: 'Completed' },
    { id: '9', description: 'Bulk SMS Suite Add-on — July 2026', invoiceRef: 'INV-2026-0061', paymentMethod: 'Wallet', amount: 3500, date: 'Jul 1, 2026', status: 'Pending' },
    { id: '10', description: 'AI Credit Scoring Add-on — Setup Fee', invoiceRef: 'INV-2026-0072', note: 'One-time integration setup', amount: 12000, date: 'Jul 15, 2026', status: 'Pending' },
    { id: '11', description: 'Community Starter — Activation Fee', invoiceRef: 'INV-2024-0001', note: 'Account activation — PAYG plan', amount: 1000, date: 'Jan 15, 2024', status: 'Paid' },
    { id: '12', description: 'UK / Europe Region Add-on — Q1 2026', invoiceRef: 'INV-2026-0009', note: 'Diaspora remittance region enabled', amount: 9000, date: 'Feb 1, 2026', status: 'Paid' },
  ];

  billingStatuses = ['All', 'Paid', 'Pending', 'Overdue', 'Completed', 'Cancelled'];

  statusColors: Record<string, string> = {
    Paid: '#00d084', Pending: '#ff9800', Overdue: '#f44336', Completed: '#2196f3', Cancelled: '#94a3b8',
  };

  /* ── Tier Features ─────────────────────────────────────────── */
  tierNames = ['Free / Core', 'Standard', 'Premium', 'Advanced'] as const;

  tierFeatures: Record<string, Record<string, string[]>> = {
    'Free / Core': {
      'Member Management': ['Member registration & KYC capture', 'Savings & deposit accounts', 'Basic member profile', 'Member self-service portal'],
      'Reporting': ['SASRA basic reports', 'Monthly summary sheets', 'Member statements (PDF)', 'Basic audit trail'],
      'Security & Access': ['SSL encryption', '2-factor authentication', 'Role-based access (2 admins)', 'Daily automated backups'],
    },
    'Standard': {
      'Loan Processing': ['Full loan lifecycle management', 'Guarantor tracking', 'Automated interest calculation', 'Loan schedule generation', 'Default tracking'],
      'Payments': ['M-Pesa C2B integration', 'Airtel Money integration', 'Manual bank reconciliation', 'Real-time balance updates'],
      'Operations': ['Up to 3 branches', '5 admin users', 'Basic CRM (contacts & notes)', 'Email notifications (in-app)'],
    },
    'Premium': {
      'Analytics & Intelligence': ['Advanced BI dashboards', 'Portfolio health metrics', 'Member growth trends', 'Predictive insights', 'Custom report builder'],
      'HR & Staff': ['Full HR module', 'Payroll processing', 'Leave management', 'NSSF/NHIF/PAYE compliance', 'Performance tracking'],
      'Scale': ['Unlimited branches', 'Unlimited admin users', 'Full CRM suite', 'Treasury management', 'Advanced KYC workflows'],
    },
    'Advanced': {
      'Cross-Border': ['Multi-currency (USD/GBP/EUR)', 'Diaspora member management', 'International remittance tracking', 'Cross-border compliance'],
      'Developer & API': ['Full REST API access', 'Webhook support', 'API documentation', 'Sandbox environment', 'Custom integrations'],
      'Premium Support': ['White-label member app', 'Custom branding', 'Dedicated account manager', '4-hour support SLA', 'Quarterly business reviews'],
    },
  };

  tagColorMap: Record<string, string> = {
    green: '#00d084', teal: '#00bcd4', orange: '#ff9800', purple: '#9c27b0',
  };

  payMethods = [
    { id: 'mpesa', label: 'M-Pesa STK Push', sub: 'Safaricom M-Pesa · Instant debit', icon: '📱' },
    { id: 'bank', label: 'Bank Transfer', sub: 'Equity Bank · 2–4 hours verification', icon: '🏦' },
    { id: 'wallet', label: 'SACCOPay Wallet', sub: 'Balance: KES 124,650 · Instant · No fees', icon: '💼' },
    { id: 'card', label: 'Card Payment', sub: 'Visa, Mastercard · Secured by Stripe', icon: '💳' },
  ];

  /* ══════════════════════════════════════════════════════════════
     STATE (Signals)
     ══════════════════════════════════════════════════════════════ */
  mainTab = signal<'Manage Subscription' | 'Billing History'>('Manage Subscription');
  step = signal(1);

  // Plan selection
  selectedPlan = signal<Plan | null>(null);
  planCatTab = signal<'sacco' | 'micro'>('sacco');

  // Addons
  selectedAddonIds = signal<string[]>(['bulk-sms', 'whatsapp-api', 'iprs-verification', 'mpesa-paybill', 'bi-dashboard']);
  addonCatFilter = signal('All');
  detailAddon = signal<Addon | null>(null);

  // Regions
  selectedRegionIds = signal<string[]>(['kenya', 'uk-europe']);

  // Configuration
  memberCount = signal(1284);
  branchCount = signal(3);
  currency = signal('KES');

  // Contract
  contractMonths = signal(3);
  enablePayg = signal(false);

  // Tier features
  activeTier = signal('Free / Core');

  // Payment
  payMethod = signal('mpesa');
  mpesaPhone = signal('+254 712345678');
  agreeTerms = signal(false);

  // Billing history
  billingPage = signal(1);
  billingStatusFilter = signal('All');
  selectedInvoice = signal<BillingHistoryItem | null>(null);
  showExportModal = signal(false);
  exportFormat = signal('PDF');
  exportFrom = signal('2026-01-01');
  exportTo = signal('2026-12-31');

  // Modals
  showAutoSuggest = signal(false);
  showPaySuccess = signal(false);
  showTermsModal = signal(false);
  paySuccessRef = '';

  // Toast
  toast = signal<{ msg: string; type: 'success' | 'error' } | null>(null);
  private toastTimer: any;

  readonly PAGE_SIZE = 4;

  /* ══════════════════════════════════════════════════════════════
     COMPUTED
     ══════════════════════════════════════════════════════════════ */
  filteredPlans = computed(() =>
    this.plans.filter(p => p.category === this.planCatTab())
  );

  filteredAddons = computed(() => {
    const cat = this.addonCatFilter();
    return cat === 'All' ? this.addons : this.addons.filter(a => a.category === cat);
  });

  duration = computed(() =>
    this.contractDurations.find(d => d.months === this.contractMonths())!
  );

  discount = computed(() => this.duration()?.discount || 0);

  addonObjs = computed(() =>
    this.addons.filter(a => this.selectedAddonIds().includes(a.id))
  );

  regionObjs = computed(() =>
    this.regions.filter(r => this.selectedRegionIds().includes(r.id) && !r.included && r.extra !== null)
  );

  baseMonthly = computed(() => this.selectedPlan()?.price || 0);

  addonsMonthly = computed(() =>
    this.addonObjs().reduce((s, a) => s + a.price, 0)
  );

  regionsMonthly = computed(() =>
    this.regionObjs().reduce((s, r) => s + (r.extra || 0), 0)
  );

  monthlyTotal = computed(() =>
    this.baseMonthly() + this.addonsMonthly() + this.regionsMonthly()
  );

  grandTotal = computed(() =>
    this.monthlyTotal() * this.contractMonths() * (1 - this.discount() / 100)
  );

  paygFee = computed(() =>
    this.enablePayg() ? this.grandTotal() * 0.015 : 0
  );

  numInstallments = computed(() => {
    const m = this.contractMonths();
    return m <= 1 ? 1 : m <= 3 ? 3 : 6;
  });

  upfrontPct = computed(() =>
    this.enablePayg() ? Math.round(100 / this.numInstallments()) : 60
  );

  amountDueToday = computed(() =>
    this.enablePayg()
      ? (this.grandTotal() + this.paygFee()) / this.numInstallments()
      : this.grandTotal() * 0.6
  );

  baseTotal = computed(() => this.baseMonthly() * this.contractMonths());
  discountAmt = computed(() => this.baseTotal() * (this.discount() / 100));

  installments = computed<PaygInstallment[]>(() => {
    const n = this.numInstallments();
    const amt = (this.grandTotal() + this.paygFee()) / n;
    const today = new Date();
    return Array.from({ length: n }, (_, i) => {
      const d = new Date(today);
      d.setMonth(d.getMonth() + i);
      return {
        num: i + 1,
        date: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: amt,
      };
    });
  });

  // Billing history
  filteredBilling = computed(() => {
    const f = this.billingStatusFilter();
    return f === 'All' ? this.billingHistory : this.billingHistory.filter(b => b.status === f);
  });

  totalBillingPages = computed(() =>
    Math.ceil(this.filteredBilling().length / this.PAGE_SIZE)
  );

  paginatedBilling = computed(() => {
    const p = this.billingPage();
    return this.filteredBilling().slice((p - 1) * this.PAGE_SIZE, p * this.PAGE_SIZE);
  });

  billingPagesArray = computed(() =>
    Array.from({ length: this.totalBillingPages() }, (_, i) => i + 1)
  );

  billingShowFrom = computed(() => (this.billingPage() - 1) * this.PAGE_SIZE + 1);
  billingShowTo = computed(() => Math.min(this.billingPage() * this.PAGE_SIZE, this.filteredBilling().length));

  // Step btn labels
  stepBtnLabel = computed(() => {
    const s = this.step();
    if (s === 1) return 'Continue to Add-ons & Extras →';
    if (s === 2) return 'Continue to Contract Terms →';
    if (s === 3) return 'Continue to Checkout →';
    return '';
  });

  osBtnLabel = computed(() => {
    const s = this.step();
    if (s === 1) return 'Continue to Add-ons & Extras';
    if (s === 2) return 'Continue to Contract Terms';
    if (s === 3) return 'Continue to Checkout';
    return '';
  });

  bankRef = computed(() => 'INV-' + Date.now().toString().slice(-6));

  /* ══════════════════════════════════════════════════════════════
     METHODS
     ══════════════════════════════════════════════════════════════ */
  showToastMsg(msg: string, type: 'success' | 'error' = 'success') {
    clearTimeout(this.toastTimer);
    this.toast.set({ msg, type });
    this.toastTimer = setTimeout(() => this.toast.set(null), 4000);
  }

  setMainTab(tab: 'Manage Subscription' | 'Billing History') { this.mainTab.set(tab); }
  nextStep() { this.step.update(s => Math.min(4, s + 1)); }
  prevStep() { this.step.update(s => Math.max(1, s - 1)); }

  selectPlan(plan: Plan) { this.selectedPlan.set(plan); }
  setPlanCatTab(cat: 'sacco' | 'micro') { this.planCatTab.set(cat); }

  toggleAddon(id: string) {
    this.selectedAddonIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }

  isAddonSelected(id: string): boolean { return this.selectedAddonIds().includes(id); }

  toggleRegion(id: string) {
    this.selectedRegionIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }

  isRegionSelected(id: string): boolean { return this.selectedRegionIds().includes(id); }

  decrementBranch() { this.branchCount.update(b => Math.max(1, b - 1)); }
  incrementBranch() { this.branchCount.update(b => b + 1); }

  setDuration(months: number) { this.contractMonths.set(months); }
  togglePayg() { this.enablePayg.update(v => !v); }

  setBillingFilter(status: string) {
    this.billingStatusFilter.set(status);
    this.billingPage.set(1);
  }

  setBillingPage(p: number) { this.billingPage.set(p); }
  prevBillingPage() { this.billingPage.update(p => Math.max(1, p - 1)); }
  nextBillingPage() { this.billingPage.update(p => Math.min(this.totalBillingPages(), p + 1)); }

  viewInvoice(item: BillingHistoryItem) { this.selectedInvoice.set(item); }
  closeInvoice() { this.selectedInvoice.set(null); }

  openExportModal() { this.showExportModal.set(true); }
  closeExportModal() { this.showExportModal.set(false); }

  openAutoSuggest() { this.showAutoSuggest.set(true); }
  closeAutoSuggest() { this.showAutoSuggest.set(false); }

  applyRecommendation() {
    const growth = this.plans.find(p => p.id === 'growth')!;
    this.selectedPlan.set(growth);
    this.selectedAddonIds.set(['whatsapp-api', 'bi-dashboard', 'iprs-verification', 'mpesa-paybill']);
    this.selectedRegionIds.set(['kenya', 'uk-europe']);
    this.showAutoSuggest.set(false);
    this.mainTab.set('Manage Subscription');
    this.showToastMsg('Growth Plan pre-selected based on your profile!', 'success');
  }

  openAddonDetail(addon: Addon, event: MouseEvent) {
    event.stopPropagation();
    this.detailAddon.set(addon);
  }

  closeAddonDetail() { this.detailAddon.set(null); }

  addFromDetail() {
    const addon = this.detailAddon();
    if (addon) { this.toggleAddon(addon.id); this.closeAddonDetail(); }
  }

  toggleAddonStop(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.toggleAddon(id);
  }

  openTermsModal() { this.showTermsModal.set(true); }
  closeTermsModal() { this.showTermsModal.set(false); }

  handlePay() {
    if (!this.agreeTerms()) return;
    this.paySuccessRef = 'INV-2026-' + Math.floor(Math.random() * 9000 + 1000);
    this.showPaySuccess.set(true);
    this.showToastMsg('Payment submitted successfully!', 'success');
  }

  closePaySuccess() {
    this.showPaySuccess.set(false);
    this.mainTab.set('Billing History');
    this.step.set(1);
  }

  objectKeys(obj: Record<string, string[]>): string[] {
    return Object.keys(obj);
  }

  durationTotal(dur: ContractDuration): number {
    return Math.round((this.monthlyTotal() * dur.months * (1 - dur.discount / 100)) / 1000);
  }

  getSelectBtnLabel(plan: Plan): string {
    if (this.selectedPlan()?.id === plan.id) return '✓ Selected';
    if (plan.id === 'growth') return 'Select Growth';
    return 'Select ' + plan.name.split(' ')[0];
  }

  stopProp(event: MouseEvent) { event.stopPropagation(); }

  preventNav(event: Event) { event.preventDefault(); }

  getStatusBg(status: string): string { return (this.statusColors[status] || '#94a3b8') + '18'; }
  getStatusBorder(status: string): string { return (this.statusColors[status] || '#94a3b8') + '33'; }
  getStatusColor(status: string): string { return this.statusColors[status] || '#94a3b8'; }

  getTagBg(tagColor: string): string { return (this.tagColorMap[tagColor] || '#00d084') + '22'; }
  getTagColor(tagColor: string): string { return this.tagColorMap[tagColor] || '#00d084'; }
  getTagBorder(tagColor: string): string { return (this.tagColorMap[tagColor] || '#00d084') + '44'; }
}
