import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

/* ══════════════════════════════════════════════════════════════════════════
  INTERFACES
══════════════════════════════════════════════════════════════════════════ */

interface IncomeDistribution {
  label: string;
  value: string;
  percent: string;
  color: string;
}

interface RevenueChartData {
  label: string;
  value: string;
  height: string;
}

interface TopMember {
  name: string;
  id: string;
  initials: string;
  color: string;
  amount: string;
  trend: number;
  trendPercent: string;
}

interface RevenueBreakdownRow {
  source: string;
  icon: string;
  color: string;
  current: string;
  previous: string;
  change: string;
  percentChange: string;
  changePositive: boolean;
  target: string;
  achievement: string;
  trendData: number[];
  highlight?: boolean;
}

interface RevenueByCategoryData {
  category: string;
  amount: string;
  percentage: string;
  color: string;
}

interface WeeklyRevenueData {
  day: string;
  value: string;
  height: string;
  transactions: number;
}

interface LoanTypeDistribution {
  type: string;
  count: number;
  percent: string;
  color: string;
}

interface LoanPerformanceMetric {
  name: string;
  value: string;
  change: string;
  changePositive: boolean;
  color: string;
}

interface LoanAgingData {
  bracket: string;
  count: number;
  amount: string;
  percent: string;
  expected: string;
  status: string;
  statusClass: string;
  alert?: boolean;
}

interface AgeDistributionData {
  range: string;
  count: number;
  percent: string;
}

interface EngagementFactor {
  label: string;
  icon: string;
  score: number;
}

interface MemberSegment {
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
  avgSavings: string;
  avgLoans: string;
  activityScore: number;
}

interface ComparisonMetric {
  name: string;
  icon: string;
  color: string;
  period1: string;
  period2: string;
  variance: string;
  percentChange: string;
  variancePositive: boolean;
  trendData: number[];
}

interface RevenueComparisonData {
  label: string;
  period1Value: string;
  period1Height: string;
  period2Value: string;
  period2Height: string;
}

interface ActivityComparisonData {
  label: string;
  icon: string;
  period1Value: string;
  period1Percent: string;
  period2Value: string;
  period2Percent: string;
  change: string;
  changePositive: boolean;
}

/* ══════════════════════════════════════════════════════════════════════════
  COMPONENT
══════════════════════════════════════════════════════════════════════════ */

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  /* ──────────────────────────────────────────────────────────────────────
    STATE MANAGEMENT
  ────────────────────────────────────────────────────────────────────── */

  // Date Range State
  showDateRangePicker = false;
  selectedDateRange = 'Last 30 Days';
  customDateFrom = '';
  customDateTo = '';
  quickDateRanges = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'Last 30 Days',
    'This Month',
    'Last Month',
    'This Quarter',
    'This Year'
  ];

  // Modal States
  showExportModal = false;
  showAdvancedFilters = false;

  // Tab States
  activeAnalyticsTab: 'overview' | 'revenue' | 'loans' | 'members' | 'comparison' = 'overview';

  // Chart States
  revenueChartType: 'bar' | 'line' = 'bar';
  revenuePeriod = 'Monthly';
  rankingBy: 'savings' | 'loans' | 'activity' = 'savings';

  // Comparison States
  comparisonPeriod1 = 'This Month';
  comparisonPeriod2 = 'Last Month';

  // Export States
  exportReportType = 'Complete Analytics Report';
  exportFormat = 'PDF';
  includeCharts = true;
  exportEmail = '';

  // Advanced Filter States
  filterAccountType = 'All Account Types';
  filterChannel = 'All Channels';
  filterMemberCategory = 'All Members';
  filterLoanStatus = 'All Loans';
  filterAmountMin: number | null = null;
  filterAmountMax: number | null = null;
  filterBranch = 'All Branches';

  // Toast State
  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'info' | 'warning' | 'danger' = 'success';
  toastTimer: any;

  /* ──────────────────────────────────────────────────────────────────────
    KPI SPARKLINE DATA
  ────────────────────────────────────────────────────────────────────── */

  revenueSparkline = [45, 52, 48, 65, 70, 68, 75, 82, 78, 85, 90, 88];
  loansSparkline = [60, 58, 62, 65, 63, 68, 72, 70, 75, 78, 80, 82];
  savingsSparkline = [50, 55, 58, 62, 65, 70, 72, 75, 78, 82, 85, 88];
  membersSparkline = [65, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87];

  /* ──────────────────────────────────────────────────────────────────────
    OVERVIEW TAB DATA
  ────────────────────────────────────────────────────────────────────── */

  revenueChartData: RevenueChartData[] = [
    { label: 'Jan', value: 'KES 850K', height: '55%' },
    { label: 'Feb', value: 'KES 920K', height: '62%' },
    { label: 'Mar', value: 'KES 780K', height: '48%' },
    { label: 'Apr', value: 'KES 1.1M', height: '72%' },
    { label: 'May', value: 'KES 950K', height: '60%' },
    { label: 'Jun', value: 'KES 1.2M', height: '78%' },
    { label: 'Jul', value: 'KES 1.35M', height: '88%' },
    { label: 'Aug', value: 'KES 1.15M', height: '75%' },
    { label: 'Sep', value: 'KES 1.28M', height: '83%' },
    { label: 'Oct', value: 'KES 1.42M', height: '92%' },
    { label: 'Nov', value: 'KES 1.38M', height: '90%' },
    { label: 'Dec', value: 'KES 1.52M', height: '98%' }
  ];

  incomeDistribution: IncomeDistribution[] = [
    { label: 'Loan Interest', value: 'KES 5.2M', percent: '42%', color: '#007bff' },
    { label: 'Deposit Fees', value: 'KES 3.1M', percent: '25%', color: '#28a745' },
    { label: 'Transaction Charges', value: 'KES 2.4M', percent: '19%', color: '#ffc107' },
    { label: 'Membership Fees', value: 'KES 1.2M', percent: '10%', color: '#17a2b8' },
    { label: 'Penalties', value: 'KES 0.5M', percent: '4%', color: '#dc3545' }
  ];

  depositTrend = [55, 62, 58, 70, 68, 75, 82, 78, 85, 88, 92, 90];
  withdrawalTrend = [65, 58, 62, 55, 60, 58, 52, 55, 50, 48, 45, 42];
  repaymentTrend = [48, 52, 58, 62, 68, 72, 75, 78, 82, 85, 88, 90];
  transferTrend = [60, 58, 62, 65, 62, 68, 70, 72, 75, 78, 80, 82];

  topMembers: TopMember[] = [
    { name: 'Sarah Wanjiku', id: 'SP-10089', initials: 'SW', color: 'c1', amount: 'KES 2.4M', trend: 1, trendPercent: '+12.5%' },
    { name: 'John Kamau', id: 'SP-10234', initials: 'JK', color: 'c2', amount: 'KES 2.1M', trend: 1, trendPercent: '+8.3%' },
    { name: 'Mary Akinyi', id: 'SP-10156', initials: 'MA', color: 'c3', amount: 'KES 1.9M', trend: 1, trendPercent: '+15.7%' },
    { name: 'Peter Omondi', id: 'SP-10078', initials: 'PO', color: 'c4', amount: 'KES 1.7M', trend: -1, trendPercent: '-2.1%' },
    { name: 'Grace Njeri', id: 'SP-10198', initials: 'GN', color: 'c5', amount: 'KES 1.5M', trend: 1, trendPercent: '+6.4%' },
    { name: 'David Kipkorir', id: 'SP-10145', initials: 'DK', color: 'c1', amount: 'KES 1.4M', trend: 1, trendPercent: '+9.8%' },
    { name: 'Lucy Wambui', id: 'SP-10267', initials: 'LW', color: 'c2', amount: 'KES 1.3M', trend: 1, trendPercent: '+5.2%' },
    { name: 'James Mwangi', id: 'SP-10112', initials: 'JM', color: 'c3', amount: 'KES 1.2M', trend: 1, trendPercent: '+11.3%' }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    REVENUE ANALYSIS TAB DATA
  ────────────────────────────────────────────────────────────────────── */

  revenueBreakdown: RevenueBreakdownRow[] = [
    {
      source: 'Loan Interest Income',
      icon: 'bi-percent',
      color: '#007bff',
      current: 'KES 5.2M',
      previous: 'KES 4.5M',
      change: '+KES 0.7M',
      percentChange: '+15.6%',
      changePositive: true,
      target: 'KES 5.0M',
      achievement: '104%',
      trendData: [52, 58, 62, 68, 72, 78, 82, 88],
      highlight: true
    },
    {
      source: 'Deposit Processing Fees',
      icon: 'bi-box-arrow-in-down',
      color: '#28a745',
      current: 'KES 3.1M',
      previous: 'KES 2.8M',
      change: '+KES 0.3M',
      percentChange: '+10.7%',
      changePositive: true,
      target: 'KES 3.0M',
      achievement: '103%',
      trendData: [58, 62, 65, 68, 72, 75, 78, 82]
    },
    {
      source: 'Transaction Charges',
      icon: 'bi-arrow-left-right',
      color: '#ffc107',
      current: 'KES 2.4M',
      previous: 'KES 2.2M',
      change: '+KES 0.2M',
      percentChange: '+9.1%',
      changePositive: true,
      target: 'KES 2.5M',
      achievement: '96%',
      trendData: [62, 65, 68, 70, 72, 75, 78, 80]
    },
    {
      source: 'Membership Fees',
      icon: 'bi-people',
      color: '#17a2b8',
      current: 'KES 1.2M',
      previous: 'KES 1.0M',
      change: '+KES 0.2M',
      percentChange: '+20.0%',
      changePositive: true,
      target: 'KES 1.1M',
      achievement: '109%',
      trendData: [55, 60, 65, 70, 75, 80, 85, 90]
    },
    {
      source: 'Late Payment Penalties',
      icon: 'bi-exclamation-circle',
      color: '#dc3545',
      current: 'KES 0.5M',
      previous: 'KES 0.3M',
      change: '+KES 0.2M',
      percentChange: '+66.7%',
      changePositive: true,
      target: 'KES 0.4M',
      achievement: '125%',
      trendData: [45, 48, 52, 58, 65, 72, 78, 85]
    }
  ];

  revenueByCategoryData: RevenueByCategoryData[] = [
    { category: 'Loan Interest', amount: 'KES 5.2M', percentage: '42%', color: '#007bff' },
    { category: 'Deposit Fees', amount: 'KES 3.1M', percentage: '25%', color: '#28a745' },
    { category: 'Transaction Charges', amount: 'KES 2.4M', percentage: '19%', color: '#ffc107' },
    { category: 'Membership Fees', amount: 'KES 1.2M', percentage: '10%', color: '#17a2b8' },
    { category: 'Penalties', amount: 'KES 0.5M', percentage: '4%', color: '#dc3545' }
  ];

  weeklyRevenueData: WeeklyRevenueData[] = [
    { day: 'Mon', value: 'KES 1.2M', height: '65%', transactions: 284 },
    { day: 'Tue', value: 'KES 1.5M', height: '82%', transactions: 312 },
    { day: 'Wed', value: 'KES 1.35M', height: '73%', transactions: 298 },
    { day: 'Thu', value: 'KES 1.6M', height: '88%', transactions: 345 },
    { day: 'Fri', value: 'KES 1.8M', height: '98%', transactions: 389 },
    { day: 'Sat', value: 'KES 0.9M', height: '48%', transactions: 156 },
    { day: 'Sun', value: 'KES 0.6M', height: '32%', transactions: 98 }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    LOANS PERFORMANCE TAB DATA
  ────────────────────────────────────────────────────────────────────── */

  loanTypeDistribution: LoanTypeDistribution[] = [
    { type: 'Personal Loans', count: 156, percent: '41%', color: '#007bff' },
    { type: 'Business Loans', count: 98, percent: '26%', color: '#28a745' },
    { type: 'Emergency Loans', count: 72, percent: '19%', color: '#ffc107' },
    { type: 'Development Loans', count: 42, percent: '11%', color: '#17a2b8' },
    { type: 'School Fees Loans', count: 16, percent: '4%', color: '#6610f2' }
  ];

  loanPerformanceMetrics: LoanPerformanceMetric[] = [
    { name: 'Disbursement Rate', value: '98.5%', change: '+2.3%', changePositive: true, color: '#28a745' },
    { name: 'Collection Rate', value: '96.8%', change: '+1.8%', changePositive: true, color: '#007bff' },
    { name: 'Default Rate', value: '1.2%', change: '-0.5%', changePositive: true, color: '#ffc107' },
    { name: 'Portfolio at Risk', value: '1.03%', change: '-0.3%', changePositive: true, color: '#dc3545' }
  ];

  loanAgingData: LoanAgingData[] = [
    { 
      bracket: 'Current (0-30 days)', 
      count: 342, 
      amount: 'KES 41.8M', 
      percent: '92.5%', 
      expected: 'KES 2.1M', 
      status: 'Good', 
      statusClass: 'status-good' 
    },
    { 
      bracket: '31-60 days', 
      count: 28, 
      amount: 'KES 2.4M', 
      percent: '5.3%', 
      expected: 'KES 120K', 
      status: 'Watch', 
      statusClass: 'status-warning' 
    },
    { 
      bracket: '61-90 days', 
      count: 9, 
      amount: 'KES 680K', 
      percent: '1.5%', 
      expected: 'KES 34K', 
      status: 'Follow-up', 
      statusClass: 'status-warning',
      alert: true 
    },
    { 
      bracket: '91-180 days', 
      count: 3, 
      amount: 'KES 240K', 
      percent: '0.5%', 
      expected: 'KES 12K', 
      status: 'Action Required', 
      statusClass: 'status-alert',
      alert: true 
    },
    { 
      bracket: 'Over 180 days', 
      count: 2, 
      amount: 'KES 80K', 
      percent: '0.2%', 
      expected: 'KES 4K', 
      status: 'Critical', 
      statusClass: 'status-alert',
      alert: true 
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    MEMBER INSIGHTS TAB DATA
  ────────────────────────────────────────────────────────────────────── */

  memberGrowthData = [65, 68, 72, 75, 78, 82, 85, 88, 90, 92, 95, 98];

  ageDistributionData: AgeDistributionData[] = [
    { range: '18-25', count: 124, percent: '45%' },
    { range: '26-35', count: 386, percent: '88%' },
    { range: '36-45', count: 468, percent: '98%' },
    { range: '46-55', count: 218, percent: '72%' },
    { range: '56-65', count: 52, percent: '35%' }
  ];

  engagementFactors: EngagementFactor[] = [
    { label: 'Transaction Frequency', icon: 'bi-arrow-repeat', score: 87 },
    { label: 'Savings Consistency', icon: 'bi-piggy-bank', score: 92 },
    { label: 'Loan Repayment', icon: 'bi-check-circle', score: 95 },
    { label: 'App Usage', icon: 'bi-phone', score: 78 },
    { label: 'Meeting Attendance', icon: 'bi-calendar-check', score: 65 }
  ];

  memberSegments: MemberSegment[] = [
    {
      name: 'VIP Members',
      description: 'High-value members with excellent track record',
      icon: 'bi-star-fill',
      color: 'linear-gradient(135deg, #ffc107, #ff9800)',
      count: 87,
      avgSavings: 'KES 850K',
      avgLoans: 'KES 1.2M',
      activityScore: 9.2
    },
    {
      name: 'Premium Members',
      description: 'Active members with good savings and loan history',
      icon: 'bi-gem',
      color: 'linear-gradient(135deg, #007bff, #0056b3)',
      count: 324,
      avgSavings: 'KES 420K',
      avgLoans: 'KES 580K',
      activityScore: 8.5
    },
    {
      name: 'Regular Members',
      description: 'Standard active members',
      icon: 'bi-person-check',
      color: 'linear-gradient(135deg, #28a745, #20c997)',
      count: 682,
      avgSavings: 'KES 180K',
      avgLoans: 'KES 240K',
      activityScore: 7.3
    },
    {
      name: 'New Members',
      description: 'Members joined in last 6 months',
      icon: 'bi-person-plus',
      color: 'linear-gradient(135deg, #17a2b8, #138496)',
      count: 155,
      avgSavings: 'KES 45K',
      avgLoans: 'KES 0',
      activityScore: 6.1
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    PERIOD COMPARISON TAB DATA
  ────────────────────────────────────────────────────────────────────── */

  comparisonMetrics: ComparisonMetric[] = [
    {
      name: 'Total Revenue',
      icon: 'bi-cash-stack',
      color: '#28a745',
      period1: 'KES 12.4M',
      period2: 'KES 10.8M',
      variance: '+KES 1.6M',
      percentChange: '+15.3%',
      variancePositive: true,
      trendData: [52, 58, 62, 68, 72, 78, 82, 88]
    },
    {
      name: 'Loan Disbursements',
      icon: 'bi-wallet2',
      color: '#007bff',
      period1: 'KES 8.3M',
      period2: 'KES 7.0M',
      variance: '+KES 1.3M',
      percentChange: '+18.6%',
      variancePositive: true,
      trendData: [55, 60, 65, 70, 75, 80, 85, 90]
    },
    {
      name: 'Total Deposits',
      icon: 'bi-box-arrow-in-down',
      color: '#17a2b8',
      period1: 'KES 8.9M',
      period2: 'KES 8.2M',
      variance: '+KES 0.7M',
      percentChange: '+8.5%',
      variancePositive: true,
      trendData: [58, 62, 65, 68, 72, 75, 78, 82]
    },
    {
      name: 'Active Members',
      icon: 'bi-people',
      color: '#6610f2',
      period1: '1,248',
      period2: '1,172',
      variance: '+76',
      percentChange: '+6.5%',
      variancePositive: true,
      trendData: [60, 65, 68, 72, 75, 78, 82, 85]
    },
    {
      name: 'Default Rate',
      icon: 'bi-exclamation-triangle',
      color: '#dc3545',
      period1: '1.2%',
      period2: '1.7%',
      variance: '-0.5%',
      percentChange: '-29.4%',
      variancePositive: true,
      trendData: [75, 70, 65, 60, 55, 50, 45, 40]
    }
  ];

  revenueComparisonData: RevenueComparisonData[] = [
    { label: 'Week 1', period1Value: 'KES 2.8M', period1Height: '70%', period2Value: 'KES 2.4M', period2Height: '60%' },
    { label: 'Week 2', period1Value: 'KES 3.1M', period1Height: '78%', period2Value: 'KES 2.7M', period2Height: '68%' },
    { label: 'Week 3', period1Value: 'KES 3.4M', period1Height: '85%', period2Value: 'KES 2.9M', period2Height: '73%' },
    { label: 'Week 4', period1Value: 'KES 3.1M', period1Height: '78%', period2Value: 'KES 2.8M', period2Height: '70%' }
  ];

  activityComparisonData: ActivityComparisonData[] = [
    {
      label: 'Total Transactions',
      icon: 'bi-arrow-left-right',
      period1Value: '4,646',
      period1Percent: '95%',
      period2Value: '3,982',
      period2Percent: '82%',
      change: '+664',
      changePositive: true
    },
    {
      label: 'New Registrations',
      icon: 'bi-person-plus',
      period1Value: '76',
      period1Percent: '88%',
      period2Value: '52',
      period2Percent: '60%',
      change: '+24',
      changePositive: true
    },
    {
      label: 'Loan Applications',
      icon: 'bi-file-text',
      period1Value: '142',
      period1Percent: '78%',
      period2Value: '128',
      period2Percent: '70%',
      change: '+14',
      changePositive: true
    },
    {
      label: 'App Logins',
      icon: 'bi-phone',
      period1Value: '8,234',
      period1Percent: '92%',
      period2Value: '7,456',
      period2Percent: '83%',
      change: '+778',
      changePositive: true
    }
  ];

  /* ──────────────────────────────────────────────────────────────────────
    CONSTRUCTOR & LIFECYCLE
  ────────────────────────────────────────────────────────────────────── */

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('Analytics page initialized');
    this.initializeDates();
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
    INITIALIZATION
  ══════════════════════════════════════════════════════════════════════ */

  initializeDates(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    this.customDateFrom = this.formatDate(thirtyDaysAgo);
    this.customDateTo = this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /* ══════════════════════════════════════════════════════════════════════
    DATE RANGE PICKER
  ══════════════════════════════════════════════════════════════════════ */

  toggleDateRangePicker(): void {
    this.showDateRangePicker = !this.showDateRangePicker;
  }

  selectDateRange(range: string): void {
    this.selectedDateRange = range;
    this.showDateRangePicker = false;
    this.showToast(`Date range updated to: ${range}`, 'info');
    this.refreshAnalyticsData();
  }

  applyCustomDateRange(): void {
    if (this.customDateFrom && this.customDateTo) {
      this.selectedDateRange = `${this.customDateFrom} to ${this.customDateTo}`;
      this.showDateRangePicker = false;
      this.showToast('Custom date range applied', 'success');
      this.refreshAnalyticsData();
    } else {
      this.showToast('Please select both start and end dates', 'warning');
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
    CHART CONTROLS
  ══════════════════════════════════════════════════════════════════════ */

  toggleChartType(chartName: string): void {
    if (chartName === 'revenue') {
      this.revenueChartType = this.revenueChartType === 'bar' ? 'line' : 'bar';
      this.showToast(`Chart type changed to ${this.revenueChartType}`, 'info');
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
    MODAL MANAGEMENT
  ══════════════════════════════════════════════════════════════════════ */

  openExportModal(): void {
    this.showExportModal = true;
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  openAdvancedFilters(): void {
    this.showAdvancedFilters = true;
  }

  closeAdvancedFilters(): void {
    this.showAdvancedFilters = false;
  }

  openIncomeBreakdown(): void {
    this.showToast('Opening detailed income breakdown...', 'info');
    // Navigate to detailed view or open modal
  }

  openVolumeAnalysis(): void {
    this.showToast('Opening volume analysis...', 'info');
    // Navigate to detailed view or open modal
  }

  /* ══════════════════════════════════════════════════════════════════════
    DATA ACTIONS
  ══════════════════════════════════════════════════════════════════════ */

  refreshAnalytics(): void {
    this.showToast('Refreshing analytics data...', 'info');
    setTimeout(() => {
      this.refreshAnalyticsData();
      this.showToast('Analytics data refreshed successfully!', 'success');
    }, 1000);
  }

  refreshAnalyticsData(): void {
    // This would typically fetch fresh data from the backend
    console.log('Refreshing analytics data for:', this.selectedDateRange);
  }

  exportRevenueData(): void {
    this.showToast('Exporting revenue data...', 'info');
    setTimeout(() => {
      this.showToast('Revenue data exported successfully!', 'success');
    }, 1000);
  }

  printRevenueReport(): void {
    this.showToast('Preparing revenue report for printing...', 'info');
    setTimeout(() => {
      window.print();
    }, 500);
  }

  confirmExport(): void {
    this.closeExportModal();
    this.showToast(`Exporting ${this.exportReportType} as ${this.exportFormat}...`, 'info');
    
    setTimeout(() => {
      if (this.exportEmail) {
        this.showToast(`Report exported and sent to ${this.exportEmail}!`, 'success');
      } else {
        this.showToast(`Report exported successfully! Check your downloads.`, 'success');
      }
    }, 1500);
  }

  exportComparisonData(): void {
    this.showToast('Exporting comparison data...', 'info');
    setTimeout(() => {
      this.showToast('Comparison data exported successfully!', 'success');
    }, 1000);
  }

  /* ══════════════════════════════════════════════════════════════════════
    ADVANCED FILTERS
  ══════════════════════════════════════════════════════════════════════ */

  applyAdvancedFilters(): void {
    this.closeAdvancedFilters();
    
    const filterCount = this.getActiveFilterCount();
    this.showToast(`${filterCount} filter(s) applied successfully!`, 'success');
    
    // Apply filters to data
    console.log('Applying filters:', {
      accountType: this.filterAccountType,
      channel: this.filterChannel,
      memberCategory: this.filterMemberCategory,
      loanStatus: this.filterLoanStatus,
      amountRange: [this.filterAmountMin, this.filterAmountMax],
      branch: this.filterBranch
    });
  }

  resetAdvancedFilters(): void {
    this.filterAccountType = 'All Account Types';
    this.filterChannel = 'All Channels';
    this.filterMemberCategory = 'All Members';
    this.filterLoanStatus = 'All Loans';
    this.filterAmountMin = null;
    this.filterAmountMax = null;
    this.filterBranch = 'All Branches';
    
    this.showToast('All filters reset to default', 'info');
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.filterAccountType !== 'All Account Types') count++;
    if (this.filterChannel !== 'All Channels') count++;
    if (this.filterMemberCategory !== 'All Members') count++;
    if (this.filterLoanStatus !== 'All Loans') count++;
    if (this.filterAmountMin !== null || this.filterAmountMax !== null) count++;
    if (this.filterBranch !== 'All Branches') count++;
    return count;
  }

  /* ══════════════════════════════════════════════════════════════════════
    PERIOD COMPARISON
  ══════════════════════════════════════════════════════════════════════ */

  applyComparison(): void {
    this.showToast(`Comparing ${this.comparisonPeriod1} with ${this.comparisonPeriod2}...`, 'info');
    setTimeout(() => {
      this.showToast('Comparison updated successfully!', 'success');
      // Refresh comparison data
    }, 1000);
  }

  /* ══════════════════════════════════════════════════════════════════════
    UTILITY FUNCTIONS
  ══════════════════════════════════════════════════════════════════════ */

  getIncomeDonutGradient(): string {
    return 'conic-gradient(' +
      '#007bff 0deg 151deg, ' +
      '#28a745 151deg 241deg, ' +
      '#ffc107 241deg 309deg, ' +
      '#17a2b8 309deg 345deg, ' +
      '#dc3545 345deg 360deg)';
  }

  getLoanTypeDonutGradient(): string {
    return 'conic-gradient(' +
      '#007bff 0deg 148deg, ' +
      '#28a745 148deg 241deg, ' +
      '#ffc107 241deg 309deg, ' +
      '#17a2b8 309deg 349deg, ' +
      '#6610f2 349deg 360deg)';
  }

  calculateScoreDashOffset(score: number): number {
    const maxScore = 10;
    const circumference = 2 * Math.PI * 90; // radius = 90
    const percentage = score / maxScore;
    return circumference * (1 - percentage);
  }

  parseFloat(value: string): number {
    return parseFloat(value.replace('%', ''));
  }

  /* ══════════════════════════════════════════════════════════════════════
    TOAST NOTIFICATIONS
  ══════════════════════════════════════════════════════════════════════ */

  showToast(message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  hideToast(): void {
    this.toastVisible = false;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
    NAVIGATION
  ══════════════════════════════════════════════════════════════════════ */

  navigateTo(route: string): void {
    this.router.navigate(['/admin', route]);
  }
}