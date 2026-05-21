import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface KycDocument {
  name: string;
  icon: string;
  status: 'verified' | 'pending' | 'rejected' | 'missing';
  uploadedDate?: string;
  fileName?: string;
  fileSize?: string;
}

interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  idNumber: string;
}

interface KycApplication {
  applicationId: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  occupation: string;
  employer: string;
  submittedDate: string;
  urgency: 'urgent' | 'normal';
  progress: number;
  documents: KycDocument[];
  nextOfKin: NextOfKin;
}

interface ApprovedKyc {
  applicationId: string;
  initials: string;
  name: string;
  email: string;
  idNumber: string;
  approvedDate: string;
  approvedBy: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  initialShares: number;
}

interface RejectedKyc {
  applicationId: string;
  initials: string;
  name: string;
  email: string;
  rejectedDate: string;
  rejectionReason: string;
  rejectedBy: string;
  canResubmit: boolean;
}

interface ActivityLog {
  id: number;
  type: 'approved' | 'rejected' | 'pending' | 'document';
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info' | 'primary';
  visible: boolean;
}

interface Modals {
  kycDetails: boolean;
  approve: boolean;
  reject: boolean;
  documentPreview: boolean;
  bulkActions: boolean;
  settings: boolean;
  export: boolean;
  requirements: boolean;
  registration: boolean;
  bulkApprove: boolean;
  requestInfo: boolean;
  uploadForMember: boolean;
  editMemberInfo: boolean;
  addNote: boolean;
}

interface UploadDocument {
  name: string;
  icon: string;
  required: boolean;
  formats: string;
  maxSize: string;
  uploaded: boolean;
}

interface Fee {
  name: string;
  amount: number;
  required: boolean;
  selected: boolean;
  editable: boolean;
}

interface Term {
  id: number;
  name: string;
  description: string;
  accepted: boolean;
}

interface BulkApproveItem {
  applicationId: string;
  name: string;
  docsVerified: number;
  totalDocs: number;
  selected: boolean;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface RequiredDocument {
  name: string;
  icon: string;
  description: string;
  required: boolean;
  color: string;
  formats: string;
  maxSize: string;
  notes?: string;
}

interface ExportFormat {
  name: string;
  icon: string;
  desc: string;
  color: string;
}

@Component({
  selector: 'app-kyc-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc-verification.html',
  styleUrls: ['./kyc-verification.scss'],
})
export class KycVerificationComponent implements OnInit {
  activeTab = 'pending';
  toasts: Toast[] = [];

  searchTerm = '';
  searchTermApproved = '';
  searchTermRejected = '';
  filterUrgency = 'all';
  filterDocStatus = 'all';
  filterApprovedMonth = 'all';
  filterTier = 'all';
  filterRejectionReason = 'all';
  filterActivityType = 'all';
  sortBy = 'newest';

  pendingCount = 24;
  approvedCount = 156;
  rejectedCount = 12;
  newToday = 8;
  approvalRate = 92;
  urgentCount = 5;
  returnedForResubmission = 7;

  modals: Modals = {
    kycDetails: false,
    approve: false,
    reject: false,
    documentPreview: false,
    bulkActions: false,
    settings: false,
    export: false,
    requirements: false,
    registration: false,
    bulkApprove: false,
    requestInfo: false,
    uploadForMember: false,
    editMemberInfo: false,
    addNote: false,
  };

  selectedKyc: KycApplication | null = null;
  selectedDocument: KycDocument | null = null;
  verificationNotes = '';

  approvalForm = { tier: 'Bronze', initialShares: 5000, notes: '', sendWelcome: true, confirmVerification: false };
  rejectionForm = { reason: '', details: '', documentsToResubmit: [] as string[], allowResubmission: true, notifyApplicant: true };
  exportOptions = { range: 'pending', format: 'pdf' };
  kycSettings = { reminderDays: 3, expiryCheckDays: 90, maxResubmissions: 3, autoNotify: true, requireAllDocs: true };

  requestInfoSubject = '';
  requestInfoMessage = '';
  requestInfoDocs: string[] = [];

  uploadForMemberDocType = '';
  uploadForMemberFile: File | null = null;

  editMemberActiveTab = 'personal';
  editMemberTabs: Tab[] = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'contact', label: 'Contact', icon: '📱' },
    { id: 'financial', label: 'Financial', icon: '💰' },
  ];
  editMemberForm = {
    firstName: '', middleName: '', lastName: '', nationalId: '', dateOfBirth: '', gender: '', maritalStatus: '',
    phone: '', altPhone: '', email: '', address: '', county: '', postalCode: '',
    occupation: '', employer: '', incomeRange: '', kraPin: '',
  };

  addNoteText = '';
  addNoteCategory = 'general';

  currentStep = 1;
  totalSteps = 10;
  stepNames = [
    'Personal Details', 'Contact Details', 'Residential Details', 'Employment Details',
    'Next of Kin', 'Documents', 'Shares & Fees', 'Payment', 'Terms & Policies', 'Review & Complete',
  ];

  regForm = {
    firstName: '', middleName: '', lastName: '', nationalId: '', kraPin: '',
    dateOfBirth: '', gender: '', maritalStatus: '', nationality: 'Kenyan',
    primaryPhone: '', altPhone: '', email: '', contactMethod: 'sms',
    county: '', subCounty: '', ward: '', estate: '', streetAddress: '',
    poBox: '', postalCode: '', residenceType: '', yearsAtAddress: '',
    employmentStatus: '', employerName: '', employeeNumber: '', jobTitle: '',
    department: '', employerAddress: '', employmentDate: '', incomeRange: '', paymentMode: '',
    nokName: '', nokRelationship: '', nokPhone: '', nokIdNumber: '', nokEmail: '', nokAddress: '',
    paymentMethod: 'mpesa', mpesaPhone: '', cashReceipt: '',
    bankName: '', bankAccount: '', bankReference: '',
    cardNumber: '', cardExpiry: '', cardCvv: '',
    masterDeclaration: false,
  };

  contactMethods = [
    { value: 'sms', label: 'SMS', icon: '💬' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '📱' },
  ];

  paymentMethods = [
    { value: 'mpesa', label: 'M-Pesa', icon: '📱' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
    { value: 'card', label: 'Card Payment', icon: '💳' },
  ];

  uploadDocuments: UploadDocument[] = [
    { name: 'National ID (Front)', icon: '🪪', required: true, formats: 'PDF, JPG, PNG', maxSize: '5MB', uploaded: false },
    { name: 'National ID (Back)', icon: '🪪', required: true, formats: 'PDF, JPG, PNG', maxSize: '5MB', uploaded: false },
    { name: 'Passport Photo', icon: '📸', required: true, formats: 'JPG, PNG', maxSize: '2MB', uploaded: false },
    { name: 'KRA PIN Certificate', icon: '📄', required: false, formats: 'PDF', maxSize: '2MB', uploaded: false },
  ];

  fees: Fee[] = [
    { name: 'Minimum Share Capital', amount: 5000, required: true, selected: true, editable: false },
    { name: 'Registration Fee', amount: 500, required: true, selected: true, editable: false },
    { name: 'Onboarding Charge', amount: 200, required: true, selected: true, editable: false },
    { name: 'Membership Card', amount: 150, required: false, selected: true, editable: false },
    { name: 'Additional Shares', amount: 0, required: false, selected: false, editable: true },
  ];

  terms: Term[] = [
    { id: 1, name: 'SACCO Terms & Conditions', description: 'General terms governing membership, services, and obligations.', accepted: false },
    { id: 2, name: 'SACCOPay Digital Services Terms', description: 'Terms for using mobile banking, USSD, and digital payment services.', accepted: false },
    { id: 3, name: 'Data Protection & Privacy Policy', description: 'How we collect, use, and protect your personal information.', accepted: false },
    { id: 4, name: 'Loan Policy Agreement', description: 'Terms for loan applications, interest rates, and repayment schedules.', accepted: false },
    { id: 5, name: 'Share Capital Policy', description: 'Rules governing share purchases, transfers, and dividend distribution.', accepted: false },
  ];

  tabs: Tab[] = [
    { id: 'pending', label: 'Pending KYC', icon: '⏳' },
    { id: 'approved', label: 'Approved', icon: '✅' },
    { id: 'rejected', label: 'Rejected', icon: '❌' },
    { id: 'activity', label: 'Activity Log', icon: '📋' },
  ];

  requiredDocuments: RequiredDocument[] = [
    { name: 'National ID (Front & Back)', icon: '🪪', description: 'Government-issued photo identification.', required: true, color: '#00d084', formats: 'PDF, JPG, PNG', maxSize: '5MB' },
    { name: 'Passport Photo', icon: '📸', description: 'Recent colour photo with white background.', required: true, color: '#00bcd4', formats: 'JPG, PNG', maxSize: '2MB' },
    { name: 'KRA PIN Certificate', icon: '📄', description: 'Tax registration certificate from KRA.', required: false, color: '#ff9800', formats: 'PDF', maxSize: '2MB', notes: 'Optional but recommended' },
    { name: 'Proof of Residence', icon: '🏠', description: 'Utility bill or landlord letter (last 3 months).', required: false, color: '#2196f3', formats: 'PDF, JPG', maxSize: '5MB', notes: 'Required for loans above KES 250K' },
  ];

  exportFormats: ExportFormat[] = [
    { name: 'PDF', icon: '📄', desc: 'Printable report format', color: '#f44336' },
    { name: 'Excel', icon: '📊', desc: 'Spreadsheet format', color: '#4caf50' },
    { name: 'CSV', icon: '📋', desc: 'Raw comma-separated data', color: '#2196f3' },
  ];

  selectedExportFormat = 'PDF';

  bulkApproveList: BulkApproveItem[] = [];
  bulkApproveTier = 'Bronze';
  bulkApproveSendWelcome = true;
  bulkApproveConfirm = false;

  pendingKycList: KycApplication[] = [];
  approvedKycList: ApprovedKyc[] = [];
  rejectedKycList: RejectedKyc[] = [];
  activityLog: ActivityLog[] = [];

  ngOnInit(): void {
    this.generateData();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAllModals();
  }

  private generateData(): void {
    const docs = (progress: number): KycDocument[] => [
      { name: 'National ID (Front)', icon: '🪪', status: progress > 25 ? 'verified' : 'pending', uploadedDate: 'Dec 12, 2024', fileName: 'id_front.jpg', fileSize: '1.2MB' },
      { name: 'National ID (Back)', icon: '🪪', status: progress > 50 ? 'verified' : progress > 25 ? 'pending' : 'missing', uploadedDate: 'Dec 12, 2024', fileName: 'id_back.jpg', fileSize: '1.1MB' },
      { name: 'Passport Photo', icon: '📸', status: progress > 75 ? 'verified' : 'pending', uploadedDate: 'Dec 13, 2024', fileName: 'photo.jpg', fileSize: '800KB' },
      { name: 'KRA PIN', icon: '📄', status: progress === 100 ? 'verified' : progress > 50 ? 'pending' : 'missing' },
    ];

    const names = [
      { name: 'James Otieno', initials: 'JO', email: 'james.otieno@email.com', phone: '+254 712 345 678', id: '28456123', urgency: 'urgent' as const },
      { name: 'Mary Akinyi', initials: 'MA', email: 'mary.akinyi@email.com', phone: '+254 723 456 789', id: '30789456', urgency: 'normal' as const },
      { name: 'Peter Kamau', initials: 'PK', email: 'peter.kamau@email.com', phone: '+254 734 567 890', id: '25123789', urgency: 'urgent' as const },
      { name: 'Grace Wanjiru', initials: 'GW', email: 'grace.wanjiru@email.com', phone: '+254 745 678 901', id: '31456012', urgency: 'normal' as const },
      { name: 'David Mwangi', initials: 'DM', email: 'david.mwangi@email.com', phone: '+254 756 789 012', id: '27890345', urgency: 'normal' as const },
      { name: 'Faith Njeri', initials: 'FN', email: 'faith.njeri@email.com', phone: '+254 767 890 123', id: '29234678', urgency: 'urgent' as const },
    ];

    this.pendingKycList = names.map((n, i) => ({
      applicationId: `KYC-2024-${String(i + 1).padStart(4, '0')}`,
      initials: n.initials,
      name: n.name,
      email: n.email,
      phone: n.phone,
      idNumber: n.id,
      dateOfBirth: `${1985 + i}-0${(i % 9) + 1}-${10 + i}`,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      address: `${['Rongo', 'Migori', 'Awendo', 'Kiboswa', 'Nairobi', 'Kisumu'][i]} Town`,
      occupation: ['Teacher', 'Farmer', 'Nurse', 'Trader', 'Engineer', 'Accountant'][i],
      employer: ['Ministry of Education', 'Self-employed', 'Migori County Hospital', 'Rongo Market', 'KPLC', 'PWC Kenya'][i],
      submittedDate: `Dec ${12 + i}, 2024`,
      urgency: n.urgency,
      progress: [100, 75, 50, 85, 60, 100][i],
      documents: docs([100, 75, 50, 85, 60, 100][i]),
      nextOfKin: { name: `${['Jane', 'John', 'Alice', 'Mark', 'Susan', 'Tom'][i]} ${n.name.split(' ')[1]}`, relationship: ['Spouse', 'Father', 'Sister', 'Brother', 'Mother', 'Spouse'][i], phone: `+254 7${80 + i}0 ${123 + i * 111} ${456 + i * 100}`, idNumber: `${31000000 + i * 123456}` },
    }));

    this.approvedKycList = [
      { applicationId: 'KYC-2024-0101', initials: 'SW', name: 'Sarah Wanjiku', email: 'sarah.w@email.com', idNumber: '26789012', approvedDate: 'Dec 10, 2024', approvedBy: 'Admin James', tier: 'Gold', initialShares: 25000 },
      { applicationId: 'KYC-2024-0102', initials: 'JK', name: 'John Kamau', email: 'john.k@email.com', idNumber: '28456789', approvedDate: 'Dec 8, 2024', approvedBy: 'Admin Grace', tier: 'Silver', initialShares: 10000 },
      { applicationId: 'KYC-2024-0103', initials: 'LW', name: 'Lucy Wambui', email: 'lucy.w@email.com', idNumber: '30123456', approvedDate: 'Dec 5, 2024', approvedBy: 'Admin James', tier: 'Bronze', initialShares: 5000 },
      { applicationId: 'KYC-2024-0104', initials: 'PO', name: 'Peter Omondi', email: 'peter.o@email.com', idNumber: '27890123', approvedDate: 'Nov 28, 2024', approvedBy: 'Admin Grace', tier: 'Silver', initialShares: 15000 },
    ];

    this.rejectedKycList = [
      { applicationId: 'KYC-2024-0201', initials: 'BK', name: 'Brian Kipkorir', email: 'brian.k@email.com', rejectedDate: 'Dec 11, 2024', rejectionReason: 'Blurry ID photo', rejectedBy: 'Admin James', canResubmit: true },
      { applicationId: 'KYC-2024-0202', initials: 'RN', name: 'Rose Nyambura', email: 'rose.n@email.com', rejectedDate: 'Dec 9, 2024', rejectionReason: 'Expired national ID', rejectedBy: 'Admin Grace', canResubmit: true },
      { applicationId: 'KYC-2024-0203', initials: 'SM', name: 'Samuel Maina', email: 'samuel.m@email.com', rejectedDate: 'Dec 7, 2024', rejectionReason: 'Duplicate account detected', rejectedBy: 'Admin James', canResubmit: false },
    ];

    this.activityLog = [
      { id: 1, type: 'approved', actor: 'Admin James', action: 'approved KYC for', target: 'Sarah Wanjiku', timestamp: 'Dec 10, 2024 · 2:30 PM', details: 'Gold tier assigned, 25 shares' },
      { id: 2, type: 'rejected', actor: 'Admin Grace', action: 'rejected KYC for', target: 'Brian Kipkorir', timestamp: 'Dec 11, 2024 · 10:15 AM', details: 'Blurry ID photo — resubmission allowed' },
      { id: 3, type: 'pending', actor: 'James Otieno', action: 'submitted KYC application', target: 'KYC-2024-0001', timestamp: 'Dec 12, 2024 · 9:00 AM', details: 'Urgent priority' },
      { id: 4, type: 'document', actor: 'Mary Akinyi', action: 'uploaded document for', target: 'KYC-2024-0002', timestamp: 'Dec 13, 2024 · 11:45 AM', details: 'Passport photo uploaded' },
      { id: 5, type: 'approved', actor: 'Admin James', action: 'approved KYC for', target: 'John Kamau', timestamp: 'Dec 8, 2024 · 4:00 PM', details: 'Silver tier, 10 shares' },
      { id: 6, type: 'pending', actor: 'Grace Wanjiru', action: 'submitted KYC application', target: 'KYC-2024-0004', timestamp: 'Dec 15, 2024 · 8:30 AM', details: 'Normal priority' },
    ];

    this.bulkApproveList = this.pendingKycList.filter(k => k.progress === 100).map(k => ({
      applicationId: k.applicationId,
      name: k.name,
      docsVerified: k.documents.filter(d => d.status === 'verified').length,
      totalDocs: k.documents.length,
      selected: true,
    }));
  }

  get filteredPendingKyc(): KycApplication[] {
    let result = [...this.pendingKycList];
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(k => k.name.toLowerCase().includes(q) || k.applicationId.toLowerCase().includes(q) || k.idNumber.includes(q) || k.email.toLowerCase().includes(q));
    }
    if (this.filterUrgency !== 'all') result = result.filter(k => k.urgency === this.filterUrgency);
    if (this.filterDocStatus !== 'all') {
      if (this.filterDocStatus === 'complete') result = result.filter(k => k.progress === 100);
      if (this.filterDocStatus === 'incomplete') result = result.filter(k => k.progress < 100);
    }
    return result;
  }

  get filteredApprovedKyc(): ApprovedKyc[] {
    let result = [...this.approvedKycList];
    if (this.searchTermApproved.trim()) {
      const q = this.searchTermApproved.toLowerCase();
      result = result.filter(k => k.name.toLowerCase().includes(q) || k.applicationId.toLowerCase().includes(q) || k.idNumber.includes(q));
    }
    if (this.filterTier !== 'all') result = result.filter(k => k.tier === this.filterTier);
    return result;
  }

  get filteredRejectedKyc(): RejectedKyc[] {
    let result = [...this.rejectedKycList];
    if (this.searchTermRejected.trim()) {
      const q = this.searchTermRejected.toLowerCase();
      result = result.filter(k => k.name.toLowerCase().includes(q) || k.applicationId.toLowerCase().includes(q));
    }
    if (this.filterRejectionReason !== 'all') result = result.filter(k => k.rejectionReason.toLowerCase().includes(this.filterRejectionReason));
    return result;
  }

  get filteredActivityLog(): ActivityLog[] {
    if (this.filterActivityType === 'all') return this.activityLog;
    return this.activityLog.filter(a => a.type === this.filterActivityType);
  }

  get allTermsAccepted(): boolean {
    return this.terms.every(t => t.accepted) && this.regForm.masterDeclaration;
  }

  openModal(name: keyof Modals): void {
    this.closeAllModals();
    this.modals[name] = true;
    document.body.style.overflow = 'hidden';
  }

  closeAllModals(): void {
    (Object.keys(this.modals) as Array<keyof Modals>).forEach(key => (this.modals[key] = false));
    document.body.style.overflow = '';
  }

  openKycDetail(kyc: KycApplication): void {
    this.selectedKyc = { ...kyc };
    this.verificationNotes = '';
    this.openModal('kycDetails');
  }

  openApproveModal(): void {
    if (!this.selectedKyc) return;
    this.approvalForm = { tier: 'Bronze', initialShares: 5000, notes: '', sendWelcome: true, confirmVerification: false };
    this.openModal('approve');
  }

  openRejectModal(): void {
    if (!this.selectedKyc) return;
    this.rejectionForm = { reason: '', details: '', documentsToResubmit: [], allowResubmission: true, notifyApplicant: true };
    this.openModal('reject');
  }

  openDocumentPreview(doc: KycDocument): void {
    this.selectedDocument = { ...doc };
    this.openModal('documentPreview');
  }

  openRequestInfo(): void {
    this.requestInfoSubject = '';
    this.requestInfoMessage = '';
    this.requestInfoDocs = [];
    this.openModal('requestInfo');
  }

  openUploadForMember(): void {
    this.uploadForMemberDocType = '';
    this.uploadForMemberFile = null;
    this.openModal('uploadForMember');
  }

  openEditMemberInfo(): void {
    if (!this.selectedKyc) return;
    const parts = this.selectedKyc.name.split(' ');
    this.editMemberForm = {
      firstName: parts[0] || '', middleName: '', lastName: parts[1] || '',
      nationalId: this.selectedKyc.idNumber, dateOfBirth: this.selectedKyc.dateOfBirth,
      gender: this.selectedKyc.gender, maritalStatus: '',
      phone: this.selectedKyc.phone, altPhone: '', email: this.selectedKyc.email,
      address: this.selectedKyc.address, county: '', postalCode: '',
      occupation: this.selectedKyc.occupation, employer: this.selectedKyc.employer,
      incomeRange: '', kraPin: '',
    };
    this.editMemberActiveTab = 'personal';
    this.openModal('editMemberInfo');
  }

  openAddNote(): void {
    this.addNoteText = '';
    this.addNoteCategory = 'general';
    this.openModal('addNote');
  }

  confirmApproval(): void {
    if (!this.selectedKyc || !this.approvalForm.confirmVerification) return;
    const approved: ApprovedKyc = {
      applicationId: this.selectedKyc.applicationId,
      initials: this.selectedKyc.initials,
      name: this.selectedKyc.name,
      email: this.selectedKyc.email,
      idNumber: this.selectedKyc.idNumber,
      approvedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      approvedBy: 'Admin James',
      tier: this.approvalForm.tier as 'Gold' | 'Silver' | 'Bronze',
      initialShares: this.approvalForm.initialShares,
    };
    this.approvedKycList = [approved, ...this.approvedKycList];
    this.pendingKycList = this.pendingKycList.filter(k => k.applicationId !== this.selectedKyc?.applicationId);
    this.approvedCount++;
    this.pendingCount--;
    this.closeAllModals();
    this.showToast('success', `${approved.name} has been approved and activated.`);
  }

  confirmRejection(): void {
    if (!this.selectedKyc || !this.rejectionForm.reason || !this.rejectionForm.details) return;
    const rejected: RejectedKyc = {
      applicationId: this.selectedKyc.applicationId,
      initials: this.selectedKyc.initials,
      name: this.selectedKyc.name,
      email: this.selectedKyc.email,
      rejectedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      rejectionReason: this.rejectionForm.reason,
      rejectedBy: 'Admin James',
      canResubmit: this.rejectionForm.allowResubmission,
    };
    this.rejectedKycList = [rejected, ...this.rejectedKycList];
    this.pendingKycList = this.pendingKycList.filter(k => k.applicationId !== this.selectedKyc?.applicationId);
    this.rejectedCount++;
    this.pendingCount--;
    this.closeAllModals();
    this.showToast('danger', `${rejected.name}'s application has been rejected.`);
  }

  verifyDocument(doc: KycDocument): void {
    doc.status = 'verified';
    if (this.selectedKyc) {
      const d = this.selectedKyc.documents.find(x => x.name === doc.name);
      if (d) d.status = 'verified';
      this.selectedKyc.progress = Math.round((this.selectedKyc.documents.filter(x => x.status === 'verified').length / this.selectedKyc.documents.length) * 100);
    }
  }

  rejectDocument(doc: KycDocument): void {
    doc.status = 'rejected';
    if (this.selectedKyc) {
      const d = this.selectedKyc.documents.find(x => x.name === doc.name);
      if (d) d.status = 'rejected';
    }
  }

  toggleDocResubmit(docName: string): void {
    const index = this.rejectionForm.documentsToResubmit.indexOf(docName);
    if (index > -1) this.rejectionForm.documentsToResubmit.splice(index, 1);
    else this.rejectionForm.documentsToResubmit.push(docName);
  }

  allowResubmission(kyc: RejectedKyc): void {
    kyc.canResubmit = true;
  }

  viewApprovedProfile(kyc: ApprovedKyc): void {
    this.showToast('info', `Viewing profile for ${kyc.name}.`);
  }

  submitRequestInfo(): void {
    if (!this.requestInfoMessage.trim()) return;
    this.closeAllModals();
    this.showToast('success', 'Information request sent to applicant.');
  }

  submitUploadForMember(): void {
    if (!this.uploadForMemberDocType) return;
    this.closeAllModals();
    this.showToast('success', 'Document uploaded on behalf of the member.');
  }

  saveEditMemberInfo(): void {
    if (!this.editMemberForm.firstName || !this.editMemberForm.lastName) return;
    if (this.selectedKyc) {
      this.selectedKyc.name = `${this.editMemberForm.firstName} ${this.editMemberForm.lastName}`;
      this.selectedKyc.phone = this.editMemberForm.phone;
      this.selectedKyc.email = this.editMemberForm.email;
      this.selectedKyc.idNumber = this.editMemberForm.nationalId;
      this.selectedKyc.occupation = this.editMemberForm.occupation;
      this.selectedKyc.employer = this.editMemberForm.employer;
    }
    this.closeAllModals();
    this.showToast('success', 'Member information updated.');
  }

  submitAddNote(): void {
    if (!this.addNoteText.trim()) return;
    this.activityLog = [{
      id: this.activityLog.length + 1,
      type: 'document',
      actor: 'Admin James',
      action: 'added a note to',
      target: this.selectedKyc?.name || 'application',
      timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      details: this.addNoteText.substring(0, 80),
    }, ...this.activityLog];
    this.closeAllModals();
  }

  executeBulkApprove(): void {
    if (!this.bulkApproveConfirm) return;
    const selected = this.bulkApproveList.filter(item => item.selected);
    selected.forEach(item => {
      const kyc = this.pendingKycList.find(k => k.applicationId === item.applicationId);
      if (kyc) {
        this.approvedKycList = [{
          applicationId: kyc.applicationId, initials: kyc.initials, name: kyc.name, email: kyc.email,
          idNumber: kyc.idNumber, approvedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          approvedBy: 'Admin James', tier: this.bulkApproveTier as 'Gold' | 'Silver' | 'Bronze', initialShares: 5000,
        }, ...this.approvedKycList];
        this.pendingKycList = this.pendingKycList.filter(k => k.applicationId !== kyc.applicationId);
      }
    });
    this.approvedCount += selected.length;
    this.pendingCount -= selected.length;
    this.closeAllModals();
    this.showToast('success', `${selected.length} application(s) approved.`);
  }

  exportData(): void {
    this.closeAllModals();
    this.showToast('success', `KYC data exported as ${this.selectedExportFormat}.`);
  }

  saveSettings(): void {
    this.closeAllModals();
    this.showToast('success', 'KYC settings saved.');
  }

  // Registration wizard
  nextStep(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) this.currentStep = step;
  }

  onDocUpload(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploadDocuments[index].uploaded = true;
  }

  onUploadForMemberFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploadForMemberFile = file;
  }

  toggleFee(fee: Fee): void {
    if (!fee.required) fee.selected = !fee.selected;
  }

  calculateTotal(): number {
    return this.fees.filter(f => f.selected).reduce((sum, f) => sum + f.amount, 0);
  }

  getPaymentMethodLabel(): string {
    return this.paymentMethods.find(m => m.value === this.regForm.paymentMethod)?.label || '';
  }

  completeRegistration(): void {
    if (!this.regForm.firstName || !this.regForm.lastName || !this.regForm.nationalId) {
      this.showToast('warning', 'Fill in all required fields before submitting.');
      this.currentStep = 1;
      return;
    }
    if (!this.allTermsAccepted) {
      this.showToast('warning', 'Accept all terms and the master declaration.');
      this.currentStep = 9;
      return;
    }
    this.closeAllModals();
    this.currentStep = 1;
    this.showToast('success', `${this.regForm.firstName} ${this.regForm.lastName} registered and pending KYC review.`);
  }

  showToast(type: Toast['type'], message: string): void {
    const id = Date.now();
    this.toasts.push({ id, message, type, visible: true });
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 3000);
  }

  dismissToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
