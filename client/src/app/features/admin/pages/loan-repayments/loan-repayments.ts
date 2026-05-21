import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ToastType = 'success' | 'danger' | 'warning' | 'info';
type RepayStatus = 'Confirmed' | 'Pending' | 'Overdue' | 'Failed' | 'Reversed' | 'Advance';
type RepayChannel = 'M-Pesa' | 'Bank' | 'Wallet' | 'Cash' | 'Auto';
type TableTab = 'all' | 'confirmed' | 'pending' | 'overdue' | 'failed' | 'reversed';
type AgingTab = 'aging' | 'channel' | 'heatmap';

interface Toast { id: number; message: string; type: ToastType; }

interface RepaymentRow {
  receiptNo: string;
  member: string;
  memberId: string;
  memberInitials: string;
  avatarColor: string;
  loanRef: string;
  loanType: string;
  amount: number;
  channel: RepayChannel;
  installment: string;
  installmentPct: number;
  status: RepayStatus;
  date: string;
  time: string;
  transactionRef: string;
  principal: number;
  interest: number;
  penalty: number;
  remainingBalance: number;
  processedBy: string;
  notes?: string;
  selected: boolean;
}

interface DueTodayItem {
  member: string; loanRef: string; installment: string; amount: number; status: 'Paid' | 'Pending';
}

interface ActivityItem {
  time: string; channel: RepayChannel; amount: number; member: string;
  loanRef: string; installment: string; transactionRef: string;
}

interface AutoDeduction {
  member: string; loan: string; amount: number; channel: RepayChannel; status: 'Active' | 'Failed' | 'Paused'; enabled: boolean;
}

interface WaiverRequest {
  id: string; member: string; loanRef: string; amount: number; reason: string; submitted: string; status: 'Pending' | 'Approved' | 'Rejected';
}

interface ChannelStat { channel: RepayChannel; transactions: number; amount: number; percent: number; trend: number; }

interface ReminderRecipient { member: string; amountDue: number; daysOverdue: number | 'Today'; phone: string; selected: boolean; }

@Component({
  selector: 'app-loan-repayments',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './loan-repayments.html',
  styleUrls: ['./loan-repayments.scss'],
})
export class LoanRepaymentsComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private toastId = 0;
  private toastTimer?: number;

  // Tabs
  tableTab: TableTab = 'all';
  agingTab: AgingTab = 'aging';

  // Search & filters
  searchTerm = '';
  filterChannel = '';
  filterStatus = '';
  filterDate = '';
  currentPage = 1;
  pageSize = 6;
  allSelected = false;

  // Modals
  showRecordModal = false;
  showAutoDeductModal = false;
  showReportsModal = false;
  showReconcileModal = false;
  showBulkRemindersModal = false;
  showPenaltyModal = false;
  showWaiverRequestsModal = false;
  showGenerateReportModal = false;
  showFullAgingModal = false;
  showFullLogModal = false;
  showReceiptModal = false;
  showRetryModal = false;
  showReverseModal = false;
  showReportDetailModal = false;

  // Active items
  activeRow: RepaymentRow | null = null;
  activeReportType = '';

  // Record payment form
  recordForm = {
    loanRef: '', member: '', amount: '', date: '', method: 'M-Pesa',
    transactionRef: '', paymentType: 'Regular Installment', notes: '',
    outstanding: 93750, nextDue: 15000, penalties: 0, installmentLabel: '7/12',
  };

  // Auto deduct config
  autoDeductForm = {
    defaultChannel: 'M-Pesa (STK Push)', timing: 'On Due Date (12:00 PM)',
    retryPolicy: 'Retry after 4 hours', notification: '24 hours before',
  };

  autoDeductions: AutoDeduction[] = [
    { member: 'John Kamau', loan: 'LN-2024-00845', amount: 15000, channel: 'M-Pesa', status: 'Active', enabled: true },
    { member: 'Sarah Auma', loan: 'LN-2024-00867', amount: 42000, channel: 'Bank', status: 'Active', enabled: true },
    { member: 'Bernard Kiprop', loan: 'LN-2024-00798', amount: 45000, channel: 'M-Pesa', status: 'Failed', enabled: true },
    { member: 'Michael Odera', loan: 'LN-2024-00812', amount: 28500, channel: 'Bank', status: 'Active', enabled: true },
    { member: 'Daniel Kipchoge', loan: 'LN-2024-00835', amount: 32000, channel: 'Wallet', status: 'Active', enabled: false },
  ];

  // Reconcile form
  reconcileForm = { source: 'M-Pesa Statement', dateRange: 'Today', file: '' };
  reconcileResult = { total: 0, matched: 0, unmatched: 0, duplicates: 0 };

  // Bulk reminders
  reminderForm = { targetGroup: 'All Overdue (18)', template: 'Friendly Reminder', customMessage: '' };
  reminderRecipients: ReminderRecipient[] = [
    { member: 'Alice Muthoni', amountDue: 25000, daysOverdue: 16, phone: '0722-XXX-456', selected: true },
    { member: 'Bernard Kiprop', amountDue: 45000, daysOverdue: 23, phone: '0710-XXX-789', selected: true },
    { member: 'Catherine Njeri', amountDue: 18000, daysOverdue: 31, phone: '0733-XXX-012', selected: true },
    { member: 'Grace Nyokabi', amountDue: 35000, daysOverdue: 'Today', phone: '0720-XXX-345', selected: true },
    { member: 'Daniel Kipchoge', amountDue: 32000, daysOverdue: 8, phone: '0701-XXX-901', selected: true },
  ];

  // Penalty config
  penaltyForm = {
    type: 'Percentage of Overdue', rateAmount: '5% per month',
    gracePeriod: 3, maxCap: '25% of loan amount',
    autoApply: 'Yes — Auto-calculate daily', notification: 'Notify member on penalty',
    compound: true,
  };

  // Waiver requests
  waiverRequests: WaiverRequest[] = [
    { id: 'WR-2024-001', member: 'Alice Muthoni', loanRef: 'LN-2024-00820', amount: 5000, reason: 'Medical emergency — hospitalized for 2 weeks', submitted: 'Dec 12, 2024', status: 'Pending' },
    { id: 'WR-2024-002', member: 'Bernard Kiprop', loanRef: 'LN-2024-00798', amount: 12000, reason: 'Lost employment, seeking new income source', submitted: 'Dec 10, 2024', status: 'Pending' },
    { id: 'WR-2024-003', member: 'Catherine Njeri', loanRef: 'LN-2024-00775', amount: 8000, reason: 'Family bereavement, funeral expenses', submitted: 'Dec 8, 2024', status: 'Pending' },
  ];
  activeWaiver: WaiverRequest | null = null;
  waiverAction: 'approve' | 'reject' = 'approve';
  waiverNotes = '';

  // Generate Report form
  reportForm = { type: 'Collection Report', format: 'PDF', from: '', to: '' };

  // Reverse form
  reverseForm = { reason: '', notes: '', notifyMember: true };

  // Retry form
  retryForm = { channel: 'M-Pesa', amount: 0, notes: '' };

  // Today's due
  dueTodayItems: DueTodayItem[] = [
    { member: 'John Kamau', loanRef: 'LN-2024-00845', installment: '7/12', amount: 15000, status: 'Paid' },
    { member: 'Sarah Auma', loanRef: 'LN-2024-00867', installment: '4/24', amount: 42000, status: 'Paid' },
    { member: 'Michael Odera', loanRef: 'LN-2024-00812', installment: '10/18', amount: 28500, status: 'Paid' },
    { member: 'Faith Wairimu', loanRef: 'LN-2024-00891', installment: '5/12', amount: 55000, status: 'Pending' },
    { member: 'Peter Omondi', loanRef: 'LN-2024-00889', installment: '2/18', amount: 18500, status: 'Pending' },
    { member: 'Mary Njeri', loanRef: 'LN-2024-00876', installment: '6/12', amount: 22500, status: 'Pending' },
    { member: 'Joseph Maina', loanRef: 'LN-2024-00854', installment: '3/24', amount: 38000, status: 'Pending' },
    { member: 'Elizabeth Wairimu', loanRef: 'LN-2024-00833', installment: '8/12', amount: 30000, status: 'Pending' },
  ];

  recentActivity: ActivityItem[] = [
    { time: 'Today, 3:15 PM', channel: 'M-Pesa', amount: 42000, member: 'Sarah Auma', loanRef: 'LN-2024-00867', installment: 'Installment 4/24', transactionRef: 'QJK8X2M1PL' },
    { time: 'Today, 2:30 PM', channel: 'Bank', amount: 28500, member: 'Michael Odera', loanRef: 'LN-2024-00812', installment: 'Installment 10/18', transactionRef: 'BNK-9382741' },
    { time: 'Today, 11:40 AM', channel: 'M-Pesa', amount: 15000, member: 'John Kamau', loanRef: 'LN-2024-00845', installment: 'Installment 7/12', transactionRef: 'QSK4P9X3M2' },
    { time: 'Today, 10:15 AM', channel: 'Wallet', amount: 8000, member: 'Grace Akinyi', loanRef: 'LN-2024-00882', installment: 'Installment 5/10', transactionRef: 'WAL-2240089' },
    { time: 'Today, 9:00 AM', channel: 'Auto', amount: 12500, member: 'Peter Omondi', loanRef: 'LN-2024-00854', installment: 'Installment 3/24', transactionRef: 'AUTO-3349902' },
  ];

  channelStats: ChannelStat[] = [
    { channel: 'M-Pesa', transactions: 312, amount: 2890000, percent: 60, trend: 12 },
    { channel: 'Bank', transactions: 85, amount: 1150000, percent: 24, trend: 5 },
    { channel: 'Wallet', transactions: 42, amount: 480000, percent: 10, trend: 28 },
    { channel: 'Auto', transactions: 18, amount: 195000, percent: 4, trend: 0 },
    { channel: 'Cash', transactions: 8, amount: 105000, percent: 2, trend: -15 },
  ];

  // Aging buckets
  agingBuckets = [
    { label: 'Current', count: 124, amount: 42800000, days: '', tone: 'green' },
    { label: '1-7 DAYS', count: 8, amount: 320000, days: '', tone: 'orange' },
    { label: '8-15 DAYS', count: 4, amount: 285000, days: '', tone: 'orange-red' },
    { label: '16-30 DAYS', count: 3, amount: 415000, days: '', tone: 'red-light' },
    { label: '30+ DAYS', count: 3, amount: 300000, days: '', tone: 'red' },
  ];

  fullAgingDetails = [
    { bucket: '1-7 DAYS', members: 8, amount: 320000, share: '24.2%' },
    { bucket: '8-15 DAYS', members: 4, amount: 285000, share: '21.6%' },
    { bucket: '16-30 DAYS', members: 3, amount: 415000, share: '31.4%' },
    { bucket: '30+ DAYS', members: 3, amount: 300000, share: '22.8%' },
  ];

  // Heatmap cells (30 days)
  heatmapCells = Array.from({ length: 30 }, (_, i) => {
    const seed = (i * 13) % 7;
    let intensity = seed;
    let overdue = false;
    if (i === 12 || i === 19 || i === 22) { overdue = true; intensity = 4; }
    if (i === 5 || i === 7 || i === 10 || i === 15 || i === 18 || i === 24 || i === 27 || i === 28) intensity = 4;
    return { intensity, overdue };
  });

  // Monthly collection bars
  monthlyCollections = [
    { month: 'Jul', collected: 60, target: 80 },
    { month: 'Aug', collected: 72, target: 82 },
    { month: 'Sep', collected: 78, target: 84 },
    { month: 'Oct', collected: 65, target: 80 },
    { month: 'Nov', collected: 85, target: 86 },
    { month: 'Dec', collected: 70, target: 90 },
  ];

  // Repayments table
  repayments: RepaymentRow[] = [];

  ngOnInit(): void {
    this.buildRepayments();
  }

  ngOnDestroy(): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  }

  @HostListener('document:keydown.escape')
  closeAllModals(): void {
    this.showRecordModal = false;
    this.showAutoDeductModal = false;
    this.showReportsModal = false;
    this.showReconcileModal = false;
    this.showBulkRemindersModal = false;
    this.showPenaltyModal = false;
    this.showWaiverRequestsModal = false;
    this.showGenerateReportModal = false;
    this.showFullAgingModal = false;
    this.showFullLogModal = false;
    this.showReceiptModal = false;
    this.showRetryModal = false;
    this.showReverseModal = false;
    this.showReportDetailModal = false;
    document.body.style.overflow = '';
  }

  private open(): void { document.body.style.overflow = 'hidden'; }

  // ===== Modal openers =====
  openRecord(row?: RepaymentRow): void {
    this.recordForm = {
      loanRef: row?.loanRef || '', member: row?.member || '', amount: '',
      date: '', method: 'M-Pesa', transactionRef: '', paymentType: 'Regular Installment', notes: '',
      outstanding: row?.remainingBalance ?? 93750, nextDue: 15000, penalties: row?.penalty ?? 0,
      installmentLabel: row?.installment ?? '7/12',
    };
    this.showRecordModal = true; this.open();
  }
  openAutoDeduct(): void { this.showAutoDeductModal = true; this.open(); }
  openReports(): void { this.showReportsModal = true; this.open(); }
  openReconcile(): void { this.reconcileResult = { total: 0, matched: 0, unmatched: 0, duplicates: 0 }; this.showReconcileModal = true; this.open(); }
  openBulkReminders(): void { this.showBulkRemindersModal = true; this.open(); }
  openPenalty(): void { this.showPenaltyModal = true; this.open(); }
  openWaiverRequests(): void { this.showWaiverRequestsModal = true; this.open(); }
  openGenerateReport(): void { this.showGenerateReportModal = true; this.open(); }
  openFullAging(): void { this.showFullAgingModal = true; this.open(); }
  openFullLog(): void { this.showFullLogModal = true; this.open(); }
  openReceipt(row: RepaymentRow): void { this.activeRow = row; this.showReceiptModal = true; this.open(); }
  openRetry(row: RepaymentRow): void { this.activeRow = row; this.retryForm = { channel: row.channel, amount: row.amount, notes: '' }; this.showRetryModal = true; this.open(); }
  openReverse(row: RepaymentRow): void { this.activeRow = row; this.reverseForm = { reason: '', notes: '', notifyMember: true }; this.showReverseModal = true; this.open(); }
  openReportDetail(type: string): void { this.activeReportType = type; this.showReportsModal = false; this.showReportDetailModal = true; this.open(); }
  openWaiverDetail(w: WaiverRequest, action: 'approve' | 'reject'): void {
    this.activeWaiver = w; this.waiverAction = action; this.waiverNotes = '';
  }

  // ===== Actions =====
  submitRecord(): void {
    if (!this.recordForm.loanRef || !this.recordForm.amount) return;
    this.closeAllModals();
    this.showToast('success', `Payment of KES ${Number(this.recordForm.amount).toLocaleString('en-KE')} recorded.`);
  }

  saveAutoDeductConfig(): void {
    this.closeAllModals();
    this.showToast('success', 'Auto-deduction configuration saved.');
  }

  toggleAutoDeduct(item: AutoDeduction): void {
    item.enabled = !item.enabled;
  }

  startReconciliation(): void {
    // simulate
    this.reconcileResult = { total: 312, matched: 298, unmatched: 9, duplicates: 5 };
    this.showToast('success', 'Reconciliation completed.');
  }

  sendBulkReminders(): void {
    const count = this.reminderRecipients.filter(r => r.selected).length;
    if (!count) return;
    this.closeAllModals();
    this.showToast('success', `Reminders sent to ${count} member(s).`);
  }

  savePenaltyConfig(): void {
    this.closeAllModals();
    this.showToast('success', 'Penalty configuration saved.');
  }

  confirmWaiverDecision(): void {
    if (!this.activeWaiver) return;
    if (this.waiverAction === 'approve') this.activeWaiver.status = 'Approved';
    else this.activeWaiver.status = 'Rejected';
    const action = this.waiverAction === 'approve' ? 'approved' : 'rejected';
    this.activeWaiver = null;
    this.showToast('success', `Waiver request ${action}.`);
  }

  generateReport(): void {
    this.closeAllModals();
    this.showToast('success', `${this.reportForm.type} exported as ${this.reportForm.format}.`);
  }

  confirmRetry(): void {
    if (!this.activeRow) return;
    this.activeRow.status = 'Pending';
    this.closeAllModals();
    this.showToast('success', `Retry initiated for ${this.activeRow.receiptNo}.`);
  }

  confirmReverse(): void {
    if (!this.activeRow || !this.reverseForm.reason) return;
    this.activeRow.status = 'Reversed';
    this.closeAllModals();
    this.showToast('success', `Payment ${this.activeRow.receiptNo} reversed.`);
  }

  // ===== Selection & filtering =====
  toggleAll(): void { this.filteredRepayments.forEach(r => (r.selected = this.allSelected)); }
  get selectedCount(): number { return this.repayments.filter(r => r.selected).length; }

  get filteredRepayments(): RepaymentRow[] {
    let rows = [...this.repayments];
    if (this.tableTab !== 'all') rows = rows.filter(r => r.status.toLowerCase() === this.tableTab);
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      rows = rows.filter(r => r.member.toLowerCase().includes(q) || r.loanRef.toLowerCase().includes(q) || r.receiptNo.toLowerCase().includes(q));
    }
    if (this.filterChannel) rows = rows.filter(r => r.channel === this.filterChannel);
    if (this.filterStatus) rows = rows.filter(r => r.status === this.filterStatus);
    return rows;
  }

  get paginatedRepayments(): RepaymentRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRepayments.slice(start, start + this.pageSize);
  }

  get totalPages(): number { return Math.ceil(this.filteredRepayments.length / this.pageSize) || 1; }
  get pageEnd(): number { return Math.min(this.currentPage * this.pageSize, this.filteredRepayments.length); }
  get visiblePages(): number[] {
    const total = this.totalPages; const cur = this.currentPage;
    let start = Math.max(1, cur - 2); const end = Math.min(total, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  goToPage(p: number): void { if (p >= 1 && p <= this.totalPages) this.currentPage = p; }

  tabCount(tab: TableTab): number {
    if (tab === 'all') return this.repayments.length;
    return this.repayments.filter(r => r.status.toLowerCase() === tab).length;
  }

  channelIcon(c: RepayChannel): string {
    return { 'M-Pesa': '📱', 'Bank': '🏦', 'Wallet': '👛', 'Cash': '💵', 'Auto': '⚙️' }[c] || '💳';
  }

  channelColor(c: RepayChannel): string {
    return { 'M-Pesa': '#00d084', 'Bank': '#2196f3', 'Wallet': '#9c27b0', 'Cash': '#ff9800', 'Auto': '#00bcd4' }[c] || '#64748b';
  }

  // ===== Data Builders =====
  private buildRepayments(): void {
    const data = [
      { receipt: 'RPY-04521', member: 'Sarah Auma', id: 'SP-10089', initials: 'SA', color: '#00d084', loanRef: 'LN-2024-00867', loanType: 'Business', amount: 42000, channel: 'M-Pesa' as RepayChannel, installment: '4/24', pct: 17, status: 'Confirmed' as RepayStatus, date: 'Dec 18', time: '3:15 PM', txRef: 'QJK8X2M1PL', principal: 35000, interest: 7000, penalty: 0, remain: 840000, processedBy: 'System (Auto-matched)' },
      { receipt: 'RPY-04520', member: 'Michael Odera', id: 'SP-10124', initials: 'MO', color: '#2196f3', loanRef: 'LN-2024-00812', loanType: 'Personal', amount: 28500, channel: 'Bank' as RepayChannel, installment: '10/18', pct: 56, status: 'Confirmed' as RepayStatus, date: 'Dec 18', time: '2:30 PM', txRef: 'BNK-9382741', principal: 24000, interest: 4500, penalty: 0, remain: 240000, processedBy: 'System (Auto-matched)' },
      { receipt: 'RPY-04519', member: 'John Kamau', id: 'SP-10015', initials: 'JK', color: '#9c27b0', loanRef: 'LN-2024-00845', loanType: 'Education', amount: 15000, channel: 'M-Pesa' as RepayChannel, installment: '7/12', pct: 58, status: 'Confirmed' as RepayStatus, date: 'Dec 18', time: '11:40 AM', txRef: 'QSK4P9X3M2', principal: 12500, interest: 2500, penalty: 0, remain: 90000, processedBy: 'Admin Maria' },
      { receipt: 'RPY-04516', member: 'Alice Muthoni', id: 'SP-10042', initials: 'AM', color: '#f44336', loanRef: 'LN-2024-00820', loanType: 'Personal', amount: 25000, channel: 'Cash' as RepayChannel, installment: '7/12 Overdue', pct: 58, status: 'Overdue' as RepayStatus, date: 'Due: Dec 3', time: '—', txRef: 'PENDING', principal: 20000, interest: 5000, penalty: 1250, remain: 175000, processedBy: '—' },
      { receipt: 'RPY-04518', member: 'Daniel Kipchoge', id: 'SP-10098', initials: 'DK', color: '#9c27b0', loanRef: 'LN-2024-00835', loanType: 'Agriculture', amount: 75000, channel: 'Wallet' as RepayChannel, installment: '6/12 Advance', pct: 50, status: 'Advance' as RepayStatus, date: 'Dec 17', time: '4:50 PM', txRef: 'WAL-3349872', principal: 65000, interest: 10000, penalty: 0, remain: 380000, processedBy: 'Admin James' },
      { receipt: 'RPY-04515', member: 'Bernard Kiprop', id: 'SP-10078', initials: 'BK', color: '#ff9800', loanRef: 'LN-2024-00798', loanType: 'Business', amount: 45000, channel: 'Auto' as RepayChannel, installment: '4/12 Failed', pct: 33, status: 'Failed' as RepayStatus, date: 'Dec 17', time: '2:00 PM', txRef: 'AUTO-FAILED', principal: 0, interest: 0, penalty: 0, remain: 350000, processedBy: 'Auto-Deduct System' },
    ];

    this.repayments = data.map(d => ({
      receiptNo: d.receipt, member: d.member, memberId: d.id, memberInitials: d.initials, avatarColor: d.color,
      loanRef: d.loanRef, loanType: d.loanType, amount: d.amount, channel: d.channel,
      installment: d.installment, installmentPct: d.pct, status: d.status,
      date: d.date, time: d.time, transactionRef: d.txRef,
      principal: d.principal, interest: d.interest, penalty: d.penalty,
      remainingBalance: d.remain, processedBy: d.processedBy, selected: false,
    }));
  }

  showToast(type: ToastType, message: string): void {
    const id = ++this.toastId;
    this.toasts.push({ id, type, message });
    window.setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id); }, 3000);
  }

  dismissToast(id: number): void { this.toasts = this.toasts.filter(t => t.id !== id); }
}
