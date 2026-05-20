import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ==================== INTERFACES ====================
interface Document {
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
  documents: Document[];
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

// ==================== COMPONENT ====================
@Component({
  selector: 'app-kyc-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc-verification.html',
  styleUrls: ['./kyc-verification.scss']
})
export class KycVerificationComponent implements OnInit {
  // ==================== STATE ====================
  activeTab: string = 'pending';
  toasts: Toast[] = [];
  
  // Search & Filters
  searchTerm: string = '';
  searchTermApproved: string = '';
  searchTermRejected: string = '';
  filterUrgency: string = 'all';
  filterDocStatus: string = 'all';
  filterApprovedMonth: string = 'all';
  filterTier: string = 'all';
  filterRejectionReason: string = 'all';
  filterActivityType: string = 'all';
  sortBy: string = 'newest';

  // Stats
  pendingCount: number = 24;
  approvedCount: number = 156;
  rejectedCount: number = 12;
  newToday: number = 8;
  approvalRate: number = 92;
  urgentCount: number = 5;
  returnedForResubmission: number = 7;

  // Modals
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
    addNote: false
  };

  // Selected items
  selectedKyc: KycApplication | null = null;
  selectedDocument: Document | null = null;
  verificationNotes: string = '';

  // Forms
  approvalForm = {
    tier: 'Bronze',
    initialShares: 5000,
    notes: '',
    sendWelcome: true,
    confirmVerification: false
  };

  rejectionForm = {
    reason: '',
    details: '',
    documentsToResubmit: [] as string[],
    allowResubmission: true,
    notifyApplicant: true
  };

  exportOptions = {
    range: 'pending'
  };

  kycSettings = {
    reminderDays: 3,
    expiryCheckDays: 90,
    maxResubmissions: 3,
    autoNotify: true,
    requireAllDocs: true
  };

  // ==================== REGISTRATION WIZARD ====================
  currentStep: number = 1;
  totalSteps: number = 10;
  stepNames: string[] = [
    'Personal Details', 'Contact Details', 'Residential Details', 'Employment Details',
    'Next of Kin', 'Documents', 'Shares & Fees', 'Payment', 'Terms & Policies', 'Review & Complete'
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
    masterDeclaration: false
  };

  contactMethods = [
    { value: 'sms', label: 'SMS', icon: '💬' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'whatsapp', label: 'WhatsApp', icon: '📱' }
  ];

  paymentMethods = [
    { value: 'mpesa', label: 'M-Pesa', icon: '📱' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
    { value: 'card', label: 'Card Payment', icon: '💳' }
  ];

  uploadDocuments = [
    { name: 'National ID (Front)', icon: '🪪', required: true, formats: 'PDF, JPG, PNG', maxSize: '5MB', uploaded: false },
    { name: 'National ID (Back)', icon: '🪪', required: true, formats: 'PDF, JPG, PNG', maxSize: '5MB', uploaded: false },
    { name: 'Passport Photo', icon: '📸', required: true, formats: 'JPG, PNG', maxSize: '2MB', uploaded: false },
    { name: 'KRA PIN Certificate', icon: '📄', required: false, formats: 'PDF', maxSize: '2MB', uploaded: false }
  ];

  fees = [
    { name: 'Minimum Share Capital', amount: 5000, required: true, selected: true, editable: false },
    { name: 'Registration Fee', amount: 500, required: true, selected: true, editable: false },
    { name: 'Onboarding Charge', amount: 200, required: true, selected: true, editable: false },
    { name: 'Membership Card', amount: 150, required: false, selected: true, editable: false },
    { name: 'Additional Shares', amount: 0, required: false, selected: false, editable: true }
  ];

  terms = [
    { id: 1, name: 'SACCO Terms & Conditions', description: 'General terms governing membership, services, and obligations.', accepted: false },
    { id: 2, name: 'SACCOPay Digital Services Terms', description: 'Terms for using mobile banking, USSD, and digital payment services.', accepted: false },
    { id: 3, name: 'Data Protection & Privacy Policy', description: 'How we collect, use, and protect your personal information.', accepted: false },
    { id: 4, name: 'Loan Policy Agreement', description: 'Terms for loan applications, interest rates, and repayment.', accepted: false },
    { id: 5, name: 'Savings & Withdrawal Policy', description: 'Rules governing savings accounts and withdrawal procedures.', accepted: false },
    { id: 6, name: 'Membership Rights & Obligations', description: 'Your rights as a member and responsibilities to the SACCO.', accepted: false },
    { id: 7, name: 'Electronic Communication Consent', description: 'Consent to receive statements, notices via SMS and email.', accepted: false },
    { id: 8, name: 'AML/KYC Compliance Declaration', description: 'Declaration of compliance with anti-money laundering regulations.', accepted: false }
  ];

  get allTermsAccepted(): boolean {
    return this.terms.every(t => t.accepted);
  }

  // Bulk Approve
  bulkApproveList = [
    { applicationId: 'KYC-2024-0088', name: 'Alice Nyambura', docsVerified: 4, totalDocs: 4, selected: true },
    { applicationId: 'KYC-2024-0086', name: 'Mary Wambui', docsVerified: 4, totalDocs: 4, selected: true },
    { applicationId: 'KYC-2024-0084', name: 'Joseph Nderitu', docsVerified: 4, totalDocs: 4, selected: true },
    { applicationId: 'KYC-2024-0082', name: 'Grace Wanjiru', docsVerified: 4, totalDocs: 4, selected: true }
  ];

  bulkApprovalForm = {
    tier: 'Bronze',
    sendWelcome: true,
    confirmVerification: false
  };

  // Request Info Form
  requestInfoForm = {
    documents: [
      { name: 'National ID (Clearer copy)', requested: false },
      { name: 'Passport Photo', requested: false },
      { name: 'KRA PIN Certificate', requested: false },
      { name: 'Proof of Residence', requested: false }
    ],
    additionalNotes: '',
    deadline: '7'
  };

  // Upload for Member Form
  uploadForMemberForm = {
    memberName: '',
    applicationId: '',
    documentType: '',
    notes: '',
    notifyMember: true
  };

  // Edit Member Form
  editMemberTabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'financial', label: 'Financial' }
  ];
  editMemberActiveTab: string = 'personal';

  editMemberForm = {
    firstName: '', middleName: '', lastName: '', nationalId: '',
    dateOfBirth: '', gender: '', maritalStatus: '',
    phone: '', altPhone: '', email: '', address: '', county: '', postalCode: '',
    occupation: '', employer: '', incomeRange: '', kraPin: ''
  };

  // Add Note Form
  addNoteForm = {
    type: 'general',
    content: '',
    visibleToMember: false
  };

  // Tabs
  tabs: Tab[] = [
    { id: 'pending', label: 'Pending KYC', icon: '⏳' },
    { id: 'approved', label: 'Approved', icon: '✅' },
    { id: 'rejected', label: 'Rejected', icon: '❌' },
    { id: 'history', label: 'Activity Log', icon: '📋' }
  ];

  // Required Documents
  requiredDocuments: RequiredDocument[] = [
    { name: 'National ID (Front & Back)', icon: '🪪', description: 'Valid Kenyan National ID card', required: true, color: '#2196f3', formats: 'JPG, PNG, PDF', maxSize: '5MB', notes: 'Must be clearly visible' },
    { name: 'Passport Photo', icon: '📸', description: 'Recent passport-size photograph', required: true, color: '#9c27b0', formats: 'JPG, PNG', maxSize: '2MB', notes: 'White background preferred' },
    { name: 'Proof of Address', icon: '🏠', description: 'Utility bill or bank statement (last 3 months)', required: true, color: '#00d084', formats: 'JPG, PNG, PDF', maxSize: '5MB' },
    { name: 'KRA PIN Certificate', icon: '📄', description: 'Valid KRA PIN certificate', required: true, color: '#ff9800', formats: 'PDF', maxSize: '2MB' },
    { name: 'Payslip / Income Proof', icon: '💰', description: 'Latest payslip or income statement', required: false, color: '#22c55e', formats: 'JPG, PNG, PDF', maxSize: '5MB' },
    { name: 'Next of Kin ID', icon: '👥', description: 'National ID of nominated next of kin', required: false, color: '#64748b', formats: 'JPG, PNG, PDF', maxSize: '5MB' }
  ];

  // Export Formats
  exportFormats: ExportFormat[] = [
    { name: 'PDF Report', icon: '📄', desc: 'Formatted report with summary', color: '#ef4444' },
    { name: 'Excel', icon: '📊', desc: 'Spreadsheet with all data', color: '#22c55e' },
    { name: 'CSV', icon: '📋', desc: 'Raw data comma-separated', color: '#2196f3' }
  ];

  // Member Transactions (for detail modal)
  memberTransactions = [
    { date: 'Jan 12, 2026', type: 'Purchase', shares: '+50', amount: 'KES 25,000' },
    { date: 'Dec 15, 2025', type: 'Dividend', shares: '-', amount: 'KES 53,125' }
  ];

  // ==================== DATA ====================
  pendingKycList: KycApplication[] = [
    {
      applicationId: 'KYC-2026-00234',
      initials: 'JM',
      name: 'Jane Muthoni',
      email: 'jane.muthoni@email.com',
      phone: '+254 712 345 678',
      idNumber: '32456789',
      dateOfBirth: 'March 15, 1990',
      gender: 'Female',
      address: '123 Moi Avenue, Nairobi',
      occupation: 'Teacher',
      employer: 'Rongo High School',
      submittedDate: 'Jan 14, 2026',
      urgency: 'urgent',
      progress: 100,
      documents: [
        { name: 'National ID', icon: '🪪', status: 'verified', uploadedDate: 'Jan 14, 2026', fileName: 'id_front.jpg', fileSize: '1.2 MB' },
        { name: 'Passport Photo', icon: '📸', status: 'verified', uploadedDate: 'Jan 14, 2026', fileName: 'photo.jpg', fileSize: '450 KB' },
        { name: 'Proof of Address', icon: '🏠', status: 'verified', uploadedDate: 'Jan 14, 2026', fileName: 'utility_bill.pdf', fileSize: '890 KB' },
        { name: 'KRA PIN', icon: '📄', status: 'verified', uploadedDate: 'Jan 14, 2026', fileName: 'kra_pin.pdf', fileSize: '320 KB' }
      ],
      nextOfKin: { name: 'John Muthoni', relationship: 'Spouse', phone: '+254 722 111 222', idNumber: '28765432' }
    },
    {
      applicationId: 'KYC-2026-00235',
      initials: 'PO',
      name: 'Peter Ochieng',
      email: 'peter.ochieng@email.com',
      phone: '+254 733 456 789',
      idNumber: '29876543',
      dateOfBirth: 'July 22, 1985',
      gender: 'Male',
      address: '45 Oginga Odinga Street, Kisumu',
      occupation: 'Business Owner',
      employer: 'Self Employed',
      submittedDate: 'Jan 13, 2026',
      urgency: 'normal',
      progress: 75,
      documents: [
        { name: 'National ID', icon: '🪪', status: 'verified', uploadedDate: 'Jan 13, 2026', fileName: 'national_id.jpg', fileSize: '1.1 MB' },
        { name: 'Passport Photo', icon: '📸', status: 'verified', uploadedDate: 'Jan 13, 2026', fileName: 'passport_photo.jpg', fileSize: '380 KB' },
        { name: 'Proof of Address', icon: '🏠', status: 'pending', uploadedDate: 'Jan 13, 2026', fileName: 'address_proof.pdf', fileSize: '720 KB' },
        { name: 'KRA PIN', icon: '📄', status: 'missing' }
      ],
      nextOfKin: { name: 'Mary Ochieng', relationship: 'Wife', phone: '+254 711 333 444', idNumber: '31234567' }
    },
    {
      applicationId: 'KYC-2026-00236',
      initials: 'AW',
      name: 'Alice Wanjiku',
      email: 'alice.wanjiku@email.com',
      phone: '+254 700 123 456',
      idNumber: '34567890',
      dateOfBirth: 'December 5, 1992',
      gender: 'Female',
      address: '78 Kenyatta Avenue, Nakuru',
      occupation: 'Nurse',
      employer: 'Nakuru Level 5 Hospital',
      submittedDate: 'Jan 12, 2026',
      urgency: 'urgent',
      progress: 50,
      documents: [
        { name: 'National ID', icon: '🪪', status: 'verified', uploadedDate: 'Jan 12, 2026', fileName: 'id_card.jpg', fileSize: '980 KB' },
        { name: 'Passport Photo', icon: '📸', status: 'rejected', uploadedDate: 'Jan 12, 2026', fileName: 'photo_blurry.jpg', fileSize: '200 KB' },
        { name: 'Proof of Address', icon: '🏠', status: 'missing' },
        { name: 'KRA PIN', icon: '📄', status: 'pending', uploadedDate: 'Jan 12, 2026', fileName: 'kra.pdf', fileSize: '290 KB' }
      ],
      nextOfKin: { name: 'James Wanjiku', relationship: 'Brother', phone: '+254 722 555 666', idNumber: '30987654' }
    },
    {
      applicationId: 'KYC-2026-00237',
      initials: 'DK',
      name: 'David Kamau',
      email: 'david.kamau@email.com',
      phone: '+254 745 678 901',
      idNumber: '27654321',
      dateOfBirth: 'April 18, 1988',
      gender: 'Male',
      address: '12 Uhuru Highway, Eldoret',
      occupation: 'Engineer',
      employer: 'Kenya Power',
      submittedDate: 'Jan 11, 2026',
      urgency: 'normal',
      progress: 100,
      documents: [
        { name: 'National ID', icon: '🪪', status: 'verified', uploadedDate: 'Jan 11, 2026', fileName: 'id_scan.pdf', fileSize: '1.5 MB' },
        { name: 'Passport Photo', icon: '📸', status: 'verified', uploadedDate: 'Jan 11, 2026', fileName: 'passport.jpg', fileSize: '520 KB' },
        { name: 'Proof of Address', icon: '🏠', status: 'verified', uploadedDate: 'Jan 11, 2026', fileName: 'electricity_bill.pdf', fileSize: '1.1 MB' },
        { name: 'KRA PIN', icon: '📄', status: 'verified', uploadedDate: 'Jan 11, 2026', fileName: 'kra_cert.pdf', fileSize: '350 KB' }
      ],
      nextOfKin: { name: 'Grace Kamau', relationship: 'Spouse', phone: '+254 733 777 888', idNumber: '29123456' }
    }
  ];

  approvedKycList: ApprovedKyc[] = [
    { applicationId: 'KYC-2026-00189', initials: 'SK', name: 'Sarah Kiplagat', email: 'sarah.k@email.com', idNumber: '31234567', approvedDate: 'Jan 10, 2026', approvedBy: 'Admin John', tier: 'Silver', initialShares: 10000 },
    { applicationId: 'KYC-2026-00188', initials: 'MN', name: 'Michael Njoroge', email: 'michael.n@email.com', idNumber: '28765432', approvedDate: 'Jan 9, 2026', approvedBy: 'Admin Mary', tier: 'Bronze', initialShares: 5000 },
    { applicationId: 'KYC-2026-00185', initials: 'FW', name: 'Faith Wambui', email: 'faith.w@email.com', idNumber: '30987654', approvedDate: 'Jan 8, 2026', approvedBy: 'Admin John', tier: 'Gold', initialShares: 50000 },
    { applicationId: 'KYC-2026-00182', initials: 'JO', name: 'Joseph Otieno', email: 'joseph.o@email.com', idNumber: '29456789', approvedDate: 'Jan 7, 2026', approvedBy: 'Admin Mary', tier: 'Bronze', initialShares: 5000 }
  ];

  rejectedKycList: RejectedKyc[] = [
    { applicationId: 'KYC-2026-00201', initials: 'RK', name: 'Robert Kimani', email: 'robert.k@email.com', rejectedDate: 'Jan 12, 2026', rejectionReason: 'Invalid Documents', rejectedBy: 'Admin John', canResubmit: true },
    { applicationId: 'KYC-2026-00198', initials: 'EN', name: 'Elizabeth Njeri', email: 'elizabeth.n@email.com', rejectedDate: 'Jan 10, 2026', rejectionReason: 'Incomplete Application', rejectedBy: 'Admin Mary', canResubmit: true },
    { applicationId: 'KYC-2026-00195', initials: 'TM', name: 'Thomas Mwangi', email: 'thomas.m@email.com', rejectedDate: 'Jan 8, 2026', rejectionReason: 'Fraud Suspected', rejectedBy: 'Admin John', canResubmit: false }
  ];

  activityLog: ActivityLog[] = [
    { id: 1, type: 'approved', actor: 'Admin John', action: 'approved KYC for', target: 'Sarah Kiplagat', timestamp: 'Jan 14, 2026, 2:45 PM', details: 'Tier: Silver, Initial Shares: 10,000' },
    { id: 2, type: 'rejected', actor: 'Admin Mary', action: 'rejected KYC for', target: 'Robert Kimani', timestamp: 'Jan 14, 2026, 11:30 AM', details: 'Reason: Invalid ID document' },
    { id: 3, type: 'document', actor: 'System', action: 'received new document from', target: 'Peter Ochieng', timestamp: 'Jan 14, 2026, 10:15 AM', details: 'Document: Proof of Address' },
    { id: 4, type: 'pending', actor: 'Admin John', action: 'requested resubmission from', target: 'Alice Wanjiku', timestamp: 'Jan 13, 2026, 4:00 PM', details: 'Passport photo is blurry' },
    { id: 5, type: 'approved', actor: 'Admin Mary', action: 'approved KYC for', target: 'Michael Njoroge', timestamp: 'Jan 13, 2026, 2:30 PM', details: 'Tier: Bronze, Initial Shares: 5,000' }
  ];

  // ==================== COMPUTED ====================
  get filteredPendingKyc(): KycApplication[] {
    return this.pendingKycList.filter(kyc => {
      const matchSearch = !this.searchTerm ||
        kyc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        kyc.applicationId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        kyc.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchUrgency = this.filterUrgency === 'all' || kyc.urgency === this.filterUrgency;
      const matchDocStatus = this.filterDocStatus === 'all' ||
        (this.filterDocStatus === 'complete' && kyc.progress === 100) ||
        (this.filterDocStatus === 'incomplete' && kyc.progress < 100);
      return matchSearch && matchUrgency && matchDocStatus;
    });
  }

  get filteredApprovedKyc(): ApprovedKyc[] {
    return this.approvedKycList.filter(kyc => {
      const matchSearch = !this.searchTermApproved ||
        kyc.name.toLowerCase().includes(this.searchTermApproved.toLowerCase()) ||
        kyc.applicationId.toLowerCase().includes(this.searchTermApproved.toLowerCase());
      const matchTier = this.filterTier === 'all' || kyc.tier === this.filterTier;
      return matchSearch && matchTier;
    });
  }

  get filteredRejectedKyc(): RejectedKyc[] {
    return this.rejectedKycList.filter(kyc => {
      const matchSearch = !this.searchTermRejected ||
        kyc.name.toLowerCase().includes(this.searchTermRejected.toLowerCase()) ||
        kyc.applicationId.toLowerCase().includes(this.searchTermRejected.toLowerCase());
      return matchSearch;
    });
  }

  // ==================== LIFECYCLE ====================
  ngOnInit(): void {
    // Initialize component
  }

  // ==================== TOAST METHODS ====================
  showToast(message: string, type: Toast['type'] = 'success'): void {
    const id = Date.now() + Math.random();
    const toast: Toast = { id, message, type, visible: true };
    this.toasts.push(toast);

    setTimeout(() => {
      const idx = this.toasts.findIndex(t => t.id === id);
      if (idx > -1) {
        this.toasts[idx].visible = false;
        setTimeout(() => {
          this.toasts = this.toasts.filter(t => t.id !== id);
        }, 350);
      }
    }, 3500);
  }

  dismissToast(id: number): void {
    const idx = this.toasts.findIndex(t => t.id === id);
    if (idx > -1) {
      this.toasts[idx].visible = false;
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 350);
    }
  }

  // ==================== TAB METHODS ====================
  switchTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // ==================== MODAL METHODS ====================
  openModal(modalName: keyof Modals): void {
    this.modals[modalName] = true;
  }

  closeModal(modalName: keyof Modals): void {
    this.modals[modalName] = false;
  }

  // ==================== KYC ACTIONS ====================
  viewKycDetails(kyc: KycApplication): void {
    this.selectedKyc = kyc;
    this.verificationNotes = '';
    this.openModal('kycDetails');
  }

  openVerifyModal(kyc: KycApplication): void {
    this.selectedKyc = kyc;
    this.showToast('Opening verification panel...', 'info');
  }

  openApproveModal(kyc: KycApplication): void {
    this.selectedKyc = kyc;
    this.approvalForm = {
      tier: 'Bronze',
      initialShares: 5000,
      notes: '',
      sendWelcome: true,
      confirmVerification: false
    };
    this.openModal('approve');
  }

  openRejectModal(kyc: KycApplication): void {
    this.selectedKyc = kyc;
    this.rejectionForm = {
      reason: '',
      details: '',
      documentsToResubmit: [],
      allowResubmission: true,
      notifyApplicant: true
    };
    this.openModal('reject');
  }

  submitApproval(): void {
    if (!this.approvalForm.confirmVerification) {
      this.showToast('Please confirm document verification', 'warning');
      return;
    }
    if (this.selectedKyc) {
      this.showToast(`KYC approved for ${this.selectedKyc.name}! Account activated.`, 'success');
      this.closeModal('approve');
      // Remove from pending list
      this.pendingKycList = this.pendingKycList.filter(k => k.applicationId !== this.selectedKyc?.applicationId);
      this.pendingCount--;
      this.approvedCount++;
    }
  }

  submitRejection(): void {
    if (!this.rejectionForm.reason || !this.rejectionForm.details) {
      this.showToast('Please provide rejection reason and details', 'warning');
      return;
    }
    if (this.selectedKyc) {
      this.showToast(`KYC rejected for ${this.selectedKyc.name}`, 'danger');
      this.closeModal('reject');
      // Remove from pending list
      this.pendingKycList = this.pendingKycList.filter(k => k.applicationId !== this.selectedKyc?.applicationId);
      this.pendingCount--;
      this.rejectedCount++;
    }
  }

  toggleResubmitDoc(docName: string): void {
    const idx = this.rejectionForm.documentsToResubmit.indexOf(docName);
    if (idx > -1) {
      this.rejectionForm.documentsToResubmit.splice(idx, 1);
    } else {
      this.rejectionForm.documentsToResubmit.push(docName);
    }
  }

  // ==================== DOCUMENT ACTIONS ====================
  previewDocument(doc: Document): void {
    this.selectedDocument = doc;
    this.openModal('documentPreview');
  }

  downloadDocument(doc: Document): void {
    this.showToast(`Downloading ${doc.name}...`, 'info');
  }

  verifyDocument(doc: Document): void {
    doc.status = 'verified';
    this.showToast(`${doc.name} verified successfully`, 'success');
    this.updateKycProgress();
  }

  rejectDocument(doc: Document): void {
    doc.status = 'rejected';
    this.showToast(`${doc.name} marked as rejected`, 'danger');
    this.updateKycProgress();
  }

  updateKycProgress(): void {
    if (this.selectedKyc) {
      const totalDocs = this.selectedKyc.documents.length;
      const verifiedDocs = this.selectedKyc.documents.filter(d => d.status === 'verified').length;
      this.selectedKyc.progress = Math.round((verifiedDocs / totalDocs) * 100);
    }
  }

  // ==================== APPROVED ACTIONS ====================
  viewMemberProfile(kyc: ApprovedKyc): void {
    this.showToast(`Opening profile for ${kyc.name}...`, 'info');
  }

  downloadDocs(kyc: ApprovedKyc): void {
    this.showToast(`Downloading documents for ${kyc.name}...`, 'info');
  }

  sendWelcome(kyc: ApprovedKyc): void {
    this.showToast(`Welcome message sent to ${kyc.name}`, 'success');
  }

  // ==================== REJECTED ACTIONS ====================
  viewRejectionDetails(kyc: RejectedKyc): void {
    this.showToast(`Viewing rejection details for ${kyc.name}`, 'info');
  }

  resendInstructions(kyc: RejectedKyc): void {
    this.showToast(`Resubmission instructions sent to ${kyc.name}`, 'success');
  }

  confirmDelete(kyc: RejectedKyc): void {
    if (confirm(`Are you sure you want to delete application ${kyc.applicationId}?`)) {
      this.rejectedKycList = this.rejectedKycList.filter(k => k.applicationId !== kyc.applicationId);
      this.rejectedCount--;
      this.showToast(`Application ${kyc.applicationId} deleted`, 'danger');
    }
  }

  // ==================== BULK ACTIONS ====================
  bulkAction(action: string): void {
    switch (action) {
      case 'approve':
        this.showToast('Bulk approving fully verified applications...', 'success');
        break;
      case 'reminder':
        this.showToast('Sending reminders to applicants with incomplete documents...', 'info');
        break;
      case 'export':
        this.showToast('Exporting all pending applications as CSV...', 'info');
        break;
      case 'archive':
        this.showToast('Archiving applications older than 90 days...', 'info');
        break;
    }
    this.closeModal('bulkActions');
  }

  // ==================== SETTINGS ====================
  saveSettings(): void {
    this.showToast('KYC settings saved successfully', 'success');
    this.closeModal('settings');
  }

  // ==================== EXPORT ====================
  exportData(format: string): void {
    this.showToast(`Exporting ${this.exportOptions.range} data as ${format}...`, 'info');
    this.closeModal('export');
  }

  exportActivityLog(): void {
    this.showToast('Exporting activity log...', 'info');
  }

  // ==================== REGISTRATION WIZARD METHODS ====================
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  calculateTotal(): number {
    return this.fees.filter(f => f.selected || f.required).reduce((sum, f) => sum + f.amount, 0);
  }

  getPaymentMethodLabel(): string {
    const method = this.paymentMethods.find(m => m.value === this.regForm.paymentMethod);
    return method ? method.label : '';
  }

  uploadDoc(doc: { name: string; uploaded: boolean }): void {
    doc.uploaded = true;
    this.showToast(`${doc.name} uploaded successfully`, 'success');
  }

  removeDocument(doc: { name: string; uploaded: boolean }): void {
    doc.uploaded = false;
    this.showToast(`${doc.name} removed`, 'info');
  }

  skipDocument(doc: { name: string }): void {
    this.showToast(`${doc.name} skipped`, 'info');
  }

  getAcceptedTermsCount(): number {
    return this.terms.filter(t => t.accepted).length;
  }

  acceptAllTerms(): void {
    this.terms.forEach(t => t.accepted = true);
    this.showToast('All terms accepted', 'success');
  }

  updateTermsCount(): void {
    // Auto-triggered by checkbox changes
  }

  viewTermDetails(term: { name: string }): void {
    this.showToast(`Viewing ${term.name}...`, 'info');
  }

  sendStkPush(): void {
    if (!this.regForm.mpesaPhone) {
      this.showToast('Please enter M-Pesa phone number', 'warning');
      return;
    }
    this.showToast('STK Push sent to +254 ' + this.regForm.mpesaPhone, 'success');
  }

  recordCashPayment(): void {
    if (!this.regForm.cashReceipt) {
      this.showToast('Please enter receipt number', 'warning');
      return;
    }
    this.showToast('Cash payment recorded successfully', 'success');
  }

  confirmBankPayment(): void {
    this.showToast('Bank payment confirmed', 'success');
  }

  processCardPayment(): void {
    if (!this.regForm.cardNumber || !this.regForm.cardExpiry || !this.regForm.cardCvv) {
      this.showToast('Please fill in all card details', 'warning');
      return;
    }
    this.showToast('Card payment processed successfully', 'success');
  }

  completeRegistration(): void {
    if (!this.regForm.masterDeclaration) {
      this.showToast('Please accept the member declaration', 'warning');
      return;
    }
    this.showToast('🎉 Member registration completed successfully!', 'success');
    this.closeModal('registration');
    this.resetRegistrationForm();
  }

  resetRegistrationForm(): void {
    this.currentStep = 1;
    this.regForm = {
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
      masterDeclaration: false
    };
    this.terms.forEach(t => t.accepted = false);
    this.uploadDocuments.forEach(d => d.uploaded = false);
  }

  // ==================== BULK APPROVE MODAL ====================
  getSelectedBulkCount(): number {
    return this.bulkApproveList.filter(a => a.selected).length;
  }

  confirmBulkApproval(): void {
    if (!this.bulkApprovalForm.confirmVerification) {
      this.showToast('Please confirm verification', 'warning');
      return;
    }
    const count = this.getSelectedBulkCount();
    this.showToast(`${count} applications approved successfully!`, 'success');
    this.closeModal('bulkApprove');
  }

  // ==================== REQUEST INFO MODAL ====================
  sendInfoRequest(): void {
    if (!this.selectedKyc) return;
    const requestedDocs = this.requestInfoForm.documents.filter(d => d.requested);
    if (requestedDocs.length === 0 && !this.requestInfoForm.additionalNotes) {
      this.showToast('Please select documents or add notes', 'warning');
      return;
    }
    this.showToast(`Information request sent to ${this.selectedKyc.name}`, 'success');
    this.closeModal('requestInfo');
  }

  // ==================== UPLOAD FOR MEMBER ====================
  triggerFileUpload(): void {
    this.showToast('File upload dialog opened', 'info');
  }

  uploadDocumentForMember(): void {
    if (!this.uploadForMemberForm.documentType) {
      this.showToast('Please select document type', 'warning');
      return;
    }
    this.showToast('Document uploaded successfully', 'success');
    this.closeModal('uploadForMember');
  }

  // ==================== EDIT MEMBER ====================
  saveMemberInfo(): void {
    this.showToast('Member information updated successfully', 'success');
    this.closeModal('editMemberInfo');
  }

  // ==================== ADD NOTE ====================
  saveNote(): void {
    if (!this.addNoteForm.content) {
      this.showToast('Please enter a note', 'warning');
      return;
    }
    this.showToast('Note added successfully', 'success');
    this.closeModal('addNote');
    this.addNoteForm = { type: 'general', content: '', visibleToMember: false };
  }

  // ==================== OPEN ADDITIONAL MODALS ====================
  openRequestInfoModal(kyc: KycApplication): void {
    this.selectedKyc = kyc;
    this.requestInfoForm.documents.forEach(d => d.requested = false);
    this.requestInfoForm.additionalNotes = '';
    this.openModal('requestInfo');
  }

  openUploadForMemberModal(kyc: KycApplication): void {
    this.uploadForMemberForm.memberName = kyc.name;
    this.uploadForMemberForm.applicationId = kyc.applicationId;
    this.uploadForMemberForm.documentType = '';
    this.uploadForMemberForm.notes = '';
    this.openModal('uploadForMember');
  }

  openEditMemberModal(kyc: KycApplication): void {
    this.selectedKyc = kyc;
    this.editMemberActiveTab = 'personal';
    // Pre-fill form from kyc data
    const nameParts = kyc.name.split(' ');
    this.editMemberForm = {
      firstName: nameParts[0] || '',
      middleName: nameParts[1] || '',
      lastName: nameParts[2] || nameParts[1] || '',
      nationalId: kyc.idNumber,
      dateOfBirth: kyc.dateOfBirth,
      gender: kyc.gender,
      maritalStatus: '',
      phone: kyc.phone,
      altPhone: '',
      email: kyc.email,
      address: kyc.address,
      county: '',
      postalCode: '',
      occupation: kyc.occupation,
      employer: kyc.employer,
      incomeRange: '',
      kraPin: ''
    };
    this.openModal('editMemberInfo');
  }

  openAddNoteModal(): void {
    this.addNoteForm = { type: 'general', content: '', visibleToMember: false };
    this.openModal('addNote');
  }

  openBulkApproveModal(): void {
    this.bulkApprovalForm = { tier: 'Bronze', sendWelcome: true, confirmVerification: false };
    this.openModal('bulkApprove');
  }
}
