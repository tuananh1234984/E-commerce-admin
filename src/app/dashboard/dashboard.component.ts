import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common'; // Thêm DatePipe, DecimalPipe
import { RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs'; // Thêm Observable, Subscription
import { DashboardService } from './dashboard.service'; // **Import service của bạn**

// Giả sử bạn đã cài đặt: npm install chart.js
// Và import nó trong angular.json ("scripts") hoặc import trực tiếp
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // **CẬP NHẬT IMPORTS:**
  imports: [
    CommonModule, 
    RouterLink,
    DecimalPipe, // Pipe để format số (ví dụ: | number)
    DatePipe     // Pipe để format ngày (ví dụ: | date)
  ],
  // **CẬP NHẬT TEMPLATE:**
  template: `
    <ng-container *ngIf="stats$ | async as stats; else loading">
      <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Tổng quan bán hàng</h1>
        <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <i class="fas fa-download fa-sm text-white-50"></i> Xuất báo cáo
        </a>
      </div>

      <div class="row">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Doanh thu (tháng)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ stats.doanhThuThang | number }} ₫</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-coins fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Đơn hàng (hôm nay)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ stats.donHangHomNay | number }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-shopping-cart fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Khách hàng mới (tuần)</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ stats.khachHangMoiTuan | number }}</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-user-plus fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Tỷ lệ chuyển đổi</div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ stats.tyLeChuyenDoi | number:'1.1-1' }}%</div>
                </div>
                <div class="col-auto">
                  <i class="fas fa-percentage fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-7 col-lg-6">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Doanh thu theo tháng</h6>
            </div>
            <div class="card-body">
              <div class="chart-area">
                <canvas id="myAreaChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-5 col-lg-6">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Tỉ trọng doanh thu theo danh mục</h6>
            </div>
            <div class="card-body">
              <div class="chart-pie pt-4 pb-2">
                <canvas id="myPieChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex align-items-center justify-content-between">
          <h6 class="m-0 font-weight-bold text-primary">Đơn hàng gần đây</h6>
          <a class="btn btn-sm btn-outline-primary" routerLink="/admin/orders">Xem tất cả</a>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="thead-light">
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th class="text-right">Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let o of recentOrders$ | async">
                  <td>#{{ o.maDonHang }}</td>
                  <td>{{ o.khachHang }}</td>
                  <td class="text-right">{{ o.tongTien | number }} ₫</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-warning': o.trangThai === 'Đang xử lý',
                      'badge-info': o.trangThai === 'Đang giao',
                      'badge-success': o.trangThai === 'Hoàn tất',
                      'badge-secondary': o.trangThai === 'Đã hủy'
                    }">{{ o.trangThai }}</span>
                  </td>
                  <td>{{ o.ngay.toDate() | date: 'dd/MM/yyyy' }}</td>
                </tr>
                
                <tr *ngIf="(recentOrders$ | async)?.length === 0">
                  <td colspan="5" class="text-center p-4">Chưa có đơn hàng nào gần đây.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>

    <ng-template #loading>
      <div class="text-center p-5">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <p class="mt-2">Đang tải dữ liệu dashboard...</p>
      </div>
    </ng-template>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  // 1. Khai báo các Observables
  public stats$!: Observable<any>;
  public recentOrders$!: Observable<any>;

  // 2. Khai báo các biến để giữ đối tượng Chart
  private areaChart: Chart | undefined;
  private pieChart: Chart | undefined;

  // 3. Khai báo Subscription để dọn dẹp
  private statsSub: Subscription | undefined;

  // 4. Inject service
  constructor(private dashboardService: DashboardService) {
    // Đăng ký các thành phần của Chart.js
    // (Chỉ cần chạy 1 lần)
    Chart.register(...registerables);
  }

  // 5. Lấy dữ liệu khi component khởi tạo
  ngOnInit(): void {
    // Lấy stream dữ liệu từ service
    this.stats$ = this.dashboardService.getDashboardStats();
    this.recentOrders$ = this.dashboardService.getRecentOrders();

    // 6. Subcribe vào stats$ để vẽ biểu đồ KHI có dữ liệu
    this.statsSub = this.stats$.subscribe(stats => {
      if (stats) {
        // Chỉ vẽ biểu đồ khi 'stats' có dữ liệu thật
        this.initCharts(stats);
      }
    });
  }

  // 7. Hủy subscription khi component bị phá hủy
  ngOnDestroy(): void {
    if (this.statsSub) {
      this.statsSub.unsubscribe();
    }
    // Hủy các chart cũ
    if (this.areaChart) {
      this.areaChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  /**
   * Khởi tạo hoặc cập nhật biểu đồ với dữ liệu động
   * @param stats Dữ liệu từ document 'dashboard_stats/summary'
   */
  private initCharts(stats: any): void {
    // --- Dữ liệu cho biểu đồ Doanh thu (Line Chart) ---
    const areaChartData = stats.chartDoanhThuThang;
    const areaLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    // Chuyển object {T1: 100, T2: 200} thành array [100, 200]
    const areaDataPoints = areaLabels.map(label => areaChartData[label] || 0);

    // --- Dữ liệu cho biểu đồ Tỉ trọng (Doughnut Chart) ---
    const pieChartData = stats.chartTyTrongDanhMuc;
    // Chuyển object {dienTu: 50, thoiTrang: 50} thành array ['dienTu', 'thoiTrang']
    const pieLabels = Object.keys(pieChartData);
    // và array [50, 50]
    const pieDataPoints = Object.values(pieChartData);

    // Bắt đầu vẽ...
    try {
      // 1. Vẽ Area Chart
      const area = document.getElementById('myAreaChart') as HTMLCanvasElement | null;
      if (area) {
        // Hủy chart cũ nếu đã tồn tại (để cập nhật live)
        if (this.areaChart) {
          this.areaChart.destroy();
        }
        // Vẽ chart mới với dữ liệu động
        this.areaChart = new Chart(area, {
          type: 'line',
          data: {
            labels: areaLabels,
            datasets: [
              {
                label: 'Doanh thu (VNĐ)',
                data: areaDataPoints, // <-- Dữ liệu động
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                fill: true,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: '#4e73df',
                pointBorderColor: '#4e73df',
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: {},
              y: {
                beginAtZero: true
              }
            }
          },
        });
      }

      // 2. Vẽ Pie Chart
      const pie = document.getElementById('myPieChart') as HTMLCanvasElement | null;
      if (pie) {
        // Hủy chart cũ
        if (this.pieChart) {
          this.pieChart.destroy();
        }
        // Vẽ chart mới với dữ liệu động
        this.pieChart = new Chart(pie, {
          type: 'doughnut',
          data: {
            labels: pieLabels, // <-- Dữ liệu động
            datasets: [
            ],
          },
          options: {
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: {
              legend: { position: 'bottom' }
            }
          },
        });
      }
    } catch (e) {
      console.error("Lỗi khi vẽ biểu đồ:", e);
    }
  }
}