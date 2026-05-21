import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ═════════════════════════════════════════════════════════════════════════════
//  INTERFACES
// ═════════════════════════════════════════════════════════════════════════════
export interface NavItem {
  section?: string;
  label?: string;
  icon?: string;
  badge?: number;
  active?: boolean;
}

export interface ApprovalRequest {
  id: string;
  reference: string;
  type: string;
  submittedBy: string;
  submittedByRole: string;
  dateSubmitted: string;
  deadline: string;
  daysRemaining: number;
  priority: 'Urgent' | 'High' | 'Normal' | 'Low';
  attachment?: { name: string; size: string };
  reviewNotes: { author: string; ts: string; text: string; system?: boolean }[];
  category: 'Regulatory' | 'Policy' | 'AML' | 'KYC' | 'Internal';
}

export interface RegulatoryFiling {
  id: string;
  filing: string;
  regulator: string;
  period: string;
  deadline: string;
  status: 'Pending' | 'Draft' | 'Approved' | 'Submitted' | 'Overdue';
  submittedDate?: string;
  notes?: string;
}

export interface AMLAlert {
  id: string;
  alertRef: string;
  memberName: string;
  memberCode: string;
  memberInitials: string;
  memberColor: string;
  type: string;
  amount: number;
  risk: 'High' | 'Medium' | 'Low';
  detected: string;
  status: 'Review' | 'Escalated' | 'Cleared' | 'Reported';
  kycStatus: string;
  membership: string;
  previousAlerts: string;
  accountStatus: string;
  pepStatus: string;
  sanctionsCheck: string;
  transactions: { date: string; type: string; amount: number; channel: string }[];
}

export interface KYCDocument {
  id: string;
  memberName: string;
  memberCode: string;
  memberInitials: string;
  memberColor: string;
  document: string;
  expiry: string;
  daysLeft: number;
  status: 'Expiring' | 'Expired' | 'Pending';
}

export interface CompliancePolicy {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  status: 'Active' | 'Pending Approval' | 'Archived' | 'Draft';
  nextReview: string;
  approvedBy?: string;
  effectiveDate?: string;
  documentName?: string;
  documentSize?: string;
  history?: { version: string; date: string; change: string; approver: string }[];
}

export interface AuditEvent {
  id: string;
  ts: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ChecklistItem {
  category: string;
  items: { label: string; status: 'done' | 'pending' | 'warning'; note?: string }[];
}

export interface ToastMsg { msg: string; type: 'success' | 'error'; }
type ComplianceTab = 'Pending Approvals' | 'Regulatory Filings' | 'AML Monitoring' | 'KYC Oversight' | 'Policies';

// ═════════════════════════════════════════════════════════════════════════════
//  COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compliance.html',
  styleUrls: ['./compliance.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceComponent {

  // ────────── NAV / SIDEBAR ──────────
  readonly navItems: NavItem[] = [
    { section: 'MAIN MENU' },
    { label: 'Dashboard', icon: '⊞' },
    { label: 'Analytics', icon: '↗' },
    { section: 'MEMBERS & KYC' },
    { label: 'Members', icon: '👥' },
    { label: 'KYC Verification', icon: '⊙' },
    { section: 'FINANCIAL OPERATIONS' },
    { label: 'Transactions', icon: '⇄' },
    { label: 'Loan Disbursements', icon: '⊕' },
    { label: 'Loan Repayments', icon: '↺' },
    { label: 'Savings', icon: '⊓' },
    { label: 'SACCOPay Wallet', icon: '◈' },
    { section: 'REPORTS & COMPLIANCE' },
    { label: 'Reports', icon: '≡' },
    { label: 'Compliance & Regulatory', icon: '◉', active: true, badge: 8 },
    { label: 'Audit Trail', icon: '⌖' },
    { section: 'SETTINGS' },
    { label: 'Settings', icon: '⚙' },
    { label: 'Notifications', icon: '🔔' },
  ];

  // ────────── DATA: PENDING APPROVALS ──────────
  readonly APPROVALS: ApprovalRequest[] = [
    {
      id: 'a1', reference: 'CMP-2024-0891',
      type: 'SASRA Quarterly Return — Q4 2024',
      submittedBy: 'David Otieno', submittedByRole: 'Compliance Assistant',
      dateSubmitted: 'Dec 18, 2024', deadline: 'Jan 15, 2025', daysRemaining: 28,
      priority: 'Urgent',
      attachment: { name: 'SASRA_Q4_2024_Return.pdf', size: '2.4 MB' },
      reviewNotes: [
        { author: 'David Otieno', ts: 'Dec 18, 10:30 AM', text: 'Q4 return completed. All figures reconciled with GL. Attached supporting schedules.' },
        { author: 'System', ts: 'Dec 18, 11:00 AM', text: 'Auto-validation passed ✓ All mandatory fields populated. Figures within expected ranges.', system: true },
      ],
      category: 'Regulatory',
    },
    {
      id: 'a2', reference: 'CMP-2024-0890',
      type: 'Loan Recovery Policy v3.2 — Update',
      submittedBy: 'Mary Wambui', submittedByRole: 'Risk Manager',
      dateSubmitted: 'Dec 17, 2024', deadline: 'Dec 28, 2024', daysRemaining: 10,
      priority: 'Urgent',
      attachment: { name: 'Loan_Recovery_Policy_v3.2.pdf', size: '1.1 MB' },
      reviewNotes: [
        { author: 'Mary Wambui', ts: 'Dec 17, 02:15 PM', text: 'Updated recovery escalation matrix per Board recommendation. Added auctioneer engagement procedures.' },
      ],
      category: 'Policy',
    },
    {
      id: 'a3', reference: 'CMP-2024-0889',
      type: 'AML Investigation — Case AML-0452',
      submittedBy: 'Peter Kamau', submittedByRole: 'AML Analyst',
      dateSubmitted: 'Dec 17, 2024', deadline: 'Dec 24, 2024', daysRemaining: 6,
      priority: 'Urgent',
      attachment: { name: 'AML_0452_Investigation_Report.pdf', size: '780 KB' },
      reviewNotes: [
        { author: 'Peter Kamau', ts: 'Dec 17, 04:40 PM', text: 'Structuring pattern confirmed on member SP-10078. Recommending FRC suspicious transaction report (STR) filing.' },
      ],
      category: 'AML',
    },
    {
      id: 'a4', reference: 'CMP-2024-0888',
      type: 'KYC Override Request — 3 Members',
      submittedBy: 'Grace Njeri', submittedByRole: 'KYC Officer',
      dateSubmitted: 'Dec 16, 2024', deadline: 'Dec 22, 2024', daysRemaining: 4,
      priority: 'High',
      reviewNotes: [
        { author: 'Grace Njeri', ts: 'Dec 16, 09:00 AM', text: 'Diaspora members unable to provide notarised originals on time. Requesting 30-day override.' },
      ],
      category: 'KYC',
    },
    {
      id: 'a5', reference: 'CMP-2024-0887',
      type: 'Annual Financial Return (FY 2024) — Draft Review',
      submittedBy: 'Finance Team', submittedByRole: 'Finance Department',
      dateSubmitted: 'Dec 15, 2024', deadline: 'Mar 31, 2025', daysRemaining: 102,
      priority: 'Normal',
      attachment: { name: 'Annual_Financial_Return_FY2024_DRAFT.xlsx', size: '4.8 MB' },
      reviewNotes: [
        { author: 'Finance Team', ts: 'Dec 15, 03:20 PM', text: 'Draft AFR ready for compliance review. External auditors will finalise post-board approval.' },
      ],
      category: 'Regulatory',
    },
    {
      id: 'a6', reference: 'CMP-2024-0886',
      type: 'Data Protection Impact Assessment',
      submittedBy: 'IT Department', submittedByRole: 'CISO Office',
      dateSubmitted: 'Dec 14, 2024', deadline: 'Jan 10, 2025', daysRemaining: 23,
      priority: 'Normal',
      attachment: { name: 'DPIA_Member_Portal_2024.pdf', size: '1.5 MB' },
      reviewNotes: [
        { author: 'IT Department', ts: 'Dec 14, 11:45 AM', text: 'DPIA for new member self-service portal. No high-risk processing identified.' },
      ],
      category: 'Internal',
    },
    {
      id: 'a7', reference: 'CMP-2024-0885',
      type: 'Withholding Tax Return (Nov 2024)',
      submittedBy: 'Tax Officer', submittedByRole: 'Finance Department',
      dateSubmitted: 'Dec 13, 2024', deadline: 'Dec 20, 2024', daysRemaining: 2,
      priority: 'High',
      attachment: { name: 'WHT_Return_Nov2024.pdf', size: '420 KB' },
      reviewNotes: [
        { author: 'Tax Officer', ts: 'Dec 13, 04:10 PM', text: 'Withholding tax on member dividend interest. Total KES 1,240,500.' },
      ],
      category: 'Regulatory',
    },
    {
      id: 'a8', reference: 'CMP-2024-0884',
      type: 'Board Meeting Minutes — Dec 2024',
      submittedBy: 'Corp Secretary', submittedByRole: 'Governance',
      dateSubmitted: 'Dec 12, 2024', deadline: 'Dec 30, 2024', daysRemaining: 12,
      priority: 'Normal',
      attachment: { name: 'Board_Minutes_Dec2024.pdf', size: '680 KB' },
      reviewNotes: [
        { author: 'Corp Secretary', ts: 'Dec 12, 02:00 PM', text: 'Minutes from quarterly board meeting. 3 resolutions passed including dividend declaration.' },
      ],
      category: 'Internal',
    },
  ];

  // ────────── DATA: REGULATORY FILINGS ──────────
  readonly FILINGS: RegulatoryFiling[] = [
    { id: 'f1', filing: 'SASRA Quarterly Return', regulator: 'SASRA', period: 'Q4 2024', deadline: 'Jan 15, 2025', status: 'Pending' },
    { id: 'f2', filing: 'Annual Financial Return', regulator: 'SASRA', period: 'FY 2024', deadline: 'Mar 31, 2025', status: 'Draft' },
    { id: 'f3', filing: 'SASRA Quarterly Return', regulator: 'SASRA', period: 'Q3 2024', deadline: 'Oct 15, 2024', status: 'Approved', submittedDate: 'Oct 12, 2024' },
    { id: 'f4', filing: 'Withholding Tax Return', regulator: 'KRA', period: 'Nov 2024', deadline: 'Dec 20, 2024', status: 'Submitted', submittedDate: 'Dec 18, 2024' },
    { id: 'f5', filing: 'AML/CTF Annual Report', regulator: 'FRC', period: 'FY 2024', deadline: 'Jan 31, 2025', status: 'Draft' },
    { id: 'f6', filing: 'SASRA Quarterly Return', regulator: 'SASRA', period: 'Q2 2024', deadline: 'Jul 15, 2024', status: 'Approved', submittedDate: 'Jul 10, 2024' },
    { id: 'f7', filing: 'NSSF Compliance Return', regulator: 'NSSF', period: 'Nov 2024', deadline: 'Dec 09, 2024', status: 'Approved', submittedDate: 'Dec 05, 2024' },
    { id: 'f8', filing: 'Data Protection Annual Filing', regulator: 'ODPC', period: 'FY 2024', deadline: 'Feb 28, 2025', status: 'Draft' },
  ];

  // ────────── DATA: AML ALERTS ──────────
  readonly AML_ALERTS: AMLAlert[] = [
    {
      id: 'aml1', alertRef: 'AML-0452',
      memberName: 'Bernard Kiprop', memberCode: 'SP-10078', memberInitials: 'BK', memberColor: '#f44336',
      type: 'Structuring', amount: 980000, risk: 'High',
      detected: 'Dec 17, 2024', status: 'Review',
      kycStatus: 'Verified', membership: '3 years 4 months',
      previousAlerts: '1 (cleared Dec 2023)',
      accountStatus: 'Flagged', pepStatus: 'No', sanctionsCheck: 'Clear',
      transactions: [
        { date: 'Dec 17, 9:15 AM', type: 'Deposit', amount: 245000, channel: 'M-Pesa' },
        { date: 'Dec 17, 9:42 AM', type: 'Deposit', amount: 248000, channel: 'M-Pesa' },
        { date: 'Dec 17, 10:10 AM', type: 'Deposit', amount: 240000, channel: 'M-Pesa' },
        { date: 'Dec 17, 11:05 AM', type: 'Deposit', amount: 247000, channel: 'Airtel' },
      ],
    },
    {
      id: 'aml2', alertRef: 'AML-0451',
      memberName: 'Grace Akinyi', memberCode: 'SP-10067', memberInitials: 'GA', memberColor: '#ff9800',
      type: 'Large Cash Deposit', amount: 1200000, risk: 'Medium',
      detected: 'Dec 15, 2024', status: 'Review',
      kycStatus: 'Verified', membership: '5 years 2 months',
      previousAlerts: 'None',
      accountStatus: 'Active', pepStatus: 'No', sanctionsCheck: 'Clear',
      transactions: [
        { date: 'Dec 15, 11:20 AM', type: 'Deposit', amount: 1200000, channel: 'Bank Transfer' },
      ],
    },
    {
      id: 'aml3', alertRef: 'AML-0450',
      memberName: 'Michael Odera', memberCode: 'SP-10124', memberInitials: 'MO', memberColor: '#2196f3',
      type: 'Unusual Pattern', amount: 450000, risk: 'Medium',
      detected: 'Dec 12, 2024', status: 'Review',
      kycStatus: 'Verified', membership: '1 year 9 months',
      previousAlerts: 'None',
      accountStatus: 'Active', pepStatus: 'No', sanctionsCheck: 'Clear',
      transactions: [
        { date: 'Dec 10–12', type: 'Multiple', amount: 450000, channel: 'Mixed' },
      ],
    },
    {
      id: 'aml4', alertRef: 'AML-0449',
      memberName: 'Jane Wanjiru', memberCode: 'SP-10201', memberInitials: 'JW', memberColor: '#00bcd4',
      type: 'Cross-border Transfer', amount: 320000, risk: 'Low',
      detected: 'Dec 10, 2024', status: 'Escalated',
      kycStatus: 'Verified', membership: '7 years',
      previousAlerts: 'None',
      accountStatus: 'Active', pepStatus: 'No', sanctionsCheck: 'Clear',
      transactions: [
        { date: 'Dec 10, 02:30 PM', type: 'Outbound Wire', amount: 320000, channel: 'SWIFT' },
      ],
    },
    {
      id: 'aml5', alertRef: 'AML-0448',
      memberName: 'Samuel Kibet', memberCode: 'SP-10189', memberInitials: 'SK', memberColor: '#9c27b0',
      type: 'Rapid Movement', amount: 180000, risk: 'Low',
      detected: 'Dec 8, 2024', status: 'Cleared',
      kycStatus: 'Verified', membership: '2 years 5 months',
      previousAlerts: 'None',
      accountStatus: 'Active', pepStatus: 'No', sanctionsCheck: 'Clear',
      transactions: [
        { date: 'Dec 8, 11:00 AM', type: 'Deposit', amount: 180000, channel: 'Cash' },
        { date: 'Dec 8, 03:30 PM', type: 'Withdrawal', amount: 180000, channel: 'M-Pesa' },
      ],
    },
  ];

  // ────────── DATA: KYC DOCUMENTS ──────────
  readonly KYC_DOCS: KYCDocument[] = [
    { id: 'k1', memberName: 'Rose Nyambura', memberCode: 'SP-10156', memberInitials: 'RN', memberColor: '#f44336', document: 'National ID', expiry: 'Dec 25, 2024', daysLeft: 7, status: 'Expiring' },
    { id: 'k2', memberName: 'Peter Omondi', memberCode: 'SP-10145', memberInitials: 'PO', memberColor: '#ff9800', document: 'KRA PIN Certificate', expiry: 'Jan 5, 2025', daysLeft: 18, status: 'Expiring' },
    { id: 'k3', memberName: 'Mary Wanjiku', memberCode: 'SP-10023', memberInitials: 'MW', memberColor: '#2196f3', document: 'Passport', expiry: 'Jan 12, 2025', daysLeft: 25, status: 'Expiring' },
    { id: 'k4', memberName: 'John Mwangi', memberCode: 'SP-10310', memberInitials: 'JM', memberColor: '#9c27b0', document: 'National ID', expiry: 'Jan 18, 2025', daysLeft: 28, status: 'Expiring' },
    { id: 'k5', memberName: 'Lucy Achieng', memberCode: 'SP-10067', memberInitials: 'LA', memberColor: '#00bcd4', document: 'Proof of Address', expiry: 'Jan 22, 2025', daysLeft: 30, status: 'Expiring' },
  ];

  // ────────── DATA: POLICIES ──────────
  readonly POLICIES: CompliancePolicy[] = [
    {
      id: 'p1', title: 'Anti-Money Laundering Policy', category: 'AML/CTF', version: 'v4.1',
      lastUpdated: 'Sep 2024', status: 'Active', nextReview: 'Sep 2025',
      approvedBy: 'Board of Directors — Resolution BR/2024/045',
      effectiveDate: 'Sep 15, 2024',
      documentName: 'AML_Policy_v4.1.pdf', documentSize: '1.8 MB',
      history: [
        { version: 'v4.1', date: 'Sep 2024', change: 'Updated transaction thresholds per SASRA directive', approver: 'Board' },
        { version: 'v4.0', date: 'Mar 2024', change: 'Added PEP screening procedures', approver: 'Board' },
        { version: 'v3.5', date: 'Sep 2023', change: 'Annual review — minor updates', approver: 'Board' },
      ],
    },
    {
      id: 'p2', title: 'Know Your Customer (KYC) Policy', category: 'KYC', version: 'v3.0',
      lastUpdated: 'Jul 2024', status: 'Active', nextReview: 'Jul 2025',
      approvedBy: 'Board of Directors',
      effectiveDate: 'Jul 1, 2024',
      documentName: 'KYC_Policy_v3.0.pdf', documentSize: '1.2 MB',
      history: [
        { version: 'v3.0', date: 'Jul 2024', change: 'IPRS integration & e-KYC procedures added', approver: 'Board' },
        { version: 'v2.5', date: 'Jan 2024', change: 'Enhanced due diligence for diaspora members', approver: 'Board' },
      ],
    },
    {
      id: 'p3', title: 'Loan Recovery Policy', category: 'Lending', version: 'v3.2',
      lastUpdated: 'Dec 2024', status: 'Pending Approval', nextReview: '—',
      approvedBy: 'Pending Board approval',
      effectiveDate: 'Pending',
      documentName: 'Loan_Recovery_Policy_v3.2.pdf', documentSize: '1.1 MB',
      history: [
        { version: 'v3.2', date: 'Dec 2024', change: 'Updated escalation matrix; auctioneer engagement added', approver: 'Pending' },
        { version: 'v3.1', date: 'Jun 2024', change: 'Aligned with CBK prudential guidelines', approver: 'Board' },
      ],
    },
    {
      id: 'p4', title: 'Credit Risk Management Policy', category: 'Risk', version: 'v2.5',
      lastUpdated: 'Jun 2024', status: 'Active', nextReview: 'Jun 2025',
      approvedBy: 'Board of Directors',
      effectiveDate: 'Jun 15, 2024',
      documentName: 'Credit_Risk_Policy_v2.5.pdf', documentSize: '2.1 MB',
      history: [
        { version: 'v2.5', date: 'Jun 2024', change: 'Updated credit scoring model & PD thresholds', approver: 'Board' },
      ],
    },
    {
      id: 'p5', title: 'Data Protection & Privacy Policy', category: 'IT/Data', version: 'v2.0',
      lastUpdated: 'Mar 2024', status: 'Active', nextReview: 'Mar 2025',
      approvedBy: 'Board of Directors',
      effectiveDate: 'Mar 1, 2024',
      documentName: 'DataProtection_Policy_v2.0.pdf', documentSize: '950 KB',
      history: [
        { version: 'v2.0', date: 'Mar 2024', change: 'Updated for Kenya Data Protection Act 2019', approver: 'Board' },
      ],
    },
    {
      id: 'p6', title: 'Savings & Withdrawal Policy', category: 'Operations', version: 'v5.1',
      lastUpdated: 'Oct 2024', status: 'Active', nextReview: 'Oct 2025',
      approvedBy: 'Board of Directors',
      effectiveDate: 'Oct 1, 2024',
      documentName: 'Savings_Policy_v5.1.pdf', documentSize: '780 KB',
      history: [
        { version: 'v5.1', date: 'Oct 2024', change: 'Mobile money withdrawal limits adjusted', approver: 'Board' },
      ],
    },
  ];

  // ────────── DATA: AUDIT LOG ──────────
  readonly AUDIT_EVENTS: AuditEvent[] = [
    { id: 'au1', ts: 'Dec 18, 2024 · 11:00 AM', actor: 'David Otieno', action: 'Submitted regulatory filing', target: 'SASRA Q4 2024 Return', ipAddress: '197.232.84.12', severity: 'info' },
    { id: 'au2', ts: 'Dec 18, 2024 · 09:42 AM', actor: 'System', action: 'AML alert auto-generated', target: 'AML-0452 — Bernard Kiprop', ipAddress: '—', severity: 'critical' },
    { id: 'au3', ts: 'Dec 17, 2024 · 04:40 PM', actor: 'Peter Kamau', action: 'Escalated AML case', target: 'AML-0452', ipAddress: '197.232.84.14', severity: 'warning' },
    { id: 'au4', ts: 'Dec 17, 2024 · 02:15 PM', actor: 'Mary Wambui', action: 'Uploaded policy update', target: 'Loan Recovery Policy v3.2', ipAddress: '197.232.84.21', severity: 'info' },
    { id: 'au5', ts: 'Dec 16, 2024 · 09:00 AM', actor: 'Grace Njeri', action: 'KYC override requested', target: '3 diaspora members', ipAddress: '197.232.84.18', severity: 'warning' },
    { id: 'au6', ts: 'Dec 15, 2024 · 03:20 PM', actor: 'Finance Team', action: 'Draft AFR uploaded', target: 'Annual Financial Return FY2024', ipAddress: '197.232.84.05', severity: 'info' },
    { id: 'au7', ts: 'Dec 14, 2024 · 11:45 AM', actor: 'IT Department', action: 'DPIA submitted', target: 'Member Portal v2.0', ipAddress: '197.232.84.03', severity: 'info' },
    { id: 'au8', ts: 'Dec 12, 2024 · 10:30 AM', actor: 'James Kariuki', action: 'Approved policy', target: 'Savings Policy v5.1', ipAddress: '197.232.84.01', severity: 'info' },
  ];

  // ────────── DATA: CHECKLIST ──────────
  readonly CHECKLIST: ChecklistItem[] = [
    {
      category: 'Regulatory Compliance',
      items: [
        { label: 'SASRA License — Valid until Dec 2025', status: 'done' },
        { label: 'SASRA Quarterly Returns — Q1–Q3 2024 filed on time', status: 'done' },
        { label: 'SASRA Q4 2024 Return — Due Jan 15, 2025', status: 'pending', note: 'Pending approval' },
        { label: 'KRA Tax compliance — All returns up to date', status: 'done' },
        { label: 'Annual General Meeting held — Aug 2024', status: 'done' },
      ],
    },
    {
      category: 'AML / KYC Compliance',
      items: [
        { label: 'AML Policy — v4.1 active (reviewed Sep 2024)', status: 'done' },
        { label: 'KYC completion rate — 94% (above 90% threshold)', status: 'done' },
        { label: '23 member documents expiring — reminders needed', status: 'warning' },
        { label: 'Transaction monitoring system — Active', status: 'done' },
        { label: '3 AML alerts under review', status: 'pending' },
      ],
    },
    {
      category: 'Policy & Governance',
      items: [
        { label: 'All 18 policies current and active', status: 'done' },
        { label: 'Loan Recovery Policy v3.2 — pending approval', status: 'pending' },
        { label: 'Board meetings — quarterly meetings on schedule', status: 'done' },
        { label: 'External audit — Completed Oct 2024 (clean opinion)', status: 'done' },
      ],
    },
    {
      category: 'Data Protection',
      items: [
        { label: 'Data Protection Policy — v2.0 active', status: 'done' },
        { label: 'Data Protection Officer appointed', status: 'done' },
        { label: 'Registration with ODPC — Valid', status: 'done' },
      ],
    },
  ];

  // ────────── CONSTANTS ──────────
  readonly tabs: ComplianceTab[] = ['Pending Approvals', 'Regulatory Filings', 'AML Monitoring', 'KYC Oversight', 'Policies'];

  readonly statusColors: Record<string, string> = {
    Active: '#00d084', Approved: '#00d084', Cleared: '#00d084', Submitted: '#2196f3',
    Pending: '#ff9800', Draft: '#94a3b8', 'Pending Approval': '#ff9800',
    Overdue: '#f44336', Escalated: '#ff9800', Review: '#2196f3', Reported: '#9c27b0',
    Expiring: '#f44336', Expired: '#f44336', Archived: '#94a3b8',
  };

  readonly priorityColors: Record<string, string> = {
    Urgent: '#f44336', High: '#ff9800', Normal: '#2196f3', Low: '#94a3b8',
  };

  readonly riskColors: Record<string, string> = {
    High: '#f44336', Medium: '#ff9800', Low: '#00d084',
  };

  readonly submissionTypes = ['Regulatory Filing (SASRA)', 'Regulatory Filing (KRA)', 'Regulatory Filing (FRC)', 'Policy Update', 'AML Report', 'KYC Override', 'Internal Audit'];
  readonly regulators = ['SASRA', 'KRA', 'FRC', 'CBK', 'ODPC', 'NSSF', 'NHIF', 'Internal'];
  readonly approvers = ['James Kariuki (Compliance Officer)', 'Board of Directors', 'CEO', 'Risk Committee', 'External Auditor'];
  readonly priorities = ['Low', 'Normal', 'High', 'Urgent'];
  readonly policyCategories = ['AML/CTF', 'KYC', 'Lending', 'Risk', 'IT/Data', 'Operations', 'HR', 'Governance'];
  readonly approvalDecisions = ['Approve — File with Regulator', 'Approve with Conditions', 'Request Revisions', 'Reject — Do Not File', 'Escalate to Board'];
  readonly rejectionReasons = ['Incomplete documentation', 'Figures don\'t reconcile', 'Missing supporting schedules', 'Compliance gaps identified', 'Other (specify in comments)'];
  readonly amlDecisions = ['Clear — False Positive', 'Continue Monitoring', 'Escalate to Senior Compliance', 'File STR with FRC', 'Freeze Account & Investigate'];
  readonly remindChannels = ['SMS', 'Email', 'WhatsApp', 'SMS + Email', 'All Channels'];
  readonly overrideReasons = ['Member abroad — document collection delayed', 'Document under renewal at issuing authority', 'Lost document — replacement in progress', 'Emergency override — board approved', 'Other (specify)'];

  // ────────── STATE: SIGNALS ──────────
  activeTab = signal<ComplianceTab>('Pending Approvals');

  // Modal states
  showNewSubmission = signal(false);
  showChecklist = signal(false);
  showAuditLog = signal(false);
  showNewPolicy = signal(false);
  showRemindModal = signal(false);
  showOverrideModal = signal(false);
  showBulkRemind = signal(false);
  showFilingDetail = signal<RegulatoryFiling | null>(null);
  showFilingEdit = signal<RegulatoryFiling | null>(null);
  showFilingSubmit = signal<RegulatoryFiling | null>(null);
  showApprovalDetail = signal<ApprovalRequest | null>(null);
  showAmlDetail = signal<AMLAlert | null>(null);
  showPolicyDetail = signal<CompliancePolicy | null>(null);
  showActorMember = signal<KYCDocument | null>(null);

  // Forms
  submissionForm = signal({
    type: 'Regulatory Filing (SASRA)',
    period: '',
    title: '',
    regulator: 'SASRA',
    deadline: '',
    description: '',
    fileName: '',
    submitTo: 'James Kariuki (Compliance Officer)',
    priority: 'Normal',
  });

  policyForm = signal({
    title: '',
    category: 'AML/CTF',
    version: '',
    effectiveDate: '',
    reviewDate: '',
    fileName: '',
    summary: '',
    approver: 'Compliance Officer',
  });

  approvalDecisionForm = signal({
    decision: 'Approve — File with Regulator',
    comments: '',
    rejectionReason: '',
  });

  amlDecisionForm = signal({
    decision: '',
    notes: '',
  });

  remindForm = signal({
    channel: 'SMS + Email',
    message: 'Dear member, your KYC document is expiring soon. Please update at your earliest convenience.',
  });

  overrideForm = signal({
    reason: '',
    duration: '30',
    notes: '',
  });

  bulkRemindForm = signal({
    channel: 'SMS + Email',
    customMessage: false,
    message: 'Dear member, your KYC document is expiring soon. Please update at your earliest convenience.',
  });

  // Toast (sparingly used)
  toast = signal<ToastMsg | null>(null);
  private toastTimer: any = null;

  // ────────── COMPUTED ──────────
  filingStats = computed(() => {
    const all = this.FILINGS;
    return {
      filed: all.filter(f => f.status === 'Approved' || f.status === 'Submitted').length,
      pending: all.filter(f => f.status === 'Pending' || f.status === 'Draft').length,
      overdue: all.filter(f => f.status === 'Overdue').length,
      next: 'Jan 15',
    };
  });

  amlStats = computed(() => {
    const all = this.AML_ALERTS;
    return {
      total: all.length,
      review: all.filter(a => a.status === 'Review').length,
      escalated: all.filter(a => a.status === 'Escalated').length,
      cleared: all.filter(a => a.status === 'Cleared').length,
    };
  });

  // ────────── ACTIONS ──────────
  setTab(t: ComplianceTab) { this.activeTab.set(t); }

  openNewSubmission() { this.showNewSubmission.set(true); }
  closeNewSubmission() { this.showNewSubmission.set(false); }
  openChecklist() { this.showChecklist.set(true); }
  closeChecklist() { this.showChecklist.set(false); }
  openAuditLog() { this.showAuditLog.set(true); }
  closeAuditLog() { this.showAuditLog.set(false); }
  openNewPolicy() { this.showNewPolicy.set(true); }
  closeNewPolicy() { this.showNewPolicy.set(false); }
  openRemind(doc: KYCDocument) { this.showActorMember.set(doc); this.showRemindModal.set(true); }
  closeRemind() { this.showRemindModal.set(false); this.showActorMember.set(null); }
  openOverride(doc: KYCDocument) { this.showActorMember.set(doc); this.showOverrideModal.set(true); }
  closeOverride() { this.showOverrideModal.set(false); this.showActorMember.set(null); }
  openBulkRemind() { this.showBulkRemind.set(true); }
  closeBulkRemind() { this.showBulkRemind.set(false); }
  openFilingDetail(f: RegulatoryFiling) { this.showFilingDetail.set(f); }
  closeFilingDetail() { this.showFilingDetail.set(null); }
  openFilingEdit(f: RegulatoryFiling) { this.showFilingEdit.set(f); }
  closeFilingEdit() { this.showFilingEdit.set(null); }
  openFilingSubmit(f: RegulatoryFiling) { this.showFilingSubmit.set(f); }
  closeFilingSubmit() { this.showFilingSubmit.set(null); }
  openApprovalDetail(a: ApprovalRequest) { this.showApprovalDetail.set(a); }
  closeApprovalDetail() { this.showApprovalDetail.set(null); }
  openAmlDetail(a: AMLAlert) { this.showAmlDetail.set(a); }
  closeAmlDetail() { this.showAmlDetail.set(null); }
  openPolicyDetail(p: CompliancePolicy) { this.showPolicyDetail.set(p); }
  closePolicyDetail() { this.showPolicyDetail.set(null); }

  // Form input helpers (signal-friendly)
  updateSubmissionField<K extends keyof ReturnType<typeof this.submissionForm>>(key: K, val: any) {
    this.submissionForm.update(f => ({ ...f, [key]: val }));
  }
  onSubmissionInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    this.submissionForm.update(f => ({ ...f, [key]: v }));
  }
  onPolicyInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    this.policyForm.update(f => ({ ...f, [key]: v }));
  }
  onApprovalDecisionInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    this.approvalDecisionForm.update(f => ({ ...f, [key]: v }));
  }
  onAmlDecisionInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    this.amlDecisionForm.update(f => ({ ...f, [key]: v }));
  }
  onRemindInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    this.remindForm.update(f => ({ ...f, [key]: v }));
  }
  onOverrideInput(key: string, e: Event) {
    const v = (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
    this.overrideForm.update(f => ({ ...f, [key]: v }));
  }
  onBulkRemindInput(key: string, e: Event) {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const v = t.type === 'checkbox' ? (t as HTMLInputElement).checked : t.value;
    this.bulkRemindForm.update(f => ({ ...f, [key]: v }));
  }

  onFileSelected(form: 'submission' | 'policy', e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (form === 'submission') this.submissionForm.update(f => ({ ...f, fileName: file.name }));
    else this.policyForm.update(f => ({ ...f, fileName: file.name }));
  }

  // Submit actions (sparingly used toast only on success/failure)
  submitNewSubmission(asDraft = false) {
    if (!asDraft && !this.submissionForm().title) {
      this.showToast('Please enter a title to submit.', 'error');
      return;
    }
    this.closeNewSubmission();
    this.showToast(asDraft ? 'Draft saved successfully.' : 'Submitted for approval.', 'success');
  }
  submitNewPolicy(asDraft = false) {
    if (!asDraft && !this.policyForm().title) {
      this.showToast('Please enter a policy title.', 'error');
      return;
    }
    this.closeNewPolicy();
    this.showToast(asDraft ? 'Policy draft saved.' : 'Policy submitted for approval.', 'success');
  }
  submitApprovalDecision() {
    if (!this.approvalDecisionForm().decision) {
      this.showToast('Please select a decision.', 'error');
      return;
    }
    this.closeApprovalDetail();
    this.showToast('Decision recorded successfully.', 'success');
  }
  submitAmlDecision() {
    if (!this.amlDecisionForm().decision) {
      this.showToast('Please select a decision.', 'error');
      return;
    }
    this.closeAmlDetail();
    this.showToast('AML decision submitted.', 'success');
  }
  sendRemind() {
    this.closeRemind();
    this.showToast('Reminder sent successfully.', 'success');
  }
  submitOverride() {
    if (!this.overrideForm().reason) {
      this.showToast('Please select an override reason.', 'error');
      return;
    }
    this.closeOverride();
    this.showToast('Override request submitted for approval.', 'success');
  }
  sendBulkRemind() {
    this.closeBulkRemind();
    this.showToast(`Bulk reminders sent to ${this.KYC_DOCS.length} members.`, 'success');
  }
  saveFilingEdit() {
    this.closeFilingEdit();
    this.showToast('Filing draft updated.', 'success');
  }
  submitFiling() {
    this.closeFilingSubmit();
    this.showToast('Filing submitted to regulator.', 'success');
  }

  // Toast
  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toast.set({ msg, type });
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toast.set(null), 4000);
  }

  // Helpers
  format(n: number): string { return n.toLocaleString(); }
  trackById(_: number, item: { id: string }) { return item.id; }
  trackByIndex(i: number) { return i; }

  // Score circle calculation (85 of 100)
  readonly scoreCircumference = 2 * Math.PI * 52;
  readonly scoreValue = 85;
  scoreOffset(): number {
    return this.scoreCircumference - (this.scoreValue / 100) * this.scoreCircumference;
  }
}
