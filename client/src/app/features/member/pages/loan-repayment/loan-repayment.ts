import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Loan {
  id: string;
  name: string;
  outstanding: number;
  installment: number;
  dueDate: string;
  daysUntilDue: number;
}

interface Payment {
  date: string;
  loan: string;
  amount: number;
  source: string;
  status: string;
  reference: string;
}

interface PaymentSource {
  id: string;
  name: string;
  balance?: number;
  description: string;
  icon: string;
}

interface AutoPayment {
  loan: string;
  date: string;
  amount: number;
  daysUntilDue: number;
}

@Component({
  selector: 'app-loan-repayments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-repayment.html',
  styleUrls: ['./loan-repayment.scss']
})
export class LoanRepaymentsComponent {
  // Balances
  totalOutstanding = signal(103500);
  walletBalance = signal(12450);
  nwaBalance = signal(35000);
  overdraftAvailable = signal(21000);
  nextDueDate = signal('Mar 1');
  nextDueDays = signal(4);
  dueThisMonth = signal(8000);

  // Auto-Pay
  autoPayActive = signal(true);
  autoPaySource = signal('SaccoPay Wallet');
  autoPayFrequency = signal('Monthly (on due date)');
  autoPayFallback = signal('M-Pesa STK Push');
  nextAutoDeduction = signal({ date: 'Mar 1', amount: 3200 });

  // Loans
  loans = signal<Loan[]>([
    {
      id: 'emergency',
      name: 'Emergency Loan',
      outstanding: 18500,
      installment: 3200,
      dueDate: 'Mar 1',
      daysUntilDue: 4
    },
    {
      id: 'development',
      name: 'Development Loan',
      outstanding: 85000,
      installment: 4800,
      dueDate: 'Mar 15',
      daysUntilDue: 18
    }
  ]);

  // Auto Payments
  upcomingAutoPayments = signal<AutoPayment[]>([
    { loan: 'Emergency Loan', date: 'Mar 1', amount: 3200, daysUntilDue: 4 },
    { loan: 'Development Loan', date: 'Mar 15', amount: 4800, daysUntilDue: 18 }
  ]);

  // Payment Sources
  paymentSources = signal<PaymentSource[]>([
    { id: 'wallet', name: 'Wallet', balance: 12450, description: 'KES 12,450', icon: 'bi-wallet2' },
    { id: 'mpesa', name: 'M-Pesa', description: 'STK Push', icon: 'bi-phone' },
    { id: 'card', name: 'Card', description: 'Visa/MC', icon: 'bi-credit-card' },
    { id: 'airtel', name: 'Airtel', description: 'STK Push', icon: 'bi-phone' }
  ]);

  // Payment History
  paymentHistory = signal<Payment[]>([
    {
      date: 'Feb 15, 2025',
      loan: 'Development',
      amount: 4800,
      source: 'Wallet',
      status: 'Paid',
      reference: 'PAY-2025-0089'
    },
    {
      date: 'Feb 14, 2025',
      loan: 'Emergency',
      amount: 3200,
      source: 'M-Pesa',
      status: 'Paid',
      reference: 'PAY-2025-0088'
    },
    {
      date: 'Jan 15, 2025',
      loan: 'Development',
      amount: 4800,
      source: 'Card',
      status: 'Paid',
      reference: 'PAY-2025-0067'
    }
  ]);

  // Full Payment History for Modal
  fullPaymentHistory = signal<Payment[]>([
    {
      date: 'Feb 15',
      loan: 'Development',
      amount: 4800,
      source: 'Wallet',
      status: 'Paid',
      reference: 'PAY-2025-0089'
    },
    {
      date: 'Feb 14',
      loan: 'Emergency',
      amount: 3200,
      source: 'M-Pesa',
      status: 'Paid',
      reference: 'PAY-2025-0088'
    },
    {
      date: 'Jan 15',
      loan: 'Development',
      amount: 4800,
      source: 'Card',
      status: 'Paid',
      reference: 'PAY-2025-0067'
    },
    {
      date: 'Jan 1',
      loan: 'Emergency',
      amount: 3200,
      source: 'Wallet',
      status: 'Paid',
      reference: 'PAY-2025-0045'
    },
    {
      date: 'Dec 15',
      loan: 'Development',
      amount: 4800,
      source: 'M-Pesa',
      status: 'Paid',
      reference: 'PAY-2024-0890'
    }
  ]);

  // Notifications
  notifications = signal([
    {
      title: 'Payment Due Soon',
      message: 'Emergency Loan • KES 3,200 • Mar 1',
      type: 'warning'
    },
    {
      title: 'Auto-Pay Completed',
      message: 'Dev Loan • KES 4,800 from Wallet • Feb 15',
      type: 'success'
    }
  ]);

  // Modal States
  showPayNowModal = signal(false);
  showProcessingModal = signal(false);
  showSuccessModal = signal(false);
  showAutoPaySetupModal = signal(false);
  showHistoryModal = signal(false);
  showNotifModal = signal(false);
  showLogoutModal = signal(false);

  // Pay Now Form
  selectedLoan = signal<string | null>(null);
  paymentAmount = signal<number | null>(null);
  selectedPaymentSource = signal<string>('wallet');
  phoneNumber = signal('');
  cardNumber = signal('');

  // Auto-Pay Setup
  autoPayPrimarySource = signal('wallet');
  autoPayFallbackSource = signal('mpesa');
  autoPaySmsConfirmation = signal(true);
  autoPayReminder = signal(true);
  autoPayEmergencyLoan = signal(true);
  autoPayDevelopmentLoan = signal(true);

  // Success Modal Data
  successData = signal({
    amount: 0,
    loan: '',
    reference: '',
    source: '',
    newBalance: 0
  });

  // Processing Message
  processingMessage = signal('Processing payment...');

  // Toast
  toastMessage = signal('');
  toastType = signal('info');
  showToast = signal(false);

  // Methods
  openPayNow(loanId: string): void {
    this.selectedLoan.set(loanId);
    const loan = this.loans().find(l => l.id === loanId);
    if (loan) {
      this.paymentAmount.set(loan.installment);
    }
    this.showPayNowModal.set(true);
  }

  closePayNowModal(): void {
    this.showPayNowModal.set(false);
    this.resetPayNowForm();
  }

  selectLoan(loanId: string): void {
    this.selectedLoan.set(loanId);
    const loan = this.loans().find(l => l.id === loanId);
    if (loan) {
      this.paymentAmount.set(loan.installment);
    }
  }

  selectPaymentSource(sourceId: string): void {
    this.selectedPaymentSource.set(sourceId);
  }

  getPaymentSourceDetails(): string {
    const source = this.selectedPaymentSource();
    switch (source) {
      case 'wallet':
        return `Payment will be deducted from your SaccoPay Wallet (Balance: KES ${this.walletBalance().toLocaleString()}). If insufficient, the remaining will be charged via your fallback method.`;
      case 'mpesa':
      case 'airtel':
        return 'Enter your phone number to receive the STK push notification.';
      case 'card':
        return 'Enter your card details to complete the payment.';
      default:
        return '';
    }
  }

  needsPhoneInput(): boolean {
    const source = this.selectedPaymentSource();
    return source === 'mpesa' || source === 'airtel';
  }

  needsCardInput(): boolean {
    return this.selectedPaymentSource() === 'card';
  }

  submitPayment(): void {
    if (!this.selectedLoan() || !this.paymentAmount()) {
      this.displayToast('Please select a loan and enter an amount', 'error');
      return;
    }

    const loan = this.loans().find(l => l.id === this.selectedLoan());
    if (!loan) return;

    const amount = this.paymentAmount()!;
    const source = this.paymentSources().find(s => s.id === this.selectedPaymentSource());

    this.showPayNowModal.set(false);
    this.showProcessingModal.set(true);
    this.processingMessage.set(`Deducting from your ${source?.name}...`);

    // Simulate payment processing
    setTimeout(() => {
      this.showProcessingModal.set(false);
      
      // Update success data
      const newOutstanding = loan.outstanding - amount;
      this.successData.set({
        amount: amount,
        loan: loan.name,
        reference: `PAY-2025-00${Math.floor(Math.random() * 1000)}`,
        source: source?.name || '',
        newBalance: newOutstanding
      });

      // Update loan outstanding
      const updatedLoans = this.loans().map(l => 
        l.id === this.selectedLoan() 
          ? { ...l, outstanding: newOutstanding }
          : l
      );
      this.loans.set(updatedLoans);

      // Update total outstanding
      const newTotal = this.totalOutstanding() - amount;
      this.totalOutstanding.set(newTotal);

      // Show success modal
      this.showSuccessModal.set(true);

      // Reset form
      this.resetPayNowForm();
    }, 2000);
  }

  resetPayNowForm(): void {
    this.selectedLoan.set(null);
    this.paymentAmount.set(null);
    this.selectedPaymentSource.set('wallet');
    this.phoneNumber.set('');
    this.cardNumber.set('');
  }

  closeSuccessModal(): void {
    this.showSuccessModal.set(false);
  }

  openAutoPaySetup(): void {
    this.showAutoPaySetupModal.set(true);
  }

  closeAutoPaySetup(): void {
    this.showAutoPaySetupModal.set(false);
  }

  saveAutoPaySetup(): void {
    this.autoPayActive.set(true);
    const primarySource = this.paymentSources().find(s => s.id === this.autoPayPrimarySource());
    const fallbackSource = this.paymentSources().find(s => s.id === this.autoPayFallbackSource());
    
    this.autoPaySource.set(primarySource?.name || '');
    this.autoPayFallback.set(fallbackSource?.name || '');
    
    this.displayToast('Auto-Pay setup saved successfully!', 'success');
    this.closeAutoPaySetup();
  }

  toggleAutoPay(): void {
    this.autoPayActive.update(active => !active);
    const message = this.autoPayActive() 
      ? 'Auto-Pay activated successfully!' 
      : 'Auto-Pay deactivated';
    this.displayToast(message, 'info');
  }

  openHistoryModal(): void {
    this.showHistoryModal.set(true);
  }

  closeHistoryModal(): void {
    this.showHistoryModal.set(false);
  }

  openNotifications(): void {
    this.showNotifModal.set(true);
  }

  closeNotifications(): void {
    this.showNotifModal.set(false);
  }

  showNotification(notif: any): void {
    this.displayToast(notif.message, notif.type);
    this.closeNotifications();
  }

  displayToast(message: string, type: string = 'info'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }

  showPaymentDetails(payment: Payment): void {
    this.displayToast(
      `Payment ${payment.reference} - KES ${payment.amount.toLocaleString()} for ${payment.loan} via ${payment.source}`,
      'info'
    );
  }

  showAutoPaymentDetails(payment: AutoPayment): void {
    this.displayToast(
      `${payment.loan}: KES ${payment.amount.toLocaleString()} auto-deduction on ${payment.date}`,
      'info'
    );
  }

  openLogoutModal(): void {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal(): void {
    this.showLogoutModal.set(false);
  }

  logout(): void {
    this.displayToast('Logging out...', 'info');
    // Implement logout logic
  }

  getSourceIcon(source: string): string {
    switch (source.toLowerCase()) {
      case 'wallet':
        return 'bi-wallet2';
      case 'm-pesa':
      case 'mpesa':
        return 'bi-phone';
      case 'card':
        return 'bi-credit-card';
      case 'airtel':
        return 'bi-phone';
      default:
        return 'bi-cash';
    }
  }

  getTotalPaid(): number {
    return this.fullPaymentHistory().reduce((sum, payment) => sum + payment.amount, 0);
  }
}
