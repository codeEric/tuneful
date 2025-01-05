import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

const API_URL = `${environment.apiUrl}/melody`;

@Injectable({
  providedIn: 'root',
})
export class MelodyService {
  constructor(private http: HttpClient) {}

  getMelodies() {
    return this.http.get(`${API_URL}/melodies`, { responseType: 'json' }).pipe(
      map((response) => response),
      catchError((error: any) => {
        console.error(
          'Error occurred while trying to get user name:',
          error.message
        );
        return of(null);
      })
    );
  }

  saveMelody(data: any) {
    return this.http
      .post(`${API_URL}/create`, data, { responseType: 'json' })
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
}
