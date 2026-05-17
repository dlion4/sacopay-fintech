import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ─── Interfaces ───
interface Transaction {
  date: string;
  type: 'Deposit' | 'Debit' | 'Transfer' | 'Withdrawal';
  typeColor: string;
  description: string;
  amount: string;
  amountColor: string;
  status: 'Completed' | 'Pending';
  statusColor: string;
}

interface Loan {
  name: string;
  repaid: number;
  total: number;
  percent: number;
  color: string;
  dueDate: string;
}

interface ChartBar {
  month: string;
  height: string;
  amount: string;
  isActive: boolean;
  isUpcoming: boolean;
}

interface Announcement {
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  date: string;
}

interface NotificationItem {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  time: string;
  unread: boolean;
}

interface Toast {
  id: number;
  type: 'success' | 'danger' | 'warning' | 'info' | 'primary';
  message: string;
}

// ─── Component ───
@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class MemberDashboardComponent implements OnInit {

  // ─── User Data ───
  userName = 'James Kamau';
  userEmail = 'john.doe@email.com';
  memberNumber = 'SCO-2024-00142';
  memberSince = 'Jan 15, 2020';
  accountStatus = 'Active';
  loanLimit = 'KES 500,000';
  guarantorsAvailable = 3;
  nextContribution = 'Dec 1, 2024';

  // ─── Stats ───
  stats = [
    {
      label: 'Total Savings',
      value: 'KES 245,000',
      change: '+12.5%',
      changePositive: true,
      icon: 'bi-wallet-fill',
      variant: 'primary',
      link: 'contributions'
    },
    {
      label: 'Share Capital',
      value: 'KES 50,000',
      change: '+8.2%',
      changePositive: true,
      icon: 'bi-graph-up-arrow',
      variant: 'success',
      link: 'dividends'
    },
    {
      label: 'Loan Balance',
      value: 'KES 80,000',
      change: '-5.3%',
      changePositive: false,
      icon: 'bi-bank',
      variant: 'warning',
      link: 'loans'
    },
    {
      label: 'Dividends Earned',
      value: 'KES 12,300',
      change: '+18.7%',
      changePositive: true,
      icon: 'bi-currency-exchange',
      variant: 'info',
      link: 'dividends'
    }
  ];

  // ─── Quick Actions ───
  quickActions = [
    { icon: 'bi-plus-circle-fill', label: 'Contribute', modal: 'contribute' },
    { icon: 'bi-bank', label: 'Apply Loan', modal: 'loanApply' },
    { icon: 'bi-cash-stack', label: 'Withdraw', modal: 'withdraw' },
    { icon: 'bi-arrow-left-right', label: 'Transfer', modal: 'transfer' },
    { icon: 'bi-credit-card-fill', label: 'Repay Loan', modal: 'repayLoan' },
    { icon: 'bi-file-earmark-text', label: 'Statements', action: 'statements' },
    { icon: 'bi-headset', label: 'Support', action: 'support' },
    { icon: 'bi-person-gear', label: 'Profile', action: 'profile' }
  ];

  // ─── Transactions ───
  transactions: Transaction[] = [
    {
      date: 'Nov 28, 2024',
      type: 'Deposit',
      typeColor: 'success',
      description: 'Monthly Contribution',
      amount: '+KES 5,000',
      amountColor: 'success',
      status: 'Completed',
      statusColor: 'success'
    },
    {
      date: 'Nov 25, 2024',
      type: 'Debit',
      typeColor: 'danger',
      description: 'Loan Repayment',
      amount: '-KES 8,500',
      amountColor: 'danger',
      status: 'Completed',
      statusColor: 'success'
    },
    {
      date: 'Nov 20, 2024',
      type: 'Transfer',
      typeColor: 'info',
      description: 'To Savings Account',
      amount: 'KES 10,000',
      amountColor: 'info',
      status: 'Completed',
      statusColor: 'success'
    },
    {
      date: 'Nov 15, 2024',
      type: 'Withdrawal',
      typeColor: 'warning',
      description: 'Emergency Withdrawal',
      amount: '-KES 15,000',
      amountColor: 'warning',
      status: 'Pending',
      statusColor: 'warning'
    },
    {
      date: 'Nov 10, 2024',
      type: 'Deposit',
      typeColor: 'success',
      description: 'Share Capital Top-up',
      amount: '+KES 20,000',
      amountColor: 'success',
      status: 'Completed',
      statusColor: 'success'
    }
  ];

  // ─── Loans ───
  loans: Loan[] = [
    { name: 'Normal Loan', repaid: 60000, total: 100000, percent: 60, color: 'primary', dueDate: 'Mar 2025' },
    { name: 'Emergency Loan', repaid: 15000, total: 20000, percent: 75, color: 'success', dueDate: 'Jan 2025' }
  ];

  totalOutstanding = 'KES 45,000';
  nextInstallment = 'KES 8,500 on Dec 5, 2024';

  // ─── Chart Data ───
  chartBars: ChartBar[] = [
    { month: 'Jan', height: '40%', amount: 'KES 5,000', isActive: false, isUpcoming: false },
    { month: 'Feb', height: '50%', amount: 'KES 5,000', isActive: false, isUpcoming: false },
    { month: 'Mar', height: '45%', amount: 'KES 5,000', isActive: false, isUpcoming: false },
    { month: 'Apr', height: '60%', amount: 'KES 7,500', isActive: false, isUpcoming: false },
    { month: 'May', height: '55%', amount: 'KES 5,000', isActive: false, isUpcoming: false },
    { month: 'Jun', height: '70%', amount: 'KES 10,000', isActive: false, isUpcoming: false },
    { month: 'Jul', height: '50%', amount: 'KES 5,000', isActive: false, isUpcoming: false },
    { month: 'Aug', height: '65%', amount: 'KES 8,000', isActive: false, isUpcoming: false },
    { month: 'Sep', height: '50%', amount: 'KES 5,000', isActive: false, isUpcoming: false },
    { month: 'Oct', height: '75%', amount: 'KES 10,000', isActive: false, isUpcoming: false },
    { month: 'Nov', height: '80%', amount: 'KES 5,000', isActive: true, isUpcoming: false },
    { month: 'Dec', height: '30%', amount: 'Upcoming', isActive: false, isUpcoming: true }
  ];

  chartPeriod: 'Monthly' | 'Quarterly' | 'Yearly' = 'Monthly';

  // ─── Announcements ───
  announcements: Announcement[] = [
    {
      badge: 'New',
      badgeColor: 'danger',
      title: 'Annual General Meeting',
      description: 'The AGM has been scheduled for December 15, 2024. All members are required to attend.',
      date: 'Nov 28, 2024'
    },
    {
      title: 'Dividend Declaration',
      description: 'Year 2024 dividends will be credited to accounts by January 15, 2025.',
      date: 'Nov 20, 2024'
    },
    {
      title: 'New Loan Products',
      description: 'We have introduced Education and Asset Finance loan products with competitive rates.',
      date: 'Nov 10, 2024'
    }
  ];

  selectedAnnouncement: Announcement | null = null;

  // ─── Notifications ───
  notifications: NotificationItem[] = [
    {
      icon: 'bi-check-circle-fill',
      iconColor: 'success',
      iconBg: 'success-subtle',
      title: 'Contribution of <strong>KES 5,000</strong> received',
      time: '2 mins ago',
      unread: true
    },
    {
      icon: 'bi-clock-fill',
      iconColor: 'warning',
      iconBg: 'warning-subtle',
      title: 'Loan repayment due in <strong>3 days</strong>',
      time: '1 hour ago',
      unread: true
    },
    {
      icon: 'bi-megaphone-fill',
      iconColor: 'info',
      iconBg: 'info-subtle',
      title: 'Annual General Meeting scheduled for <strong>Dec 15</strong>',
      time: 'Yesterday',
      unread: true
    }
  ];

  // ─── Modal State ───
  activeModal: string | null = null;

  // ─── Form Models ───
  contributeForm = {
    type: '',
    amount: null as number | null,
    method: '',
    phone: ''
  };

  loanApplyForm = {
    type: '',
    amount: null as number | null,
    period: '',
    purpose: '',
    guarantor1: '',
    guarantor2: '',
    notes: '',
    terms: false
  };

  withdrawForm = {
    from: '',
    amount: null as number | null,
    to: '',
    reason: ''
  };

  transferForm = {
    from: '',
    to: '',
    amount: null as number | null,
    narration: ''
  };

  repayLoanForm = {
    loan: '',
    amount: null as number | null,
    method: ''
  };

  ticketForm = {
    subject: '',
    category: '',
    priority: 'Medium',
    description: '',
    attachment: null as File | null
  };

  // ─── Toast System ───
  toasts: Toast[] = [];
  private toastId = 0;

  // ─── Loan Calculator ───
  calcAmount: number | null = null;
  calcRate: number | null = null;
  calcTerm: number | null = null;
  calcMonthly = '';
  calcInterest = '';
  calcTotal = '';
  calcResultVisible = false;

  // ─── Lifecycle ───
  ngOnInit(): void {
    setTimeout(() => {
      this.showToast('primary', `Welcome back, ${this.userName}! Your dashboard is ready.`);
    }, 800);
  }

  // ─── Modal Methods ───
  openModal(modalId: string): void {
    this.activeModal = modalId;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  closeModalOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  // ─── Action Handlers ───
  handleContribute(): void {
    this.closeModal();
    this.showToast('success', 'Contribution submitted! M-Pesa STK push sent to your phone.');
    this.contributeForm = { type: '', amount: null, method: '', phone: '' };
  }

  handleLoanApply(): void {
    this.closeModal();
    this.showToast('success', 'Loan application submitted successfully! You will receive a response within 24 hours.');
    this.loanApplyForm = { type: '', amount: null, period: '', purpose: '', guarantor1: '', guarantor2: '', notes: '', terms: false };
  }

  handleWithdraw(): void {
    this.closeModal();
    this.showToast('success', 'Withdrawal request submitted! Processing will take up to 48 hours.');
    this.withdrawForm = { from: '', amount: null, to: '', reason: '' };
  }

  handleTransfer(): void {
    this.closeModal();
    this.showToast('success', 'Transfer completed successfully!');
    this.transferForm = { from: '', to: '', amount: null, narration: '' };
  }

  handleRepayLoan(): void {
    this.closeModal();
    this.showToast('success', 'Loan repayment processed successfully!');
    this.repayLoanForm = { loan: '', amount: null, method: '' };
  }

  handleNewTicket(): void {
    this.closeModal();
    this.showToast('success', 'Support ticket created! Ticket ID: #TK-2024-090. We will respond within 24 hours.');
    this.ticketForm = { subject: '', category: '', priority: 'Medium', description: '', attachment: null };
  }

  confirmAttendance(): void {
    this.closeModal();
    this.showToast('success', 'Attendance confirmed!');
  }

  handleLogout(): void {
    this.closeModal();
    this.showToast('info', 'Logging out...');
    // window.location.href = '../index.html';
  }

  // ─── Toast System ───
  showToast(type: Toast['type'], message: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, type, message });
    setTimeout(() => this.removeToast(id), 5000);
  }

  removeToast(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  getToastIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'bi-check-circle-fill',
      danger: 'bi-exclamation-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
      primary: 'bi-bell-fill'
    };
    return icons[type] || icons['info'];
  }

  getToastColor(type: string): string {
    const colors: Record<string, string> = {
      success: '#00C853',
      danger: '#E53935',
      warning: '#F9A825',
      info: '#0288D1',
      primary: '#1a73e8'
    };
    return colors[type] || colors['info'];
  }

  // ─── Navigation ───
  navigateTo(section: string): void {
    this.showToast('info', `Navigating to ${section}...`);
  }

  // ─── Chart Period Switch ───
  setChartPeriod(period: 'Monthly' | 'Quarterly' | 'Yearly'): void {
    this.chartPeriod = period;
    this.showToast('info', `Switched to ${period} view`);
  }

  // ─── Announcement ───
  openAnnouncement(announcement: Announcement): void {
    this.selectedAnnouncement = announcement;
    this.openModal('announcement');
  }

  // ─── Loan Calculator ───
  calculateLoan(): void {
    const amount = this.calcAmount;
    const rate = this.calcRate;
    const term = this.calcTerm;

    if (amount && rate && term) {
      const monthlyRate = rate / 100 / 12;
      const monthly = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
                      (Math.pow(1 + monthlyRate, term) - 1);
      const totalPayment = monthly * term;
      const totalInterest = totalPayment - amount;

      this.calcMonthly = 'KES ' + Math.round(monthly).toLocaleString();
      this.calcInterest = 'KES ' + Math.round(totalInterest).toLocaleString();
      this.calcTotal = 'KES ' + Math.round(totalPayment).toLocaleString();
      this.calcResultVisible = true;
      this.showToast('info', 'Loan calculation completed!');
    }
  }

  // ─── Export Handlers ───
  exportCSV(): void {
    this.showToast('success', 'CSV export started. File will download shortly.');
  }

  exportPDF(): void {
    this.showToast('success', 'PDF export started. File will download shortly.');
  }

  // ─── File Input ───
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.ticketForm.attachment = input.files[0];
    }
  }

  // ─── Keyboard ───
  // After
  onKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Escape') {
      this.closeModal();
    }
  }
}