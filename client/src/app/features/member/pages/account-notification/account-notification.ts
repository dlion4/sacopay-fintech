import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Priority = 'low' | 'normal' | 'medium' | 'high';
type Category =
  | 'agm'
  | 'loan'
  | 'security'
  | 'dividends'
  | 'repayment'
  | 'system'
  | 'otp'
  | 'saccopay'
  | 'alerts';
type FilterKey = 'all' | 'unread' | 'high' | 'archived' | Category;
type ComposeMode = 'new' | 'reply' | 'forward';

interface AttachmentItem {
  name: string;
  content: string;
}

interface SpotlightLine {
  label: string;
  value: string;
}

interface NotificationItem {
  id: string;
  title: string;
  preview: string;
  sender: string;
  priority: Priority;
  category: Category;
  categoryLabel: string;
  date: string;
  dateShort: string;
  reference: string;
  unread: boolean;
  archived: boolean;
  salutation: string;
  paragraphs: string[];
  spotlightTitle?: string;
  spotlightLines?: SpotlightLine[];
  signOff: string;
  attachments: AttachmentItem[];
}

interface ToastState {
  title: string;
  message: string;
}

interface PreferenceItem {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}

interface PreferenceGroup {
  title: string;
  icon: string;
  items: PreferenceItem[];
}

interface FilterItem {
  key: FilterKey;
  label: string;
  icon: string;
}

interface AdditionalTypeCard {
  title: string;
  description: string;
  preferenceKey: keyof NotificationPreferences;
  category: Category;
  accentClass: string;
  iconClass: string;
  icon: string;
}

interface ChannelStat {
  label: string;
  value: number;
  className: string;
}

interface NotificationPreferences {
  emailLoanUpdates: boolean;
  emailAgmEvents: boolean;
  emailDividendDeclarations: boolean;
  emailSystemAlerts: boolean;
  smsTransactionAlerts: boolean;
  smsSecurityAlerts: boolean;
  smsPaymentReminders: boolean;
  inAppAllNotifications: boolean;
  inAppOtpRequests: boolean;
  inAppSaccopayAlerts: boolean;
  inAppSystemNotifications: boolean;
  otherFraudAlerts: boolean;
  otherComplianceNotices: boolean;
  otherServiceOutages: boolean;
}

interface ComposeForm {
  to: string;
  subject: string;
  priority: Priority;
  category: Category;
  message: string;
  attachmentName: string;
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account-notification.html',
  styleUrls: ['./account-notification.scss'],
})
export class NotificationComponent implements OnDestroy {
  private toastTimer?: number;

  readonly categoryMeta: Record<
    Category,
    { label: string; detailLabel: string; badgeClass: string; iconClass: string }
  > = {
    agm: {
      label: 'AGM',
      detailLabel: 'Annual General Meeting',
      badgeClass: 'category-badge-agm',
      iconClass: 'category-icon-agm',
    },
    loan: {
      label: 'Loan',
      detailLabel: 'Loan Services',
      badgeClass: 'category-badge-loan',
      iconClass: 'category-icon-loan',
    },
    security: {
      label: 'Security',
      detailLabel: 'Security Alert',
      badgeClass: 'category-badge-security',
      iconClass: 'category-icon-security',
    },
    dividends: {
      label: 'Dividend',
      detailLabel: 'Dividend Declaration',
      badgeClass: 'category-badge-dividends',
      iconClass: 'category-icon-dividends',
    },
    repayment: {
      label: 'Repayment',
      detailLabel: 'Loan Repayment',
      badgeClass: 'category-badge-repayment',
      iconClass: 'category-icon-repayment',
    },
    system: {
      label: 'System',
      detailLabel: 'System Notification',
      badgeClass: 'category-badge-system',
      iconClass: 'category-icon-system',
    },
    otp: {
      label: 'OTP',
      detailLabel: 'OTP Request',
      badgeClass: 'category-badge-otp',
      iconClass: 'category-icon-otp',
    },
    saccopay: {
      label: 'SaccoPay',
      detailLabel: 'SaccoPay Alert',
      badgeClass: 'category-badge-saccopay',
      iconClass: 'category-icon-saccopay',
    },
    alerts: {
      label: 'Alerts',
      detailLabel: 'Account Alert',
      badgeClass: 'category-badge-alerts',
      iconClass: 'category-icon-alerts',
    },
  };

  readonly priorityMeta: Record<
    Priority,
    { label: string; shortLabel: string; className: string }
  > = {
    low: {
      label: 'Low Priority',
      shortLabel: 'LOW',
      className: 'priority-low',
    },
    normal: {
      label: 'Normal Priority',
      shortLabel: 'NORMAL',
      className: 'priority-normal',
    },
    medium: {
      label: 'Medium Priority',
      shortLabel: 'MED',
      className: 'priority-medium',
    },
    high: {
      label: 'High Priority',
      shortLabel: 'HIGH',
      className: 'priority-high',
    },
  };

  readonly topFilters: FilterItem[] = [
    { key: 'all', label: 'All', icon: 'bell' },
    { key: 'unread', label: 'Unread', icon: 'mail' },
    { key: 'high', label: 'High Priority', icon: 'alert' },
    { key: 'agm', label: 'AGM', icon: 'megaphone' },
    { key: 'loan', label: 'Loan', icon: 'banknote' },
    { key: 'security', label: 'Security', icon: 'shield' },
    { key: 'system', label: 'System', icon: 'cog' },
    { key: 'otp', label: 'OTP Requests', icon: 'phone' },
    { key: 'saccopay', label: 'SaccoPay Alerts', icon: 'wallet' },
    { key: 'alerts', label: 'Alerts', icon: 'alert' },
    { key: 'archived', label: 'Archived', icon: 'archive' },
  ];

  readonly composeRecipients = [
    'Sacco Management Board',
    'Customer Care',
    'Loans Desk',
    'Compliance Office',
    'Security Desk',
  ];

  readonly composeCategories: Array<{ value: Category; label: string }> = [
    { value: 'agm', label: 'Annual General Meeting' },
    { value: 'loan', label: 'Loan Services' },
    { value: 'security', label: 'Security Alert' },
    { value: 'dividends', label: 'Dividend Declaration' },
    { value: 'repayment', label: 'Loan Repayment' },
    { value: 'system', label: 'System Notification' },
    { value: 'otp', label: 'OTP Request' },
    { value: 'saccopay', label: 'SaccoPay Alert' },
    { value: 'alerts', label: 'Account Alert' },
  ];

  readonly preferenceGroups: PreferenceGroup[] = [
    {
      title: 'Email Notifications',
      icon: 'mail',
      items: [
        {
          key: 'emailLoanUpdates',
          label: 'Loan Updates',
          description: 'Approval, disbursement and repayment reminders',
        },
        {
          key: 'emailAgmEvents',
          label: 'AGM & Events',
          description: 'Meeting notices and event invitations',
        },
        {
          key: 'emailDividendDeclarations',
          label: 'Dividend Declarations',
          description: 'Dividend and share updates',
        },
        {
          key: 'emailSystemAlerts',
          label: 'System Alerts',
          description: 'Maintenance, security and portal updates',
        },
      ],
    },
    {
      title: 'SMS Notifications',
      icon: 'phone',
      items: [
        {
          key: 'smsTransactionAlerts',
          label: 'Transaction Alerts',
          description: 'Deposits, withdrawals and wallet payments',
        },
        {
          key: 'smsSecurityAlerts',
          label: 'Security Alerts',
          description: 'Login tips, OTPs and password changes',
        },
        {
          key: 'smsPaymentReminders',
          label: 'Payment Reminders',
          description: 'Upcoming loan repayment reminders',
        },
      ],
    },
    {
      title: 'In-App Notifications',
      icon: 'bell',
      items: [
        {
          key: 'inAppAllNotifications',
          label: 'All Notifications',
          description: 'Show all portal notifications in your inbox',
        },
        {
          key: 'inAppOtpRequests',
          label: 'OTP Requests',
          description: 'One-time passcode requests and approval prompts',
        },
        {
          key: 'inAppSaccopayAlerts',
          label: 'SaccoPay Alerts',
          description: 'Wallet, QR and merchant payment notices',
        },
        {
          key: 'inAppSystemNotifications',
          label: 'System Notifications',
          description: 'Maintenance, feature changes and release notices',
        },
      ],
    },
    {
      title: 'Additional Notifications',
      icon: 'alert',
      items: [
        {
          key: 'otherFraudAlerts',
          label: 'Fraud Alerts',
          description: 'Suspicious access, unusual device or transfer behavior',
        },
        {
          key: 'otherComplianceNotices',
          label: 'Compliance Notices',
          description: 'KYC updates, policy reminders and legal notices',
        },
        {
          key: 'otherServiceOutages',
          label: 'Service Outages',
          description: 'Emergency downtime and service disruption notices',
        },
      ],
    },
  ];

  readonly additionalCards: AdditionalTypeCard[] = [
    {
      title: 'OTP Requests',
      description:
        'Approve or review verification prompts and transfer confirmations without missing important security actions.',
      preferenceKey: 'inAppOtpRequests',
      category: 'otp',
      accentClass: 'type-card-indigo',
      iconClass: 'type-icon-indigo',
      icon: 'phone',
    },
    {
      title: 'SaccoPay Alerts',
      description:
        'Track wallet movement, merchant payments, QR checkouts and real-time balance updates from one clean section.',
      preferenceKey: 'inAppSaccopayAlerts',
      category: 'saccopay',
      accentClass: 'type-card-emerald',
      iconClass: 'type-icon-emerald',
      icon: 'wallet',
    },
    {
      title: 'System Notifications',
      description:
        'Stay updated on releases, maintenance windows, feature changes and platform-wide optimization notices.',
      preferenceKey: 'inAppSystemNotifications',
      category: 'system',
      accentClass: 'type-card-violet',
      iconClass: 'type-icon-violet',
      icon: 'cog',
    },
    {
      title: 'Alerts & Notices',
      description:
        'Receive compliance notices, balance thresholds and account attention items without mobile layouts getting cramped.',
      preferenceKey: 'otherComplianceNotices',
      category: 'alerts',
      accentClass: 'type-card-amber',
      iconClass: 'type-icon-amber',
      icon: 'alert',
    },
  ];

  readonly channelStats: ChannelStat[] = [
    { label: 'Email', value: 78, className: 'channel-email' },
    { label: 'SMS', value: 64, className: 'channel-sms' },
    { label: 'In-App', value: 92, className: 'channel-inapp' },
  ];

  preferences: NotificationPreferences = {
    emailLoanUpdates: true,
    emailAgmEvents: true,
    emailDividendDeclarations: true,
    emailSystemAlerts: false,
    smsTransactionAlerts: true,
    smsSecurityAlerts: true,
    smsPaymentReminders: true,
    inAppAllNotifications: true,
    inAppOtpRequests: true,
    inAppSaccopayAlerts: true,
    inAppSystemNotifications: true,
    otherFraudAlerts: true,
    otherComplianceNotices: true,
    otherServiceOutages: false,
  };

  notifications: NotificationItem[] = [
    {
      id: 'agm-2026',
      title: 'AGM Notice — Annual General Meeting 2026',
      preview:
        'You are invited to attend the Annual General Meeting scheduled for Saturday, 24th May 2026.',
      sender: 'Sacco Management Board',
      priority: 'high',
      category: 'agm',
      categoryLabel: 'Annual General Meeting',
      date: 'May 10, 2026 at 09:30 AM',
      dateShort: 'May 10, 2026 · 09:30 AM',
      reference: 'AGM-2026-001',
      unread: true,
      archived: false,
      salutation: 'Dear Valued Member,',
      paragraphs: [
        'We are pleased to invite you to our Annual General Meeting scheduled as follows:',
        'Attendance is mandatory for all active members. Please confirm your attendance through this portal by May 20th, 2026.',
      ],
      spotlightTitle: 'Meeting Schedule',
      spotlightLines: [
        { label: 'Date', value: 'Saturday, 24th May 2026' },
        { label: 'Time', value: '10:00 AM – 2:00 PM EAT' },
        { label: 'Venue', value: 'Sarova Stanley Hotel, Nairobi' },
        {
          label: 'Agenda',
          value: 'Financial Review, Dividend Declaration, Board Elections, Bylaw Amendments',
        },
      ],
      signOff: 'Sacco Management Committee',
      attachments: [
        {
          name: 'AGM-Agenda-2026.pdf',
          content:
            'AGM Agenda 2026\n1. Financial Review\n2. Dividend Declaration\n3. Board Elections\n4. Bylaw Amendments',
        },
        {
          name: 'Board-Resolutions-2026.xlsx',
          content:
            'Resolution,Owner,Status\nDividend Proposal,Board,Pending Vote\nBylaw Review,Legal,Open',
        },
      ],
    },
    {
      id: 'loan-approved',
      title: 'Loan Application Approved',
      preview:
        'Your Emergency Loan of KES 50,000 has been approved and is ready for disbursement.',
      sender: 'Loans Desk',
      priority: 'medium',
      category: 'loan',
      categoryLabel: 'Loan Approval',
      date: 'May 9, 2026 at 02:15 PM',
      dateShort: 'May 9, 2026 · 02:15 PM',
      reference: 'LNS-APP-5091',
      unread: true,
      archived: false,
      salutation: 'Hello James,',
      paragraphs: [
        'We are happy to inform you that your Emergency Loan request has been approved after review.',
        'Kindly review the approval advice and confirm your preferred disbursement account to complete processing.',
      ],
      spotlightTitle: 'Approval Summary',
      spotlightLines: [
        { label: 'Amount', value: 'KES 50,000' },
        { label: 'Tenure', value: '12 months' },
        { label: 'Monthly Installment', value: 'KES 4,860' },
        { label: 'Disbursement', value: 'Sacco Savings Account' },
      ],
      signOff: 'Loans Operations Team',
      attachments: [
        {
          name: 'Loan-Approval-Advice.pdf',
          content:
            'Loan Approval Advice\nApplicant: James Kamau\nProduct: Emergency Loan\nApproved Amount: KES 50,000\nTenure: 12 months',
        },
      ],
    },
    {
      id: 'security-login',
      title: 'Security Alert — New Login Detected',
      preview:
        'A login was detected from a new browser on May 8, 2026. Review this activity if it was not you.',
      sender: 'Security Desk',
      priority: 'high',
      category: 'security',
      categoryLabel: 'Security Alert',
      date: 'May 8, 2026 at 11:45 PM',
      dateShort: 'May 8, 2026 · 11:45 PM',
      reference: 'SEC-LOGIN-8840',
      unread: true,
      archived: false,
      salutation: 'Attention Member,',
      paragraphs: [
        'A new login attempt was recorded on your account from a previously unseen browser profile.',
        'If this activity was not initiated by you, we recommend changing your password immediately and enabling additional device verification.',
      ],
      spotlightTitle: 'Access Details',
      spotlightLines: [
        { label: 'Device', value: 'Firefox on Windows' },
        { label: 'Location', value: 'Nairobi, Kenya' },
        { label: 'IP Address', value: '196.201.214.11' },
        { label: 'Status', value: 'Verified after OTP confirmation' },
      ],
      signOff: 'SaccoPay Security Team',
      attachments: [],
    },
    {
      id: 'dividend-declaration',
      title: 'Dividend Declaration — FY 2025',
      preview:
        'The Board has declared a 12.5% dividend for eligible share capital for the 2025 financial year.',
      sender: 'Finance Office',
      priority: 'low',
      category: 'dividends',
      categoryLabel: 'Dividend Declaration',
      date: 'May 7, 2026 at 08:00 AM',
      dateShort: 'May 7, 2026 · 08:00 AM',
      reference: 'DIV-2025-125',
      unread: false,
      archived: false,
      salutation: 'Dear Member,',
      paragraphs: [
        'Following the annual financial review, the Board has approved the declaration of dividends for the 2025 financial year.',
        'Your expected dividend credit will be reflected in your chosen payout channel once the AGM ratifies the final schedule.',
      ],
      spotlightTitle: 'Dividend Snapshot',
      spotlightLines: [
        { label: 'Declared Rate', value: '12.5%' },
        { label: 'Estimated Credit Date', value: 'June 3, 2026' },
        { label: 'Payout Channel', value: 'Savings Account' },
        { label: 'Tax Handling', value: 'Withholding tax applied where required' },
      ],
      signOff: 'Finance & Returns Team',
      attachments: [
        {
          name: 'Dividend-Schedule-FY2025.pdf',
          content:
            'Dividend Schedule FY2025\nDeclared Rate: 12.5%\nCredit Window: 1st - 3rd June 2026',
        },
      ],
    },
    {
      id: 'repayment-reminder',
      title: 'Loan Repayment Due in 5 Days',
      preview:
        'Your Emergency Loan installment is due on May 12, 2026. Plan your account funding in advance.',
      sender: 'Loan Repayment Desk',
      priority: 'medium',
      category: 'repayment',
      categoryLabel: 'Repayment Reminder',
      date: 'May 7, 2026 at 06:00 AM',
      dateShort: 'May 7, 2026 · 06:00 AM',
      reference: 'LNS-RMD-1205',
      unread: true,
      archived: false,
      salutation: 'Dear James,',
      paragraphs: [
        'This is a courtesy reminder that your next Emergency Loan repayment installment will fall due in five days.',
        'Ensure your wallet or savings account has sufficient balance before the due date to avoid penalty charges and service interruption.',
      ],
      spotlightTitle: 'Upcoming Installment',
      spotlightLines: [
        { label: 'Due Date', value: 'May 12, 2026' },
        { label: 'Installment', value: 'KES 4,860' },
        { label: 'Preferred Debit', value: 'Sacco Wallet' },
        { label: 'Penalty', value: '2% late payment charge after due date' },
      ],
      signOff: 'Loan Repayment Support',
      attachments: [],
    },
    {
      id: 'system-maintenance',
      title: 'Scheduled System Maintenance',
      preview:
        'The portal will be offline on May 9, 2026 between 10:00 PM and 11:30 PM for service optimization.',
      sender: 'Platform Operations',
      priority: 'low',
      category: 'system',
      categoryLabel: 'Maintenance Notice',
      date: 'May 6, 2026 at 04:00 PM',
      dateShort: 'May 6, 2026 · 04:00 PM',
      reference: 'SYS-MNT-7732',
      unread: false,
      archived: false,
      salutation: 'Dear Member,',
      paragraphs: [
        'We will be carrying out planned maintenance on the member portal to improve reliability and transaction speed.',
        'During this period, wallet transfers, account statements and self-service requests may be temporarily unavailable.',
      ],
      spotlightTitle: 'Maintenance Window',
      spotlightLines: [
        { label: 'Start', value: 'May 9, 2026 · 10:00 PM' },
        { label: 'End', value: 'May 9, 2026 · 11:30 PM' },
        { label: 'Affected Services', value: 'Wallet, statements, self-service forms' },
        { label: 'Support', value: 'Members can still call support during maintenance' },
      ],
      signOff: 'SaccoPay Platform Operations',
      attachments: [
        {
          name: 'Maintenance-Impact-Notice.txt',
          content:
            'Maintenance Impact Notice\nAffected modules: Wallet, Statements, Quick Entry, Transfers',
        },
      ],
    },
    {
      id: 'otp-request',
      title: 'OTP Request for Wallet Transfer',
      preview:
        'A one-time passcode was generated for a wallet transfer request. Review before authorizing.',
      sender: 'Verification Service',
      priority: 'normal',
      category: 'otp',
      categoryLabel: 'OTP Request',
      date: 'May 6, 2026 at 10:18 AM',
      dateShort: 'May 6, 2026 · 10:18 AM',
      reference: 'OTP-REQ-4518',
      unread: true,
      archived: false,
      salutation: 'Hi James,',
      paragraphs: [
        'A request to authorize a Sacco Wallet transfer was initiated on your account and an OTP has been generated for confirmation.',
        'If you did not trigger this request, please ignore the code and review your account security immediately.',
      ],
      spotlightTitle: 'Request Details',
      spotlightLines: [
        { label: 'OTP CODE', value: '123 456' },
        { label: 'Destination', value: 'Member ID: MSCP-1234' },
        { label: 'OTP Expiry', value: '15 minutes' },
        { label: 'Verification Channel', value: 'SMS and In-App' },
      ],
      signOff: 'Verification Services',
      attachments: [],
    },
    {
      id: 'saccopay-wallet',
      title: 'SaccoPay Alert — Merchant Payment Successful',
      preview:
        'Your wallet payment of KES 1,250 at GreenMart Supermarket was completed successfully.',
      sender: 'SaccoPay Wallet',
      priority: 'normal',
      category: 'saccopay',
      categoryLabel: 'SaccoPay Payment Alert',
      date: 'May 5, 2026 at 08:14 PM',
      dateShort: 'May 5, 2026 · 08:14 PM',
      reference: 'SPY-PAY-1285',
      unread: false,
      archived: false,
      salutation: 'Hello James,',
      paragraphs: [
        'Your recent merchant payment has been successfully processed using your SaccoPay wallet.',
        'You can review this transaction in the wallet ledger or download the confirmation slip below for your records.',
      ],
      spotlightTitle: 'Transaction Summary',
      spotlightLines: [
        { label: 'Merchant', value: 'GreenMart Supermarket' },
        { label: 'Amount', value: 'KES 1,250' },
        { label: 'Balance After Payment', value: 'KES 13,480' },
        { label: 'Reference', value: 'SPY-048512-98' },
      ],
      signOff: 'SaccoPay Wallet Services',
      attachments: [
        {
          name: 'Payment-Receipt-SPY-048512-98.txt',
          content:
            'Merchant Payment Receipt\nMerchant: GreenMart Supermarket\nAmount: KES 1,250\nReference: SPY-048512-98',
        },
      ],
    },
    {
      id: 'balance-alert',
      title: 'Account Alert — Savings Balance Below Threshold',
      preview:
        'Your savings balance has dropped below the recommended minimum operating threshold for this month.',
      sender: 'Member Accounts',
      priority: 'high',
      category: 'alerts',
      categoryLabel: 'Savings Alert',
      date: 'May 5, 2026 at 09:20 AM',
      dateShort: 'May 5, 2026 · 09:20 AM',
      reference: 'ALR-SAV-0021',
      unread: false,
      archived: false,
      salutation: 'Dear James,',
      paragraphs: [
        'We have detected that your regular savings balance is now below the minimum advisory threshold set for active members.',
        'Please top up your account to remain eligible for uninterrupted access to member products and return projections.',
      ],
      spotlightTitle: 'Balance Position',
      spotlightLines: [
        { label: 'Current Savings', value: 'KES 1,850' },
        { label: 'Recommended Minimum', value: 'KES 3,000' },
        { label: 'Top-up Needed', value: 'KES 1,150' },
        { label: 'Action Window', value: 'Before May 15, 2026' },
      ],
      signOff: 'Member Accounts Office',
      attachments: [],
    },
    {
      id: 'password-changed',
      title: 'Password Changed Successfully',
      preview:
        'Your account password was changed successfully. No further action is needed if this was you.',
      sender: 'Security Desk',
      priority: 'low',
      category: 'security',
      categoryLabel: 'Password Change Confirmation',
      date: 'May 5, 2026 at 03:10 PM',
      dateShort: 'May 5, 2026 · 03:10 PM',
      reference: 'SEC-PWD-2203',
      unread: false,
      archived: false,
      salutation: 'Hello James,',
      paragraphs: [
        'This message confirms that the password associated with your profile has been updated successfully.',
        'If you did not make this change, please contact support urgently so that we can secure your account.',
      ],
      spotlightTitle: 'Change Confirmation',
      spotlightLines: [
        { label: 'Updated On', value: 'May 5, 2026 · 03:09 PM' },
        { label: 'Method', value: 'Profile Security Settings' },
        { label: 'Second Factor', value: 'OTP Verified' },
        { label: 'Support Line', value: '+254 700 456 789' },
      ],
      signOff: 'SaccoPay Security Team',
      attachments: [],
    },
    {
      id: 'system-update',
      title: 'System Update — New Self-Service Features',
      preview:
        'SaccoPay v6.2 introduces cleaner statement exports, faster requests and improved mobile layouts.',
      sender: 'Product Updates',
      priority: 'low',
      category: 'system',
      categoryLabel: 'Feature Update',
      date: 'May 4, 2026 at 01:40 PM',
      dateShort: 'May 4, 2026 · 01:40 PM',
      reference: 'SYS-UPD-6200',
      unread: false,
      archived: false,
      salutation: 'Dear Member,',
      paragraphs: [
        'We have released a fresh update focused on improving mobile responsiveness, account visibility and notification handling.',
        'You will now notice cleaner tables, stronger alignment in cards and quicker access to message actions across small devices.',
      ],
      spotlightTitle: 'What’s New',
      spotlightLines: [
        { label: 'Statements', value: 'Cleaner export formatting' },
        { label: 'Notifications', value: 'Better preferences and category filtering' },
        { label: 'Mobile UI', value: 'Improved spacing, wrapping and card alignment' },
        { label: 'Performance', value: 'Faster portal load and quicker tab switching' },
      ],
      signOff: 'SaccoPay Product Team',
      attachments: [
        {
          name: 'Release-Notes-v6.2.txt',
          content:
            'SaccoPay v6.2 Release Notes\n- Better mobile cards\n- Improved notification filters\n- Faster self-service actions',
        },
      ],
    },
    {
      id: 'kyc-reminder',
      title: 'Compliance Reminder — Update KYC Details',
      preview:
        'Please review your identification and next-of-kin records before May 30, 2026 to remain compliant.',
      sender: 'Compliance Office',
      priority: 'medium',
      category: 'alerts',
      categoryLabel: 'Compliance Notice',
      date: 'May 3, 2026 at 07:30 AM',
      dateShort: 'May 3, 2026 · 07:30 AM',
      reference: 'CMP-KYC-2026',
      unread: false,
      archived: false,
      salutation: 'Dear Member,',
      paragraphs: [
        'As part of ongoing regulatory compliance, all members are requested to review and update their KYC information where necessary.',
        'Please ensure your ID copy, address and next-of-kin details remain accurate to avoid delays in processing services.',
      ],
      spotlightTitle: 'Required Review',
      spotlightLines: [
        { label: 'Deadline', value: 'May 30, 2026' },
        { label: 'Items to Confirm', value: 'ID, phone, address, next of kin' },
        { label: 'Where to Update', value: 'Member profile and account settings' },
        { label: 'Support', value: 'Visit branch or contact compliance desk' },
      ],
      signOff: 'Compliance Office',
      attachments: [
        {
          name: 'KYC-Checklist-2026.pdf',
          content:
            'KYC Checklist 2026\n1. Confirm ID number\n2. Confirm phone number\n3. Confirm next of kin\n4. Submit updates',
        },
      ],
    },
    {
      id: 'statement-archived',
      title: 'Archived — January Statement Ready',
      preview:
        'Your January member statement is available for download in the statements section.',
      sender: 'Statements Service',
      priority: 'normal',
      category: 'alerts',
      categoryLabel: 'Statement Notice',
      date: 'April 28, 2026 at 10:00 AM',
      dateShort: 'Apr 28, 2026 · 10:00 AM',
      reference: 'STM-2026-01',
      unread: false,
      archived: true,
      salutation: 'Dear James,',
      paragraphs: [
        'Your monthly member statement for January 2026 was successfully generated and stored in your statements archive.',
        'You may re-download it at any time for personal records, loan reconciliation or audit purposes.',
      ],
      spotlightTitle: 'Statement Details',
      spotlightLines: [
        { label: 'Period', value: 'January 1 – January 31, 2026' },
        { label: 'Format', value: 'PDF' },
        { label: 'Archive Status', value: 'Stored in archived notifications' },
        { label: 'Source', value: 'Statements module' },
      ],
      signOff: 'Statements Service',
      attachments: [
        {
          name: 'Statement-January-2026.txt',
          content:
            'January Statement Placeholder\nOpening Balance: KES 18,500\nClosing Balance: KES 21,300',
        },
      ],
    },
    {
      id: 'survey-archived',
      title: 'Archived — Member Experience Survey',
      preview:
        'Thank you for participating in the service quality survey. This message has been archived.',
      sender: 'Member Experience Team',
      priority: 'low',
      category: 'system',
      categoryLabel: 'Survey Follow-up',
      date: 'April 18, 2026 at 05:20 PM',
      dateShort: 'Apr 18, 2026 · 05:20 PM',
      reference: 'SRV-2026-404',
      unread: false,
      archived: true,
      salutation: 'Dear Member,',
      paragraphs: [
        'We appreciate your participation in the recent service quality survey carried out through the portal.',
        'Your responses are helping us improve the overall experience across member dashboards, alerts and transaction pages.',
      ],
      spotlightTitle: 'Survey Summary',
      spotlightLines: [
        { label: 'Survey Type', value: 'Member experience' },
        { label: 'Status', value: 'Closed' },
        { label: 'Reward', value: 'Feedback points credited' },
        { label: 'Stored', value: 'Archived notifications' },
      ],
      signOff: 'Member Experience Team',
      attachments: [],
    },
  ];

  activeFilter: FilterKey = 'all';
  search = '';
  selectedId = this.notifications[0]?.id ?? '';
  preferencesOpen = false;
  composeOpen = false;
  deleteOpen = false;
  composeMode: ComposeMode = 'new';
  toast: ToastState | null = null;
  composeForm: ComposeForm = this.getDefaultComposeForm();

  ngOnDestroy(): void {
    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
    }
  }

  get activeNotifications(): NotificationItem[] {
    return this.notifications.filter((item) => !item.archived);
  }

  get archivedNotifications(): NotificationItem[] {
    return this.notifications.filter((item) => item.archived);
  }

  get totalCount(): number {
    return this.activeNotifications.length;
  }

  get unreadCount(): number {
    return this.activeNotifications.filter((item) => item.unread).length;
  }

  get readCount(): number {
    return this.activeNotifications.filter((item) => !item.unread).length;
  }

  get highCount(): number {
    return this.activeNotifications.filter((item) => item.priority === 'high').length;
  }

  get selectedNotification(): NotificationItem | null {
    return this.notifications.find((item) => item.id === this.selectedId) ?? null;
  }

  get filteredNotifications(): NotificationItem[] {
    const query = this.search.trim().toLowerCase();

    return this.notifications.filter((item) => {
      if (!this.matchesFilter(item, this.activeFilter)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [item.title, item.preview, item.sender, item.reference, item.categoryLabel]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  get composeModeTitle(): string {
    if (this.composeMode === 'reply') {
      return 'Reply to Message';
    }

    if (this.composeMode === 'forward') {
      return 'Forward Message';
    }

    return 'New Message';
  }

  get isComposeValid(): boolean {
    return !!this.composeForm.subject.trim() && !!this.composeForm.message.trim();
  }

  getDefaultComposeForm(): ComposeForm {
    return {
      to: 'Sacco Management Board',
      subject: '',
      priority: 'normal',
      category: 'agm',
      message: '',
      attachmentName: '',
    };
  }

  matchesFilter(item: NotificationItem, filter: FilterKey): boolean {
    if (filter === 'all') {
      return !item.archived;
    }

    if (filter === 'unread') {
      return item.unread && !item.archived;
    }

    if (filter === 'high') {
      return item.priority === 'high' && !item.archived;
    }

    if (filter === 'archived') {
      return item.archived;
    }

    return item.category === filter && !item.archived;
  }

  countForFilter(filter: FilterKey): number {
    return this.notifications.filter((item) => this.matchesFilter(item, filter)).length;
  }

  countByCategory(category: Category): number {
    return this.activeNotifications.filter((item) => item.category === category).length;
  }

  setFilter(filter: FilterKey): void {
    this.activeFilter = filter;
    this.syncSelectedNotification();
  }

  onSearchChange(): void {
    this.syncSelectedNotification();
  }

  selectNotification(id: string): void {
    this.selectedId = id;
  }

  syncSelectedNotification(): void {
    const filtered = this.filteredNotifications;

    if (filtered.some((item) => item.id === this.selectedId)) {
      return;
    }

    this.selectedId = filtered[0]?.id ?? '';
  }

  togglePreference(key: keyof NotificationPreferences): void {
    this.preferences = {
      ...this.preferences,
      [key]: !this.preferences[key],
    };
  }

  markAllRead(): void {
    this.notifications = this.notifications.map((item) =>
      item.archived ? item : { ...item, unread: false },
    );
  }

  toggleRead(): void {
    const selected = this.selectedNotification;
    if (!selected) {
      return;
    }

    this.notifications = this.notifications.map((item) =>
      item.id === selected.id ? { ...item, unread: !item.unread } : item,
    );
  }

  toggleArchive(): void {
    const selected = this.selectedNotification;
    if (!selected) {
      return;
    }

    this.notifications = this.notifications.map((item) =>
      item.id === selected.id ? { ...item, archived: !item.archived } : item,
    );

    if (this.activeFilter !== 'archived' && !selected.archived) {
      this.activeFilter = 'all';
    }

    this.syncSelectedNotification();
  }

  openCompose(mode: ComposeMode): void {
    this.composeMode = mode;
    const selected = this.selectedNotification;

    if (mode === 'new') {
      this.composeForm = this.getDefaultComposeForm();
    }

    if (mode === 'reply' && selected) {
      this.composeForm = {
        to: selected.sender,
        subject: `Re: ${selected.title}`,
        priority: selected.priority === 'high' ? 'high' : 'normal',
        category: selected.category,
        message:
          `Hello,\n\nThank you for your message regarding ${selected.categoryLabel.toLowerCase()}.\n\n`,
        attachmentName: '',
      };
    }

    if (mode === 'forward' && selected) {
      this.composeForm = {
        to: 'Customer Care',
        subject: `Fwd: ${selected.title}`,
        priority: selected.priority,
        category: selected.category,
        message:
          `Please review the notification below and advise.\n\n${selected.title}\nReference: ${selected.reference}\n\n`,
        attachmentName: '',
      };
    }

    this.composeOpen = true;
  }

  closeCompose(): void {
    this.composeOpen = false;
  }

  submitCompose(): void {
    if (!this.isComposeValid) {
      return;
    }

    const newMessage: NotificationItem = {
      id: `msg-${Date.now()}`,
      title: this.composeForm.subject.trim(),
      preview: this.composeForm.message.trim().slice(0, 110),
      sender: 'You',
      priority: this.composeForm.priority,
      category: this.composeForm.category,
      categoryLabel: this.categoryMeta[this.composeForm.category].detailLabel,
      date: 'Just now',
      dateShort: 'Just now',
      reference: `MSG-${Date.now().toString().slice(-6)}`,
      unread: false,
      archived: false,
      salutation: `To ${this.composeForm.to},`,
      paragraphs: this.composeForm.message
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean),
      spotlightTitle: 'Message Details',
      spotlightLines: [
        { label: 'Recipient', value: this.composeForm.to },
        { label: 'Priority', value: this.priorityMeta[this.composeForm.priority].label },
        { label: 'Category', value: this.categoryMeta[this.composeForm.category].detailLabel },
        { label: 'Delivery', value: 'Sent through member notification center' },
      ],
      signOff: 'You',
      attachments: this.composeForm.attachmentName
        ? [
            {
              name: this.composeForm.attachmentName,
              content: `Attachment placeholder for ${this.composeForm.attachmentName}`,
            },
          ]
        : [],
    };

    this.notifications = [newMessage, ...this.notifications];
    this.selectedId = newMessage.id;
    this.activeFilter = 'all';
    this.search = '';
    this.composeOpen = false;
    this.composeForm = this.getDefaultComposeForm();
    this.showToast('Message sent', 'Your message has been added to the notification stream.');
  }

  openDelete(): void {
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
  }

  confirmDelete(): void {
    const selected = this.selectedNotification;
    if (!selected) {
      return;
    }

    this.notifications = this.notifications.filter((item) => item.id !== selected.id);
    this.deleteOpen = false;
    this.syncSelectedNotification();
    this.showToast('Notification deleted', 'The selected notification was removed successfully.');
  }

  savePreferences(): void {
    this.preferencesOpen = false;
    this.showToast('Preferences updated', 'Your notification delivery preferences have been saved.');
  }

  openPreferences(): void {
    this.preferencesOpen = true;
  }

  closePreferences(): void {
    this.preferencesOpen = false;
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.composeForm = {
      ...this.composeForm,
      attachmentName: file?.name ?? '',
    };
  }

  downloadAttachment(file: AttachmentItem): void {
    if (typeof window === 'undefined') {
      return;
    }

    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(file.content)}`;
    link.download = file.name;
    link.click();
  }

  printPage(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  showToast(title: string, message: string): void {
    this.toast = { title, message };

    if (this.toastTimer) {
      window.clearTimeout(this.toastTimer);
    }

    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, 2800);
  }
}
