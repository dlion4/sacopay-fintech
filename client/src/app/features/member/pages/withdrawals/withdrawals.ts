import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// withdrawals.module.ts
import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

export type ModalKey =
  | 'requestWithdrawal'
  | 'requestConfirm'
  | 'pendingDetail'
  | 'completedDetail'
  | 'rejectedDetail'
  | 'cancelRequest'
  | 'policy'
  | 'impactCalculator'
  | 'exportHistory'
  | 'receipt'
  | 'support'
  | 'resubmit'
  | 'feeBreakdown'
  | 'noticeSchedule'
  | 'methodDetails'
  | 'timeline'
  | 'statusFilter'
  | 'quickTips';

export interface WithdrawalRequest {
  reference: string;
  amount: number;
  account: 'Ordinary' | 'Education' | 'Holiday';
  method: 'M-Pesa' | 'Bank EFT' | 'Wallet';
  status: 'pending' | 'completed' | 'rejected';
  date: string;
  completedDate?: string;
  reason: string;
  fee: number | null;
  estimate?: string;
  daysRemaining?: number;
  rejectionReason?: string;
}

export interface WithdrawalRow {
  date: string;
  reference: string;
  account: 'Ordinary' | 'Education';
  amount: number;
  fee: number | null;
  method: 'M-Pesa' | 'Bank';
  status: 'Pending' | 'Completed' | 'Rejected';
}

@Component({
  selector: 'app-withdrawals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./withdrawals.html',
  styleUrls: ['./withdrawals.scss'],
})
export class WithdrawalsComponent implements AfterViewInit {
  @ViewChild('historyCanvas') historyCanvas?: ElementRef<HTMLCanvasElement>;

  activeModal: ModalKey | null = null;
  selectedRequest: WithdrawalRequest | null = null;
  selectedRow: WithdrawalRow | null = null;
  chartRange: '6M' | '1Y' | 'All' = '1Y';
  activeStatusFilter = '';
  tableRange = 'Last 6 Months';
  currentPage = 1;

  available = 123_750;
  totalSavings = 158_750;
  locked = 35_000;
  noticeDays = 14;

  heroStats = [
    { label: 'Pending Requests', value: '1', sub: 'View details ->', tone: 'amber', modal: 'pendingDetail' as ModalKey },
    { label: 'Withdrawn (2025)', value: 'KES 25,000', sub: '2 withdrawals', tone: 'blue', modal: 'timeline' as ModalKey },
    { label: 'Last Withdrawal', value: 'KES 10,000', sub: 'Jan 15, 2025 - M-Pesa', tone: 'muted', modal: 'completedDetail' as ModalKey },
    { label: 'Disbursement Methods', value: 'M-Pesa  Bank', sub: 'Auto disbursement', tone: 'green', modal: 'methodDetails' as ModalKey },
  ];

  requests: WithdrawalRequest[] = [
    { reference: 'WDR-2025-0045', amount: 20_000, account: 'Ordinary', method: 'M-Pesa', status: 'pending', date: 'Feb 25, 2025', reason: 'School Fees', fee: 50, estimate: 'Mar 11, 2025', daysRemaining: 8 },
    { reference: 'WDR-2025-0031', amount: 10_000, account: 'Ordinary', method: 'M-Pesa', status: 'completed', date: 'Jan 15, 2025', completedDate: 'Jan 29, 2025', reason: 'Personal use', fee: 50 },
    { reference: 'WDR-2024-0089', amount: 50_000, account: 'Ordinary', method: 'Bank EFT', status: 'rejected', date: 'Dec 10, 2024', reason: 'Home Construction', fee: null, rejectionReason: 'Amount exceeds available balance after loan collateral deductions.' },
  ];

  withdrawals: WithdrawalRow[] = [
    { date: 'Feb 25, 2025', reference: 'WDR-2025-0045', account: 'Ordinary', amount: 20_000, fee: 50, method: 'M-Pesa', status: 'Pending' },
    { date: 'Jan 15, 2025', reference: 'WDR-2025-0031', account: 'Ordinary', amount: 10_000, fee: 50, method: 'M-Pesa', status: 'Completed' },
    { date: 'Dec 10, 2024', reference: 'WDR-2024-0089', account: 'Ordinary', amount: 50_000, fee: null, method: 'Bank', status: 'Rejected' },
    { date: 'Nov 20, 2024', reference: 'WDR-2024-0072', account: 'Education', amount: 5_000, fee: 50, method: 'Bank', status: 'Completed' },
  ];

  requestForm = {
    from: 'ordinary',
    amount: '',
    reason: '',
    method: 'mpesa' as 'mpesa' | 'bank',
    phone: '+254 712345890',
    bank: 'Co-operative Bank',
    accountNo: '0110028***4321',
  };

  calculator = {
    amount: '20000',
  };

  cancelForm = {
    reason: '',
  };

  exportForm = {
    range: 'Last 6 Months',
    status: 'All Status',
    format: 'pdf',
  };

  supportForm = {
    subject: 'Withdrawal support',
    message: '',
  };

  toast: { message: string; type: 'success' | 'info' | 'warning' | 'danger' } | null = null;
  private toastTimer: any;

  ngAfterViewInit(): void {
    setTimeout(() => this.drawChart(), 0);
    window.addEventListener('resize', () => this.drawChart());
  }

  get visibleRequests(): WithdrawalRequest[] {
    return this.requests.filter((r) => !this.activeStatusFilter || r.status === this.activeStatusFilter);
  }

  openModal(key: ModalKey): void {
    if (key === 'pendingDetail') this.selectedRequest = this.requests.find((r) => r.status === 'pending') || null;
    if (key === 'completedDetail') this.selectedRequest = this.requests.find((r) => r.status === 'completed') || null;
    if (key === 'rejectedDetail') this.selectedRequest = this.requests.find((r) => r.status === 'rejected') || null;
    this.activeModal = key;
    document.body.style.overflow = 'hidden';
  }

  openRequestDetail(req: WithdrawalRequest): void {
    this.selectedRequest = req;
    this.activeModal = req.status === 'pending' ? 'pendingDetail' : req.status === 'completed' ? 'completedDetail' : 'rejectedDetail';
    document.body.style.overflow = 'hidden';
  }

  openRowDetail(row: WithdrawalRow): void {
    this.selectedRow = row;
    const req = this.requests.find((r) => r.reference === row.reference);
    if (req) this.openRequestDetail(req);
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedRow = null;
    document.body.style.overflow = '';
  }

  setRange(range: '6M' | '1Y' | 'All'): void {
    this.chartRange = range;
    setTimeout(() => this.drawChart(), 0);
  }

  submitRequest(): void {
    if (!this.requestForm.amount || !this.requestForm.reason) {
      this.showToast('Enter amount and reason to continue.', 'warning');
      return;
    }
    this.openModal('requestConfirm');
  }

  confirmRequest(): void {
    this.closeModal();
    this.showToast('Withdrawal request submitted for approval.', 'success');
  }

  cancelRequest(): void {
    this.closeModal();
    this.showToast('Withdrawal request cancelled.', 'info');
  }

  resubmitRequest(): void {
    this.requestForm.amount = '50000';
    this.requestForm.reason = 'Home Construction';
    this.openModal('resubmit');
  }

  submitResubmission(): void {
    this.closeModal();
    this.showToast('Withdrawal resubmitted for review.', 'success');
  }

  exportHistory(): void {
    this.closeModal();
    this.showToast('Withdrawal export is being prepared.', 'info');
  }

  downloadReceipt(): void {
    this.showToast('Receipt downloaded.', 'success');
  }

  submitSupport(): void {
    this.closeModal();
    this.showToast('Support ticket submitted.', 'info');
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

  calculatorAmount(): number {
    return Number(this.calculator.amount || 0);
  }

  afterWithdrawal(): number {
    return this.totalSavings - this.calculatorAmount();
  }

  newLoanLimit(): number {
    return this.afterWithdrawal() * 3;
  }

  private drawChart(): void {
    const canvas = this.historyCanvas?.nativeElement;
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

    const labels = this.chartRange === '6M' ? ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'] : ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const values = this.chartRange === '6M' ? [15, 0, 5, 0, 10, 20] : [0, 5, 0, 10, 0, 0, 15, 0, 5, 0, 10, 20];
    const max = 20;
    const padL = 46;
    const padR = 16;
    const padT = 20;
    const padB = 30;
    const cw = w - padL - padR;
    const ch = h - padT - padB;
    const gap = cw / values.length;
    const barW = Math.min(42, gap * 0.55);

    ctx.strokeStyle = '#eef2f7';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
      const y = padT + (ch / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + cw, y);
      ctx.stroke();
      ctx.fillText(`KES ${Math.round((max / 10) * (10 - i))}K`, padL - 7, y + 3);
    }

    values.forEach((value, i) => {
      const x = padL + i * gap + (gap - barW) / 2;
      const bh = (value / max) * ch;
      const y = padT + ch - bh;
      const grad = ctx.createLinearGradient(0, y, 0, padT + ch);
      grad.addColorStop(0, 'rgba(239, 68, 68, .78)');
      grad.addColorStop(1, 'rgba(239, 68, 68, .35)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, bh, 6);
      ctx.fill();
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => ctx.fillText(label, padL + i * gap + gap / 2, h - 8));
  }
}