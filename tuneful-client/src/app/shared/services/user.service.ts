import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IRegisterPOSTData } from '../../core/auth/services/auth.service';
import { IUser } from '../../core/layout/settings/settings.component';

const API_URL = `${environment.apiUrl}/user`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private updateDataSubject: Subject<void> = new Subject<void>();
  public updateData$: Observable<void> = this.updateDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  public register(data: IRegisterPOSTData): Observable<any> {
    return this.http.post(`${API_URL}/register`, data).pipe(
      map((response) => {
        console.log(response);
        return response;
      }),
      catchError((error: any) => {
        console.error(
          'Error occured while trying to register: ',
          error.message
        );
        return of(null);
      })
    );
  }

  getUserName(): Observable<string | null> {
    return this.http.get(`${API_URL}/name`, { responseType: 'text' }).pipe(
      tap((response) => response),
      catchError((error: any) => {
        console.error(
          'Error occurred while trying to get user name:',
          error.message
        );
        return of(null);
      })
    );
  }

  getAuthenticatedUser(): Observable<IUser | null> {
    return this.http
      .get<IUser>(`${API_URL}/authenticated-user`, { responseType: 'json' })
      .pipe(
        tap((response) => response),
        catchError((error: any) => {
          console.error(
            'Error occurred while trying to get user name:',
            error.message
          );
          return of(null);
        })
      );
  }

  updateName(newName: string): Observable<any> {
    return this.http.put(`${API_URL}/update-name`, { name: newName }).pipe(
      tap((response) => response),
      catchError((error: any) => {
        console.error(
          'Error occurred while trying to get user name:',
          error.message
        );
        return of(null);
      })
    );
  }

  updateEmail(newEmail: string): Observable<any> {
    return this.http.put(`${API_URL}/update-email`, { email: newEmail }).pipe(
      tap((response) => response),
      catchError((error: any) => {
        console.error(
          'Error occurred while trying to get email:',
          error.message
        );
        return of(null);
      })
    );
  }

  changePassword(password: string, token: string): Observable<any> {
    return this.http
      .put(`${API_URL}/change-password`, { password: password, token: token })
      .pipe(
        tap((response) => response),
        catchError((error: any) => {
          console.error(
            'Error occurred while trying to get user name:',
            error.message
          );
          return of(null);
        })
      );
  }

  updatePassword(newPassword: string) {
    return this.http
      .put(`${API_URL}/update-password`, { password: newPassword })
      .pipe(
        tap((response) => response),
        catchError((error: any) => {
          console.error(
            'Error occurred while trying to get password:',
            error.message
          );
          return of(null);
        })
      );
  }

  updateData() {
    this.updateDataSubject.next();
  }
}
