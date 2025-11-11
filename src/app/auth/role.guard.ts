// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Lấy danh sách các role được phép từ 'data' của route
  const allowedRoles = route.data['roles'] as Array<string>;

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      // Kiểm tra 1: Đã login chưa?
      // Kiểm tra 2: Role của user có nằm trong danh sách được phép không?
      if (user && allowedRoles.includes(user.role)) {
        return true;
      }

      // Không có quyền -> đá về dashboard (hoặc trang 403)
      console.error("RoleGuard: Không có quyền truy cập!");
      return router.createUrlTree(['/admin/dashboard']); 
    })
  );
};