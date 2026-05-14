import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'] // make sure this matches your file extension
})
export class ForgotPasswordComponent implements OnDestroy {
  // Wizard State
  currentStep: number = 1;
  
  // Modal State
  showSuccessModal: boolean = false;
  
  // OTP State
  timeRemaining: number = 0;
  timerInterval: any;

  // Password Visibility
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router) {}

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // --- Step 1: Find Account (Instantly moves to Step 2) ---
  findAccount() {
    this.currentStep = 2;
    this.startOtpTimer();
  }

  // --- Step 2: Verify OTP (Instantly moves to Step 3) ---
  verifyOtp() {
    this.currentStep = 3;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startOtpTimer() {
    this.timeRemaining = 60;
    if (this.timerInterval) {
        clearInterval(this.timerInterval);
    }
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
      } else {
        this.timeRemaining--;
      }
    }, 1000);
  }

  resendOtp() {
    this.startOtpTimer();
  }

  // --- Step 3: Update Password (Instantly shows success) ---
  updatePassword() {
    this.showSuccessModal = true;
    // Redirect to login after 2 seconds so the user can see the success message
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 2000);
  }

  // --- Utilities ---
  moveFocus(event: any, nextElementId: string) {
    if (event.target.value.length >= 1) {
      const nextEl = document.getElementById(nextElementId);
      if (nextEl) nextEl.focus();
    }
  }

  toggleVisibility(field: 'new' | 'confirm') {
    if (field === 'new') this.showNewPassword = !this.showNewPassword;
    if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
  }
}