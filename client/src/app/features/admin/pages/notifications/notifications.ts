import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

type NotificationTab = 'all' | 'otp' | 'requests' | 'system' | 'read';
type Priority = 'urgent' | 'high' | 'normal' | 'alert';
type NotificationKind = 'otp' | 'request' | 'system' | 'read';
type OtpStatus = 'pending' | 'approved' | 'rejected' | 'expired';
type RequestStatus = 'pending' | 'approved' | 'declined' | 'in-review';
type SettingsTab = 'channels' | 'otp-policy' | 'templates';
type ToastType = 'success' | 'info' | 'warning' | 'danger';

interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  priority?: Priority;
  iconClass: string;
  tags: string[];
  date: string;
  timeAgo: string;
  unread: boolean;
  otpCode?: string;
  expires?: string;
  memberName?: string;
  memberId?: string;
  amountAction?: string;
}

interface OtpApproval {
  id: string;
  initials: string;
  member: string;
  memberId: string;
  service: string;
  amountAction: string;
  code: string;
  expires: string;
  status: OtpStatus;
  notificationId: string;
}

interface ServiceRequest {
  id: string;
  initials: string;
  member: string;
  requestType: string;
  details: string;
  submitted: string;
  priority: 'Normal' | 'High';
  status: RequestStatus;
  assignedTo: string;
  notes: string;
}

interface ToastState {
  message: string;
  type: ToastType;
}

interface NotificationSettings {
  pushEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  urgentSound: boolean;
  otpExpiryMinutes: number;
  otpMaxAttempts: number;
  withdrawalThreshold: number;
  loanThreshold: number;
  escalationMinutes: number;
  adminRecipient: string;
  smsTemplate: string;
  emailTemplate: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./notifications.html',
  styleUrl: './notifications.scss',
})
export class NotificationsComponent {
  activeTab: NotificationTab = 'all';
  settingsTab: SettingsTab = 'channels';
  searchTerm = '';
  lastUpdated = 'Just now';
  selectedPriority = 'All Priorities';

  showDetailModal = false;
  showOtpApproveModal = false;
  showOtpRejectModal = false;
  showRequestModal = false;
  showSettingsModal = false;

  activeNotification: NotificationItem | null = null;
  activeOtp: OtpApproval | null = null;
  activeRequest: ServiceRequest | null = null;

  approveOtpInput = '';
  rejectReason = '';
  notifyMemberOnReject = true;
  requestAction: 'review' | 'approve' | 'decline' = 'review';
  requestDraftNotes = '';
  requestDraftAssignee = 'Credit Department';
  requestDraftPriority: 'Normal' | 'High' = 'Normal';

  toast: ToastState | null = null;
  inlineStatus = '';
  private toastTimer?: number;

  settings: NotificationSettings = {
    pushEnabled: true,
    smsEnabled: true,
    emailEnabled: true,
    urgentSound: true,
    otpExpiryMinutes: 10,
    otpMaxAttempts: 3,
    withdrawalThreshold: 50000,
    loanThreshold: 250000,
    escalationMinutes: 5,
    adminRecipient: 'admin@rongosacco.co.ke',
    smsTemplate: 'Your SACCOPay OTP is {{code}}. It expires in {{minutes}} minutes.',
    emailTemplate: 'A secure approval request is waiting in your SACCOPay admin center.',
  };

  notifications: NotificationItem[] = [
    {
      id: 'notif-otp-withdrawal',
      kind: 'otp',
      title: 'OTP - Withdrawal Approval Required',
      message: 'Peter Omondi (SP-10145) is requesting withdrawal of KES 80,000 from Regular Savings to M-Pesa. Enter OTP to approve.',
      priority: 'urgent',
      iconClass: 'withdrawal',
      tags: ['OTP', 'Savings'],
      date: 'Dec 18, 3:45 PM',
      timeAgo: '2 min ago',
      unread: true,
      otpCode: '847293',
      expires: '04:32',
      memberName: 'Peter Omondi',
      memberId: 'SP-10145',
      amountAction: 'KES 80,000',
    },
    {
      id: 'notif-otp-guarantor',
      kind: 'otp',
      title: 'Guarantor OTP - Loan Approval',
      message: 'Grace Akinyi (SP-10067) applied for a KES 300,000 Personal Loan. You are listed as Guarantor #1. Enter OTP to approve.',
      priority: 'urgent',
      iconClass: 'guarantor',
      tags: ['OTP', 'Loan'],
      date: 'Dec 18, 3:20 PM',
      timeAgo: '25 min ago',
      unread: true,
      otpCode: '519742',
      expires: '08:15',
      memberName: 'Grace Akinyi',
      memberId: 'SP-10067',
      amountAction: 'KES 300,000',
    },
    {
      id: 'notif-otp-shares',
      kind: 'otp',
      title: 'OTP - Share Capital Purchase',
      message: 'John Kamau (SP-10015) is purchasing 20 shares (KES 20,000) from Regular Savings to Share Capital. This is non-withdrawable.',
      priority: 'high',
      iconClass: 'share',
      tags: ['OTP', 'Shares'],
      date: 'Dec 18, 3:07 PM',
      timeAgo: '38 min ago',
      unread: true,
      otpCode: '362810',
      expires: '03:48',
      memberName: 'John Kamau',
      memberId: 'SP-10015',
      amountAction: '20 shares',
    },
    {
      id: 'notif-otp-wallet',
      kind: 'otp',
      title: 'OTP - Large Wallet Transfer',
      message: 'Mary Wanjiku (SP-10023) is transferring KES 150,000 from SACCOPay Wallet to KCB Bank Account. Amount exceeds daily limit alert.',
      priority: 'high',
      iconClass: 'transfer',
      tags: ['OTP', 'Wallet'],
      date: 'Dec 18, 2:53 PM',
      timeAgo: '52 min ago',
      unread: true,
      otpCode: '928417',
      expires: '01:22',
      memberName: 'Mary Wanjiku',
      memberId: 'SP-10023',
      amountAction: 'KES 150,000',
    },
    {
      id: 'notif-otp-kyc',
      kind: 'otp',
      title: 'OTP - KYC Override Approval',
      message: 'David Otieno (Credit Officer) is requesting KYC override for Rose Nyambura (expired National ID). 30-day extension requested.',
      priority: 'normal',
      iconClass: 'kyc',
      tags: ['OTP', 'KYC'],
      date: 'Dec 18, 2:45 PM',
      timeAgo: '1 hr ago',
      unread: true,
      otpCode: '451830',
      expires: '07:44',
      memberName: 'David Otieno',
      memberId: 'Staff',
      amountAction: 'Rose Nyambura',
    },
    {
      id: 'notif-request-loan',
      kind: 'request',
      title: 'New Loan Application - Review Required',
      message: 'Bernard Kiprop (SP-10078) submitted a Business Loan application for KES 750,000. Credit check passed (Score: 698). Awaiting admin review.',
      iconClass: 'loan',
      tags: ['Loan'],
      date: 'Dec 18, 2:00 PM',
      timeAgo: '1.5 hrs ago',
      unread: true,
    },
    {
      id: 'notif-request-member',
      kind: 'request',
      title: 'New Member Registration - Approval Needed',
      message: 'Alice Muthoni submitted online registration. KYC documents uploaded. Registration fee paid via M-Pesa (KES 1,000).',
      iconClass: 'member',
      tags: ['Member'],
      date: 'Dec 18, 11:00 AM',
      timeAgo: '4 hrs ago',
      unread: true,
    },
    {
      id: 'notif-request-guarantor',
      kind: 'request',
      title: 'Guarantor Response - Loan LN-2024-00893',
      message: "Daniel Kipchoge (Guarantor #2) has approved guarantee for Grace Akinyi's Personal Loan (KES 300,000). Both guarantors confirmed. Loan ready for disbursement.",
      iconClass: 'guarantor',
      tags: ['Guarantor'],
      date: 'Dec 18, 10:30 AM',
      timeAgo: '5 hrs ago',
      unread: true,
    },
    {
      id: 'notif-compliance',
      kind: 'system',
      title: 'SASRA Filing Reminder',
      message: 'SASRA Q4 2024 Quarterly Return is due by January 15, 2025 (28 days remaining). Draft has been prepared by David Otieno and is awaiting your approval.',
      iconClass: 'compliance',
      tags: ['Compliance'],
      date: 'Dec 18, 9:00 AM',
      timeAgo: '6 hrs ago',
      unread: true,
    },
    {
      id: 'notif-aml',
      kind: 'system',
      title: 'AML - Suspicious Transaction Detected',
      message: 'System auto-detected structuring pattern: Bernard Kiprop made 4 deposits totaling KES 980,000 within 2 hours, each just below KES 250K threshold.',
      priority: 'alert',
      iconClass: 'system',
      tags: ['AML'],
      date: 'Dec 17, 3:00 PM',
      timeAgo: 'Yesterday',
      unread: true,
    },
    {
      id: 'notif-backup',
      kind: 'system',
      title: 'Daily Backup Complete',
      message: 'Automated daily backup completed successfully. Size: 256 MB. Next backup: Dec 19, 2:00 AM.',
      iconClass: 'system',
      tags: ['System'],
      date: 'Dec 18, 2:00 AM',
      timeAgo: 'Yesterday',
      unread: false,
    },
    {
      id: 'read-otp-approved',
      kind: 'read',
      title: 'OTP Approved - Withdrawal KES 50,000',
      message: "You approved Samuel Kibet's withdrawal on Dec 17. Funds sent to M-Pesa.",
      iconClass: 'otp',
      tags: ['Approved'],
      date: 'Dec 17, 4:30 PM',
      timeAgo: 'Dec 17',
      unread: false,
    },
    {
      id: 'read-loan-approved',
      kind: 'read',
      title: 'Loan Approved - Mary Wanjiku KES 250,000',
      message: 'Personal loan approved and disbursed via M-Pesa on Dec 15.',
      iconClass: 'loan',
      tags: ['Loan'],
      date: 'Dec 15, 2:00 PM',
      timeAgo: 'Dec 15',
      unread: false,
    },
    {
      id: 'read-member-approved',
      kind: 'read',
      title: 'Member Approved - Daniel Kipchoge',
      message: 'New member registration approved. 5 shares allocated.',
      iconClass: 'member',
      tags: ['Member'],
      date: 'Dec 14, 11:00 AM',
      timeAgo: 'Dec 14',
      unread: false,
    },
  ];

  otpApprovals: OtpApproval[] = [
    { id: 'otp-1', initials: 'PO', member: 'Peter Omondi', memberId: 'SP-10145', service: 'Withdrawal', amountAction: 'KES 80,000', code: '847293', expires: '04:32', status: 'pending', notificationId: 'notif-otp-withdrawal' },
    { id: 'otp-2', initials: 'GA', member: 'Grace Akinyi', memberId: 'SP-10067', service: 'Loan Guarantee', amountAction: 'KES 300,000', code: '519742', expires: '08:15', status: 'pending', notificationId: 'notif-otp-guarantor' },
    { id: 'otp-3', initials: 'JK', member: 'John Kamau', memberId: 'SP-10015', service: 'Share Purchase', amountAction: '20 shares', code: '362810', expires: '03:48', status: 'pending', notificationId: 'notif-otp-shares' },
    { id: 'otp-4', initials: 'MW', member: 'Mary Wanjiku', memberId: 'SP-10023', service: 'Wallet Transfer', amountAction: 'KES 150,000', code: '928417', expires: '01:22', status: 'pending', notificationId: 'notif-otp-wallet' },
    { id: 'otp-5', initials: 'DO', member: 'David Otieno', memberId: 'Staff', service: 'KYC Override', amountAction: 'Rose Nyambura', code: '451830', expires: '07:44', status: 'pending', notificationId: 'notif-otp-kyc' },
  ];

  serviceRequests: ServiceRequest[] = [
    { id: 'req-1', initials: 'BK', member: 'Bernard Kiprop', requestType: 'Loan', details: 'Business Loan - KES 750,000', submitted: 'Dec 18, 2:00 PM', priority: 'Normal', status: 'pending', assignedTo: 'Credit Department', notes: 'Credit score 698. Security review passed.' },
    { id: 'req-2', initials: 'AM', member: 'Alice Muthoni', requestType: 'Registration', details: 'New Member Registration', submitted: 'Dec 18, 11:00 AM', priority: 'Normal', status: 'pending', assignedTo: 'Membership Desk', notes: 'KYC documents uploaded and registration fee paid.' },
    { id: 'req-3', initials: 'SA', member: 'Sarah Auma', requestType: 'Fixed Deposit', details: 'Early FD withdrawal - KES 200K', submitted: 'Dec 17, 4:00 PM', priority: 'High', status: 'pending', assignedTo: 'Operations', notes: 'Penalty disclosure required before approval.' },
    { id: 'req-4', initials: 'FK', member: 'Florence Kerubo', requestType: 'Restructure', details: 'Loan restructure - extend 6 months', submitted: 'Dec 17, 2:30 PM', priority: 'Normal', status: 'pending', assignedTo: 'Credit Department', notes: 'Review repayment history and affordability.' },
  ];

  get statCards(): Array<{ key: string; value: number; label: string; className: string; tab: NotificationTab }> {
    return [
      { key: 'urgent', value: this.notifications.filter((item) => item.priority === 'urgent' && item.unread).length, label: 'Urgent Alerts', className: 'urgent', tab: 'all' },
      { key: 'otp', value: this.otpApprovals.filter((item) => item.status === 'pending').length, label: 'OTP Pending', className: 'otp', tab: 'otp' },
      { key: 'requests', value: this.serviceRequests.filter((item) => item.status === 'pending' || item.status === 'in-review').length, label: 'Requests', className: 'requests', tab: 'requests' },
      { key: 'system', value: this.notifications.filter((item) => item.kind === 'system').length, label: 'System Alerts', className: 'system', tab: 'system' },
      { key: 'all', value: this.notifications.length, label: 'All Notices', className: 'all', tab: 'all' },
    ];
  }

  get tabs(): Array<{ key: NotificationTab; label: string; count: number }> {
    return [
      { key: 'all', label: 'All', count: this.notifications.filter((item) => item.kind !== 'read').length },
      { key: 'otp', label: 'OTP', count: this.otpApprovals.filter((item) => item.status === 'pending').length },
      { key: 'requests', label: 'Requests', count: this.serviceRequests.length },
      { key: 'system', label: 'System', count: this.notifications.filter((item) => item.kind === 'system').length },
      { key: 'read', label: 'Read', count: this.notifications.filter((item) => item.kind === 'read' || !item.unread).length },
    ];
  }

  get visibleNotifications(): NotificationItem[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.notifications.filter((item) => {
      const matchesTab =
        this.activeTab === 'all'
          ? item.kind !== 'read'
          : this.activeTab === 'read'
            ? item.kind === 'read' || !item.unread
            : item.kind === this.activeTab;
      const matchesQuery = !query || item.title.toLowerCase().includes(query) || item.message.toLowerCase().includes(query) || item.tags.join(' ').toLowerCase().includes(query);
      const matchesPriority = this.selectedPriority === 'All Priorities' || item.priority === this.selectedPriority.toLowerCase();
      return matchesTab && matchesQuery && matchesPriority;
    });
  }

  get pendingOtpRows(): OtpApproval[] {
    return this.otpApprovals.filter((item) => item.status === 'pending');
  }

  get filteredRequests(): ServiceRequest[] {
    const query = this.searchTerm.trim().toLowerCase();
    return this.serviceRequests.filter((item) => !query || item.member.toLowerCase().includes(query) || item.requestType.toLowerCase().includes(query) || item.details.toLowerCase().includes(query));
  }

  get canApproveOtp(): boolean {
    return Boolean(this.activeOtp && this.approveOtpInput.trim() === this.activeOtp.code);
  }

  get canRejectOtp(): boolean {
    return this.rejectReason.trim().length >= 8;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModals();
  }

  setTab(tab: NotificationTab): void {
    this.activeTab = tab;
    this.inlineStatus = '';
  }

  setTabFromStat(tab: NotificationTab): void {
    this.activeTab = tab;
  }

  refresh(): void {
    this.lastUpdated = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  }

  markAllRead(): void {
    this.notifications = this.notifications.map((item) => ({ ...item, unread: false }));
    this.showToast('Notifications marked as read.', 'success');
  }

  markRead(item: NotificationItem): void {
    item.unread = false;
  }

  openDetail(item: NotificationItem): void {
    this.activeNotification = item;
    this.showDetailModal = true;
  }

  openApproveOtp(otp: OtpApproval): void {
    this.activeOtp = otp;
    this.approveOtpInput = otp.code;
    this.showOtpApproveModal = true;
  }

  openApproveFromNotification(item: NotificationItem | null): void {
    if (!item?.otpCode) return;
    const row = this.otpApprovals.find((otp) => otp.notificationId === item.id);
    if (row) this.openApproveOtp(row);
  }

  confirmApproveOtp(): void {
    if (!this.activeOtp || !this.canApproveOtp) return;
    this.activeOtp.status = 'approved';
    this.updateNotificationReadState(this.activeOtp.notificationId, false);
    this.inlineStatus = `${this.activeOtp.service} OTP approved for ${this.activeOtp.member}.`;
    this.showOtpApproveModal = false;
    this.showDetailModal = false;
  }

  openRejectOtp(otp: OtpApproval): void {
    this.activeOtp = otp;
    this.rejectReason = '';
    this.notifyMemberOnReject = true;
    this.showOtpRejectModal = true;
  }

  openRejectFromNotification(item: NotificationItem | null): void {
    if (!item?.otpCode) return;
    const row = this.otpApprovals.find((otp) => otp.notificationId === item.id);
    if (row) this.openRejectOtp(row);
  }

  confirmRejectOtp(): void {
    if (!this.activeOtp || !this.canRejectOtp) return;
    this.activeOtp.status = 'rejected';
    this.updateNotificationReadState(this.activeOtp.notificationId, false);
    this.inlineStatus = `${this.activeOtp.service} OTP rejected for ${this.activeOtp.member}.`;
    this.showOtpRejectModal = false;
    this.showDetailModal = false;
  }

  openRequestModal(request: ServiceRequest, action: 'review' | 'approve' | 'decline' = 'review'): void {
    this.activeRequest = request;
    this.requestAction = action;
    this.requestDraftNotes = request.notes;
    this.requestDraftAssignee = request.assignedTo;
    this.requestDraftPriority = request.priority;
    this.showRequestModal = true;
  }

  saveRequestReview(): void {
    if (!this.activeRequest) return;
    this.activeRequest.notes = this.requestDraftNotes;
    this.activeRequest.assignedTo = this.requestDraftAssignee;
    this.activeRequest.priority = this.requestDraftPriority;
    this.activeRequest.status = this.requestAction === 'review' ? 'in-review' : this.requestAction === 'approve' ? 'approved' : 'declined';
    this.inlineStatus = `${this.activeRequest.requestType} request updated for ${this.activeRequest.member}.`;
    this.showRequestModal = false;
  }

  openSettings(): void {
    this.settingsTab = 'channels';
    this.showSettingsModal = true;
  }

  saveSettings(): void {
    this.showSettingsModal = false;
    this.showToast('Notification settings saved.', 'success');
  }

  copyOtp(code: string): void {
    if (navigator?.clipboard) {
      void navigator.clipboard.writeText(code);
    }
    this.showToast('OTP copied.', 'info');
  }

  closeModals(): void {
    this.showDetailModal = false;
    this.showOtpApproveModal = false;
    this.showOtpRejectModal = false;
    this.showRequestModal = false;
    this.showSettingsModal = false;
  }

  showToast(message: string, type: ToastType = 'success'): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, 2600);
  }

  private updateNotificationReadState(id: string, unread: boolean): void {
    const notification = this.notifications.find((item) => item.id === id);
    if (notification) notification.unread = unread;
  }
}