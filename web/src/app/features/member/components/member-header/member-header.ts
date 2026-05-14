import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-member-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './member-header.html',
  styleUrls: ['./member-header.scss']
})
export class MemberHeaderComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  onToggleMenu() {
    this.toggleMenu.emit();
  }
}