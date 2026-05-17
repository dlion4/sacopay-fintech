import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DepositRow {
  id: string; date: string; time: string; account: string;
  method: string; amount: number; status: 'confirmed' | 'pending' | 'failed';
  reference: string;
}

export interface ModalState {
  depositMethod: boolean; mpesaPush: boolean; cardPayment: boolean;
  bankTransfer: boolean; confirmedDetail: boolean; pendingDetail: boolean;
  failedDetail: boolean; autoDeposit: boolean; export: boolean;
  monthDetail: boolean; yearDetail: boolean; trendsAnalysis: boolean;
  monthlyRequirement: boolean; notifications: boolean; logout: boolean;
}

export interface ToastItem {
  id: number; message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface NotificationItem {
  id: number; title: string; message: string; time: string;
  read: boolean; type: 'deposit' | 'alert' | 'info';
}

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<!-- OVERLAY BACKDROP -->
<div class="modal-backdrop" *ngIf="anyModalOpen" (click)="closeAllModals()"></div>

<!-- TOAST NOTIFICATIONS -->
<div class="toast-container">
  <div *ngFor="let toast of toasts" class="toast toast-{{toast.type}}" (click)="removeToast(toast.id)">
    <span class="toast-icon">{{ getToastIcon(toast.type) }}</span>
    <span class="toast-message">{{ toast.message }}</span>
    <button class="toast-close" (click)="removeToast(toast.id); $event.stopPropagation()">&times;</button>
  </div>
</div>

<!-- MAIN PAGE CONTENT -->
<div class="deposits-page">

  <!-- Page Header -->
  <div class="page-header">
    <div class="header-left">
      <h1 class="page-title">My Deposits</h1>
      <p class="page-subtitle">Manage your contributions and track deposit history</p>
    </div>
    <div class="header-actions">
      <button class="btn btn-primary" (click)="openModal('depositMethod')">
        <span class="btn-icon">+</span> Deposit Now
      </button>
      <button class="btn btn-outline" (click)="openModal('autoDeposit')">
        <span class="btn-icon">&#8634;</span> Auto-Deposit
      </button>
      <button class="btn btn-icon" (click)="openModal('notifications')" title="Notifications">
        &#128276;
        <span class="badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
      </button>
    </div>
  </div>

  <!-- Hero Balance Card -->
  <div class="hero-card" (click)="openModal('trendsAnalysis')">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <div class="hero-label">Total Deposits</div>
      <div class="hero-amount">KES {{ totalDeposits | number }}</div>
      <div class="hero-meta">
        <span class="hero-trend">&#9650; 12.5% this month</span>
        <span class="hero-date">As of {{ today }}</span>
      </div>
    </div>
    <div class="hero-chart-preview">
      <canvas #heroCanvas width="200" height="80"></canvas>
    </div>
  </div>

  <!-- Stat Cards Row -->
  <div class="stats-grid">
    <div class="stat-card" (click)="openModal('monthDetail')">
      <div class="stat-icon stat-icon-blue">&#128197;</div>
      <div class="stat-info">
        <div class="stat-label">This Month</div>
        <div class="stat-value">KES {{ monthTotal | number }}</div>
        <div class="stat-change positive">+8.3% vs last month</div>
      </div>
    </div>
    <div class="stat-card" (click)="openModal('yearDetail')">
      <div class="stat-icon stat-icon-green">&#128200;</div>
      <div class="stat-info">
        <div class="stat-label">This Year</div>
        <div class="stat-value">KES {{ yearTotal | number }}</div>
        <div class="stat-change positive">+15.2% vs last year</div>
      </div>
    </div>
    <div class="stat-card" (click)="openModal('confirmedDetail')">
      <div class="stat-icon stat-icon-purple">&#128176;</div>
      <div class="stat-info">
        <div class="stat-label">Last Deposit</div>
        <div class="stat-value">KES {{ lastDeposit.amount | number }}</div>
        <div class="stat-change">{{ lastDeposit.date }}</div>
      </div>
    </div>
    <div class="stat-card" (click)="openModal('trendsAnalysis')">
      <div class="stat-icon stat-icon-orange">&#128202;</div>
      <div class="stat-info">
        <div class="stat-label">Avg Monthly</div>
        <div class="stat-value">KES {{ avgMonthly | number }}</div>
        <div class="stat-change">Based on 12 months</div>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="main-grid">

    <!-- Left: Chart + Table -->
    <div class="main-left">

      <!-- Deposit Trends Chart -->
      <div class="card chart-card">
        <div class="card-header">
          <h3 class="card-title">Deposit Trends</h3>
          <div class="chart-tabs">
            <button *ngFor="let tab of chartTabs" class="chart-tab"
              [class.active]="activeChartTab === tab" (click)="setChartTab(tab)">{{ tab }}</button>
          </div>
        </div>
        <div class="chart-body">
          <canvas #trendCanvas width="600" height="240"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><span class="legend-dot dot-primary"></span> Deposits</div>
          <div class="legend-item"><span class="legend-dot dot-secondary"></span> Target</div>
        </div>
      </div>

      <!-- Deposit History Table -->
      <div class="card table-card">
        <div class="card-header">
          <h3 class="card-title">Deposit History</h3>
          <div class="table-filters">
            <select class="filter-select" [(ngModel)]="filterAccount" (change)="applyFilters()">
              <option value="">All Accounts</option>
              <option *ngFor="let acc of accounts" [value]="acc">{{ acc }}</option>
            </select>
            <select class="filter-select" [(ngModel)]="filterStatus" (change)="applyFilters()">
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button class="btn btn-sm btn-outline" (click)="openModal('export')">Export</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Date</th><th>Account</th><th>Method</th><th>Amount</th><th>Status</th><th>Reference</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of paginatedRows"
                [class.row-pending]="row.status === 'pending'"
                [class.row-failed]="row.status === 'failed'"
                (click)="openDetailModal(row)">
                <td><div class="cell-date">{{ row.date }}</div><div class="cell-time">{{ row.time }}</div></td>
                <td>{{ row.account }}</td>
                <td><span class="method-badge method-{{ row.method.toLowerCase() }}">{{ row.method }}</span></td>
                <td class="cell-amount">KES {{ row.amount | number }}</td>
                <td><span class="status-badge status-{{ row.status }}">{{ row.status | titlecase }}</span></td>
                <td class="cell-ref">{{ row.reference }}</td>
                <td><button class="btn btn-xs btn-ghost" (click)="openDetailModal(row); $event.stopPropagation()">View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-footer">
          <span class="table-info">Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ filteredRows.length }}</span>
          <div class="pagination">
            <button class="page-btn" [disabled]="currentPage === 1" (click)="prevPage()">&lsaquo;</button>
            <button *ngFor="let p of pageNumbers" class="page-btn" [class.active]="p === currentPage" (click)="goToPage(p)">{{ p }}</button>
            <button class="page-btn" [disabled]="currentPage === totalPages" (click)="nextPage()">&rsaquo;</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Side Panels -->
    <div class="main-right">

      <!-- Pending Deposit -->
      <div class="card side-card" *ngIf="pendingDeposit" (click)="openModal('pendingDetail')">
        <div class="card-header">
          <h3 class="card-title">Pending Deposit</h3>
          <span class="status-badge status-pending">Pending</span>
        </div>
        <div class="side-card-body">
          <div class="side-amount">KES {{ pendingDeposit.amount | number }}</div>
          <div class="side-meta">{{ pendingDeposit.date }} &middot; {{ pendingDeposit.method }}</div>
          <div class="progress-tracker">
            <div class="tracker-step completed"><div class="tracker-dot"></div><div class="tracker-label">Submitted</div></div>
            <div class="tracker-step completed"><div class="tracker-dot"></div><div class="tracker-label">Proof</div></div>
            <div class="tracker-step active"><div class="tracker-dot"></div><div class="tracker-label">Verification</div></div>
            <div class="tracker-step"><div class="tracker-dot"></div><div class="tracker-label">Confirmed</div></div>
          </div>
        </div>
      </div>

      <!-- Monthly Contribution -->
      <div class="card side-card" (click)="openModal('monthlyRequirement')">
        <div class="card-header"><h3 class="card-title">Monthly Contribution</h3></div>
        <div class="side-card-body">
          <div class="gauge-container">
            <div class="gauge-ring"><div class="gauge-value">{{ contributionPercent }}%</div></div>
          </div>
          <div class="gauge-label">Achieved this month</div>
          <div class="gauge-details">
            <div class="gauge-detail"><span class="detail-label">Required</span><span class="detail-value">KES {{ requiredMonthly | number }}</span></div>
            <div class="gauge-detail"><span class="detail-label">Deposited</span><span class="detail-value">KES {{ monthTotal | number }}</span></div>
          </div>
        </div>
      </div>

      <!-- Account Breakdown -->
      <div class="card side-card">
        <div class="card-header"><h3 class="card-title">Account Breakdown</h3></div>
        <div class="side-card-body">
          <div class="breakdown-list">
            <div class="breakdown-item" *ngFor="let item of accountBreakdown">
              <div class="breakdown-info"><span class="breakdown-name">{{ item.name }}</span><span class="breakdown-percent">{{ item.percent }}%</span></div>
              <div class="breakdown-bar"><div class="breakdown-fill" [style.width.%]="item.percent"></div></div>
              <div class="breakdown-amount">KES {{ item.amount | number }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 1: Deposit Method Chooser -->
<div class="modal" *ngIf="modals.depositMethod">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Make a Deposit</h3>
        <button class="modal-close" (click)="closeModal('depositMethod')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="method-grid">
          <div class="method-card" (click)="selectMethod('M-Pesa'); closeModal('depositMethod'); openModal('mpesaPush')">
            <div class="method-icon method-mpesa">M</div>
            <div class="method-name">M-Pesa</div>
            <div class="method-desc">STK Push to your phone</div>
          </div>
          <div class="method-card" (click)="selectMethod('Card'); closeModal('depositMethod'); openModal('cardPayment')">
            <div class="method-icon method-card-icon">&#128179;</div>
            <div class="method-name">Card Payment</div>
            <div class="method-desc">Visa, Mastercard</div>
          </div>
          <div class="method-card" (click)="selectMethod('Bank'); closeModal('depositMethod'); openModal('bankTransfer')">
            <div class="method-icon method-bank">&#127974;</div>
            <div class="method-name">Bank Transfer</div>
            <div class="method-desc">Deposit via bank</div>
          </div>
          <div class="method-card" (click)="selectMethod('Airtel'); closeModal('depositMethod'); openModal('mpesaPush')">
            <div class="method-icon method-airtel">A</div>
            <div class="method-name">Airtel Money</div>
            <div class="method-desc">Airtel Money transfer</div>
          </div>
        </div>
        <div class="deposit-amount-section">
          <label class="form-label">Amount (KES)</label>
          <input type="number" class="form-input form-input-lg" [(ngModel)]="depositAmount" placeholder="Enter amount">
          <div class="quick-amounts">
            <button class="quick-btn" *ngFor="let amt of quickAmounts" (click)="depositAmount = amt">KES {{ amt | number }}</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Deposit To Account</label>
          <select class="form-select" [(ngModel)]="selectedAccount">
            <option *ngFor="let acc of accounts" [value]="acc">{{ acc }}</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('depositMethod')">Cancel</button>
        <button class="btn btn-primary" [disabled]="!depositAmount" (click)="proceedDeposit()">Continue</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 2: M-Pesa STK Push Wizard -->
<div class="modal" *ngIf="modals.mpesaPush">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">M-Pesa Payment</h3>
        <button class="modal-close" (click)="closeModal('mpesaPush'); resetMpesaWizard()">&times;</button>
      </div>
      <div class="modal-body">
        <div *ngIf="mpesaStep === 1">
          <div class="wizard-step">
            <div class="step-indicator">
              <div class="step-dot active"></div><div class="step-line"></div>
              <div class="step-dot"></div><div class="step-line"></div>
              <div class="step-dot"></div>
            </div>
            <div class="step-labels"><span class="active">Phone</span><span>Confirm</span><span>Done</span></div>
          </div>
          <div class="form-group">
            <label class="form-label">M-Pesa Number</label>
            <input type="tel" class="form-input" [(ngModel)]="mpesaPhone" placeholder="2547XX XXX XXX">
            <div class="form-hint">Enter the number to receive STK push</div>
          </div>
          <div class="deposit-summary">
            <div class="summary-row"><span>Amount</span><strong>KES {{ depositAmount | number }}</strong></div>
            <div class="summary-row"><span>Account</span><strong>{{ selectedAccount }}</strong></div>
          </div>
        </div>
        <div *ngIf="mpesaStep === 2" class="processing-step">
          <div class="spinner-large"></div>
          <h4 class="processing-title">Waiting for M-Pesa confirmation...</h4>
          <p class="processing-subtitle">Check your phone and enter PIN</p>
          <div class="countdown">{{ countdown }}s remaining</div>
          <div class="progress-bar"><div class="progress-fill" [style.width.%]="(countdown / 60) * 100"></div></div>
        </div>
        <div *ngIf="mpesaStep === 3" class="success-step">
          <div class="success-icon">&#10003;</div>
          <h4 class="success-title">Deposit Successful!</h4>
          <p class="success-subtitle">Your deposit has been confirmed</p>
          <div class="receipt-card">
            <div class="receipt-header"><div class="receipt-title">Deposit Receipt</div><div class="receipt-ref">{{ generatedReference }}</div></div>
            <div class="receipt-body">
              <div class="receipt-row"><span>Amount</span><strong>KES {{ depositAmount | number }}</strong></div>
              <div class="receipt-row"><span>Method</span><strong>M-Pesa</strong></div>
              <div class="receipt-row"><span>Account</span><strong>{{ selectedAccount }}</strong></div>
              <div class="receipt-row"><span>Date</span><strong>{{ today }}</strong></div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" *ngIf="mpesaStep === 1" (click)="closeModal('mpesaPush'); resetMpesaWizard()">Cancel</button>
        <button class="btn btn-primary" *ngIf="mpesaStep === 1" [disabled]="!mpesaPhone" (click)="startMpesaPush()">Send STK Push</button>
        <button class="btn btn-outline" *ngIf="mpesaStep === 2" (click)="cancelMpesa()">Cancel</button>
        <button class="btn btn-primary" *ngIf="mpesaStep === 3" (click)="closeModal('mpesaPush'); resetMpesaWizard()">Done</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 3: Card Payment Wizard -->
<div class="modal" *ngIf="modals.cardPayment">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Card Payment</h3>
        <button class="modal-close" (click)="closeModal('cardPayment'); resetCardWizard()">&times;</button>
      </div>
      <div class="modal-body">
        <div *ngIf="cardStep === 1">
          <div class="wizard-step">
            <div class="step-indicator">
              <div class="step-dot active"></div><div class="step-line"></div>
              <div class="step-dot"></div><div class="step-line"></div>
              <div class="step-dot"></div>
            </div>
          </div>
          <div class="card-visual">
            <div class="credit-card">
              <div class="cc-chip"></div>
              <div class="cc-number">{{ cardNumber || '#### #### #### ####' }}</div>
              <div class="cc-row">
                <div class="cc-name">{{ cardName || 'CARDHOLDER NAME' }}</div>
                <div class="cc-expiry">{{ cardExpiry || 'MM/YY' }}</div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Card Number</label>
            <input type="text" class="form-input" [(ngModel)]="cardNumber" (input)="formatCardNumber($event)" maxlength="19" placeholder="0000 0000 0000 0000">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Expiry Date</label>
              <input type="text" class="form-input" [(ngModel)]="cardExpiry" (input)="formatExpiry($event)" maxlength="5" placeholder="MM/YY">
            </div>
            <div class="form-group">
              <label class="form-label">CVV</label>
              <input type="text" class="form-input" [(ngModel)]="cardCvv" maxlength="4" placeholder="123">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Cardholder Name</label>
            <input type="text" class="form-input" [(ngModel)]="cardName" placeholder="Name on card">
          </div>
        </div>
        <div *ngIf="cardStep === 2" class="processing-step">
          <div class="spinner-large"></div>
          <h4 class="processing-title">Processing Payment...</h4>
          <p class="processing-subtitle">Please do not close this window</p>
        </div>
        <div *ngIf="cardStep === 3" class="success-step">
          <div class="success-icon">&#10003;</div>
          <h4 class="success-title">Payment Successful!</h4>
          <p class="success-subtitle">Your card payment has been processed</p>
          <div class="receipt-card">
            <div class="receipt-row"><span>Amount</span><strong>KES {{ depositAmount | number }}</strong></div>
            <div class="receipt-row"><span>Card</span><strong>**** {{ cardNumber.slice(-4) }}</strong></div>
            <div class="receipt-row"><span>Reference</span><strong>{{ generatedReference }}</strong></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" *ngIf="cardStep === 1" (click)="closeModal('cardPayment'); resetCardWizard()">Cancel</button>
        <button class="btn btn-primary" *ngIf="cardStep === 1" [disabled]="!isCardValid()" (click)="processCardPayment()">Pay KES {{ depositAmount | number }}</button>
        <button class="btn btn-primary" *ngIf="cardStep === 3" (click)="closeModal('cardPayment'); resetCardWizard()">Done</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 4: Bank Transfer -->
<div class="modal" *ngIf="modals.bankTransfer">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Bank Transfer</h3>
        <button class="modal-close" (click)="closeModal('bankTransfer')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="bank-details-card">
          <h4 class="bank-details-title">SaccoPay Bank Details</h4>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Bank</span>
            <div class="bank-detail-value"><span>Co-operative Bank</span><button class="copy-btn" (click)="copyToClipboard('Co-operative Bank')">Copy</button></div>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Branch</span>
            <div class="bank-detail-value"><span>Nairobi Main</span><button class="copy-btn" (click)="copyToClipboard('Nairobi Main')">Copy</button></div>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Account Number</span>
            <div class="bank-detail-value"><span>01100287654321</span><button class="copy-btn" (click)="copyToClipboard('01100287654321')">Copy</button></div>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Account Name</span>
            <div class="bank-detail-value"><span>SaccoPay SACCO Ltd</span><button class="copy-btn" (click)="copyToClipboard('SaccoPay SACCO Ltd')">Copy</button></div>
          </div>
          <div class="bank-detail-row">
            <span class="bank-detail-label">Reference</span>
            <div class="bank-detail-value"><span>{{ generatedReference }}</span><button class="copy-btn" (click)="copyToClipboard(generatedReference)">Copy</button></div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Amount Deposited (KES)</label>
          <input type="number" class="form-input" [(ngModel)]="bankAmount" placeholder="Enter amount transferred">
        </div>
        <div class="form-group">
          <label class="form-label">Date of Transfer</label>
          <input type="date" class="form-input" [(ngModel)]="bankDate">
        </div>
        <div class="form-group">
          <label class="form-label">Upload Proof of Payment</label>
          <div class="upload-zone" (click)="triggerFileUpload()" (dragover)="$event.preventDefault()" (drop)="onFileDrop($event)">
            <div class="upload-icon">&#128193;</div>
            <div class="upload-text">Click or drag file here</div>
            <div class="upload-hint">PDF, JPG, PNG up to 5MB</div>
            <input type="file" #fileInput hidden (change)="onFileSelected($event)">
          </div>
          <div class="file-name" *ngIf="uploadedFileName">{{ uploadedFileName }}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('bankTransfer')">Cancel</button>
        <button class="btn btn-primary" [disabled]="!bankAmount || !bankDate" (click)="submitBankTransfer()">Submit</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 5: Confirmed Deposit Detail -->
<div class="modal" *ngIf="modals.confirmedDetail">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Deposit Details</h3>
        <button class="modal-close" (click)="closeModal('confirmedDetail')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="detail-status status-confirmed-large">
          <div class="status-icon">&#10003;</div>
          <div class="status-text">Confirmed</div>
        </div>
        <div class="detail-amount">KES {{ selectedDeposit?.amount | number }}</div>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Reference</span><span class="detail-value">{{ selectedDeposit?.reference }}</span></div>
          <div class="detail-item"><span class="detail-label">Date</span><span class="detail-value">{{ selectedDeposit?.date }} {{ selectedDeposit?.time }}</span></div>
          <div class="detail-item"><span class="detail-label">Account</span><span class="detail-value">{{ selectedDeposit?.account }}</span></div>
          <div class="detail-item"><span class="detail-label">Method</span><span class="detail-value">{{ selectedDeposit?.method }}</span></div>
          <div class="detail-item"><span class="detail-label">Transaction ID</span><span class="detail-value">TXN-{{ selectedDeposit?.id }}</span></div>
          <div class="detail-item"><span class="detail-label">Processed By</span><span class="detail-value">System</span></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="downloadReceipt()"><span>&#128190;</span> Download Receipt</button>
        <button class="btn btn-ghost" (click)="reportIssue()">Report Issue</button>
        <button class="btn btn-primary" (click)="closeModal('confirmedDetail')">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 6: Pending Deposit Detail -->
<div class="modal" *ngIf="modals.pendingDetail">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Pending Deposit</h3>
        <button class="modal-close" (click)="closeModal('pendingDetail')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="detail-status status-pending-large">
          <div class="status-icon">&#9203;</div>
          <div class="status-text">Under Verification</div>
        </div>
        <div class="detail-amount">KES {{ pendingDeposit.amount | number }}</div>
        <div class="tracker-vertical">
          <div class="v-tracker-step completed">
            <div class="v-tracker-dot"></div>
            <div class="v-tracker-content"><div class="v-tracker-title">Deposit Submitted</div><div class="v-tracker-time">{{ pendingDeposit.date }}</div></div>
          </div>
          <div class="v-tracker-step completed">
            <div class="v-tracker-dot"></div>
            <div class="v-tracker-content"><div class="v-tracker-title">Proof Uploaded</div><div class="v-tracker-time">Awaiting verification</div></div>
          </div>
          <div class="v-tracker-step active">
            <div class="v-tracker-dot"></div>
            <div class="v-tracker-content"><div class="v-tracker-title">Under Verification</div><div class="v-tracker-time">Typically 1-2 business days</div></div>
          </div>
          <div class="v-tracker-step">
            <div class="v-tracker-dot"></div>
            <div class="v-tracker-content"><div class="v-tracker-title">Confirmed</div><div class="v-tracker-time">Will notify via SMS</div></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('pendingDetail')">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 7: Failed Deposit Detail -->
<div class="modal" *ngIf="modals.failedDetail">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Failed Deposit</h3>
        <button class="modal-close" (click)="closeModal('failedDetail')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="detail-status status-failed-large">
          <div class="status-icon">&#10007;</div>
          <div class="status-text">Deposit Failed</div>
        </div>
        <div class="detail-amount">KES {{ selectedDeposit?.amount | number }}</div>
        <div class="failure-reason">
          <div class="failure-icon">&#9888;</div>
          <div class="failure-content">
            <div class="failure-title">Transaction Declined</div>
            <div class="failure-desc">The payment was declined by your bank. Please check your account balance or contact your bank.</div>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Reference</span><span class="detail-value">{{ selectedDeposit?.reference }}</span></div>
          <div class="detail-item"><span class="detail-label">Date</span><span class="detail-value">{{ selectedDeposit?.date }}</span></div>
          <div class="detail-item"><span class="detail-label">Method</span><span class="detail-value">{{ selectedDeposit?.method }}</span></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('failedDetail')">Close</button>
        <button class="btn btn-primary" (click)="retryDeposit()">Retry Deposit</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 8: Auto-Deposit Setup -->
<div class="modal" *ngIf="modals.autoDeposit">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Auto-Deposit Setup</h3>
        <button class="modal-close" (click)="closeModal('autoDeposit')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Auto-Deposit Amount (KES)</label>
          <input type="number" class="form-input" [(ngModel)]="autoAmount" placeholder="Enter amount">
          <div class="quick-amounts">
            <button class="quick-btn" *ngFor="let amt of quickAmounts" (click)="autoAmount = amt">KES {{ amt | number }}</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Frequency</label>
          <select class="form-select" [(ngModel)]="autoFrequency">
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Day of {{ autoFrequency === 'monthly' ? 'Month' : 'Week' }}</label>
          <input type="number" class="form-input" [(ngModel)]="autoDay" min="1" max="31" placeholder="e.g. 5">
        </div>
        <div class="form-group">
          <label class="form-label">Deposit To Account</label>
          <select class="form-select" [(ngModel)]="autoAccount">
            <option *ngFor="let acc of accounts" [value]="acc">{{ acc }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">M-Pesa Number for Auto-Debit</label>
          <input type="tel" class="form-input" [(ngModel)]="autoPhone" placeholder="2547XX XXX XXX">
        </div>
        <div class="toggle-group">
          <label class="toggle-item">
            <input type="checkbox" [(ngModel)]="autoSmsNotify">
            <span class="toggle-slider"></span>
            <span class="toggle-label">SMS Notifications</span>
          </label>
          <label class="toggle-item">
            <input type="checkbox" [(ngModel)]="autoEmailNotify">
            <span class="toggle-slider"></span>
            <span class="toggle-label">Email Notifications</span>
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('autoDeposit')">Cancel</button>
        <button class="btn btn-primary" [disabled]="!autoAmount || !autoPhone" (click)="saveAutoDeposit()">Save Setup</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 9: Export -->
<div class="modal" *ngIf="modals.export">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Export Deposits</h3>
        <button class="modal-close" (click)="closeModal('export')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Period</label>
          <select class="form-select" [(ngModel)]="exportPeriod">
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="lastYear">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div class="export-formats">
          <button class="export-format-btn" (click)="exportData('pdf')">
            <span class="format-icon">&#128196;</span><span class="format-name">PDF</span>
          </button>
          <button class="export-format-btn" (click)="exportData('excel')">
            <span class="format-icon">&#128202;</span><span class="format-name">Excel</span>
          </button>
          <button class="export-format-btn" (click)="exportData('csv')">
            <span class="format-icon">&#128438;</span><span class="format-name">CSV</span>
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('export')">Cancel</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 10: Month Detail -->
<div class="modal" *ngIf="modals.monthDetail">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">February 2025 Details</h3>
        <button class="modal-close" (click)="closeModal('monthDetail')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="month-stats">
          <div class="month-stat"><div class="month-stat-value">KES {{ monthTotal | number }}</div><div class="month-stat-label">Total Deposited</div></div>
          <div class="month-stat"><div class="month-stat-value">{{ monthDepositCount }}</div><div class="month-stat-label">Transactions</div></div>
          <div class="month-stat"><div class="month-stat-value">KES {{ monthAvg | number }}</div><div class="month-stat-label">Average</div></div>
        </div>
        <div class="month-methods">
          <h4 class="section-subtitle">By Method</h4>
          <div class="method-breakdown" *ngFor="let m of monthMethods">
            <div class="method-breakdown-info"><span>{{ m.name }}</span><span>KES {{ m.amount | number }}</span></div>
            <div class="method-breakdown-bar"><div class="method-breakdown-fill" [style.width.%]="m.percent"></div></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('monthDetail')">Close</button>
        <button class="btn btn-primary" (click)="closeModal('monthDetail'); openModal('depositMethod')">Deposit More</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 11: Year Detail -->
<div class="modal" *ngIf="modals.yearDetail">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">2025 Annual Summary</h3>
        <button class="modal-close" (click)="closeModal('yearDetail')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="year-hero">
          <div class="year-total">KES {{ yearTotal | number }}</div>
          <div class="year-label">Total Deposits</div>
        </div>
        <div class="year-projected">
          <div class="projected-label">Projected Annual</div>
          <div class="projected-value">KES {{ projectedAnnual | number }}</div>
          <div class="projected-bar"><div class="projected-fill" [style.width.%]="(yearTotal / projectedAnnual) * 100"></div></div>
        </div>
        <div class="year-months">
          <h4 class="section-subtitle">Monthly Breakdown</h4>
          <div class="year-month-row" *ngFor="let m of yearMonths">
            <span class="year-month-name">{{ m.name }}</span>
            <div class="year-month-bar"><div class="year-month-fill" [style.width.%]="m.percent"></div></div>
            <span class="year-month-value">KES {{ m.amount | number }}</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('yearDetail')">Close</button>
        <button class="btn btn-primary" (click)="closeModal('yearDetail'); openModal('export')">Export Report</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 12: Trends Analysis -->
<div class="modal" *ngIf="modals.trendsAnalysis">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Deposit Trends Analysis</h3>
        <button class="modal-close" (click)="closeModal('trendsAnalysis')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="trends-grid">
          <div class="trend-card"><div class="trend-value">93%</div><div class="trend-label">Consistency Score</div><div class="trend-desc">You deposit regularly</div></div>
          <div class="trend-card"><div class="trend-value">+15.2%</div><div class="trend-label">YoY Growth</div><div class="trend-desc">Compared to last year</div></div>
          <div class="trend-card"><div class="trend-value">4.2</div><div class="trend-label">Avg Deposits/Month</div><div class="trend-desc">Transactions per month</div></div>
        </div>
        <div class="method-breakdown-section">
          <h4 class="section-subtitle">Method Breakdown</h4>
          <div class="method-breakdown" *ngFor="let m of methodBreakdown">
            <div class="method-breakdown-info"><span>{{ m.name }}</span><span>{{ m.percent }}%</span></div>
            <div class="method-breakdown-bar"><div class="method-breakdown-fill" [style.width.%]="m.percent"></div></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" (click)="closeModal('trendsAnalysis')">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 13: Monthly Requirement -->
<div class="modal" *ngIf="modals.monthlyRequirement">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Monthly Contribution Requirement</h3>
        <button class="modal-close" (click)="closeModal('monthlyRequirement')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="requirement-gauge">
          <div class="gauge-ring-large">
            <div class="gauge-value-large">{{ contributionPercent }}%</div>
            <div class="gauge-label-large">Achieved</div>
          </div>
        </div>
        <div class="requirement-details">
          <div class="req-detail"><span class="req-label">Monthly Required</span><span class="req-value">KES {{ requiredMonthly | number }}</span></div>
          <div class="req-detail"><span class="req-label">Deposited This Month</span><span class="req-value">KES {{ monthTotal | number }}</span></div>
          <div class="req-detail">
            <span class="req-label">Remaining</span>
            <span class="req-value" [class.positive]="remainingRequired <= 0" [class.negative]="remainingRequired > 0">KES {{ remainingRequired | number }}</span>
          </div>
        </div>
        <div class="requirement-message" *ngIf="contributionPercent >= 100">
          <div class="message-success">&#127942; Congratulations! You have exceeded your monthly requirement.</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('monthlyRequirement')">Close</button>
        <button class="btn btn-primary" (click)="closeModal('monthlyRequirement'); openModal('depositMethod')">Deposit Now</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 14: Notifications -->
<div class="modal" *ngIf="modals.notifications">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Notifications</h3>
        <button class="modal-close" (click)="closeModal('notifications')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="notification-list">
          <div class="notification-item" *ngFor="let n of notifications" [class.unread]="!n.read" (click)="markRead(n.id)">
            <div class="notification-icon" [class]="'notif-' + n.type">
              {{ n.type === 'deposit' ? '&#128176;' : n.type === 'alert' ? '&#9888;' : '&#8505;' }}
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ n.title }}</div>
              <div class="notification-message">{{ n.message }}</div>
              <div class="notification-time">{{ n.time }}</div>
            </div>
            <div class="notification-unread" *ngIf="!n.read"></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" (click)="markAllRead()">Mark All Read</button>
        <button class="btn btn-primary" (click)="closeModal('notifications')">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL 15: Logout Confirmation -->
<div class="modal" *ngIf="modals.logout">
  <div class="modal-dialog modal-sm">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Confirm Logout</h3>
        <button class="modal-close" (click)="closeModal('logout')">&times;</button>
      </div>
      <div class="modal-body">
        <div class="logout-content">
          <div class="logout-icon">&#128682;</div>
          <p class="logout-text">Are you sure you want to log out?</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" (click)="closeModal('logout')">Cancel</button>
        <button class="btn btn-danger" (click)="confirmLogout()">Logout</button>
      </div>
    </div>
  </div>
</div>
`,
  styleUrls: ['./deposits.scss']
})

export class DepositsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('trendCanvas') trendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroCanvas') heroCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  today = new Date().toLocaleDateString('en-GB');
  totalDeposits = 145000;
  monthTotal = 25000;
  yearTotal = 145000;
  avgMonthly = 12083;
  lastDeposit = { amount: 5000, date: '12 May 2025' };
  contributionPercent = 250;
  requiredMonthly = 10000;
  remainingRequired = 0;
  monthDepositCount = 5;
  monthAvg = 5000;
  projectedAnnual = 174000;

  accounts = ['Savings Account', 'Share Capital', 'Emergency Fund', 'Education Fund'];
  selectedAccount = 'Savings Account';

  quickAmounts = [1000, 5000, 10000, 20000, 50000];
  depositAmount: number | null = null;

  chartTabs = ['6M', '1Y', 'All'];
  activeChartTab = '6M';
  chartData: Record<string, { labels: string[]; data: number[]; target: number[] }> = {
    '6M': { labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], data: [8000, 12000, 15000, 10000, 18000, 25000], target: [10000, 10000, 10000, 10000, 10000, 10000] },
    '1Y': { labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], data: [5000, 7000, 6000, 9000, 11000, 8000, 8000, 12000, 15000, 10000, 18000, 25000], target: Array(12).fill(10000) },
    'All': { labels: ['2022', '2023', '2024', '2025'], data: [45000, 78000, 95000, 145000], target: [60000, 90000, 120000, 150000] }
  };

  allRows: DepositRow[] = [
    { id: '001', date: '12 May 2025', time: '14:30', account: 'Savings Account', method: 'M-Pesa', amount: 5000, status: 'confirmed', reference: 'MPESA-2025-001' },
    { id: '002', date: '10 May 2025', time: '09:15', account: 'Share Capital', method: 'Card', amount: 10000, status: 'confirmed', reference: 'CARD-2025-002' },
    { id: '003', date: '05 May 2025', time: '16:45', account: 'Emergency Fund', method: 'Bank', amount: 25000, status: 'pending', reference: 'BANK-2025-003' },
    { id: '004', date: '28 Apr 2025', time: '11:20', account: 'Savings Account', method: 'M-Pesa', amount: 3000, status: 'confirmed', reference: 'MPESA-2025-004' },
    { id: '005', date: '20 Apr 2025', time: '08:00', account: 'Education Fund', method: 'Airtel', amount: 5000, status: 'failed', reference: 'AIRTEL-2025-005' },
    { id: '006', date: '15 Apr 2025', time: '13:10', account: 'Share Capital', method: 'M-Pesa', amount: 15000, status: 'confirmed', reference: 'MPESA-2025-006' },
    { id: '007', date: '08 Apr 2025', time: '17:30', account: 'Savings Account', method: 'Card', amount: 7000, status: 'confirmed', reference: 'CARD-2025-007' },
    { id: '008', date: '01 Apr 2025', time: '10:00', account: 'Emergency Fund', method: 'Bank', amount: 20000, status: 'confirmed', reference: 'BANK-2025-008' },
    { id: '009', date: '25 Mar 2025', time: '15:45', account: 'Education Fund', method: 'M-Pesa', amount: 4000, status: 'confirmed', reference: 'MPESA-2025-009' },
    { id: '010', date: '18 Mar 2025', time: '12:00', account: 'Savings Account', method: 'Card', amount: 12000, status: 'confirmed', reference: 'CARD-2025-010' },
    { id: '011', date: '10 Mar 2025', time: '09:30', account: 'Share Capital', method: 'M-Pesa', amount: 8000, status: 'pending', reference: 'MPESA-2025-011' },
    { id: '012', date: '05 Mar 2025', time: '14:15', account: 'Emergency Fund', method: 'Airtel', amount: 6000, status: 'confirmed', reference: 'AIRTEL-2025-012' },
    { id: '013', date: '28 Feb 2025', time: '11:00', account: 'Savings Account', method: 'Bank', amount: 15000, status: 'confirmed', reference: 'BANK-2025-013' },
    { id: '014', date: '20 Feb 2025', time: '16:20', account: 'Education Fund', method: 'M-Pesa', amount: 3000, status: 'confirmed', reference: 'MPESA-2025-014' },
    { id: '015', date: '15 Feb 2025', time: '08:45', account: 'Share Capital', method: 'Card', amount: 10000, status: 'failed', reference: 'CARD-2025-015' },
  ];

  filteredRows: DepositRow[] = [];
  filterAccount = '';
  filterStatus = '';

  currentPage = 1;
  pageSize = 5;

  modals: ModalState = {
    depositMethod: false, mpesaPush: false, cardPayment: false,
    bankTransfer: false, confirmedDetail: false, pendingDetail: false,
    failedDetail: false, autoDeposit: false, export: false,
    monthDetail: false, yearDetail: false, trendsAnalysis: false,
    monthlyRequirement: false, notifications: false, logout: false
  };

  selectedDeposit: DepositRow | null = null;
  pendingDeposit = { amount: 25000, date: '05 May 2025', method: 'Bank Transfer' };

  mpesaStep = 1;
  mpesaPhone = '';
  countdown = 60;
  countdownInterval: any;

  cardStep = 1;
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  cardName = '';

  bankAmount: number | null = null;
  bankDate = '';
  uploadedFileName = '';

  autoAmount: number | null = null;
  autoFrequency = 'monthly';
  autoDay = 5;
  autoAccount = 'Savings Account';
  autoPhone = '';
  autoSmsNotify = true;
  autoEmailNotify = false;

  exportPeriod = 'thisMonth';
  generatedReference = '';

  notifications: NotificationItem[] = [
    { id: 1, title: 'Deposit Confirmed', message: 'Your deposit of KES 5,000 has been confirmed', time: '2 hours ago', read: false, type: 'deposit' },
    { id: 2, title: 'Pending Verification', message: 'Your bank transfer of KES 25,000 is under review', time: '1 day ago', read: false, type: 'alert' },
    { id: 3, title: 'Monthly Goal Reached', message: 'You have exceeded your monthly contribution target', time: '3 days ago', read: true, type: 'info' }
  ];

  toasts: ToastItem[] = [];
  private toastIdCounter = 0;

  accountBreakdown = [
    { name: 'Savings Account', amount: 65000, percent: 45 },
    { name: 'Share Capital', amount: 45000, percent: 31 },
    { name: 'Emergency Fund', amount: 25000, percent: 17 },
    { name: 'Education Fund', amount: 10000, percent: 7 }
  ];

  monthMethods = [
    { name: 'M-Pesa', amount: 12000, percent: 48 },
    { name: 'Card', amount: 8000, percent: 32 },
    { name: 'Bank', amount: 5000, percent: 20 }
  ];

  yearMonths = [
    { name: 'Jan', amount: 12000, percent: 40 },
    { name: 'Feb', amount: 15000, percent: 50 },
    { name: 'Mar', amount: 10000, percent: 33 },
    { name: 'Apr', amount: 18000, percent: 60 },
    { name: 'May', amount: 25000, percent: 83 }
  ];

  methodBreakdown = [
    { name: 'M-Pesa', percent: 55 },
    { name: 'Card Payment', percent: 30 },
    { name: 'Bank Transfer', percent: 12 },
    { name: 'Airtel Money', percent: 3 }
  ];

  get anyModalOpen(): boolean {
    return Object.values(this.modals).some(v => v);
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get paginatedRows(): DepositRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRows.length / this.pageSize) || 1;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredRows.length);
  }

  ngOnInit(): void {
    this.filteredRows = [...this.allRows];
    this.generateReference();
    this.remainingRequired = Math.max(0, this.requiredMonthly - this.monthTotal);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.drawTrendChart();
      this.drawHeroChart();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  openModal(key: keyof ModalState): void {
    this.modals[key] = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(key: keyof ModalState): void {
    this.modals[key] = false;
    if (!this.anyModalOpen) {
      document.body.style.overflow = '';
    }
  }

  closeAllModals(): void {
    (Object.keys(this.modals) as Array<keyof ModalState>).forEach(k => this.modals[k] = false);
    document.body.style.overflow = '';
  }

  openDetailModal(row: DepositRow): void {
    this.selectedDeposit = row;
    if (row.status === 'confirmed') {
      this.openModal('confirmedDetail');
    } else if (row.status === 'pending') {
      this.openModal('pendingDetail');
    } else {
      this.openModal('failedDetail');
    }
  }

  selectMethod(method: string): void {
    this.showToast(`Selected ${method}`, 'info');
  }

  proceedDeposit(): void {
    if (!this.depositAmount) {
      this.showToast('Please enter an amount', 'warning');
      return;
    }
    this.showToast('Select a payment method to continue', 'info');
  }

  // M-Pesa Wizard
  startMpesaPush(): void {
    if (!this.mpesaPhone || this.mpesaPhone.length < 10) {
      this.showToast('Please enter a valid phone number', 'warning');
      return;
    }
    this.mpesaStep = 2;
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.mpesaStep = 3;
        this.showToast('M-Pesa deposit confirmed!', 'success');
      }
    }, 1000);
  }

  cancelMpesa(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.resetMpesaWizard();
    this.closeModal('mpesaPush');
    this.showToast('M-Pesa request cancelled', 'info');
  }

  resetMpesaWizard(): void {
    this.mpesaStep = 1;
    this.mpesaPhone = '';
    this.countdown = 60;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  // Card Wizard
  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
    const parts = value.match(/.{1,4}/g);
    input.value = parts ? parts.join(' ') : value;
    this.cardNumber = input.value;
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
    this.cardExpiry = value;
  }

  isCardValid(): boolean {
    return !!this.cardNumber && this.cardNumber.replace(/\s/g, '').length >= 13 &&
           !!this.cardExpiry && this.cardExpiry.length === 5 &&
           !!this.cardCvv && this.cardCvv.length >= 3 &&
           !!this.cardName;
  }

  processCardPayment(): void {
    this.cardStep = 2;
    setTimeout(() => {
      this.cardStep = 3;
      this.showToast('Card payment successful!', 'success');
    }, 2500);
  }

  resetCardWizard(): void {
    this.cardStep = 1;
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.cardName = '';
  }

  // Bank Transfer
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Copied to clipboard', 'success');
    }).catch(() => {
      this.showToast('Failed to copy', 'error');
    });
  }

  triggerFileUpload(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadedFileName = input.files[0].name;
      this.showToast(`File selected: ${input.files[0].name}`, 'info');
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files[0]) {
      this.uploadedFileName = event.dataTransfer.files[0].name;
      this.showToast(`File dropped: ${event.dataTransfer.files[0].name}`, 'info');
    }
  }

  submitBankTransfer(): void {
    this.showToast('Bank transfer submitted for verification', 'success');
    this.closeModal('bankTransfer');
    this.bankAmount = null;
    this.bankDate = '';
    this.uploadedFileName = '';
  }

  // Auto-Deposit
  saveAutoDeposit(): void {
    this.showToast('Auto-deposit setup saved successfully', 'success');
    this.closeModal('autoDeposit');
  }

  // Export
  exportData(format: string): void {
    this.showToast(`Exporting as ${format.toUpperCase()}...`, 'info');
    setTimeout(() => {
      this.showToast(`Export complete: deposits_${this.exportPeriod}.${format}`, 'success');
      this.closeModal('export');
    }, 1500);
  }

  // Notifications
  markRead(id: number): void {
    const n = this.notifications.find(x => x.id === id);
    if (n) {
      n.read = true;
    }
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.showToast('All notifications marked as read', 'info');
  }

  // Table
  applyFilters(): void {
    this.filteredRows = this.allRows.filter(row => {
      const matchAccount = !this.filterAccount || row.account === this.filterAccount;
      const matchStatus = !this.filterStatus || row.status === this.filterStatus;
      return matchAccount && matchStatus;
    });
    this.currentPage = 1;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  // Chart
  setChartTab(tab: string): void {
    this.activeChartTab = tab;
    setTimeout(() => this.drawTrendChart(), 50);
  }

  drawTrendChart(): void {
    const canvas = this.trendCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    const data = this.chartData[this.activeChartTab];
    const maxVal = Math.max(...data.data, ...data.target) * 1.1;
    const barW = (cw / data.labels.length) * 0.35;
    const gap = (cw / data.labels.length) * 0.3;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ch / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxVal - (maxVal / 4) * i).toString(), pad.left - 8, y + 3);
    }

    // Bars
    data.labels.forEach((label, i) => {
      const x = pad.left + (cw / data.labels.length) * i + gap / 2;
      const barH1 = (data.data[i] / maxVal) * ch;
      const barH2 = (data.target[i] / maxVal) * ch;

      // Deposit bar
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(x, pad.top + ch - barH1, barW, barH1);

      // Target bar
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(x + barW + 4, pad.top + ch - barH2, barW, barH2);

      // Label
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + barW, h - 10);
    });
  }

  drawHeroChart(): void {
    const canvas = this.heroCanvas?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const data = [8000, 12000, 15000, 10000, 18000, 25000];
    const max = Math.max(...data) * 1.2;

    ctx.clearRect(0, 0, w, h);

    // Sparkline
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    data.forEach((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - (val / max) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill area
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fill();
  }

  // Receipt & Issue
  downloadReceipt(): void {
    this.showToast('Receipt downloaded', 'success');
  }

  reportIssue(): void {
    this.showToast('Issue reported. Support will contact you.', 'info');
  }

  retryDeposit(): void {
    this.closeModal('failedDetail');
    this.openModal('depositMethod');
  }

  confirmLogout(): void {
    this.showToast('Logged out successfully', 'info');
    this.closeModal('logout');
  }

  generateReference(): void {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.generatedReference = `MEM-${y}-${m}${d}-${r}`;
  }

  // Toast System
  showToast(message: string, type: ToastItem['type'] = 'info'): void {
    const id = ++this.toastIdCounter;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.removeToast(id), 5000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getToastIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '&#10003;',
      error: '&#10007;',
      warning: '&#9888;',
      info: '&#8505;'
    };
    return icons[type] || icons['info'];
  }
}