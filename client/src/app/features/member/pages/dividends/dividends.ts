import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type DividendTab = 'dividends' | 'interest' | 'projections' | 'portfolio' | 'tax' | 'payouts';
export type ModalKey =
  | 'policy' | 'projector' | 'buyShares' | 'dividendDetail' | 'interestDetail'
  | 'howItWorks' | 'payoutPreference' | 'taxInfo' | 'certificate' | 'export'
  | 'reinvest' | 'sharePlan' | 'rateHistory' | 'portfolioDetail' | 'agmNotice'
  | 'notificationCenter' | 'claimIssue' | 'depositBoost' | 'beneficiary' | 'whatIf';

export interface DividendRecord {
  year: string;
  gross: number;
  net: number;
  rate: number;
  shares: number;
  shareCapital: number;
  paidOn: string;
  tax: number;
  payout: string;
  status: 'Paid' | 'N/A' | 'Projected';
}

export interface InterestRecord {
  month: string;
  amount: number;
  status: 'Pending' | 'Credited';
  creditedOn: string;
  balance: number;
}

@Component({
  selector: 'app-dividends',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dividends.html',
  styleUrls: ['./dividends.scss'],
})
export class DividendsComponent {
  activeTab: DividendTab = 'dividends';
  activeModal: ModalKey | null = null;
  selectedDividend: DividendRecord | null = null;
  selectedInterest: InterestRecord | null = null;

  totalReturns = 8275;
  dividendsTotal = 3400;
  interestTotal = 4875;
  sharesHeld = 120;
  sharePrice = 100;
  declaredRate = 30;
  whtRate = 5;

  heroStats = [
    { label: 'Last Dividend', value: 'KES 3,400', sub: 'FY 2024 - Paid Dec 2024', tone: 'gold' },
    { label: 'Projected (2025)', value: 'KES 3,600', sub: 'Based on current shares', tone: 'green' },
    { label: 'Interest (YTD)', value: 'KES 725', sub: 'Savings @ 7% p.a.', tone: 'lime' },
    { label: 'Shares Held', value: '120', sub: 'Manage ->', tone: 'blue' },
  ];

  tabs: { key: DividendTab; label: string }[] = [
    { key: 'dividends', label: 'Share Dividends' },
    { key: 'interest', label: 'Savings Interest' },
    { key: 'projections', label: 'Projections' },
    { key: 'portfolio', label: 'Share Portfolio' },
    { key: 'tax', label: 'Tax & Certificates' },
    { key: 'payouts', label: 'Payouts' },
  ];

  dividendRecords: DividendRecord[] = [
    { year: '2024', gross: 3400, net: 3230, rate: 30, shares: 100, shareCapital: 10000, paidOn: 'Dec 20, 2024', tax: 170, payout: 'Savings Account', status: 'Paid' },
    { year: '2023', gross: 0, net: 0, rate: 0, shares: 0, shareCapital: 0, paidOn: 'N/A', tax: 0, payout: 'N/A', status: 'N/A' },
  ];

  interestRecords: InterestRecord[] = [
    { month: 'February 2025', amount: 375, status: 'Pending', creditedOn: 'Credits on Feb 28', balance: 64285 },
    { month: 'January 2025', amount: 350, status: 'Credited', creditedOn: 'Credited Jan 31', balance: 60000 },
    { month: 'December 2024', amount: 325, status: 'Credited', creditedOn: 'Credited Dec 31', balance: 55700 },
    { month: 'November 2024', amount: 310, status: 'Credited', creditedOn: 'Credited Nov 30', balance: 53150 },
    { month: 'October 2024', amount: 295, status: 'Credited', creditedOn: 'Credited Oct 31', balance: 50570 },
  ];

  projectionRows = [
    { year: 2025, shares: 120, dividend: 3600, interest: 4400 },
    { year: 2026, shares: 150, dividend: 4500, interest: 5800 },
    { year: 2027, shares: 180, dividend: 5400, interest: 7200 },
    { year: 2028, shares: 210, dividend: 6300, interest: 8600 },
    { year: 2029, shares: 250, dividend: 7500, interest: 10500 },
  ];

  portfolioLots = [
    { date: 'Jan 2024', shares: 80, value: 8000, qualified: true },
    { date: 'Sep 2024', shares: 40, value: 4000, qualified: false },
  ];

  payoutHistory = [
    { date: 'Dec 20, 2024', type: 'Dividend', amount: 3230, destination: 'Savings Account', status: 'Completed' },
    { date: 'Jan 31, 2025', type: 'Interest', amount: 350, destination: 'Savings Account', status: 'Credited' },
    { date: 'Feb 28, 2025', type: 'Interest', amount: 375, destination: 'Pending', status: 'Pending' },
  ];

  payoutPreference = 'savings';
  reinvestPercent = 50;
  buySharesQty = 30;
  projector = { shares: 120, rate: 30 };
  whatIf = { extraShares: 50, extraSavings: 10000, years: 5 };
  certificateForm = { year: '2024', email: 'john.k@email.com' };
  issueForm = { category: 'Missing payout', message: '' };

  toast: { message: string; type: 'success' | 'info' | 'warning' } | null = null;
  private toastTimer: any;

  setTab(tab: DividendTab): void { this.activeTab = tab; }
  openModal(key: ModalKey): void { this.activeModal = key; document.body.style.overflow = 'hidden'; }
  closeModal(): void { this.activeModal = null; document.body.style.overflow = ''; }

  openDividendDetail(record: DividendRecord): void {
    this.selectedDividend = record;
    if (record.status === 'N/A') { this.showToast('You joined in Jan 2024. No dividend for FY 2023.', 'info'); return; }
    this.openModal('dividendDetail');
  }

  openInterestDetail(row: InterestRecord): void { this.selectedInterest = row; this.openModal('interestDetail'); }

  get shareCapital(): number { return this.projector.shares * this.sharePrice; }
  get projectorGross(): number { return Math.round(this.shareCapital * (this.projector.rate / 100)); }
  get projectorTax(): number { return Math.round(this.projectorGross * (this.whtRate / 100)); }
  get projectorNet(): number { return this.projectorGross - this.projectorTax; }
  get buySharesCost(): number { return this.buySharesQty * this.sharePrice; }
  get fiveYearTotal(): number { return this.projectionRows.reduce((s, r) => s + r.dividend + r.interest, 0); }
  get whatIfReturn(): number { return Math.round((this.whatIf.extraShares * 100 * 0.3 + this.whatIf.extraSavings * 0.07) * this.whatIf.years); }

  savePayoutPreference(): void { this.closeModal(); this.showToast('Payout preference updated.', 'success'); }
  submitBuyShares(): void { this.closeModal(); this.showToast('Share purchase request submitted.', 'success'); }
  saveReinvest(): void { this.closeModal(); this.showToast('Reinvestment rule saved.', 'success'); }
  requestCertificate(): void { this.closeModal(); this.showToast('Tax certificate request submitted.', 'info'); }
  exportReport(): void { this.closeModal(); this.showToast('Dividend report is being prepared.', 'info'); }
  submitIssue(): void { this.closeModal(); this.showToast('Dividend issue submitted for review.', 'info'); }
  depositBoost(): void { this.closeModal(); this.showToast('Redirecting to deposit top-up flow.', 'info'); }

  showToast(message: string, type: 'success' | 'info' | 'warning' = 'success'): void {
    this.toast = { message, type };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast = null, 3200);
  }
  dismissToast(): void { this.toast = null; }
  fmt(n: number): string { return n.toLocaleString(); }
}