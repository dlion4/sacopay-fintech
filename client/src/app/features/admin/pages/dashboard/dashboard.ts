import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

/* ════════════════════════════════════════════════════════════════════════════
   INTERFACES
════════════════════════════════════════════════════════════════════════════ */

interface Transaction {
  ref: string;
  memberName: string;
  memberId: string;
  memberInitials: string;
  memberColor: string;
  type: string;
  typeColor: string;
  amount: string;
  channel: string;
  channelIcon: string;
  channelColor: string;
  status: 'success' | 'pending' | 'failed';
  time: string;
}

interface TimelineItem {
  time: string;
  title: string;
  description: string;
  meta: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface ApprovalItem {
  title: string;
  subtitle: string;
  action: string;
  actionLink: string;
}

interface QuickAction {
  icon: string;
  label: string;
  sublabel: string;
  color: string;
  link: string;
}

interface MiniBar {
  height: string;
  title: string;
  label: string;
  isToday: boolean;
}

interface DonutSegment {
  color: string;
  label: string;
  percent: string;
}

interface CompactMetric {
  icon: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  label: string;
  value: string;
  subValue?: string;
  link: string;
}

interface QuickActionModalItem {
  icon: string;
  label: string;
  color: string;
  link: string;
}

interface HelpModalItem {
  icon: string;
  label: string;
  color: string;
}

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════════════ */

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  /* ────────────────────────────────────────────────────────────────────────
     MODAL STATES
  ──────────────────────────────────────────────────────────────────────── */
  showQuickActionsModal = false;
  showTxDetailModal = false;
  showFilterModal = false;
  showExportModal = false;
  showHelpModal = false;
  showProfileModal = false;

  /* ────────────────────────────────────────────────────────────────────────
     TOAST STATE
  ──────────────────────────────────────────────────────────────────────── */
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'info' | 'warning' | 'danger' = 'success';
  toastTimer: any;

  /* ────────────────────────────────────────────────────────────────────────
     TX DETAIL DATA
  ──────────────────────────────────────────────────────────────────────── */
  selectedTxRef = '';
  selectedTxCode = '';

  /* ────────────────────────────────────────────────────────────────────────
     FILTER STATE
  ──────────────────────────────────────────────────────────────────────── */
  filterDateRange = 'Today';
  filterType = 'All Types';
  filterChannel = 'All Channels';
  filterStatus = 'All';

  /* ────────────────────────────────────────────────────────────────────────
     EXPORT STATE
  ──────────────────────────────────────────────────────────────────────── */
  exportFormat = 'CSV';
  exportPeriod = 'Today';

  /* ────────────────────────────────────────────────────────────────────────
     USER PROFILE DATA
  ──────────────────────────────────────────────────────────────────────── */
  currentUser = {
    name: 'Admin User',
    role: 'System Administrator',
    email: 'admin@sacco.com',
    initials: 'AU',
    avatarColor: 'c1'
  };

  /* ────────────────────────────────────────────────────────────────────────
     COMPACT METRICS
  ──────────────────────────────────────────────────────────────────────── */
  compactMetrics: CompactMetric[] = [
    {
      icon: 'bi-arrow-down-circle',
      iconBg: 'bg-success-subtle',
      iconColor: 'text-success',
      borderColor: 'border-success',
      label: 'All Collections',
      value: 'KES 248K',
      link: 'loan-repayments'
    },
    {
      icon: 'bi-clock-history',
      iconBg: 'bg-warning-subtle',
      iconColor: 'text-warning',
      borderColor: 'border-warning',
      label: 'All Loans',
      value: '7',
      link: 'loan-repayments'
    },
    {
      icon: 'bi-shield-lock',
      iconBg: 'bg-primary-subtle',
      iconColor: 'text-primary',
      borderColor: 'border-primary',
      label: 'All Member Requests',
      value: '5',
      link: 'notifications'
    },
    {
      icon: 'bi-graph-up-arrow',
      iconBg: 'bg-info-subtle',
      iconColor: 'text-info',
      borderColor: 'border-info',
      label: 'Repaid Loans',
      value: '8',
      subValue: '12',
      link: 'analytics'
    }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     QUICK ACTIONS
  ──────────────────────────────────────────────────────────────────────── */
  quickActions: QuickAction[] = [
    { 
      icon: 'bi-plus-circle', 
      label: 'New Loan', 
      sublabel: 'Create application', 
      color: 'var(--primary-green)', 
      link: 'loan-disbursements' 
    },
    { 
      icon: 'bi-box-arrow-in-down', 
      label: 'Deposit', 
      sublabel: 'Process deposit', 
      color: 'var(--accent-blue)', 
      link: 'savings' 
    },
    { 
      icon: 'bi-box-arrow-up', 
      label: 'Withdrawal', 
      sublabel: 'Process withdrawal', 
      color: 'var(--status-danger)', 
      link: 'savings' 
    },
    { 
      icon: 'bi-person-plus', 
      label: 'Add Member', 
      sublabel: 'Register new', 
      color: 'var(--accent-orange)', 
      link: 'members' 
    },
    { 
      icon: 'bi-file-earmark-bar-graph', 
      label: 'Reports', 
      sublabel: 'Generate report', 
      color: 'var(--accent-purple)', 
      link: 'reports' 
    },
    { 
      icon: 'bi-shield-check', 
      label: 'Compliance', 
      sublabel: 'Review filings', 
      color: '#00695c', 
      link: 'compliance' 
    }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     MINI BARS (Transaction Trends)
  ──────────────────────────────────────────────────────────────────────── */
  miniBars: MiniBar[] = [
    { height: '55%', title: 'Mon: KES 1.2M', label: 'Mon', isToday: false },
    { height: '72%', title: 'Tue: KES 1.5M', label: 'Tue', isToday: false },
    { height: '65%', title: 'Wed: KES 1.35M', label: 'Wed', isToday: false },
    { height: '80%', title: 'Thu: KES 1.6M', label: 'Thu', isToday: false },
    { height: '70%', title: 'Fri: KES 1.45M', label: 'Fri', isToday: false },
    { height: '50%', title: 'Sat: KES 1.1M', label: 'Sat', isToday: false },
    { height: '90%', title: 'Today: KES 1.52M', label: 'Today', isToday: true }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     DONUT SEGMENTS
  ──────────────────────────────────────────────────────────────────────── */
  donutSegments: DonutSegment[] = [
    { color: 'var(--primary-green)', label: 'Regular Savings', percent: '43%' },
    { color: '#00838f', label: 'Fixed Deposits', percent: '27%' },
    { color: '#1a237e', label: 'Share Capital', percent: '18%' },
    { color: '#c62828', label: 'Emergency Fund', percent: '6%' },
    { color: '#e65100', label: 'Holiday', percent: '4%' },
    { color: '#6a1b9a', label: 'Junior', percent: '2%' }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     TRANSACTIONS
  ──────────────────────────────────────────────────────────────────────── */
  transactions: Transaction[] = [
    {
      ref: 'TRX-08745',
      memberName: 'David Kipkorir',
      memberId: 'SP-10145',
      memberInitials: 'DK',
      memberColor: 'c5',
      type: 'Loan Repayment',
      typeColor: 'var(--accent-blue)',
      amount: 'KES 15,000',
      channel: 'M-Pesa',
      channelIcon: 'bi-phone',
      channelColor: '#388e3c',
      status: 'success',
      time: '11:42 AM'
    },
    {
      ref: 'TRX-08744',
      memberName: 'Sarah Wanjiku',
      memberId: 'SP-10089',
      memberInitials: 'SW',
      memberColor: 'c1',
      type: 'Deposit',
      typeColor: 'var(--primary-green)',
      amount: 'KES 45,000',
      channel: 'Bank',
      channelIcon: 'bi-bank',
      channelColor: 'var(--accent-blue)',
      status: 'success',
      time: '11:15 AM'
    },
    {
      ref: 'TRX-08743',
      memberName: 'John Mwangi',
      memberId: 'SP-10067',
      memberInitials: 'JM',
      memberColor: 'c2',
      type: 'Loan Disbursement',
      typeColor: 'var(--accent-orange)',
      amount: 'KES 300,000',
      channel: 'M-Pesa',
      channelIcon: 'bi-phone',
      channelColor: '#388e3c',
      status: 'pending',
      time: '10:50 AM'
    },
    {
      ref: 'TRX-08742',
      memberName: 'Mary Akinyi',
      memberId: 'SP-10023',
      memberInitials: 'MA',
      memberColor: 'c3',
      type: 'Share Purchase',
      typeColor: '#1a237e',
      amount: 'KES 25,000',
      channel: 'Transfer',
      channelIcon: 'bi-arrow-left-right',
      channelColor: 'var(--primary-green)',
      status: 'success',
      time: '10:30 AM'
    },
    {
      ref: 'TRX-08741',
      memberName: 'Peter Ochieng',
      memberId: 'SP-10078',
      memberInitials: 'PO',
      memberColor: 'c4',
      type: 'Withdrawal',
      typeColor: 'var(--status-danger)',
      amount: 'KES 80,000',
      channel: 'M-Pesa',
      channelIcon: 'bi-phone',
      channelColor: '#388e3c',
      status: 'failed',
      time: '09:45 AM'
    }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     PENDING APPROVALS
  ──────────────────────────────────────────────────────────────────────── */
  loanApplications: ApprovalItem[] = [
    { 
      title: 'Bernard Kiprop — KES 750,000', 
      subtitle: 'Business Loan • Submitted 2hrs ago', 
      action: 'Review', 
      actionLink: 'loan-disbursements' 
    },
    { 
      title: 'Grace Akinyi — KES 300,000', 
      subtitle: 'Personal Loan • Awaiting guarantor', 
      action: 'Review', 
      actionLink: 'loan-disbursements' 
    }
  ];

  kycVerifications: ApprovalItem[] = [
    { 
      title: 'Alice Muthoni', 
      subtitle: 'New registration • Documents uploaded', 
      action: 'Verify', 
      actionLink: 'kyc' 
    }
  ];

  otpApprovals: ApprovalItem[] = [
    { 
      title: 'Peter Omondi — KES 80,000', 
      subtitle: 'Withdrawal OTP • Expires in 4 min', 
      action: 'Process', 
      actionLink: 'notifications' 
    }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     TIMELINE
  ──────────────────────────────────────────────────────────────────────── */
  timelineItems: TimelineItem[] = [
    {
      time: '2 min ago',
      title: 'Payment Received',
      description: 'KES 15,000 from David Kipkorir for loan LN-00845',
      meta: 'via M-Pesa • Receipt RPY-04521',
      type: 'success'
    },
    {
      time: '15 min ago',
      title: 'New Member Registered',
      description: 'Alice Muthoni applied via online portal',
      meta: 'KYC documents uploaded • Awaiting your approval',
      type: 'info'
    },
    {
      time: '1 hour ago',
      title: 'OTP Pending',
      description: 'Peter Omondi requested withdrawal of KES 80,000',
      meta: 'Awaiting your OTP approval',
      type: 'warning'
    },
    {
      time: '3 hours ago',
      title: 'AML Alert',
      description: 'Suspicious structuring pattern detected for Bernard Kiprop',
      meta: '4 deposits totaling KES 980K',
      type: 'danger'
    },
    {
      time: 'Yesterday, 4:50 PM',
      title: 'Loan Approved',
      description: "Mary Wanjiku's personal loan of KES 250,000 disbursed",
      meta: 'Approved by James Kariuki • Sent via M-Pesa',
      type: 'success'
    },
    {
      time: 'Yesterday, 2:00 AM',
      title: 'Daily Backup Complete',
      description: 'All systems backed up successfully (256 MB)',
      meta: 'Next backup: Tomorrow 2:00 AM',
      type: 'info'
    }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     QUICK ACTIONS MODAL ITEMS
  ──────────────────────────────────────────────────────────────────────── */
  quickActionModalItems: QuickActionModalItem[] = [
    { 
      icon: 'bi-plus-circle', 
      label: 'New Loan Application', 
      color: 'var(--primary-green)', 
      link: 'loan-disbursements' 
    },
    { 
      icon: 'bi-box-arrow-in-down', 
      label: 'Process Deposit', 
      color: 'var(--accent-blue)', 
      link: 'savings' 
    },
    { 
      icon: 'bi-box-arrow-up', 
      label: 'Process Withdrawal', 
      color: 'var(--status-danger)', 
      link: 'savings' 
    },
    { 
      icon: 'bi-person-plus', 
      label: 'Register Member', 
      color: 'var(--accent-orange)', 
      link: 'members' 
    },
    { 
      icon: 'bi-cash-coin', 
      label: 'Record Repayment', 
      color: 'var(--primary-green)', 
      link: 'loan-repayments' 
    },
    { 
      icon: 'bi-file-earmark-bar-graph', 
      label: 'Generate Report', 
      color: 'var(--accent-purple)', 
      link: 'reports' 
    },
    { 
      icon: 'bi-shield-lock', 
      label: 'Process OTP Approvals', 
      color: 'var(--accent-teal)', 
      link: 'notifications' 
    }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     HELP MODAL ITEMS
  ──────────────────────────────────────────────────────────────────────── */
  helpModalItems: HelpModalItem[] = [
    { icon: 'bi-book', label: 'Knowledge Base', color: 'var(--primary-green)' },
    { icon: 'bi-headset', label: 'Contact Support', color: 'var(--accent-blue)' },
    { icon: 'bi-play-circle', label: 'Video Tutorials', color: 'var(--accent-purple)' },
    { icon: 'bi-activity', label: 'System Status', color: 'var(--accent-orange)' }
  ];

  /* ────────────────────────────────────────────────────────────────────────
     CONSTRUCTOR & LIFECYCLE HOOKS
  ──────────────────────────────────────────────────────────────────────── */
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize dashboard data
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    // Clean up timers
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    // Restore body scroll
    document.body.style.overflow = '';
  }

  /* ════════════════════════════════════════════════════════════════════════
     DATA LOADING
  ════════════════════════════════════════════════════════════════════════ */

  loadDashboardData(): void {
    // This method can be used to fetch data from backend services
    // For now, we're using static data defined above
    console.log('Dashboard initialized with data');
  }

  refreshData(): void {
    this.showToast('Refreshing dashboard data...', 'info');
    // Simulate data refresh
    setTimeout(() => {
      this.loadDashboardData();
      this.showToast('Dashboard data refreshed!', 'success');
    }, 1000);
  }

  /* ════════════════════════════════════════════════════════════════════════
     MODAL MANAGEMENT
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Open a modal by name
   * @param name - Modal name (e.g., 'quickActions', 'txDetail', etc.)
   */
  openModal(name: string): void {
    const modalProperty = 'show' + name.charAt(0).toUpperCase() + name.slice(1) + 'Modal';
    (this as any)[modalProperty] = true;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close a modal by name
   * @param name - Modal name (e.g., 'quickActions', 'txDetail', etc.)
   */
  closeModal(name: string): void {
    const modalProperty = 'show' + name.charAt(0).toUpperCase() + name.slice(1) + 'Modal';
    (this as any)[modalProperty] = false;
    
    // Only restore scroll if no other modals are open
    const anyOpen = [
      this.showQuickActionsModal, 
      this.showTxDetailModal, 
      this.showFilterModal,
      this.showExportModal, 
      this.showHelpModal, 
      this.showProfileModal
    ].some(v => v);
    
    if (!anyOpen) {
      document.body.style.overflow = '';
    }
  }

  /**
   * Close all open modals
   */
  closeAllModals(): void {
    this.showQuickActionsModal = false;
    this.showTxDetailModal = false;
    this.showFilterModal = false;
    this.showExportModal = false;
    this.showHelpModal = false;
    this.showProfileModal = false;
    document.body.style.overflow = '';
  }

  /**
   * Open Quick Actions modal
   */
  openQuickActionsModal(): void {
    this.openModal('quickActions');
  }

  /**
   * Close Quick Actions modal
   */
  closeQuickActionsModal(): void {
    this.closeModal('quickActions');
  }

  /**
   * Open Filter modal
   */
  openFilterModal(): void {
    this.openModal('filter');
  }

  /**
   * Close Filter modal
   */
  closeFilterModal(): void {
    this.closeModal('filter');
  }

  /**
   * Open Export modal
   */
  openExportModal(): void {
    this.openModal('export');
  }

  /**
   * Close Export modal
   */
  closeExportModal(): void {
    this.closeModal('export');
  }

  /**
   * Open Help modal
   */
  openHelpModal(): void {
    this.openModal('help');
  }

  /**
   * Close Help modal
   */
  closeHelpModal(): void {
    this.closeModal('help');
  }

  /**
   * Open Profile modal
   */
  openProfileModal(): void {
    this.openModal('profile');
  }

  /**
   * Close Profile modal
   */
  closeProfileModal(): void {
    this.closeModal('profile');
  }

  /* ════════════════════════════════════════════════════════════════════════
     TRANSACTION DETAILS
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Open transaction detail modal with specific transaction
   * @param ref - Transaction reference number
   */
  openTxDetail(ref: string): void {
    this.selectedTxRef = ref;
    this.selectedTxCode = 'TRX-2024-' + ref.split('-')[1];
    this.openModal('txDetail');
  }

  /**
   * Close transaction detail modal
   */
  closeTxDetailModal(): void {
    this.closeModal('txDetail');
    this.selectedTxRef = '';
    this.selectedTxCode = '';
  }

  /**
   * Get full transaction details by reference
   * @param ref - Transaction reference
   */
  getTransactionDetails(ref: string): Transaction | undefined {
    return this.transactions.find(tx => tx.ref === ref);
  }

  /**
   * Print transaction receipt
   */
  printReceipt(): void {
    this.showToast('Preparing receipt for printing...', 'info');
    // Implement print functionality
    setTimeout(() => {
      window.print();
    }, 500);
  }

  /**
   * Download transaction receipt as PDF
   */
  downloadReceipt(): void {
    this.showToast('Downloading receipt...', 'success');
    // Implement PDF download functionality
  }

  /* ════════════════════════════════════════════════════════════════════════
     TOAST NOTIFICATIONS
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Show toast notification
   * @param message - Toast message
   * @param type - Toast type (success, info, warning, danger)
   */
  showToast(message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    
    // Clear existing timer
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    
    // Auto-hide after 3 seconds
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  /**
   * Hide toast notification
   */
  hideToast(): void {
    this.toastVisible = false;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  /* ════════════════════════════════════════════════════════════════════════
     FILTER FUNCTIONALITY
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Apply transaction filters
   */
  applyFilter(): void {
    this.closeModal('filter');
    this.showToast('Filter applied successfully!', 'success');
    
    // Implement actual filtering logic here
    console.log('Applying filters:', {
      dateRange: this.filterDateRange,
      type: this.filterType,
      channel: this.filterChannel,
      status: this.filterStatus
    });
    
    // You can filter the transactions array here
    // this.transactions = this.filterTransactions();
  }

  /**
   * Reset all filters to default
   */
  resetFilters(): void {
    this.filterDateRange = 'Today';
    this.filterType = 'All Types';
    this.filterChannel = 'All Channels';
    this.filterStatus = 'All';
    this.showToast('Filters reset', 'info');
  }

  /* ════════════════════════════════════════════════════════════════════════
     EXPORT FUNCTIONALITY
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Export transaction data
   */
  exportData(): void {
    this.closeModal('export');
    this.showToast('Exporting transactions...', 'info');
    
    setTimeout(() => {
      console.log('Exporting data:', {
        format: this.exportFormat,
        period: this.exportPeriod
      });
      
      // Implement actual export logic here
      if (this.exportFormat === 'CSV') {
        this.exportToCSV();
      } else if (this.exportFormat === 'PDF') {
        this.exportToPDF();
      } else if (this.exportFormat === 'Excel') {
        this.exportToExcel();
      }
      
      this.showToast(`Transactions exported as ${this.exportFormat}! Check downloads.`, 'success');
    }, 1000);
  }

  /**
   * Export transactions to CSV
   */
  private exportToCSV(): void {
    console.log('Exporting to CSV...');
    // Implement CSV export logic
  }

  /**
   * Export transactions to PDF
   */
  private exportToPDF(): void {
    console.log('Exporting to PDF...');
    // Implement PDF export logic
  }

  /**
   * Export transactions to Excel
   */
  private exportToExcel(): void {
    console.log('Exporting to Excel...');
    // Implement Excel export logic
  }

  /* ════════════════════════════════════════════════════════════════════════
     NAVIGATION
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Navigate to a specific route
   * @param route - Route path
   */
  navigateTo(route: string): void {
    this.closeAllModals();
    this.router.navigate(['/admin', route]);
  }

  /**
   * Navigate to quick action link
   * @param link - Route link
   */
  quickActionNavigate(link: string): void {
    this.navigateTo(link);
  }

  /* ════════════════════════════════════════════════════════════════════════
     AUTHENTICATION
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Confirm and logout user
   */
  confirmLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.closeProfileModal();
      this.showToast('Logging out...', 'info');
      
      setTimeout(() => {
        // Clear any stored session data
        localStorage.removeItem('token');
        sessionStorage.clear();
        
        // Navigate to login page
        this.router.navigate(['/login']);
      }, 1000);
    }
  }

  /**
   * Navigate to profile page
   */
  viewProfile(): void {
    this.closeProfileModal();
    this.navigateTo('profile');
  }

  /**
   * Navigate to settings page
   */
  viewSettings(): void {
    this.closeProfileModal();
    this.navigateTo('settings');
  }

  /* ════════════════════════════════════════════════════════════════════════
     HELP ACTIONS
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Handle help action clicks
   * @param label - Help action label
   */
  helpAction(label: string): void {
    this.closeHelpModal();
    
    switch (label) {
      case 'Knowledge Base':
        this.openKnowledgeBase();
        break;
      case 'Contact Support':
        this.contactSupport();
        break;
      case 'Video Tutorials':
        this.openVideoTutorials();
        break;
      case 'System Status':
        this.checkSystemStatus();
        break;
      default:
        this.showToast(label, 'info');
    }
  }

  /**
   * Open knowledge base
   */
  private openKnowledgeBase(): void {
    this.showToast('Opening Knowledge Base...', 'info');
    // Open knowledge base in new tab or navigate
    window.open('https://support.yoursacco.com/kb', '_blank');
  }

  /**
   * Contact support
   */
  private contactSupport(): void {
    this.showToast('Opening Support Chat...', 'info');
    // Open support chat or email
    // window.location.href = 'mailto:support@yoursacco.com';
  }

  /**
   * Open video tutorials
   */
  private openVideoTutorials(): void {
    this.showToast('Opening Video Tutorials...', 'info');
    window.open('https://support.yoursacco.com/videos', '_blank');
  }

  /**
   * Check system status
   */
  private checkSystemStatus(): void {
    this.showToast('All systems operational', 'success');
    this.navigateTo('system-status');
  }

  /* ════════════════════════════════════════════════════════════════════════
     BADGE UTILITIES
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Get badge CSS class based on status
   * @param status - Transaction status
   */
  getBadgeClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'success': 'badge-success',
      'pending': 'badge-pending',
      'failed': 'badge-danger',
      'processing': 'badge-warning'
    };
    return statusMap[status] || 'badge-info';
  }

  /**
   * Get badge label based on status
   * @param status - Transaction status
   */
  getBadgeLabel(status: string): string {
    const labelMap: { [key: string]: string } = {
      'success': 'Success',
      'pending': 'Processing',
      'failed': 'Failed',
      'processing': 'In Progress'
    };
    return labelMap[status] || 'Unknown';
  }

  /**
   * Get timeline item icon class
   * @param type - Timeline item type
   */
  getTimelineIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      'success': 'bi-check-circle-fill',
      'info': 'bi-info-circle-fill',
      'warning': 'bi-exclamation-triangle-fill',
      'danger': 'bi-x-circle-fill'
    };
    return iconMap[type] || 'bi-circle-fill';
  }

  /* ════════════════════════════════════════════════════════════════════════
     CHART UTILITIES
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Get donut chart conic gradient
   */
  getDonutGradient(): string {
    return 'conic-gradient(' +
      '#1a237e 0deg 65deg, ' +
      'var(--primary-green) 65deg 220deg, ' +
      '#00838f 220deg 280deg, ' +
      '#e65100 280deg 314deg, ' +
      '#6a1b9a 314deg 335deg, ' +
      '#c62828 335deg 360deg)';
  }

  /**
   * Calculate total for a metric category
   * @param category - Metric category
   */
  calculateMetricTotal(category: string): string {
    // Implement calculation logic based on category
    return 'KES 0';
  }

  /* ════════════════════════════════════════════════════════════════════════
     APPROVAL ACTIONS
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Handle approval item action
   * @param item - Approval item
   */
  handleApprovalAction(item: ApprovalItem): void {
    this.showToast(`Opening ${item.action} for ${item.title}`, 'info');
    this.navigateTo(item.actionLink);
  }

  /**
   * Get pending approvals count
   */
  getPendingApprovalsCount(): number {
    return this.loanApplications.length + 
           this.kycVerifications.length + 
           this.otpApprovals.length;
  }

  /* ════════════════════════════════════════════════════════════════════════
     UTILITY METHODS
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Format currency
   * @param amount - Amount to format
   */
  formatCurrency(amount: number): string {
    return `KES ${amount.toLocaleString()}`;
  }

  /**
   * Get current date formatted
   */
  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Get current time
   */
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}