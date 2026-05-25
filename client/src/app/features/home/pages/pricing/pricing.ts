import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as AOS from 'aos';

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.html',
  styleUrls: ['./pricing.scss']
})
export class PricingComponent implements OnInit, AfterViewInit {
  // Manage background parallax state
  bgPosition = '0px 0px, 0px 0px';

  // FAQ Data
  faqs: Faq[] = [
    {
      question: 'Can I switch between tiers after signing up?',
      answer: 'Yes, you can upgrade or downgrade your tier at any time. Upgrades take effect immediately, and you will only be charged the prorated difference for the remainder of your billing cycle. Downgrades take effect at the start of the next billing cycle. All your data, member records, and transaction history remain intact during the switch.'
    },
    {
      question: 'What happens when my SACCO grows beyond the member limit?',
      answer: 'We will notify you when you are approaching your tier limit. You will have a 30-day grace period to upgrade to the next tier. During this period, all existing features continue to work normally. New member registrations may be temporarily paused until you upgrade. There are no penalties for exceeding limits—we simply help you scale smoothly.'
    },
    {
      question: 'Are there any setup fees or hidden costs?',
      answer: 'No setup fees, no hidden costs. The monthly subscription is your only fixed cost. PAYG users only pay for the transactions they process. Optional services like custom development, dedicated training sessions, or on-site implementation may incur additional charges, but these are always quoted upfront with your approval.'
    },
    {
      question: 'How does the PAYG model work for small SACCOs?',
      answer: 'PAYG is designed for SACCOs with fewer than 50 members who want to test premium features without committing to a monthly subscription. You get full access to the Core platform for free, and only pay per-use for premium features like M-Pesa STK Push (KES 5/tx), SMS notifications (KES 2/msg), CRB checks (KES 15/check), and more. Once you are ready to scale, upgrading to a tier unlocks unlimited usage.'
    },
    {
      question: 'Do you offer discounts for annual contracts?',
      answer: 'Yes. Our 12-month contract offers a 15% discount on the total subscription value, making it our best-value option. This includes a dedicated onboarding specialist, quarterly business reviews, and a price lock guarantee—your rate will not increase during the contract term regardless of feature updates.'
    },
    {
      question: 'What payment methods can I use to pay for SACCOPay?',
      answer: 'You can pay your SACCOPay subscription via M-Pesa Paybill, bank transfer (Equity, KCB, Co-op Bank), card payment (Visa/Mastercard via Stripe), or through your SACCOPay Wallet if you have a positive balance. For enterprise clients, we also support invoice-based payments with 30-day terms.'
    },
    {
      question: 'Is there a free trial for paid tiers?',
      answer: 'Yes. Every paid tier comes with a 14-day free trial. No credit card required to start. You get full access to all features in your selected tier during the trial. At the end of the trial, you can choose to subscribe, downgrade to Free/Core, or export your data and leave—no obligations.'
    },
    {
      question: 'What is included in the onboarding process?',
      answer: 'Standard and Premium tiers include remote onboarding: system configuration, data import assistance, staff training via video calls, and go-live support. Advanced tier clients receive on-site onboarding with a dedicated specialist, custom workflow design, and 90 days of priority post-launch support.'
    }
  ];

  activeFaq: number | null = null;

  constructor() {}

  ngOnInit(): void {
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
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Toggle FAQ
  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }
}