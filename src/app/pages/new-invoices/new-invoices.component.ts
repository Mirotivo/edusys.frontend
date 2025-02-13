import { Component } from '@angular/core';
import { PaymentHistory } from '../../models/payment-history';
import { PaymentService } from '../../services/payment.service';
import { Transaction } from '../../models/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-invoices',
  imports: [CommonModule],
  templateUrl: './new-invoices.component.html',
  styleUrl: './new-invoices.component.scss'
})
export class NewInvoicesComponent {
  payment: PaymentHistory | null = null;
  invoices: Transaction[] = [];

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
      next: (data) => 
        {
          this.payment = data,
          this.invoices = this.payment.invoices;
        },
      error: (err) => console.error('Failed to fetch payment history', err)
    });
  }

  printInvoice(invoiceId: number): void {
    window.print();
  }  
}
