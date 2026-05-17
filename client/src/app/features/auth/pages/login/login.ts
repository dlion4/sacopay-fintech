import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // Component State
  loginType: 'member' | 'staff' = 'member';
  authMethod: 'pin' | 'password' = 'pin';
  showPassword = false;

  constructor(private router: Router) {}

  setLoginType(type: 'member' | 'staff') {
    this.loginType = type;
  }

  setAuthMethod(method: 'pin' | 'password') {
    this.authMethod = method;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Auto-focus next PIN input
  moveFocus(event: any, nextElementId: string) {
    if (event.target.value.length >= 1) {
      const nextEl = document.getElementById(nextElementId);
      if (nextEl) nextEl.focus();
    }
  }

  handleLogin() {
    // Navigate to onboarding or dashboard
    this.router.navigate(['/auth/onboarding']);
  }
}