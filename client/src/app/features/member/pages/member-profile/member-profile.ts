import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type TabKey = 'personal' | 'contact' | 'employment' | 'nextofkin' | 'banking' | 'documents' | 'security';
export type ModalKey =
  | 'editPersonal' | 'editContact' | 'editEmployment' | 'editNextOfKin'
  | 'addAccount' | 'editAccount' | 'addBeneficiary' | 'addKra' | 'editProfile'
  | 'changePassword' | 'changePin' | 'activityLog' | 'settings'
  | 'uploadDoc' | 'viewDoc' | 'deleteAccount' | 'revokeSession' | 'accountHealth';

export interface Beneficiary { initials: string; name: string; type: string; pct: number; relationship: string; idNo: string; phone: string; }
export interface BankAccount { icon: string; name: string; sub: string; badge: string; badgeCls: string; rows: [string, string][]; canDelete: boolean; }
export interface Doc { name: string; status: string; date: string; }
export interface Session { icon: string; device: string; location: string; current: boolean; }
export interface LoginEntry { date: string; info: string; }

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-profile.html',
  styleUrls: ['./member-profile.scss'],
})
export class MemberProfileComponent {
  activeTab: TabKey = 'personal';
  activeModal: ModalKey | null = null;
  toast: { message: string; type: string } | null = null;
  private toastTimer: any;

  tabs: { key: TabKey; icon: string; label: string }[] = [
    { key: 'personal', icon: '👤', label: 'Personal' },
    { key: 'contact', icon: '📞', label: 'Contact' },
    { key: 'employment', icon: '🏢', label: 'Employment' },
    { key: 'nextofkin', icon: '❤️', label: 'Next of Kin' },
    { key: 'banking', icon: '🏦', label: 'Banking' },
    { key: 'documents', icon: '📄', label: 'Documents' },
    { key: 'security', icon: '🔒', label: 'Security' },
  ];

  /* ─── Personal ─── */
  personal = {
    fullName: 'Dan D. Mwangi', dob: 'March 15, 1990', dobAge: '34 years',
    gender: 'Male', nationalId: '34567**21', kraPin: '', nationality: 'Kenyan', maritalStatus: 'Married',
  };
  editPersonalForm = { ...this.personal };

  /* ─── Contact ─── */
  contact = {
    phone1: '0712 345 890', phone1Verified: true,
    phone2: '0733 456 789',
    email: 'j.D.@email.com', emailVerified: true,
    postal: 'P.O. Box 12345-00100, Nairobi',
    physical: 'Westlands, Nairobi', county: 'Nairobi',
  };
  editContactForm = { ...this.contact };

  /* ─── Employment ─── */
  employment = {
    employer: 'Safaricom PLC', employeeNo: 'EMP-78432',
    department: 'Engineering', position: 'Senior Developer',
    type: 'Permanent', salary: '120000', years: '5', employerPhone: '0722 000 000',
  };
  editEmploymentForm = { ...this.employment };

  /* ─── Next of Kin ─── */
  beneficiaries: Beneficiary[] = [
    { initials: 'JK', name: 'Jane D.', type: 'Primary', pct: 70, relationship: 'Spouse', idNo: '2876****45', phone: '0722 111 222' },
    { initials: 'PK', name: 'Peter D.', type: 'Secondary', pct: 30, relationship: 'Brother', idNo: '3456****78', phone: '0711 333 444' },
  ];
  editBeneficiaries: { name: string; relationship: string; phone: string; pct: number }[] = [];

  /* ─── Banking ─── */
  accounts: BankAccount[] = [
    { icon: '📱', name: 'M-Pesa', sub: 'Safaricom', badge: '✓ Default', badgeCls: 'ok', rows: [['Number', '0712 345 890'], ['Name', 'Dan D.']], canDelete: false },
    { icon: '🏦', name: 'Co-operative Bank', sub: 'Nairobi Main', badge: '✓ Verified', badgeCls: 'info', rows: [['Account No.', '0110028**4321'], ['Account Name', 'Dan D. MWANGI']], canDelete: true },
  ];
  accountForm = { type: 'mpesa', number: '0712 345 890' };
  editingAccountIdx = -1;

  /* ─── Documents ─── */
  documents: Doc[] = [
    { name: 'National ID (Front)', status: 'Verified', date: 'Jan 15, 2024' },
    { name: 'National ID (Back)', status: 'Verified', date: 'Jan 15, 2024' },
    { name: 'KRA PIN Certificate', status: 'Missing', date: '' },
    { name: 'Passport Photo', status: 'Uploaded', date: 'Jan 16, 2024' },
    { name: 'Proof of Residence', status: 'Missing', date: '' },
  ];

  /* ─── Security ─── */
  twoFactorEnabled = false;
  sessions: Session[] = [
    { icon: '💻', device: 'Chrome — Windows', location: 'Nairobi, KE • Now', current: true },
    { icon: '📱', device: 'Safari — iPhone', location: 'Nairobi • 2 days ago', current: false },
  ];
  loginHistory: LoginEntry[] = [
    { date: 'Feb 25, 2025 10:30 AM', info: 'Chrome — Windows — Nairobi' },
    { date: 'Feb 24, 2025 3:15 PM', info: 'Safari — iPhone — Nairobi' },
    { date: 'Feb 22, 2025 9:00 AM', info: 'Chrome — Windows — Nairobi' },
  ];
  selectedSession: Session | null = null;

  /* ─── Profile hero edit form ─── */
  profileForm = { name: 'Dan D. limo', photo: '' };

  /* ─── Membership sidebar ─── */
  membership = [
    ['Member No.', 'MEM-2024-0045', 'mono'],
    ['Since', 'Jan 15, 2024', ''],
    ['Category', 'Regular', ''],
    ['Share Cert.', 'SC-2024-0045', 'mono'],
    ['Reg Fee', '✓ Paid', 'pill-ok'],
    ['Status', '● Active', 'pill-active'],
  ];
  health = [
    { label: 'Savings', score: 90, color: 'green' },
    { label: 'Repayment', score: 75, color: 'blue' },
    { label: 'Profile', score: 78, color: 'orange' },
  ];

  /* ─── Modal helpers ─── */
  openModal(key: ModalKey): void {
    if (key === 'editPersonal') this.editPersonalForm = { ...this.personal };
    if (key === 'editContact') this.editContactForm = { ...this.contact };
    if (key === 'editEmployment') this.editEmploymentForm = { ...this.employment };
    if (key === 'editNextOfKin') this.editBeneficiaries = this.beneficiaries.map(b => ({ name: b.name, relationship: b.relationship, phone: b.phone, pct: b.pct }));
    if (key === 'addAccount') { this.accountForm = { type: '', number: '' }; this.editingAccountIdx = -1; }
    this.activeModal = key;
    document.body.style.overflow = 'hidden';
  }
  closeModal(): void {
    this.activeModal = null;
    this.selectedSession = null;
    document.body.style.overflow = '';
  }

  /* ─── Saves ─── */
  savePersonal(): void { Object.assign(this.personal, this.editPersonalForm); this.closeModal(); this.showToast('Personal information updated.'); }
  saveContact(): void { Object.assign(this.contact, this.editContactForm); this.closeModal(); this.showToast('Contact information updated.'); }
  saveEmployment(): void { Object.assign(this.employment, this.editEmploymentForm); this.closeModal(); this.showToast('Employment details updated.'); }
  saveNextOfKin(): void {
    this.beneficiaries = this.editBeneficiaries.map((b, i) => ({
      initials: b.name.split(' ').map(w => w[0]).join('').toUpperCase(),
      name: b.name, type: i === 0 ? 'Primary' : 'Secondary', pct: b.pct,
      relationship: b.relationship, idNo: '****', phone: b.phone,
    }));
    this.closeModal(); this.showToast('Beneficiaries updated.');
  }
  addBeneficiaryRow(): void { this.editBeneficiaries.push({ name: '', relationship: '', phone: '', pct: 0 }); }
  saveAccount(): void { this.closeModal(); this.showToast('Account saved.'); }
  saveKra(): void { this.closeModal(); this.showToast('KRA PIN added.'); }
  saveProfile(): void { this.closeModal(); this.showToast('Profile photo updated.'); }
  changePassword(): void { this.closeModal(); this.showToast('Password changed successfully.'); }
  changePin(): void { this.closeModal(); this.showToast('Transaction PIN changed.'); }
  confirmDeleteAccount(): void { this.closeModal(); this.showToast('Account removed.', 'info'); }
  confirmRevokeSession(): void { this.closeModal(); this.showToast('Session revoked.', 'info'); }
  uploadDoc(): void { this.closeModal(); this.showToast('Document uploaded.'); }

  editAccountAt(idx: number): void {
    this.editingAccountIdx = idx;
    const a = this.accounts[idx];
    this.accountForm = { type: a.name === 'M-Pesa' ? 'mpesa' : 'bank', number: a.rows[0][1] };
    this.openModal('editAccount');
  }
  deleteAccountAt(idx: number): void { this.editingAccountIdx = idx; this.openModal('deleteAccount'); }
  revokeSession(s: Session): void { this.selectedSession = s; this.openModal('revokeSession'); }

  /* ─── Toast ─── */
  showToast(message: string, type = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3200);
  }
  dismissToast(): void { this.toast = null; }
  trackByIdx(i: number): number { return i; }
}
