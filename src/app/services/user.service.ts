import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { DiplomaStatus, PaymentSchedule, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User>(`${this.apiUrl}/me`, { headers });
  }

  getUserByToken(recommendationToken: string): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/by-token/${recommendationToken}`, { headers });
  }

  getDiplomaStatus(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/diploma-status`, { headers });
  }

  submitDiploma(diplomaFile: File): Observable<void> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('diplomaFile', diplomaFile);

    return this.http.post<void>(`${this.apiUrl}/submit-diploma`, formData, { headers });
  }
  
  updateUser(user: Partial<User>, imageFile?: File): Observable<void> {
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    // Prepare FormData
    const formData = new FormData();
  
    if (imageFile) {
      formData.append('profileImage', imageFile);
    }
  
    if (user.firstName) formData.append('firstName', user.firstName);
    if (user.lastName) formData.append('lastName', user.lastName);
    if (user.aboutMe) formData.append('aboutMe', user.aboutMe);
    if (user.email) formData.append('email', user.email);
    if (user.address) formData.append('address', user.address);
    if (user.dob) formData.append('dob', user.dob);
    if (user.phoneNumber) formData.append('phoneNumber', user.phoneNumber);
    if (user.skypeId) formData.append('skypeId', user.skypeId);
    if (user.hangoutId) formData.append('hangoutId', user.hangoutId);
  
    if (user.profileVerified) {
      formData.append('profileVerified', user.profileVerified.join(','));
    }
  
    if (user.lessonsCompleted) {
      formData.append('lessonsCompleted', user.lessonsCompleted);
    }
  
    if (user.evaluations !== undefined) {
      formData.append('evaluations', String(user.evaluations));
    }
  
    if (user.recommendationToken) {
      formData.append('recommendationToken', user.recommendationToken);
    }
  
    if (user.paymentDetailsAvailable !== undefined) {
      formData.append('paymentDetailsAvailable', String(user.paymentDetailsAvailable));
    }
  
    return this.http.put<void>(`${this.apiUrl}/me`, formData, { headers });
  }

  changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string): Observable<void> {
    const token = localStorage.getItem('token');
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post<void>(`${this.apiUrl}/change-password`, {
      oldPassword,
      newPassword,
      confirmNewPassword
    }, { headers });
  }
  
  requestPasswordReset(resetPasswordRequest: { email: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/request-reset-password`, resetPasswordRequest);
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  deleteAccount(): Observable<void> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.delete<void>(`${this.apiUrl}/me`, { headers });
  }

  getCompensationPercentage(): Observable<number> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<number>(`${this.apiUrl}/compensation-percentage`, { headers });
  }

  updateCompensationPercentage(newPercentage: number): Observable<void> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<void>(`${this.apiUrl}/compensation-percentage`, { percentage: newPercentage }, { headers });
  }

  getPaymentPreference(): Observable<PaymentSchedule> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    return this.http.get<PaymentSchedule>(`${this.apiUrl}/payment-schedule`, { headers });
  }
  
  updatePaymentPreference(paymentPreference: PaymentSchedule): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    return this.http.put<void>(
      `${this.apiUrl}/payment-schedule`,
      { paymentSchedule: paymentPreference },
      { headers }
    );
  }  
}
