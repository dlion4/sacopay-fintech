import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberSidebarComponent } from '../../features/member/components/member-sidebar/member-sidebar';
import { MemberHeaderComponent } from '../../features/member/components/member-header/member-header';

@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MemberSidebarComponent, MemberHeaderComponent],
  templateUrl: './member-layout.html',
  styleUrls: ['./member-layout.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberLayoutComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}