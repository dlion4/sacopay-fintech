import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ─────────────────────────────────────────────
   INTERFACES
───────────────────────────────────────────── */
interface Transaction {
  id: number; ref: string;
  type: 'received' | 'sent' | 'transfer' | 'topup' | 'withdraw'; typeLabel: string;
  name: string; walletId: string; initials: string; avatarColor: string;
  amount: number; balance: number; date: string;
}

interface MemberWallet {
  id: number; name: string; memberId: string; walletId: string;
  initials: string; avatarColor: string; balance: number;
  status: 'Active' | 'Frozen' | 'Blocked'; lastActivity: string;
  dailyLimit?: number; maxBalance?: number;
}

interface BalanceAlert {
  label: string; desc: string; inputType: 'number' | 'toggle';
  value?: number; enabled?: boolean;
}

interface TransactionLimit {
  label: string; current: string; remaining: string; percent: number | null;
}

interface Permission {
  label: string; desc: string; color: string; icon: string; enabled: boolean;
}

interface AccountAction {
  key: string; label: string; desc: string; color: string; icon: string;
  confirmMsg: string; requiresPin: boolean; btnClass: string;
}

interface ScheduledPayment {
  label: string; recipient: string; frequency: string; amount: number; nextDate: string; active: boolean;
}

interface Toast {
  show: boolean; message: string; type: 'success' | 'danger' | 'info' | 'warning';
}

/* ─── MODALS TYPE ─── */
interface Modals {
  addMoney: boolean;
  send: boolean;
  withdraw: boolean;
  savings: boolean;
  scheduled: boolean;
  qr: boolean;
  share: boolean;
  txnDetail: boolean;
  createWallet: boolean;
  manageWallet: boolean;
  settings: boolean;
  actionConfirm: boolean;
  changePin: boolean;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
@Component({
  selector: 'app-saccopay-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./saccopay-wallet.html',
  styleUrls: ['./saccopay-wallet.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SaccopayWalletComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  /* ── ACTIVE TAB ── */
  activeTab: 'transactions' | 'limits' | 'controls' | 'members' = 'transactions';

  /* ── TOAST ── */
  toast: Toast = { show: false, message: '', type: 'success' };
  private toastTimer?: ReturnType<typeof setTimeout>;

  showToast(message: string, type: Toast['type'] = 'success'): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { show: true, message, type };
    this.toastTimer = setTimeout(() => {
      this.toast.show = false;
      this.cdr.markForCheck();
    }, 3500);
  }

  closeToast(): void { this.toast.show = false; }

  /* ── MODALS ── */
  modals: Modals = {
    addMoney: false, send: false, withdraw: false, savings: false,
    scheduled: false, qr: false, share: false, txnDetail: false,
    createWallet: false, manageWallet: false, settings: false,
    actionConfirm: false, changePin: false,
  };

  closeAllModals(): void {
    (Object.keys(this.modals) as (keyof Modals)[]).forEach(k => (this.modals[k] = false));
    this.confirmPin = '';
  }

  openAddMoneyModal():     void { this.closeAllModals(); this.modals.addMoney = true; }
  openSendModal():         void { this.closeAllModals(); this.modals.send = true; }
  openWithdrawModal():     void { this.closeAllModals(); this.modals.withdraw = true; }
  openSavingsModal():      void { this.closeAllModals(); this.modals.savings = true; }
  openScheduledModal():    void { this.closeAllModals(); this.modals.scheduled = true; }
  openQRModal():           void { this.closeAllModals(); this.modals.qr = true; }
  openShareModal():        void { this.closeAllModals(); this.modals.share = true; }
  openCreateWalletModal(): void { this.closeAllModals(); this.modals.createWallet = true; }
  openSettingsModal():     void { this.closeAllModals(); this.modals.settings = true; }

  /* ── TAB SWITCH ── */
  switchTab(tab: 'transactions' | 'limits' | 'controls' | 'members'): void {
    this.activeTab = tab;
  }

  /* ── TRANSACTION FILTER ── */
  txnFilter: 'all' | 'received' | 'sent' | 'transfers' = 'all';
  setTxnFilter(f: 'all' | 'received' | 'sent' | 'transfers'): void { this.txnFilter = f; }

  /* ── MEMBER SEARCH ── */
  memberSearch = '';

  /* ── TRANSACTIONS DATA ── */
  transactions: Transaction[] = [
    { id:1, ref:'WTX-889421', type:'received', typeLabel:'↓ Received', name:'Sarah Auma',    walletId:'SP-WAL-00234', initials:'SA', avatarColor:'#00d084', amount:15000,  balance:247580, date:'Dec 18, 3:45 PM' },
    { id:2, ref:'WTX-889428', type:'sent',     typeLabel:'↑ Sent',     name:'Peter Omondi',  walletId:'SP-WAL-00145', initials:'PO', avatarColor:'#ff9800', amount:-5000,  balance:232580, date:'Dec 18, 1:20 PM' },
    { id:3, ref:'WTX-889419', type:'transfer', typeLabel:'→ Transfer', name:'— Regular Savings', walletId:'SACCO Account', initials:'RS', avatarColor:'#9c27b0', amount:-50000, balance:237580, date:'Dec 17, 4:10 PM' },
    { id:4, ref:'WTX-889418', type:'topup',    typeLabel:'↑ Top-up',   name:'M-Pesa',        walletId:'0722-XXX-456', initials:'MP', avatarColor:'#4caf50', amount:100000, balance:287580, date:'Dec 17, 10:00 AM' },
    { id:5, ref:'WTX-889417', type:'withdraw', typeLabel:'↓ Withdraw', name:'— KCB Bank',    walletId:'XXXX-1234',    initials:'KB', avatarColor:'#2196f3', amount:-30000, balance:187580, date:'Dec 16, 2:30 PM' },
  ];

  filteredTransactions(): Transaction[] {
    if (this.txnFilter === 'all') return this.transactions;
    if (this.txnFilter === 'received') return this.transactions.filter(t => t.type === 'received' || t.type === 'topup');
    if (this.txnFilter === 'sent') return this.transactions.filter(t => t.type === 'sent' || t.type === 'withdraw');
    if (this.txnFilter === 'transfers') return this.transactions.filter(t => t.type === 'transfer');
    return this.transactions;
  }

  /* ── MEMBER WALLETS DATA ── */
  memberWallets: MemberWallet[] = [
    { id:1, name:'Mary Wanjiku',   memberId:'SP-10023', walletId:'SP-WAL-00234', initials:'MW', avatarColor:'#00d084', balance:85200,  status:'Active', lastActivity:'Today, 3:45 PM' },
    { id:2, name:'John Kamau',     memberId:'SP-10015', walletId:'SP-WAL-00145', initials:'JK', avatarColor:'#9c27b0', balance:42750,  status:'Active', lastActivity:'Today, 1:20 PM' },
    { id:3, name:'Bernard Kiprop', memberId:'SP-10078', walletId:'SP-WAL-00312', initials:'BK', avatarColor:'#f44336', balance:120400, status:'Frozen', lastActivity:'Dec 15' },
    { id:4, name:'Grace Akinyi',   memberId:'SP-10067', walletId:'SP-WAL-00189', initials:'GA', avatarColor:'#ff9800', balance:15800,  status:'Active', lastActivity:'Dec 17' },
  ];

  filteredMembers(): MemberWallet[] {
    if (!this.memberSearch.trim()) return this.memberWallets;
    const q = this.memberSearch.toLowerCase();
    return this.memberWallets.filter(m =>
      m.name.toLowerCase().includes(q) || m.memberId.toLowerCase().includes(q) || m.walletId.toLowerCase().includes(q)
    );
  }

  /* ── TRANSACTION LIMITS ── */
  transactionLimits: TransactionLimit[] = [
    { label:'Daily Send Limit',             current:'KES 35,000 / 100,000',     remaining:'KES 65,000 remaining today',          percent:35 },
    { label:'Daily Withdrawal Limit',       current:'KES 50,000 / 200,000',     remaining:'KES 150,000 remaining today',         percent:25 },
    { label:'Monthly Transaction Volume',   current:'KES 480,000 / 2,000,000',  remaining:'KES 1,520,000 remaining this month',  percent:24 },
    { label:'Single Transaction Max',       current:'KES 150,000',              remaining:'Per transaction cap',                 percent:null },
  ];

  /* ── BALANCE ALERTS ── */
  balanceAlerts: BalanceAlert[] = [
    { label:'Low Balance Alert',        desc:'Notify when balance drops below threshold',  inputType:'number', value:10000 },
    { label:'High Balance Alert',       desc:'Notify when balance exceeds limit',          inputType:'number', value:500000 },
    { label:'Large Transaction Alert',  desc:'Notify on transactions above threshold',     inputType:'number', value:50000 },
    { label:'Login Alert',              desc:'Notify on new device login',                inputType:'toggle', enabled:true },
    { label:'Failed Transaction Alert', desc:'Notify on failed or declined transactions',  inputType:'toggle', enabled:true },
  ];

  /* ── PERMISSIONS ── */
  permissions: Permission[] = [
    { label:'Receive Payments',   desc:'Allow incoming payments to this wallet',   color:'#00d084', icon:'✅', enabled:true },
    { label:'Send Payments',      desc:'Allow outgoing payments from this wallet', color:'#2196f3', icon:'🔵', enabled:true },
    { label:'Withdrawals',        desc:'Allow cash-out to M-Pesa / bank',          color:'#f44336', icon:'🔴', enabled:true },
    { label:'Internal Transfers', desc:'Transfer to savings / share accounts',     color:'#9c27b0', icon:'🔀', enabled:true },
  ];

  /* ── ACCOUNT ACTIONS ── */
  accountActions: AccountAction[] = [
    { key:'freeze', label:'Freeze Account',    desc:'Temporarily freeze all wallet activity', color:'#2196f3', icon:'❄️', confirmMsg:'Are you sure you want to freeze this wallet? All transactions will be suspended until you unfreeze.', requiresPin:true,  btnClass:'tw-btn tw-btn--blue' },
    { key:'pause',  label:'Pause Account',     desc:'Pause sending — receiving still works',  color:'#ff9800', icon:'⏸️', confirmMsg:'Pause outgoing transactions? Incoming payments will still work normally.',                              requiresPin:false, btnClass:'tw-btn tw-btn-orange' },
    { key:'pin',    label:'Change Wallet PIN', desc:'Update the transaction PIN',             color:'#00bcd4', icon:'🔒', confirmMsg:'',                                                                                                       requiresPin:false, btnClass:'tw-btn tw-btn-primary' },
    { key:'close',  label:'Close Wallet',      desc:'Permanently close this wallet account',  color:'#f44336', icon:'⊗',  confirmMsg:'This action is IRREVERSIBLE. All funds must be withdrawn before closing. Do you want to proceed?',     requiresPin:true,  btnClass:'tw-btn tw-btn-danger' },
  ];

  pendingAction: AccountAction | null = null;
  confirmPin = '';

  handleAccountAction(action: AccountAction): void {
    if (action.key === 'pin') { this.closeAllModals(); this.modals.changePin = true; return; }
    this.pendingAction = action;
    this.closeAllModals();
    this.modals.actionConfirm = true;
  }

  confirmAction(): void {
    if (!this.pendingAction) return;
    const label = this.pendingAction.label;
    this.closeAllModals();
    this.showToast(`${label} action applied successfully.`, 'success');
    this.pendingAction = null; this.confirmPin = '';
  }

  onPermissionChange(_perm: Permission): void { /* silent */ }

  /* ── SCHEDULED PAYMENTS ── */
  scheduledPayments: ScheduledPayment[] = [
    { label:'Monthly Savings',  recipient:'SP-WAL-00145', frequency:'Monthly', amount:5000,  nextDate:'Jan 1',  active:true },
    { label:'Weekly Allowance', recipient:'0722-XXX-888', frequency:'Weekly',  amount:2000,  nextDate:'Dec 23', active:true },
    { label:'SACCO Shares',     recipient:'SACCO Account', frequency:'Monthly',amount:10000, nextDate:'Jan 5',  active:false },
  ];

  newScheduled = { label:'', recipient:'', amount:0, frequency:'monthly', startDate:'' };

  addScheduled(): void {
    if (!this.newScheduled.label || !this.newScheduled.recipient || !this.newScheduled.amount) return;
    this.scheduledPayments.push({ ...this.newScheduled, nextDate: this.newScheduled.startDate || 'TBD', active:true });
    this.newScheduled = { label:'', recipient:'', amount:0, frequency:'monthly', startDate:'' };
    this.showToast('Scheduled payment added.', 'success');
  }

  deleteScheduled(sched: ScheduledPayment): void {
    this.scheduledPayments = this.scheduledPayments.filter(s => s !== sched);
  }

  /* ── FORMS ── */
  addMoneyForm = { source:'mpesa', phone:'', amount:0, reference:'' };
  sendForm     = { sendTo:'wallet', recipient:'', amount:0, note:'', pin:'' };
  withdrawForm = { method:'mpesa', phone:'', bankAccount:'', bankName:'kcb', amount:0, pin:'' };
  savingsForm  = { account:'regular', amount:0, frequency:'once' };
  createWalletForm = { memberName:'', memberId:'', phone:'', email:'', initialDeposit:0, walletType:'standard' };
  walletSettings = { displayName:'SACCOPay Wallet', currency:'KES', pin:'', autoStatement:true, smsNotif:true, emailNotif:true, twoFA:false };
  pinForm = { current:'', newPin:'', confirm:'' };

  selectedTxn: Transaction | null = null;
  selectedMember: MemberWallet | null = null;

  submitAddMoney(): void {
    if (!this.addMoneyForm.amount) return;
    this.closeAllModals();
    this.showToast(`KES ${this.formatAmount(this.addMoneyForm.amount)} top-up request sent.`, 'success');
    this.addMoneyForm = { source:'mpesa', phone:'', amount:0, reference:'' };
  }

  submitSend(): void {
    if (!this.sendForm.recipient || !this.sendForm.amount || !this.sendForm.pin) return;
    this.closeAllModals();
    this.showToast(`KES ${this.formatAmount(this.sendForm.amount)} sent successfully.`, 'success');
    this.sendForm = { sendTo:'wallet', recipient:'', amount:0, note:'', pin:'' };
  }

  submitWithdraw(): void {
    if (!this.withdrawForm.amount || !this.withdrawForm.pin) return;
    this.closeAllModals();
    this.showToast(`Withdrawal of KES ${this.formatAmount(this.withdrawForm.amount)} initiated.`, 'success');
    this.withdrawForm = { method:'mpesa', phone:'', bankAccount:'', bankName:'kcb', amount:0, pin:'' };
  }

  submitSavings(): void {
    if (!this.savingsForm.amount) return;
    this.closeAllModals();
    this.showToast(`KES ${this.formatAmount(this.savingsForm.amount)} moved to savings.`, 'success');
    this.savingsForm = { account:'regular', amount:0, frequency:'once' };
  }

  submitCreateWallet(): void {
    if (!this.createWalletForm.memberName || !this.createWalletForm.memberId) return;
    const colors = ['#00d084','#9c27b0','#2196f3','#ff9800','#f44336'];
    const newMember: MemberWallet = {
      id: Date.now(), name: this.createWalletForm.memberName, memberId: this.createWalletForm.memberId,
      walletId: `SP-WAL-${String(Math.floor(Math.random()*99999)).padStart(5,'0')}`,
      initials: this.createWalletForm.memberName.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2),
      avatarColor: colors[Math.floor(Math.random()*colors.length)],
      balance: this.createWalletForm.initialDeposit||0, status:'Active', lastActivity:'Just now',
    };
    this.memberWallets = [newMember, ...this.memberWallets];
    this.closeAllModals();
    this.showToast(`Wallet created for ${this.createWalletForm.memberName}.`, 'success');
    this.createWalletForm = { memberName:'', memberId:'', phone:'', email:'', initialDeposit:0, walletType:'standard' };
  }

  saveWalletSettings(): void {
    this.closeAllModals();
    this.showToast('Wallet settings saved.', 'success');
  }

  saveLimits(): void { this.showToast('Limits & alerts updated.', 'success'); }

  submitChangePin(): void {
    if (!this.pinForm.current || !this.pinForm.newPin || !this.pinForm.confirm) return;
    if (this.pinForm.newPin !== this.pinForm.confirm) {
      this.showToast('PINs do not match. Please try again.', 'danger'); return;
    }
    this.closeAllModals();
    this.showToast('Wallet PIN updated successfully.', 'success');
    this.pinForm = { current:'', newPin:'', confirm:'' };
  }

  openTxnDetail(txn: Transaction): void {
    this.selectedTxn = txn; this.closeAllModals(); this.modals.txnDetail = true;
  }

  openManageWalletModal(member: MemberWallet): void {
    this.selectedMember = { ...member, dailyLimit: member.dailyLimit??100000, maxBalance: member.maxBalance??1000000 };
    this.closeAllModals(); this.modals.manageWallet = true;
  }

  manageMemberAction(action: string): void {
    if (!this.selectedMember) return;
    if (action === 'topup') { this.closeAllModals(); this.modals.addMoney = true; return; }
    if (action === 'freeze') {
      const newStatus: 'Active'|'Frozen' = this.selectedMember.status === 'Frozen' ? 'Active' : 'Frozen';
      this.selectedMember = { ...this.selectedMember, status: newStatus };
      this.memberWallets = this.memberWallets.map(m => m.id === this.selectedMember!.id ? { ...m, status: newStatus } : m);
      this.showToast(`Wallet ${newStatus === 'Frozen' ? 'frozen' : 'unfrozen'}.`, newStatus === 'Frozen' ? 'warning' : 'info');
      this.closeAllModals(); return;
    }
    if (action === 'close') {
      this.showToast(`Close wallet request for ${this.selectedMember?.name} submitted.`, 'danger'); this.closeAllModals(); return;
    }
  }

  saveMemberWallet(): void {
    if (!this.selectedMember) return;
    const idx = this.memberWallets.findIndex(m => m.id === this.selectedMember!.id);
    if (idx !== -1) this.memberWallets[idx] = { ...this.selectedMember };
    this.closeAllModals();
    this.showToast('Member wallet settings saved.', 'success');
  }

  copyWalletId(): void {
    navigator.clipboard?.writeText('SP-WAL-2024-00158').catch(()=>{});
    this.showToast('Wallet ID copied to clipboard.', 'info');
  }

  downloadReceipt(): void { this.showToast('Receipt download started.', 'info'); this.closeAllModals(); }
  downloadQR(): void { this.showToast('QR Code downloaded.', 'success'); }
  shareQR(): void { this.closeAllModals(); this.modals.share = true; }

  shareVia(method: string): void {
    const msgs: Record<string,string> = { copy:'Wallet link copied!', sms:'Opening SMS...', email:'Opening email client...', whatsapp:'Opening WhatsApp...' };
    this.closeAllModals();
    this.showToast(msgs[method] || 'Sharing...', 'info');
  }

  exportTransactions(): void { this.showToast('Transactions exported to CSV.', 'success'); }

  goToPage(_page: number): void { /* pagination demo */ }

  formatAmount(value: number): string { return Math.abs(value).toLocaleString('en-KE'); }

  getWithdrawNet(): string {
    const net = (this.withdrawForm.amount || 0) - 33;
    return net > 0 ? net.toLocaleString('en-KE') : '0';
  }

  trackById(_i: number, item: { id: number }): number { return item.id; }
  trackByIndex(i: number): number { return i; }

  ngOnInit(): void {}
}