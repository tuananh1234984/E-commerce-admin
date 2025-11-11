// src/app/routes.ts

import { Routes } from '@angular/router';
// 1. IMPORT CẢ 2 GUARD
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard'; // <-- Thêm Guard Phân Quyền

export const routes: Routes = [
  // 2. SỬA LẠI: Điều hướng về '/dashboard' (nằm trong layout)
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  // (Route 'home' này có vẻ không dùng, nhưng ta cứ để lại)
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },

  // 3. CÁC ROUTE XÁC THỰC (BÊN NGOÀI LAYOUT)
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent)
  },

  // 4. CÁC ROUTE QUẢN TRỊ (BÊN TRONG LAYOUT)
  {
    path: '', // <-- Route cha là '' (đúng như file của bạn)
    loadComponent: () => import('./sb-layout/sb-layout.component').then(m => m.SbLayoutComponent),
    canActivateChild: [authGuard], // <-- Bắt buộc đăng nhập
    children: [
      // --- Các trang chung (Admin & Editor) ---
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./products/products-list.component').then(m => m.ProductsListComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./orders/orders-list.component').then(m => m.OrdersListComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/customers-list.component').then(m => m.CustomersListComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./categories/categories-list.component').then(m => m.CategoriesListComponent)
      },
      {
        path: 'promotions',
        loadComponent: () => import('./promotions/promotions-list.component').then(m => m.PromotionsListComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./reviews/reviews-list.component').then(m => m.ReviewsListComponent)
      },
      
      // --- 5. THÊM BẢO MẬT: Các trang riêng (Chỉ Admin) ---
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports-sales.component').then(m => m.ReportsSalesComponent),
        canActivate: [roleGuard], // <-- Thêm RoleGuard
        data: { roles: ['admin'] } // <-- Chỉ 'admin' được vào
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
        canActivate: [roleGuard], // <-- Thêm RoleGuard
        data: { roles: ['admin'] }
      },
      {
        path: 'employees',
        loadComponent: () => import('./employees/employees-list.component').then(m => m.EmployeesListComponent),
        canActivate: [roleGuard], // <-- Thêm RoleGuard
        data: { roles: ['admin'] }
      }
    ]
  },
  
  // 6. Xử lý 404
  { path: '**', redirectTo: 'dashboard' } // Chuyển về dashboard nếu gõ sai
];