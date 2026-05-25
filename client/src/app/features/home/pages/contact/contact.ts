import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import * as AOS from 'aos';

interface InquiryType {
  value: string;
  label: string;
  icon: string;
}

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  // Manage background parallax state
  bgPosition = '0px 0px, 0px 0px';

  // Form
  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  // Inquiry Types
  inquiryTypes: InquiryType[] = [
    { value: 'demo', label: 'Request Demo', icon: 'bi-laptop' },
    { value: 'sales', label: 'Sales Inquiry', icon: 'bi-cart' },
    { value: 'support', label: 'Technical Support', icon: 'bi-tools' },
    { value: 'partnership', label: 'Partnership', icon: 'bi-handshake' },
    { value: 'migration', label: 'Data Migration', icon: 'bi-database-up' },
    { value: 'other', label: 'General Inquiry', icon: 'bi-chat-left-text' }
  ];

  // FAQ Data
  faqs: Faq[] = [
    {
      question: 'How long does SACCO onboarding take?',
      answer: 'Typical onboarding takes 2-4 weeks depending on your SACCO size and data complexity. This includes system setup, data migration, staff training, and go-live support. For smaller SACCOs (under 1,000 members), we can have you up and running in as little as 5 business days.'
    },
    {
      question: 'Can you migrate data from our existing system?',
      answer: 'Absolutely. We support migration from all major SACCO management systems including Excel-based records, legacy databases, and popular platforms. Our migration team ensures 100% data integrity with zero downtime during the transition.'
    },
    {
      question: 'What M-Pesa integrations do you support?',
      answer: 'We offer direct integration with Safaricom M-Pesa APIs including C2B (Paybill), B2C (Bulk disbursements), and B2B transfers. We also support Till Number integration and can set up dedicated Paybills for your SACCO with real-time transaction reconciliation.'
    },
    {
      question: 'Is the platform compliant with SASRA regulations?',
      answer: 'Yes, SACCOPay is fully compliant with SASRA (Sacco Societies Regulatory Authority) requirements. Our platform includes automated regulatory reporting, audit trails, and compliance dashboards that update in real-time to ensure you always meet statutory requirements.'
    },
    {
      question: 'Do you offer training for our staff?',
      answer: 'Yes, comprehensive training is included in all packages. We provide both in-person and virtual training sessions for administrators, tellers, and loan officers. Additionally, all SACCOs get access to our knowledge base, video tutorials, and 24/7 support portal.'
    },
    {
      question: 'What are your pricing plans?',
      answer: 'We offer flexible pricing based on your SACCO size and needs. Plans start from KES 15,000/month for small SACCOs and scale based on member count and feature requirements. Contact our sales team for a customized quote with no hidden fees.'
    }
  ];

  activeFaq: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo(0, 0);
    
    // Initialize form
    this.initForm();
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

  // Initialize reactive form
  private initForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      saccoName: ['', Validators.required],
      memberCount: [''],
      inquiryType: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      newsletter: [false]
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
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Select inquiry type
  selectInquiryType(type: string): void {
    this.contactForm.patchValue({ inquiryType: type });
  }

  // Check if field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Toggle FAQ
  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }

  // Open Google Maps
  openMap(): void {
    const address = 'Westlands Business Park, Mpesi Lane, Nairobi, Kenya';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  }

  // Form submission
  onSubmit(): void {
    if (this.contactForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', this.contactForm.value);
      this.isSubmitting = false;
      this.submitSuccess = true;
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.contactForm.reset();
        this.submitSuccess = false;
      }, 3000);
    }, 2000);
  }
}