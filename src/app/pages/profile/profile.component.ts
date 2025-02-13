import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/landing/header/header.component';
import { NavigationBarComponent } from '../../components/navigation-bar/navigation-bar.component';
import { ActivatedRoute } from '@angular/router';
import { ProfileDetailsComponent } from '../../components/profile-details/profile-details.component';
import { ProfileInvoicesComponent } from '../../components/profile-invoices/profile-invoices.component';
import { ProfilePaymentsComponent } from '../../components/profile-payments/profile-payments.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, ProfilePaymentsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  ngOnInit(): void {

  }
}
