import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// ═══════════════════════════════════════════════════════════════
// INTERFACES — All properties the component + template need
// ═══════════════════════════════════════════════════════════════

export type TransactionTab = 'All' | 'Alpha Deposits' | 'Shares Capital' | 'Loan Repayments' | 'Others';

export type TransactionType = 'credit' | 'debit';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Disputed';

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  // Added missing properties:
  description: string;
  accountType: string;
  method: string;
  type: TransactionType;
  memberId: string;
  notes: string;
  attachment: string | null;
}

export interface TransactionStats {
  totalCount: number;
  totalAmount?: number;  // ← optional
  shareCapital: number;
  alphaDeposits: number;
  outstandingLoans: number;
  totalSaved: number;
}

@Component({
  selector: 'sacco-member-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss']
})
export class TransactionsComponent implements OnInit {
  // State variables
  isLoading = false;
  errorMessage: string | null = null;

  // Strict Null Safety declarations
  transactions: Transaction[] = [];
  selectedTab: TransactionTab = 'All';

  // Filters (Two-way binded via FormsModule ngModel)
  searchQuery = '';
  statusFilter = 'All';
  methodFilter = 'All';
  startDateFilter = '';
  endDateFilter = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Sorting
  sortBy: 'date' | 'amount' | 'status' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Modal Controls
  showAddModal = false;
  showReceiptModal = false;
  showExportModal = false;
  showDisputeModal = false;

  // Selected items for detailed modals (Null-Safe default or optional type)
  selectedTransaction: Transaction | null = null;
  disputedTransaction: Transaction | null = null;

  // Form variables for recording new transactions
  newTransaction = {
    accountType: 'Alpha Deposits',
    amount: null as number | null,
    method: 'M-Pesa',
    reference: '',
    notes: '',
    date: ''
  };

  // Form variables for Exporting
  exportFormat: 'csv' | 'pdf' | 'excel' = 'pdf';
  exportDateRange: 'all' | 'month' | 'custom' = 'all';
  exportFields = {
    date: true,
    id: true,
    reference: true,
    account: true,
    amount: true,
    status: true,
    notes: true
  };

  // Form variables for Disputes
  disputeCategory = 'Missing Transaction';
  disputeExplanation = '';
  disputeEmail = 'member@saccopay.com';

  // Dynamic calculations for Sacco Stats
  stats: TransactionStats = {
    shareCapital: 0,
    alphaDeposits: 0,
    outstandingLoans: 0,
    totalSaved: 0,
    totalCount: 0,
    totalAmount: 0  // ← ADD THIS
  };

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;

    // Simulate API fetch
    setTimeout(() => {
      try {
        this.transactions = [
          {
            id: 'TXN-10284',
            date: '2026-02-20T14:35:00Z',
            reference: 'QJH987HK89',
            description: 'Monthly Alpha Deposits Contribution',
            accountType: 'Alpha Deposits',
            method: 'M-Pesa',
            amount: 5000,
            type: 'credit',
            status: 'Completed',
            memberId: 'MEM-80293',
            notes: 'Automatic monthly contribution via Lipa na M-Pesa paybill.',
            attachment: 'receipt_mpesa_qjh987.png'
          },
          {
            id: 'TXN-10283',
            date: '2026-02-19T09:12:00Z',
            reference: 'EQT9834761',
            description: 'Development Loan Repayment',
            accountType: 'Loan Repayments',
            method: 'Equity Bank Transfer',
            amount: 12500,
            type: 'debit',
            status: 'Completed',
            memberId: 'MEM-80293',
            notes: 'Loan repayment for development loan Ref: LN-2025-89',
            attachment: 'bank_slip_eqt983.pdf'
          },
          {
            id: 'TXN-10282',
            date: '2026-02-18T17:45:00Z',
            reference: 'QJH234JK77',
            description: 'Share Capital Top-up',
            accountType: 'Shares Capital',
            method: 'M-Pesa',
            amount: 2000,
            type: 'credit',
            status: 'Completed',
            memberId: 'MEM-80293',
            notes: 'Buying extra cooperative shares to boost voting weight and dividends.',
            attachment: null
          },
          {
            id: 'TXN-10281',
            date: '2026-02-18T10:30:00Z',
            reference: 'WAV8893241',
            description: 'Diaspora Prime Savings Deposit',
            accountType: 'Alpha Deposits',
            method: 'Wave Transfer',
            amount: 15000,
            type: 'credit',
            status: 'Pending',
            memberId: 'MEM-80293',
            notes: 'Diaspora savings deposit pending bank clearing.',
            attachment: 'wave_remit_8893.png'
          },
          {
            id: 'TXN-10280',
            date: '2026-02-15T11:00:00Z',
            reference: 'QJH109AA32',
            description: 'Emergency Loan Disbursement Cashout',
            accountType: 'Withdrawals',
            method: 'M-Pesa Withdrawal',
            amount: 10000,
            type: 'debit',
            status: 'Completed',
            memberId: 'MEM-80293',
            notes: 'Emergency loan cash out to registered phone number.',
            attachment: null
          },
          {
            id: 'TXN-10279',
            date: '2026-02-14T08:20:00Z',
            reference: 'SO-903811',
            description: 'Standing Order - Monthly Shares',
            accountType: 'Shares Capital',
            method: 'Standing Order',
            amount: 1000,
            type: 'credit',
            status: 'Completed',
            memberId: 'MEM-80293',
            notes: 'Standing instruction from Prime Account to Shares Capital.',
            attachment: null
          },
          {
            id: 'TXN-10278',
            date: '2026-02-12T15:50:00Z',
            reference: 'QJH098UY12',
            description: 'Cooperative Registration Fee',
            accountType: 'Registration',
            method: 'M-Pesa',
            amount: 1500,
            type: 'debit',
            status: 'Completed',
            memberId: 'MEM-80293',
            notes: 'One-time member registration fee.',
            attachment: 'registration_invoice.pdf'
          },
          {
            id: 'TXN-10277',
            date: '2026-02-10T13:15:00Z',
            reference: 'KCB4489212',
            description: 'Holiday Savings Deposit',
            accountType: 'Alpha Deposits',
            method: 'KCB Bank Transfer',
            amount: 8000,
            type: 'credit',
            status: 'Failed',
            memberId: 'MEM-80293',
            notes: 'Rejected due to incorrect account number in receipt.',
            attachment: 'bank_slip_kcb448.jpg'
          }
        ];
        this.recalculateStats();
      } catch (err) {
        this.errorMessage = 'Failed to load transactions. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    }, 800);
  }

  // Recalculate stats with null-safety checks
  recalculateStats(): void {
    let capital = 0;
    let deposits = 0;
    let loans = 0;

    // Handle null or undefined transactions array safely
    if (this.transactions && this.transactions.length > 0) {
      for (const tx of this.transactions) {
        // Null-safety fallback: use 0 if tx.amount is null/undefined
        const amt = tx?.amount ?? 0;

        if (tx.status === 'Completed' || tx.status === 'Pending') {
          if (tx.accountType === 'Shares Capital') {
            capital += amt;
          } else if (tx.accountType === 'Alpha Deposits') {
            if (tx.type === 'credit') deposits += amt;
            else if (tx.type === 'debit') deposits -= amt;
          } else if (tx.accountType === 'Loan Repayments') {
            // Sacco loans reduce as members repay
            loans -= amt;
          } else if (tx.accountType === 'Withdrawals') {
            deposits -= amt;
          }
        }
      }
    }

    // Base loans in this mock starts at 90,500 KES and reduces with repayments
    this.stats = {
      shareCapital: capital,
      alphaDeposits: deposits,
      outstandingLoans: Math.max(0, 90500 + loans),
      totalSaved: capital + deposits,
      totalCount: this.transactions?.length ?? 0,
      totalAmount: this.transactions?.reduce((sum, tx) => sum + (tx.amount ?? 0), 0) ?? 0  // ← ADD THIS
    };
  }

  // Filtering logic
  get filteredTransactions(): Transaction[] {
    if (!this.transactions) return [];

    return this.transactions
      .filter(tx => {
        // Tab filtering
        if (this.selectedTab === 'Alpha Deposits' && tx.accountType !== 'Alpha Deposits') return false;
        if (this.selectedTab === 'Shares Capital' && tx.accountType !== 'Shares Capital') return false;
        if (this.selectedTab === 'Loan Repayments' && tx.accountType !== 'Loan Repayments') return false;
        if (this.selectedTab === 'Others' &&
          (tx.accountType === 'Alpha Deposits' ||
            tx.accountType === 'Shares Capital' ||
            tx.accountType === 'Loan Repayments')) return false;

        // Search query (null-safe)
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase().trim();
          const matchesId = tx.id?.toLowerCase().includes(query) ?? false;
          const matchesRef = tx.reference?.toLowerCase().includes(query) ?? false;
          const matchesDesc = tx.description?.toLowerCase().includes(query) ?? false;
          const matchesMethod = tx.method?.toLowerCase().includes(query) ?? false;
          if (!matchesId && !matchesRef && !matchesDesc && !matchesMethod) return false;
        }

        // Status filter
        if (this.statusFilter !== 'All' && tx.status !== this.statusFilter) return false;

        // Method channel filter
        if (this.methodFilter !== 'All') {
          const ch = this.methodFilter.toLowerCase();
          const txCh = tx.method?.toLowerCase() ?? '';
          if (!txCh.includes(ch)) return false;
        }

        // Date filter (null-safe parsing)
        if (this.startDateFilter) {
          const start = new Date(this.startDateFilter).getTime();
          const txTime = new Date(tx.date).getTime();
          if (txTime < start) return false;
        }
        if (this.endDateFilter) {
          const end = new Date(this.endDateFilter).getTime();
          const txTime = new Date(tx.date).getTime();
          if (txTime > end) return false;
        }

        // Amount filters
        const amt = tx.amount ?? 0;
        if (this.minAmount !== null && amt < this.minAmount) return false;
        if (this.maxAmount !== null && amt > this.maxAmount) return false;

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (this.sortBy === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (this.sortBy === 'amount') {
          comparison = (a.amount ?? 0) - (b.amount ?? 0);
        } else if (this.sortBy === 'status') {
          comparison = a.status.localeCompare(b.status);
        }
        return this.sortOrder === 'desc' ? -comparison : comparison;
      });
  }

  // Pagination Calculations
  get paginatedTransactions(): Transaction[] {
    const list = this.filteredTransactions;
    const startIdx = (this.currentPage - 1) * this.pageSize;
    return list.slice(startIdx, startIdx + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.pageSize) || 1;
  }

  get startEntryIndex(): number {
    if (this.filteredTransactions.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endEntryIndex(): number {
    const limit = this.currentPage * this.pageSize;
    const total = this.filteredTransactions.length;
    return limit > total ? total : limit;
  }

  // Actions
  setTab(tab: TransactionTab): void {
    this.selectedTab = tab;
    this.currentPage = 1;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleSort(field: 'date' | 'amount' | 'status'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'All';
    this.methodFilter = 'All';
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.minAmount = null;
    this.maxAmount = null;
    this.currentPage = 1;
  }

  // Trigger Modals
  openAddModal(): void {
    const today = new Date();
    this.newTransaction = {
      accountType: 'Alpha Deposits',
      amount: null,
      method: 'M-Pesa',
      reference: '',
      notes: '',
      date: today.toISOString().split('T')[0]
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  submitTransaction(): void {
    // Null-safety & validation guard
    if (!this.newTransaction.amount || this.newTransaction.amount <= 0) {
      alert('Please enter a valid transaction amount.');
      return;
    }
    if (!this.newTransaction.reference) {
      alert('Please enter a payment reference code.');
      return;
    }

    const generatedId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const record: Transaction = {
      id: generatedId,
      date: this.newTransaction.date ? new Date(this.newTransaction.date).toISOString() : new Date().toISOString(),
      reference: this.newTransaction.reference.toUpperCase().trim(),
      description: `Member Contribution (${this.newTransaction.accountType})`,
      accountType: this.newTransaction.accountType,
      method: this.newTransaction.method,
      amount: this.newTransaction.amount,
      type: this.newTransaction.accountType === 'Withdrawals' ? 'debit' : 'credit',
      status: 'Pending', // New member-recorded deposits default to pending until reconciled
      memberId: 'MEM-80293',
      notes: this.newTransaction.notes || 'Deposit receipt submitted by member.',
      attachment: null
    };

    // Add to list
    this.transactions = [record, ...this.transactions];
    this.recalculateStats();

    this.closeAddModal();

    // Display feedback
    alert(`Successfully logged Deposit Request! Transaction Reference: ${record.reference}. The Sacco admin will review and reconcile within 4 hours.`);
  }

  openReceiptModal(tx: Transaction): void {
    this.selectedTransaction = tx;
    this.showReceiptModal = true;
  }

  closeReceiptModal(): void {
    this.showReceiptModal = false;
    this.selectedTransaction = null;
  }

  simulateDownloadReceipt(tx: Transaction): void {
    alert(`Downloading PDF Receipt for Transaction ID ${tx?.id ?? 'N/A'} (Ref: ${tx?.reference ?? 'N/A'}). Your browser will prompt you to save the PDF file.`);
  }

  openExportModal(): void {
    this.showExportModal = true;
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  submitExport(): void {
    this.isLoading = true;
    this.showExportModal = false;

    setTimeout(() => {
      this.isLoading = false;
      alert(`Successfully compiled and exported ${this.filteredTransactions.length} transactions as a ${this.exportFormat.toUpperCase()} document!`);
    }, 1200);
  }

  openDisputeModal(tx: Transaction): void {
    this.disputedTransaction = tx;
    this.disputeCategory = 'Missing Transaction';
    this.disputeExplanation = '';
    this.showDisputeModal = true;
  }

  closeDisputeModal(): void {
    this.showDisputeModal = false;
    this.disputedTransaction = null;
  }

  submitDispute(): void {
    if (!this.disputeExplanation.trim()) {
      alert('Please explain the nature of your dispute.');
      return;
    }
    const disputeTicket = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    this.showDisputeModal = false;

    alert(`Dispute ticket ${disputeTicket} has been created successfully for transaction ${this.disputedTransaction?.id ?? 'N/A'}. Our customer care will contact you at ${this.disputeEmail} within 24 hours.`);
    this.disputedTransaction = null;
  }
}