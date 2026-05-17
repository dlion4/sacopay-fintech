import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces
interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface Toast {
  id: number;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timer?: any;
}

interface ExportForm {
  type: string;
  dateRange: string;
  format: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.scss']
})
export class AnalyticsComponent {

  // Tabs configuration
  tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
    { id: 'member-analytics', label: 'Member Analytics', icon: 'fas fa-users' },
    { id: 'loan-performance', label: 'Loan Performance', icon: 'fas fa-hand-holding-usd' },
    { id: 'financial-health', label: 'Financial Health', icon: 'fas fa-shield-alt' },
    { id: 'risk-analysis', label: 'Risk Analysis', icon: 'fas fa-exclamation-triangle' }
  ];

  // State
  activeTab: string = 'overview';
  activeModal: string | null = null;
  selectedDateRange: string = '30';
  toastIdCounter: number = 0;
  toasts: Toast[] = [];

  // Export form
  exportForm: ExportForm = {
    type: 'full',
    dateRange: '30',
    format: 'pdf'
  };

  // ============================================
  // TAB NAVIGATION
  // ============================================

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  navigateToTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // ============================================
  // DATE RANGE
  // ============================================

  onDateRangeChange(): void {
    this.showToast('info', 'Date Range Updated', `Analytics data refreshed for last ${this.selectedDateRange} days.`);
  }

  // ============================================
  // MODALS
  // ============================================

  openModal(modalId: string): void {
    this.activeModal = modalId;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.activeModal = null;
    document.body.style.overflow = '';
  }

  closeModalOnOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  // ============================================
  // EXPORT
  // ============================================

  exportReport(): void {
    this.showToast('success', 'Export Started', `Your ${this.exportForm.type} report is being generated as ${this.exportForm.format.toUpperCase()}.`);
    this.closeModal();
  }

  generateFullReport(): void {
    this.showToast('success', 'Report Generated', 'Full AI insights report has been generated and sent to your email.');
    this.closeModal();
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================

  showToast(type: 'success' | 'warning' | 'danger' | 'info', title: string, message: string): void {
    const id = ++this.toastIdCounter;
    const toast: Toast = { id, type, title, message };
    this.toasts.push(toast);

    // Auto-dismiss after 5 seconds
    toast.timer = setTimeout(() => {
      this.removeToast(id);
    }, 5000);
  }

  removeToast(id: number): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      if (this.toasts[index].timer) {
        clearTimeout(this.toasts[index].timer);
      }
      this.toasts.splice(index, 1);
    }
  }

  pauseToast(toast: Toast): void {
    if (toast.timer) {
      clearTimeout(toast.timer);
      toast.timer = undefined;
    }
  }

  resumeToast(toast: Toast): void {
    toast.timer = setTimeout(() => {
      this.removeToast(toast.id);
    }, 3000);
  }
}