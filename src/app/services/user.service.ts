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

  constructor(private http: HttpClient) { }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  getUserByToken(recommendationToken: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/by-token/${recommendationToken}`);
  }

  getDiplomaStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/diploma-status`);
  }

  submitDiploma(diplomaFile: File): Observable<void> {
    const formData = new FormData();
    formData.append('diplomaFile', diplomaFile);

    return this.http.post<void>(`${this.apiUrl}/submit-diploma`, formData);
  }

  updateUser(user: Partial<User>, imageFile?: File): Observable<void> {
    // Prepare FormData
    const formData = new FormData();

    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    if (user.firstName) formData.append('firstName', user.firstName);
    if (user.lastName) formData.append('lastName', user.lastName);
    if (user.bio) formData.append('bio', user.bio);
    if (user.email) formData.append('email', user.email);
    if (user.dateOfBirth) formData.append('dateOfBirth', user.dateOfBirth);
    if (user.phoneNumber) formData.append('phoneNumber', user.phoneNumber);
    if (user.skypeId) formData.append('skypeId', user.skypeId);
    if (user.hangoutId) formData.append('hangoutId', user.hangoutId);

    if (user.address) {
      if (user.address.formattedAddress) formData.append('address.formattedAddress', user.address.formattedAddress);
      if (user.address.streetAddress) formData.append('address.streetAddress', user.address.streetAddress);
      if (user.address.city) formData.append('address.city', user.address.city);
      if (user.address.state) formData.append('address.state', user.address.state);
      if (user.address.country) formData.append('address.country', user.address.country);
      if (user.address.postalCode) formData.append('address.postalCode', user.address.postalCode);
      if (user.address.latitude) formData.append('address.latitude', user.address.latitude.toString());
      if (user.address.longitude) formData.append('address.longitude', user.address.longitude.toString());
    }

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

    return this.http.put<void>(`${this.apiUrl}/me`, formData);
  }

  changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, {
      oldPassword,
      newPassword,
      confirmNewPassword
    });
  }

  requestPasswordReset(resetPasswordRequest: { email: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/request-reset-password`, resetPasswordRequest);
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`);
  }

  getCompensationPercentage(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/compensation-percentage`);
  }

  updateCompensationPercentage(newPercentage: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/compensation-percentage`, { percentage: newPercentage });
  }

  getPaymentPreference(): Observable<PaymentSchedule> {
    return this.http.get<PaymentSchedule>(`${this.apiUrl}/payment-schedule`);
  }

  updatePaymentPreference(paymentPreference: PaymentSchedule): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/payment-schedule`,
      { paymentSchedule: paymentPreference }
    );
  }
}
