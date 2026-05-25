import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HeaderComponent } from './features/home/components/header/header';  // ← Add this

@Component({
  selector: 'sacco-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent   // ← Add this
  ],
  templateUrl:'./app.html',   // or templateUrl: './app.component.html'
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'SaccoPay';

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('saccopay-theme');
    if (savedTheme === 'light') {
      this.renderer.addClass(this.document.body, 'light-theme');
    } else {
      this.renderer.addClass(this.document.body, 'dark-theme');
    }
  }
}