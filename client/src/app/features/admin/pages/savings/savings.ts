import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ModalKey =
  | 'deposit' | 'withdrawal' | 'interest' | 'reports' | 'shares' | 'transfer'
  | 'fixed' | 'dividends' | 'txDetail' | 'accountDetail' | 'otp' | 'fullLog'
  | 'pendingOtp' | 'savingsPlanCreate' | 'savingsPlanDetail' | 'pausePlan'
  | 'reviewWithdrawals' | 'savingsDistDetail' | 'newDeposit' | 'interestConfig'
  | null;

type ToastType = 'success' | 'danger' | 'warning' | 'info';

interface AccountStat { label: string; value: string; state?: 'positive' | 'negative' | 'badge' | 'warning'; }
interface AccountAction { label: string; modal: ModalKey; variant: 'primary' | 'outline' | 'danger-outline' | 'blue-outline' | 'orange-outline' | 'purple-outline'; }

interface SavingsAccount {
  id: string; title: string; balance: string; sub: string; iconLabel: string;
  tone: 'green' | 'navy' | 'cyan' | 'orange' | 'purple' | 'red';
  lockLabel: string; lockState: 'locked' | 'unlocked' | 'warning';
  stats: AccountStat[]; actions: AccountAction[];
}

interface QuickAction { label: string; helper: string; iconLabel: string; tone: string; modal: ModalKey; }

interface Transaction {
  ref: string; member: string; id: string; initials: string; avatar: string;
  type: string; account: string; amount: string; amountState: 'positive' | 'negative' | 'neutral';
  channel: string; channelIcon: string; status: string; statusState: 'success' | 'pending' | 'active' | 'awaiting';
  date: string; selected: boolean;
}

interface ActivityItem { tone: string; time: string; tag: string; tagTone: string; title: string; detail: string; action?: { label: string; modal: ModalKey }; }

interface InterestRow { account: string; current: string; newRate: string; method: string; updated: string; tone: string; }

interface SavingsPlan {
  id: string; name: string; goal: number; targetAmount: number; collected: number;
  members: number; monthlyContribution: number; frequency: string; interestRate: number;
  startDate: string; endDate: string; status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  category: 'Holiday' | 'Education' | 'Business' | 'Emergency' | 'Investment' | 'Custom';
  autoDebit: boolean; description: string;
}

interface PendingWithdrawal { member: string; memberId: string; amount: number; channel: string; ref: string; otpSent: string; requestedAt: string; }

@Component({
  selector: 'app-treasury-savings',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './savings.html',
  styleUrls: ['./savings.scss'],
})
export class SavingsComponent implements OnInit, OnDestroy {
  modal: ModalKey = null;
  selectedAccount: SavingsAccount | null = null;
  selectedTx: Transaction | null = null;
  selectedPlan: SavingsPlan | null = null;
  activePendingOtp: PendingWithdrawal | null = null;

  depositStep = 1;
  withdrawStep = 1;
  activeTab: 'all' | 'deposits' | 'withdrawals' | 'shares' | 'transfers' | 'interest' | 'pending' = 'all';
  search = '';
  typeFilter = 'all';
  accountFilter = 'all';
  pageSize = 6;
  currentPage = 1;
  allSelected = false;

  toasts: { id: number; message: string; type: ToastType }[] = [];
  private toastId = 0;

  readonly depositSteps = ['Member', 'Details', 'Channel', 'Confirm'];
  readonly withdrawSteps = ['Member', 'Details', 'Destination', 'OTP Verify', 'Confirm'];

  depositForm = {
    member: 'Mary Wanjiku', sacco: 'Ukulima SACCO', account: 'Regular Savings',
    amount: 25000, channel: 'M-Pesa', reference: 'QJK8X2M1PL', note: 'Monthly member savings',
  };

  withdrawForm = {
    member: 'Peter Omondi', sacco: 'All SACCOs', account: 'Emergency Fund',
    amount: 50000, destination: 'M-Pesa', destinationAccount: '0722-XXX-789',
    bankName: 'Equity Bank', otp: '', reason: 'Personal Use', priority: 'Standard (1-2 hours)',
    adminPin: '',
  };

  shareForm = { member: 'John Kamau', shares: 10, source: 'Regular Savings', pricePerShare: 1000 };
  transferForm = { member: 'Mary Wanjiku', from: 'Regular Savings', to: 'Holiday / Merry-Go-Round', amount: 12000, note: 'Holiday savings allocation' };
  fixedForm = { member: '', amount: 200000, term: '6 Months', rate: 10, source: 'Regular Savings', interestPayout: 'At Maturity', autoRenew: false };
  reportForm = { type: 'Savings Transactions', period: 'This Month', format: 'PDF' };
  dividendForm = { period: 'FY 2024', destination: 'Credit to Regular Savings', totalPool: 3420000, rate: 12, eligibleMembers: 1247 };
  otpCode = '';
  otpDigits = ['', '', '', '', '', ''];
  interestConfigForm = { account: 'Regular Savings', rate: 7, method: 'Compound (Monthly)', notes: '' };

  // Savings Plan
  planForm: SavingsPlan = this.newPlanTemplate();
  pauseReason = '';

  savingsPlans: SavingsPlan[] = [
    { id: 'PLN-001', name: 'December Holiday Pool', goal: 500000, targetAmount: 500000, collected: 340000, members: 42, monthlyContribution: 4000, frequency: 'Monthly', interestRate: 5, startDate: '2024-01-01', endDate: '2024-12-15', status: 'Active', category: 'Holiday', autoDebit: true, description: 'Year-end holiday savings pool with bonus payout' },
    { id: 'PLN-002', name: 'Education Fund 2025', goal: 1200000, targetAmount: 1200000, collected: 875000, members: 86, monthlyContribution: 5000, frequency: 'Monthly', interestRate: 8, startDate: '2024-03-01', endDate: '2025-08-31', status: 'Active', category: 'Education', autoDebit: true, description: 'Tuition and school fees savings for 2025 academic year' },
    { id: 'PLN-003', name: 'Small Business Start-Up', goal: 300000, targetAmount: 300000, collected: 180000, members: 24, monthlyContribution: 7500, frequency: 'Monthly', interestRate: 10, startDate: '2024-02-01', endDate: '2025-02-01', status: 'Paused', category: 'Business', autoDebit: false, description: 'Capital pool for member-led business ventures' },
    { id: 'PLN-004', name: 'Emergency Reserve', goal: 800000, targetAmount: 800000, collected: 620000, members: 138, monthlyContribution: 2500, frequency: 'Monthly', interestRate: 6, startDate: '2024-01-15', endDate: '2025-12-31', status: 'Active', category: 'Emergency', autoDebit: true, description: 'Rapid access reserve for unforeseen member emergencies' },
  ];

  pendingWithdrawals: PendingWithdrawal[] = [
    { member: 'Grace Akinyi', memberId: 'SP-10067', amount: 80000, channel: 'KCB Bank', ref: 'WDR-2024-03458', otpSent: '0722-XXX-456 (SMS)', requestedAt: 'Dec 17, 2:00 PM' },
    { member: 'Daniel Mwangi', memberId: 'SP-10134', amount: 65000, channel: 'M-Pesa', ref: 'WDR-2024-03459', otpSent: '0710-XXX-901 (SMS)', requestedAt: 'Dec 17, 3:15 PM' },
    { member: 'Faith Wairimu', memberId: 'SP-10198', amount: 40000, channel: 'SACCOPay Wallet', ref: 'WDR-2024-03460', otpSent: '0733-XXX-205 (Push)', requestedAt: 'Dec 17, 4:00 PM' },
  ];

  // Account cards
  accountCards: SavingsAccount[] = [
    { id: 'shares', title: 'Share Capital', balance: 'KES 28.5M', sub: '1,247 shareholders • KES 1,000/share', iconLabel: 'SC', tone: 'navy', lockLabel: 'Non-Withdrawable', lockState: 'locked',
      stats: [{ label: 'Total Shares Issued', value: '28,500' }, { label: 'Members with Shares', value: '1,247' }, { label: 'Avg Shares/Member', value: '22.8' }, { label: 'New Shares (This Month)', value: '+342', state: 'positive' }],
      actions: [{ label: 'Buy Shares', modal: 'shares', variant: 'blue-outline' }, { label: 'Details', modal: 'accountDetail', variant: 'outline' }] },
    { id: 'regular', title: 'Regular Savings', balance: 'KES 67.3M', sub: '1,580 accounts • 7% p.a. interest', iconLabel: 'RS', tone: 'green', lockLabel: 'Withdrawable', lockState: 'unlocked',
      stats: [{ label: 'Active Accounts', value: '1,580' }, { label: 'Deposits (Month)', value: '+KES 8.2M', state: 'positive' }, { label: 'Withdrawals (Month)', value: '-KES 3.1M', state: 'negative' }, { label: 'Interest Earned (YTD)', value: 'KES 4.7M', state: 'positive' }],
      actions: [{ label: 'Deposit', modal: 'deposit', variant: 'primary' }, { label: 'Withdraw', modal: 'withdrawal', variant: 'outline' }] },
    { id: 'fixed', title: 'Fixed Deposits', balance: 'KES 42.1M', sub: '328 accounts • 9-12% p.a.', iconLabel: 'FD', tone: 'cyan', lockLabel: 'Term-Locked', lockState: 'locked',
      stats: [{ label: 'Active FDs', value: '328' }, { label: 'Maturing (30 days)', value: '18', state: 'warning' }, { label: 'Avg Interest Rate', value: '10.5% p.a.', state: 'badge' }, { label: 'Interest Payable', value: 'KES 1.8M', state: 'positive' }],
      actions: [{ label: 'New FD', modal: 'fixed', variant: 'blue-outline' }, { label: 'Details', modal: 'accountDetail', variant: 'outline' }] },
    { id: 'holiday', title: 'Holiday / Merry-Go-Round', balance: 'KES 5.8M', sub: '412 members • Dec release', iconLabel: 'HD', tone: 'orange', lockLabel: 'Seasonal', lockState: 'warning',
      stats: [{ label: 'Target Amount', value: 'KES 8.5M' }, { label: 'Progress', value: '68%', state: 'warning' }, { label: 'Release Date', value: 'Dec 20, 2024' }, { label: 'Interest Rate', value: '5% p.a.', state: 'badge' }],
      actions: [{ label: 'Deposit', modal: 'deposit', variant: 'orange-outline' }, { label: 'Details', modal: 'accountDetail', variant: 'outline' }] },
    { id: 'junior', title: 'Junior Savings (Watoto)', balance: 'KES 3.2M', sub: '186 accounts • 8% p.a.', iconLabel: 'JS', tone: 'purple', lockLabel: 'Until 18 yrs', lockState: 'locked',
      stats: [{ label: 'Active Juniors', value: '186' }, { label: 'Deposits (Month)', value: '+KES 380K', state: 'positive' }, { label: 'Avg Balance', value: 'KES 17,200' }, { label: 'Interest Rate', value: '8% p.a.', state: 'badge' }],
      actions: [{ label: 'Deposit', modal: 'deposit', variant: 'purple-outline' }, { label: 'Details', modal: 'accountDetail', variant: 'outline' }] },
    { id: 'emergency', title: 'Emergency Fund', balance: 'KES 8.9M', sub: '892 members • 6% p.a.', iconLabel: 'EF', tone: 'red', lockLabel: 'Quick Access', lockState: 'unlocked',
      stats: [{ label: 'Active Accounts', value: '892' }, { label: 'Withdrawals (Month)', value: '-KES 1.2M', state: 'negative' }, { label: 'Max Withdrawal', value: '80% of balance' }, { label: 'Processing Time', value: 'Instant (M-Pesa)' }],
      actions: [{ label: 'Deposit', modal: 'deposit', variant: 'danger-outline' }, { label: 'Withdraw', modal: 'withdrawal', variant: 'outline' }] },
  ];

  quickActions: QuickAction[] = [
    { label: 'Deposit', helper: 'Process member deposit', iconLabel: '⊕', tone: 'green', modal: 'deposit' },
    { label: 'Withdrawal', helper: 'Process withdrawal request', iconLabel: '⊖', tone: 'red', modal: 'withdrawal' },
    { label: 'Buy Shares', helper: 'Purchase share capital', iconLabel: '📈', tone: 'blue', modal: 'shares' },
    { label: 'Transfer', helper: 'Between savings accounts', iconLabel: '⇄', tone: 'cyan', modal: 'transfer' },
    { label: 'New Fixed Deposit', helper: 'Create term deposit', iconLabel: '🔒', tone: 'navy', modal: 'fixed' },
    { label: 'Dividends', helper: 'Process dividend distribution', iconLabel: '🎁', tone: 'purple', modal: 'dividends' },
    { label: 'Interest Config', helper: 'Set interest rates', iconLabel: '%', tone: 'orange', modal: 'interestConfig' },
  ];

  activityItems: ActivityItem[] = [
    { tone: 'green', time: 'Today, 2:30 PM', tag: 'Fixed Deposit', tagTone: 'green',
      title: 'Sarah Auma created new FD of KES 200,000 for 12 months at 10% p.a.',
      detail: 'Maturity: Dec 18, 2025 • Ref: FD-2024-00234' },
    { tone: 'blue', time: 'Yesterday, 4:20 PM', tag: 'Bulk', tagTone: 'blue',
      title: 'Monthly salary deductions processed — KES 2.4M deposited for 342 members',
      detail: 'Auto-deduction via payroll • All confirmed' },
    { tone: 'orange', time: 'Yesterday, 2:00 PM', tag: 'Pending OTP', tagTone: 'orange',
      title: 'Withdrawal of KES 80,000 by Grace Akinyi — awaiting member OTP verification',
      detail: 'Regular Savings → KCB Bank • OTP sent to 0722-XXX-456',
      action: { label: 'Process OTP', modal: 'pendingOtp' } },
    { tone: 'cyan', time: 'Dec 16, 11:15 AM', tag: 'Transfer', tagTone: 'cyan',
      title: 'Mary Wanjiku transferred KES 12,000 from Regular to Holiday Fund',
      detail: 'Auto-allocated • Holiday savings plan #HOL-2024' },
  ];

  interestRows: InterestRow[] = [
    { account: 'Regular Savings', current: '7% p.a.', newRate: '7.5% p.a.', method: 'Compound Monthly', updated: 'Dec 12, 2024', tone: 'green' },
    { account: 'Fixed Deposits', current: '10% p.a.', newRate: '10% p.a.', method: 'Simple', updated: 'Dec 10, 2024', tone: 'cyan' },
    { account: 'Junior Savings', current: '8% p.a.', newRate: '8.5% p.a.', method: 'Compound Quarterly', updated: 'Dec 8, 2024', tone: 'purple' },
    { account: 'Emergency Fund', current: '6% p.a.', newRate: '6% p.a.', method: 'Simple', updated: 'Dec 5, 2024', tone: 'red' },
  ];

  // Distribution breakdown
  distribution = [
    { label: 'Shares', percent: 18, color: '#1a237e' },
    { label: 'Regular', percent: 43, color: '#00d084' },
    { label: 'Fixed', percent: 27, color: '#00bcd4' },
    { label: 'Holiday', percent: 4, color: '#ff9800' },
    { label: 'Junior', percent: 2, color: '#9c27b0' },
    { label: 'Emergency', percent: 6, color: '#f44336' },
  ];

  // Transactions
  transactions: Transaction[] = [
    { ref: 'SAV-08921', member: 'Mary Wanjiku', id: 'SP-10023', initials: 'MW', avatar: '#4caf50', type: 'Deposit', account: 'Regular Savings', amount: '+KES 25,000', amountState: 'positive', channel: 'M-Pesa', channelIcon: '📱', status: 'Confirmed', statusState: 'success', date: 'Dec 18, 3:45 PM', selected: false },
    { ref: 'WDR-03451', member: 'Peter Omondi', id: 'SP-10145', initials: 'PO', avatar: '#f44336', type: 'Withdrawal', account: 'Emergency Fund', amount: '-KES 50,000', amountState: 'negative', channel: 'M-Pesa', channelIcon: '📱', status: 'Confirmed', statusState: 'success', date: 'Dec 18, 2:15 PM', selected: false },
    { ref: 'SHR-00782', member: 'John Kamau', id: 'SP-10015', initials: 'JK', avatar: '#2196f3', type: 'Share Purchase', account: 'Share Capital', amount: 'KES 10,000', amountState: 'neutral', channel: 'Transfer', channelIcon: '⇄', status: 'Confirmed', statusState: 'success', date: 'Dec 18, 11:30 AM', selected: false },
    { ref: 'WDR-03458', member: 'Grace Akinyi', id: 'SP-10067', initials: 'GA', avatar: '#9c27b0', type: 'Withdrawal', account: 'Regular Savings', amount: '-KES 80,000', amountState: 'negative', channel: 'KCB Bank', channelIcon: '🏦', status: 'Awaiting OTP', statusState: 'awaiting', date: 'Dec 17, 2:00 PM', selected: false },
    { ref: 'FD-00234', member: 'Sarah Auma', id: 'SP-10089', initials: 'SA', avatar: '#00bcd4', type: 'Fixed Deposit', account: 'Fixed Deposit', amount: 'KES 200,000', amountState: 'neutral', channel: 'Transfer', channelIcon: '⇄', status: 'Active', statusState: 'active', date: 'Dec 18, 10:00 AM', selected: false },
    { ref: 'SAV-08920', member: 'Daniel Kipchoge', id: 'SP-10098', initials: 'DK', avatar: '#ff9800', type: 'Deposit', account: 'Holiday Fund', amount: '+KES 5,000', amountState: 'positive', channel: 'M-Pesa', channelIcon: '📱', status: 'Confirmed', statusState: 'success', date: 'Dec 17, 5:30 PM', selected: false },
    { ref: 'TRF-01230', member: 'Mary Wanjiku', id: 'SP-10023', initials: 'MW', avatar: '#4caf50', type: 'Transfer', account: 'Regular → Holiday', amount: 'KES 12,000', amountState: 'neutral', channel: 'Internal', channelIcon: '↔', status: 'Confirmed', statusState: 'success', date: 'Dec 16, 11:15 AM', selected: false },
    { ref: 'INT-00098', member: 'James Kariuki', id: 'SP-10001', initials: 'JK', avatar: '#1a237e', type: 'Interest', account: 'Regular Savings', amount: '+KES 1,250', amountState: 'positive', channel: 'System', channelIcon: '⚙', status: 'Credited', statusState: 'success', date: 'Dec 15, 11:59 PM', selected: false },
  ];

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  @HostListener('document:keydown.escape')
  closeModal(): void {
    this.modal = null;
    this.depositStep = 1;
    this.withdrawStep = 1;
    document.body.style.overflow = '';
  }

  openModal(key: ModalKey): void {
    if (!key) return;
    this.modal = key;
    this.depositStep = 1;
    this.withdrawStep = 1;
    document.body.style.overflow = 'hidden';
  }

  openAccountDetail(account: SavingsAccount): void {
    this.selectedAccount = account;
    this.openModal('accountDetail');
  }

  openAccountAction(account: SavingsAccount, action: AccountAction): void {
    this.selectedAccount = account;
    if (action.modal === 'deposit') this.depositForm.account = account.title;
    if (action.modal === 'withdrawal') this.withdrawForm.account = account.title;
    this.openModal(action.modal);
  }

  openTxDetail(tx: Transaction): void {
    this.selectedTx = tx;
    this.openModal('txDetail');
  }

  openPendingOtp(item?: PendingWithdrawal): void {
    this.activePendingOtp = item || this.pendingWithdrawals[0];
    this.otpDigits = ['', '', '', '', '', ''];
    this.openModal('pendingOtp');
  }

  openReviewWithdrawals(): void {
    this.openModal('reviewWithdrawals');
  }

  openSavingsDistDetail(): void {
    this.openModal('savingsDistDetail');
  }

  // Wizard nav
  nextDeposit(): void { if (this.depositStep < 4) this.depositStep++; }
  prevDeposit(): void { if (this.depositStep > 1) this.depositStep--; }
  submitDeposit(): void { this.closeModal(); this.showToast('success', `Deposit of KES ${this.depositForm.amount.toLocaleString('en-KE')} processed.`); }

  nextWithdraw(): void { if (this.withdrawStep < 5) this.withdrawStep++; }
  prevWithdraw(): void { if (this.withdrawStep > 1) this.withdrawStep--; }
  submitWithdraw(): void {
    if (!this.withdrawForm.adminPin) return;
    this.closeModal();
    this.showToast('success', `Withdrawal of KES ${this.withdrawForm.amount.toLocaleString('en-KE')} processed.`);
  }

  submitShares(): void { this.closeModal(); this.showToast('success', `${this.shareForm.shares} shares purchased.`); }
  submitTransfer(): void { this.closeModal(); this.showToast('success', `Transfer of KES ${this.transferForm.amount.toLocaleString('en-KE')} completed.`); }
  submitFixed(): void { if (!this.fixedForm.member) return; this.closeModal(); this.showToast('success', 'Fixed Deposit created successfully.'); }
  submitDividends(): void { this.closeModal(); this.showToast('success', `Dividends of KES ${this.dividendForm.totalPool.toLocaleString('en-KE')} queued for distribution.`); }
  submitReport(): void { this.closeModal(); this.showToast('success', `${this.reportForm.type} exported as ${this.reportForm.format}.`); }
  submitInterestConfig(): void { this.closeModal(); this.showToast('success', `Interest rate updated for ${this.interestConfigForm.account}.`); }

  verifyPendingOtp(): void {
    const code = this.otpDigits.join('');
    if (code.length !== 6) return;
    this.closeModal();
    this.showToast('success', `Withdrawal of KES ${this.activePendingOtp?.amount.toLocaleString('en-KE')} verified and processed.`);
  }

  rejectPendingOtp(): void {
    this.closeModal();
    this.showToast('warning', 'OTP verification rejected.');
  }

  // Savings Plans
  newPlanTemplate(): SavingsPlan {
    return {
      id: '', name: '', goal: 100000, targetAmount: 100000, collected: 0,
      members: 0, monthlyContribution: 1000, frequency: 'Monthly', interestRate: 5,
      startDate: '', endDate: '', status: 'Draft', category: 'Custom',
      autoDebit: true, description: '',
    };
  }

  openCreatePlan(): void {
    this.planForm = this.newPlanTemplate();
    this.openModal('savingsPlanCreate');
  }

  submitPlan(): void {
    if (!this.planForm.name || !this.planForm.targetAmount) return;
    const newId = `PLN-${String(this.savingsPlans.length + 1).padStart(3, '0')}`;
    this.savingsPlans = [{ ...this.planForm, id: newId, status: 'Active' }, ...this.savingsPlans];
    this.closeModal();
    this.showToast('success', `Savings plan "${this.planForm.name}" created.`);
  }

  openPlanDetail(plan: SavingsPlan): void {
    this.selectedPlan = plan;
    this.openModal('savingsPlanDetail');
  }

  openPausePlan(plan: SavingsPlan): void {
    this.selectedPlan = plan;
    this.pauseReason = '';
    this.openModal('pausePlan');
  }

  togglePlanStatus(plan: SavingsPlan): void {
    if (plan.status === 'Active') {
      this.openPausePlan(plan);
    } else if (plan.status === 'Paused') {
      plan.status = 'Active';
      this.showToast('success', `Plan "${plan.name}" resumed.`);
    }
  }

  confirmPause(): void {
    if (!this.selectedPlan || !this.pauseReason.trim()) return;
    this.selectedPlan.status = 'Paused';
    this.closeModal();
    this.showToast('warning', `Plan "${this.selectedPlan.name}" paused.`);
  }

  planProgress(plan: SavingsPlan): number {
    return Math.min(100, Math.round((plan.collected / plan.targetAmount) * 100));
  }

  planCategoryColor(cat: SavingsPlan['category']): string {
    const map: Record<string, string> = { Holiday: '#ff9800', Education: '#2196f3', Business: '#00bcd4', Emergency: '#f44336', Investment: '#9c27b0', Custom: '#00d084' };
    return map[cat];
  }

  // Filters & pagination
  get filteredTransactions(): Transaction[] {
    let rows = [...this.transactions];
    if (this.activeTab !== 'all') {
      const map: Record<string, string> = { deposits: 'Deposit', withdrawals: 'Withdrawal', shares: 'Share Purchase', transfers: 'Transfer', interest: 'Interest', pending: 'Awaiting OTP' };
      if (this.activeTab === 'pending') rows = rows.filter(t => t.statusState === 'awaiting');
      else rows = rows.filter(t => t.type === map[this.activeTab]);
    }
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      rows = rows.filter(t => t.member.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    if (this.typeFilter !== 'all') rows = rows.filter(t => t.type === this.typeFilter);
    if (this.accountFilter !== 'all') rows = rows.filter(t => t.account.toLowerCase().includes(this.accountFilter.toLowerCase()));
    return rows;
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }

  get totalPages(): number { return Math.ceil(this.filteredTransactions.length / this.pageSize) || 1; }
  get pageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filteredTransactions.length); }
  goToPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  tabCount(tab: string): number {
    if (tab === 'all') return this.transactions.length;
    if (tab === 'pending') return this.transactions.filter(t => t.statusState === 'awaiting').length;
    const map: Record<string, string> = { deposits: 'Deposit', withdrawals: 'Withdrawal', shares: 'Share Purchase', transfers: 'Transfer', interest: 'Interest' };
    return this.transactions.filter(t => t.type === map[tab]).length;
  }

  toggleAll(): void { this.filteredTransactions.forEach(t => (t.selected = this.allSelected)); }
  get selectedCount(): number { return this.transactions.filter(t => t.selected).length; }

  updateOtpDigit(index: number, value: string): void {
    this.otpDigits[index] = value.slice(-1);
  }

  showToast(type: ToastType, message: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, type, message });
    window.setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 3000);
  }

  dismissToast(id: number): void { this.toasts = this.toasts.filter(t => t.id !== id); }
}
