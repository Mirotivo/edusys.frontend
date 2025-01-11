import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;

  constructor(private http: HttpClient) {}

  // Load configuration from backend API
  loadConfig(): Promise<void> {
    return this.http
      .get(`${environment.apiUrl}/configs`)
      .toPromise()
      .then((config) => {
        this.config = config;
        console.log('Config loaded:', this.config);
      })
      .catch((error) => {
        console.error('Failed to load configuration:', error);
        throw error;
      });
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
