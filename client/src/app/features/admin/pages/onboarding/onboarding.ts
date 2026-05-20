import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Types & Interfaces ──────────────────────────────────────────────────────

export type View = 'landing' | 'wizard' | 'success' | 'dashboard';
export type ToastType = 'success' | 'danger' | 'info' | 'warning';

export interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export interface BoardMember {
  name: string;
  role: string;
  id: string;
}

export interface DocumentState {
  [key: string]: string;
}

export interface GeneralForm {
  saccoName: string;
  registrationNumber: string;
  sasraLicense: string;
  yearEstablished: string;
  officialEmail: string;
  phoneNumber: string;
  county: string;
  postalAddress: string;
  website: string;
  logoName: string;
}

export interface FinancialForm {
  sharePrice: number;
  minSharePurchase: number;
  maxShareHoldings: number;
  minSavingsDeposit: number;
  minSavingsBalance: number;
  interestRateRegular: number;
  interestRatePremium: number;
  financialYearEnd: string;
  currency: string;
  bankName: string;
  bankAccount: string;
  bankBranch: string;
}

export interface OfficialsForm {
  chairmanName: string;
  chairmanId: string;
  chairmanPhone: string;
  chairmanEmail: string;
  chairmanKra: string;
  ceoName: string;
  ceoId: string;
  ceoPhone: string;
  ceoEmail: string;
  ceoKra: string;
  treasurerName: string;
  treasurerId: string;
  treasurerPhone: string;
  treasurerEmail: string;
  treasurerKra: string;
  boardMembers: BoardMember[];
}

export interface MembershipForm {
  minAge: number;
  maxAge: number;
  registrationFee: number;
  minSharesRequired: number;
  monthlyContribution: number;
  membershipType: string;
  allowOnlineReg: boolean;
  requireDocUpload: boolean;
  requireGuarantors: boolean;
  autoApprove: boolean;
  allowReferrals: boolean;
  targetMembers: string;
  geographicArea: string;
  eligibilityNotes: string;
}

export interface SettingsForm {
  maxLoanAmount: number;
  minLoanAmount: number;
  loanInterestRate: number;
  maxLoanTerm: number;
  loanMultiplier: number;
  processingFee: number;
  maxDailyWithdrawal: number;
  maxSingleTransfer: number;
  withdrawalDays: number;
  transferFee: number;
  maxWalletBalance: number;
  mpesaPaybill: string;
  enableMpesa: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  twoFactor: boolean;
  autoStatements: boolean;
}

export interface TermsForm {
  termsOfService: boolean;
  privacyPolicy: boolean;
  accurateInfo: boolean;
  authorizedBoard: boolean;
  slaAccepted: boolean;
}

export interface NextStep {
  id: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  icon: string;
  active: boolean;
}

export interface DocEntry {
  key: string;
  label: string;
  desc: string;
}

export interface ReviewRow {
  label: string;
  value: string;
  ok?: boolean;
}

export interface ReviewCardData {
  title: string;
  icon: string;
  stepNum: number;
  rows: ReviewRow[];
}

export interface StepMeta {
  icon: string;
  title: string;
  sub: string;
}

export interface OfficialSection {
  title: string;
  prefix: string;
  fields: { label: string; suffix: string }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const STEPS: string[] = [
  'General', 'Financial', 'Officials', 'Documents',
  'Membership', 'Settings', 'Review', 'Terms'
];

export const COUNTIES: string[] = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo Marakwet','Embu','Garissa',
  'Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi',
  'Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos',
  'Makueni','Mandera','Marsabit','Meru','Migori County','Mombasa',
  "Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua',
  'Nyeri','Samburu','Siaya','Taita Taveta','Tana River','Tharaka Nithi',
  'Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'
];

export const REQUIRED_DOCS: DocEntry[] = [
  { key: 'registration_cert', label: 'Certificate of Registration',  desc: 'Official SACCO registration document from Ministry of Cooperatives' },
  { key: 'sasra_license',     label: 'SASRA License',                desc: 'Deposit-taking SACCO license issued by SASRA' },
  { key: 'kra_pin',           label: 'SACCO KRA PIN Certificate',    desc: 'Tax compliance PIN certificate from Kenya Revenue Authority' },
  { key: 'directors_ids',     label: "Directors' ID Copies",         desc: 'National ID / Passport copies of all registered officials' },
  { key: 'board_resolution',  label: 'Board Resolution',             desc: 'Board resolution authorizing platform registration' },
  { key: 'constitution',      label: 'SACCO Constitution / By-Laws', desc: 'Governing document that outlines SACCO operations' },
];

export const OPTIONAL_DOCS: DocEntry[] = [
  { key: 'audited_accounts',   label: 'Latest Audited Accounts',     desc: 'Financial statements from most recent audit' },
  { key: 'strategic_plan',     label: 'Strategic Plan',              desc: 'SACCO development and growth plan' },
  { key: 'mpesa_paybill_cert', label: 'M-Pesa Paybill Certificate',  desc: 'Safaricom paybill account authorization letter' },
  { key: 'bank_statement',     label: 'Bank Statement',              desc: 'Recent 3-month bank statement' },
];

export const NEXT_STEPS_DEFAULT: NextStep[] = [
  { id: 'sacco-settings',    title: 'SACCO Settings',      desc: 'Configure rates, fees, limits & preferences',  color: '#00d084', bg: '#e6faf4', icon: '⚙️',  active: false },
  { id: 'loan-products',     title: 'Loan Products',        desc: 'Set up loan types, interest rates & terms',   color: '#2196f3', bg: '#e3f2fd', icon: '💳',  active: false },
  { id: 'savings-accounts',  title: 'Savings Accounts',    desc: 'Configure savings types & interest rates',     color: '#9c27b0', bg: '#f3e5f5', icon: '🏦',  active: true  },
  { id: 'saccopay-wallet',   title: 'SACCOPay Wallet',     desc: 'Enable digital wallet for members',            color: '#00bcd4', bg: '#e0f7fa', icon: '📱',  active: false },
  { id: 'add-members',       title: 'Add Members',          desc: 'Register members or import CSV',               color: '#ff9800', bg: '#fff3e0', icon: '👥',  active: false },
  { id: 'staff-permissions', title: 'Staff & Permissions', desc: 'Assign roles to management team',              color: '#607d8b', bg: '#eceff1', icon: '🔐',  active: false },
  { id: 'compliance',        title: 'Compliance',           desc: 'Upload policies & set up regulatory filings', color: '#f44336', bg: '#ffebee', icon: '🛡️', active: false },
  { id: 'reports',           title: 'Reports',              desc: 'Generate financial & operational reports',    color: '#e91e63', bg: '#fce4ec', icon: '📊',  active: false },
];

export const STEP_META: StepMeta[] = [
  { icon: '🏢', title: 'General Information',     sub: 'Basic details about your SACCO' },
  { icon: '💰', title: 'Financial Information',   sub: 'Share capital and financial configuration' },
  { icon: '👤', title: 'Officials & Management', sub: 'Registered SACCO officials and board members' },
  { icon: '📄', title: 'Documents',               sub: 'Upload required regulatory documents' },
  { icon: '👥', title: 'Membership Settings',     sub: 'Configure member eligibility and requirements' },
  { icon: '⚙️', title: 'Platform Settings',       sub: 'Loans, wallet, withdrawals and system preferences' },
  { icon: '🔍', title: 'Review Your Information', sub: 'Verify all details before final submission' },
  { icon: '📋', title: 'Terms & Agreements',      sub: 'Please review and accept to complete registration' },
];

export const OFFICIAL_SECTIONS: OfficialSection[] = [
  {
    title: 'Chairman / President', prefix: 'chairman',
    fields: [
      { label: 'Full Name *',    suffix: 'Name'  },
      { label: 'National ID *', suffix: 'Id'    },
      { label: 'Phone Number',  suffix: 'Phone' },
      { label: 'Email Address', suffix: 'Email' },
      { label: 'KRA PIN',       suffix: 'Kra'   },
    ]
  },
  {
    title: 'CEO / Secretary', prefix: 'ceo',
    fields: [
      { label: 'Full Name *',    suffix: 'Name'  },
      { label: 'National ID *', suffix: 'Id'    },
      { label: 'Phone Number',  suffix: 'Phone' },
      { label: 'Email Address', suffix: 'Email' },
      { label: 'KRA PIN',       suffix: 'Kra'   },
    ]
  },
  {
    title: 'Treasurer', prefix: 'treasurer',
    fields: [
      { label: 'Full Name *',    suffix: 'Name'  },
      { label: 'National ID *', suffix: 'Id'    },
      { label: 'Phone Number',  suffix: 'Phone' },
      { label: 'Email Address', suffix: 'Email' },
      { label: 'KRA PIN',       suffix: 'Kra'   },
    ]
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.html',
  styleUrls: ['./onboarding.scss']
})
export class OnboardingComponent implements OnDestroy {

  // ── View state ────────────────────────────────────────────────────────────
  view: View = 'landing';
  step: number = 1;

  // ── Constants exposed to template ─────────────────────────────────────────
  readonly steps        = STEPS;
  readonly counties     = COUNTIES;
  readonly requiredDocs = REQUIRED_DOCS;
  readonly optionalDocs = OPTIONAL_DOCS;
  readonly stepMeta     = STEP_META;
  readonly officialSections = OFFICIAL_SECTIONS;

  // ── Toast ─────────────────────────────────────────────────────────────────
  toast: ToastState = { show: false, message: '', type: 'success' };
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Next Steps (dashboard) ────────────────────────────────────────────────
  nextSteps: NextStep[] = NEXT_STEPS_DEFAULT.map(s => ({ ...s }));
  showModal   = false;
  selectedNS: NextStep | null = null;

  // ── Form data ─────────────────────────────────────────────────────────────
  general: GeneralForm = {
    saccoName:          'Rongo SACCO Society Ltd',
    registrationNumber: 'CS/7842',
    sasraLicense:       'DT/0198',
    yearEstablished:    '1982',
    officialEmail:      'info@rongosacco.co.ke',
    phoneNumber:        '+254 20 277 1000',
    county:             'Migori County',
    postalAddress:      'P.O. Box 45-40404, Rongo',
    website:            'www.rongosacco.co.ke',
    logoName:           '',
  };

  financial: FinancialForm = {
    sharePrice:          1000,
    minSharePurchase:    1,
    maxShareHoldings:    5000,
    minSavingsDeposit:   500,
    minSavingsBalance:   1000,
    interestRateRegular: 7,
    interestRatePremium: 8.5,
    financialYearEnd:    'December',
    currency:            'KES',
    bankName:            'Equity Bank',
    bankAccount:         '0123456789',
    bankBranch:          'Rongo Branch',
  };

  officials: OfficialsForm = {
    chairmanName:    'James Otieno Omondi',
    chairmanId:      '12345678',
    chairmanPhone:   '+254 712 345 678',
    chairmanEmail:   'chairman@rongosacco.co.ke',
    chairmanKra:     'A001234567B',
    ceoName:         'Mary Achieng Odhiambo',
    ceoId:           '23456789',
    ceoPhone:        '+254 723 456 789',
    ceoEmail:        'ceo@rongosacco.co.ke',
    ceoKra:          'A002345678C',
    treasurerName:   'Peter Kipchoge Ruto',
    treasurerId:     '34567890',
    treasurerPhone:  '+254 734 567 890',
    treasurerEmail:  'treasurer@rongosacco.co.ke',
    treasurerKra:    'A003456789D',
    boardMembers: [
      { name: 'Alice Wanjiru Kamau',  role: 'Board Director', id: '45678901' },
      { name: 'Samuel Njoroge Mwangi', role: 'Board Director', id: '56789012' },
    ],
  };

  membership: MembershipForm = {
    minAge:              18,
    maxAge:              70,
    registrationFee:     1000,
    minSharesRequired:   5,
    monthlyContribution: 500,
    membershipType:      'individual',
    allowOnlineReg:      true,
    requireDocUpload:    true,
    requireGuarantors:   false,
    autoApprove:         false,
    allowReferrals:      true,
    targetMembers:       'general',
    geographicArea:      'Migori County',
    eligibilityNotes:    '',
  };

  settings: SettingsForm = {
    maxLoanAmount:      5000000,
    minLoanAmount:      5000,
    loanInterestRate:   12,
    maxLoanTerm:        60,
    loanMultiplier:     3,
    processingFee:      1.5,
    maxDailyWithdrawal: 200000,
    maxSingleTransfer:  150000,
    withdrawalDays:     3,
    transferFee:        50,
    maxWalletBalance:   1000000,
    mpesaPaybill:       '123456',
    enableMpesa:        true,
    smsNotifications:   true,
    emailNotifications: true,
    twoFactor:          false,
    autoStatements:     true,
  };

  terms: TermsForm = {
    termsOfService:  false,
    privacyPolicy:   false,
    accurateInfo:    false,
    authorizedBoard: false,
    slaAccepted:     false,
  };

  documents: DocumentState = {};

  // ── Computed ──────────────────────────────────────────────────────────────
  get allTermsOk(): boolean {
    return Object.values(this.terms).every(Boolean);
  }

  get currentMeta(): StepMeta {
    return STEP_META[this.step - 1];
  }

  get saccoInitial(): string {
    return this.general.saccoName ? this.general.saccoName.charAt(0).toUpperCase() : 'S';
  }

  get completedNextSteps(): number {
    return this.nextSteps.filter(n => n.active).length;
  }

  // ── Review cards data ─────────────────────────────────────────────────────
  get reviewCards(): ReviewCardData[] {
    return [
      {
        title: 'General', icon: '🏢', stepNum: 1,
        rows: [
          { label: 'SACCO Name',    value: this.general.saccoName          || '—' },
          { label: 'Reg. Number',   value: this.general.registrationNumber || '—' },
          { label: 'SASRA License', value: this.general.sasraLicense       || '—' },
          { label: 'Year Est.',     value: this.general.yearEstablished     || '—' },
          { label: 'Email',         value: this.general.officialEmail       || '—' },
          { label: 'Phone',         value: this.general.phoneNumber         || '—' },
          { label: 'County',        value: this.general.county              || '—' },
        ]
      },
      {
        title: 'Financial', icon: '💰', stepNum: 2,
        rows: [
          { label: 'Share Price',   value: `KES ${this.fmt(this.financial.sharePrice)}` },
          { label: 'Min. Purchase', value: `${this.financial.minSharePurchase} share(s)` },
          { label: 'Max. Holdings', value: `${this.fmt(this.financial.maxShareHoldings)} shares` },
          { label: 'Min. Deposit',  value: `KES ${this.fmt(this.financial.minSavingsDeposit)}` },
          { label: 'Interest Rate', value: `${this.financial.interestRateRegular}% p.a.` },
          { label: 'Bank',          value: this.financial.bankName || '—' },
          { label: 'FY End',        value: this.financial.financialYearEnd },
        ]
      },
      {
        title: 'Officials', icon: '👤', stepNum: 3,
        rows: [
          { label: 'Chairman',      value: this.officials.chairmanName  || '—' },
          { label: 'Chairman ID',   value: this.officials.chairmanId    || '—' },
          { label: 'CEO/Secretary', value: this.officials.ceoName       || '—' },
          { label: 'CEO ID',        value: this.officials.ceoId         || '—' },
          { label: 'Treasurer',     value: this.officials.treasurerName || '—' },
          { label: 'Board Members', value: String(this.officials.boardMembers.length) },
        ]
      },
      {
        title: 'Membership', icon: '👥', stepNum: 5,
        rows: [
          { label: 'Min. Age',     value: `${this.membership.minAge} years` },
          { label: 'Max. Age',     value: `${this.membership.maxAge} years` },
          { label: 'Reg. Fee',     value: `KES ${this.fmt(this.membership.registrationFee)}` },
          { label: 'Min. Shares',  value: `${this.membership.minSharesRequired} shares` },
          { label: 'Online Reg.',  value: this.membership.allowOnlineReg  ? 'Allowed'   : 'Not Allowed' },
          { label: 'Doc Upload',   value: this.membership.requireDocUpload ? 'Required' : 'Optional' },
        ]
      },
      {
        title: 'Platform Settings', icon: '⚙️', stepNum: 6,
        rows: [
          { label: 'Max. Loan',       value: `KES ${this.fmt(this.settings.maxLoanAmount)}` },
          { label: 'Min. Loan',       value: `KES ${this.fmt(this.settings.minLoanAmount)}` },
          { label: 'Loan Rate',       value: `${this.settings.loanInterestRate}% p.a.` },
          { label: 'Max. Withdrawal', value: `KES ${this.fmt(this.settings.maxDailyWithdrawal)}` },
          { label: 'Wallet Max',      value: `KES ${this.fmt(this.settings.maxWalletBalance)}` },
          { label: 'M-Pesa',          value: this.settings.enableMpesa ? 'Enabled' : 'Disabled' },
        ]
      },
      {
        title: 'Documents', icon: '📄', stepNum: 4,
        rows: REQUIRED_DOCS.map(d => ({
          label: d.label,
          value: this.documents[d.key] ? '✓ Uploaded' : '✗ Missing',
          ok:    !!this.documents[d.key],
        }))
      },
    ];
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  startWizard(): void {
    this.view = 'wizard';
    this.step = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStep(num: number): void {
    if (num >= 1 && num <= 8) {
      this.step = num;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goNext(): void {
    if (this.step < 8) {
      this.step++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    if (this.step > 1) {
      this.step--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleFooterNext(): void {
    if (this.step === 8) {
      this.completeRegistration();
    } else {
      this.goNext();
    }
  }

  completeRegistration(): void {
    if (!this.allTermsOk) {
      this.showToast('Please accept all terms to proceed.', 'warning');
      return;
    }
    this.view = 'success';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToDashboard(): void {
    this.view = 'dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Toast ─────────────────────────────────────────────────────────────────
  showToast(message: string, type: ToastType = 'success'): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { show: true, message, type };
    this.toastTimer = setTimeout(() => {
      this.toast = { ...this.toast, show: false };
    }, 4000);
  }

  hideToast(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { ...this.toast, show: false };
  }

  // ── Board members ─────────────────────────────────────────────────────────
  addBoardMember(): void {
    this.officials.boardMembers = [
      ...this.officials.boardMembers,
      { name: '', role: '', id: '' }
    ];
  }

  removeBoardMember(index: number): void {
    this.officials.boardMembers = this.officials.boardMembers.filter((_, i) => i !== index);
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ── Documents ─────────────────────────────────────────────────────────────
  handleDocUpload(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.documents = { ...this.documents, [key]: input.files[0].name };
      // reset so same file can be re-uploaded
      input.value = '';
    }
  }

  removeDocument(key: string): void {
    const d = { ...this.documents };
    delete d[key];
    this.documents = d;
  }

  hasDocument(key: string): boolean {
    return !!this.documents[key];
  }

  // ── Logo upload ───────────────────────────────────────────────────────────
  handleLogoUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.general.logoName = input.files[0].name;
    }
  }

  // ── Next Steps modal ──────────────────────────────────────────────────────
  openModal(ns: NextStep): void {
    this.selectedNS = ns;
    this.showModal  = true;
  }

  closeModal(): void {
    this.showModal  = false;
    this.selectedNS = null;
  }

  configureNow(): void {
    if (!this.selectedNS) return;
    this.nextSteps = this.nextSteps.map(x =>
      x.id === this.selectedNS!.id ? { ...x, active: true } : x
    );
    this.showToast(`Navigating to ${this.selectedNS.title}...`, 'info');
    this.closeModal();
  }

  // ── Officials helper ──────────────────────────────────────────────────────
  getOfficialFieldKey(prefix: string, suffix: string): string {
    return `${prefix}${suffix}`;
  }

  getOfficialValue(prefix: string, suffix: string): string {
    const key = `${prefix}${suffix}`;
    return (this.officials as any)[key] ?? '';
  }

  setOfficialValue(prefix: string, suffix: string, value: string): void {
    const key = `${prefix}${suffix}`;
    (this.officials as any)[key] = value;
  }

  // ── Stepper helpers ───────────────────────────────────────────────────────
  isStepDone(num: number): boolean   { return this.step > num; }
  isStepActive(num: number): boolean { return this.step === num; }

  // ── Formatting ────────────────────────────────────────────────────────────
  fmt(n: number): string {
    return n?.toLocaleString('en-KE') ?? '0';
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────
  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
}
