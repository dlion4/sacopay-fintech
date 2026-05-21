import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ═════════════════════════════════════════════════════════════════════════════
//  INTERFACES
// ═════════════════════════════════════════════════════════════════════════════
export interface NavItem { section?: string; label?: string; icon?: string; badge?: number; active?: boolean; }

export interface ReportItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg: string;
  category: string;
  tag?: string;
}

export interface ReportGroup {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  color: string;
  count: number;
  reports: ReportItem[];
}

export interface GeneratedReport {
  id: string;
  name: string;
  category: string;
  catColor: string;
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
  generated: string;
  generatedBy: string;
  period?: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  subtitle: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  freqColor: string;
  recipients: string;
  nextRun: string;
  format: string;
}

export interface HistoryRecord {
  id: string;
  name: string;
  category: string;
  catColor: string;
  format: 'PDF' | 'Excel' | 'CSV';
  size: string;
  generatedOn: string;
  generatedBy: string;
  period: string;
  status: 'Completed' | 'Processing' | 'Failed';
}

export interface CustomReportField { key: string; label: string; selected: boolean; }

export interface ReportPreviewRow { description: string; current: string; previous: string; variance: string; pct: string; positive: boolean; }

// ═════════════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
@Component({
  selector: 'app-all-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-reports.html',
  styleUrls: ['./all-reports.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {

  // ────────── SIDEBAR NAV ──────────
  readonly navItems: NavItem[] = [
    { section: 'MAIN MENU' },
    { label: 'Dashboard', icon: '⊞' },
    { label: 'Analytics', icon: '↗' },
    { section: 'MEMBERS & KYC' },
    { label: 'Members', icon: '👥' },
    { label: 'KYC Verification', icon: '⊙' },
    { section: 'FINANCIAL OPERATIONS' },
    { label: 'Transactions', icon: '⇄' },
    { label: 'Loan Disbursements', icon: '⊕' },
    { label: 'Loan Repayments', icon: '↺' },
    { label: 'Savings', icon: '⊓' },
    { label: 'SACCOPay Wallet', icon: '◈' },
    { section: 'REPORTS & COMPLIANCE' },
    { label: 'Reports Center', icon: '📊', active: true },
    { label: 'Compliance & Regulatory', icon: '◉' },
    { label: 'Audit Trail', icon: '⌖' },
    { section: 'SETTINGS' },
    { label: 'Settings', icon: '⚙' },
  ];

  // ────────── REPORT GROUPS ──────────
  readonly REPORT_GROUPS: ReportGroup[] = [
    {
      id: 'financial',
      title: 'Financial Reports',
      subtitle: 'Income, expenses, balance sheets',
      icon: '💹',
      iconBg: '#e6faf4',
      color: '#00d084',
      count: 5,
      reports: [
        { id: 'fin-summary', name: 'Financial Summary', description: 'P&L, revenue, expenses overview', icon: '📈', iconBg: '#e6faf4', category: 'Financial' },
        { id: 'balance-sheet', name: 'Balance Sheet', description: 'Assets, liabilities, equity', icon: '⚖', iconBg: '#e3f2fd', category: 'Financial' },
        { id: 'income-statement', name: 'Income Statement', description: 'Revenue & expenditure analysis', icon: '💰', iconBg: '#e8f5e9', category: 'Financial' },
        { id: 'cashflow', name: 'Cash Flow Statement', description: 'Inflows & outflows analysis', icon: '🔄', iconBg: '#fff3e0', category: 'Financial' },
        { id: 'trial-balance', name: 'Trial Balance', description: 'All ledger account balances', icon: '📋', iconBg: '#f3e5f5', category: 'Financial' },
      ],
    },
    {
      id: 'loan',
      title: 'Loan Reports',
      subtitle: 'Portfolio, disbursements, aging',
      icon: '🏦',
      iconBg: '#e3f2fd',
      color: '#2196f3',
      count: 6,
      reports: [
        { id: 'loan-portfolio', name: 'Loan Portfolio Summary', description: 'Active loans, amounts, PAR analysis', icon: '📊', iconBg: '#e3f2fd', category: 'Loan' },
        { id: 'disbursement', name: 'Disbursement Report', description: 'All loans disbursed by period', icon: '💸', iconBg: '#e8f5e9', category: 'Loan' },
        { id: 'loan-aging', name: 'Loan Aging Report', description: 'Overdue analysis by aging bucket', icon: '⏰', iconBg: '#fff8e1', category: 'Loan' },
        { id: 'collection', name: 'Collection & Repayment', description: 'Repayments received, efficiency', icon: '✅', iconBg: '#e6faf4', category: 'Loan' },
        { id: 'interest-income', name: 'Interest Income Report', description: 'Interest earned & projected', icon: '📈', iconBg: '#f3e5f5', category: 'Loan' },
        { id: 'writeoff', name: 'Write-Off & Provisions', description: 'Written off loans & provisioning', icon: '🔴', iconBg: '#ffebee', category: 'Loan' },
      ],
    },
    {
      id: 'savings',
      title: 'Savings Reports',
      subtitle: 'Deposits, withdrawals, interest',
      icon: '💎',
      iconBg: '#e8f5e9',
      color: '#4caf50',
      count: 5,
      reports: [
        { id: 'savings-portfolio', name: 'Savings Portfolio', description: 'All savings by type & balance', icon: '💰', iconBg: '#e8f5e9', category: 'Savings' },
        { id: 'deposit-report', name: 'Deposit Report', description: 'All deposits by period & channel', icon: '⬇', iconBg: '#e3f2fd', category: 'Savings' },
        { id: 'withdrawal-report', name: 'Withdrawal Report', description: 'All withdrawals by period', icon: '⬆', iconBg: '#fff3e0', category: 'Savings' },
        { id: 'share-capital', name: 'Share Capital Register', description: 'All shareholders & holdings', icon: '🏛', iconBg: '#f3e5f5', category: 'Savings' },
        { id: 'interest-dividends', name: 'Interest & Dividends', description: 'Interest accrued & dividends paid', icon: '✨', iconBg: '#e6faf4', category: 'Savings' },
      ],
    },
    {
      id: 'member',
      title: 'Member Reports',
      subtitle: 'Membership, KYC, activity',
      icon: '👥',
      iconBg: '#fff3e0',
      color: '#ff9800',
      count: 4,
      reports: [
        { id: 'member-register', name: 'Member Register', description: 'Complete member list with details', icon: '📋', iconBg: '#fff3e0', category: 'Member' },
        { id: 'kyc-status', name: 'KYC Status Report', description: 'Verification status of all members', icon: '🔐', iconBg: '#e6faf4', category: 'Member' },
        { id: 'member-statement', name: 'Individual Member Statement', description: 'Full financial statement per member', icon: '📄', iconBg: '#e3f2fd', category: 'Member' },
        { id: 'membership-growth', name: 'Membership Growth', description: 'New, exited, active members trend', icon: '📈', iconBg: '#e8f5e9', category: 'Member' },
      ],
    },
    {
      id: 'compliance',
      title: 'Compliance & Regulatory',
      subtitle: 'SASRA, CBK, tax reports',
      icon: '📋',
      iconBg: '#e3f2fd',
      color: '#2196f3',
      count: 3,
      reports: [
        { id: 'sasra-quarterly', name: 'SASRA Quarterly Return', description: 'Regulatory compliance report', icon: '🏛', iconBg: '#e3f2fd', category: 'Compliance' },
        { id: 'tax-withholding', name: 'Tax & Withholding Report', description: 'Withholding tax on interest/dividends', icon: '📊', iconBg: '#fff3e0', category: 'Compliance' },
        { id: 'aml-ctf', name: 'AML / CTF Suspicious Activity', description: 'Anti-money laundering flag report', icon: '🛡', iconBg: '#ffebee', category: 'Compliance' },
      ],
    },
    {
      id: 'operational',
      title: 'Operational Reports',
      subtitle: 'Transactions, audit, system',
      icon: '⚙',
      iconBg: '#f3e5f5',
      color: '#9c27b0',
      count: 2,
      reports: [
        { id: 'transaction-report', name: 'Transaction Report', description: 'All transactions by type & channel', icon: '⇄', iconBg: '#f3e5f5', category: 'Operational' },
        { id: 'audit-trail', name: 'Audit Trail', description: 'Admin actions & system log', icon: '⌖', iconBg: '#e6faf4', category: 'Operational' },
      ],
    },
  ];

  // ────────── GENERATED REPORTS ──────────
  readonly GENERATED_REPORTS: GeneratedReport[] = [
    { id: 'g1', name: 'Financial Summary — December 2024', category: 'Financial', catColor: '#00d084', format: 'PDF', size: '1.2 MB', generated: 'Today, 2:30 PM', generatedBy: 'James Kariuki', period: 'December 2024' },
    { id: 'g2', name: 'Loan Portfolio Summary — Q4 2024', category: 'Loan', catColor: '#2196f3', format: 'Excel', size: '845 KB', generated: 'Today, 8:00 AM', generatedBy: 'Auto-generated (Quarterly)', period: 'Q4 2024' },
    { id: 'g3', name: 'Member Register — Full Export', category: 'Member', catColor: '#ff9800', format: 'CSV', size: '2.1 MB', generated: 'Yesterday', generatedBy: 'James Kariuki', period: 'Current' },
    { id: 'g4', name: 'Loan Aging Report — December 2024', category: 'Loan', catColor: '#2196f3', format: 'PDF', size: '680 KB', generated: 'Dec 16', generatedBy: 'James Kariuki', period: 'December 2024' },
    { id: 'g5', name: 'SASRA Quarterly Return — Q3 2024', category: 'Compliance', catColor: '#f44336', format: 'PDF', size: '1.5 MB', generated: 'Dec 14', generatedBy: 'James Kariuki', period: 'Q3 2024' },
    { id: 'g6', name: 'Daily Transactions — Dec 17', category: 'Operational', catColor: '#9c27b0', format: 'PDF', size: '420 KB', generated: 'Dec 17, 6:00 AM', generatedBy: 'Auto-generated (Daily)', period: 'Dec 17' },
    { id: 'g7', name: 'Balance Sheet — November 2024', category: 'Financial', catColor: '#00d084', format: 'PDF', size: '890 KB', generated: 'Dec 1', generatedBy: 'James Kariuki', period: 'November 2024' },
    { id: 'g8', name: 'KYC Status Report', category: 'Member', catColor: '#ff9800', format: 'Excel', size: '1.8 MB', generated: 'Dec 10', generatedBy: 'Grace Njeri', period: 'Current' },
  ];

  // ────────── SCHEDULED REPORTS ──────────
  readonly SCHEDULED_REPORTS: ScheduledReport[] = [
    { id: 's1', name: 'Daily Transaction Report', subtitle: 'Every day at 6:00 AM — admin@rongosacco.co.ke', frequency: 'Daily', freqColor: '#00d084', recipients: 'admin@rongosacco.co.ke', nextRun: 'Dec 19, 6:00 AM', format: 'PDF' },
    { id: 's2', name: 'Weekly Loan Collection', subtitle: 'Every Monday 8:00 AM — credit@rongosacco.co.ke', frequency: 'Weekly', freqColor: '#2196f3', recipients: 'credit@rongosacco.co.ke', nextRun: 'Dec 23, 8:00 AM', format: 'Excel' },
    { id: 's3', name: 'Monthly Financial Summary', subtitle: '1st of each month — board@rongosacco.co.ke', frequency: 'Monthly', freqColor: '#9c27b0', recipients: 'board@rongosacco.co.ke', nextRun: 'Jan 1, 7:00 AM', format: 'PDF' },
    { id: 's4', name: 'SASRA Quarterly Return', subtitle: 'Every quarter-end — compliance@rongosacco.co.ke', frequency: 'Quarterly', freqColor: '#ff9800', recipients: 'compliance@rongosacco.co.ke', nextRun: 'Mar 31, 9:00 AM', format: 'PDF' },
  ];

  // ────────── HISTORY (all reports ever generated) ──────────
  readonly HISTORY_RECORDS: HistoryRecord[] = [
    { id: 'h1', name: 'Financial Summary — December 2024', category: 'Financial', catColor: '#00d084', format: 'PDF', size: '1.2 MB', generatedOn: 'Dec 18, 2024 · 2:30 PM', generatedBy: 'James Kariuki', period: 'December 2024', status: 'Completed' },
    { id: 'h2', name: 'Loan Portfolio Summary — Q4 2024', category: 'Loan', catColor: '#2196f3', format: 'Excel', size: '845 KB', generatedOn: 'Dec 18, 2024 · 8:00 AM', generatedBy: 'Auto-generated', period: 'Q4 2024', status: 'Completed' },
    { id: 'h3', name: 'Member Register — Full Export', category: 'Member', catColor: '#ff9800', format: 'CSV', size: '2.1 MB', generatedOn: 'Dec 17, 2024 · 3:45 PM', generatedBy: 'James Kariuki', period: 'Current', status: 'Completed' },
    { id: 'h4', name: 'Loan Aging Report — December 2024', category: 'Loan', catColor: '#2196f3', format: 'PDF', size: '680 KB', generatedOn: 'Dec 16, 2024 · 11:00 AM', generatedBy: 'James Kariuki', period: 'December 2024', status: 'Completed' },
    { id: 'h5', name: 'SASRA Quarterly Return — Q3 2024', category: 'Compliance', catColor: '#f44336', format: 'PDF', size: '1.5 MB', generatedOn: 'Dec 14, 2024 · 9:30 AM', generatedBy: 'James Kariuki', period: 'Q3 2024', status: 'Completed' },
    { id: 'h6', name: 'Daily Transactions — Dec 17', category: 'Operational', catColor: '#9c27b0', format: 'PDF', size: '420 KB', generatedOn: 'Dec 17, 2024 · 6:00 AM', generatedBy: 'Auto-generated', period: 'Dec 17', status: 'Completed' },
    { id: 'h7', name: 'Balance Sheet — November 2024', category: 'Financial', catColor: '#00d084', format: 'PDF', size: '890 KB', generatedOn: 'Dec 1, 2024 · 10:00 AM', generatedBy: 'James Kariuki', period: 'November 2024', status: 'Completed' },
    { id: 'h8', name: 'KYC Status Report', category: 'Member', catColor: '#ff9800', format: 'Excel', size: '1.8 MB', generatedOn: 'Dec 10, 2024 · 2:15 PM', generatedBy: 'Grace Njeri', period: 'Current', status: 'Completed' },
    { id: 'h9', name: 'Cash Flow Statement — Q3 2024', category: 'Financial', catColor: '#00d084', format: 'PDF', size: '1.1 MB', generatedOn: 'Nov 30, 2024 · 4:00 PM', generatedBy: 'James Kariuki', period: 'Q3 2024', status: 'Completed' },
    { id: 'h10', name: 'AML/CTF Suspicious Activity — Nov 2024', category: 'Compliance', catColor: '#f44336', format: 'PDF', size: '560 KB', generatedOn: 'Nov 28, 2024 · 9:00 AM', generatedBy: 'Compliance System', period: 'November 2024', status: 'Completed' },
    { id: 'h11', name: 'Interest & Dividends — FY 2024', category: 'Savings', catColor: '#4caf50', format: 'PDF', size: '940 KB', generatedOn: 'Nov 25, 2024 · 11:30 AM', generatedBy: 'James Kariuki', period: 'FY 2024', status: 'Completed' },
    { id: 'h12', name: 'Trial Balance — October 2024', category: 'Financial', catColor: '#00d084', format: 'Excel', size: '720 KB', generatedOn: 'Nov 2, 2024 · 8:45 AM', generatedBy: 'Auto-generated', period: 'October 2024', status: 'Completed' },
  ];

  // ────────── CUSTOM REPORT BUILDER ──────────
  readonly DATA_SOURCES = ['Financial Data', 'Loan Data', 'Member Data', 'Savings Data', 'Compliance Data', 'Operational Data'];
  readonly PERIODS = ['This Month', 'Last Month', 'This Quarter', 'Last Quarter', 'This Year', 'Last Year', 'Custom Range'];
  readonly GROUP_BY_OPTIONS = ['None', 'Branch', 'Product', 'Status', 'Month', 'Quarter', 'Member Category'];
  readonly SORT_BY_OPTIONS = ['Member Name (A-Z)', 'Member Name (Z-A)', 'Balance (High-Low)', 'Balance (Low-High)', 'Date (Newest)', 'Date (Oldest)'];
  readonly FORMATS = ['PDF', 'Excel', 'CSV'];
  readonly FILTER_OPTIONS = ['All Members', 'Active Members', 'Loan Defaulters', 'New Members (30 days)', 'Expiring KYC', 'Diaspora Members'];
  readonly FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];
  readonly SCHEDULE_TIMES = ['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '5:00 PM'];
  readonly EMAIL_RECIPIENTS_LIST = ['admin@rongosacco.co.ke', 'board@rongosacco.co.ke', 'credit@rongosacco.co.ke', 'compliance@rongosacco.co.ke', 'finance@rongosacco.co.ke'];

  readonly CUSTOM_FIELDS: CustomReportField[] = [
    { key: 'memberName', label: 'Member Name', selected: true },
    { key: 'memberId', label: 'Member ID', selected: true },
    { key: 'savingsBalance', label: 'Savings Balance', selected: true },
    { key: 'loanBalance', label: 'Loan Balance', selected: true },
    { key: 'shareCapital', label: 'Share Capital', selected: true },
    { key: 'kycStatus', label: 'KYC Status', selected: true },
    { key: 'phoneNumber', label: 'Phone Number', selected: false },
    { key: 'joinDate', label: 'Join Date', selected: false },
    { key: 'lastActivity', label: 'Last Activity', selected: false },
    { key: 'loanStatus', label: 'Loan Status', selected: false },
    { key: 'branch', label: 'Branch', selected: false },
    { key: 'guarantors', label: 'Guarantors', selected: false },
  ];

  readonly PREVIEW_ROWS: ReportPreviewRow[] = [
    { description: 'Total Income', current: 'KES 4,280,000', previous: 'KES 3,950,000', variance: '+330,000', pct: '+8.4%', positive: true },
    { description: 'Interest on Loans', current: 'KES 3,120,000', previous: 'KES 2,890,000', variance: '+230,000', pct: '+8.0%', positive: true },
    { description: 'Fees & Charges', current: 'KES 480,000', previous: 'KES 440,000', variance: '+40,000', pct: '+9.1%', positive: true },
    { description: 'Total Expenses', current: 'KES 2,150,000', previous: 'KES 2,080,000', variance: '+70,000', pct: '+3.4%', positive: false },
    { description: 'Net Surplus', current: 'KES 2,130,000', previous: 'KES 1,870,000', variance: '+260,000', pct: '+13.9%', positive: true },
  ];

  // ────────── MODAL STATE SIGNALS ──────────
  showScheduledModal   = signal(false);
  showHistoryModal     = signal(false);
  showCustomBuilder    = signal(false);
  showNewSchedule      = signal(false);
  showEditSchedule     = signal<ScheduledReport | null>(null);
  showDeleteSchedule   = signal<ScheduledReport | null>(null);
  showGenerateReport   = signal<ReportItem | null>(null);
  showReportPreview    = signal<ReportItem | null>(null);
  showGeneratedDetail  = signal<GeneratedReport | null>(null);
  showHistoryDetail    = signal<HistoryRecord | null>(null);
  showEmailReport      = signal<GeneratedReport | null>(null);
  showDeleteReport     = signal<GeneratedReport | null>(null);
  showGroupDetail      = signal<ReportGroup | null>(null);
  showViewAllGenerated = signal(false);
  showEmailSchedule    = signal<ScheduledReport | null>(null);
  showPauseSchedule    = signal<ScheduledReport | null>(null);

  // Report generation options
  reportOptions = signal({
    period: 'This Month (December 2024)',
    format: 'PDF Report',
    includeHeader: true,
    includeComparison: true,
    includeCharts: false,
    includeSignatures: false,
  });

  // Custom report builder state
  customReport = signal({
    name: '',
    dataSource: 'Financial Data',
    period: 'This Month',
    groupBy: 'None',
    sortBy: 'Member Name (A-Z)',
    format: 'PDF',
    filter: 'All Members',
    fields: [...this.CUSTOM_FIELDS],
  });

  // New schedule form
  newScheduleForm = signal({
    reportName: '',
    frequency: 'Weekly',
    time: '08:00',
    recipients: '',
    format: 'PDF',
    paused: false,
  });

  // Edit schedule form
  editScheduleForm = signal({
    frequency: 'Weekly',
    time: '05:00',
    recipients: '',
    paused: false,
  });

  // Email form
  emailForm = signal({
    to: '',
    subject: '',
    message: 'Please find the attached report generated by SACCOPay Reports Center.',
  });

  // Search & filter
  searchQuery = signal('');
  historyFilter = signal('All');
  historyPage = signal(1);
  readonly HIST_PAGE_SIZE = 6;

  // Preview shown inside generate modal
  showPreviewInModal = signal(false);

  // ────────── COMPUTED ──────────
  filteredHistory = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const f = this.historyFilter();
    return this.HISTORY_RECORDS.filter(r => {
      const matchQ = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
      const matchF = f === 'All' || r.category === f;
      return matchQ && matchF;
    });
  });

  historyTotalPages = computed(() => Math.max(1, Math.ceil(this.filteredHistory().length / this.HIST_PAGE_SIZE)));

  paginatedHistory = computed(() => {
    const p = this.historyPage();
    return this.filteredHistory().slice((p - 1) * this.HIST_PAGE_SIZE, p * this.HIST_PAGE_SIZE);
  });

  historyPageNumbers = computed(() => Array.from({ length: this.historyTotalPages() }, (_, i) => i + 1));

  selectedFieldCount = computed(() => this.customReport().fields.filter(f => f.selected).length);

  allScheduledData = computed(() => this.SCHEDULED_REPORTS);

  // ────────── TOAST (sparingly used) ──────────
  toast = signal<{ msg: string; type: 'success' | 'error' } | null>(null);
  private toastTimer: any;
  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ msg, type });
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 4000);
  }

  // ────────── ACTIONS ──────────
  openScheduledModal()   { this.showScheduledModal.set(true); }
  closeScheduledModal()  { this.showScheduledModal.set(false); }
  openHistoryModal()     { this.showHistoryModal.set(true); this.historyPage.set(1); }
  closeHistoryModal()    { this.showHistoryModal.set(false); }
  openCustomBuilder()    { this.showCustomBuilder.set(true); }
  closeCustomBuilder()   { this.showCustomBuilder.set(false); }
  openNewSchedule()      { this.showNewSchedule.set(true); }
  closeNewSchedule()     { this.showNewSchedule.set(false); }

  openEditSchedule(s: ScheduledReport) {
    this.editScheduleForm.set({ frequency: s.frequency, time: '05:00', recipients: s.recipients, paused: false });
    this.showEditSchedule.set(s);
  }
  closeEditSchedule() { this.showEditSchedule.set(null); }

  openDeleteSchedule(s: ScheduledReport) { this.showDeleteSchedule.set(s); }
  closeDeleteSchedule() { this.showDeleteSchedule.set(null); }

  openGenerateReport(r: ReportItem) {
    this.showPreviewInModal.set(false);
    this.showGenerateReport.set(r);
  }
  closeGenerateReport() { this.showGenerateReport.set(null); }

  openGroupDetail(g: ReportGroup) { this.showGroupDetail.set(g); }
  closeGroupDetail() { this.showGroupDetail.set(null); }

  openGeneratedDetail(r: GeneratedReport) { this.showGeneratedDetail.set(r); }
  closeGeneratedDetail() { this.showGeneratedDetail.set(null); }

  openHistoryDetail(r: HistoryRecord) { this.showHistoryDetail.set(r); }
  closeHistoryDetail() { this.showHistoryDetail.set(null); }

  openEmailReport(r: GeneratedReport) {
    this.emailForm.set({ to: 'board@rongosacco.co.ke', subject: r.name + ' — Rongo SACCO', message: 'Please find the attached report generated by SACCOPay Reports Center.' });
    this.showEmailReport.set(r);
  }
  closeEmailReport() { this.showEmailReport.set(null); }

  openDeleteReport(r: GeneratedReport) { this.showDeleteReport.set(r); }
  closeDeleteReport() { this.showDeleteReport.set(null); }

  openViewAllGenerated() { this.showViewAllGenerated.set(true); }
  closeViewAllGenerated() { this.showViewAllGenerated.set(false); }

  openEmailSchedule(s: ScheduledReport) {
    this.emailForm.set({ to: s.recipients, subject: 'Scheduled Report: ' + s.name, message: 'This is the scheduled report as per your subscription.' });
    this.showEmailSchedule.set(s);
  }
  closeEmailSchedule() { this.showEmailSchedule.set(null); }

  openPauseSchedule(s: ScheduledReport) { this.showPauseSchedule.set(s); }
  closePauseSchedule() { this.showPauseSchedule.set(null); }

  // Form helpers
  onInput(form: 'newSchedule' | 'editSchedule' | 'email' | 'options', key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    if (form === 'newSchedule') this.newScheduleForm.update(f => ({ ...f, [key]: v }));
    if (form === 'editSchedule') this.editScheduleForm.update(f => ({ ...f, [key]: v }));
    if (form === 'email') this.emailForm.update(f => ({ ...f, [key]: v }));
    if (form === 'options') this.reportOptions.update(f => ({ ...f, [key]: v }));
  }

  onCheckInput(form: 'newSchedule' | 'editSchedule', key: string, e: Event) {
    const v = (e.target as HTMLInputElement).checked;
    if (form === 'newSchedule') this.newScheduleForm.update(f => ({ ...f, [key]: v }));
    if (form === 'editSchedule') this.editScheduleForm.update(f => ({ ...f, [key]: v }));
  }

  onOptionCheck(key: string, e: Event) {
    const v = (e.target as HTMLInputElement).checked;
    this.reportOptions.update(f => ({ ...f, [key]: v }));
  }

  onCustomInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLSelectElement).value;
    this.customReport.update(f => ({ ...f, [key]: v }));
  }

  toggleField(idx: number) {
    this.customReport.update(cr => {
      const fields = [...cr.fields];
      fields[idx] = { ...fields[idx], selected: !fields[idx].selected };
      return { ...cr, fields };
    });
  }

  setHistoryFilter(f: string) { this.historyFilter.set(f); this.historyPage.set(1); }
  setHistoryPage(p: number) { if (p >= 1 && p <= this.historyTotalPages()) this.historyPage.set(p); }

  onSearchInput(e: Event) { this.searchQuery.set((e.target as HTMLInputElement).value); }

  // Submit actions
  submitNewSchedule() {
    if (!this.newScheduleForm().reportName) return;
    this.closeNewSchedule();
    this.showToast('Schedule created successfully.', 'success');
  }

  submitEditSchedule() {
    this.closeEditSchedule();
    this.showToast('Schedule updated.', 'success');
  }

  confirmDeleteSchedule() {
    this.closeDeleteSchedule();
    this.showToast('Schedule deleted.', 'success');
  }

  confirmDeleteReport() {
    this.closeDeleteReport();
    this.showToast('Report deleted.', 'success');
  }

  generateAndDownload() {
    this.closeGenerateReport();
    this.showToast('Report generated and downloading…', 'success');
  }

  generateCustom(asPreview = false) {
    if (asPreview) { this.showPreviewInModal.set(true); return; }
    this.closeCustomBuilder();
    this.showToast('Custom report generated successfully.', 'success');
  }

  sendEmail() {
    if (!this.emailForm().to) return;
    this.closeEmailReport();
    this.closeEmailSchedule();
    this.showToast('Report emailed successfully.', 'success');
  }

  confirmPauseSchedule() {
    this.closePauseSchedule();
    this.showToast('Schedule paused.', 'success');
  }

  // Helpers
  format(n: number) { return n.toLocaleString(); }
  trackById(_: number, item: { id: string }) { return item.id; }
  trackByIndex(i: number) { return i; }

  freqColor(freq: string): string {
    return { Daily: '#00d084', Weekly: '#2196f3', Monthly: '#9c27b0', Quarterly: '#ff9800' }[freq] || '#64748b';
  }

  formatIcon(fmt: string): string {
    return { PDF: '📄', Excel: '📊', CSV: '📋' }[fmt] || '📄';
  }

  catColors: Record<string, string> = {
    Financial: '#00d084', Loan: '#2196f3', Savings: '#4caf50',
    Member: '#ff9800', Compliance: '#f44336', Operational: '#9c27b0',
  };
}
