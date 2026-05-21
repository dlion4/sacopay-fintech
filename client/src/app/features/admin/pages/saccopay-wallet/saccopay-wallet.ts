import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type TxType = 'Received' | 'Sent' | 'Transfer' | 'Top-up' | 'Withdraw';
export type WalletStatus = 'Active' | 'Frozen' | 'Paused' | 'Closed';
export type SchedStatus = 'Active' | 'Paused' | 'Completed';

export interface Transaction {
  ref: string; type: TxType; partyName: string; partyId: string; partyInitials: string; avClass: string;
  amount: number; sign: '+' | '-'; balanceAfter: number; date: string;
}
export interface MemberWallet {
  initials: string; avClass: string; name: string; memberId: string;
  walletId: string; balance: number; status: WalletStatus; lastActivity: string;
}
export interface ScheduledPayment {
  id: string; recipient: string; amount: number; frequency: string;
  nextDate: string; destination: string; status: SchedStatus;
}
export interface Toast { id: string; msg: string; type: 'success' | 'error' | 'warning' | 'info'; }

@Component({
  selector: 'app-admin-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saccopay-wallet.html',
  styleUrls: ['./saccopay-wallet.scss']
})
export class SaccopayWalletComponent implements OnInit, OnDestroy {
  /* ─── Tabs ─── */
  activeTab: 'transactions' | 'limits' | 'controls' | 'members' = 'transactions';
  txSubTab: 'all' | 'received' | 'sent' | 'transfers' = 'all';

  /* ─── Toast ─── */
  toasts: Toast[] = [];
  private _toastTimers: ReturnType<typeof setTimeout>[] = [];
  showToast(msg: string, type: Toast['type'] = 'success') {
    const id = Math.random().toString(36).slice(2, 9);
    this.toasts.push({ id, msg, type });
    const t = setTimeout(() => this.dismissToast(id), 3500);
    this._toastTimers.push(t);
  }
  dismissToast(id: string) { this.toasts = this.toasts.filter(t => t.id !== id); }
  ngOnDestroy() { this._toastTimers.forEach(clearTimeout); }

  /* ─── Modal ─── */
  activeModal: string | null = null;
  modalStep = 1;
  selectedWallet: MemberWallet | null = null;
  selectedTx: Transaction | null = null;

  openModal(name: string, data?: any) {
    this.activeModal = name;
    this.modalStep = 1;
    if (data && 'walletId' in data) this.selectedWallet = data as MemberWallet;
    if (data && 'ref' in data) this.selectedTx = data as Transaction;
    // Reset forms
    if (name === 'add_money') { this.am_amount = ''; this.am_source = ''; this.am_pin = ['', '', '', '']; }
    if (name === 'send') { this.sn_recipient = ''; this.sn_method = ''; this.sn_amount = ''; this.sn_note = ''; this.sn_pin = ['', '', '', '']; }
    if (name === 'withdraw') { this.wd_method = ''; this.wd_destination = ''; this.wd_amount = ''; this.wd_pin = ['', '', '', '']; }
    if (name === 'to_savings') { this.ts_account = 'Regular Savings'; this.ts_amount = ''; this.ts_freq = 'One-time'; this.ts_pin = ['', '', '', '']; }
    if (name === 'create_wallet') { this.cw_member = ''; this.cw_deposit = '0'; this.cw_tier = 'Standard (KES 100K daily)'; this.cw_pin = ''; }
  }
  closeModal() {
    this.activeModal = null;
    this.modalStep = 1;
    this.selectedWallet = null;
    this.selectedTx = null;
  }
  nextStep() { this.modalStep++; }
  prevStep() { if (this.modalStep > 1) this.modalStep--; }

  /* ─── Hero Wallet Data ─── */
  walletBalance = 247580;
  walletId = 'SP-WAL-2024-00158';
  walletOwner = 'JAMES KARIUKI';
  walletRole = 'ADMIN';

  copyWalletId() {
    navigator.clipboard?.writeText(this.walletId).catch(() => {});
    this.showToast('Wallet ID copied to clipboard.', 'info');
  }

  /* ─── Transactions ─── */
  transactions: Transaction[] = [
    { ref: 'WTX-889421', type: 'Received', partyName: 'Sarah Auma', partyId: 'SP-WAL-00234', partyInitials: 'SA', avClass: 'av-sa', amount: 15000, sign: '+', balanceAfter: 247580, date: 'Dec 18, 3:45 PM' },
    { ref: 'WTX-889420', type: 'Sent', partyName: 'Peter Omondi', partyId: 'SP-WAL-00145', partyInitials: 'PO', avClass: 'av-po', amount: 5000, sign: '-', balanceAfter: 232580, date: 'Dec 18, 1:20 PM' },
    { ref: 'WTX-889419', type: 'Transfer', partyName: '↗ Regular Savings', partyId: 'SACCO Account', partyInitials: 'RS', avClass: 'av-sav', amount: 50000, sign: '-', balanceAfter: 237580, date: 'Dec 17, 4:10 PM' },
    { ref: 'WTX-889418', type: 'Top-up', partyName: 'M-Pesa', partyId: '0722-XXX-456', partyInitials: 'MP', avClass: 'av-mp', amount: 100000, sign: '+', balanceAfter: 287580, date: 'Dec 17, 10:00 AM' },
    { ref: 'WTX-889417', type: 'Withdraw', partyName: '↗ KCB Bank', partyId: 'XXXX-1234', partyInitials: 'KB', avClass: 'av-kb', amount: 30000, sign: '-', balanceAfter: 187580, date: 'Dec 16, 2:30 PM' },
    { ref: 'WTX-889416', type: 'Received', partyName: 'Mary Wanjiku', partyId: 'SP-WAL-00234', partyInitials: 'MW', avClass: 'av-mw', amount: 8500, sign: '+', balanceAfter: 196080, date: 'Dec 15, 11:20 AM' },
    { ref: 'WTX-889415', type: 'Sent', partyName: 'John Kamau', partyId: 'SP-WAL-00012', partyInitials: 'JK', avClass: 'av-jk', amount: 12000, sign: '-', balanceAfter: 184080, date: 'Dec 14, 5:30 PM' },
  ];

  get filteredTransactions(): Transaction[] {
    if (this.txSubTab === 'received') return this.transactions.filter(t => t.type === 'Received' || t.type === 'Top-up');
    if (this.txSubTab === 'sent') return this.transactions.filter(t => t.type === 'Sent' || t.type === 'Withdraw');
    if (this.txSubTab === 'transfers') return this.transactions.filter(t => t.type === 'Transfer');
    return this.transactions;
  }
  get txCounts() {
    return {
      all: this.transactions.length,
      received: this.transactions.filter(t => t.type === 'Received' || t.type === 'Top-up').length,
      sent: this.transactions.filter(t => t.type === 'Sent' || t.type === 'Withdraw').length,
      transfers: this.transactions.filter(t => t.type === 'Transfer').length,
    };
  }

  /* ─── Member Wallets ─── */
  memberWallets: MemberWallet[] = [
    { initials: 'MW', avClass: 'av-mw', name: 'Mary Wanjiku', memberId: 'SP-10023', walletId: 'SP-WAL-00234', balance: 85200, status: 'Active', lastActivity: 'Today, 3:45 PM' },
    { initials: 'JK', avClass: 'av-jk', name: 'John Kamau', memberId: 'SP-10015', walletId: 'SP-WAL-00145', balance: 42750, status: 'Active', lastActivity: 'Today, 1:20 PM' },
    { initials: 'BK', avClass: 'av-bk', name: 'Bernard Kiprop', memberId: 'SP-10078', walletId: 'SP-WAL-00312', balance: 120400, status: 'Frozen', lastActivity: 'Dec 15' },
    { initials: 'GA', avClass: 'av-ga', name: 'Grace Akinyi', memberId: 'SP-10067', walletId: 'SP-WAL-00189', balance: 15800, status: 'Active', lastActivity: 'Dec 17' },
    { initials: 'PO', avClass: 'av-po', name: 'Peter Omondi', memberId: 'SP-10089', walletId: 'SP-WAL-00091', balance: 67300, status: 'Paused', lastActivity: 'Dec 14' },
    { initials: 'SA', avClass: 'av-sa', name: 'Sarah Auma', memberId: 'SP-10112', walletId: 'SP-WAL-00478', balance: 235000, status: 'Active', lastActivity: 'Today, 9:00 AM' },
  ];
  memberWalletSearch = '';
  get filteredMemberWallets(): MemberWallet[] {
    if (!this.memberWalletSearch) return this.memberWallets;
    const s = this.memberWalletSearch.toLowerCase();
    return this.memberWallets.filter(w => w.name.toLowerCase().includes(s) || w.walletId.toLowerCase().includes(s) || w.memberId.toLowerCase().includes(s));
  }

  /* ─── Scheduled Payments ─── */
  scheduledPayments: ScheduledPayment[] = [
    { id: 'SCH-001', recipient: 'Regular Savings', amount: 10000, frequency: 'Monthly (25th)', nextDate: 'Dec 25, 2024', destination: 'SACCO', status: 'Active' },
    { id: 'SCH-002', recipient: 'Sarah Auma', amount: 5000, frequency: 'Weekly (Mon)', nextDate: 'Dec 23, 2024', destination: 'SP-WAL-00234', status: 'Active' },
    { id: 'SCH-003', recipient: 'M-Pesa (0722-XXX)', amount: 15000, frequency: 'Monthly (1st)', nextDate: 'Jan 1, 2025', destination: 'M-Pesa', status: 'Paused' },
  ];

  /* ─── Limits ─── */
  limits = {
    dailySendUsed: 35000, dailySendMax: 100000,
    dailyWithdrawUsed: 50000, dailyWithdrawMax: 200000,
    monthlyUsed: 480000, monthlyMax: 2000000,
    singleTxnMax: 150000,
  };

  /* ─── Alerts ─── */
  alerts = [
    { name: 'Low Balance Alert', desc: 'Notify when balance drops below threshold', threshold: 'KES 10,000', enabled: true },
    { name: 'High Balance Alert', desc: 'Notify when balance exceeds limit', threshold: 'KES 500,000', enabled: true },
    { name: 'Large Transaction Alert', desc: 'Notify on transactions above threshold', threshold: 'KES 50,000', enabled: true },
    { name: 'Login Alert', desc: 'Notify on new device login', threshold: '', enabled: true },
    { name: 'Failed Transaction Alert', desc: 'Notify on failed or declined transactions', threshold: '', enabled: false },
  ];
  toggleAlert(i: number) {
    this.alerts[i].enabled = !this.alerts[i].enabled;
    this.showToast(`${this.alerts[i].name} ${this.alerts[i].enabled ? 'enabled' : 'disabled'}.`, this.alerts[i].enabled ? 'success' : 'info');
  }

  /* ─── Permissions ─── */
  permissions = [
    { name: 'Receive Payments', desc: 'Allow incoming payments to this wallet', enabled: true, icon: '⬇', tone: 'green' },
    { name: 'Send Payments', desc: 'Allow outgoing payments from this wallet', enabled: true, icon: '⬆', tone: 'blue' },
    { name: 'Withdrawals', desc: 'Allow cash-out to M-Pesa / bank', enabled: true, icon: '🚀', tone: 'red' },
    { name: 'Internal Transfers', desc: 'Transfer to savings / share accounts', enabled: true, icon: '↔', tone: 'purple' },
  ];
  togglePermission(i: number) {
    this.permissions[i].enabled = !this.permissions[i].enabled;
    this.showToast(`${this.permissions[i].name} ${this.permissions[i].enabled ? 'enabled' : 'disabled'}.`, this.permissions[i].enabled ? 'success' : 'warning');
  }

  /* ─── Forms ─── */
  /* Add Money */
  am_amount = ''; am_source = ''; am_ref = ''; am_pin: string[] = ['', '', '', ''];
  /* Send Money */
  sn_recipient = ''; sn_method = ''; sn_amount = ''; sn_note = ''; sn_pin: string[] = ['', '', '', ''];
  /* Withdraw */
  wd_method = ''; wd_destination = ''; wd_amount = ''; wd_pin: string[] = ['', '', '', ''];
  /* To Savings */
  ts_account = 'Regular Savings'; ts_amount = ''; ts_freq = 'One-time'; ts_pin: string[] = ['', '', '', ''];
  /* Create Wallet */
  cw_member = ''; cw_deposit = '0'; cw_tier = 'Standard (KES 100K daily)'; cw_pin = '';
  /* Edit Limits */
  el_dailySend = 100000; el_dailyWithdraw = 200000; el_monthly = 2000000; el_singleMax = 150000;
  /* Configure Alerts */
  ca_lowThreshold = 10000; ca_highThreshold = 500000; ca_largeThreshold = 50000;
  /* Change PIN */
  cp_current = ''; cp_new = ''; cp_confirm = '';
  /* Freeze Account */
  fr_reason = ''; fr_duration = 'Indefinite';
  /* Close Wallet */
  cl_reason = ''; cl_confirm = '';
  /* Share */
  sh_method = 'Link';

  presetAmounts = [5000, 10000, 25000, 50000, 100000];
  setPreset(target: 'am_amount' | 'sn_amount' | 'wd_amount' | 'ts_amount', val: number) {
    (this as any)[target] = val.toString();
  }

  /* ─── PIN Helpers ─── */
  onPinInput(arr: string[], idx: number, event: any) {
    const val = event.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    arr[idx] = val;
    const inputs = event.target.parentElement.querySelectorAll('input.pin-box');
    if (val && idx < 3) inputs[idx + 1]?.focus();
    if (!val && idx > 0 && event.inputType === 'deleteContentBackward') inputs[idx - 1]?.focus();
  }

  pinValid(arr: string[]): boolean { return arr.every(x => x.length === 1); }

  /* ─── Actions ─── */
  confirmAddMoney() {
    if (!this.pinValid(this.am_pin)) { this.showToast('Enter a valid 4-digit PIN.', 'error'); return; }
    this.walletBalance += +this.am_amount || 0;
    this.transactions.unshift({
      ref: 'WTX-' + Math.floor(800000 + Math.random() * 100000), type: 'Top-up',
      partyName: this.am_source || 'M-Pesa', partyId: this.am_ref || '0722-XXX-456',
      partyInitials: 'MP', avClass: 'av-mp', amount: +this.am_amount, sign: '+',
      balanceAfter: this.walletBalance, date: 'Just now',
    });
    this.modalStep = 4; // success step
  }
  confirmSend() {
    if (!this.pinValid(this.sn_pin)) { this.showToast('Enter a valid 4-digit PIN.', 'error'); return; }
    this.walletBalance -= +this.sn_amount || 0;
    this.transactions.unshift({
      ref: 'WTX-' + Math.floor(800000 + Math.random() * 100000), type: 'Sent',
      partyName: this.sn_recipient || 'Recipient', partyId: this.sn_method || 'SP-WAL',
      partyInitials: this.sn_recipient.slice(0, 2).toUpperCase() || 'RC', avClass: 'av-po',
      amount: +this.sn_amount, sign: '-', balanceAfter: this.walletBalance, date: 'Just now',
    });
    this.modalStep = 4;
  }
  confirmWithdraw() {
    if (!this.pinValid(this.wd_pin)) { this.showToast('Enter a valid 4-digit PIN.', 'error'); return; }
    this.walletBalance -= +this.wd_amount || 0;
    this.transactions.unshift({
      ref: 'WTX-' + Math.floor(800000 + Math.random() * 100000), type: 'Withdraw',
      partyName: '↗ ' + (this.wd_method || 'KCB Bank'), partyId: this.wd_destination || 'XXXX-1234',
      partyInitials: 'KB', avClass: 'av-kb', amount: +this.wd_amount, sign: '-',
      balanceAfter: this.walletBalance, date: 'Just now',
    });
    this.modalStep = 4;
  }
  confirmToSavings() {
    if (!this.pinValid(this.ts_pin)) { this.showToast('Enter a valid 4-digit PIN.', 'error'); return; }
    this.walletBalance -= +this.ts_amount || 0;
    this.transactions.unshift({
      ref: 'WTX-' + Math.floor(800000 + Math.random() * 100000), type: 'Transfer',
      partyName: '↗ ' + this.ts_account, partyId: 'SACCO Account',
      partyInitials: 'RS', avClass: 'av-sav', amount: +this.ts_amount, sign: '-',
      balanceAfter: this.walletBalance, date: 'Just now',
    });
    this.modalStep = 4;
  }
  finalizeCreateWallet() {
    if (!this.cw_member || !this.cw_pin || this.cw_pin.length !== 4) {
      this.showToast('Please complete all required fields.', 'error'); return;
    }
    const initials = this.cw_member.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);
    this.memberWallets.unshift({
      initials, avClass: 'av-sa', name: this.cw_member, memberId: 'SP-' + Math.floor(10000 + Math.random() * 99999),
      walletId: 'SP-WAL-' + Math.floor(10000 + Math.random() * 99999), balance: +this.cw_deposit || 0,
      status: 'Active', lastActivity: 'Just now',
    });
    this.showToast(`Wallet created for ${this.cw_member}.`);
    this.closeModal();
  }
  saveEditLimits() {
    this.limits.dailySendMax = +this.el_dailySend;
    this.limits.dailyWithdrawMax = +this.el_dailyWithdraw;
    this.limits.monthlyMax = +this.el_monthly;
    this.limits.singleTxnMax = +this.el_singleMax;
    this.showToast('Transaction limits updated.');
    this.closeModal();
  }
  saveConfigAlerts() {
    this.alerts[0].threshold = `KES ${(+this.ca_lowThreshold).toLocaleString()}`;
    this.alerts[1].threshold = `KES ${(+this.ca_highThreshold).toLocaleString()}`;
    this.alerts[2].threshold = `KES ${(+this.ca_largeThreshold).toLocaleString()}`;
    this.showToast('Alert thresholds updated.');
    this.closeModal();
  }
  saveChangePin() {
    if (!this.cp_current || !this.cp_new || this.cp_new !== this.cp_confirm) {
      this.showToast('PIN mismatch or empty fields.', 'error'); return;
    }
    this.showToast('Wallet PIN updated successfully.');
    this.cp_current = ''; this.cp_new = ''; this.cp_confirm = '';
    this.closeModal();
  }
  confirmFreeze() {
    if (!this.fr_reason) { this.showToast('Please specify a freeze reason.', 'error'); return; }
    this.showToast('Account frozen successfully.', 'warning');
    this.closeModal();
  }
  confirmCloseWallet() {
    if (this.cl_confirm !== 'CLOSE') { this.showToast('Type CLOSE to confirm.', 'error'); return; }
    this.showToast('Wallet closed permanently.', 'warning');
    this.closeModal();
  }
  copyShareLink() {
    navigator.clipboard?.writeText(`https://saccopay.app/wallet/${this.walletId}`).catch(() => {});
    this.showToast('Share link copied!', 'info');
    this.closeModal();
  }

  /* ─── Member Wallet Manage ─── */
  manageMemberWallet(w: MemberWallet) {
    this.selectedWallet = w;
    this.openModal('manage_wallet', w);
  }
  freezeMember() {
    if (!this.selectedWallet) return;
    this.selectedWallet.status = this.selectedWallet.status === 'Active' ? 'Frozen' : 'Active';
    this.showToast(`Wallet ${this.selectedWallet.walletId} is now ${this.selectedWallet.status}.`);
    this.closeModal();
  }

  /* ─── Scheduled Payment Actions ─── */
  pauseScheduled(s: ScheduledPayment) {
    s.status = s.status === 'Active' ? 'Paused' : 'Active';
    this.showToast(`Schedule ${s.id} is now ${s.status}.`, s.status === 'Active' ? 'success' : 'warning');
  }
  deleteScheduled(s: ScheduledPayment) {
    this.scheduledPayments = this.scheduledPayments.filter(x => x.id !== s.id);
    this.showToast(`Schedule ${s.id} removed.`, 'warning');
  }

  /* ─── New Scheduled Payment Form ─── */
  np_recipient = ''; np_amount = ''; np_frequency = 'Monthly';
  addScheduledPayment() {
    if (!this.np_recipient || !this.np_amount) { this.showToast('Fill all required fields.', 'error'); return; }
    this.scheduledPayments.push({
      id: 'SCH-' + Math.floor(100 + Math.random() * 900),
      recipient: this.np_recipient, amount: +this.np_amount, frequency: this.np_frequency,
      nextDate: 'Next ' + this.np_frequency.toLowerCase(),
      destination: 'SP-WAL', status: 'Active',
    });
    this.showToast('New scheduled payment created.');
    this.np_recipient = ''; this.np_amount = ''; this.np_frequency = 'Monthly';
  }

  ngOnInit() {}

  /* ─── Utilities ─── */
  pct(used: number, max: number): number { return Math.min(100, (used / max) * 100); }
  fmtKES(n: number): string { return 'KES ' + n.toLocaleString(); }
}
