import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'; // Đảm bảo đường dẫn này đúng
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// 1. THÊM CommonModule
// (Cần thiết cho *ngIf và | async pipe)
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sb-layout',
  standalone: true,
  // 2. THÊM CommonModule VÀO IMPORTS
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive
  ],
  template: `
  <!-- 3. BỌC TOÀN BỘ LAYOUT BẰNG *ngIf ĐỂ LẤY USER -->
  <ng-container *ngIf="auth.currentUser$ | async as user; else loading">
    <div id="wrapper">
      <!-- Sidebar (ĐÃ THÊM PHÂN QUYỀN) -->
      <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <!-- Brand -->
        <a class="sidebar-brand d-flex align-items-center justify-content-center" [routerLink]="['/admin/dashboard']">
          <div class="sidebar-brand-icon rotate-n-15">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="sidebar-brand-text mx-3">E‑Commerce Admin</div>
        </a>

        <hr class="sidebar-divider my-0" />

        <!-- Dashboard (Mọi người đều thấy) -->
        <li class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          <a class="nav-link" [routerLink]="['/dashboard']">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>
        </li>

        <hr class="sidebar-divider" />
        <div class="sidebar-heading">Quản lý cửa hàng</div>

        <!-- Sản phẩm (Mọi người đều thấy) -->
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/products']">
            <i class="fas fa-fw fa-box"></i>
            <span>Sản phẩm</span>
          </a>
        </li>

        <!-- Đơn hàng (Mọi người đều thấy) -->
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/orders']">
            <i class="fas fa-fw fa-shopping-cart"></i>
            <span>Đơn hàng</span>
          </a>
        </li>

        <!-- Khách hàng (Mọi người đều thấy) -->
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/customers']">
            <i class="fas fa-fw fa-users"></i>
            <span>Khách hàng</span>
          </a>
        </li>

        <!-- Danh mục (Mọi người đều thấy) -->
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/categories']">
            <i class="fas fa-fw fa-tags"></i>
            <span>Danh mục</span>
          </a>
        </li>

        <!-- === PHÂN QUYỀN BẮT ĐẦU TỪ ĐÂY (Item 8) === -->
        
        <!-- Báo cáo (Chỉ Admin) -->
        <li class="nav-item" routerLinkActive="active" *ngIf="user.role === 'admin'">
          <a class="nav-link" [routerLink]="['/reports']">
            <i class="fas fa-fw fa-chart-line"></i>
            <span>Báo cáo</span>
          </a>
        </li>

        <!-- Nhân viên (Chỉ Admin) -->
        <li class="nav-item" routerLinkActive="active" *ngIf="user.role === 'admin'">
          <a class="nav-link" [routerLink]="['/employees']">
            <i class="fas fa-fw fa-user-tie"></i>
            <span>Nhân viên</span>
          </a>
        </li>

        <!-- Khuyến mãi (Mọi người đều thấy - hoặc bạn có thể đổi thành 'admin') -->
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/promotions']">
            <i class="fas fa-fw fa-ticket-alt"></i>
            <span>Khuyến mãi / Vouchers</span>
          </a>
        </li>

        <!-- Đánh giá (Mọi người đều thấy - hoặc bạn có thể đổi thành 'admin') -->
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/reviews']">
            <i class="fas fa-fw fa-star"></i>
            <span>Đánh giá</span>
          </a>
        </li>

        <!-- Cấu hình (Chỉ Admin) -->
        <li class="nav-item" routerLinkActive="active" *ngIf="user.role === 'admin'">
          <a class="nav-link" [routerLink]="['/settings']">
            <i class="fas fa-fw fa-cog"></i>
            <span>Cấu hình</span>
          </a>
        </li>
      </ul>
      <!-- End of Sidebar -->

      <!-- Content Wrapper -->
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <!-- Topbar (ĐÃ SỬA LỖI TÊN USER) -->
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
              <i class="fa fa-bars"></i>
            </button>
            <ul class="navbar-nav ml-auto">
              <!-- 4. SỬA LẠI HIỂN THỊ TÊN USER -->
              <li class="nav-item dropdown no-arrow">
                <a class="nav-link dropdown-toggle" href="#">
                  <span class="mr-2 d-none d-lg-inline text-gray-600 small">
                    <!-- Lấy tên từ 'user' (đã có role) -->
                    Xin chào, {{ user.displayName || user.email || 'Admin' }}
                  </span>
                  <i class="fas fa-user-circle fa-lg text-gray-300"></i>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" (click)="logout()">
                  <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </a>
              </li>
            </ul>
          </nav>
          <!-- End of Topbar -->

          <!-- Begin Page Content -->
          <div class="container-fluid">
            <router-outlet />
          </div>
        </div>

        <!-- Footer -->
        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>&copy; {{ year }} E‑Commerce Admin</span>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
      <i class="fas fa-angle-up"></i>
    </a>
  </ng-container>

  <!-- Template hiển thị khi user đang được tải -->
  <ng-template #loading>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </ng-template>
  `,
})
export class SbLayoutComponent {
  readonly year = new Date().getFullYear();

  // 5. SỬA CONSTRUCTOR (thêm 'public' cho auth)
  // 'public' cho phép template (HTML) truy cập vào auth.currentUser$
  constructor(public auth: AuthService, private router: Router) {}

  // 6. XÓA HÀM `getUserName` BỊ LỖI

  // 7. SỬA HÀM `logout` (gọn gàng hơn)
  logout(): void {
    // Chỉ cần gọi logout()
    // AuthService (bản gộp) sẽ TỰ ĐỘNG điều hướng về /login
    this.auth.logout();
  }
}