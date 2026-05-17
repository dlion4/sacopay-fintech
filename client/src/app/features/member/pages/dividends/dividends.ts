import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ================================================================
   INTERFACES
   ================================================================ */
export interface DividendRecord {
  year: string;
  amount: number;
  netAmount: number;
  rate: number;
  sharesAtDeclaration: number;
  shareCapital: number;
  paidOn: string;
  paymentMethod: string;
  tax: number;
  status: 'Paid' | 'Pending' | 'N/A';
  isLatest: boolean;
}

export interface InterestRecord {
  month: string;
  amount: number;
  status: 'credited' | 'pending';
  creditedOn?: string;
  avgBalance?: number;
  rate: string;
}

export interface ProjectionYear {
  year: number;
  shares: number;
  dividend: number;
  interest: number;
}

export interface PayoutOption {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  selected: boolean;
}

export interface NotificationItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  isNew: boolean;
  toastType: string;
  toastMessage: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'primary';
  show: boolean;
}

/* ================================================================
   COMPONENT
   ================================================================ */
@Component({
  selector: 'app-dividends',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dividends.html',
  styleUrls: ['./dividends.scss']
})
export class DividendsComponent implements OnInit, AfterViewInit {

  /* ---------- Tabs ---------- */
  activeTab: 'dividends' | 'interest' | 'projections' = 'dividends';

  /* ---------- Modals ---------- */
  showDividendDetailModal = false;
  showInterestDetailModal = false;
  showHowItWorksModal = false;
  showPayoutPrefModal = false;
  showTaxModal = false;
  showPolicyModal = false;
  showProjectorModal = false;
  showNotificationsModal = false;
  showLogoutModal = false;

  /* ---------- Selected Data ---------- */
  selectedDividendYear = '2024';
  selectedInterestMonth = '';
  selectedInterestAmount = '';
  selectedInterestStatus: 'credited' | 'pending' = 'credited';

  /* ---------- Projector Form ---------- */
  pjShares = 120;
  pjRate = 30;

  /* ---------- Payout Options ---------- */
  payoutOptions: PayoutOption[] = [
    { id: 'savings', icon: 'fa-piggy-bank', iconColor: 'var(--grn)', title: 'SaccoPay Savings', subtitle: 'Compounds with interest', selected: true },
    { id: 'wallet', icon: 'fa-wallet', iconColor: 'var(--pri)', title: 'SaccoPay Wallet', subtitle: 'For immediate spending', selected: false },
    { id: 'mpesa', icon: 'fa-mobile-alt', iconColor: 'var(--grn)', title: 'M-Pesa (0712***890)', subtitle: 'Direct to phone', selected: false },
    { id: 'reinvest', icon: 'fa-redo', iconColor: 'var(--pur)', title: 'Reinvest in Shares', subtitle: 'Auto-buy more shares', selected: false }
  ];

  /* ---------- Toast ---------- */
  toast: ToastMessage = { message: '', type: 'info', show: false };
  toastTimeout: any;

  /* ---------- Charts ---------- */
  @ViewChild('divChartCanvas', { static: false }) divChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('intChartCanvas', { static: false }) intChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projChartCanvas', { static: false }) projChartCanvas!: ElementRef<HTMLCanvasElement>;

  /* ================================================================
     DATA
     ================================================================ */
  dividendRecords: DividendRecord[] = [
    {
      year: '2024', amount: 3400, netAmount: 3230, rate: 30, sharesAtDeclaration: 100,
      shareCapital: 10000, paidOn: 'Dec 20, 2024', paymentMethod: 'Savings Account',
      tax: 170, status: 'Paid', isLatest: true
    },
    {
      year: '2023', amount: 0, netAmount: 0, rate: 0, sharesAtDeclaration: 0,
      shareCapital: 0, paidOn: '', paymentMethod: '',
      tax: 0, status: 'N/A', isLatest: false
    }
  ];

  interestRecords: InterestRecord[] = [
    { month: 'February 2025', amount: 375, status: 'pending', rate: '7% p.a. (compound)', avgBalance: 97000 },
    { month: 'January 2025', amount: 350, status: 'credited', creditedOn: 'Jan 31, 2025', rate: '7% p.a. (compound)', avgBalance: 97000 },
    { month: 'December 2024', amount: 325, status: 'credited', creditedOn: 'Dec 31, 2024', rate: '7% p.a. (compound)', avgBalance: 97000 },
    { month: 'November 2024', amount: 310, status: 'credited', creditedOn: 'Nov 30, 2024', rate: '7% p.a. (compound)', avgBalance: 97000 },
    { month: 'October 2024', amount: 295, status: 'credited', creditedOn: 'Oct 31, 2024', rate: '7% p.a. (compound)', avgBalance: 97000 }
  ];

  projectionYears: ProjectionYear[] = [
    { year: 2025, shares: 120, dividend: 3600, interest: 4400 },
    { year: 2026, shares: 150, dividend: 4500, interest: 5800 },
    { year: 2027, shares: 180, dividend: 5400, interest: 7200 },
    { year: 2028, shares: 210, dividend: 6300, interest: 8600 },
    { year: 2029, shares: 250, dividend: 7500, interest: 10500 }
  ];

  notifications: NotificationItem[] = [
    { icon: 'fa-bullhorn', iconBg: 'rgba(255,193,7,0.1)', iconColor: 'var(--gold)', title: 'AGM Notice', subtitle: 'March 15 — Dividend declaration • 2d ago', isNew: true, toastType: 'info', toastMessage: 'AGM 2025 on March 15. Dividend for FY 2025 to be declared.' },
    { icon: 'fa-percentage', iconBg: 'rgba(0,200,83,0.08)', iconColor: 'var(--grn)', title: 'Interest Credited', subtitle: 'KES 350 for January • 3d ago', isNew: true, toastType: 'success', toastMessage: 'January interest KES 350 credited to your savings.' },
    { icon: 'fa-chart-line', iconBg: 'var(--pri-sub)', iconColor: 'var(--pri)', title: 'Grow Your Shares', subtitle: '380 more shares available at KES 100 • 1w', isNew: false, toastType: 'info', toastMessage: 'New share purchase option: Buy up to 380 more shares at KES 100.' }
  ];

  /* ================================================================
     LIFECYCLE
     ================================================================ */
  ngOnInit(): void {
    // Show welcome toast after delay
    setTimeout(() => {
      this.showToast('AGM 2025 on March 15. FY 2025 dividend to be declared. Your current projection: KES 3,600.', 'info');
    }, 800);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initCharts(), 100);
  }

  /* ================================================================
     TABS
     ================================================================ */
  switchTab(tab: 'dividends' | 'interest' | 'projections'): void {
    this.activeTab = tab;
    if (tab === 'dividends' || tab === 'interest' || tab === 'projections') {
      setTimeout(() => this.initCharts(), 100);
    }
  }

  /* ================================================================
     MODAL HELPERS
     ================================================================ */
  openModal(modalName: string): void {
    (this as any)['show' + this.capitalize(modalName) + 'Modal'] = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalName: string): void {
    (this as any)['show' + this.capitalize(modalName) + 'Modal'] = false;
    document.body.style.overflow = '';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ================================================================
     DIVIDEND DETAIL
     ================================================================ */
  openDividendDetail(year: string): void {
    if (year === '2023') {
      this.showToast('You joined in Jan 2024. No dividend for FY 2023.', 'info');
      return;
    }
    this.selectedDividendYear = year;
    this.openModal('dividendDetail');
  }

  get selectedDividend(): DividendRecord | undefined {
    return this.dividendRecords.find(d => d.year === this.selectedDividendYear);
  }

  /* ================================================================
     INTEREST DETAIL
     ================================================================ */
  openInterestDetail(record: InterestRecord): void {
    this.selectedInterestMonth = record.month;
    this.selectedInterestAmount = record.amount.toString();
    this.selectedInterestStatus = record.status;
    this.openModal('interestDetail');
  }

  /* ================================================================
     PAYOUT PREFERENCE
     ================================================================ */
  selectPayout(optionId: string): void {
    this.payoutOptions.forEach(opt => opt.selected = (opt.id === optionId));
  }

  savePayoutPreference(): void {
    this.closeModal('payoutPref');
    this.showToast('Payout preference saved!', 'success');
  }

  /* ================================================================
     PROJECTOR CALCULATOR
     ================================================================ */
  get pjCapital(): number {
    return this.pjShares * 100;
  }

  get pjGross(): number {
    return Math.round(this.pjCapital * this.pjRate / 100);
  }

  get pjTax(): number {
    return Math.round(this.pjGross * 0.05);
  }

  get pjNet(): number {
    return this.pjGross - this.pjTax;
  }

  setProjectorShares(shares: number): void {
    this.pjShares = shares;
  }

  /* ================================================================
     NOTIFICATIONS
     ================================================================ */
  handleNotification(notif: NotificationItem): void {
    this.showToast(notif.toastMessage, notif.toastType as any);
    this.closeModal('notifications');
  }

  /* ================================================================
     TOAST
     ================================================================ */
  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' | 'primary' = 'info'): void {
    this.toast = { message, type, show: true };
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.show = false;
    }, 5000);
  }

  /* ================================================================
     DOWNLOAD ACTIONS
     ================================================================ */
  exportDividends(): void {
    this.showToast('Dividend statement exported as PDF', 'success');
  }

  exportInterest(): void {
    this.showToast('Interest statement exported', 'success');
  }

  downloadDividendCertificate(): void {
    this.showToast(`Dividend certificate FY ${this.selectedDividendYear} downloaded`, 'success');
  }

  downloadTaxCertificate(): void {
    this.showToast('Tax certificate downloaded', 'success');
  }

  downloadTaxCertificateFY(): void {
    this.showToast('Tax certificate FY 2024 downloaded', 'success');
  }

  /* ================================================================
     CHARTS (Canvas-based)
     ================================================================ */
  private initCharts(): void {
    this.drawDividendChart();
    this.drawInterestChart();
    this.drawProjectionChart();
  }

  private drawDividendChart(): void {
    const canvas = this.divChartCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(26,29,46,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (ch / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + cw, y);
      ctx.stroke();
    }

    // Y labels
    ctx.fillStyle = 'rgba(26,29,46,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = 5000 - i * 1250;
      const y = padding.top + (ch / 4) * i;
      ctx.fillText('KES ' + (val / 1000) + 'K', padding.left - 8, y + 4);
    }

    // Bars
    const labels = ['FY 2024', 'FY 2025 (est.)'];
    const dividendData = [3400, 3600];
    const interestData = [4100, 4400];
    const barWidth = 30;
    const groupWidth = 100;
    const startX = padding.left + (cw - groupWidth * labels.length) / 2 + groupWidth / 2;

    labels.forEach((label, i) => {
      const x = startX + i * groupWidth;

      // Dividend bar
      const dh = (dividendData[i] / 5000) * ch;
      ctx.fillStyle = i === 0 ? 'rgba(0,200,83,0.6)' : 'rgba(0,200,83,0.25)';
      this.roundRect(ctx, x - barWidth - 2, padding.top + ch - dh, barWidth, dh, 8);
      ctx.fill();

      // Interest bar
      const ih = (interestData[i] / 5000) * ch;
      ctx.fillStyle = i === 0 ? 'rgba(2,136,209,0.5)' : 'rgba(2,136,209,0.20)';
      this.roundRect(ctx, x + 2, padding.top + ch - ih, barWidth, ih, 8);
      ctx.fill();

      // X label
      ctx.fillStyle = 'rgba(26,29,46,0.4)';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - 10);
    });

    // Legend
    const legendY = 15;
    ctx.fillStyle = 'rgba(0,200,83,0.6)';
    ctx.beginPath();
    ctx.arc(w - 140, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(26,29,46,0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Dividend', w - 130, legendY + 4);

    ctx.fillStyle = 'rgba(2,136,209,0.5)';
    ctx.beginPath();
    ctx.arc(w - 60, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(26,29,46,0.5)';
    ctx.fillText('Interest', w - 50, legendY + 4);
  }

  private drawInterestChart(): void {
    const canvas = this.intChartCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const data = [125, 180, 220, 250, 270, 290, 300, 310, 325, 350, 375, 0];
    const maxVal = 400;

    // Grid
    ctx.strokeStyle = 'rgba(26,29,46,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (ch / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + cw, y);
      ctx.stroke();
    }

    // Y labels
    ctx.fillStyle = 'rgba(26,29,46,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = maxVal - i * 100;
      const y = padding.top + (ch / 4) * i;
      ctx.fillText('KES ' + val, padding.left - 8, y + 4);
    }

    // Line
    const stepX = cw / (labels.length - 1);
    ctx.beginPath();
    ctx.strokeStyle = '#0288D1';
    ctx.lineWidth = 2;
    data.forEach((val, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + ch - (val / maxVal) * ch;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    ctx.lineTo(padding.left + cw, padding.top + ch);
    ctx.lineTo(padding.left, padding.top + ch);
    ctx.closePath();
    ctx.fillStyle = 'rgba(2,136,209,0.06)';
    ctx.fill();

    // Points
    data.forEach((val, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + ch - (val / maxVal) * ch;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0288D1';
      ctx.fill();
    });

    // X labels
    ctx.fillStyle = 'rgba(26,29,46,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      const x = padding.left + stepX * i;
      ctx.fillText(label, x, h - 8);
    });
  }

  private drawProjectionChart(): void {
    const canvas = this.projChartCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const cw = w - padding.left - padding.right;
    const ch = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    const labels = ['2025', '2026', '2027', '2028', '2029'];
    const dividendData = [3600, 4500, 5400, 6300, 7500];
    const interestData = [4400, 5800, 7200, 8600, 10500];
    const maxVal = 18000;

    // Grid
    ctx.strokeStyle = 'rgba(26,29,46,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (ch / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + cw, y);
      ctx.stroke();
    }

    // Y labels
    ctx.fillStyle = 'rgba(26,29,46,0.4)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = maxVal - i * 4500;
      const y = padding.top + (ch / 4) * i;
      ctx.fillText('KES ' + (val / 1000) + 'K', padding.left - 8, y + 4);
    }

    // Stacked bars
    const barWidth = 40;
    const groupWidth = cw / labels.length;

    labels.forEach((label, i) => {
      const x = padding.left + i * groupWidth + groupWidth / 2;

      // Dividend bar (bottom)
      const dh = (dividendData[i] / maxVal) * ch;
      ctx.fillStyle = 'rgba(255,193,7,0.6)';
      this.roundRect(ctx, x - barWidth / 2, padding.top + ch - dh, barWidth, dh, 6);
      ctx.fill();

      // Interest bar (top)
      const ih = (interestData[i] / maxVal) * ch;
      ctx.fillStyle = 'rgba(0,200,83,0.5)';
      this.roundRect(ctx, x - barWidth / 2, padding.top + ch - dh - ih, barWidth, ih, 6);
      ctx.fill();

      // X label
      ctx.fillStyle = 'rgba(26,29,46,0.4)';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - 10);
    });

    // Legend
    const legendY = 15;
    ctx.fillStyle = 'rgba(255,193,7,0.6)';
    ctx.beginPath();
    ctx.arc(w - 140, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(26,29,46,0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Dividends', w - 130, legendY + 4);

    ctx.fillStyle = 'rgba(0,200,83,0.5)';
    ctx.beginPath();
    ctx.arc(w - 60, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(26,29,46,0.5)';
    ctx.fillText('Interest', w - 50, legendY + 4);
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}