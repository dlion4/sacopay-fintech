import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../features/admin/components/admin-sidebar/admin-sidebar';
import { AdminHeaderComponent } from '../../features/admin/components/admin-header/admin-header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent, AdminHeaderComponent],
  templateUrl: './admin-layout.html',
  styleUrls: [

    './admin-layout.scss'
  ],
  // encapsulation: ViewEncapsulation.None
})
export class AdminLayoutComponent implements OnInit {
  isSidebarOpen = false;
  isSidebarMinimized = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleMinimize() {
    this.isSidebarMinimized = !this.isSidebarMinimized;
    
    if (this.isBrowser) {
      localStorage.setItem('adminSidebarMinimized', String(this.isSidebarMinimized));
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      const saved = localStorage.getItem('adminSidebarMinimized');
      if (saved) {
        this.isSidebarMinimized = saved === 'true';
      }
    }
  }
}