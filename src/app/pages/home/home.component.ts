import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { LessonCategory } from '../../models/lesson-category';
import { Listing } from '../../models/listing';
import { ListingService } from '../../services/listing.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileImageComponent } from '../../components/profile-image/profile-image.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface Testimonial {
  name: string;
  subject: string;
  feedback: string;
  reviewer: string;
}
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, ProfileImageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  lessonCategories: LessonCategory[] = [];
  listings: Listing[] = [];
  testimonialList: Testimonial[] = [
    {
      name: 'Hiruni',
      subject: 'Maths',
      feedback:
        'Hiruni is great. She takes the time to understand where the problem areas are and is very patient and explains math concepts well.',
      reviewer: 'Barry',
    },
    {
      name: 'Jasmin',
      subject: 'German',
      feedback: 'Jasmin has helped me improve my language skills and is very engaging in her lessons.',
      reviewer: 'Richard',
    },
    // Add more testimonials as needed...
  ];

  constructor(
    private categoryService: CategoryService,
    private listingService: ListingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadListings();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.lessonCategories = categories;
      },
      error: (error) => {
        console.error('Error loading lesson categories:', error);
      },
    });
  }

  loadListings(): void {
    this.listingService.getRandomListings().subscribe({
      next: (listings) => {
        this.listings = listings;
      },
      error: (error) => {
        console.error('Error loading listings:', error);
      },
    });
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) {
      return;
    }
    this.router.navigate(['/search-results'], { queryParams: { query: this.searchQuery } });
  }

  navigateToPayment(listingId: number): void {
    this.router.navigate(['/payment', listingId]);
  }
}
