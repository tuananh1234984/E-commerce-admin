import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Cấu hình</h1>
    <small class="text-muted">Thanh toán & Vận chuyển</small>
  </div>

  <div class="row">
    <!-- Payment Settings -->
    <div class="col-lg-6 mb-4">
      <div class="card shadow h-100">
        <div class="card-header py-3 d-flex align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-credit-card mr-1"></i> Thanh toán</h6>
          <button class="btn btn-sm btn-primary">Lưu</button>
        </div>
        <div class="card-body">
          <div class="custom-control custom-switch mb-3">
            <input type="checkbox" class="custom-control-input" id="pay-cod" [(ngModel)]="payment.cod"/>
            <label class="custom-control-label" for="pay-cod">COD (Thanh toán khi nhận hàng)</label>
          </div>
          <div class="custom-control custom-switch mb-3">
            <input type="checkbox" class="custom-control-input" id="pay-vnpay" [(ngModel)]="payment.vnpay"/>
            <label class="custom-control-label" for="pay-vnpay">VNPay</label>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="pay-momo" [(ngModel)]="payment.momo"/>
            <label class="custom-control-label" for="pay-momo">MoMo</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Shipping Settings -->
    <div class="col-lg-6 mb-4">
      <div class="card shadow h-100">
        <div class="card-header py-3 d-flex align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary"><i class="fas fa-shipping-fast mr-1"></i> Vận chuyển</h6>
          <button class="btn btn-sm btn-primary">Lưu</button>
        </div>
        <div class="card-body">
          <div class="custom-control custom-switch mb-3">
            <input type="checkbox" class="custom-control-input" id="ship-ghn" [(ngModel)]="shipping.ghn"/>
            <label class="custom-control-label" for="ship-ghn">GHN - Giao Hàng Nhanh</label>
          </div>
          <div class="custom-control custom-switch mb-3">
            <input type="checkbox" class="custom-control-input" id="ship-ghtk" [(ngModel)]="shipping.ghtk"/>
            <label class="custom-control-label" for="ship-ghtk">GHTK - Giao Hàng Tiết Kiệm</label>
          </div>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="ship-vtp" [(ngModel)]="shipping.viettel"/>
            <label class="custom-control-label" for="ship-vtp">Viettel Post</label>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class SettingsComponent {
  payment = { cod: true, vnpay: false, momo: false };
  shipping = { ghn: true, ghtk: true, viettel: false };
}
