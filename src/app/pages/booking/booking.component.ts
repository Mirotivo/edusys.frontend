import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageCardsComponent } from '../../components/manage-cards/manage-cards.component';
import { Card, CardType } from '../../models/card';
import { ListingService } from '../../services/listing.service';
import { Listing } from '../../models/listing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../services/lesson.service';
import { Proposition } from '../../models/proposition';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, FormsModule, ManageCardsComponent],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent implements OnInit {
  CardType: CardType = CardType.Paying;
  selectedCard: Card | null = null;

  listing!: Listing;
  loading: boolean = true;
  selectedDate: Date = new Date(); // Selected lesson date
  selectedTime: string = ''; // Selected lesson time
  lessonDuration: number = 1; // Default 1 hour
  totalPrice: number = 0; // Total price calculated dynamically
  minDate: Date = new Date(); // Minimum selectable date

  constructor(
    private alertService: AlertService,
    private lessonService: LessonService,
    private route: ActivatedRoute,
    private listingService: ListingService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
      this.alertService.warningAlert('Please select a date and time for the lesson.');
      return;
    }
    if (!this.selectedCard) {
      this.alertService.warningAlert('Please select a payment card.');
      return;
    }
    // Navigate to payment page with listing ID
    const proposition: Proposition = {
      date: new Date(`${this.selectedDate}T${this.selectedTime}:00`),
      duration: this.lessonDuration,
      price: this.totalPrice,
      listingId: this.listing.id,
      studentId: null,
    };

    this.lessonService.proposeLesson(proposition).subscribe({
      next: (lesson) => {
        this.alertService.successAlert('Lesson proposed successfully!', 'Success');
        this.router.navigate(['/messages']);
      },
      error: (err) => {
        console.error('Failed to propose lesson:', err);
        this.alertService.errorAlert('Failed to propose lesson. Please try again.', 'Error');
      },
    });
  }
}
