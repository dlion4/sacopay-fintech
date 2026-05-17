import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/main-layout/main-layout';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
// 1. Added the missing import for MemberLayout
import { MemberLayoutComponent } from './layout/member-layout/member-layout';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
    // --- AUTHENTICATION ROUTES (Uses AuthLayout) ---
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/pages/login/login').then(m => m.LoginComponent),
                title: 'SACCOPay | Secure Login'
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/pages/register/register').then(m => m.RegisterComponent),
                title: 'SACCOPay | Create Account'
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent),
                title: 'SACCOPay | Recover Account'
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },

    // --- MAIN APP ROUTES (Uses MainLayout) ---
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('./features/home/pages/landing/landing').then(m => m.HomeComponent),
                title: 'SACCOPay | Modern Sacco Payment Processor'
            }
        ]
    },

    // --- MEMBER DASHBOARD ROUTES (Uses MemberLayout) ---
    {
        path: 'member',
        component: MemberLayoutComponent,
        children: [
            {
                path: 'dashboard',
                // 2. Ensuring the class name matches what you likely exported (DashboardComponent)
                loadComponent: () => import('./features/member/pages/dashboard/dashboard').then(m => m.MemberDashboardComponent),
                title: 'Member | Dashboard'
            },
            {
                path: 'deposits',
                // 2. Ensuring the class name matches what you likely exported (DashboardComponent)
                loadComponent: () => import('./features/member/pages/deposits/deposits').then(m => m.DepositsComponent),
                title: 'Member | Deposits'
            },
            {
                path: 'wallet',
                loadComponent: () => import('./features/member/pages/wallet/wallet').then(m => m.WalletComponent),
                title: 'Member | Wallet'
            },
            {
                path: 'loans',
                loadComponent: () => import('./features/member/pages/loans/loans').then(m => m.LoansCenterComponent),
                title: 'Member | Loan Center'
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/member/pages/member-profile/member-profile').then(m => m.MemberProfileComponent),
                title: 'Member | Profile'
            },
            {
                path: 'withdrawals',
                loadComponent: () => import('./features/member/pages/withdrawals/withdrawals').then(m => m.FinanceWithdrawalsComponent),
                title: 'Member | Withdrawals'
            },
            {
                path: 'transactions',
                loadComponent: () => import('./features/member/pages/transactions/transactions').then(m => m.TransactionsComponent),
                title: 'Member | Transactions'
            },
            {
                path: 'savings',
                loadComponent: () => import('./features/member/pages/savings/savings').then(m => m.SavingsComponent),
                title: 'Member | Savings'
            },
            {
                path: 'loan-repayments',
                loadComponent: () => import('./features/member/pages/loan-repayment/loan-repayment').then(m => m.LoanRepaymentsComponent),
                title: 'Member | Loan Repayments'
            },
            {
                path: 'statements',
                loadComponent: () => import('./features/member/pages/statements/statements').then(m => m.StatementsComponent),
                title: 'Member | Statements'
            },
            {
                path: 'shares',
                loadComponent: () => import('./features/member/pages/shares/shares').then(m => m.SharesComponent),
                title: 'Member | Shares'
            },
            {
                path: 'guarantor',
                loadComponent: () => import('./features/member/pages/guarantor/guarantor').then(m => m.GuarantorComponent),
                title: 'Member | Guarantor'
            },
            {
                path: 'dividends',
                loadComponent: () => import('./features/member/pages/dividends/dividends').then(m => m.DividendsComponent),
                title: 'Member | Dividends'
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/member/pages/account-notification/account-notification').then(m => m.NotificationsComponent),
                title: 'Member | Notifications'
            },
            {
                path: 'support',
                loadComponent: () => import('./features/member/pages/account-support/account-support').then(m => m.MemberSupportComponent),
                title: 'Member | Support'
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/member/pages/account-setting/account-setting').then(m => m.AccountSettingsComponent),
                title: 'Member | Settings'
            },






            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./features/admin/pages/dashboard/dashboard').then(m => m.DashboardComponent) },
            { path: 'analytics', loadComponent: () => import('./features/admin/pages/analytics/analytics').then(m => m.AnalyticsComponent) },
            // { path: 'members', loadComponent: () => import('./features/admin/pages/members/members').then(m => m.MembersComponent) },
            { path: 'deposits', loadComponent: () => import('./features/admin/pages/deposits/deposits').then(m => m.DepositsComponent) },
            // { path: 'withdrawals', loadComponent: () => import('./features/admin/pages/withdrawals/withdrawals').then(m => m.WithdrawalsComponent) },
            // { path: 'loans', loadComponent: () => import('./features/admin/pages/loans/loans').then(m => m.LoansComponent) },
            // { path: 'shares', loadComponent: () => import('./features/admin/pages/shares/shares').then(m => m.SharesComponent) },
            // { path: 'reconciliation', loadComponent: () => import('./features/admin/pages/reconciliation/reconciliation').then(m => m.ReconciliationComponent) },
            // { path: 'vendors', loadComponent: () => import('./features/admin/pages/vendors/vendors').then(m => m.VendorsComponent) },
            // { path: 'reports', loadComponent: () => import('./features/admin/pages/reports/reports').then(m => m.ReportsComponent) },
            // { path: 'settings', loadComponent: () => import('./features/admin/pages/settings/settings').then(m => m.SettingsComponent) },
            // { path: 'audit', loadComponent: () => import('./features/admin/pages/audit/audit').then(m => m.AuditComponent) }
        ]
    },

    // Fallback Route
    { path: '**', redirectTo: '', pathMatch: 'full' }
];