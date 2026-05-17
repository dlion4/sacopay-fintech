// membership-shares.component.ts
// Angular v21 Standalone — My Shares Page — Body Only (no sidebar, no header)

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/* ─────────────────────────────────────────────── */
/*  INTERFACES                                      */
/* ─────────────────────────────────────────────── */

interface Member {
  fullName: string;
  totalShares: number;
  availableShares: number;
  lockedShares: number;
  sharePrice: number;
  totalCapital: number;
  lastDividend: number;
  ownershipPct: number;
  maxPurchasable: number;
  maxTotal: number;
  loanLimitAddition: number;
  savingsBalance: number;
  combinedForLoan: number;
  grossLoanLimit: number;
}

interface Certificate {
  number: string;
  dateIssued: string;
}

interface Transaction {
  id: number;
  date: string;
  typeLabel: string;
  typeIcon: string;
  shares: number;
  sharesPrefix: string;
  sharesColor: string;
  pricePerShare: number;
  total: number;
  cumulative: number;
  status: string;
  typeColor: { bg: string; fg: string; bd: string };
  toastMsg: string;
  toastType: ToastType;
}

interface ShareRule {
  title: string;
  icon: string;
  titleColor: string;
  bg: string;
  border?: string;
  items: { label: string; value: string; mono?: boolean; color?: string }[];
}

interface PaymentMethod {
  id: string;
  label: string;
  sub: string;
  icon: string;
  bg: string;
  color: string;
  bd: string;
}

interface ChartPeriod {
  label: string;
  value: string;
}

interface NotificationItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  unread: boolean;
  toastMsg: string;
  toastType: ToastType;
}

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  icon: string;
  iconColor: string;
}

type ToastType = 'success' | 'danger' | 'warning' | 'info' | 'primary';
type ModalKey =
  | 'buySharesModal'
  | 'procModal'
  | 'successModal'
  | 'transferModal'
  | 'breakdownModal'
  | 'impactModal'
  | 'certModal'
  | 'notifModal'
  | 'logoutModal';

/* ─────────────────────────────────────────────── */
/*  COMPONENT                                       */
/* ─────────────────────────────────────────────── */

@Component({
  selector: 'app-shares',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl:'./shares.html',
  styleUrls: ['./shares.scss']
})
export class SharesComponent implements OnInit, AfterViewInit {

  /* ── ViewChild for Chart.js canvas ── */
  @ViewChild('shareChart', { static: false }) shareChartRef!: ElementRef<HTMLCanvasElement>;

  /* ── Tabs ── */
  activeTab: 'overview' | 'history' | 'rules' = 'overview';

  /* ── Chart period ── */
  chartPeriod = '1Y';
  chartPeriods: ChartPeriod[] = [
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'All', value: 'All' }
  ];

  /* ── Member data ── */
  member: Member = {
    fullName: 'John Kamau Mwangi',
    totalShares: 120,
    availableShares: 100,
    lockedShares: 20,
    sharePrice: 100,
    totalCapital: 12000,
    lastDividend: 3400,
    ownershipPct: 0.024,
    maxPurchasable: 380,
    maxTotal: 500,
    loanLimitAddition: 36000,
    savingsBalance: 158750,
    combinedForLoan: 170750,
    grossLoanLimit: 512250
  };

  /* ── Certificate ── */
  certificate: Certificate = {
    number: 'SC-2024-0045',
    dateIssued: 'January 15, 2024'
  };

  /* ── Chart stats ── */
  chartStats = {
    startedWith: 10,
    startDate: 'Jan 2024',
    growthPct: 1100,
    totalInvested: 12,
    dividendsEarned: 3.4
  };

  /* ── Breakdown percentages ── */
  breakdownPct = {
    available: 83,
    locked: 17
  };

  breakdownSvg = {
    availableOffset: 53,
    lockedOffset: 261
  };

  /* ── Dividend projection ── */
  dividendProjection = {
    current: 3600,
    rate: 30,
    bonusShares: 30,
    bonusAmount: 4500
  };

  /* ── Transactions ── */
  transactions: Transaction[] = [
    {
      id: 1,
      date: 'Feb 10, 2025',
      typeLabel: 'Buy',
      typeIcon: 'fa-plus',
      shares: 20,
      sharesPrefix: '+',
      sharesColor: 'var(--grn)',
      pricePerShare: 100,
      total: 2000,
      cumulative: 120,
      status: 'completed',
      typeColor: { bg: 'rgba(0,200,83,0.08)', fg: 'var(--grn)', bd: 'rgba(0,200,83,0.2)' },
      toastMsg: 'Purchase: 20 shares @ KES 100 = KES 2,000 via M-Pesa STK on Feb 10, 2025',
      toastType: 'success'
    },
    {
      id: 2,
      date: 'Oct 5, 2024',
      typeLabel: 'Buy',
      typeIcon: 'fa-plus',
      shares: 30,
      sharesPrefix: '+',
      sharesColor: 'var(--grn)',
      pricePerShare: 100,
      total: 3000,
      cumulative: 100,
      status: 'completed',
      typeColor: { bg: 'rgba(0,200,83,0.08)', fg: 'var(--grn)', bd: 'rgba(0,200,83,0.2)' },
      toastMsg: 'Purchase: 30 shares @ KES 100 = KES 3,000 via Wallet on Oct 5, 2024',
      toastType: 'success'
    },
    {
      id: 3,
      date: 'Jul 15, 2024',
      typeLabel: 'Buy',
      typeIcon: 'fa-plus',
      shares: 40,
      sharesPrefix: '+',
      sharesColor: 'var(--grn)',
      pricePerShare: 100,
      total: 4000,
      cumulative: 70,
      status: 'completed',
      typeColor: { bg: 'rgba(0,200,83,0.08)', fg: 'var(--grn)', bd: 'rgba(0,200,83,0.2)' },
      toastMsg: 'Purchase: 40 shares @ KES 100 = KES 4,000 via Bank on Jul 15, 2024',
      toastType: 'success'
    },
    {
      id: 4,
      date: 'Apr 10, 2024',
      typeLabel: 'Buy',
      typeIcon: 'fa-plus',
      shares: 20,
      sharesPrefix: '+',
      sharesColor: 'var(--grn)',
      pricePerShare: 100,
      total: 2000,
      cumulative: 30,
      status: 'completed',
      typeColor: { bg: 'rgba(0,200,83,0.08)', fg: 'var(--grn)', bd: 'rgba(0,200,83,0.2)' },
      toastMsg: 'Purchase: 20 shares @ KES 100 = KES 2,000 via M-Pesa on Apr 10, 2024',
      toastType: 'success'
    },
    {
      id: 5,
      date: 'Jan 15, 2024',
      typeLabel: 'Initial',
      typeIcon: 'fa-flag',
      shares: 10,
      sharesPrefix: '+',
      sharesColor: 'var(--blu)',
      pricePerShare: 100,
      total: 1000,
      cumulative: 10,
      status: 'completed',
      typeColor: { bg: 'rgba(2,136,209,0.06)', fg: 'var(--blu)', bd: 'rgba(2,136,209,0.18)' },
      toastMsg: 'Initial share purchase: 10 shares on registration',
      toastType: 'info'
    }
  ];

  get totalInvested(): number {
    return this.transactions.reduce((sum, t) => sum + t.total, 0);
  }

  /* ── Share Rules ── */
  shareRules: ShareRule[] = [
    {
      title: 'Pricing',
      icon: 'fa-tag',
      titleColor: 'var(--pri)',
      bg: 'var(--inp)',
      items: [
        { label: 'Share Price', value: 'KES 100/share', mono: true },
        { label: 'Minimum Purchase', value: '1 share' },
        { label: 'Max per Transaction', value: '500 shares' },
        { label: 'Max Total Holding', value: '500 shares' }
      ]
    },
    {
      title: 'Dividends',
      icon: 'fa-coins',
      titleColor: 'var(--grn)',
      bg: 'var(--inp)',
      items: [
        { label: 'Declaration', value: 'Annual (AGM)' },
        { label: 'Last Rate', value: '30% of capital', color: 'var(--grn)' },
        { label: 'Payment', value: 'Credited to savings' },
        { label: 'Qualification', value: 'Hold 6+ months' }
      ]
    },
    {
      title: 'Transfers',
      icon: 'fa-exchange-alt',
      titleColor: 'var(--pur)',
      bg: 'rgba(171,0,217,0.03)',
      border: 'rgba(171,0,217,0.12)',
      items: [
        { label: 'Transfer Allowed', value: 'Yes (admin approval)' },
        { label: 'Transfer Fee', value: 'KES 200', color: 'var(--red)', mono: true },
        { label: 'Processing Time', value: '3-5 days' },
        { label: 'Min. Retain', value: '10 shares' }
      ]
    },
    {
      title: 'Restrictions',
      icon: 'fa-exclamation-triangle',
      titleColor: 'var(--red)',
      bg: 'rgba(229,57,53,0.03)',
      border: 'rgba(229,57,53,0.12)',
      items: [
        { label: 'Locked Shares', value: 'Cannot sell while guaranteeing loans' },
        { label: 'Refund on Exit', value: 'At par value (KES 100)' },
        { label: 'Exit Notice', value: '90 days' },
        { label: 'Voting Rights', value: '1 vote per share', color: 'var(--grn)' }
      ]
    }
  ];

  /* ── Notifications ── */
  notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'AGM Notice',
      subtitle: 'March 15, 2025 • Dividend declaration • 2d ago',
      icon: 'fa-bullhorn',
      iconBg: 'rgba(255,193,7,0.1)',
      iconColor: '#FFC107',
      unread: true,
      toastMsg: 'AGM 2025 scheduled for March 15. Your voting power: 120 votes (1 per share).',
      toastType: 'info'
    },
    {
      id: 2,
      title: 'Share Price Confirmed',
      subtitle: 'KES 100/share maintained • 5d ago',
      icon: 'fa-chart-line',
      iconBg: 'rgba(0,200,83,0.08)',
      iconColor: 'var(--grn)',
      unread: false,
      toastMsg: 'Share price review: Board confirmed KES 100/share for 2025.',
      toastType: 'success'
    }
  ];

  /* ── Buy Shares Form ── */
  buyPresets = [5, 10, 20, 50, 100];
  buyPaymentMethods: PaymentMethod[] = [
    { id: 'wallet', label: 'Wallet', sub: 'KES 12,450', icon: 'fa-wallet', bg: 'var(--pri-sub)', color: 'var(--pri)', bd: 'var(--pri-bdr)' },
    { id: 'mpesa', label: 'M-Pesa', sub: 'STK Push', icon: 'fa-mobile-alt', bg: 'rgba(0,200,83,0.08)', color: 'var(--grn)', bd: 'rgba(0,200,83,0.2)' },
    { id: 'card', label: 'Card', sub: 'Visa/MC', icon: 'fa-credit-card', bg: 'rgba(171,0,217,0.06)', color: 'var(--pur)', bd: 'rgba(171,0,217,0.18)' },
    { id: 'savings', label: 'Savings', sub: 'Deduct', icon: 'fa-piggy-bank', bg: 'rgba(2,136,209,0.06)', color: 'var(--blu)', bd: 'rgba(2,136,209,0.18)' }
  ];

  buyForm = {
    qty: 10,
    source: 'wallet'
  };

  buySummary = {
    qty: 10,
    totalCost: 1000,
    newTotal: 130,
    newCapital: 13000,
    newDividend: 3900
  };

  /* ── Transfer Form ── */
  transferForm = {
    to: '',
    qty: 10,
    reason: '',
    consent: false
  };

  transferSummary = {
    qty: 10,
    remaining: 110
  };

  /* ── Processing ── */
  procMsg = 'Deducting from your wallet...';

  /* ── Success data ── */
  sucData = {
    qty: '10 shares',
    msg: 'Added to your portfolio',
    ref: 'SH-2025-00123',
    newTotal: '130',
    capital: 'KES 13,000'
  };

  /* ── Modals state ── */
  modals: Record<ModalKey, boolean> = {
    buySharesModal: false,
    procModal: false,
    successModal: false,
    transferModal: false,
    breakdownModal: false,
    impactModal: false,
    certModal: false,
    notifModal: false,
    logoutModal: false
  };

  /* ── Toasts ── */
  toasts: ToastItem[] = [];
  private toastId = 0;

  /* ── Chart.js instance ── */
  private chartInstance: any = null;

  /* ─────────────────────────────────────────────── */
  /*  LIFECYCLE                                       */
  /* ─────────────────────────────────────────────── */

  ngOnInit(): void {
    this.calcBuy();
    this.calcTransfer();

    // Welcome toast
    setTimeout(() => {
      this.showToast(
        'AGM 2025 on March 15. Your voting power: 120 votes. Dividend declaration expected.',
        'info'
      );
    }, 800);
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  /* ─────────────────────────────────────────────── */
  /*  TABS                                            */
  /* ─────────────────────────────────────────────── */

  setTab(tab: 'overview' | 'history' | 'rules'): void {
    this.activeTab = tab;
  }

  /* ─────────────────────────────────────────────── */
  /*  CHART                                           */
  /* ─────────────────────────────────────────────── */

  setChartPeriod(period: string): void {
    this.chartPeriod = period;
    this.showToast('Chart updated', 'info');
    // In real app: re-fetch chart data based on period
  }

  private initChart(): void {
    // Chart.js would be initialized here
    // Since we can't import Chart.js directly in this snippet,
    // the canvas is ready for binding in a real app
    // Example:
    // const ctx = this.shareChartRef.nativeElement.getContext('2d');
    // this.chartInstance = new Chart(ctx, { ... });
  }

  /* ─────────────────────────────────────────────── */
  /*  MODALS                                          */
  /* ─────────────────────────────────────────────── */

  openModal(key: ModalKey): void {
    this.modals[key] = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(key: ModalKey): void {
    this.modals[key] = false;
    // Only restore scroll if no other modals are open
    const anyOpen = Object.values(this.modals).some(v => v);
    if (!anyOpen) {
      document.body.style.overflow = '';
    }
  }

  /* ─────────────────────────────────────────────── */
  /*  TOASTS                                          */
  /* ─────────────────────────────────────────────── */

  showToast(message: string, type: ToastType = 'info'): void {
    const icons: Record<ToastType, string> = {
      success: 'fa-check-circle',
      danger: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
      primary: 'fa-bell'
    };
    const colors: Record<ToastType, string> = {
      success: 'var(--grn)',
      danger: 'var(--red)',
      warning: 'var(--ylw)',
      info: 'var(--blu)',
      primary: 'var(--pri)'
    };

    const toast: ToastItem = {
      id: ++this.toastId,
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      icon: icons[type],
      iconColor: colors[type]
    };

    this.toasts.push(toast);

    setTimeout(() => {
      this.removeToast(toast.id);
    }, 5000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  /* ─────────────────────────────────────────────── */
  /*  BUY SHARES                                      */
  /* ─────────────────────────────────────────────── */

  setBuyQty(q: number): void {
    this.buyForm.qty = q;
    this.calcBuy();
  }

  calcBuy(): void {
    const q = this.buyForm.qty || 0;
    const cost = q * this.member.sharePrice;
    const newTotal = this.member.totalShares + q;
    const newDiv = Math.round(newTotal * this.member.sharePrice * 0.30);

    this.buySummary = {
      qty: q,
      totalCost: cost,
      newTotal,
      newCapital: newTotal * this.member.sharePrice,
      newDividend: newDiv
    };
  }

  selBuyPay(source: string): void {
    this.buyForm.source = source;
  }

  processBuyShares(): void {
    const q = this.buyForm.qty || 0;

    if (!q || q < 1) {
      this.showToast('Enter at least 1 share', 'warning');
      return;
    }
    if (q > this.member.maxPurchasable) {
      this.showToast(`Maximum purchasable is ${this.member.maxPurchasable} shares`, 'danger');
      return;
    }

    this.closeModal('buySharesModal');

    const msgs: Record<string, string> = {
      wallet: 'Deducting from SaccoPay Wallet...',
      mpesa: 'Sending M-Pesa STK Push...',
      card: 'Processing card payment...',
      savings: 'Deducting from savings...'
    };
    this.procMsg = msgs[this.buyForm.source] || msgs['wallet'];
    this.openModal('procModal');

    setTimeout(() => {
      this.closeModal('procModal');

      setTimeout(() => {
        const ref = 'SH-2025-00' + Math.floor(Math.random() * 900 + 100);
        const newTotal = this.member.totalShares + q;

        this.sucData = {
          qty: q + ' shares',
          msg: 'KES ' + (q * this.member.sharePrice).toLocaleString() + ' from ' + this.buyForm.source,
          ref,
          newTotal: newTotal + ' shares',
          capital: 'KES ' + (newTotal * this.member.sharePrice).toLocaleString()
        };

        this.openModal('successModal');
      }, 300);
    }, 3000);
  }

  /* ─────────────────────────────────────────────── */
  /*  TRANSFER                                        */
  /* ─────────────────────────────────────────────── */

  calcTransfer(): void {
    const q = this.transferForm.qty || 0;
    this.transferSummary = {
      qty: q,
      remaining: this.member.totalShares - q
    };
  }

  submitTransfer(): void {
    if (!this.transferForm.consent) {
      this.showToast('Please accept the transfer terms', 'warning');
      return;
    }
    const to = this.transferForm.to.trim();
    const q = this.transferForm.qty || 0;

    if (!to) {
      this.showToast('Enter a recipient member', 'warning');
      return;
    }
    if (!q || q < 1) {
      this.showToast('Enter at least 1 share', 'warning');
      return;
    }
    if (q > this.member.availableShares - 10) {
      this.showToast(`Cannot transfer more than ${this.member.availableShares - 10} shares (must keep 10)`, 'danger');
      return;
    }

    const ref = 'TR-2025-00' + Math.floor(Math.random() * 900 + 100);
    this.showToast(
      `Transfer request submitted! ${q} shares to ${to}. Ref: ${ref}. Awaiting admin approval.`,
      'success'
    );
    this.closeModal('transferModal');
  }

  /* ─────────────────────────────────────────────── */
  /*  TRANSACTION HISTORY                             */
  /* ─────────────────────────────────────────────── */

  showTxToast(tx: Transaction): void {
    this.showToast(tx.toastMsg, tx.toastType);
  }

  exportHistory(): void {
    this.showToast('Share history exported as PDF', 'success');
  }

  /* ─────────────────────────────────────────────── */
  /*  CERTIFICATE                                     */
  /* ─────────────────────────────────────────────── */

  downloadCert(): void {
    this.showToast('Share certificate downloaded as PDF', 'success');
  }

  emailCert(): void {
    this.showToast('Certificate sent to j.kamau@email.com', 'success');
  }

  shareCert(): void {
    this.showToast('Certificate shared', 'success');
  }
}