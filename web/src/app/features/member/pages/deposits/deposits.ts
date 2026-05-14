import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposits.html',
  styleUrls: ['./deposits.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DepositsComponent implements OnInit, AfterViewInit {
  @ViewChild('depositChartCanvas') depositChartCanvas!: ElementRef<HTMLCanvasElement>;
  chartInstance: any;

  // State Management
  activeMethod: 'mpesa' | 'bank' | 'cash' = 'mpesa';
  activeChartPeriod: '6M' | '1Y' | 'All' = '6M';
  depositAmount: string = '';

  // Dynamic Data
  stats = {
    totalDeposits: '850,000.00',
    thisMonth: '45,000',
    targetProgress: 90,
    lastDepositAmount: '15,000',
    lastDepositDate: 'Yesterday, 14:30'
  };

  recentDeposits = [
    { ref: 'MP-88392', date: '24 Oct 2024, 14:30', method: 'M-Pesa', amount: '+ KES 15,000', status: 'Success', statusClass: 'success', icon: 'fa-mobile-screen' },
    { ref: 'BK-99201', date: '18 Oct 2024, 09:15', method: 'Bank Transfer', amount: '+ KES 50,000', status: 'Success', statusClass: 'success', icon: 'fa-building-columns' },
    { ref: 'CS-77281', date: '02 Oct 2024, 11:00', method: 'Cash Deposit', amount: '+ KES 25,000', status: 'Pending', statusClass: 'warning', icon: 'fa-money-bill-wave' },
    { ref: 'MP-88102', date: '28 Sep 2024, 16:45', method: 'M-Pesa', amount: '+ KES 10,000', status: 'Success', statusClass: 'success', icon: 'fa-mobile-screen' },
    { ref: 'MP-87990', date: '15 Sep 2024, 08:20', method: 'M-Pesa', amount: '+ KES 5,000', status: 'Failed', statusClass: 'danger', icon: 'fa-mobile-screen' }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
  }

  // --- Interaction Methods ---
  selectMethod(method: 'mpesa' | 'bank' | 'cash') {
    this.activeMethod = method;
  }

  setChartPeriod(period: '6M' | '1Y' | 'All') {
    this.activeChartPeriod = period;
    this.updateChartData(period);
  }

  initDeposit() {
    if (!this.depositAmount) {
      alert('Please enter an amount to deposit.');
      return;
    }
    // Implement actual deposit logic here
    console.log(`Initiating ${this.activeMethod} deposit of KES ${this.depositAmount}`);
    alert(`Deposit of KES ${this.depositAmount} via ${this.activeMethod} initiated successfully.`);
    this.depositAmount = '';
  }

  // --- Chart.js Logic ---
  initChart() {
    const ctx = this.depositChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Create Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(26, 115, 232, 0.4)');
    gradient.addColorStop(1, 'rgba(26, 115, 232, 0.0)');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: this.getChartDataForPeriod('6M', gradient),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1E293B',
            padding: 12,
            titleFont: { size: 13, family: "'Inter', sans-serif" },
            bodyFont: { size: 14, weight: 'bold', family: "'JetBrains Mono', monospace" },
            callbacks: {
              label: (context) => 'KES ' + context.parsed.y.toLocaleString()
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: "'Inter', sans-serif" }, color: 'rgba(26,29,46,0.5)' } },
          y: { 
            border: { display: false }, 
            grid: { color: 'rgba(26,29,46,0.06)' },
            ticks: { 
              font: { family: "'Inter', sans-serif" }, 
              color: 'rgba(26,29,46,0.5)',
              callback: (value) => 'K' + (Number(value) / 1000)
            }
          }
        },
        interaction: { intersect: false, mode: 'index' }
      }
    });
  }

  updateChartData(period: '6M' | '1Y' | 'All') {
    if (!this.chartInstance) return;
    const ctx = this.depositChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(26, 115, 232, 0.4)');
    gradient.addColorStop(1, 'rgba(26, 115, 232, 0.0)');

    const newData = this.getChartDataForPeriod(period, gradient);
    this.chartInstance.data = newData;
    this.chartInstance.update();
  }

  getChartDataForPeriod(period: string, gradient: any) {
    const datasets: any = {
      '6M': { labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'], data: [7000, 8500, 10000, 15000, 5000, 12500] },
      '1Y': { labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'], data: [10000, 5000, 8000, 12000, 9000, 11000, 7000, 8500, 10000, 15000, 5000, 12500] },
      'All': { labels: ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4'], data: [25000, 32000, 28000, 45000, 38000, 42000, 50000, 65000] }
    };

    const target = datasets[period];
    return {
      labels: target.labels,
      datasets: [{
        label: 'Deposits',
        data: target.data,
        borderColor: '#1a73e8',
        backgroundColor: gradient,
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#1a73e8',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }]
    };
  }
}