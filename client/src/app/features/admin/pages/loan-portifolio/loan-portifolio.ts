import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ── INTERFACES ── */
interface PoolCard {
  id: string;
  name: string;
  label: string;
  icon: string;
  iconGradient: string;
  accentColor: string;
  status: 'active' | 'paused' | 'inactive';
  statusLabel: string;
  poolLimit: string;
  disbursed: string;
  utilization: number;
  applied: number;
  approved: number;
  available: string;
  availableColor: string;
  barClass: string;
}

interface ProductSpec {
  value: string;
  color?: string;
  label: string;
}

interface ProductNotif {
  text: string;
  dotColor: string;
}

interface ProductTerm {
  text: string;
  iconColor: string;
}

interface ProductCard {
  id: string;
  name: string;
  productId: string;
  createdDate: string;
  icon: string;
  iconGradient: string;
  headerGradient: string;
  boxShadow: string;
  status: 'active' | 'paused' | 'inactive';
  badges: { label: string; class: string; icon?: string }[];
  isLive: boolean;
  dropdownId: string;
  specs: ProductSpec[];
  description: string;
  notifications: ProductNotif[];
  notifTitleColor: string;
  terms: ProductTerm[];
  termsTitleColor: string;
  membersApplied: number;
  membersColor: string;
  channeled: string;
  repaymentRate: string;
  repaymentColor: string;
  footerBg?: string;
  viewBtnGradient?: string;
}

interface TableRecord {
  productName: string;
  productId: string;
  icon: string;
  iconGradient: string;
  poolLimit: string;
  disbursed: string;
  available: string;
  availableColor: string;
  usage: number;
  usageText: string;
  usageColor?: string;
  membersApplied: number;
  membersColor: string;
  interestRate: string;
  maxTerm: string;
  status: 'active' | 'paused' | 'inactive';
  isPaused: boolean;
}

interface HealthBar {
  name: string;
  pct: number;
  color: string;
  gradient: string;
}

interface KpiItem {
  value: string;
  color?: string;
  label: string;
}

interface ActivityItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}

interface NotifItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

interface PoolModalData {
  id: string;
  name: string;
  icon: string;
  iconGradient: string;
  status: 'active' | 'paused';
  statusBadge: string;
  limit: number;
  usage: string;
  usageColor?: string;
  warning?: string;
  warningColor?: string;
  bg?: string;
  border?: string;
}

/* ── COMPONENT ── */
@Component({
  selector: 'app-loan-portifolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-portifolio.html',
  styleUrl: './loan-portifolio.scss'
})
export class LoanPortifolioComponent implements OnInit {
  /* ── MODAL TEMPLATE REFERENCES ── */
  @ViewChild('createModal') createModal!: TemplateRef<any>;
  @ViewChild('editModal') editModal!: TemplateRef<any>;
  @ViewChild('viewModal') viewModal!: TemplateRef<any>;
  @ViewChild('poolModal') poolModal!: TemplateRef<any>;
  @ViewChild('pauseModal') pauseModal!: TemplateRef<any>;
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  /* ── NATIVE MODAL STATE ── */
  activeModal: TemplateRef<any> | null = null;
  modalBackdrop = false;
  modalSize: 'sm' | 'md' | 'lg' | 'xl' = 'lg';

  /* ── STATE ── */
  activeTab = 'products';
  openDropdownId: string | null = null;
  toasts: Toast[] = [];
  toastIdCounter = 0;

  /* ── ALERTS ── */
  showPoolAlert = true;
  showInfoAlert = true;

  /* ── FILTERS ── */
  searchQuery = '';
  filterProduct = 'All Products';
  filterStatus = 'All Statuses';
  filterTime = 'All Time';

  /* ── CREATE FORM ── */
  createForm = {
    name: '',
    type: '',
    description: '',
    minAmount: '',
    maxAmount: '',
    poolLimit: '',
    interestRate: '',
    processingFee: '',
    latePenalty: '',
    minTerm: '',
    maxTerm: '',
    validity: '',
    frequency: 'Monthly',
    gracePeriod: '',
    calculation: 'Reducing Balance',
    securityType: 'None Required',
    minGuarantors: '',
    collateralRatio: '',
    minMembership: '',
    minSavings: '',
    maxActiveLoans: '',
    minCreditScore: '',
    maxDti: '',
    initialStatus: 'Active — Publish immediately',
    approvalMode: 'Manual — Admin reviews each application'
  };

  createTerms: string[] = [
    'Member must have active savings for ≥ 6 months',
    'No outstanding defaulted loan balance'
  ];
  createNotifications: { label: string; checked: boolean }[] = [
    { label: 'Application receipt SMS + Email to member', checked: true },
    { label: 'Approval/rejection notification to member', checked: true },
    { label: 'Disbursement confirmation SMS + Email', checked: true },
    { label: 'Repayment due reminder (7 days before)', checked: true },
    { label: 'Overdue alert after grace period expires', checked: true },
    { label: 'Default escalation to admin after 30 days', checked: true },
    { label: 'Guarantor notifications on all loan events', checked: false },
    { label: 'Monthly loan statement to borrower', checked: false },
    { label: 'Pool capacity alert at 80% utilization', checked: true },
    { label: 'Admin notification for new applications', checked: true }
  ];

  /* ── EDIT FORM ── */
  editForm = {
    name: 'Quick Loan',
    type: 'Quick Loan',
    description: 'Fast disbursement personal loan with no collateral required. Ideal for short-term financial needs. Repayable monthly.',
    minAmount: '5000',
    maxAmount: '100000',
    poolLimit: '1000000',
    interestRate: '10',
    processingFee: '2',
    latePenalty: '5',
    minTerm: '1',
    maxTerm: '6',
    validity: '30',
    frequency: 'Monthly',
    gracePeriod: '3',
    calculation: 'Reducing Balance'
  };

  /* ── DELETE CONFIRM ── */
  deleteConfirmText = '';
  deleteTargetName = '';

  /* ── PAUSE CONFIRM ── */
  pauseTargetName = '';
  pauseImpactCount = 12;

  /* ── POOL MODAL DATA ── */
  poolModalData: PoolModalData[] = [
    {
      id: 'quick', name: 'Quick Loan Pool', icon: 'bi-bolt', iconGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))',
      status: 'active', statusBadge: 'Active', limit: 1000000, usage: 'Current usage: KES 650K (65%)'
    },
    {
      id: 'emergency', name: 'Emergency Loan Pool', icon: 'bi-exclamation-circle', iconGradient: 'linear-gradient(135deg, #f44336, #e91e63)',
      status: 'active', statusBadge: '⚠ 87% Full', limit: 10000000,
      usage: '', usageColor: '#991b1b', warning: '⚠ Critical: Only KES 1.3M remaining. Increase recommended.',
      warningColor: '#991b1b', bg: '#fff5f5', border: '#fecaca'
    },
    {
      id: 'guarantor', name: 'Guarantor Loan Pool', icon: 'bi-people', iconGradient: 'linear-gradient(135deg, #9c27b0, #673ab7)',
      status: 'active', statusBadge: 'Active', limit: 25000000, usage: 'Current usage: KES 14.2M (57%)'
    },
    {
      id: 'collateral', name: 'Collateral Loan Pool', icon: 'bi-building', iconGradient: 'linear-gradient(135deg, #2196f3, #21cbf3)',
      status: 'paused', statusBadge: 'Paused', limit: 50000000, usage: 'Current usage: KES 31.5M (63%) — Product paused'
    },
    {
      id: 'noncollateral', name: 'Non-Collateral Loan Pool', icon: 'bi-cash-coin', iconGradient: 'linear-gradient(135deg, #ff9800, #ff5722)',
      status: 'active', statusBadge: 'Active', limit: 15000000,
      usage: 'Usage: KES 12.4M (83%) — Monitor closely', usageColor: '#ff9800'
    }
  ];

  totalPoolLimit = 'KES 101,000,000';
  totalDisbursed = 'KES 67,500,000';
  totalAvailable = 'KES 33,500,000';

  /* ── DATA ── */
  stats = [
    { icon: 'bi-layers', iconClass: 'stat-icon-green', cardClass: 'stat-card-green', change: '2 new', changeClass: 'stat-change-up', changeIcon: 'bi-arrow-up', value: '4', label: 'Active Products', sub: 'Out of 6 configured' },
    { icon: 'bi-people', iconClass: 'stat-icon-blue', cardClass: 'stat-card-blue', change: '+8.4%', changeClass: 'stat-change-up', changeIcon: 'bi-arrow-up', value: '1,284', label: 'Members Applied', sub: 'This financial year' },
    { icon: 'bi-coin', iconClass: 'stat-icon-orange', cardClass: 'stat-card-orange', change: '+12.2%', changeClass: 'stat-change-up', changeIcon: 'bi-arrow-up', value: 'KES 789M', label: 'Total Channeled', sub: 'Across all products' },
    { icon: 'bi-piggy-bank', iconClass: 'stat-icon-purple', cardClass: 'stat-card-purple', change: '-3%', changeClass: 'stat-change-down', changeIcon: 'bi-arrow-down', value: 'KES 21M', label: 'Remaining Pool', sub: 'Combined available' },
    { icon: 'bi-file-earmark-excel', iconClass: 'stat-icon-red', cardClass: 'stat-card-red', change: '23 new', changeClass: 'stat-change-up', changeIcon: 'bi-arrow-up', value: '23', label: 'Pending Applications', sub: 'Awaiting approval' }
  ];

  pools: PoolCard[] = [
    {
      id: 'quick', name: 'Quick Loan Pool', label: 'Revolving Fund', icon: 'bi-bolt',
      iconGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))',
      accentColor: 'linear-gradient(90deg, var(--primary-green), var(--accent-teal))',
      status: 'active', statusLabel: 'Active', poolLimit: 'KES 1M', disbursed: 'KES 650K',
      utilization: 65, applied: 234, approved: 189, available: 'KES 350K',
      availableColor: 'var(--primary-green)', barClass: 'pool-bar-green'
    },
    {
      id: 'emergency', name: 'Emergency Loan Pool', label: 'Emergency Reserve Fund', icon: 'bi-exclamation-circle',
      iconGradient: 'linear-gradient(135deg, #f44336, #e91e63)',
      accentColor: 'linear-gradient(90deg, #f44336, #e91e63)',
      status: 'active', statusLabel: '87% Full', poolLimit: 'KES 10M', disbursed: 'KES 8.7M',
      utilization: 87, applied: 512, approved: 487, available: 'KES 1.3M',
      availableColor: '#f44336', barClass: ''
    },
    {
      id: 'guarantor', name: 'Guarantor Loan Pool', label: 'Peer Guarantee Fund', icon: 'bi-people',
      iconGradient: 'linear-gradient(135deg, #9c27b0, #673ab7)',
      accentColor: 'linear-gradient(90deg, #9c27b0, #673ab7)',
      status: 'active', statusLabel: 'Active', poolLimit: 'KES 25M', disbursed: 'KES 14.2M',
      utilization: 57, applied: 318, approved: 290, available: 'KES 10.8M',
      availableColor: '#9c27b0', barClass: 'pool-bar-purple'
    },
    {
      id: 'collateral', name: 'Collateral Pool', label: 'Asset-Backed Fund', icon: 'bi-building',
      iconGradient: 'linear-gradient(135deg, #2196f3, #21cbf3)',
      accentColor: 'linear-gradient(90deg, #2196f3, #21cbf3)',
      status: 'paused', statusLabel: 'Paused', poolLimit: 'KES 50M', disbursed: 'KES 31.5M',
      utilization: 63, applied: 220, approved: 198, available: 'KES 18.5M',
      availableColor: '#2196f3', barClass: 'pool-bar-blue'
    }
  ];

  products: ProductCard[] = [
    {
      id: 'quick', name: 'Quick Loan', productId: 'PRD-001', createdDate: 'Created Jan 2025',
      icon: 'bi-bolt', iconGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))',
      headerGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))',
      boxShadow: '0 4px 12px rgba(0,208,132,.35)',
      status: 'active',
      badges: [
        { label: 'Active', class: 'tag-green', icon: 'bi-circle-fill' },
        { label: 'No Collateral', class: 'tag-blue' },
        { label: 'Auto-Approve', class: 'tag-gray' }
      ],
      isLive: true, dropdownId: 'dd-quick',
      specs: [
        { value: 'KES 5K', color: 'var(--primary-green)', label: 'Min Amount' },
        { value: 'KES 100K', color: 'var(--accent-teal)', label: 'Max Amount' },
        { value: '10%', label: 'Interest Rate' },
        { value: '1–6 mo', label: 'Loan Term' },
        { value: '2% p.a', label: 'Processing Fee' },
        { value: '30 days', label: 'Validity' }
      ],
      description: 'Fast disbursement personal loan with no collateral required. Ideal for short-term financial needs. Repayable monthly. Eligible members must have a minimum of 6 months membership and active savings account.',
      notifications: [
        { text: 'Disbursement confirmation SMS + Email to member', dotColor: 'notif-green' },
        { text: '7-day repayment reminder to borrower', dotColor: 'notif-orange' },
        { text: 'Overdue alert after 3 days — Admin notified', dotColor: 'notif-red' },
        { text: 'Pool utilization alert at 80% threshold', dotColor: 'notif-blue' }
      ],
      notifTitleColor: 'var(--accent-orange)',
      terms: [
        { text: 'Member must have active savings for ≥ 6 months', iconColor: 'var(--primary-green)' },
        { text: 'Maximum 2x monthly savings contributions', iconColor: 'var(--primary-green)' },
        { text: 'No outstanding defaulted loan balance', iconColor: 'var(--primary-green)' },
        { text: 'One active Quick Loan at a time per member', iconColor: 'var(--primary-green)' }
      ],
      termsTitleColor: 'var(--primary-green)',
      membersApplied: 234, membersColor: 'var(--primary-green)',
      channeled: 'KES 650K', repaymentRate: '96%', repaymentColor: 'var(--status-success)'
    },
    {
      id: 'emergency', name: 'Emergency Loan', productId: 'PRD-002', createdDate: 'Created Jan 2025',
      icon: 'bi-exclamation-circle', iconGradient: 'linear-gradient(135deg, #f44336, #e91e63)',
      headerGradient: 'linear-gradient(135deg, #f44336, #e91e63)',
      boxShadow: '0 4px 12px rgba(244,67,54,.35)',
      status: 'active',
      badges: [
        { label: 'Active', class: 'tag-green', icon: 'bi-circle-fill' },
        { label: 'High Priority', class: 'tag-red' },
        { label: 'Fast-Track', class: 'tag-orange' }
      ],
      isLive: true, dropdownId: 'dd-emerg',
      specs: [
        { value: 'KES 10K', color: '#f44336', label: 'Min Amount' },
        { value: 'KES 500K', color: '#e91e63', label: 'Max Amount' },
        { value: '8%', label: 'Interest Rate' },
        { value: '1–12 mo', label: 'Loan Term' },
        { value: '1.5% p.a', label: 'Processing Fee' },
        { value: '14 days', label: 'Validity' }
      ],
      description: 'Designed for urgent, unforeseen financial crises. Expedited 24-hour approval process. Capped at KES 500K with documentation of emergency. Applicable for medical, funeral, disaster relief. Rate subsidized by SACCO welfare fund.',
      notifications: [
        { text: 'Immediate SMS alert on application receipt', dotColor: 'notif-red' },
        { text: 'Admin priority notification — 24hr SLA enforced', dotColor: 'notif-orange' },
        { text: 'Disbursement push notification + receipt', dotColor: 'notif-green' },
        { text: 'Pool capacity alert when utilization exceeds 80%', dotColor: 'notif-red' }
      ],
      notifTitleColor: '#f44336',
      terms: [
        { text: 'Documented proof of emergency required', iconColor: '#f44336' },
        { text: 'Member in good standing with SACCO (no defaults)', iconColor: '#f44336' },
        { text: 'One emergency loan per member per year', iconColor: '#f44336' },
        { text: 'Guarantor or co-signer for amounts above KES 200K', iconColor: '#f44336' }
      ],
      termsTitleColor: '#f44336',
      membersApplied: 487, membersColor: '#f44336',
      channeled: 'KES 8.7M', repaymentRate: '91%', repaymentColor: 'var(--status-success)',
      viewBtnGradient: 'linear-gradient(135deg, #f44336, #e91e63)'
    },
    {
      id: 'guarantor', name: 'Guarantor-Based Loan', productId: 'PRD-003', createdDate: 'Created Feb 2025',
      icon: 'bi-people', iconGradient: 'linear-gradient(135deg, #9c27b0, #673ab7)',
      headerGradient: 'linear-gradient(135deg, #9c27b0, #673ab7)',
      boxShadow: '0 4px 12px rgba(156,39,176,.35)',
      status: 'active',
      badges: [
        { label: 'Active', class: 'tag-green', icon: 'bi-circle-fill' },
        { label: 'Peer Guarantee', class: 'tag-purple' },
        { label: 'Medium Risk', class: 'tag-blue' }
      ],
      isLive: true, dropdownId: 'dd-guar',
      specs: [
        { value: 'KES 50K', color: '#9c27b0', label: 'Min Amount' },
        { value: 'KES 2M', color: '#673ab7', label: 'Max Amount' },
        { value: '12%', label: 'Interest Rate' },
        { value: '6–48 mo', label: 'Loan Term' },
        { value: '3% p.a', label: 'Processing Fee' },
        { value: '60 days', label: 'Validity' }
      ],
      description: 'Larger loan product backed by peer guarantors who are active SACCO members. Suitable for business expansion, housing, education. Requires minimum 2 guarantors. Guarantor responsibilities legally binding.',
      notifications: [
        { text: 'Guarantor invitation sent automatically on application', dotColor: 'notif-purple' },
        { text: 'Guarantor acceptance/rejection alerts to borrower', dotColor: 'notif-orange' },
        { text: 'Default notification to guarantors if payment missed', dotColor: 'notif-red' },
        { text: 'Monthly statement sent to all parties', dotColor: 'notif-blue' }
      ],
      notifTitleColor: '#9c27b0',
      terms: [
        { text: 'Minimum 2 guarantors — SACCO members in good standing', iconColor: '#9c27b0' },
        { text: 'Guarantor savings ≥ 30% of loan requested', iconColor: '#9c27b0' },
        { text: 'Borrower must have ≥ 12 months membership', iconColor: '#9c27b0' },
        { text: 'Guarantors cannot guarantee more than 3 active loans', iconColor: '#9c27b0' }
      ],
      termsTitleColor: '#9c27b0',
      membersApplied: 290, membersColor: '#9c27b0',
      channeled: 'KES 14.2M', repaymentRate: '93%', repaymentColor: 'var(--status-success)',
      viewBtnGradient: 'linear-gradient(135deg, #9c27b0, #673ab7)'
    },
    {
      id: 'collateral', name: 'Collateral-Based Loan', productId: 'PRD-004', createdDate: 'Created Mar 2025',
      icon: 'bi-building', iconGradient: 'linear-gradient(135deg, #2196f3, #21cbf3)',
      headerGradient: 'linear-gradient(135deg, #2196f3, #21cbf3)',
      boxShadow: '0 4px 12px rgba(33,150,243,.35)',
      status: 'paused',
      badges: [
        { label: 'Paused', class: 'tag-gray', icon: 'bi-pause-fill' },
        { label: 'Asset-Backed', class: 'tag-blue' },
        { label: 'Low Risk', class: 'tag-gray' }
      ],
      isLive: false, dropdownId: 'dd-coll',
      specs: [
        { value: 'KES 100K', color: '#2196f3', label: 'Min Amount' },
        { value: 'KES 10M', color: '#21cbf3', label: 'Max Amount' },
        { value: '9%', label: 'Interest Rate' },
        { value: '12–84 mo', label: 'Loan Term' },
        { value: '2.5% p.a', label: 'Processing Fee' },
        { value: '90 days', label: 'Validity' }
      ],
      description: 'High-value secured loan backed by tangible assets (land title, vehicle logbook, or property). Lowest interest rate product. Valuation of collateral required by approved SACCO valuers. ⏸ Currently paused — collateral valuation team unavailable.',
      notifications: [
        { text: 'Valuation appointment scheduled automatically', dotColor: 'notif-blue' },
        { text: 'Legal documentation review alert to admin', dotColor: 'notif-orange' },
        { text: 'Default notice + collateral recovery trigger', dotColor: 'notif-red' },
        { text: 'Repayment receipts via email and app push', dotColor: 'notif-green' }
      ],
      notifTitleColor: '#2196f3',
      terms: [
        { text: 'Approved collateral: Title Deed, Logbook, or Fixed Asset', iconColor: '#2196f3' },
        { text: 'Collateral value must be ≥ 150% of loan amount', iconColor: '#2196f3' },
        { text: 'SACCO-approved valuer certificate required', iconColor: '#2196f3' },
        { text: 'Legal charge registered against collateral', iconColor: '#2196f3' }
      ],
      termsTitleColor: '#2196f3',
      membersApplied: 198, membersColor: '#2196f3',
      channeled: 'KES 31.5M', repaymentRate: '97%', repaymentColor: 'var(--status-success)',
      footerBg: 'rgba(241,245,249,.6)',
      viewBtnGradient: 'linear-gradient(135deg, #2196f3, #21cbf3)'
    },
    {
      id: 'noncollateral', name: 'Non-Collateral Loan', productId: 'PRD-005', createdDate: 'Created Apr 2025',
      icon: 'bi-cash-coin', iconGradient: 'linear-gradient(135deg, #ff9800, #ff5722)',
      headerGradient: 'linear-gradient(135deg, #ff9800, #ff5722)',
      boxShadow: '0 4px 12px rgba(255,152,0,.35)',
      status: 'active',
      badges: [
        { label: 'Active', class: 'tag-green', icon: 'bi-circle-fill' },
        { label: 'Unsecured', class: 'tag-orange' },
        { label: 'Medium-High Risk', class: 'tag-purple' }
      ],
      isLive: true, dropdownId: 'dd-noncol',
      specs: [
        { value: 'KES 20K', color: '#ff9800', label: 'Min Amount' },
        { value: 'KES 500K', color: '#ff5722', label: 'Max Amount' },
        { value: '14%', label: 'Interest Rate' },
        { value: '3–24 mo', label: 'Loan Term' },
        { value: '3.5% p.a', label: 'Processing Fee' },
        { value: '45 days', label: 'Validity' }
      ],
      description: 'Unsecured personal loan for members with strong credit history within the SACCO. No asset backing required but income verification and credit score check mandatory. Higher rate compensates for elevated risk profile.',
      notifications: [
        { text: 'Credit check automated — member notified of result', dotColor: 'notif-orange' },
        { text: 'Application status updates at every stage', dotColor: 'notif-blue' },
        { text: '5-day overdue escalation to recovery team', dotColor: 'notif-red' },
        { text: 'Successful payment confirmation SMS', dotColor: 'notif-green' }
      ],
      notifTitleColor: '#ff9800',
      terms: [
        { text: 'Minimum 18 months active SACCO membership', iconColor: '#ff9800' },
        { text: 'Internal credit score ≥ 650 (SACCO scoring model)', iconColor: '#ff9800' },
        { text: 'Verifiable income statement or payslip (3 months)', iconColor: '#ff9800' },
        { text: 'Debt-to-income ratio must not exceed 40%', iconColor: '#ff9800' }
      ],
      termsTitleColor: '#ff9800',
      membersApplied: 156, membersColor: '#ff9800',
      channeled: 'KES 12.4M', repaymentRate: '88%', repaymentColor: 'var(--status-warning)',
      viewBtnGradient: 'linear-gradient(135deg, #ff9800, #ff5722)'
    }
  ];

  tableRecords: TableRecord[] = [
    {
      productName: 'Quick Loan', productId: 'PRD-001', icon: 'bi-bolt',
      iconGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))',
      poolLimit: 'KES 1M', disbursed: 'KES 650K', available: 'KES 350K',
      availableColor: 'var(--primary-green)', usage: 65, usageText: '65% used',
      membersApplied: 234, membersColor: 'var(--primary-green)',
      interestRate: '10% p.a.', maxTerm: '6 months', status: 'active', isPaused: false
    },
    {
      productName: 'Emergency Loan', productId: 'PRD-002', icon: 'bi-exclamation-circle',
      iconGradient: 'linear-gradient(135deg, #f44336, #e91e63)',
      poolLimit: 'KES 10M', disbursed: 'KES 8.7M', available: 'KES 1.3M',
      availableColor: '#f44336', usage: 87, usageText: '87% used ⚠', usageColor: '#f44336',
      membersApplied: 487, membersColor: '#f44336',
      interestRate: '8% p.a.', maxTerm: '12 months', status: 'active', isPaused: false
    },
    {
      productName: 'Guarantor Loan', productId: 'PRD-003', icon: 'bi-people',
      iconGradient: 'linear-gradient(135deg, #9c27b0, #673ab7)',
      poolLimit: 'KES 25M', disbursed: 'KES 14.2M', available: 'KES 10.8M',
      availableColor: '#9c27b0', usage: 57, usageText: '57% used',
      membersApplied: 290, membersColor: '#9c27b0',
      interestRate: '12% p.a.', maxTerm: '48 months', status: 'active', isPaused: false
    },
    {
      productName: 'Collateral Loan', productId: 'PRD-004', icon: 'bi-building',
      iconGradient: 'linear-gradient(135deg, #2196f3, #21cbf3)',
      poolLimit: 'KES 50M', disbursed: 'KES 31.5M', available: 'KES 18.5M',
      availableColor: '#2196f3', usage: 63, usageText: '63% used',
      membersApplied: 198, membersColor: '#2196f3',
      interestRate: '9% p.a.', maxTerm: '84 months', status: 'paused', isPaused: true
    },
    {
      productName: 'Non-Collateral Loan', productId: 'PRD-005', icon: 'bi-cash-coin',
      iconGradient: 'linear-gradient(135deg, #ff9800, #ff5722)',
      poolLimit: 'KES 15M', disbursed: 'KES 12.4M', available: 'KES 2.6M',
      availableColor: '#ff9800', usage: 83, usageText: '83% used', usageColor: '#ff9800',
      membersApplied: 156, membersColor: '#ff9800',
      interestRate: '14% p.a.', maxTerm: '24 months', status: 'active', isPaused: false
    }
  ];

  healthBars: HealthBar[] = [
    { name: 'Quick Loan', pct: 65, color: 'var(--primary-green)', gradient: 'linear-gradient(90deg, var(--primary-green), var(--accent-teal))' },
    { name: 'Emergency Loan', pct: 87, color: '#f44336', gradient: 'linear-gradient(90deg, #f44336, #e91e63)' },
    { name: 'Guarantor Loan', pct: 57, color: '#9c27b0', gradient: 'linear-gradient(90deg, #9c27b0, #673ab7)' },
    { name: 'Collateral Loan', pct: 63, color: '#2196f3', gradient: 'linear-gradient(90deg, #2196f3, #21cbf3)' },
    { name: 'Non-Collateral', pct: 83, color: '#ff9800', gradient: 'linear-gradient(90deg, #ff9800, #ff5722)' }
  ];

  kpis: KpiItem[] = [
    { value: '94.3%', color: 'var(--primary-green)', label: 'Repayment Rate' },
    { value: 'KES 158K', label: 'Avg Loan Size' },
    { value: '10.6%', label: 'Avg Interest Rate' },
    { value: '18 mo', label: 'Avg Loan Term' },
    { value: '5.7%', color: '#f44336', label: 'Default Rate' },
    { value: 'KES 86M', color: 'var(--accent-purple)', label: 'Total Pool Capacity' }
  ];

  activities: ActivityItem[] = [
    { icon: 'bi-pen', iconBg: 'var(--primary-green-ultra-light)', iconColor: 'var(--primary-green)', title: 'Quick Loan rate updated — 10% p.a.', subtitle: 'Admin Operator · 1 hr ago' },
    { icon: 'bi-pause', iconBg: '#fee2e2', iconColor: '#f44336', title: 'Collateral Loan paused', subtitle: 'Admin Operator · Yesterday' },
    { icon: 'bi-plus', iconBg: '#faf5ff', iconColor: '#9c27b0', title: 'Non-Collateral Loan product created', subtitle: 'Admin Operator · Apr 2025' },
    { icon: 'bi-arrow-up', iconBg: '#eff6ff', iconColor: '#2196f3', title: 'Emergency pool limit raised to KES 10M', subtitle: 'Admin Operator · Mar 2025' },
    { icon: 'bi-check', iconBg: '#f0fdf4', iconColor: '#16a34a', title: 'Guarantor Loan max updated to KES 2M', subtitle: 'Admin Operator · Feb 2025' }
  ];

  notifications: NotifItem[] = [
    { icon: 'bi-exclamation-triangle', iconBg: '#fee2e2', iconColor: '#f44336', title: 'Emergency Loan Pool Critical — 87% Utilized', description: 'KES 8.7M of KES 10M pool disbursed. Only KES 1.3M available. 7 applications pending. Consider increasing pool or activating reserves.', time: '2 min ago', unread: true },
    { icon: 'bi-file-earmark-check', iconBg: '#fff7ed', iconColor: '#ff9800', title: '12 Quick Loan Applications Awaiting Approval', description: 'Oldest application: 3 hours ago by Member R-01284. SLA: 24 hours. Review now to maintain service standards.', time: '3 hrs ago', unread: true },
    { icon: 'bi-check-circle', iconBg: '#f0fdf4', iconColor: '#16a34a', title: 'Guarantor Loan Product Successfully Updated', description: 'Max amount updated from KES 1.5M to KES 2M. Changes reflected on member portal. Updated by Admin Operator at 09:42 AM.', time: 'Today 9:42 AM', unread: false },
    { icon: 'bi-pause-circle', iconBg: '#eff6ff', iconColor: '#2196f3', title: 'Collateral Loan Product Paused', description: 'Product PRD-004 paused due to valuation team unavailability. 15 pending applications affected. Notifications sent to applicants.', time: 'Yesterday 2:15 PM', unread: false },
    { icon: 'bi-people', iconBg: '#faf5ff', iconColor: '#9c27b0', title: 'New Guarantor Loan Batch Approved — 14 Members', description: 'Total disbursed: KES 4.2M. Average loan size: KES 300K. Guarantors confirmed for all 14 loans. Pool updated.', time: '2 days ago', unread: false }
  ];

  /* ── GETTERS ── */
  get filteredTableRecords(): TableRecord[] {
    let records = [...this.tableRecords];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      records = records.filter(r => r.productName.toLowerCase().includes(q) || r.productId.toLowerCase().includes(q));
    }
    if (this.filterProduct !== 'All Products') {
      records = records.filter(r => r.productName === this.filterProduct);
    }
    if (this.filterStatus !== 'All Statuses') {
      const statusMap: Record<string, string> = { 'Active': 'active', 'Paused': 'paused', 'Inactive': 'inactive' };
      records = records.filter(r => r.status === statusMap[this.filterStatus]);
    }
    return records;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  /* ── LIFECYCLE ── */
  ngOnInit(): void {
    // Clean startup - no toast spam
  }

  /* ── TAB SWITCHING ── */
  setTab(tab: string): void {
    this.activeTab = tab;
  }

  /* ── DROPDOWN ── */
  toggleDropdown(id: string, event?: Event): void {
    event?.stopPropagation();
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  closeDropdowns(): void {
    this.openDropdownId = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.closeDropdowns();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }

  /* ── NATIVE MODAL SYSTEM ── */
  private openModal(modalTemplate: TemplateRef<any>, size: 'sm' | 'md' | 'lg' | 'xl' = 'lg'): void {
    this.modalSize = size;
    this.closeDropdowns();
    this.activeModal = modalTemplate;
    this.modalBackdrop = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    this.modalBackdrop = false;
    document.body.style.overflow = '';
  }

  /* ── MODAL OPENERS ── */
  openCreateModal(): void {
    this.openModal(this.createModal, 'xl');
  }

  openEditModal(product?: ProductCard): void {
    if (product) {
      this.editForm.name = product.name;
      this.editForm.type = product.name;
    }
    this.openModal(this.editModal, 'lg');
  }

  openViewModal(product?: ProductCard): void {
    this.openModal(this.viewModal, 'lg');
  }

  openPoolModal(): void {
    this.openModal(this.poolModal, 'lg');
  }

  openPauseModal(productName: string, impactCount: number = 12): void {
    this.pauseTargetName = productName;
    this.pauseImpactCount = impactCount;
    this.openModal(this.pauseModal, 'sm');
  }

  openDeleteModal(productName: string): void {
    this.deleteTargetName = productName;
    this.deleteConfirmText = '';
    this.openModal(this.deleteModal, 'sm');
  }

  /* ── TOAST (minimal usage) ── */
  showToast(title: string, message: string, type: 'success' | 'warning' | 'danger' | 'info' = 'success'): void {
    const toast: Toast = {
      id: ++this.toastIdCounter,
      title,
      message,
      type
    };
    this.toasts.push(toast);
    setTimeout(() => this.dismissToast(toast.id), 4500);
  }

  dismissToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getToastIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'bi-check-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      danger: 'bi-x-circle-fill',
      info: 'bi-info-circle-fill'
    };
    return icons[type] ?? icons['success'];
  }

  getToastColor(type: string): string {
    const colors: Record<string, string> = {
      success: '#16a34a',
      warning: '#92400e',
      danger: '#991b1b',
      info: '#1e40af'
    };
    return colors[type] ?? colors['success'];
  }

  /* ── PRODUCT ACTIONS ── */
  onProductToggle(product: ProductCard): void {
    product.isLive = !product.isLive;
    product.status = product.isLive ? 'active' : 'paused';
  }

  confirmPause(productName: string, impactCount: number = 12): void {
    this.openPauseModal(productName, impactCount);
  }

  executePause(): void {
    this.showToast('Product Paused', `${this.pauseTargetName} paused and hidden from member portal`, 'warning');
    this.closeModal();
  }

  confirmDelete(productName: string): void {
    this.openDeleteModal(productName);
  }

  get canDelete(): boolean {
    return this.deleteConfirmText === 'DELETE';
  }

  executeDelete(): void {
    if (!this.canDelete) return;
    this.showToast('Product Deleted', `${this.deleteTargetName} permanently removed`, 'danger');
    this.closeModal();
  }

  duplicateProduct(product: ProductCard): void {
    this.showToast('Duplicated', `${product.name} duplicated as draft`, 'success');
    this.closeDropdowns();
  }

  resumeProduct(product: ProductCard): void {
    product.isLive = true;
    product.status = 'active';
    this.showToast('Product Resumed', `${product.name} is now active on member portal`, 'success');
  }

  /* ── POOL ACTIONS ── */
  increasePool(pool: PoolCard): void {
    this.showToast('Pool Increased', `${pool.name} limit updated`, 'success');
  }

  editPoolLimit(pool: PoolCard): void {
    this.openPoolModal();
  }

  generatePoolReport(pool: PoolCard): void {
    this.showToast('Report Generated', `${pool.name} report ready for download`, 'success');
  }

  savePoolLimits(): void {
    this.showToast('Pools Updated', 'All pool fund limits saved successfully', 'success');
    this.closeModal();
  }

  /* ── TABLE ACTIONS ── */
  exportCSV(): void {
    this.showToast('Exported', 'Portfolio data exported to CSV', 'success');
  }

  printTable(): void {
    this.showToast('Printed', 'Print preview opened', 'success');
  }

  /* ── NOTIFICATIONS ── */
  markAllRead(): void {
    this.notifications.forEach(n => n.unread = false);
  }

  /* ── CREATE PRODUCT ── */
  addTerm(): void {
    this.createTerms.push('');
  }

  removeTerm(index: number): void {
    this.createTerms.splice(index, 1);
  }

  saveDraft(): void {
    this.showToast('Draft Saved', 'Loan product saved as draft', 'success');
    this.closeModal();
  }

  publishProduct(): void {
    this.showToast('Product Created', 'New loan product published successfully', 'success');
    this.closeModal();
  }

  /* ── EDIT PRODUCT ── */
  saveEditChanges(): void {
    this.showToast('Product Updated', `${this.editForm.name} updated successfully`, 'success');
    this.closeModal();
  }

  /* ── VIEW PRODUCT ── */
  editFromView(): void {
    this.closeModal();
    setTimeout(() => this.openEditModal(), 100);
  }

  pauseFromView(): void {
    this.closeModal();
    setTimeout(() => this.openPauseModal('Quick Loan'), 100);
  }

  /* ── ALERTS ── */
  dismissAlert(alert: 'pool' | 'info'): void {
    if (alert === 'pool') this.showPoolAlert = false;
    if (alert === 'info') this.showInfoAlert = false;
  }
}