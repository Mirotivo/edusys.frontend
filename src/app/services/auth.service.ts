import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private notificationService: NotificationService) { }

  async register(
    email: string,
    password: string,
    confirmPassword: string,
    referralToken: string | null
  ): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword, referralToken }),
      });

      if (response.ok) {
        return null; // Registration successful
      }

      if (response.status === 400) {
        const errorResponse = await response.json();

        // Safely handle errors array and get the first error message if available
        if (errorResponse.errors && Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
          return errorResponse.errors[0]; // Return the first error
        }

        return "There was an issue with your registration. Please check your details and try again.";
      }

      return 'An unexpected error occurred. Please try again.';
    } catch (error) {
      console.error('Error during registration:', error);
      return 'An unexpected error occurred. Please check your connection.';
    }
  }


  async login(email: string, password: string): Promise<{ token: string; roles: string[] } | null> {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        const { data } = result;
        return {
          token: data.token,
          roles: data.roles,
        };
      }

      return null; // Return null if login fails
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveEmail(email: string): void {
    localStorage.setItem('email', email);
  }

  // Save roles as a JSON string
  saveRoles(roles: string[]): void {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  saveCurrentRole(role: string): void {
    localStorage.setItem('currentRole', role);
  }

  getCurrentRole(): string | null {
    return localStorage.getItem('currentRole');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    localStorage.removeItem('currentRole');
    this.notificationService.stopConnection();
  }
}
