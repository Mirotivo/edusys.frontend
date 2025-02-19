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

  checkActiveSubscription(): Observable<{ isActive: boolean }> {
    return this.http.get<{ isActive: boolean }>(`${this.apiUrl}/check-active`);
  }

  getSubscriptionDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/details`);
  }

  cancelSubscription(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cancel`);
  }

  updateSubscription(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  validatePromoCode(promoCode: string): Observable<any> {
    return this.http.get<{
      promoCode: string;
      discountAmount: number;
      discountPercentage: number;
    }>(`${this.apiUrl}/validate-promo`, {
      params: { promoCode }
    });
  }

  createSubscription(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, request);
  }
}
