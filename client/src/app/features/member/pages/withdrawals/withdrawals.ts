import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ============================================
// INTERFACES
// ============================================
interface WithdrawalSummary {
  availableBalance: number;
  withdrawnThisYear: number;
  withdrawalCountThisYear: number;
  lastWithdrawalAmount: number;
  lastWithdrawalDate: Date;
  lastWithdrawalMethod: string;
  totalWithdrawnAllTime: number;
  avgWithdrawal: number;
  totalFeesPaid: number;
}

interface Withdrawal {
  id: string;
  reference: string;
  amount: number;
  fee: number;
  account: string;
  method: 'mpesa' | 'bank' | 'wallet';
  methodDetails: string;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  reason: string;
  rejectionReason?: string;
  submittedDate: Date;
  approvedDate?: Date;
  completedDate?: Date;
  estimatedCompletion?: Date;
  currentStep: number;
  totalSteps: number;
  noticePeriodDays?: number;
  noticePeriodRemaining?: number;
}

interface WithdrawalRules {
  noticePeriod: number;
  minAmount: number;
  maxPerMonth: number;
  processingFee: number;
  disbursementMethods: string[];
  policyText: string;
}

interface SavingsAccount {
  id: string;
  name: string;
  balance: number;
  availableBalance: number;
  lockedAmount: number;
  type: 'ordinary' | 'education' | 'holiday' | 'emergency';
}

interface DisbursementMethod {
  id: string;
  type: 'mpesa' | 'bank';
  name: string;
  details: string;
  isDefault: boolean;
  verified: boolean;
}

interface ImpactCalculation {
  currentSavings: number;
  withdrawalAmount: number;
  remainingSavings: number;
  currentLoanEligibility: number;
  newLoanEligibility: number;
  eligibilityChange: number;
  currentDividendEstimate: number;
  newDividendEstimate: number;
  dividendImpact: number;
}

interface Toast {
  type: 'success' | 'warning' | 'danger' | 'info' | 'primary';
  title: string;
  message: string;
  icon: string;
  iconColor: string;
}

// ============================================
// TYPE ALIAS (must be outside class, before decorator)
// ============================================
export type WithdrawalMethod = 'mpesa' | 'bank' | 'wallet';

// ============================================
// FINANCE WITHDRAWALS COMPONENT — Angular v21 Standalone
// ============================================
@Component({
  selector: 'app-finance-withdrawals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './withdrawals.html',
  styleUrls: ['./withdrawals.scss']
})
export class FinanceWithdrawalsComponent implements OnInit {
  // Summary Data
  summary: WithdrawalSummary = {
    availableBalance: 123750,
    withdrawnThisYear: 25000,
    withdrawalCountThisYear: 2,
    lastWithdrawalAmount: 10000,
    lastWithdrawalDate: new Date('2025-01-15'),
    lastWithdrawalMethod: 'M-Pesa',
    totalWithdrawnAllTime: 85000,
    avgWithdrawal: 12143,
    totalFeesPaid: 350
  };

  // Withdrawal Rules
  rules: WithdrawalRules = {
    noticePeriod: 14,
    minAmount: 1000,
    maxPerMonth: 100000,
    processingFee: 50,
    disbursementMethods: ['M-Pesa', 'Bank EFT'],
    policyText: `Withdrawal Policy:
    
1. Notice Period: All withdrawal requests require a 14-day notice period before processing.

2. Minimum Amount: The minimum withdrawal amount is KES 1,000.

3. Maximum Limit: Maximum withdrawal per month is KES 100,000. Amounts exceeding this require special approval.

4. Processing Fee: A flat fee of KES 50 is charged per withdrawal.

5. Loan Collateral: Members with active loans may have restricted withdrawal amounts based on collateral requirements.

6. Disbursement: Funds are disbursed via M-Pesa (instant after approval) or Bank EFT (1-2 business days).

7. Working Days: Withdrawals are processed on business days only (Monday-Friday, excluding public holidays).

8. Emergency Withdrawals: Emergency withdrawals may be requested with reduced notice period subject to admin approval and additional fees.

For any questions, please contact the SACCO office.`
  };

  // Savings Accounts
  savingsAccounts: SavingsAccount[] = [
    {
      id: 'SA-001',
      name: 'Ordinary Savings',
      balance: 158750,
      availableBalance: 123750,
      lockedAmount: 35000,
      type: 'ordinary'
    },
    {
      id: 'SA-002',
      name: 'Education Savings',
      balance: 25000,
      availableBalance: 25000,
      lockedAmount: 0,
      type: 'education'
    },
    {
      id: 'SA-003',
      name: 'Holiday Savings',
      balance: 15000,
      availableBalance: 15000,
      lockedAmount: 0,
      type: 'holiday'
    }
  ];

  // Disbursement Methods
  disbursementMethods: DisbursementMethod[] = [
    {
      id: 'DM-001',
      type: 'mpesa',
      name: 'M-Pesa',
      details: '0712****78 - JOHN KAMAU',
      isDefault: true,
      verified: true
    },
    {
      id: 'DM-002',
      type: 'bank',
      name: 'Equity Bank',
      details: '****9012 - Westlands',
      isDefault: false,
      verified: true
    }
  ];

  // Withdrawals List
  withdrawals: Withdrawal[] = [
    {
      id: 'WDR-2025-0045',
      reference: 'WDR-2025-0045',
      amount: 20000,
      fee: 50,
      account: 'Ordinary',
      method: 'mpesa',
      methodDetails: '0712****78',
      status: 'pending',
      reason: 'School Fees',
      submittedDate: new Date('2025-02-25'),
      estimatedCompletion: new Date('2025-03-11'),
      currentStep: 2,
      totalSteps: 4,
      noticePeriodDays: 14,
      noticePeriodRemaining: 8
    },
    {
      id: 'WDR-2025-0031',
      reference: 'WDR-2025-0031',
      amount: 10000,
      fee: 50,
      account: 'Ordinary',
      method: 'mpesa',
      methodDetails: '0712****78',
      status: 'completed',
      reason: 'Personal',
      submittedDate: new Date('2025-01-15'),
      approvedDate: new Date('2025-01-28'),
      completedDate: new Date('2025-01-29'),
      currentStep: 4,
      totalSteps: 4
    },
    {
      id: 'WDR-2024-0089',
      reference: 'WDR-2024-0089',
      amount: 50000,
      fee: 0,
      account: 'Ordinary',
      method: 'bank',
      methodDetails: '****9012',
      status: 'rejected',
      reason: 'Investment',
      rejectionReason: 'Amount exceeds available balance after loan collateral deductions.',
      submittedDate: new Date('2024-12-10'),
      currentStep: 0,
      totalSteps: 4
    },
    {
      id: 'WDR-2024-0072',
      reference: 'WDR-2024-0072',
      amount: 5000,
      fee: 50,
      account: 'Education',
      method: 'bank',
      methodDetails: '****9012',
      status: 'completed',
      reason: 'School Fees',
      submittedDate: new Date('2024-11-20'),
      approvedDate: new Date('2024-12-03'),
      completedDate: new Date('2024-12-05'),
      currentStep: 4,
      totalSteps: 4
    },
    {
      id: 'WDR-2024-0058',
      reference: 'WDR-2024-0058',
      amount: 15000,
      fee: 50,
      account: 'Ordinary',
      method: 'mpesa',
      methodDetails: '0712****78',
      status: 'completed',
      reason: 'Medical',
      submittedDate: new Date('2024-10-05'),
      completedDate: new Date('2024-10-20'),
      currentStep: 4,
      totalSteps: 4
    },
    {
      id: 'WDR-2024-0042',
      reference: 'WDR-2024-0042',
      amount: 8000,
      fee: 50,
      account: 'Ordinary',
      method: 'mpesa',
      methodDetails: '0712****78',
      status: 'completed',
      reason: 'Personal',
      submittedDate: new Date('2024-08-15'),
      completedDate: new Date('2024-08-30'),
      currentStep: 4,
      totalSteps: 4
    },
    {
      id: 'WDR-2024-0025',
      reference: 'WDR-2024-0025',
      amount: 12000,
      fee: 50,
      account: 'Holiday',
      method: 'bank',
      methodDetails: '****9012',
      status: 'completed',
      reason: 'Holiday',
      submittedDate: new Date('2024-06-01'),
      completedDate: new Date('2024-06-15'),
      currentStep: 4,
      totalSteps: 4
    }
  ];

  // Filter States
  statusFilter: 'all' | 'pending' | 'completed' | 'rejected' = 'all';
  historyLimit = 4;

  // Modal States
  newWithdrawalModalOpen = false;
  withdrawalDetailModalOpen = false;
  policyModalOpen = false;
  calculatorModalOpen = false;
  cancelWithdrawalModalOpen = false;
  trackingModalOpen = false;
  resubmitModalOpen = false;

  // Selected Withdrawal
  selectedWithdrawal: Withdrawal | null = null;

  // New Withdrawal Form — properly typed
  newWithdrawalData: {
    account: string;
    amount: number;
    method: WithdrawalMethod;
    methodId: string;
    reason: string;
    customReason: string;
    agreeToTerms: boolean;
    agreeToFee: boolean;
  } = {
    account: '',
    amount: 0,
    method: 'mpesa',
    methodId: '',
    reason: '',
    customReason: '',
    agreeToTerms: false,
    agreeToFee: false
  };

  // Calculator Data
  calcData = {
    amount: 0
  };
  calcResult: ImpactCalculation | null = null;

  // Toasts
  toasts: Toast[] = [];

  // Computed Properties
  get filteredWithdrawals(): Withdrawal[] {
    if (this.statusFilter === 'all') return this.withdrawals;
    return this.withdrawals.filter(w => w.status === this.statusFilter);
  }

  get displayedWithdrawals(): Withdrawal[] {
    return this.filteredWithdrawals.slice(0, this.historyLimit);
  }

  get pendingWithdrawals(): Withdrawal[] {
    return this.withdrawals.filter(w => w.status === 'pending' || w.status === 'approved' || w.status === 'processing');
  }

  get completedWithdrawals(): Withdrawal[] {
    return this.withdrawals.filter(w => w.status === 'completed');
  }

  get rejectedWithdrawals(): Withdrawal[] {
    return this.withdrawals.filter(w => w.status === 'rejected');
  }

  get mpesaWithdrawalsCount(): number {
    return this.withdrawals.filter(w => w.method === 'mpesa' && w.status === 'completed').length;
  }

  get bankWithdrawalsCount(): number {
    return this.withdrawals.filter(w => w.method === 'bank' && w.status === 'completed').length;
  }

  get totalCompletedCount(): number {
    return this.mpesaWithdrawalsCount + this.bankWithdrawalsCount;
  }

  get mpesaPercentage(): number {
    if (this.totalCompletedCount === 0) return 0;
    return Math.round((this.mpesaWithdrawalsCount / this.totalCompletedCount) * 100);
  }

  get bankPercentage(): number {
    if (this.totalCompletedCount === 0) return 0;
    return Math.round((this.bankWithdrawalsCount / this.totalCompletedCount) * 100);
  }

  get selectedAccount(): SavingsAccount | null {
    return this.savingsAccounts.find(a => a.id === this.newWithdrawalData.account) ?? null;
  }

  get selectedMethod(): DisbursementMethod | null {
    return this.disbursementMethods.find(m => m.id === this.newWithdrawalData.methodId) ?? null;
  }

  get canSubmitWithdrawal(): boolean {
    return !!(
      this.newWithdrawalData.account &&
      this.newWithdrawalData.amount >= this.rules.minAmount &&
      this.newWithdrawalData.amount <= (this.selectedAccount?.availableBalance ?? 0) &&
      this.newWithdrawalData.methodId &&
      (this.newWithdrawalData.reason || this.newWithdrawalData.customReason) &&
      this.newWithdrawalData.agreeToTerms &&
      this.newWithdrawalData.agreeToFee
    );
  }

  ngOnInit(): void {
    // Initialize component
  }

  // ============================================
  // FILTER METHODS
  // ============================================
  setStatusFilter(filter: typeof this.statusFilter): void {
    this.statusFilter = filter;
  }

  showAllHistory(): void {
    this.historyLimit = this.filteredWithdrawals.length;
  }

  // ============================================
  // NEW WITHDRAWAL MODAL
  // ============================================
  openNewWithdrawalModal(): void {
    this.newWithdrawalData = {
      account: this.savingsAccounts[0]?.id ?? '',
      amount: 0,
      method: 'mpesa',
      methodId: this.disbursementMethods.find(m => m.isDefault)?.id ?? '',
      reason: '',
      customReason: '',
      agreeToTerms: false,
      agreeToFee: false
    };
    this.newWithdrawalModalOpen = true;
  }

  closeNewWithdrawalModal(): void {
    this.newWithdrawalModalOpen = false;
  }

  setWithdrawalMethod(type: 'mpesa' | 'bank'): void {
    this.newWithdrawalData.method = type;
    const defaultMethod = this.disbursementMethods.find(m => m.type === type);
    this.newWithdrawalData.methodId = defaultMethod?.id ?? '';
  }

  setMaxAmount(): void {
    if (this.selectedAccount) {
      this.newWithdrawalData.amount = Math.min(
        this.selectedAccount.availableBalance,
        this.rules.maxPerMonth
      );
    }
  }

  submitWithdrawal(): void {
    if (!this.canSubmitWithdrawal) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }

    const newWithdrawal: Withdrawal = {
      id: `WDR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      reference: `WDR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      amount: this.newWithdrawalData.amount,
      fee: this.rules.processingFee,
      account: this.selectedAccount?.name ?? 'Ordinary',
      method: this.newWithdrawalData.method,
      methodDetails: this.selectedMethod?.details ?? '',
      status: 'pending',
      reason: this.newWithdrawalData.reason || this.newWithdrawalData.customReason,
      submittedDate: new Date(),
      estimatedCompletion: new Date(Date.now() + this.rules.noticePeriod * 24 * 60 * 60 * 1000),
      currentStep: 1,
      totalSteps: 4,
      noticePeriodDays: this.rules.noticePeriod,
      noticePeriodRemaining: this.rules.noticePeriod
    };

    this.withdrawals.unshift(newWithdrawal);
    this.summary.availableBalance -= newWithdrawal.amount;

    this.showToast('Withdrawal request submitted successfully!', 'success');
    this.closeNewWithdrawalModal();
  }

  // ============================================
  // WITHDRAWAL DETAIL MODAL
  // ============================================
  openWithdrawalDetail(withdrawal: Withdrawal): void {
    this.selectedWithdrawal = withdrawal;
    this.withdrawalDetailModalOpen = true;
  }

  closeWithdrawalDetailModal(): void {
    this.withdrawalDetailModalOpen = false;
    this.selectedWithdrawal = null;
  }

  // ============================================
  // TRACKING MODAL
  // ============================================
  openTrackingModal(withdrawal: Withdrawal): void {
    this.selectedWithdrawal = withdrawal;
    this.trackingModalOpen = true;
  }

  closeTrackingModal(): void {
    this.trackingModalOpen = false;
  }

  // ============================================
  // CANCEL WITHDRAWAL MODAL
  // ============================================
  openCancelWithdrawalModal(withdrawal: Withdrawal): void {
    this.selectedWithdrawal = withdrawal;
    this.cancelWithdrawalModalOpen = true;
  }

  closeCancelWithdrawalModal(): void {
    this.cancelWithdrawalModalOpen = false;
  }

  confirmCancelWithdrawal(): void {
    if (this.selectedWithdrawal) {
      this.selectedWithdrawal.status = 'cancelled';
      this.summary.availableBalance += this.selectedWithdrawal.amount;
      this.showToast('Withdrawal request cancelled', 'success');
    }
    this.closeCancelWithdrawalModal();
    this.closeWithdrawalDetailModal();
  }

  // ============================================
  // RESUBMIT MODAL
  // ============================================
  openResubmitModal(withdrawal: Withdrawal): void {
    this.selectedWithdrawal = withdrawal;
    this.resubmitModalOpen = true;
  }

  closeResubmitModal(): void {
    this.resubmitModalOpen = false;
  }

  // ============================================
  // POLICY MODAL
  // ============================================
  openPolicyModal(): void {
    this.policyModalOpen = true;
  }

  closePolicyModal(): void {
    this.policyModalOpen = false;
  }

  // ============================================
  // CALCULATOR MODAL
  // ============================================
  openCalculatorModal(): void {
    this.calcData = { amount: 0 };
    this.calcResult = null;
    this.calculatorModalOpen = true;
  }

  closeCalculatorModal(): void {
    this.calculatorModalOpen = false;
  }

  calculateImpact(): void {
    const currentSavings = this.summary.availableBalance;
    const withdrawalAmount = this.calcData.amount;
    const remainingSavings = currentSavings - withdrawalAmount;
    
    // Loan eligibility is typically 3x savings
    const currentLoanEligibility = currentSavings * 3;
    const newLoanEligibility = Math.max(0, remainingSavings * 3);
    
    // Dividend estimate (assuming 10% annual dividend rate)
    const currentDividendEstimate = currentSavings * 0.10;
    const newDividendEstimate = Math.max(0, remainingSavings * 0.10);

    this.calcResult = {
      currentSavings,
      withdrawalAmount,
      remainingSavings,
      currentLoanEligibility,
      newLoanEligibility,
      eligibilityChange: newLoanEligibility - currentLoanEligibility,
      currentDividendEstimate,
      newDividendEstimate,
      dividendImpact: newDividendEstimate - currentDividendEstimate
    };
  }

  // ============================================
  // UTILITY METHODS
  // ============================================
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'var(--ylw)',
      approved: 'var(--blu)',
      processing: 'var(--pri)',
      completed: 'var(--grn)',
      rejected: 'var(--red)',
      cancelled: 'var(--txm)'
    };
    return colors[status] ?? 'var(--txm)';
  }

  getStatusBg(status: string): string {
    const colors: Record<string, string> = {
      pending: 'rgba(249,168,37,0.08)',
      approved: 'rgba(2,136,209,0.06)',
      processing: 'rgba(26,115,232,0.06)',
      completed: 'rgba(0,200,83,0.08)',
      rejected: 'rgba(229,57,53,0.06)',
      cancelled: 'rgba(139,143,163,0.08)'
    };
    return colors[status] ?? 'rgba(139,143,163,0.08)';
  }

  getStatusBorder(status: string): string {
    const colors: Record<string, string> = {
      pending: 'rgba(249,168,37,0.18)',
      approved: 'rgba(2,136,209,0.18)',
      processing: 'rgba(26,115,232,0.2)',
      completed: 'rgba(0,200,83,0.2)',
      rejected: 'rgba(229,57,53,0.18)',
      cancelled: 'rgba(139,143,163,0.15)'
    };
    return colors[status] ?? 'rgba(139,143,163,0.15)';
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      pending: 'fa-clock',
      approved: 'fa-check',
      processing: 'fa-spinner',
      completed: 'fa-check-circle',
      rejected: 'fa-times-circle',
      cancelled: 'fa-ban'
    };
    return icons[status] ?? 'fa-circle';
  }

  getMethodIcon(method: string): string {
    return method === 'mpesa' ? 'fa-mobile-alt' : 'fa-university';
  }

  getMethodColor(method: string): string {
    return method === 'mpesa' ? 'var(--grn)' : 'var(--blu)';
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString();
  }

  getNoticePeriodProgress(withdrawal: Withdrawal): number {
    if (!withdrawal.noticePeriodDays || !withdrawal.noticePeriodRemaining) return 100;
    const elapsed = withdrawal.noticePeriodDays - withdrawal.noticePeriodRemaining;
    return Math.round((elapsed / withdrawal.noticePeriodDays) * 100);
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

  downloadReceipt(withdrawal: Withdrawal): void {
    this.showToast(`Downloading receipt for ${withdrawal.reference}...`, 'info');
  }

  exportHistory(): void {
    this.showToast('Exporting withdrawal history...', 'info');
  }
}