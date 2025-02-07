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
import { SliderComponent } from '../../components/slider/slider.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';

interface Testimonial {
  name: string;
  subject: string;
  feedback: string;
  reviewer: string;
}
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, ProfileImageComponent, TestimonialsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  lessonCategories: LessonCategory[] = [];
  listings: Listing[] = [];

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


  navigateToSearch(item: string): void {
    this.router.navigate(['/search-results'], { queryParams: { query: item } });
  }
}
