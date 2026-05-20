/**
 * Loan Repayments Component - Angular v21
 * SACCOPay Admin - Neo-Green Glassmorphic Theme
 * Standalone component with all logic, interfaces & mock data
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ===== INTERFACES =====
interface Payment {
  id: string;
  receiptNo: string;
  memberName: string;
  memberId: string;
  memberInitials: string;
  memberPhone?: string;
  memberEmail?: string;
  loanRef: string;
  amount: string;
  principal: string;
  interest: string;
  penalty: string;
  method: string;
  methodClass: string;
  methodIcon: string;
  date: string;
  time: string;
  status: string;
  statusClass: string;
  statusIcon: string;
  transactionRef: string;
  installmentNo: number;
  totalInstallments: number;
  previousBalance: string;
  remainingBalance: string;
  repaymentProgress: number;
  processedBy: string;
}

interface PendingPayment {
  id: string;
  memberName: string;
  memberId: string;
  memberInitials: string;
  loanRef: string;
  amount: string;
  dueDate: string;
}

interface OverduePayment {
  id: string;
  memberName: string;
  memberId: string;
  memberInitials: string;
  loanRef: string;
  amountDue: string;
  dueDate: string;
  daysOverdue: number;
  lastContact: string;
}

interface UpcomingPayment {
  id: string;
  memberName: string;
  loanRef: string;
  amount: string;
  dueDay: string;
  dueMonth: string;
  installment: string;
}

interface CalendarDay {
  date: string;
  day: number;
  currentMonth: boolean;
  isToday: boolean;
  fullDate?: string;
  payments: CalendarPayment[];
}

interface CalendarPayment {
  id: string;
  memberName: string;
  loanRef: string;
  amount: string;
  statusClass: string;
  statusText: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

interface RecordForm {
  searchQuery: string;
  selectedLoan: any;
  amount: string;
  method: string;
  transactionRef: string;
  paymentDate: string;
  principal: string;
  interest: string;
  penalty: string;
  fees: string;
  notes: string;
}

interface ExportForm {
  startDate: string;
  endDate: string;
  status: string;
  format: string;
}

@Component({
  selector: 'app-loan-repayments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./loan-repayments.html',
  styleUrls: ['./loan-repayments.scss']
})
export class LoanRepaymentsComponent {

  // ===== TABS =====
  activeTab: 'all' | 'pending' | 'overdue' | 'schedule' = 'all';

  // ===== FILTERS =====
  searchQuery = '';
  filterStatus = 'all';
  filterMethod = 'all';
  filterPeriod = 'all';
  currentPage = 1;

  // ===== MODALS =====
  selectedPayment: Payment | null = null;
  showRecordPaymentModal = false;
  showSendReceiptModal = false;
  sendReceiptPayment: Payment | null = null;
  showSendReminderModal = false;
  reminderPayment: any = null;
  showReverseModal = false;
  reversePayment: Payment | null = null;
  showEscalateModal = false;
  escalatePayment: OverduePayment | null = null;
  showBulkUploadModal = false;
  showExportModal = false;
  showBulkReminderModal = false;
  showDayScheduleModal = false;
  selectedDay: CalendarDay | null = null;

  // ===== TOAST =====
  toasts: Toast[] = [];
  private toastId = 0;

  // ===== FORMS =====
  recordForm: RecordForm = {
    searchQuery: '',
    selectedLoan: {
      memberName: 'Sarah Auma',
      memberId: 'SP-10089',
      memberInitials: 'SA',
      loanRef: 'LN-2024-00867',
      loanAmount: 'KES 1,000,000',
      outstanding: 'KES 882,000',
      nextDue: 'Dec 21, 2024',
      installment: 'KES 42,000'
    },
    amount: '',
    method: 'mpesa',
    transactionRef: '',
    paymentDate: '',
    principal: '',
    interest: '',
    penalty: '0',
    fees: '0',
    notes: ''
  };

  sendOptions = { sms: true, email: true, whatsapp: false };

  reminderForm = { template: 'friendly', message: '', sms: true, email: true, whatsapp: false };

  reverseForm = { reason: '', notes: '', confirm: false };

  escalateForm = { type: '', assignee: '', notes: '' };

  exportForm: ExportForm = { startDate: '', endDate: '', status: 'all', format: 'xlsx' };

  bulkReminderForm = { template: 'friendly', sms: true, email: true };

  // ===== FILE UPLOAD =====
  isDragover = false;
  uploadedFile: any = null;
  uploadPreview: any[] = [
    { memberId: 'SP-10089', loanRef: 'LN-2024-00867', amount: 'KES 42,000', date: '2024-12-18', method: 'M-Pesa' },
    { memberId: 'SP-10023', loanRef: 'LN-2024-00891', amount: 'KES 25,000', date: '2024-12-18', method: 'Bank' },
    { memberId: 'SP-10045', loanRef: 'LN-2024-00890', amount: 'KES 50,000', date: '2024-12-18', method: 'M-Pesa' },
  ];

  // ===== CALENDAR =====
  currentMonth = 'December';
  currentYear = 2024;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarWeeks: CalendarDay[][] = this.generateCalendar();

  // ===== MOCK DATA =====
  allPayments: Payment[] = [
    {
      id: '1', receiptNo: 'RPY-2024-04521', memberName: 'Sarah Auma', memberId: 'SP-10089', memberInitials: 'SA',
      memberPhone: '+254 712 345 678', memberEmail: 'sarah.auma@email.com', loanRef: 'LN-2024-00867',
      amount: 'KES 42,000', principal: 'KES 35,000', interest: 'KES 7,000', penalty: 'KES 0',
      method: 'M-Pesa', methodClass: 'mpesa', methodIcon: 'bi-phone', date: 'Dec 18, 2024', time: '3:15 PM',
      status: 'Confirmed', statusClass: 'confirmed', statusIcon: 'bi-check-circle-fill',
      transactionRef: 'QJK8X2M1PL', installmentNo: 4, totalInstallments: 24,
      previousBalance: 'KES 882,000', remainingBalance: 'KES 840,000', repaymentProgress: 16, processedBy: 'System (Auto-matched)'
    },
    {
      id: '2', receiptNo: 'RPY-2024-04520', memberName: 'John Kamau', memberId: 'SP-10015', memberInitials: 'JK',
      memberPhone: '+254 722 456 789', memberEmail: 'john.kamau@email.com', loanRef: 'LN-2024-00845',
      amount: 'KES 15,000', principal: 'KES 12,500', interest: 'KES 2,500', penalty: 'KES 0',
      method: 'Bank Transfer', methodClass: 'bank', methodIcon: 'bi-bank', date: 'Dec 18, 2024', time: '2:30 PM',
      status: 'Confirmed', statusClass: 'confirmed', statusIcon: 'bi-check-circle-fill',
      transactionRef: 'BNK928374651', installmentNo: 7, totalInstallments: 12,
      previousBalance: 'KES 75,000', remainingBalance: 'KES 60,000', repaymentProgress: 58, processedBy: 'David Otieno'
    },
    {
      id: '3', receiptNo: 'RPY-2024-04519', memberName: 'Mary Wanjiku', memberId: 'SP-10023', memberInitials: 'MW',
      memberPhone: '+254 733 567 890', memberEmail: 'mary.w@email.com', loanRef: 'LN-2024-00891',
      amount: 'KES 25,000', principal: 'KES 20,000', interest: 'KES 5,000', penalty: 'KES 0',
      method: 'M-Pesa', methodClass: 'mpesa', methodIcon: 'bi-phone', date: 'Dec 18, 2024', time: '11:45 AM',
      status: 'Pending', statusClass: 'pending', statusIcon: 'bi-clock',
      transactionRef: 'MPK7Y3N2QR', installmentNo: 2, totalInstallments: 10,
      previousBalance: 'KES 225,000', remainingBalance: 'KES 200,000', repaymentProgress: 11, processedBy: 'Awaiting confirmation'
    },
    {
      id: '4', receiptNo: 'RPY-2024-04518', memberName: 'James Ochieng', memberId: 'SP-10045', memberInitials: 'JO',
      memberPhone: '+254 744 678 901', memberEmail: 'james.o@email.com', loanRef: 'LN-2024-00890',
      amount: 'KES 50,000', principal: 'KES 42,000', interest: 'KES 8,000', penalty: 'KES 0',
      method: 'Cash', methodClass: 'cash', methodIcon: 'bi-cash-stack', date: 'Dec 17, 2024', time: '4:20 PM',
      status: 'Confirmed', statusClass: 'confirmed', statusIcon: 'bi-check-circle-fill',
      transactionRef: 'CSH-001245', installmentNo: 1, totalInstallments: 12,
      previousBalance: 'KES 500,000', remainingBalance: 'KES 450,000', repaymentProgress: 10, processedBy: 'Jane Mwende'
    },
    {
      id: '5', receiptNo: 'RPY-2024-04517', memberName: 'Grace Akinyi', memberId: 'SP-10067', memberInitials: 'GA',
      memberPhone: '+254 755 789 012', memberEmail: 'grace.a@email.com', loanRef: 'LN-2024-00889',
      amount: 'KES 30,000', principal: 'KES 25,000', interest: 'KES 5,000', penalty: 'KES 0',
      method: 'Cheque', methodClass: 'cheque', methodIcon: 'bi-credit-card', date: 'Dec 17, 2024', time: '10:00 AM',
      status: 'Failed', statusClass: 'failed', statusIcon: 'bi-x-circle-fill',
      transactionRef: 'CHQ-894521', installmentNo: 3, totalInstallments: 12,
      previousBalance: 'KES 270,000', remainingBalance: 'KES 270,000', repaymentProgress: 10, processedBy: 'Bounced cheque'
    },
    {
      id: '6', receiptNo: 'RPY-2024-04516', memberName: 'Peter Omondi', memberId: 'SP-10091', memberInitials: 'PO',
      memberPhone: '+254 766 890 123', memberEmail: 'peter.o@email.com', loanRef: 'LN-2024-00888',
      amount: 'KES 18,750', principal: 'KES 15,000', interest: 'KES 3,750', penalty: 'KES 0',
      method: 'M-Pesa', methodClass: 'mpesa', methodIcon: 'bi-phone', date: 'Dec 16, 2024', time: '2:15 PM',
      status: 'Confirmed', statusClass: 'confirmed', statusIcon: 'bi-check-circle-fill',
      transactionRef: 'QMN5K8P3LW', installmentNo: 5, totalInstallments: 8,
      previousBalance: 'KES 56,250', remainingBalance: 'KES 37,500', repaymentProgress: 62, processedBy: 'System (Auto-matched)'
    },
    {
      id: '7', receiptNo: 'RPY-2024-04515', memberName: 'Ruth Njeri', memberId: 'SP-10112', memberInitials: 'RN',
      memberPhone: '+254 777 901 234', memberEmail: 'ruth.n@email.com', loanRef: 'LN-2024-00887',
      amount: 'KES 10,000', principal: 'KES 8,000', interest: 'KES 2,000', penalty: 'KES 0',
      method: 'Bank Transfer', methodClass: 'bank', methodIcon: 'bi-bank', date: 'Dec 16, 2024', time: '9:30 AM',
      status: 'Reversed', statusClass: 'reversed', statusIcon: 'bi-arrow-counterclockwise',
      transactionRef: 'BNK756483921', installmentNo: 4, totalInstallments: 5,
      previousBalance: 'KES 20,000', remainingBalance: 'KES 20,000', repaymentProgress: 60, processedBy: 'Reversed: Duplicate payment'
    },
  ];

  pendingPayments: PendingPayment[] = [
    { id: '1', memberName: 'Faith Wairimu', memberId: 'SP-10201', memberInitials: 'FW', loanRef: 'LN-2024-00896', amount: 'KES 55,000', dueDate: 'Dec 23, 2024' },
    { id: '2', memberName: 'Michael Odera', memberId: 'SP-10124', memberInitials: 'MO', loanRef: 'LN-2024-00878', amount: 'KES 28,500', dueDate: 'Dec 22, 2024' },
    { id: '3', memberName: 'Hannah Wambui', memberId: 'SP-10156', memberInitials: 'HW', loanRef: 'LN-2024-00885', amount: 'KES 75,000', dueDate: 'Dec 24, 2024' },
    { id: '4', memberName: 'Daniel Mutua', memberId: 'SP-10134', memberInitials: 'DM', loanRef: 'LN-2024-00886', amount: 'KES 20,000', dueDate: 'Dec 25, 2024' },
  ];

  overduePayments: OverduePayment[] = [
    { id: '1', memberName: 'Alice Muthoni', memberId: 'SP-10042', memberInitials: 'AM', loanRef: 'LN-2024-00820', amountDue: 'KES 25,000', dueDate: 'Dec 3, 2024', daysOverdue: 15, lastContact: 'Dec 10, 2024' },
    { id: '2', memberName: 'Bernard Kiprop', memberId: 'SP-10078', memberInitials: 'BK', loanRef: 'LN-2024-00798', amountDue: 'KES 350,000', dueDate: 'Nov 26, 2024', daysOverdue: 22, lastContact: 'Dec 5, 2024' },
    { id: '3', memberName: 'Catherine Njeri', memberId: 'SP-10156', memberInitials: 'CN', loanRef: 'LN-2024-00775', amountDue: 'KES 180,000', dueDate: 'Nov 18, 2024', daysOverdue: 30, lastContact: 'Dec 1, 2024' },
    { id: '4', memberName: 'Evans Wafula', memberId: 'SP-10203', memberInitials: 'EW', loanRef: 'LN-2024-00810', amountDue: 'KES 95,000', dueDate: 'Dec 10, 2024', daysOverdue: 8, lastContact: 'Dec 15, 2024' },
  ];

  upcomingThisWeek: UpcomingPayment[] = [
    { id: '1', memberName: 'John Kamau', loanRef: 'LN-2024-00845', amount: 'KES 15,000', dueDay: '20', dueMonth: 'Dec', installment: '8/12' },
    { id: '2', memberName: 'Sarah Auma', loanRef: 'LN-2024-00867', amount: 'KES 42,000', dueDay: '21', dueMonth: 'Dec', installment: '5/24' },
    { id: '3', memberName: 'Michael Odera', loanRef: 'LN-2024-00878', amount: 'KES 28,500', dueDay: '22', dueMonth: 'Dec', installment: '11/18' },
    { id: '4', memberName: 'Faith Wairimu', loanRef: 'LN-2024-00896', amount: 'KES 55,000', dueDay: '23', dueMonth: 'Dec', installment: '6/12' },
  ];

  // ===== COMPUTED =====
  get filteredPayments(): Payment[] {
    return this.allPayments.filter(p => {
      const matchSearch = !this.searchQuery ||
        p.memberName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.receiptNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.loanRef.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatus = this.filterStatus === 'all' || p.status.toLowerCase() === this.filterStatus;
      const matchMethod = this.filterMethod === 'all' || p.methodClass === this.filterMethod;
      return matchSearch && matchStatus && matchMethod;
    });
  }

  // ===== METHODS =====
  showToast(message: string, type: Toast['type'] = 'success'): void {
    const id = ++this.toastId;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.toasts = this.toasts.filter(t => t.id !== id), 4000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  refreshData(): void {
    this.showToast('Data refreshed successfully', 'success');
  }

  openPaymentDetail(payment: Payment): void {
    this.selectedPayment = payment;
  }

  printReceipt(payment: Payment): void {
    this.showToast('Printing receipt ' + payment.receiptNo, 'info');
  }

  openSendReceiptModal(payment: Payment): void {
    this.sendReceiptPayment = payment;
    this.showSendReceiptModal = true;
  }

  openReverseModal(payment: Payment): void {
    this.reversePayment = payment;
    this.reverseForm = { reason: '', notes: '', confirm: false };
    this.showReverseModal = true;
    this.selectedPayment = null;
  }

  openSendReminderModal(payment: any): void {
    this.reminderPayment = payment;
    this.reminderForm = { template: 'friendly', message: '', sms: true, email: true, whatsapp: false };
    this.showSendReminderModal = true;
  }

  openRecordPaymentModal(payment: any): void {
    this.recordForm.selectedLoan = {
      memberName: payment.memberName,
      memberId: payment.memberId,
      memberInitials: payment.memberInitials,
      loanRef: payment.loanRef,
      loanAmount: payment.amount || 'KES 500,000',
      outstanding: payment.amount || 'KES 350,000',
      nextDue: payment.dueDate || 'Dec 21, 2024',
      installment: payment.amount || 'KES 35,000'
    };
    this.showRecordPaymentModal = true;
  }

  openEscalateModal(payment: OverduePayment): void {
    this.escalatePayment = payment;
    this.escalateForm = { type: '', assignee: '', notes: '' };
    this.showEscalateModal = true;
  }

  openDaySchedule(day: CalendarDay): void {
    this.selectedDay = day;
    this.showDayScheduleModal = true;
  }

  submitRecordPayment(): void {
    if (!this.recordForm.amount) {
      this.showToast('Please enter the payment amount', 'warning');
      return;
    }
    this.showToast('Payment of ' + this.recordForm.amount + ' recorded successfully', 'success');
    this.showRecordPaymentModal = false;
    this.recordForm.amount = '';
    this.recordForm.transactionRef = '';
    this.recordForm.notes = '';
  }

  submitSendReceipt(): void {
    const channels = [];
    if (this.sendOptions.sms) channels.push('SMS');
    if (this.sendOptions.email) channels.push('Email');
    if (this.sendOptions.whatsapp) channels.push('WhatsApp');
    this.showToast('Receipt sent via ' + channels.join(', '), 'success');
    this.showSendReceiptModal = false;
  }

  submitSendReminder(): void {
    this.showToast('Payment reminder sent to ' + this.reminderPayment?.memberName, 'success');
    this.showSendReminderModal = false;
  }

  submitReversePayment(): void {
    this.showToast('Payment ' + this.reversePayment?.receiptNo + ' has been reversed', 'warning');
    this.showReverseModal = false;
  }

  submitEscalate(): void {
    this.showToast('Loan escalated to ' + this.escalateForm.type + ' for ' + this.escalatePayment?.memberName, 'warning');
    this.showEscalateModal = false;
  }

  submitBulkUpload(): void {
    this.showToast('Processing ' + this.uploadPreview.length + ' payments...', 'info');
    setTimeout(() => {
      this.showToast('Bulk upload completed successfully', 'success');
      this.showBulkUploadModal = false;
      this.uploadedFile = null;
    }, 1500);
  }

  submitExport(): void {
    this.showToast('Exporting payments as ' + this.exportForm.format.toUpperCase(), 'info');
    this.showExportModal = false;
  }

  submitBulkReminder(): void {
    this.showToast('Bulk reminders sent to ' + this.overduePayments.length + ' members', 'success');
    this.showBulkReminderModal = false;
  }

  downloadTemplate(format: string): void {
    this.showToast('Downloading ' + format.toUpperCase() + ' template...', 'info');
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragover = true;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragover = false;
    if (e.dataTransfer?.files.length) {
      this.handleFile(e.dataTransfer.files[0]);
    }
  }

  onFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    this.uploadedFile = { name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' };
  }

  removeFile(): void {
    this.uploadedFile = null;
  }

  prevMonth(): void {
    if (this.currentMonth === 'December') {
      this.currentMonth = 'November';
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 'November') {
      this.currentMonth = 'December';
    }
  }

  generateCalendar(): CalendarDay[][] {
    const weeks: CalendarDay[][] = [];
    // December 2024 starts on Sunday
    const daysInMonth = 31;
    const startDay = 0; // Sunday

    let currentWeek: CalendarDay[] = [];

    // Previous month days
    for (let i = 0; i < startDay; i++) {
      currentWeek.push({
        date: '', day: 30 - startDay + i + 1, currentMonth: false, isToday: false, payments: []
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const payments: CalendarPayment[] = [];
      // Add mock payments
      if (day === 18) {
        payments.push({ id: '1', memberName: 'Sarah Auma', loanRef: 'LN-00867', amount: 'KES 42,000', statusClass: 'paid', statusText: 'Paid' });
        payments.push({ id: '2', memberName: 'John Kamau', loanRef: 'LN-00845', amount: 'KES 15,000', statusClass: 'paid', statusText: 'Paid' });
      }
      if (day === 20) {
        payments.push({ id: '3', memberName: 'John Kamau', loanRef: 'LN-00845', amount: 'KES 15,000', statusClass: 'upcoming', statusText: 'Due' });
      }
      if (day === 21) {
        payments.push({ id: '4', memberName: 'Sarah Auma', loanRef: 'LN-00867', amount: 'KES 42,000', statusClass: 'upcoming', statusText: 'Due' });
      }
      if (day === 3) {
        payments.push({ id: '5', memberName: 'Alice Muthoni', loanRef: 'LN-00820', amount: 'KES 25,000', statusClass: 'overdue', statusText: 'Overdue' });
      }

      currentWeek.push({
        date: `2024-12-${day.toString().padStart(2, '0')}`,
        day,
        currentMonth: true,
        isToday: day === 18,
        fullDate: `December ${day}, 2024`,
        payments
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill remaining days
    let nextDay = 1;
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({
        date: '', day: nextDay++, currentMonth: false, isToday: false, payments: []
      });
    }
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
    }

    return weeks;
  }
}
