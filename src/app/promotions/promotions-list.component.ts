import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Khuyến mãi / Vouchers</h1>
    <a class="btn btn-sm btn-primary shadow-sm"><i class="fas fa-plus mr-1"></i> Tạo mới</a>
  </div>

  <div class="card shadow mb-4">
    <div class="card-header py-3 d-flex justify-content-between align-items-center">
      <h6 class="m-0 font-weight-bold text-primary">Danh sách chương trình</h6>
      <input class="form-control form-control-sm w-auto" placeholder="Tìm kiếm..." />
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="thead-light">
            <tr>
              <th>#</th>
              <th>Mã</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Đã dùng</th>
              <th>Trạng thái</th>
              <th class="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>SALE10</td>
              <td>Phần trăm</td>
              <td>10%</td>
              <td>01/10/2025</td>
              <td>31/10/2025</td>
              <td>120/1000</td>
              <td><span class="badge badge-success">Đang áp dụng</span></td>
              <td class="text-right">
                <button class="btn btn-sm btn-outline-secondary mr-1"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
})
export class PromotionsListComponent {}
