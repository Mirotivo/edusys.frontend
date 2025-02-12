import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderCenterComponent } from '../../layout/customer/header-center/header-center.component';
import { ManageCardsComponent } from '../../components/manage-cards/manage-cards.component';
import { Card, CardType } from '../../models/card';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../models/listing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropositionService } from '../../services/proposition.service';
import { Proposition } from '../../models/proposition';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule, HeaderCenterComponent, ManageCardsComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  CardType: CardType = CardType.Paying;
  selectedCard: Card | null = null;

  listing!: Listing;
  loading: boolean = true;
  selectedDate: string = ''; // Selected lesson date
  selectedTime: string = ''; // Selected lesson time
  lessonDuration: number = 1; // Default 1 hour
  totalPrice: number = 0; // Total price calculated dynamically
  minDate: string = ''; // Minimum selectable date

  constructor(
    private propositionService: PropositionService,
    private route: ActivatedRoute,
    private listingService: ListingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setMinDate();
    // Fetch the listing ID from route parameters
    this.route.paramMap.subscribe((params) => {
      const listingId = Number(params.get('id'));
      if (!isNaN(listingId)) {
        this.loadListing(listingId);
      } else {
        console.error('Listing ID not found');
        this.loading = false;
      }
    });
  }

  setMinDate(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  loadListing(listingId: number): void {
    this.listingService.getListing(listingId).subscribe({
      next: (listing) => {
        this.listing = listing;
        this.totalPrice = listing.rates.hourly; // Default price for 1 hour
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch listing:', err);
      }
    });
  }

  onCardSelected(card: Card | null): void {
    this.selectedCard = card;
  }

  updateTotalPrice(): void {
    if (this.listing) {
      this.totalPrice = this.lessonDuration * this.listing.rates.hourly;
    }
  }

  confirmAndPay(): void {
    if (!this.selectedDate || !this.selectedTime) {
      alert('Please select a date and time for the lesson.');
      return;
    }
    if (!this.selectedCard) {
      alert('Please select a payment card.');
      return;
    }
    // Navigate to payment page with listing ID
    const proposition: Proposition = {
      date: `${this.selectedDate}T${this.selectedTime}:00Z`, // Convert to ISO format
      duration: this.lessonDuration,
      price: this.totalPrice,
      listingId: this.listing.id,
      studentId: null,
    };

    debugger
    this.propositionService.proposeLesson(proposition).subscribe({
      next: (lesson) => {
        this.router.navigate(['/messages']);
      },
      error: (err) => {
        console.error('Failed to propose lesson:', err);
      },
    });
  }
}
