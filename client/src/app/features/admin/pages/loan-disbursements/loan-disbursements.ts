import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ===================== INTERFACES ===================== */

interface LoanSummary {
  label: string;
  value: string;
  trend: number;
  trendDir: 'up' | 'down';
  icon: string;
  type: 'total' | 'approved' | 'pending' | 'disbursed' | 'overdue';
}

interface PipelineStep {
  label: string;
  count: number;
  status: 'completed' | 'active' | 'pending';
  icon: string;
}

interface Loan {
  id: string;
  ref: string;
  member: { name: string; id: string; initials: string; color: string };
  type: 'personal' | 'business' | 'emergency' | 'education' | 'agriculture' | 'asset';
  amount: number;
  interestRate: number;
  term: number;
  status: 'approved' | 'pending' | 'disbursed' | 'overdue' | 'rejected';
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  dueDate?: string;
  repaymentProgress: number;
  installment: string;
  collateral: string[];
  officer: string;
  purpose: string;
}

interface ActivityItem {
  time: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  completed: boolean;
}

interface OverdueLoan {
  member: { name: string; id: string; initials: string; color: string };
  ref: string;
  amountDue: number;
  daysOverdue: number;
}

interface PaymentDue {
  member: { name: string; id: string; initials: string; color: string };
  dueDate: string;
  amount: number;
  installment: string;
}

interface AmortizationRow {
  period: number;
  paymentDate: string;
  principal: number;
  interest: number;
  total: number;
  balance: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface ApprovalStepItem {
  title: string;
  officer: string;
  date: string;
  status: 'done' | 'pending-step' | 'rejected';
}

interface QuickAction {
  icon: string;
  color: string;
  title: string;
  description: string;
  action: string;
}

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

interface TabCounts {
  all: number;
  approved: number;
  pending: number;
  disbursed: number;
  overdue: number;
}

/* ===================== COMPONENT ===================== */

@Component({
  selector: 'app-loan-disbursements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-disbursements.html',
  styleUrls: ['./loan-disbursements.scss']
})
export class LoanDisbursementsComponent {
  /* ---------- Tabs ---------- */
  activeTab: 'all' | 'approved' | 'pending' | 'disbursed' | 'overdue' = 'all';

  /* ---------- Search & Filter ---------- */
  searchQuery = '';
  filterType: 'all' | 'personal' | 'business' | 'emergency' | 'education' | 'agriculture' | 'asset' = 'all';
  filterStatus: 'all' | 'approved' | 'pending' | 'disbursed' | 'overdue' | 'rejected' = 'all';

  /* ---------- Modals ---------- */
  showLoanDetail = false;
  selectedLoan: Loan | null = null;

  showNewLoan = false;
  newLoan = {
    memberName: '',
    memberId: '',
    type: 'personal' as Loan['type'],
    amount: 0,
    interestRate: 12,
    term: 12,
    purpose: '',
    collateral: '',
    officer: ''
  };

  showDisburseModal = false;
  disburseData = { method: 'mpesa', account: '', notes: '' };

  showRepaymentSchedule = false;
  scheduleLoan: Loan | null = null;

  showOverdueDetail = false;
  selectedOverdue: OverdueLoan | null = null;

  showMemberDetail = false;
  selectedMember: { name: string; id: string; initials: string; color: string } | null = null;

  showExportModal = false;
  exportFormat = 'excel';
  exportRange = 'all';

  showLoanOverview = false;
  showPipelineOverview = false;
  showOverdueOverview = false;
  showPaymentsOverview = false;
  showActivityOverview = false;

  /* ---------- Toasts ---------- */
  toasts: Toast[] = [];
  private toastId = 0;

  /* ---------- Data ---------- */
  summaryCards: LoanSummary[] = [
    { label: 'Total Loans', value: 'KES 24.5M', trend: 12.5, trendDir: 'up', icon: 'bi-cash-stack', type: 'total' },
    { label: 'Approved', value: 'KES 8.2M', trend: 8.3, trendDir: 'up', icon: 'bi-check-circle', type: 'approved' },
    { label: 'Pending', value: 'KES 4.1M', trend: 3.2, trendDir: 'down', icon: 'bi-hourglass-split', type: 'pending' },
    { label: 'Disbursed', value: 'KES 18.7M', trend: 15.1, trendDir: 'up', icon: 'bi-send-check', type: 'disbursed' },
    { label: 'Overdue', value: 'KES 1.3M', trend: 2.4, trendDir: 'up', icon: 'bi-exclamation-triangle', type: 'overdue' }
  ];

  pipelineSteps: PipelineStep[] = [
    { label: 'Application', count: 45, status: 'completed', icon: 'bi-file-earmark-text' },
    { label: 'Credit Check', count: 38, status: 'completed', icon: 'bi-search' },
    { label: 'Approval', count: 32, status: 'completed', icon: 'bi-check2-all' },
    { label: 'Disbursement', count: 28, status: 'active', icon: 'bi-cash-coin' },
    { label: 'Repayment', count: 156, status: 'pending', icon: 'bi-arrow-repeat' }
  ];

  loans: Loan[] = [
    {
      id: '1', ref: 'LN-2024-00891', member: { name: 'Mary Wanjiku', id: 'SP-10042', initials: 'MW', color: 'green' },
      type: 'personal', amount: 250000, interestRate: 12, term: 12, status: 'disbursed',
      appliedDate: '2024-12-01', approvedDate: '2024-12-03', disbursedDate: '2024-12-05', dueDate: '2025-12-05',
      repaymentProgress: 45, installment: '3/12', collateral: ['Vehicle Logbook', 'Payslip'], officer: 'David Otieno', purpose: 'Home renovation'
    },
    {
      id: '2', ref: 'LN-2024-00890', member: { name: 'David Otieno', id: 'SP-10078', initials: 'DO', color: 'blue' },
      type: 'business', amount: 500000, interestRate: 14, term: 24, status: 'approved',
      appliedDate: '2024-11-28', approvedDate: '2024-12-02', dueDate: '2026-12-02',
      repaymentProgress: 0, installment: '0/24', collateral: ['Business Registration', 'Bank Statements'], officer: 'Grace Akinyi', purpose: 'Business expansion'
    },
    {
      id: '3', ref: 'LN-2024-00889', member: { name: 'John Kamau', id: 'SP-10015', initials: 'JK', color: 'purple' },
      type: 'education', amount: 300000, interestRate: 10, term: 18, status: 'disbursed',
      appliedDate: '2024-10-15', approvedDate: '2024-10-20', disbursedDate: '2024-10-22', dueDate: '2026-04-22',
      repaymentProgress: 55, installment: '6/12', collateral: ['Fee Structure', 'Guarantor Form'], officer: 'Mary Wanjiku', purpose: 'University fees'
    },
    {
      id: '4', ref: 'LN-2024-00888', member: { name: 'Grace Akinyi', id: 'SP-10156', initials: 'GA', color: 'orange' },
      type: 'emergency', amount: 75000, interestRate: 15, term: 6, status: 'pending',
      appliedDate: '2024-12-10', dueDate: '2025-06-10',
      repaymentProgress: 0, installment: '0/6', collateral: ['Payslip'], officer: 'David Otieno', purpose: 'Medical emergency'
    },
    {
      id: '5', ref: 'LN-2024-00887', member: { name: 'Peter Omondi', id: 'SP-10124', initials: 'PO', color: 'teal' },
      type: 'agriculture', amount: 150000, interestRate: 11, term: 12, status: 'pending',
      appliedDate: '2024-12-08', dueDate: '2025-12-08',
      repaymentProgress: 0, installment: '0/12', collateral: ['Land Title', 'Crop Insurance'], officer: 'Grace Akinyi', purpose: 'Farm inputs'
    },
    {
      id: '6', ref: 'LN-2024-00885', member: { name: 'Alice Muthoni', id: 'SP-10203', initials: 'AM', color: 'red' },
      type: 'personal', amount: 25000, interestRate: 13, term: 6, status: 'overdue',
      appliedDate: '2024-06-01', approvedDate: '2024-06-03', disbursedDate: '2024-06-05', dueDate: '2024-12-05',
      repaymentProgress: 80, installment: '5/6', collateral: ['Payslip'], officer: 'David Otieno', purpose: 'Emergency funds'
    },
    {
      id: '7', ref: 'LN-2024-00884', member: { name: 'Bernard Kiprop', id: 'SP-10201', initials: 'BK', color: 'green' },
      type: 'asset', amount: 350000, interestRate: 12, term: 24, status: 'overdue',
      appliedDate: '2024-03-01', approvedDate: '2024-03-05', disbursedDate: '2024-03-10', dueDate: '2024-12-10',
      repaymentProgress: 65, installment: '10/18', collateral: ['Vehicle Logbook', 'Insurance Cert'], officer: 'Mary Wanjiku', purpose: 'Motorcycle purchase'
    },
    {
      id: '8', ref: 'LN-2024-00883', member: { name: 'Catherine Njeri', id: 'SP-10089', initials: 'CN', color: 'blue' },
      type: 'business', amount: 180000, interestRate: 14, term: 12, status: 'overdue',
      appliedDate: '2024-04-01', approvedDate: '2024-04-05', disbursedDate: '2024-04-10', dueDate: '2024-12-15',
      repaymentProgress: 70, installment: '9/12', collateral: ['Business License', 'Stock Inventory'], officer: 'Grace Akinyi', purpose: 'Restocking'
    },
    {
      id: '9', ref: 'LN-2024-00882', member: { name: 'Evans Wafula', id: 'SP-10245', initials: 'EW', color: 'purple' },
      type: 'education', amount: 95000, interestRate: 10, term: 12, status: 'overdue',
      appliedDate: '2024-05-01', approvedDate: '2024-05-05', disbursedDate: '2024-05-10', dueDate: '2024-12-18',
      repaymentProgress: 75, installment: '8/12', collateral: ['Admission Letter'], officer: 'David Otieno', purpose: 'School fees'
    },
    {
      id: '10', ref: 'LN-2024-00881', member: { name: 'Sarah Auma', id: 'SP-10312', initials: 'SA', color: 'orange' },
      type: 'personal', amount: 120000, interestRate: 12, term: 12, status: 'approved',
      appliedDate: '2024-12-05', approvedDate: '2024-12-09', dueDate: '2025-12-09',
      repaymentProgress: 0, installment: '0/12', collateral: ['Payslip', 'Bank Statements'], officer: 'Mary Wanjiku', purpose: 'Furniture purchase'
    }
  ];

  activities: ActivityItem[] = [
    { time: 'Today, 2:30 PM', title: 'KES 250,000 disbursed to Mary Wanjiku', description: 'Personal Loan • Ref: LN-2024-00891 • via M-Pesa', icon: 'bi-cash-stack', iconColor: 'green', completed: true },
    { time: 'Today, 1:15 PM', title: 'Loan LN-2024-00890 approved by David Otieno', description: 'Business Loan • KES 500,000 • Credit Officer approval', icon: 'bi-check-circle', iconColor: 'blue', completed: true },
    { time: 'Today, 11:40 AM', title: 'Repayment of KES 15,000 received from John Kamau', description: 'Ref: LN-2024-00845 • Installment 6/12 • M-Pesa', icon: 'bi-arrow-down-circle', iconColor: 'teal', completed: true },
    { time: 'Today, 10:00 AM', title: 'Credit check completed for Grace Akinyi — Score: 742', description: 'Education Loan • KES 300,000 requested • Excellent', icon: 'bi-search', iconColor: 'purple', completed: true },
    { time: 'Yesterday, 4:50 PM', title: 'New loan application submitted by Peter Omondi', description: 'Agriculture Loan • KES 150,000 • Awaiting KYC review', icon: 'bi-file-earmark-plus', iconColor: 'orange', completed: false },
    { time: 'Yesterday, 2:20 PM', title: 'Loan LN-2024-00820 flagged as overdue — Alice Muthoni', description: 'Personal Loan • KES 25,000 overdue • 15 days past due', icon: 'bi-exclamation-triangle', iconColor: 'red', completed: false }
  ];

  overdueLoans: OverdueLoan[] = [
    { member: { name: 'Alice Muthoni', id: 'SP-10042', initials: 'AM', color: 'red' }, ref: 'LN-2024-00820', amountDue: 25000, daysOverdue: 15 },
    { member: { name: 'Bernard Kiprop', id: 'SP-10078', initials: 'BK', color: 'green' }, ref: 'LN-2024-00798', amountDue: 350000, daysOverdue: 22 },
    { member: { name: 'Catherine Njeri', id: 'SP-10156', initials: 'CN', color: 'blue' }, ref: 'LN-2024-00775', amountDue: 180000, daysOverdue: 30 },
    { member: { name: 'Evans Wafula', id: 'SP-10203', initials: 'EW', color: 'purple' }, ref: 'LN-2024-00810', amountDue: 95000, daysOverdue: 8 },
    { member: { name: 'Faith Wairimu', id: 'SP-10201', initials: 'FW', color: 'orange' }, ref: 'LN-2024-00792', amountDue: 120000, daysOverdue: 12 },
    { member: { name: 'George Otieno', id: 'SP-10245', initials: 'GO', color: 'teal' }, ref: 'LN-2024-00765', amountDue: 85000, daysOverdue: 18 },
    { member: { name: 'Hannah Mwangi', id: 'SP-10312', initials: 'HM', color: 'red' }, ref: 'LN-2024-00750', amountDue: 275000, daysOverdue: 25 }
  ];

  paymentsDue: PaymentDue[] = [
    { member: { name: 'John Kamau', id: 'SP-10015', initials: 'JK', color: 'purple' }, dueDate: 'Dec 20, 2024', amount: 15000, installment: '7/12' },
    { member: { name: 'Sarah Auma', id: 'SP-10089', initials: 'SA', color: 'orange' }, dueDate: 'Dec 21, 2024', amount: 42000, installment: '3/24' },
    { member: { name: 'Michael Odera', id: 'SP-10124', initials: 'MO', color: 'teal' }, dueDate: 'Dec 22, 2024', amount: 28500, installment: '10/18' },
    { member: { name: 'Faith Wairimu', id: 'SP-10201', initials: 'FW', color: 'orange' }, dueDate: 'Dec 23, 2024', amount: 55000, installment: '5/12' },
    { member: { name: 'George Otieno', id: 'SP-10245', initials: 'GO', color: 'teal' }, dueDate: 'Dec 24, 2024', amount: 32000, installment: '8/12' },
    { member: { name: 'Hannah Mwangi', id: 'SP-10312', initials: 'HM', color: 'red' }, dueDate: 'Dec 25, 2024', amount: 48000, installment: '4/24' }
  ];

  quickActions: QuickAction[] = [
    { icon: 'bi-file-earmark-plus', color: 'green', title: 'New Application', description: 'Submit a new loan application', action: 'newLoan' },
    { icon: 'bi-cash-coin', color: 'blue', title: 'Disburse Loan', description: 'Process pending disbursements', action: 'disburse' },
    { icon: 'bi-arrow-down-circle', color: 'teal', title: 'Record Payment', description: 'Log a repayment transaction', action: 'payment' },
    { icon: 'bi-file-earmark-arrow-down', color: 'purple', title: 'Export Report', description: 'Download loan portfolio report', action: 'export' }
  ];

  donutData: DonutSlice[] = [
    { label: 'Personal', value: 35, color: '#9c27b0' },
    { label: 'Business', value: 25, color: '#2196f3' },
    { label: 'Education', value: 15, color: '#00bcd4' },
    { label: 'Agriculture', value: 12, color: '#4caf50' },
    { label: 'Emergency', value: 8, color: '#f44336' },
    { label: 'Asset', value: 5, color: '#ff9800' }
  ];

  approvalSteps: ApprovalStepItem[] = [
    { title: 'Application Review', officer: 'System Auto-check', date: 'Dec 01, 2024', status: 'done' },
    { title: 'Credit Assessment', officer: 'David Otieno', date: 'Dec 02, 2024', status: 'done' },
    { title: 'Manager Approval', officer: 'Grace Akinyi', date: 'Dec 03, 2024', status: 'done' },
    { title: 'Disbursement', officer: 'Finance Team', date: 'Pending', status: 'pending-step' }
  ];

  amortizationSchedule: AmortizationRow[] = [
    { period: 1, paymentDate: 'Jan 05, 2025', principal: 20833, interest: 2500, total: 23333, balance: 229167, status: 'paid' },
    { period: 2, paymentDate: 'Feb 05, 2025', principal: 20833, interest: 2292, total: 23125, balance: 208334, status: 'paid' },
    { period: 3, paymentDate: 'Mar 05, 2025', principal: 20833, interest: 2083, total: 22916, balance: 187501, status: 'paid' },
    { period: 4, paymentDate: 'Apr 05, 2025', principal: 20833, interest: 1875, total: 22708, balance: 166668, status: 'pending' },
    { period: 5, paymentDate: 'May 05, 2025', principal: 20833, interest: 1667, total: 22500, balance: 145835, status: 'pending' },
    { period: 6, paymentDate: 'Jun 05, 2025', principal: 20833, interest: 1458, total: 22291, balance: 125002, status: 'pending' }
  ];

  /* ---------- Computed ---------- */

  get filteredLoans(): Loan[] {
    return this.loans.filter(l => {
      const matchesTab = this.activeTab === 'all' || l.status === this.activeTab;
      const matchesSearch = !this.searchQuery ||
        l.member.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.ref.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        l.purpose.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.filterType === 'all' || l.type === this.filterType;
      const matchesStatus = this.filterStatus === 'all' || l.status === this.filterStatus;
      return matchesTab && matchesSearch && matchesType && matchesStatus;
    });
  }

  get tabCounts(): TabCounts {
    return {
      all: this.loans.length,
      approved: this.loans.filter(l => l.status === 'approved').length,
      pending: this.loans.filter(l => l.status === 'pending').length,
      disbursed: this.loans.filter(l => l.status === 'disbursed').length,
      overdue: this.loans.filter(l => l.status === 'overdue').length
    };
  }

  get totalDisbursed(): number {
    return this.loans.filter(l => l.status === 'disbursed').reduce((sum, l) => sum + l.amount, 0);
  }

  get totalOverdue(): number {
    return this.overdueLoans.reduce((sum, o) => sum + o.amountDue, 0);
  }

  get totalPaymentsDue(): number {
    return this.paymentsDue.reduce((sum, p) => sum + p.amount, 0);
  }

  get overdueCount(): number {
    return this.overdueLoans.length;
  }

  get paymentsDueCount(): number {
    return this.paymentsDue.length;
  }

  get donutConic(): string {
    let deg = 0;
    const slices: string[] = [];
    for (const slice of this.donutData) {
      const next = deg + (slice.value / 100) * 360;
      slices.push(`${slice.color} ${deg}deg ${next}deg`);
      deg = next;
    }
    return `conic-gradient(${slices.join(', ')})`;
  }

  get memberActiveLoans(): number {
    if (!this.selectedMember) return 0;
    return this.loans.filter(l => l.member.id === this.selectedMember!.id).length;
  }

  get memberTotalBorrowed(): number {
    if (!this.selectedMember) return 0;
    return this.loans.filter(l => l.member.id === this.selectedMember!.id).reduce((s, l) => s + l.amount, 0);
  }

  /* ---------- Helpers ---------- */

  formatKES(n: number): string {
    return 'KES ' + n.toLocaleString('en-KE');
  }

  getLoanTypeClass(type: string): string {
    return type;
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      approved: 'bg-success-subtle text-success',
      pending: 'bg-warning-subtle text-warning',
      disbursed: 'bg-info-subtle text-info',
      overdue: 'bg-danger-subtle text-danger',
      rejected: 'bg-secondary-subtle text-secondary'
    };
    return map[status] || 'bg-secondary-subtle text-secondary';
  }

  getProgressClass(progress: number): string {
    if (progress >= 70) return 'good';
    if (progress >= 40) return 'warning';
    return 'danger';
  }

  /* ---------- Actions ---------- */

  setTab(tab: 'all' | 'approved' | 'pending' | 'disbursed' | 'overdue') {
    this.activeTab = tab;
  }

  openLoanDetail(loan: Loan) {
    this.selectedLoan = loan;
    this.showLoanDetail = true;
  }

  closeLoanDetail() {
    this.showLoanDetail = false;
    this.selectedLoan = null;
  }

  openNewLoan() {
    this.showNewLoan = true;
  }

  closeNewLoan() {
    this.showNewLoan = false;
    this.newLoan = { memberName: '', memberId: '', type: 'personal', amount: 0, interestRate: 12, term: 12, purpose: '', collateral: '', officer: '' };
  }

  submitNewLoan() {
    const newId = 'LN-2024-' + String(10000 + this.loans.length + 1).slice(-5);
    const loan: Loan = {
      id: String(this.loans.length + 1),
      ref: newId,
      member: { name: this.newLoan.memberName, id: this.newLoan.memberId, initials: this.newLoan.memberName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(), color: 'green' },
      type: this.newLoan.type,
      amount: this.newLoan.amount,
      interestRate: this.newLoan.interestRate,
      term: this.newLoan.term,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      repaymentProgress: 0,
      installment: `0/${this.newLoan.term}`,
      collateral: this.newLoan.collateral ? this.newLoan.collateral.split(',').map(c => c.trim()) : [],
      officer: this.newLoan.officer,
      purpose: this.newLoan.purpose
    };
    this.loans.unshift(loan);
    this.closeNewLoan();
    this.showToast('Loan application submitted successfully', 'success');
  }

  openDisburseModal(loan: Loan) {
    this.selectedLoan = loan;
    this.showDisburseModal = true;
  }

  closeDisburseModal() {
    this.showDisburseModal = false;
    this.disburseData = { method: 'mpesa', account: '', notes: '' };
  }

  confirmDisburse() {
    if (this.selectedLoan) {
      this.selectedLoan.status = 'disbursed';
      this.selectedLoan.disbursedDate = new Date().toISOString().split('T')[0];
    }
    this.closeDisburseModal();
    this.showToast('Loan disbursed successfully', 'success');
  }

  openRepaymentSchedule(loan: Loan) {
    this.scheduleLoan = loan;
    this.showRepaymentSchedule = true;
  }

  closeRepaymentSchedule() {
    this.showRepaymentSchedule = false;
    this.scheduleLoan = null;
  }

  openOverdueDetail(overdue: OverdueLoan) {
    this.selectedOverdue = overdue;
    this.showOverdueDetail = true;
  }

  closeOverdueDetail() {
    this.showOverdueDetail = false;
    this.selectedOverdue = null;
  }

  sendReminder(overdue: OverdueLoan) {
    this.showToast(`Payment reminder sent to ${overdue.member.name}`, 'info');
  }

  openMemberDetail(member: { name: string; id: string; initials: string; color: string }) {
    this.selectedMember = member;
    this.showMemberDetail = true;
  }

  closeMemberDetail() {
    this.showMemberDetail = false;
    this.selectedMember = null;
  }

  openExport() {
    this.showExportModal = true;
  }

  closeExport() {
    this.showExportModal = false;
  }

  confirmExport() {
    this.closeExport();
    this.showToast(`Loan report exported as ${this.exportFormat.toUpperCase()}`, 'success');
  }

  openOverview(type: string) {
    if (type === 'loans') this.showLoanOverview = true;
    if (type === 'pipeline') this.showPipelineOverview = true;
    if (type === 'overdue') this.showOverdueOverview = true;
    if (type === 'payments') this.showPaymentsOverview = true;
    if (type === 'activity') this.showActivityOverview = true;
  }

  closeOverview(type: string) {
    if (type === 'loans') this.showLoanOverview = false;
    if (type === 'pipeline') this.showPipelineOverview = false;
    if (type === 'overdue') this.showOverdueOverview = false;
    if (type === 'payments') this.showPaymentsOverview = false;
    if (type === 'activity') this.showActivityOverview = false;
  }

  approveLoan(loan: Loan) {
    loan.status = 'approved';
    loan.approvedDate = new Date().toISOString().split('T')[0];
    this.showToast(`Loan ${loan.ref} approved`, 'success');
  }

  rejectLoan(loan: Loan) {
    loan.status = 'rejected';
    this.showToast(`Loan ${loan.ref} rejected`, 'danger');
  }

  returnLoan(loan: Loan) {
    loan.status = 'pending';
    this.showToast(`Loan ${loan.ref} returned for review`, 'warning');
  }

  handleQuickAction(action: string) {
    if (action === 'newLoan') this.openNewLoan();
    if (action === 'disburse') {
      const pending = this.loans.find(l => l.status === 'approved');
      if (pending) this.openDisburseModal(pending);
      else this.showToast('No approved loans pending disbursement', 'warning');
    }
    if (action === 'payment') this.showToast('Record payment modal would open', 'info');
    if (action === 'export') this.openExport();
  }

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info') {
    const id = ++this.toastId;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.removeToast(id), 4000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}