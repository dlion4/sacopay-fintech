// member-support.component.ts
// Angular v21 Standalone — Member Support Page — Body Only
// NO animations — no Zone.js required

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ─────────────────────────────────────────────── */
/*  INTERFACES                                      */
/* ─────────────────────────────────────────────── */

interface Ticket {
  id: string;
  subject: string;
  preview: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  priorityLabel: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  statusLabel: string;
  lastUpdate: string;
  fullDescription?: string;
  replies?: TicketReply[];
}

interface TicketReply {
  id: string;
  author: string;
  role: 'member' | 'support' | 'admin';
  message: string;
  timestamp: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  open: boolean;
}

interface VideoGuide {
  title: string;
  duration: string;
  url?: string;
}

interface ResourceItem {
  name: string;
  desc: string;
  type: 'document' | 'form' | 'policy' | 'calendar' | 'contact';
  typeLabel: string;
  typeIcon: string;
  actionLabel: string;
  fileSize?: string;
  fileUrl?: string;
}

interface FeedbackItem {
  ticket: string;
  stars: string;
  quote: string;
  date: string;
}

interface SupportMetric {
  label: string;
  value: string;
  icon: string;
}

interface ToastItem {
  id: number;
  type: 'ok' | 'info' | 'warn' | 'error';
  message: string;
  icon: string;
}

interface PageTab {
  id: string;
  label: string;
  icon: string;
}

interface ModalState {
  ticketView: boolean;
  newTicket: boolean;
  videoPlayer: boolean;
  resourcePreview: boolean;
  policyReader: boolean;
  directoryView: boolean;
  confirmAction: boolean;
}

/* ─────────────────────────────────────────────── */
/*  COMPONENT                                       */
/* ─────────────────────────────────────────────── */

@Component({
  selector: 'app-member-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-support.html',
  styleUrls: ['./account-support.scss']
})
export class MemberSupportComponent implements OnInit {

  /* ── Active Tab ── */
  activeTab = 'tickets';

  pageTabs: PageTab[] = [
    { id: 'tickets', label: 'My Tickets', icon: 'bi-ticket-perforated-fill' },
    { id: 'faq', label: 'FAQ', icon: 'bi-patch-question-fill' },
    { id: 'resources', label: 'Resources', icon: 'bi-folder2-open' },
    { id: 'feedback', label: 'Feedback', icon: 'bi-star-fill' }
  ];

  /* ── Stats ── */
  stats = {
    openTickets: 3,
    resolvedThisWeek: 2,
    avgResponseTime: '2h',
    pendingEscalation: 1,
    satisfactionScore: 92,
    ratingCount: 12
  };

  /* ── Modal States ── */
  modals: ModalState = {
    ticketView: false,
    newTicket: false,
    videoPlayer: false,
    resourcePreview: false,
    policyReader: false,
    directoryView: false,
    confirmAction: false
  };

  /* ── Selected Items for Modals ── */
  selectedTicket: Ticket | null = null;
  selectedVideo: VideoGuide | null = null;
  selectedResource: ResourceItem | null = null;
  confirmActionData = {
    title: '',
    message: '',
    action: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel'
  };

  /* ── New Ticket Form ── */
  newTicketForm = {
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    attachments: [] as File[]
  };

  ticketCategories = [
    'Loan Issues',
    'Savings',
    'Payments',
    'Shares',
    'Account',
    'General Inquiry'
  ];

  /* ── Tickets ── */
  tickets: Ticket[] = [
    {
      id: '#SUP-2025-0042',
      subject: 'Emergency Loan Disbursement Delay',
      preview: 'Applied 3 days ago but funds not yet reflected in my M-Pesa...',
      category: 'Loan Issues',
      priority: 'high',
      priorityLabel: 'High',
      status: 'open',
      statusLabel: 'Open',
      lastUpdate: '2 hours ago',
      fullDescription: `I applied for an Emergency Loan on February 22, 2025, and received approval notification on February 23. However, as of today (February 25), the funds have not been disbursed to my M-Pesa account. I have checked my M-Pesa messages and there is no transaction. My M-Pesa number is 254712345678. Please help resolve this urgently as I need the funds for a medical emergency.`,
      replies: [
        {
          id: 'r1',
          author: 'Jane Wanjiku',
          role: 'support',
          message: 'Thank you for contacting us. We have received your request and are investigating the disbursement delay. We will update you within 2 hours.',
          timestamp: 'Feb 25, 2025 — 10:30 AM'
        },
        {
          id: 'r2',
          author: 'System',
          role: 'admin',
          message: 'Internal Note: Disbursement queue shows pending status. M-Pesa API timeout detected at 09:15 AM. Retrying now.',
          timestamp: 'Feb 25, 2025 — 11:00 AM'
        }
      ]
    },
    {
      id: '#SUP-2025-0038',
      subject: 'Missing Monthly Interest Credit',
      preview: 'January interest of KES 720 not credited to savings account...',
      category: 'Savings',
      priority: 'medium',
      priorityLabel: 'Medium',
      status: 'pending',
      statusLabel: 'Pending',
      lastUpdate: 'Yesterday',
      fullDescription: `My January 2025 interest credit of KES 720 was not reflected in my savings account. I have maintained the minimum balance requirement. Please review and credit the missing interest.`,
      replies: [
        {
          id: 'r1',
          author: 'Peter Ochieng',
          role: 'support',
          message: 'We have forwarded your request to the savings department. They will review your account and process the interest credit if valid.',
          timestamp: 'Feb 24, 2025 — 2:15 PM'
        }
      ]
    },
    {
      id: '#SUP-2025-0031',
      subject: 'M-Pesa STK Push Not Working',
      preview: 'When trying to repay loan via M-Pesa, STK push prompt does not appear...',
      category: 'Payments',
      priority: 'high',
      priorityLabel: 'High',
      status: 'open',
      statusLabel: 'Open',
      lastUpdate: '4 hours ago',
      fullDescription: `When I try to make a loan repayment using the M-Pesa STK push option in the app, the prompt does not appear on my phone. I have tried multiple times today. My M-Pesa is working fine for other transactions.`,
      replies: []
    },
    {
      id: '#SUP-2025-0025',
      subject: 'Request for Dividend Statement',
      preview: 'Need official FY 2024 dividend statement for tax filing purposes...',
      category: 'Shares',
      priority: 'low',
      priorityLabel: 'Low',
      status: 'resolved',
      statusLabel: 'Resolved',
      lastUpdate: 'Feb 20, 2025',
      fullDescription: `I need an official dividend statement for FY 2024 for my tax filing. The statement should show the dividend amount, date paid, and SACCO details.`,
      replies: [
        {
          id: 'r1',
          author: 'Mary Kamau',
          role: 'support',
          message: 'Your dividend statement has been generated and sent to your registered email address. Please check your inbox and spam folder.',
          timestamp: 'Feb 20, 2025 — 9:00 AM'
        },
        {
          id: 'r2',
          author: 'You',
          role: 'member',
          message: 'Received, thank you for the quick turnaround!',
          timestamp: 'Feb 20, 2025 — 11:30 AM'
        }
      ]
    },
    {
      id: '#SUP-2025-0019',
      subject: 'Update KYC Documents',
      preview: 'Submitted new ID copy and utility bill for address update...',
      category: 'Account',
      priority: 'medium',
      priorityLabel: 'Medium',
      status: 'closed',
      statusLabel: 'Closed',
      lastUpdate: 'Feb 15, 2025',
      fullDescription: `I have submitted my new National ID copy and a recent utility bill to update my KYC records. My address has changed from Nairobi to Mombasa.`,
      replies: [
        {
          id: 'r1',
          author: 'Admin Team',
          role: 'admin',
          message: 'Your KYC documents have been verified and your address updated successfully.',
          timestamp: 'Feb 15, 2025 — 3:00 PM'
        }
      ]
    }
  ];

  /* ── FAQ ── */
  faqs: FaqItem[] = [
    {
      id: 'faq1',
      question: 'How do I apply for a loan?',
      answer: `Navigate to <strong>My Loans &gt; Apply New Loan</strong>, select your desired product, fill in the amount and purpose, upload required documents, and nominate guarantors if needed. Approval typically takes 1–3 business days. You will receive SMS and email notifications at each stage.`,
      open: false
    },
    {
      id: 'faq2',
      question: 'Why is my M-Pesa payment not reflecting?',
      answer: `M-Pesa payments may take up to <strong>15 minutes</strong> to reflect during peak hours. If it exceeds 30 minutes, check your M-Pesa confirmation message, then raise a ticket under <strong>M-Pesa / Payments</strong> with the transaction code. Our team will reconcile within 2 hours.`,
      open: false
    },
    {
      id: 'faq3',
      question: 'Can I change my loan guarantor?',
      answer: `Guarantor changes are only permitted <strong>before loan disbursement</strong>. Go to your pending loan application, click <strong>Manage Guarantors</strong>, remove the existing guarantor, and send a new request. The new guarantor must accept within 48 hours.`,
      open: false
    },
    {
      id: 'faq4',
      question: 'What is the minimum monthly savings contribution?',
      answer: `The minimum monthly savings contribution is <strong>KES 1,000</strong>. However, to maintain loan eligibility at 3x multiplier, we recommend contributing at least <strong>KES 5,000</strong> monthly. You can set up a standing order via M-Pesa PayBill 522522.`,
      open: false
    },
    {
      id: 'faq5',
      question: 'How are dividends calculated and paid?',
      answer: `Dividends are calculated as a percentage of your <strong>share capital</strong> at the end of the financial year. The Board declares the rate at the AGM. For FY 2024, the rate is <strong>12.5%</strong>. Payments are processed via M-Pesa or bank transfer by March 31.`,
      open: false
    },
    {
      id: 'faq6',
      question: 'How do I withdraw from my savings?',
      answer: `You may request a withdrawal anytime, but <strong>minimum balance rules apply</strong>. You must retain at least KES 2,000 as a retention amount. Withdrawals are processed within 24 hours on business days. Large withdrawals above KES 50,000 require SACCO admin approval.`,
      open: false
    }
  ];

  /* ── Search Pills ── */
  searchPills = [
    'Loan application',
    'M-Pesa payment',
    'Guarantor',
    'Dividends',
    'Withdrawal rules',
    'KYC update'
  ];

  /* ── Video Guides ── */
  videoGuides: VideoGuide[] = [
    { title: 'How to Apply for a Loan', duration: '3 min 42 sec', url: 'https://saccopay.co/guides/loan-application' },
    { title: 'M-Pesa Payment Guide', duration: '2 min 15 sec', url: 'https://saccopay.co/guides/mpesa-payment' },
    { title: 'Understanding Your Dashboard', duration: '5 min 08 sec', url: 'https://saccopay.co/guides/dashboard-overview' }
  ];

  /* ── Resources ── */
  resources: ResourceItem[] = [
    {
      name: 'SACCO Constitution & Bylaws',
      desc: 'Full governing document covering membership rights, loan policies, dividend distribution, and AGM procedures.',
      type: 'document',
      typeLabel: 'Document',
      typeIcon: 'bi-file-earmark-pdf-fill',
      actionLabel: 'Download PDF',
      fileSize: '2.4 MB',
      fileUrl: '/assets/docs/sacco-constitution-2025.pdf'
    },
    {
      name: 'Loan Application Checklist',
      desc: 'Step-by-step checklist for all loan products including required documents, guarantor rules, and approval timelines.',
      type: 'document',
      typeLabel: 'Document',
      typeIcon: 'bi-file-earmark-check-fill',
      actionLabel: 'Download PDF',
      fileSize: '856 KB',
      fileUrl: '/assets/docs/loan-checklist.pdf'
    },
    {
      name: 'M-Pesa PayBill Guide',
      desc: 'Detailed instructions for deposits, loan repayments, and share purchases using our M-Pesa PayBill number.',
      type: 'document',
      typeLabel: 'Document',
      typeIcon: 'bi-phone-fill',
      actionLabel: 'Download PDF',
      fileSize: '1.2 MB',
      fileUrl: '/assets/docs/mpesa-guide.pdf'
    },
    {
      name: 'Withdrawal Request Form',
      desc: 'Official form for processing savings withdrawals. Must be submitted 48 hours before the desired processing date.',
      type: 'form',
      typeLabel: 'Form',
      typeIcon: 'bi-file-earmark-text-fill',
      actionLabel: 'Download Form',
      fileSize: '245 KB',
      fileUrl: '/assets/forms/withdrawal-form.pdf'
    },
    {
      name: 'Guarantor Nomination Form',
      desc: 'Use this form when nominating guarantors for Development, School Fees, or Business loans.',
      type: 'form',
      typeLabel: 'Form',
      typeIcon: 'bi-people-fill',
      actionLabel: 'Download Form',
      fileSize: '312 KB',
      fileUrl: '/assets/forms/guarantor-form.pdf'
    },
    {
      name: 'Data Privacy Policy',
      desc: 'How SaccoPay collects, stores, and protects your personal and financial data in compliance with Kenyan Data Protection Act.',
      type: 'policy',
      typeLabel: 'Policy',
      typeIcon: 'bi-shield-lock-fill',
      actionLabel: 'Read Policy',
      fileUrl: '/assets/policies/data-privacy.html'
    },
    {
      name: 'Interest & Penalty Schedule',
      desc: 'Current interest rates for all loan products, late payment penalties, and default recovery procedures.',
      type: 'policy',
      typeLabel: 'Policy',
      typeIcon: 'bi-percent',
      actionLabel: 'Download PDF',
      fileSize: '1.8 MB',
      fileUrl: '/assets/docs/interest-schedule.pdf'
    },
    {
      name: '2025 SACCO Events Calendar',
      desc: 'Key dates for AGMs, dividend declarations, loan product launches, and member education days.',
      type: 'calendar',
      typeLabel: 'Calendar',
      typeIcon: 'bi-calendar-event-fill',
      actionLabel: 'Download Calendar',
      fileSize: '1.1 MB',
      fileUrl: '/assets/docs/events-calendar-2025.ics'
    },
    {
      name: 'SACCO Office Directory',
      desc: 'Phone numbers, email addresses, and office hours for all SACCO departments including loans, savings, and shares.',
      type: 'contact',
      typeLabel: 'Contact',
      typeIcon: 'bi-telephone-fill',
      actionLabel: 'View Directory'
    }
  ];

  /* ── Office Directory Data ── */
  officeDirectory = [
    { department: 'Loans Department', phone: '+254 712 345 001', email: 'loans@saccopay.co', hours: 'Mon–Fri, 8:00 AM – 5:00 PM' },
    { department: 'Savings & Shares', phone: '+254 712 345 002', email: 'savings@saccopay.co', hours: 'Mon–Fri, 8:00 AM – 5:00 PM' },
    { department: 'Member Support', phone: '+254 712 345 003', email: 'support@saccopay.co', hours: 'Mon–Sat, 7:00 AM – 8:00 PM' },
    { department: 'IT & Technical', phone: '+254 712 345 004', email: 'it@saccopay.co', hours: 'Mon–Fri, 8:00 AM – 6:00 PM' },
    { department: 'Accounts & Finance', phone: '+254 712 345 005', email: 'accounts@saccopay.co', hours: 'Mon–Fri, 8:00 AM – 5:00 PM' },
    { department: 'Compliance & KYC', phone: '+254 712 345 006', email: 'compliance@saccopay.co', hours: 'Mon–Fri, 9:00 AM – 4:00 PM' }
  ];

  /* ── Feedback Form ── */
  currentRating = 0;
  hoverRating = 0;
  starLabel = 'Click a star to rate';

  feedbackForm = {
    ticket: '',
    positive: '',
    improvement: '',
    consent: false
  };

  feedbackTickets = [
    '#SUP-2025-0042 — Emergency Loan Disbursement Delay',
    '#SUP-2025-0038 — Missing Monthly Interest Credit',
    '#SUP-2025-0031 — M-Pesa STK Push Not Working',
    '#SUP-2025-0025 — Request for Dividend Statement',
    '#SUP-2025-0019 — Update KYC Documents',
    'General — Platform Usability'
  ];

  ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  /* ── Feedback History ── */
  feedbackHistory: FeedbackItem[] = [
    {
      ticket: '#SUP-2025-0025 — Dividend Statement',
      stars: '★★★★★',
      quote: 'The admin team responded within 2 hours and sent the statement immediately. Very impressed!',
      date: 'Submitted on Feb 21, 2025'
    },
    {
      ticket: 'General — Platform Usability',
      stars: '★★★★☆',
      quote: 'Great app but would love dark mode and biometric login. Otherwise very smooth experience.',
      date: 'Submitted on Jan 15, 2025'
    }
  ];

  /* ── Support Metrics ── */
  supportMetrics: SupportMetric[] = [
    { label: 'First Response Time', value: '2.1 hours', icon: 'bi-stopwatch' },
    { label: 'Resolution Rate', value: '94%', icon: 'bi-check-circle' },
    { label: 'Member Satisfaction', value: '4.6 / 5.0', icon: 'bi-emoji-smile' },
    { label: 'Tickets Resolved This Month', value: '142', icon: 'bi-ticket-perforated' }
  ];

  /* ── Toasts ── */
  toasts: ToastItem[] = [];
  private toastId = 0;

  /* ── New Ticket Reply ── */
  newReplyText = '';

  /* ─────────────────────────────────────────────── */
  /*  LIFECYCLE                                       */
  /* ─────────────────────────────────────────────── */

  ngOnInit(): void {
    // Component initialized
  }

  /* ─────────────────────────────────────────────── */
  /*  TABS                                            */
  /* ─────────────────────────────────────────────── */

  setTab(tabId: string): void {
    this.activeTab = tabId;
  }

  /* ─────────────────────────────────────────────── */
  /*  MODAL MANAGEMENT                                */
  /* ─────────────────────────────────────────────── */

  openModal(modalName: keyof ModalState): void {
    this.modals[modalName] = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalName: keyof ModalState): void {
    this.modals[modalName] = false;
    const anyOpen = Object.values(this.modals).some(v => v);
    if (!anyOpen) {
      document.body.style.overflow = '';
    }
  }

  closeAllModals(): void {
    Object.keys(this.modals).forEach(key => {
      this.modals[key as keyof ModalState] = false;
    });
    document.body.style.overflow = '';
  }

  /* ─────────────────────────────────────────────── */
  /*  TICKETS                                         */
  /* ─────────────────────────────────────────────── */

  viewTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.openModal('ticketView');
  }

  closeTicketModal(): void {
    this.selectedTicket = null;
    this.closeModal('ticketView');
  }

  openNewTicketModal(): void {
    this.newTicketForm = {
      subject: '',
      category: '',
      priority: 'medium',
      description: '',
      attachments: []
    };
    this.openModal('newTicket');
  }

  submitNewTicket(): void {
    if (!this.newTicketForm.subject.trim()) {
      this.showToast('Please enter a subject for your ticket.', 'warn');
      return;
    }
    if (!this.newTicketForm.category) {
      this.showToast('Please select a category.', 'warn');
      return;
    }
    if (!this.newTicketForm.description.trim()) {
      this.showToast('Please describe your issue.', 'warn');
      return;
    }

    const newId = '#SUP-2025-00' + (43 + this.tickets.filter(t => t.id.startsWith('#SUP-2025')).length);
    const newTicket: Ticket = {
      id: newId,
      subject: this.newTicketForm.subject,
      preview: this.newTicketForm.description.substring(0, 80) + '...',
      category: this.newTicketForm.category,
      priority: this.newTicketForm.priority as 'high' | 'medium' | 'low',
      priorityLabel: this.newTicketForm.priority.charAt(0).toUpperCase() + this.newTicketForm.priority.slice(1),
      status: 'open',
      statusLabel: 'Open',
      lastUpdate: 'Just now',
      fullDescription: this.newTicketForm.description,
      replies: []
    };

    this.tickets.unshift(newTicket);
    this.stats.openTickets++;
    this.closeModal('newTicket');
    this.showToast('Ticket ' + newId + ' created successfully!', 'ok');
    this.activeTab = 'tickets';
  }

  replyToTicket(): void {
    if (!this.selectedTicket || !this.newReplyText.trim()) {
      this.showToast('Please type a reply message.', 'warn');
      return;
    }

    const reply: TicketReply = {
      id: 'r' + ((this.selectedTicket.replies?.length || 0) + 1),
      author: 'You',
      role: 'member',
      message: this.newReplyText,
      timestamp: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    if (!this.selectedTicket.replies) {
      this.selectedTicket.replies = [];
    }
    this.selectedTicket.replies.push(reply);
    this.selectedTicket.lastUpdate = 'Just now';
    this.newReplyText = '';
    this.showToast('Reply sent successfully.', 'ok');
  }

  /* ─────────────────────────────────────────────── */
  /*  FAQ                                             */
  /* ─────────────────────────────────────────────── */

  toggleFaq(faqId: string): void {
    const faq = this.faqs.find(f => f.id === faqId);
    if (faq) {
      faq.open = !faq.open;
    }
  }

  /* ─────────────────────────────────────────────── */
  /*  RESOURCES                                       */
  /* ─────────────────────────────────────────────── */

  downloadResource(res: ResourceItem): void {
    this.selectedResource = res;

    if (res.actionLabel === 'Read Policy') {
      this.openModal('policyReader');
    } else if (res.actionLabel === 'View Directory') {
      this.openModal('directoryView');
    } else {
      this.openModal('resourcePreview');
    }
  }

  confirmResourceDownload(): void {
    if (this.selectedResource) {
      this.showToast('Downloading ' + this.selectedResource.name + '...', 'ok');
    }
    this.closeModal('resourcePreview');
  }

  /* ─────────────────────────────────────────────── */
  /*  VIDEO GUIDES                                    */
  /* ─────────────────────────────────────────────── */

  playVideo(video: VideoGuide): void {
    this.selectedVideo = video;
    this.openModal('videoPlayer');
  }

  closeVideoModal(): void {
    this.selectedVideo = null;
    this.closeModal('videoPlayer');
  }

  /* ─────────────────────────────────────────────── */
  /*  STAR RATING                                     */
  /* ─────────────────────────────────────────────── */

  setRating(val: number): void {
    this.currentRating = val;
    this.starLabel = this.ratingLabels[val] + ' (' + val + '/5)';
  }

  setHover(val: number): void {
    this.hoverRating = val;
  }

  clearHover(): void {
    this.hoverRating = 0;
  }

  /* ─────────────────────────────────────────────── */
  /*  FEEDBACK SUBMIT                                 */
  /* ─────────────────────────────────────────────── */

  submitFeedback(): void {
    if (!this.currentRating) {
      this.showToast('Please select a star rating first.', 'warn');
      return;
    }
    if (!this.feedbackForm.consent) {
      this.showToast('Please consent to feedback usage.', 'warn');
      return;
    }
    this.showToast('Thank you! Your feedback has been submitted ✓', 'ok');
    this.clearFeedback();
  }

  clearFeedback(): void {
    this.currentRating = 0;
    this.hoverRating = 0;
    this.starLabel = 'Click a star to rate';
    this.feedbackForm = {
      ticket: '',
      positive: '',
      improvement: '',
      consent: false
    };
  }

  /* ─────────────────────────────────────────────── */
  /*  TOASTS                                          */
  /* ─────────────────────────────────────────────── */

  showToast(message: string, type: 'ok' | 'info' | 'warn' | 'error' = 'info'): void {
    const icons: Record<string, string> = {
      ok: 'bi-check-circle-fill',
      info: 'bi-info-circle-fill',
      warn: 'bi-exclamation-triangle-fill',
      error: 'bi-x-circle-fill'
    };

    const toast: ToastItem = {
      id: ++this.toastId,
      type,
      message,
      icon: icons[type] || 'bi-info-circle-fill'
    };

    this.toasts.push(toast);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, 3200);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  /* ─────────────────────────────────────────────── */
  /*  UTILITY                                         */
  /* ─────────────────────────────────────────────── */

  onBackdropClick(event: MouseEvent, modalName: keyof ModalState): void {
    if (event.target === event.currentTarget) {
      this.closeModal(modalName);
    }
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      high: '#dc2626',
      medium: '#f59e0b',
      low: '#16a34a'
    };
    return colors[priority] || '#6b7280';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      open: '#dc2626',
      pending: '#f59e0b',
      resolved: '#16a34a',
      closed: '#6b7280'
    };
    return colors[status] || '#6b7280';
  }
}