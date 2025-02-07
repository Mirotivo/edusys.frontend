import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardType } from '../../models/card';
import { DiplomaStatus, PaymentSchedule, User } from '../../models/user';
import { PaymentHistory } from '../../models/payment-history';
import { PaymentService } from '../../services/payment.service';
import { ManageCardsComponent } from '../manage-cards/manage-cards.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-payments',
  imports: [CommonModule, FormsModule, ManageCardsComponent],
  templateUrl: './profile-payments.component.html',
  styleUrl: './profile-payments.component.scss'
})
export class ProfilePaymentsComponent {
  // Enums and Data Models
  CardType = CardType;
  PaymentSchedule = PaymentSchedule;

  // States
  activeTab: string = 'profile';
  activeSubTab: string = 'history';
  profile: User | null = null;
  payment: PaymentHistory | null = null;


  // Payment
  paypalAccountAdded: boolean = false;
  paymentPreference: PaymentSchedule = PaymentSchedule.PerLesson;
  compensationPercentage: number = 50;

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {

  }
  // 1. Lifecycle Hooks
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['section'] || 'profile';
      this.activeSubTab = params['detail'] || 'history';
    });

    this.fetchCompensationPercentage();
    this.loadPaymentPreference();
    this.loadUserProfile();
    this.loadPaymentHistory();
  }

  // 2. User Profile Management
  loadUserProfile(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.profile = user
        this.isConnected = user.paymentDetailsAvailable
      },
      error: (err) => console.error('Failed to fetch user profile', err)
    });
  }

  // 3. Payment Management
  loadPaymentHistory(): void {
    this.paymentService.getPaymentHistory().subscribe({
      next: (data) => this.payment = data,
      error: (err) => console.error('Failed to fetch payment history', err)
    });
  }

  initializePayPalButton(): void {
    this.paymentService.loadPayPalScript().then(() => {
      (window as any).paypal
        .Buttons({
          style: { layout: 'vertical', label: 'paypal' },
          onApprove: () => {
            this.paymentService.addPayPalAccount('example@paypal.com').subscribe(() => {
              alert('Your PayPal account has been linked successfully!');
              this.paypalAccountAdded = true;
            });
          },
          onError: (err: any) => console.error('Error linking PayPal account:', err),
        })
        .render('#paypal-button-container');
    });
  }

  loadPaymentPreference(): void {
    this.userService.getPaymentPreference().subscribe({
      next: (preference) => { this.paymentPreference = preference },
      error: (err) => console.error('Failed to load payment preference', err),
    });
  }

  savePaymentPreference(): void {
    this.userService.updatePaymentPreference(this.paymentPreference).subscribe({
      next: () => { },
      error: (err) => console.error('Failed to update payment preference', err),
    });
  }

  // 5. Compensation Management
  fetchCompensationPercentage(): void {
    this.userService.getCompensationPercentage().subscribe({
      next: (percentage) => this.compensationPercentage = percentage,
      error: (err) => console.error('Error fetching compensation percentage', err)
    });
  }

  adjustCompensation(value: number): void {
    const newPercentage = this.compensationPercentage + value;
    if (newPercentage >= 0 && newPercentage <= 100) {
      this.userService.updateCompensationPercentage(newPercentage).subscribe({
        next: () => this.compensationPercentage = newPercentage,
        error: (err) => console.error('Error updating compensation percentage', err)
      });
    }
  }

  // 7. Helpers & Event Handlers
  onSubTabChange(subTab: string): void {
    this.activeSubTab = subTab;
    if (this.activeSubTab === 'receiving') {
      setTimeout(() => this.initializePayPalButton(), 1000);
    }
  }


  isConnected = false;
  amount: number = 0;
  currency: string = 'aud';

  connectStripe(): void {
    this.paymentService.connectAccount().subscribe((data) => {
      window.location.href = data.url;
    });
  }

  createPayout(): void {
    if (this.amount > 0) {
      this.paymentService.createPayout(this.amount, this.currency).subscribe(() => {

      });
    }
  }
}
