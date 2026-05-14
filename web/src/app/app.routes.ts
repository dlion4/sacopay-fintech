import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/main-layout/main-layout';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
// 1. Added the missing import for MemberLayout
import { MemberLayoutComponent } from './layout/member-layout/member-layout';

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
                loadComponent: () => import('./features/member/pages/dashboard/dashboard').then(m => m.Dashboard),
                title: 'Member | Dashboard'
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Fallback Route
    { path: '**', redirectTo: '', pathMatch: 'full' }
];