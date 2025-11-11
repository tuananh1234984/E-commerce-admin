// src/app/products/product.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  Timestamp,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

// 1. ĐỊNH NGHĨA MODEL "CHUẨN"
// (Khớp với form của bạn + thêm các trường còn thiếu)
export interface Product {
  id?: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  description: string; // <-- (Trường bị thiếu)
  category: string; // <-- (Trường bị thiếu)
  imageUrl: string; // <-- (Trường bị thiếu)
  status: 'active' | 'inactive'; // (Khớp với form của bạn)
  createdAt: Timestamp;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  private readonly collectionName = 'products';

  constructor() {}

  // Lấy danh sách (Giữ nguyên)
  list(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.collectionName);
    return collectionData(productsCollection, {
      idField: 'id',
    }) as Observable<Product[]>;
  }

  // Tạo mới (Giữ nguyên - sẽ nhận 'value' từ form đã cập nhật)
  create(data: Omit<Product, 'id' | 'createdAt'>): Promise<any> {
    const productsCollection = collection(this.firestore, this.collectionName);
    const newData = {
      ...data,
      createdAt: Timestamp.now(),
    };
    return addDoc(productsCollection, newData);
  }

  // Cập nhật (Giữ nguyên)
  update(id: string, data: Partial<Product>): Promise<void> {
    const productDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    return setDoc(productDoc, data, { merge: true });
  }

  // Xóa (Giữ nguyên)
  remove(id: string): Promise<void> {
    const productDoc = doc(this.firestore, `${this.collectionName}/${id}`);
    // TODO: Xóa ảnh trong Storage trước khi xóa document
    return deleteDoc(productDoc);
  }

  // Upload ảnh (Giữ nguyên)
  async uploadPhoto(file: File, id?: string): Promise<string> {
    const path = `products/${id || Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, path);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  }
}