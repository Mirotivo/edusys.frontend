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
  
  createSubscription(request: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create`, request);
  }

  checkActiveSubscription(): Observable<{ isActive: boolean }> {
    return this.http.get<{ isActive: boolean }>(`${this.apiUrl}/check-active`);
  }

  getSubscriptionDetails(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/details`);
  }
  
  validatePromoCode(promoCode: string): Observable<{
    promoCode: string;
    discountAmount: number;
    discountPercentage: number;
  }> {
    return this.http.get<{
      promoCode: string;
      discountAmount: number;
      discountPercentage: number;
    }>(`${this.apiUrl}/validate-promo`, {
      params: { promoCode }
    });
  }

  updateSubscription(): Observable<void> {
    throw new Error('Method not implemented.');
  }

  cancelSubscription(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cancel`);
  }
}
