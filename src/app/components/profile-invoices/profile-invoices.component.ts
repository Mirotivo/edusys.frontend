import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentHistory } from '../../models/payment-history';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-profile-invoices',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-invoices.component.html',
  styleUrl: './profile-invoices.component.scss'
})
export class ProfileInvoicesComponent implements OnInit {
  payment: PaymentHistory | null = null;

  constructor(
    private paymentService: PaymentService,
  ) {
  }

  // 1. Lifecycle Hooks
  ngOnInit(): void {
    this.loadPaymentHistory();
  }

  // 3. Payment Management
  loadPaymentHistory(): void {
    this.paymentService.getPaymentHistory().subscribe({
      next: (data) => this.payment = data,
      error: (err) => console.error('Failed to fetch payment history', err)
    });
  }

}
