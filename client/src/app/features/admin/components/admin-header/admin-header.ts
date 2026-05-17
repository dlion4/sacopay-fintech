import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.html',
  styleUrls: ['./admin-header.scss']
})
export class AdminHeaderComponent {
  @Input() isSidebarMinimized = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleMinimize = new EventEmitter<void>();

  pageTitle = 'Deposit Management';
  breadcrumb = ['Home', 'Financial Operations', 'Deposits'];
  notificationCount = 7;
  userName = 'John Maina';
  userInitials = 'JM';

  openNotifications() {
    console.log('Open notifications');
  }
}