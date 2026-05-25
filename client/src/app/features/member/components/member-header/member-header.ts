import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-member-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-header.html',
  styleUrl: './member-header.scss'
})
export class MemberHeaderComponent implements OnInit {
  @Input() isSidebarMinimized = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleMinimize = new EventEmitter<void>();

  pageTitle = 'Dashboard';
  notificationCount = 3;

  // Map routes to page titles
  private routeTitles: { [key: string]: string } = {
    '/member/dashboard': 'Dashboard',
    '/member/wallet': 'Wallet',
    '/member/profile': 'Sacco Profile',
    '/member/savings': 'Savings',
    '/member/deposits': 'Deposits',
    '/member/withdrawals': 'Withdrawals',
    '/member/loans': 'My Loans',
    '/member/loan-repayments': 'Loan Repayment',
    '/member/shares': 'Shares',
    '/member/dividends': 'Dividends',
    '/member/guarantor': 'Guarantors',
    '/member/statements': 'Statements',
    '/member/transactions': 'Transactions',
    '/member/notifications': 'Notifications',
    '/member/settings': 'Settings',
    '/member/support': 'Support Center'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Update title on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageTitle(event.urlAfterRedirects || event.url);
      });

    // Set initial title
    this.updatePageTitle(this.router.url);
  }

  private updatePageTitle(url: string) {
    // Find matching route (handle child routes)
    const matchingRoute = Object.keys(this.routeTitles).find(route => 
      url === route || url.startsWith(route + '/')
    );

    if (matchingRoute) {
      this.pageTitle = this.routeTitles[matchingRoute];
    }
  }

  openNotifications() {
    this.router.navigate(['/member/notifications']);
  }
}