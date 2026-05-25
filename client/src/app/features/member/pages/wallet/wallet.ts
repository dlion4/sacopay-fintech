import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ─────────── Interfaces ─────────── */
export interface WalletTx {
  icon: 'in' | 'out' | 'transfer' | 'received' | 'sent';
  title: string;
  sub: string;
  amount: string;
  positive: boolean;
  date: string;
}
export interface ServiceCard {
  key: string;
  icon: string;
  title: string;
  desc: string;
  badges: { label: string; tone: 'blue' | 'green' | 'red' }[];
  details: string;
}
export interface WalletControl {
  label: string;
  sub: string;
  enabled: boolean;
}
export interface SecurityItem {
  label: string;
  sub: string;
  type: 'toggle' | 'link';
  enabled?: boolean;
  linkText?: string;
}
export type ModalKey =
  | 'deposit' | 'withdraw' | 'send' | 'transfer' | 'request' | 'services'
  | 'overdraft' | 'quickloan' | 'salaryadvance' | 'bnpl'
  | 'fullStatement' | 'txDetail' | 'pin' | 'limits';
export type ToastType = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.scss'],
})
export class WalletComponent {
  /* ──── balance ──── */
  balance = 128_450;
  walletId = 'SP-WAL-2024-00145';

  /* ──── summary cards ──── */
  summaryCards = [
    { label: 'This Month In', value: '+KES 185K', sub: '12 deposits', tone: 'green' },
    { label: 'This Month Out', value: '-KES 92K', sub: '8 withdrawals', tone: 'red' },
    { label: 'Daily Limit', value: 'KES 35K', sub: 'of KES 100K used', tone: 'default' },
    { label: 'Transaction PIN', value: 'Set ✓', sub: 'Last changed Dec 1', tone: 'green' },
  ];

  /* ──── quick actions ──── */
  quickActions = [
    { key: 'deposit', label: 'Deposit', sub: 'Top up wallet', icon: 'deposit' },
    { key: 'withdraw', label: 'Withdraw', sub: 'To M-Pesa/Bank', icon: 'withdraw' },
    { key: 'send', label: 'Send', sub: 'To member/phone', icon: 'send' },
    { key: 'transfer', label: 'Transfer', sub: 'To savings/shares', icon: 'transfer' },
    { key: 'request', label: 'Request', sub: 'Request money', icon: 'request' },
    { key: 'services', label: 'Services', sub: 'Loans & overdraft', icon: 'services' },
  ];

  /* ──── tabs ──── */
  activeTab: 'history' | 'services' | 'controls' = 'history';

  /* ──── transactions ──── */
  transactions: WalletTx[] = [
    { icon: 'in', title: 'M-Pesa Top Up', sub: 'From 0722-XXX-123', amount: '+ KES 50,000', positive: true, date: 'Dec 18, 3:45 PM' },
    { icon: 'out', title: 'Withdraw to M-Pesa', sub: 'To 0722-XXX-123', amount: '- KES 15,000', positive: false, date: 'Dec 18, 1:20 PM' },
    { icon: 'transfer', title: 'Transfer to Savings', sub: 'Wallet → Regular Savings', amount: '- KES 30,000', positive: false, date: 'Dec 17, 4:10 PM' },
    { icon: 'received', title: 'Received from Sarah Auma', sub: 'SP-WAL-00234', amount: '+ KES 5,000', positive: true, date: 'Dec 17, 11:00 AM' },
    { icon: 'sent', title: 'Sent to Peter Omondi', sub: 'SP-WAL-00189', amount: '- KES 8,000', positive: false, date: 'Dec 16, 2:30 PM' },
  ];

  /* ──── services ──── */
  serviceCards: ServiceCard[] = [
    { key: 'overdraft', icon: 'overdraft', title: 'Overdraft', desc: 'Access up to KES 50,000 instantly when your wallet runs low. No collateral needed.', badges: [{ label: 'Instant', tone: 'blue' }, { label: 'Popular', tone: 'green' }], details: 'Limit: KES 50,000  |  Rate: 1.5%/month  |  Tenure: 30 days' },
    { key: 'quickloan', icon: 'quickloan', title: 'Quick Loan', desc: 'Borrow up to KES 200,000 in minutes. No guarantors. Straight to your wallet.', badges: [{ label: 'Instant', tone: 'blue' }, { label: 'New', tone: 'red' }], details: 'Limit: KES 200,000  |  Rate: 12% p.a.  |  Up to: 6 months' },
    { key: 'salaryadvance', icon: 'salary', title: 'Salary Advance', desc: 'Get up to 50% of your next salary early. Auto-repaid on payday.', badges: [{ label: 'Instant', tone: 'blue' }], details: 'Max: 50% of salary  |  Fee: 3% flat  |  Repay: Next payday' },
    { key: 'bnpl', icon: 'bnpl', title: 'Buy Now Pay Later', desc: 'Split purchases into 3 installments. 0% interest for qualifying items.', badges: [{ label: 'New', tone: 'red' }], details: 'Max: KES 100,000  |  Installments: 3  |  Interest: 0%*' },
  ];

  /* ──── controls ──── */
  walletControls: WalletControl[] = [
    { label: 'Channel All Funds via Wallet', sub: 'SACCO deposits route through wallet first for record-keeping', enabled: true },
    { label: 'Allow Incoming Payments', sub: 'Other members can send money to this wallet', enabled: true },
    { label: 'Allow External Withdrawals', sub: 'Withdraw to M-Pesa, Airtel Money, or bank', enabled: true },
    { label: 'Auto-Save to Savings', sub: 'Auto-transfer 10% of each deposit to savings', enabled: false },
    { label: 'Freeze Wallet (Pause All)', sub: 'Temporarily block all wallet activity', enabled: false },
  ];
  securityItems: SecurityItem[] = [
    { label: 'Transaction PIN', sub: 'Required for all outgoing transactions', type: 'link', linkText: 'Set ✓' },
    { label: 'Require PIN for All Transactions', sub: 'Including internal transfers and payments', type: 'toggle', enabled: true },
    { label: 'Low Balance Alert', sub: 'Notify when below KES 5,000', type: 'toggle', enabled: true },
    { label: 'Large Transaction Alert', sub: 'Notify for transactions above KES 50,000', type: 'toggle', enabled: true },
    { label: 'Transaction Limits', sub: 'Daily: KES 100K • Monthly: KES 1M', type: 'link', linkText: '' },
  ];

  /* ──── modal state ──── */
  activeModal: ModalKey | null = null;
  selectedTx: WalletTx | null = null;
  selectedService: ServiceCard | null = null;

  /* ──── deposit wizard (4 steps) ──── */
  depositStep = 1;
  depositMethod = 'mpesa';
  depositAmount = '50000';
  depositPhone = '+254 722 123 456';
  depositPin = ['', '', '', ''];

  /* ──── withdraw form ──── */
  withdrawTo = 'mpesa';
  withdrawAmount = '';
  withdrawPhone = '';

  /* ──── send form ──── */
  sendTo = 'wallet';
  sendId = '';
  sendAmount = '5000';
  sendNote = '';

  /* ──── transfer form ──── */
  transferTo = 'savings';
  transferAmount = '30000';
  transferNarration = '';

  /* ──── request form ──── */
  requestFrom = '';
  requestAmount = '';
  requestNote = '';

  /* ──── toast ──── */
  toast: { message: string; type: ToastType } | null = null;
  private toastTimer: any;

  /* ──── Methods ──── */
  openModal(key: ModalKey): void {
    if (key === 'deposit') { this.depositStep = 1; this.depositPin = ['', '', '', '']; }
    this.activeModal = key;
    document.body.style.overflow = 'hidden';
  }
  closeModal(): void {
    this.activeModal = null;
    this.selectedTx = null;
    this.selectedService = null;
    document.body.style.overflow = '';
  }
  onQuickAction(key: string): void {
    if (key === 'services') { this.activeTab = 'services'; return; }
    this.openModal(key as ModalKey);
  }
  openTxDetail(tx: WalletTx): void {
    this.selectedTx = tx;
    this.openModal('txDetail');
  }
  openServiceModal(s: ServiceCard): void {
    this.selectedService = s;
    this.openModal(s.key as ModalKey);
  }

  /* deposit steps */
  depositNext(): void {
    if (this.depositStep < 4) this.depositStep++;
    if (this.depositStep === 4) {
      // simulate balance update
      this.balance += parseInt(this.depositAmount) || 0;
    }
  }
  depositBack(): void {
    if (this.depositStep > 1) this.depositStep--;
  }
  onPinInput(idx: number, val: string): void {
    this.depositPin[idx] = val.slice(-1);
  }

  /* submits */
  submitWithdraw(): void {
    if (!this.withdrawAmount) return this.showToast('Enter withdrawal amount', 'warning');
    this.closeModal();
    this.showToast('Withdrawal request submitted.', 'success');
  }
  submitSend(): void {
    if (!this.sendId || !this.sendAmount) return this.showToast('Please fill required fields', 'warning');
    this.closeModal();
    this.showToast('Money sent successfully.', 'success');
  }
  submitTransfer(): void {
    if (!this.transferAmount) return this.showToast('Enter transfer amount', 'warning');
    this.closeModal();
    this.showToast('Transfer completed.', 'success');
  }
  submitRequest(): void {
    if (!this.requestFrom || !this.requestAmount) return this.showToast('Please fill required fields', 'warning');
    this.closeModal();
    this.showToast('Payment request sent.', 'success');
  }
  applyService(key: string): void {
    this.closeModal();
    this.showToast(`${key} application submitted.`, 'success');
  }

  /* toast */
  showToast(message: string, type: ToastType = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3200);
  }
  dismissToast(): void { this.toast = null; }

  /* helpers */
  copyId(): void { this.showToast('Wallet ID copied!', 'info'); }
  formatBal(n: number): string { return n.toLocaleString(); }
  trackByIdx(i: number): number { return i; }
}
