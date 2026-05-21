import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type LoanStatus = 'Active' | 'Pending' | 'Approved' | 'Overdue' | 'Completed' | 'Rejected';
type LoanType = 'Personal' | 'Business' | 'Emergency' | 'Education' | 'Agriculture' | 'Asset Finance';
type PaymentStatus = 'Paid' | 'Upcoming' | 'Scheduled' | 'Overdue';
type ToastType = 'success' | 'danger' | 'warning' | 'info';
type LoanDetailTab = 'schedule' | 'payments' | 'approval' | 'documents';
type LoanTableTab = 'all' | 'active' | 'pending' | 'approved' | 'overdue' | 'completed' | 'rejected';
type NewLoanStep = 1 | 2 | 3 | 4;
type ActivityTab = 'recent' | 'overdue' | 'upcoming';

interface Toast { id: number; message: string; type: ToastType; }

interface LoanRecord {
  loanRef: string;
  memberInitials: string;
  memberName: string;
  memberId: string;
  memberPhone: string;
  memberEmail: string;
  memberNationalId: string;
  memberSacco: string;
  memberCreditScore: number;
  memberLoanHistory: string;
  memberCollateral: string;
  loanType: LoanType;
  amount: number;
  interest: number;
  tenure: number;
  repaymentProgress: number;
  repaymentInstallment: string;
  repaymentText: string;
  status: LoanStatus;
  date: string;
  disbursementMethod: string;
  disbursementAccount: string;
  // selected: boolean;
  selected?: boolean; 
  avatarColor: string;
  outstanding: number;
  totalInterest: number;
  nextPayment: string;
  schedule: ScheduleRow[];
  loanPurpose: string;
}

interface ScheduleRow {
  installment: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  status: PaymentStatus;
}

interface OverdueLoan {
  initials: string; name: string; memberId: string;
  loanRef: string; amountDue: number; daysOverdue: number; avatarColor: string;
}

interface UpcomingPayment {
  initials: string; name: string; memberId: string;
  dueDate: string; amount: number; installment: string; avatarColor: string;
}

interface ActivityItem { time: string; description: string; sub: string; }

interface BatchApproveRow { ref: string; member: string; type: LoanType; amount: number; creditScore: number; selected: boolean; }
interface BulkDisburseRow { ref: string; member: string; amount: number; channel: string; account: string; selected: boolean; }

@Component({
  selector: 'app-loan-disbursements',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './loan-disbursements.html',
  styleUrls: ['./loan-disbursements.scss'],
})
export class LoanDisbursementsComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private toastId = 0;
  private toastTimer?: number;

  // ---- Tabs ----
  tableTab: LoanTableTab = 'all';
  detailTab: LoanDetailTab = 'schedule';
  activityTab: ActivityTab = 'upcoming';

  // ---- Search & Filters ----
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  currentPage = 1;
  pageSize = 6;

  // ---- Selection ----
  allSelected = false;

  // ---- Modals ----
  showNewLoanModal = false;
  showApproveModal = false;
  showDisburseModal = false;
  showLoanDetailModal = false;
  showBatchApproveModal = false;
  showBulkDisburseModal = false;
  showRecordRepaymentModal = false;
  showLoanCalculatorModal = false;
  showReportsModal = false;
  showOverdueActionModal = false;
  showRemindModal = false;
  showPipelineModal = false;

  // ---- Active Loan ----
  activeLoan: LoanRecord | null = null;
  activeOverdueLoan: OverdueLoan | null = null;

  // ---- New Loan Wizard ----
  newLoanStep: NewLoanStep = 1;
  newLoan = {
    memberSearch: '', memberName: '', memberId: '', memberSacco: '',
    loanType: '', amount: 250000, interestRate: 14, tenure: 12,
    repaymentFrequency: 'Monthly', purpose: '', disbursementMethod: 'M-Pesa',
    disbursementAccount: '', collateralType: '', collateralValue: '',
    collateralDescription: '', guarantor1: '', guarantor2: '',
    supportingDocs: [] as string[], confirmed: false,
  };

  // ---- Approve Modal ----
  approvalForm = { approvedAmount: 0, interestRate: 14, notes: '', conditions: '' };

  // ---- Disburse Modal ----
  disburseForm = { method: 'M-Pesa', account: '', pin: '', confirmAmount: '', notes: '' };

  // ---- Record Repayment ----
  repaymentForm = { loanRef: '', member: '', amount: '', date: '', method: 'M-Pesa', transactionRef: '', notes: '' };

  // ---- Loan Calculator ----
  calcForm = { amount: 250000, rate: 14, tenure: 12, method: 'Reducing Balance' };
  calcResult = { monthly: 0, totalInterest: 0, totalRepayable: 0, processingFee: 0 };

  // ---- Batch Approve ----
  batchApproveNotes = '';
  batchApproveRows: BatchApproveRow[] = [];

  // ---- Bulk Disburse ----
  bulkDisbursePin = '';
  bulkDisburseConfirm = '';
  bulkDisburseRows: BulkDisburseRow[] = [];

  // ---- Reports ----
  reportType = 'Portfolio Summary';
  reportFormat = 'PDF';
  reportFrom = '';
  reportTo = '';

  // ---- Overdue Action ----
  overdueAction = 'send_reminder';
  overdueNotes = '';

  // ---- Remind ----
  remindChannel = 'sms';
  remindMessage = '';

  // ---- Pipeline ----
  pipelineExpanded = false;

  // ---- Activity ----
  activityItems: ActivityItem[] = [
    { time: 'Today, 2:30 PM', description: 'KES 250,000 disbursed to Mary Wanjiku (Personal Loan)', sub: 'Ref: LN-2024-00891 • via M-Pesa' },
    { time: 'Today, 1:15 PM', description: 'Loan application LN-2024-00890 approved by David Otieno', sub: 'Business Loan • KES 500,000' },
    { time: 'Today, 11:40 AM', description: 'Repayment of KES 15,000 received from John Kamau', sub: 'Ref: LN-2024-00845 • Installment 6/12' },
    { time: 'Today, 10:00 AM', description: 'Credit check completed for Grace Akinyi — Score: 742', sub: 'Education Loan • KES 300,000 requested' },
    { time: 'Yesterday, 4:50 PM', description: 'New loan application submitted by Peter Omondi', sub: 'Agriculture Loan • KES 150,000 • Awaiting KYC review' },
    { time: 'Yesterday, 2:20 PM', description: 'Loan LN-2024-00820 flagged as overdue — Alice Muthoni', sub: 'Personal Loan • KES 25,000 overdue • 15 days past due' },
  ];

  overdueLoans: OverdueLoan[] = [
    { initials: 'AM', name: 'Alice Muthoni', memberId: 'SP-10042', loanRef: 'LN-2024-00820', amountDue: 25000, daysOverdue: 15, avatarColor: '#f44336' },
    { initials: 'BK', name: 'Bernard Kiprop', memberId: 'SP-10078', loanRef: 'LN-2024-00798', amountDue: 350000, daysOverdue: 22, avatarColor: '#ff9800' },
    { initials: 'CN', name: 'Catherine Njeri', memberId: 'SP-10156', loanRef: 'LN-2024-00775', amountDue: 180000, daysOverdue: 30, avatarColor: '#9c27b0' },
    { initials: 'EW', name: 'Evans Wafula', memberId: 'SP-10203', loanRef: 'LN-2024-00810', amountDue: 95000, daysOverdue: 8, avatarColor: '#2196f3' },
  ];

  upcomingPayments: UpcomingPayment[] = [
    { initials: 'JK', name: 'John Kamau', memberId: 'SP-10015', dueDate: 'Dec 20, 2024', amount: 15000, installment: '7/12', avatarColor: '#00d084' },
    { initials: 'SA', name: 'Sarah Auma', memberId: 'SP-10089', dueDate: 'Dec 21, 2024', amount: 42000, installment: '3/24', avatarColor: '#00bcd4' },
    { initials: 'MO', name: 'Michael Odera', memberId: 'SP-10124', dueDate: 'Dec 22, 2024', amount: 28500, installment: '10/18', avatarColor: '#9c27b0' },
    { initials: 'FW', name: 'Faith Wairimu', memberId: 'SP-10201', dueDate: 'Dec 23, 2024', amount: 55000, installment: '5/12', avatarColor: '#ff5722' },
  ];

  loans: LoanRecord[] = [];

  ngOnInit(): void {
    this.buildLoans();
    this.calculateLoan();
    this.buildBatchRows();
    this.buildBulkRows();
  }

  ngOnDestroy(): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  }

  @HostListener('document:keydown.escape')
  closeAllModals(): void {
    this.showNewLoanModal = false;
    this.showApproveModal = false;
    this.showDisburseModal = false;
    this.showLoanDetailModal = false;
    this.showBatchApproveModal = false;
    this.showBulkDisburseModal = false;
    this.showRecordRepaymentModal = false;
    this.showLoanCalculatorModal = false;
    this.showReportsModal = false;
    this.showOverdueActionModal = false;
    this.showRemindModal = false;
    this.showPipelineModal = false;
    document.body.style.overflow = '';
  }

  private open(): void { document.body.style.overflow = 'hidden'; }

  openNewLoan(): void { this.newLoanStep = 1; this.newLoan = { memberSearch: '', memberName: '', memberId: '', memberSacco: '', loanType: '', amount: 250000, interestRate: 14, tenure: 12, repaymentFrequency: 'Monthly', purpose: '', disbursementMethod: 'M-Pesa', disbursementAccount: '', collateralType: '', collateralValue: '', collateralDescription: '', guarantor1: '', guarantor2: '', supportingDocs: [], confirmed: false }; this.showNewLoanModal = true; this.open(); }
  openApprove(loan: LoanRecord): void { this.activeLoan = loan; this.approvalForm = { approvedAmount: loan.amount, interestRate: loan.interest, notes: '', conditions: '' }; this.showApproveModal = true; this.open(); }
  openDisburse(loan: LoanRecord): void { this.activeLoan = loan; this.disburseForm = { method: loan.disbursementMethod, account: loan.disbursementAccount, pin: '', confirmAmount: '', notes: '' }; this.showDisburseModal = true; this.open(); }
  openDetail(loan: LoanRecord): void { this.activeLoan = loan; this.detailTab = 'schedule'; this.showLoanDetailModal = true; this.open(); }
  openBatchApprove(): void { this.buildBatchRows(); this.batchApproveNotes = ''; this.showBatchApproveModal = true; this.open(); }
  openBulkDisburse(): void { this.buildBulkRows(); this.bulkDisbursePin = ''; this.bulkDisburseConfirm = ''; this.showBulkDisburseModal = true; this.open(); }
  openRepayment(loan?: LoanRecord): void { this.repaymentForm = { loanRef: loan?.loanRef || '', member: loan?.memberName || '', amount: '', date: '', method: 'M-Pesa', transactionRef: '', notes: '' }; this.showRecordRepaymentModal = true; this.open(); }
  openCalculator(): void { this.calculateLoan(); this.showLoanCalculatorModal = true; this.open(); }
  openReports(): void { this.showReportsModal = true; this.open(); }
  openOverdueAction(loan: OverdueLoan): void { this.activeOverdueLoan = loan; this.overdueAction = 'send_reminder'; this.overdueNotes = ''; this.showOverdueActionModal = true; this.open(); }
  openRemind(payment: UpcomingPayment): void { this.remindChannel = 'sms'; this.remindMessage = `Dear ${payment.name}, your loan repayment of KES ${payment.amount.toLocaleString('en-KE')} is due on ${payment.dueDate}. Installment ${payment.installment}.`; this.showRemindModal = true; this.open(); }
  openPipeline(): void { this.showPipelineModal = true; this.open(); }

  // ---- New Loan Wizard ----
  nextLoanStep(): void { if (this.newLoanStep < 4) this.newLoanStep = (this.newLoanStep + 1) as NewLoanStep; }
  prevLoanStep(): void { if (this.newLoanStep > 1) this.newLoanStep = (this.newLoanStep - 1) as NewLoanStep; }

  get newLoanMonthly(): number {
    if (!this.newLoan.amount || !this.newLoan.tenure) return 0;
    const r = this.newLoan.interestRate / 100 / 12;
    const n = this.newLoan.tenure;
    if (r === 0) return this.newLoan.amount / n;
    return (this.newLoan.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  get newLoanTotalInterest(): number { return (this.newLoanMonthly * this.newLoan.tenure) - this.newLoan.amount; }
  get newLoanTotalRepayable(): number { return this.newLoanMonthly * this.newLoan.tenure; }

  submitNewLoan(): void {
    if (!this.newLoan.confirmed) return;
    const ref = `LN-2024-${String(this.loans.length + 900).padStart(5, '0')}`;
    const newRec: LoanRecord = {
      loanRef: ref, memberInitials: this.newLoan.memberName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      memberName: this.newLoan.memberName || 'New Member', memberId: this.newLoan.memberId || 'SP-NEW',
      memberPhone: '+254 700 000 000', memberEmail: 'member@email.com', memberNationalId: 'XXXXXX',
      memberSacco: this.newLoan.memberSacco || 'Rongo SACCO', memberCreditScore: 700, memberLoanHistory: 'First loan',
      memberCollateral: this.newLoan.collateralType || 'Savings', avatarColor: '#00d084',
      loanType: (this.newLoan.loanType as LoanType) || 'Personal', amount: this.newLoan.amount,
      interest: this.newLoan.interestRate, tenure: this.newLoan.tenure, repaymentProgress: 0,
      repaymentInstallment: `0/${this.newLoan.tenure}`, repaymentText: 'Awaiting 0%', status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      disbursementMethod: this.newLoan.disbursementMethod, disbursementAccount: this.newLoan.disbursementAccount,
      outstanding: this.newLoan.amount, totalInterest: this.newLoanTotalInterest, nextPayment: '—',
      loanPurpose: this.newLoan.purpose, schedule: this.buildSchedule(this.newLoan.amount, this.newLoan.interestRate, this.newLoan.tenure),
    };
    this.loans = [newRec, ...this.loans];
    this.closeAllModals();
    this.showToast('success', `Loan application ${ref} submitted for review.`);
  }

  // ---- Approve ----
  confirmApproval(): void {
    if (!this.activeLoan) return;
    this.activeLoan.status = 'Approved';
    this.closeAllModals();
    this.showToast('success', `Loan ${this.activeLoan.loanRef} approved successfully.`);
  }

  // ---- Disburse ----
  confirmDisburse(): void {
    if (!this.activeLoan || !this.disburseForm.pin || this.disburseForm.confirmAmount !== String(this.activeLoan.amount)) return;
    this.activeLoan.status = 'Active';
    this.closeAllModals();
    this.showToast('success', `KES ${this.activeLoan.amount.toLocaleString('en-KE')} disbursed via ${this.disburseForm.method}.`);
  }

  get canDisburse(): boolean { return Boolean(this.disburseForm.pin) && this.disburseForm.confirmAmount === String(this.activeLoan?.amount); }

  // ---- Batch Approve ----
  get batchSelectedCount(): number { return this.batchApproveRows.filter(r => r.selected).length; }
  confirmBatchApprove(): void {
    const count = this.batchSelectedCount;
    if (!count) return;
    this.batchApproveRows.filter(r => r.selected).forEach(row => {
      const loan = this.loans.find(l => l.loanRef === row.ref);
      if (loan) loan.status = 'Approved';
    });
    this.closeAllModals();
    this.showToast('success', `${count} loan(s) approved in batch.`);
  }

  // ---- Bulk Disburse ----
  get bulkSelected(): BulkDisburseRow[] { return this.bulkDisburseRows.filter(r => r.selected); }
  get bulkTotal(): number { return this.bulkSelected.reduce((s, r) => s + r.amount, 0); }
  get canBulkDisburse(): boolean { return Boolean(this.bulkDisbursePin) && this.bulkDisburseConfirm === String(this.bulkTotal); }
  confirmBulkDisburse(): void {
    if (!this.canBulkDisburse) return;
    const count = this.bulkSelected.length;
    this.closeAllModals();
    this.showToast('success', `Bulk disbursement of KES ${this.bulkTotal.toLocaleString('en-KE')} processed for ${count} loan(s).`);
  }

  // ---- Record Repayment ----
  submitRepayment(): void {
    if (!this.repaymentForm.loanRef || !this.repaymentForm.amount) return;
    this.closeAllModals();
    this.showToast('success', `Repayment of KES ${Number(this.repaymentForm.amount).toLocaleString('en-KE')} recorded.`);
  }

  // ---- Loan Calculator ----
  calculateLoan(): void {
    const P = this.calcForm.amount;
    const rAnnual = this.calcForm.rate / 100;
    const n = this.calcForm.tenure;
    const processingFee = P * 0.01;
    if (this.calcForm.method === 'Flat Rate') {
      const totalInterest = P * rAnnual * (n / 12);
      const total = P + totalInterest;
      this.calcResult = { monthly: total / n, totalInterest, totalRepayable: total, processingFee };
    } else {
      const r = rAnnual / 12;
      const monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalRepayable = monthly * n;
      this.calcResult = { monthly, totalInterest: totalRepayable - P, totalRepayable, processingFee };
    }
  }

  createFromCalc(): void {
    this.closeAllModals();
    this.newLoan.amount = this.calcForm.amount;
    this.newLoan.interestRate = this.calcForm.rate;
    this.newLoan.tenure = this.calcForm.tenure;
    this.showNewLoanModal = true;
    this.open();
  }

  // ---- Reports ----
  generateReport(): void {
    this.closeAllModals();
    this.showToast('success', `${this.reportType} exported as ${this.reportFormat}.`);
  }

  // ---- Overdue Action ----
  applyOverdueAction(): void {
    this.closeAllModals();
    this.showToast('success', `Action applied to ${this.activeOverdueLoan?.name}'s overdue loan.`);
  }

  // ---- Remind ----
  sendReminder(): void {
    if (!this.remindMessage.trim()) return;
    this.closeAllModals();
    this.showToast('success', `Reminder sent via ${this.remindChannel.toUpperCase()}.`);
  }

  // ---- Selection ----
  toggleAll(): void { this.filteredLoans.forEach(l => (l.selected = this.allSelected)); }
  get selectedCount(): number { return this.loans.filter(l => l.selected).length; }

  // ---- Pagination & Filter ----
  get filteredLoans(): LoanRecord[] {
    let rows = [...this.loans];
    if (this.tableTab !== 'all') rows = rows.filter(l => l.status.toLowerCase() === this.tableTab);
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      rows = rows.filter(l => l.memberName.toLowerCase().includes(q) || l.loanRef.toLowerCase().includes(q) || l.memberId.toLowerCase().includes(q));
    }
    if (this.filterType) rows = rows.filter(l => l.loanType === this.filterType);
    if (this.filterStatus) rows = rows.filter(l => l.status === this.filterStatus);
    return rows;
  }

  get paginatedLoans(): LoanRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredLoans.slice(start, start + this.pageSize);
  }

  get totalPages(): number { return Math.ceil(this.filteredLoans.length / this.pageSize) || 1; }
  get pageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filteredLoans.length); }
  get visiblePages(): number[] {
    const total = this.totalPages; const cur = this.currentPage;
    let start = Math.max(1, cur - 2); const end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  goToPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  tabCount(tab: LoanTableTab): number {
    if (tab === 'all') return this.loans.length;
    return this.loans.filter(l => l.status.toLowerCase() === tab).length;
  }

  typeColor(type: LoanType): string {
    const m: Record<string, string> = { Personal: '#00d084', Business: '#2196f3', Emergency: '#f44336', Education: '#00bcd4', Agriculture: '#4caf50', 'Asset Finance': '#9c27b0' };
    return m[type] || '#00d084';
  }

  // ---- Data Builders ----
  private buildLoans(): void {
    const data = [
      { ref: 'LN-2024-00891', name: 'Mary Wanjiku', id: 'SP-10023', initials: 'MW', color: '#00d084', type: 'Personal' as LoanType, amount: 250000, interest: 14, tenure: 12, status: 'Active' as LoanStatus, progress: 25, inst: '3/12', txt: '25%', date: 'Dec 15, 2024', method: 'M-Pesa', acc: '0722-XXX-XXX', phone: '+254 722 123 456', email: 'mary.w@email.com', natid: '28456321', sacco: 'Ukulima SACCO', credit: 756, history: '3 loans (2 completed, 1 active)', collateral: 'Savings (KES 180,000) + 2 Guarantors' },
      { ref: 'LN-2024-00898', name: 'Philip Ochieng', id: 'SP-10087', initials: 'PO', color: '#2196f3', type: 'Business' as LoanType, amount: 500000, interest: 16, tenure: 24, status: 'Approved' as LoanStatus, progress: 0, inst: 'Awaiting', txt: '0%', date: 'Dec 15, 2024', method: 'Bank Transfer', acc: 'KCB-XXXX5678', phone: '+254 733 456 789', email: 'philip.o@email.com', natid: '30789456', sacco: 'Rongo SACCO', credit: 742, history: '2 loans (2 completed)', collateral: 'Business Assets' },
      { ref: 'LN-2024-00889', name: 'Peter Omondi', id: 'SP-10145', initials: 'PO', color: '#ff9800', type: 'Agriculture' as LoanType, amount: 150000, interest: 12, tenure: 18, status: 'Pending' as LoanStatus, progress: 0, inst: 'Pending', txt: '—', date: 'Dec 14, 2024', method: 'M-Pesa', acc: '0710-XXX-XXX', phone: '+254 710 789 012', email: 'peter.o@email.com', natid: '27890345', sacco: 'Rongo SACCO', credit: 712, history: '1 loan (1 completed)', collateral: 'Farm Assets' },
      { ref: 'LN-2024-00820', name: 'Alice Muthoni', id: 'SP-10042', initials: 'AM', color: '#f44336', type: 'Personal' as LoanType, amount: 200000, interest: 14, tenure: 12, status: 'Overdue' as LoanStatus, progress: 58, inst: '7/12', txt: '58%', date: 'Jun 10, 2024', method: 'M-Pesa', acc: '0701-XXX-XXX', phone: '+254 701 234 567', email: 'alice.m@email.com', natid: '29123456', sacco: 'Rongo SACCO', credit: 640, history: '2 loans (1 completed, 1 active)', collateral: 'Land Title' },
      { ref: 'LN-2024-00845', name: 'John Kamau', id: 'SP-10015', initials: 'JK', color: '#00bcd4', type: 'Education' as LoanType, amount: 180000, interest: 12, tenure: 12, status: 'Active' as LoanStatus, progress: 50, inst: '6/12', txt: '50%', date: 'Jul 01, 2024', method: 'Bank Transfer', acc: 'Equity-XXXX1234', phone: '+254 720 567 890', email: 'john.k@email.com', natid: '28567890', sacco: 'Rongo SACCO', credit: 780, history: '2 loans (2 completed)', collateral: 'Savings + Guarantor' },
      { ref: 'LN-2024-00758', name: 'Rose Nyambura', id: 'SP-10087', initials: 'RN', color: '#9c27b0', type: 'Emergency' as LoanType, amount: 50000, interest: 18, tenure: 6, status: 'Completed' as LoanStatus, progress: 100, inst: '6/6', txt: '100%', date: 'Mar 15, 2024', method: 'M-Pesa', acc: '0755-XXX-XXX', phone: '+254 755 890 123', email: 'rose.n@email.com', natid: '31234567', sacco: 'Rongo SACCO', credit: 810, history: '3 loans (3 completed)', collateral: 'None' },
    ];

    this.loans = data.map(d => ({
      loanRef: d.ref, memberInitials: d.initials, memberName: d.name, memberId: d.id,
      memberPhone: d.phone, memberEmail: d.email, memberNationalId: d.natid,
      memberSacco: d.sacco, memberCreditScore: d.credit, memberLoanHistory: d.history,
      memberCollateral: d.collateral, avatarColor: d.color,
      loanType: d.type, amount: d.amount, interest: d.interest, tenure: d.tenure,
      repaymentProgress: d.progress, repaymentInstallment: d.inst, repaymentText: d.txt,
      status: d.status, date: d.date, disbursementMethod: d.method, disbursementAccount: d.acc,
      outstanding: d.amount * (1 - d.progress / 100), totalInterest: d.amount * d.interest / 100,
      nextPayment: d.status === 'Active' ? 'Dec 20' : '—',
      loanPurpose: `${d.type} loan purpose`, selected: false,
      schedule: this.buildSchedule(d.amount, d.interest, d.tenure),
    }));
  }

  private buildSchedule(amount: number, rate: number, tenure: number): ScheduleRow[] {
    const r = rate / 100 / 12;
    const monthly = r === 0 ? amount / tenure : (amount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
    let bal = amount;
    return Array.from({ length: Math.min(tenure, 12) }, (_, i) => {
      const interest = bal * r;
      const principal = monthly - interest;
      bal -= principal;
      const statusMap: PaymentStatus[] = ['Paid', 'Paid', 'Paid', 'Upcoming', 'Scheduled', 'Scheduled'];
      return { installment: i + 1, dueDate: `${['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i]} 15, ${i < 3 ? 2024 : 2025}`, principal: Math.round(principal), interest: Math.round(interest), total: Math.round(monthly), status: statusMap[i] || 'Scheduled' };
    });
  }

  private buildBatchRows(): void {
    this.batchApproveRows = this.loans.filter(l => l.status === 'Pending').map(l => ({
      ref: l.loanRef, member: l.memberName, type: l.loanType, amount: l.amount, creditScore: l.memberCreditScore, selected: true,
    }));
    if (this.batchApproveRows.length === 0) {
      this.batchApproveRows = [
        { ref: 'LN-2024-00889', member: 'Peter Omondi', type: 'Agriculture', amount: 150000, creditScore: 712, selected: true },
        { ref: 'LN-2024-00888', member: 'Grace Akinyi', type: 'Education', amount: 300000, creditScore: 742, selected: true },
        { ref: 'LN-2024-00887', member: 'Daniel Kipchoge', type: 'Business', amount: 400000, creditScore: 645, selected: false },
      ];
    }
  }

  private buildBulkRows(): void {
    this.bulkDisburseRows = this.loans.filter(l => l.status === 'Approved').map(l => ({
      ref: l.loanRef, member: l.memberName, amount: l.amount, channel: l.disbursementMethod, account: l.disbursementAccount, selected: true,
    }));
    if (this.bulkDisburseRows.length === 0) {
      this.bulkDisburseRows = [
        { ref: 'LN-2024-00898', member: 'Philip Ochieng', amount: 500000, channel: 'M-Pesa', account: '0722-XXX-XXX', selected: true },
        { ref: 'LN-2024-00886', member: 'Janet Wambui', amount: 100000, channel: 'Bank', account: 'KCB-XXXX5678', selected: true },
        { ref: 'LN-2024-00885', member: 'Samuel Kibet', amount: 75000, channel: 'M-Pesa', account: '0710-XXX-XXX', selected: true },
      ];
    }
  }

  showToast(type: ToastType, message: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, type, message });
    window.setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 3000);
  }

  dismissToast(id: number): void { this.toasts = this.toasts.filter(t => t.id !== id); }
}
