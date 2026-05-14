import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/main-layout/main-layout';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';

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
            // You will add forgot-password, onboarding, etc. here later
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

    // Fallback Route
    { path: '**', redirectTo: '', pathMatch: 'full' }
];