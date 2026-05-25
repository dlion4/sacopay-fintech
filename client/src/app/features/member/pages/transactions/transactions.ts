import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type TxType = 'Deposit' | 'Withdrawal' | 'Transfer' | 'Repayment' | 'Share Purchase';
export type TxStatus = 'Success' | 'Pending' | 'Failed';
export type ModalKey =
  | 'receipt'
  | 'exportStatement'
  | 'filters'
  | 'outflowBreakdown'
  | 'insights'
  | 'pendingVerification'
  | 'failedReason'
  | 'dispute'
  | 'downloadReceipt'
  | 'channelDetails'
  | 'monthlyActivity'
  | 'searchHelp'
  | 'categorySummary'
  | 'dateRange'
  | 'successRate';

export interface TransactionRow {
  title: string;
  description: string;
  reference: string;
  channel: string;
  date: string;
  time: string;
  status: TxStatus;
  amount: number;
  type: TxType;
  source: string;
  destination: string;
  fee: number;
}

@Component({
  selector: 'sacco-member-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./transactions.html',
  styleUrls: ['./transactions.scss'],
})
export class TransactionsComponent implements AfterViewInit {
  @ViewChild('activityCanvas') activityCanvas?: ElementRef<HTMLCanvasElement>;

  activeTab: 'All' | TxType = 'All';
  activeModal: ModalKey | null = null;
  selectedTx: TransactionRow | null = null;
  searchTerm = '';
  showAdvancedFilters = false;
  filterStatus = '';
  filterChannel = '';
  filterFrom = '';
  filterTo = '';
  exportForm = { range: 'December 2024', format: 'pdf', includeReceipts: true, includeFailed: true };
  disputeForm = { category: 'Wrong amount', message: '' };

  summary = [
    { label: 'Total Inflows', value: '+KES 85,000', tone: 'green' },
    { label: 'Total Outflows', value: '-KES 57,500', tone: 'red' },
    { label: 'Pending Verifications', value: '1 Transaction', tone: 'amber' },
    { label: 'Success Rate', value: '98.4%', tone: 'light' },
  ];

  tabs: { key: 'All' | TxType; label: string; count: number }[] = [
    { key: 'All', label: 'All Transactions', count: 18 },
    { key: 'Deposit', label: 'Deposits', count: 6 },
    { key: 'Withdrawal', label: 'Withdrawals', count: 3 },
    { key: 'Transfer', label: 'Transfers', count: 5 },
    { key: 'Repayment', label: 'Repayments', count: 4 },
  ];

  transactions: TransactionRow[] = [
    { title: 'Deposit to Regular Savings', description: 'Savings Account Contribution', reference: 'TRX-2024-09812', channel: 'M-Pesa PayBill', date: 'Dec 18, 2024', time: '03:45 PM', status: 'Success', amount: 15000, type: 'Deposit', source: 'John Kamau', destination: 'Regular Savings', fee: 0 },
    { title: 'Loan Repayment Installment', description: 'Personal Loan (LN-2024-00845)', reference: 'TRX-2024-09811', channel: 'SACCO Wallet', date: 'Dec 15, 2024', time: '11:20 AM', status: 'Success', amount: -12500, type: 'Repayment', source: 'SACCO Wallet', destination: 'Personal Loan', fee: 0 },
    { title: 'Withdrawal from Emergency Fund', description: 'Cash Out Request', reference: 'TRX-2024-09810', channel: 'M-Pesa Disburse', date: 'Dec 12, 2024', time: '09:10 AM', status: 'Success', amount: -5000, type: 'Withdrawal', source: 'Emergency Fund', destination: 'M-Pesa', fee: 50 },
    { title: 'Share Capital Purchase', description: 'Internal Capital Top-Up', reference: 'TRX-2024-09809', channel: 'Internal Transfer', date: 'Dec 10, 2024', time: '04:00 PM', status: 'Success', amount: 10000, type: 'Share Purchase', source: 'Savings', destination: 'Share Capital', fee: 0 },
    { title: 'Transfer to SACCO Wallet', description: 'Wallet Fund Allocation', reference: 'TRX-2024-09808', channel: 'Bank Disburse', date: 'Dec 08, 2024', time: '01:30 PM', status: 'Pending', amount: 20000, type: 'Transfer', source: 'Bank EFT', destination: 'SACCO Wallet', fee: 0 },
    { title: 'Withdrawal from Regular Savings', description: 'External Bank Transfer', reference: 'TRX-2024-09807', channel: 'EFT Gateway', date: 'Dec 05, 2024', time: '10:05 AM', status: 'Failed', amount: -15000, type: 'Withdrawal', source: 'Regular Savings', destination: 'External Bank', fee: 0 },
  ];

  outflowBreakdown = [
    { label: 'Loan Repayments', percent: 65, color: 'blue' },
    { label: 'Share Purchases', percent: 25, color: 'cyan' },
    { label: 'External Withdrawals', percent: 10, color: 'amber' },
  ];

  toast: { message: string; type: 'success' | 'info' | 'warning' | 'danger' } | null = null;
  private toastTimer: any;

  ngAfterViewInit(): void {
    setTimeout(() => this.drawChart(), 0);
    window.addEventListener('resize', () => this.drawChart());
  }

  get filteredTransactions(): TransactionRow[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.transactions.filter((tx) => {
      const tabOk = this.activeTab === 'All' || tx.type === this.activeTab;
      const queryOk = !q || tx.title.toLowerCase().includes(q) || tx.reference.toLowerCase().includes(q) || tx.channel.toLowerCase().includes(q);
      const statusOk = !this.filterStatus || tx.status === this.filterStatus;
      const channelOk = !this.filterChannel || tx.channel === this.filterChannel;
      return tabOk && queryOk && statusOk && channelOk;
    });
  }

  openModal(key: ModalKey): void {
    if (key === 'pendingVerification') this.selectedTx = this.transactions.find((t) => t.status === 'Pending') || null;
    if (key === 'failedReason') this.selectedTx = this.transactions.find((t) => t.status === 'Failed') || null;
    this.activeModal = key;
    document.body.style.overflow = 'hidden';
  }

  openReceipt(tx: TransactionRow): void {
    this.selectedTx = tx;
    if (tx.status === 'Pending') this.activeModal = 'pendingVerification';
    else if (tx.status === 'Failed') this.activeModal = 'failedReason';
    else this.activeModal = 'receipt';
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  exportStatement(): void {
    this.closeModal();
    this.showToast('Statement export is being prepared.', 'info');
  }

  submitDispute(): void {
    this.closeModal();
    this.showToast('Dispute submitted for review.', 'success');
  }

  downloadReceipt(): void {
    this.showToast('Receipt downloaded.', 'success');
  }

  applyFilters(): void {
    this.closeModal();
  }

  resetFilters(): void {
    this.filterStatus = '';
    this.filterChannel = '';
    this.filterFrom = '';
    this.filterTo = '';
  }

  showToast(message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3200);
  }

  dismissToast(): void {
    this.toast = null;
  }

  abs(n: number): number {
    return Math.abs(n);
  }

  fmt(n: number): string {
    return Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private drawChart(): void {
    const canvas = this.activityCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const inflows = [75, 92, 68, 110, 88, 85];
    const outflows = [42, 58, 50, 72, 60, 57.5];
    const max = 120;
    const padL = 46;
    const padR = 20;
    const padT = 24;
    const padB = 32;
    const cw = w - padL - padR;
    const ch = h - padT - padB;
    const group = cw / labels.length;
    const barW = Math.min(34, group * 0.3);

    ctx.strokeStyle = '#eef2f7';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 6; i++) {
      const y = padT + (ch / 6) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + cw, y);
      ctx.stroke();
      ctx.fillText(`${Math.round((max / 6) * (6 - i))},000`, padL - 7, y + 3);
    }

    labels.forEach((label, i) => {
      const x = padL + i * group + group / 2;
      const yIn = padT + ch - (inflows[i] / max) * ch;
      const yOut = padT + ch - (outflows[i] / max) * ch;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(x - barW - 3, yIn, barW, padT + ch - yIn);
      ctx.fillStyle = '#2d9bf0';
      ctx.fillRect(x + 3, yOut, barW, padT + ch - yOut);
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - 10);
    });
  }
}