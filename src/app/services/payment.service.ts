import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';

import { environment } from '../environments/environment';
import { Card } from '../models/card';
import { UserCardType } from '../models/enums/user-card-type';
import { PaymentHistory } from '../models/payment-history';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  getPaymentHistory(): Observable<PaymentHistory> {
    return this.http.get<PaymentHistory>(`${this.apiUrl}/history`);
  }

  createPayment(gateway: string, listingId: number | null, amount: number): Observable<{ id: string; approvalUrl: string }> {
    const returnUrl = `${environment.frontendUrl}/payment-result?success=true&listingId=${listingId}&gateway=${gateway}`;
    const cancelUrl = `${environment.frontendUrl}/payment-result?success=false&listingId=${listingId}&gateway=${gateway}`;
    const body = { gateway, amount, returnUrl, cancelUrl, listingId };
  
    return this.http.post<{ id: string; approvalUrl: string }>(`${this.apiUrl}/create-payment`, body);
  }
  
  capturePayment(gateway: string, paymentId: string): Observable<void> {
    const body = { gateway, paymentId };

    return this.http.post<void>(`${this.apiUrl}/capture-payment`, body);
  }

  addPayPalAccount(payPalEmail: string): Observable<void> {
    const body = { payPalEmail };

    return this.http.post<void>(`${this.apiUrl}/add-paypal-account`, body);
  }

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.configService.get('payPalClientId')}&currency=AUD`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject('PayPal SDK could not be loaded.');
      document.body.appendChild(script);
    });
  }

  getSavedCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/saved-cards`);
  }

  saveCard(stripeToken: string, purpose: UserCardType): Observable<void> {
    const body = { stripeToken, purpose };

    return this.http.post<void>(`${this.apiUrl}/save-card`, body);
  }

  removeCard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-card/${id}`);
  }

  connectAccount(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/connect-link`);
  }

  createPayout(amount: number, currency: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/create-payout`, { amount, currency });
  }
}
