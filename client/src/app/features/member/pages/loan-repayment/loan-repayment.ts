import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ModalName =
  | 'pay'
  | 'processing'
  | 'success'
  | 'autopay'
  | 'overdraft'
  | 'history'
  | 'receipt'
  | 'notifications'
  | 'logout'
  | null;

interface LoanOption {
  id: 'emergency' | 'development';
  name: string;
  shortName: string;
  tone: 'red' | 'blue';
  outstanding: number;
  installment: number;
  dueDate: string;
  dueMeta: string;
}

interface PaymentSource {
  id: 'wallet' | 'mpesa' | 'card' | 'airtel' | 'overdraft';
  label: string;
  description: string;
  balance?: number;
  tone: 'blue' | 'green' | 'purple' | 'red';
}

interface PaymentRecord {
  date: string;
  shortDate: string;
  ref: string;
  loan: string;
  loanTone: 'red' | 'blue';
  amount: number;
  source: string;
  sourceId: PaymentSource['id'];
  status: 'Paid';
}

@Component({
  selector: 'app-loan-repayment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./loan-repayment.html',
  styleUrl: './loan-repayment.scss',
})
export class LoanRepaymentsComponent {
  activeModal: ModalName = null;
  selectedLoanId: LoanOption['id'] = 'emergency';
  selectedSourceId: PaymentSource['id'] = 'wallet';
  paymentAmount = 3200;
  successPayment = {
    amount: 3200,
    loan: 'Emergency Loan',
    ref: 'PAY-2025-0090',
    source: 'SaccoPay Wallet',
    newOutstanding: 15300,
  };
  selectedReceipt: PaymentRecord | null = null;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null = null;

  autoPay = {
    primarySource: 'wallet',
    fallbackSource: 'mpesa',
    emergency: true,
    development: true,
    sms: true,
    reminder: true,
  };

  readonly loans: LoanOption[] = [
    {
      id: 'emergency',
      name: 'Emergency Loan',
      shortName: 'Emergency',
      tone: 'red',
      outstanding: 18500,
      installment: 3200,
      dueDate: 'Mar 1',
      dueMeta: 'Due Mar 1',
    },
    {
      id: 'development',
      name: 'Development Loan',
      shortName: 'Development',
      tone: 'blue',
      outstanding: 85000,
      installment: 4800,
      dueDate: 'Mar 15',
      dueMeta: 'Due Mar 15',
    },
  ];

  readonly paymentSources: PaymentSource[] = [
    { id: 'wallet', label: 'Wallet', description: 'KES 12,450', balance: 12450, tone: 'blue' },
    { id: 'mpesa', label: 'M-Pesa', description: 'STK Push', tone: 'green' },
    { id: 'card', label: 'Card', description: 'Visa/MC', tone: 'purple' },
    { id: 'airtel', label: 'Airtel', description: 'STK Push', tone: 'red' },
  ];

  readonly paymentHistory: PaymentRecord[] = [
    {
      date: 'Feb 15, 2025',
      shortDate: 'Feb 15',
      ref: 'PAY-2025-0089',
      loan: 'Development',
      loanTone: 'blue',
      amount: 4800,
      source: 'Wallet',
      sourceId: 'wallet',
      status: 'Paid',
    },
    {
      date: 'Feb 14, 2025',
      shortDate: 'Feb 14',
      ref: 'PAY-2025-0088',
      loan: 'Emergency',
      loanTone: 'red',
      amount: 3200,
      source: 'M-Pesa',
      sourceId: 'mpesa',
      status: 'Paid',
    },
    {
      date: 'Jan 15, 2025',
      shortDate: 'Jan 15',
      ref: 'PAY-2025-0067',
      loan: 'Development',
      loanTone: 'blue',
      amount: 4800,
      source: 'Card',
      sourceId: 'card',
      status: 'Paid',
    },
    {
      date: 'Jan 1, 2025',
      shortDate: 'Jan 1',
      ref: 'PAY-2025-0045',
      loan: 'Emergency',
      loanTone: 'red',
      amount: 3200,
      source: 'Wallet',
      sourceId: 'wallet',
      status: 'Paid',
    },
    {
      date: 'Dec 15, 2024',
      shortDate: 'Dec 15',
      ref: 'PAY-2024-0890',
      loan: 'Development',
      loanTone: 'blue',
      amount: 4800,
      source: 'M-Pesa',
      sourceId: 'mpesa',
      status: 'Paid',
    },
  ];

  readonly quickAmounts = [
    { label: 'Installment', multiplier: 1 },
    { label: '2x', multiplier: 2 },
    { label: 'Full Balance', multiplier: 0 },
  ];

  get selectedLoan(): LoanOption {
    return this.loans.find((loan) => loan.id === this.selectedLoanId) ?? this.loans[0];
  }

  get selectedSource(): PaymentSource {
    return this.paymentSources.find((source) => source.id === this.selectedSourceId) ?? this.paymentSources[0];
  }

  get overdraftInterest(): number {
    return Math.round(this.paymentAmount * 0.03 * 3);
  }

  get overdraftTotal(): number {
    return this.paymentAmount + this.overdraftInterest + 100;
  }

  openModal(modal: ModalName): void {
    this.activeModal = modal;
  }

  closeModal(): void {
    this.activeModal = null;
  }

  openPayNow(loanId?: LoanOption['id']): void {
    if (loanId) {
      this.selectLoan(loanId);
    }
    this.selectedSourceId = 'wallet';
    this.activeModal = 'pay';
  }

  selectLoan(loanId: LoanOption['id']): void {
    this.selectedLoanId = loanId;
    this.paymentAmount = this.selectedLoan.installment;
  }

  selectSource(sourceId: PaymentSource['id']): void {
    this.selectedSourceId = sourceId;
  }

  setQuickAmount(multiplier: number): void {
    this.paymentAmount = multiplier === 0 ? this.selectedLoan.outstanding : this.selectedLoan.installment * multiplier;
  }

  submitPayment(): void {
    const loan = this.selectedLoan;
    const source = this.selectedSource;
    const amount = Math.max(Number(this.paymentAmount) || 0, 1);

    this.successPayment = {
      amount,
      loan: loan.name,
      ref: `PAY-2025-${Math.floor(90 + Math.random() * 9).toString().padStart(4, '0')}`,
      source: source.id === 'wallet' ? 'SaccoPay Wallet' : source.label,
      newOutstanding: Math.max(loan.outstanding - amount, 0),
    };

    this.activeModal = 'processing';
    window.setTimeout(() => {
      this.activeModal = 'success';
    }, 900);
  }

  saveAutoPay(): void {
    this.closeModal();
    this.showToast('Auto-Pay settings saved successfully.', 'success');
  }

  activateOverdraft(): void {
    const loan = this.selectedLoan;
    const amount = Math.max(Number(this.paymentAmount) || 0, 1);
    this.successPayment = {
      amount,
      loan: loan.name,
      ref: `OD-2025-${Math.floor(100 + Math.random() * 899)}`,
      source: 'SaccoPay Overdraft',
      newOutstanding: Math.max(loan.outstanding - amount, 0),
    };
    this.activeModal = 'processing';
    window.setTimeout(() => {
      this.activeModal = 'success';
    }, 900);
  }

  openReceipt(record: PaymentRecord): void {
    this.selectedReceipt = record;
    this.activeModal = 'receipt';
  }

  printReceipt(): void {
    this.showToast('Receipt prepared for download.', 'success');
  }

  handleNotification(message: string, type: 'success' | 'warning'): void {
    this.closeModal();
    this.showToast(message, type);
  }

  showToast(message: string, type: 'success' | 'info' | 'warning' = 'info'): void {
    this.toast = { message, type };
    window.setTimeout(() => {
      this.toast = null;
    }, 3200);
  }
}