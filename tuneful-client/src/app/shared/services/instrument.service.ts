import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

const API_URL = `${environment.apiUrl}/instrument`;

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  constructor(private http: HttpClient) {}

  getInstruments(): Observable<any | null> {
    return this.http
      .get(`${API_URL}/instruments`, { responseType: 'json' })
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
