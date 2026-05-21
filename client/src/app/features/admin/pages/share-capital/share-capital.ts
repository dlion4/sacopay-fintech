import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ─── Interfaces ─── */
export type ShareType = 'Ordinary' | 'Preferential' | 'Bonus';
export type TierType = 'Gold' | 'Silver' | 'Bronze';
export type CertStatus = 'Issued' | 'Pending';
export type PurchaseStatus = 'Completed' | 'Pending' | 'Rejected';
export type TransferStatus = 'Pending Approval' | 'Approved' | 'Rejected';

export interface ShareHolder {
  id: string; memberId: string; name: string; email: string; initials: string; avClass: string;
  totalShares: number; shareValue: number; shareType: ShareType; tier: TierType;
  lastActivity: string; certStatus: CertStatus; certNo: string;
}

export interface SharePurchase {
  id: string; memberId: string; memberName: string; initials: string; avClass: string;
  dateTime: string; sharesPurchased: number; amountPaid: number;
  paymentMethod: string; shareType: ShareType; status: PurchaseStatus;
}

export interface ShareTransfer {
  id: string; status: TransferStatus; submittedTime: string;
  fromName: string; fromId: string; fromInitials: string; fromAvClass: string;
  fromCurrentShares: number; transferShares: number;
  toName: string; toId: string; toInitials: string; toAvClass: string;
  toCurrentShares: number; reason: string; amountValue: number;
}

export interface CertRequest {
  id: string; memberName: string; memberId: string; initials: string; avClass: string;
  totalShares: number; shareValue: number; shareType: ShareType; requestedDate: string;
}

export interface DividendRecord {
  year: number; totalCapital: string; dividendRate: number; totalDistributed: string;
  members: number; distributionDate: string; status: 'Completed' | 'Projected';
}

export interface Toast { id: string; msg: string; type: 'success' | 'error' | 'warning' | 'info'; }

@Component({
  selector: 'app-share-capital',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./share-capital.html',
  styleUrls: ['./share-capital.scss']
})
export class SharesCapitalComponent implements OnInit, OnDestroy {
  /* ─── Tab ─── */
  activeTab: 'all' | 'purchases' | 'transfers' | 'certificates' | 'dividends' | 'analytics' = 'all';

  /* ─── Toast ─── */
  toasts: Toast[] = [];
  private _toastTimers: ReturnType<typeof setTimeout>[] = [];
  showToast(msg: string, type: Toast['type'] = 'success') {
    const id = Math.random().toString(36).slice(2, 9);
    this.toasts.push({ id, msg, type });
    const t = setTimeout(() => this.dismissToast(id), 3800);
    this._toastTimers.push(t);
  }
  dismissToast(id: string) { this.toasts = this.toasts.filter(t => t.id !== id); }
  ngOnDestroy() { this._toastTimers.forEach(clearTimeout); }

  /* ─── Modal State ─── */
  activeModal: string | null = null;
  selectedHolder: ShareHolder | null = null;
  selectedPurchase: SharePurchase | null = null;
  selectedTransfer: ShareTransfer | null = null;
  selectedCert: CertRequest | null = null;
  selectedDividend: DividendRecord | null = null;

  openModal(name: string, data?: any) {
    this.activeModal = name;
    if (data instanceof Object && 'memberId' in data && 'totalShares' in data && 'certStatus' in data) {
      this.selectedHolder = data as ShareHolder;
    } else if (data instanceof Object && 'sharesPurchased' in data) {
      this.selectedPurchase = data as SharePurchase;
    } else if (data instanceof Object && 'fromName' in data) {
      this.selectedTransfer = data as ShareTransfer;
    } else if (data instanceof Object && 'requestedDate' in data) {
      this.selectedCert = data as CertRequest;
    } else if (data instanceof Object && 'year' in data) {
      this.selectedDividend = data as DividendRecord;
    }
  }
  closeModal() {
    this.activeModal = null;
    this.selectedHolder = null;
    this.selectedPurchase = null;
    this.selectedTransfer = null;
    this.selectedCert = null;
    this.selectedDividend = null;
  }

  /* ─── Search/Filters ─── */
  globalSearch = '';
  allSharesTierFilter = 'All Tiers';
  allSharesTypeFilter = 'All Types';
  purchaseDateFrom = '2026-05-20';
  purchaseDateTo = '2026-05-20';
  allSharesPage = 1;
  purchasesPage = 1;
  transfersPage = 1;
  certsPage = 1;
  perPage = 5;

  /* ─── Purchase Form ─── */
  pf_member = '';
  pf_shareType = 'Ordinary Shares';
  pf_numShares = '';
  pf_paymentMethod = '';
  pf_paymentRef = '';
  pf_notes = '';
  pf_autoApprove = true;
  pf_sendSms = true;
  pf_generateCert = false;
  get pf_totalAmount(): number { return (parseInt(this.pf_numShares) || 0) * 500; }

  /* ─── Transfer Form ─── */
  tf_fromMember = '';
  tf_toMember = '';
  tf_numShares = '';
  tf_reason = '';
  tf_notes = '';
  tf_notifyBoth = true;
  tf_authPin = '';

  /* ─── Configure Share Value Form ─── */
  cfg_shareValue = 500;
  cfg_minShares = 10;
  cfg_maxShares = 1000;

  /* ─── Dividend Calc Form ─── */
  div_year = '2025';
  div_rate = '12.5';
  div_method = 'Weighted Average (Days Hold)';
  get div_totalDividend(): number { return 234000000 * (parseFloat(this.div_rate) / 100); }
  get div_avgPerMember(): number { return Math.round(this.div_totalDividend / 2847); }

  /* ─── Certificate Generate Form ─── */
  cert_member = '';
  cert_shareType = 'Ordinary Shares';
  cert_certNo = '';
  cert_issueDate = '2026-01-15';

  /* ─── Export Form ─── */
  exp_format = 'Excel';
  exp_range = 'All Time';
  exp_type = 'All Types';
  exp_progress = 0;
  exp_running = false;
  private _expInterval: any = null;

  startExport() {
    this.exp_running = true; this.exp_progress = 0;
    this._expInterval = setInterval(() => {
      this.exp_progress += 16;
      if (this.exp_progress >= 100) {
        clearInterval(this._expInterval);
        setTimeout(() => {
          this.exp_running = false;
          this.showToast(`Exported to ${this.exp_format} successfully.`);
          this.closeModal();
          this.exp_progress = 0;
        }, 300);
      }
    }, 120);
  }

  /* ─── Bulk transfer selection ─── */
  selectedTransferIds: string[] = [];
  toggleTransferSel(id: string) {
    if (this.selectedTransferIds.includes(id)) {
      this.selectedTransferIds = this.selectedTransferIds.filter(x => x !== id);
    } else { this.selectedTransferIds.push(id); }
  }
  bulkApproveTransfers() {
    const count = this.selectedTransferIds.length;
    if (!count) { this.showToast('No transfers selected.', 'error'); return; }
    this.transfers = this.transfers.map(t =>
      this.selectedTransferIds.includes(t.id) ? { ...t, status: 'Approved' as const } : t
    );
    this.showToast(`${count} transfer(s) approved.`);
    this.selectedTransferIds = [];
  }
  bulkRejectTransfers() {
    const count = this.selectedTransferIds.length;
    if (!count) { this.showToast('No transfers selected.', 'error'); return; }
    this.transfers = this.transfers.map(t =>
      this.selectedTransferIds.includes(t.id) ? { ...t, status: 'Rejected' as const } : t
    );
    this.showToast(`${count} transfer(s) rejected.`, 'warning');
    this.selectedTransferIds = [];
  }
  onCertAction(): void {
    this.showToast('Certificate generated!');
    this.closeModal();
  }
  /* ─── Cert selection ─── */
  selectedCertIds: string[] = [];
  toggleCertSel(id: string) {
    if (this.selectedCertIds.includes(id)) { this.selectedCertIds = this.selectedCertIds.filter(x => x !== id); }
    else { this.selectedCertIds.push(id); }
  }
  bulkGenerateCerts() {
    if (!this.selectedCertIds.length) { this.showToast('No certificates selected.', 'error'); return; }
    this.certRequests = this.certRequests.filter(c => !this.selectedCertIds.includes(c.id));
    this.showToast(`${this.selectedCertIds.length} certificate(s) generated.`);
    this.selectedCertIds = [];
  }

  /* ─── All Shares selection ─── */
  selectedHolderIds: string[] = [];
  toggleHolderSel(id: string) {
    if (this.selectedHolderIds.includes(id)) { this.selectedHolderIds = this.selectedHolderIds.filter(x => x !== id); }
    else { this.selectedHolderIds.push(id); }
  }
  toggleAllHolders() {
    const ids = this.filteredHolders.map(h => h.id);
    this.selectedHolderIds = this.selectedHolderIds.length === ids.length ? [] : [...ids];
  }

  /* ─── Main Data ─── */
  holders: ShareHolder[] = [
    { id: 'H1', memberId: 'R-00123', name: 'Sarah Akinyi', email: 'sarah@email.com', initials: 'SA', avClass: 'av-sa', totalShares: 850, shareValue: 425000, shareType: 'Ordinary', tier: 'Gold', lastActivity: 'Jan 12, 2026', certStatus: 'Issued', certNo: 'CERT-2024-00123' },
    { id: 'H2', memberId: 'R-00045', name: 'David Kipkorir', email: 'david@email.com', initials: 'DK', avClass: 'av-dk', totalShares: 320, shareValue: 160000, shareType: 'Ordinary', tier: 'Silver', lastActivity: 'Jan 10, 2026', certStatus: 'Issued', certNo: 'CERT-2024-00045' },
    { id: 'H3', memberId: 'R-00234', name: 'Mary Wanjiku', email: 'mary@email.com', initials: 'MW', avClass: 'av-mw', totalShares: 150, shareValue: 75000, shareType: 'Preferential', tier: 'Silver', lastActivity: 'Jan 8, 2026', certStatus: 'Pending', certNo: '' },
    { id: 'H4', memberId: 'R-00456', name: 'John Otieno', email: 'john@email.com', initials: 'JO', avClass: 'av-jo', totalShares: 45, shareValue: 22500, shareType: 'Ordinary', tier: 'Bronze', lastActivity: 'Jan 5, 2026', certStatus: 'Issued', certNo: 'CERT-2024-00456' },
    { id: 'H5', memberId: 'R-00678', name: 'Grace Muthoni', email: 'grace@email.com', initials: 'GM', avClass: 'av-gm', totalShares: 25, shareValue: 12500, shareType: 'Bonus', tier: 'Bronze', lastActivity: 'Jan 3, 2026', certStatus: 'Issued', certNo: 'CERT-2024-00678' },
    { id: 'H6', memberId: 'R-00892', name: 'Peter Njoroge', email: 'peter@email.com', initials: 'PN', avClass: 'av-pn', totalShares: 75, shareValue: 37500, shareType: 'Ordinary', tier: 'Bronze', lastActivity: 'Jan 7, 2026', certStatus: 'Pending', certNo: '' },
    { id: 'H7', memberId: 'R-00550', name: 'Faith Kemunto', email: 'faith@email.com', initials: 'FK', avClass: 'av-fn', totalShares: 650, shareValue: 325000, shareType: 'Ordinary', tier: 'Gold', lastActivity: 'Jan 14, 2026', certStatus: 'Issued', certNo: 'CERT-2024-00550' },
  ];

  purchases: SharePurchase[] = [
    { id: 'SHP-2026-00456', memberId: 'R-00123', memberName: 'Sarah Akinyi', initials: 'SA', avClass: 'av-sa', dateTime: 'Today, 2:45 PM', sharesPurchased: 50, amountPaid: 25000, paymentMethod: 'M-Pesa', shareType: 'Ordinary', status: 'Completed' },
    { id: 'SHP-2026-00455', memberId: 'R-00045', memberName: 'David Kipkorir', initials: 'DK', avClass: 'av-dk', dateTime: 'Today, 1:30 PM', sharesPurchased: 100, amountPaid: 50000, paymentMethod: 'Cash', shareType: 'Ordinary', status: 'Pending' },
    { id: 'SHP-2026-00454', memberId: 'R-00234', memberName: 'Mary Wanjiku', initials: 'MW', avClass: 'av-mw', dateTime: 'Today, 11:20 AM', sharesPurchased: 20, amountPaid: 10000, paymentMethod: 'Bank Transfer', shareType: 'Preferential', status: 'Completed' },
    { id: 'SHP-2026-00453', memberId: 'R-00456', memberName: 'John Otieno', initials: 'JO', avClass: 'av-jo', dateTime: 'Yesterday, 3:10 PM', sharesPurchased: 10, amountPaid: 5000, paymentMethod: 'M-Pesa', shareType: 'Ordinary', status: 'Completed' },
    { id: 'SHP-2026-00452', memberId: 'R-00678', memberName: 'Grace Muthoni', initials: 'GM', avClass: 'av-gm', dateTime: 'Yesterday, 11:45 AM', sharesPurchased: 5, amountPaid: 2500, paymentMethod: 'M-Pesa', shareType: 'Bonus', status: 'Rejected' },
  ];

  transfers: ShareTransfer[] = [
    { id: 'TRF-2026-00889', status: 'Pending Approval', submittedTime: 'Today, 11:30 AM', fromName: 'Sarah Akinyi', fromId: 'R-00123', fromInitials: 'SA', fromAvClass: 'av-sa', fromCurrentShares: 850, transferShares: 100, toName: 'David Kipkorir', toId: 'R-00045', toInitials: 'DK', toAvClass: 'av-dk', toCurrentShares: 320, reason: 'Family share transfer - inheritance from parent to child', amountValue: 50000 },
    { id: 'TRF-2026-00888', status: 'Pending Approval', submittedTime: 'Yesterday, 4:15 PM', fromName: 'Mary Wanjiku', fromId: 'R-00234', fromInitials: 'MW', fromAvClass: 'av-mw', fromCurrentShares: 150, transferShares: 50, toName: 'John Otieno', toId: 'R-00456', toInitials: 'JO', toAvClass: 'av-jo', toCurrentShares: 45, reason: 'Sale of shares at agreed price', amountValue: 25000 },
    { id: 'TRF-2026-00887', status: 'Approved', submittedTime: 'Jan 20, 2026, 10:05 AM', fromName: 'Faith Kemunto', fromId: 'R-00550', fromInitials: 'FK', fromAvClass: 'av-fn', fromCurrentShares: 700, transferShares: 50, toName: 'Grace Muthoni', toId: 'R-00678', toInitials: 'GM', toAvClass: 'av-gm', toCurrentShares: 25, reason: 'Internal transfer – agreed reallocation', amountValue: 25000 },
  ];

  certRequests: CertRequest[] = [
    { id: 'CR1', memberName: 'Mary Wanjiku', memberId: 'R-00234', initials: 'MW', avClass: 'av-mw', totalShares: 150, shareValue: 75000, shareType: 'Preferential', requestedDate: 'Jan 8, 2026' },
    { id: 'CR2', memberName: 'Peter Njoroge', memberId: 'R-00892', initials: 'PN', avClass: 'av-pn', totalShares: 75, shareValue: 37500, shareType: 'Ordinary', requestedDate: 'Jan 7, 2026' },
  ];

  dividendHistory: DividendRecord[] = [
    { year: 2025, totalCapital: 'KES 234M', dividendRate: 12.5, totalDistributed: 'KES 29.25M', members: 2847, distributionDate: 'Dec 15, 2025', status: 'Completed' },
    { year: 2024, totalCapital: 'KES 198M', dividendRate: 11.8, totalDistributed: 'KES 23.4M', members: 2456, distributionDate: 'Dec 18, 2024', status: 'Completed' },
    { year: 2023, totalCapital: 'KES 156M', dividendRate: 10.5, totalDistributed: 'KES 16.4M', members: 2123, distributionDate: 'Dec 20, 2023', status: 'Completed' },
    { year: 2026, totalCapital: 'KES 250M (est.)', dividendRate: 13.9, totalDistributed: 'KES 32.5M (proj.)', members: 2847, distributionDate: 'Dec 2026 (est.)', status: 'Projected' },
  ];

  topShareholders = [
    { rank: 1, name: 'Sarah Akinyi', initials: 'SA', avClass: 'av-sa', totalShares: 850, shareValue: 425000, pct: '0.18%', tier: 'Gold' },
    { rank: 2, name: 'James Ochieng', initials: 'JO', avClass: 'av-jo', totalShares: 780, shareValue: 390000, pct: '0.17%', tier: 'Gold' },
    { rank: 3, name: 'Faith Kemunto', initials: 'FK', avClass: 'av-fn', totalShares: 650, shareValue: 325000, pct: '0.14%', tier: 'Gold' },
    { rank: 4, name: 'David Kipkorir', initials: 'DK', avClass: 'av-dk', totalShares: 320, shareValue: 160000, pct: '0.07%', tier: 'Silver' },
    { rank: 5, name: 'Rose Nyambura', initials: 'RN', avClass: 'av-rn', totalShares: 280, shareValue: 140000, pct: '0.06%', tier: 'Silver' },
  ];

  growthData = [
    { label: '180M', period: 'Feb' },
    { label: '188M', period: 'Mar' },
    { label: '195M', period: 'Apr' },
    { label: '204M', period: 'May' },
    { label: '212M', period: 'Jun' },
    { label: '220M', period: 'Jul' },
    { label: '226M', period: 'Aug' },
    { label: '234M', period: 'Jan' },
  ];

  growthBars = [55, 62, 68, 75, 81, 88, 93, 100];

  /* ─── Filtered ─── */
  get filteredHolders(): ShareHolder[] {
    let h = [...this.holders];
    if (this.allSharesTierFilter !== 'All Tiers') h = h.filter(x => x.tier === this.allSharesTierFilter);
    if (this.allSharesTypeFilter !== 'All Types') h = h.filter(x => x.shareType === this.allSharesTypeFilter);
    if (this.globalSearch) {
      const s = this.globalSearch.toLowerCase();
      h = h.filter(x => x.name.toLowerCase().includes(s) || x.memberId.toLowerCase().includes(s) || x.email.toLowerCase().includes(s));
    }
    return h;
  }
  get pagedHolders(): ShareHolder[] { return this.filteredHolders.slice((this.allSharesPage - 1) * this.perPage, this.allSharesPage * this.perPage); }
  get holdersPageCount(): number { return Math.max(1, Math.ceil(this.filteredHolders.length / this.perPage)); }
  get holdersPages(): number[] { return Array.from({ length: Math.min(this.holdersPageCount, 4) }, (_, i) => i + 1); }

  get pendingTransfers(): ShareTransfer[] { return this.transfers.filter(t => t.status === 'Pending Approval'); }
  get pagedPurchases(): SharePurchase[] { return this.purchases.slice((this.purchasesPage - 1) * this.perPage, this.purchasesPage * this.perPage); }
  get purchasePagesArr(): number[] { return Array.from({ length: Math.max(1, Math.ceil(this.purchases.length / this.perPage)) }, (_, i) => i + 1); }

  showMoreTransfers = false;
  get visibleTransfers(): ShareTransfer[] {
    const pending = this.transfers.filter(t => t.status === 'Pending Approval');
    return this.showMoreTransfers ? pending : pending.slice(0, 2);
  }

  /* ─── Actions ─── */
  approveTransfer(t: ShareTransfer) {
    this.transfers = this.transfers.map(x => x.id === t.id ? { ...x, status: 'Approved' as const } : x);
    this.showToast(`Transfer ${t.id} approved successfully.`);
    this.closeModal();
  }
  rejectTransfer(t: ShareTransfer) {
    this.transfers = this.transfers.map(x => x.id === t.id ? { ...x, status: 'Rejected' as const } : x);
    this.showToast(`Transfer ${t.id} rejected.`, 'warning');
    this.closeModal();
  }
  approvePurchase(p: SharePurchase) {
    this.purchases = this.purchases.map(x => x.id === p.id ? { ...x, status: 'Completed' as const } : x);
    this.showToast(`Purchase ${p.id} approved.`);
    this.closeModal();
  }
  rejectPurchase(p: SharePurchase) {
    this.purchases = this.purchases.map(x => x.id === p.id ? { ...x, status: 'Rejected' as const } : x);
    this.showToast(`Purchase ${p.id} rejected.`, 'warning');
    this.closeModal();
  }
  generateCert(c: CertRequest) {
    this.certRequests = this.certRequests.filter(x => x.id !== c.id);
    const h = this.holders.find(x => x.memberId === c.memberId);
    if (h) {
      this.holders = this.holders.map(x => x.memberId === c.memberId ? { ...x, certStatus: 'Issued' as const, certNo: `CERT-2026-${c.memberId}` } : x);
    }
    this.showToast(`Certificate generated for ${c.memberName}.`);
    this.closeModal();
  }
  recordPurchase() {
    if (!this.pf_member || !this.pf_numShares || !this.pf_paymentMethod) {
      this.showToast('Please fill all required fields.', 'error'); return;
    }
    const n = parseInt(this.pf_numShares) || 0;
    const newP: SharePurchase = {
      id: `SHP-2026-${Math.floor(1000 + Math.random() * 8000)}`,
      memberId: 'R-NEW', memberName: this.pf_member, initials: this.pf_member.slice(0, 2).toUpperCase(), avClass: 'av-sa',
      dateTime: 'Just now', sharesPurchased: n, amountPaid: n * 500,
      paymentMethod: this.pf_paymentMethod, shareType: (this.pf_shareType.split(' ')[0] as ShareType),
      status: this.pf_autoApprove ? 'Completed' : 'Pending',
    };
    this.purchases.unshift(newP);
    this.showToast(`Purchase ${newP.id} recorded successfully.`);
    this.pf_member = ''; this.pf_numShares = ''; this.pf_paymentMethod = ''; this.pf_paymentRef = ''; this.pf_notes = '';
    this.closeModal();
  }
  initiateTransfer() {
    if (!this.tf_fromMember || !this.tf_toMember || !this.tf_numShares) {
      this.showToast('Please fill all required fields.', 'error'); return;
    }
    const newT: ShareTransfer = {
      id: `TRF-2026-${Math.floor(1000 + Math.random() * 8000)}`,
      status: 'Pending Approval', submittedTime: 'Just now',
      fromName: this.tf_fromMember, fromId: 'R-FROM', fromInitials: this.tf_fromMember.slice(0, 2).toUpperCase(), fromAvClass: 'av-sa', fromCurrentShares: 200,
      transferShares: parseInt(this.tf_numShares) || 0, amountValue: (parseInt(this.tf_numShares) || 0) * 500,
      toName: this.tf_toMember, toId: 'R-TO', toInitials: this.tf_toMember.slice(0, 2).toUpperCase(), toAvClass: 'av-dk', toCurrentShares: 100,
      reason: this.tf_reason || 'Member requested transfer',
    };
    this.transfers.unshift(newT);
    this.showToast(`Transfer ${newT.id} initiated.`);
    this.tf_fromMember = ''; this.tf_toMember = ''; this.tf_numShares = ''; this.tf_reason = ''; this.tf_authPin = '';
    this.closeModal();
  }
  saveShareConfig() {
    this.showToast(`Share configuration saved. Value: KES ${this.cfg_shareValue.toLocaleString()}/share.`);
    this.closeModal();
  }
  processDistribute() {
    this.showToast(`Dividend of KES ${Math.round(this.div_totalDividend).toLocaleString()} queued for distribution.`);
    this.closeModal();
  }
  saveDraftDividend() { this.showToast('Dividend draft saved.', 'info'); }
  sendShareStatement(h: ShareHolder) { this.showToast(`Share statement sent to ${h.email}.`); this.closeModal(); }

  ngOnInit() {}

  /* ─── Utility ─── */
  getTierRankClass(rank: number): string {
    if (rank === 1) return 'gold'; if (rank === 2) return 'silver'; if (rank === 3) return 'bronze'; return '';
  }
  getPurchaseMethodClass(m: string): string {
    if (m === 'M-Pesa') return 'method-mpesa'; if (m === 'Cash') return 'method-cash';
    if (m === 'Bank Transfer') return 'method-bank'; return 'method-cheque';
  }
  getMemberTxnHistory(h: ShareHolder) {
    return [
      { desc: `Purchased ${h.totalShares > 100 ? 50 : 25} shares`, detail: `KES ${(h.totalShares > 100 ? 50 : 25) * 500 | 0} via M-Pesa · Jan 12, 2026` },
      { desc: 'Dividend Received', detail: `KES ${Math.round(h.shareValue * 0.125).toLocaleString()} (12.5% on KES ${h.shareValue.toLocaleString()}) · Dec 15, 2025` },
      { desc: `Purchased ${h.totalShares > 100 ? 100 : 20} shares`, detail: `KES ${(h.totalShares > 100 ? 50000 : 10000).toLocaleString()} via Bank Transfer · Nov 30, 2025` },
    ];
  }
}
