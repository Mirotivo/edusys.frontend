import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User is not authenticated.');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }


  checkActiveSubscription(): Observable<{ isActive: boolean }> {
    return this.http.get<{ isActive: boolean }>(`${this.apiUrl}/check-active`, {
      headers: this.getAuthHeaders(),
    });
  }

  validatePromoCode(promoCode: string): Observable<any> {
    return this.http.get<{
      promoCode: string;
      discountAmount: number;
      discountPercentage: number;
    }>(`${this.apiUrl}/validate-promo`, {
      params: { promoCode },
      headers: this.getAuthHeaders(),
    });
  }

  createSubscription(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, request, {
      headers: this.getAuthHeaders(),
    });
  }
}
