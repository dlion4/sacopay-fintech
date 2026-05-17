import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ================================================================
   INTERFACES
   ================================================================ */
export interface Guarantorship {
  code: string;
  name: string;
  memberId: string;
  loanType: string;
  loanAmount: number;
  myExposure: number;
  repaid: string;
  outstanding: number;
  lastPayment: string;
  status: 'Active' | 'Overdue' | 'Completed' | 'Released' | 'Declined' | 'Pending' | 'Requested';
  startDate: string;
  endDate: string;
  purpose: string;
  progress: number;
  avatarClass: string;
  since: string;
  overdueDays?: number;
  overdueAmount?: number;
  riskLevel?: string;
  installmentsPaid?: number;
  installmentsTotal?: number;
  monthlyInstallment?: number;
  interestRate?: number;
}

export interface IncomingRequest {
  code: string;
  name: string;
  memberId: string;
  loanType: string;
  loanAmount: number;
  myExposure: number;
  purpose: string;
  tenure: string;
  guarantorNumber: string;
  expires: string;
  sentTime: string;
  avatarClass: string;
  creditProfile: CreditProfileItem[];
  caution?: string;
}

export interface CreditProfileItem {
  icon: string;
  color: string;
  text: string;
}

export interface MyGuarantor {
  code: string;
  name: string;
  memberId: string;
  role: string;
  exposure: number;
  confirmedDate: string;
  guarantorNumber: number;
  avatarClass: string;
  status: 'Confirmed' | 'Pending' | 'Needed';
}

export interface HistoryRecord {
  borrower: string;
  memberId: string;
  loanType: string;
  amount: number;
  myExposure: number;
  status: 'Completed' | 'Released' | 'Declined';
  period: string;
}

export interface ScoreBreakdown {
  label: string;
  score: number;
  max: number;
  color: string;
}

export interface PaymentEntry {
  date: string;
  description: string;
  status: 'paid' | 'disbursed' | 'overdue';
}

export interface TimelineItem {
  time: string;
  content: string;
  type: 'done' | 'bad' | 'pending';
}

export interface GuarantorCandidate {
  code: string;
  name: string;
  memberId: string;
  score: number;
  capacity: string;
  avatarClass: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

/* ================================================================
   COMPONENT
   ================================================================ */
@Component({
  selector: 'app-guarantor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './guarantor.html',
  styleUrls: ['./guarantor.scss']
})
export class GuarantorComponent implements OnInit, AfterViewInit {

  /* ---------- Tabs ---------- */
  activeTab: 'guaranteeing' | 'incoming' | 'my-loans' | 'history' | 'score' = 'guaranteeing';

  /* ---------- Modals ---------- */
  showGuarantorDetailModal = false;
  showOtpModal = false;
  showDeclineModal = false;
  showRequestDetailModal = false;
  showContactBorrowerModal = false;
  showReleaseModal = false;
  showExposureModal = false;
  showHowItWorksModal = false;
  showPaymentHistoryModal = false;
  showThankGuarantorModal = false;
  showSelectGuarantorModal = false;
  showHistoryDetailModal = false;
  showProfileModal = false;
  showResendModal = false;
  showCancelModal = false;
  showDownloadHistoryModal = false;

  /* ---------- Selected Data ---------- */
  selectedGuarantorship: Guarantorship | null = null;
  selectedHistory: HistoryRecord | null = null;
  selectedIncoming: IncomingRequest | null = null;
  selectedCandidate: GuarantorCandidate | null = null;

  /* ---------- OTP ---------- */
  otpDigits: string[] = ['', '', '', '', '', ''];
  otpTimer = 285; // 4:45 in seconds
  otpInterval: any;

  /* ---------- Toast ---------- */
  toast: ToastMessage = { message: '', type: 'success', show: false };
  toastTimeout: any;

  /* ---------- Decline Form ---------- */
  declineReason = 'Personal financial constraints';
  declineMessage = '';

  /* ---------- Contact Form ---------- */
  contactMethod = 'SMS';
  contactMessage = 'Dear Samuel, this is a friendly reminder that your loan installment for December is overdue by 22 days. Please make payment as soon as possible to avoid further penalties. As your guarantor, I am concerned — please reach out. — John Kamau';

  /* ---------- Release Form ---------- */
  releaseReason = 'Financial hardship — need my capacity freed';
  releaseDetails = '';

  /* ---------- Thank You Form ---------- */
  thankYouMessage = 'Dear William, thank you for believing in me and guaranteeing my education loan. I am committed to repaying on time and I truly appreciate your support. — John Kamau';

  /* ---------- Select Guarantor Search ---------- */
  guarantorSearch = '';

  /* ---------- Download History Form ---------- */
  downloadFormat = 'PDF';
  downloadPeriod = 'All Time';

  /* ---------- Charts ---------- */
  @ViewChild('scoreChartCanvas', { static: false }) scoreChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('exposureChartCanvas', { static: false }) exposureChartCanvas!: ElementRef<HTMLCanvasElement>;

  /* ================================================================
     DATA
     ================================================================ */
  guaranteeing: Guarantorship[] = [
    {
      code: 'PO', name: 'Peter Omondi', memberId: 'SP-10145', loanType: 'Business Loan',
      loanAmount: 500000, myExposure: 250000, repaid: '42% (8/24 mo)', outstanding: 300000,
      lastPayment: 'Dec 15, 2024', status: 'Active', startDate: 'Aug 15, 2024', endDate: 'Aug 15, 2026',
      purpose: 'Business expansion - hardware shop', progress: 42, avatarClass: 'c3', since: 'Aug 2024',
      installmentsPaid: 8, installmentsTotal: 24, monthlyInstallment: 28750, interestRate: 16
    },
    {
      code: 'MA', name: 'Mary Achieng', memberId: 'SP-10018', loanType: 'Personal Loan',
      loanAmount: 250000, myExposure: 125000, repaid: '25% (3/12 mo)', outstanding: 187500,
      lastPayment: 'Dec 18, 2024', status: 'Active', startDate: 'Oct 1, 2024', endDate: 'Oct 1, 2025',
      purpose: 'School fees for children', progress: 25, avatarClass: 'c1', since: 'Oct 2024',
      installmentsPaid: 3, installmentsTotal: 12, monthlyInstallment: 24000, interestRate: 14
    },
    {
      code: 'SK', name: 'Samuel Kibet', memberId: 'SP-10189', loanType: 'Agriculture Loan',
      loanAmount: 400000, myExposure: 200000, repaid: '22% (5/24 mo)', outstanding: 312000,
      lastPayment: 'Nov 20, 2024', status: 'Overdue', startDate: 'Jun 1, 2024', endDate: 'Jun 1, 2026',
      purpose: 'Maize farming equipment', progress: 22, avatarClass: 'c5', since: 'Jun 2024',
      overdueDays: 22, overdueAmount: 22000, riskLevel: 'HIGH', installmentsPaid: 5, installmentsTotal: 24,
      monthlyInstallment: 22000, interestRate: 16
    }
  ];

  incomingRequests: IncomingRequest[] = [
    {
      code: 'GA', name: 'Grace Akinyi', memberId: 'SP-10067', loanType: 'Personal Loan Request',
      loanAmount: 300000, myExposure: 150000, purpose: 'School Fees', tenure: '12 months',
      guarantorNumber: 'You are #1 of 2', expires: 'Dec 25, 2024', sentTime: 'Sent 2 hours ago',
      avatarClass: 'c2',
      creditProfile: [
        { icon: 'check-circle-fill', color: 'var(--primary)', text: 'KYC Verified' },
        { icon: 'check-circle-fill', color: 'var(--primary)', text: '2yr member' },
        { icon: 'check-circle-fill', color: 'var(--primary)', text: 'Credit Score: 742' },
        { icon: 'x-circle-fill', color: 'var(--red)', text: '1 previous late payment' }
      ]
    },
    {
      code: 'BK', name: 'Bernard Kiprop', memberId: 'SP-10078', loanType: 'Business Loan Request',
      loanAmount: 750000, myExposure: 375000, purpose: 'Business Expansion', tenure: '24 months',
      guarantorNumber: 'You are #2 of 2', expires: 'Dec 26, 2024', sentTime: 'Sent Yesterday',
      avatarClass: 'c4',
      creditProfile: [
        { icon: 'check-circle-fill', color: 'var(--primary)', text: 'KYC Verified' },
        { icon: 'check-circle-fill', color: 'var(--primary)', text: '3yr member' },
        { icon: 'exclamation-circle-fill', color: 'var(--orange)', text: 'Credit Score: 645 (Fair)' },
        { icon: 'exclamation-circle-fill', color: 'var(--orange)', text: 'AML alert noted' }
      ],
      caution: 'This exposure (KES 375,000) would use 43% of your remaining guarantee capacity. An AML alert was recently flagged on this account.'
    }
  ];

  myLoanGuarantors: MyGuarantor[] = [
    { code: 'WO', name: 'William Ochieng', memberId: 'SP-10005', role: 'Chairman', exposure: 90000, confirmedDate: 'Sep 2, 2024', guarantorNumber: 1, avatarClass: 'c6', status: 'Confirmed' },
    { code: 'AN', name: 'Agnes Nyaboke', memberId: 'SP-10012', role: 'Treasurer', exposure: 90000, confirmedDate: 'Sep 2, 2024', guarantorNumber: 2, avatarClass: 'c3', status: 'Confirmed' }
  ];

  pendingGuarantorRequests: MyGuarantor[] = [
    { code: 'DO', name: 'David Otieno', memberId: 'SP-10025', role: '', exposure: 0, confirmedDate: 'Sent 2 hours ago', guarantorNumber: 1, avatarClass: 'c2', status: 'Pending' }
  ];

  historyRecords: HistoryRecord[] = [
    { borrower: 'Alice Muthoni', memberId: 'SP-10042', loanType: 'Personal Loan', amount: 150000, myExposure: 75000, status: 'Completed', period: 'Jan–Dec 2023' },
    { borrower: 'Daniel Kipchoge', memberId: 'SP-10098', loanType: 'Business Loan', amount: 300000, myExposure: 150000, status: 'Completed', period: 'Mar–Mar 2024' },
    { borrower: 'Jane Wanjiru', memberId: 'SP-10201', loanType: 'Education Loan', amount: 200000, myExposure: 100000, status: 'Completed', period: 'May–May 2024' },
    { borrower: 'Rose Nyambura', memberId: 'SP-10156', loanType: 'Emergency Loan', amount: 50000, myExposure: 25000, status: 'Released', period: 'Aug–Nov 2023' },
    { borrower: 'Evans Wafula', memberId: 'SP-10203', loanType: 'Agriculture Loan', amount: 180000, myExposure: 90000, status: 'Declined', period: 'Dec 2022' }
  ];

  scoreBreakdown: ScoreBreakdown[] = [
    { label: 'Reliability (promises kept)', score: 95, max: 100, color: 'var(--primary)' },
    { label: 'Loan performance (own)', score: 90, max: 100, color: 'var(--primary)' },
    { label: 'Capacity utilization', score: 70, max: 100, color: 'var(--orange)' },
    { label: 'Default history', score: 100, max: 100, color: 'var(--primary)' }
  ];

  scoreHistoryLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  scoreHistoryData = [72, 74, 75, 76, 78, 79, 80, 81, 82, 83, 84, 85];

  paymentTimeline: TimelineItem[] = [
    { time: 'Dec 15, 2024', content: 'Installment 8/24 paid — KES 28,750 ✓', type: 'done' },
    { time: 'Nov 15, 2024', content: 'Installment 7/24 paid — KES 28,750 ✓', type: 'done' },
    { time: 'Oct 15, 2024', content: 'Installment 6/24 paid — KES 28,750 ✓', type: 'done' }
  ];

  guarantorCandidates: GuarantorCandidate[] = [
    { code: 'FK', name: 'Florence Kerubo', memberId: 'SP-10030', score: 88, capacity: 'KES 200K free', avatarClass: 'c6' },
    { code: 'DO', name: 'David Otieno', memberId: 'SP-10025', score: 91, capacity: 'KES 450K free', avatarClass: 'c2' }
  ];

  /* ================================================================
     LIFECYCLE
     ================================================================ */
  ngOnInit(): void {
    // Initialize
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  /* ================================================================
     TABS
     ================================================================ */
  switchTab(tab: 'guaranteeing' | 'incoming' | 'my-loans' | 'history' | 'score'): void {
    this.activeTab = tab;
    if (tab === 'score') {
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

  closeAndOpen(closeName: string, openName: string): void {
    this.closeModal(closeName);
    setTimeout(() => this.openModal(openName), 300);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ================================================================
     GUARANTOR DETAIL
     ================================================================ */
  openGuarantorDetail(g: Guarantorship): void {
    this.selectedGuarantorship = g;
    this.openModal('guarantorDetail');
  }

  /* ================================================================
     HISTORY DETAIL
     ================================================================ */
  openHistoryDetail(h: HistoryRecord): void {
    this.selectedHistory = h;
    this.openModal('historyDetail');
  }

  /* ================================================================
     OTP
     ================================================================ */
  startOtpTimer(): void {
    this.otpTimer = 285;
    if (this.otpInterval) clearInterval(this.otpInterval);
    this.otpInterval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) {
        clearInterval(this.otpInterval);
      }
    }, 1000);
  }

  get otpTimeDisplay(): string {
    const m = Math.floor(this.otpTimer / 60);
    const s = this.otpTimer % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value;
    if (val.length === 1 && index < 5) {
      const next = document.getElementById('otp-' + (index + 1)) as HTMLInputElement;
      if (next) next.focus();
    }
    this.otpDigits[index] = val;
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prev = document.getElementById('otp-' + (index - 1)) as HTMLInputElement;
      if (prev) prev.focus();
    }
  }

  resendOtp(): void {
    this.showToast('OTP resent to your phone!', 'success');
    this.startOtpTimer();
  }

  /* ================================================================
     ACTIONS
     ================================================================ */
  approveGuarantor(): void {
    this.closeModal('otp');
    this.showToast("Guarantorship approved! You are now guaranteeing Grace Akinyi's loan.", 'success');
  }

  declineGuarantor(): void {
    this.closeModal('decline');
    this.showToast('Request declined. Grace Akinyi has been notified.', 'success');
  }

  sendMessage(): void {
    this.closeModal('contactBorrower');
    this.showToast('Message sent to Samuel Kibet!', 'success');
  }

  requestRelease(): void {
    this.closeModal('release');
    this.showToast('Release request submitted. Admin will review within 2 business days.', 'success');
  }

  sendThankYou(): void {
    this.closeModal('thankGuarantor');
    this.showToast('Thank-you message sent to William Ochieng! 🙏', 'success');
  }

  selectGuarantor(candidate: GuarantorCandidate): void {
    this.selectedCandidate = candidate;
    this.closeModal('selectGuarantor');
    this.showToast(candidate.name + ' selected as Guarantor #2. Request sent!', 'success');
  }

  resendReminder(): void {
    this.closeModal('resend');
    this.showToast('Reminder sent to David Otieno!', 'success');
  }

  cancelRequest(): void {
    this.closeModal('cancel');
    this.showToast('Request to David Otieno cancelled', 'success');
  }

  downloadStatement(): void {
    this.closeModal('downloadHistory');
    this.showToast('Statement downloaded!', 'success');
  }

  downloadCertificate(): void {
    this.showToast('Certificate downloaded!', 'success');
  }

  downloadExposureReport(): void {
    this.showToast('Exposure report downloaded!', 'success');
  }

  /* ================================================================
     TOAST
     ================================================================ */
  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toast = { message, type, show: true };
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.show = false;
    }, 3500);
  }

  /* ================================================================
     CHARTS (Canvas-based simple charts)
     ================================================================ */
  private initCharts(): void {
    this.drawScoreChart();
    this.drawExposureChart();
  }

  private drawScoreChart(): void {
    const canvas = this.scoreChartCanvas?.nativeElement;
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
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = 100 - i * 10;
      const y = padding.top + (chartH / 4) * i;
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    const labels = this.scoreHistoryLabels;
    const data = this.scoreHistoryData;
    const stepX = chartW / (labels.length - 1);

    labels.forEach((label, i) => {
      const x = padding.left + stepX * i;
      ctx.fillText(label, x, h - 8);
    });

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#1a73e8';
    ctx.lineWidth = 3;
    data.forEach((val, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + chartH - ((val - 60) / 40) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,208,132,0.1)';
    ctx.fill();

    // Points
    data.forEach((val, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + chartH - ((val - 60) / 40) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#1a73e8';
      ctx.fill();
    });
  }

  private drawExposureChart(): void {
    const canvas = this.exposureChartCanvas?.nativeElement;
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
    const cx = w / 2;
    const cy = h / 2 - 10;
    const radius = Math.min(w, h) / 2 - 30;
    const innerRadius = radius * 0.6;

    ctx.clearRect(0, 0, w, h);

    const data = [250000, 125000, 200000, 300000];
    const colors = ['rgba(0,208,132,0.8)', 'rgba(0,188,212,0.8)', 'rgba(244,67,54,0.8)', 'rgba(226,232,240,0.8)'];
    const labels = ['Peter Omondi', 'Mary Achieng', 'Samuel Kibet', 'Available'];
    const total = data.reduce((a, b) => a + b, 0);

    let startAngle = -Math.PI / 2;

    data.forEach((val, i) => {
      const sliceAngle = (val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Legend
    const legendY = h - 20;
    const legendItems = 4;
    const itemWidth = w / legendItems;

    labels.forEach((label, i) => {
      const x = itemWidth * i + itemWidth / 2;
      ctx.beginPath();
      ctx.arc(x - 40, legendY, 5, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, x - 30, legendY + 4);
    });
  }

  /* ================================================================
     HELPERS
     ================================================================ */
  formatCurrency(amount: number): string {
    return 'KES ' + amount.toLocaleString();
  }

  getExposureFillClass(g: Guarantorship): string {
    if (g.status === 'Overdue') return 'warn';
    if (g.progress >= 75) return 'safe';
    if (g.progress >= 40) return 'safe';
    return 'safe';
  }

  getScoreRingStyle(): string {
    const used = 234; // 65% of 360
    const danger = 270;
    return `conic-gradient(var(--orange) 0deg ${used}deg, var(--red) ${used}deg ${danger}deg, var(--bg3) ${danger}deg 360deg)`;
  }

  getScoreConicStyle(): string {
    const angle = (85 / 100) * 360;
    return `conic-gradient(var(--primary) 0deg ${angle}deg, var(--bg3) ${angle}deg 360deg)`;
  }

  getScoreBarStyle(score: number, color: string): string {
    return `width:${score}%; background: linear-gradient(90deg, ${color}, ${color === 'var(--primary)' ? 'var(--teal)' : '#ffb74d'});`;
  }

  onRowHover(event: MouseEvent, enter: boolean): void {
    const row = event.currentTarget as HTMLElement;
    if (enter) {
      row.style.background = 'var(--primary-ultra)';
    } else {
      row.style.background = '';
    }
  }

  onCandidateHover(event: MouseEvent, enter: boolean): void {
    const el = event.currentTarget as HTMLElement;
    if (enter) {
      el.style.borderColor = 'var(--primary)';
    } else {
      el.style.borderColor = 'var(--border)';
    }
  }
}