import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge: number | null;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.html',
  styleUrls: ['./admin-header.scss']
})
export class AdminHeaderComponent implements OnInit {
  @Input() isSidebarMinimized = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleMinimize = new EventEmitter<void>();

  pageTitle = 'Dashboard';
  breadcrumb: string[] = ['Home'];
  notificationCount = 7;
  userName = 'John Maina';
  userInitials = 'JM';

  private navSections: NavSection[] = [
    { title: 'Overview', items: [
      { label: 'Dashboard', icon: 'bi-speedometer2', route: '/admin/dashboard', badge: null },
      { label: 'Analytics', icon: 'bi-bar-chart-line', route: '/admin/analytics', badge: null },
      { label: 'Notifications', icon: 'bi-bell', route: '/admin/notifications', badge: 7 },
    ]},
    { title: 'Members', items: [
      { label: 'Members', icon: 'bi-people', route: '/admin/members', badge: 3 },
      { label: 'KYC Verification', icon: 'bi-person-check', route: '/admin/kyc-verification', badge: null },
      { label: 'Staff Management', icon: 'bi-person-badge', route: '/admin/staff-management', badge: null },
    ]},
    { title: 'Cash Flow', items: [
      { label: 'Deposits', icon: 'bi-arrow-down-circle', route: '/admin/deposits', badge: null },
      { label: 'Withdrawals', icon: 'bi-arrow-up-circle', route: '/admin/withdrawals', badge: null },
    ]},
    { title: 'Loans', items: [
      { label: 'Loan Applications', icon: 'bi-file-earmark-text', route: '/admin/loan-applications', badge: 23 },
      { label: 'Loan Portfolio', icon: 'bi-clipboard-data', route: '/admin/loan-portifolio', badge: null },
      { label: 'Loan Disbursements', icon: 'bi-cash-coin', route: '/admin/loan-disbursements', badge: 5 },
      { label: 'Loan Repayments', icon: 'bi-credit-card', route: '/admin/loan-repayments', badge: null },
    ]},
    { title: 'Capital & Shares', items: [
      { label: 'Share Capital', icon: 'bi-pie-chart', route: '/admin/shares-capital', badge: null },
      { label: 'Savings', icon: 'bi-piggy-bank', route: '/admin/savings', badge: null },
    ]},
    { title: 'Transactions', items: [
      { label: 'Transactions', icon: 'bi-arrow-left-right', route: '/admin/transactions', badge: null },
      { label: 'SaccoPay Wallet', icon: 'bi-wallet2', route: '/admin/saccopay-wallet', badge: null },
      { label: 'Reconciliation', icon: 'bi-check2-circle', route: '/admin/reconciliation', badge: null },
    ]},
    { title: 'Compliance & Reports', items: [
      { label: 'Compliance', icon: 'bi-shield-check', route: '/admin/compliance', badge: null },
      { label: 'Reports', icon: 'bi-file-earmark-bar-graph', route: '/admin/reports', badge: null },
    ]},
    { title: 'System', items: [
      { label: 'Onboarding', icon: 'bi-person-plus', route: '/admin/onboarding', badge: null },
      { label: 'Sacco Settings', icon: 'bi-gear', route: '/admin/sacco-settings', badge: null },
    ]},
    { title: 'Billing', items: [
      { label: 'Subscription', icon: 'bi-credit-card', route: '/admin/subscription', badge: null },
    ]},
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateHeader(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.updateHeader(e.urlAfterRedirects));
  }

  private updateHeader(url: string): void {
    for (const section of this.navSections) {
      const item = section.items.find(i => url.startsWith(i.route));
      if (item) {
        this.pageTitle = item.label;
        this.breadcrumb = ['Home', section.title, item.label];
        return;
      }
    }
    // Fallback for unmatched routes
    this.pageTitle = 'Dashboard';
    this.breadcrumb = ['Home'];
  }

  openNotifications(): void {
    this.router.navigate(['/admin/notifications']);
  }
}