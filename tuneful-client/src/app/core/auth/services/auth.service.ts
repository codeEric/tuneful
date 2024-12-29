import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { StorageService } from '../../../shared/services/storage.service';

const API_URL = `${environment.apiUrl}/auth`;

export interface ILogin {
  access_token: string;
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

  public isTokenValid() {
    const token = this.storageService.getToken();
    if (!token) {
      return false;
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);

      return expirationDate > new Date();
    } catch (error) {
      return false;
    }
  }
}
