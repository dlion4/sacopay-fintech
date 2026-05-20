import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ModalKey =
  | 'deposit'
  | 'withdrawal'
  | 'interest'
  | 'reports'
  | 'shares'
  | 'transfer'
  | 'fixed'
  | 'dividends'
  | 'txDetail'
  | 'accountDetail'
  | 'otp'
  | 'fullLog'
  | null;

interface AccountStat {
  label: string;
  value: string;
  state?: 'positive' | 'negative' | 'badge' | 'warning';
}

interface AccountAction {
  label: string;
  modal: ModalKey;
  variant: 'primary' | 'outline' | 'danger-outline' | 'blue-outline' | 'orange-outline' | 'purple-outline';
}

interface SavingsAccount {
  id: string;
  title: string;
  balance: string;
  sub: string;
  iconLabel: string;
  tone: 'green' | 'navy' | 'cyan' | 'orange' | 'purple' | 'red';
  lockLabel: string;
  lockState: 'locked' | 'unlocked' | 'warning';
  stats: AccountStat[];
  actions: AccountAction[];
}

interface QuickAction {
  label: string;
  helper: string;
  iconLabel: string;
  tone: string;
  modal: ModalKey;
}

interface Transaction {
  ref: string;
  member: string;
  id: string;
  initials: string;
  avatar: string;
  type: string;
  account: string;
  amount: string;
  amountState: 'positive' | 'negative' | 'neutral';
  channel: string;
  status: string;
  statusState: 'success' | 'pending' | 'active';
  date: string;
}

interface ActivityItem {
  tone: string;
  time: string;
  tag: string;
  title: string;
  detail: string;
}

interface InterestRow {
  account: string;
  current: string;
  newRate: string;
  method: string;
  updated: string;
  tone: string;
}

@Component({
  selector: 'app-treasury-savings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './savings.html',
  styleUrl: './savings.scss',
})
export class SavingsComponent {
  modal: ModalKey = null;
  selectedAccount: SavingsAccount | null = null;
  selectedTx: Transaction | null = null;
  depositStep = 1;
  withdrawStep = 1;
  activeTab = 'all';
  search = '';
  typeFilter = 'all';
  accountFilter = 'all';
  toast: { message: string; type: string } | null = null;
  private toastTimer?: number;

  readonly depositSteps = ['Member', 'Details', 'Channel', 'Confirm'];
  readonly withdrawSteps = ['Member', 'Details', 'Destination', 'OTP Verify', 'Confirm'];

  depositForm = {
    member: 'Mary Wanjiku',
    sacco: 'Uklima SACCO',
    account: 'Regular Savings',
    amount: '25000',
    channel: 'M-Pesa',
    reference: 'QJK8X2M1PL',
    note: 'Monthly member savings',
  };

  withdrawForm = {
    member: 'Peter Omondi',
    sacco: 'All SACCOs',
    account: 'Emergency Fund',
    amount: '50000',
    destination: 'M-Pesa Wallet',
    otp: '',
    reason: 'Medical emergency',
  };

  shareForm = { member: 'John Kamau', shares: '10', source: 'Regular Savings' };
  transferForm = { member: 'Mary Wanjiku', from: 'Regular Savings', to: 'Holiday / Merry-Go-Round', amount: '12000', note: 'Holiday savings allocation' };
  fixedForm = { member: 'Sarah Auma', amount: '200000', term: '6 Months', rate: '10', source: 'Regular Savings' };
  reportForm = { type: 'Savings Transactions', period: 'This Month', format: 'PDF' };
  dividendForm = { period: 'FY 2024', destination: 'Regular Savings' };
  otpCode = '';

  accountCards: SavingsAccount[] = [
    {
      id: 'shares',
      title: 'Share Capital',
      balance: 'KES 28.5M',
      sub: '1,247 shareholders - KES 1,000/share',
      iconLabel: 'SC',
      tone: 'navy',
      lockLabel: 'Non-Withdrawable',
      lockState: 'locked',
      stats: [
        { label: 'Total Shares Issued', value: '28,500' },
        { label: 'Members with Shares', value: '1,247' },
        { label: 'Avg Shares/Member', value: '22.8' },
        { label: 'New Shares (This Month)', value: '+342', state: 'positive' },
      ],
      actions: [
        { label: 'Buy Shares', modal: 'shares', variant: 'blue-outline' },
        { label: 'Details', modal: 'accountDetail', variant: 'outline' },
      ],
    },
    {
      id: 'regular',
      title: 'Regular Savings',
      balance: 'KES 67.3M',
      sub: '1,580 accounts - 7% p.a. interest',
      iconLabel: 'RS',
      tone: 'green',
      lockLabel: 'Withdrawable',
      lockState: 'unlocked',
      stats: [
        { label: 'Active Accounts', value: '1,580' },
        { label: 'Deposits (Month)', value: '+KES 8.2M', state: 'positive' },
        { label: 'Withdrawals (Month)', value: '-KES 3.1M', state: 'negative' },
        { label: 'Interest Earned (YTD)', value: 'KES 4.7M', state: 'positive' },
      ],
      actions: [
        { label: 'Deposit', modal: 'deposit', variant: 'primary' },
        { label: 'Withdraw', modal: 'withdrawal', variant: 'outline' },
      ],
    },
    {
      id: 'fixed',
      title: 'Fixed Deposits',
      balance: 'KES 42.1M',
      sub: '328 accounts - 9-12% p.a.',
      iconLabel: 'FD',
      tone: 'cyan',
      lockLabel: 'Term-Locked',
      lockState: 'locked',
      stats: [
        { label: 'Active FDs', value: '328' },
        { label: 'Maturing (30 days)', value: '18', state: 'warning' },
        { label: 'Avg Interest Rate', value: '10.5% p.a.', state: 'badge' },
        { label: 'Interest Payable', value: 'KES 1.8M', state: 'positive' },
      ],
      actions: [
        { label: 'New FD', modal: 'fixed', variant: 'blue-outline' },
        { label: 'Details', modal: 'accountDetail', variant: 'outline' },
      ],
    },
    {
      id: 'holiday',
      title: 'Holiday / Merry-Go-Round',
      balance: 'KES 5.8M',
      sub: '412 members - Dec release',
      iconLabel: 'HD',
      tone: 'orange',
      lockLabel: 'Seasonal',
      lockState: 'warning',
      stats: [
        { label: 'Target Amount', value: 'KES 8.5M' },
        { label: 'Progress', value: '68%', state: 'warning' },
        { label: 'Release Date', value: 'Dec 20, 2024' },
        { label: 'Interest Rate', value: '5% p.a.', state: 'badge' },
      ],
      actions: [
        { label: 'Deposit', modal: 'deposit', variant: 'orange-outline' },
        { label: 'Details', modal: 'accountDetail', variant: 'outline' },
      ],
    },
    {
      id: 'junior',
      title: 'Junior Savings (Watoto)',
      balance: 'KES 3.2M',
      sub: '186 accounts - 8% p.a.',
      iconLabel: 'JS',
      tone: 'purple',
      lockLabel: 'Until 18 yrs',
      lockState: 'locked',
      stats: [
        { label: 'Active Juniors', value: '186' },
        { label: 'Deposits (Month)', value: '+KES 380K', state: 'positive' },
        { label: 'Avg Balance', value: 'KES 17,200' },
        { label: 'Interest Rate', value: '8% p.a.', state: 'badge' },
      ],
      actions: [
        { label: 'Deposit', modal: 'deposit', variant: 'purple-outline' },
        { label: 'Details', modal: 'accountDetail', variant: 'outline' },
      ],
    },
    {
      id: 'emergency',
      title: 'Emergency Fund',
      balance: 'KES 8.9M',
      sub: '892 members - 6% p.a.',
      iconLabel: 'EF',
      tone: 'red',
      lockLabel: 'Quick Access',
      lockState: 'unlocked',
      stats: [
        { label: 'Active Accounts', value: '892' },
        { label: 'Withdrawals (Month)', value: '-KES 1.2M', state: 'negative' },
        { label: 'Max Withdrawal', value: '80% of balance' },
        { label: 'Processing Time', value: 'Instant (M-Pesa)' },
      ],
      actions: [
        { label: 'Deposit', modal: 'deposit', variant: 'danger-outline' },
        { label: 'Withdraw', modal: 'withdrawal', variant: 'outline' },
      ],
    },
  ];

  quickActions: QuickAction[] = [
    { label: 'Deposit', helper: 'Process member deposit', iconLabel: 'IN', tone: 'green', modal: 'deposit' },
    { label: 'Withdrawal', helper: 'Process withdrawal request', iconLabel: 'OUT', tone: 'red', modal: 'withdrawal' },
    { label: 'Buy Shares', helper: 'Purchase share capital', iconLabel: 'SC', tone: 'blue', modal: 'shares' },
    { label: 'Transfer', helper: 'Between savings accounts', iconLabel: 'TR', tone: 'cyan', modal: 'transfer' },
    { label: 'New Fixed Deposit', helper: 'Create term deposit', iconLabel: 'FD', tone: 'cyan', modal: 'fixed' },
    { label: 'Dividends', helper: 'Process dividend distribution', iconLabel: 'DV', tone: 'purple', modal: 'dividends' },
    { label: 'Interest Config', helper: 'Set interest rates', iconLabel: '%', tone: 'orange', modal: 'interest' },
    { label: 'Reports', helper: 'Generate savings reports', iconLabel: 'RP', tone: 'brown', modal: 'reports' },
  ];

  transactions: Transaction[] = [
    { ref: 'SAV-88921', member: 'Mary Wanjiku', id: 'SP-10023', initials: 'MW', avatar: 'c1', type: 'Deposit', account: 'Regular Savings', amount: '+KES 25,000', amountState: 'positive', channel: 'M-Pesa', status: 'Confirmed', statusState: 'success', date: 'Dec 18, 3:45 PM' },
    { ref: 'WDR-03451', member: 'Peter Omondi', id: 'SP-10145', initials: 'PO', avatar: 'c2', type: 'Withdrawal', account: 'Emergency Fund', amount: '-KES 50,000', amountState: 'negative', channel: 'M-Pesa', status: 'Confirmed', statusState: 'success', date: 'Dec 18, 2:15 PM' },
    { ref: 'SHR-00782', member: 'John Kamau', id: 'SP-10015', initials: 'JK', avatar: 'c3', type: 'Share Purchase', account: 'Share Capital', amount: 'KES 10,000', amountState: 'neutral', channel: 'Transfer', status: 'Confirmed', statusState: 'success', date: 'Dec 18, 11:30 AM' },
    { ref: 'WDR-03450', member: 'Grace Akinyi', id: 'SP-10067', initials: 'GA', avatar: 'c4', type: 'Withdrawal', account: 'Regular Savings', amount: '-KES 80,000', amountState: 'negative', channel: 'KCB Bank', status: 'Awaiting OTP', statusState: 'pending', date: 'Dec 17, 2:00 PM' },
    { ref: 'FD-00234', member: 'Sarah Auma', id: 'SP-10089', initials: 'SA', avatar: 'c5', type: 'Fixed Deposit', account: 'Fixed Deposit', amount: 'KES 200,000', amountState: 'neutral', channel: 'Transfer', status: 'Active', statusState: 'active', date: 'Dec 18, 10:00 AM' },
  ];

  activityItems: ActivityItem[] = [
    { tone: 'green', time: 'Today, 3:45 PM', tag: 'Deposit', title: 'KES 25,000 deposited by Mary Wanjiku via M-Pesa', detail: 'Regular Savings - Ref: SAV-2024-08921' },
    { tone: 'red', time: 'Today, 2:15 PM', tag: 'Withdrawal', title: 'KES 50,000 withdrawn by Peter Omondi to M-Pesa', detail: 'Emergency Fund - OTP verified - Ref: WDR-2024-03451' },
    { tone: 'navy', time: 'Today, 11:30 AM', tag: 'Shares', title: 'John Kamau purchased 10 shares (KES 10,000) from Regular Savings', detail: 'Share balance: 45 shares - Transfer approved' },
    { tone: 'orange', time: 'Yesterday, 4:10 PM', tag: 'Review', title: 'Grace Akinyi withdrawal flagged for OTP review', detail: 'Regular Savings - Awaiting second-factor verification' },
  ];

  interestRows: InterestRow[] = [
    { account: 'Share Capital', current: 'Dividend-based', newRate: 'Dividend', method: 'Annual', updated: 'Jan 2024', tone: 'navy' },
    { account: 'Regular Savings', current: '7% p.a.', newRate: '7', method: 'Daily balance', updated: 'Jul 2024', tone: 'green' },
    { account: 'Fixed Deposit (3M)', current: '9% p.a.', newRate: '9', method: 'Fixed', updated: 'Jul 2024', tone: 'cyan' },
    { account: 'Fixed Deposit (6M)', current: '10% p.a.', newRate: '10', method: 'Fixed', updated: 'Jul 2024', tone: 'cyan' },
    { account: 'Fixed Deposit (12M)', current: '11% p.a.', newRate: '11', method: 'Fixed', updated: 'Jul 2024', tone: 'cyan' },
    { account: 'Holiday', current: '5% p.a.', newRate: '5', method: 'Daily balance', updated: 'Jan 2024', tone: 'orange' },
    { account: 'Junior', current: '8% p.a.', newRate: '8', method: 'Daily balance', updated: 'Jan 2024', tone: 'purple' },
    { account: 'Emergency', current: '6% p.a.', newRate: '6', method: 'Daily balance', updated: 'Jan 2024', tone: 'red' },
  ];

  tabs = [
    { key: 'all', label: 'All', count: '2,847' },
    { key: 'deposits', label: 'Deposits', count: '1,842' },
    { key: 'withdrawals', label: 'Withdrawals', count: '523' },
    { key: 'shares', label: 'Share Purchases', count: '342' },
    { key: 'transfers', label: 'Transfers', count: '89' },
    { key: 'interest', label: 'Interest', count: '48' },
    { key: 'pending', label: 'Pending', count: '3' },
  ];

  get shareValue(): number {
    return Number(this.shareForm.shares || 0) * 1000;
  }

  get filteredTransactions(): Transaction[] {
    const query = this.search.trim().toLowerCase();
    return this.transactions.filter((tx) => {
      const tabMatch =
        this.activeTab === 'all' ||
        (this.activeTab === 'deposits' && tx.type === 'Deposit') ||
        (this.activeTab === 'withdrawals' && tx.type === 'Withdrawal') ||
        (this.activeTab === 'shares' && tx.type === 'Share Purchase') ||
        (this.activeTab === 'transfers' && tx.type === 'Transfer') ||
        (this.activeTab === 'interest' && tx.type === 'Interest') ||
        (this.activeTab === 'pending' && tx.statusState === 'pending');

      const typeMatch = this.typeFilter === 'all' || tx.type === this.typeFilter;
      const accountMatch = this.accountFilter === 'all' || tx.account === this.accountFilter;
      const searchMatch = !query || `${tx.ref} ${tx.member} ${tx.id} ${tx.type} ${tx.account}`.toLowerCase().includes(query);

      return tabMatch && typeMatch && accountMatch && searchMatch;
    });
  }

  openModal(modal: ModalKey, account?: SavingsAccount, tx?: Transaction): void {
    if (account) this.selectedAccount = account;
    if (tx) this.selectedTx = tx;
    if (modal === 'deposit') this.depositStep = 1;
    if (modal === 'withdrawal') this.withdrawStep = 1;
    this.modal = modal;
  }

  closeModal(): void {
    this.modal = null;
  }

  nextDeposit(): void {
    this.depositStep = Math.min(this.depositStep + 1, this.depositSteps.length);
  }

  backDeposit(): void {
    this.depositStep = Math.max(this.depositStep - 1, 1);
  }

  nextWithdrawal(): void {
    this.withdrawStep = Math.min(this.withdrawStep + 1, this.withdrawSteps.length);
  }

  backWithdrawal(): void {
    this.withdrawStep = Math.max(this.withdrawStep - 1, 1);
  }

  confirmAndClose(message: string): void {
    this.closeModal();
    this.showToast(message);
  }

  showToast(message: string, type = 'success'): void {
    this.toast = { message, type };
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, 2600);
  }

  exportTransactions(): void {
    this.showToast('Export prepared for download.');
  }

  typeClass(type: string): string {
    return type.toLowerCase().replace(/\s+/g, '-');
  }

  currency(value: string): string {
    return `KES ${Number(value || 0).toLocaleString()}`;
  }
}