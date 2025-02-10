import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeIbanElement } from '@stripe/stripe-js';
import { ConfigService } from '../../services/config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
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
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-manage-banks',
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
    MatSidenavModule,

    CommonModule, FormsModule],
  templateUrl: './manage-banks.component.html',
  styleUrl: './manage-banks.component.scss'
})
export class ManageBanksComponent implements OnInit {
  stripe: Stripe | null = null;
  ibanElement: StripeIbanElement | null = null;
  accountHolderName: string = '';
  savedBanks: any[] = [];

  constructor(
    private paymentService: PaymentService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.initializeStripeIban();
    this.loadSavedBanks();
  }

  async initializeStripeIban(): Promise<void> {
    this.stripe = await loadStripe(this.configService.get('stripePublishableKey'));

    if (!this.stripe) {
      console.error('Stripe is not initialized.');
      return;
    }

    const elements = this.stripe.elements();
    this.ibanElement = elements.create('iban', {
      supportedCountries: ['SEPA'],
      placeholderCountry: 'US',
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
        },
      },
    });
    this.ibanElement.mount('#iban-element');
  }

  loadSavedBanks(): void {
    // this.paymentService.getSavedBanks().subscribe({
    //   next: (banks) => (this.savedBanks = banks),
    //   error: (err) => console.error('Failed to load saved banks', err),
    // });
  }

  async saveBankAccount(event: Event): Promise<void> {
    // event.preventDefault();

    // if (!this.stripe || !this.ibanElement) {
    //   alert('Stripe is not initialized.');
    //   return;
    // }
    
    // const { token, error } = await this.stripe.createToken(this.ibanElement!, new  {
    //   account_holder_name: this.accountHolderName,
    //   account_holder_type: 'individual', // Or 'company'
    // });

    // if (error) {
    //   console.error('Error creating token:', error);
    //   alert('Failed to tokenize bank account.');
    //   return;
    // }

    // this.paymentService.saveBankToken(token!.id).subscribe({
    //   next: () => {
    //     alert('Bank account saved successfully.');
    //     this.loadSavedBanks();
    //     this.accountHolderName = '';
    //   },
    //   error: (err) => {
    //     console.error('Error saving bank account:', err);
    //     alert('Failed to save bank account.');
    //   },
    // });
  }

  removeBank(bankId: number): void {
    // this.paymentService.removeBank(bankId).subscribe({
    //   next: () => this.loadSavedBanks(),
    //   error: (err) => console.error('Failed to remove bank account', err),
    // });
  }
}
