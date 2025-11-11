import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="bg-gradient-primary" style="min-height: 100vh; display:flex; align-items:center;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-6 col-lg-7 col-md-8">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
              <div class="row no-gutters">
                <div class="col-12">
                  <div class="p-5">
                    <div class="text-center mb-4">
                      <div class="d-inline-flex align-items-center justify-content-center mb-2" style="width:64px;height:64px;border-radius:50%;background:#4e73df10;border:1px solid #e3e6f0;">
                        <i class="fas fa-shopping-bag text-primary" style="font-size:26px"></i>
                      </div>
                      <h1 class="h4 text-gray-900 mb-1">E‑Commerce Admin</h1>
                      <p class="small text-muted mb-0">Chào mừng trở lại! Đăng nhập để tiếp tục</p>
                    </div>

                    <form class="user" (ngSubmit)="onSubmit()" #f="ngForm">
                      <div class="form-group">
                        <input type="email" class="form-control form-control-user" placeholder="Email..." name="username" [(ngModel)]="username" required />
                      </div>
                      <div class="form-group">
                        <input type="password" class="form-control form-control-user" placeholder="Mật khẩu" name="password" [(ngModel)]="password" required />
                      </div>
                      <div class="form-group">
                        <div class="custom-control custom-checkbox small">
                          <input type="checkbox" class="custom-control-input" id="remember" [(ngModel)]="remember" name="remember" />
                          <label class="custom-control-label" for="remember">Ghi nhớ đăng nhập</label>
                        </div>
                      </div>
                      <button class="btn btn-primary btn-user btn-block" [disabled]="f.invalid">Đăng nhập</button>
                      <div class="text-danger small mt-2" *ngIf="error">{{ error }}</div>
                    </form>

                    <hr />
                    <button class="btn btn-google btn-user btn-block" type="button">
                      <i class="fab fa-google fa-fw"></i> Đăng nhập với Google
                    </button>
                    <button class="btn btn-facebook btn-user btn-block" type="button">
                      <i class="fab fa-facebook-f fa-fw"></i> Đăng nhập với Facebook
                    </button>

                    <div class="text-center mt-3">
                      <a class="small" [routerLink]="['/forgot-password']">Quên mật khẩu?</a>
                    </div>
                    <div class="text-center">
                        <a class="small" [routerLink]="['/register']">Tạo tài khoản!</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class LoginComponent {
  username = '';
  password = '';
  remember = true;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit(): Promise<void> {
    this.error = '';
    try {
      //1. Chỉ cần gọi, không gán vào biến 'ok'
      await this.auth.login(this.username, this.password, this.remember);

      const qp = new URLSearchParams(window.location.search);
      const returnUrl = qp.get('returnUrl') || '/admin/dashboard';
      this.router.navigateByUrl(returnUrl);
    }catch (e: any) {
        console.error('Lỗi đăng nhập: ', e.message);
        this.error = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      }
    }
  }
