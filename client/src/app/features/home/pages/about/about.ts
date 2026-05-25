import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  // Manage background parallax state
  bgPosition = '0px 0px, 0px 0px';

  ngOnInit(): void {
    // Component initialization
    // Scroll to top when component loads
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    // Initialize Animate On Scroll
    AOS.init({
      once: true,
      offset: 100,
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
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}