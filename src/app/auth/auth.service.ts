import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Import các hàm MỚI
import { 
  Auth, 
  authState, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  updateProfile // <-- 1. THÊM IMPORT NÀY
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';

// Model (Rất quan trọng cho Phân Quyền)
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'guest'; // <-- Vai trò
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  // Cốt lõi của Phân Quyền: Luôn theo dõi user VÀ role
  public currentUser$: BehaviorSubject<UserProfile | null> = new BehaviorSubject<UserProfile | null>(null);

  constructor() {
    authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          // Đã login -> lấy role từ Firestore
          const userDoc = doc(this.firestore, `users/${user.uid}`);
          return docData(userDoc) as Observable<UserProfile>;
        } else {
          // Chưa login
          return of(null);
        }
      })
    ).subscribe(profile => {
      // Đẩy thông tin (có role) cho toàn bộ ứng dụng
      this.currentUser$.next(profile);
    });
  }

  // Hàm Login (đã sửa)
  async login (email: string, password: string, remember: boolean): Promise<void> {
    await setPersistence(this.auth, remember ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Hàm Google Login
  googleLogin() {
    return signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(() => this.router.navigate(['/admin/dashboard']))
      .catch(error => alert(error.message));
  }

  // --- 2. THAY THẾ TOÀN BỘ HÀM REGISTER NÀY ---
  async register(email: string, password: string, displayName: string) {
    try {
      // 1. Tạo tài khoản Auth
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // 2. Cập nhật DisplayName cho tài khoản Auth (LẤY TỪ FORM)
      await updateProfile(result.user, { displayName: displayName });

      // 3. Chuẩn bị dữ liệu cho Firestore
      const newUser: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: displayName, // <-- LƯU VÀO FIRESTORE
        role: 'editor' // Mặc định
      };
      
      // 4. Lưu vào document 'users'
      const userDoc = doc(this.firestore, `users/${result.user.uid}`);
      await setDoc(userDoc, newUser);

      // 5. Logic của service: Báo và chuyển về /login
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      this.router.navigate(['/login']);

    } catch (error: any) {
      // Ném lỗi ra để component có thể bắt được
      console.error("Lỗi đăng ký:", error);
      throw new Error(error.message); // Ném lỗi
    }
  }

  // Hàm Logout
  logout() {
    return signOut(this.auth)
      .then(() => this.router.navigate(['/login']));
  }

  // Hàm Reset Password
  async sendReset(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      alert(error.message);
    }
  }
}