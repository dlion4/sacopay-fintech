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
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const yOffset = window.scrollY;
    // Move pattern slower to create parallax
    this.bgPosition = `0px ${-yOffset * 0.1}px, 0px 0px`;
  }

  // Function to switch tabs cleanly
  setTab(tabName: string) {
    this.activeTab = tabName;
  }
}