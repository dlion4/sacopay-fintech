import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type ModalKey =
  | 'instantDeposit'
  | 'stkPush'
  | 'confirmedDeposit'
  | 'pendingDeposit'
  | 'failedDeposit'
  | 'autoDeposit'
  | 'monthDetail'
  | 'yearDetail'
  | 'trends'
  | 'monthlyReq'
  | 'byAccount'
  | 'export'
  | 'receipt'
  | 'support'
  | 'report'
  | 'retryDeposit'
  | 'scheduleDeposit'
  | 'bankInstructions'
  | 'cardPayment';

export interface DepositRow {
  date: string;
  reference: string;
  account: 'Ordinary' | 'Fixed Deposit' | 'Holiday' | 'Education';
  method: 'Bank' | 'M-Pesa STK' | 'Card' | 'Airtel';
  amount: string;
  numericAmount: number;
  status: 'Pending' | 'Confirmed' | 'Failed';
  code?: string;
}

export interface PaymentMethod {
  key: 'mpesa' | 'card' | 'bank' | 'airtel';
  label: string;
  sub: string;
  icon: string;
  tone: string;
  badge: string;
  badgeTone: string;
}

export interface AccountBreakdown {
  name: string;
  amount: number;
  width: number;
  color: string;
}

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./deposits.html',
  styleUrls: ['./deposits.scss'],
})
export class DepositsComponent implements AfterViewInit {
  @ViewChild('trendCanvas') trendCanvas?: ElementRef<HTMLCanvasElement>;

  activeModal: ModalKey | null = null;
  selectedDeposit: DepositRow | null = null;
  chartRange: '6M' | '1Y' | 'All' = '1Y';
  filterAccount = '';
  filterStatus = '';
  currentPage = 1;

  totalDeposits = 145_000;
  monthTotal = 12_500;
  totalCount = 36;

  depositForm = {
    account: 'ordinary',
    method: 'mpesa' as 'mpesa' | 'card' | 'bank' | 'airtel',
    amount: '25000',
  };

  stkForm = {
    phone: '+254 712345890',
  };

  autoDeposit = {
    amount: '5000',
    frequency: 'Monthly',
    day: '25th',
    account: 'Ordinary Savings',
    phone: '+254 712345890',
    smsReminder: true,
    emailNotification: true,
  };

  exportForm = {
    account: 'all',
    status: 'all',
    from: '',
    to: '',
    format: 'pdf',
  };

  supportForm = {
    subject: 'Deposit verification support',
    message: '',
  };

  accounts = [
    { value: 'ordinary', label: 'Ordinary Savings (SAV-001) — Bal: KES 98,750' },
    { value: 'fixed', label: 'Fixed Deposit (FD-001) — Bal: KES 40,000' },
    { value: 'holiday', label: 'Holiday Savings (HS-001) — Bal: KES 15,000' },
    { value: 'education', label: 'Education Fund (EF-001) — Bal: KES 5,000' },
  ];

  paymentMethods: PaymentMethod[] = [
    { key: 'mpesa', label: 'M-Pesa', sub: 'STK Push', icon: 'phone', tone: 'green', badge: 'Instant', badgeTone: 'green' },
    { key: 'card', label: 'Card', sub: 'Visa / Mastercard', icon: 'card', tone: 'purple', badge: 'Secure', badgeTone: 'purple' },
    { key: 'bank', label: 'Bank', sub: 'EFT / RTGS', icon: 'bank', tone: 'blue', badge: '1-24h', badgeTone: 'blue' },
    { key: 'airtel', label: 'Airtel', sub: 'STK Push', icon: 'sim', tone: 'red', badge: 'Instant', badgeTone: 'red' },
  ];

  statCards = [
    { title: 'This Month', value: 'KES 12.5K', sub: '+25% vs last month', icon: 'calendar', tone: 'blue', modal: 'monthDetail' as ModalKey },
    { title: 'This Year', value: 'KES 25K', sub: '4 deposits in 2025', icon: 'growth', tone: 'green', modal: 'yearDetail' as ModalKey },
    { title: 'Last Deposit', value: 'KES 7.5K', sub: 'Feb 25 via M-Pesa', icon: 'clock', tone: 'cyan', modal: 'confirmedDeposit' as ModalKey },
    { title: 'Avg. Monthly', value: 'KES 8.75K', sub: 'Above KES 5K min', icon: 'scale', tone: 'amber', modal: 'trends' as ModalKey },
  ];

  deposits: DepositRow[] = [
    { date: 'Feb 25, 2025', reference: 'DEP-2025-00195', account: 'Ordinary', method: 'Bank', amount: '+KES 15,000', numericAmount: 15000, status: 'Pending' },
    { date: 'Feb 25, 2025', reference: 'DEP-2025-00189', account: 'Ordinary', method: 'M-Pesa STK', amount: '+KES 7,500', numericAmount: 7500, status: 'Confirmed', code: 'SQJ1XK3T5A' },
    { date: 'Jan 25, 2025', reference: 'DEP-2025-00145', account: 'Ordinary', method: 'M-Pesa STK', amount: '+KES 5,000', numericAmount: 5000, status: 'Confirmed' },
    { date: 'Dec 25, 2024', reference: 'DEP-2024-00890', account: 'Holiday', method: 'Card', amount: '+KES 5,000', numericAmount: 5000, status: 'Confirmed' },
    { date: 'Dec 20, 2024', reference: 'DEP-2024-00878', account: 'Ordinary', method: 'Bank', amount: '+KES 8,000', numericAmount: 8000, status: 'Confirmed' },
    { date: 'Nov 28, 2024', reference: 'DEP-2024-00760', account: 'Ordinary', method: 'Card', amount: '+KES 10,000', numericAmount: 10000, status: 'Failed' },
  ];

  accountBreakdown: AccountBreakdown[] = [
    { name: 'Ordinary', amount: 95_000, width: 86, color: 'blue' },
    { name: 'Fixed Deposit', amount: 30_000, width: 30, color: 'cyan' },
    { name: 'Holiday', amount: 15_000, width: 16, color: 'purple' },
    { name: 'Education', amount: 5_000, width: 7, color: 'amber' },
  ];

  toast: { message: string; type: 'success' | 'info' | 'warning' | 'danger' } | null = null;
  private toastTimer: any;

  ngAfterViewInit(): void {
    setTimeout(() => this.drawTrendChart(), 0);
    window.addEventListener('resize', () => this.drawTrendChart());
  }

  get filteredDeposits(): DepositRow[] {
    return this.deposits.filter((d) => {
      const accountOk = !this.filterAccount || d.account === this.filterAccount;
      const statusOk = !this.filterStatus || d.status === this.filterStatus;
      return accountOk && statusOk;
    });
  }

  openModal(key: ModalKey): void {
    if (key === 'confirmedDeposit') {
      this.selectedDeposit = this.deposits.find((d) => d.status === 'Confirmed') || null;
    }
    if (key === 'pendingDeposit') {
      this.selectedDeposit = this.deposits.find((d) => d.status === 'Pending') || null;
    }
    if (key === 'failedDeposit') {
      this.selectedDeposit = this.deposits.find((d) => d.status === 'Failed') || null;
    }
    this.activeModal = key;
    document.body.style.overflow = 'hidden';
  }

  openDepositDetail(row: DepositRow): void {
    this.selectedDeposit = row;
    if (row.status === 'Pending') this.openModal('pendingDeposit');
    if (row.status === 'Confirmed') this.openModal('confirmedDeposit');
    if (row.status === 'Failed') this.openModal('failedDeposit');
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedDeposit = null;
    document.body.style.overflow = '';
  }

  setRange(range: '6M' | '1Y' | 'All'): void {
    this.chartRange = range;
    setTimeout(() => this.drawTrendChart(), 0);
  }

  proceedToPay(): void {
    if (this.depositForm.method === 'bank') {
      this.openModal('bankInstructions');
      return;
    }
    if (this.depositForm.method === 'card') {
      this.openModal('cardPayment');
      return;
    }
    this.openModal('stkPush');
  }

  sendStkPush(): void {
    this.closeModal();
    this.showToast('STK push sent to your phone.', 'success');
  }

  saveAutoDeposit(): void {
    this.closeModal();
    this.showToast('Auto-deposit setup saved.', 'success');
  }

  exportDeposits(): void {
    this.closeModal();
    this.showToast('Deposit export is being prepared.', 'info');
  }

  downloadReceipt(): void {
    this.showToast('Receipt downloaded.', 'success');
  }

  retryDeposit(): void {
    this.depositForm.amount = '10000';
    this.openModal('retryDeposit');
  }

  submitRetry(): void {
    this.openModal('instantDeposit');
  }

  submitSupport(): void {
    this.closeModal();
    this.showToast('Support request submitted.', 'info');
  }

  submitCardPayment(): void {
    this.openModal('failedDeposit');
  }

  showToast(message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3200);
  }

  dismissToast(): void {
    this.toast = null;
  }

  fmt(n: number): string {
    return n.toLocaleString();
  }

  amountNumber(row: DepositRow | null): string {
    return row ? this.fmt(row.numericAmount) : '0';
  }

  private drawTrendChart(): void {
    const canvas = this.trendCanvas?.nativeElement;
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

    const allLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const allValues = [5, 7.5, 10, 5, 8, 12, 9, 11, 7, 8.5, 10, 15];
    const labels = this.chartRange === '6M' ? allLabels.slice(6) : allLabels;
    const values = this.chartRange === '6M' ? allValues.slice(6) : allValues;
    const max = 16;

    const padL = 42;
    const padR = 18;
    const padT = 16;
    const padB = 28;
    const cw = w - padL - padR;
    const ch = h - padT - padB;
    const barGap = cw / values.length;
    const barW = Math.min(42, barGap * 0.62);

    ctx.strokeStyle = '#eef2f7';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 8; i++) {
      const y = padT + (ch / 8) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + cw, y);
      ctx.stroke();
      ctx.fillText(`K${Math.round((max / 8) * (8 - i))}`, padL - 8, y + 3);
    }

    values.forEach((value, index) => {
      const x = padL + index * barGap + (barGap - barW) / 2;
      const barH = (value / max) * ch;
      const y = padT + ch - barH;
      const grad = ctx.createLinearGradient(0, y, 0, padT + ch);
      grad.addColorStop(0, 'rgba(37, 99, 235, 0.55)');
      grad.addColorStop(1, 'rgba(37, 99, 235, 0.08)');
      ctx.fillStyle = grad;
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      const r = 7;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, padT + ch);
      ctx.lineTo(x, padT + ch);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
      const x = padL + index * barGap + barGap / 2;
      ctx.fillText(label, x, h - 8);
    });
  }
}