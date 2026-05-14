import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-member-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-sidebar.html',
  styleUrls: ['./member-sidebar.scss']
})
export class MemberSidebarComponent {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  // Profile Data
  userInitials = 'JK';
  userName = 'John Kamau';
  memberId = 'MEM-2024-0045';
  notificationCount = 3;

  // Closes the sidebar on mobile after clicking a link
  onNavLinkClick() {
    if (window.innerWidth < 992) {
      this.closeMenu.emit();
    }
  }
}