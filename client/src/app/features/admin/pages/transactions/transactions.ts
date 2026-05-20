import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TransactionType = 'Deposit' | 'Withdrawal' | 'Loan Payment' | 'Shares';
type TransactionStatus = 'Success' | 'Pending' | 'Failed';
type ViewMode = 'table' | 'cards';
type ReconTab = 'mpesa' | 'bank' | 'cash';
type ToastType = 'success' | 'info' | 'warning' | 'danger';

interface Transaction {
  id: string;
  dateMain: string;
  dateSub: string;
  memberName: string;
  memberId: string;
  memberInitials: string;
  avatarColor: string;
  type: TransactionType;
  method: string;
  methodIcon: string;
  amount: number;
  fee: number;
  status: TransactionStatus;
  reference: string;
  subText?: string;
}

interface EditForm {
  transactionId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  reference: string;
  reason: string;
  confirmed: boolean;
}

interface AddForm {
  member: string;
  type: string;
  method: string;
  amount: number | null;
  date: string;
  time: string;
  reference: string;
  description: string;
  autoApprove: boolean;
  notifyMember: boolean;
}

interface ToastState {
  message: string;
  type: ToastType;
}

interface Note {
  author: string;
  time: string;
  text: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsComponent {
  readonly typeColors: Record<TransactionType, { bg: string; text: string }> = {
    Deposit: { bg: 'rgba(76, 175, 80, 0.12)', text: '#2e7d32' },
    Withdrawal: { bg: 'rgba(244, 67, 54, 0.12)', text: '#c62828' },
    'Loan Payment': { bg: 'rgba(33, 150, 243, 0.12)', text: '#1565c0' },
    Shares: { bg: 'rgba(255, 152, 0, 0.14)', text: '#e65100' },
  };

  readonly typeIcons: Record<TransactionType, string> = {
    Deposit: 'IN',
    Withdrawal: 'OUT',
    'Loan Payment': 'LOAN',
    Shares: 'SHR',
  };

  readonly members = [
    'Sarah Akinyi - R-00123',
    'David Kipkorir - R-00045',
    'Mary Wanjiku - R-00234',
    'John Otieno - R-00456',
    'Grace Muthoni - R-00678',
  ];

  transactions: Transaction[] = [
    {
      id: 'TXN-2024-050123',
      dateMain: 'Today, 11:42 AM',
      dateSub: 'Jan 23, 2024',
      memberName: 'Sarah Akinyi',
      memberId: 'R-00123',
      memberInitials: 'SA',
      avatarColor: '#00a866',
      type: 'Deposit',
      method: 'M-Pesa',
      methodIcon: 'MP',
      amount: 50000,
      fee: 50,
      status: 'Success',
      reference: 'QR45KJ8L3P',
      subText: 'M-Pesa: QR45KJ8L3P',
    },
    {
      id: 'TXN-2024-050122',
      dateMain: 'Today, 10:30 AM',
      dateSub: 'Jan 23, 2024',
      memberName: 'David Kipkorir',
      memberId: 'R-00045',
      memberInitials: 'DK',
      avatarColor: '#00bcd4',
      type: 'Withdrawal',
      method: 'Cash',
      methodIcon: 'CA',
      amount: 120000,
      fee: 100,
      status: 'Pending',
      reference: 'CSH-00122',
      subText: 'Cash Payment',
    },
    {
      id: 'TXN-2024-050121',
      dateMain: 'Today, 09:15 AM',
      dateSub: 'Jan 23, 2024',
      memberName: 'Mary Wanjiku',
      memberId: 'R-00234',
      memberInitials: 'MW',
      avatarColor: '#00d084',
      type: 'Loan Payment',
      method: 'M-Pesa',
      methodIcon: 'MP',
      amount: 25000,
      fee: 0,
      status: 'Failed',
      reference: 'LP-00121',
      subText: 'Error: Insufficient balance',
    },
    {
      id: 'TXN-2024-050120',
      dateMain: 'Today, 08:45 AM',
      dateSub: 'Jan 23, 2024',
      memberName: 'John Otieno',
      memberId: 'R-00456',
      memberInitials: 'JO',
      avatarColor: '#008c78',
      type: 'Deposit',
      method: 'Bank',
      methodIcon: 'BK',
      amount: 350000,
      fee: 200,
      status: 'Success',
      reference: 'KCB: F12456/789234',
    },
    {
      id: 'TXN-2024-050119',
      dateMain: 'Yesterday, 4:30 PM',
      dateSub: 'Jan 22, 2024',
      memberName: 'Grace Muthoni',
      memberId: 'R-00678',
      memberInitials: 'GM',
      avatarColor: '#00a866',
      type: 'Shares',
      method: 'Cheque',
      methodIcon: 'CQ',
      amount: 85000,
      fee: 0,
      status: 'Success',
      reference: 'Cheque: 001234',
    },
  ];

  searchQuery = '';
  dateRange = 'Today';
  typeFilter = 'All Types';
  statusFilter = 'All Status';
  methodFilter = 'All Methods';
  viewMode: ViewMode = 'table';
  perPage = 25;
  currentPage = 1;
  sortAscending = true;
  lastUpdated = 'Just now';

  selectedIds = new Set<string>();
  activeTxn: Transaction | null = null;

  showEditModal = false;
  showDetailsModal = false;
  showReconcileModal = false;
  showAddModal = false;

  reconTab: ReconTab = 'mpesa';
  reconPeriod = 'Today';
  reconAccount = '522533';

  toast: ToastState | null = null;
  private toastTimer?: number;

  quickActionMessage = '';
  addingNote = false;
  noteDraft = '';
  notes: Note[] = [
    {
      author: 'John Maina',
      time: '2 hours ago',
      text: 'Regular monthly deposit. No issues.',
    },
  ];

  editForm: EditForm = this.emptyEditForm();
  addForm: AddForm = this.emptyAddForm();

  get filteredTransactions(): Transaction[] {
    const query = this.searchQuery.trim().toLowerCase();
    let rows = this.transactions.filter((txn) => {
      const matchesQuery =
        !query ||
        txn.id.toLowerCase().includes(query) ||
        txn.memberName.toLowerCase().includes(query) ||
        String(txn.amount).includes(query) ||
        txn.reference.toLowerCase().includes(query);
      const matchesType = this.typeFilter === 'All Types' || txn.type === this.typeFilter;
      const matchesStatus = this.statusFilter === 'All Status' || txn.status === this.statusFilter;
      const matchesMethod = this.methodFilter === 'All Methods' || txn.method === this.methodFilter;

      return matchesQuery && matchesType && matchesStatus && matchesMethod;
    });

    rows = [...rows].sort((a, b) => {
      const diff = a.amount - b.amount;
      return this.sortAscending ? diff : -diff;
    });

    return rows;
  }

  get activeFilters(): Array<{ key: string; label: string }> {
    const filters: Array<{ key: string; label: string }> = [];
    if (this.dateRange !== 'All') filters.push({ key: 'date', label: this.dateRange });
    if (this.typeFilter !== 'All Types') filters.push({ key: 'type', label: this.typeFilter });
    if (this.statusFilter !== 'All Status') filters.push({ key: 'status', label: this.statusFilter });
    if (this.methodFilter !== 'All Methods') filters.push({ key: 'method', label: this.methodFilter });
    return filters;
  }

  get allSelected(): boolean {
    return this.filteredTransactions.length > 0 && this.filteredTransactions.every((txn) => this.selectedIds.has(txn.id));
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }

  get canSaveEdit(): boolean {
    return Boolean(this.editForm.reason.trim()) && this.editForm.confirmed;
  }

  get canAddTransaction(): boolean {
    return Boolean(this.addForm.member && this.addForm.type && this.addForm.method && this.addForm.amount);
  }

  get reconAccountLabel(): string {
    if (this.reconTab === 'bank') return 'Bank Account';
    if (this.reconTab === 'cash') return 'Cash Register';
    return 'M-Pesa Paybill';
  }

  get reconStatementLabel(): string {
    if (this.reconTab === 'bank') return 'Bank Statement';
    if (this.reconTab === 'cash') return 'Cash Sheet';
    return 'M-Pesa Statement';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModals();
  }

  formatCurrency(value: number): string {
    return `KES ${value.toLocaleString('en-KE')}`;
  }

  formatAmount(value: number): string {
    return `KES ${value.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  netAmount(txn: Transaction): number {
    return txn.amount - txn.fee - 8;
  }

  applyFilters(): void {
    this.currentPage = 1;
  }

  removeFilter(key: string): void {
    if (key === 'date') this.dateRange = 'All';
    if (key === 'type') this.typeFilter = 'All Types';
    if (key === 'status') this.statusFilter = 'All Status';
    if (key === 'method') this.methodFilter = 'All Methods';
    this.applyFilters();
  }

  refreshTransactions(): void {
    const now = new Date();
    this.lastUpdated = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  }

  exportTransactions(): void {
    this.showToast('Export file is being prepared.', 'info');
  }

  toggleSort(): void {
    this.sortAscending = !this.sortAscending;
  }

  setCardFilter(type: 'pending' | 'failed' | 'success' | 'deposit' | 'withdrawal' | 'loan' | 'shares'): void {
    if (type === 'pending') this.statusFilter = 'Pending';
    if (type === 'failed') this.statusFilter = 'Failed';
    if (type === 'success') this.statusFilter = 'Success';
    if (type === 'deposit') this.typeFilter = 'Deposit';
    if (type === 'withdrawal') this.typeFilter = 'Withdrawal';
    if (type === 'loan') this.typeFilter = 'Loan Payment';
    if (type === 'shares') this.typeFilter = 'Shares';
    this.applyFilters();
  }

  toggleSelect(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.selectedIds = new Set(this.selectedIds);
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.filteredTransactions.forEach((txn) => this.selectedIds.delete(txn.id));
    } else {
      this.filteredTransactions.forEach((txn) => this.selectedIds.add(txn.id));
    }
    this.selectedIds = new Set(this.selectedIds);
  }

  openEditModal(txn: Transaction): void {
    this.activeTxn = txn;
    this.editForm = {
      transactionId: txn.id,
      amount: txn.amount,
      type: txn.type,
      status: txn.status,
      reference: txn.reference,
      reason: '',
      confirmed: false,
    };
    this.showEditModal = true;
  }

  openDetailsModal(txn: Transaction): void {
    this.activeTxn = txn;
    this.quickActionMessage = '';
    this.addingNote = false;
    this.showDetailsModal = true;
  }

  openReconcileModal(): void {
    this.reconTab = 'mpesa';
    this.showReconcileModal = true;
  }

  openAddModal(): void {
    this.addForm = this.emptyAddForm();
    this.showAddModal = true;
  }

  closeModals(): void {
    this.showEditModal = false;
    this.showDetailsModal = false;
    this.showReconcileModal = false;
    this.showAddModal = false;
  }

  saveEdit(): void {
    if (!this.activeTxn || !this.canSaveEdit) return;

    this.activeTxn.amount = Number(this.editForm.amount);
    this.activeTxn.type = this.editForm.type;
    this.activeTxn.status = this.editForm.status;
    this.activeTxn.reference = this.editForm.reference;
    this.showEditModal = false;
    this.showToast('Transaction updated successfully.', 'success');
  }

  addTransaction(): void {
    if (!this.canAddTransaction) return;

    const memberParts = this.addForm.member.split(' - ');
    const memberName = memberParts[0] || 'Manual Member';
    const memberId = memberParts[1] || 'R-NEW';
    const type = this.addForm.type as TransactionType;
    const method = this.addForm.method;

    const newTransaction: Transaction = {
      id: `TXN-2024-${String(50124 + this.transactions.length).padStart(6, '0')}`,
      dateMain: 'Today, Manual Entry',
      dateSub: this.addForm.date || 'Jan 23, 2024',
      memberName,
      memberId,
      memberInitials: this.initials(memberName),
      avatarColor: '#00d084',
      type,
      method,
      methodIcon: this.methodCode(method),
      amount: Number(this.addForm.amount),
      fee: method === 'Cash' || method === 'Cheque' ? 0 : 50,
      status: this.addForm.autoApprove ? 'Success' : 'Pending',
      reference: this.addForm.reference || 'MANUAL-ENTRY',
      subText: this.addForm.description || 'Manual transaction',
    };

    this.transactions = [newTransaction, ...this.transactions];
    this.showAddModal = false;
    this.showToast('Manual transaction added.', 'success');
  }

  startReconciliation(): void {
    this.showReconcileModal = false;
    this.showToast('Reconciliation started.', 'success');
  }

  approveTransaction(txn: Transaction): void {
    txn.status = 'Success';
  }

  rejectTransaction(txn: Transaction): void {
    txn.status = 'Failed';
  }

  retryTransaction(txn: Transaction): void {
    txn.status = 'Pending';
  }

  generateReceipt(txn: Transaction): void {
    this.activeTxn = txn;
    this.quickActionMessage = `Receipt generated for ${txn.id}.`;
  }

  sendToMember(txn: Transaction): void {
    this.quickActionMessage = `Transaction details queued for ${txn.memberName}.`;
  }

  reverseTransaction(txn: Transaction): void {
    this.quickActionMessage = `Reversal review opened for ${txn.id}.`;
  }

  voidTransaction(txn: Transaction): void {
    this.quickActionMessage = `Void request prepared for ${txn.id}.`;
  }

  startAddNote(): void {
    this.addingNote = true;
    this.noteDraft = '';
  }

  saveNote(): void {
    const text = this.noteDraft.trim();
    if (!text) return;

    this.notes = [
      {
        author: 'John Maina',
        time: 'Just now',
        text,
      },
      ...this.notes,
    ];
    this.noteDraft = '';
    this.addingNote = false;
  }

  showToast(message: string, type: ToastType = 'success'): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, 2600);
  }

  private emptyEditForm(): EditForm {
    return {
      transactionId: '',
      amount: 0,
      type: 'Deposit',
      status: 'Success',
      reference: '',
      reason: '',
      confirmed: false,
    };
  }

  private emptyAddForm(): AddForm {
    return {
      member: '',
      type: '',
      method: '',
      amount: null,
      date: '',
      time: '',
      reference: '',
      description: '',
      autoApprove: true,
      notifyMember: true,
    };
  }

  private initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  private methodCode(method: string): string {
    if (method.includes('M-Pesa')) return 'MP';
    if (method.includes('Bank')) return 'BK';
    if (method.includes('Cash')) return 'CA';
    if (method.includes('Cheque')) return 'CQ';
    return 'TX';
  }
}