import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
import { DiplomaStatus, PaymentSchedule, User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { PaymentService } from '../../services/payment.service';
import { MapAddressComponent } from '../../components/map-address/map-address.component';
import { PaymentHistory } from '../../models/payment-history';
import { ManageCardsComponent } from '../../components/manage-cards/manage-cards.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CardType } from '../../models/card';
import { ProfileImageComponent } from '../../components/profile-image/profile-image.component';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeIbanElement } from '@stripe/stripe-js';
import { ConfigService } from '../../services/config.service';
import { ManageBanksComponent } from '../../components/manage-banks/manage-banks.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, NavigationBarComponent, MapAddressComponent, ManageCardsComponent, ProfileImageComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  // Enums and Data Models
  CardType = CardType;
  DiplomaStatus = DiplomaStatus;
  PaymentSchedule = PaymentSchedule;

  // States
  activeTab: string = 'profile';
  activeSubTab: string = 'history';
  profile: User | null = null;
  payment: PaymentHistory | null = null;

  // Notifications
  notifications = {
    sms: [{ label: 'Lesson Requests', enabled: true }],
    email: [
      { label: 'Account activity', enabled: true },
      { label: 'Lesson Requests', enabled: true },
      { label: 'Offers concerning my listings', enabled: false },
      { label: 'Newsletter', enabled: true }
    ],
  };

  // Payment
  paypalAccountAdded: boolean = false;
  paymentPreference: PaymentSchedule = PaymentSchedule.PerLesson;
  compensationPercentage: number = 50;

  // Diploma
  diplomaStatus: DiplomaStatus = DiplomaStatus.NotSubmitted;
  selectedFile: File | null = null;

  // Delete Confirmation
  deleteConfirmation = false;

  constructor(
    private fb: FormBuilder, private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private paymentService: PaymentService,
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

    this.fetchDiplomaStatus();
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

  saveProfile(): void {
    if (this.profile) {
      this.userService.updateUser(this.profile).subscribe({
        error: (err) => console.error('Failed to update profile', err)
      });
    }
  }

  updateAddress(newAddress: string): void {
    if (this.profile) this.profile.address = newAddress;
  }

  onProfilePictureUpload(): void {
    if (!this.profile) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (this.profile) this.profile.profileImagePath = reader.result as string;

          this.userService.updateUser(this.profile!, file).subscribe({
            error: (err) => console.error('Error updating profile picture:', err)
          });
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
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
      next: () => {},
      error: (err) => console.error('Failed to update payment preference', err),
    });
  }

  // 4. Diploma Management
  fetchDiplomaStatus(): void {
    this.userService.getDiplomaStatus().subscribe({
      next: (data) => this.diplomaStatus = data.status,
      error: (err) => console.error('Error fetching diploma status:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitDiploma(): void {
    if (!this.selectedFile) return alert('Please select a diploma file before submitting.');
    this.userService.submitDiploma(this.selectedFile).subscribe({
      next: () => {
        alert('Diploma submitted for review.');
        this.diplomaStatus = DiplomaStatus.UnderReview;
      },
      error: (err) => console.error('Error submitting diploma:', err)
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

  // 6. Account Management
  changePassword(): void {
    if (this.profile?.email) {
      this.userService.requestPasswordReset({ email: this.profile.email }).subscribe({
        next: () => alert('Password reset request has been sent to your email.'),
        error: (err) => console.error('Error sending password reset request:', err)
      });
    }
  }

  confirmAndDeleteAccount(): void {
    if (this.deleteConfirmation && confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/goodbye']);
        },
        error: (err) => console.error('Failed to delete account:', err)
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
