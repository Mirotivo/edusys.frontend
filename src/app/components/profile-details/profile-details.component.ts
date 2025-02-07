import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DiplomaStatus, PaymentSchedule, User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapAddressComponent } from '../map-address/map-address.component';
import { ProfileImageComponent } from '../profile-image/profile-image.component';
import { PaymentHistory } from '../../models/payment-history';
import { CardType } from '../../models/card';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-profile-details',
  imports: [CommonModule, FormsModule, MapAddressComponent, ProfileImageComponent],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent implements OnInit {
  // Enums and Data Models
  DiplomaStatus = DiplomaStatus;

  // States
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
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
  }

  
  // 1. Lifecycle Hooks
  ngOnInit(): void {
    this.fetchDiplomaStatus();
    this.loadUserProfile();
  }

  // 2. User Profile Management
  loadUserProfile(): void {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.profile = user
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
}
