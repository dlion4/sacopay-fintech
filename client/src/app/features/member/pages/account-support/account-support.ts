import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// ==================== MODELS ====================

export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Closed' | 'Escalated';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Loan Issues' | 'Savings' | 'Payments' | 'Shares' | 'Account' | 'General' | 'Dividends';
export type EscalationLevel = 'SACCO Admin' | 'SACCO Manager' | 'SaccoPay Support' | 'SaccoPay Technical';

export interface TicketMessage {
  id: string;
  author: string;
  role: 'Member' | 'SACCO Admin' | 'SACCO Manager' | 'SaccoPay Support' | 'SaccoPay Technical';
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  preview: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  lastUpdate: string;
  createdAt: Date;
  escalationLevel: EscalationLevel;
  escalated: boolean;
  escalationReason?: string;
  messages: TicketMessage[];
  attachments?: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  expanded?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'DOCUMENT' | 'FORM' | 'POLICY' | 'CALENDAR' | 'CONTACT';
  action: string;
  url: string;
}

export interface FeedbackEntry {
  id: string;
  ticketRef: string;
  ticketTitle: string;
  rating: number;
  comment: string;
  submittedAt: Date;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: string;
  link?: string;
}

type Tab = 'tickets' | 'faq' | 'resources' | 'feedback' | 'notifications';

// ==================== COMPONENT ====================

@Component({
  selector: 'app-account-support',
  standalone: true,
  templateUrl:'./account-support.html',
  styleUrls: ['./account-support.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ]
})
export class MemberSupportComponent implements OnInit {

  activeTab: Tab = 'tickets';

  // Stats
  stats = {
    openTickets: 3,
    resolvedThisWeek: 2,
    avgResponseTime: '2h',
    pendingEscalation: 1,
    satisfactionScore: 92,
    totalRatings: 12,
    firstResponseTime: '2.1 hours',
    resolutionRate: '94%',
    memberSatisfaction: '4.6 / 5.0',
    ticketsResolvedThisMonth: 142
  };

  // Tickets
  tickets: SupportTicket[] = [];
  filteredTickets: SupportTicket[] = [];
  searchTerm = '';
  filterStatus: 'all' | TicketStatus = 'all';

  // Modals
  showNewTicketModal = false;
  showTicketDetailModal = false;
  showEscalateModal = false;
  showInfoModal = false;
  showNotificationsPanel = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' | 'warning' | 'error' = 'success';

  selectedTicket: SupportTicket | null = null;
  newReply = '';

  // Forms
  newTicketForm!: FormGroup;
  escalateForm!: FormGroup;
  feedbackForm!: FormGroup;

  // Feedback
  rating = 0;
  hoverRating = 0;
  feedbackHistory: FeedbackEntry[] = [];

  // FAQ
  faqs: FaqItem[] = [];
  faqSearch = '';
  faqCategory = 'all';

  // Resources
  resources: ResourceItem[] = [];

  // Notifications
  notifications: NotificationItem[] = [];
  unreadCount = 0;

  categories: TicketCategory[] = ['Loan Issues', 'Savings', 'Payments', 'Shares', 'Account', 'Dividends', 'General'];
  priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];
  escalationOptions: EscalationLevel[] = ['SACCO Manager', 'SaccoPay Support', 'SaccoPay Technical'];

  // Quick action for FAQ still need help
  faqTicketSubject = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
    this.seedData();
    this.applyFilters();
    this.updateUnreadCount();
  }

  initForms(): void {
    this.newTicketForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      priority: ['Medium', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]]
    });

    this.escalateForm = this.fb.group({
      escalateTo: ['SaccoPay Support', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(15)]],
      acknowledge: [false, Validators.requiredTrue]
    });

    this.feedbackForm = this.fb.group({
      ticketRef: ['', Validators.required],
      whatWentWell: [''],
      whatToImprove: [''],
      consent: [false, Validators.requiredTrue]
    });
  }

  seedData(): void {
    this.tickets = [
      {
        id: '#SUP-2025-0042',
        subject: 'Emergency Loan Disbursement Delay',
        preview: 'Applied 3 days ago but funds not yet reflected in my M-Pesa.',
        description: 'I applied for an Emergency Loan of KES 15,000 on Feb 24, 2025. I received approval SMS but the funds have not been disbursed to my M-Pesa (07XX XXX 421) yet. Kindly assist.',
        category: 'Loan Issues',
        priority: 'High',
        status: 'Open',
        lastUpdate: '2 hours ago',
        createdAt: new Date(Date.now() - 86400000 * 3),
        escalationLevel: 'SACCO Admin',
        escalated: false,
        messages: [
          { id: 'm1', author: 'John Doe', role: 'Member', message: 'Applied for KES 15,000 emergency loan. Funds not received yet.', timestamp: new Date(Date.now() - 86400000 * 3) },
          { id: 'm2', author: 'Mary K. (SACCO Admin)', role: 'SACCO Admin', message: 'Hello John, we are checking with the disbursement team. Please allow 24 hours.', timestamp: new Date(Date.now() - 7200000) }
        ]
      },
      {
        id: '#SUP-2025-0038',
        subject: 'Missing Monthly Interest Credit',
        preview: 'January interest of KES 720 not credited to savings account.',
        description: 'My January savings interest of KES 720 was not posted to my account. Last credit was December 2024.',
        category: 'Savings',
        priority: 'Medium',
        status: 'Pending',
        lastUpdate: 'Yesterday',
        createdAt: new Date(Date.now() - 86400000 * 5),
        escalationLevel: 'SACCO Admin',
        escalated: false,
        messages: [
          { id: 'm1', author: 'John Doe', role: 'Member', message: 'Interest not credited for January.', timestamp: new Date(Date.now() - 86400000 * 5) }
        ]
      },
      {
        id: '#SUP-2025-0031',
        subject: 'M-Pesa STK Push Not Working',
        preview: 'When trying to repay loan via M-Pesa, STK push prompt does not appear.',
        description: 'STK push fails repeatedly when initiating loan repayment from the app.',
        category: 'Payments',
        priority: 'High',
        status: 'Open',
        lastUpdate: '4 hours ago',
        createdAt: new Date(Date.now() - 86400000 * 2),
        escalationLevel: 'SaccoPay Support',
        escalated: true,
        escalationReason: 'Technical payment gateway issue beyond SACCO admin scope.',
        messages: [
          { id: 'm1', author: 'John Doe', role: 'Member', message: 'STK push not coming through.', timestamp: new Date(Date.now() - 86400000 * 2) },
          { id: 'm2', author: 'SaccoPay Support', role: 'SaccoPay Support', message: 'Escalated to our payments engineering team. Reference: SP-INC-7821.', timestamp: new Date(Date.now() - 14400000) }
        ]
      },
      {
        id: '#SUP-2025-0025',
        subject: 'Request for Dividend Statement',
        preview: 'Need official FY 2024 dividend statement for tax filing purposes.',
        description: 'Kindly issue FY2024 dividend statement.',
        category: 'Shares',
        priority: 'Low',
        status: 'Resolved',
        lastUpdate: 'Feb 20, 2025',
        createdAt: new Date('2025-02-18'),
        escalationLevel: 'SACCO Admin',
        escalated: false,
        messages: [
          { id: 'm1', author: 'John Doe', role: 'Member', message: 'Please send FY2024 dividend statement.', timestamp: new Date('2025-02-18') },
          { id: 'm2', author: 'Mary K. (SACCO Admin)', role: 'SACCO Admin', message: 'Statement emailed to you. Kindly confirm receipt.', timestamp: new Date('2025-02-20') }
        ]
      },
      {
        id: '#SUP-2025-0019',
        subject: 'Update KYC Documents',
        preview: 'Submitted new ID copy and utility bill for address update...',
        description: 'KYC update request.',
        category: 'Account',
        priority: 'Medium',
        status: 'Closed',
        lastUpdate: 'Feb 15, 2025',
        createdAt: new Date('2025-02-10'),
        escalationLevel: 'SACCO Admin',
        escalated: false,
        messages: [
          { id: 'm1', author: 'John Doe', role: 'Member', message: 'Submitted updated KYC documents.', timestamp: new Date('2025-02-10') },
          { id: 'm2', author: 'Mary K. (SACCO Admin)', role: 'SACCO Admin', message: 'Documents verified and updated. Your profile is now complete.', timestamp: new Date('2025-02-15') }
        ]
      }
    ];

    this.faqs = [
      { id: 'f1', question: 'How long does loan disbursement take?', answer: 'Most loans are disbursed within 24 hours of approval. Emergency loans process within 2-4 hours during business days.', category: 'Loans', helpful: 142 },
      { id: 'f2', question: 'Why is my M-Pesa STK push not appearing?', answer: 'Ensure your phone has network, SIM is active, and you have sufficient M-Pesa balance. If it persists, raise a ticket and we will escalate to SaccoPay payments team.', category: 'Payments', helpful: 98 },
      { id: 'f3', question: 'How do I become a guarantor?', answer: 'You must be an active member for 6+ months with good standing. Use the Guarantor Nomination Form under Resources.', category: 'Loans', helpful: 76 },
      { id: 'f4', question: 'When are dividends paid?', answer: 'Dividends are declared at the AGM (March) and paid within 30 days to your savings account.', category: 'Shares', helpful: 211 },
      { id: 'f5', question: 'How do I update my KYC details?', answer: 'Go to Sacco Profile > KYC Documents and upload new ID/utility bill. Verification takes 2-3 business days.', category: 'Account', helpful: 54 },
      { id: 'f6', question: 'What happens if I miss a loan repayment?', answer: 'A 2% penalty applies on the overdue amount. After 30 days, recovery from guarantors begins.', category: 'Loans', helpful: 88 },
      { id: 'f7', question: 'How do I escalate an unresolved issue?', answer: 'If your SACCO Admin cannot resolve the issue within 48 hours, click "Escalate" in the ticket detail view to route to SACCO Manager or SaccoPay Support.', category: 'General', helpful: 45 },
      { id: 'f8', question: 'Where do I check for ticket updates?', answer: 'All ticket updates, replies, and status changes appear in the Notifications section. You will also receive email alerts.', category: 'General', helpful: 67 }
    ];

    this.resources = [
      { id: 'r1', title: 'SACCO Constitution & Bylaws', description: 'Full governing document covering membership rights, loan policies, dividend distribution, and AGM procedures.', type: 'DOCUMENT', action: 'Download PDF', url: '#' },
      { id: 'r2', title: 'Loan Application Checklist', description: 'Step-by-step checklist for all loan products including required documents, guarantor rules, and approval timelines.', type: 'DOCUMENT', action: 'Download PDF', url: '#' },
      { id: 'r3', title: 'M-Pesa PayBill Guide', description: 'Detailed instructions for deposits, loan repayments, and share purchases using our M-Pesa PayBill number.', type: 'DOCUMENT', action: 'Download PDF', url: '#' },
      { id: 'r4', title: 'Withdrawal Request Form', description: 'Official form for processing savings withdrawals. Must be submitted 48 hours before the desired processing date.', type: 'FORM', action: 'Download Form', url: '#' },
      { id: 'r5', title: 'Guarantor Nomination Form', description: 'Use this form when nominating guarantors for Development, School Fees, or Business loans.', type: 'FORM', action: 'Download Form', url: '#' },
      { id: 'r6', title: 'Data Privacy Policy', description: 'How SaccoPay collects, stores, and protects your personal and financial data in compliance with Kenyan Data Protection Act.', type: 'POLICY', action: 'Read Policy', url: '#' },
      { id: 'r7', title: 'Interest & Penalty Schedule', description: 'Current interest rates for all loan products, late payment penalties, and default recovery procedures.', type: 'POLICY', action: 'Download PDF', url: '#' },
      { id: 'r8', title: '2025 SACCO Events Calendar', description: 'Key dates for AGMs, dividend declarations, loan product launches, and member education days.', type: 'CALENDAR', action: 'Download Calendar', url: '#' },
      { id: 'r9', title: 'SACCO Office Directory', description: 'Phone numbers, email addresses, and office hours for all SACCO departments including loans, savings, and shares.', type: 'CONTACT', action: 'View Directory', url: '#' },
      { id: 'r10', title: 'Escalation Policy Guide', description: 'Learn when and how to escalate issues beyond SACCO Admin to SACCO Manager or SaccoPay Technical team.', type: 'POLICY', action: 'Read Guide', url: '#' }
    ];

    this.feedbackHistory = [
      { id: 'fb1', ticketRef: '#SUP-2025-0025', ticketTitle: 'Dividend Statement', rating: 5, comment: 'The admin team responded within 2 hours and sent the statement immediately. Very impressed!', submittedAt: new Date('2025-02-21') },
      { id: 'fb2', ticketRef: 'General', ticketTitle: 'Platform Usability', rating: 4, comment: 'Great app but would love dark mode and biometric login. Otherwise very smooth experience.', submittedAt: new Date('2025-01-15') }
    ];

    // Seed notifications
    this.notifications = [
      { id: 'n1', title: 'Ticket Updated', message: 'SACCO Admin replied to #SUP-2025-0042', type: 'info', timestamp: new Date(Date.now() - 7200000), read: false, action: 'View Ticket', link: '#SUP-2025-0042' },
      { id: 'n2', title: 'Escalation Confirmed', message: '#SUP-2025-0031 escalated to SaccoPay Support', type: 'warning', timestamp: new Date(Date.now() - 14400000), read: false, action: 'View Details', link: '#SUP-2025-0031' },
      { id: 'n3', title: 'Ticket Resolved', message: '#SUP-2025-0025 marked as resolved. Please rate your experience.', type: 'success', timestamp: new Date('2025-02-20'), read: true, action: 'Rate Now', link: 'feedback' },
      { id: 'n4', title: 'Payment Reminder', message: 'Your Emergency Loan installment of KES 3,200 is due on Mar 1, 2025', type: 'warning', timestamp: new Date(Date.now() - 86400000), read: false, action: 'Pay Now', link: 'payment' },
      { id: 'n5', title: 'System Maintenance', message: 'Scheduled maintenance on Feb 28, 2025 from 2:00 AM to 4:00 AM', type: 'info', timestamp: new Date('2025-02-25'), read: true, action: 'Learn More', link: '#' }
    ];
  }

  // === TAB SWITCHING ===
  setTab(tab: Tab): void {
    this.activeTab = tab;
    if (tab === 'notifications') {
      this.showNotificationsPanel = true;
    } else {
      this.showNotificationsPanel = false;
    }
  }

  // === NOTIFICATIONS ===
  get unreadNotifications(): NotificationItem[] {
    return this.notifications.filter(n => !n.read);
  }

  get readNotifications(): NotificationItem[] {
    return this.notifications.filter(n => n.read);
  }

  markNotificationRead(notification: NotificationItem): void {
    notification.read = true;
    this.updateUnreadCount();
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.updateUnreadCount();
    this.notify('All notifications marked as read', 'success');
  }

  deleteNotification(notification: NotificationItem): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.updateUnreadCount();
    }
  }

  handleNotificationAction(notification: NotificationItem): void {
    this.markNotificationRead(notification);
    if (notification.link?.startsWith('#SUP')) {
      const ticket = this.tickets.find(t => t.id === notification.link);
      if (ticket) {
        this.setTab('tickets');
        this.openTicketDetail(ticket);
      }
    } else if (notification.link === 'feedback') {
      this.setTab('feedback');
      this.feedbackForm.patchValue({ ticketRef: notification.link });
    } else if (notification.link === 'payment') {
      this.payNow();
    }
    this.showNotificationsPanel = false;
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  closeNotifications(): void {
    this.showNotificationsPanel = false;
    if (this.activeTab === 'notifications') {
      this.activeTab = 'tickets';
    }
  }

  // === FILTERING ===
  applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTickets = this.tickets.filter(t => {
      const matchTerm = !term || t.subject.toLowerCase().includes(term) || t.id.toLowerCase().includes(term) || t.category.toLowerCase().includes(term);
      const matchStatus = this.filterStatus === 'all' || t.status === this.filterStatus;
      return matchTerm && matchStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'all';
    this.applyFilters();
  }

  // === NEW TICKET ===
  openNewTicketModal(): void {
    this.newTicketForm.reset({ priority: 'Medium' });
    this.showNewTicketModal = true;
  }

  closeNewTicketModal(): void {
    this.showNewTicketModal = false;
  }

  submitNewTicket(): void {
    if (this.newTicketForm.invalid) {
      this.newTicketForm.markAllAsTouched();
      return;
    }
    const f = this.newTicketForm.value;
    const newId = `#SUP-2025-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const ticket: SupportTicket = {
      id: newId,
      subject: f.subject,
      preview: f.description.substring(0, 80) + '...',
      description: f.description,
      category: f.category,
      priority: f.priority,
      status: 'Open',
      lastUpdate: 'Just now',
      createdAt: new Date(),
      escalationLevel: 'SACCO Admin',
      escalated: false,
      messages: [
        { id: 'm0', author: 'John Doe', role: 'Member', message: f.description, timestamp: new Date() }
      ]
    };
    this.tickets.unshift(ticket);
    this.stats.openTickets++;
    this.applyFilters();
    this.closeNewTicketModal();
    this.showInfoModal = true;

    // Add notification
    this.notifications.unshift({
      id: 'n' + Date.now(),
      title: 'New Ticket Created',
      message: `Ticket ${newId} has been created and routed to SACCO Admin`,
      type: 'success',
      timestamp: new Date(),
      read: false,
      action: 'View Ticket',
      link: newId
    });
    this.updateUnreadCount();

    this.notify('Ticket submitted! Check Notifications for updates.', 'success');
  }

  // === TICKET DETAIL ===
  openTicketDetail(ticket: SupportTicket): void {
    this.selectedTicket = ticket;
    this.newReply = '';
    this.showTicketDetailModal = true;
  }

  closeTicketDetail(): void {
    this.showTicketDetailModal = false;
    this.selectedTicket = null;
  }

  sendReply(): void {
    if (!this.selectedTicket || !this.newReply.trim()) return;
    const msg: TicketMessage = {
      id: 'm' + Date.now(),
      author: 'John Doe',
      role: 'Member',
      message: this.newReply.trim(),
      timestamp: new Date()
    };
    this.selectedTicket.messages.push(msg);
    this.selectedTicket.lastUpdate = 'Just now';
    if (this.selectedTicket.status === 'Resolved' || this.selectedTicket.status === 'Closed') {
      this.selectedTicket.status = 'Open';
      this.stats.openTickets++;
    }
    this.newReply = '';

    // Add notification for reply
    this.notifications.unshift({
      id: 'n' + Date.now(),
      title: 'Reply Sent',
      message: `You replied to ${this.selectedTicket.id}`,
      type: 'info',
      timestamp: new Date(),
      read: true,
      action: 'View Ticket',
      link: this.selectedTicket.id
    });

    this.notify('Reply sent successfully', 'success');
  }

  markResolved(): void {
    if (!this.selectedTicket) return;
    this.selectedTicket.status = 'Resolved';
    this.selectedTicket.lastUpdate = 'Just now';
    this.stats.openTickets = Math.max(0, this.stats.openTickets - 1);
    this.stats.resolvedThisWeek++;

    // Add notification
    this.notifications.unshift({
      id: 'n' + Date.now(),
      title: 'Ticket Resolved',
      message: `${this.selectedTicket.id} marked as resolved. Please rate your experience.`,
      type: 'success',
      timestamp: new Date(),
      read: false,
      action: 'Rate Now',
      link: 'feedback'
    });
    this.updateUnreadCount();

    this.notify('Ticket marked as resolved. Please rate your experience under Feedback.', 'success');
    this.closeTicketDetail();
    this.applyFilters();
  }

  reopenTicket(): void {
    if (!this.selectedTicket) return;
    this.selectedTicket.status = 'Open';
    this.selectedTicket.lastUpdate = 'Just now';
    this.stats.openTickets++;

    // Add notification
    this.notifications.unshift({
      id: 'n' + Date.now(),
      title: 'Ticket Reopened',
      message: `${this.selectedTicket.id} has been reopened`,
      type: 'info',
      timestamp: new Date(),
      read: false,
      action: 'View Ticket',
      link: this.selectedTicket.id
    });
    this.updateUnreadCount();

    this.notify('Ticket re-opened', 'info');
    this.applyFilters();
  }

  // === ESCALATION ===
  openEscalateModal(): void {
    if (!this.selectedTicket) return;
    this.escalateForm.reset({ escalateTo: 'SaccoPay Support', acknowledge: false });
    this.showEscalateModal = true;
  }

  closeEscalateModal(): void {
    this.showEscalateModal = false;
  }

  confirmEscalate(): void {
    if (this.escalateForm.invalid || !this.selectedTicket) {
      this.escalateForm.markAllAsTouched();
      return;
    }
    const f = this.escalateForm.value;
    this.selectedTicket.escalated = true;
    this.selectedTicket.status = 'Escalated';
    this.selectedTicket.escalationLevel = f.escalateTo as EscalationLevel;
    this.selectedTicket.escalationReason = f.reason;
    this.selectedTicket.priority = this.selectedTicket.priority === 'Low' ? 'Medium' : 'High';
    this.selectedTicket.lastUpdate = 'Just now';
    this.selectedTicket.messages.push({
      id: 'esc' + Date.now(),
      author: 'System',
      role: 'SaccoPay Support',
      message: `Ticket escalated to ${f.escalateTo}. Reason: ${f.reason}. A specialist will respond within 4 business hours.`,
      timestamp: new Date()
    });
    this.stats.pendingEscalation++;

    // Add notification
    this.notifications.unshift({
      id: 'n' + Date.now(),
      title: 'Ticket Escalated',
      message: `${this.selectedTicket.id} escalated to ${f.escalateTo}`,
      type: 'warning',
      timestamp: new Date(),
      read: false,
      action: 'View Details',
      link: this.selectedTicket.id
    });
    this.updateUnreadCount();

    this.closeEscalateModal();
    this.closeTicketDetail();
    this.applyFilters();
    this.notify(`Escalated to ${f.escalateTo}. Track updates in Notifications.`, 'warning');
  }

  // === FEEDBACK ===
  setRating(n: number): void {
    this.rating = n;
  }

  submitFeedback(): void {
    if (this.rating === 0) {
      this.notify('Please select a star rating', 'error');
      return;
    }
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }
    const f = this.feedbackForm.value;
    const entry: FeedbackEntry = {
      id: 'fb' + Date.now(),
      ticketRef: f.ticketRef,
      ticketTitle: 'Support Experience',
      rating: this.rating,
      comment: f.whatWentWell || f.whatToImprove || 'No comment',
      submittedAt: new Date()
    };
    this.feedbackHistory.unshift(entry);
    this.stats.totalRatings++;
    this.stats.satisfactionScore = Math.round((this.stats.satisfactionScore * (this.stats.totalRatings - 1) + this.rating * 20) / this.stats.totalRatings);

    // Add notification
    this.notifications.unshift({
      id: 'n' + Date.now(),
      title: 'Feedback Submitted',
      message: 'Thank you for your feedback! It helps us improve.',
      type: 'success',
      timestamp: new Date(),
      read: true
    });

    this.clearFeedback();
    this.notify('Thanks! Your feedback helps us improve.', 'success');
  }

  clearFeedback(): void {
    this.rating = 0;
    this.hoverRating = 0;
    this.feedbackForm.reset({ ticketRef: '', consent: false });
  }

  // === FAQ ===
  toggleFaq(faq: FaqItem): void {
    faq.expanded = !faq.expanded;
  }

  markFaqHelpful(faq: FaqItem): void {
    faq.helpful++;
    this.notify('Thanks for your feedback!', 'success');
  }

  faqStillNeedHelp(faq: FaqItem): void {
    this.faqTicketSubject = `Need more help: ${faq.question}`;
    this.openNewTicketModal();
    this.newTicketForm.patchValue({ 
      subject: this.faqTicketSubject,
      category: faq.category === 'Loans' ? 'Loan Issues' : faq.category === 'Shares' ? 'Shares' : faq.category === 'Account' ? 'Account' : 'General',
      description: `I read the FAQ about "${faq.question}" but I still need assistance. Please help me with this issue.`
    });
  }

  get filteredFaqs(): FaqItem[] {
    const term = this.faqSearch.toLowerCase().trim();
    return this.faqs.filter(f => {
      const matchTerm = !term || f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term);
      const matchCat = this.faqCategory === 'all' || f.category === this.faqCategory;
      return matchTerm && matchCat;
    });
  }

  get faqCategories(): string[] {
    return ['all', ...Array.from(new Set(this.faqs.map(f => f.category)))];
  }

  // === RESOURCES ===
  downloadResource(r: ResourceItem): void {
    this.notify(`Preparing ${r.title}...`, 'info');
    setTimeout(() => {
      this.notify(`${r.title} downloaded. Check Notifications for confirmation.`, 'success');

      // Add notification
      this.notifications.unshift({
        id: 'n' + Date.now(),
        title: 'Download Complete',
        message: `${r.title} has been downloaded successfully`,
        type: 'success',
        timestamp: new Date(),
        read: false
      });
      this.updateUnreadCount();
    }, 1200);
  }

  // === INFO / NOTIFICATIONS ===
  goToNotifications(): void {
    this.showInfoModal = false;
    this.setTab('notifications');
    this.showNotificationsPanel = true;
    this.notify('Opening Notifications...', 'info');
  }

  payNow(): void {
    this.notify('Opening loan repayment flow...', 'info');
    setTimeout(() => {
      this.notify('Redirecting to M-Pesa payment gateway...', 'info');
    }, 1000);
  }

  // === TOAST ===
  notify(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3500);
  }

  // === HELPERS ===
  priorityClass(p: TicketPriority): string {
    return `priority-${p.toLowerCase()}`;
  }
  statusClass(s: TicketStatus): string {
    return `status-${s.toLowerCase()}`;
  }
  resourceClass(t: string): string {
    return `type-${t.toLowerCase()}`;
  }
  notificationClass(t: string): string {
    return `notif-${t}`;
  }

  trackById(_: number, item: any): string {
    return item.id;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}