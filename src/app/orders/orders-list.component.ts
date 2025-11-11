import {Component, OnInit, inject} from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService, Order, OrderStatus } from './orders-list.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  // Cập nhật imports
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './orders-list.component.html', //2. Chúng ta sẽ tạo file này
})
export class OrdersListComponent implements OnInit {
  // Biến cho danh sách và tìm kiếm
  public allOrders: Order[] = [];
  public q: string = '';

  // Biến cho trạng thái loading (item 8)
  // Dùng một object để theo dõi loading cho từng mảng
  public isLoading: {[key: string]:boolean} = {};

  // Inject service
  private svc = inject(OrdersService);

  constructor() {}
  // 3. Tải dữ liệu khi component khởi tạo
  ngOnInit(): void {
    // Chúng ta subscribe to observable
    // Khi Cloud Function (sau này) cập nhật đơn hàng
    // hoặc khi update, danh sách tự dộng làm mới
    this.svc.list().subscribe((orders) => {
      this.allOrders = orders;
    });
  }

  //4. Logic Lọc/Tìm kiếm (Item 6)
  // Giống hệt pattern của component Products và Employees
  filteredOrders(): Order[] {
    const s = this.q.toLowerCase().trim();
    if (!s) return this.allOrders;

    // Cho phép tìm theo Mã đơn hàng hoặc tên khách hàng
    return this.allOrders.filter((o) =>
      o.maDonHang.toLowerCase().includes(s) ||
      o.khachHang.toLowerCase().includes(s)
    );
  }
  //5. Nghiệp vụ (Item 8): Cập nhật trạng thái đơn hàng
  async onStatusChange(
    id: string | undefined,
    newStatusString: string
  ): Promise<void> {
    if (!id) return;
    const newStatus = newStatusString as OrderStatus;
    this.isLoading[id] = true;

    try {
      // Gọi service (firestore rules sẽ kiểm tra quyền)
      await this.svc.updateStatus(id, newStatus);
    //Thành công
    // không cần làm gì hết vì 'this.svc.list().subscribe()'
    // ở ngOnInit() sẽ tự động nhận thấy thay đổi và cập nhật 'addOrders'
    }catch (e: any) {
      console.error(e);
      alert(`Cập nhật thất bại. Lỗi: ${e.message}( Bạn có phải là Admin/Editor không?)`);
    }finally {
      this.isLoading[id] = false; // tắt spinner cho hàng này
    }
  }
}