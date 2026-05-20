import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ModalKey =
  | 'addStaff'
  | 'manageRoles'
  | 'viewStaff'
  | 'editPermissions'
  | 'createRole'
  | 'editRole'
  | 'viewRole'
  | 'duplicateRole'
  | 'deleteRole'
  | null;

type RoleTone = 'green' | 'navy' | 'teal' | 'purple' | 'blue' | 'orange' | 'gray';

interface Staff {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  title: string;
  role: string;
  roleTone: RoleTone;
  memberId: string;
  permissions: string;
  permissionTone: 'success' | 'neutral';
  status: 'online' | 'offline' | 'away';
  lastActive: string;
  category: 'board' | 'management' | 'staff';
  department: string;
}

interface RoleDef {
  name: string;
  tone: RoleTone;
  assigned: number;
  assignedNames?: string;
  permissions: string;
  permissionsList: string[];
  created: string;
  immutable?: boolean;
  permCount: number;
}

interface ActivityEntry {
  time: string;
  actor: string;
  action: string;
  target?: string;
  badge?: { label: string; tone: RoleTone };
  detail?: string;
}

interface QuickPermission {
  key: string;
  label: string;
  enabled: boolean;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff-management.html',
  styleUrls: ['./staff-management.scss'],
})
export class StaffManagementComponent {
  modal: ModalKey = null;
  activeTab: 'directory' | 'org' | 'roles' | 'log' = 'directory';
  staffFilter: 'all' | 'board' | 'management' | 'staff' = 'all';
  staffSearch = '';
  logFilter = 'all';
  logSearch = '';
  logDate = '';
  toast: { message: string; tone: string } | null = null;
  private toastTimer?: number;

  selectedStaff: Staff | null = null;
  selectedRole: RoleDef | null = null;

  inviteMode: 'select' | 'manual' = 'select';
  inviteForm = {
    search: '',
    name: '',
    email: '',
    phone: '',
    memberId: '',
    role: '',
    title: '',
    department: 'Board of Directors',
    access: 'standard',
  };

  roleForm: { name: string; tone: RoleTone; description: string; permissions: string[] } = {
    name: '',
    tone: 'green',
    description: '',
    permissions: [],
  };

  readonly basePermissions: QuickPermission[] = [
    { key: 'dashboard', label: 'View Dashboard', enabled: true },
    { key: 'view_members', label: 'View Members', enabled: true },
    { key: 'edit_members', label: 'Edit Members', enabled: false },
    { key: 'approve_loans', label: 'Approve Loans', enabled: false },
    { key: 'disburse_loans', label: 'Disburse Loans', enabled: false },
    { key: 'manage_savings', label: 'Manage Savings', enabled: false },
    { key: 'withdrawals', label: 'Process Withdrawals', enabled: false },
    { key: 'view_reports', label: 'View Reports', enabled: false },
    { key: 'gen_reports', label: 'Generate Reports', enabled: false },
    { key: 'compliance', label: 'Compliance Access', enabled: false },
    { key: 'sys_settings', label: 'System Settings', enabled: false },
    { key: 'staff_mgmt', label: 'Staff Management', enabled: false },
  ];

  invitePerms: QuickPermission[] = this.basePermissions.map((p) => ({ ...p }));
  editPerms: QuickPermission[] = this.basePermissions.map((p) => ({ ...p }));

  readonly summaryCards = [
    { label: 'Total Staff', value: '12', icon: 'users', tone: 'green' },
    { label: 'Active Roles', value: '8', icon: 'tag', tone: 'blue' },
    { label: 'Online Now', value: '5', icon: 'dot', tone: 'success' },
    { label: 'Pending Invites', value: '2', icon: 'mail', tone: 'orange' },
  ];

  readonly mainTabs: Array<{ key: 'directory' | 'org' | 'roles' | 'log'; label: string; count?: string }> = [
    { key: 'directory', label: 'Staff Directory', count: '12' },
    { key: 'org', label: 'Org Structure' },
    { key: 'roles', label: 'Roles & Permissions' },
    { key: 'log', label: 'Activity Log' },
  ];

  readonly subTabs = [
    { key: 'all' as const, label: 'All', count: '12' },
    { key: 'board' as const, label: 'Board', count: '5' },
    { key: 'management' as const, label: 'Management', count: '4' },
    { key: 'staff' as const, label: 'Staff', count: '3' },
  ];

  staffMembers: Staff[] = [
    { id: 'jk', name: 'James Kariuki', initials: 'JK', avatar: 'c1', title: 'Default Administrator', role: 'Super Admin', roleTone: 'green', memberId: 'SP-10001', permissions: 'Full Access (All)', permissionTone: 'success', status: 'online', lastActive: 'Now', category: 'management', department: 'Administration' },
    { id: 'wo', name: 'William Ochieng', initials: 'WO', avatar: 'c3', title: 'Board Chairman', role: 'Chairman', roleTone: 'navy', memberId: 'SP-10005', permissions: 'Board + Approvals', permissionTone: 'neutral', status: 'online', lastActive: '5 min ago', category: 'board', department: 'Board of Directors' },
    { id: 'an', name: 'Agnes Nyaboke', initials: 'AN', avatar: 'c1', title: 'Treasurer', role: 'Treasurer', roleTone: 'teal', memberId: 'SP-10012', permissions: 'Finance + Reports', permissionTone: 'neutral', status: 'online', lastActive: '12 min ago', category: 'board', department: 'Board of Directors' },
    { id: 'ma', name: 'Mary Achieng', initials: 'MA', avatar: 'c4', title: 'Secretary', role: 'Secretary', roleTone: 'purple', memberId: 'SP-10018', permissions: 'Members + Compliance', permissionTone: 'neutral', status: 'offline', lastActive: '3 hrs ago', category: 'board', department: 'Board of Directors' },
    { id: 'do', name: 'David Otieno', initials: 'DO', avatar: 'c5', title: 'Credit Officer', role: 'Credit Officer', roleTone: 'blue', memberId: 'SP-10025', permissions: 'Loans + Collections', permissionTone: 'neutral', status: 'online', lastActive: 'Now', category: 'staff', department: 'Credit Department' },
    { id: 'fk', name: 'Florence Kerubo', initials: 'FK', avatar: 'c6', title: 'Chief Accountant', role: 'Accountant', roleTone: 'orange', memberId: 'SP-10030', permissions: 'Finance + Savings', permissionTone: 'neutral', status: 'away', lastActive: '30 min ago', category: 'management', department: 'Finance Department' },
    { id: 'pm', name: 'Peter Mwangi', initials: 'PM', avatar: 'c2', title: 'Loans Officer', role: 'Credit Officer', roleTone: 'blue', memberId: 'SP-10034', permissions: 'Loans + Collections', permissionTone: 'neutral', status: 'online', lastActive: '2 min ago', category: 'staff', department: 'Credit Department' },
    { id: 'sm', name: 'Susan Moraa', initials: 'SM', avatar: 'c4', title: 'Senior Teller', role: 'Teller', roleTone: 'gray', memberId: 'SP-10041', permissions: 'Deposits + Withdrawals', permissionTone: 'neutral', status: 'online', lastActive: '8 min ago', category: 'staff', department: 'Operations' },
    { id: 'jo', name: 'Joseph Otieno', initials: 'JO', avatar: 'c5', title: 'Teller', role: 'Teller', roleTone: 'gray', memberId: 'SP-10045', permissions: 'Deposits + Withdrawals', permissionTone: 'neutral', status: 'offline', lastActive: '1 day ago', category: 'staff', department: 'Operations' },
    { id: 'ek', name: 'Eunice Kemboi', initials: 'EK', avatar: 'c1', title: 'Junior Accountant', role: 'Accountant', roleTone: 'orange', memberId: 'SP-10049', permissions: 'Finance + Savings', permissionTone: 'neutral', status: 'online', lastActive: '1 min ago', category: 'management', department: 'Finance Department' },
    { id: 'rk', name: 'Robert Kiprop', initials: 'RK', avatar: 'c3', title: 'Compliance Officer', role: 'Teller', roleTone: 'gray', memberId: 'SP-10052', permissions: 'Compliance + KYC', permissionTone: 'neutral', status: 'away', lastActive: '45 min ago', category: 'staff', department: 'Compliance' },
    { id: 'lm', name: 'Lucy Mwende', initials: 'LM', avatar: 'c4', title: 'Operations Manager', role: 'Accountant', roleTone: 'orange', memberId: 'SP-10058', permissions: 'Operations + Reports', permissionTone: 'neutral', status: 'offline', lastActive: '5 hrs ago', category: 'management', department: 'Operations' },
  ];

  roleDefinitions: RoleDef[] = [
    { name: 'Super Admin', tone: 'green', assigned: 1, assignedNames: 'James Kariuki', permissions: 'All Permissions (immutable)', permissionsList: ['Full Dashboard Access', 'All Member Operations', 'All Financial Operations', 'System Configuration', 'Role & Permission Management'], created: 'System Default', immutable: true, permCount: 99 },
    { name: 'Chairman', tone: 'navy', assigned: 1, permissions: 'Approvals, Reports, Board, Members (View)', permissionsList: ['Board Approvals', 'Strategic Reports', 'Member Directory (View)', 'Loan Approvals (>1M)', 'Financial Oversight'], created: 'Jan 2024', permCount: 12 },
    { name: 'Treasurer', tone: 'teal', assigned: 1, permissions: 'Finance, Savings, Withdrawals, Reports', permissionsList: ['Finance Management', 'Savings Operations', 'Withdrawal Approvals', 'Financial Reports', 'Audit Trail'], created: 'Jan 2024', permCount: 10 },
    { name: 'Credit Officer', tone: 'blue', assigned: 2, permissions: 'Loans, Disbursements, Collections, KYC', permissionsList: ['Loan Origination', 'Loan Disbursement', 'Collections Management', 'KYC Review', 'Credit Reports'], created: 'Jan 2024', permCount: 8 },
    { name: 'Accountant', tone: 'orange', assigned: 2, permissions: 'Finance, Reports, Savings, Transactions', permissionsList: ['Ledger Management', 'Reconciliation', 'Tax & Compliance', 'Reports Generation', 'Transaction Posting'], created: 'Feb 2024', permCount: 9 },
    { name: 'Teller', tone: 'gray', assigned: 3, permissions: 'Deposits, Withdrawals, Member Lookup', permissionsList: ['Deposit Processing', 'Withdrawal Processing', 'Member Lookup', 'Cash Reconciliation', 'Receipt Printing'], created: 'Mar 2024', permCount: 5 },
  ];

  activityFeed: ActivityEntry[] = [
    { time: 'Today, 10:30 AM', actor: 'James Kariuki', action: 'granted', target: '"Loan Approval" permission to David Otieno (Credit Officer)' },
    { time: 'Today, 9:15 AM', actor: 'James Kariuki', action: 'added Florence Kerubo as', badge: { label: 'Accountant', tone: 'orange' } },
    { time: 'Yesterday, 4:00 PM', actor: 'David Otieno', action: 'logged in from new device', detail: 'IP: 196.201.xxx.xxx (Rongo)' },
    { time: 'Yesterday, 2:30 PM', actor: 'James Kariuki', action: 'updated role permissions for', badge: { label: 'Treasurer', tone: 'teal' }, target: '- added "Generate Reports"' },
    { time: 'Dec 16, 11:00 AM', actor: 'James Kariuki', action: 'sent invitation to Peter Omondi for', badge: { label: 'Compliance', tone: 'blue' }, target: 'role' },
    { time: 'Dec 15, 3:00 PM', actor: 'James Kariuki', action: 'created new role', badge: { label: 'Teller', tone: 'gray' }, target: 'with 5 permissions' },
    { time: 'Dec 14, 10:00 AM', actor: 'Mary Achieng', action: 'reviewed compliance flags for', target: '3 members - cleared 2, escalated 1' },
  ];

  get filteredStaff(): Staff[] {
    const query = this.staffSearch.trim().toLowerCase();
    return this.staffMembers.filter((s) => {
      const tabMatch = this.staffFilter === 'all' || s.category === this.staffFilter;
      const searchMatch = !query || `${s.name} ${s.role} ${s.memberId} ${s.title} ${s.department}`.toLowerCase().includes(query);
      return tabMatch && searchMatch;
    });
  }

  get filteredActivity(): ActivityEntry[] {
    const query = this.logSearch.trim().toLowerCase();
    return this.activityFeed.filter((entry) => {
      const searchMatch = !query || `${entry.actor} ${entry.action} ${entry.target ?? ''} ${entry.detail ?? ''}`.toLowerCase().includes(query);
      const filterMatch =
        this.logFilter === 'all' ||
        (this.logFilter === 'permissions' && entry.action.includes('permission')) ||
        (this.logFilter === 'login' && entry.action.includes('logged')) ||
        (this.logFilter === 'invites' && entry.action.includes('invitation')) ||
        (this.logFilter === 'roles' && entry.action.includes('role'));
      const dateMatch = !this.logDate || entry.time.toLowerCase().includes(this.logDate.toLowerCase());
      return searchMatch && filterMatch && dateMatch;
    });
  }

  roleIcon(name: string): string {
    const map: Record<string, string> = {
      'Super Admin': 'shield',
      'Chairman': 'star',
      'Treasurer': 'coins',
      'Secretary': 'edit3',
      'Credit Officer': 'card',
      'Accountant': 'bookOpen',
      'Teller': 'user',
    };
    return map[name] ?? 'user';
  }

  statusLabel(status: 'online' | 'offline' | 'away'): string {
    return status === 'online' ? 'Online' : status === 'away' ? 'Away' : 'Offline';
  }

  openModal(key: ModalKey, staff?: Staff, role?: RoleDef): void {
    if (staff) {
      this.selectedStaff = staff;
      this.editPerms = this.basePermissions.map((p) => ({ ...p, enabled: ['dashboard', 'view_members'].includes(p.key) }));
    }
    if (role) {
      this.selectedRole = role;
      this.roleForm = { name: role.name, tone: role.tone, description: '', permissions: [...role.permissionsList] };
    }
    if (key === 'addStaff') {
      this.inviteMode = 'select';
      this.inviteForm = { search: '', name: '', email: '', phone: '', memberId: '', role: '', title: '', department: 'Board of Directors', access: 'standard' };
      this.invitePerms = this.basePermissions.map((p) => ({ ...p }));
    }
    if (key === 'createRole') {
      this.roleForm = { name: '', tone: 'green', description: '', permissions: [] };
    }
    this.modal = key;
  }

  closeModal(): void {
    this.modal = null;
  }

  confirmAndClose(message: string): void {
    this.closeModal();
    this.showToast(message);
  }

  showToast(message: string, tone = 'success'): void {
    this.toast = { message, tone };
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout((): void => { this.toast = null; }, 2600);
  }

  togglePerm(list: QuickPermission[], key: string): void {
    const perm = list.find((p) => p.key === key);
    if (perm) perm.enabled = !perm.enabled;
  }

  togglePermissionInRole(label: string): void {
    if (this.roleForm.permissions.includes(label)) {
      this.roleForm.permissions = this.roleForm.permissions.filter((p) => p !== label);
    } else {
      this.roleForm.permissions = [...this.roleForm.permissions, label];
    }
  }

  isPermInRole(label: string): boolean {
    return this.roleForm.permissions.includes(label);
  }

  openManageRolesCreate(): void {
    this.closeModal();
    this.openModal('createRole');
  }

  openEditFromView(): void {
    if (!this.selectedRole) return;
    const role = this.selectedRole;
    this.closeModal();
    this.openModal('editRole', undefined, role);
  }

  openEditFromProfile(): void {
    if (!this.selectedStaff) return;
    const staff = this.selectedStaff;
    this.closeModal();
    this.openModal('editPermissions', staff);
  }
}