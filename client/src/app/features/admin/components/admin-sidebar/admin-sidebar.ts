import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrls: ['./admin-sidebar.scss']
})
export class AdminSidebarComponent {
  @Input() isOpen = false;
  @Input() isMinimized = false;
  @Output() closeMenu = new EventEmitter<void>();
  @Output() toggleMinimizeEvent = new EventEmitter<void>();

  userInitials = 'JM';
  userName = 'John Maina';
  userRole = 'General Manager';
  notificationCount = 7;

 navSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: 'bi-speedometer2', route: '/admin/dashboard', badge: null },
      { label: 'Analytics', icon: 'bi-bar-chart-line', route: '/admin/analytics', badge: null },
      { label: 'Notifications', icon: 'bi-bell', route: '/admin/notifications', badge: 7 },
    ]
  },
  {
    title: 'Members',
    items: [
      { label: 'Members', icon: 'bi-people', route: '/admin/members', badge: 3 },
      { label: 'KYC Verification', icon: 'bi-person-check', route: '/admin/kyc-verification', badge: null },
      { label: 'Staff Management', icon: 'bi-person-badge', route: '/admin/staff-management', badge: null },
    ]
  },
  {
    title: 'Savings & Deposits',
    items: [
      { label: 'Deposits', icon: 'bi-arrow-down-circle', route: '/admin/deposits', badge: null },
      { label: 'Savings', icon: 'bi-piggy-bank', route: '/admin/savings', badge: null },
      { label: 'Withdrawals', icon: 'bi-arrow-up-circle', route: '/admin/withdrawals', badge: null },
    ]
  },
  {
    title: 'Loans',
    items: [
      { label: 'Loan Applications', icon: 'bi-file-earmark-text', route: '/admin/loan-applications', badge: 23 },
      { label: 'Loan Portfolio', icon: 'bi-clipboard-data', route: '/admin/loan-portifolio', badge: null },
      { label: 'Loan Disbursements', icon: 'bi-cash-coin', route: '/admin/loan-disbursements', badge: 5 },
      { label: 'Loan Repayments', icon: 'bi-credit-card', route: '/admin/loan-repayments', badge: null },
    ]
  },
  {
    title: 'Capital & Shares',
    items: [
      { label: 'Share Capital', icon: 'bi-pie-chart', route: '/admin/shares', badge: null },
    ]
  },
  {
    title: 'Transactions',
    items: [
      { label: 'Transactions', icon: 'bi-arrow-left-right', route: '/admin/transactions', badge: null },
      { label: 'SaccoPay Wallet', icon: 'bi-wallet2', route: '/admin/saccopay-wallet', badge: null },
      { label: 'Reconciliation', icon: 'bi-check2-circle', route: '/admin/reconciliation', badge: null },
    ]
  },
  {
    title: 'Compliance & Reports',
    items: [
      { label: 'Compliance', icon: 'bi-shield-check', route: '/admin/compliance', badge: null },
      { label: 'Reports', icon: 'bi-file-earmark-bar-graph', route: '/admin/reports', badge: null },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Onboarding', icon: 'bi-person-plus', route: '/admin/onboarding', badge: null },
      { label: 'Sacco Settings', icon: 'bi-gear', route: '/admin/sacco-settings', badge: null },
    ]
  }
];

  onNavLinkClick() {
    if (window.innerWidth < 992) {
      this.closeMenu.emit();
    }
  }

  toggleMinimize() {
    this.toggleMinimizeEvent.emit();
  }
}