import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../models/listing';
import { PaymentService } from '../../services/payment.service';
import { SubscriptionService } from '../../services/subscription.service';
import { ProfileImageComponent } from '../../components/profile-image/profile-image.component';
import { ManageCardsComponent } from '../../components/manage-cards/manage-cards.component';
import { Card, CardType } from '../../models/card';
import { HeaderCenterComponent } from '../../layout/customer/header-center/header-center.component';
import { PaymentType } from '../../models/payment-type';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, HeaderCenterComponent, ManageCardsComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  CardType: CardType = CardType.Paying;
  listing: Listing | null = null;
  listingId!: number;
  loading = true;
  isLoggedIn = false;
  selectedCard: Card | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');

    this.route.paramMap.subscribe((params) => {
      this.listingId = Number(params.get('id'));
      if (!isNaN(this.listingId)) {
        this.loadListing(this.listingId);
        this.checkSubscriptionStatus();
      } else {
        console.error('Listing Id is missing');
        this.loading = false;
      }
    });
  }

  loadListing(listingId: number): void {
    this.listingService.getListing(listingId).subscribe({
      next: (listing) => {
        this.listing = listing;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch listing:', err);
      },
    });
  }

  onCardSelected(card: Card | null): void {
    this.selectedCard = card;
  }

  checkSubscriptionStatus(): void {
    this.subscriptionService.checkActiveSubscription().subscribe({
      next: (response: { isActive: boolean }) => {
        if (response.isActive) {
          this.router.navigate(['/booking', this.listingId]);
        }
      },
      error: (err) => {
        console.error('Error checking subscription status:', err);
      },
    });
  }

  payWithSelectedCard(): void {
    if (!this.selectedCard) {
      alert('Please select a card to proceed.');
      return;
    }

    const subscriptionRequest = {
      promoCode: this.promoCode,
      amount: this.finalPrice,
      paymentMethod: `Card ending in ${this.selectedCard.last4}`,
      paymentType: PaymentType.StudentMembership,
      billingFrequency: this.selectedPlan
    };

    this.subscriptionService.createSubscription(subscriptionRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/booking', this.listingId], {
          queryParams: {
            success: true,
            listingId: this.listingId,
            gateway: 'Stripe',
            paymentType: PaymentType.StudentMembership
          }
        });
      },
      error: (err) => {
        console.error('Error creating subscription:', err);
        this.router.navigate(['/booking', this.listingId], {
          queryParams: {
            success: false,
            listingId: this.listingId,
            gateway: 'Stripe',
            paymentType: PaymentType.StudentMembership
          }
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    const currentUrl = this.router.url;
    this.router.navigate(['/signin'], {
      queryParams: { returnUrl: currentUrl },
    });
  }


  selectedPlan: 'Monthly' | 'Yearly' = 'Monthly';

  planOptions = [
    { key: 'Monthly', label: 'Monthly Plan', price: 69, period: 'month', description: 'Enjoy full access to our services with a monthly commitment.' },
    { key: 'Yearly', label: '12-Month Plan', price: 69*12, period: 'year', description: 'Includes 3 extra months free! Pay for 12 months and get 15 months of access.' }
  ];

  promoCode: string = '';
  discountAmount: number = 0;
  finalPrice: number = this.getSelectedPlanPrice();
  promoMessage: string = '';

  getSelectedPlan(): any {
    return this.planOptions.find(plan => plan.key === this.selectedPlan) || this.planOptions[0];
  }

  getSelectedPlanPrice(): number {
    return this.getSelectedPlan().price;
  }

  updatePlan(): void {
    this.finalPrice = this.getSelectedPlanPrice();
    this.applyPromoCode();
  }

  applyPromoCode(): void {
    if (!this.promoCode.trim()) {
      this.promoMessage = "Please enter a promo code.";
      this.discountAmount = 0;
      this.finalPrice = this.getSelectedPlanPrice();
      return;
    }

    this.subscriptionService.validatePromoCode(this.promoCode).subscribe({
      next: (response) => {
        const planPrice = this.getSelectedPlanPrice();
        this.discountAmount = response.discountAmount || (planPrice * response.discountPercentage) / 100;
        this.finalPrice = Math.max(0, planPrice - this.discountAmount);
        this.promoMessage = `Promo applied! You saved $${this.discountAmount.toFixed(2)}.`;
      },
      error: () => {
        this.promoMessage = "Invalid or expired promo code.";
        this.discountAmount = 0;
        this.finalPrice = this.getSelectedPlanPrice();
      },
    });
  }
}
