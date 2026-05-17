import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* =============================================
   INTERFACES
   ============================================= */
interface Deposit {
  id: string;
  time: string;
  date: string;
  memberName: string;
  memberId: string;
  initials: string;
  avatarGradient: string;
  type: string;
  method: string;
  methodClass: string;
  methodIcon: string;
  amount: string;
  amountShort: string;
  status: string;
  statusClass: string;
  reference: string;
}

interface ReconciliationItem {
  id: string;
  type: string;
  time: string;
  issue: string;
  issueIcon: string;
  issueColor: string;
  action1Label: string;
  action1Icon: string;
  action1Text: string;
}

interface ActivityItem {
  id: number;
  initials: string;
  name: string;
  meta: string;
  time: string;
  dotBg: string;
  dotColor: string;
}

interface BarChartDay {
  day: string;
  amount: string;
  height: number;
  gradient: string;
}

interface DepositType {
  name: string;
  amount: string;
  percent: number;
  gradient: string;
}

interface TopDepositor {
  rank: number;
  initials: string;
  name: string;
  memberId: string;
  total: string;
  frequency: string;
  average: string;
  avatarGradient: string;
  badgeGradient: string;
}

interface Toast {
  id: number;
  message: string;
  type: string;
  icon: string;
  color: string;
  removing: boolean;
}

/* =============================================
   COMPONENT
   ============================================= */
@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposits.html',
  styleUrls: ['./deposits.scss']
})
export class DepositsComponent implements OnInit {

  /* ── State ── */
  activeModal: string | null = null;
  toasts: Toast[] = [];
  private toastIdCounter = 0;

  /* ── Table Filters ── */
  tableSearch = '';
  statusFilter = '';
  methodFilter = '';
  dateFilter = '';
  currentPage = 1;

  /* ── Quick Entry ── */
  qeMember = '';
  qeType = 'Savings';
  qeMethod = 'Cash';
  qeAmount: number | null = null;
  qeRef = '';
  previewAmount = 'KES 0';
  previewFee = 'KES 0';
  previewNet = 'KES 0';

  /* ── Record Modal ── */
  recordMember = '';
  recordType = '';
  recordMethod = '';
  recordAmount: number | null = null;
  recordRef = '';
  recordDate = '';
  recordNotes = '';

  /* ── Export Modal ── */
  exportDateFrom = '';
  exportDateTo = '';
  exportStatus = '';
  exportMethod = '';
  exportFormat = 'CSV (.csv)';

  /* ── Reconcile Modal ── */
  reconcileDateFrom = '';
  reconcileDateTo = '';
  reconcileSource = 'M-Pesa Statement';

  /* ── Selected Deposit ── */
  selectedDeposit: Deposit | null = null;

  /* ── Data ── */
  deposits: Deposit[] = [
    {
      id: 'DEP-2026-00789',
      time: 'Today, 2:45 PM',
      date: 'Jan 16, 2026',
      memberName: 'Sarah Akinyi',
      memberId: 'R-00123',
      initials: 'SA',
      avatarGradient: 'linear-gradient(135deg, #00d084, #00bcd4)',
      type: 'Savings',
      method: 'M-Pesa',
      methodClass: 'mpesa',
      methodIcon: 'bi-phone',
      amount: 'KES 50,000',
      amountShort: 'KES 50K',
      status: 'Completed',
      statusClass: 'completed',
      reference: 'MPESA-789ABC'
    },
    {
      id: 'DEP-2026-00788',
      time: 'Today, 2:20 PM',
      date: 'Jan 16, 2026',
      memberName: 'David Kipkorir',
      memberId: 'R-00045',
      initials: 'DK',
      avatarGradient: 'linear-gradient(135deg, #ff9800, #f44336)',
      type: 'Loan Repayment',
      method: 'Cash',
      methodClass: 'cash',
      methodIcon: 'bi-cash-stack',
      amount: 'KES 125,000',
      amountShort: 'KES 125K',
      status: 'Pending',
      statusClass: 'pending',
      reference: 'CASH-1423'
    },
    {
      id: 'DEP-2026-00787',
      time: 'Today, 1:50 PM',
      date: 'Jan 16, 2026',
      memberName: 'Mary Wanjiku',
      memberId: 'R-00234',
      initials: 'MW',
      avatarGradient: 'linear-gradient(135deg, #9c27b0, #2196f3)',
      type: 'Share Capital',
      method: 'Bank Transfer',
      methodClass: 'bank',
      methodIcon: 'bi-bank',
      amount: 'KES 200,000',
      amountShort: 'KES 200K',
      status: 'Completed',
      statusClass: 'completed',
      reference: 'EQT-FT261800234'
    },
    {
      id: 'DEP-2026-00786',
      time: 'Today, 1:15 PM',
      date: 'Jan 16, 2026',
      memberName: 'John Otieno',
      memberId: 'R-00456',
      initials: 'JO',
      avatarGradient: 'linear-gradient(135deg, #00bcd4, #2196f3)',
      type: 'Fixed Deposit',
      method: 'Cheque',
      methodClass: 'cheque',
      methodIcon: 'bi-file-text',
      amount: 'KES 500,000',
      amountShort: 'KES 500K',
      status: 'Processing',
      statusClass: 'processing',
      reference: 'CHQ-KCB-4521'
    },
    {
      id: 'DEP-2026-00785',
      time: 'Today, 12:30 PM',
      date: 'Jan 16, 2026',
      memberName: 'Grace Muthoni',
      memberId: 'R-00678',
      initials: 'GM',
      avatarGradient: 'linear-gradient(135deg, #e91e63, #9c27b0)',
      type: 'Savings',
      method: 'M-Pesa',
      methodClass: 'mpesa',
      methodIcon: 'bi-phone',
      amount: 'KES 35,000',
      amountShort: 'KES 35K',
      status: 'Completed',
      statusClass: 'completed',
      reference: 'MPESA-QHX7823'
    },
    {
      id: 'DEP-2026-00784',
      time: 'Today, 11:45 AM',
      date: 'Jan 16, 2026',
      memberName: 'Peter Njoroge',
      memberId: 'R-00892',
      initials: 'PN',
      avatarGradient: 'linear-gradient(135deg, #ff5722, #ff9800)',
      type: 'Share Capital',
      method: 'Cheque',
      methodClass: 'cheque',
      methodIcon: 'bi-file-text',
      amount: 'KES 75,000',
      amountShort: 'KES 75K',
      status: 'Pending',
      statusClass: 'pending',
      reference: 'CHQ-KCB-3380'
    }
  ];

  filteredDeposits: Deposit[] = [];

  get pendingDeposits(): Deposit[] {
    return this.deposits.filter(d => d.status === 'Pending');
  }

  reconciliationItems: ReconciliationItem[] = [
    {
      id: 'DEP-2026-00745 · Sarah Akinyi · M-Pesa · KES 50,000',
      type: 'missing',
      time: 'Jan 15, 10:30 AM',
      issue: 'Not found in M-Pesa statement',
      issueIcon: 'bi-x-circle',
      issueColor: 'var(--status-danger)',
      action1Label: 'Match Manually',
      action1Icon: 'bi-link',
      action1Text: 'Manual match applied'
    },
    {
      id: 'DEP-2026-00720 ↔ RHK7890 · David Kipkorir · M-Pesa',
      type: 'mismatch',
      time: 'Jan 15, 9:15 AM',
      issue: 'Amount mismatch — System: KES 100,000 vs Statement: KES 99,500',
      issueIcon: 'bi-exclamation-triangle',
      issueColor: 'var(--status-warning)',
      action1Label: 'Adjust',
      action1Icon: 'bi-pencil',
      action1Text: 'Adjustment applied'
    },
    {
      id: 'DEP-2026-00789 ↔ RHK7X9M2PQ · Sarah Akinyi · M-Pesa · KES 50,000',
      type: 'matched',
      time: 'Jan 15, 2:45 PM',
      issue: 'Perfect match on Jan 15, 2:45 PM',
      issueIcon: 'bi-check2-circle',
      issueColor: 'var(--status-success)',
      action1Label: '',
      action1Icon: '',
      action1Text: ''
    }
  ];

  recentActivity: ActivityItem[] = [
    { id: 1, initials: 'SA', name: 'Sarah Akinyi', meta: 'KES 50,000 · M-Pesa · Savings', time: '2m ago', dotBg: '#e6faf4', dotColor: '#00a866' },
    { id: 2, initials: 'DK', name: 'David Kipkorir', meta: 'KES 125,000 · Cash · Loan Repayment', time: '30m ago', dotBg: '#fff3e0', dotColor: '#e65100' },
    { id: 3, initials: 'MW', name: 'Mary Wanjiku', meta: 'KES 200,000 · Bank · Share Capital', time: '1h ago', dotBg: '#f3e5f5', dotColor: '#6a1b9a' },
    { id: 4, initials: 'JO', name: 'John Otieno', meta: 'KES 500,000 · Cheque · Fixed Deposit', time: '2h ago', dotBg: '#e3f2fd', dotColor: '#1565c0' }
  ];

  barChartData: BarChartDay[] = [
    { day: 'Mon', amount: 'KES 4.2M', height: 62, gradient: 'linear-gradient(180deg, #00d084, #00bcd4)' },
    { day: 'Tue', amount: 'KES 5.1M', height: 75, gradient: 'linear-gradient(180deg, #00d084, #00bcd4)' },
    { day: 'Wed', amount: 'KES 5.8M', height: 85, gradient: 'linear-gradient(180deg, #00d084, #00bcd4)' },
    { day: 'Thu', amount: 'KES 6.8M', height: 100, gradient: 'linear-gradient(180deg, #00d084, #00bcd4)' },
    { day: 'Fri', amount: 'KES 6.5M', height: 96, gradient: 'linear-gradient(180deg, #00d084, #00bcd4)' },
    { day: 'Sat', amount: 'KES 2.8M', height: 41, gradient: 'linear-gradient(180deg, #00bcd4, #2196f3)' },
    { day: 'Sun', amount: 'KES 1.2M', height: 18, gradient: 'linear-gradient(180deg, #94a3b8, #e2e8f0)' }
  ];

  depositTypes: DepositType[] = [
    { name: 'Savings', amount: 'KES 85M', percent: 55, gradient: 'linear-gradient(90deg, #00d084, #00bcd4)' },
    { name: 'Share Capital', amount: 'KES 38M', percent: 24, gradient: 'linear-gradient(90deg, #2196f3, #9c27b0)' },
    { name: 'Loan Repayment', amount: 'KES 26M', percent: 17, gradient: 'linear-gradient(90deg, #ff9800, #f44336)' },
    { name: 'Fixed Deposit', amount: 'KES 7M', percent: 4, gradient: 'linear-gradient(90deg, #9c27b0, #e91e63)' }
  ];

  topDepositors: TopDepositor[] = [
    {
      rank: 1, initials: 'SA', name: 'Sarah Akinyi', memberId: 'R-00123',
      total: 'KES 2.5M', frequency: '45 deposits', average: 'KES 55,555',
      avatarGradient: 'linear-gradient(135deg, #00d084, #00bcd4)',
      badgeGradient: 'linear-gradient(135deg, #00d084, #00bcd4)'
    },
    {
      rank: 2, initials: 'DK', name: 'David Kipkorir', memberId: 'R-00045',
      total: 'KES 1.8M', frequency: '38 deposits', average: 'KES 47,368',
      avatarGradient: 'linear-gradient(135deg, #ff9800, #f44336)',
      badgeGradient: 'linear-gradient(135deg, #9e9e9e, #757575)'
    },
    {
      rank: 3, initials: 'MW', name: 'Mary Wanjiku', memberId: 'R-00234',
      total: 'KES 1.5M', frequency: '42 deposits', average: 'KES 35,714',
      avatarGradient: 'linear-gradient(135deg, #9c27b0, #2196f3)',
      badgeGradient: 'linear-gradient(135deg, #a1887f, #795548)'
    },
    {
      rank: 4, initials: 'JO', name: 'John Otieno', memberId: 'R-00456',
      total: 'KES 1.2M', frequency: '25 deposits', average: 'KES 48,000',
      avatarGradient: 'linear-gradient(135deg, #00bcd4, #2196f3)',
      badgeGradient: 'linear-gradient(135deg, #94a3b8, #64748b)'
    },
    {
      rank: 5, initials: 'GM', name: 'Grace Muthoni', memberId: 'R-00678',
      total: 'KES 950K', frequency: '32 deposits', average: 'KES 29,687',
      avatarGradient: 'linear-gradient(135deg, #e91e63, #9c27b0)',
      badgeGradient: 'linear-gradient(135deg, #94a3b8, #64748b)'
    }
  ];

  /* =============================================
     LIFECYCLE
     ============================================= */
  ngOnInit(): void {
    this.filteredDeposits = [...this.deposits];
    this.updatePreview();

    const today = new Date().toISOString().split('T')[0];
    this.recordDate = today;
    this.reconcileDateFrom = today;
    this.reconcileDateTo = today;
  }

  /* =============================================
     TOAST
     ============================================= */
  showToast(message: string, type: string = 'success'): void {
    const icons: Record<string, string> = {
      success: 'bi-check-circle',
      warning: 'bi-exclamation-triangle',
      danger: 'bi-x-circle',
      info: 'bi-info-circle'
    };
    const colors: Record<string, string> = {
      success: 'var(--status-success)',
      warning: 'var(--status-warning)',
      danger: 'var(--status-danger)',
      info: 'var(--status-info)'
    };

    const toast: Toast = {
      id: ++this.toastIdCounter,
      message,
      type,
      icon: icons[type] || 'bi-info-circle',
      color: colors[type] || 'var(--status-info)',
      removing: false
    };

    this.toasts.push(toast);

    setTimeout(() => {
      toast.removing = true;
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== toast.id);
      }, 300);
    }, 3500);
  }

  /* =============================================
     MODALS
     ============================================= */
  openModal(id: string): void {
    this.activeModal = id;
    document.body.style.overflow = 'hidden';
  }

  closeModal(id: string): void {
    if (this.activeModal === id) {
      this.activeModal = null;
      document.body.style.overflow = '';
    }
  }

  closeModalOnOverlay(event: MouseEvent, id: string): void {
    if (event.target === event.currentTarget) {
      this.closeModal(id);
    }
  }

  /* =============================================
     TABLE FILTERING
     ============================================= */
  filterTable(): void {
    const search = this.tableSearch.toLowerCase();
    const status = this.statusFilter.toLowerCase();
    const method = this.methodFilter.toLowerCase();

    this.filteredDeposits = this.deposits.filter(deposit => {
      const txt = (deposit.id + ' ' + deposit.memberName + ' ' + deposit.memberId + ' ' + deposit.type + ' ' + deposit.method + ' ' + deposit.amount + ' ' + deposit.status).toLowerCase();
      const matchS = !search || txt.includes(search);
      const matchSt = !status || deposit.status.toLowerCase() === status;
      const matchM = !method || deposit.method.toLowerCase() === method;
      return matchS && matchSt && matchM;
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.showToast(`Loading page ${page}…`, 'info');
  }

  /* =============================================
     DEPOSIT ACTIONS
     ============================================= */
  approveDeposit(deposit: Deposit): void {
    deposit.status = 'Completed';
    deposit.statusClass = 'completed';
    this.showToast(`Deposit ${deposit.id} approved ✓`, 'success');
    this.filterTable();
  }

  rejectDeposit(deposit: Deposit): void {
    deposit.status = 'Failed';
    deposit.statusClass = 'failed';
    this.showToast(`Deposit ${deposit.id} rejected`, 'danger');
    this.filterTable();
  }

  openDetails(deposit: Deposit): void {
    this.selectedDeposit = deposit;
    this.openModal('detailsModal');
  }

  /* =============================================
     QUICK ENTRY
     ============================================= */
  updatePreview(): void {
    const amt = this.qeAmount || 0;
    let fee = 0;
    if (this.qeMethod === 'M-Pesa') {
      fee = Math.min(Math.round(amt * 0.0015), 300);
    } else if (this.qeMethod === 'Bank Transfer') {
      fee = Math.min(Math.round(amt * 0.002), 500);
    }

    const fmt = (n: number) => 'KES ' + n.toLocaleString('en-KE');
    this.previewAmount = fmt(amt);
    this.previewFee = fmt(fee);
    this.previewNet = fmt(amt - fee);
  }

  submitQuickEntry(): void {
    const member = this.qeMember.trim();
    const amount = this.qeAmount;
    if (!member || !amount || amount <= 0) {
      this.showToast('Please fill in Member and Amount', 'warning');
      return;
    }
    this.showToast(`Deposit of KES ${amount.toLocaleString()} recorded for ${member} ✓`, 'success');
    this.qeMember = '';
    this.qeAmount = null;
    this.qeRef = '';
    this.updatePreview();
  }

  /* =============================================
     RECORD DEPOSIT MODAL
     ============================================= */
  submitRecordDeposit(): void {
    if (!this.recordMember || !this.recordType || !this.recordMethod || !this.recordAmount || this.recordAmount <= 0 || !this.recordDate) {
      this.showToast('Please fill in all required fields', 'warning');
      return;
    }
    this.showToast('Deposit recorded successfully ✓', 'success');
    this.closeModal('recordModal');
    this.recordMember = '';
    this.recordType = '';
    this.recordMethod = '';
    this.recordAmount = null;
    this.recordRef = '';
    this.recordDate = '';
    this.recordNotes = '';
  }

  /* =============================================
     EXPORT MODAL
     ============================================= */
  submitExport(): void {
    this.showToast('Export started — file will download shortly', 'success');
    this.closeModal('exportModal');
  }

  /* =============================================
     RECONCILE MODAL
     ============================================= */
  runReconcile(): void {
    this.showToast('Reconciliation started — processing 1,234 deposits…', 'info');
    setTimeout(() => {
      this.showToast('Reconciliation complete — 45 unmatched items found', 'warning');
    }, 2500);
    this.closeModal('reconcileModal');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.showToast(`File "${input.files[0].name}" selected`, 'info');
    }
  }
}