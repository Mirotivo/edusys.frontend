import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card, CardType } from '../../models/card';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-manage-cards',
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-cards.component.html',
  styleUrl: './manage-cards.component.scss'
})
export class ManageCardsComponent implements OnInit {
  CardType: CardType = CardType.Paying;
  stripe: Stripe | null = null;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardElement: any;
  cardHolderName = '';
  loading = false;
  cardInitialized = false;
  savedCards: Card[] = [];
  showAddCardSection = false; // Show/Hide Add Card Section

  @Input() cardPurpose: CardType = CardType.Receiving; // Input for card purpose
  @Output() cardSelected = new EventEmitter<Card | null>(); // Emit the selected card to the parent
  @Output() selectedCard: Card | null = null; // Track the selected card

  constructor(
    private paymentService: PaymentService,
    private configService: ConfigService,
  ) {}

  ngOnInit(): void {
    this.loadSavedCards();
    this.initializeCardElement();
  }

  loadSavedCards(): void {
    this.paymentService.getSavedCards().subscribe({
      next: (cards) => {
        // Filter cards based on the purpose input
        this.savedCards = cards.filter(card => card.purpose === this.cardPurpose);
        // If there's only one card, select it by default
        if (this.savedCards.length === 1) {
          this.selectCard(this.savedCards[0]);
        }
      },
      error: (err) => {
        console.error('Failed to load saved cards', err);
      }
    });
  }

  selectCard(card: Card): void {
    this.selectedCard = card;
    this.cardSelected.emit(card); // Emit the selected card to the parent
  }

  unselectCard(): void {
    this.selectedCard = null;
    this.cardSelected.emit(null); // Emit null if no card is selected
  }

  async initializeCardElement() {
    if (this.cardInitialized) {
      return; // Avoid reinitializing
    }

    this.stripe = await loadStripe(this.configService.get('stripePublishableKey'));
    if (!this.stripe) {
      console.error('Stripe could not be initialized');
      return;
    }

    // const elements = this.stripe.elements();
    // this.cardElement = elements.create('card');
    // const retryMounting = setInterval(() => {
    //   const cardElementContainer = document.getElementById('card-element');
    //   if (cardElementContainer) {
    //     this.cardElement.mount('#card-element');
    //     this.cardInitialized = true;
    //     clearInterval(retryMounting);
    //   }
    // }, 500);
    const elements = this.stripe?.elements();
    this.cardNumber = elements?.create('cardNumber');
    this.cardNumber?.mount('#card-number');
    this.cardExpiry = elements?.create('cardExpiry');
    this.cardExpiry?.mount('#card-expiry');
    this.cardCvc = elements?.create('cardCvc');
    this.cardCvc?.mount('#card-cvc');
  }

  async saveCard(event: Event) {
    event.preventDefault();

    if (!this.stripe || !this.cardNumber || !this.cardHolderName) {
      alert('Please fill in all details.');
      return;
    }

    const { token, error } = await this.stripe.createToken(this.cardNumber);

    if (error) {
      console.error('Error creating token:', error);
      return;
    }

    this.paymentService.saveCard(token.id, this.cardPurpose).subscribe({
      next: () => {
        this.loadSavedCards();
      },
      error: (err) => {
        console.error('Error saving card:', err);
        alert('Failed to save card.');
      },
    });
  }

  setAsDefault(id: number): void {
    this.savedCards.forEach(method => (method.isDefault = false));
    const selectedMethod = this.savedCards.find(method => method.id === id);
    if (selectedMethod) {
      selectedMethod.isDefault = true;
    }
  }

  removeCard(id: number): void {
    this.paymentService.removeCard(id).subscribe({
      next: () => {
        this.loadSavedCards();
      },
      error: (err) => {
        console.error('Failed to remove card', err);
      }
    });
  }

  toggleAddCardSection(): void {
    this.showAddCardSection = !this.showAddCardSection;
  }

}
