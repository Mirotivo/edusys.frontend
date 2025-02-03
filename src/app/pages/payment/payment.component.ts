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
import { SubscriptionType } from '../../models/subscription-type';
import { HeaderCenterComponent } from '../../components/header-center/header-center.component';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, HeaderCenterComponent, ProfileImageComponent, ManageCardsComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  CardType: CardType = CardType.Paying;
  subscription = {
    title: 'Student Pass',
    subtitle: 'Non-Binding Monthly Subscription',
    price: 69,
    benefits: [
      'Your card is debited only if the tutor accepts your request.',
      'Contact unlimited tutors in all subjects with this pass.'
    ]
  };

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
  ) {}

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
      amount: this.subscription.price,
      paymentMethod: `Card ending in ${this.selectedCard.last4}`,
      subscriptionType: SubscriptionType.Student
    };

    this.subscriptionService.createSubscription(subscriptionRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/payment-result'], {
          queryParams: {
            success: true,
            listingId: this.listingId,
            gateway: 'Stripe',
            subscriptionType: SubscriptionType.Student
          }
        });
      },
      error: (err) => {
        console.error('Error creating subscription:', err);
        this.router.navigate(['/payment-result'], {
          queryParams: {
            success: false,
            listingId: this.listingId,
            gateway: 'Stripe',
            subscriptionType: SubscriptionType.Student
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
}
