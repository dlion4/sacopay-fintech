import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ============================================
// INTERFACES
// ============================================
interface Portfolio {
  totalOutstanding: number;
  activeCount: number;
  pendingCount: number;
  clearedCount: number;
  borrowingLimit: string;
  availableToBorrow: string;
  repaymentScore: number;
  repaymentRating: string;
  nextPaymentDate: Date;
  nextPaymentAmount: number;
  nextPaymentDays: number;
}

interface Loan {
  id: string;
  name: string;
  ref: string;
  status: 'Active' | 'Pending' | 'Cleared';
  icon: string;
  color: string;
  outstanding: number;
  amountDisp: string;
  rate: string;
  installment: number;
  period: string;
  paid: number;
  total: number;
  repaymentPct: number;
  guarantors?: string[];
  disburseDate: string;
  nextDue: string;
  nextAmt: number;
  totalPaid: number;
}

interface LoanProduct {
  id: string;
  name: string;
  category: string;
  max: string;
  rate: string;
  period: string;
  fee: string;
  guarantors: string;
  guarantorCount: number;
  collateral: string;
  disburse: string;
  penalty: string;
  eligibility: string;
  docs: string;
  icon: string;
  color: string;
}

interface ApplyData {
  amount: number;
  period: number;
  purpose: string;
  channel: string;
  phone: string;
  bank: string;
  bankAcc: string;
  school: string;
  schoolAcc: string;
  adm: string;
  agreeTerms: boolean;
  consent: boolean;
}

interface Guarantor {
  memberId: string;
}

interface UploadedFiles {
  id: boolean;
  payslip: boolean;
}

interface CalcData {
  amount: number;
  period: number;
  rate: number;
}

interface CalcResult {
  monthly: string;
  interest: string;
  fee: string;
  total: string;
}

interface AppTrackerStep {
  title: string;
  desc?: string;
  status: 'done' | 'active' | 'pending';
  icon: string;
}

interface Notification {
  id: string;
  title: string;
  desc: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  unread: boolean;
  action?: string;
}

interface Toast {
  type: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  title: string;
  message: string;
  icon: string;
  iconColor: string;
}

// ============================================
// LOANS CENTER COMPONENT — Angular v21 Standalone
// ============================================
@Component({
  selector: 'app-loans-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './loans.html',
  styleUrls: ['./loans.scss']
})
export class LoansCenterComponent implements OnInit {
  // Tab State
  activeTab: 'myLoans' | 'products' | 'schedule' = 'myLoans';

  // Filters
  loanFilter: 'all' | 'active' | 'pending' | 'cleared' = 'all';
  productFilter: 'all' | 'quick' | 'guarantor' | 'no-guarantor' = 'all';
  scheduleLoanFilter: string = 'all';

  // Selection
  selectedProductKey: string = '';

  // Portfolio Data
  portfolio: Portfolio = {
    totalOutstanding: 103500,
    activeCount: 2,
    pendingCount: 1,
    clearedCount: 1,
    borrowingLimit: 'KES 476,250',
    availableToBorrow: 'KES 372,750',
    repaymentScore: 98,
    repaymentRating: 'Excellent',
    nextPaymentDate: new Date('2025-03-01'),
    nextPaymentAmount: 3200,
    nextPaymentDays: 4
  };

  // My Loans
  myLoans: Loan[] = [
    {
      id: 'emergency',
      name: 'Emergency Loan',
      ref: 'LN-2025-0042',
      status: 'Active',
      icon: 'ambulance',
      color: 'var(--red)',
      outstanding: 18500,
      amountDisp: '30K',
      rate: '12%',
      installment: 3200,
      period: '12 mo',
      paid: 4,
      total: 12,
      repaymentPct: 38,
      disburseDate: 'Nov 2024',
      nextDue: 'Mar 1',
      nextAmt: 3200,
      totalPaid: 11500
    },
    {
      id: 'development',
      name: 'Development Loan',
      ref: 'LN-2024-0028',
      status: 'Active',
      icon: 'home',
      color: 'var(--blu)',
      outstanding: 85000,
      amountDisp: '100K',
      rate: '10%',
      installment: 4800,
      period: '36 mo',
      paid: 5,
      total: 36,
      repaymentPct: 15,
      guarantors: ['John Mwangi (MBR-001234)', 'Jane Wanjiku (MBR-002345)', 'Peter Ochieng (MBR-003456)'],
      disburseDate: 'Oct 2024',
      nextDue: 'Mar 15',
      nextAmt: 4800,
      totalPaid: 15000
    },
    {
      id: 'schoolPending',
      name: 'School Fees Loan',
      ref: 'LN-2025-0058',
      status: 'Pending',
      icon: 'graduation-cap',
      color: 'var(--pur)',
      outstanding: 0,
      amountDisp: '50K',
      rate: '8%',
      installment: 0,
      period: '12 mo',
      paid: 0,
      total: 12,
      repaymentPct: 0,
      disburseDate: 'Pending',
      nextDue: 'N/A',
      nextAmt: 0,
      totalPaid: 0
    },
    {
      id: 'personal',
      name: 'Personal Loan',
      ref: 'LN-2024-0015',
      status: 'Cleared',
      icon: 'check-double',
      color: 'var(--grn)',
      outstanding: 0,
      amountDisp: '20K',
      rate: '12%',
      installment: 0,
      period: '6 mo',
      paid: 6,
      total: 6,
      repaymentPct: 100,
      disburseDate: 'Mar 2024',
      nextDue: 'N/A',
      nextAmt: 0,
      totalPaid: 22400
    }
  ];

  // Loan Products
  loanProducts: LoanProduct[] = [
    {
      id: 'emergency',
      name: 'Emergency Loan',
      category: 'Quick Loan',
      max: 'KES 50,000',
      rate: '12% p.a.',
      period: 'Up to 12 months',
      fee: '1%',
      guarantors: 'None required',
      guarantorCount: 0,
      collateral: 'None',
      disburse: 'Within 24h',
      penalty: 'Late payment: 5% of overdue amount per month. Grace period: 3 days. Default triggers recovery from savings after 90 days.',
      eligibility: 'Active member for 3+ months. Savings balance of at least KES 5,000. No existing emergency loan.',
      docs: 'National ID (front & back)',
      icon: 'ambulance',
      color: 'var(--red)'
    },
    {
      id: 'development',
      name: 'Development Loan',
      category: 'Long Term',
      max: 'KES 500,000',
      rate: '10% p.a.',
      period: 'Up to 36 months',
      fee: '2%',
      guarantors: '3 Required',
      guarantorCount: 3,
      collateral: 'None',
      disburse: '3-5 days',
      penalty: 'Late payment: 5% per month. Default after 90 days triggers guarantor liability and savings recovery.',
      eligibility: 'Active member for 6+ months. Savings × 3 multiplier. Good repayment history.',
      docs: 'National ID, 3 months bank statements, proof of income',
      icon: 'home',
      color: 'var(--blu)'
    },
    {
      id: 'school',
      name: 'School Fees Loan',
      category: 'Education',
      max: 'KES 100,000',
      rate: '8% p.a.',
      period: 'Up to 12 months',
      fee: '1%',
      guarantors: '2 Required',
      guarantorCount: 2,
      collateral: 'None',
      disburse: 'Direct to school',
      penalty: 'Late payment: 3% per month. Grace period: 7 days for education loans.',
      eligibility: 'Active member for 3+ months. Valid school admission/fee structure.',
      docs: 'National ID, School admission letter, Fee structure',
      icon: 'graduation-cap',
      color: 'var(--pur)'
    },
    {
      id: 'salary',
      name: 'Salary Advance',
      category: 'Quick Loan',
      max: 'KES 30,000',
      rate: '5% flat',
      period: 'Up to 3 months',
      fee: '0.5%',
      guarantors: 'None',
      guarantorCount: 0,
      collateral: 'None',
      disburse: 'Instant STK',
      penalty: 'Late payment: 10% flat. Auto-recovery from next salary.',
      eligibility: 'Employed members with salary processing through SACCO.',
      docs: 'National ID, Latest payslip',
      icon: 'money-bill-wave',
      color: 'var(--grn)'
    },
    {
      id: 'business',
      name: 'Business Loan',
      category: 'Business',
      max: 'KES 1,000,000',
      rate: '14% p.a.',
      period: 'Up to 48 months',
      fee: '2.5%',
      guarantors: '4 Required',
      guarantorCount: 4,
      collateral: 'Required',
      disburse: '5-7 days',
      penalty: 'Late payment: 5% per month. Collateral seizure after 120 days default.',
      eligibility: 'Active member 12+ months. Business registration. 2 years financial statements.',
      docs: 'National ID, Business registration, 2 years financials, Collateral documents',
      icon: 'briefcase',
      color: 'var(--ylw)'
    },
    {
      id: 'asset',
      name: 'Asset Finance',
      category: 'Secured',
      max: 'KES 2,000,000',
      rate: '13% p.a.',
      period: 'Up to 60 months',
      fee: '2%',
      guarantors: '2 Required',
      guarantorCount: 2,
      collateral: 'Asset logbook',
      disburse: '7-10 days',
      penalty: 'Late payment: 5% per month. Asset repossession after 90 days default.',
      eligibility: 'Active member 6+ months. 20% deposit on asset value.',
      docs: 'National ID, Proforma invoice, Insurance quote, Logbook (for used assets)',
      icon: 'car',
      color: 'var(--tx2)'
    }
  ];

  // Computed counts
  get activeLoansCount(): number {
    return this.myLoans.filter(l => l.status === 'Active').length;
  }

  get pendingLoansCount(): number {
    return this.myLoans.filter(l => l.status === 'Pending').length;
  }

  get clearedLoansCount(): number {
    return this.myLoans.filter(l => l.status === 'Cleared').length;
  }

  // Filtered loans based on filter
  get filteredLoans(): Loan[] {
    if (this.loanFilter === 'all') return this.myLoans;
    return this.myLoans.filter(l => l.status.toLowerCase() === this.loanFilter);
  }

  // Filtered products based on filter
  get filteredProducts(): LoanProduct[] {
    if (this.productFilter === 'all') return this.loanProducts;
    if (this.productFilter === 'quick') {
      return this.loanProducts.filter(p => p.category === 'Quick Loan');
    }
    if (this.productFilter === 'guarantor') {
      return this.loanProducts.filter(p => p.guarantorCount > 0);
    }
    if (this.productFilter === 'no-guarantor') {
      return this.loanProducts.filter(p => p.guarantorCount === 0);
    }
    return this.loanProducts;
  }

  // Modal States
  loanDetailModalOpen = false;
  applyModalOpen = false;
  prodDetailModalOpen = false;
  calcModalOpen = false;
  eligModalOpen = false;
  appTrackModalOpen = false;
  notifModalOpen = false;
  logoutModalOpen = false;

  // Selected Items
  selectedLoan: Loan | null = null;
  selectedProduct: LoanProduct | null = null;

  // Apply Modal State
  applyStep = 1;
  applyProductName = '';
  applyProduct: LoanProduct | null = null;
  applyWizardSteps: string[] = ['Details', 'Disburse', 'Guarantors', 'Docs', 'Review'];
  applyData: ApplyData = {
    amount: 0,
    period: 12,
    purpose: '',
    channel: 'wallet',
    phone: '',
    bank: '',
    bankAcc: '',
    school: '',
    schoolAcc: '',
    adm: '',
    agreeTerms: false,
    consent: false
  };
  applyGuarantors: Guarantor[] = [];
  uploadedFiles: UploadedFiles = { id: false, payslip: false };

  // Calculator
  calcData: CalcData = { amount: 50000, period: 12, rate: 12 };
  calcResult: CalcResult = { monthly: 'KES 0', interest: 'KES 0', fee: 'KES 0', total: 'KES 0' };

  // Application Calculation
  appCalcMonthly = 'KES 0';
  appCalcInterest = 'KES 0';
  appCalcFee = 'KES 0';
  appCalcTotal = 'KES 0';

  // App Tracker
  appTrackerSteps: AppTrackerStep[] = [
    { title: 'Application Submitted', desc: 'Feb 20, 2025 at 14:32', status: 'done', icon: 'fa-paper-plane' },
    { title: 'Guarantors Notified', desc: '2/2 confirmed', status: 'done', icon: 'fa-users' },
    { title: 'Under Review', desc: 'Admin reviewing...', status: 'active', icon: 'fa-hourglass-half' },
    { title: 'Approval Decision', status: 'pending', icon: 'fa-check-circle' },
    { title: 'Disbursement', status: 'pending', icon: 'fa-hand-holding-usd' }
  ];

  // Notifications
  notifications: Notification[] = [
    {
      id: '1',
      title: 'Payment Due Soon',
      desc: 'Emergency Loan installment of KES 3,200 due in 4 days',
      icon: 'fa-clock',
      bgColor: 'rgba(249,168,37,0.10)',
      iconColor: 'var(--ylw)',
      unread: true
    },
    {
      id: '2',
      title: 'Application Update',
      desc: 'School Fees Loan under admin review',
      icon: 'fa-file-invoice',
      bgColor: 'rgba(26, 115, 232, 0.06)',
      iconColor: 'var(--pri)',
      unread: true
    },
    {
      id: '3',
      title: 'Payment Received',
      desc: 'KES 4,800 received for Development Loan',
      icon: 'fa-check-circle',
      bgColor: 'rgba(0,200,83,0.08)',
      iconColor: 'var(--grn)',
      unread: false
    }
  ];

  // Toasts
  toasts: Toast[] = [];

  // Computed Properties
  get applyNeedsGuarantors(): boolean {
    return (this.applyProduct?.guarantorCount ?? 0) > 0;
  }

  get applyGuarantorCount(): number {
    return this.applyProduct?.guarantorCount ?? 0;
  }

  get applyTotalSteps(): number {
    // Details, Disburse, [Guarantors if needed], Docs, Review
    return this.applyNeedsGuarantors ? 5 : 4;
  }

  ngOnInit(): void {
    this.calc();
  }

  // ============================================
  // TAB & FILTER METHODS
  // ============================================
  setLoanFilter(filter: 'all' | 'active' | 'pending' | 'cleared'): void {
    this.loanFilter = filter;
  }

  setProductFilter(filter: 'all' | 'quick' | 'guarantor' | 'no-guarantor'): void {
    this.productFilter = filter;
  }

  filterSchedule(): void {
    // Schedule filtering handled by template
  }

  scrollToProducts(): void {
    this.activeTab = 'products';
    setTimeout(() => {
      const el = document.getElementById('panelProducts');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // ============================================
  // LOAN DETAIL MODAL
  // ============================================
  openLoanDetail(loanId: string): void {
    this.selectedLoan = this.myLoans.find(l => l.id === loanId) ?? null;
    if (this.selectedLoan) {
      this.loanDetailModalOpen = true;
    }
  }

  closeLoanDetailModal(): void {
    this.loanDetailModalOpen = false;
    this.selectedLoan = null;
  }

  // ============================================
  // PRODUCT DETAIL MODAL
  // ============================================
  openProductDetail(productId: string): void {
    this.selectedProduct = this.loanProducts.find(p => p.id === productId) ?? null;
    this.selectedProductKey = productId;
    if (this.selectedProduct) {
      this.prodDetailModalOpen = true;
    }
  }

  closeProdDetailModal(): void {
    this.prodDetailModalOpen = false;
  }

  // ============================================
  // APPLICATION MODAL
  // ============================================
  startApplication(productId: string): void {
    this.applyProduct = this.loanProducts.find(p => p.id === productId) ?? null;
    if (!this.applyProduct) return;

    this.applyProductName = this.applyProduct.name;
    this.applyStep = 1;
    this.applyData = {
      amount: 0,
      period: 12,
      purpose: '',
      channel: 'wallet',
      phone: '',
      bank: '',
      bankAcc: '',
      school: '',
      schoolAcc: '',
      adm: '',
      agreeTerms: false,
      consent: false
    };

    // Initialize guarantors array
    const count = this.applyProduct.guarantorCount;
    this.applyGuarantors = [];
    for (let i = 0; i < count; i++) {
      this.applyGuarantors.push({ memberId: '' });
    }

    this.uploadedFiles = { id: false, payslip: false };
    this.updateAppCalc();
    this.applyModalOpen = true;
  }

  closeApplyModal(): void {
    this.applyModalOpen = false;
    this.applyProduct = null;
  }

  selectChannel(channel: string): void {
    this.applyData.channel = channel;
  }

  nextApplyStep(): void {
    if (this.applyStep < this.applyTotalSteps) {
      this.applyStep++;
    }
  }

  prevApplyStep(): void {
    if (this.applyStep > 1) {
      this.applyStep--;
    }
  }

  updateAppCalc(): void {
    const amount = this.applyData.amount || 0;
    const months = this.applyData.period || 12;
    const rateStr = this.applyProduct?.rate ?? '12%';
    const rate = parseFloat(rateStr) / 100;
    const feeStr = this.applyProduct?.fee ?? '1%';
    const feeRate = parseFloat(feeStr) / 100;

    const totalInterest = amount * rate * (months / 12);
    const fee = amount * feeRate;
    const total = amount + totalInterest + fee;
    const monthly = total / months;

    this.appCalcMonthly = `KES ${this.formatNumber(monthly)}`;
    this.appCalcInterest = `KES ${this.formatNumber(totalInterest)}`;
    this.appCalcFee = `KES ${this.formatNumber(fee)}`;
    this.appCalcTotal = `KES ${this.formatNumber(total)}`;
  }

  triggerFileUpload(type: 'id' | 'payslip'): void {
    // In real app, trigger file input
    this.uploadedFiles[type] = true;
    this.showToast(`${type === 'id' ? 'ID' : 'Payslip'} uploaded successfully`, 'success');
  }

  submitApplication(): void {
    if (!this.applyData.agreeTerms || !this.applyData.consent) {
      this.showToast('Please agree to terms and consent', 'warning');
      return;
    }

    this.showToast('Application submitted successfully!', 'success');
    this.closeApplyModal();

    // Switch to pending view
    this.activeTab = 'myLoans';
    this.loanFilter = 'pending';
  }

  // ============================================
  // CALCULATOR MODAL
  // ============================================
  openCalcModal(): void {
    this.calcModalOpen = true;
    this.calc();
  }

  closeCalcModal(): void {
    this.calcModalOpen = false;
  }

  calc(): void {
    const amount = this.calcData.amount || 0;
    const months = this.calcData.period || 12;
    const rate = (this.calcData.rate || 12) / 100;

    const totalInterest = amount * rate * (months / 12);
    const fee = amount * 0.01; // 1% default fee
    const total = amount + totalInterest + fee;
    const monthly = total / months;

    this.calcResult = {
      monthly: `KES ${this.formatNumber(monthly)}`,
      interest: `KES ${this.formatNumber(totalInterest)}`,
      fee: `KES ${this.formatNumber(fee)}`,
      total: `KES ${this.formatNumber(total)}`
    };
  }

  // ============================================
  // ELIGIBILITY MODAL
  // ============================================
  openEligModal(): void {
    this.eligModalOpen = true;
  }

  closeEligModal(): void {
    this.eligModalOpen = false;
  }

  // ============================================
  // APP TRACKER MODAL
  // ============================================
  openAppTrackModal(): void {
    this.appTrackModalOpen = true;
  }

  closeAppTrackModal(): void {
    this.appTrackModalOpen = false;
  }

  // ============================================
  // NOTIFICATION MODAL
  // ============================================
  openNotifModal(): void {
    this.notifModalOpen = true;
  }

  closeNotifModal(): void {
    this.notifModalOpen = false;
  }

  handleNotification(notif: Notification): void {
    notif.unread = false;
    this.showToast(notif.title, 'info');
  }

  // ============================================
  // LOGOUT MODAL
  // ============================================
  openLogoutModal(): void {
    this.logoutModalOpen = true;
  }

  closeLogoutModal(): void {
    this.logoutModalOpen = false;
  }

  // ============================================
  // TOAST SYSTEM
  // ============================================
  showToast(message: string, type: 'success' | 'warning' | 'danger' | 'info' | 'primary' = 'info'): void {
    const iconMap: Record<string, string> = {
      success: 'fa-check-circle',
      warning: 'fa-exclamation-triangle',
      danger: 'fa-times-circle',
      info: 'fa-info-circle',
      primary: 'fa-bell'
    };

    const colorMap: Record<string, string> = {
      success: 'var(--grn)',
      warning: 'var(--ylw)',
      danger: 'var(--red)',
      info: 'var(--blu)',
      primary: 'var(--pri)'
    };

    const toast: Toast = {
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      icon: iconMap[type],
      iconColor: colorMap[type]
    };

    this.toasts.push(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 4000);
  }

  removeToast(index: number): void {
    this.toasts.splice(index, 1);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================
  exportSchedulePdf(): void {
    this.showToast('Schedule PDF downloading...', 'info');
  }

  private formatNumber(num: number): string {
    return Math.round(num).toLocaleString();
  }

  // Track by functions for @for loops
  trackByLoanId(index: number, loan: Loan): string {
    return loan.id;
  }

  trackByProductId(index: number, product: LoanProduct): string {
    return product.id;
  }

  trackByStepIndex(index: number, step: string): number {
    return index;
  }

  trackByGuarantorIndex(index: number, g: Guarantor): number {
    return index;
  }

  trackByNotifId(index: number, notif: Notification): string {
    return notif.id;
  }

  trackByToastIndex(index: number, toast: Toast): number {
    return index;
  }

  trackByTrackerIndex(index: number, step: AppTrackerStep): number {
    return index;
  }
}
