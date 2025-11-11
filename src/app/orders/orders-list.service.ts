/**
 * 1. List(): Lấy đơn hàng, sắp xếp theo ngày mới nhất lên đầu
 * 2. updateStatus(): Hàm nghiệp vụ quan trọng nhất, chỉ cập nhật trạng thái(ví dụ: "Đang xử lý" -> "Đang giao")
 */

import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import {
    Firestore,
    collection,
    collectionData,
    doc,
    updateDoc, // Dùng updateDoc để cập nhật
    query,     // Dùng query để sắp xếp
    orderBy,    // Dùng orderBy để sắp xếp
    Timestamp,
} from "@angular/fire/firestore";

// 1. Định nghĩa các trạng thái (nghiệp vụ Item 2 & 8)
export type OrderStatus = 'Đang xử lý' | 'Đang giao' | 'Hoàn tất' | 'Đã hủy';

//2 . Định nghĩa Model cho đơn hàng
export interface Order {
    id?: string;
    maDonHang: string; //VD: "DH1001"
    khachHang: string; //tên khách hàng
    tongTien: number;
    trangThai: OrderStatus;
    ngay: Timestamp; // ngày tạo

    // Có thể cập nhật thêm các trường
    // email: string;
    // phone: string;
    // address: string;
    // items: any[]; // mảng các sản phẩm
}

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    private firestore: Firestore = inject(Firestore);
    private readonly collectionName = 'orders';

    constructor() {
        
    }
    /**
    * Lấy: Lấy danh sách tất cả đơn hàng, sắp xếp mới nhất lên đầu
    * (Filestore Rules đã bảo mật)
    */
    list(): Observable<Order[]> {
        const ordersCollection = collection(this.firestore, this.collectionName);

        //3. Tạo một query (truy vấn) để sắp xếp
        const q = query(ordersCollection, orderBy('ngay', 'desc'));

        return collectionData(q, {
            idField: 'id',
        }) as Observable<Order[]>;
    }

    /**
     * Sửa (nghiệp vụ): Cập nhật trạng thái của một đơn hàng
     * (Filestore Rules đã bảo mật)
     */
    updateStatus(id: string, newStatus: OrderStatus): Promise<void> {
        const orderDoc = doc(this.firestore, `${this.collectionName}/${id}`);

        //4. Dùng updateDoc để chỉ thay đổi 1 trường "trangThai"
        return updateDoc(orderDoc, {
            trangThai: newStatus,
        });
    }
}