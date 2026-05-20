import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ==============================================
   INTERFACES
   ============================================== */
interface LoanApplication {
  id: string;
  memberId: string;
  memberName: string;
  initials: string;
  avatarGradient: string;
  amount: number;
  termMonths: number;
  interestRate: number;
  type: 'emergency' | 'development' | 'school' | 'business';
  typeLabel: string;
  typeIcon: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  priority: 'urgent' | 'normal' | 'low';
  priorityLabel: string;
  submittedAt: string;
  submittedAgo: string;
  creditScore: number;
  guarantorsConfirmed: number;
  guarantorsTotal: number;
  loanToValue: number;
  monthlyPayment: number;
  existingLoans: number;
  existingLoansAmount: number;
  shareBalance: number;
  employmentStatus: string;
  documentsComplete: boolean;
  purpose: string;
  phone: string;
  email: string;
  address: string;
  nationalId: string;
  dob: string;
  employer: string;
  monthlyIncome: number;
  collateralType: string;
  collateralValue: number;
  guarantors: Guarantor[];
  repaymentSchedule: RepaymentItem[];
  timeline: TimelineEvent[];
}

interface Guarantor {
  id: string;
  name: string;
  initials: string;
  avatarGradient: string;
  phone: string;
  memberId: string;
  status: 'accepted' | 'pending' | 'rejected';
  relationship: string;
}

interface RepaymentItem {
  month: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  balance: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface TimelineEvent {
  step: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
  date?: string;
  icon: string;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  icon: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  unread: boolean;
}

/* ==============================================
   COMPONENT
   ============================================== */
@Component({
  selector: 'app-loan-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-applications.html',
  styleUrl: './loan-applications.scss'
})
export class LoanApplicationsComponent implements OnInit {

  /* ------------------------------------------
     STATE
     ------------------------------------------ */
  activeTab: 'pending' | 'under-review' | 'approved' | 'rejected' | 'all' = 'pending';
  searchQuery = '';
  sortOrder: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'priority' = 'date-desc';
  typeFilter: 'all' | 'emergency' | 'development' | 'school' | 'business' = 'all';

  activeModal: string | null = null;
  selectedApplication: LoanApplication | null = null;

  toastIdCounter = 0;
  toasts: Toast[] = [];

  /* ------------------------------------------
     DATA
     ------------------------------------------ */
  applications: LoanApplication[] = [
    {
      id: 'LOAN-2026-00234',
      memberId: 'R-00045',
      memberName: 'David Kipkorir Rotich',
      initials: 'DK',
      avatarGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))',
      amount: 500000,
      termMonths: 12,
      interestRate: 12,
      type: 'emergency',
      typeLabel: 'Emergency Loan',
      typeIcon: 'bi-exclamation-triangle-fill',
      status: 'pending',
      priority: 'urgent',
      priorityLabel: 'Urgent - Medical',
      submittedAt: '2026-05-17 14:30',
      submittedAgo: '2 hours ago',
      creditScore: 785,
      guarantorsConfirmed: 2,
      guarantorsTotal: 2,
      loanToValue: 65,
      monthlyPayment: 44424,
      existingLoans: 1,
      existingLoansAmount: 200000,
      shareBalance: 150000,
      employmentStatus: 'Employed - 5 years',
      documentsComplete: true,
      purpose: 'Medical emergency - Surgery for family member',
      phone: '+254 712 345 678',
      email: 'david.rotich@email.com',
      address: 'Rongo Town, Migori County',
      nationalId: '12345678',
      dob: '1985-03-15',
      employer: 'Rongo County Hospital',
      monthlyIncome: 85000,
      collateralType: 'Vehicle Logbook',
      collateralValue: 800000,
      guarantors: [
        { id: 'G1', name: 'James Mwangi', initials: 'JM', avatarGradient: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', phone: '+254 723 456 789', memberId: 'R-00012', status: 'accepted', relationship: 'Colleague' },
        { id: 'G2', name: 'Grace Achieng', initials: 'GA', avatarGradient: 'linear-gradient(135deg, var(--accent-orange), var(--accent-red))', phone: '+254 734 567 890', memberId: 'R-00023', status: 'accepted', relationship: 'Spouse' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 38889, interest: 5000, total: 43889, balance: 461111, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 39444, interest: 4444, total: 43888, balance: 421667, status: 'pending' },
        { month: 3, dueDate: 'Aug 2026', principal: 40000, interest: 3889, total: 43889, balance: 381667, status: 'pending' },
        { month: 4, dueDate: 'Sep 2026', principal: 40556, interest: 3333, total: 43889, balance: 341111, status: 'pending' },
        { month: 5, dueDate: 'Oct 2026', principal: 41111, interest: 2778, total: 43889, balance: 300000, status: 'pending' },
        { month: 6, dueDate: 'Nov 2026', principal: 41667, interest: 2222, total: 43889, balance: 258333, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '17 May 2026, 14:30', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '17 May 2026, 15:15', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'completed', date: '17 May 2026, 16:00', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'active', date: 'In Progress', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'pending', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'pending', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00233',
      memberId: 'R-00123',
      memberName: 'Sarah Akinyi Odhiambo',
      initials: 'SA',
      avatarGradient: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
      amount: 1200000,
      termMonths: 24,
      interestRate: 10,
      type: 'development',
      typeLabel: 'Development Loan',
      typeIcon: 'bi-house-door-fill',
      status: 'pending',
      priority: 'normal',
      priorityLabel: 'Standard Review',
      submittedAt: '2026-05-17 11:30',
      submittedAgo: '5 hours ago',
      creditScore: 820,
      guarantorsConfirmed: 1,
      guarantorsTotal: 2,
      loanToValue: 70,
      monthlyPayment: 55385,
      existingLoans: 0,
      existingLoansAmount: 0,
      shareBalance: 500000,
      employmentStatus: 'Employed - 10 years',
      documentsComplete: true,
      purpose: 'Home construction - Phase 2',
      phone: '+254 722 111 222',
      email: 'sarah.odhiambo@email.com',
      address: 'Rongo Township, Plot 45',
      nationalId: '87654321',
      dob: '1978-07-22',
      employer: 'Migori County Government',
      monthlyIncome: 120000,
      collateralType: 'Land Title Deed',
      collateralValue: 2500000,
      guarantors: [
        { id: 'G1', name: 'Peter Omondi', initials: 'PO', avatarGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))', phone: '+254 711 222 333', memberId: 'R-00056', status: 'accepted', relationship: 'Brother' },
        { id: 'G2', name: 'Esther Wanjiku', initials: 'EW', avatarGradient: 'linear-gradient(135deg, var(--accent-purple), var(--accent-red))', phone: '+254 733 444 555', memberId: 'R-00067', status: 'pending', relationship: 'Friend' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 45000, interest: 10000, total: 55000, balance: 1155000, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 45375, interest: 9625, total: 55000, balance: 1109625, status: 'pending' },
        { month: 3, dueDate: 'Aug 2026', principal: 45753, interest: 9247, total: 55000, balance: 1063872, status: 'pending' },
        { month: 4, dueDate: 'Sep 2026', principal: 46134, interest: 8866, total: 55000, balance: 1017738, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '17 May 2026, 11:30', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '17 May 2026, 12:45', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'active', date: 'In Progress', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'pending', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'pending', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'pending', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00232',
      memberId: 'R-00234',
      memberName: 'Mary Wanjiku Kimani',
      initials: 'MW',
      avatarGradient: 'linear-gradient(135deg, var(--accent-orange), var(--accent-red))',
      amount: 350000,
      termMonths: 18,
      interestRate: 11,
      type: 'school',
      typeLabel: 'School Fees Loan',
      typeIcon: 'bi-mortarboard-fill',
      status: 'pending',
      priority: 'normal',
      priorityLabel: 'Standard Review',
      submittedAt: '2026-05-16 09:15',
      submittedAgo: '1 day ago',
      creditScore: 690,
      guarantorsConfirmed: 3,
      guarantorsTotal: 3,
      loanToValue: 50,
      monthlyPayment: 21063,
      existingLoans: 2,
      existingLoansAmount: 180000,
      shareBalance: 250000,
      employmentStatus: 'Employed - 8 years',
      documentsComplete: true,
      purpose: 'University tuition fees - 3rd Year',
      phone: '+254 733 777 888',
      email: 'mary.kimani@email.com',
      address: 'Rongo East, Near Market',
      nationalId: '45678901',
      dob: '1982-11-05',
      employer: 'Rongo Secondary School',
      monthlyIncome: 65000,
      collateralType: 'Salary Assignment',
      collateralValue: 780000,
      guarantors: [
        { id: 'G1', name: 'John Kimani', initials: 'JK', avatarGradient: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))', phone: '+254 722 888 999', memberId: 'R-00111', status: 'accepted', relationship: 'Husband' },
        { id: 'G2', name: 'Lucy Muthoni', initials: 'LM', avatarGradient: 'linear-gradient(135deg, var(--accent-purple), var(--accent-orange))', phone: '+254 744 999 000', memberId: 'R-00222', status: 'accepted', relationship: 'Sister' },
        { id: 'G3', name: 'Samuel Njoroge', initials: 'SN', avatarGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-blue))', phone: '+254 755 000 111', memberId: 'R-00333', status: 'accepted', relationship: 'Colleague' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 17854, interest: 3209, total: 21063, balance: 332146, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 18018, interest: 3045, total: 21063, balance: 314128, status: 'pending' },
        { month: 3, dueDate: 'Aug 2026', principal: 18183, interest: 2880, total: 21063, balance: 295945, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '16 May 2026, 09:15', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '16 May 2026, 10:30', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'completed', date: '16 May 2026, 14:00', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'completed', date: '17 May 2026, 08:00', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'active', date: 'Scheduled', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'pending', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00231',
      memberId: 'R-00345',
      memberName: 'James Ochieng Oloo',
      initials: 'JO',
      avatarGradient: 'linear-gradient(135deg, var(--accent-teal), var(--primary-green))',
      amount: 750000,
      termMonths: 18,
      interestRate: 11,
      type: 'business',
      typeLabel: 'Business Loan',
      typeIcon: 'bi-shop-window',
      status: 'under-review',
      priority: 'normal',
      priorityLabel: 'Standard Review',
      submittedAt: '2026-05-15 16:45',
      submittedAgo: '2 days ago',
      creditScore: 745,
      guarantorsConfirmed: 2,
      guarantorsTotal: 3,
      loanToValue: 60,
      monthlyPayment: 45139,
      existingLoans: 1,
      existingLoansAmount: 150000,
      shareBalance: 400000,
      employmentStatus: 'Self-employed - 6 years',
      documentsComplete: false,
      purpose: 'Stock expansion for retail shop',
      phone: '+254 711 333 444',
      email: 'james.oloo@email.com',
      address: 'Rongo Market, Stall 12',
      nationalId: '56789012',
      dob: '1980-01-20',
      employer: 'Self-employed',
      monthlyIncome: 95000,
      collateralType: 'Business Inventory',
      collateralValue: 1200000,
      guarantors: [
        { id: 'G1', name: 'Grace Atieno', initials: 'GA', avatarGradient: 'linear-gradient(135deg, var(--accent-red), var(--accent-orange))', phone: '+254 722 444 555', memberId: 'R-00444', status: 'accepted', relationship: 'Business Partner' },
        { id: 'G2', name: 'Michael Otieno', initials: 'MO', avatarGradient: 'linear-gradient(135deg, var(--accent-blue), var(--primary-green))', phone: '+254 733 555 666', memberId: 'R-00555', status: 'pending', relationship: 'Friend' },
        { id: 'G3', name: 'Faith Wambui', initials: 'FW', avatarGradient: 'linear-gradient(135deg, var(--accent-purple), var(--accent-teal))', phone: '+254 744 666 777', memberId: 'R-00666', status: 'accepted', relationship: 'Spouse' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 38250, interest: 6889, total: 45139, balance: 711750, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 38601, interest: 6538, total: 45139, balance: 673149, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '15 May 2026, 16:45', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '16 May 2026, 09:00', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'active', date: 'In Progress', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'pending', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'pending', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'pending', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00230',
      memberId: 'R-00456',
      memberName: 'Grace Wambui Mwangi',
      initials: 'GW',
      avatarGradient: 'linear-gradient(135deg, var(--accent-purple), var(--accent-red))',
      amount: 200000,
      termMonths: 6,
      interestRate: 13,
      type: 'emergency',
      typeLabel: 'Emergency Loan',
      typeIcon: 'bi-exclamation-triangle-fill',
      status: 'approved',
      priority: 'urgent',
      priorityLabel: 'Urgent - Funeral',
      submittedAt: '2026-05-14 08:00',
      submittedAgo: '3 days ago',
      creditScore: 810,
      guarantorsConfirmed: 2,
      guarantorsTotal: 2,
      loanToValue: 40,
      monthlyPayment: 34767,
      existingLoans: 0,
      existingLoansAmount: 0,
      shareBalance: 500000,
      employmentStatus: 'Employed - 12 years',
      documentsComplete: true,
      purpose: 'Funeral expenses - Immediate family',
      phone: '+254 722 666 777',
      email: 'grace.mwangi@email.com',
      address: 'Rongo Central, Plot 78',
      nationalId: '67890123',
      dob: '1975-04-10',
      employer: 'Rongo District Hospital',
      monthlyIncome: 110000,
      collateralType: 'Salary Assignment',
      collateralValue: 660000,
      guarantors: [
        { id: 'G1', name: 'Peter Mwangi', initials: 'PM', avatarGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-blue))', phone: '+254 733 777 888', memberId: 'R-00777', status: 'accepted', relationship: 'Husband' },
        { id: 'G2', name: 'Ann Wanjiru', initials: 'AW', avatarGradient: 'linear-gradient(135deg, var(--accent-teal), var(--accent-orange))', phone: '+254 744 888 999', memberId: 'R-00888', status: 'accepted', relationship: 'Sister' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 32608, interest: 2159, total: 34767, balance: 167392, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 32962, interest: 1805, total: 34767, balance: 134430, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '14 May 2026, 08:00', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '14 May 2026, 10:00', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'completed', date: '14 May 2026, 14:30', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'completed', date: '15 May 2026, 09:00', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'completed', date: '16 May 2026, 11:00', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'active', date: 'Scheduled 18 May', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00229',
      memberId: 'R-00567',
      memberName: 'Peter Kamau Njoroge',
      initials: 'PK',
      avatarGradient: 'linear-gradient(135deg, var(--accent-blue), var(--accent-teal))',
      amount: 900000,
      termMonths: 24,
      interestRate: 10,
      type: 'development',
      typeLabel: 'Development Loan',
      typeIcon: 'bi-house-door-fill',
      status: 'under-review',
      priority: 'normal',
      priorityLabel: 'Standard Review',
      submittedAt: '2026-05-13 13:20',
      submittedAgo: '4 days ago',
      creditScore: 765,
      guarantorsConfirmed: 2,
      guarantorsTotal: 2,
      loanToValue: 55,
      monthlyPayment: 41539,
      existingLoans: 1,
      existingLoansAmount: 300000,
      shareBalance: 750000,
      employmentStatus: 'Employed - 7 years',
      documentsComplete: true,
      purpose: 'Farm expansion - Purchase of dairy cows',
      phone: '+254 711 888 999',
      email: 'peter.kamau@email.com',
      address: 'Rongo West, Farm Plot 5',
      nationalId: '78901234',
      dob: '1983-09-25',
      employer: 'Kenya Power',
      monthlyIncome: 95000,
      collateralType: 'Land Title Deed',
      collateralValue: 3500000,
      guarantors: [
        { id: 'G1', name: 'Joseph Njoroge', initials: 'JN', avatarGradient: 'linear-gradient(135deg, var(--accent-orange), var(--accent-red))', phone: '+254 722 999 000', memberId: 'R-00999', status: 'accepted', relationship: 'Brother' },
        { id: 'G2', name: 'Margaret Wanjiru', initials: 'MW', avatarGradient: 'linear-gradient(135deg, var(--accent-purple), var(--primary-green))', phone: '+254 733 000 111', memberId: 'R-01000', status: 'accepted', relationship: 'Spouse' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 33750, interest: 7500, total: 41250, balance: 866250, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 34031, interest: 7219, total: 41250, balance: 832219, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '13 May 2026, 13:20', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '14 May 2026, 09:00', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'completed', date: '15 May 2026, 10:00', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'active', date: 'In Progress', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'pending', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'pending', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00228',
      memberId: 'R-00678',
      memberName: 'Lucy Akoth Onyango',
      initials: 'LA',
      avatarGradient: 'linear-gradient(135deg, var(--accent-red), var(--accent-orange))',
      amount: 150000,
      termMonths: 6,
      interestRate: 13,
      type: 'emergency',
      typeLabel: 'Emergency Loan',
      typeIcon: 'bi-exclamation-triangle-fill',
      status: 'rejected',
      priority: 'urgent',
      priorityLabel: 'Urgent - Medical',
      submittedAt: '2026-05-12 10:00',
      submittedAgo: '5 days ago',
      creditScore: 520,
      guarantorsConfirmed: 0,
      guarantorsTotal: 2,
      loanToValue: 90,
      monthlyPayment: 26075,
      existingLoans: 3,
      existingLoansAmount: 450000,
      shareBalance: 50000,
      employmentStatus: 'Unemployed',
      documentsComplete: false,
      purpose: 'Medical emergency - Child hospitalization',
      phone: '+254 733 111 222',
      email: 'lucy.onyango@email.com',
      address: 'Rongo South, Area 3',
      nationalId: '89012345',
      dob: '1990-12-01',
      employer: 'None',
      monthlyIncome: 0,
      collateralType: 'None',
      collateralValue: 0,
      guarantors: [
        { id: 'G1', name: 'Thomas Onyango', initials: 'TO', avatarGradient: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', phone: '+254 722 222 333', memberId: 'R-01111', status: 'pending', relationship: 'Father' },
        { id: 'G2', name: 'Rose Akoth', initials: 'RA', avatarGradient: 'linear-gradient(135deg, var(--accent-teal), var(--primary-green))', phone: '+254 744 333 444', memberId: 'R-02222', status: 'pending', relationship: 'Mother' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 24453, interest: 1622, total: 26075, balance: 125547, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 24719, interest: 1356, total: 26075, balance: 100828, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '12 May 2026, 10:00', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '12 May 2026, 14:00', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'completed', date: '13 May 2026, 09:00', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'completed', date: '14 May 2026, 16:00', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'completed', date: '15 May 2026, 11:00', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'completed', date: 'Rejected - 15 May', icon: 'bi-x-circle' }
      ]
    },
    {
      id: 'LOAN-2026-00227',
      memberId: 'R-00789',
      memberName: 'Samuel Kiptoo Langat',
      initials: 'SK',
      avatarGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-blue))',
      amount: 600000,
      termMonths: 12,
      interestRate: 12,
      type: 'business',
      typeLabel: 'Business Loan',
      typeIcon: 'bi-shop-window',
      status: 'approved',
      priority: 'normal',
      priorityLabel: 'Standard Review',
      submittedAt: '2026-05-11 15:30',
      submittedAgo: '6 days ago',
      creditScore: 790,
      guarantorsConfirmed: 2,
      guarantorsTotal: 2,
      loanToValue: 50,
      monthlyPayment: 53009,
      existingLoans: 1,
      existingLoansAmount: 100000,
      shareBalance: 600000,
      employmentStatus: 'Self-employed - 8 years',
      documentsComplete: true,
      purpose: 'Purchase of motorbike for transport business',
      phone: '+254 711 444 555',
      email: 'samuel.langat@email.com',
      address: 'Rongo North, Stage Area',
      nationalId: '90123456',
      dob: '1987-06-18',
      employer: 'Self-employed',
      monthlyIncome: 80000,
      collateralType: 'Vehicle Logbook',
      collateralValue: 1200000,
      guarantors: [
        { id: 'G1', name: 'Daniel Kiptoo', initials: 'DK', avatarGradient: 'linear-gradient(135deg, var(--accent-orange), var(--accent-purple))', phone: '+254 722 555 666', memberId: 'R-03333', status: 'accepted', relationship: 'Brother' },
        { id: 'G2', name: 'Catherine Langat', initials: 'CL', avatarGradient: 'linear-gradient(135deg, var(--accent-red), var(--accent-teal))', phone: '+254 733 666 777', memberId: 'R-04444', status: 'accepted', relationship: 'Spouse' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 46667, interest: 6000, total: 52667, balance: 553333, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 47111, interest: 5556, total: 52667, balance: 506222, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '11 May 2026, 15:30', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '12 May 2026, 09:00', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'completed', date: '12 May 2026, 16:00', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'completed', date: '13 May 2026, 10:00', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'completed', date: '14 May 2026, 14:00', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'completed', date: 'Disbursed 15 May', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00226',
      memberId: 'R-00890',
      memberName: 'Esther Wanjiru Mbugua',
      initials: 'EW',
      avatarGradient: 'linear-gradient(135deg, var(--accent-purple), var(--accent-orange))',
      amount: 280000,
      termMonths: 12,
      interestRate: 12,
      type: 'school',
      typeLabel: 'School Fees Loan',
      typeIcon: 'bi-mortarboard-fill',
      status: 'pending',
      priority: 'normal',
      priorityLabel: 'Standard Review',
      submittedAt: '2026-05-10 11:00',
      submittedAgo: '1 week ago',
      creditScore: 710,
      guarantorsConfirmed: 1,
      guarantorsTotal: 2,
      loanToValue: 45,
      monthlyPayment: 24778,
      existingLoans: 1,
      existingLoansAmount: 120000,
      shareBalance: 320000,
      employmentStatus: 'Employed - 4 years',
      documentsComplete: true,
      purpose: 'Secondary school fees - Form 3 & 4',
      phone: '+254 722 777 888',
      email: 'esther.mbugua@email.com',
      address: 'Rongo Township, House 23',
      nationalId: '01234567',
      dob: '1988-02-14',
      employer: 'Rongo Primary School',
      monthlyIncome: 55000,
      collateralType: 'Salary Assignment',
      collateralValue: 660000,
      guarantors: [
        { id: 'G1', name: 'John Mbugua', initials: 'JM', avatarGradient: 'linear-gradient(135deg, var(--primary-green), var(--accent-teal))', phone: '+254 733 888 999', memberId: 'R-05555', status: 'accepted', relationship: 'Husband' },
        { id: 'G2', name: 'Alice Wanjiru', initials: 'AW', avatarGradient: 'linear-gradient(135deg, var(--accent-blue), var(--accent-red))', phone: '+254 744 999 000', memberId: 'R-06666', status: 'pending', relationship: 'Sister' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 21778, interest: 2800, total: 24578, balance: 258222, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 21996, interest: 2582, total: 24578, balance: 236226, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '10 May 2026, 11:00', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '10 May 2026, 15:00', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'active', date: 'In Progress', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'pending', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'pending', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'pending', icon: 'bi-cash-stack' }
      ]
    },
    {
      id: 'LOAN-2026-00225',
      memberId: 'R-00901',
      memberName: 'Josephat Mutua Kioko',
      initials: 'JM',
      avatarGradient: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
      amount: 450000,
      termMonths: 18,
      interestRate: 11,
      type: 'development',
      typeLabel: 'Development Loan',
      typeIcon: 'bi-house-door-fill',
      status: 'under-review',
      priority: 'normal',
      priorityLabel: 'Standard Review',
      submittedAt: '2026-05-09 09:45',
      submittedAgo: '1 week ago',
      creditScore: 735,
      guarantorsConfirmed: 2,
      guarantorsTotal: 2,
      loanToValue: 55,
      monthlyPayment: 27083,
      existingLoans: 1,
      existingLoansAmount: 200000,
      shareBalance: 380000,
      employmentStatus: 'Employed - 9 years',
      documentsComplete: true,
      purpose: 'House renovation - Roofing materials',
      phone: '+254 711 999 000',
      email: 'josephat.kioko@email.com',
      address: 'Rongo East, Plot 67',
      nationalId: '11223344',
      dob: '1981-08-30',
      employer: 'Migori County Roads Dept',
      monthlyIncome: 70000,
      collateralType: 'Land Title Deed',
      collateralValue: 1800000,
      guarantors: [
        { id: 'G1', name: 'Stephen Mutua', initials: 'SM', avatarGradient: 'linear-gradient(135deg, var(--accent-orange), var(--accent-red))', phone: '+254 722 000 111', memberId: 'R-07777', status: 'accepted', relationship: 'Brother' },
        { id: 'G2', name: 'Joyce Kioko', initials: 'JK', avatarGradient: 'linear-gradient(135deg, var(--accent-purple), var(--primary-green))', phone: '+254 733 111 222', memberId: 'R-08888', status: 'accepted', relationship: 'Spouse' }
      ],
      repaymentSchedule: [
        { month: 1, dueDate: 'Jun 2026', principal: 22958, interest: 4125, total: 27083, balance: 427042, status: 'pending' },
        { month: 2, dueDate: 'Jul 2026', principal: 23169, interest: 3914, total: 27083, balance: 403873, status: 'pending' }
      ],
      timeline: [
        { step: 1, label: 'Application Submitted', status: 'completed', date: '09 May 2026, 09:45', icon: 'bi-send-check' },
        { step: 2, label: 'Documents Verified', status: 'completed', date: '09 May 2026, 14:00', icon: 'bi-file-check' },
        { step: 3, label: 'Credit Check', status: 'completed', date: '10 May 2026, 10:00', icon: 'bi-shield-check' },
        { step: 4, label: 'Guarantor Approval', status: 'active', date: 'In Progress', icon: 'bi-people' },
        { step: 5, label: 'Committee Review', status: 'pending', icon: 'bi-bank' },
        { step: 6, label: 'Disbursement', status: 'pending', icon: 'bi-cash-stack' }
      ]
    }
  ];

  notifications: Notification[] = [
    { id: 1, title: 'New Loan Application', message: 'David Kipkorir submitted emergency loan KES 500,000', time: '2 hours ago', icon: 'bi-file-earmark-plus', iconBg: 'rgba(0,208,132,0.1)', iconColor: 'var(--primary-green)', unread: true },
    { id: 2, title: 'Guarantor Approved', message: 'Grace Achieng accepted guarantor request for LOAN-2026-00234', time: '3 hours ago', icon: 'bi-person-check', iconBg: 'rgba(76,175,80,0.1)', iconColor: 'var(--status-success)', unread: true },
    { id: 3, title: 'Document Uploaded', message: 'Sarah Odhiambo uploaded land title deed for LOAN-2026-00233', time: '5 hours ago', icon: 'bi-cloud-upload', iconBg: 'rgba(33,150,243,0.1)', iconColor: 'var(--accent-blue)', unread: true },
    { id: 4, title: 'Loan Disbursed', message: 'Samuel Langat\'s business loan KES 600,000 disbursed successfully', time: '1 day ago', icon: 'bi-cash-stack', iconBg: 'rgba(0,188,212,0.1)', iconColor: 'var(--accent-teal)', unread: false },
    { id: 5, title: 'Credit Score Alert', message: 'Lucy Onyango credit score dropped to 520 - review required', time: '2 days ago', icon: 'bi-exclamation-triangle', iconBg: 'rgba(244,67,54,0.1)', iconColor: 'var(--status-danger)', unread: false }
  ];

  newApplication = {
    memberId: '',
    memberName: '',
    type: 'development',
    amount: 0,
    termMonths: 12,
    interestRate: 12,
    purpose: '',
    collateralType: '',
    collateralValue: 0,
    guarantorCount: 2
  };

  /* ------------------------------------------
     COMPUTED
     ------------------------------------------ */
  get filteredApplications(): LoanApplication[] {
    let result = this.applications;

    if (this.activeTab !== 'all') {
      result = result.filter(a => a.status === this.activeTab);
    }

    if (this.typeFilter !== 'all') {
      result = result.filter(a => a.type === this.typeFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(a =>
        a.memberName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.memberId.toLowerCase().includes(q) ||
        a.amount.toString().includes(q)
      );
    }

    switch (this.sortOrder) {
      case 'date-desc':
        result = [...result].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        break;
      case 'date-asc':
        result = [...result].sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        break;
      case 'amount-desc':
        result = [...result].sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        result = [...result].sort((a, b) => a.amount - b.amount);
        break;
      case 'priority':
        const priorityOrder = { urgent: 0, normal: 1, low: 2 };
        result = [...result].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
    }

    return result;
  }

  get pendingCount(): number { return this.applications.filter(a => a.status === 'pending').length; }
  get underReviewCount(): number { return this.applications.filter(a => a.status === 'under-review').length; }
  get approvedCount(): number { return this.applications.filter(a => a.status === 'approved').length; }
  get rejectedCount(): number { return this.applications.filter(a => a.status === 'rejected').length; }
  get totalCount(): number { return this.applications.length; }

  get approvedTodayTotal(): number { return this.applications.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.amount, 0); }
  get approvalRate(): number {
    const decided = this.approvedCount + this.rejectedCount;
    return decided > 0 ? Math.round((this.approvedCount / decided) * 100 * 10) / 10 : 0;
  }

  get emergencyCount(): number { return this.applications.filter(a => a.type === 'emergency').length; }
  get developmentCount(): number { return this.applications.filter(a => a.type === 'development').length; }
  get schoolCount(): number { return this.applications.filter(a => a.type === 'school').length; }
  get businessCount(): number { return this.applications.filter(a => a.type === 'business').length; }

  get unreadNotifications(): number { return this.notifications.filter(n => n.unread).length; }

  /* ------------------------------------------
     LIFECYCLE
     ------------------------------------------ */
  ngOnInit(): void {
    // Component initialized
  }

  /* ------------------------------------------
     ACTIONS
     ------------------------------------------ */
  switchTab(tab: 'pending' | 'under-review' | 'approved' | 'rejected' | 'all'): void {
    this.activeTab = tab;
  }

  setTypeFilter(type: 'all' | 'emergency' | 'development' | 'school' | 'business'): void {
    this.typeFilter = type;
  }

  applySortOrder(order: string): void {
    this.sortOrder = order as any;
  }

  openModal(modalId: string, application?: LoanApplication): void {
    this.activeModal = modalId;
    if (application) {
      this.selectedApplication = application;
    }
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedApplication = null;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  /* ------------------------------------------
     APPROVAL ACTIONS
     ------------------------------------------ */
  approveApplication(id: string): void {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = 'approved';
      app.timeline = app.timeline.map(t =>
        t.step === 5 ? { ...t, status: 'completed' as const, date: '17 May 2026, 16:45' } :
          t.step === 6 ? { ...t, status: 'active' as const, date: 'Scheduled 18 May' } : t
      );
      this.showToast('success', `Loan ${id} approved successfully`);
    }
    this.closeModal();
  }

  rejectApplication(id: string): void {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = 'rejected';
      app.timeline = app.timeline.map(t =>
        t.step === 5 ? { ...t, status: 'completed' as const, date: '17 May 2026, 16:45' } :
          t.step === 6 ? { ...t, status: 'completed' as const, date: 'Rejected - 17 May', icon: 'bi-x-circle' } : t
      );
      this.showToast('error', `Loan ${id} rejected`);
    }
    this.closeModal();
  }

  returnApplication(id: string): void {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = 'pending';
      app.timeline = app.timeline.map(t =>
        t.step === 4 ? { ...t, status: 'pending' as const, date: undefined } :
          t.step === 5 ? { ...t, status: 'pending' as const, date: undefined } :
            t.step === 6 ? { ...t, status: 'pending' as const, date: undefined } : t
      );
      this.showToast('warning', `Loan ${id} returned to applicant for more info`);
    }
    this.closeModal();
  }

  bulkApprove(): void {
    const pending = this.applications.filter(a => a.status === 'pending');
    pending.forEach(app => {
      app.status = 'approved';
    });
    this.showToast('success', `${pending.length} loans approved in bulk`);
  }

  /* ------------------------------------------
     NEW APPLICATION
     ------------------------------------------ */
  submitNewApplication(): void {
    this.showToast('success', 'New loan application submitted successfully');
    this.closeModal();
    this.newApplication = {
      memberId: '', memberName: '', type: 'development', amount: 0,
      termMonths: 12, interestRate: 12, purpose: '',
      collateralType: '', collateralValue: 0, guarantorCount: 2
    };
  }

  /* ------------------------------------------
     EXPORT & UTILS
     ------------------------------------------ */
  exportApplications(): void {
    this.showToast('info', 'Exporting loan applications to CSV...');
    setTimeout(() => {
      this.showToast('success', 'Export completed successfully');
    }, 1500);
    this.closeModal();
  }

  refreshApplications(): void {
    this.showToast('info', 'Refreshing loan applications...');
    setTimeout(() => {
      this.showToast('success', 'Applications refreshed');
    }, 800);
  }

  downloadDocument(docType: string): void {
    this.showToast('info', `Downloading ${docType}...`);
  }

  /* ------------------------------------------
     TOAST
     ------------------------------------------ */
  showToast(type: 'success' | 'error' | 'warning' | 'info', message: string): void {
    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    const toast: Toast = {
      id: ++this.toastIdCounter,
      type,
      message,
      icon: icons[type]
    };
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 4000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  /* ------------------------------------------
     HELPERS
     ------------------------------------------ */
  formatCurrency(amount: number): string {
    return 'KES ' + amount.toLocaleString('en-KE');
  }

  getScoreColor(score: number): string {
    if (score >= 750) return 'var(--status-success)';
    if (score >= 650) return 'var(--status-warning)';
    return 'var(--status-danger)';
  }

  getScoreLabel(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'under-review': return 'badge-info';
      default: return 'badge-warning';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved': return 'bi-check-circle';
      case 'rejected': return 'bi-x-circle';
      case 'under-review': return 'bi-search';
      default: return 'bi-clock';
    }
  }

  getLoanTypeClass(type: string): string {
    switch (type) {
      case 'emergency': return 'emergency';
      case 'development': return 'development';
      case 'school': return 'school';
      case 'business': return 'business';
      default: return '';
    }
  }

  getLoanCardBorderClass(app: LoanApplication): string {
    if (app.status === 'approved') return 'approved';
    if (app.status === 'rejected') return 'rejected';
    if (app.priority === 'urgent') return 'urgent';
    return 'pending';
  }

  getGuarantorStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'accepted';
      case 'rejected': return 'rejected';
      default: return 'pending';
    }
  }

  getRepaymentRowClass(status: string): string {
    switch (status) {
      case 'overdue': return 'overdue';
      case 'paid': return 'paid';
      default: return '';
    }
  }

  /* ------------------------------------------
     MATH HELPERS (for template access)
     ------------------------------------------ */
  round(value: number): number {
    return Math.round(value);
  }

  ceil(value: number): number {
    return Math.ceil(value);
  }

  floor(value: number): number {
    return Math.floor(value);
  }

  max(...values: number[]): number {
    return Math.max(...values);
  }

  min(...values: number[]): number {
    return Math.min(...values);
  }

}