import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { SubscriptionService } from '../../services/subscription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionType } from '../../models/subscription-type';

@Component({
  selector: 'app-payment-result',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent implements OnInit {
  success: boolean = false;
  listingId!: number;
  gateway!: string;
  subscriptionType!: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.success = params['success'] === 'true';
      this.listingId = Number(params['listingId']);
      this.gateway = params['gateway'];
      this.subscriptionType = Number(params['subscriptionType']);

      if (this.gateway && this.subscriptionType) {
        if (this.success) {
          this.handlePaymentSuccess();
        } else {
          this.handlePaymentCancel();
        }
      } else {
        console.error('Missing required parameters for payment result.');
        this.router.navigate(['/payment', this.listingId]);
      }
    });
  }

  handlePaymentSuccess(): void {
    if (this.subscriptionType == SubscriptionType.Student){
      if (this.gateway === 'PayPal') {
        const paymentId = this.route.snapshot.queryParams['paymentId'] || '0';
  
        if (!paymentId) {
          console.error('Missing payment ID for successful payment.');
          this.router.navigate(['/payment', this.listingId]);
          return;
        }
  
        // Capture the payment
        this.paymentService.capturePayment(this.gateway, paymentId).subscribe({
          next: () => {
            // this.createSubscription();
          },
          error: (err) => {
            console.error('Error capturing payment:', err);
            this.router.navigate(['/payment', this.listingId]);
          },
        });
      }
  
      // Automatically redirect to booking after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/booking', this.listingId]);
      }, 3000); // 3000ms = 3 seconds      
    }
    else {
      // Automatically redirect to booking after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 3000); // 3000ms = 3 seconds      

    }
  }

  handlePaymentCancel(): void {
    // Optionally redirect to the payment page or show a cancellation message
    this.router.navigate(['/']);
  }

  createSubscription(): void {
    const subscriptionRequest = {
      amount: 69, // Replace with dynamic amount if needed
      paymentMethod: this.gateway
    };

    this.subscriptionService.createSubscription(subscriptionRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/booking', this.listingId]);
      },
      error: (err) => {
        console.error('Error creating subscription:', err);
        this.router.navigate(['/payment', this.listingId]);
      }
    });
  }

  retryPayment(): void {
    this.router.navigate(['/payment', this.listingId]);
  }  
}
