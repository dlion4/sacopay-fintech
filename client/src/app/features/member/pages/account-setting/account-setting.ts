import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ═══════════════════════════════════════════════════════════════
   INTERFACES
   ═══════════════════════════════════════════════════════════════ */

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  address: string;
  county: string;
  postalCode: string;
}

interface EmploymentData {
  employerName: string;
  jobTitle: string;
  monthlyIncome: number;
  payrollNumber: string;
  employmentType: string;
  yearsAtJob: number;
  employerContact: string;
}

interface EmergencyData {
  contactName: string;
  relationship: string;
  phone: string;
  altPhone: string;
}

interface PreferencesData {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
}

interface KycItem {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  badgeClass: string;
  badgeIcon: string;
  canUpload: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  disabled: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  priority: string;
  priorityClass: string;
  status: string;
  statusClass: string;
}

interface Toast {
  id: number;
  message: string;
  type: string;
  icon: string;
}

interface PasswordStrength {
  width: number;
  color: string;
  label: string;
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-setting.html',
  styleUrls: ['./account-setting.scss']
})
export class AccountSettingsComponent {

  /* ─── Active Tab ─── */
  activeTab: string = 'profile';

  /* ─── Dropdown Options ─── */
  counties: string[] = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos'];
  employmentTypes: string[] = ['Permanent & Pensionable', 'Contract', 'Casual', 'Self-Employed', 'Retired'];
  relationships: string[] = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other'];
  languages: string[] = ['English (Kenya)', 'Swahili', 'English (US)', 'English (UK)'];
  currencies: string[] = ['KES – Kenyan Shilling', 'USD – US Dollar', 'EUR – Euro', 'GBP – British Pound'];
  timezones: string[] = ['Africa/Nairobi (GMT+3)', 'Africa/Lagos (GMT+1)', 'Europe/London (GMT+0)', 'America/New_York (GMT-5)'];
  dateFormats: string[] = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'D MMM YYYY'];

  /* ─── Profile Data ─── */
  profile: ProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@enterprise-email.com',
    phone: '+254 712 345 678',
    nationalId: '12345678',
    dateOfBirth: '1985-04-15',
    address: 'P.O Box 12345, Nairobi',
    county: 'Nairobi',
    postalCode: '00100'
  };

  private originalProfile: ProfileData = { ...this.profile };

  /* ─── Employment Data ─── */
  employment: EmploymentData = {
    employerName: 'Kenya Revenue Authority',
    jobTitle: 'Senior Tax Analyst',
    monthlyIncome: 125000,
    payrollNumber: 'KRA-0042891',
    employmentType: 'Permanent & Pensionable',
    yearsAtJob: 7,
    employerContact: '+254 722 000 111'
  };

  private originalEmployment: EmploymentData = { ...this.employment };

  /* ─── Emergency Data ─── */
  emergency: EmergencyData = {
    contactName: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+254 723 456 789',
    altPhone: '+254 700 987 654'
  };

  private originalEmergency: EmergencyData = { ...this.emergency };

  /* ─── Preferences Data ─── */
  preferences: PreferencesData = {
    language: 'English (Kenya)',
    currency: 'KES – Kenyan Shilling',
    timezone: 'Africa/Nairobi (GMT+3)',
    dateFormat: 'DD/MM/YYYY'
  };

  private originalPreferences: PreferencesData = { ...this.preferences };

  /* ─── KYC Items ─── */
  kycItems: KycItem[] = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'National ID verified with Huduma Center on 12 Mar 2023',
      badgeText: 'Verified',
      badgeClass: 'verified',
      badgeIcon: 'bi-check-circle-fill',
      canUpload: false
    },
    {
      id: 'address',
      title: 'Address Verification',
      description: 'Utility bill uploaded and approved on 15 Mar 2023',
      badgeText: 'Verified',
      badgeClass: 'verified',
      badgeIcon: 'bi-check-circle-fill',
      canUpload: false
    },
    {
      id: 'kra',
      title: 'Tax PIN (KRA)',
      description: 'Required for dividend withholding tax compliance',
      badgeText: 'Pending Upload',
      badgeClass: 'pending',
      badgeIcon: 'bi-clock-fill',
      canUpload: true
    },
    {
      id: 'photo',
      title: 'Passport Photo',
      description: 'Recent passport-size photo for member card',
      badgeText: 'Approved',
      badgeClass: 'approved',
      badgeIcon: 'bi-image',
      canUpload: false
    }
  ];

  /* ─── Email Notifications ─── */
  emailNotifications: NotificationItem[] = [
    {
      id: 'notifEmailTxn',
      title: 'Transaction Alerts',
      description: 'Receive email when deposits, withdrawals or repayments are processed.',
      enabled: true,
      disabled: false
    },
    {
      id: 'notifEmailLoan',
      title: 'Loan Status Updates',
      description: 'Email when your loan application changes status.',
      enabled: true,
      disabled: false
    },
    {
      id: 'notifEmailDiv',
      title: 'Dividend Declarations',
      description: 'Email when the board declares dividends or share earnings.',
      enabled: false,
      disabled: false
    },
    {
      id: 'notifEmailStmt',
      title: 'Monthly Statements',
      description: 'Receive your monthly account statement via email.',
      enabled: true,
      disabled: false
    }
  ];

  private originalEmailNotifications: NotificationItem[] = JSON.parse(JSON.stringify(this.emailNotifications));

  /* ─── SMS Notifications ─── */
  smsNotifications: NotificationItem[] = [
    {
      id: 'notifSmsRemind',
      title: 'Payment Reminders',
      description: 'SMS reminders 5 days before each loan installment is due.',
      enabled: true,
      disabled: false
    },
    {
      id: 'notifSmsOtp',
      title: 'OTP & Security Codes',
      description: 'Always on – required for login and sensitive actions.',
      enabled: true,
      disabled: true
    },
    {
      id: 'notifSmsAgm',
      title: 'AGM & Sacco Announcements',
      description: 'SMS alerts for meetings, AGM dates, and official announcements.',
      enabled: false,
      disabled: false
    }
  ];

  private originalSmsNotifications: NotificationItem[] = JSON.parse(JSON.stringify(this.smsNotifications));

  /* ─── Security Data ─── */
  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  passStrength: PasswordStrength = {
    width: 0,
    color: 'var(--border-medium)',
    label: ''
  };

  activeSessions: number = 2;

  /* ─── Support Tickets ─── */
  supportTickets: SupportTicket[] = [
    {
      id: '#TK-2024-089',
      subject: 'M-Pesa payment not reflecting on portal log',
      priority: 'Urgent',
      priorityClass: 'ticket-priority-urgent',
      status: 'Processing',
      statusClass: 'ticket-status-processing'
    },
    {
      id: '#TK-2024-085',
      subject: 'Loan portfolio archival extraction validation',
      priority: 'Low',
      priorityClass: 'ticket-priority-low',
      status: 'Closed',
      statusClass: 'ticket-status-closed'
    }
  ];

  /* ─── Toast System ─── */
  toasts: Toast[] = [];
  private toastIdCounter: number = 0;

  /* ═══════════════════════════════════════════════════════════════
     TAB NAVIGATION
     ═══════════════════════════════════════════════════════════════ */

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  /* ═══════════════════════════════════════════════════════════════
     PROFILE ACTIONS
     ═══════════════════════════════════════════════════════════════ */

  saveProfile(): void {
    this.originalProfile = { ...this.profile };
    this.showToast('Personal information saved successfully.', 'success');
  }

  resetProfile(): void {
    this.profile = { ...this.originalProfile };
    this.showToast('Profile changes discarded.', 'info');
  }

  uploadKyc(id: string): void {
    const item = this.kycItems.find(k => k.id === id);
    if (item) {
      this.showToast(`Upload dialog opened for ${item.title}.`, 'info');
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     EMPLOYMENT ACTIONS
     ═══════════════════════════════════════════════════════════════ */

  saveEmployment(): void {
    this.originalEmployment = { ...this.employment };
    this.showToast('Employment details saved successfully.', 'success');
  }

  resetEmployment(): void {
    this.employment = { ...this.originalEmployment };
    this.showToast('Employment changes discarded.', 'info');
  }

  /* ═══════════════════════════════════════════════════════════════
     EMERGENCY ACTIONS
     ═══════════════════════════════════════════════════════════════ */

  saveEmergency(): void {
    this.originalEmergency = { ...this.emergency };
    this.showToast('Emergency contact saved successfully.', 'success');
  }

  resetEmergency(): void {
    this.emergency = { ...this.originalEmergency };
    this.showToast('Emergency contact changes discarded.', 'info');
  }

  /* ═══════════════════════════════════════════════════════════════
     PREFERENCES ACTIONS
     ═══════════════════════════════════════════════════════════════ */

  savePreferences(): void {
    this.originalPreferences = { ...this.preferences };
    this.showToast('Regional preferences saved.', 'success');
  }

  resetPreferences(): void {
    this.preferences = { ...this.originalPreferences };
    this.showToast('Preference changes discarded.', 'info');
  }

  /* ═══════════════════════════════════════════════════════════════
     NOTIFICATIONS ACTIONS
     ═══════════════════════════════════════════════════════════════ */

  saveNotifications(): void {
    this.originalEmailNotifications = JSON.parse(JSON.stringify(this.emailNotifications));
    this.originalSmsNotifications = JSON.parse(JSON.stringify(this.smsNotifications));
    this.showToast('Notification preferences saved.', 'success');
  }

  resetNotifications(): void {
    this.emailNotifications = JSON.parse(JSON.stringify(this.originalEmailNotifications));
    this.smsNotifications = JSON.parse(JSON.stringify(this.originalSmsNotifications));
    this.showToast('Notification changes discarded.', 'info');
  }

  /* ═══════════════════════════════════════════════════════════════
     SECURITY ACTIONS
     ═══════════════════════════════════════════════════════════════ */

  checkPasswordStrength(): void {
    const v = this.security.newPassword;
    let score = 0;

    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const levels: PasswordStrength[] = [
      { width: 0, color: 'var(--border-medium)', label: '' },
      { width: 25, color: 'var(--danger)', label: 'Weak' },
      { width: 50, color: '#f97316', label: 'Fair' },
      { width: 75, color: 'var(--warning)', label: 'Good' },
      { width: 100, color: 'var(--success)', label: 'Strong' }
    ];

    this.passStrength = v.length === 0 ? levels[0] : levels[score];
  }

  updatePassword(): void {
    if (!this.security.currentPassword) {
      this.showToast('Please enter your current password.', 'warning');
      return;
    }
    if (this.security.newPassword.length < 8) {
      this.showToast('New password must be at least 8 characters.', 'warning');
      return;
    }
    if (this.security.newPassword !== this.security.confirmPassword) {
      this.showToast('New passwords do not match.', 'danger');
      return;
    }

    this.security.currentPassword = '';
    this.security.newPassword = '';
    this.security.confirmPassword = '';
    this.passStrength = { width: 0, color: 'var(--border-medium)', label: '' };
    this.showToast('Password changed successfully.', 'success');
  }

  resetPassword(): void {
    this.security.currentPassword = '';
    this.security.newPassword = '';
    this.security.confirmPassword = '';
    this.passStrength = { width: 0, color: 'var(--border-medium)', label: '' };
    this.showToast('Password changes discarded.', 'info');
  }

  toggle2FA(): void {
    this.showToast('2FA disable request submitted. Check your SMS.', 'warning');
  }

  signOutAll(): void {
    this.activeSessions = 0;
    this.showToast('All active sessions signed out successfully.', 'success');
  }

  viewLoginLog(): void {
    this.showToast('Opening login activity log...', 'info');
  }

  requestDataExport(): void {
    this.showToast('Data export request submitted. You will receive an email within 24hrs.', 'success');
  }

  closeAccount(): void {
    this.showToast('Account closure requires admin approval. Request submitted.', 'danger');
  }

  /* ═══════════════════════════════════════════════════════════════
     SUPPORT ACTIONS
     ═══════════════════════════════════════════════════════════════ */

  newTicket(): void {
    this.showToast('Redirecting to new ticket form...', 'info');
  }

  /* ═══════════════════════════════════════════════════════════════
     TOAST SYSTEM
     ═══════════════════════════════════════════════════════════════ */

  showToast(message: string, type: string = 'success'): void {
    const icons: Record<string, string> = {
      success: 'bi-check-circle-fill',
      info: 'bi-info-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      danger: 'bi-x-circle-fill',
      primary: 'bi-bell-fill'
    };

    const toast: Toast = {
      id: ++this.toastIdCounter,
      message,
      type,
      icon: icons[type] || icons['success']
    };

    this.toasts.push(toast);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, 3200);
  }

  removeToast(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  }
}