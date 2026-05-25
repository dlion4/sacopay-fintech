import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type LoanTab = 'myLoans' | 'products' | 'schedule' | 'applications' | 'guarantors' | 'documents';
export type LoanStatus = 'active' | 'pending' | 'cleared' | 'rejected';
export type ModalKey =
  | 'calculator' | 'applyLoan' | 'loanDetail' | 'productDetail' | 'makePayment'
  | 'applicationTracker' | 'cancelApplication' | 'support' | 'clearance'
  | 'guarantorRequest' | 'uploadDocuments' | 'repaymentDetail' | 'earlyPay'
  | 'restructure' | 'loanLimit' | 'loanStatement' | 'penaltyInfo'
  | 'eligibility' | 'scheduleExport' | 'collateral' | 'autoPay';

export interface LoanItem {
  key: string;
  name: string;
  ref: string;
  status: LoanStatus;
  tags: string[];
  disbursed: number;
  outstanding: number;
  installment: number;
  rate: number;
  period: number;
  paid: number;
  totalInstallments: number;
  nextDue?: string;
  nextMeta?: string;
  guarantors?: string[];
  reason?: string;
}

export interface Product {
  key: string;
  name: string;
  tags: string[];
  maxAmount: number;
  rate: string;
  period: string;
  fee: string;
  guarantors: string;
  disbursement: string;
  icon: string;
  popular?: boolean;
}

export interface ScheduleRow {
  no: number;
  due: string;
  loan: string;
  principal: number;
  interest: number;
  total: number;
  balance: number;
  status: 'Paid' | 'Due 4d' | 'Upcoming';
}

export interface ApplicationRequest {
  ref: string;
  product: string;
  amount: number;
  date: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed';
  stage: number;
  note: string;
  guarantors: string;
}

@Component({
  selector: 'app-loans-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./loans.html',
  styleUrls: ['./loans.scss'],
})
export class LoansComponent {
  activeTab: LoanTab = 'myLoans';
  activeModal: ModalKey | null = null;
  selectedLoan: LoanItem | null = null;
  selectedProduct: Product | null = null;
  selectedSchedule: ScheduleRow | null = null;
  loanFilter = 'all';
  productFilter = 'all';
  scheduleFilter = 'all';

  portfolio = {
    outstanding: 103_500,
    active: 2,
    pending: 1,
    cleared: 1,
    borrowingLimit: 476_000,
    available: 373_000,
    score: 92,
    nextPayment: 'Mar 1',
    nextAmount: 3200,
  };

  loans: LoanItem[] = [
    { key: 'emergency', name: 'Emergency Loan', ref: 'LN-2025-0042', status: 'active', tags: ['Active', 'Quick Loan'], disbursed: 30000, outstanding: 18500, installment: 3200, rate: 12, period: 12, paid: 4, totalInstallments: 12, nextDue: 'Mar 1', nextMeta: 'KES 3,200 • 4 days' },
    { key: 'development', name: 'Development Loan', ref: 'LN-2024-0028', status: 'active', tags: ['Active', '3 Guarantors'], disbursed: 100000, outstanding: 85000, installment: 4800, rate: 10, period: 36, paid: 5, totalInstallments: 36, nextDue: 'Mar 15', nextMeta: 'KES 4,800 • 18 days', guarantors: ['Mary Wanjiku', 'Peter Otieno', 'Lucy Achieng'] },
    { key: 'school', name: 'School Fees Loan', ref: 'LN-2025-0058', status: 'pending', tags: ['Pending Approval'], disbursed: 50000, outstanding: 50000, installment: 0, rate: 8, period: 12, paid: 0, totalInstallments: 12, reason: 'Under admin review. Guarantors confirmed (2/2). Expected decision: 3-5 business days.' },
    { key: 'personal', name: 'Personal Loan', ref: 'LN-2024-0015', status: 'cleared', tags: ['Fully Cleared'], disbursed: 20000, outstanding: 0, installment: 3600, rate: 12, period: 6, paid: 6, totalInstallments: 6, nextDue: 'Cleared Sep 2024', guarantors: ['Mary Wanjiku (KES 20K)'] },
  ];

  products: Product[] = [
    { key: 'emergency', name: 'Emergency Loan', tags: ['Quick', 'No Guarantor'], maxAmount: 50000, rate: '12% p.a.', period: '12 months', fee: '1%', guarantors: 'None required', disbursement: 'Within 24h', icon: '🚑', popular: true },
    { key: 'development', name: 'Development Loan', tags: ['Long Term', '3 Guarantors'], maxAmount: 500000, rate: '10% p.a.', period: '36 months', fee: '2%', guarantors: '3 Required', disbursement: '3-5 days', icon: '🏠' },
    { key: 'school', name: 'School Fees Loan', tags: ['Education', '2 Guarantors'], maxAmount: 100000, rate: '8% p.a.', period: '12 months', fee: '1%', guarantors: '2 Required', disbursement: 'Direct to school', icon: '🎓' },
    { key: 'salary', name: 'Salary Advance', tags: ['Instant', 'No Guarantor'], maxAmount: 30000, rate: '5% flat', period: '3 months', fee: '0.5%', guarantors: 'None', disbursement: 'Instant STK', icon: '💵' },
    { key: 'business', name: 'Business Loan', tags: ['Business', '4 Guarantors'], maxAmount: 1000000, rate: '14% p.a.', period: '48 months', fee: '2.5%', guarantors: '4 Required', disbursement: '5-7 days', icon: '💼' },
    { key: 'asset', name: 'Asset Finance', tags: ['Secured', '2 Guarantors'], maxAmount: 2000000, rate: '13% p.a.', period: '60 months', fee: '2%', guarantors: '2 Required', disbursement: 'Asset logbook', icon: '🚗' },
  ];

  schedule: ScheduleRow[] = [
    { no: 4, due: 'Feb 14', loan: 'Emergency', principal: 1688, interest: 212, total: 1900, balance: 18500, status: 'Paid' },
    { no: 5, due: 'Feb 15', loan: 'Development', principal: 3950, interest: 850, total: 4800, balance: 85000, status: 'Paid' },
    { no: 5, due: 'Mar 1', loan: 'Emergency', principal: 3015, interest: 185, total: 3200, balance: 15485, status: 'Due 4d' },
    { no: 6, due: 'Mar 15', loan: 'Development', principal: 3990, interest: 810, total: 4800, balance: 81010, status: 'Upcoming' },
    { no: 6, due: 'Apr 1', loan: 'Emergency', principal: 3045, interest: 155, total: 3200, balance: 12440, status: 'Upcoming' },
    { no: 7, due: 'Apr 15', loan: 'Development', principal: 4030, interest: 770, total: 4800, balance: 76980, status: 'Upcoming' },
  ];

  guarantorRequests = [
    { member: 'Mary Wanjiku', amount: 20000, loan: 'Personal Loan', status: 'Active Guarantee' },
    { member: 'You are guaranteeing Peter Otieno', amount: 45000, loan: 'Business Loan', status: 'Pending acceptance' },
  ];

  documents = [
    { name: 'National ID', status: 'Verified' },
    { name: 'Payslip', status: 'Required for Salary Advance' },
    { name: 'Business Permit', status: 'Required for Business Loan' },
    { name: 'Collateral Logbook', status: 'Required for Asset Finance' },
  ];

  applicationRequests: ApplicationRequest[] = [
    { ref: 'LN-2025-0058', product: 'School Fees Loan', amount: 50000, date: 'Feb 24, 2025', status: 'Under Review', stage: 4, note: 'Guarantors confirmed. Waiting for loan committee decision.', guarantors: '2/2 accepted' },
    { ref: 'LN-2025-0042', product: 'Emergency Loan', amount: 30000, date: 'Feb 10, 2025', status: 'Disbursed', stage: 5, note: 'Approved and disbursed to M-Pesa within 24 hours.', guarantors: 'Not required' },
    { ref: 'LN-2024-0028', product: 'Development Loan', amount: 100000, date: 'Oct 04, 2024', status: 'Approved', stage: 5, note: 'Approved with 3 guarantors. Active repayment schedule running.', guarantors: '3/3 accepted' },
    { ref: 'LN-2024-0091', product: 'Business Loan', amount: 250000, date: 'Aug 18, 2024', status: 'Rejected', stage: 3, note: 'Rejected because collateral valuation was below required cover.', guarantors: '2/4 accepted' },
  ];

  applicationSteps = ['Submitted', 'Guarantors', 'Documents', 'Admin Review', 'Decision'];

  calculator = { amount: 50000, period: 12, interest: 12 };
  application = { product: 'emergency', amount: 50000, period: 12, purpose: '', guarantor1: '', guarantor2: '', notes: '', agree: false };
  payment = { amount: 3200, method: 'mpesa', phone: '+254 712345890' };
  restructure = { reason: '', newPeriod: 24, requestedInstallment: 2500 };
  autoPay = { enabled: true, amount: 3200, day: '1st', phone: '+254 712345890' };
  supportForm = { subject: 'Loan support', message: '' };

  toast: { message: string; type: 'success' | 'info' | 'warning' } | null = null;
  private toastTimer: any;

  get filteredLoans(): LoanItem[] { return this.loanFilter === 'all' ? this.loans : this.loans.filter(l => l.status === this.loanFilter); }
  get filteredProducts(): Product[] {
    if (this.productFilter === 'all') return this.products;
    if (this.productFilter === 'quick') return this.products.filter(p => p.tags.includes('Quick') || p.tags.includes('Instant'));
    if (this.productFilter === 'guarantor') return this.products.filter(p => !p.tags.includes('No Guarantor'));
    return this.products.filter(p => p.tags.includes('No Guarantor'));
  }
  get filteredSchedule(): ScheduleRow[] { return this.scheduleFilter === 'all' ? this.schedule : this.schedule.filter(s => s.loan.toLowerCase() === this.scheduleFilter); }
  get latestApplication(): ApplicationRequest { return this.applicationRequests[0]; }
  get monthlyPayment(): number { return Math.round(this.calculator.amount / this.calculator.period + (this.calculator.amount * this.calculator.interest / 100) / 12); }
  get totalInterest(): number { return Math.round((this.calculator.amount * this.calculator.interest / 100) * (this.calculator.period / 12)); }
  get totalPayable(): number { return this.calculator.amount + this.totalInterest; }
  get processingFee(): number { return Math.round(this.calculator.amount * 0.01); }

  setTab(tab: LoanTab): void { this.activeTab = tab; }
  openModal(key: ModalKey): void { this.activeModal = key; document.body.style.overflow = 'hidden'; }
  closeModal(): void { this.activeModal = null; document.body.style.overflow = ''; }
  openLoanDetail(loan: LoanItem): void { this.selectedLoan = loan; this.openModal(loan.status === 'pending' ? 'applicationTracker' : 'loanDetail'); }
  openProductDetail(product: Product): void { this.selectedProduct = product; this.application.product = product.key; this.openModal('productDetail'); }
  openSchedule(row: ScheduleRow): void { this.selectedSchedule = row; this.openModal('repaymentDetail'); }

  submitApplication(): void {
    if (!this.application.amount || !this.application.purpose || !this.application.agree) { this.showToast('Complete the application and accept terms.', 'warning'); return; }
    this.closeModal(); this.showToast('Loan application submitted.', 'success');
  }
  submitPayment(): void { this.closeModal(); this.showToast('Loan payment initiated.', 'success'); }
  cancelApplication(): void { this.closeModal(); this.showToast('Application cancelled.', 'info'); }
  submitSupport(): void { this.closeModal(); this.showToast('Support ticket submitted.', 'info'); }
  downloadClearance(): void { this.showToast('Clearance certificate downloaded.', 'success'); }
  saveRestructure(): void { this.closeModal(); this.showToast('Restructure request submitted.', 'success'); }
  saveAutoPay(): void { this.closeModal(); this.showToast('Auto-pay settings saved.', 'success'); }
  uploadDocuments(): void { this.closeModal(); this.showToast('Documents uploaded.', 'success'); }
  exportSchedule(): void { this.closeModal(); this.showToast('Schedule export is being prepared.', 'info'); }

  showToast(message: string, type: 'success' | 'info' | 'warning' = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast = null, 3200);
  }
  dismissToast(): void { this.toast = null; }
  fmt(n: number): string { return n.toLocaleString(); }
  progress(loan: LoanItem): number { return loan.totalInstallments ? Math.round((loan.paid / loan.totalInstallments) * 100) : 0; }
}