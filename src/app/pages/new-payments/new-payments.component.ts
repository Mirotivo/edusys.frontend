import { Component } from '@angular/core';
import { CardType } from '../../models/card';
import { PaymentSchedule, User } from '../../models/user';
import { PaymentHistory } from '../../models/payment-history';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageCardsComponent } from '../../components/manage-cards/manage-cards.component';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-new-payments',
  imports: [CommonModule, FormsModule, ManageCardsComponent],
  templateUrl: './new-payments.component.html',
  styleUrl: './new-payments.component.scss'
})
export class NewPaymentsComponent {
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

  // Subscription Management
  subscriptionDetails: any = null;

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router
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
    this.loadSubscriptionDetails();
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

  // Subscription Management
  loadSubscriptionDetails(): void {
    this.subscriptionService.getSubscriptionDetails().subscribe({
      next: (details) => { 
        debugger
        this.subscriptionDetails = details; },
      error: (err) => console.error('Failed to load subscription details', err)
    });
  }

  subscribeNow() {
    this.router.navigate(['/payment', 1]);
  }

  updateSubscription(): void {
    this.subscriptionService.updateSubscription().subscribe({
      next: () => alert('Subscription updated successfully!'),
      error: (err) => console.error('Failed to update subscription', err),
    });
  }

  cancelSubscription(): void {
    this.subscriptionService.cancelSubscription().subscribe({
      next: () => alert('Subscription cancelled successfully!'),
      error: (err) => console.error('Failed to cancel subscription', err),
    });
  }

  editBillingFrequency() {
    throw new Error('Method not implemented.');
  }
  cancelPlan() {
    this.subscriptionService.cancelSubscription().subscribe({
      next: () => alert('Subscription cancelled successfully!'),
      error: (err) => console.error('Failed to cancel subscription', err),
    });
  }
  switchPlans() {
    throw new Error('Method not implemented.');
  }
  changePaymentMethod() {
    throw new Error('Method not implemented.');
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
