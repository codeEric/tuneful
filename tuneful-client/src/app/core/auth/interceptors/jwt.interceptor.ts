import {
  HttpClient,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> => {
  const router = inject(Router);
  const token = localStorage.getItem('tk');
  const refreshToken = localStorage.getItem('rtk');
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        return refreshAuthToken(refreshToken).pipe(
          switchMap((newToken: string) => {
            localStorage.setItem('tk', newToken);
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            localStorage.removeItem('tk');
            localStorage.removeItem('rtk');
            router.navigate(['/login']);
            return throwError(() => new Error(refreshError.message));
          })
        );
      } else if (error.status === 401) {
        router.navigate(['/login']);
      }

      return throwError(() => new Error(error.message));
    })
  );
};

function refreshAuthToken(refreshToken: string): Observable<string> {
  const httpClient = inject(HttpClient);
  return httpClient
    .post<{ accessToken: string }>('/auth/refresh', { refreshToken })
    .pipe(
      switchMap((response) => {
        return response.accessToken
          ? [response.accessToken]
          : throwError(() => new Error('Failed to refresh token'));
      })
    );
}
