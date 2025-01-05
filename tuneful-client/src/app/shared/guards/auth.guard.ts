import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return authService.isTokenValid().pipe(
    switchMap((isValid) => {
      if (isValid) {
        return of(true);
      } else {
        return of(false);
      }
    })
  );
};
