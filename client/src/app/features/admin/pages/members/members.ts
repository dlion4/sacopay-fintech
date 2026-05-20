import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* =====================================================
   INTERFACES
   ===================================================== */
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
  status: 'active' | 'pending' | 'suspended' | 'dormant';
  joinDate: string;
  gender: string;
}

interface PendingMember {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  nationalId: string;
  appliedDate: string;
  docsComplete: boolean;
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

/* =====================================================
   COMPONENT DECORATOR (Angular v21 Standalone)
   ===================================================== */
@Component({
  selector: 'app-members-all',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, TitleCasePipe],
  templateUrl: './members.html',
  styleUrls: ['./members.scss']
})
export class MembersAllComponent implements OnInit {

  /* ---- Toast ---- */
  toast: Toast = { visible: false, type: 'success', title: '', message: '' };
  private toastTimer: any;

  /* ---- View Mode ---- */
  viewMode: 'table' | 'grid' = 'table';

  /* ---- Active Modal & Dropdowns ---- */
  activeModal: string | null = null;
  activeDropdown: string | null = null;

  /* ---- Tab States ---- */
  regTab: 'personal' | 'financial' | 'documents' = 'personal';
  detailTab: 'overview' | 'shares' | 'loans' | 'savings' | 'activity' = 'overview';

  /* ---- Filter & Search ---- */
  searchQuery = '';
  filterStatus = '';
  filterBranch = '';
  filterGender = '';
  sortField = '';
  sortAscending = true;

  /* ---- Selection ---- */
  selectedMembers: string[] = [];

  /* ---- Pagination ---- */
  currentPage = 1;
  pageSize = 10;

  /* ---- Export ---- */
  exportFormat: 'csv' | 'pdf' | 'json' = 'csv';

  /* ---- Message ---- */
  messageChannel: 'sms' | 'email' | 'push' = 'sms';
  messageTemplate = '';
  messageSubject = '';
  messageBody = '';

  /* ---- Upload State ---- */
  uploads: Record<string, boolean> = {
    nationalId: false,
    photo: false,
    kra: false,
    residence: false
  };

  /* ---- Delete ---- */
  memberToDelete: Member | null = null;
  deleteConfirmText = '';

  /* ---- Selected / Editing Members ---- */
  selectedMember: Member | null = null;
  editMemberData: Member | null = null;
  pendingDetail: PendingMember | null = null;

  /* ---- New Member Form ---- */
  newMember: NewMemberForm = this.initNewMemberForm();

  /* ---- Activity Feed ---- */
  memberActivity: ActivityItem[] = [
    { text: 'Account approved by Admin James', time: 'Jan 15, 2024 · 10:32 AM', type: 'success' },
    { text: 'Purchased 50 shares (KES 10,000)', time: 'Jan 20, 2024 · 2:15 PM', type: 'info' },
    { text: 'Normal loan of KES 80,000 disbursed', time: 'Feb 5, 2024 · 9:00 AM', type: 'info' },
    { text: 'Loan repayment of KES 8,500 received', time: 'Mar 1, 2024 · 11:45 AM', type: 'success' },
    { text: 'Emergency loan application submitted', time: 'Mar 15, 2024 · 3:30 PM', type: 'warning' },
    { text: 'Dividend of KES 8,400 credited', time: 'Apr 1, 2024 · 8:00 AM', type: 'success' },
    { text: 'Missed loan repayment — overdue notice sent', time: 'May 5, 2024 · 9:00 AM', type: 'danger' },
    { text: 'Profile updated by member', time: 'Jun 12, 2024 · 4:10 PM', type: 'info' },
  ];

  /* ---- Members Data ---- */
  members: Member[] = [];
  filteredMembers: Member[] = [];

  /* ---- Pending Members ---- */
  pendingMembers: PendingMember[] = [];

  /* =====================================================
     LIFECYCLE
     ===================================================== */
  ngOnInit(): void {
    this.generateMembersData();
    this.generatePendingData();
    this.applyFilters();
  }

  /* =====================================================
     DATA GENERATION
     ===================================================== */
  private generateMembersData(): void {
    const firstNames = ['James', 'Mary', 'John', 'Grace', 'Peter', 'Charity', 'Michael', 'Faith', 'David', 'Esther',
      'Paul', 'Ruth', 'Samuel', 'Mercy', 'Daniel', 'Sharon', 'Joseph', 'Beatrice', 'Francis', 'Caroline'];
    const lastNames = ['Otieno', 'Akinyi', 'Ouma', 'Owino', 'Nyambura', 'Wanjiru', 'Kamau', 'Njoroge', 'Odhiambo',
      'Chebet', 'Kiprotich', 'Maina', 'Kariuki', 'Mutua', 'Gitau', 'Mwangi', 'Kimani', 'Njuguna'];
    const branches = ['Main Branch', 'Kiboswa', 'Migori', 'Awendo'];
    const statuses: Member['status'][] = ['active', 'active', 'active', 'pending', 'suspended', 'dormant'];
    const avatarColors = [
      'linear-gradient(135deg,#00d084,#00bcd4)',
      'linear-gradient(135deg,#2196f3,#00bcd4)',
      'linear-gradient(135deg,#9c27b0,#673ab7)',
      'linear-gradient(135deg,#ff9800,#f44336)',
      'linear-gradient(135deg,#4caf50,#8bc34a)',
      'linear-gradient(135deg,#e91e63,#9c27b0)',
      'linear-gradient(135deg,#00bcd4,#2196f3)',
      'linear-gradient(135deg,#ff5722,#ff9800)',
    ];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.members = [];

    for (let i = 1; i <= 80; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const year = 2019 + Math.floor(Math.random() * 6);
      const month = months[Math.floor(Math.random() * 12)];
      const day = 1 + Math.floor(Math.random() * 28);
      const shares = 50 + Math.floor(Math.random() * 950);

      this.members.push({
        id: `RSM-${String(i).padStart(5, '0')}`,
        name: `${fn} ${ln}`,
        initials: `${fn[0]}${ln[0]}`,
        avatarColor: avatarColors[i % avatarColors.length],
        nationalId: `${20000000 + Math.floor(Math.random() * 9999999)}`,
        phone: `+254 7${Math.floor(10 + Math.random() * 89)} ${Math.floor(100 + Math.random() * 899)} ${Math.floor(100 + Math.random() * 899)}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
        branch: branches[Math.floor(Math.random() * branches.length)],
        shares,
        shareAmount: shares * 200,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        joinDate: `${month} ${day}, ${year}`,
        gender: Math.random() > 0.5 ? 'male' : 'female'
      });
    }
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

    this.pendingMembers = names.map((n, i) => ({
      id: `PEND-${String(i + 1).padStart(3, '0')}`,
      name: n.name,
      initials: n.initials,
      avatarColor: n.color,
      nationalId: `${30000000 + i * 1234567}`,
      appliedDate: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]} ${10 + i * 3}, 2025`,
      docsComplete: i % 2 === 0
    }));
  }

  /* =====================================================
     FILTERS & SEARCH
     ===================================================== */
  applyFilters(): void {
    let result = [...this.members];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.nationalId.includes(q) ||
        m.phone.includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    }

    if (this.filterStatus) result = result.filter(m => m.status === this.filterStatus);
    if (this.filterBranch) result = result.filter(m => m.branch.toLowerCase().includes(this.filterBranch));
    if (this.filterGender) result = result.filter(m => m.gender === this.filterGender);

    if (this.sortField) {
      result.sort((a, b) => {
        const aVal = (a as any)[this.sortField];
        const bVal = (b as any)[this.sortField];
        if (typeof aVal === 'number') return this.sortAscending ? aVal - bVal : bVal - aVal;
        return this.sortAscending
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    this.filteredMembers = result;
    this.currentPage = 1;
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

  /* =====================================================
     PAGINATION
     ===================================================== */
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
    const cur = this.currentPage;
    const pages: number[] = [];
    let start = Math.max(1, cur - 2);
    let end = Math.min(total, cur + 2);
    if (end - start < 4) {
      if (start === 1) end = Math.min(total, start + 4);
      else start = Math.max(1, end - 4);
    }
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }

  goToPage(page: number): void { this.currentPage = Math.max(1, Math.min(page, this.totalPages)); }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  onPageSizeChange(): void { this.currentPage = 1; }

  /* =====================================================
     SELECTION
     ===================================================== */
  isSelected(id: string): boolean { return this.selectedMembers.includes(id); }

  toggleSelect(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedMembers.includes(id)) this.selectedMembers.push(id);
    } else {
      this.selectedMembers = this.selectedMembers.filter(m => m !== id);
    }
  }

  isAllSelected(): boolean {
    return this.paginatedMembers.length > 0 &&
      this.paginatedMembers.every(m => this.selectedMembers.includes(m.id));
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const ids = this.paginatedMembers.map(m => m.id);
    if (checked) {
      ids.forEach(id => { if (!this.selectedMembers.includes(id)) this.selectedMembers.push(id); });
    } else {
      this.selectedMembers = this.selectedMembers.filter(id => !ids.includes(id));
    }
  }

  clearSelection(): void { this.selectedMembers = []; }

  bulkAction(action: string): void {
    const count = this.selectedMembers.length;
    switch (action) {
      case 'approve':
        this.selectedMembers.forEach(id => {
          const m = this.members.find(x => x.id === id);
          if (m && m.status === 'pending') m.status = 'active';
        });
        this.showToast('success', 'Bulk Approved', `${count} member(s) approved successfully.`);
        break;
      case 'suspend':
        this.selectedMembers.forEach(id => {
          const m = this.members.find(x => x.id === id);
          if (m) m.status = 'suspended';
        });
        this.showToast('warning', 'Members Suspended', `${count} member(s) have been suspended.`);
        break;
      case 'delete':
        this.members = this.members.filter(m => !this.selectedMembers.includes(m.id));
        this.showToast('danger', 'Members Deleted', `${count} member(s) deleted permanently.`);
        break;
    }
    this.clearSelection();
    this.applyFilters();
  }

  /* =====================================================
     MEMBER ACTIONS
     ===================================================== */
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
    const idx = this.members.findIndex(m => m.id === this.editMemberData!.id);
    if (idx !== -1) this.members[idx] = { ...this.editMemberData };
    this.applyFilters();
    this.closeModal();
    this.showToast('success', 'Member Updated', `${this.editMemberData.name}'s profile has been saved.`);
  }

  approveMember(member: Member): void {
    member.status = 'active';
    this.applyFilters();
    this.showToast('success', 'Member Approved', `${member.name} is now an active member.`);
  }

  confirmDelete(member: Member): void {
    this.memberToDelete = member;
    this.deleteConfirmText = '';
    this.openModal('deleteConfirm');
  }

  deleteMember(): void {
    if (!this.memberToDelete || this.deleteConfirmText !== 'DELETE') return;
    this.members = this.members.filter(m => m.id !== this.memberToDelete!.id);
    this.applyFilters();
    this.closeModal();
    this.showToast('danger', 'Member Deleted', `${this.memberToDelete.name} has been permanently removed.`);
    this.memberToDelete = null;
  }

  /* =====================================================
     PENDING MEMBER ACTIONS
     ===================================================== */
  openPendingDetail(p: PendingMember): void {
    this.pendingDetail = { ...p };
    this.openModal('pendingDetail');
  }

  approveItem(p: PendingMember): void {
    this.pendingMembers = this.pendingMembers.filter(x => x.id !== p.id);
    this.closeModal();
    this.showToast('success', 'Member Approved', `${p.name} has been approved and activated.`);
  }

  rejectItem(p: PendingMember): void {
    this.pendingMembers = this.pendingMembers.filter(x => x.id !== p.id);
    this.closeModal();
    this.showToast('danger', 'Application Rejected', `${p.name}'s application has been rejected.`);
  }

  /* =====================================================
     NEW MEMBER REGISTRATION
     ===================================================== */
  private initNewMemberForm(): NewMemberForm {
    return {
      firstName: '', middleName: '', lastName: '', nationalId: '',
      dob: '', gender: '', maritalStatus: '', phone: '', email: '', address: '',
      branch: '', occupation: '', employer: '', incomeRange: '',
      initialShares: null, kinName: '', kinPhone: '', kinRelationship: '',
      paymentMethod: 'mpesa', termsAccepted: false
    };
  }

  submitNewMember(): void {
    if (!this.newMember.firstName || !this.newMember.lastName || !this.newMember.nationalId) {
      this.showToast('warning', 'Incomplete Form', 'Please fill in all required fields.');
      return;
    }
    if (!this.newMember.termsAccepted) {
      this.showToast('warning', 'Terms Required', 'Please accept the terms and conditions.');
      return;
    }

    const name = `${this.newMember.firstName} ${this.newMember.lastName}`.trim();
    const avatarColors = [
      'linear-gradient(135deg,#00d084,#00bcd4)',
      'linear-gradient(135deg,#9c27b0,#673ab7)',
      'linear-gradient(135deg,#ff9800,#f44336)',
    ];
    const newId = `RSM-${String(this.members.length + 1).padStart(5, '0')}`;
    const newMem: Member = {
      id: newId,
      name,
      initials: `${this.newMember.firstName[0]}${this.newMember.lastName[0]}`,
      avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
      nationalId: this.newMember.nationalId,
      phone: this.newMember.phone,
      email: this.newMember.email,
      branch: this.newMember.branch || 'Main Branch',
      shares: this.newMember.initialShares || 5,
      shareAmount: (this.newMember.initialShares || 5) * 200,
      status: 'pending',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      gender: this.newMember.gender
    };

    this.members.unshift(newMem);
    this.applyFilters();
    this.closeModal();
    this.newMember = this.initNewMemberForm();
    this.uploads = { nationalId: false, photo: false, kra: false, residence: false };
    this.regTab = 'personal';
    this.showToast('success', 'Registration Submitted', `${name} has been registered and is pending approval.`);
  }

  /* =====================================================
     FILE UPLOAD
     ===================================================== */
  onFileUpload(event: Event, type: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploads[type] = true;
  }

  onImportDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.showToast('info', 'File Received', `${file.name} ready for processing.`);
  }

  processBulkImport(): void {
    this.closeModal();
    this.showToast('info', 'Import Started', 'Your file is being processed. This may take a moment.');
  }

  /* =====================================================
     MESSAGE
     ===================================================== */
  applyTemplate(): void {
    const templates: Record<string, { subject: string; body: string }> = {
      welcome: {
        subject: 'Welcome to Rongo SACCO',
        body: 'Dear Member, welcome to Rongo SACCO! Your account has been activated. You can now access our financial services. For support, contact us at admin@rongosacco.co.ke.'
      },
      reminder: {
        subject: 'Loan Repayment Reminder',
        body: 'Dear Member, your loan repayment of KES [AMOUNT] is due on [DATE]. Please ensure timely payment to avoid penalties. Thank you.'
      },
      dividend: {
        subject: 'Dividend Payment Notice',
        body: 'Dear Member, your dividend payment for FY 2023/24 has been processed. KES [AMOUNT] has been credited to your account. Thank you for your continued membership.'
      },
      custom: { subject: '', body: '' }
    };

    if (this.messageTemplate && templates[this.messageTemplate]) {
      this.messageSubject = templates[this.messageTemplate].subject;
      this.messageBody = templates[this.messageTemplate].body;
    }
  }

  sendMessage(): void {
    if (!this.messageBody.trim()) {
      this.showToast('warning', 'Empty Message', 'Please write a message before sending.');
      return;
    }
    this.closeModal();
    this.showToast('success', 'Message Sent', `Your ${this.messageChannel.toUpperCase()} message has been delivered.`);
    this.messageBody = '';
    this.messageSubject = '';
    this.messageTemplate = '';
  }

  /* =====================================================
     EXPORT / STATEMENT
     ===================================================== */
  doExport(): void {
    this.closeModal();
    this.showToast('success', 'Export Ready', `Member data exported as ${this.exportFormat.toUpperCase()} successfully.`);
  }

  generateStatement(): void {
    this.closeModal();
    this.showToast('success', 'Statement Generated', 'Account statement has been generated and is ready for download.');
  }

  /* =====================================================
     VIEW TOGGLE
     ===================================================== */
  toggleView(): void {
    this.viewMode = this.viewMode === 'table' ? 'grid' : 'table';
  }

  /* =====================================================
     MODAL MANAGEMENT
     ===================================================== */
  openModal(name: string): void {
    this.activeModal = name;
    this.activeDropdown = null;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  /* =====================================================
     DROPDOWN MANAGEMENT
     ===================================================== */
  toggleDropdown(id: string): void {
    this.activeDropdown = this.activeDropdown === id ? null : id;
  }

  closeDropdown(): void {
    this.activeDropdown = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeDropdown = null;
  }

  /* =====================================================
     TRACK BY FUNCTIONS
     ===================================================== */
  trackMember(_index: number, item: Member): string { return item.id; }
  trackPending(_index: number, item: PendingMember): string { return item.id; }

  /* =====================================================
     TOAST
     ===================================================== */
  showToast(type: Toast['type'], title: string, message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { visible: true, type, title, message };
    this.toastTimer = setTimeout(() => { this.toast.visible = false; }, 4500);
  }

  hideToast(): void {
    this.toast.visible = false;
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
}
