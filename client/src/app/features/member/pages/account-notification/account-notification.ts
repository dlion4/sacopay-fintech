// account-notifications.html
// Angular v21 Standalone — Account Notifications Page — Body Only

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ─────────────────────────────────────────────── */
/*  INTERFACES                                      */
/* ─────────────────────────────────────────────── */

interface NotificationItem {
  id: string;
  title: string;
  preview: string;
  time: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  priorityLabel: string;
  priorityIcon: string;
  category: string;
  from: string;
  ref: string;
  icon: string;
  read: boolean;
  categories: string[];
  body: string;
  attachments?: Attachment[];
}

interface Attachment {
  name: string;
  size: string;
  type: 'pdf' | 'xlsx' | 'doc';
  icon: string;
}

interface FilterTab {
  id: string;
  label: string;
  icon: string;
  count: number;
}

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  icon: string;
  iconColor: string;
}

interface PreferenceItem {
  label: string;
  sub: string;
  enabled: boolean;
}

type ToastType = 'success' | 'danger' | 'warning' | 'info' | 'primary';
type ModalKey = 'replyModal' | 'composeModal' | 'settingsModal' | 'deleteModal' | 'archiveModal';

/* ─────────────────────────────────────────────── */
/*  COMPONENT                                       */
/* ─────────────────────────────────────────────── */

@Component({
  selector: 'app-account-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-notification.html',
  styleUrls: ['./account-notification.scss']
})
export class NotificationsComponent implements OnInit {

  /* ── Filter state ── */
  activeFilter = 'all';
  searchQuery = '';

  /* ── Stats ── */
  stats = {
    total: 12,
    read: 7,
    unread: 5,
    highPriority: 2
  };

  /* ── Filter tabs ── */
  filterTabs: FilterTab[] = [
    { id: 'all', label: 'All', icon: 'bi-collection', count: 12 },
    { id: 'unread', label: 'Unread', icon: 'bi-envelope', count: 5 },
    { id: 'high', label: 'High Priority', icon: 'bi-exclamation-circle', count: 2 },
    { id: 'agm', label: 'AGM', icon: 'bi-megaphone', count: 1 },
    { id: 'loan', label: 'Loan', icon: 'bi-cash-stack', count: 3 },
    { id: 'security', label: 'Security', icon: 'bi-shield', count: 2 },
    { id: 'system', label: 'System', icon: 'bi-gear', count: 2 },
    { id: 'archived', label: 'Archived', icon: 'bi-archive', count: 3 }
  ];

  /* ── All notifications ── */
  allNotifications: NotificationItem[] = [
    {
      id: 'notif1',
      title: 'AGM Notice — Annual General Meeting',
      preview: 'You are invited to attend the Annual General Meeting…',
      time: 'May 10, 2026 · 09:30 AM',
      date: 'May 10, 2026 at 09:30 AM',
      priority: 'high',
      priorityLabel: 'High',
      priorityIcon: 'bi-exclamation-circle-fill',
      category: 'Annual General Meeting',
      from: 'Sacco Management Board',
      ref: 'AGM-2026-001',
      icon: 'bi-megaphone-fill',
      read: false,
      categories: ['agm', 'high'],
      body: `<p><strong>Dear Valued Member,</strong></p>
             <p>We are pleased to invite you to our Annual General Meeting scheduled as follows:</p>
             <div class="highlight-block">
               <strong>Date:</strong> Saturday, 24th May 2026<br>
               <strong>Time:</strong> 10:00 AM – 2:00 PM EAT<br>
               <strong>Venue:</strong> Sarova Stanley Hotel, Nairobi<br>
               <strong>Agenda:</strong> Financial Review, Dividend Declaration, Board Elections, Bylaw Amendments
             </div>
             <p>Attendance is mandatory for all active members. Please confirm your attendance through this portal by <strong>May 20th, 2026</strong>.</p>
             <p>Kind regards,<br><em>Sacco Management Committee</em></p>`,
      attachments: [
        { name: 'AGM_Agenda_2026.pdf', size: '245 KB · PDF Document', type: 'pdf', icon: 'bi-file-earmark-pdf-fill' },
        { name: 'Financial_Statements_FY2026.xlsx', size: '1.2 MB · Excel Spreadsheet', type: 'xlsx', icon: 'bi-file-earmark-spreadsheet-fill' }
      ]
    },
    {
      id: 'notif2',
      title: 'Loan Application Approved',
      preview: 'Your Emergency Loan of KES 50,000 has been approved…',
      time: 'May 9, 2026 · 02:15 PM',
      date: 'May 9, 2026 at 02:15 PM',
      priority: 'medium',
      priorityLabel: 'Med',
      priorityIcon: 'bi-dash-circle-fill',
      category: 'Loan',
      from: 'Loan Department',
      ref: 'LN-2026-0892',
      icon: 'bi-cash-stack',
      read: false,
      categories: ['loan'],
      body: `<p><strong>Dear James Kamau,</strong></p>
             <p>We are happy to inform you that your Emergency Loan application has been <strong>approved</strong>.</p>
             <div class="highlight-block">
               <strong>Loan Amount:</strong> KES 50,000<br>
               <strong>Interest Rate:</strong> 12% p.a.<br>
               <strong>Repayment Period:</strong> 12 months<br>
               <strong>Monthly Installment:</strong> KES 3,200<br>
               <strong>Disbursement Date:</strong> May 12, 2026
             </div>
             <p>The funds will be disbursed to your registered M-Pesa number. Please ensure your account details are up to date.</p>
             <p>Regards,<br><em>SaccoPay Loan Department</em></p>`,
      attachments: [
        { name: 'Loan_Agreement_LN-2026-0892.pdf', size: '312 KB · PDF Document', type: 'pdf', icon: 'bi-file-earmark-pdf-fill' }
      ]
    },
    {
      id: 'notif3',
      title: 'Security Alert — New Login Detected',
      preview: 'A login was detected from a new device in Nairobi…',
      time: 'May 8, 2026 · 11:45 PM',
      date: 'May 8, 2026 at 11:45 PM',
      priority: 'high',
      priorityLabel: 'High',
      priorityIcon: 'bi-exclamation-circle-fill',
      category: 'Security',
      from: 'Security System',
      ref: 'SEC-2026-0044',
      icon: 'bi-shield-exclamation',
      read: false,
      categories: ['security', 'high'],
      body: `<p><strong>Dear James Kamau,</strong></p>
             <p>We detected a login to your SaccoPay account from a new device or location. Details below:</p>
             <div class="highlight-block">
               <strong>Device:</strong> Chrome on Windows 11<br>
               <strong>Location:</strong> Nairobi, Kenya<br>
               <strong>IP Address:</strong> 41.90.xxx.xxx<br>
               <strong>Time:</strong> May 8, 2026 at 11:45 PM
             </div>
             <p>If this was you, no action is required. If you did not authorize this login, please <strong>change your password immediately</strong> and contact our support team.</p>
             <p>Stay safe,<br><em>SaccoPay Security Team</em></p>`,
      attachments: []
    },
    {
      id: 'notif4',
      title: 'Dividend Declaration — FY 2025',
      preview: 'The Board has declared a 12.5% dividend on shares…',
      time: 'May 7, 2026 · 08:00 AM',
      date: 'May 7, 2026 at 08:00 AM',
      priority: 'low',
      priorityLabel: 'Low',
      priorityIcon: 'bi-info-circle-fill',
      category: 'Finance',
      from: 'Finance Department',
      ref: 'DIV-2026-FY25',
      icon: 'bi-gift-fill',
      read: true,
      categories: ['loan'],
      body: `<p><strong>Dear Valued Member,</strong></p>
             <p>The Board of Directors is pleased to announce the declaration of dividends for the Financial Year 2025.</p>
             <div class="highlight-block">
               <strong>Dividend Rate:</strong> 12.5% on shares<br>
               <strong>Your Share Value:</strong> KES 36,000<br>
               <strong>Dividend Amount:</strong> KES 4,500<br>
               <strong>Payment Date:</strong> June 30, 2026
             </div>
             <p>Dividends will be credited directly to your savings account. Thank you for your continued trust and investment in our Sacco.</p>
             <p>Kind regards,<br><em>Board of Directors</em></p>`,
      attachments: [
        { name: 'Dividend_Notice_FY2025.pdf', size: '180 KB · PDF Document', type: 'pdf', icon: 'bi-file-earmark-pdf-fill' }
      ]
    },
    {
      id: 'notif5',
      title: 'Loan Repayment Due in 5 Days',
      preview: 'Your Emergency Loan installment of KES 3,200 is due…',
      time: 'May 7, 2026 · 06:00 AM',
      date: 'May 7, 2026 at 06:00 AM',
      priority: 'medium',
      priorityLabel: 'Med',
      priorityIcon: 'bi-dash-circle-fill',
      category: 'Loan Reminder',
      from: 'Loan Department',
      ref: 'REM-2026-LN-0892',
      icon: 'bi-calendar-event',
      read: false,
      categories: ['loan'],
      body: `<p><strong>Dear James Kamau,</strong></p>
             <p>This is a friendly reminder that your Emergency Loan installment is due in <strong>5 days</strong>.</p>
             <div class="highlight-block">
               <strong>Loan Reference:</strong> LN-2026-0892<br>
               <strong>Installment Amount:</strong> KES 3,200<br>
               <strong>Due Date:</strong> May 12, 2026<br>
               <strong>Installment:</strong> #4 of 12<br>
               <strong>Outstanding Balance:</strong> KES 38,500
             </div>
             <p>You can make payment through M-Pesa Paybill, bank transfer, or directly through the Member Portal.</p>
             <p>Regards,<br><em>SaccoPay Loan Department</em></p>`,
      attachments: []
    },
    {
      id: 'notif6',
      title: 'Scheduled System Maintenance',
      preview: 'The portal will be offline on May 12, 2026 from 01:00–04:00 AM…',
      time: 'May 6, 2026 · 04:00 PM',
      date: 'May 6, 2026 at 04:00 PM',
      priority: 'low',
      priorityLabel: 'Low',
      priorityIcon: 'bi-info-circle-fill',
      category: 'System',
      from: 'IT & Systems',
      ref: 'SYS-2026-MAINT-012',
      icon: 'bi-tools',
      read: true,
      categories: ['system'],
      body: `<p><strong>Dear Valued Member,</strong></p>
             <p>Please be informed that SaccoPay will undergo scheduled system maintenance as follows:</p>
             <div class="highlight-block">
               <strong>Date:</strong> May 12, 2026<br>
               <strong>Time:</strong> 01:00 AM – 04:00 AM EAT<br>
               <strong>Affected Services:</strong> All online portal services<br>
               <strong>Duration:</strong> Approximately 3 hours
             </div>
             <p>During this period, the member portal, mobile app, and M-Pesa services will be temporarily unavailable. We apologize for any inconvenience.</p>
             <p>Regards,<br><em>SaccoPay IT Department</em></p>`,
      attachments: []
    },
    {
      id: 'notif7',
      title: 'Password Changed Successfully',
      preview: 'Your account password was changed on May 5, 2026…',
      time: 'May 5, 2026 · 03:10 PM',
      date: 'May 5, 2026 at 03:10 PM',
      priority: 'low',
      priorityLabel: 'Low',
      priorityIcon: 'bi-info-circle-fill',
      category: 'Security',
      from: 'Security System',
      ref: 'SEC-2026-PWD-0031',
      icon: 'bi-lock-fill',
      read: true,
      categories: ['security'],
      body: `<p><strong>Dear James Kamau,</strong></p>
             <p>Your SaccoPay account password was successfully changed.</p>
             <div class="highlight-block">
               <strong>Date & Time:</strong> May 5, 2026 at 03:10 PM<br>
               <strong>Device:</strong> Chrome on Windows 11<br>
               <strong>Location:</strong> Nairobi, Kenya
             </div>
             <p>If you did not make this change, please contact our support team immediately at <strong>support@saccopay.co.ke</strong> or call <strong>0800 722 000</strong>.</p>
             <p>Stay safe,<br><em>SaccoPay Security Team</em></p>`,
      attachments: []
    },
    {
      id: 'notif8',
      title: 'System Update — New Features Available',
      preview: 'SaccoPay v6.2 is here with new dashboard widgets…',
      time: 'May 4, 2026 · 09:00 AM',
      date: 'May 4, 2026 at 09:00 AM',
      priority: 'low',
      priorityLabel: 'Low',
      priorityIcon: 'bi-info-circle-fill',
      category: 'System',
      from: 'SaccoPay Team',
      ref: 'SYS-2026-UPDATE-v6.2',
      icon: 'bi-arrow-clockwise',
      read: true,
      categories: ['system'],
      body: `<p><strong>Dear Valued Member,</strong></p>
             <p>We are excited to announce the launch of <strong>SaccoPay v6.2</strong> with new features and improvements!</p>
             <div class="highlight-block">
               <strong>New Features:</strong><br>
               • Enhanced Dashboard with real-time charts<br>
               • Loan eligibility calculator<br>
               • Instant guarantor request management<br>
               • Improved mobile responsiveness<br>
               • Biometric login support (mobile app)
             </div>
             <p>To experience the new features, simply reload the portal. No action is required on your part.</p>
             <p>Thank you for being part of our Sacco family!<br><em>SaccoPay Development Team</em></p>`,
      attachments: [
        { name: 'SaccoPay_v6.2_Release_Notes.pdf', size: '420 KB · PDF Document', type: 'pdf', icon: 'bi-file-earmark-pdf-fill' }
      ]
    },
    {
      id: 'notif9',
      title: 'Q1 2026 Statement Ready',
      preview: 'Your Q1 2026 member statement is now available…',
      time: 'Apr 3, 2026 · 10:00 AM',
      date: 'Apr 3, 2026 at 10:00 AM',
      priority: 'low',
      priorityLabel: 'Low',
      priorityIcon: 'bi-info-circle-fill',
      category: 'Statement',
      from: 'Finance Department',
      ref: 'STMT-2026-Q1-00142',
      icon: 'bi-archive-fill',
      read: true,
      categories: ['archived'],
      body: `<p><strong>Dear James Kamau,</strong></p>
             <p>Your Q1 2026 Member Statement is now available for download.</p>
             <div class="highlight-block">
               <strong>Period:</strong> January – March 2026<br>
               <strong>Member ID:</strong> SCO-2024-00142<br>
               <strong>Opening Balance:</strong> KES 120,000<br>
               <strong>Closing Balance:</strong> KES 145,200<br>
               <strong>Total Transactions:</strong> 24
             </div>
             <p>Please download and review your statement. If you notice any discrepancies, contact our finance team within 30 days of this notice.</p>
             <p>Regards,<br><em>SaccoPay Finance Department</em></p>`,
      attachments: [
        { name: 'Statement_Q1_2026_SCO-00142.pdf', size: '685 KB · PDF Document', type: 'pdf', icon: 'bi-file-earmark-pdf-fill' }
      ]
    }
  ];

  /* ── Selected notification ── */
  selectedNotif: NotificationItem | null = null;

  /* ── Computed filtered list ── */
  get filteredNotifications(): NotificationItem[] {
    let list = this.allNotifications;

    // Apply filter
    if (this.activeFilter !== 'all') {
      if (this.activeFilter === 'unread') {
        list = list.filter(n => !n.read);
      } else if (this.activeFilter === 'archived') {
        list = list.filter(n => n.categories.includes('archived'));
      } else {
        list = list.filter(n => n.categories.includes(this.activeFilter));
      }
    }

    // Apply search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.preview.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /* ── Modals state ── */
  modals: Record<ModalKey, boolean> = {
    replyModal: false,
    composeModal: false,
    settingsModal: false,
    deleteModal: false,
    archiveModal: false
  };

  /* ── Reply form ── */
  replyForm = {
    to: '',
    toTitle: '',
    subject: '',
    message: ''
  };

  /* ── Compose form ── */
  composeDepartments = [
    'Sacco Management Board',
    'Loan Department',
    'Finance Department',
    'Support Team'
  ];

  composeForm = {
    to: 'Sacco Management Board',
    subject: '',
    priority: 'normal',
    message: ''
  };

  /* ── Preferences ── */
  emailPrefs: PreferenceItem[] = [
    { label: 'Loan Updates', sub: 'Approval, disbursement, repayment reminders', enabled: true },
    { label: 'AGM & Events', sub: 'Meeting notices, event invitations', enabled: true },
    { label: 'Dividend Declarations', sub: 'Dividend and share updates', enabled: true },
    { label: 'System Alerts', sub: 'Maintenance, security, system updates', enabled: false }
  ];

  smsPrefs: PreferenceItem[] = [
    { label: 'Transaction Alerts', sub: 'Deposits, withdrawals, payments', enabled: true },
    { label: 'Security Alerts', sub: 'Login attempts, password changes', enabled: true },
    { label: 'Payment Reminders', sub: 'Upcoming loan repayment reminders', enabled: true }
  ];

  inAppPrefs: PreferenceItem[] = [
    { label: 'All Notifications', sub: 'Show all in-app notifications', enabled: true },
    { label: 'High Priority Only', sub: 'Only show high priority pop-ups', enabled: false }
  ];

  /* ── Toasts ── */
  toasts: ToastItem[] = [];
  private toastId = 0;

  /* ─────────────────────────────────────────────── */
  /*  LIFECYCLE                                       */
  /* ─────────────────────────────────────────────── */

  ngOnInit(): void {
    // Select first notification by default
    this.selectedNotif = this.allNotifications[0];
    this.updateCounts();
  }

  /* ─────────────────────────────────────────────── */
  /*  FILTERS                                         */
  /* ─────────────────────────────────────────────── */

  setFilter(filterId: string): void {
    this.activeFilter = filterId;
  }

  searchNotifs(): void {
    // Triggered by (input) — computed property handles filtering
  }

  /* ─────────────────────────────────────────────── */
  /*  NOTIFICATION DETAIL                             */
  /* ─────────────────────────────────────────────── */

  showDetail(notif: NotificationItem): void {
    this.selectedNotif = notif;
    notif.read = true;
    this.updateCounts();

    // On mobile: scroll to detail
    if (window.innerWidth < 900) {
      setTimeout(() => {
        document.querySelector('.notification-detail-col')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }

  /* ─────────────────────────────────────────────── */
  /*  MARK READ                                       */
  /* ─────────────────────────────────────────────── */

  markAllRead(): void {
    this.allNotifications.forEach(n => n.read = true);
    this.updateCounts();
    this.showToast('All notifications marked as read', 'success');
  }

  markCurrentRead(): void {
    if (this.selectedNotif) {
      this.selectedNotif.read = true;
      this.updateCounts();
      this.showToast('Notification marked as read', 'success');
    }
  }

  /* ─────────────────────────────────────────────── */
  /*  DELETE / ARCHIVE                                */
  /* ─────────────────────────────────────────────── */

  confirmDelete(): void {
    if (this.selectedNotif) {
      const idx = this.allNotifications.findIndex(n => n.id === this.selectedNotif!.id);
      if (idx > -1) {
        this.allNotifications.splice(idx, 1);
      }
      this.selectedNotif = this.allNotifications[0] || null;
      this.updateCounts();
      this.showToast('Notification deleted', 'danger');
    }
    this.closeModal('deleteModal');
  }

  confirmArchive(): void {
    if (this.selectedNotif) {
      if (!this.selectedNotif.categories.includes('archived')) {
        this.selectedNotif.categories.push('archived');
      }
      this.selectedNotif.read = true;
      this.updateCounts();
      this.showToast('Notification archived', 'primary');
    }
    this.closeModal('archiveModal');
  }

  /* ─────────────────────────────────────────────── */
  /*  REPLY / COMPOSE                                 */
  /* ─────────────────────────────────────────────── */

  sendReply(): void {
    this.showToast('Reply sent successfully', 'success');
    this.closeModal('replyModal');
    this.replyForm.message = '';
  }

  sendCompose(): void {
    this.showToast('Message sent to ' + this.composeForm.to, 'success');
    this.closeModal('composeModal');
    this.composeForm.subject = '';
    this.composeForm.message = '';
  }

  forwardNotif(): void {
    this.showToast('Forwarding feature — open compose dialog', 'primary');
  }

  /* ─────────────────────────────────────────────── */
  /*  ATTACHMENTS                                     */
  /* ─────────────────────────────────────────────── */

  downloadAttachment(att: Attachment): void {
    this.showToast('Downloading ' + att.name + '…', 'primary');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.showToast(input.files.length + ' file(s) selected', 'info');
    }
  }

  /* ─────────────────────────────────────────────── */
  /*  PREFERENCES                                     */
  /* ─────────────────────────────────────────────── */

  savePreferences(): void {
    this.showToast('Notification preferences saved', 'success');
    this.closeModal('settingsModal');
  }

  /* ─────────────────────────────────────────────── */
  /*  MODALS                                          */
  /* ─────────────────────────────────────────────── */

  openModal(key: ModalKey): void {
    // Pre-fill reply form if opening reply modal
    if (key === 'replyModal' && this.selectedNotif) {
      this.replyForm.to = this.selectedNotif.from;
      this.replyForm.toTitle = this.selectedNotif.title.substring(0, 40) + '...';
      this.replyForm.subject = 'Re: ' + this.selectedNotif.title;
    }

    this.modals[key] = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(key: ModalKey): void {
    this.modals[key] = false;
    const anyOpen = Object.values(this.modals).some(v => v);
    if (!anyOpen) {
      document.body.style.overflow = '';
    }
  }

  /* ─────────────────────────────────────────────── */
  /*  TOASTS                                          */
  /* ─────────────────────────────────────────────── */

  showToast(message: string, type: ToastType = 'info'): void {
    const icons: Record<ToastType, string> = {
      success: 'bi-check-circle-fill',
      danger: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
      primary: 'bi-bell-fill'
    };
    const colors: Record<ToastType, string> = {
      success: 'var(--success)',
      danger: 'var(--danger)',
      warning: 'var(--warning)',
      info: 'var(--info)',
      primary: 'var(--primary)'
    };

    const toast: ToastItem = {
      id: ++this.toastId,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      icon: icons[type],
      iconColor: colors[type]
    };

    this.toasts.push(toast);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, 2800);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  /* ─────────────────────────────────────────────── */
  /*  STATS                                           */
  /* ─────────────────────────────────────────────── */

  private updateCounts(): void {
    const total = this.allNotifications.length;
    const unread = this.allNotifications.filter(n => !n.read).length;
    const read = total - unread;
    const highPriority = this.allNotifications.filter(n => n.priority === 'high').length;

    this.stats = { total, read, unread, highPriority };

    // Update tab counts
    this.filterTabs = [
      { id: 'all', label: 'All', icon: 'bi-collection', count: total },
      { id: 'unread', label: 'Unread', icon: 'bi-envelope', count: unread },
      { id: 'high', label: 'High Priority', icon: 'bi-exclamation-circle', count: highPriority },
      { id: 'agm', label: 'AGM', icon: 'bi-megaphone', count: this.countByCategory('agm') },
      { id: 'loan', label: 'Loan', icon: 'bi-cash-stack', count: this.countByCategory('loan') },
      { id: 'security', label: 'Security', icon: 'bi-shield', count: this.countByCategory('security') },
      { id: 'system', label: 'System', icon: 'bi-gear', count: this.countByCategory('system') },
      { id: 'archived', label: 'Archived', icon: 'bi-archive', count: this.countByCategory('archived') }
    ];
  }

  private countByCategory(cat: string): number {
    return this.allNotifications.filter(n => n.categories.includes(cat)).length;
  }
}