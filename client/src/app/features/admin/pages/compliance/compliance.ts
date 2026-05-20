import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ========================================
   INTERFACES
======================================== */
interface PendingApproval {
  id: string;
  ref: string;
  type: 'filing' | 'aml' | 'policy' | 'kyc';
  description: string;
  submittedBy: string;
  submittedByInitials: string;
  submittedByColor: string;
  date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'under-review' | 'submitted';
  urgent?: boolean;
}

interface RegulatoryFiling {
  id: string;
  name: string;
  authority: string;
  dueDate: string;
  status: 'compliant' | 'pending' | 'overdue' | 'submitted';
  lastFiled: string;
  nextDue: string;
}

interface AMLCase {
  id: string;
  memberName: string;
  memberInitials: string;
  memberColor: string;
  alertType: string;
  amount: string;
  date: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'under-review' | 'cleared' | 'escalated' | 'flagged';
  assignedTo: string;
}

interface KYCMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  memberId: string;
  completion: number;
  status: 'compliant' | 'pending' | 'overdue' | 'flagged';
  lastUpdated: string;
  missingDocs: string[];
}

interface Policy {
  id: string;
  title: string;
  version: string;
  category: string;
  effectiveDate: string;
  reviewDate: string;
  status: 'active' | 'draft' | 'under-review';
  approvedBy: string;
}

interface AuditEvent {
  id: string;
  event: string;
  user: string;
  userInitials: string;
  userColor: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger';
  ip: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  icon: string;
}

interface ApprovalFlowStep {
  label: string;
  status: 'done' | 'active' | 'waiting' | 'rejected' | 'returned';
}

/* ========================================
   COMPONENT
======================================== */
@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./compliance.html',
  styleUrls: ['./compliance.scss']
})
export class ComplianceComponent implements OnInit {
  activeTab: string = 'pending';
  searchQuery: string = '';
  filterStatus: string = 'all';
  filterPriority: string = 'all';
  activeModal: string | null = null;
  selectedApproval: PendingApproval | null = null;
  selectedAMLCase: AMLCase | null = null;
  selectedKYC: KYCMember | null = null;
  selectedPolicy: Policy | null = null;
  selectedFiling: RegulatoryFiling | null = null;
  checklistFilter: string = 'all';
  toasts: Toast[] = [];
  private toastId = 0;
  complianceScore = 85;

  newSubmission = {
    type: 'filing',
    title: '',
    description: '',
    authority: '',
    dueDate: '',
    priority: 'medium'
  };

  pendingApprovals: PendingApproval[] = [
    { id: 'CMP-2024-0891', ref: 'CMP-0891', type: 'filing', description: 'SASRA Q4 2024 Quarterly Return', submittedBy: 'David Otieno', submittedByInitials: 'DO', submittedByColor: 'c2', date: 'Dec 18', priority: 'high', status: 'pending', urgent: true },
    { id: 'CMP-2024-0890', ref: 'CMP-0890', type: 'aml', description: 'Suspicious transaction — Bernard Kiprop', submittedBy: 'System', submittedByInitials: 'SY', submittedByColor: 'c6', date: 'Dec 17', priority: 'high', status: 'under-review', urgent: true },
    { id: 'CMP-2024-0889', ref: 'CMP-0889', type: 'policy', description: 'Updated Loan Recovery Policy v3.2', submittedBy: 'Mary Achieng', submittedByInitials: 'MA', submittedByColor: 'c3', date: 'Dec 16', priority: 'high', status: 'pending', urgent: true },
    { id: 'CMP-2024-0888', ref: 'CMP-0888', type: 'kyc', description: 'KYC override request — Grace Wanjiku', submittedBy: 'John Mwangi', submittedByInitials: 'JM', submittedByColor: 'c1', date: 'Dec 16', priority: 'medium', status: 'pending' },
    { id: 'CMP-2024-0887', ref: 'CMP-0887', type: 'filing', description: 'Annual Tax Return Filing 2024', submittedBy: 'David Otieno', submittedByInitials: 'DO', submittedByColor: 'c2', date: 'Dec 15', priority: 'medium', status: 'pending' },
    { id: 'CMP-2024-0886', ref: 'CMP-0886', type: 'kyc', description: 'New member KYC — Peter Ochieng', submittedBy: 'Jane Wambui', submittedByInitials: 'JW', submittedByColor: 'c4', date: 'Dec 14', priority: 'low', status: 'submitted' },
    { id: 'CMP-2024-0885', ref: 'CMP-0885', type: 'aml', description: 'Large cash deposit alert — Sarah Njeri', submittedBy: 'System', submittedByInitials: 'SY', submittedByColor: 'c6', date: 'Dec 14', priority: 'medium', status: 'under-review' },
    { id: 'CMP-2024-0884', ref: 'CMP-0884', type: 'policy', description: 'Revised Dividend Policy v2.1', submittedBy: 'Mary Achieng', submittedByInitials: 'MA', submittedByColor: 'c3', date: 'Dec 13', priority: 'low', status: 'pending' }
  ];

  regulatoryFilings: RegulatoryFiling[] = [
    { id: 'FIL-001', name: 'SASRA Quarterly Return Q4 2024', authority: 'SASRA', dueDate: 'Jan 15, 2025', status: 'pending', lastFiled: 'Oct 15, 2024', nextDue: 'Jan 15, 2025' },
    { id: 'FIL-002', name: 'Annual Tax Return 2024', authority: 'KRA', dueDate: 'Jun 30, 2025', status: 'compliant', lastFiled: 'Jun 28, 2024', nextDue: 'Jun 30, 2025' },
    { id: 'FIL-003', name: 'CBK Prudential Return', authority: 'Central Bank', dueDate: 'Jan 31, 2025', status: 'pending', lastFiled: 'Oct 31, 2024', nextDue: 'Jan 31, 2025' },
    { id: 'FIL-004', name: 'Co-operative Tribunal Filing', authority: 'Tribunal', dueDate: 'Mar 01, 2025', status: 'compliant', lastFiled: 'Mar 01, 2024', nextDue: 'Mar 01, 2025' },
    { id: 'FIL-005', name: 'Anti-Money Laundering Report', authority: 'FRC', dueDate: 'Dec 31, 2024', status: 'overdue', lastFiled: 'Sep 30, 2024', nextDue: 'Dec 31, 2024' },
    { id: 'FIL-006', name: 'Member Protection Report', authority: 'SASRA', dueDate: 'Feb 28, 2025', status: 'submitted', lastFiled: 'Feb 28, 2024', nextDue: 'Feb 28, 2025' },
    { id: 'FIL-007', name: 'Financial Statements Audit', authority: 'External Auditor', dueDate: 'Apr 30, 2025', status: 'compliant', lastFiled: 'Apr 28, 2024', nextDue: 'Apr 30, 2025' }
  ];

  amlCases: AMLCase[] = [
    { id: 'AML-2024-005', memberName: 'Bernard Kiprop', memberInitials: 'BK', memberColor: 'c2', alertType: 'Suspicious Pattern', amount: 'KES 450,000', date: 'Dec 17', riskLevel: 'high', status: 'under-review', assignedTo: 'James Kariuki' },
    { id: 'AML-2024-004', memberName: 'Sarah Njeri', memberInitials: 'SN', memberColor: 'c3', alertType: 'Large Cash Deposit', amount: 'KES 1,200,000', date: 'Dec 14', riskLevel: 'medium', status: 'under-review', assignedTo: 'James Kariuki' },
    { id: 'AML-2024-003', memberName: 'Peter Omondi', memberInitials: 'PO', memberColor: 'c4', alertType: 'Rapid Withdrawals', amount: 'KES 320,000', date: 'Dec 10', riskLevel: 'medium', status: 'cleared', assignedTo: 'Mary Achieng' },
    { id: 'AML-2024-002', memberName: 'Grace Wanjiku', memberInitials: 'GW', memberColor: 'c5', alertType: 'Cross-border Transfer', amount: 'KES 890,000', date: 'Dec 05', riskLevel: 'high', status: 'escalated', assignedTo: 'David Otieno' },
    { id: 'AML-2024-001', memberName: 'John Mwangi', memberInitials: 'JM', memberColor: 'c1', alertType: 'Structuring', amount: 'KES 150,000', date: 'Nov 28', riskLevel: 'low', status: 'cleared', assignedTo: 'James Kariuki' }
  ];

  kycMembers: KYCMember[] = [
    { id: 'KYC-001', name: 'Grace Wanjiku', initials: 'GW', color: 'c5', memberId: 'RSC-2024-1042', completion: 85, status: 'pending', lastUpdated: 'Dec 16', missingDocs: ['Utility Bill', 'Employment Letter'] },
    { id: 'KYC-002', name: 'Peter Ochieng', initials: 'PO', color: 'c4', memberId: 'RSC-2024-1043', completion: 60, status: 'pending', lastUpdated: 'Dec 14', missingDocs: ['ID Copy', 'Passport Photo', 'Bank Statement'] },
    { id: 'KYC-003', name: 'Sarah Njeri', initials: 'SN', color: 'c3', memberId: 'RSC-2023-0891', completion: 100, status: 'compliant', lastUpdated: 'Nov 20', missingDocs: [] },
    { id: 'KYC-004', name: 'Bernard Kiprop', initials: 'BK', color: 'c2', memberId: 'RSC-2023-0856', completion: 95, status: 'compliant', lastUpdated: 'Oct 15', missingDocs: ['Updated ID'] },
    { id: 'KYC-005', name: 'John Mwangi', initials: 'JM', color: 'c1', memberId: 'RSC-2022-0456', completion: 100, status: 'compliant', lastUpdated: 'Sep 10', missingDocs: [] },
    { id: 'KYC-006', name: 'Mary Achieng', initials: 'MA', color: 'c3', memberId: 'RSC-2022-0321', completion: 100, status: 'compliant', lastUpdated: 'Aug 22', missingDocs: [] }
  ];

  policies: Policy[] = [
    { id: 'POL-018', title: 'Loan Recovery Policy', version: 'v3.2', category: 'Lending', effectiveDate: 'Jan 01, 2024', reviewDate: 'Dec 31, 2024', status: 'under-review', approvedBy: 'Board of Directors' },
    { id: 'POL-017', title: 'Dividend Distribution Policy', version: 'v2.1', category: 'Finance', effectiveDate: 'Jul 01, 2024', reviewDate: 'Jun 30, 2025', status: 'active', approvedBy: 'AGM 2024' },
    { id: 'POL-016', title: 'KYC & AML Policy', version: 'v4.0', category: 'Compliance', effectiveDate: 'Mar 15, 2024', reviewDate: 'Mar 14, 2025', status: 'active', approvedBy: 'Compliance Committee' },
    { id: 'POL-015', title: 'Member Admission Policy', version: 'v2.5', category: 'Membership', effectiveDate: 'Jan 01, 2024', reviewDate: 'Dec 31, 2024', status: 'active', approvedBy: 'Board of Directors' },
    { id: 'POL-014', title: 'Data Protection Policy', version: 'v1.2', category: 'IT & Security', effectiveDate: 'May 01, 2024', reviewDate: 'Apr 30, 2025', status: 'active', approvedBy: 'ICT Committee' },
    { id: 'POL-013', title: 'Savings & Interest Policy', version: 'v3.0', category: 'Finance', effectiveDate: 'Jan 01, 2024', reviewDate: 'Dec 31, 2024', status: 'active', approvedBy: 'AGM 2024' },
    { id: 'POL-012', title: 'Share Capital Policy', version: 'v2.8', category: 'Finance', effectiveDate: 'Apr 01, 2024', reviewDate: 'Mar 31, 2025', status: 'active', approvedBy: 'Board of Directors' },
    { id: 'POL-011', title: 'Whistleblower Policy', version: 'v1.5', category: 'Governance', effectiveDate: 'Feb 01, 2024', reviewDate: 'Jan 31, 2025', status: 'active', approvedBy: 'Board of Directors' }
  ];

  auditEvents: AuditEvent[] = [
    { id: 'AUD-001', event: 'Approved SASRA Q4 filing', user: 'James Kariuki', userInitials: 'JK', userColor: 'c1', timestamp: 'Dec 18, 09:42 AM', severity: 'info', ip: '192.168.1.45' },
    { id: 'AUD-002', event: 'Flagged AML case AML-2024-005', user: 'System', userInitials: 'SY', userColor: 'c6', timestamp: 'Dec 17, 14:23 PM', severity: 'warning', ip: 'System' },
    { id: 'AUD-003', event: 'Updated Loan Recovery Policy v3.2', user: 'Mary Achieng', userInitials: 'MA', userColor: 'c3', timestamp: 'Dec 16, 11:15 AM', severity: 'info', ip: '192.168.1.32' },
    { id: 'AUD-004', event: 'Failed login attempt', user: 'Unknown', userInitials: 'UN', userColor: 'c5', timestamp: 'Dec 16, 03:22 AM', severity: 'danger', ip: '203.45.67.89' },
    { id: 'AUD-005', event: 'KYC override requested', user: 'John Mwangi', userInitials: 'JM', userColor: 'c1', timestamp: 'Dec 16, 10:05 AM', severity: 'warning', ip: '192.168.1.28' },
    { id: 'AUD-006', event: 'Exported compliance report', user: 'David Otieno', userInitials: 'DO', userColor: 'c2', timestamp: 'Dec 15, 16:45 PM', severity: 'info', ip: '192.168.1.41' },
    { id: 'AUD-007', event: 'Policy POL-018 sent for review', user: 'Mary Achieng', userInitials: 'MA', userColor: 'c3', timestamp: 'Dec 14, 09:30 AM', severity: 'info', ip: '192.168.1.32' },
    { id: 'AUD-008', event: 'Password changed', user: 'James Kariuki', userInitials: 'JK', userColor: 'c1', timestamp: 'Dec 13, 08:15 AM', severity: 'info', ip: '192.168.1.45' }
  ];

  checklistItems: ChecklistItem[] = [
    { id: 'CHK-001', title: 'SASRA Q4 2024 Quarterly Return', category: 'Regulatory', completed: false, dueDate: 'Jan 15, 2025' },
    { id: 'CHK-002', title: 'Annual Tax Return Filing', category: 'Tax', completed: true, dueDate: 'Jun 30, 2025' },
    { id: 'CHK-003', title: 'CBK Prudential Return', category: 'Regulatory', completed: false, dueDate: 'Jan 31, 2025' },
    { id: 'CHK-004', title: 'AML Quarterly Report', category: 'AML', completed: false, dueDate: 'Dec 31, 2024' },
    { id: 'CHK-005', title: 'Member Protection Report', category: 'Regulatory', completed: true, dueDate: 'Feb 28, 2025' },
    { id: 'CHK-006', title: 'KYC Annual Review', category: 'KYC', completed: true, dueDate: 'Dec 31, 2024' },
    { id: 'CHK-007', title: 'Policy Review — Loan Recovery', category: 'Policy', completed: false, dueDate: 'Dec 31, 2024' },
    { id: 'CHK-008', title: 'External Audit Completion', category: 'Audit', completed: true, dueDate: 'Apr 30, 2025' },
    { id: 'CHK-009', title: 'Data Protection Compliance Check', category: 'IT', completed: false, dueDate: 'Jan 31, 2025' },
    { id: 'CHK-010', title: 'Board Governance Review', category: 'Governance', completed: true, dueDate: 'Mar 31, 2025' }
  ];

  approvalFlow: ApprovalFlowStep[] = [
    { label: 'Submitted', status: 'done' },
    { label: 'Under Review', status: 'active' },
    { label: 'Approved', status: 'waiting' },
    { label: 'Filed', status: 'waiting' }
  ];

  timelineEvents = [
    { time: 'Dec 18, 09:42 AM', title: 'Submitted for approval', desc: 'David Otieno submitted SASRA Q4 return', type: 'done' },
    { time: 'Dec 18, 10:15 AM', title: 'Assigned to reviewer', desc: 'James Kariuki assigned as primary reviewer', type: 'done' },
    { time: 'Dec 18, 02:30 PM', title: 'Under review', desc: 'Documents verified, awaiting final sign-off', type: 'active' },
    { time: 'Pending', title: 'Approval', desc: 'Pending compliance officer approval', type: 'waiting' },
    { time: 'Pending', title: 'Filed', desc: 'Awaiting submission to SASRA portal', type: 'waiting' }
  ];

  ngOnInit(): void {}

  setTab(tab: string): void { this.activeTab = tab; }

  openModal(modalId: string, data?: any): void {
    this.activeModal = modalId;
    if (data) {
      if (modalId === 'approvalDetail') this.selectedApproval = data;
      if (modalId === 'amlDetail') this.selectedAMLCase = data;
      if (modalId === 'kycDetail') this.selectedKYC = data;
      if (modalId === 'policyDetail') this.selectedPolicy = data;
      if (modalId === 'filingDetail') this.selectedFiling = data;
    }
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedApproval = null;
    this.selectedAMLCase = null;
    this.selectedKYC = null;
    this.selectedPolicy = null;
    this.selectedFiling = null;
  }

  approveItem(ref: string): void {
    const item = this.pendingApprovals.find(a => a.ref === ref);
    if (item) { item.status = 'submitted'; this.showToast(`✓ ${ref} approved successfully`, 'success'); }
  }

  rejectItem(ref: string): void {
    const item = this.pendingApprovals.find(a => a.ref === ref);
    if (item) { item.status = 'pending'; this.showToast(`✗ ${ref} rejected`, 'danger'); }
  }

  returnItem(ref: string): void {
    this.showToast(`↩ ${ref} returned for corrections`, 'warning');
  }

  clearAMLCase(id: string): void {
    const item = this.amlCases.find(a => a.id === id);
    if (item) { item.status = 'cleared'; this.showToast(`✓ ${id} cleared`, 'success'); }
  }

  escalateCase(id: string): void {
    const item = this.amlCases.find(a => a.id === id);
    if (item) { item.status = 'escalated'; this.showToast(`↑ ${id} escalated to senior officer`, 'warning'); }
  }

  submitNewSubmission(): void {
    this.showToast('✓ New submission created successfully', 'success');
    this.closeModal();
    this.newSubmission = { type: 'filing', title: '', description: '', authority: '', dueDate: '', priority: 'medium' };
  }

  exportReport(): void { this.showToast('📥 Compliance report exported', 'info'); }
  downloadPolicy(): void { this.showToast('📄 Policy document downloaded', 'info'); }

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info'): void {
    const icons: Record<string, string> = { success: 'bi-check-circle-fill', danger: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
    const toast: Toast = { id: ++this.toastId, message, type, icon: icons[type] };
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 4000);
  }

  removeToast(id: number): void { this.toasts = this.toasts.filter(t => t.id !== id); }

  get filteredApprovals(): PendingApproval[] {
    return this.pendingApprovals.filter(a => {
      const matchesSearch = !this.searchQuery || a.description.toLowerCase().includes(this.searchQuery.toLowerCase()) || a.ref.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.filterStatus === 'all' || a.status === this.filterStatus;
      const matchesPriority = this.filterPriority === 'all' || a.priority === this.filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  get filteredFilings(): RegulatoryFiling[] { return this.regulatoryFilings.filter(f => !this.searchQuery || f.name.toLowerCase().includes(this.searchQuery.toLowerCase())); }
  get filteredAML(): AMLCase[] { return this.amlCases.filter(a => !this.searchQuery || a.memberName.toLowerCase().includes(this.searchQuery.toLowerCase())); }
  get filteredKYC(): KYCMember[] { return this.kycMembers.filter(k => !this.searchQuery || k.name.toLowerCase().includes(this.searchQuery.toLowerCase())); }
  get filteredPolicies(): Policy[] { return this.policies.filter(p => !this.searchQuery || p.title.toLowerCase().includes(this.searchQuery.toLowerCase())); }
  get filteredChecklist(): ChecklistItem[] {
    if (this.checklistFilter === 'completed') return this.checklistItems.filter(c => c.completed);
    if (this.checklistFilter === 'pending') return this.checklistItems.filter(c => !c.completed);
    return this.checklistItems;
  }

  get urgentCount(): number { return this.pendingApprovals.filter(a => a.urgent).length; }
  get pendingCount(): number { return this.pendingApprovals.length; }
  get amlCount(): number { return this.amlCases.filter(a => a.status === 'under-review').length; }

  getTypeBadge(type: string): { class: string; icon: string; label: string } {
    const map: Record<string, { class: string; icon: string; label: string }> = {
      filing: { class: 'submitted', icon: 'bi-send-check', label: 'Filing' },
      aml: { class: 'flagged', icon: 'bi-flag-fill', label: 'AML' },
      policy: { class: 'submitted', icon: 'bi-file-text', label: 'Policy' },
      kyc: { class: 'submitted', icon: 'bi-person-check', label: 'KYC' }
    };
    return map[type] || { class: 'draft', icon: 'bi-circle', label: 'Unknown' };
  }

  getStatusBadge(status: string): { class: string; icon: string } {
    const map: Record<string, { class: string; icon: string }> = {
      'pending': { class: 'pending', icon: 'bi-hourglass-split' },
      'under-review': { class: 'under-review', icon: 'bi-search' },
      'submitted': { class: 'submitted', icon: 'bi-send-check' },
      'compliant': { class: 'compliant', icon: 'bi-check-circle' },
      'overdue': { class: 'overdue', icon: 'bi-exclamation-circle' },
      'cleared': { class: 'cleared', icon: 'bi-shield-check' },
      'escalated': { class: 'escalated', icon: 'bi-arrow-up' },
      'flagged': { class: 'flagged', icon: 'bi-flag-fill' },
      'active': { class: 'approved', icon: 'bi-check-circle' },
      'draft': { class: 'draft', icon: 'bi-pencil' }
    };
    return map[status] || { class: 'draft', icon: 'bi-circle' };
  }

  getRiskPill(risk: string): { class: string; icon: string } {
    const map: Record<string, { class: string; icon: string }> = {
      'low': { class: 'low', icon: 'bi-check-circle-fill' },
      'medium': { class: 'medium', icon: 'bi-exclamation-circle-fill' },
      'high': { class: 'high', icon: 'bi-exclamation-circle-fill' },
      'critical': { class: 'critical', icon: 'bi-exclamation-triangle-fill' }
    };
    return map[risk] || { class: 'low', icon: 'bi-circle' };
  }

  getScoreRingStyle(): string {
    const greenDeg = (this.complianceScore / 100) * 360;
    const orangeStart = greenDeg;
    const orangeDeg = orangeStart + 32;
    const redStart = orangeDeg;
    const redDeg = redStart + 14;
    return `conic-gradient(var(--primary-green) 0deg ${greenDeg}deg, var(--accent-orange) ${greenDeg}deg ${orangeDeg}deg, var(--status-danger) ${orangeDeg}deg ${redDeg}deg, var(--bg-tertiary) ${redDeg}deg 360deg)`;
  }
}