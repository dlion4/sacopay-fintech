import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavSection {
  label: string;
  links: NavLink[];
}

export interface NavLink {
  path: string;
  label: string;
  icon: string;
  badge?: number;
  exact?: boolean;
}

@Component({
  selector: 'app-member-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-sidebar.html',
  styleUrl: './member-sidebar.scss'
})
export class MemberSidebarComponent {
  @Input() isOpen = false;
  @Input() isMinimized = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() toggleMinimizeEvent = new EventEmitter<void>();

  // Profile Data
  userInitials = 'JK';
  userName = 'John Kamau';
  memberId = 'MEM-2024-0045';
  notificationCount = 3;

  // Navigation matching ACTUAL routes from member.routes.ts
  navSections: NavSection[] = [
    {
      label: 'Main',
      links: [
        { path: '/member/dashboard', label: 'Dashboard', icon: 'bi-grid-fill', exact: true },
        { path: '/member/wallet', label: 'Wallet', icon: 'bi-wallet2' },
        { path: '/member/profile', label: 'Sacco Profile', icon: 'bi-person-badge' }
      ]
    },
    {
      label: 'Finance',
      links: [
        { path: '/member/savings', label: 'Savings', icon: 'bi-piggy-bank' },
        { path: '/member/deposits', label: 'Deposits', icon: 'bi-arrow-down-circle' },
        { path: '/member/withdrawals', label: 'Withdrawals', icon: 'bi-arrow-up-circle' }
      ]
    },
    {
      label: 'Loans',
      links: [
        { path: '/member/loans', label: 'My Loans', icon: 'bi-cash-stack' },
        { path: '/member/loan-repayments', label: 'Loan Repayment', icon: 'bi-credit-card' }
      ]
    },
    {
      label: 'Membership',
      links: [
        { path: '/member/shares', label: 'Shares', icon: 'bi-pie-chart' },
        { path: '/member/dividends', label: 'Dividends', icon: 'bi-coin' },
        { path: '/member/guarantor', label: 'Guarantors', icon: 'bi-people' }  // NOTE: route is 'guarantor' (singular)
      ]
    },
    {
      label: 'Reports',
      links: [
        { path: '/member/statements', label: 'Statements', icon: 'bi-file-text' },
        { path: '/member/transactions', label: 'Transactions', icon: 'bi-arrow-left-right' }
      ]
    },
    {
      label: 'Account',
      links: [
        { path: '/member/notifications', label: 'Notifications', icon: 'bi-bell', badge: this.notificationCount },
        { path: '/member/settings', label: 'Settings', icon: 'bi-gear' },
        { path: '/member/support', label: 'Support', icon: 'bi-question-circle' }
      ]
    }
  ];

  // Closes the sidebar on mobile after clicking a link
  onNavLinkClick() {
    if (window.innerWidth < 992) {
      this.closeMenu.emit();
    }
  }

  // Toggle minimize state (desktop only)
  toggleMinimize() {
    this.toggleMinimizeEvent.emit();
  }

  // Check if a link has a badge
  hasBadge(link: NavLink): boolean {
    return !!link.badge && link.badge > 0;
  }
}