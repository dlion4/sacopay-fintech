import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Chart.js removed — using inline canvas drawing to avoid npm dependency

/* ─── Interfaces ─── */
interface Transaction {
  ref: string;
  date: string;
  account: string;
  type: 'deposit' | 'withdrawal' | 'interest';
  typeLabel: string;
  amount: string;
  status: string;
  color: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  badgeIcon: string;
  amountColor: string;
  visible: boolean;
}

interface AccountDetail {
  title: string;
  sub: string;
  balance: string;
  available: string;
  rate: string;
  status: string;
  rules: string;
}

interface NewProduct {
  name: string;
  desc: string;
  key: string;
}

/* ─── Component ─── */
@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './savings.html',
  styleUrl: './savings.scss'
})
export class SavingsComponent implements OnInit, AfterViewInit {

  @ViewChild('growthChart') growthChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bankProof') bankProofRef!: ElementRef<HTMLInputElement>;

  /* ── Modal State ── */
  activeModal: string | null = null;

  /* ── Deposit Flow ── */
  selectedMethod: 'mpesa' | 'card' | 'bank' | 'airtel' = 'mpesa';
  depositToAccount = 'ordinary';
  depositAmountInput = '';
  depositContext = { accountLabel: 'Ordinary Savings', accountKey: 'ordinary' };

  /* ── STK Flow ── */
  stkPhase = 1;
  stkPhoneInput = '712345890';
  stkCountdown = 60;
  stkAmountDisplay = 'KES 0';
  stkAccountDisplay = 'to Selected Account';
  stkSuccessAmount = 'KES 0.00';
  stkSuccessAccount = 'Credited to your account';
  stkRef = 'DEP-2025-00XXX';
  stkChannel = 'STK Push';
  stkNewBal = 'KES —';
  private stkTimer: any;

  /* ── Card Flow ── */
  cardPhase = 1;
  cardNumberInput = '';
  cardExpiryInput = '';
  cardCvvInput = '';
  cardNameInput = '';
  cardNumberDisplay = '•••• •••• •••• ••••';
  cardHolderDisplay = 'YOUR NAME';
  cardExpiryDisplay = 'MM/YY';
  cardAmountDisplay = 'KES 0';
  cardPayBtnAmount = 'KES 0';
  cardSuccessAmount = 'KES 0.00';
  cardSuccessAccount = 'Credited to savings';

  /* ── Bank Transfer ── */
  bankAmountInput = '';
  bankDate = '2025-02-25';

  /* ── Withdraw ── */
  withdrawMethod: 'mpesa' | 'bank' = 'mpesa';
  withdrawFrom = 'ordinary';
  withdrawAmount = '';
  withdrawReason = '';

  /* ── Goal ── */
  goalTarget = 250000;
  goalDate = '2025-12-31';

  /* ── Statement ── */
  statementAccount = 'all';
  statementPeriod = 'Last 3 Months';

  /* ── Fixed Deposit ── */
  fdTopupAmt = 0;
  earlyBreakReason = '';

  /* ── Auto-Deposit ── */
  recurringAmount = 5000;
  recurringDay = '25th';
  recurringAccount = 'Ordinary Savings';
  recurringPhone = '712345890';

  /* ── Account Detail ── */
  currentAccountKey = 'ordinary';
  acctTitle = 'Account';
  acctSub = '—';
  acctBalance = '—';
  acctAvailable = '—';
  acctRate = '—';
  acctStatus = '—';
  acctRules = '—';

  /* ── Transaction Detail ── */
  txnDetailType = '';
  txnDetailAmount = 'KES 0';
  txnDetailMeta = '—';
  txnDetailRef = '—';
  txnDetailAccount = '—';
  txnDetailStatus = '—';
  txnDetailBadgeBg = '';
  txnDetailBadgeColor = '';
  txnDetailBadgeBorder = '';
  txnDetailBadgeIcon = '';

  /* ── Month Detail ── */
  monthTitle = 'Month';
  monthAmount = 'KES 0';
  monthStatus = 'Status';

  /* ── Open Account ── */
  selectedProduct: NewProduct | null = null;
  selectedProductText = 'Select a product above to proceed.';

  /* ── Growth Chart ── */
  growthRange = '1Y';
  growthRanges = ['3M', '6M', '1Y', 'ALL'];
  private growthChartInstance: any = null;

  /* ── Transactions ── */
  txnAccountFilter = 'all';
  txnTypeFilter = 'all';

  transactions: Transaction[] = [
    {
      ref: 'DEP-2025-00189', date: 'Feb 25, 2025', account: 'Ordinary', type: 'deposit',
      typeLabel: 'Deposit', amount: '+ KES 7,500', status: 'Confirmed',
      color: 'var(--primary)', badgeBg: 'rgba(0,200,83,0.08)', badgeColor: '#00C853',
      badgeBorder: '1px solid rgba(0,200,83,0.2)', badgeIcon: 'fa-arrow-down',
      amountColor: '#00C853', visible: true
    },
    {
      ref: 'INT-2025-00012', date: 'Jan 31, 2025', account: 'Ordinary', type: 'interest',
      typeLabel: 'Interest', amount: '+ KES 350', status: 'Credited',
      color: '#0288D1', badgeBg: 'rgba(2,136,209,0.06)', badgeColor: '#0288D1',
      badgeBorder: '1px solid rgba(2,136,209,0.18)', badgeIcon: 'fa-percentage',
      amountColor: '#0288D1', visible: true
    },
    {
      ref: 'WDR-2025-00031', date: 'Jan 15, 2025', account: 'Ordinary', type: 'withdrawal',
      typeLabel: 'Withdrawal', amount: '- KES 10,000', status: 'Completed',
      color: '#E53935', badgeBg: 'rgba(229,57,53,0.06)', badgeColor: '#E53935',
      badgeBorder: '1px solid rgba(229,57,53,0.18)', badgeIcon: 'fa-arrow-up',
      amountColor: '#E53935', visible: true
    }
  ];

  get filteredTransactions(): Transaction[] {
    return this.transactions;
  }

  get visibleTxnCount(): number {
    return this.transactions.filter(t => t.visible).length;
  }

  /* ─── Lifecycle ─── */
  ngOnInit(): void {
    setTimeout(() => this.showToast('Savings loaded. Deposit instantly via STK Push/Card/Bank.', 'primary'), 800);
  }

  ngAfterViewInit(): void {
    this.initGrowthChart();
  }

  /* ─── Toast ─── */
  showToast(msg: string, type: 'success' | 'danger' | 'warning' | 'info' | 'primary' = 'info'): void {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const icons: Record<string, string> = {
      success: 'fas fa-check-circle', danger: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle', info: 'fas fa-info-circle', primary: 'fas fa-bell'
    };
    const colors: Record<string, string> = {
      success: '#00C853', danger: '#E53935', warning: '#F9A825', info: '#0288D1', primary: '#1a73e8'
    };
    const t = document.createElement('div');
    t.className = `sp-toast ${type}`;
    t.innerHTML = `
      <i class="${icons[type] || icons['info']}" style="color:${colors[type]};font-size:18px;flex-shrink:0;"></i>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <div style="font-size:11px;color:var(--text-muted);">${msg}</div>
      </div>
      <button onclick="this.parentElement.remove()" class="btn-close btn-close-sm ms-2" style="font-size:10px;"></button>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 5000);
  }

  /* ─── Modal Control ─── */
  openModal(name: string): void {
    this.activeModal = name;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  /* ─── Deposit Flow ─── */
  selectDepositMethod(method: 'mpesa' | 'card' | 'bank' | 'airtel'): void {
    this.selectedMethod = method;
  }

  setAmt(a: number): void {
    this.depositAmountInput = String(a);
    this.updateMethodPreview();
  }

  updateMethodPreview(): void {
    const a = Number(this.depositAmountInput || 0);
    const pretty = 'KES ' + a.toLocaleString();
    this.stkAmountDisplay = pretty;
    this.cardAmountDisplay = pretty;
    this.cardPayBtnAmount = pretty;
  }

  prepDepositFromContext(label: string, key: string): void {
    this.depositContext = { accountLabel: label, accountKey: key };
    this.depositToAccount = key;
  }

  openDepositFlow(): void {
    this.openModal('depositMethodModal');
  }

  proceedToPayment(): void {
    const amt = Number(this.depositAmountInput || 0);
    if (!amt || amt <= 0) {
      this.showToast('Please enter a valid amount', 'warning');
      return;
    }
    const acctText = this.depositToAccount === 'all'
      ? 'All Savings Accounts'
      : this.depositToAccount;
    this.closeModal();
    this.updateMethodPreview();
    this.stkAccountDisplay = 'to ' + acctText;
    setTimeout(() => {
      if (this.selectedMethod === 'mpesa' || this.selectedMethod === 'airtel') {
        this.openModal('mpesaStkModal');
      } else if (this.selectedMethod === 'card') {
        this.openModal('cardPayModal');
      } else if (this.selectedMethod === 'bank') {
        this.bankAmountInput = String(amt);
        this.openModal('bankTransferModal');
      }
    }, 350);
  }

  /* ─── STK Flow ─── */
  initiateSTKPush(): void {
    const phone = this.stkPhoneInput;
    if (!phone || phone.length < 9) {
      this.showToast('Enter a valid phone number', 'warning');
      return;
    }
    this.stkPhase = 2;
    this.showToast('STK prompt sent. Approve on your phone.', 'success');
    let countdown = 60;
    this.stkCountdown = countdown;
    clearInterval(this.stkTimer);
    this.stkTimer = setInterval(() => {
      countdown--;
      this.stkCountdown = countdown;
      if (countdown <= 0) {
        clearInterval(this.stkTimer);
        this.showToast('STK timed out. Try again.', 'warning');
        this.resetSTK();
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(this.stkTimer);
      const amt = Number(this.depositAmountInput || 0);
      this.stkPhase = 3;
      this.stkSuccessAmount = 'KES ' + amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      this.stkSuccessAccount = 'Credited to ' + this.depositToAccount;
      this.stkRef = 'DEP-2025-00' + Math.floor(Math.random() * 900 + 100);
      this.stkChannel = (this.selectedMethod === 'airtel') ? 'Airtel STK' : 'M-Pesa STK';
      this.stkNewBal = 'KES ' + (98750 + amt).toLocaleString();
      this.showToast('Deposit confirmed automatically!', 'success');
    }, 5000);
  }

  resetSTK(): void {
    clearInterval(this.stkTimer);
    this.stkPhase = 1;
    this.stkCountdown = 60;
  }

  /* ─── Card Flow ─── */
  formatCardNumber(): void {
    let v = this.cardNumberInput.replace(/\s/g, '').replace(/\D/g, '');
    v = v.match(/.{1,4}/g)?.join(' ') || v;
    this.cardNumberInput = v;
    this.cardNumberDisplay = v || '•••• •••• •••• ••••';
  }

  formatExpiry(): void {
    let v = this.cardExpiryInput.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    this.cardExpiryInput = v;
    this.cardExpiryDisplay = v || 'MM/YY';
  }

  updateCardHolder(): void {
    this.cardHolderDisplay = this.cardNameInput || 'YOUR NAME';
  }

  processCardPayment(): void {
    this.cardPhase = 2;
    setTimeout(() => {
      const amt = Number(this.depositAmountInput || 0);
      this.cardPhase = 3;
      this.cardSuccessAmount = 'KES ' + amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      this.cardSuccessAccount = 'Credited to ' + this.depositToAccount;
      this.showToast('Card payment successful!', 'success');
    }, 2800);
  }

  resetCard(): void {
    this.cardPhase = 1;
  }

  /* ─── Bank Transfer ─── */
  copyBankDetails(): void {
    const details = [
      'Bank: Co-operative Bank',
      'Account: 01100287654321',
      'Name: SaccoPay SACCO Ltd',
      'Ref: MEM-2024-0045'
    ].join('\n');
    navigator.clipboard.writeText(details)
      .then(() => this.showToast('Bank details copied!', 'success'))
      .catch(() => this.showToast(details, 'info'));
  }

  triggerFileUpload(): void {
    this.bankProofRef?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.showToast('File selected: ' + input.files[0].name, 'success');
    }
  }

  submitBankTransfer(): void {
    const amt = Number(this.bankAmountInput || 0);
    if (!amt) {
      this.showToast('Enter the transferred amount', 'warning');
      return;
    }
    this.showToast('Bank transfer notification sent. Verification within 24h. Ref: DEP-2025-00' + Math.floor(Math.random() * 900 + 100), 'success');
    this.closeModal();
  }

  /* ─── Withdraw Flow ─── */
  selectWithdrawMethod(method: 'mpesa' | 'bank'): void {
    this.withdrawMethod = method;
  }

  submitWithdrawalRequest(): void {
    const amt = Number(this.withdrawAmount || 0);
    if (!amt || amt < 1000) {
      this.showToast('Withdrawal amount must be at least KES 1,000', 'warning');
      return;
    }
    if (!this.withdrawReason) {
      this.showToast('Please select a reason', 'warning');
      return;
    }
    const acctMap: Record<string, string> = {
      ordinary: 'Ordinary Savings',
      education: 'Education Fund',
      holiday: 'Holiday Savings',
      fixed: 'Fixed Deposit'
    };
    const acct = acctMap[this.withdrawFrom] || 'Ordinary Savings';
    this.showToast(`Withdrawal request submitted: ${acct} • KES ${amt.toLocaleString()} • via ${this.withdrawMethod.toUpperCase()} • Ref: WDR-2025-00${Math.floor(Math.random() * 900 + 100)}`, 'success');
    this.closeModal();
  }

  prepWithdrawFromContext(key: string): void {
    this.currentAccountKey = key;
  }

  openWithdrawFlow(): void {
    this.openModal('withdrawModal');
  }

  /* ─── Account Detail ─── */
  openAccountDetail(key: string): void {
    this.currentAccountKey = key;
    const map: Record<string, AccountDetail> = {
      ordinary: {
        title: 'Ordinary Savings', sub: 'SAV-001-ORD • Min KES 5,000/mo • Notice 14 days',
        balance: 'KES 98,750', available: 'KES 73,750', rate: '7% p.a.', status: 'Active',
        rules: 'Compound monthly interest • Loan multiplier 3× • Min balance KES 1,000'
      },
      fixed: {
        title: 'Fixed Deposit', sub: 'FD-001-FXD • Locked until maturity • Penalty on early break',
        balance: 'KES 40,000', available: 'KES 0 (locked)', rate: '10% p.a.', status: 'Locked',
        rules: 'Maturity Jul 15, 2025 • Early break penalty 30% of earned interest'
      },
      holiday: {
        title: 'Holiday Savings', sub: 'HS-001-HOL • Withdrawals only in Nov–Dec window',
        balance: 'KES 15,000', available: 'KES 0 (seasonal lock)', rate: '5% p.a.', status: 'Seasonal lock',
        rules: 'Withdrawal window Nov 1 – Dec 31 • Deposits anytime'
      },
      education: {
        title: 'Education Fund', sub: 'ED-001-EDU • Plan school fees and track terms',
        balance: 'KES 5,000', available: 'KES 5,000', rate: '6% p.a.', status: 'Active',
        rules: 'Flexible withdrawals • Recommended monthly deposit KES 500+'
      }
    };
    const d = map[key] || map['ordinary'];
    this.acctTitle = d.title;
    this.acctSub = d.sub;
    this.acctBalance = d.balance;
    this.acctAvailable = d.available;
    this.acctRate = d.rate;
    this.acctStatus = d.status;
    this.acctRules = d.rules;
    this.openModal('accountDetailModal');
  }

  prepDepositFromDetail(): void {
    this.depositToAccount = this.currentAccountKey;
    this.depositAmountInput = '';
    this.updateMethodPreview();
  }

  prepWithdrawFromDetail(): void {
    if (this.currentAccountKey === 'holiday' || this.currentAccountKey === 'fixed') {
      this.showToast('This account is locked for withdrawals. Choose Ordinary or Education.', 'warning');
      this.withdrawFrom = 'ordinary';
    } else {
      this.withdrawFrom = this.currentAccountKey;
    }
  }

  /* ─── Quick Open Functions ─── */
  openFixedDepositManage(): void {
    this.openModal('fixedManageModal');
  }

  openEarlyBreakFlow(): void {
    this.openModal('earlyBreakModal');
  }

  openHolidayRules(): void {
    this.showToast('Holiday withdrawals available only in Nov–Dec window', 'info');
    this.openModal('rulesModal');
  }

  openEducationPlan(): void {
    this.showToast('Education plan module opens next. (Next page: Education planner)', 'info');
  }

  /* ─── Goal ─── */
  saveGoal(): void {
    const t = Number(this.goalTarget || 0);
    if (!t || t < 1000) {
      this.showToast('Enter a valid target', 'warning');
      return;
    }
    this.showToast(`Goal updated: KES ${t.toLocaleString()} • Target date: ${this.goalDate}`, 'success');
    this.closeModal();
  }

  /* ─── Month Detail ─── */
  openMonthDetail(title: string, amount: number, status: string): void {
    this.monthTitle = title;
    this.monthAmount = 'KES ' + amount.toLocaleString();
    this.monthStatus = status === 'Due'
      ? 'Due — deposit to meet minimum'
      : (status === 'Exceeded' ? 'Exceeded minimum requirement' : 'Requirement met');
    this.openModal('monthDetailModal');
  }

  /* ─── Transaction Filter + Detail ─── */
  filterTxns(): void {
    const acct = this.txnAccountFilter;
    const type = this.txnTypeFilter;
    let shown = 0;
    this.transactions.forEach(txn => {
      const ok = (acct === 'all' || txn.account.toLowerCase() === acct) && (type === 'all' || txn.type === type);
      txn.visible = ok;
      if (ok) shown++;
    });
    this.showToast(`Showing ${shown} transactions`, 'info');
  }

  openTxnDetail(txn: Transaction): void {
    const isDeposit = txn.type === 'deposit';
    const isWithdrawal = txn.type === 'withdrawal';
    const isInterest = txn.type === 'interest';

    let bg = 'rgba(0,200,83,0.08)', col = '#00C853', br = '1px solid rgba(0,200,83,0.2)', icon = 'fa-check';
    if (isWithdrawal) { bg = 'rgba(229,57,53,0.06)'; col = '#E53935'; br = '1px solid rgba(229,57,53,0.18)'; icon = 'fa-arrow-up'; }
    if (isInterest) { bg = 'rgba(2,136,209,0.06)'; col = '#0288D1'; br = '1px solid rgba(2,136,209,0.18)'; icon = 'fa-percentage'; }

    this.txnDetailBadgeBg = bg;
    this.txnDetailBadgeColor = col;
    this.txnDetailBadgeBorder = br;
    this.txnDetailBadgeIcon = icon;
    this.txnDetailType = txn.type.toUpperCase();
    this.txnDetailRef = txn.ref;
    this.txnDetailAmount = txn.amount;
    this.txnDetailMeta = txn.account + ' • ' + new Date().toLocaleString();
    this.txnDetailAccount = txn.account;
    this.txnDetailStatus = txn.status;
    this.openModal('txnDetailModal');
  }

  /* ─── Growth Range ─── */
  setGrowthRange(range: string): void {
    this.growthRange = range;
    this.showToast('Growth chart updated: ' + range, 'info');
  }

  /* ─── Open Account Product ─── */
  selectNewProduct(name: string, desc: string, key: string): void {
    this.selectedProduct = { name, desc, key };
    this.selectedProductText = `<strong style="color:var(--text-primary);">${name}</strong> — <span style="color:var(--text-muted);">${desc}</span>`;
    this.showToast(`Selected: ${name}`, 'info');
  }

  submitOpenAccount(): void {
    if (!this.selectedProduct) {
      this.showToast('Select a savings product first', 'warning');
      return;
    }
    this.showToast(`Account opening request submitted for ${this.selectedProduct.name}. Activation within 24h.`, 'success');
    this.closeModal();
  }

  /* ─── Inline Canvas Chart (no Chart.js dependency) ─── */
  private initGrowthChart(): void {
    const canvas = this.growthChartRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const data1 = [45000, 52000, 60000, 68000, 76000, 84000, 95000, 108000, 120000, 135000, 148000, 158750];
    const data2 = [5000, 7000, 8000, 8000, 8000, 8000, 11000, 13000, 12000, 15000, 13000, 12500];

    const maxVal = 170000;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(26,29,46,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
      // Y labels
      const val = Math.round(maxVal - (maxVal / 5) * i);
      ctx.fillStyle = 'rgba(26,29,46,0.45)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`KES ${(val / 1000).toFixed(0)}K`, pad.left - 8, y + 4);
    }

    // X labels
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      const x = pad.left + (chartW / (labels.length - 1)) * i;
      ctx.fillStyle = 'rgba(26,29,46,0.45)';
      ctx.fillText(label, x, h - pad.bottom + 18);
    });

    // Helper to draw smooth line
    const drawLine = (data: number[], color: string, fill: boolean, dashed = false) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      if (dashed) ctx.setLineDash([5, 3]);
      else ctx.setLineDash([]);

      data.forEach((val, i) => {
        const x = pad.left + (chartW / (labels.length - 1)) * i;
        const y = pad.top + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = pad.left + (chartW / (labels.length - 1)) * (i - 1);
          const prevY = pad.top + chartH - (data[i - 1] / maxVal) * chartH;
          const cp1x = prevX + (x - prevX) / 2;
          const cp1y = prevY;
          const cp2x = prevX + (x - prevX) / 2;
          const cp2y = y;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
      });
      ctx.stroke();

      if (fill) {
        ctx.lineTo(pad.left + chartW, pad.top + chartH);
        ctx.lineTo(pad.left, pad.top + chartH);
        ctx.closePath();
        ctx.fillStyle = color + '14'; // 8% opacity hex
        ctx.fill();
      }
      ctx.setLineDash([]);
    };

    // Draw datasets
    drawLine(data1, '#1a73e8', true);
    drawLine(data2, '#00C853', false, true);

    // Legend
    const legendItems = [
      { label: 'Total Savings', color: '#1a73e8', dashed: false },
      { label: 'Deposits', color: '#00C853', dashed: true }
    ];
    let legendX = w - pad.right - 140;
    legendItems.forEach(item => {
      ctx.beginPath();
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      if (item.dashed) ctx.setLineDash([5, 3]);
      ctx.moveTo(legendX, pad.top - 15);
      ctx.lineTo(legendX + 20, pad.top - 15);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(26,29,46,0.5)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 26, pad.top - 11);
      legendX += 90;
    });
  }
}