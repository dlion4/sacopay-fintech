import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type AnalyticsTab = 'overview' | 'revenue' | 'loans' | 'members' | 'comparison';
type ToastType = 'success' | 'info' | 'warning' | 'danger';

interface KpiCard {
  key: string;
  label: string;
  value: string;
  comparisonLabel: string;
  comparisonValue: string;
  trend: string;
  icon: string;
  tone: string;
  sparkline: number[];
}

interface RevenueChartData {
  label: string;
  value: string;
  height: string;
}

interface IncomeDistribution {
  label: string;
  value: string;
  percent: string;
  color: string;
}

interface TrendMetric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  data: number[];
  tone: string;
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

interface ToastState {
  message: string;
  type: ToastType;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  showDateRangePicker = false;
  selectedDateRange = 'Last 30 Days';
  customDateFrom = '';
  customDateTo = '';
  quickDateRanges = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'This Quarter', 'This Year'];

  showExportModal = false;
  showAdvancedFilters = false;
  activeAnalyticsTab: AnalyticsTab = 'overview';

  revenueChartType: 'bar' | 'line' = 'bar';
  revenuePeriod = 'Monthly';
  rankingBy: 'savings' | 'loans' | 'activity' = 'savings';
  comparisonPeriod1 = 'This Month';
  comparisonPeriod2 = 'Last Month';

  exportReportType = 'Complete Analytics Report';
  exportFormat = 'PDF';
  includeCharts = true;
  exportEmail = '';

  filterAccountType = 'All Account Types';
  filterChannel = 'All Channels';
  filterMemberCategory = 'All Members';
  filterLoanStatus = 'All Loans';
  filterAmountMin: number | null = null;
  filterAmountMax: number | null = null;
  filterBranch = 'All Branches';

  toast: ToastState | null = null;
  private toastTimer?: number;

  revenueSparkline = [45, 52, 48, 65, 70, 68, 75, 82, 78, 85, 90, 88];
  loansSparkline = [60, 58, 62, 65, 63, 68, 72, 70, 75, 78, 80, 82];
  savingsSparkline = [50, 55, 58, 62, 65, 70, 72, 75, 78, 82, 85, 88];
  membersSparkline = [65, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87];

  kpiCards: KpiCard[] = [];

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
    { label: 'Dec', value: 'KES 1.52M', height: '98%' },
  ];

  incomeDistribution: IncomeDistribution[] = [
    { label: 'Loan Interest', value: 'KES 5.2M', percent: '42%', color: '#00d084' },
    { label: 'Deposit Fees', value: 'KES 3.1M', percent: '25%', color: '#00bcd4' },
    { label: 'Transaction Charges', value: 'KES 2.4M', percent: '19%', color: '#ff9800' },
    { label: 'Membership Fees', value: 'KES 1.2M', percent: '10%', color: '#2196f3' },
    { label: 'Penalties', value: 'KES 0.5M', percent: '4%', color: '#f44336' },
  ];

  transactionTrends: TrendMetric[] = [
    { label: 'Deposits', value: 'KES 8.2M', change: '+18.5%', positive: true, data: [55, 62, 58, 70, 68, 75, 82, 78, 85, 88, 92, 90], tone: 'success' },
    { label: 'Withdrawals', value: 'KES 3.8M', change: '-6.1%', positive: false, data: [65, 58, 62, 55, 60, 58, 52, 55, 50, 48, 45, 42], tone: 'danger' },
    { label: 'Repayments', value: 'KES 5.6M', change: '+14.2%', positive: true, data: [48, 52, 58, 62, 68, 72, 75, 78, 82, 85, 88, 90], tone: 'blue' },
    { label: 'Transfers', value: 'KES 2.1M', change: '+9.6%', positive: true, data: [60, 58, 62, 65, 62, 68, 70, 72, 75, 78, 80, 82], tone: 'teal' },
  ];

  topMembers: TopMember[] = [
    { name: 'Sarah Wanjiku', id: 'SP-10089', initials: 'SW', color: 'c1', amount: 'KES 2.4M', trend: 1, trendPercent: '+12.5%' },
    { name: 'John Kamau', id: 'SP-10234', initials: 'JK', color: 'c2', amount: 'KES 2.1M', trend: 1, trendPercent: '+8.3%' },
    { name: 'Mary Akinyi', id: 'SP-10156', initials: 'MA', color: 'c3', amount: 'KES 1.9M', trend: 1, trendPercent: '+15.7%' },
    { name: 'Peter Omondi', id: 'SP-10078', initials: 'PO', color: 'c4', amount: 'KES 1.7M', trend: -1, trendPercent: '-2.1%' },
    { name: 'Grace Njeri', id: 'SP-10198', initials: 'GN', color: 'c5', amount: 'KES 1.5M', trend: 1, trendPercent: '+6.4%' },
    { name: 'David Kipkorir', id: 'SP-10145', initials: 'DK', color: 'c1', amount: 'KES 1.4M', trend: 1, trendPercent: '+9.8%' },
  ];

  revenueBreakdown: RevenueBreakdownRow[] = [
    { source: 'Loan Interest Income', icon: 'bi-percent', color: '#00d084', current: 'KES 5.2M', previous: 'KES 4.6M', change: '+KES 600K', percentChange: '+13.0%', changePositive: true, target: 'KES 5.5M', achievement: '94.5%', trendData: [60, 63, 68, 72, 75, 78, 82, 85], highlight: true },
    { source: 'Deposit Processing Fees', icon: 'bi-wallet2', color: '#00bcd4', current: 'KES 3.1M', previous: 'KES 2.8M', change: '+KES 300K', percentChange: '+10.7%', changePositive: true, target: 'KES 3.0M', achievement: '103.3%', trendData: [50, 55, 58, 62, 66, 70, 74, 78] },
    { source: 'Transaction Charges', icon: 'bi-arrow-left-right', color: '#ff9800', current: 'KES 2.4M', previous: 'KES 2.1M', change: '+KES 300K', percentChange: '+14.3%', changePositive: true, target: 'KES 2.6M', achievement: '92.3%', trendData: [45, 48, 52, 60, 62, 67, 70, 72] },
    { source: 'Membership Fees', icon: 'bi-person-plus', color: '#2196f3', current: 'KES 1.2M', previous: 'KES 1.1M', change: '+KES 100K', percentChange: '+9.1%', changePositive: true, target: 'KES 1.4M', achievement: '85.7%', trendData: [40, 45, 46, 50, 53, 54, 58, 62] },
    { source: 'Penalty Income', icon: 'bi-exclamation-triangle', color: '#f44336', current: 'KES 500K', previous: 'KES 620K', change: '-KES 120K', percentChange: '-19.4%', changePositive: false, target: 'KES 400K', achievement: '125%', trendData: [75, 70, 68, 62, 55, 52, 48, 45] },
  ];

  revenueByCategory: RevenueByCategoryData[] = [
    { category: 'Loan Interest', amount: 'KES 5.2M', percentage: '42%', color: '#00d084' },
    { category: 'Deposit Fees', amount: 'KES 3.1M', percentage: '25%', color: '#00bcd4' },
    { category: 'Transaction Charges', amount: 'KES 2.4M', percentage: '19%', color: '#ff9800' },
    { category: 'Membership', amount: 'KES 1.2M', percentage: '10%', color: '#2196f3' },
    { category: 'Penalties', amount: 'KES 0.5M', percentage: '4%', color: '#f44336' },
  ];

  weeklyRevenueData: WeeklyRevenueData[] = [
    { day: 'Mon', value: 'KES 680K', height: '55%', transactions: 342 },
    { day: 'Tue', value: 'KES 920K', height: '74%', transactions: 418 },
    { day: 'Wed', value: 'KES 870K', height: '70%', transactions: 396 },
    { day: 'Thu', value: 'KES 1.1M', height: '88%', transactions: 502 },
    { day: 'Fri', value: 'KES 1.25M', height: '100%', transactions: 548 },
    { day: 'Sat', value: 'KES 760K', height: '61%', transactions: 305 },
    { day: 'Sun', value: 'KES 430K', height: '34%', transactions: 188 },
  ];

  loanTypeDistribution: LoanTypeDistribution[] = [
    { type: 'Personal Loans', count: 342, percent: '38%', color: '#00d084' },
    { type: 'Business Loans', count: 218, percent: '24%', color: '#00bcd4' },
    { type: 'Emergency Loans', count: 156, percent: '17%', color: '#ff9800' },
    { type: 'School Fees', count: 116, percent: '13%', color: '#2196f3' },
    { type: 'Asset Finance', count: 72, percent: '8%', color: '#9c27b0' },
  ];

  loanPerformanceMetrics: LoanPerformanceMetric[] = [
    { name: 'Repayment Rate', value: '94.8%', change: '+2.1%', changePositive: true, color: '#00d084' },
    { name: 'PAR > 30 Days', value: '4.2%', change: '-0.8%', changePositive: true, color: '#ff9800' },
    { name: 'Default Rate', value: '1.1%', change: '-0.3%', changePositive: true, color: '#f44336' },
    { name: 'Avg. Loan Size', value: 'KES 142K', change: '+7.5%', changePositive: true, color: '#2196f3' },
  ];

  loanAgingData: LoanAgingData[] = [
    { bracket: 'Current', count: 812, amount: 'KES 38.4M', percent: '84.9%', expected: '< 85%', status: 'Healthy', statusClass: 'success' },
    { bracket: '1-30 Days', count: 57, amount: 'KES 2.3M', percent: '5.1%', expected: '< 8%', status: 'Watch', statusClass: 'warning' },
    { bracket: '31-60 Days', count: 26, amount: 'KES 1.1M', percent: '2.4%', expected: '< 4%', status: 'Follow Up', statusClass: 'warning' },
    { bracket: '61-90 Days', count: 12, amount: 'KES 650K', percent: '1.4%', expected: '< 2%', status: 'Risk', statusClass: 'danger', alert: true },
    { bracket: '90+ Days', count: 9, amount: 'KES 520K', percent: '1.2%', expected: '< 1%', status: 'Critical', statusClass: 'danger', alert: true },
  ];

  ageDistribution: AgeDistributionData[] = [
    { range: '18-25', count: 164, percent: '13%' },
    { range: '26-35', count: 412, percent: '33%' },
    { range: '36-45', count: 338, percent: '27%' },
    { range: '46-55', count: 211, percent: '17%' },
    { range: '56+', count: 123, percent: '10%' },
  ];

  engagementFactors: EngagementFactor[] = [
    { label: 'Mobile App Usage', icon: 'bi-phone', score: 86 },
    { label: 'Savings Consistency', icon: 'bi-piggy-bank', score: 78 },
    { label: 'Loan Repayment Discipline', icon: 'bi-check-circle', score: 91 },
    { label: 'Meeting Attendance', icon: 'bi-calendar-check', score: 64 },
    { label: 'Share Capital Growth', icon: 'bi-bar-chart', score: 72 },
  ];

  memberSegments: MemberSegment[] = [
    { name: 'High Value Savers', description: 'Members with savings above KES 500K', icon: 'bi-gem', color: '#00d084', count: 128, avgSavings: 'KES 780K', avgLoans: 'KES 220K', activityScore: 94 },
    { name: 'Active Borrowers', description: 'Members with active loans and consistent repayments', icon: 'bi-cash-coin', color: '#00bcd4', count: 286, avgSavings: 'KES 210K', avgLoans: 'KES 340K', activityScore: 88 },
    { name: 'New Members', description: 'Joined within the last 90 days', icon: 'bi-person-plus', color: '#2196f3', count: 76, avgSavings: 'KES 46K', avgLoans: 'KES 0', activityScore: 61 },
    { name: 'Dormant Risk', description: 'Low recent activity requiring reactivation', icon: 'bi-exclamation-circle', color: '#ff9800', count: 43, avgSavings: 'KES 18K', avgLoans: 'KES 52K', activityScore: 24 },
  ];

  comparisonMetrics: ComparisonMetric[] = [
    { name: 'Total Revenue', icon: 'bi-cash-stack', color: '#00d084', period1: 'KES 12.4M', period2: 'KES 10.8M', variance: '+KES 1.6M', percentChange: '+15.3%', variancePositive: true, trendData: [55, 60, 64, 70, 76, 82] },
    { name: 'Loan Disbursement', icon: 'bi-wallet2', color: '#00bcd4', period1: 'KES 8.3M', period2: 'KES 7.1M', variance: '+KES 1.2M', percentChange: '+16.9%', variancePositive: true, trendData: [48, 52, 58, 63, 68, 73] },
    { name: 'New Members', icon: 'bi-people', color: '#2196f3', period1: '76', period2: '62', variance: '+14', percentChange: '+22.6%', variancePositive: true, trendData: [35, 42, 50, 55, 65, 76] },
    { name: 'Defaults', icon: 'bi-exclamation-triangle', color: '#f44336', period1: '9', period2: '13', variance: '-4', percentChange: '-30.8%', variancePositive: true, trendData: [75, 70, 62, 55, 48, 42] },
  ];

  revenueComparisonData: RevenueComparisonData[] = [
    { label: 'Interest', period1Value: '5.2M', period1Height: '88%', period2Value: '4.6M', period2Height: '76%' },
    { label: 'Fees', period1Value: '3.1M', period1Height: '64%', period2Value: '2.8M', period2Height: '58%' },
    { label: 'Charges', period1Value: '2.4M', period1Height: '49%', period2Value: '2.1M', period2Height: '42%' },
    { label: 'Members', period1Value: '1.2M', period1Height: '28%', period2Value: '1.1M', period2Height: '25%' },
    { label: 'Penalties', period1Value: '0.5M', period1Height: '15%', period2Value: '0.62M', period2Height: '20%' },
  ];

  activityComparisonData: ActivityComparisonData[] = [
    { label: 'Deposits', icon: 'bi-arrow-down-circle', period1Value: '3,245', period1Percent: '42%', period2Value: '2,980', period2Percent: '39%', change: '+8.9%', changePositive: true },
    { label: 'Withdrawals', icon: 'bi-arrow-up-circle', period1Value: '1,642', period1Percent: '21%', period2Value: '1,710', period2Percent: '23%', change: '-4.0%', changePositive: true },
    { label: 'Loan Payments', icon: 'bi-check-circle', period1Value: '1,124', period1Percent: '15%', period2Value: '960', period2Percent: '13%', change: '+17.1%', changePositive: true },
    { label: 'Transfers', icon: 'bi-arrow-left-right', period1Value: '1,715', period1Percent: '22%', period2Value: '1,865', period2Percent: '25%', change: '-8.0%', changePositive: false },
  ];

  ngOnInit(): void {
    this.kpiCards = [
      { key: 'revenue', label: 'Total Revenue', value: 'KES 12.4M', comparisonLabel: 'vs Previous Period:', comparisonValue: '+KES 1.6M', trend: '15.3%', icon: 'bi-cash-stack', tone: 'revenue', sparkline: this.revenueSparkline },
      { key: 'loans', label: 'Active Loans Portfolio', value: 'KES 45.2M', comparisonLabel: 'Disbursed this period:', comparisonValue: 'KES 8.3M', trend: '8.7%', icon: 'bi-wallet2', tone: 'loans', sparkline: this.loansSparkline },
      { key: 'savings', label: 'Total Savings', value: 'KES 78.9M', comparisonLabel: 'Average per member:', comparisonValue: 'KES 63,205', trend: '12.1%', icon: 'bi-piggy-bank', tone: 'savings', sparkline: this.savingsSparkline },
      { key: 'members', label: 'Active Members', value: '1,248', comparisonLabel: 'New this month:', comparisonValue: '+76', trend: '6.4%', icon: 'bi-people', tone: 'members', sparkline: this.membersSparkline },
    ];
  }

  ngOnDestroy(): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
  }

  toggleDateRangePicker(): void {
    this.showDateRangePicker = !this.showDateRangePicker;
  }

  selectDateRange(range: string): void {
    this.selectedDateRange = range;
    this.showDateRangePicker = false;
  }

  applyCustomDateRange(): void {
    if (!this.customDateFrom || !this.customDateTo) return;
    this.selectedDateRange = `${this.customDateFrom} to ${this.customDateTo}`;
    this.showDateRangePicker = false;
  }

  refreshAnalytics(): void {
    this.showToast('Analytics data refreshed.', 'info');
  }

  openExportModal(): void {
    this.showExportModal = true;
  }

  openAdvancedFilters(): void {
    this.showAdvancedFilters = true;
  }

  closeModals(): void {
    this.showExportModal = false;
    this.showAdvancedFilters = false;
  }

  exportReport(): void {
    this.showExportModal = false;
    this.showToast('Analytics export is being prepared.', 'success');
  }

  applyAdvancedFilters(): void {
    this.showAdvancedFilters = false;
    this.showToast('Advanced filters applied.', 'success');
  }

  resetAdvancedFilters(): void {
    this.filterAccountType = 'All Account Types';
    this.filterChannel = 'All Channels';
    this.filterMemberCategory = 'All Members';
    this.filterLoanStatus = 'All Loans';
    this.filterAmountMin = null;
    this.filterAmountMax = null;
    this.filterBranch = 'All Branches';
  }

  setTab(tab: AnalyticsTab): void {
    this.activeAnalyticsTab = tab;
  }

  showToast(message: string, type: ToastType = 'success'): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, 2600);
  }
}