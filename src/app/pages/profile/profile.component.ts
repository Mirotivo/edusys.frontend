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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, ProfileDetailsComponent, ProfileInvoicesComponent, ProfilePaymentsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  // States
  activeTab: string = 'profile';
  activeSubTab: string = 'history';

  constructor(
    private route: ActivatedRoute
  ) {  }

  // 1. Lifecycle Hooks
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['section'] || 'profile';
      this.activeSubTab = params['detail'] || 'history';
    });
  }

}
