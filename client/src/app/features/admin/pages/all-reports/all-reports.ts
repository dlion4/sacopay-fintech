import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

/* ══════════════════════════════════════════════════════════════════════════
  INTERFACES
══════════════════════════════════════════════════════════════════════════ */

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  category: string;
  lastGenerated: string;
  downloadCount: number;
}

interface FinancialReport {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  format: string;
  frequency: string;
}

interface LoanReport {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  formats: string[];
  lastGenerated: string;
  selectedPeriod: string;
}

interface MemberReportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  reportCount: number;
}

interface RegulatoryReport {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  authority: string;
  frequency: string;
  dueDate: string;
  lastSubmitted: string;
  urgency: string;
  urgencyClass: string;
  isDuesSoon: boolean;
}

interface RecentReport {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  category: string;
  generatedBy: string;
  generatedByInitials: string;
  generatedAt: string;
  format: string;
  size: string;
  status: string;
  statusLabel: string;
}

interface CustomReportType {
  value: string;
  label: string;
  icon: string;
}

interface DataSource {
  value: string;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
}

interface ReportField {
  id: string;
  label: string;
  type: string;
}

interface SavedCustomReport {
  id: string;
  name: string;
  lastGenerated: string;
  format: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: string;
  nextRun: string;
  recipients: string;
  active: boolean;
}

interface CustomReportConfig {
  type: string;
  dateFrom: string;
  dateTo: string;
  memberCategory: string;
  transactionType: string;
  amountMin: number | null;
  amountMax: number | null;
  name: string;
  formatPDF: boolean;
  formatExcel: boolean;
  formatCSV: boolean;
  groupBy: string;
  sortBy: string;
}

/* ══════════════════════════════════════════════════════════════════════════
  COMPONENT
══════════════════════════════════════════════════════════════════════════ */

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-reports.html',
  styleUrl: './all-reports.scss'
})
export class ReportsComponent implements OnInit, OnDestroy {

  /* ──────────────────────────────────────────────────────────────────────
    STATE MANAGEMENT
  ────────────────────────────────────────────────────────────────────── */

  // Quick Stats
  totalReportsGenerated = 156;
  scheduledReportsCount = 12;
  totalDownloads = 847;
  storageUsed = '2.4 GB';
  storageTotal = '10 GB';

  // Tab State
  activeReportTab: 'all' | 'financial' | 'loans' | 'members' | 'regulatory' | 'custom' = 'all';

  // Search & Filter State
  searchQuery = '';
  filterCategory = 'all';
  filterPeriod = 'all';

  // Modal States
  showGenerateReportModal = false;
  showScheduledReportsModal = false;

  // Generate Report Modal State
  selectedReportTemplate = '';
  reportPeriod = 'month';
  customReportDateFrom = '';
  customReportDateTo = '';
  outputFormatPDF = true;
  outputFormatExcel = false;
  outputFormatCSV = false;
  emailReportAfterGeneration = false;
  reportEmailAddress = '';

  // Custom Report Builder State
  customReportConfig: CustomReportConfig = {
    type: '',
    dateFrom: '',
    dateTo: '',
    memberCategory: 'all',
    transactionType: 'all',
    amountMin: null,
    amountMax: null,
    name: '',
    formatPDF: true,
    formatExcel: false,
    formatCSV: false,
    groupBy: '',
    sortBy: 'date_desc'
  };

  // Period Options
  periodOptions = [
    'Today',
    'This Week',
    'This Month',
    'Last Month',
    'This Quarter',
    'Last Quarter',
    'This Year',
    'Custom'
  ];

  // Toast State
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'info' | 'warning' | 'danger' = 'success';
  toastTimer: any;

  /* ──────────────────────────────────────────────────────────────────────
    REPORT TEMPLATES DATA
  ────────────────────────────────────────────────────────────────────── */

  reportTemplates: ReportTemplate[] = [
    {
      id: 'rt-001',
      title: 'Balance Sheet',
      description: 'Complete statement of financial position with assets, liabilities, and equity breakdown.',
      icon: 'bi-file-earmark-spreadsheet',
      iconColor: 'linear-gradient(135deg, #28a745, #20c997)',
      category: 'financial',
      lastGenerated: '2 hours ago',
      downloadCount: 124
    },
    {
      id: 'rt-002',
      title: 'Income Statement',
      description: 'Comprehensive income and expenditure report with detailed revenue and cost analysis.',
      icon: 'bi-file-earmark-bar-graph',
      iconColor: 'linear-gradient(135deg, #007bff, #0056b3)',
      category: 'financial',
      lastGenerated: '1 day ago',
      downloadCount: 98
    },
    {
      id: 'rt-003',
      title: 'Loan Portfolio Report',
      description: 'Detailed breakdown of all active loans by type, status, and performance metrics.',
      icon: 'bi-wallet2',
      iconColor: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      category: 'loans',
      lastGenerated: '4 hours ago',
      downloadCount: 156
    },
    {
      id: 'rt-004',
      title: 'Member Statement',
      description: 'Individual or bulk member account statements with full transaction history.',
      icon: 'bi-person-badge',
      iconColor: 'linear-gradient(135deg, #6610f2, #520dc2)',
      category: 'members',
      lastGenerated: '3 hours ago',
      downloadCount: 342
    },
    {
      id: 'rt-005',
      title: 'Cash Flow Statement',
      description: 'Cash inflows and outflows with liquidity analysis and projections.',
      icon: 'bi-cash-coin',
      iconColor: 'linear-gradient(135deg, #17a2b8, #138496)',
      category: 'financial',
      lastGenerated: '1 day ago',
      downloadCount: 67
    },
    {
      id: 'rt-006',
      title: 'Loan Aging Analysis',
      description: 'Portfolio aging report showing overdue loans by bracket with PAR analysis.',
      icon: 'bi-clock-history',
      iconColor: 'linear-gradient(135deg, #dc3545, #c82333)',
      category: 'loans',
      lastGenerated: '6 hours ago',
      downloadCount: 89
    },
    {
      id: 'rt-007',
      title: 'SASRA Returns',
      description: 'Regulatory returns for SASRA compliance including all required data filings.',
      icon: 'bi-shield-check',
      iconColor: 'linear-gradient(135deg, #28a745, #155724)',
      category: 'regulatory',
      lastGenerated: '7 days ago',
      downloadCount: 24
    },
    {
      id: 'rt-008',
      title: 'Membership Register',
      description: 'Complete member directory with demographics, shares, and activity status.',
      icon: 'bi-people',
      iconColor: 'linear-gradient(135deg, #007bff, #6610f2)',
      category: 'members',
      lastGenerated: '2 days ago',
      downloadCount: 56
    },
    {
      id: 'rt-009',
      title: 'Disbursement Report',
      description: 'All loan disbursements with approval details and channel breakdown.',
      icon: 'bi-cash-stack',
      iconColor: 'linear-gradient(135deg, #fd7e14, #e83e8c)',
      category: 'loans',
      lastGenerated: '1 hour ago',
      downloadCount: 112
    },
    {
      id: 'rt-010',
      title: 'Trial Balance',
      description: 'Chart of accounts trial balance with debit and credit totals.',
      icon: 'bi-calculator',
      iconColor: 'linear-gradient(135deg, #495057, #212529)',
      category: 'financial',
      lastGenerated: '5 hours ago',
      downloadCount: 45
    },
    {
      id: 'rt-011',
      title: 'KRA Tax Returns',
      description: 'Kenya Revenue Authority tax filing with withholding tax and VAT computations.',
      icon: 'bi-building',
      iconColor: 'linear-gradient(135deg, #dc3545, #6f0000)',
      category: 'regulatory',
      lastGenerated: '15 days ago',
      downloadCount: 18
    },
    {
      id: 'rt-012',
      title: 'Contribution Summary',
      description: 'Member savings contributions analysis with trends and projections.',
      icon: 'bi-piggy-bank',
      iconColor: 'linear-gradient(135deg, #20c997, #17a2b8)',
      category: 'members',
      lastGenerated: '1 day ago',
      downloadCount: 78
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    FINANCIAL REPORTS DATA
  ────────────────────────────────────────────────────────────────────── */

  financialReports: FinancialReport[] = [
    {
      id: 'fr-001',
      name: 'Balance Sheet',
      description: 'Statement of financial position',
      icon: 'bi-file-earmark-spreadsheet',
      color: 'linear-gradient(135deg, #28a745, #20c997)',
      format: 'PDF / Excel',
      frequency: 'Monthly'
    },
    {
      id: 'fr-002',
      name: 'Income & Expenditure',
      description: 'Revenue and cost analysis',
      icon: 'bi-file-earmark-bar-graph',
      color: 'linear-gradient(135deg, #007bff, #0056b3)',
      format: 'PDF / Excel',
      frequency: 'Monthly'
    },
    {
      id: 'fr-003',
      name: 'Cash Flow Statement',
      description: 'Cash inflows and outflows',
      icon: 'bi-cash-coin',
      color: 'linear-gradient(135deg, #17a2b8, #138496)',
      format: 'PDF',
      frequency: 'Monthly'
    },
    {
      id: 'fr-004',
      name: 'Trial Balance',
      description: 'Chart of accounts summary',
      icon: 'bi-calculator',
      color: 'linear-gradient(135deg, #6610f2, #520dc2)',
      format: 'Excel / CSV',
      frequency: 'Monthly'
    },
    {
      id: 'fr-005',
      name: 'General Ledger',
      description: 'Detailed journal entries',
      icon: 'bi-journal-text',
      color: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      format: 'Excel',
      frequency: 'On Demand'
    },
    {
      id: 'fr-006',
      name: 'Budget vs Actuals',
      description: 'Budget variance analysis',
      icon: 'bi-bar-chart-line',
      color: 'linear-gradient(135deg, #e83e8c, #c2185b)',
      format: 'PDF / Excel',
      frequency: 'Quarterly'
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    LOAN REPORTS DATA
  ────────────────────────────────────────────────────────────────────── */

  loanReports: LoanReport[] = [
    {
      id: 'lr-001',
      name: 'Portfolio Summary',
      description: 'Overview of active loan portfolio with key metrics',
      icon: 'bi-wallet2',
      color: '#007bff',
      formats: ['PDF', 'Excel'],
      lastGenerated: 'Today, 10:30 AM',
      selectedPeriod: 'This Month'
    },
    {
      id: 'lr-002',
      name: 'Disbursement Report',
      description: 'All loan disbursements with approval history',
      icon: 'bi-cash-stack',
      color: '#28a745',
      formats: ['PDF', 'Excel', 'CSV'],
      lastGenerated: 'Today, 8:15 AM',
      selectedPeriod: 'This Month'
    },
    {
      id: 'lr-003',
      name: 'Repayment Schedule',
      description: 'Expected vs actual repayment tracking',
      icon: 'bi-calendar-check',
      color: '#17a2b8',
      formats: ['PDF', 'Excel'],
      lastGenerated: 'Yesterday',
      selectedPeriod: 'This Month'
    },
    {
      id: 'lr-004',
      name: 'Arrears Report',
      description: 'All overdue loans with aging analysis',
      icon: 'bi-exclamation-triangle',
      color: '#dc3545',
      formats: ['PDF', 'Excel'],
      lastGenerated: 'Today, 9:00 AM',
      selectedPeriod: 'This Month'
    },
    {
      id: 'lr-005',
      name: 'Aging Analysis',
      description: 'Portfolio at risk breakdown by age bracket',
      icon: 'bi-clock-history',
      color: '#ffc107',
      formats: ['PDF', 'Excel'],
      lastGenerated: 'Today, 7:30 AM',
      selectedPeriod: 'This Month'
    },
    {
      id: 'lr-006',
      name: 'Guarantor Report',
      description: 'Guarantor exposure and liability analysis',
      icon: 'bi-people',
      color: '#6610f2',
      formats: ['PDF', 'Excel'],
      lastGenerated: '2 days ago',
      selectedPeriod: 'This Month'
    },
    {
      id: 'lr-007',
      name: 'Interest Income Report',
      description: 'Interest earned on loan portfolio',
      icon: 'bi-percent',
      color: '#fd7e14',
      formats: ['PDF', 'Excel', 'CSV'],
      lastGenerated: 'Yesterday',
      selectedPeriod: 'This Month'
    },
    {
      id: 'lr-008',
      name: 'Write-Off Report',
      description: 'Loans written off or provisioned',
      icon: 'bi-x-circle',
      color: '#e83e8c',
      formats: ['PDF'],
      lastGenerated: 'Last week',
      selectedPeriod: 'This Quarter'
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    MEMBER REPORT CATEGORIES DATA
  ────────────────────────────────────────────────────────────────────── */

  memberReportCategories: MemberReportCategory[] = [
    {
      id: 'mc-001',
      name: 'Registration & KYC',
      description: 'Member registration, KYC compliance, and documentation',
      icon: 'bi-person-vcard',
      color: 'linear-gradient(135deg, #007bff, #0056b3)',
      reportCount: 6
    },
    {
      id: 'mc-002',
      name: 'Savings & Deposits',
      description: 'Individual and aggregate savings, contributions, and deposits',
      icon: 'bi-piggy-bank',
      color: 'linear-gradient(135deg, #28a745, #20c997)',
      reportCount: 8
    },
    {
      id: 'mc-003',
      name: 'Shares & Equity',
      description: 'Share capital, dividends, and member equity positions',
      icon: 'bi-graph-up-arrow',
      color: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      reportCount: 4
    },
    {
      id: 'mc-004',
      name: 'Demographics & Analytics',
      description: 'Member demographics, age, gender, and geographic analysis',
      icon: 'bi-bar-chart',
      color: 'linear-gradient(135deg, #6610f2, #520dc2)',
      reportCount: 5
    },
    {
      id: 'mc-005',
      name: 'Activity & Engagement',
      description: 'Transaction frequency, app usage, and engagement metrics',
      icon: 'bi-activity',
      color: 'linear-gradient(135deg, #17a2b8, #138496)',
      reportCount: 4
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    REGULATORY REPORTS DATA
  ────────────────────────────────────────────────────────────────────── */

  regulatoryReports: RegulatoryReport[] = [
    {
      id: 'rr-001',
      name: 'SASRA Monthly Returns',
      description: 'Monthly regulatory returns including financial statements, loan portfolio quality, and liquidity ratios.',
      icon: 'bi-shield-check',
      color: 'linear-gradient(135deg, #28a745, #155724)',
      authority: 'SASRA',
      frequency: 'Monthly',
      dueDate: 'Dec 15, 2024',
      lastSubmitted: 'Nov 12, 2024',
      urgency: 'Upcoming',
      urgencyClass: 'badge-upcoming',
      isDuesSoon: true
    },
    {
      id: 'rr-002',
      name: 'KRA Tax Returns',
      description: 'Withholding tax on interest income, VAT returns, and annual income tax filing.',
      icon: 'bi-building',
      color: 'linear-gradient(135deg, #dc3545, #6f0000)',
      authority: 'KRA',
      frequency: 'Monthly / Annual',
      dueDate: 'Dec 20, 2024',
      lastSubmitted: 'Nov 18, 2024',
      urgency: 'Normal',
      urgencyClass: 'badge-normal',
      isDuesSoon: false
    },
    {
      id: 'rr-003',
      name: 'AML/CFT Report',
      description: 'Anti-money laundering compliance report including suspicious transaction reports (STRs).',
      icon: 'bi-shield-exclamation',
      color: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      authority: 'FRC',
      frequency: 'Quarterly',
      dueDate: 'Dec 31, 2024',
      lastSubmitted: 'Sep 28, 2024',
      urgency: 'Normal',
      urgencyClass: 'badge-normal',
      isDuesSoon: false
    },
    {
      id: 'rr-004',
      name: 'Annual Audited Accounts',
      description: 'Audited financial statements including auditor\'s report and management letter.',
      icon: 'bi-file-earmark-check',
      color: 'linear-gradient(135deg, #007bff, #0056b3)',
      authority: 'SASRA / Commissioner',
      frequency: 'Annual',
      dueDate: 'Mar 31, 2025',
      lastSubmitted: 'Mar 25, 2024',
      urgency: 'Normal',
      urgencyClass: 'badge-normal',
      isDuesSoon: false
    },
    {
      id: 'rr-005',
      name: 'Liquidity Report',
      description: 'Liquidity ratio compliance report showing liquid assets vs short-term liabilities.',
      icon: 'bi-droplet',
      color: 'linear-gradient(135deg, #17a2b8, #138496)',
      authority: 'SASRA',
      frequency: 'Monthly',
      dueDate: 'Dec 10, 2024',
      lastSubmitted: 'Nov 8, 2024',
      urgency: 'Urgent',
      urgencyClass: 'badge-urgent',
      isDuesSoon: true
    },
    {
      id: 'rr-006',
      name: 'Credit Reference Bureau',
      description: 'CRB data submission for all active borrowers with repayment performance data.',
      icon: 'bi-database-check',
      color: 'linear-gradient(135deg, #6610f2, #520dc2)',
      authority: 'CRB',
      frequency: 'Monthly',
      dueDate: 'Dec 5, 2024',
      lastSubmitted: 'Nov 3, 2024',
      urgency: 'Urgent',
      urgencyClass: 'badge-urgent',
      isDuesSoon: true
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    RECENT REPORTS DATA
  ────────────────────────────────────────────────────────────────────── */

  recentReports: RecentReport[] = [
    {
      id: 'rh-001',
      name: 'Balance Sheet - November 2024',
      icon: 'bi-file-earmark-spreadsheet',
      iconColor: '#28a745',
      category: 'financial',
      generatedBy: 'Admin User',
      generatedByInitials: 'AU',
      generatedAt: 'Dec 1, 2024 10:30 AM',
      format: 'PDF',
      size: '2.4 MB',
      status: 'completed',
      statusLabel: 'Completed'
    },
    {
      id: 'rh-002',
      name: 'Loan Portfolio Report',
      icon: 'bi-wallet2',
      iconColor: '#ffc107',
      category: 'loans',
      generatedBy: 'James Kariuki',
      generatedByInitials: 'JK',
      generatedAt: 'Dec 1, 2024 9:15 AM',
      format: 'Excel',
      size: '1.8 MB',
      status: 'completed',
      statusLabel: 'Completed'
    },
    {
      id: 'rh-003',
      name: 'Member Statement - Bulk',
      icon: 'bi-person-badge',
      iconColor: '#6610f2',
      category: 'members',
      generatedBy: 'Admin User',
      generatedByInitials: 'AU',
      generatedAt: 'Dec 1, 2024 8:00 AM',
      format: 'PDF',
      size: '15.2 MB',
      status: 'processing',
      statusLabel: 'Processing'
    },
    {
      id: 'rh-004',
      name: 'SASRA Monthly Returns',
      icon: 'bi-shield-check',
      iconColor: '#28a745',
      category: 'regulatory',
      generatedBy: 'Mary Wanjiku',
      generatedByInitials: 'MW',
      generatedAt: 'Nov 30, 2024 4:45 PM',
      format: 'PDF',
      size: '3.1 MB',
      status: 'completed',
      statusLabel: 'Completed'
    },
    {
      id: 'rh-005',
      name: 'Cash Flow Statement',
      icon: 'bi-cash-coin',
      iconColor: '#17a2b8',
      category: 'financial',
      generatedBy: 'Admin User',
      generatedByInitials: 'AU',
      generatedAt: 'Nov 30, 2024 2:30 PM',
      format: 'Excel',
      size: '890 KB',
      status: 'completed',
      statusLabel: 'Completed'
    },
    {
      id: 'rh-006',
      name: 'Arrears Report',
      icon: 'bi-exclamation-triangle',
      iconColor: '#dc3545',
      category: 'loans',
      generatedBy: 'Peter Omondi',
      generatedByInitials: 'PO',
      generatedAt: 'Nov 30, 2024 11:20 AM',
      format: 'PDF',
      size: '1.2 MB',
      status: 'completed',
      statusLabel: 'Completed'
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    CUSTOM REPORT BUILDER DATA
  ────────────────────────────────────────────────────────────────────── */

  customReportTypes: CustomReportType[] = [
    { value: 'tabular', label: 'Tabular Report', icon: 'bi-table' },
    { value: 'summary', label: 'Summary Report', icon: 'bi-card-list' },
    { value: 'chart', label: 'Chart Report', icon: 'bi-bar-chart' },
    { value: 'detailed', label: 'Detailed Report', icon: 'bi-file-text' },
    { value: 'comparison', label: 'Comparison Report', icon: 'bi-arrow-left-right' }
  ];

  dataSources: DataSource[] = [
    { value: 'members', label: 'Members', description: 'Member profiles and demographics', icon: 'bi-people', selected: false },
    { value: 'savings', label: 'Savings', description: 'All savings accounts and deposits', icon: 'bi-piggy-bank', selected: false },
    { value: 'loans', label: 'Loans', description: 'Loan applications and portfolio', icon: 'bi-wallet2', selected: false },
    { value: 'transactions', label: 'Transactions', description: 'All financial transactions', icon: 'bi-arrow-left-right', selected: false },
    { value: 'shares', label: 'Shares', description: 'Share capital and dividends', icon: 'bi-graph-up-arrow', selected: false },
    { value: 'accounting', label: 'Accounting', description: 'General ledger and journals', icon: 'bi-journal-text', selected: false }
  ];

  availableFields: ReportField[] = [
    { id: 'f-001', label: 'Member Name', type: 'text' },
    { id: 'f-002', label: 'Member ID', type: 'text' },
    { id: 'f-003', label: 'Account Number', type: 'text' },
    { id: 'f-004', label: 'Transaction Date', type: 'date' },
    { id: 'f-005', label: 'Transaction Type', type: 'text' },
    { id: 'f-006', label: 'Amount', type: 'number' },
    { id: 'f-007', label: 'Balance', type: 'number' },
    { id: 'f-008', label: 'Channel', type: 'text' },
    { id: 'f-009', label: 'Reference', type: 'text' },
    { id: 'f-010', label: 'Status', type: 'text' },
    { id: 'f-011', label: 'Phone Number', type: 'text' },
    { id: 'f-012', label: 'Email', type: 'text' },
    { id: 'f-013', label: 'Branch', type: 'text' },
    { id: 'f-014', label: 'Loan Type', type: 'text' },
    { id: 'f-015', label: 'Interest Rate', type: 'number' },
    { id: 'f-016', label: 'Loan Term', type: 'number' },
    { id: 'f-017', label: 'Repayment Amount', type: 'number' },
    { id: 'f-018', label: 'Outstanding Balance', type: 'number' }
  ];

  selectedFields: ReportField[] = [];

  savedCustomReports: SavedCustomReport[] = [
    {
      id: 'sc-001',
      name: 'Monthly Active Members Summary',
      lastGenerated: 'Nov 30, 2024',
      format: 'PDF, Excel'
    },
    {
      id: 'sc-002',
      name: 'High-Value Transaction Report',
      lastGenerated: 'Nov 28, 2024',
      format: 'Excel'
    },
    {
      id: 'sc-003',
      name: 'Dormant Accounts Analysis',
      lastGenerated: 'Nov 25, 2024',
      format: 'PDF'
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    SCHEDULED REPORTS DATA
  ────────────────────────────────────────────────────────────────────── */

  scheduledReportsList: ScheduledReport[] = [
    {
      id: 'sr-001',
      name: 'Daily Transaction Summary',
      description: 'Auto-generated summary of all transactions',
      icon: 'bi-arrow-left-right',
      color: 'linear-gradient(135deg, #28a745, #20c997)',
      frequency: 'Daily at 11:00 PM',
      nextRun: 'Today, 11:00 PM',
      recipients: 'admin@sacco.com',
      active: true
    },
    {
      id: 'sr-002',
      name: 'Weekly Loan Portfolio Report',
      description: 'Weekly overview of loan performance',
      icon: 'bi-wallet2',
      color: 'linear-gradient(135deg, #007bff, #0056b3)',
      frequency: 'Every Monday at 7:00 AM',
      nextRun: 'Next Monday, 7:00 AM',
      recipients: 'admin@sacco.com, manager@sacco.com',
      active: true
    },
    {
      id: 'sr-003',
      name: 'Monthly Financial Statements',
      description: 'Balance Sheet, P&L, and Cash Flow',
      icon: 'bi-file-earmark-bar-graph',
      color: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      frequency: '1st of every month at 6:00 AM',
      nextRun: 'Jan 1, 2025, 6:00 AM',
      recipients: 'board@sacco.com',
      active: true
    },
    {
      id: 'sr-004',
      name: 'SASRA Regulatory Returns',
      description: 'Monthly SASRA compliance returns',
      icon: 'bi-shield-check',
      color: 'linear-gradient(135deg, #dc3545, #c82333)',
      frequency: '10th of every month',
      nextRun: 'Dec 10, 2024',
      recipients: 'compliance@sacco.com',
      active: true
    },
    {
      id: 'sr-005',
      name: 'Dormant Account Alert',
      description: 'Weekly report on inactive accounts',
      icon: 'bi-person-dash',
      color: 'linear-gradient(135deg, #6c757d, #495057)',
      frequency: 'Every Friday at 9:00 AM',
      nextRun: 'This Friday, 9:00 AM',
      recipients: 'admin@sacco.com',
      active: false
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    CONSTRUCTOR & LIFECYCLE
  ────────────────────────────────────────────────────────────────────── */

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Reports page initialized');
    this.initializeDates();
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  initializeDates(): void {
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.customReportDateFrom = this.formatDate(firstOfMonth);
    this.customReportDateTo = this.formatDate(today);
    this.customReportConfig.dateFrom = this.formatDate(firstOfMonth);
    this.customReportConfig.dateTo = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /* ══════════════════════════════════════════════════════════════════════
    COMPUTED PROPERTIES
  ══════════════════════════════════════════════════════════════════════ */

  get filteredReportTemplates(): ReportTemplate[] {
    let result = [...this.reportTemplates];

    if (this.filterCategory !== 'all') {
      result = result.filter(r => r.category === this.filterCategory);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }

    return result;
  }

  /* ══════════════════════════════════════════════════════════════════════
    MODAL MANAGEMENT
  ══════════════════════════════════════════════════════════════════════ */

  openGenerateReportModal(): void {
    this.showGenerateReportModal = true;
  }

  closeGenerateReportModal(): void {
    this.showGenerateReportModal = false;
  }

  openScheduledReports(): void {
    this.showScheduledReportsModal = true;
  }

  closeScheduledReportsModal(): void {
    this.showScheduledReportsModal = false;
  }

  /* ══════════════════════════════════════════════════════════════════════
    REPORT GENERATION
  ══════════════════════════════════════════════════════════════════════ */

  previewReport(report: ReportTemplate): void {
    this.showToast(`Previewing: ${report.title}`, 'info');
  }

  generateReport(report: ReportTemplate): void {
    this.showToast(`Generating: ${report.title}...`, 'info');
    setTimeout(() => {
      this.totalReportsGenerated++;
      this.showToast(`${report.title} generated successfully!`, 'success');
    }, 1500);
  }

  confirmGenerateReport(): void {
    if (!this.selectedReportTemplate) {
      this.showToast('Please select a report template', 'warning');
      return;
    }

    this.closeGenerateReportModal();
    this.showToast('Generating report...', 'info');

    setTimeout(() => {
      this.totalReportsGenerated++;
      this.showToast('Report generated successfully!', 'success');

      if (this.emailReportAfterGeneration && this.reportEmailAddress) {
        this.showToast(`Report emailed to ${this.reportEmailAddress}`, 'success');
      }
    }, 2000);
  }

  /* ══════════════════════════════════════════════════════════════════════
    FINANCIAL REPORT ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  quickGenerate(report: FinancialReport): void {
    this.showToast(`Quick generating: ${report.name}...`, 'info');
    setTimeout(() => {
      this.showToast(`${report.name} ready for download!`, 'success');
    }, 1500);
  }

  scheduleReport(report: FinancialReport): void {
    this.showToast(`Setting up schedule for: ${report.name}`, 'info');
  }

  configureReport(report: FinancialReport): void {
    this.showToast(`Opening configuration for: ${report.name}`, 'info');
  }

  generateBalanceSheet(): void {
    this.showToast('Generating Balance Sheet...', 'info');
    setTimeout(() => this.showToast('Balance Sheet generated!', 'success'), 1500);
  }

  generateIncomeStatement(): void {
    this.showToast('Generating Income Statement...', 'info');
    setTimeout(() => this.showToast('Income Statement generated!', 'success'), 1500);
  }

  generateCashFlow(): void {
    this.showToast('Generating Cash Flow Statement...', 'info');
    setTimeout(() => this.showToast('Cash Flow Statement generated!', 'success'), 1500);
  }

  generateTrialBalance(): void {
    this.showToast('Generating Trial Balance...', 'info');
    setTimeout(() => this.showToast('Trial Balance generated!', 'success'), 1500);
  }

  openBulkGenerate(category: string): void {
    this.showToast(`Bulk generate: ${category} reports`, 'info');
  }

  /* ══════════════════════════════════════════════════════════════════════
    LOAN REPORT ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  generatePortfolioReport(): void {
    this.showToast('Generating Portfolio Report...', 'info');
    setTimeout(() => this.showToast('Portfolio Report generated!', 'success'), 1500);
  }

  generatePerformanceReport(): void {
    this.showToast('Generating Performance Report...', 'info');
    setTimeout(() => this.showToast('Performance Report generated!', 'success'), 1500);
  }

  generateArrearsReport(): void {
    this.showToast('Generating Arrears Report...', 'info');
    setTimeout(() => this.showToast('Arrears Report generated!', 'success'), 1500);
  }

  generateDisbursementReport(): void {
    this.showToast('Generating Disbursement Report...', 'info');
    setTimeout(() => this.showToast('Disbursement Report generated!', 'success'), 1500);
  }

  generateLoanReport(report: LoanReport): void {
    this.showToast(`Generating: ${report.name} (${report.selectedPeriod})...`, 'info');
    setTimeout(() => this.showToast(`${report.name} generated!`, 'success'), 1500);
  }

  downloadLoanReport(report: LoanReport): void {
    this.showToast(`Downloading: ${report.name}`, 'success');
    this.totalDownloads++;
  }

  scheduleLoanReport(report: LoanReport): void {
    this.showToast(`Scheduling: ${report.name}`, 'info');
  }

  exportLoanReports(): void {
    this.showToast('Exporting all loan reports...', 'info');
    setTimeout(() => this.showToast('All loan reports exported!', 'success'), 2000);
  }

  /* ══════════════════════════════════════════════════════════════════════
    MEMBER REPORT ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  generateMemberListReport(): void {
    this.showToast('Generating Member List Report...', 'info');
    setTimeout(() => this.showToast('Member List Report generated!', 'success'), 1500);
  }

  generateNewMembersReport(): void {
    this.showToast('Generating New Members Report...', 'info');
    setTimeout(() => this.showToast('New Members Report generated!', 'success'), 1500);
  }

  generateDormantReport(): void {
    this.showToast('Generating Dormant Accounts Report...', 'info');
    setTimeout(() => this.showToast('Dormant Accounts Report generated!', 'success'), 1500);
  }

  generateVIPReport(): void {
    this.showToast('Generating VIP Members Report...', 'info');
    setTimeout(() => this.showToast('VIP Members Report generated!', 'success'), 1500);
  }

  generateMemberStatement(): void {
    this.showToast('Generating Member Statement...', 'info');
    setTimeout(() => this.showToast('Member Statement generated!', 'success'), 1500);
  }

  generateAgeAnalysis(): void {
    this.showToast('Generating Age Analysis...', 'info');
    setTimeout(() => this.showToast('Age Analysis generated!', 'success'), 1500);
  }

  generateContributionReport(): void {
    this.showToast('Generating Contribution Report...', 'info');
    setTimeout(() => this.showToast('Contribution Report generated!', 'success'), 1500);
  }

  openCategoryReports(category: MemberReportCategory): void {
    this.showToast(`Opening: ${category.name} reports`, 'info');
  }

  /* ══════════════════════════════════════════════════════════════════════
    REGULATORY REPORT ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  generateRegulatoryReport(report: RegulatoryReport): void {
    this.showToast(`Generating: ${report.name}...`, 'info');
    setTimeout(() => this.showToast(`${report.name} generated!`, 'success'), 2000);
  }

  viewGuidelines(report: RegulatoryReport): void {
    this.showToast(`Opening ${report.authority} guidelines...`, 'info');
  }

  openComplianceCenter(): void {
    this.showToast('Opening Compliance Center...', 'info');
    this.router.navigate(['/admin', 'compliance']);
  }

  /* ══════════════════════════════════════════════════════════════════════
    CUSTOM REPORT BUILDER ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  updateSelectedSources(): void {
    const selected = this.dataSources.filter(s => s.selected).map(s => s.label);
    console.log('Selected sources:', selected);
  }

  addField(field: ReportField): void {
    if (!this.selectedFields.find(f => f.id === field.id)) {
      this.selectedFields.push({ ...field });
      this.showToast(`Added: ${field.label}`, 'success');
    } else {
      this.showToast(`${field.label} already selected`, 'warning');
    }
  }

  removeField(index: number): void {
    const removed = this.selectedFields.splice(index, 1);
    this.showToast(`Removed: ${removed[0].label}`, 'info');
  }

  saveCustomReport(): void {
    if (!this.customReportConfig.name) {
      this.showToast('Please enter a report name', 'warning');
      return;
    }

    this.savedCustomReports.push({
      id: 'sc-' + Date.now(),
      name: this.customReportConfig.name,
      lastGenerated: 'Never',
      format: this.getSelectedFormats()
    });

    this.showToast(`Custom report "${this.customReportConfig.name}" saved!`, 'success');
  }

  previewCustomReport(): void {
    if (this.selectedFields.length === 0) {
      this.showToast('Please select at least one field', 'warning');
      return;
    }
    this.showToast('Generating preview...', 'info');
  }

  generateCustomReport(): void {
    if (this.selectedFields.length === 0) {
      this.showToast('Please select at least one field', 'warning');
      return;
    }

    this.showToast('Generating custom report...', 'info');
    setTimeout(() => {
      this.totalReportsGenerated++;
      this.showToast('Custom report generated successfully!', 'success');
    }, 2000);
  }

  resetBuilder(): void {
    this.customReportConfig = {
      type: '',
      dateFrom: '',
      dateTo: '',
      memberCategory: 'all',
      transactionType: 'all',
      amountMin: null,
      amountMax: null,
      name: '',
      formatPDF: true,
      formatExcel: false,
      formatCSV: false,
      groupBy: '',
      sortBy: 'date_desc'
    };
    this.selectedFields = [];
    this.dataSources.forEach(s => s.selected = false);
    this.showToast('Report builder reset', 'info');
  }

  editCustomReport(report: SavedCustomReport): void {
    this.showToast(`Editing: ${report.name}`, 'info');
  }

  deleteCustomReport(report: SavedCustomReport): void {
    if (confirm(`Delete "${report.name}"?`)) {
      this.savedCustomReports = this.savedCustomReports.filter(r => r.id !== report.id);
      this.showToast(`"${report.name}" deleted`, 'success');
    }
  }

  runCustomReport(report: SavedCustomReport): void {
    this.showToast(`Running: ${report.name}...`, 'info');
    setTimeout(() => {
      report.lastGenerated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      this.showToast(`${report.name} generated!`, 'success');
    }, 1500);
  }

  getSelectedFormats(): string {
    const formats: string[] = [];
    if (this.customReportConfig.formatPDF) formats.push('PDF');
    if (this.customReportConfig.formatExcel) formats.push('Excel');
    if (this.customReportConfig.formatCSV) formats.push('CSV');
    return formats.join(', ') || 'PDF';
  }

  /* ══════════════════════════════════════════════════════════════════════
    SCHEDULED REPORT ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  editSchedule(schedule: ScheduledReport): void {
    this.showToast(`Editing schedule: ${schedule.name}`, 'info');
  }

  runScheduleNow(schedule: ScheduledReport): void {
    this.showToast(`Running: ${schedule.name}...`, 'info');
    setTimeout(() => this.showToast(`${schedule.name} completed!`, 'success'), 1500);
  }

  deleteSchedule(schedule: ScheduledReport): void {
    if (confirm(`Delete schedule "${schedule.name}"?`)) {
      this.scheduledReportsList = this.scheduledReportsList.filter(s => s.id !== schedule.id);
      this.scheduledReportsCount--;
      this.showToast(`Schedule "${schedule.name}" deleted`, 'success');
    }
  }

  createNewSchedule(): void {
    this.closeScheduledReportsModal();
    this.showToast('Opening schedule builder...', 'info');
  }

  /* ══════════════════════════════════════════════════════════════════════
    RECENT REPORTS ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  downloadReport(report: RecentReport): void {
    this.showToast(`Downloading: ${report.name}`, 'success');
    this.totalDownloads++;
  }

  shareReport(report: RecentReport): void {
    this.showToast(`Share link copied for: ${report.name}`, 'success');
  }

  deleteReport(report: RecentReport): void {
    if (confirm(`Delete "${report.name}"?`)) {
      this.recentReports = this.recentReports.filter(r => r.id !== report.id);
      this.showToast(`"${report.name}" deleted`, 'success');
    }
  }

  viewAllReports(): void {
    this.showToast('Loading all reports...', 'info');
  }

  /* ══════════════════════════════════════════════════════════════════════
    FILTER ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  applyFilters(): void {
    this.showToast('Filters applied', 'success');
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.filterCategory = 'all';
    this.filterPeriod = 'all';
    this.showToast('Filters reset', 'info');
  }

  /* ══════════════════════════════════════════════════════════════════════
    TOAST NOTIFICATIONS
  ══════════════════════════════════════════════════════════════════════ */

  showToast(message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  hideToast(): void {
    this.toastVisible = false;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }
}