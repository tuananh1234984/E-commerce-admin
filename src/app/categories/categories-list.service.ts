import {Injectable, inject} from '@angular/core';
import { Observable } from 'rxjs';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    addDoc,
    setDoc,
    deleteDoc,
    docData,
    Timestamp,
} from '@angular/fire/firestore';

// 1. Định nghĩa Model cho danh mục
export interface Category {
    id? : string;
    name: string;
    description: string;
    createdAt: Timestamp;
}

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    private firestore: Firestore = inject(Firestore);
    private readonly collectionName = 'categories';

    constructor() {}
    /**
    * Lấy: Lấy danh sách Tất cả danh mục (đọc "live")
    */
    list(): Observable<Category[]> {
        const categoriesCollection = collection(this.firestore, this.collectionName);
        return collectionData(categoriesCollection, {
                idField: 'id',
        }) as Observable<Category[]>;
    }
    /**
     * Tạo: Thêm một danh mục mới
     * (Firestore Rules sẽ kiểm tra quyền 'admin' /'editor')
     */
    create(data: Omit<Category, 'id' | 'createdAt'>): Promise<any> {
        const categoriesCollection = collection(this.firestore, this.collectionName);
        const newData = {
            ...data,
            createAt: Timestamp.now(),
        };
        return addDoc(categoriesCollection, newData);
    }
    /**
     * Sửa: Cập nhật một danh mục đã có
     * (Firestore Rules sẽ kiểm tra quyền 'admin' /'editor')
     */
    update(id: string, data: Partial<Category>): Promise<void> {
        const categoryDoc = doc(this.firestore, `${this.collectionName}/${id}`);
        return setDoc(categoryDoc, data, { merge: true});
    }
    /**
     * Xóa: Xóa một danh mục
     * (Firestore Rules sẽ kiểm tra quyền 'admin' /'editor')
     */
    remove(id: string): Promise<void> {
        const categoryDoc = doc(this.firestore, `${this.collectionName}/${id}`);
        return deleteDoc(categoryDoc);
    }
}