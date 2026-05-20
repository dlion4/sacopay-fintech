import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// ─── Interfaces ───
interface GeneralSettings {
  saccoName: string;
  regNumber: string;
  sasraLicense: string;
  officialEmail: string;
  phoneNumber: string;
  physicalAddress: string;
  websiteUrl: string;
}

interface FinancialSettings {
  sharePrice: number;
  minSharePurchase: number;
  maxShareHoldings: number;
  minSavingsDeposit: number;
  minSavingsBalance: number;
  interestRateRegular: number;
  interestRatePersonal: number;
}

interface LoanSettings {
  maxLoanAmount: number;
  minLoanAmount: number;
  processingFee: number;
  latePaymentPenalty: number;
  gracePeriod: number;
}

interface WithdrawalSettings {
  maxDailyWithdrawal: number;
  maxSingleTransfer: number;
  transferFee: number;
  mpesaWithdrawalFee: number;
  allowExternal: boolean;
  autoSave: boolean;
}

interface MembershipSettings {
  minAge: number;
  maxAge: number;
  registrationFee: number;
  minSharesRequired: number;
  allowOnlineRegistration: boolean;
  requireDocumentUpload: boolean;
}

interface WalletSettings {
  maxWalletBalance: number;
  minWalletTopup: number;
  walletTransferFee: number;
  enableMpesa: boolean;
  allowQrPayments: boolean;
  enableWalletToBank: boolean;
}

interface NotificationSettings {
  smsEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsSenderId: string;
  alertEmail: string;
}

interface SecuritySettings {
  minPasswordLength: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  otpExpiry: number;
  requireOtpLogin: boolean;
  ipRestriction: boolean;
}

interface SystemSettings {
  timeZone: string;
  currency: string;
  dateFormat: string;
  language: string;
  accountingSoftware: string;
  mpesaApiStatus: string;
}

interface AppSettings {
  general: GeneralSettings;
  financial: FinancialSettings;
  loans: LoanSettings;
  withdrawals: WithdrawalSettings;
  membership: MembershipSettings;
  wallet: WalletSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  system: SystemSettings;
}

@Component({
  selector: 'app-sacco-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sacco-settings.html',
  styleUrls: ['./sacco-settings.scss']
})
export class SaccoSettingsComponent {

  // ─── Data Models ───
  settings: AppSettings = {
    general: {
      saccoName: 'Rongo SACCO Ltd',
      regNumber: 'CS/7842',
      sasraLicense: 'DT/0198',
      officialEmail: 'info@rongosacco.co.ke',
      phoneNumber: '+254 20 277 1000',
      physicalAddress: 'P.O. Box 45-40404',
      websiteUrl: 'www.rongosacco.co.ke'
    },
    financial: {
      sharePrice: 1000,
      minSharePurchase: 1,
      maxShareHoldings: 5000,
      minSavingsDeposit: 500,
      minSavingsBalance: 1000,
      interestRateRegular: 7,
      interestRatePersonal: 14
    },
    loans: {
      maxLoanAmount: 5000000,
      minLoanAmount: 5000,
      processingFee: 1,
      latePaymentPenalty: 5,
      gracePeriod: 7
    },
    withdrawals: {
      maxDailyWithdrawal: 200000,
      maxSingleTransfer: 150000,
      transferFee: 50,
      mpesaWithdrawalFee: 35,
      allowExternal: true,
      autoSave: true
    },
    membership: {
      minAge: 18,
      maxAge: 70,
      registrationFee: 1000,
      minSharesRequired: 5,
      allowOnlineRegistration: true,
      requireDocumentUpload: true
    },
    wallet: {
      maxWalletBalance: 1000000,
      minWalletTopup: 100,
      walletTransferFee: 0,
      enableMpesa: true,
      allowQrPayments: true,
      enableWalletToBank: false
    },
    notifications: {
      smsEnabled: true,
      emailEnabled: true,
      pushEnabled: true,
      smsSenderId: 'RONGOSACCO',
      alertEmail: 'admin@rongosacco.co.ke'
    },
    security: {
      minPasswordLength: 8,
      sessionTimeout: 15,
      maxLoginAttempts: 5,
      otpExpiry: 5,
      requireOtpLogin: true,
      ipRestriction: false
    },
    system: {
      timeZone: 'EAT (UTC+3)',
      currency: 'KES',
      dateFormat: 'DD/MM/YYYY',
      language: 'English',
      accountingSoftware: 'QuickBooks',
      mpesaApiStatus: 'Connected'
    }
  };

  // ─── Select Options ───
  timeZones: string[] = ['EAT (UTC+3)', 'UTC', 'GMT', 'EST', 'PST', 'CST'];
  currencies: string[] = ['KES', 'USD', 'EUR', 'GBP', 'TZS', 'UGX'];
  dateFormats: string[] = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY'];
  languages: string[] = ['English', 'Swahili', 'French', 'Spanish'];
  accountingSoftwares: string[] = ['QuickBooks', 'Sage', 'Xero', 'Tally', 'Manual'];

  // ─── Modal State ───
  showEditTextModal = false;
  showEditNumberModal = false;
  showEditSelectModal = false;

  // ─── Edit Text State ───
  currentEditLabel = '';
  currentEditType = 'text';
  editTextValue = '';
  textEditCallback: ((val: string) => void) | null = null;

  // ─── Edit Number State ───
  currentNumberLabel = '';
  currentNumberType = 'number';
  editNumberValue: number | null = null;
  numberEditCallback: ((val: number) => void) | null = null;

  // ─── Edit Select State ───
  currentSelectLabel = '';
  editSelectValue = '';
  currentSelectOptions: string[] = [];
  selectEditCallback: ((val: string) => void) | null = null;

  // ─── Toast ───
  toastMessage = 'Settings saved successfully!';

  // ═══════════════════════════════════════════════════════════════
  // EDIT TEXT MODAL
  // ═══════════════════════════════════════════════════════════════

  openEditText(label: string, value: string, type: 'text' | 'email' | 'url' | 'phone' | 'textarea'): void {
    this.currentEditLabel = label;
    this.currentEditType = type;
    this.editTextValue = value;
    this.showEditTextModal = true;
  }

  closeEditTextModal(): void {
    this.showEditTextModal = false;
    this.currentEditLabel = '';
    this.editTextValue = '';
  }

  saveTextEdit(): void {
    const val = this.editTextValue.trim();
    if (!val) {
      this.showToast('Please enter a value');
      return;
    }

    // Map label to setting path and update
    this.updateTextSetting(this.currentEditLabel, val);
    this.showToast(`${this.currentEditLabel} updated successfully`);
    this.closeEditTextModal();
  }

  private updateTextSetting(label: string, value: string): void {
    switch (label) {
      case 'SACCO Name': this.settings.general.saccoName = value; break;
      case 'Registration Number': this.settings.general.regNumber = value; break;
      case 'SASRA License': this.settings.general.sasraLicense = value; break;
      case 'Official Email': this.settings.general.officialEmail = value; break;
      case 'Phone Number': this.settings.general.phoneNumber = value; break;
      case 'Physical Address': this.settings.general.physicalAddress = value; break;
      case 'Website URL': this.settings.general.websiteUrl = value; break;
      case 'SMS Sender ID': this.settings.notifications.smsSenderId = value; break;
      case 'Alert Email': this.settings.notifications.alertEmail = value; break;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // EDIT NUMBER MODAL
  // ═══════════════════════════════════════════════════════════════

  openEditNumber(label: string, value: number, type: 'number' | 'currency' | 'percent'): void {
    this.currentNumberLabel = label;
    this.currentNumberType = type;
    this.editNumberValue = value;
    this.showEditNumberModal = true;
  }

  closeEditNumberModal(): void {
    this.showEditNumberModal = false;
    this.currentNumberLabel = '';
    this.editNumberValue = null;
  }

  saveNumberEdit(): void {
    if (this.editNumberValue === null || this.editNumberValue === undefined) {
      this.showToast('Please enter a valid number');
      return;
    }

    this.updateNumberSetting(this.currentNumberLabel, this.editNumberValue);
    this.showToast(`${this.currentNumberLabel} updated to: ${this.formatNumberDisplay(this.currentNumberLabel, this.editNumberValue)}`);
    this.closeEditNumberModal();
  }

  private updateNumberSetting(label: string, value: number): void {
    switch (label) {
      case 'Share Price': this.settings.financial.sharePrice = value; break;
      case 'Min. Share Purchase': this.settings.financial.minSharePurchase = value; break;
      case 'Max. Share Holdings': this.settings.financial.maxShareHoldings = value; break;
      case 'Min. Savings Deposit': this.settings.financial.minSavingsDeposit = value; break;
      case 'Min. Savings Balance': this.settings.financial.minSavingsBalance = value; break;
      case 'Interest Rate (Regular)': this.settings.financial.interestRateRegular = value; break;
      case 'Interest Rate (Personal)': this.settings.financial.interestRatePersonal = value; break;
      case 'Max. Loan Amount': this.settings.loans.maxLoanAmount = value; break;
      case 'Min. Loan Amount': this.settings.loans.minLoanAmount = value; break;
      case 'Processing Fee': this.settings.loans.processingFee = value; break;
      case 'Late Payment Penalty': this.settings.loans.latePaymentPenalty = value; break;
      case 'Grace Period': this.settings.loans.gracePeriod = value; break;
      case 'Max. Daily Withdrawal': this.settings.withdrawals.maxDailyWithdrawal = value; break;
      case 'Max. Single Transfer': this.settings.withdrawals.maxSingleTransfer = value; break;
      case 'Transfer Fee': this.settings.withdrawals.transferFee = value; break;
      case 'M-Pesa Withdrawal Fee': this.settings.withdrawals.mpesaWithdrawalFee = value; break;
      case 'Minimum Age': this.settings.membership.minAge = value; break;
      case 'Maximum Age': this.settings.membership.maxAge = value; break;
      case 'Registration Fee': this.settings.membership.registrationFee = value; break;
      case 'Min. Shares Required': this.settings.membership.minSharesRequired = value; break;
      case 'Max. Wallet Balance': this.settings.wallet.maxWalletBalance = value; break;
      case 'Min. Wallet Top-up': this.settings.wallet.minWalletTopup = value; break;
      case 'Wallet Transfer Fee': this.settings.wallet.walletTransferFee = value; break;
      case 'Min. Password Length': this.settings.security.minPasswordLength = value; break;
      case 'Session Timeout': this.settings.security.sessionTimeout = value; break;
      case 'Max Login Attempts': this.settings.security.maxLoginAttempts = value; break;
      case 'OTP Expiry': this.settings.security.otpExpiry = value; break;
    }
  }

  private formatNumberDisplay(label: string, value: number): string {
    if (['Share Price', 'Min. Savings Deposit', 'Min. Savings Balance', 'Max. Loan Amount',
         'Min. Loan Amount', 'Max. Daily Withdrawal', 'Max. Single Transfer', 'Transfer Fee',
         'M-Pesa Withdrawal Fee', 'Registration Fee', 'Max. Wallet Balance', 'Min. Wallet Top-up',
         'Wallet Transfer Fee'].includes(label)) {
      return `KES ${value.toLocaleString()}`;
    }
    if (['Interest Rate (Regular)', 'Interest Rate (Personal)', 'Processing Fee', 'Late Payment Penalty'].includes(label)) {
      return `${value}%`;
    }
    if (['Grace Period', 'Session Timeout', 'OTP Expiry'].includes(label)) {
      return `${value} minutes`;
    }
    if (['Minimum Age', 'Maximum Age'].includes(label)) {
      return `${value} years`;
    }
    return value.toString();
  }

  // ═══════════════════════════════════════════════════════════════
  // EDIT SELECT MODAL
  // ═══════════════════════════════════════════════════════════════

  openSelect(label: string, value: string, options: string[]): void {
    this.currentSelectLabel = label;
    this.editSelectValue = value;
    this.currentSelectOptions = [...options];
    this.showEditSelectModal = true;
  }

  closeEditSelectModal(): void {
    this.showEditSelectModal = false;
    this.currentSelectLabel = '';
    this.currentSelectOptions = [];
  }

  saveSelectEdit(): void {
    this.updateSelectSetting(this.currentSelectLabel, this.editSelectValue);
    this.showToast(`${this.currentSelectLabel} updated to: ${this.editSelectValue}`);
    this.closeEditSelectModal();
  }

  private updateSelectSetting(label: string, value: string): void {
    switch (label) {
      case 'Time Zone': this.settings.system.timeZone = value; break;
      case 'Currency': this.settings.system.currency = value; break;
      case 'Date Format': this.settings.system.dateFormat = value; break;
      case 'Language': this.settings.system.language = value; break;
      case 'Accounting Software': this.settings.system.accountingSoftware = value; break;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TOGGLE SETTINGS
  // ═══════════════════════════════════════════════════════════════

  toggleSetting(name: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const state = checkbox.checked ? 'enabled' : 'disabled';
    this.showToast(`${name} ${state}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // GLOBAL ACTIONS
  // ═══════════════════════════════════════════════════════════════

  saveAllSettings(): void {
    this.showToast('All settings saved successfully!');
  }

  showToast(message: string): void {
    this.toastMessage = message;
    const toastEl = document.getElementById('successToast');
    const toastMsgEl = document.getElementById('toastMsg');
    if (toastMsgEl) {
      toastMsgEl.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>${message}`;
    }
    if (toastEl) {
      // @ts-ignore
      const bsToast = bootstrap?.Toast?.getOrCreateInstance(toastEl);
      if (bsToast) {
        bsToast.show();
      } else {
        // Fallback for environments without Bootstrap JS
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 3000);
      }
    }
  }
}