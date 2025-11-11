// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateChildFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Chúng ta sẽ "nghe" dòng chảy currentUser$
  return authService.currentUser$.pipe(
    take(1), // Lấy 1 giá trị đầu tiên rồi tự động hủy (unsubscribe)
    map(user => {
      // 'user' là UserProfile (có role) hoặc null

      if (user) {
        // Đã đăng nhập (user không phải null)
        return true; 
      }

      // Chưa đăng nhập (user là null)
      // Chuyển hướng về login, giữ lại URL mà họ muốn vào
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};