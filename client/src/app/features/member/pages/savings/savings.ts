import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ModalKey =
  | 'openAccount' | 'deposit' | 'stkPush' | 'accountDetails' | 'fixedDeposit'
  | 'autoDeposit' | 'txDetail' | 'withdraw' | 'goal' | 'statement'
  | 'compare' | 'rules' | 'applyLoan' | 'tips' | 'report'
  | 'addAccount' | 'editGoal' | 'plan' | 'manageAccount';

export interface SavingsAccount {
  key: string;
  name: string;
  ref: string;
  rate: string;
  rateNote?: string;
  badge: string;
  badgeCls: string;
  balance: number;
  balanceLabel: string;
  availableOrPrincipal: number;
  availableLabel: string;
  matures?: string;
  maturity?: number;
  icon: string;
  iconBg: string;
  actions: 'standard' | 'fixed' | 'holiday' | 'education';
}

export interface SavingsProduct {
  id: string;
  name: string;
  rate: string;
  note: string;
  desc?: string;
  icon: string;
  iconBg: string;
}

export interface Tx {
  date: string;
  ref: string;
  refCls: string;
  account: string;
  type: 'Deposit' | 'Interest' | 'Withdrawal';
  amount: string;
  positive: boolean;
  status: 'Confirmed' | 'Credited' | 'Completed' | 'Pending';
}

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./savings.html',
  styleUrls: ['./savings.scss'],
})
export class SavingsComponent implements AfterViewInit {

  /* ────── hero stats ────── */
  totalBalance = 158_750;
  monthIn = 12_500;
  interestYTD = 725;
  locked = 35_000;
  heroStats = [
    { label: 'Available',          value: 'KES 123,750', sub: 'Withdrawable',         color: 'green' },
    { label: 'Locked',             value: 'KES 35,000',  sub: 'Collateral/Guarantee', color: 'amber' },
    { label: 'Interest (Lifetime)',value: 'KES 4,875',   sub: 'View breakdown →',     color: 'blue', action: 'tips' },
    { label: 'Loan Limit',         value: 'KES 476,250', sub: 'View eligibility →',   color: 'cyan', action: 'applyLoan' },
  ];

  /* ────── accounts ────── */
  accounts: SavingsAccount[] = [
    { key: 'ordinary', name: 'Ordinary Savings', ref: 'SAV-001-ORD', rate: '7%', rateNote: 'p.a.', badge: '● Active', badgeCls: 'ok', balance: 98_750, balanceLabel: 'Balance', availableOrPrincipal: 73_750, availableLabel: 'Available', icon: '🐷', iconBg: 'blue', actions: 'standard' },
    { key: 'fixed',    name: 'Fixed Deposit',    ref: 'FD-001-FXD',  rate: 'Jul 15, 2025',  badge: '🔒 Locked', badgeCls: 'warn', balance: 40_000, balanceLabel: 'Principal', availableOrPrincipal: 58, availableLabel: 'Maturity', matures: 'Matures', maturity: 58, icon: '📅', iconBg: 'amber', actions: 'fixed' },
    { key: 'holiday',  name: 'Holiday Savings', ref: 'HS-001-HOL', rate: '5%', rateNote: 'p.a.', badge: 'Window', badgeCls: 'purple', balance: 15_000, balanceLabel: 'Balance', availableOrPrincipal: 0, availableLabel: '', icon: '🏖️', iconBg: 'purple', actions: 'holiday' },
    { key: 'education',name: 'Education Fund',  ref: 'EF-001-EDU', rate: '6%', rateNote: 'p.a.', badge: 'Flexible', badgeCls: 'green', balance: 5_000, balanceLabel: 'Balance', availableOrPrincipal: 0, availableLabel: '', icon: '🎓', iconBg: 'green', actions: 'education' },
  ];

  /* ────── new account products ────── */
  products: SavingsProduct[] = [
    { id: 'emergency', name: 'Emergency Fund', rate: '8% p.a.', note: 'Flexible',  desc: 'Min deposit: KES 500/month',  icon: '🔥', iconBg: 'red'    },
    { id: 'junior',    name: 'Junior Savings', rate: '6% p.a.', note: 'Locked',    desc: 'Great for education planning.', icon: '🌱', iconBg: 'green'  },
    { id: 'home',      name: 'Home Ownership', rate: '9% p.a.', note: 'Locked',    desc: 'Min deposit: KES 3,000/month', icon: '🏠', iconBg: 'blue'   },
  ];
  selectedProduct = '';

  /* ────── savings goal ────── */
  goal = { saved: 158_750, target: 250_000, deadline: 'Dec 31, 2025', monthlyNeeded: 9_125 };
  goalPct(): number { return Math.round((this.goal.saved / this.goal.target) * 100); }

  /* ────── contribution tracker ────── */
  minRequired = 5_000;
  monthDeposited = 12_500;
  monthPctOfMin(): number { return Math.round((this.monthDeposited / this.minRequired) * 100); }
  quickMonths = [
    { label: 'Jan', state: 'paid' },
    { label: 'Feb', state: 'paid-double' },
    { label: 'Mar', state: 'due' },
    { label: 'Apr', state: 'upcoming' },
  ];

  /* ────── chart range ────── */
  chartRange: '3M' | '6M' | '1Y' | 'All' = '1Y';
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  /* ────── transactions ────── */
  transactions: Tx[] = [
    { date: 'Feb 25, 2025', ref: 'DEP-2025-00189', refCls: 'blue',  account: 'Ordinary', type: 'Deposit',    amount: '+ KES 7,500',  positive: true,  status: 'Confirmed' },
    { date: 'Jan 31, 2025', ref: 'INT-2025-00012', refCls: 'green', account: 'Ordinary', type: 'Interest',   amount: '+ KES 350',    positive: true,  status: 'Credited'  },
    { date: 'Jan 15, 2025', ref: 'WDR-2025-00031', refCls: 'red',   account: 'Ordinary', type: 'Withdrawal', amount: '- KES 10,000', positive: false, status: 'Completed' },
    { date: 'Jan 10, 2025', ref: 'DEP-2025-00088', refCls: 'blue',  account: 'Fixed',    type: 'Deposit',    amount: '+ KES 40,000', positive: true,  status: 'Confirmed' },
    { date: 'Dec 28, 2024', ref: 'DEP-2024-00721', refCls: 'blue',  account: 'Holiday',  type: 'Deposit',    amount: '+ KES 2,500',  positive: true,  status: 'Confirmed' },
  ];
  filterAccount = '';
  filterType = '';
  page = 1;
  totalTx = 48;

  /* ────── forms ────── */
  deposit = { to: 'ordinary', method: 'mpesa', amount: '5000' };
  stkPhone = '+254 712 345 890';
  withdrawForm = { from: 'ordinary', amount: '', reason: '' };
  goalForm = { target: 250_000, deadline: '2025-12-31' };
  autoDepositForm = { amount: '5000', day: '25th', to: 'Ordinary Savings', phone: '+254 712 345 890', enabled: true };
  fixedTopUp = '5000';
  statementForm = { from: '', to: '', format: 'pdf' };
  selectedAccount: SavingsAccount | null = null;
  selectedTx: Tx | null = null;

  /* ────── modal state ────── */
  activeModal: ModalKey | null = null;
  openModal(k: ModalKey): void {
    this.activeModal = k;
    document.body.style.overflow = 'hidden';
  }
  closeModal(): void {
    this.activeModal = null;
    this.selectedAccount = null;
    this.selectedTx = null;
    document.body.style.overflow = '';
  }
  openAccountDetails(a: SavingsAccount): void {
    this.selectedAccount = a;
    if (a.key === 'fixed') this.openModal('fixedDeposit');
    else this.openModal('accountDetails');
  }
  openTxDetail(t: Tx): void {
    this.selectedTx = t;
    this.openModal('txDetail');
  }

  /* ────── submits ────── */
  submitOpenAccount(): void { if (!this.selectedProduct) return this.showToast('Select a product first.', 'warning'); this.closeModal(); this.showToast('Account opening request submitted.', 'success'); }
  proceedDeposit(): void { this.openModal('stkPush'); }
  sendStkPrompt(): void { this.closeModal(); this.showToast('STK push sent to ' + this.stkPhone, 'success'); }
  submitWithdraw(): void { if (!this.withdrawForm.amount) return this.showToast('Enter withdrawal amount', 'warning'); this.closeModal(); this.showToast('Withdrawal request submitted.', 'success'); }
  saveGoal(): void { this.goal.target = this.goalForm.target; this.closeModal(); this.showToast('Goal updated.', 'success'); }
  saveAutoDeposit(): void { this.closeModal(); this.showToast('Auto-deposit saved.', 'success'); }
  generateStatement(): void { this.closeModal(); this.showToast('Statement is being prepared.', 'info'); }
  topUpFixed(): void { this.closeModal(); this.showToast('Top-up initiated.', 'success'); }
  applyLoanSubmit(): void { this.closeModal(); this.showToast('Loan application submitted.', 'success'); }
  reportTx(): void { this.closeModal(); this.showToast('Transaction report sent. We will follow up.', 'info'); }

  /* ────── chart ────── */
  setRange(r: '3M' | '6M' | '1Y' | 'All'): void { this.chartRange = r; setTimeout(() => this.drawChart(), 0); }
  ngAfterViewInit(): void {
    setTimeout(() => this.drawChart(), 0);
    window.addEventListener('resize', () => this.drawChart());
  }
  private drawChart(): void {
    const cvs = this.chartCanvas?.nativeElement; if (!cvs) return;
    const ctx = cvs.getContext('2d'); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = cvs.clientWidth, h = cvs.clientHeight;
    cvs.width = w * dpr; cvs.height = h * dpr; ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    const padL = 44, padR = 16, padT = 18, padB = 28;
    const cw = w - padL - padR, ch = h - padT - padB;
    ctx.strokeStyle = '#eef2f7'; ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const y = padT + (ch / 8) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + cw, y); ctx.stroke();
    }

    const range = this.chartRange;
    let labels: string[]; let savings: number[]; let deposits: number[];
    if (range === '3M')      { labels = ['Dec','Jan','Feb'];                       savings = [120, 135, 158]; deposits = [10, 12, 15]; }
    else if (range === '6M') { labels = ['Sep','Oct','Nov','Dec','Jan','Feb'];     savings = [100, 108, 115, 120, 135, 158]; deposits = [8, 9, 10, 11, 12, 15]; }
    else if (range === '1Y') { labels = ['Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb']; savings = [60, 70, 78, 85, 92, 98, 105, 112, 118, 125, 138, 158]; deposits = [5, 6, 7, 7, 8, 9, 9, 10, 11, 12, 13, 15]; }
    else                     { labels = ['2021','2022','2023','2024','2025'];      savings = [20, 50, 90, 130, 158]; deposits = [3, 5, 8, 11, 15]; }
    const max = 180;

    const yAxis = (val: number) => padT + ch - (val / max) * ch;
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px system-ui'; ctx.textAlign = 'right';
    for (let i = 0; i <= 8; i++) { ctx.fillText(`${Math.round((max/8) * (8-i))}K`, padL - 6, padT + (ch/8) * i + 3); }

    const points = (arr: number[]) => arr.map((v, i) => ({ x: padL + (cw / Math.max(1, arr.length - 1)) * i, y: yAxis(v) }));
    const sPts = points(savings); const dPts = points(deposits);

    const grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
    grad.addColorStop(0, 'rgba(251, 146, 60, 0.18)'); grad.addColorStop(1, 'rgba(251,146,60,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(sPts[0].x, padT + ch);
    sPts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(sPts[sPts.length - 1].x, padT + ch); ctx.closePath(); ctx.fill();

    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2.5; ctx.beginPath();
    sPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke();

    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath();
    dPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)); ctx.stroke(); ctx.setLineDash([]);

    ctx.fillStyle = '#64748b'; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    labels.forEach((lbl, i) => ctx.fillText(lbl, sPts[i].x, h - 8));
  }

  /* ────── toast ────── */
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null = null;
  private toastTimer: any;
  showToast(message: string, type: 'success' | 'info' | 'warning' = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3200);
  }
  dismissToast(): void { this.toast = null; }

  /* helpers */
  fmt(n: number): string { return n.toLocaleString(); }
  trackByIdx(i: number): number { return i; }
}
