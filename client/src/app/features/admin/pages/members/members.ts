import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type MemberStatus = 'active' | 'pending' | 'suspended' | 'dormant';
type ViewMode = 'table' | 'grid';
type RegistrationTab = 'personal' | 'financial' | 'documents';
type DetailTab = 'overview' | 'shares' | 'loans' | 'savings' | 'activity';
type ModalName =
  | 'addMember'
  | 'memberDetail'
  | 'editMember'
  | 'pendingDetail'
  | 'rejectPending'
  | 'deleteConfirm'
  | 'export'
  | 'bulkImport'
  | 'message'
  | 'statement'
  | 'bulkConfirm'
  | null;

interface Member {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  nationalId: string;
  phone: string;
  email: string;
  branch: string;
  shares: number;
  shareAmount: number;
  status: MemberStatus;
  joinDate: string;
  gender: string;
  occupation: string;
  savingsBalance: number;
  loanBalance: number;
  walletBalance: number;
  lastActivity: string;
}

interface PendingMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  nationalId: string;
  phone: string;
  email: string;
  appliedDate: string;
  branch: string;
  docsComplete: boolean;
  notes: string;
}

interface NewMemberForm {
  firstName: string;
  middleName: string;
  lastName: string;
  nationalId: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  phone: string;
  email: string;
  address: string;
  branch: string;
  occupation: string;
  employer: string;
  incomeRange: string;
  initialShares: number | null;
  kinName: string;
  kinPhone: string;
  kinRelationship: string;
  paymentMethod: string;
  termsAccepted: boolean;
}

interface ActivityItem {
  text: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface Toast {
  visible: boolean;
  type: 'success' | 'danger' | 'warning' | 'info';
  title: string;
  message: string;
}

interface UploadState {
  nationalId: boolean;
  photo: boolean;
  kra: boolean;
  residence: boolean;
}

@Component({
  selector: 'app-members-all',
  standalone: true,
  // imports: [CommonModule, FormsModule, DecimalPipe, TitleCasePipe],
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './members.html',
  styleUrls: ['./members.scss'],
})
export class MembersAllComponent implements OnInit {
  toast: Toast = { visible: false, type: 'success', title: '', message: '' };
  private toastTimer?: number;

  viewMode: ViewMode = 'table';
  activeModal: ModalName = null;
  regTab: RegistrationTab = 'personal';
  detailTab: DetailTab = 'overview';

  searchQuery = '';
  filterStatus = '';
  filterBranch = '';
  filterGender = '';
  sortField = '';
  sortAscending = true;

  selectedMembers: string[] = [];
  currentPage = 1;
  pageSize = 10;

  exportFormat: 'csv' | 'pdf' | 'json' = 'csv';
  exportScope: 'filtered' | 'selected' | 'all' = 'filtered';
  exportIncludeFinancials = true;
  exportIncludeContacts = true;

  messageChannel: 'sms' | 'email' | 'push' = 'sms';
  messageTemplate = '';
  messageSubject = '';
  messageBody = '';

  uploads: UploadState = { nationalId: false, photo: false, kra: false, residence: false };
  importFileName = '';
  importMode: 'validate' | 'import' = 'validate';

  selectedMember: Member | null = null;
  editMemberData: Member | null = null;
  pendingDetail: PendingMember | null = null;
  memberToDelete: Member | null = null;
  statementMember: Member | null = null;

  deleteConfirmText = '';
  rejectReason = '';
  notifyRejectedApplicant = true;
  bulkActionType: 'approve' | 'suspend' | 'delete' | null = null;
  bulkReason = '';

  statementFrom = '2024-01-01';
  statementTo = '2024-12-31';
  statementIncludeSavings = true;
  statementIncludeLoans = true;
  statementIncludeShares = true;
  statementDelivery: 'download' | 'email' = 'download';

  newMember: NewMemberForm = this.initNewMemberForm();
  members: Member[] = [];
  filteredMembers: Member[] = [];
  pendingMembers: PendingMember[] = [];

  memberActivity: ActivityItem[] = [
    { text: 'Account approved by Admin James', time: 'Jan 15, 2024 - 10:32 AM', type: 'success' },
    { text: 'Purchased 50 shares worth KES 10,000', time: 'Jan 20, 2024 - 2:15 PM', type: 'info' },
    { text: 'Normal loan of KES 80,000 disbursed', time: 'Feb 5, 2024 - 9:00 AM', type: 'info' },
    { text: 'Loan repayment of KES 8,500 received', time: 'Mar 1, 2024 - 11:45 AM', type: 'success' },
    { text: 'Emergency loan application submitted', time: 'Mar 15, 2024 - 3:30 PM', type: 'warning' },
    { text: 'Dividend of KES 8,400 credited', time: 'Apr 1, 2024 - 8:00 AM', type: 'success' },
    { text: 'Missed loan repayment notice sent', time: 'May 5, 2024 - 9:00 AM', type: 'danger' },
    { text: 'Profile updated by member', time: 'Jun 12, 2024 - 4:10 PM', type: 'info' },
  ];

  ngOnInit(): void {
    this.generateMembersData();
    this.generatePendingData();
    this.applyFilters();
  }

  get totalShareCapital(): number {
    return this.members.reduce((sum, member) => sum + member.shareAmount, 0);
  }

  get activeMembersCount(): number {
    return this.members.filter((member) => member.status === 'active').length;
  }

  get selectedCount(): number {
    return this.selectedMembers.length;
  }

  get selectedMembersList(): Member[] {
    return this.members.filter((member) => this.selectedMembers.includes(member.id));
  }

  get messageTargetLabel(): string {
    if (this.selectedMembers.length) return `${this.selectedMembers.length} selected member(s)`;
    if (this.selectedMember) return this.selectedMember.name;
    return 'Filtered members';
  }

  get paginatedMembers(): Member[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMembers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMembers.length / this.pageSize) || 1;
  }

  get pageStart(): number {
    return this.filteredMembers.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredMembers.length);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    let start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  private generateMembersData(): void {
    const firstNames = ['James', 'Mary', 'John', 'Grace', 'Peter', 'Charity', 'Michael', 'Faith', 'David', 'Esther', 'Paul', 'Ruth', 'Samuel', 'Mercy', 'Daniel', 'Sharon', 'Joseph', 'Beatrice', 'Francis', 'Caroline', 'Kevin', 'Winnie', 'Brian', 'Lucy'];
    const lastNames = ['Otieno', 'Akinyi', 'Ouma', 'Owino', 'Nyambura', 'Wanjiru', 'Kamau', 'Njoroge', 'Odhiambo', 'Chebet', 'Kiprotich', 'Maina', 'Kariuki', 'Mutua', 'Gitau', 'Mwangi', 'Kimani', 'Njuguna'];
    const branches = ['Main Branch', 'Kiboswa', 'Migori', 'Awendo'];
    const statuses: MemberStatus[] = ['active', 'active', 'active', 'pending', 'suspended', 'dormant'];
    const occupations = ['Teacher', 'Farmer', 'Trader', 'Nurse', 'Civil Servant', 'Driver', 'Entrepreneur', 'Accountant'];
    const colors = [
      'linear-gradient(135deg,#00d084,#00bcd4)',
      'linear-gradient(135deg,#2196f3,#00bcd4)',
      'linear-gradient(135deg,#9c27b0,#673ab7)',
      'linear-gradient(135deg,#ff9800,#f44336)',
      'linear-gradient(135deg,#4caf50,#8bc34a)',
      'linear-gradient(135deg,#e91e63,#9c27b0)',
    ];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.members = Array.from({ length: 48 }, (_, index) => {
      const first = firstNames[index % firstNames.length];
      const last = lastNames[(index * 3) % lastNames.length];
      const name = `${first} ${last}`;
      const shares = 20 + ((index * 17) % 420);
      const status = statuses[index % statuses.length];
      return {
        id: `RSM-${String(index + 1).padStart(5, '0')}`,
        name,
        initials: `${first[0]}${last[0]}`,
        avatarColor: colors[index % colors.length],
        nationalId: String(22000000 + index * 78123),
        phone: `+254 7${String(10000000 + index * 174521).slice(0, 8)}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
        branch: branches[index % branches.length],
        shares,
        shareAmount: shares * 200,
        status,
        joinDate: `${months[index % 12]} ${1 + (index % 27)}, ${2021 + (index % 4)}`,
        gender: index % 2 === 0 ? 'male' : 'female',
        occupation: occupations[index % occupations.length],
        savingsBalance: 15000 + index * 8200,
        loanBalance: index % 3 === 0 ? 0 : 30000 + index * 5400,
        walletBalance: 1200 + index * 640,
        lastActivity: `${1 + (index % 7)} day(s) ago`,
      };
    });
  }

  private generatePendingData(): void {
    const names = [
      { name: 'Kevin Onyango', initials: 'KO', color: 'linear-gradient(135deg,#9c27b0,#673ab7)' },
      { name: 'Winnie Achieng', initials: 'WA', color: 'linear-gradient(135deg,#e91e63,#9c27b0)' },
      { name: 'Brian Mutai', initials: 'BM', color: 'linear-gradient(135deg,#2196f3,#00bcd4)' },
      { name: 'Lucy Wairimu', initials: 'LW', color: 'linear-gradient(135deg,#4caf50,#8bc34a)' },
      { name: 'Felix Omondi', initials: 'FO', color: 'linear-gradient(135deg,#ff9800,#f44336)' },
      { name: 'Diana Chepkoech', initials: 'DC', color: 'linear-gradient(135deg,#00bcd4,#2196f3)' },
    ];
    this.pendingMembers = names.map((person, index) => ({
      id: `PEND-${String(index + 1).padStart(3, '0')}`,
      name: person.name,
      initials: person.initials,
      avatarColor: person.color,
      nationalId: String(30000000 + index * 1234567),
      phone: `+254 7${String(34000000 + index * 91999).slice(0, 8)}`,
      email: `${person.name.toLowerCase().replace(' ', '.')}@email.com`,
      appliedDate: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]} ${10 + index * 3}, 2025`,
      branch: ['Main Branch', 'Kiboswa', 'Migori', 'Awendo'][index % 4],
      docsComplete: index % 2 === 0,
      notes: index % 2 === 0 ? 'All mandatory KYC documents verified.' : 'Residence proof requires review before activation.',
    }));
  }

  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();
    let result = [...this.members];

    if (query) {
      result = result.filter((member) =>
        member.name.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query) ||
        member.nationalId.includes(query) ||
        member.phone.includes(query) ||
        member.email.toLowerCase().includes(query),
      );
    }

    if (this.filterStatus) result = result.filter((member) => member.status === this.filterStatus);
    if (this.filterBranch) result = result.filter((member) => member.branch.toLowerCase().includes(this.filterBranch.toLowerCase()));
    if (this.filterGender) result = result.filter((member) => member.gender === this.filterGender);

    if (this.sortField) {
      result.sort((a, b) => {
        const aValue = a[this.sortField as keyof Member];
        const bValue = b[this.sortField as keyof Member];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return this.sortAscending ? aValue - bValue : bValue - aValue;
        }
        return this.sortAscending ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
      });
    }

    this.filteredMembers = result;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterBranch = '';
    this.filterGender = '';
    this.sortField = '';
    this.sortAscending = true;
    this.currentPage = 1;
    this.applyFilters();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  isSelected(id: string): boolean {
    return this.selectedMembers.includes(id);
  }

  toggleSelection(id: string): void {
    this.selectedMembers = this.isSelected(id) ? this.selectedMembers.filter((memberId) => memberId !== id) : [...this.selectedMembers, id];
  }

  isAllSelected(): boolean {
    return this.paginatedMembers.length > 0 && this.paginatedMembers.every((member) => this.selectedMembers.includes(member.id));
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const ids = this.paginatedMembers.map((member) => member.id);
    if (checked) {
      this.selectedMembers = Array.from(new Set([...this.selectedMembers, ...ids]));
    } else {
      this.selectedMembers = this.selectedMembers.filter((id) => !ids.includes(id));
    }
  }

  clearSelection(): void {
    this.selectedMembers = [];
  }

  openBulkConfirm(action: 'approve' | 'suspend' | 'delete'): void {
    if (!this.selectedMembers.length) return;
    this.bulkActionType = action;
    this.bulkReason = '';
    this.openModal('bulkConfirm');
  }

  applyBulkAction(): void {
    const count = this.selectedMembers.length;
    if (!this.bulkActionType || !count) return;

    if (this.bulkActionType === 'approve') {
      this.selectedMembers.forEach((id) => {
        const member = this.members.find((item) => item.id === id);
        if (member && member.status === 'pending') member.status = 'active';
      });
      this.showToast('success', 'Bulk Approved', `${count} member record(s) updated.`);
    }

    if (this.bulkActionType === 'suspend') {
      this.selectedMembers.forEach((id) => {
        const member = this.members.find((item) => item.id === id);
        if (member) member.status = 'suspended';
      });
      this.showToast('warning', 'Members Suspended', `${count} member record(s) suspended.`);
    }

    if (this.bulkActionType === 'delete') {
      this.members = this.members.filter((member) => !this.selectedMembers.includes(member.id));
      this.showToast('danger', 'Members Deleted', `${count} member record(s) removed.`);
    }

    this.clearSelection();
    this.bulkActionType = null;
    this.applyFilters();
    this.closeModal();
  }

  openMemberDetail(member: Member): void {
    this.selectedMember = { ...member };
    this.detailTab = 'overview';
    this.openModal('memberDetail');
  }

  openEditMember(member: Member): void {
    this.editMemberData = { ...member };
    this.openModal('editMember');
  }

  saveEditMember(): void {
    if (!this.editMemberData) return;
    const index = this.members.findIndex((member) => member.id === this.editMemberData?.id);
    if (index !== -1) this.members[index] = { ...this.editMemberData };
    this.applyFilters();
    this.closeModal();
    this.showToast('success', 'Member Updated', `${this.editMemberData.name}'s profile has been saved.`);
  }

  approveMember(member: Member): void {
    member.status = 'active';
    this.applyFilters();
  }

  suspendMember(member: Member): void {
    member.status = 'suspended';
    this.applyFilters();
  }

  reactivateMember(member: Member): void {
    member.status = 'active';
    this.applyFilters();
  }

  confirmDelete(member: Member): void {
    this.memberToDelete = member;
    this.deleteConfirmText = '';
    this.openModal('deleteConfirm');
  }

  deleteMember(): void {
    if (!this.memberToDelete || this.deleteConfirmText !== 'DELETE') return;
    this.members = this.members.filter((member) => member.id !== this.memberToDelete?.id);
    const name = this.memberToDelete.name;
    this.memberToDelete = null;
    this.applyFilters();
    this.closeModal();
    this.showToast('danger', 'Member Deleted', `${name} has been permanently removed.`);
  }

  openPendingDetail(member: PendingMember): void {
    this.pendingDetail = { ...member };
    this.openModal('pendingDetail');
  }

  approveItem(member: PendingMember): void {
    const newMember: Member = {
      id: `RSM-${String(this.members.length + 1).padStart(5, '0')}`,
      name: member.name,
      initials: member.initials,
      avatarColor: member.avatarColor,
      nationalId: member.nationalId,
      phone: member.phone,
      email: member.email,
      branch: member.branch,
      shares: 5,
      shareAmount: 1000,
      status: 'active',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      gender: 'female',
      occupation: 'New Member',
      savingsBalance: 1000,
      loanBalance: 0,
      walletBalance: 0,
      lastActivity: 'Just now',
    };
    this.members = [newMember, ...this.members];
    this.pendingMembers = this.pendingMembers.filter((item) => item.id !== member.id);
    this.applyFilters();
    this.closeModal();
    this.showToast('success', 'Member Approved', `${member.name} has been activated.`);
  }

  openRejectPending(member: PendingMember): void {
    this.pendingDetail = { ...member };
    this.rejectReason = '';
    this.notifyRejectedApplicant = true;
    this.openModal('rejectPending');
  }

  rejectPendingMember(): void {
    if (!this.pendingDetail || this.rejectReason.trim().length < 8) return;
    const name = this.pendingDetail.name;
    this.pendingMembers = this.pendingMembers.filter((item) => item.id !== this.pendingDetail?.id);
    this.closeModal();
    this.showToast('danger', 'Application Rejected', `${name}'s application was rejected.`);
  }

  private initNewMemberForm(): NewMemberForm {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      nationalId: '',
      dob: '',
      gender: '',
      maritalStatus: '',
      phone: '',
      email: '',
      address: '',
      branch: '',
      occupation: '',
      employer: '',
      incomeRange: '',
      initialShares: null,
      kinName: '',
      kinPhone: '',
      kinRelationship: '',
      paymentMethod: 'mpesa',
      termsAccepted: false,
    };
  }

  submitNewMember(): void {
    if (!this.newMember.firstName || !this.newMember.lastName || !this.newMember.nationalId || !this.newMember.phone) {
      this.showToast('warning', 'Incomplete Form', 'Fill in all required personal details.');
      this.regTab = 'personal';
      return;
    }
    if (!this.newMember.termsAccepted) {
      this.showToast('warning', 'Terms Required', 'Accept the registration declaration before submitting.');
      return;
    }

    const name = `${this.newMember.firstName} ${this.newMember.lastName}`.trim();
    const shares = this.newMember.initialShares || 5;
    const newMember: Member = {
      id: `RSM-${String(this.members.length + 1).padStart(5, '0')}`,
      name,
      initials: `${this.newMember.firstName[0]}${this.newMember.lastName[0]}`.toUpperCase(),
      avatarColor: 'linear-gradient(135deg,#00d084,#00bcd4)',
      nationalId: this.newMember.nationalId,
      phone: this.newMember.phone,
      email: this.newMember.email,
      branch: this.newMember.branch || 'Main Branch',
      shares,
      shareAmount: shares * 200,
      status: 'pending',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      gender: this.newMember.gender,
      occupation: this.newMember.occupation || 'Not Provided',
      savingsBalance: 0,
      loanBalance: 0,
      walletBalance: 0,
      lastActivity: 'Registration submitted',
    };

    this.members = [newMember, ...this.members];
    this.newMember = this.initNewMemberForm();
    this.uploads = { nationalId: false, photo: false, kra: false, residence: false };
    this.regTab = 'personal';
    this.applyFilters();
    this.closeModal();
    this.showToast('success', 'Registration Submitted', `${name} has been registered and is pending approval.`);
  }

  onFileUpload(event: Event, type: keyof UploadState): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploads[type] = true;
  }

  onImportDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.importFileName = file.name;
  }

  onImportFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.importFileName = file.name;
  }

  processBulkImport(): void {
    if (!this.importFileName) return;
    this.closeModal();
    this.showToast('info', 'Import Started', `${this.importFileName} is being processed.`);
    this.importFileName = '';
  }

  openMessageModal(member?: Member): void {
    this.selectedMember = member ? { ...member } : this.selectedMember;
    this.messageChannel = 'sms';
    this.messageTemplate = '';
    this.messageSubject = '';
    this.messageBody = '';
    this.openModal('message');
  }

  applyTemplate(): void {
    const templates: Record<string, { subject: string; body: string }> = {
      welcome: {
        subject: 'Welcome to Rongo SACCO',
        body: 'Dear Member, welcome to Rongo SACCO. Your account has been activated. You can now access savings, loans and SACCOPay wallet services.',
      },
      reminder: {
        subject: 'Loan Repayment Reminder',
        body: 'Dear Member, your loan repayment is due soon. Please make payment before the due date to avoid penalties.',
      },
      dividend: {
        subject: 'Dividend Payment Notice',
        body: 'Dear Member, your dividend payment has been processed and credited to your account.',
      },
      kyc: {
        subject: 'KYC Update Required',
        body: 'Dear Member, please update your KYC documents at the nearest branch or through the member portal.',
      },
    };
    if (this.messageTemplate && templates[this.messageTemplate]) {
      this.messageSubject = templates[this.messageTemplate].subject;
      this.messageBody = templates[this.messageTemplate].body;
    }
  }

  sendMessage(): void {
    if (!this.messageBody.trim()) {
      this.showToast('warning', 'Empty Message', 'Write a message before sending.');
      return;
    }
    this.closeModal();
    this.showToast('success', 'Message Sent', `${this.messageChannel.toUpperCase()} message sent to ${this.messageTargetLabel}.`);
  }

  openStatementModal(member: Member): void {
    this.statementMember = { ...member };
    this.openModal('statement');
  }

  generateStatement(): void {
    if (!this.statementMember) return;
    this.closeModal();
    this.showToast('success', 'Statement Generated', `${this.statementMember.name}'s statement is ready.`);
  }

  doExport(): void {
    this.closeModal();
    this.showToast('success', 'Export Ready', `Member data exported as ${this.exportFormat.toUpperCase()}.`);
  }

  toggleView(): void {
    this.viewMode = this.viewMode === 'table' ? 'grid' : 'table';
  }

  openModal(name: Exclude<ModalName, null>): void {
    this.activeModal = name;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  statusLabel(status: MemberStatus): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  trackMember(_index: number, item: Member): string {
    return item.id;
  }

  trackPending(_index: number, item: PendingMember): string {
    return item.id;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }

  showToast(type: Toast['type'], title: string, message: string): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toast = { visible: true, type, title, message };
    this.toastTimer = window.setTimeout(() => {
      this.toast.visible = false;
    }, 3000);
  }

  hideToast(): void {
    this.toast.visible = false;
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  }
}