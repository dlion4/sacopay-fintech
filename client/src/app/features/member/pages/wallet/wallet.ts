import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Interfaces ───
interface KpiBox {
  label: string;
  value: string;
  sub: string;
  color: string;
  action: string;
}

interface ActionTile {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  description: string;
  modal: string;
}

interface Transaction {
  type: 'in' | 'out' | 'xfr';
  icon: string;
  title: string;
  subtitle: string;
  amount: string;
  amountColor: string;
  date: string;
  detail: TxDetail;
}

interface TxDetail {
  type: string;
  title: string;
  amount: string;
  date: string;
  channel: string;
  status: string;
  flow: string;
  balanceAfter: string;
}

interface ServiceCard {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  tags: ServiceTag[];
  details: string;
  modal: string;
}

interface ServiceTag {
  label: string;
  icon: string;
  variant: string;
}

interface ControlItem {
  title: string;
  description: string;
  checked: boolean;
  name: string;
  type: 'switch' | 'link';
  icon?: string;
  iconColor?: string;
  detail?: string;
}

interface StepItem {
  label: string;
  done: boolean;
  active: boolean;
}

interface Toast {
  id: number;
  message: string;
}

interface DepositMethod {
  id: string;
  name: string;
  desc: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  selected: boolean;
}

interface WithdrawMethod {
  id: string;
  name: string;
  desc: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  selected: boolean;
}

interface Announcement {
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  date: string;
}

// ─── Component ───
// NOTE: If using NgModule (not standalone bootstrap), add: standalone: false
// and declare this component in your module's declarations array.
@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.scss']
})
export class WalletComponent implements OnInit {

  // ─── User Data ───
  userName = 'John Kamau';
  userInitials = 'JK';
  memberNumber = 'SP-10015';
  saccoName = 'Rongo SACCO';
  walletId = 'SP-WAL-2024-00145';
  balance = 128450;
  balanceFormatted = '128,450';
  walletStatus = 'Active';

  // ─── KPIs ───
  kpis: KpiBox[] = [
    { label: 'This Month In', value: '+KES 185K', sub: '12 deposits', color: 'primary', action: 'history' },
    { label: 'This Month Out', value: '-KES 92K', sub: '8 withdrawals', color: 'danger', action: 'history' },
    { label: 'Daily Limit', value: 'KES 35K', sub: 'of KES 100K used', color: 'default', action: 'limitsModal' },
    { label: 'Transaction PIN', value: 'Set ✓', sub: 'Last changed Dec 1', color: 'success', action: 'pinSetupModal' }
  ];

  // ─── Action Tiles ───
  actionTiles: ActionTile[] = [
    { icon: 'bi-box-arrow-in-down', iconColor: 'primary', iconBg: 'rgba(26,115,232,0.1)', label: 'Deposit', description: 'Top up wallet', modal: 'deposit' },
    { icon: 'bi-box-arrow-up', iconColor: 'danger', iconBg: 'rgba(244,67,54,0.1)', label: 'Withdraw', description: 'To M-Pesa/Bank', modal: 'withdraw' },
    { icon: 'bi-send', iconColor: 'blue', iconBg: 'rgba(33,150,243,0.1)', label: 'Send', description: 'To member/phone', modal: 'send' },
    { icon: 'bi-arrow-left-right', iconColor: 'purple', iconBg: 'rgba(156,39,176,0.1)', label: 'Transfer', description: 'To savings/shares', modal: 'transfer' },
    { icon: 'bi-inbox', iconColor: 'orange', iconBg: 'rgba(255,152,0,0.1)', label: 'Request', description: 'Request money', modal: 'request' },
    { icon: 'bi-lightning', iconColor: 'teal', iconBg: 'rgba(0,188,212,0.1)', label: 'Services', description: 'Loans & overdraft', modal: 'servicesTab' }
  ];

  // ─── Tabs ───
  activeTab: 'history' | 'services' | 'controls' = 'history';

  // ─── Transactions ───
  transactions: Transaction[] = [
    {
      type: 'in', icon: 'bi-arrow-down-circle-fill', title: 'M-Pesa Top Up', subtitle: 'From 0722-XXX-123',
      amount: '+ KES 50,000', amountColor: 'primary', date: 'Dec 18, 3:45 PM',
      detail: { type: 'Deposit', title: 'M-Pesa Top Up', amount: '+ KES 50,000', date: 'Dec 18, 3:45 PM', channel: 'M-Pesa • QJK8X2M1PL', status: 'Success', flow: 'Regular Savings → Wallet', balanceAfter: 'KES 128,450' }
    },
    {
      type: 'out', icon: 'bi-arrow-up-circle-fill', title: 'Withdraw to M-Pesa', subtitle: 'To 0722-XXX-123',
      amount: '- KES 15,000', amountColor: 'danger', date: 'Dec 18, 1:20 PM',
      detail: { type: 'Withdrawal', title: 'Withdraw to M-Pesa', amount: '- KES 15,000', date: 'Dec 18, 1:20 PM', channel: 'M-Pesa • 0722-XXX-123', status: 'Success', flow: 'Wallet → M-Pesa', balanceAfter: 'KES 78,450' }
    },
    {
      type: 'xfr', icon: 'bi-arrow-left-right', title: 'Transfer to Savings', subtitle: 'Wallet → Regular Savings',
      amount: '- KES 30,000', amountColor: 'blue', date: 'Dec 17, 4:10 PM',
      detail: { type: 'Transfer', title: 'Transfer to Savings', amount: '- KES 30,000', date: 'Dec 17, 4:10 PM', channel: 'Internal Transfer', status: 'Success', flow: 'Wallet → Regular Savings', balanceAfter: 'KES 93,450' }
    },
    {
      type: 'in', icon: 'bi-arrow-down-circle-fill', title: 'Received from Sarah Auma', subtitle: 'SP-WAL-00234',
      amount: '+ KES 5,000', amountColor: 'primary', date: 'Dec 17, 11:00 AM',
      detail: { type: 'Received', title: 'Received from Sarah Auma', amount: '+ KES 5,000', date: 'Dec 17, 11:00 AM', channel: 'SACCOPay Wallet • SP-WAL-00234', status: 'Success', flow: 'From Sarah Auma', balanceAfter: 'KES 123,450' }
    },
    {
      type: 'out', icon: 'bi-send-fill', title: 'Sent to Peter Omondi', subtitle: 'SP-WAL-00189',
      amount: '- KES 8,000', amountColor: 'danger', date: 'Dec 16, 2:30 PM',
      detail: { type: 'Sent', title: 'Sent to Peter Omondi', amount: '- KES 8,000', date: 'Dec 16, 2:30 PM', channel: 'SACCOPay Wallet • SP-WAL-00189', status: 'Success', flow: 'To Peter Omondi', balanceAfter: 'KES 118,450' }
    }
  ];

  selectedTransaction: TxDetail | null = null;

  // ─── Services ───
  services: ServiceCard[] = [
    {
      icon: 'bi-cash-coin', iconColor: 'primary', iconBg: 'rgba(26,115,232,0.1)',
      title: 'Overdraft', description: 'Access up to KES 50,000 instantly when your wallet runs low. No collateral needed.',
      tags: [{ label: 'Instant', icon: 'bi-lightning-fill', variant: 'instant' }, { label: 'Popular', icon: 'bi-star-fill', variant: 'popular' }],
      details: 'Limit: KES 50,000 | Rate: 1.5%/month | Tenure: 30 days',
      modal: 'overdraft'
    },
    {
      icon: 'bi-rocket-takeoff', iconColor: 'blue', iconBg: 'rgba(33,150,243,0.1)',
      title: 'Quick Loan', description: 'Borrow up to KES 200,000 in minutes. No guarantors. Straight to your wallet.',
      tags: [{ label: 'Instant', icon: 'bi-lightning-fill', variant: 'instant' }, { label: 'New', icon: 'bi-stars', variant: 'new' }],
      details: 'Limit: KES 200,000 | Rate: 12% p.a. | Up to: 6 months',
      modal: 'quickLoan'
    },
    {
      icon: 'bi-calendar2-check', iconColor: 'purple', iconBg: 'rgba(156,39,176,0.1)',
      title: 'Salary Advance', description: 'Get up to 50% of your next salary early. Auto-repaid on payday.',
      tags: [{ label: 'Instant', icon: 'bi-lightning-fill', variant: 'instant' }],
      details: 'Max: 50% of salary | Fee: 3% flat | Repay: Next payday',
      modal: 'salaryAdvance'
    },
    {
      icon: 'bi-bag-check', iconColor: 'orange', iconBg: 'rgba(255,152,0,0.1)',
      title: 'Buy Now Pay Later', description: 'Split purchases into 3 installments. 0% interest for qualifying items.',
      tags: [{ label: 'New', icon: 'bi-stars', variant: 'new' }],
      details: 'Max: KES 100,000 | Installments: 3 | Interest: 0%*',
      modal: 'bnpl'
    }
  ];

  // ─── Controls ───
  walletControls: ControlItem[] = [
    { title: 'Channel All Funds via Wallet', description: 'SACCO deposits route through wallet first for record-keeping', checked: true, name: 'Fund channeling', type: 'switch' },
    { title: 'Allow Incoming Payments', description: 'Other members can send money to this wallet', checked: true, name: 'Incoming payments', type: 'switch' },
    { title: 'Allow External Withdrawals', description: 'Withdraw to M-Pesa, Airtel Money, or bank', checked: true, name: 'External withdrawals', type: 'switch' },
    { title: 'Auto-Save to Savings', description: 'Auto-transfer 10% of each deposit to savings', checked: false, name: 'Auto-save', type: 'switch' },
    { title: 'Freeze Wallet (Pause All)', description: 'Temporarily block all wallet activity', checked: false, name: 'Wallet freeze', type: 'switch' }
  ];

  securityControls: ControlItem[] = [
    { title: 'Transaction PIN', description: 'Required for all outgoing transactions', checked: true, name: 'Transaction PIN', type: 'link', icon: 'bi-key', iconColor: 'primary', detail: 'Set ✓' },
    { title: 'Require PIN for All Transactions', description: 'Including internal transfers and payments', checked: true, name: 'PIN for all', type: 'switch' },
    { title: 'Low Balance Alert', description: 'Notify when below KES 5,000', checked: true, name: 'Low balance alert', type: 'switch' },
    { title: 'Large Transaction Alert', description: 'Notify for transactions above KES 50,000', checked: true, name: 'Large transaction alert', type: 'switch' },
    { title: 'Transaction Limits', description: 'Daily: KES 100K • Monthly: KES 1M', checked: false, name: 'Transaction limits', type: 'link', icon: 'bi-speedometer2', iconColor: 'orange' }
  ];

  // ─── Modal State ───
  activeModal: string | null = null;

  // ─── Deposit Wizard ───
  depStep = 1;
  depTotalSteps = 4;
  depStepNames = ['Method', 'Details', 'PIN', 'Complete'];
  depMethods: DepositMethod[] = [
    { id: 'mpesa', name: 'M-Pesa', desc: 'STK Push • Instant • Free', icon: 'bi-phone', iconColor: '#388e3c', iconBg: 'rgba(76,175,80,0.1)', selected: true },
    { id: 'airtel', name: 'Airtel Money', desc: 'Push notification • Instant • Free', icon: 'bi-phone', iconColor: '#009688', iconBg: 'rgba(0,150,136,0.1)', selected: false },
    { id: 'bank', name: 'Bank Transfer', desc: '1-2 business days • KES 50 fee', icon: 'bi-bank', iconColor: 'var(--blue)', iconBg: 'rgba(33,150,243,0.1)', selected: false },
    { id: 'card', name: 'Debit / Credit Card', desc: 'Visa / Mastercard • Instant • 1.5% fee', icon: 'bi-credit-card-2-front', iconColor: 'var(--purple)', iconBg: 'rgba(156,39,176,0.1)', selected: false }
  ];
  depAmount = 50000;
  depPhone = '+254 722 123 456';
  depBankName = 'KCB Bank';
  depAccountNumber = '';
  depCardNumber = '';
  depCardExpiry = '';
  depCardCvv = '';
  depSelectedMethod = 'mpesa';
  depPin = ['', '', '', ''];
  depSuccess = false;
  depRef = 'WTX-20241218-0901';

  // ─── Withdraw Wizard ───
  wdStep = 1;
  wdTotalSteps = 4;
  wdStepNames = ['Destination', 'Details', 'PIN', 'Complete'];
  wdMethods: WithdrawMethod[] = [
    { id: 'mpesa', name: 'M-Pesa', desc: 'Instant • KES 0 fee', icon: 'bi-phone', iconColor: '#388e3c', iconBg: 'rgba(76,175,80,0.1)', selected: true },
    { id: 'airtel', name: 'Airtel Money', desc: 'Instant • KES 0 fee', icon: 'bi-phone', iconColor: '#009688', iconBg: 'rgba(0,150,136,0.1)', selected: false },
    { id: 'bank', name: 'Bank Account', desc: '1-24 hrs • KES 50 fee', icon: 'bi-bank', iconColor: 'var(--blue)', iconBg: 'rgba(33,150,243,0.1)', selected: false }
  ];
  wdAmount = 15000;
  wdPhone = '0722-XXX-123';
  wdPin = ['', '', '', ''];
  wdSuccess = false;
  wdRef = 'WTX-20241218-0902';

  // ─── Send Money ───
  sendToType = 'wallet';
  sendWalletId = '';
  sendPhone = '';
  sendAmount = 5000;
  sendNote = '';

  // ─── Transfer ───
  transferTo = 'Regular Savings (KES 250,000)';
  transferAmount = 30000;
  transferNarration = '';

  // ─── Request Money ───
  requestFrom = '';
  requestAmount: number | null = null;
  requestReason = '';

  // ─── Overdraft ───
  overdraftLimit = 50000;
  overdraftAmount = 20000;
  overdraftInterest = 300;
  overdraftRepayDate = 'Jan 18, 2025';
  overdraftTotal = 20300;

  // ─── Quick Loan ───
  quickLoanLimit = 200000;
  quickLoanAmount = 100000;
  quickLoanTenure = '6 months';
  quickLoanInterest = 6000;
  quickLoanMonthly = 17667;
  quickLoanTotal = 106000;

  // ─── Salary Advance ───
  salaryAdvanceMax = 42500;
  salaryAdvanceAmount = 30000;
  salaryAdvanceFee = 900;
  salaryAdvanceReceive = 29100;
  salaryAdvanceRepayDate = 'Jan 25, 2025 (payday)';

  // ─── PIN Setup ───
  pinCurrent = '';
  pinNew = '';
  pinConfirm = '';

  // ─── Limits ───
  limitDailySendUsed = 35000;
  limitDailySendMax = 100000;
  limitDailyWithdrawUsed = 15000;
  limitDailyWithdrawMax = 200000;
  limitMonthlyUsed = 277000;
  limitMonthlyMax = 1000000;

  // ─── QR Code ───
  qrCells: boolean[] = [];

  // ─── Toast System ───
  toasts: Toast[] = [];
  private toastId = 0;

  // ─── Lifecycle ───
  ngOnInit(): void {
    this.generateQR();
  }

  // ─── Tab Switching ───
  switchTab(tab: 'history' | 'services' | 'controls'): void {
    this.activeTab = tab;
  }

  /** Handle KPI box click - routes to tabs or opens modals */
  public onKpiClick(action: string): void {
    if (!action) return;
    if (action === 'history') {
      this.switchTab('history');
    } else if (action === 'servicesTab') {
      this.switchTab('services');
    } else {
      this.openModal(action);
    }
  }

  // ─── Modal Methods ───
  openModal(modalId: string): void {
    this.activeModal = modalId;
    document.body.style.overflow = 'hidden';
    // Reset wizards when opening
    if (modalId === 'deposit') { this.resetDeposit(); }
    if (modalId === 'withdraw') { this.resetWithdraw(); }
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  closeModalOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  // ─── Deposit Wizard ───
  resetDeposit(): void {
    this.depStep = 1;
    this.depSuccess = false;
    this.depPin = ['', '', '', ''];
    this.depAmount = 50000;
    this.depPhone = '+254 722 123 456';
    this.depMethods.forEach((m, i) => m.selected = i === 0);
    this.depSelectedMethod = 'mpesa';
  }

  selectDepositMethod(methodId: string): void {
    this.depSelectedMethod = methodId;
    this.depMethods.forEach(m => m.selected = m.id === methodId);
  }

  get depSteps(): StepItem[] {
    return this.depStepNames.map((label, i) => ({
      label,
      done: i + 1 < this.depStep,
      active: i + 1 === this.depStep
    }));
  }

  get depShowPhoneField(): boolean {
    return ['mpesa', 'airtel'].includes(this.depSelectedMethod);
  }

  get depShowBankFields(): boolean {
    return this.depSelectedMethod === 'bank';
  }

  get depShowCardFields(): boolean {
    return this.depSelectedMethod === 'card';
  }

  get depFee(): number {
    if (this.depSelectedMethod === 'card') return Math.round(this.depAmount * 0.015);
    if (this.depSelectedMethod === 'bank') return 50;
    return 0;
  }

  get depTax(): number {
    return 0;
  }

  get depTotalCharged(): number {
    return this.depAmount + this.depFee + this.depTax;
  }

  get depNewBalance(): number {
    return this.balance + this.depAmount;
  }

  depNext(): void {
    if (this.depStep < this.depTotalSteps) {
      this.depStep++;
      if (this.depStep === this.depTotalSteps) {
        this.depSuccess = true;
        this.showToast('Deposit of KES ' + this.depAmount.toLocaleString() + ' successful!');
      }
    }
  }

  depPrev(): void {
    if (this.depStep > 1) {
      this.depStep--;
    }
  }

  onDepPinInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.depPin[index] = input.value;
    if (input.value.length === 1 && index < 3) {
      // Focus next pin input - handled via template ref in real app
    }
  }

  // ─── Withdraw Wizard ───
  resetWithdraw(): void {
    this.wdStep = 1;
    this.wdSuccess = false;
    this.wdPin = ['', '', '', ''];
    this.wdAmount = 15000;
    this.wdPhone = '0722-XXX-123';
    this.wdMethods.forEach((m, i) => m.selected = i === 0);
  }

  selectWithdrawMethod(methodId: string): void {
    this.wdMethods.forEach(m => m.selected = m.id === methodId);
  }

  get wdSelectedMethod(): string {
    return this.wdMethods.find(m => m.selected)?.id || 'mpesa';
  }

  get wdSteps(): StepItem[] {
    return this.wdStepNames.map((label, i) => ({
      label,
      done: i + 1 < this.wdStep,
      active: i + 1 === this.wdStep
    }));
  }

  get wdFee(): number {
    if (this.wdSelectedMethod === 'bank') return 50;
    return 0;
  }

  get wdNewBalance(): number {
    return this.balance - this.wdAmount;
  }

  wdNext(): void {
    if (this.wdStep < this.wdTotalSteps) {
      this.wdStep++;
      if (this.wdStep === this.wdTotalSteps) {
        this.wdSuccess = true;
        this.showToast('Withdrawal of KES ' + this.wdAmount.toLocaleString() + ' successful!');
      }
    }
  }

  wdPrev(): void {
    if (this.wdStep > 1) {
      this.wdStep--;
    }
  }

  // ─── Send Money ───
  processSend(): void {
    this.closeModal();
    this.showToast('KES ' + this.sendAmount.toLocaleString() + ' sent successfully!');
    this.sendWalletId = '';
    this.sendPhone = '';
    this.sendAmount = 5000;
    this.sendNote = '';
  }

  // ─── Transfer ───
  processTransfer(): void {
    this.closeModal();
    this.showToast('KES ' + this.transferAmount.toLocaleString() + ' transferred to ' + this.transferTo + '!');
    this.transferAmount = 30000;
    this.transferNarration = '';
  }

  // ─── Request Money ───
  processRequest(): void {
    this.closeModal();
    this.showToast('Payment request sent to ' + this.requestFrom + '!');
    this.requestFrom = '';
    this.requestAmount = null;
    this.requestReason = '';
  }

  // ─── Overdraft ───
  processOverdraft(): void {
    this.closeModal();
    this.showToast('Overdraft of KES ' + this.overdraftAmount.toLocaleString() + ' disbursed to your wallet!');
  }

  // ─── Quick Loan ───
  processQuickLoan(): void {
    this.closeModal();
    this.showToast('Quick Loan of KES ' + this.quickLoanAmount.toLocaleString() + ' approved and disbursed!');
  }

  // ─── Salary Advance ───
  processSalaryAdv(): void {
    this.closeModal();
    this.showToast('Salary advance of KES ' + this.salaryAdvanceReceive.toLocaleString() + ' credited to wallet!');
  }

  // ─── PIN ───
  changePin(): void {
    this.closeModal();
    this.showToast('Transaction PIN updated successfully!');
    this.pinCurrent = '';
    this.pinNew = '';
    this.pinConfirm = '';
  }

  // ─── Controls ───
  toggleControl(item: ControlItem): void {
    item.checked = !item.checked;
    this.showToast(item.name + ' ' + (item.checked ? 'enabled' : 'disabled'));
  }

  // ─── Copy Functions ───
  copyWalletId(): void {
    navigator.clipboard.writeText(this.walletId).then(() => {
      this.showToast('Wallet ID copied!');
    });
  }

  copyPaymentLink(): void {
    navigator.clipboard.writeText('pay.saccopay.co.ke/' + this.walletId.replace('SP-WAL-', '')).then(() => {
      this.showToast('Payment link copied!');
    });
  }

  // ─── QR Code ───
  generateQR(): void {
    this.qrCells = Array.from({ length: 49 }, () => Math.random() > 0.4);
  }

  // ─── Transaction Detail ───
  openTxDetail(tx: Transaction): void {
    this.selectedTransaction = tx.detail;
    this.openModal('txDetail');
  }

  // ─── Toast System ───
  showToast(message: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, message });
    setTimeout(() => this.removeToast(id), 3500);
  }

  removeToast(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  // ─── Share Actions ───
  shareWhatsApp(): void {
    this.showToast('Shared via WhatsApp!');
  }

  shareSMS(): void {
    this.showToast('Shared via SMS!');
  }

  shareEmail(): void {
    this.showToast('Shared via Email!');
  }

  downloadQR(): void {
    this.showToast('QR downloaded!');
  }

  downloadReceipt(): void {
    this.showToast('Receipt downloaded!');
  }

  shareReceipt(): void {
    this.showToast('Receipt shared!');
  }

  // ─── BNPL Notify ───
  bnplNotify(): void {
    this.showToast('You will be notified when BNPL launches!');
  }

  // ─── Keyboard ───
  onKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Escape') {
      this.closeModal();
    }
  }

  // ─── Navigation ───
  navigateTo(route: string): void {
    this.showToast('Navigating to ' + route + '...');
  }
}