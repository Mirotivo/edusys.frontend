import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { environment } from '../environments/environment';


export interface Config {
  stripePublishableKey: string;
  payPalClientId: string;
  googleMapsApiKey: string;
  googleClientId: string;
  googleClientSecret: string;
  facebookAppId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;

  constructor(private http: HttpClient) { }

  // Load configuration from backend API
  loadConfig(): Observable<Config> {
    return this.http.get<Config>(`${environment.apiUrl}/configs`)
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
  get(key: string): string {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config[key];
  }

  // Optional: Retrieve the entire configuration object
  getConfig(): Config {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    return this.config;
  }
}
