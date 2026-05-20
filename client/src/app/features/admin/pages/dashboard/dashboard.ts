import { Component, OnInit, ViewEncapsulation, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ─── INTERFACES ─── */
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

/* ─── COMPONENT ─── */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  /* ─── MODAL STATES ─── */
  showQuickActionsModal = false;
  showTxDetailModal = false;
  showFilterModal = false;
  showExportModal = false;
  showHelpModal = false;
  showProfileModal = false;

  /* ─── TOAST STATE ─── */
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'info' | 'warning' | 'danger' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  /* ─── TX DETAIL DATA ─── */
  selectedTxRef = '';
  selectedTxCode = '';

  /* ─── FILTER STATE ─── */
  filterDateRange = 'Today';
  filterType = 'All Types';
  filterChannel = 'All Channels';
  filterStatus = 'All';

  /* ─── EXPORT STATE ─── */
  exportFormat = 'CSV';
  exportPeriod = 'Today';

  /* ─── COMPACT METRICS ─── */
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

  /* ─── QUICK ACTIONS ─── */
  quickActions: QuickAction[] = [
    { icon: 'bi-plus-circle', label: 'New Loan', sublabel: 'Create application', color: 'var(--primary-green)', link: 'loan-disbursements' },
    { icon: 'bi-box-arrow-in-down', label: 'Deposit', sublabel: 'Process deposit', color: 'var(--accent-blue)', link: 'savings' },
    { icon: 'bi-box-arrow-up', label: 'Withdrawal', sublabel: 'Process withdrawal', color: 'var(--status-danger)', link: 'savings' },
    { icon: 'bi-person-plus', label: 'Add Member', sublabel: 'Register new', color: 'var(--accent-orange)', link: 'members' },
    { icon: 'bi-file-earmark-bar-graph', label: 'Reports', sublabel: 'Generate report', color: 'var(--accent-purple)', link: 'reports' },
    { icon: 'bi-shield-check', label: 'Compliance', sublabel: 'Review filings', color: '#00695c', link: 'compliance' }
  ];

  /* ─── MINI BARS ─── */
  miniBars: MiniBar[] = [
    { height: '55%', title: 'Mon: KES 1.2M', label: 'Mon', isToday: false },
    { height: '72%', title: 'Tue: KES 1.5M', label: 'Tue', isToday: false },
    { height: '65%', title: 'Wed: KES 1.35M', label: 'Wed', isToday: false },
    { height: '80%', title: 'Thu: KES 1.6M', label: 'Thu', isToday: false },
    { height: '70%', title: 'Fri: KES 1.45M', label: 'Fri', isToday: false },
    { height: '50%', title: 'Sat: KES 1.1M', label: 'Sat', isToday: false },
    { height: '90%', title: 'Today: KES 1.52M', label: 'Today', isToday: true }
  ];

  /* ─── DONUT SEGMENTS ─── */
  donutSegments: DonutSegment[] = [
    { color: 'var(--primary-green)', label: 'Regular Savings', percent: '43%' },
    { color: '#00838f', label: 'Fixed Deposits', percent: '27%' },
    { color: '#1a237e', label: 'Share Capital', percent: '18%' },
    { color: '#c62828', label: 'Emergency Fund', percent: '6%' },
    { color: '#e65100', label: 'Holiday', percent: '4%' },
    { color: '#6a1b9a', label: 'Junior', percent: '2%' }
  ];

  /* ─── TRANSACTIONS ─── */
  transactions: Transaction[] = [
    {
      ref: 'TRX-08745', memberName: 'David Kipkorir', memberId: 'SP-10145',
      memberInitials: 'DK', memberColor: 'c5', type: 'Loan Repayment',
      typeColor: 'var(--accent-blue)', amount: 'KES 15,000', channel: 'M-Pesa',
      channelIcon: 'bi-phone', channelColor: '#388e3c', status: 'success', time: '11:42 AM'
    },
    {
      ref: 'TRX-08744', memberName: 'Sarah Wanjiku', memberId: 'SP-10089',
      memberInitials: 'SW', memberColor: 'c1', type: 'Deposit',
      typeColor: 'var(--primary-green)', amount: 'KES 45,000', channel: 'Bank',
      channelIcon: 'bi-bank', channelColor: 'var(--accent-blue)', status: 'success', time: '11:15 AM'
    },
    {
      ref: 'TRX-08743', memberName: 'John Mwangi', memberId: 'SP-10067',
      memberInitials: 'JM', memberColor: 'c2', type: 'Loan Disbursement',
      typeColor: 'var(--accent-orange)', amount: 'KES 300,000', channel: 'M-Pesa',
      channelIcon: 'bi-phone', channelColor: '#388e3c', status: 'pending', time: '10:50 AM'
    },
    {
      ref: 'TRX-08742', memberName: 'Mary Akinyi', memberId: 'SP-10023',
      memberInitials: 'MA', memberColor: 'c3', type: 'Share Purchase',
      typeColor: '#1a237e', amount: 'KES 25,000', channel: 'Transfer',
      channelIcon: 'bi-arrow-left-right', channelColor: 'var(--primary-green)', status: 'success', time: '10:30 AM'
    },
    {
      ref: 'TRX-08741', memberName: 'Peter Ochieng', memberId: 'SP-10078',
      memberInitials: 'PO', memberColor: 'c4', type: 'Withdrawal',
      typeColor: 'var(--status-danger)', amount: 'KES 80,000', channel: 'M-Pesa',
      channelIcon: 'bi-phone', channelColor: '#388e3c', status: 'failed', time: '09:45 AM'
    }
  ];

  /* ─── PENDING APPROVALS ─── */
  loanApplications: ApprovalItem[] = [
    { title: 'Bernard Kiprop — KES 750,000', subtitle: 'Business Loan • Submitted 2hrs ago', action: 'Review', actionLink: 'loan-disbursements' },
    { title: 'Grace Akinyi — KES 300,000', subtitle: 'Personal Loan • Awaiting guarantor', action: 'Review', actionLink: 'loan-disbursements' }
  ];

  kycVerifications: ApprovalItem[] = [
    { title: 'Alice Muthoni', subtitle: 'New registration • Documents uploaded', action: 'Verify', actionLink: 'kyc' }
  ];

  otpApprovals: ApprovalItem[] = [
    { title: 'Peter Omondi — KES 80,000', subtitle: 'Withdrawal OTP • Expires in 4 min', action: 'Process', actionLink: 'notifications' }
  ];

  /* ─── TIMELINE ─── */
  timelineItems: TimelineItem[] = [
    { time: '2 min ago', title: 'Payment Received', description: 'KES 15,000 from David Kipkorir for loan LN-00845', meta: 'via M-Pesa • Receipt RPY-04521', type: 'success' },
    { time: '15 min ago', title: 'New Member Registered', description: 'Alice Muthoni applied via online portal', meta: 'KYC documents uploaded • Awaiting your approval', type: 'info' },
    { time: '1 hour ago', title: 'OTP Pending', description: 'Peter Omondi requested withdrawal of KES 80,000', meta: 'Awaiting your OTP approval', type: 'warning' },
    { time: '3 hours ago', title: 'AML Alert', description: 'Suspicious structuring pattern detected for Bernard Kiprop', meta: '4 deposits totaling KES 980K', type: 'danger' },
    { time: 'Yesterday, 4:50 PM', title: 'Loan Approved', description: "Mary Wanjiku's personal loan of KES 250,000 disbursed", meta: 'Approved by James Kariuki • Sent via M-Pesa', type: 'success' },
    { time: 'Yesterday, 2:00 AM', title: 'Daily Backup Complete', description: 'All systems backed up successfully (256 MB)', meta: 'Next backup: Tomorrow 2:00 AM', type: 'info' }
  ];

  constructor() {}

  ngOnInit(): void {}

  /* ─── EXPLICIT MODAL METHODS (SSR-safe, no dynamic access) ─── */
  openQuickActionsModal(): void {
    this.showQuickActionsModal = true;
    this.lockScroll();
  }

  closeQuickActionsModal(): void {
    this.showQuickActionsModal = false;
    this.unlockScroll();
  }

  openTxDetailModal(): void {
    this.showTxDetailModal = true;
    this.lockScroll();
  }

  closeTxDetailModal(): void {
    this.showTxDetailModal = false;
    this.unlockScroll();
  }

  openFilterModal(): void {
    this.showFilterModal = true;
    this.lockScroll();
  }

  closeFilterModal(): void {
    this.showFilterModal = false;
    this.unlockScroll();
  }

  openExportModal(): void {
    this.showExportModal = true;
    this.lockScroll();
  }

  closeExportModal(): void {
    this.showExportModal = false;
    this.unlockScroll();
  }

  openHelpModal(): void {
    this.showHelpModal = true;
    this.lockScroll();
  }

  closeHelpModal(): void {
    this.showHelpModal = false;
    this.unlockScroll();
  }

  openProfileModal(): void {
    this.showProfileModal = true;
    this.lockScroll();
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.unlockScroll();
  }

  /* ─── GENERIC MODAL HELPERS (for template use) ─── */
  openModal(name: 'quickActions' | 'filter' | 'export' | 'help' | 'profile'): void {
    switch (name) {
      case 'quickActions': this.openQuickActionsModal(); break;
      case 'filter': this.openFilterModal(); break;
      case 'export': this.openExportModal(); break;
      case 'help': this.openHelpModal(); break;
      case 'profile': this.openProfileModal(); break;
    }
  }

  closeModal(name: 'quickActions' | 'txDetail' | 'filter' | 'export' | 'help' | 'profile'): void {
    switch (name) {
      case 'quickActions': this.closeQuickActionsModal(); break;
      case 'txDetail': this.closeTxDetailModal(); break;
      case 'filter': this.closeFilterModal(); break;
      case 'export': this.closeExportModal(); break;
      case 'help': this.closeHelpModal(); break;
      case 'profile': this.closeProfileModal(); break;
    }
  }

  closeAllModals(): void {
    this.showQuickActionsModal = false;
    this.showTxDetailModal = false;
    this.showFilterModal = false;
    this.showExportModal = false;
    this.showHelpModal = false;
    this.showProfileModal = false;
    this.unlockScroll();
  }

  /* ─── SCROLL LOCK (SSR-safe using afterNextRender) ─── */
  private lockScroll(): void {
    afterNextRender(() => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
      }
    });
  }

  private unlockScroll(): void {
    afterNextRender(() => {
      if (typeof document !== 'undefined' && !this.anyModalOpen()) {
        document.body.style.overflow = '';
      }
    });
  }

  private anyModalOpen(): boolean {
    return this.showQuickActionsModal || this.showTxDetailModal ||
           this.showFilterModal || this.showExportModal ||
           this.showHelpModal || this.showProfileModal;
  }

  /* ─── TX DETAIL ─── */
  openTxDetail(ref: string): void {
    this.selectedTxRef = ref;
    this.selectedTxCode = 'TRX-2024-' + ref.split('-')[1];
    this.openTxDetailModal();
  }

  /* ─── TOAST ─── */
  showToast(message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  hideToast(): void {
    this.toastVisible = false;
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  /* ─── FILTER ─── */
  applyFilter(): void {
    this.closeFilterModal();
    this.showToast('Filter applied successfully!');
  }

  /* ─── EXPORT ─── */
  exportData(): void {
    this.closeExportModal();
    this.showToast('Transactions exported! Check downloads.');
  }

  /* ─── LOGOUT ─── */
  confirmLogout(): void {
    if (typeof window !== 'undefined' && confirm('Are you sure you want to logout?')) {
      this.showToast('Logging out...');
      setTimeout(() => {
        // Navigate to login
      }, 1000);
    }
  }

  /* ─── HELP ACTIONS ─── */
  helpAction(label: string): void {
    this.showToast(label);
  }

  /* ─── GET BADGE CLASS ─── */
  getBadgeClass(status: string): string {
    switch (status) {
      case 'success': return 'badge-success';
      case 'pending': return 'badge-pending';
      case 'failed': return 'badge-danger';
      default: return 'badge-info';
    }
  }

  getBadgeLabel(status: string): string {
    switch (status) {
      case 'success': return 'Success';
      case 'pending': return 'Processing';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  }

  /* ─── DONUT CONIC GRADIENT ─── */
  getDonutGradient(): string {
    return 'conic-gradient(#1a237e 0deg 65deg, var(--primary-green) 65deg 220deg, #00838f 220deg 280deg, #e65100 280deg 314deg, #6a1b9a 314deg 335deg, #c62828 335deg 360deg)';
  }
}