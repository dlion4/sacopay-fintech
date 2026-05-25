import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ─────────────────── Interfaces ─────────────────── */
export interface StatCard {
  label: string;
  amount: string;
  change: string;
  trendUp: boolean;
  icon: string;
  tone: 'blue' | 'green' | 'amber' | 'teal';
}
export interface QuickAction {
  key: string;
  label: string;
  icon: string;
  tone: 'blue' | 'green' | 'amber' | 'teal' | 'red' | 'indigo' | 'purple' | 'slate';
}
export interface TxRow {
  date: string;
  type: 'Deposit' | 'Debit' | 'Transfer' | 'Withdrawal';
  description: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
}
export interface ActiveLoan {
  name: string;
  paid: number;
  total: number;
  due: string;
}
export interface Announcement {
  badge?: string;
  title: string;
  body: string;
  date: string;
}
export type ModalKey =
  | 'contribute' | 'loan' | 'withdraw' | 'transfer'
  | 'repay' | 'statements' | 'support' | 'profile'
  | 'logout' | 'viewAllTx' | 'loanDetail' | 'announcement' | 'statDetail';

export type ToastType = 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class MemberDashboardComponent implements AfterViewInit {
  /* ─────────── State: data ─────────── */
  stats: StatCard[] = [
    { label: 'Total Savings',    amount: 'KES 245,000', change: '12.5%', trendUp: true,  icon: 'wallet', tone: 'blue'  },
    { label: 'Share Capital',    amount: 'KES 50,000',  change: '8.2%',  trendUp: true,  icon: 'chart',  tone: 'green' },
    { label: 'Loan Balance',     amount: 'KES 80,000',  change: '5.3%',  trendUp: false, icon: 'bank',   tone: 'amber' },
    { label: 'Dividends Earned', amount: 'KES 12,300',  change: '18.7%', trendUp: true,  icon: 'coins',  tone: 'teal'  },
  ];

  quickActions: QuickAction[] = [
    { key: 'contribute', label: 'Contribute', icon: 'plus',     tone: 'blue'   },
    { key: 'loan',       label: 'Apply Loan', icon: 'bank',     tone: 'indigo' },
    { key: 'withdraw',   label: 'Withdraw',   icon: 'arrow-up', tone: 'amber'  },
    { key: 'transfer',   label: 'Transfer',   icon: 'transfer', tone: 'teal'   },
    { key: 'repay',      label: 'Repay Loan', icon: 'card',     tone: 'green'  },
    { key: 'statements', label: 'Statements', icon: 'doc',      tone: 'slate'  },
    { key: 'support',    label: 'Support',    icon: 'headset',  tone: 'purple' },
    { key: 'profile',    label: 'Profile',    icon: 'user',     tone: 'red'    },
  ];

  transactions: TxRow[] = [
    { date: 'Nov 28, 2024', type: 'Deposit',    description: 'Monthly Contribution', amount: '+KES 5,000',  status: 'Completed' },
    { date: 'Nov 25, 2024', type: 'Debit',      description: 'Loan Repayment',       amount: '-KES 8,500',  status: 'Completed' },
    { date: 'Nov 20, 2024', type: 'Transfer',   description: 'To Savings Account',   amount: 'KES 10,000',  status: 'Completed' },
    { date: 'Nov 15, 2024', type: 'Withdrawal', description: 'Emergency Withdrawal', amount: '-KES 15,000', status: 'Pending'   },
    { date: 'Nov 10, 2024', type: 'Deposit',    description: 'Share Capital Top-up', amount: '+KES 20,000', status: 'Completed' },
  ];

  activeLoans: ActiveLoan[] = [
    { name: 'Normal Loan',    paid: 60_000, total: 100_000, due: 'Mar 2025' },
    { name: 'Emergency Loan', paid: 15_000, total: 20_000,  due: 'Jan 2025' },
  ];

  announcements: Announcement[] = [
    { badge: 'New', title: 'Annual General Meeting', body: 'The AGM has been scheduled for December 15, 2024. All members are required to attend.', date: 'Nov 28, 2024' },
    { title: 'Dividend Declaration', body: 'Year 2024 dividends will be credited to accounts by January 15, 2025.', date: 'Nov 20, 2024' },
    { title: 'New Loan Products', body: 'We have introduced Education and Asset Finance loan products with competitive rates.', date: 'Nov 10, 2024' },
  ];

  chartData = [55, 62, 48, 70, 58, 75, 68, 80, 72, 85, 78, 90];
  chartLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  chartRange: 'monthly' | 'quarterly' | 'yearly' = 'monthly';

  /* ─────────── State: modals ─────────── */
  activeModal: ModalKey | null = null;
  selectedLoan: ActiveLoan | null = null;
  selectedAnnouncement: Announcement | null = null;
  selectedStat: StatCard | null = null;

  /* ─────────── State: forms ─────────── */
  contribute = { type: '', amount: null as number | null, method: '', phone: '' };
  loan       = { type: '', amount: null as number | null, period: '', purpose: '', guarantor1: '', guarantor2: '', notes: '', agreed: false };
  withdraw   = { from: '', amount: null as number | null, to: '', reason: '' };
  transfer   = { from: '', to: '', amount: null as number | null, narration: '' };
  repay      = { loan: '', amount: null as number | null, method: '' };
  statements = { type: 'savings', from: '', to: '', format: 'pdf' };
  support    = { subject: '', category: 'general', message: '' };
  profile    = { name: 'James Kamau', email: 'james.kamau@email.com', phone: '+254 712 345 678', address: 'Nairobi, Kenya' };

  /* ─────────── Toast (used sparingly) ─────────── */
  toast: { message: string; type: ToastType } | null = null;
  private toastTimer: any;

  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    setTimeout(() => this.drawChart(), 0);
    window.addEventListener('resize', () => this.drawChart());
  }

  /* ─────────── Modal helpers ─────────── */
  openModal(key: ModalKey): void {
    this.activeModal = key;
    document.body.style.overflow = 'hidden';
  }
  closeModal(): void {
    this.activeModal = null;
    this.selectedLoan = null;
    this.selectedAnnouncement = null;
    this.selectedStat = null;
    document.body.style.overflow = '';
  }
  openStatDetail(s: StatCard): void { this.selectedStat = s; this.openModal('statDetail'); }
  openLoanDetail(l: ActiveLoan): void { this.selectedLoan = l; this.openModal('loanDetail'); }
  openAnnouncement(a: Announcement): void { this.selectedAnnouncement = a; this.openModal('announcement'); }
  onQuickAction(key: string): void { this.openModal(key as ModalKey); }

  /* ─────────── Submissions (toast only on save) ─────────── */
  submitContribute(): void {
    if (!this.contribute.type || !this.contribute.amount) return this.showToast('Please fill required fields', 'warning');
    this.closeModal();
    this.showToast('Contribution submitted. Check your phone for M-Pesa prompt.', 'success');
    this.contribute = { type: '', amount: null, method: '', phone: '' };
  }
  submitLoan(): void {
    if (!this.loan.agreed || !this.loan.type || !this.loan.amount) return this.showToast('Please complete the loan form and accept terms', 'warning');
    this.closeModal();
    this.showToast('Loan application submitted for review.', 'success');
  }
  submitWithdraw(): void {
    if (!this.withdraw.from || !this.withdraw.amount) return this.showToast('Please fill required fields', 'warning');
    this.closeModal();
    this.showToast('Withdrawal request submitted.', 'success');
  }
  submitTransfer(): void {
    if (!this.transfer.from || !this.transfer.to || !this.transfer.amount) return this.showToast('Please fill required fields', 'warning');
    this.closeModal();
    this.showToast('Transfer completed successfully.', 'success');
  }
  submitRepay(): void {
    if (!this.repay.loan || !this.repay.amount) return;
    this.closeModal();
    this.showToast('Loan repayment initiated.', 'success');
  }
  submitStatements(): void { this.closeModal(); this.showToast('Statement is being prepared for download.', 'info'); }
  submitSupport(): void {
    if (!this.support.subject || !this.support.message) return this.showToast('Subject and message are required', 'warning');
    this.closeModal();
    this.showToast('Support ticket created. Our team will reply soon.', 'success');
  }
  submitProfile(): void { this.closeModal(); this.showToast('Profile updated.', 'success'); }
  confirmLogout(): void { this.closeModal(); this.showToast('You have been signed out.', 'info'); }

  /* ─────────── Toast ─────────── */
  showToast(message: string, type: ToastType = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3200);
  }
  dismissToast(): void { this.toast = null; }

  /* ─────────── Chart range ─────────── */
  setRange(range: 'monthly' | 'quarterly' | 'yearly'): void {
    this.chartRange = range;
    if (range === 'monthly') {
      this.chartLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      this.chartData = [55, 62, 48, 70, 58, 75, 68, 80, 72, 85, 78, 90];
    } else if (range === 'quarterly') {
      this.chartLabels = ['Q1','Q2','Q3','Q4'];
      this.chartData = [60, 70, 76, 88];
    } else {
      this.chartLabels = ['2021','2022','2023','2024'];
      this.chartData = [55, 68, 78, 92];
    }
    setTimeout(() => this.drawChart(), 0);
  }

  /* ─────────── Chart drawing ─────────── */
  private drawChart(): void {
    const cvs = this.chartCanvas?.nativeElement;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = cvs.clientWidth;
    const h = cvs.clientHeight;
    cvs.width = w * dpr;
    cvs.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padL = 36, padR = 16, padT = 18, padB = 28;
    const cw = w - padL - padR;
    const ch = h - padT - padB;

    ctx.strokeStyle = '#eef2f7';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + cw, y); ctx.stroke();
    }

    const max = 100;
    const points = this.chartData.map((v, i) => ({
      x: padL + (cw / Math.max(1, this.chartData.length - 1)) * i,
      y: padT + ch - (v / max) * ch,
    }));

    const grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
    grad.addColorStop(0, 'rgba(37, 99, 235, 0.28)');
    grad.addColorStop(1, 'rgba(37, 99, 235, 0.00)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(points[0].x, padT + ch);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padT + ch);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    points.forEach(p => {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '11px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.textAlign = 'center';
    this.chartLabels.forEach((lbl, i) => ctx.fillText(lbl, points[i].x, h - 8));
  }

  /* ─────────── helpers ─────────── */
  loanPct(l: ActiveLoan): number { return Math.round((l.paid / l.total) * 100); }
  totalOutstanding(): number { return this.activeLoans.reduce((s, l) => s + (l.total - l.paid), 0); }
  trackByIdx(i: number) { return i; }
}
