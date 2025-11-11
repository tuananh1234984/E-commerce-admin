# 🚀 Admin Dashboard E-Commerce (Angular & Firebase)

Trang admin panel (SPA) được xây dựng bằng **Angular (Standalone)** và **Firebase** (Modular SDK) để quản lý một hệ thống E-commerce.

Dự án này được thiết kế để đáp ứng các yêu cầu nghiệp vụ thực tế (Item 8), bao gồm:
* Quản lý CRUD (Sản phẩm, Đơn hàng, v.v.)
* Hệ thống xác thực (Authentication) mạnh mẽ.
* Hệ thống phân quyền (Authorization) 3 cấp: Admin, Quản lý, Nhân viên (Editor).
* Dashboard "live" hiệu suất cao sử dụng Cloud Functions.

---

## 🛠️ Công nghệ sử dụng

* **Frontend:** Angular (v17+), Standalone Components, Bootstrap 5, Chart.js
* **Backend (Database/Auth):** Firebase (Authentication, Firestore, Storage)
* **Backend (Serverless):** Firebase Cloud Functions (v2)
* **Backend (API Mở rộng):** NodeJS (dùng cho các nghiệp vụ Item 7)
* **Ngôn ngữ:** TypeScript (cho cả Frontend và Cloud Functions)

---

## ✨ Tính năng chính (Tiến độ hôm nay)

Hôm nay là một ngày nâng cấp và sửa lỗi quan trọng, chuyển đổi toàn bộ dự án từ thư viện Firebase cũ (Compat) sang thư viện **MỚI (Modular)** và sửa các lỗi nghiêm trọng.

### 1. Nâng cấp và Đồng bộ Thư viện (Sửa lỗi `NG800` & `ERESOLVE`)

* **Đồng bộ Angular:** Cập nhật các gói `@angular/core`, `@angular/cli`, `@angular/common`... lên cùng một phiên bản để giải quyết xung đột `ERESOLVE`.
* **Nâng cấp Firebase:**
    * Viết lại toàn bộ `app.config.ts` để dùng `provideFirebaseApp`, `provideAuth`, `provideFirestore` thay vì `AngularFireModule` (cũ).
    * **Đã sửa lỗi `auth/configuration-not-found`:** Khắc phục lỗi `400 Bad Request` bằng cách "bơm" (inject) cấu hình vào các service. Giải pháp là dùng `getApp()`:
        * `provideAuth(() => getAuth(getApp()))`
        * `provideFirestore(() => getFirestore(getApp()))`
        * `provideStorage(() => getStorage(getApp()))`

### 2. Hệ thống Xác thực (Authentication)

* **`AuthService` (Modular):** Viết lại hoàn toàn service để sử dụng các hàm `modular` mới (`authState`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`).
* **Tính năng "Ghi nhớ":** Gộp logic "Remember me" (dùng `setPersistence` với `browserLocalPersistence`) vào `AuthService`.
* **Đăng ký (Register):**
    * Nâng cấp hàm `register` để nhận 3 tham số (email, password, displayName).
    * Tự động dùng `updateProfile` để lưu `displayName` vào Firebase Auth.
    * Tự động tạo document trong `users` collection (Firestore) với `role` mặc định là `"editor"`.
* **Đăng nhập (Login):** Sửa lại `LoginComponent` và `AuthService` để `AuthService` không tự điều hướng, giúp `LoginComponent` có thể `try/catch` lỗi và xử lý `returnUrl`.
* **Quên mật khẩu:** Thêm lại hàm `sendReset` (dùng `sendPasswordResetEmail`) vào `AuthService` để sửa lỗi cho `ForgotPasswordComponent`.

### 3. Hệ thống Phân Quyền (Authorization - Item 8)

* **`AuthService` (Cốt lõi):** Sử dụng `currentUser$: BehaviorSubject` kết hợp với `switchMap` để "live" theo dõi thông tin user VÀ `role` của họ từ Firestore.
* **`SbLayoutComponent` (Sidebar động):**
    * Nâng cấp layout từ logic đồng bộ (synchronous) (`getUser()`) sang bất đồng bộ (asynchronous) (`auth.currentUser$ | async as user`).
    * Tự động ẩn/hiện các mục menu "Báo cáo", "Nhân viên", "Cấu hình" bằng `*ngIf="user.role === 'admin'"`.
* **Guards (Functional):** Thiết kế 2 "Gác cổng" chức năng:
    * `auth.guard.ts`: (Xác thực) Kiểm tra người dùng đã đăng nhập chưa (dựa trên `currentUser$`).
    * `role.guard.ts`: (Phân quyền) Kiểm tra `user.role` có nằm trong danh sách `data: { roles: ['admin'] }` của route hay không.

### 4. Trang Tổng quan (Dashboard)

* **`DashboardService` (Modular):** Nâng cấp service để dùng các hàm `modular` (`doc`, `docData`, `collection`, `query`, `orderBy`, `limit`, `collectionData`).
* **Kết nối thành công:** Component đã đọc thành công dữ liệu từ `dashboard_stats/summary` (hiển thị "0 đ", "0 đơn hàng"...).
* **Cloud Functions (`index.ts`):** Đã hoàn thiện logic `onWrite` (v1/v2) để tự động tính toán lại dashboard khi có đơn hàng mới.

---

## 🚀 Cài đặt và Chạy dự án

1.  **Cài đặt (Root):** Chạy `npm install` trong thư mục `Angular-app`.
2.  **Cài đặt (Functions):** `cd functions` và chạy `npm install`. Quay lại root `cd ..`.
3.  **Chạy App (Frontend):** Chạy `npm start`. App sẽ chạy ở `http://localhost:4200`.
4.  **Deploy (Backend):** Chạy `firebase deploy --only functions` để tải Cloud Functions lên server.

---

## 🔑 Cấu hình Firebase (Bắt buộc)

Dự án này sẽ **KHÔNG CHẠY** nếu thiếu các bước cấu hình sau:

1.  **Tạo Project:** Tạo project trên [Firebase Console](https://console.firebase.google.com/).
2.  **Kích hoạt Dịch vụ:**
    * Vào tab **Authentication** -> **"Get started"**.
    * Trong **Sign-in method**, **BẬT (Enable)** 2 mục: **Email/Password** và **Google**.
    * Vào tab **Firestore Database** -> **"Create database"**.
    * Vào tab **Storage** -> **"Get started"**.
3.  **Lấy Config:** Sao chép object `firebaseConfig` từ Cài đặt dự án.
4.  **Dán Config:** Dán vào file `src/environments/environment.ts`.
5.  **Sửa lỗi Storage Bucket:** Đảm bảo `storageBucket` có đuôi là `.appspot.com` (ví dụ: `my-project.appspot.com`), KHÔNG phải là `firebasestorage.app`.
6.  **(QUAN TRỌNG)** Sửa lỗi CORS cho Storage (nếu có upload ảnh) bằng cách chạy:
    ```bash
    gsutil cors set cors.json gs://<your-bucket-name.appspot.com>
    ```

---

## 📝 Ghi chú nghiệp vụ (Item 8)

### 1. Làm thế nào để trở thành Admin?

* Do tính bảo mật, tất cả tài khoản "Đăng ký" (Register) mới sẽ có `role` mặc định là `"editor"`.
* Để tự thăng cấp cho mình thành Admin:
    1.  Vào **Firebase Console** -> **Authentication**, copy **User UID** của tài khoản bạn.
    2.  Đi tới **Firestore Database** -> `users` collection.
    3.  Tìm document có ID trùng với User UID của bạn.
    4.  Mở document đó ra và **sửa trường `role`** từ giá trị `"editor"` thành `"admin"`.
    5.  Tải lại (F5) trang `localhost:4200`. Các menu ẩn của Admin sẽ xuất hiện.

### 2. Tại sao Dashboard hiển thị số 0?

* Đây là hành vi đúng. Dashboard đang đọc "live" từ document `dashboard_stats/summary`.
* Để kiểm tra Cloud Function, hãy vào **Firestore** -> `orders` collection -> "Add document".
* Tạo một đơn hàng giả với `trangThai` (string) = `"Hoàn tất"` và `tongTien` (number) = `150000`.
* Quay lại `localhost:4200` (không cần F5), bạn sẽ thấy "DOANH THU (THÁNG)" tự động nhảy lên `150.000 đ`.