import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-member-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-header.html',
  styleUrl: './member-header.scss'
})
export class MemberHeaderComponent {
  @Input() isSidebarMinimized = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleMinimize = new EventEmitter<void>();

  pageTitle = 'Dashboard';
  notificationCount = 3;

  openNotifications() {
    // Navigate to notifications or open modal
    console.log('Open notifications');
  }
}