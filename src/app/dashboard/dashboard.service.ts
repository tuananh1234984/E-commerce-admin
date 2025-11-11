import { Injectable, inject } from '@angular/core';

// Import các hàm MỚI (Modular)
import { Firestore, doc, docData, collection, query, orderBy, limit, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  /**
   * Lấy dữ liệu KPI và Chart đã được tính toán sẵn
   */
  getDashboardStats(): Observable<any> {
    const summaryDoc = doc(this.firestore, 'dashboard_stats/summary');
    // docData tự động lắng nghe thay đổi
    return docData(summaryDoc);
  }
  
  /**
   * Lấy 5 đơn hàng gần nhất
   */
  getRecentOrders(): Observable<any[]> {
    const ordersCollection = collection(this.firestore, 'orders');
    const recentOrdersQuery = query(
      ordersCollection,
      orderBy('ngay', 'desc'),
      limit(5)
    );
    
    // collectionData tự động lắng nghe thay đổi
    return collectionData(recentOrdersQuery);
  }
}