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
  docData,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import {
  Functions,
  httpsCallable,
  HttpsCallableResult,
} from '@angular/fire/functions';

// 1. SỬA LẠI MODEL (để khớp với component của bạn)
// Và khớp với collection 'users'
export interface Employee {
  id?: string; // id sẽ được gán bởi Firestore
  uid: string; // ID từ Authentication
  name: string; // Tên hiển thị (từ form)
  role: string; // Vai trò (từ form)
  email: string; // Email (từ form)
  password: string; // Mật khẻu (từ form)
  phone: string; // SĐT (từ form)
  photoUrl?: string; // URL ảnh
  status: 'Active' | 'Inactive'; // Trạng thái
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private firestore: Firestore = inject(Firestore);
  private functions: Functions = inject(Functions);
  private storage: Storage = inject(Storage);

  private readonly collectionName = 'users'; // Đọc từ collection 'users'

  constructor() {}

  /**
   * 1. HÀM LIST() (Thay vì getEmployees)
   * Lấy danh sách TẤT CẢ nhân viên
   */
  list(): Observable<Employee[]> {
    const usersCollection = collection(this.firestore, this.collectionName);
    // Dùng idField: 'id' để lấy ID của document, khớp với logic 'startEdit(e)'
    return collectionData(usersCollection, {
      idField: 'id',
    }) as Observable<Employee[]>;
  }

  /**
   * 2. HÀM CREATE() (Gọi Cloud Function)
   * Gọi hàm 'createEmployee' mà chúng ta đã tạo
   */
  async create(data: Employee): Promise<any> {
    const createEmployeeFunction = httpsCallable(
      this.functions,
      'createEmployee'
    );
    
    
    try {
      // Gọi hàm và gửi dữ liệu lên
      const result = await createEmployeeFunction(data);
      console.log('Cloud Function (create) trả về:', result.data);
      return result;
    } catch (error) {
      console.error('Lỗi từ Cloud Function (create):', error);
      throw error;
    }
  }

  /**
   * 3. HÀM UPDATE() (Cần Cloud Function mới)
   * (Hiện tại chỉ là GHI TRỰC TIẾP - sẽ bị Rules chặn nếu không phải Admin)
   * ĐỂ CHẠY ĐÚNG: Chúng ta cần tạo 1 Cloud Function 'updateEmployee'
   */
  async update(id: string, data: Employee): Promise<any> {
    // Gọi Clound Function 'updateEmployee'
    const updateEmployeeFunction = httpsCallable(
      this.functions,
      'updateEmployee'
    );
    try {
      // Đóng gói 'id' và 'data' lại
      const result = await updateEmployeeFunction({
        uid: id,
        updateData: data,
      });
      console.log('Cloud Function (update) trả về: ', result.data);
      return result;
    }catch (error) {
      console.error('Lỗi từ Cloud Function (update):', error);
      throw error;
    }
  }

  /**
   * 4. HÀM REMOVE() (Cần Cloud Function mới)
   * (Hiện tại chỉ là GHI TRỰC TIẾP - sẽ bị Rules chặn)
   */
  async remove(id: string): Promise<any> {
    //Gọi Cloud Function 'deleteEmployee'
    const deleteEmployeeFunction = httpsCallable(
      this.functions,
      'deleteEmployee'
    );
    try {
      // Đóng gói 'id'
      const result = await deleteEmployeeFunction({ uid: id});
      console.log('Cloud Function (delete) trả về: ', result.data);
      return result;
    }catch (error) {
      console.error('Lỗi từ Cloud Function (delete): ', error);
    }
  }

  /**
   * 5. HÀM UPLOADPHOTO() (Dùng Storage modular)
   */
  async uploadPhoto(file: File, id?: string): Promise<string> {
    const path = `employees/${id || Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, path);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  }
}