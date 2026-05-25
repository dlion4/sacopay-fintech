import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../features/home/components/header/header';
import { FooterComponent } from '../../features/home/components/footer/footer';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class LayoutComponent {}