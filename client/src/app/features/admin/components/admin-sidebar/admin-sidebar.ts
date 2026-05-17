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
      title: 'Main',
      items: [
        { label: 'Dashboard', icon: 'bi-speedometer2', route: '/admin/dashboard', badge: null },
        { label: 'Analytics', icon: 'bi-bar-chart-line', route: '/admin/analytics', badge: null },
        { label: 'Members', icon: 'bi-people', route: '/admin/members', badge: 3 },
      ]
    },
    {
      title: 'Financial',
      items: [
        { label: 'Deposits', icon: 'bi-arrow-down-circle', route: '/admin/deposits', badge: null },
        { label: 'Withdrawals', icon: 'bi-arrow-up-circle', route: '/admin/withdrawals', badge: null },
        { label: 'Loans', icon: 'bi-cash-coin', route: '/admin/loans', badge: 5 },
        { label: 'Share Capital', icon: 'bi-pie-chart', route: '/admin/shares', badge: null },
        { label: 'Reconciliation', icon: 'bi-arrow-left-right', route: '/admin/reconciliation', badge: null },
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Vendors', icon: 'bi-shop', route: '/admin/vendors', badge: null },
        { label: 'Reports', icon: 'bi-file-earmark-bar-graph', route: '/admin/reports', badge: null },
        { label: 'Settings', icon: 'bi-gear', route: '/admin/settings', badge: null },
        { label: 'Audit Log', icon: 'bi-journal-text', route: '/admin/audit', badge: null },
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