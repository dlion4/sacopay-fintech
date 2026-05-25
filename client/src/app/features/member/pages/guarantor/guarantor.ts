import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TabId = 'guaranteeing' | 'incoming' | 'mine' | 'history' | 'score';
type ModalId =
  | 'record'
  | 'exposure'
  | 'contact'
  | 'payments'
  | 'decline'
  | 'approve'
  | 'thank'
  | 'select'
  | 'reminder'
  | 'cancel'
  | 'details'
  | 'works'
  | 'notifications'
  | null;

export interface Guarantee {
  id: string;
  initials: string;
  name: string;
  memberId: string;
  loanType: string;
  since: string;
  status: 'Active' | 'Overdue' | 'Completed' | 'Released' | 'Declined';
  loanAmount: number;
  exposure: number;
  repaidPercent: number;
  repaidLabel: string;
  outstanding: number;
  lastPayment?: string;
  overdueAmount?: number;
  daysOverdue?: number;
  risk?: string;
  warning?: string;
  tone: 'blue' | 'green' | 'red' | 'purple';
}

export interface IncomingRequest {
  id: string;
  initials: string;
  name: string;
  memberId: string;
  meta: string;
  loanAmount: number;
  yourExposure: number;
  purpose: string;
  tenure: string;
  position: string;
  expires: string;
  kyc: boolean;
  membership: string;
  creditScore: string;
  flags: string[];
  flagTone?: 'warn' | 'danger';
  caution?: string;
  tone: 'blue' | 'orange';
}

export interface MyGuarantor {
  initials: string;
  name: string;
  memberId: string;
  role: string;
  exposure: number;
  confirmedDate: string;
  position: number;
  tone: 'green' | 'purple' | 'blue';
}

export interface HistoryRow {
  borrower: string;
  memberId: string;
  loanType: string;
  amount: number;
  exposure: number;
  status: 'Completed' | 'Released' | 'Declined';
  period: string;
}

@Component({
  selector: 'app-guarantor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guarantor.html',
  styleUrl: './guarantor.scss',
})
export class GuarantorComponent {
  activeTab: TabId = 'guaranteeing';
  activeModal: ModalId = null;
  selectedGuarantee: Guarantee | null = null;
  selectedRequest: IncomingRequest | null = null;
  selectedHistory: HistoryRow | null = null;
  contactChannel: 'sms' | 'in-app' = 'sms';
  contactMessage = '';
  declineReason = 'Personal financial constraints';
  declineMessage = '';
  approveOtp = '';
  toast: { text: string; tone: 'success' | 'info' | 'warning' | 'danger' } | null = null;

  readonly tabs: { id: TabId; label: string; badge?: number; tone?: 'amber' | 'blue' | 'red' }[] = [
    { id: 'guaranteeing', label: "I'm Guaranteeing", badge: 3, tone: 'blue' },
    { id: 'incoming', label: 'Incoming Requests', badge: 2, tone: 'amber' },
    { id: 'mine', label: "My Loans' Guarantors", badge: 2, tone: 'blue' },
    { id: 'history', label: 'History', badge: 5, tone: 'amber' },
    { id: 'score', label: 'My Score' },
  ];

  readonly overviewStats = [
    { label: "I'm Guaranteeing", value: '3', meta: 'Active guarantorships', tone: 'blue' },
    { label: "My Loans' Guarantors", value: '2', meta: 'Confirmed guarantors', tone: 'blue' },
    { label: 'Incoming Requests', value: '2', meta: 'Awaiting your approval', tone: 'amber' },
    { label: 'Completed', value: '5', meta: 'All-time fulfilled', tone: 'green' },
  ];

  readonly guarantees: Guarantee[] = [
    {
      id: 'g-001',
      initials: 'PO',
      name: 'Peter Omondi',
      memberId: 'SP-10145',
      loanType: 'Business Loan',
      since: 'Since Aug 2024',
      status: 'Active',
      loanAmount: 500000,
      exposure: 250000,
      repaidPercent: 42,
      repaidLabel: '42% (8/24 mo)',
      outstanding: 300000,
      lastPayment: 'Dec 15, 2024',
      tone: 'purple',
    },
    {
      id: 'g-002',
      initials: 'MA',
      name: 'Mary Achieng',
      memberId: 'SP-10018',
      loanType: 'Personal Loan',
      since: 'Since Oct 2024',
      status: 'Active',
      loanAmount: 250000,
      exposure: 125000,
      repaidPercent: 25,
      repaidLabel: '25% (3/12 mo)',
      outstanding: 187500,
      lastPayment: 'Dec 18, 2024',
      tone: 'blue',
    },
    {
      id: 'g-003',
      initials: 'SK',
      name: 'Samuel Kibet',
      memberId: 'SP-10189',
      loanType: 'Agriculture Loan',
      since: 'Since Jun 2024',
      status: 'Overdue',
      loanAmount: 400000,
      exposure: 200000,
      repaidPercent: 22,
      repaidLabel: '22% (5/24 mo)',
      outstanding: 312000,
      overdueAmount: 22000,
      daysOverdue: 22,
      risk: 'HIGH',
      warning:
        '22 days overdue — Missed December installment (KES 22,000). Your guarantee of KES 200,000 is at risk. Please contact the borrower.',
      tone: 'red',
    },
  ];

  readonly incomingRequests: IncomingRequest[] = [
    {
      id: 'r-001',
      initials: 'GA',
      name: 'Grace Akinyi',
      memberId: 'SP-10067',
      meta: 'Personal Loan Request · Sent 2 hours ago',
      loanAmount: 300000,
      yourExposure: 150000,
      purpose: 'School Fees',
      tenure: '12 months',
      position: 'You are #1 of 2',
      expires: 'Dec 25, 2024',
      kyc: true,
      membership: '2yr member',
      creditScore: '742',
      flags: ['1 previous late payment'],
      flagTone: 'warn',
      tone: 'blue',
    },
    {
      id: 'r-002',
      initials: 'BK',
      name: 'Bernard Kiprop',
      memberId: 'SP-10078',
      meta: 'Business Loan Request · Sent Yesterday',
      loanAmount: 750000,
      yourExposure: 375000,
      purpose: 'Business Expansion',
      tenure: '24 months',
      position: 'You are #2 of 2',
      expires: 'Dec 26, 2024',
      kyc: true,
      membership: '3yr member',
      creditScore: '645 (Fair)',
      flags: ['AML alert noted'],
      flagTone: 'danger',
      caution:
        'Caution: This exposure (KES 375,000) would use 43% of your remaining guarantee capacity. An AML alert was recently flagged on this account.',
      tone: 'orange',
    },
  ];

  readonly myGuarantors: MyGuarantor[] = [
    {
      initials: 'WO',
      name: 'William Ochieng',
      memberId: 'SP-10005',
      role: 'Chairman',
      exposure: 90000,
      confirmedDate: 'Sep 2, 2024',
      position: 1,
      tone: 'green',
    },
    {
      initials: 'AN',
      name: 'Agnes Nyaboke',
      memberId: 'SP-10012',
      role: 'Treasurer',
      exposure: 90000,
      confirmedDate: 'Sep 2, 2024',
      position: 2,
      tone: 'purple',
    },
  ];

  readonly historyRows: HistoryRow[] = [
    {
      borrower: 'Alice Muthoni',
      memberId: 'SP-10042',
      loanType: 'Personal Loan',
      amount: 150000,
      exposure: 75000,
      status: 'Completed',
      period: 'Jan–Dec 2023',
    },
    {
      borrower: 'Daniel Kipchoge',
      memberId: 'SP-10098',
      loanType: 'Business Loan',
      amount: 300000,
      exposure: 150000,
      status: 'Completed',
      period: 'Mar–Mar 2024',
    },
    {
      borrower: 'Jane Wanjiru',
      memberId: 'SP-10201',
      loanType: 'Education Loan',
      amount: 200000,
      exposure: 100000,
      status: 'Completed',
      period: 'May–May 2024',
    },
    {
      borrower: 'Rose Nyambura',
      memberId: 'SP-10156',
      loanType: 'Emergency Loan',
      amount: 50000,
      exposure: 25000,
      status: 'Released',
      period: 'Aug–Nov 2023',
    },
    {
      borrower: 'Evans Wafula',
      memberId: 'SP-10203',
      loanType: 'Agriculture Loan',
      amount: 180000,
      exposure: 90000,
      status: 'Declined',
      period: 'Dec 2022',
    },
  ];

  readonly tipsForBorrowers = [
    {
      title: 'Choose wisely.',
      body: 'Ask people who trust you and have capacity — colleagues, family, or SACCO officials.',
    },
    {
      title: 'Communicate.',
      body: 'Inform guarantors about the loan purpose and your repayment plan.',
    },
    {
      title: 'Pay on time.',
      body: "Late payments damage your guarantors' capacity and your relationship.",
    },
    {
      title: 'Appreciate them.',
      body: 'Use the "Thank Guarantor" feature to send a message of gratitude.',
    },
  ];

  readonly benefits = [
    {
      title: '3.5× Capacity',
      body: 'Guarantee up to KES 875,000 based on your savings',
      tone: 'blue',
    },
    {
      title: 'Priority Processing',
      body: 'Your own loan applications get faster approvals',
      tone: 'green',
    },
    {
      title: 'Trusted Status',
      body: 'Members prefer A+ guarantors — you get fewer rejections',
      tone: 'purple',
    },
    {
      title: 'Reduce to A',
      body: "Resolve Samuel's overdue to maintain your A+ score",
      tone: 'orange',
    },
  ];

  readonly scoreBreakdown = [
    { label: 'Reliability (promises kept)', value: 95 },
    { label: 'Loan performance (own)', value: 90 },
    { label: 'Capacity utilization', value: 70 },
    { label: 'Default history', value: 100 },
  ];

  readonly capacity = {
    savings: 250000,
    maxGuarantee: 875000,
    currentlyGuaranteed: 575000,
    remaining: 300000,
    graceRequest: 150000,
    bernardRequest: 375000,
  };

  readonly declineReasons = [
    'Personal financial constraints',
    'Already at maximum capacity',
    'Concerned about borrower history',
    'Need more information',
    'Not comfortable with loan size',
    'Other',
  ];

  readonly paymentTimeline = [
    { date: 'Dec 15, 2024', text: 'Installment 8 — KES 28,750 paid via M-Pesa ✓' },
    { date: 'Nov 15, 2024', text: 'Installment 7 — KES 28,750 paid via M-Pesa ✓' },
    { date: 'Oct 15, 2024', text: 'Installment 6 — KES 28,750 paid via M-Pesa ✓' },
    { date: 'Sep 15, 2024', text: 'Installment 5 — KES 28,750 paid via Bank Transfer ✓' },
    { date: 'Aug 15, 2024', text: 'Loan disbursed — KES 500,000 sent to Peter Omondi' },
  ];

  setTab(id: TabId): void {
    this.activeTab = id;
  }

  openModal(modal: ModalId): void {
    this.activeModal = modal;
  }

  closeModal(): void {
    this.activeModal = null;
  }

  viewExposure(): void {
    this.openModal('exposure');
  }

  openContact(guarantee: Guarantee): void {
    this.selectedGuarantee = guarantee;
    this.contactChannel = 'sms';
    this.contactMessage = `Dear ${guarantee.name.split(' ')[0]}, this is a friendly reminder that your loan installment is overdue. Please make payment as soon as possible to avoid further penalties. As your guarantor, I am concerned — please reach out. — John Kamau`;
    this.openModal('contact');
  }

  openPayments(guarantee: Guarantee): void {
    this.selectedGuarantee = guarantee;
    this.openModal('payments');
  }

  openDetails(guarantee: Guarantee): void {
    this.selectedGuarantee = guarantee;
    this.openModal('details');
  }

  openHistoryRecord(row: HistoryRow): void {
    this.selectedHistory = row;
    this.openModal('record');
  }

  openIncomingDetails(request: IncomingRequest): void {
    this.selectedRequest = request;
    this.openModal('details');
  }

  startApprove(request: IncomingRequest): void {
    this.selectedRequest = request;
    this.approveOtp = '';
    this.openModal('approve');
  }

  startDecline(request: IncomingRequest): void {
    this.selectedRequest = request;
    this.declineReason = this.declineReasons[0];
    this.declineMessage = '';
    this.openModal('decline');
  }

  confirmDecline(): void {
    const name = this.selectedRequest?.name ?? 'request';
    this.closeModal();
    this.showToast(`Declined ${name}'s guarantor request.`, 'warning');
  }

  confirmApprove(): void {
    if (this.approveOtp.length < 4) {
      this.showToast('Enter the 6-digit OTP sent to your phone.', 'warning');
      return;
    }
    const name = this.selectedRequest?.name ?? 'request';
    this.closeModal();
    this.showToast(`Approved guarantorship for ${name}. ✓`, 'success');
  }

  sendContactMessage(): void {
    this.closeModal();
    this.showToast('Message delivered to the borrower.', 'success');
  }

  thankGuarantor(guarantor: MyGuarantor): void {
    this.showToast(`Thank-you note sent to ${guarantor.name}.`, 'success');
  }

  releaseGuarantee(): void {
    this.closeModal();
    this.showToast('Release request submitted to SACCO officials.', 'info');
  }

  resendReminder(): void {
    this.closeModal();
    this.showToast('Reminder resent to guarantor.', 'success');
  }

  cancelRequest(): void {
    this.closeModal();
    this.showToast('Request cancelled.', 'warning');
  }

  selectGuarantor(): void {
    this.closeModal();
    this.showToast('Guarantor selection saved.', 'success');
  }

  downloadStatement(): void {
    this.showToast('Statement prepared for download.', 'success');
  }

showToast(text: string, tone: 'success' | 'info' | 'warning' | 'danger' = 'info'): void {
  this.toast = { text, tone };
  window.setTimeout(() => { this.toast = null; }, 3400);
}
}
