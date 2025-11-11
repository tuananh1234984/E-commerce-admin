import { Component } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-reviews-list',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Đánh giá sản phẩm</h1>
    <div class="input-group input-group-sm w-auto">
      <input type="text" class="form-control" placeholder="Tìm kiếm bình luận..."/>
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button"><i class="fas fa-search"></i></button>
      </div>
    </div>
  </div>

  <div class="card shadow mb-4">
    <div class="card-header py-3 d-flex justify-content-between align-items-center">
      <h6 class="m-0 font-weight-bold text-primary">Danh sách đánh giá</h6>
      <div>
        <button class="btn btn-sm btn-outline-success mr-2"><i class="fas fa-check"></i> Duyệt</button>
        <button class="btn btn-sm btn-outline-danger"><i class="fas fa-ban"></i> Ẩn</button>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table mb-0">
          <thead class="thead-light">
            <tr>
              <th>SP</th>
              <th>Khách hàng</th>
              <th>Đánh giá</th>
              <th>Bình luận</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
              <th class="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reviews">
              <td>{{ r.product }}</td>
              <td>{{ r.customer }}</td>
              <td>
                <span class="text-warning">
                  <i *ngFor="let s of [1,2,3,4,5]; let i = index" class="fas" [ngClass]="i < r.rating ? 'fa-star' : 'fa-star-half-alt'" style="margin-right:2px"></i>
                </span>
                <small class="text-muted">{{ r.rating }}/5</small>
              </td>
              <td>{{ r.comment }}</td>
              <td>{{ r.date }}</td>
              <td>
                <span class="badge" [ngClass]="{ 'badge-success': r.status==='Đã duyệt', 'badge-secondary': r.status==='Chờ duyệt' }">{{ r.status }}</span>
              </td>
              <td class="text-right">
                <button class="btn btn-sm btn-outline-success mr-1" title="Duyệt"><i class="fas fa-check"></i></button>
                <button class="btn btn-sm btn-outline-danger" title="Ẩn"><i class="fas fa-ban"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
})
export class ReviewsListComponent {
  reviews = [
    { product: 'Tai nghe Bluetooth X1', customer: 'Nguyễn An', rating: 5, comment: 'Âm hay, pin tốt', date: '27/10/2025', status: 'Đã duyệt' },
    { product: 'Áo thun Basic', customer: 'Trần Bình', rating: 4, comment: 'Vải ổn, giao nhanh', date: '26/10/2025', status: 'Đã duyệt' },
    { product: 'Nồi chiên không dầu', customer: 'Lê Chi', rating: 3, comment: 'Hơi ồn nhưng dùng ổn', date: '25/10/2025', status: 'Chờ duyệt' }
  ];
}
