import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ─── Interfaces ─── */
interface MemberProfile {
  fullName: string; firstName: string; middleName: string; lastName: string;
  initials: string; memberNo: string; memberSince: string; lastLogin: string;
  status: 'Active' | 'Inactive' | 'Pending'; memberCategory: string;
  shareCert: string; regFeePaid: boolean;
}
interface PersonalInfo {
  fullName: string; dob: string; age: number; gender: string;
  nationalId: string; kraPin: string; nationality: string; maritalStatus: string;
}
interface ContactInfo {
  primaryPhone: string; secondaryPhone: string; email: string;
  postalAddress: string; physicalAddress: string; county: string;
}
interface EmploymentInfo {
  employer: string; employeeNo: string; department: string; position: string;
  employmentType: string; monthlySalary: number; yearsEmployed: number; employerPhone: string;
}
interface Beneficiary {
  initials: string; name: string; relationship: string; idNumber: string;
  phone: string; allocation: number; isPrimary: boolean; color: string; borderColor: string;
}
interface BankAccount {
  type: 'mpesa' | 'airtel' | 'bank'; name: string; provider: string;
  number: string; accountName: string; branch?: string;
  isDefault: boolean; isVerified: boolean; color: string; borderColor: string; icon: string;
}
interface Document {
  id: string; name: string; description: string;
  status: 'verified' | 'missing' | 'under_review' | 'rejected';
  icon: string; color: string; borderColor: string; bgColor: string;
}
interface Session {
  device: string; browser: string; location: string; time: string; isCurrent: boolean;
}
interface LoginRecord {
  date: string; browser: string; device: string; location: string; status: 'success' | 'failed';
}
interface ActivityRecord {
  icon: string; iconColor: string; iconBg: string; title: string; detail: string;
}
interface HealthMetric {
  label: string; score: number; maxScore: number; color: string; detail: string;
}
interface Toast {
  id: number; message: string; type: 'success' | 'warning' | 'danger' | 'info' | 'primary';
}
interface NotificationItem {
  icon: string; iconColor: string; iconBg: string; title: string; detail: string;
  isUnread: boolean; action: () => void;
}
interface KpiItem {
  label: string; value: string; color: string; link?: string; subtext?: string; subIcon?: string;
}

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './member-profile.html',
  styleUrls: ['./member-profile.scss']
})
export class MemberProfileComponent implements OnInit {
  activeTab: 'personal' | 'contact' | 'employment' | 'nok' | 'banking' | 'docs' | 'security' = 'personal';

  showEditPersonal = false; showEditContact = false; showEditEmployment = false;
  showEditNok = false; showEditBank = false; showChangePass = false; showChangePin = false;
  showMissingItems = false; showHealth = false; showActivity = false;
  showNotif = false; showLogout = false;

  profile: MemberProfile = {
    fullName: 'Dan D. Limo', firstName: 'Dan', middleName: ' D.', lastName: 'Mwangi',
    initials: 'JK', memberNo: 'MEM-2024-0045', memberSince: 'Jan 15, 2024',
    lastLogin: '2 hours ago', status: 'Active', memberCategory: 'Regular Member',
    shareCert: 'SC-2024-0045', regFeePaid: true
  };

  personal: PersonalInfo = {
    fullName: 'Dan  D. Mwangi', dob: 'March 15, 1990', age: 34, gender: 'Male',
    nationalId: '34567***21', kraPin: '', nationality: 'Kenyan', maritalStatus: 'Married'
  };

  contact: ContactInfo = {
    primaryPhone: '0712 345 890', secondaryPhone: '0733 456 789',
    email: 'j. D.@email.com', postalAddress: 'P.O. Box 12345-00100, Nairobi',
    physicalAddress: 'Westlands, Nairobi', county: 'Nairobi'
  };

  employment: EmploymentInfo = {
    employer: 'Safaricom PLC', employeeNo: 'EMP-78432', department: 'Engineering',
    position: 'Senior Developer', employmentType: 'Permanent', monthlySalary: 120000,
    yearsEmployed: 5, employerPhone: '0722 000 000'
  };

  beneficiaries: Beneficiary[] = [
    { initials: 'JK', name: 'Jane  D.', relationship: 'Spouse', idNumber: '2876****45',
      phone: '0722 111 222', allocation: 70, isPrimary: true,
      color: 'var(--red)', borderColor: 'rgba(229,57,53,0.18)' },
    { initials: 'PK', name: 'Peter  D.', relationship: 'Brother', idNumber: '3456****78',
      phone: '0711 333 444', allocation: 30, isPrimary: false,
      color: 'var(--blu)', borderColor: 'rgba(2,136,209,0.18)' }
  ];

  bankAccounts: BankAccount[] = [
    { type: 'mpesa', name: 'M-Pesa', provider: 'Safaricom', number: '0712 345 890',
      accountName: 'Dan  D.', isDefault: true, isVerified: true,
      color: 'var(--grn)', borderColor: 'rgba(0,200,83,0.15)', icon: 'fa-mobile-alt' },
    { type: 'bank', name: 'Co-operative Bank', provider: 'Nairobi Main', number: '0110028***4321',
      accountName: 'Dan  D. MWANGI', branch: 'Nairobi Main', isDefault: false, isVerified: true,
      color: 'var(--blu)', borderColor: 'rgba(2,136,209,0.15)', icon: 'fa-university' }
  ];

  documents: Document[] = [
    { id: 'nationalId', name: 'National ID', description: 'Front & Back', status: 'verified',
      icon: 'fa-id-card', color: 'var(--grn)', borderColor: 'rgba(0,200,83,0.25)', bgColor: 'rgba(0,200,83,0.03)' },
    { id: 'passport', name: 'Passport Photo', description: 'Recent photo', status: 'verified',
      icon: 'fa-portrait', color: 'var(--grn)', borderColor: 'rgba(0,200,83,0.25)', bgColor: 'rgba(0,200,83,0.03)' },
    { id: 'kra', name: 'KRA PIN Certificate', description: 'Tax compliance', status: 'missing',
      icon: 'fa-file-invoice', color: 'var(--ylw)', borderColor: 'rgba(249,168,37,0.20)', bgColor: 'rgba(249,168,37,0.10)' },
    { id: 'payslip', name: 'Latest Pay Slip', description: 'Employment proof', status: 'verified',
      icon: 'fa-money-bill-wave', color: 'var(--grn)', borderColor: 'rgba(0,200,83,0.25)', bgColor: 'rgba(0,200,83,0.03)' },
    { id: 'bankStmt', name: 'Bank Statement', description: 'Last 3 months', status: 'missing',
      icon: 'fa-file-invoice-dollar', color: 'var(--ylw)', borderColor: 'rgba(249,168,37,0.20)', bgColor: 'rgba(249,168,37,0.10)' },
    { id: 'empLetter', name: 'Employment Letter', description: 'Confirmation', status: 'missing',
      icon: 'fa-envelope-open-text', color: 'var(--ylw)', borderColor: 'rgba(249,168,37,0.20)', bgColor: 'rgba(249,168,37,0.10)' }
  ];

  sessions: Session[] = [
    { device: 'Chrome', browser: 'Windows', location: 'Nairobi, KE', time: 'Now', isCurrent: true },
    { device: 'Safari', browser: 'iPhone', location: 'Nairobi', time: '2 days ago', isCurrent: false }
  ];

  loginHistory: LoginRecord[] = [
    { date: 'Feb 25, 2025 10:30 AM', browser: 'Chrome', device: 'Windows', location: 'Nairobi', status: 'success' },
    { date: 'Feb 24, 2025 3:15 PM', browser: 'Safari', device: 'iPhone', location: 'Nairobi', status: 'success' },
    { date: 'Feb 22, 2025 9:00 AM', browser: 'Chrome', device: 'Windows', location: 'Nairobi', status: 'success' }
  ];

  activities: ActivityRecord[] = [
    { icon: 'fa-sign-in-alt', iconColor: 'var(--grn)', iconBg: 'rgba(0,200,83,0.08)', title: 'Login', detail: 'Chrome — Windows • Feb 25, 10:30 AM' },
    { icon: 'fa-edit', iconColor: 'var(--pri)', iconBg: 'rgba(255,107,0,0.06)', title: 'Profile Updated', detail: 'Phone number changed • Feb 24, 4:15 PM' },
    { icon: 'fa-file-upload', iconColor: 'var(--grn)', iconBg: 'rgba(0,200,83,0.08)', title: 'Document Uploaded', detail: 'Pay slip uploaded & verified • Feb 20' },
    { icon: 'fa-key', iconColor: 'var(--ylw)', iconBg: 'rgba(249,168,37,0.08)', title: 'Password Changed', detail: 'Security update • Jan 12' },
    { icon: 'fa-university', iconColor: 'var(--blu)', iconBg: 'rgba(2,136,209,0.06)', title: 'Bank Account Added', detail: 'Co-op Bank verified • Jan 10' }
  ];

  healthMetrics: HealthMetric[] = [
    { label: 'Savings Regularity', score: 90, maxScore: 100, color: 'var(--grn)', detail: 'Excellent — 11/12 months on time' },
    { label: 'Loan Repayment', score: 75, maxScore: 100, color: 'var(--pri)', detail: 'Good — 1 late payment in 6 months' },
    { label: 'Profile Completeness', score: 78, maxScore: 100, color: 'var(--ylw)', detail: 'Missing: KRA PIN, Bank Statement, Employment Letter' },
    { label: 'Share Capital', score: 65, maxScore: 100, color: 'var(--blu)', detail: 'Avg — buy 30 more shares for premium' }
  ];

  healthTips = [
    'Upload missing documents (+10 points)',
    'Buy 30 more shares (+15 points)',
    'Pay all loans on time (+5/month)'
  ];

  kpis: KpiItem[] = [
    { label: 'Savings', value: 'KES 158,750', color: 'var(--grn)', link: '/savings' },
    { label: 'Loans Outstanding', value: 'KES 103,500', color: 'var(--red)', link: '/loans' },
    { label: 'Shares', value: '120', color: 'var(--blu)', link: '/shares' },
    { label: 'Credit Score', value: '92%', color: 'var(--grn)', subtext: 'Good', subIcon: 'fa-star' }
  ];

  /* Form Models */
  editPersonal = { firstName: 'Dan', middleName: ' D.', lastName: 'Mwangi', dob: '1990-03-15', gender: 'Male', maritalStatus: 'Married', nationalId: '34567890', kraPin: '' };
  editContact = { primaryPhone: '0712345890', secondaryPhone: '0733456789', email: 'j. D.@email.com', physicalAddress: 'Westlands, Nairobi', postalAddress: 'P.O. Box 12345-00100, Nairobi', county: 'Nairobi' };
  editEmployment = { employer: 'Safaricom PLC', employeeNo: 'EMP-78432', department: 'Engineering', position: 'Senior Developer', employmentType: 'Permanent', monthlySalary: 120000, yearsEmployed: 5 };
  editBank = { type: 'mpesa', phone: '', bankName: 'Co-operative Bank', branch: '', accountNo: '', accountName: '' };
  changePass = { current: '', newPass: '', confirm: '' };
  changePin = { current: '', newPin: '', confirm: '' };

  passStrength = 0; passStrengthLabel = 'Enter password'; passStrengthColor = 'var(--txm)';
  twoFactorEnabled = false;
  toasts: Toast[] = []; private toastId = 0;
  counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'];
  banks = ['Co-operative Bank', 'Equity Bank', 'KCB Bank', 'ABSA Bank', 'NCBA Bank'];

  get profileCompletion(): number {
    const total = this.documents.length;
    const verified = this.documents.filter(d => d.status === 'verified').length;
    return Math.round((verified / total) * 100);
  }
  get missingDocsCount(): number { return this.documents.filter(d => d.status === 'missing').length; }
  get healthScore(): number {
    const total = this.healthMetrics.reduce((sum, m) => sum + m.score, 0);
    return Math.round(total / this.healthMetrics.length);
  }
  get healthLabel(): string {
    const s = this.healthScore; if (s >= 85) return 'Excellent'; if (s >= 70) return 'Good'; if (s >= 50) return 'Fair'; return 'Poor';
  }
  get healthColor(): string {
    const s = this.healthScore; if (s >= 85) return 'var(--grn)'; if (s >= 70) return 'var(--pri)'; if (s >= 50) return 'var(--ylw)'; return 'var(--red)';
  }
  get healthDashOffset(): number {
    const circumference = 2 * Math.PI * 42;
    return circumference - (this.healthScore / 100) * circumference;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.showToast('Profile 78% complete. Upload 3 missing documents to unlock higher loan limits.', 'warning');
    }, 800);
  }

  setTab(tab: typeof this.activeTab): void { this.activeTab = tab; }

  openModal(name: string): void {
    switch (name) {
      case 'editPersonal': this.showEditPersonal = true; break;
      case 'editContact': this.showEditContact = true; break;
      case 'editEmployment': this.showEditEmployment = true; break;
      case 'editNok': this.showEditNok = true; break;
      case 'editBank': this.showEditBank = true; break;
      case 'changePass': this.showChangePass = true; break;
      case 'changePin': this.showChangePin = true; break;
      case 'missingItems': this.showMissingItems = true; break;
      case 'health': this.showHealth = true; break;
      case 'activity': this.showActivity = true; break;
      case 'notif': this.showNotif = true; break;
      case 'logout': this.showLogout = true; break;
    }
  }

  closeModal(name: string): void {
    switch (name) {
      case 'editPersonal': this.showEditPersonal = false; break;
      case 'editContact': this.showEditContact = false; break;
      case 'editEmployment': this.showEditEmployment = false; break;
      case 'editNok': this.showEditNok = false; break;
      case 'editBank': this.showEditBank = false; break;
      case 'changePass': this.showChangePass = false; break;
      case 'changePin': this.showChangePin = false; break;
      case 'missingItems': this.showMissingItems = false; break;
      case 'health': this.showHealth = false; break;
      case 'activity': this.showActivity = false; break;
      case 'notif': this.showNotif = false; break;
      case 'logout': this.showLogout = false; break;
    }
  }

  closeAllModals(): void {
    this.showEditPersonal = false; this.showEditContact = false; this.showEditEmployment = false;
    this.showEditNok = false; this.showEditBank = false; this.showChangePass = false;
    this.showChangePin = false; this.showMissingItems = false; this.showHealth = false;
    this.showActivity = false; this.showNotif = false; this.showLogout = false;
  }

  showToast(message: string, type: Toast['type'] = 'info'): void {
    const id = ++this.toastId; this.toasts.push({ id, message, type });
    setTimeout(() => this.removeToast(id), 5000);
  }
  removeToast(id: number): void { const i = this.toasts.findIndex(t => t.id === id); if (i > -1) this.toasts.splice(i, 1); }

  getToastIcon(type: Toast['type']): string {
    const icons: Record<string, string> = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle', primary: 'fa-bell' };
    return icons[type] || icons['info'];
  }
  getToastColor(type: Toast['type']): string {
    const colors: Record<string, string> = { success: 'var(--grn)', danger: 'var(--red)', warning: 'var(--ylw)', info: 'var(--blu)', primary: 'var(--pri)' };
    return colors[type] || colors['info'];
  }

  savePersonal(): void {
    this.personal.fullName = `${this.editPersonal.firstName}  ${this.editPersonal.middleName} ${this.editPersonal.lastName}`;
    this.personal.dob = new Date(this.editPersonal.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    this.personal.gender = this.editPersonal.gender; this.personal.maritalStatus = this.editPersonal.maritalStatus; this.personal.kraPin = this.editPersonal.kraPin;
    this.showToast('Personal information updated successfully!', 'success'); this.closeModal('editPersonal');
  }
  saveContact(): void {
    this.contact.primaryPhone = this.editContact.primaryPhone; this.contact.secondaryPhone = this.editContact.secondaryPhone;
    this.contact.email = this.editContact.email; this.contact.physicalAddress = this.editContact.physicalAddress;
    this.contact.postalAddress = this.editContact.postalAddress; this.contact.county = this.editContact.county;
    this.showToast('Contact information updated!', 'success'); this.closeModal('editContact');
  }
  saveEmployment(): void {
    this.employment.employer = this.editEmployment.employer; this.employment.employeeNo = this.editEmployment.employeeNo;
    this.employment.department = this.editEmployment.department; this.employment.position = this.editEmployment.position;
    this.employment.employmentType = this.editEmployment.employmentType; this.employment.monthlySalary = this.editEmployment.monthlySalary;
    this.employment.yearsEmployed = this.editEmployment.yearsEmployed;
    this.showToast('Employment details updated!', 'success'); this.closeModal('editEmployment');
  }
  saveNok(): void { this.showToast('Beneficiaries updated! Total allocation: 100%', 'success'); this.closeModal('editNok'); }
  saveBank(): void { this.showToast('Account saved and verified!', 'success'); this.closeModal('editBank'); }
  savePassword(): void { this.showToast('Password changed successfully!', 'success'); this.closeModal('changePass'); }
  savePin(): void { this.showToast('Transaction PIN updated!', 'success'); this.closeModal('changePin'); }

  checkPasswordStrength(): void {
    const p = this.changePass.newPass; let s = 0;
    if (p.length >= 8) s += 25; if (/[A-Z]/.test(p)) s += 25; if (/[0-9]/.test(p)) s += 25; if (/[^A-Za-z0-9]/.test(p)) s += 25;
    this.passStrength = s;
    if (s <= 25) { this.passStrengthLabel = 'Weak'; this.passStrengthColor = 'var(--red)'; }
    else if (s <= 50) { this.passStrengthLabel = 'Fair'; this.passStrengthColor = 'var(--ylw)'; }
    else if (s <= 75) { this.passStrengthLabel = 'Good'; this.passStrengthColor = 'var(--pri)'; }
    else { this.passStrengthLabel = 'Strong'; this.passStrengthColor = 'var(--grn)'; }
  }

  toggle2FA(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked; this.twoFactorEnabled = checked;
    this.showToast(checked ? '2FA enabled via SMS' : '2FA disabled', checked ? 'success' : 'warning');
  }

  terminateSession(session: Session): void {
    this.sessions = this.sessions.filter(s => s !== session); this.showToast('Session terminated', 'warning');
  }

  onDocUpload(docId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const doc = this.documents.find(d => d.id === docId);
      if (doc) {
        if (docId === 'kra') {
          doc.status = 'under_review'; doc.color = 'var(--blu)'; doc.borderColor = 'rgba(2,136,209,0.18)'; doc.bgColor = 'rgba(2,136,209,0.06)';
          this.showToast('KRA PIN uploaded! Under review.', 'success');
        } else {
          doc.status = 'verified'; doc.color = 'var(--grn)'; doc.borderColor = 'rgba(0,200,83,0.25)'; doc.bgColor = 'rgba(0,200,83,0.03)';
          this.showToast(`${doc.name} uploaded!`, 'success');
        }
      }
    }
  }
  onDocClick(doc: Document): void { if (doc.status === 'verified') { this.showToast(`${doc.name}: Verified ✓`, 'success'); } }

  setDefaultBank(account: BankAccount): void {
    this.bankAccounts.forEach(a => a.isDefault = false); account.isDefault = true;
    this.showToast(`${account.name} set as default withdrawal method`, 'success');
  }
  removeBankAccount(account: BankAccount): void {
    this.bankAccounts = this.bankAccounts.filter(a => a !== account); this.showToast('Bank account removed', 'warning');
  }

  onAvatarUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) { this.showToast('Profile photo updated successfully!', 'success'); }
  }

  goToDocsFromHealth(): void { this.closeModal('health'); this.activeTab = 'docs'; }

  triggerDocUpload(docId: string): void {
    this.closeModal('missingItems');
    setTimeout(() => {
      const input = document.getElementById(docId + 'Input') as HTMLInputElement;
      if (input) input.click();
    }, 300);
  }

  stopPropagation(event: Event): void { event.stopPropagation(); }
}