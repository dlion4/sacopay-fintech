import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TabId = 'overview' | 'history' | 'rules';
type ModalId =
  | 'certificate'
  | 'buy'
  | 'processing'
  | 'success'
  | 'transfer'
  | 'breakdown'
  | 'loanLimit'
  | 'notifications'
  | null;

interface ShareTransaction {
  date: string;
  type: 'Buy' | 'Initial';
  shares: number;
  price: number;
  total: number;
  cumulative: number;
}

@Component({
  selector: 'app-shares',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shares.html',
  styleUrl: './shares.scss',
})
export class SharesComponent {
  activeTab: TabId = 'overview';
  chartRange: '6M' | '1Y' | 'All' = '1Y';
  activeModal: ModalId = null;

  /* ── buy form ── */
  buyQuantity = 10;
  buyPaySource = 'wallet';
  successRef = 'SH-2025-0091';

  /* ── transfer form ── */
  transferTo = '';
  transferShares = 10;
  transferReason = '';
  transferAck = false;

  /* ── toast ── */
  toast: { text: string; tone: 'success' | 'info' | 'warning' } | null = null;

  /* ── data ── */
  readonly totalShares = 120;
  readonly sharePrice = 100;
  readonly availableShares = 100;
  readonly lockedShares = 20;
  readonly totalCapital = 12000;
  readonly lastDividend = 3400;
  readonly ownershipPct = '0.024';
  readonly maxPurchasable = 500;
  readonly projectedDividend = 3600;
  readonly loanMultiplier = 3;
  readonly savingsBalance = 158750;

  readonly transactions: ShareTransaction[] = [
    { date: 'Feb 10, 2025', type: 'Buy', shares: 20, price: 100, total: 2000, cumulative: 120 },
    { date: 'Oct 5, 2024', type: 'Buy', shares: 30, price: 100, total: 3000, cumulative: 100 },
    { date: 'Jul 15, 2024', type: 'Buy', shares: 40, price: 100, total: 4000, cumulative: 70 },
    { date: 'Apr 10, 2024', type: 'Buy', shares: 20, price: 100, total: 2000, cumulative: 30 },
    { date: 'Jan 15, 2024', type: 'Initial', shares: 10, price: 100, total: 1000, cumulative: 10 },
  ];

  /* computed */
  get buyTotal(): number { return this.buyQuantity * this.sharePrice; }
  get newSharesTotal(): number { return this.totalShares + (Number(this.buyQuantity) || 0); }
  get newCapital(): number { return this.newSharesTotal * this.sharePrice; }
  get transferFee(): number { return 200; }
  get remainingAfterTransfer(): number { return this.totalShares - (Number(this.transferShares) || 0); }
  get loanAddition(): number { return this.totalCapital * this.loanMultiplier; }
  get grossLoanLimit(): number { return (this.totalCapital + this.savingsBalance) * this.loanMultiplier; }

  chartPoints(range: string): string {
    const all = [
      [20, 220], [80, 210], [140, 205], [200, 190], [260, 175], [320, 160], [380, 145], [440, 125], [500, 110], [560, 95], [620, 80], [680, 65], [740, 50], [800, 40]
    ];
    const sixM = all.slice(6);
    const pts = range === '6M' ? sixM : all;
    return pts.map(([x, y]) => `${x},${y}`).join(' ');
  }

  setTab(id: TabId): void { this.activeTab = id; }
  setRange(r: '6M' | '1Y' | 'All'): void { this.chartRange = r; }
  openModal(id: ModalId): void { this.activeModal = id; }
  closeModal(): void { this.activeModal = null; }

  submitBuy(): void {
    const qty = Math.max(Number(this.buyQuantity) || 0, 1);
    this.successRef = `SH-2025-${Math.floor(90 + Math.random() * 9).toString().padStart(4, '0')}`;
    this.activeModal = 'processing';
    window.setTimeout(() => { this.activeModal = 'success'; }, 900);
  }

  submitTransfer(): void {
    if (!this.transferTo.trim()) {
      this.showToast('Enter member ID or name.', 'warning');
      return;
    }
    if (this.transferShares < 1 || this.remainingAfterTransfer < 10) {
      this.showToast('Invalid transfer quantity — must retain at least 10 shares.', 'warning');
      return;
    }
    if (!this.transferAck) {
      this.showToast('Please acknowledge the transfer terms.', 'warning');
      return;
    }
    this.closeModal();
    this.showToast('Transfer request submitted. Awaiting admin approval.', 'success');
  }

  downloadCertificate(): void {
    this.closeModal();
    this.showToast('Share certificate PDF prepared for download.', 'success');
  }

  emailCertificate(): void {
    this.closeModal();
    this.showToast('Certificate emailed to your registered address.', 'success');
  }

  exportTransactions(): void {
    this.showToast('Transaction export prepared.', 'success');
  }

showToast(text: string, tone: 'success' | 'info' | 'warning' = 'info'): void {
  this.toast = { text, tone };
  window.setTimeout(() => { this.toast = null; }, 3400);
}
}
