import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="bg-gradient-primary" style="min-height: 100vh; display:flex; align-items:center;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-7 col-lg-8 col-md-9">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center mb-2" style="width:64px;height:64px;border-radius:50%;background:#4e73df10;border:1px solid #e3e6f0;">
                  <i class="fas fa-user-plus text-primary" style="font-size:26px"></i>
                </div>
                <h1 class="h4 text-gray-900 mb-1">Tạo tài khoản</h1>
                <p class="small text-muted mb-0">Đăng ký tài khoản quản trị</p>
              </div>

              <form class="user" #f="ngForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                  <input type="text" class="form-control form-control-user" placeholder="Họ tên" name="name" [(ngModel)]="name" required />
                </div>
                <div class="form-group">
                  <input type="email" class="form-control form-control-user" placeholder="Email" name="email" [(ngModel)]="email" required email />
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <input type="password" class="form-control form-control-user" placeholder="Mật khẩu (>= 6 ký tự)" name="password" [(ngModel)]="password" required minlength="6" />
                  </div>
                  <div class="form-group col-md-6">
                    <input type="password" class="form-control form-control-user" placeholder="Nhập lại mật khẩu" name="confirm" [(ngModel)]="confirm" required />
                  </div>
                </div>

                <div class="text-danger small" *ngIf="password && confirm && password !== confirm">Mật khẩu nhập lại không khớp</div>

                <button class="btn btn-primary btn-user btn-block" [disabled]="f.invalid || password !== confirm">Đăng ký</button>
                <div class="text-center mt-3">
                  <a class="small" [routerLink]="['/login']">Đã có tài khoản? Đăng nhập</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirm = '';
  // Thêm biến lưu lỗi
  error = '';
  // Sửa lại Constructor (Không cần router vì service tự điều hướng)
  constructor(private auth: AuthService) {}

  async onSubmit(): Promise<void> {
    this.error = ''; // Reset lỗi trước khi đăng ký

    //Kiểm tra mật khẩu (Giữ nguyên logic từ template)
    if (this.password !== this.confirm) {
      this.error = 'Mật khẩu nhập lại không khớp';
      return;
    }

    //(Template đã kiểm tra minlength="6", và required)

    try {
      //6. Sửa lỗi: Gọi hàm với 3 tham số (thêm 'name')
      await this.auth.register(this.email.trim(), this.password, this.name.trim());

      //7. Sửa lỗi: Xóa điều hướng
      //AuthService sẽ tự điều hướng về login

    }catch (e: any) {
      //8. Thêm: Bắt lỗi từ AuthService và hiển thị (ví dụ: email đã tồn tại)
      if (e.message.includes('email-already-in-use')){
        this.error = 'Email này đã được sử dụng.';
      }else {
        console.error(e);
        this.error = 'Đã có lỗi xảy ra trong quá trình đăng ký.';
      }
    }
  }
}
