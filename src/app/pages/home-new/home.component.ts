import { Component } from '@angular/core';
import { HeaderLandingComponent } from '../../layout/landing/header-landing/header-landing.component';
import { FooterLandingComponent } from '../../layout/landing/footer-landing/footer-landing.component';
import * as AOS from 'aos';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { LessonCategory } from '../../models/lesson-category';
import { Listing } from '../../models/listing';
import { CategoryService } from '../../services/category.service';
import { ListingService } from '../../services/listing.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../layout/landing/footer/footer.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LandingService } from '../../services/landing.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, CarouselModule, HeaderLandingComponent, FooterComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  categories: LessonCategory[] = [];
  courses: any[] = [];
  trendingCourses: any[] = [];
  instructors: any[] = [];
  jobLocations: any[] = [];
  studentReviews: any[] = [];
  searchQuery: string = '';
  selectedCategory: string = "All";
  filteredCourses: any[] = [];
  courseCategories: LessonCategory[] = [];

  customOptions: OwlOptions = {
    loop: true,
    margin: 30,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    dotsEach: true,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 4 }
    },
    nav: false,
    autoHeight: false
  };

  constructor(
    private landingService: LandingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    AOS.init({ duration: 1200, once: true, });

    this.loadCategories();
    this.loadListings();
    this.loadTrendingCourses();
    this.loadInstructors();
    this.loadJobLocations();
    this.loadStudentReviews();
  }

  loadCategories(): void {
    this.landingService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.courseCategories = [
          { id: 0, name: 'All', courses: 0, image: '' },
          ...this.categories
        ];
      },
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  loadListings(): void {
    this.landingService.getListings().subscribe({
      next: (listings) => {
        this.courses = listings;
        this.filteredCourses = [...this.courses]; // Default filtered courses
      },
      error: (error) => console.error('Error loading listings:', error),
    });
  }

  loadTrendingCourses(): void {
    this.landingService.getTrendingCourses().subscribe({
      next: (trendingCourses) => {
        this.trendingCourses = trendingCourses;
      },
      error: (error) => console.error('Error loading trending courses:', error),
    });
  }

  loadInstructors(): void {
    this.landingService.getInstructors().subscribe({
      next: (instructors) => {
        this.instructors = instructors;
      },
      error: (error) => console.error('Error loading instructors:', error),
    });
  }

  loadJobLocations(): void {
    this.landingService.getJobLocations().subscribe({
      next: (locations) => {
        this.jobLocations = locations;
      },
      error: (error) => console.error('Error loading job locations:', error),
    });
  }

  loadStudentReviews(): void {
    this.landingService.getStudentReviews().subscribe({
      next: (reviews) => {
        this.studentReviews = reviews;
      },
      error: (error) => console.error('Error loading student reviews:', error),
    });
  }

  selectCategory(lessonCategory: string) {
    this.selectedCategory = lessonCategory;
    this.filteredCourses = lessonCategory === "All"
      ? this.courses
      : this.courses.filter(course => course.lessonCategory === lessonCategory);
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
