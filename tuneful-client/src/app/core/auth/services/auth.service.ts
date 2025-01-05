import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { StorageService } from '../../../shared/services/storage.service';

const API_URL = `${environment.apiUrl}/auth`;

export interface ILogin {
  access_token: string;
  refresh_token: string;
}

export interface IRegisterPOSTData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private passLength: number = 0;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {}

  public getPasswordLength() {
    return this.passLength;
  }

  public login(email: string, password: string): Observable<ILogin | null> {
    return this.http.post<ILogin>(`${API_URL}/login`, { email, password }).pipe(
      map((response) => {
        this.passLength = password.length;
        return response;
      }),
      catchError((error: any) => {
        console.error('Error occured while trying to log in');
        return of(null);
      })
    );
  }

  public logout() {
    this.storageService.removeToken();
    this.router.navigate(['/login']);
  }

  public isTokenValid(): Observable<boolean> {
    const token = this.storageService.getToken();
    const refreshToken = this.storageService.getRefreshToken();

    if (!token) {
      return of(false);
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);

      if (expirationDate > new Date()) {
        return of(true);
      }
      if (refreshToken) {
        return this.refreshToken(refreshToken).pipe(
          switchMap((newToken: string) => {
            this.storageService.setToken(newToken);
            return of(true);
          }),
          catchError(() => {
            this.logout();
            return of(false);
          })
        );
      }

      this.logout();
      return of(false);
    } catch (error) {
      return of(false);
    }
  }

  private refreshToken(refreshToken: string): Observable<string> {
    return this.http
      .post<{ accessToken: string }>(`${API_URL}/refresh`, { refreshToken })
      .pipe(
        switchMap((response) => {
          if (response.accessToken) {
            return of(response.accessToken);
          }
          return of('');
        })
      );
  }

  public sendResetPasswordEmail(email: string) {
    return this.http.post(`${API_URL}/request-password-reset`, { email }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: any) => {
        return of(null);
      })
    );
  }

  public verifyPasswordToken(token: string) {
    return this.http.post(`${API_URL}/verify-password-token`, { token }).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: any) => {
        return of(null);
      })
    );
  }
}
