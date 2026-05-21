import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Withdrawal {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  amount: number;
  fee: number;
  channel: string;
  account: string;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Rejected' | 'Reversed';
  timestamp: string;
  riskScore: number;
  flagReason: string | null;
  narration: string;
  referenceNo: string;
}

interface ChannelFloat {
  id: string;
  name: string;
  balance: number;
  limit: number;
  dailyVolume: number;
  status: 'Online' | 'Offline' | 'Delayed';
  icon: string;
}

interface MemberInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  savingsBalance: number;
  tier: string;
  dailyLimit: number;
  dailyRemaining: number;
  riskScore: number;
  activeLoans: number;
}

interface WithdrawalRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value: string;
  category: 'limit' | 'security' | 'workflow';
}

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Component({
  selector: 'app-withdrawals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'/withdrawals.html',
  styleUrls: ['./withdrawals.scss']
})
export class WithdrawalsComponent implements OnInit {
  // Navigation & Tab state
  activeTab: 'all' | 'pending' | 'limits' | 'quick' | 'analytics' = 'all';

  // Toast notifications
  toasts: ToastMessage[] = [];

  // Channels state
  channels: ChannelFloat[] = [
    { id: 'mpesa', name: 'M-Pesa Express', balance: 120450, limit: 150000, dailyVolume: 45200, status: 'Online', icon: 'wallet' },
    { id: 'bank', name: 'Bank RTGS Gateway', balance: 350000, limit: 500000, dailyVolume: 122800, status: 'Online', icon: 'credit_card' },
    { id: 'pesalink', name: 'Pesalink Transfer', balance: 85000, limit: 100000, dailyVolume: 15300, status: 'Delayed', icon: 'activity' },
    { id: 'cash', name: 'FOSA Branch Cash', balance: 95000, limit: 100000, dailyVolume: 22100, status: 'Online', icon: 'database' }
  ];

  // Members repository for lookups
  members: MemberInfo[] = [
    { id: 'M-10294', name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', phone: '+254 711 223 344', savingsBalance: 14250, tier: 'Premium (Tier 3)', dailyLimit: 10000, dailyRemaining: 9500, riskScore: 5, activeLoans: 0 },
    { id: 'M-38291', name: 'Michael K. Kiprop', email: 'm.kiprop@saccopay.net', phone: '+254 722 890 123', savingsBalance: 2840, tier: 'Standard (Tier 2)', dailyLimit: 5000, dailyRemaining: 1200, riskScore: 12, activeLoans: 1 },
    { id: 'M-88210', name: 'David Ochieng', email: 'ochieng.d@outlook.com', phone: '+254 733 445 566', savingsBalance: 48000, tier: 'VIP (Tier 4)', dailyLimit: 50000, dailyRemaining: 45000, riskScore: 45, activeLoans: 2 },
    { id: 'M-55102', name: 'Anita Patel', email: 'anita.patel@yahoo.com', phone: '+254 701 556 778', savingsBalance: 850, tier: 'Basic (Tier 1)', dailyLimit: 1000, dailyRemaining: 150, riskScore: 82, activeLoans: 0 }
  ];

  // Withdrawal rules
  rules: WithdrawalRule[] = [
    { id: 'rule-1', name: 'Dual Authorization Threshold', description: 'Requires approval from both Manager and Auditor for transactions exceeding $10,000.', enabled: true, value: '$10,000', category: 'workflow' },
    { id: 'rule-2', name: 'Night Window Restrictions', description: 'Auto-flag withdrawals initiated between 11:00 PM and 5:00 AM.', enabled: true, value: '23:00 - 05:00', category: 'security' },
    { id: 'rule-3', name: 'Velocity Guard', description: 'Block transfers if a member requests more than 3 withdrawals within 10 minutes.', enabled: true, value: '3 requests / 10m', category: 'security' },
    { id: 'rule-4', name: 'IP Whitelist Mandate', description: 'Enforce staff portal access to registered organizational IP blocks only.', enabled: false, value: 'Staff Only', category: 'workflow' },
    { id: 'rule-5', name: 'Maximum Daily Cash Dispensation', description: 'Cap total Branch counter withdrawals at $5,000 per member.', enabled: true, value: '$5,000', category: 'limit' }
  ];

  // Global Limits settings
  globalLimits = {
    tier1Daily: 1000,
    tier1Single: 500,
    tier2Daily: 5000,
    tier2Single: 2500,
    tier3Daily: 15000,
    tier3Single: 10000,
    tier4Daily: 50000,
    tier4Single: 25000,
  };

  // Primary withdrawals dataset
  withdrawals: Withdrawal[] = [
    { id: 'TXN-2026-9042', memberId: 'M-38291', memberName: 'Michael K. Kiprop', memberEmail: 'm.kiprop@saccopay.net', memberPhone: '+254 722 890 123', amount: 1650, fee: 15, channel: 'M-Pesa Express', account: '0722890123', status: 'Pending', timestamp: '2026-03-24 10:14 AM', riskScore: 12, flagReason: null, narration: 'Savings withdrawal for school fees', referenceNo: 'MPESA-W8D29S0' },
    { id: 'TXN-2026-9041', memberId: 'M-10294', memberName: 'Sarah Jenkins', memberEmail: 'sarah.j@gmail.com', memberPhone: '+254 711 223 344', amount: 4800, fee: 35, channel: 'Bank RTGS Gateway', account: '0110928341900', status: 'Pending', timestamp: '2026-03-24 09:30 AM', riskScore: 8, flagReason: null, narration: 'EFT Transfer to Co-op Account', referenceNo: 'RTGS-89104A1' },
    { id: 'TXN-2026-9040', memberId: 'M-88210', memberName: 'David Ochieng', memberEmail: 'ochieng.d@outlook.com', memberPhone: '+254 733 445 566', amount: 15000, fee: 75, channel: 'Bank RTGS Gateway', account: '0220918349100', status: 'Flagged', timestamp: '2026-03-24 09:05 AM', riskScore: 78, flagReason: 'High Amount Velocity Limit Exceeded', narration: 'Business supplier settlement', referenceNo: 'RTGS-90214B8' },
    { id: 'TXN-2026-9039', memberId: 'M-55102', memberName: 'Anita Patel', memberEmail: 'anita.patel@yahoo.com', memberPhone: '+254 701 556 778', amount: 800, fee: 10, channel: 'M-Pesa Express', account: '0701556778', status: 'Flagged', timestamp: '2026-03-24 08:44 AM', riskScore: 92, flagReason: 'Suspicious Device Fingerprint & IP', narration: 'Personal emergency funds', referenceNo: 'MPESA-U9G31M2' },
    { id: 'TXN-2026-9038', memberId: 'M-10294', memberName: 'Sarah Jenkins', memberEmail: 'sarah.j@gmail.com', memberPhone: '+254 711 223 344', amount: 2500, fee: 20, channel: 'Pesalink Transfer', account: '0711223344', status: 'Completed', timestamp: '2026-03-23 04:12 PM', riskScore: 5, flagReason: null, narration: 'Transfer to family member', referenceNo: 'PLNK-77810C3' },
    { id: 'TXN-2026-9037', memberId: 'M-38291', memberName: 'Michael K. Kiprop', memberEmail: 'm.kiprop@saccopay.net', memberPhone: '+254 722 890 123', amount: 500, fee: 5, channel: 'M-Pesa Express', account: '0722890123', status: 'Completed', timestamp: '2026-03-23 02:40 PM', riskScore: 10, flagReason: null, narration: 'Airtime purchase request', referenceNo: 'MPESA-Q0L81J4' },
    { id: 'TXN-2026-9036', memberId: 'M-88210', memberName: 'David Ochieng', memberEmail: 'ochieng.d@outlook.com', memberPhone: '+254 733 445 566', amount: 20000, fee: 100, channel: 'FOSA Branch Cash', account: 'FOSA-88210', status: 'Completed', timestamp: '2026-03-23 11:15 AM', riskScore: 15, flagReason: null, narration: 'Counter cash withdrawal', referenceNo: 'CASH-99120Z0' },
    { id: 'TXN-2026-9035', memberId: 'M-55102', memberName: 'Anita Patel', memberEmail: 'anita.patel@yahoo.com', memberPhone: '+254 701 556 778', amount: 950, fee: 10, channel: 'M-Pesa Express', account: '0701556778', status: 'Rejected', timestamp: '2026-03-23 09:20 AM', riskScore: 85, flagReason: 'Exceeded Monthly Transaction Limit', narration: 'FOSA transfer to mobile wallet', referenceNo: 'MPESA-V8E11X7' },
    { id: 'TXN-2026-9034', memberId: 'M-10294', memberName: 'Sarah Jenkins', memberEmail: 'sarah.j@gmail.com', memberPhone: '+254 711 223 344', amount: 12000, fee: 60, channel: 'Bank RTGS Gateway', account: '0110928341900', status: 'Reversed', timestamp: '2026-03-22 03:50 PM', riskScore: 7, flagReason: null, narration: 'Mortgage deposit payment', referenceNo: 'RTGS-55214D1' },
    { id: 'TXN-2026-9033', memberId: 'M-38291', memberName: 'Michael K. Kiprop', memberEmail: 'm.kiprop@saccopay.net', memberPhone: '+254 722 890 123', amount: 300, fee: 5, channel: 'M-Pesa Express', account: '0722890123', status: 'Completed', timestamp: '2026-03-22 01:10 PM', riskScore: 14, flagReason: null, narration: 'Utility bill payment', referenceNo: 'MPESA-K5N99P2' }
  ];

  // Filters State
  searchTerm: string = '';
  channelFilter: string = 'All';
  statusFilter: string = 'All';
  minAmount: string = '';
  selectedBatchIds: string[] = [];

  // Modals active state
  activeModal: string | null = null;
  selectedWithdrawal: Withdrawal | null = null;

  // Modal 1: Process Form
  procMemberId: string = '';
  procAmount: string = '';
  procChannel: string = 'M-Pesa Express';
  procAccount: string = '';
  procNarration: string = '';
  procLimitCheckPassed: boolean | null = null;
  procOTP: string = '';
  procStep: number = 1;

  // Modal 3: Reject Form
  rejectReason: string = 'Insufficient Float';
  rejectMemo: string = '';

  // Modal 5: Edit Metadata Form
  editReference: string = '';
  editNarration: string = '';
  editInternalNotes: string = '';

  // Modal 6: Email Form
  emailTemplate: string = 'Withdrawal Complete';
  emailSubject: string = 'SaccoPay Transaction Alert: Withdrawal Success';
  emailBody: string = '';

  // Modal 7: SMS Form
  smsTemplate: string = 'Withdrawal Code';
  smsBody: string = '';

  // Modal 8: Reversal Form
  revSupervisorPin: string = '';
  revReason: string = 'Customer Request';
  revEscrow: boolean = false;

  // Modal 9: Float Form
  floatActionChannel: string = 'mpesa';
  floatTopUpAmount: string = '';

  // Modal 10: Edit Limits Form
  limitTier: 'tier1' | 'tier2' | 'tier3' | 'tier4' = 'tier1';
  tempLimitDaily: number = 1000;
  tempLimitSingle: number = 500;

  // Modal 12: Review Flagged Form
  flaggedActionNotes: string = '';

  // Modal 13: Export Form
  exportFormat: 'CSV' | 'Excel' | 'PDF' = 'CSV';
  exportDateRange: string = 'Today';
  isExporting: boolean = false;
  exportProgress: number = 0;

  // Modal 14: Check Limits Form
  lookupMemberId: string = '';
  searchedMember: MemberInfo | null = null;

  // Modal 15: Batch Processes Form
  batchActionType: 'Approve' | 'Reject' = 'Approve';
  batchNotes: string = '';

  ngOnInit() {
    this.refreshKPIs();
  }

  // Toast System
  showToast(text: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    const id = Math.random().toString(36).substr(2, 9);
    this.toasts.push({ id, text, type });
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 4000);
  }

  // Filtered computed list helper
  getFilteredWithdrawals(): Withdrawal[] {
    return this.withdrawals.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.memberName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.memberId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.referenceNo.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesChannel = this.channelFilter === 'All' || item.channel === this.channelFilter;
      const matchesStatus = this.statusFilter === 'All' || item.status === this.statusFilter;
      
      let matchesAmount = true;
      if (this.minAmount) {
        matchesAmount = item.amount >= parseFloat(this.minAmount);
      }

      const matchesTab = this.activeTab === 'all' || item.status === 'Pending';

      return matchesSearch && matchesChannel && matchesStatus && matchesAmount && matchesTab;
    });
  }

  // KPI Calculations
  pendingCount = 0;
  flaggedCount = 0;
  totalVolumeToday = 0;

  refreshKPIs() {
    this.pendingCount = this.withdrawals.filter(w => w.status === 'Pending').length;
    this.flaggedCount = this.withdrawals.filter(w => w.status === 'Flagged').length;
    this.totalVolumeToday = this.withdrawals
      .filter(w => w.status === 'Completed' && w.timestamp.includes('2026-03-24'))
      .reduce((sum, w) => sum + w.amount, 0);
  }

  // --- ACTIONS ---

  // Modal handlers
  openModal(modalName: string, data?: Withdrawal) {
    this.activeModal = modalName;
    if (data) {
      this.selectedWithdrawal = data;
      // Setup edit details fields
      this.editReference = data.referenceNo;
      this.editNarration = data.narration;
      this.editInternalNotes = 'Standard audit check.';
      // Setup email/SMS bodies
      this.handleEmailTemplateChange(this.emailTemplate);
      this.handleSmsTemplateChange(this.smsTemplate);
    }
  }

  closeModal() {
    this.activeModal = null;
    this.selectedWithdrawal = null;
  }

  // Modal 2: Approve Action
  approveWithdrawal() {
    if (!this.selectedWithdrawal) return;
    
    const chanIdx = this.channels.findIndex(c => c.name === this.selectedWithdrawal!.channel);
    if (chanIdx !== -1 && this.channels[chanIdx].balance < this.selectedWithdrawal.amount) {
      this.showToast(`Approval failed: Insufficient float in channel ${this.selectedWithdrawal.channel}`, 'error');
      this.closeModal();
      return;
    }

    this.withdrawals = this.withdrawals.map(w => {
      if (w.id === this.selectedWithdrawal!.id) {
        return { ...w, status: 'Completed' };
      }
      return w;
    });

    if (chanIdx !== -1) {
      this.channels[chanIdx].balance -= this.selectedWithdrawal.amount;
      this.channels[chanIdx].dailyVolume += this.selectedWithdrawal.amount;
    }

    this.showToast(`Withdrawal ${this.selectedWithdrawal.id} successfully approved! Funds disbursed.`, 'success');
    this.refreshKPIs();
    this.closeModal();
  }

  // Modal 3: Reject Action
  rejectWithdrawal() {
    if (!this.selectedWithdrawal) return;

    this.withdrawals = this.withdrawals.map(w => {
      if (w.id === this.selectedWithdrawal!.id) {
        return { ...w, status: 'Rejected', flagReason: `Rejected by Admin: ${this.rejectReason}. Note: ${this.rejectMemo}` };
      }
      return w;
    });

    this.showToast(`Withdrawal ${this.selectedWithdrawal.id} rejected. Reason: ${this.rejectReason}`, 'warning');
    this.refreshKPIs();
    this.closeModal();
  }

  // Modal 5: Edit Action
  editDetails() {
    if (!this.selectedWithdrawal) return;

    this.withdrawals = this.withdrawals.map(w => {
      if (w.id === this.selectedWithdrawal!.id) {
        return { ...w, referenceNo: this.editReference, narration: this.editNarration };
      }
      return w;
    });

    this.showToast(`Details updated for transaction ${this.selectedWithdrawal.id}`, 'info');
    this.closeModal();
  }

  // Modal 6: Email Action
  sendEmail() {
    this.showToast(`Email alert sent to member ${this.selectedWithdrawal?.memberName} successfully!`, 'success');
    this.closeModal();
  }

  // Modal 7: SMS Action
  sendSMS() {
    this.showToast(`SMS message dispatched to phone ${this.selectedWithdrawal?.memberPhone}`, 'success');
    this.closeModal();
  }

  // Modal 8: Reversal Action
  reverseWithdrawal() {
    if (!this.selectedWithdrawal) return;
    if (this.revSupervisorPin !== '1234') {
      this.showToast('Invalid Supervisor security PIN!', 'error');
      return;
    }

    this.withdrawals = this.withdrawals.map(w => {
      if (w.id === this.selectedWithdrawal!.id) {
        return { ...w, status: 'Reversed', narration: `[REVERSED] ${w.narration} (${this.revReason})` };
      }
      return w;
    });

    const chanIdx = this.channels.findIndex(c => c.name === this.selectedWithdrawal!.channel);
    if (chanIdx !== -1) {
      this.channels[chanIdx].balance += this.selectedWithdrawal.amount;
      this.channels[chanIdx].dailyVolume = Math.max(0, this.channels[chanIdx].dailyVolume - this.selectedWithdrawal.amount);
    }

    this.showToast(`Withdrawal ${this.selectedWithdrawal.id} has been fully reversed. Member refunded.`, 'success');
    this.refreshKPIs();
    this.closeModal();
  }

  // Modal 9: Top Up Float Action
  topUpFloat() {
    const amount = parseFloat(this.floatTopUpAmount);
    if (!amount || amount <= 0) {
      this.showToast('Please enter a valid top-up amount', 'error');
      return;
    }

    this.channels = this.channels.map(c => {
      if (c.id === this.floatActionChannel) {
        return { ...c, balance: c.balance + amount };
      }
      return c;
    });

    this.showToast(`Successfully added $${amount.toLocaleString()} float.`, 'success');
    this.floatTopUpAmount = '';
    this.closeModal();
  }

  // Modal 10: Edit Limits Action
  saveTierLimits() {
    if (this.limitTier === 'tier1') {
      this.globalLimits.tier1Daily = this.tempLimitDaily;
      this.globalLimits.tier1Single = this.tempLimitSingle;
    } else if (this.limitTier === 'tier2') {
      this.globalLimits.tier2Daily = this.tempLimitDaily;
      this.globalLimits.tier2Single = this.tempLimitSingle;
    } else if (this.limitTier === 'tier3') {
      this.globalLimits.tier3Daily = this.tempLimitDaily;
      this.globalLimits.tier3Single = this.tempLimitSingle;
    } else if (this.limitTier === 'tier4') {
      this.globalLimits.tier4Daily = this.tempLimitDaily;
      this.globalLimits.tier4Single = this.tempLimitSingle;
    }

    this.showToast(`Withdrawal limits updated for ${this.limitTier.toUpperCase()} successfully.`, 'success');
    this.closeModal();
  }

  selectTierLimit(tier: 'tier1' | 'tier2' | 'tier3' | 'tier4') {
    this.limitTier = tier;
    if (tier === 'tier1') {
      this.tempLimitDaily = this.globalLimits.tier1Daily;
      this.tempLimitSingle = this.globalLimits.tier1Single;
    } else if (tier === 'tier2') {
      this.tempLimitDaily = this.globalLimits.tier2Daily;
      this.tempLimitSingle = this.globalLimits.tier2Single;
    } else if (tier === 'tier3') {
      this.tempLimitDaily = this.globalLimits.tier3Daily;
      this.tempLimitSingle = this.globalLimits.tier3Single;
    } else if (tier === 'tier4') {
      this.tempLimitDaily = this.globalLimits.tier4Daily;
      this.tempLimitSingle = this.globalLimits.tier4Single;
    }
  }

  // Modal 11: Toggle rule policy
  toggleRule(id: string) {
    this.rules = this.rules.map(r => {
      if (r.id === id) {
        const nextState = !r.enabled;
        this.showToast(`Rule '${r.name}' ${nextState ? 'enabled' : 'disabled'}`, nextState ? 'success' : 'warning');
        return { ...r, enabled: nextState };
      }
      return r;
    });
  }

  // Modal 12: Flagged Decision Action
  reviewFlaggedDecision(decision: 'whitelist' | 'escalate' | 'reject') {
    if (!this.selectedWithdrawal) return;

    if (decision === 'whitelist') {
      this.withdrawals = this.withdrawals.map(w => {
        if (w.id === this.selectedWithdrawal!.id) {
          return { ...w, status: 'Pending', riskScore: 10, flagReason: null };
        }
        return w;
      });
      this.showToast(`Transaction whitelisted. Moving to pending list.`, 'success');
    } else if (decision === 'escalate') {
      this.withdrawals = this.withdrawals.map(w => {
        if (w.id === this.selectedWithdrawal!.id) {
          return { ...w, narration: `[ESCALATED] ${w.narration}. Internal notes: ${this.flaggedActionNotes}` };
        }
        return w;
      });
      this.showToast(`Transaction escalated to Chief Security Officer.`, 'info');
    } else if (decision === 'reject') {
      this.withdrawals = this.withdrawals.map(w => {
        if (w.id === this.selectedWithdrawal!.id) {
          return { ...w, status: 'Rejected', flagReason: `Flagged Rejection: ${this.flaggedActionNotes || 'Security Risk'}` };
        }
        return w;
      });
      this.showToast(`Transaction rejected as security risk.`, 'error');
    }

    this.refreshKPIs();
    this.closeModal();
  }

  // Modal 13: Export Action
  startExport() {
    this.isExporting = true;
    this.exportProgress = 0;

    const interval = setInterval(() => {
      this.exportProgress += 20;
      if (this.exportProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.isExporting = false;
          this.showToast(`Exported records to ${this.exportFormat} successfully!`, 'success');
          this.closeModal();
        }, 300);
      }
    }, 150);
  }

  // Modal 14: Member limits check lookup
  lookupMember() {
    const mem = this.members.find(m => m.id.toUpperCase() === this.lookupMemberId.toUpperCase());
    if (mem) {
      this.searchedMember = mem;
      this.showToast(`Member found: ${mem.name}`, 'success');
    } else {
      this.searchedMember = null;
      this.showToast(`No member found with ID: ${this.lookupMemberId}`, 'error');
    }
  }

  // Modal 15: Batch processes
  processBatch() {
    if (this.selectedBatchIds.length === 0) {
      this.showToast('No withdrawals selected for batch processing', 'error');
      return;
    }

    if (this.batchActionType === 'Approve') {
      const targetBatchTxns = this.withdrawals.filter(w => this.selectedBatchIds.includes(w.id));
      const totalAmount = targetBatchTxns.reduce((sum, w) => sum + w.amount, 0);

      this.withdrawals = this.withdrawals.map(w => {
        if (this.selectedBatchIds.includes(w.id) && w.status === 'Pending') {
          return { ...w, status: 'Completed' };
        }
        return w;
      });

      this.showToast(`Successfully batch approved ${this.selectedBatchIds.length} withdrawals totaling $${totalAmount.toLocaleString()}`, 'success');
    } else {
      this.withdrawals = this.withdrawals.map(w => {
        if (this.selectedBatchIds.includes(w.id) && w.status === 'Pending') {
          return { ...w, status: 'Rejected', flagReason: `Batch Rejected: ${this.batchNotes || 'Audit cleanup'}` };
        }
        return w;
      });
      this.showToast(`Batch rejected ${this.selectedBatchIds.length} withdrawals`, 'warning');
    }

    this.selectedBatchIds = [];
    this.refreshKPIs();
    this.closeModal();
  }

  toggleSelectBatch(id: string) {
    if (this.selectedBatchIds.includes(id)) {
      this.selectedBatchIds = this.selectedBatchIds.filter(x => x !== id);
    } else {
      this.selectedBatchIds.push(id);
    }
  }

  toggleSelectAllBatch() {
    const pendIds = this.getFilteredWithdrawals().filter(w => w.status === 'Pending').map(w => w.id);
    if (this.selectedBatchIds.length === pendIds.length) {
      this.selectedBatchIds = [];
    } else {
      this.selectedBatchIds = [...pendIds];
    }
  }

  // Quick process handlers
  loadQuickProcessMember(id: string) {
    this.procMemberId = id;
    const m = this.members.find(x => x.id.toUpperCase() === id.toUpperCase());
    if (m) {
      this.procAccount = m.phone;
      this.showToast(`Profile loaded: ${m.name} (Savings: $${m.savingsBalance})`, 'info');
    }
  }

  runLimitCheck() {
    const m = this.members.find(x => x.id.toUpperCase() === this.procMemberId.toUpperCase());
    const amt = parseFloat(this.procAmount);

    if (!m) {
      this.showToast('Please specify a valid Member ID first', 'error');
      return;
    }
    if (!amt || amt <= 0) {
      this.showToast('Please specify a valid withdrawal amount', 'error');
      return;
    }

    if (amt > m.savingsBalance) {
      this.procLimitCheckPassed = false;
      this.showToast('Limit check failed: Amount exceeds savings balance', 'error');
    } else if (amt > m.dailyRemaining) {
      this.procLimitCheckPassed = false;
      this.showToast('Limit check failed: Amount exceeds daily limit threshold', 'error');
    } else {
      this.procLimitCheckPassed = true;
      this.showToast('Limit check passed successfully! All rules clean.', 'success');
      this.procStep = 3;
    }
  }

  executeQuickProcess() {
    const m = this.members.find(x => x.id.toUpperCase() === this.procMemberId.toUpperCase());
    if (!m || !this.procAmount) return;
    if (this.procOTP !== '654321') {
      this.showToast('Invalid OTP Verification Code! Use 654321 for testing.', 'error');
      return;
    }

    const amt = parseFloat(this.procAmount);
    const newTxnId = `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRef = `${this.procChannel.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const newTxn: Withdrawal = {
      id: newTxnId,
      memberId: m.id,
      memberName: m.name,
      memberEmail: m.email,
      memberPhone: m.phone,
      amount: amt,
      fee: amt * 0.005 + 10,
      channel: this.procChannel,
      account: this.procAccount,
      status: 'Completed',
      timestamp: '2026-03-24 10:30 AM',
      riskScore: m.riskScore,
      flagReason: null,
      narration: this.procNarration || 'Quick Counter Withdrawal',
      referenceNo: newRef
    };

    this.withdrawals.unshift(newTxn);

    // Update float
    const chanIdx = this.channels.findIndex(c => c.name === this.procChannel);
    if (chanIdx !== -1) {
      this.channels[chanIdx].balance -= amt;
      this.channels[chanIdx].dailyVolume += amt;
    }

    // Update member limits & savings balance
    this.members = this.members.map(mem => {
      if (mem.id === m.id) {
        return { 
          ...mem, 
          dailyRemaining: mem.dailyRemaining - amt, 
          savingsBalance: mem.savingsBalance - amt 
        };
      }
      return mem;
    });

    this.showToast(`Withdrawal of $${amt} executed. Reference: ${newRef}`, 'success');
    
    // Auto-open receipt modal
    this.openModal('receipt', newTxn);

    // Reset wizard
    this.procMemberId = '';
    this.procAmount = '';
    this.procAccount = '';
    this.procNarration = '';
    this.procLimitCheckPassed = null;
    this.procOTP = '';
    this.procStep = 1;
    this.activeTab = 'all';
    this.refreshKPIs();
  }

  // Dropdown template synchronization helper
  handleEmailTemplateChange(tmpl: string) {
    if (!this.selectedWithdrawal) return;
    this.emailTemplate = tmpl;
    if (tmpl === 'Withdrawal Complete') {
      this.emailSubject = 'SaccoPay Transaction Alert: Withdrawal Success';
      this.emailBody = `Dear ${this.selectedWithdrawal.memberName},\n\nWe are pleased to inform you that your withdrawal of $${this.selectedWithdrawal.amount.toLocaleString()} via ${this.selectedWithdrawal.channel} was completed successfully. Reference No: ${this.selectedWithdrawal.referenceNo}.\n\nThank you for choosing SaccoPay.`;
    } else if (tmpl === 'Security Alert') {
      this.emailSubject = 'URGENT: SaccoPay Withdrawal Security Review';
      this.emailBody = `Dear ${this.selectedWithdrawal.memberName},\n\nOur automated security system has flagged a pending withdrawal of $${this.selectedWithdrawal.amount.toLocaleString()} via ${this.selectedWithdrawal.channel}.\n\nReason: High Amount Velocity. Please verify this action or call support immediately.`;
    } else if (tmpl === 'Withdrawal Delayed') {
      this.emailSubject = 'SaccoPay Notification: Withdrawal Processing Delayed';
      this.emailBody = `Dear ${this.selectedWithdrawal.memberName},\n\nYour withdrawal request of $${this.selectedWithdrawal.amount.toLocaleString()} is currently delayed due to payment gateway maintenance. We expect it to clear in 2 hours.`;
    } else if (tmpl === 'Reversal Complete') {
      this.emailSubject = 'SaccoPay Transaction Alert: Reversal Complete';
      this.emailBody = `Dear ${this.selectedWithdrawal.memberName},\n\nWe have processed a full reversal for your withdrawal of $${this.selectedWithdrawal.amount.toLocaleString()} on reference ${this.selectedWithdrawal.referenceNo}. The funds have been refunded to your FOSA savings account.`;
    }
  }

  handleSmsTemplateChange(tmpl: string) {
    if (!this.selectedWithdrawal) return;
    this.smsTemplate = tmpl;
    if (tmpl === 'Withdrawal Code') {
      this.smsBody = `SaccoPay Alert: Withdrawal of KES ${this.selectedWithdrawal.amount.toLocaleString()} via ${this.selectedWithdrawal.channel} is successful. Ref: ${this.selectedWithdrawal.referenceNo}. Support: +254 700 000 000.`;
    } else if (tmpl === 'OTP Request') {
      this.smsBody = `SaccoPay OTP: 819204 is your verification code for the withdrawal request of $${this.selectedWithdrawal.amount.toLocaleString()}. Expires in 5 minutes.`;
    } else if (tmpl === 'Fraud Flag') {
      this.smsBody = `CRITICAL Alert: Security review triggered for withdrawal of $${this.selectedWithdrawal.amount.toLocaleString()}. Call Sacco Support immediately if not you.`;
    }
  }
}
