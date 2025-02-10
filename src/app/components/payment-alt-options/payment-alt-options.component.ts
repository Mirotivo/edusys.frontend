import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { SubscriptionService } from '../../services/subscription.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { ConfigService } from '../../services/config.service';
// Angular Material Design
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';


@Component({
  selector: 'app-payment-alt-options',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatRadioModule,
    MatSliderModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
  ],
  templateUrl: './payment-alt-options.component.html',
  styleUrl: './payment-alt-options.component.scss'
})
export class PaymentAltOptionsComponent implements OnInit {
  listingId!: number;
  isLoggedIn = false; // Check if the user is logged in
  paymentMethod: 'card' | 'paypal' = 'paypal';
  subscription = {
    title: 'Student Pass',
    subtitle: 'Non-Binding Monthly Subscription',
    price: 69,
    benefits: [
      'Your card is debited only if the tutor accepts your request.',
      'Contact unlimited tutors in all subjects with this pass.'
    ]
  };
  stripePromise: Promise<any> | null = null; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
    private configService: ConfigService
  ) { }


  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
    this.stripePromise = loadStripe(this.configService.get('stripePublishableKey'));

    this.paymentService.loadPayPalScript().then(() => {
      this.renderPayPalButton();
    });
  }

  async onPaymentMethodChange(method: 'card' | 'paypal'): Promise<void> {
    this.paymentMethod = method;
    if (method === 'card') {
      await this.handleStripePayment();
    }
  }

  async handleStripePayment(): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe could not be initialized');
      return;
    }

    try {
      // Call backend to create a Stripe Checkout Session
      this.paymentService.createPayment("Stripe", this.listingId, this.subscription.price).subscribe({
        next: (session: { id: string, approvalUrl: string }) => {
          if (session.approvalUrl) {
            // Redirect to the Stripe Checkout Session URL
            window.location.href = session.approvalUrl;
          } else {
            console.error('Failed to retrieve Stripe session URL');
          }
        },
        error: (error) => {
          console.error('Error creating Stripe session:', error);
        },
      });
    } catch (error) {
      console.error('Error initiating Stripe payment:', error);
    }
  }

  renderPayPalButton(): void {
    const paypal = (window as any).paypal;

    if (paypal && paypal.Buttons) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return new Promise<string>((resolve, reject) => {
            this.paymentService.createPayment("PayPal", this.listingId, 69.00).subscribe({
              next: (order) => {
                if (!order || !order.paymentId) {
                  console.error('Payment Id not returned from the server.');
                  reject('Payment Id not returned from the server.');
                  return;
                }
                resolve(order.paymentId);
              },
              error: (error) => {
                console.error('Error creating order:', error);
                reject(error);
              },
            });
          });
        },
        onApprove: (data: any, actions: any) => {
          this.router.navigate(['/payment-result'], {
            queryParams: {
              success: true,
              listingId: this.listingId,
              gateway: 'PayPal',
              paymentId: data.orderID,
            },
          });
        },
        onError: (err: any) => {
          console.error('PayPal Button Error:', err);
        },
      }).render('#paypal-button-container');
    } else {
      console.error('PayPal SDK not loaded.');
    }
  }
}
