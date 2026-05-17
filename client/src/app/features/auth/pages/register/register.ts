import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnDestroy {
  // Wizard State
  currentStep: number = 1;
  selectedRole: string = '';
  
  // Modal States
  showOtpModal: boolean = false;
  showSuccessModal: boolean = false;
  
  // OTP State
  isVerifying: boolean = false;
  timeRemaining: number = 60;
  timerInterval: any;

  constructor(private router: Router) {}

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // --- Wizard Navigation ---
  setRole(role: string) {
    this.selectedRole = role;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // --- Form Submission & Modals ---
  submitRegistration() {
    this.showOtpModal = true;
    this.startOtpTimer();
  }

  startOtpTimer() {
    this.timeRemaining = 60;
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

  verifyOtp() {
    this.isVerifying = true;
    
    // Simulate API Call delay
    setTimeout(() => {
      this.isVerifying = false;
      this.showOtpModal = false;
      this.showSuccessModal = true;
      clearInterval(this.timerInterval);

      // Redirect to onboarding or login after success
      setTimeout(() => {
        this.router.navigate(['/auth/login']); // or '/auth/onboarding'
      }, 2500);
    }, 1500);
  }

  // --- Utility ---
  moveFocus(event: any, nextElementId: string) {
    if (event.target.value.length >= 1) {
      const nextEl = document.getElementById(nextElementId);
      if (nextEl) nextEl.focus();
    }
  }
}