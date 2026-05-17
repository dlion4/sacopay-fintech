import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberSidebarComponent } from '../../features/member/components/member-sidebar/member-sidebar';
import { MemberHeaderComponent } from '../../features/member/components/member-header/member-header';

@Component({
  selector: 'app-member-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MemberSidebarComponent, MemberHeaderComponent],
  templateUrl: './member-layout.html',
  styleUrl: './member-layout.scss'
})
export class MemberLayoutComponent implements OnInit {
  isSidebarOpen = false;
  isSidebarMinimized = false;
  
  // Guard variable to easily check browser state in other methods if needed
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Determine the environment once during instantiation
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Mobile: toggle sidebar open/close
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Desktop: toggle minimize/expand
  toggleMinimize() {
    this.isSidebarMinimized = !this.isSidebarMinimized;
    
    // Only persist if we are executing on the client browser
    if (this.isBrowser) {
      localStorage.setItem('sidebarMinimized', String(this.isSidebarMinimized));
    }
  }

  ngOnInit() {
    // Safely restore minimize preference only when running in the browser
    if (this.isBrowser) {
      const saved = localStorage.getItem('sidebarMinimized');
      if (saved) {
        this.isSidebarMinimized = saved === 'true';
      }
    }
  }
}