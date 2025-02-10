import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-profile-image',
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

    CommonModule, FormsModule],
  templateUrl: './profile-image.component.html',
  styleUrl: './profile-image.component.scss'
})
export class ProfileImageComponent {
  @Input() profileImagePath?: string; // Profile image path
  @Input() firstName?: string;    // User's first name
  @Input() lastName?: string;     // User's last name
  @Input() sizeClass: string = 'large'; // Default size is 'medium'
  @Input() customClass?: string;     // Custom class for the <img> element
  isImageError = false;

  getInitials(): string {
    const firstInitial = this.firstName ? this.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = this.lastName ? this.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  }

  get showImage(): boolean {
    // Show the image only if profileImage is defined, non-empty, and no error occurred
    return !!this.profileImagePath && !this.isImageError;
  }
}
