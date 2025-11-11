import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="bg-gradient-primary" style="min-height: 100vh; display:flex; align-items:center;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-6 col-lg-7 col-md-8">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center mb-2" style="width:64px;height:64px;border-radius:50%;background:#4e73df10;border:1px solid #e3e6f0;">
                  <i class="fas fa-unlock-alt text-primary" style="font-size:26px"></i>
                </div>
                <h1 class="h4 text-gray-900 mb-1">Quên mật khẩu</h1>
                <p class="small text-muted mb-0">Nhập email để nhận liên kết đặt lại mật khẩu</p>
              </div>

              <form class="user" (ngSubmit)="onSubmit()" #f="ngForm" *ngIf="!submitted">
                <div class="form-group">
                  <input type="email" class="form-control form-control-user" name="email" [(ngModel)]="email" placeholder="Email..." required email />
                </div>
                <button class="btn btn-primary btn-user btn-block" [disabled]="f.invalid">Gửi liên kết</button>
              </form>

              <div *ngIf="submitted" class="text-center">
                <i class="fas fa-check-circle text-success" style="font-size:40px"></i>
                <h6 class="mt-3">Đã gửi email đặt lại mật khẩu (giả lập)</h6>
                <a class="small d-block mt-2" [routerLink]="['/login']">Quay lại đăng nhập</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class ForgotPasswordComponent {
  email = '';
  submitted = false;

  constructor(private auth: AuthService) {}

  async onSubmit(): Promise<void> {
    await this.auth.sendReset(this.email);
    this.submitted = true;
  }
}
