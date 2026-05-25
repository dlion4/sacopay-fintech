import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Tab Types ────────────────────────────────────────────────────────────────
export type SettingsTab =
  | 'profile' | 'employment' | 'emergency' | 'preferences'
  | 'notifications' | 'security' | 'support';

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  dob: string;
  address: string;
  county: string;
  postalCode: string;
}

export interface EmploymentData {
  employerName: string;
  jobTitle: string;
  grossIncome: string;
  payrollNumber: string;
  employmentType: string;
  yearsAtJob: string;
  employerContact: string;
}

export interface EmergencyData {
  contactName: string;
  relationship: string;
  phone: string;
  altPhone: string;
}

export interface PreferencesData {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
}

export interface NotifPrefs {
  email: {
    transactionAlerts: boolean;
    loanStatusUpdates: boolean;
    dividendDeclarations: boolean;
    monthlyStatements: boolean;
    agmAnnouncements: boolean;
    saccoPayAlerts: boolean;
  };
  sms: {
    paymentReminders: boolean;
    otpSecurityCodes: boolean;
    agmAnnouncements: boolean;
    saccoPayUpdates: boolean;
    loanReminders: boolean;
  };
  push: {
    enabled: boolean;
    transactions: boolean;
    security: boolean;
    reminders: boolean;
  };
}

export interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  twoFAEnabled: boolean;
}

export interface KycItem {
  id: string;
  label: string;
  desc: string;
  status: 'verified' | 'approved' | 'pending' | 'rejected';
}

export interface SessionItem {
  device: string;
  location: string;
  date: string;
  current: boolean;
}

export interface ToastMsg {
  id: number;
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
}

export interface TabDef {
  key: SettingsTab;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-setting.html',
  styleUrls: ['./account-setting.scss'],
})
export class AccountSettingsComponent implements OnInit {

  // ── Active Tab ───────────────────────────────────────────────────────────────
  activeTab: SettingsTab = 'profile';
  lastUpdated = 'Feb 23, 2025';

  // ── Tabs Definition ──────────────────────────────────────────────────────────
  tabs: TabDef[] = [
    { key: 'profile',       label: 'Profile',       icon: 'user' },
    { key: 'employment',    label: 'Employment',    icon: 'briefcase' },
    { key: 'emergency',     label: 'Emergency',     icon: 'phone' },
    { key: 'preferences',   label: 'Preferences',   icon: 'globe' },
    { key: 'notifications', label: 'Notifications', icon: 'bell' },
    { key: 'security',      label: 'Security',      icon: 'shield' },
    { key: 'support',       label: 'Support',       icon: 'headphones' },
  ];

  // ── Toast ────────────────────────────────────────────────────────────────────
  toasts: ToastMsg[] = [];
  private toastCounter = 0;

  // ── Profile ──────────────────────────────────────────────────────────────────
  profile: ProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@enterprise-email.com',
    phone: '+254 712 345 678',
    nationalId: '12345678',
    dob: '04/15/1985',
    address: 'P.O Box 12345, Nairobi',
    county: 'Nairobi',
    postalCode: '00100',
  };
  profileOriginal: ProfileData = { ...this.profile };

  // ── KYC Items ────────────────────────────────────────────────────────────────
  kycItems: KycItem[] = [
    { id: 'identity',  label: 'Identity Verification',  desc: 'National ID verified with Huduma Center on 12 Mar 2023', status: 'verified' },
    { id: 'address',   label: 'Address Verification',   desc: 'Utility bill uploaded and approved on 15 Mar 2023',     status: 'verified' },
    { id: 'tax',       label: 'Tax PIN (KRA)',           desc: 'Required for dividend withholding tax compliance',      status: 'pending'  },
    { id: 'photo',     label: 'Passport Photo',          desc: 'Recent passport-size photo for member card',            status: 'approved' },
  ];

  // ── Employment ───────────────────────────────────────────────────────────────
  employment: EmploymentData = {
    employerName:    'Kenya Revenue Authority',
    jobTitle:        'Senior Tax Analyst',
    grossIncome:     '125000',
    payrollNumber:   'KRA-0042891',
    employmentType:  'Permanent & Pensionable',
    yearsAtJob:      '7',
    employerContact: '+254 722 000 111',
  };
  employmentOriginal: EmploymentData = { ...this.employment };

  // ── Emergency ────────────────────────────────────────────────────────────────
  emergency: EmergencyData = {
    contactName:  'Jane Doe',
    relationship: 'Spouse',
    phone:        '+254 723 456 789',
    altPhone:     '+254 700 987 654',
  };
  emergencyOriginal: EmergencyData = { ...this.emergency };

  // ── Preferences ──────────────────────────────────────────────────────────────
  prefs: PreferencesData = {
    language:   'English (Kenya)',
    currency:   'KES – Kenyan Shilling',
    timezone:   'Africa/Nairobi (GMT+3)',
    dateFormat: 'DD/MM/YYYY',
  };
  prefsOriginal: PreferencesData = { ...this.prefs };

  languages  = ['English (Kenya)', 'Swahili (Kenya)', 'English (UK)', 'English (US)'];
  currencies = ['KES – Kenyan Shilling', 'USD – US Dollar', 'EUR – Euro', 'GBP – British Pound'];
  timezones  = ['Africa/Nairobi (GMT+3)', 'Africa/Lagos (GMT+1)', 'Europe/London (GMT+0)', 'America/New_York (GMT-5)'];
  dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'D MMM YYYY'];

  // ── Notification Prefs ───────────────────────────────────────────────────────
  notifPrefs: NotifPrefs = {
    email: {
      transactionAlerts:   true,
      loanStatusUpdates:   true,
      dividendDeclarations: false,
      monthlyStatements:   true,
      agmAnnouncements:    false,
      saccoPayAlerts:      true,
    },
    sms: {
      paymentReminders:  true,
      otpSecurityCodes:  true,
      agmAnnouncements:  false,
      saccoPayUpdates:   true,
      loanReminders:     true,
    },
    push: {
      enabled:      true,
      transactions: true,
      security:     true,
      reminders:    false,
    },
  };

  // ── Security ─────────────────────────────────────────────────────────────────
  security: SecurityData = {
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
    showCurrent:     false,
    showNew:         false,
    showConfirm:     false,
    twoFAEnabled:    true,
  };

  passwordStrength = 0;
  passwordStrengthLabel = '';
  passwordStrengthClass = '';

  sessions: SessionItem[] = [
    { device: 'Chrome on Windows 11',  location: 'Nairobi, Kenya',  date: 'Feb 23, 2025 – 10:45 AM', current: true  },
    { device: 'Safari on iPhone 14',   location: 'Kisumu, Kenya',   date: 'Feb 22, 2025 – 08:20 PM', current: false },
  ];

  // ── Modals ───────────────────────────────────────────────────────────────────
  showSessionsModal     = false;
  showLoginLogModal     = false;
  showDownloadModal     = false;
  showCloseAccountModal = false;
  showUploadModal       = false;
  showAvatarModal       = false;
  showTwoFAModal        = false;
  showSendMsgModal      = false;
  uploadKycId           = '';
  uploadFile: File | null = null;

  // New support message
  supportMsgSubject = '';
  supportMsgBody    = '';
  supportMsgPriority = 'Normal';

  // ── Support — Admin Details ───────────────────────────────────────────────────
  saccoAdmins = [
    { name: 'Mr. David Ochieng',   role: 'SACCO Manager',          phone: '+254 700 123 456', email: 'manager@rongosacco.co.ke'   },
    { name: 'Ms. Grace Akinyi',    role: 'Loans Officer',           phone: '+254 700 234 567', email: 'loans@rongosacco.co.ke'     },
    { name: 'Mr. Peter Kamande',   role: 'Finance & ICT Officer',  phone: '+254 700 345 678', email: 'finance@rongosacco.co.ke'   },
    { name: 'Ms. Ruth Wanjiku',    role: 'Member Services Officer', phone: '+254 700 456 789', email: 'members@rongosacco.co.ke'  },
  ];

  // Login log mock data
  loginLogs = [
    { device: 'Chrome on Windows 11', location: 'Nairobi, Kenya',  date: 'Feb 23, 2025 – 10:45 AM', status: 'success' },
    { device: 'Safari on iPhone 14',  location: 'Kisumu, Kenya',   date: 'Feb 22, 2025 – 08:20 PM', status: 'success' },
    { device: 'Chrome on Android',    location: 'Mombasa, Kenya',  date: 'Feb 20, 2025 – 03:10 PM', status: 'failed'  },
    { device: 'Firefox on MacOS',     location: 'Nairobi, Kenya',  date: 'Feb 18, 2025 – 11:00 AM', status: 'success' },
    { device: 'Chrome on Windows 10', location: 'Unknown',         date: 'Feb 15, 2025 – 09:30 PM', status: 'failed'  },
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────────────────
  ngOnInit(): void {}

  @HostListener('document:keydown.escape')
  onEsc(): void { this.closeAllModals(); }

  closeAllModals(): void {
    this.showSessionsModal     = false;
    this.showLoginLogModal     = false;
    this.showDownloadModal     = false;
    this.showCloseAccountModal = false;
    this.showUploadModal       = false;
    this.showAvatarModal       = false;
    this.showTwoFAModal        = false;
    this.showSendMsgModal      = false;
  }

  // ── Tab ───────────────────────────────────────────────────────────────────────
  setTab(key: SettingsTab): void { this.activeTab = key; }

  // ── Profile ───────────────────────────────────────────────────────────────────
  saveProfile(): void {
    this.profileOriginal = { ...this.profile };
    this.lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    this.showToast('success', 'Profile updated successfully');
  }
  cancelProfile(): void { this.profile = { ...this.profileOriginal }; }

  openUploadModal(kycId: string): void {
    this.uploadKycId = kycId;
    this.uploadFile = null;
    this.showUploadModal = true;
  }

  submitUpload(): void {
    if (!this.uploadFile) { this.showToast('warning', 'Please select a file to upload'); return; }
    const item = this.kycItems.find(k => k.id === this.uploadKycId);
    if (item) item.status = 'pending';
    this.showUploadModal = false;
    this.showToast('success', 'Document uploaded successfully. Under review.');
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) this.uploadFile = input.files[0];
  }

  kycStatusClass(status: string): string {
    switch (status) {
      case 'verified': return 'status--verified';
      case 'approved': return 'status--approved';
      case 'pending':  return 'status--pending';
      case 'rejected': return 'status--rejected';
      default:         return '';
    }
  }
  kycStatusLabel(status: string): string {
    switch (status) {
      case 'verified': return '✓ Verified';
      case 'approved': return '✓ Approved';
      case 'pending':  return '⏳ Pending Upload';
      case 'rejected': return '✕ Rejected';
      default:         return status;
    }
  }

  // ── Employment ────────────────────────────────────────────────────────────────
  saveEmployment(): void {
    this.employmentOriginal = { ...this.employment };
    this.showToast('success', 'Employment information saved');
  }
  cancelEmployment(): void { this.employment = { ...this.employmentOriginal }; }

  // ── Emergency ─────────────────────────────────────────────────────────────────
  saveEmergency(): void {
    this.emergencyOriginal = { ...this.emergency };
    this.showToast('success', 'Emergency contact updated');
  }
  cancelEmergency(): void { this.emergency = { ...this.emergencyOriginal }; }

  // ── Preferences ───────────────────────────────────────────────────────────────
  savePreferences(): void {
    this.prefsOriginal = { ...this.prefs };
    this.showToast('success', 'Regional preferences saved');
  }
  cancelPreferences(): void { this.prefs = { ...this.prefsOriginal }; }

  // ── Notifications ─────────────────────────────────────────────────────────────
  saveNotifPrefs(): void {
    this.showToast('success', 'Notification preferences saved');
  }
  cancelNotifPrefs(): void {}

  // ── Security ──────────────────────────────────────────────────────────────────
  onPasswordInput(): void {
    const pw = this.security.newPassword;
    let score = 0;
    if (pw.length >= 8)              score++;
    if (/[A-Z]/.test(pw))           score++;
    if (/[0-9]/.test(pw))           score++;
    if (/[^A-Za-z0-9]/.test(pw))   score++;
    this.passwordStrength = score;
    const labels: Record<number, string> = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };
    const classes: Record<number, string> = { 0: '', 1: 'strength--weak', 2: 'strength--fair', 3: 'strength--good', 4: 'strength--strong' };
    this.passwordStrengthLabel = labels[score];
    this.passwordStrengthClass = classes[score];
  }

  savePassword(): void {
    if (!this.security.currentPassword) { this.showToast('warning', 'Please enter your current password'); return; }
    if (this.security.newPassword.length < 8) { this.showToast('warning', 'New password must be at least 8 characters'); return; }
    if (this.security.newPassword !== this.security.confirmPassword) { this.showToast('danger', 'Passwords do not match'); return; }
    this.security.currentPassword = '';
    this.security.newPassword     = '';
    this.security.confirmPassword = '';
    this.passwordStrength = 0;
    this.showToast('success', 'Password changed successfully');
  }
  cancelPassword(): void {
    this.security.currentPassword = '';
    this.security.newPassword     = '';
    this.security.confirmPassword = '';
    this.passwordStrength = 0;
  }

  toggleTwoFA(): void {
    this.showTwoFAModal = false;
    this.security.twoFAEnabled = !this.security.twoFAEnabled;
    this.showToast('success', `Two-Factor Authentication ${this.security.twoFAEnabled ? 'enabled' : 'disabled'}`);
  }

  revokeSession(index: number): void {
    this.sessions.splice(index, 1);
    this.showToast('success', 'Session revoked');
  }

  downloadData(): void {
    this.showDownloadModal = false;
    this.showToast('success', 'Data export request received. You will receive an email within 24 hours.');
  }

  confirmCloseAccount(): void {
    this.showCloseAccountModal = false;
    this.showToast('info', 'Account closure request submitted. Our team will contact you within 2 business days.');
  }

  // ── Support ───────────────────────────────────────────────────────────────────
  openSendMsgModal(): void {
    this.supportMsgSubject  = '';
    this.supportMsgBody     = '';
    this.supportMsgPriority = 'Normal';
    this.showSendMsgModal   = true;
  }

  sendSupportMessage(): void {
    if (!this.supportMsgSubject.trim() || !this.supportMsgBody.trim()) {
      this.showToast('warning', 'Please fill in subject and message');
      return;
    }
    this.showSendMsgModal = false;
    this.showToast('success', 'Support message sent. Our team will respond shortly.');
  }

  // ── Toast ─────────────────────────────────────────────────────────────────────
  showToast(type: ToastMsg['type'], message: string): void {
    const id = ++this.toastCounter;
    this.toasts.push({ id, type, message });
    setTimeout(() => this.removeToast(id), 4500);
  }
  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────────
  get initials(): string {
    const f = this.profile.firstName?.[0] ?? '';
    const l = this.profile.lastName?.[0] ?? '';
    return (f + l).toUpperCase();
  }

  get passwordStrengthWidth(): string {
    return `${(this.passwordStrength / 4) * 100}%`;
  }
}
