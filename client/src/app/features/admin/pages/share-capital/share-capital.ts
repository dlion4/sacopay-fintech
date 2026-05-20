import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ==================== INTERFACES ====================
interface Member {
  id: string;
  memberId: string;
  initials: string;
  name: string;
  email: string;
  totalShares: number;
  shareValue: number;
  shareType: 'Ordinary' | 'Preferential' | 'Bonus';
  tier: 'Gold' | 'Silver' | 'Bronze';
  lastActivity: string;
  certificateStatus: 'Issued' | 'Pending';
}

interface Purchase {
  purchaseId: string;
  dateTime: string;
  memberInitials: string;
  memberName: string;
  sharesPurchased: number;
  amountPaid: number;
  paymentMethod: string;
  paymentIcon: string;
  shareType: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface Transfer {
  transferId: string;
  status: string;
  submitted: string;
  fromInitials: string;
  fromName: string;
  fromId: string;
  fromShares: number;
  fromChange: number;
  toInitials: string;
  toName: string;
  toId: string;
  toShares: number;
  toChange: number;
  sharesToTransfer: number;
  transferValue: number;
  reason: string;
}

interface CertificateRequest {
  initials: string;
  name: string;
  memberId: string;
  totalShares: number;
  shareValue: number;
  shareType: string;
  requested: string;
}

interface DividendRecord {
  year: number;
  totalCapital: string;
  dividendRate: string;
  totalDistributed: string;
  members: number;
  distributionDate: string;
  status: string;
}

interface GrowthData {
  month: string;
  value: string;
  height: number;
}

interface TopShareholder {
  rank: number;
  name: string;
  totalShares: number;
  shareValue: string;
  percentOfTotal: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info' | 'primary';
  visible: boolean;
}

interface Modals {
  shareConfig: boolean;
  memberDetail: boolean;
  purchaseDetail: boolean;
  addShares: boolean;
  quickEntry: boolean;
  dividend: boolean;
  certPreview: boolean;
  export: boolean;
}

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface ExportFormat {
  name: string;
  icon: string;
  desc: string;
  color: string;
}

interface DistributionItem {
  type?: string;
  tier?: string;
  pct: number;
  color: string;
  count: string;
}

// ==================== COMPONENT ====================
@Component({
  selector: 'app-share-capital',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './share-capital.html',
  styleUrls: ['./share-capital.scss']
})
export class ShareCapitalComponent implements OnInit {
  // ==================== STATE ====================
  activeTab: string = 'all-shares';
  toasts: Toast[] = [];
  searchTerm: string = '';
  filterType: string = 'all';
  filterTier: string = 'all';

  // Modal states
  modals: Modals = {
    shareConfig: false,
    memberDetail: false,
    purchaseDetail: false,
    addShares: false,
    quickEntry: false,
    dividend: false,
    certPreview: false,
    export: false
  };

  // Selected items
  selectedMember: Member | null = null;
  selectedPurchase: Purchase | null = null;

  // Share configuration
  sharePrice: number = 500;
  minShares: number = 10;
  maxShares: number = 1000;

  // Form states
  addSharesForm = {
    memberId: '',
    shares: 10,
    paymentMethod: 'M-Pesa',
    shareType: 'Ordinary'
  };

  quickEntryForm = {
    memberId: '',
    shares: 10,
    paymentMethod: 'M-Pesa'
  };

  dividendForm = {
    year: 2026,
    rate: 12.5,
    date: '2026-12-15',
    method: 'savings'
  };

  // Tabs
  tabs: Tab[] = [
    { id: 'all-shares', label: 'All Shares', icon: '📊' },
    { id: 'purchases', label: 'Purchases', icon: '🛒' },
    { id: 'transfers', label: 'Transfers', icon: '🔄' },
    { id: 'certificates', label: 'Certificates', icon: '📜' },
    { id: 'dividends', label: 'Dividends', icon: '💰' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  // Export formats
  exportFormats: ExportFormat[] = [
    { name: 'PDF', icon: '📄', desc: 'Formatted report with charts', color: '#ef4444' },
    { name: 'Excel', icon: '📊', desc: 'Spreadsheet with all data', color: '#22c55e' },
    { name: 'CSV', icon: '📋', desc: 'Raw data comma-separated', color: '#2196f3' },
    { name: 'Print', icon: '🖨️', desc: 'Print-ready format', color: '#64748b' }
  ];

  // Member transactions (for detail modal)
  memberTransactions = [
    { date: 'Jan 12, 2026', type: 'Purchase', shares: '+50', amount: 'KES 25,000' },
    { date: 'Dec 15, 2025', type: 'Dividend', shares: '-', amount: 'KES 53,125' },
    { date: 'Nov 28, 2025', type: 'Purchase', shares: '+100', amount: 'KES 50,000' }
  ];

  // Share type distribution
  shareTypeDistribution: DistributionItem[] = [
    { type: 'Ordinary', pct: 72, color: '#2563eb', count: '340,800 shares' },
    { type: 'Preferential', pct: 18, color: '#9333ea', count: '85,200 shares' },
    { type: 'Bonus', pct: 10, color: '#22c55e', count: '47,000 shares' }
  ];

  // Tier distribution
  tierDistribution: DistributionItem[] = [
    { tier: 'Gold (501+)', pct: 15, color: '#f59e0b', count: '427 members' },
    { tier: 'Silver (101-500)', pct: 35, color: '#94a3b8', count: '997 members' },
    { tier: 'Bronze (10-100)', pct: 50, color: '#cd7f32', count: '1,423 members' }
  ];

  // ==================== DATA ====================
  members: Member[] = [
    {
      id: '1', memberId: 'R-00123', initials: 'SA', name: 'Sarah Akinyi', email: 'sarah@email.com',
      totalShares: 850, shareValue: 425000, shareType: 'Ordinary', tier: 'Gold',
      lastActivity: 'Jan 12, 2026', certificateStatus: 'Issued'
    },
    {
      id: '2', memberId: 'R-00045', initials: 'DK', name: 'David Kipkorir', email: 'david@email.com',
      totalShares: 320, shareValue: 160000, shareType: 'Ordinary', tier: 'Silver',
      lastActivity: 'Jan 10, 2026', certificateStatus: 'Issued'
    },
    {
      id: '3', memberId: 'R-00234', initials: 'MW', name: 'Mary Wanjiku', email: 'mary@email.com',
      totalShares: 150, shareValue: 75000, shareType: 'Preferential', tier: 'Silver',
      lastActivity: 'Jan 8, 2026', certificateStatus: 'Pending'
    },
    {
      id: '4', memberId: 'R-00456', initials: 'JO', name: 'John Otieno', email: 'john@email.com',
      totalShares: 45, shareValue: 22500, shareType: 'Ordinary', tier: 'Bronze',
      lastActivity: 'Jan 5, 2026', certificateStatus: 'Issued'
    },
    {
      id: '5', memberId: 'R-00678', initials: 'GM', name: 'Grace Muthoni', email: 'grace@email.com',
      totalShares: 25, shareValue: 12500, shareType: 'Bonus', tier: 'Bronze',
      lastActivity: 'Jan 3, 2026', certificateStatus: 'Issued'
    }
  ];

  purchases: Purchase[] = [
    {
      purchaseId: 'SHP-2026-00456', dateTime: 'Today, 2:45 PM', memberInitials: 'SA',
      memberName: 'Sarah Akinyi', sharesPurchased: 50, amountPaid: 25000,
      paymentMethod: 'M-Pesa', paymentIcon: '📱', shareType: 'Ordinary', status: 'Completed'
    },
    {
      purchaseId: 'SHP-2026-00455', dateTime: 'Today, 1:30 PM', memberInitials: 'DK',
      memberName: 'David Kipkorir', sharesPurchased: 100, amountPaid: 50000,
      paymentMethod: 'Cash', paymentIcon: '💵', shareType: 'Ordinary', status: 'Pending'
    },
    {
      purchaseId: 'SHP-2026-00454', dateTime: 'Today, 11:20 AM', memberInitials: 'MW',
      memberName: 'Mary Wanjiku', sharesPurchased: 20, amountPaid: 10000,
      paymentMethod: 'Bank Transfer', paymentIcon: '🏦', shareType: 'Preferential', status: 'Completed'
    }
  ];

  transfers: Transfer[] = [
    {
      transferId: 'TRF-2026-00089', status: 'Pending Approval', submitted: 'Today, 11:30 AM',
      fromInitials: 'SA', fromName: 'Sarah Akinyi', fromId: 'R-00123', fromShares: 850, fromChange: -100,
      toInitials: 'DK', toName: 'David Kipkorir', toId: 'R-00045', toShares: 320, toChange: 100,
      sharesToTransfer: 100, transferValue: 50000,
      reason: 'Family share transfer - inheritance from parent to child'
    },
    {
      transferId: 'TRF-2026-00088', status: 'Pending Approval', submitted: 'Yesterday, 4:15 PM',
      fromInitials: 'MW', fromName: 'Mary Wanjiku', fromId: 'R-00234', fromShares: 150, fromChange: -50,
      toInitials: 'JO', toName: 'John Otieno', toId: 'R-00456', toShares: 45, toChange: 50,
      sharesToTransfer: 50, transferValue: 25000,
      reason: 'Sale of shares at agreed price'
    }
  ];

  certificateRequests: CertificateRequest[] = [
    {
      initials: 'MW', name: 'Mary Wanjiku', memberId: 'R-00234',
      totalShares: 150, shareValue: 75000, shareType: 'Preferential', requested: 'Jan 8, 2026'
    },
    {
      initials: 'PN', name: 'Peter Njoroge', memberId: 'R-00892',
      totalShares: 75, shareValue: 37500, shareType: 'Ordinary', requested: 'Jan 7, 2026'
    }
  ];

  dividendRecords: DividendRecord[] = [
    { year: 2025, totalCapital: 'KES 234M', dividendRate: '12.5%', totalDistributed: 'KES 29.25M', members: 2847, distributionDate: 'Dec 15, 2025', status: 'Completed' },
    { year: 2024, totalCapital: 'KES 198M', dividendRate: '11.8%', totalDistributed: 'KES 23.4M', members: 2456, distributionDate: 'Dec 18, 2024', status: 'Completed' },
    { year: 2023, totalCapital: 'KES 156M', dividendRate: '10.5%', totalDistributed: 'KES 16.4M', members: 2123, distributionDate: 'Dec 20, 2023', status: 'Completed' }
  ];

  growthData: GrowthData[] = [
    { month: 'Feb', value: '180M', height: 40 },
    { month: 'Mar', value: '188M', height: 48 },
    { month: 'Apr', value: '195M', height: 55 },
    { month: 'May', value: '204M', height: 63 },
    { month: 'Jun', value: '212M', height: 70 },
    { month: 'Jul', value: '220M', height: 78 },
    { month: 'Aug', value: '226M', height: 85 },
    { month: 'Jan', value: '234M', height: 95 }
  ];

  topShareholders: TopShareholder[] = [
    { rank: 1, name: 'Sarah Akinyi', totalShares: 850, shareValue: 'KES 425,000', percentOfTotal: '0.18%', tier: 'Gold' },
    { rank: 2, name: 'James Ochieng', totalShares: 780, shareValue: 'KES 390,000', percentOfTotal: '0.17%', tier: 'Gold' },
    { rank: 3, name: 'Faith Kemunto', totalShares: 650, shareValue: 'KES 325,000', percentOfTotal: '0.14%', tier: 'Gold' },
    { rank: 4, name: 'David Kipkorir', totalShares: 320, shareValue: 'KES 160,000', percentOfTotal: '0.07%', tier: 'Silver' },
    { rank: 5, name: 'Rose Nyambura', totalShares: 280, shareValue: 'KES 140,000', percentOfTotal: '0.06%', tier: 'Silver' }
  ];

  // ==================== COMPUTED ====================
  get filteredMembers(): Member[] {
    return this.members.filter(m => {
      const matchSearch = !this.searchTerm || 
        m.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        m.memberId.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchType = this.filterType === 'all' || m.shareType === this.filterType;
      const matchTier = this.filterTier === 'all' || m.tier === this.filterTier;
      return matchSearch && matchType && matchTier;
    });
  }

  // ==================== LIFECYCLE ====================
  ngOnInit(): void {
    // Initialize component
  }

  // ==================== TOAST METHODS ====================
  showToast(message: string, type: Toast['type'] = 'success'): void {
    const id = Date.now() + Math.random();
    const toast: Toast = { id, message, type, visible: true };
    this.toasts.push(toast);

    setTimeout(() => {
      const idx = this.toasts.findIndex(t => t.id === id);
      if (idx > -1) {
        this.toasts[idx].visible = false;
        setTimeout(() => {
          this.toasts = this.toasts.filter(t => t.id !== id);
        }, 350);
      }
    }, 3500);
  }

  dismissToast(id: number): void {
    const idx = this.toasts.findIndex(t => t.id === id);
    if (idx > -1) {
      this.toasts[idx].visible = false;
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 350);
    }
  }

  // ==================== TAB METHODS ====================
  switchTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // ==================== MODAL METHODS ====================
  openModal(modalName: keyof Modals): void {
    this.modals[modalName] = true;
  }

  closeModal(modalName: keyof Modals): void {
    this.modals[modalName] = false;
  }

  // ==================== MEMBER METHODS ====================
  viewMemberShares(member: Member): void {
    this.selectedMember = member;
    this.openModal('memberDetail');
  }

  openAddSharesFor(member: Member): void {
    this.selectedMember = member;
    this.addSharesForm.memberId = member.memberId;
    this.openModal('addShares');
  }

  // ==================== PURCHASE METHODS ====================
  viewPurchaseDetails(purchase: Purchase): void {
    this.selectedPurchase = purchase;
    this.openModal('purchaseDetail');
  }

  approvePurchase(): void {
    if (this.selectedPurchase) {
      this.showToast('Purchase approved!', 'success');
      this.closeModal('purchaseDetail');
    }
  }

  // ==================== TRANSFER METHODS ====================
  approveTransfer(transferId: string): void {
    this.showToast(`Transfer ${transferId} approved successfully!`, 'success');
  }

  rejectTransfer(transferId: string): void {
    this.showToast(`Transfer ${transferId} rejected.`, 'danger');
  }

  // ==================== CERTIFICATE METHODS ====================
  generateCertificate(memberName: string): void {
    this.showToast(`Certificate generated for ${memberName}`, 'success');
  }

  // ==================== FORM SUBMIT METHODS ====================
  saveShareConfig(): void {
    this.closeModal('shareConfig');
    this.showToast(`Share config updated: KES ${this.sharePrice}/share, Min ${this.minShares}, Max ${this.maxShares}`, 'success');
  }

  submitAddShares(): void {
    if (!this.addSharesForm.memberId) {
      this.showToast('Please select a member', 'warning');
      return;
    }
    const member = this.members.find(m => m.memberId === this.addSharesForm.memberId);
    const name = member ? member.name : this.addSharesForm.memberId;
    this.showToast(`${this.addSharesForm.shares} shares added to ${name} via ${this.addSharesForm.paymentMethod}`, 'success');
    this.closeModal('addShares');
    this.resetAddSharesForm();
  }

  submitQuickEntry(): void {
    if (!this.quickEntryForm.memberId) {
      this.showToast('Please enter a Member ID', 'warning');
      return;
    }
    this.showToast(`Quick entry: ${this.quickEntryForm.shares} shares for ${this.quickEntryForm.memberId} via ${this.quickEntryForm.paymentMethod}`, 'success');
    this.closeModal('quickEntry');
    this.resetQuickEntryForm();
  }

  saveDividendConfig(): void {
    this.closeModal('dividend');
    this.showToast(`Dividend configured: ${this.dividendForm.rate}% for ${this.dividendForm.year}`, 'success');
  }

  exportData(format: string): void {
    this.showToast(`Exporting data as ${format}...`, 'info');
    this.closeModal('export');
  }

  // ==================== RESET FORMS ====================
  resetAddSharesForm(): void {
    this.addSharesForm = {
      memberId: '',
      shares: 10,
      paymentMethod: 'M-Pesa',
      shareType: 'Ordinary'
    };
  }

  resetQuickEntryForm(): void {
    this.quickEntryForm = {
      memberId: '',
      shares: 10,
      paymentMethod: 'M-Pesa'
    };
  }
}
