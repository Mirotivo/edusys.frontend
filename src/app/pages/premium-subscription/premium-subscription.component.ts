import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, CardType } from '../../models/card';
import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionType } from '../../models/subscription-type';
import { ManageCardsComponent } from '../../components/manage-cards/manage-cards.component';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-premium-subscription',
  imports: [CommonModule, FormsModule, ManageCardsComponent],
  templateUrl: './premium-subscription.component.html',
  styleUrl: './premium-subscription.component.scss'
})
export class PremiumSubscriptionComponent implements OnInit {
  subscription = {
    title: 'Premium Subscription',
    subtitle: 'Unlock premium features and boost your performance!',
    price: 99,
    benefits: [
      'Get higher visibility in search results.',
      'No commission on your earnings.',
      'Access priority customer support.',
      'Detailed listing performance statistics.',
    ],
  };

  CardType: CardType = CardType.Paying;
  isLoggedIn = false;
  paymentMethod: 'card' | 'paypal' = 'paypal';
  stripePromise: Promise<any> | null = null; 
  savedCards: Card[] = []; // Add saved cards property
  savedCardsAvailable = false; // Check if the user has saved cards
  selectedCard: Card | null = null; // Track the selected card

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.stripePromise = loadStripe(this.configService.get('stripePublishableKey'));
  }

  goToLogin(): void {
    const currentUrl = this.router.url;
    this.router.navigate(['/signin'], { queryParams: { returnUrl: currentUrl } });
  }

  async handlePayment(): Promise<void> {
    if (this.paymentMethod === 'card') {
      await this.handleStripePayment();
    } else if (this.paymentMethod === 'paypal') {
      this.handlePayPalPayment();
    }
  }

  async handleStripePayment(): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe could not be initialized');
      return;
    }

    try {
      this.paymentService.createPayment('Stripe', 0, this.subscription.price).subscribe({
        next: (session: { id: string; approvalUrl: string }) => {
          if (session.approvalUrl) {
            window.location.href = session.approvalUrl; // Redirect to Stripe
          }
        },
        error: (err) => console.error('Error creating Stripe session:', err),
      });
    } catch (err) {
      console.error('Error initiating Stripe payment:', err);
    }
  }

  handlePayPalPayment(): void {
    this.paymentService.createPayment('PayPal', 0, this.subscription.price).subscribe({
      next: (order) => {
        if (order && order.approvalUrl) {
          window.location.href = order.approvalUrl; // Redirect to PayPal
        }
      },
      error: (err) => console.error('Error creating PayPal order:', err),
    });
  }

  
  loadSavedCards(): void {
    this.paymentService.getSavedCards().subscribe({
      next: (cards) => {
        this.savedCards = cards; // Populate savedCards
        this.savedCardsAvailable = cards.length > 0; // Update availability flag
      },
      error: (err) => {
        console.error('Error fetching saved cards:', err);
        this.savedCardsAvailable = false;
      },
    });
  }

  selectCard(card: Card): void {
    this.selectedCard = card;
  }

  onCardSelected(card: Card | null): void {
    this.selectedCard = card; // Update the selected card
  }

  payWithSelectedCard(): void {
    if (!this.selectedCard) {
      alert('Please select a card to proceed.');
      return;
    }

    const subscriptionRequest = {
      amount: this.subscription.price, // Use the subscription price dynamically
      paymentMethod: `Card ending in ${this.selectedCard.last4}`, // Describe the payment method,
      subscriptionType: SubscriptionType.Tutor
    };

    // Call the subscription service to create a subscription
    this.subscriptionService.createSubscription(subscriptionRequest).subscribe({
      next: (response) => {
        console.log('Subscription created successfully:', response);
        this.router.navigate(['/payment-result'], {
          queryParams: {
            success: true,
            listingId: 0,
            gateway: 'Stripe',
            subscriptionType: SubscriptionType.Tutor
          }
        });
      },
      error: (err) => {
        console.error('Error creating subscription:', err);
        this.router.navigate(['/payment-result'], {
          queryParams: {
            success: false,
            listingId: 0,
            gateway: 'Stripe',
            subscriptionType: SubscriptionType.Tutor
          }
        });
      },
    });
  }
}
