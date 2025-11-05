import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError, EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Do not attach Authorization for public auth endpoints (user and admin)
  const isAuthEndpoint = /\/auth\/(admin\/signin|signin|signup)/.test(req.url);
  if (isAuthEndpoint) {
    return next(req);
  }

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    try { console.debug('[AuthInterceptor] Attaching token to', req.url); } catch {}
    return next(authReq).pipe(
      catchError(err => {
        const status = err?.status;
        if (status === 401) {
          // Token missing/expired/invalid -> redirect to login with returnUrl
          const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
          try { console.warn('[AuthInterceptor] 401 for', req.url); } catch {}
          router.navigate(['/login'], { queryParams: { returnUrl } });
          // Propagate the error so callers don't treat it as a successful empty response
          return throwError(() => err);
        }
        return throwError(() => err);
      })
    );
  }

  return next(req).pipe(
    catchError(err => {
      const status = err?.status;
      if (status === 401) {
        const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
        try { console.warn('[AuthInterceptor] 401 (no token) for', req.url); } catch {}
        router.navigate(['/login'], { queryParams: { returnUrl } });
        return throwError(() => err);
      }
      return throwError(() => err);
    })
  );
};
