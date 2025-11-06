import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If not logged in, send to login with returnUrl to come back to admin page
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Logged in but not admin -> send to home
  if (!authService.isAdmin()) {
    router.navigate(['/home']);
    return false;
  }

  // Admin can proceed
  return true;
};
