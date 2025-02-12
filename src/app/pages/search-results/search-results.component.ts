import { Component, OnInit } from '@angular/core';
import { Listing } from '../../models/listing';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderCenterComponent } from '../../layout/customer/header-center/header-center.component';
import { LessonCategory } from '../../models/lesson-category';
import { LandingService } from '../../services/landing.service';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule, FormsModule, HeaderCenterComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  searchCategories: string[] = [];
  searchResults: Listing[] = [];
  isLoading: boolean = true;
  hasError: boolean = false;
  currentPage: number = 1;
  totalResults: number = 0;
  pageSize: number = 10;
  isLoadingMore: boolean = false;
  categories: LessonCategory[] = [];

  constructor(
    private landingService: LandingService,
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'] || '';
      this.searchCategories = params['categories'] ? decodeURIComponent(params['categories']).split(',') : [];

      if (this.searchQuery) {
        this.performSearch();
      }
    });
  }

  loadCategories(): void {
    this.landingService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error loading categories:', error),
    });
  }

  toggleCategory(category: string): void {
    if (this.searchCategories.includes(category)) {
      this.searchCategories = this.searchCategories.filter(c => c !== category);
    } else {
      this.searchCategories.push(category);
    }
  
    // Update URL with the selected categories
    this.updateUrl();
  }
    
  updateUrl(): void {
    const queryParams: any = {};
  
    if (this.searchQuery.trim()) {
      queryParams.query = this.searchQuery;
    }
  
    if (this.searchCategories.length > 0) {
      queryParams.categories = this.searchCategories.join(',');
    }
  
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: '', // Replace previous query params
      replaceUrl: true // Prevents adding to history stack
    });
  }
  
  performSearch(loadMore: boolean = false): void {
    if (!loadMore) {
      this.isLoading = true;
      this.searchResults = []; // Reset results for a fresh search
      this.currentPage = 1;
    } else {
      this.isLoadingMore = true;
    }

    this.updateUrl();

    this.listingService.searchListings(this.searchQuery, this.searchCategories, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.totalResults = response.totalResults;
        this.searchResults = loadMore
          ? [...this.searchResults, ...response.results]
          : response.results;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.hasError = true;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
    });
  }

  loadMoreResults(): void {
    this.currentPage++;
    this.performSearch(true);
  }

  
  navigateToPayment(listingId: number): void {
    this.router.navigate(['/payment', listingId]);
  }
}
