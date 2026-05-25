import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // Manage background parallax state
  bgPosition = '0px 0px, 0px 0px';

  // Manage Tabs for the Performance Dashboard
  activeTab = 'shares';

  // Mobile menu state
  mobileMenuOpen = false;
  isScrolled = false;

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Initialize Animate On Scroll
    AOS.init({
      once: true,
      offset: 120,
      delay: 100,
      duration: 800,
      easing: 'ease-out-cubic',
    });
  }

  // Handle dynamic background pattern scrolling effect
  @HostListener('window:scroll')
  onScroll() {
    const yOffset = window.scrollY;
    this.bgPosition = `0px ${-yOffset * 0.1}px, 0px 0px`;
    this.isScrolled = yOffset > 50;
  }

  // Function to switch tabs cleanly
  setTab(tabName: string) {
    this.activeTab = tabName;
  }

  // Mobile menu toggle
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}