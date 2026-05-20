import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Tab = 'all' | 'pending' | 'limits' | 'quick' | 'analytics';
type ModalKey = 'processWithdrawal' | 'editLimits' | 'configRules' | 'viewDetail' | 'reviewFlagged' | null;

interface Withdrawal {
  id: string; date: string; name: string; initials: string; av: string; mid: string;
  acctType: string; acctTone: string; method: string; methodIcon: string;
  amount: string; amountRaw: number; reference: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
}

interface PendingItem {
  name: string; id: string; mid: string; amount: string; time: string;
  tags: string[]; detail: string; initials: string; av: string;
}

interface FlaggedItem {
  member: string; amount: string; reason: string; risk: string; riskTone: string;
}

@Component({
  selector: 'app-finance-withdrawals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './withdrawals.html',
  styleUrl: './withdrawals.scss',
})
export class WithdrawalsComponent {
  tab: Tab = 'all';
  modal: ModalKey = null;
  toast: { msg: string } | null = null;
  private toastTimer?: number;

  statusF = 'all';
  methodF = 'all';
  typeF = 'all';

  selectedW: Withdrawal | null = null;

  pForm = { member: '', amount: '50000', account: '', method: '', reason: '', notes: '', autoApprove: false, sms: true };

  readonly kpiCards = [
    { icon: '💰', label: "Today's Withdrawals", value: 'KES 3.8M', sub: '↓ 567 withdrawals', subTone: 'green' },
    { icon: '📅', label: 'This Month', value: 'KES 92M', sub: '↑ +12.3% vs last month', subTone: 'green' },
    { icon: '⏳', label: 'Pending Approval', value: '28', sub: '🔴 KES 8.2M awaiting', subTone: 'red' },
    { icon: '✅', label: 'Success Rate', value: '98.6%', sub: '🌿 Excellent', subTone: 'green' },
  ];

  readonly methodCards = [
    { icon: '📱', label: 'M-Pesa', value: 'KES 2.1M', sub: '378 withdrawals', tone: 'blue' },
    { icon: '🏦', label: 'Bank Transfer', value: 'KES 1.2M', sub: '95 withdrawals', tone: 'teal' },
    { icon: '💵', label: 'Cash', value: 'KES 450K', sub: '73 withdrawals', tone: 'green' },
    { icon: '📄', label: 'Cheque', value: 'KES 50K', sub: '22 withdrawals', tone: 'gray' },
  ];

  readonly tabs: Array<{ key: Tab; label: string }> = [
    { key: 'all', label: 'All Withdrawals' },
    { key: 'pending', label: 'Pending (28)' },
    { key: 'limits', label: 'Limits & Rules' },
    { key: 'quick', label: 'Quick Process' },
    { key: 'analytics', label: 'Analytics' },
  ];

  withdrawals: Withdrawal[] = [
    { id: 'WDR-2026-00892', date: 'Today, 3:15 PM', name: 'David Kipkorir', initials: 'DK', av: 'c1', mid: 'R-00045', acctType: 'Savings', acctTone: 'green', method: 'M-Pesa', methodIcon: '📱', amount: 'KES 80,000', amountRaw: 80000, reference: 'XYZ8MK2PQ', status: 'Completed' },
    { id: 'WDR-2026-00891', date: 'Today, 2:50 PM', name: 'Sarah Akinyi', initials: 'SA', av: 'c6', mid: 'R-00123', acctType: 'Share Redemption', acctTone: 'orange', method: 'Cash', methodIcon: '💵', amount: 'KES 120,000', amountRaw: 120000, reference: 'CASH-2891', status: 'Pending' },
    { id: 'WDR-2026-00890', date: 'Today, 2:20 PM', name: 'Mary Wanjiku', initials: 'MW', av: 'c4', mid: 'R-00034', acctType: 'Savings', acctTone: 'green', method: 'Bank', methodIcon: '🏦', amount: 'KES 350,000', amountRaw: 350000, reference: 'FT261066134', status: 'Completed' },
    { id: 'WDR-2026-00889', date: 'Today, 1:45 PM', name: 'John Otieno', initials: 'JO', av: 'c3', mid: 'R-00136', acctType: 'Fixed Deposit', acctTone: 'cyan', method: 'M-Pesa', methodIcon: '📱', amount: 'KES 25,000', amountRaw: 25000, reference: '-', status: 'Failed' },
    { id: 'WDR-2026-00888', date: 'Today, 1:10 PM', name: 'Grace Muthoni', initials: 'GM', av: 'c5', mid: 'R-00678', acctType: 'Savings', acctTone: 'green', method: 'Cheque', methodIcon: '📄', amount: 'KES 45,000', amountRaw: 45000, reference: 'CHQ-78234', status: 'Processing' },
  ];

  pendingItems: PendingItem[] = [
    { name: 'Sarah Akinyi', id: 'WDR-2026-00891', mid: 'R-00123', amount: 'KES 120,000', time: 'Today, 2:50 PM', tags: ['Share Redemption', 'Cash', 'Pending Approval'], detail: 'Ref: CASH-2891 • Available Balance: KES 1.2M • By: Branch Teller', initials: 'SA', av: 'c6' },
    { name: 'Peter Njoroge', id: 'WDR-2026-00885', mid: 'R-00882', amount: 'KES 200,000', time: 'Today, 12:15 PM', tags: ['Savings', 'Bank Transfer', 'Pending Verification'], detail: 'Bank: KCB Bank • Account: 1234***890 • Available: KES 850K', initials: 'PN', av: 'c3' },
    { name: 'Alice Kamau', id: 'WDR-2026-00882', mid: 'R-00134', amount: 'KES 75,000', time: 'Today, 11:30 AM', tags: ['Savings', 'M-Pesa', 'Limit Check'], detail: 'Phone: 0722***345 • Daily Limit: 3/5 withdrawals • Available: KES 450K', initials: 'AK', av: 'c4' },
  ];

  flaggedItems: FlaggedItem[] = [
    { member: 'James Omondi', amount: 'KES 950,000', reason: 'Amount exceeds 90% of available balance', risk: 'Medium Risk', riskTone: 'warning' },
    { member: 'Jane Nyambura', amount: 'KES 150,000', reason: '5th withdrawal today - exceeds daily frequency', risk: 'High Risk', riskTone: 'danger' },
  ];

  readonly limitsData = [
    { label: 'Single Transaction Limit', value: 'KES 500,000' },
    { label: 'Daily Member Limit', value: 'KES 1,000,000' },
    { label: 'Monthly Member Limit', value: 'KES 5,000,000' },
    { label: 'Daily SACCO Limit', value: 'KES 50,000,000' },
  ];

  readonly rulesData = [
    { label: 'M-Pesa (< KES 50K)', sub: 'Instant processing for small M-Pesa withdrawals', badge: 'Auto-Approve', tone: 'green' },
    { label: 'Cash (> KES 100K)', sub: 'Requires branch manager approval', badge: 'Manual Review', tone: 'orange' },
    { label: 'Share Redemption', sub: 'Requires board approval & notice period', badge: 'Always Manual', tone: 'red' },
    { label: 'Fixed Deposit (Matured)', sub: 'Automatic after maturity date', badge: 'Auto-Approve', tone: 'green' },
  ];

  readonly trendData = [
    { day: 'Mon', value: 'KES 2.8M', h: 52 }, { day: 'Tue', value: 'KES 3.2M', h: 60 },
    { day: 'Wed', value: 'KES 3.8M', h: 71 }, { day: 'Thu', value: 'KES 5.2M', h: 97 },
    { day: 'Fri', value: 'KES 4.5M', h: 84 }, { day: 'Sat', value: 'KES 1.8M', h: 34 },
    { day: 'Sun', value: 'KES 750K', h: 14 },
  ];

  readonly sourceCards = [
    { label: 'Savings', amount: 'KES 65M', pct: 71, icon: '💰', color: '#00d084' },
    { label: 'Share Redemption', amount: 'KES 18M', pct: 20, icon: '🏷', color: '#ff9800' },
    { label: 'Fixed Deposit', amount: 'KES 7M', pct: 8, icon: '🔒', color: '#c62828' },
    { label: 'Emergency Fund', amount: 'KES 2M', pct: 1, icon: '🟡', color: '#ffc107' },
  ];

  readonly topWithdrawers = [
    { rank: 1, name: 'David Kipkorir', total: 'KES 1.8M', freq: '12 withdrawals', avg: 'KES 150,000', tone: 'gold' },
    { rank: 2, name: 'Sarah Akinyi', total: 'KES 1.5M', freq: '8 withdrawals', avg: 'KES 187,500', tone: 'silver' },
    { rank: 3, name: 'Mary Wanjiku', total: 'KES 1.2M', freq: '15 withdrawals', avg: 'KES 80,000', tone: 'bronze' },
    { rank: 4, name: 'John Otieno', total: 'KES 950K', freq: '10 withdrawals', avg: 'KES 95,000', tone: '' },
    { rank: 5, name: 'Grace Muthoni', total: 'KES 720K', freq: '18 withdrawals', avg: 'KES 40,000', tone: '' },
  ];

  readonly recentActivity = [
    { name: 'David Kipkorir', amount: 'KES 80,000', method: 'M-Pesa', time: '5 min ago', tone: 'green' },
    { name: 'Sarah Akinyi', amount: 'KES 120,000', method: 'Cash', time: '15 min ago', tone: 'orange' },
    { name: 'Mary Wanjiku', amount: 'KES 350,000', method: 'Bank', time: '45 min ago', tone: 'blue' },
    { name: 'John Otieno', amount: 'KES 25,000', method: 'M-Pesa', time: '1 hour ago', tone: 'red' },
  ];

  readonly amountPresets = ['KES 10K', 'KES 25K', 'KES 50K', 'KES 100K', 'KES 250K'];

  get filteredWithdrawals(): Withdrawal[] {
    return this.withdrawals.filter(w => {
      if (this.statusF !== 'all' && w.status !== this.statusF) return false;
      if (this.methodF !== 'all' && w.method !== this.methodF) return false;
      if (this.typeF !== 'all' && w.acctType !== this.typeF) return false;
      return true;
    });
  }

  get amtNum(): number { return Number(this.pForm.amount || 0); }
  get fee(): number { return this.amtNum > 0 ? Math.round(this.amtNum * 0.01) : 0; }
  get tax(): number { return this.amtNum > 0 ? Math.round(this.fee * 0.2) : 0; }
  get totalDeducted(): number { return this.amtNum + this.fee + this.tax; }

  tagTone(tag: string): string {
    if (tag.includes('Pending')) return 'warning';
    if (tag.includes('Cash') || tag.includes('M-Pesa') || tag.includes('Bank')) return 'blue';
    return 'green';
  }

  openModal(key: ModalKey, w?: Withdrawal): void {
    if (w) this.selectedW = w;
    this.modal = key;
  }

  closeModal(): void { this.modal = null; }

showToast(msg: string): void {
  this.toast = { msg };
  if (this.toastTimer) window.clearTimeout(this.toastTimer);
  this.toastTimer = window.setTimeout((): void => {
    this.toast = null;
  }, 2600);
}

  confirmAndClose(msg: string): void { this.closeModal(); this.showToast(msg); }

  setPresetAmount(preset: string): void {
    this.pForm.amount = preset.replace(/[^0-9]/g, '');
  }
}
