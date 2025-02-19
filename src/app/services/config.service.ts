import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;

  constructor(private http: HttpClient) { }

  // Load configuration from backend API
  loadConfig(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/configs`)
      .pipe(
        tap((config) => {
          this.config = config;
          console.log('Config loaded:', this.config);
        }),
        catchError((error) => {
          console.error('Failed to load configuration:', error);
          return throwError(() => new Error('Failed to load configuration.'));
        })
      );
  }

  // Retrieve a specific key from the config
  get(key: string): any {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config[key];
  }

  // Optional: Retrieve the entire configuration object
  getConfig(): any {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config;
  }
}
