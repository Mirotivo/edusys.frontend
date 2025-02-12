import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentHistory } from '../models/payment-history';
import { Card, CardType } from '../models/card';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

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

  getPaymentHistory(): Observable<PaymentHistory> {
    return this.http.get<PaymentHistory>(`${this.apiUrl}/history`, {
      headers: this.getAuthHeaders(),
    });
  }

  createPayment(gateway: string, listingId: number | null, amount: number): Observable<any> {
    const returnUrl = `${environment.frontendUrl}/payment-result?success=true&listingId=${listingId}&gateway=${gateway}`;
    const cancelUrl = `${environment.frontendUrl}/payment-result?success=false&listingId=${listingId}&gateway=${gateway}`;
    const body = { gateway, amount, returnUrl, cancelUrl, listingId };
  
    return this.http.post(`${this.apiUrl}/create-payment`, body, {
      headers: this.getAuthHeaders(),
    });
  }
  
  capturePayment(gateway: string, paymentId: string): Observable<any> {
    const body = { gateway, paymentId };

    return this.http.post(`${this.apiUrl}/capture-payment`, body, {
      headers: this.getAuthHeaders(),
    });
  }

  addPayPalAccount(payPalEmail: string): Observable<any> {
    const body = { payPalEmail };

    return this.http.post(`${this.apiUrl}/add-paypal-account`, body, {
      headers: this.getAuthHeaders(),
    });
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
    return this.http.get<Card[]>(`${this.apiUrl}/saved-cards`, {
      headers: this.getAuthHeaders(),
    });
  }

  saveCard(stripeToken: string, purpose: CardType): Observable<any> {
    const body = { stripeToken, purpose };

    return this.http.post(`${this.apiUrl}/save-card`, body, {
      headers: this.getAuthHeaders(),
    });
  }

  removeCard(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-card/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  connectAccount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/connect-link`, {
      headers: this.getAuthHeaders(),
    });
  }

  createPayout(amount: number, currency: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payout`, { amount, currency }, {
      headers: this.getAuthHeaders(),
    });
  }
}
