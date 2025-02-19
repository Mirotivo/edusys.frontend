import { Component } from '@angular/core';
import { Listing } from '../../models/listing';
import { CategoryService } from '../../services/category.service';
import { ListingService } from '../../services/listing.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/landing/header/header.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { CreateListingComponent } from '../../components/create-listing/create-listing.component';
import { ProfileImageComponent } from '../../components/profile-image/profile-image.component';
import { MultiStepModalComponent } from '../../components/multi-step-modal/multi-step-modal.component';
import { EditListingComponent } from '../../components/edit-listing/edit-listing.component';

@Component({
  selector: 'app-listings',
  imports: [CommonModule, FormsModule, CreateListingComponent, EditListingComponent, ProfileImageComponent],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.scss'
})
export class ListingsComponent {

  editListing(_t16: Listing) {
    throw new Error('Method not implemented.');
  }
  listings: Listing[] = []; // Listings array can contain null
  selectedListing: Listing | null = null; // Selected listing can be null

  constructor(
    private categoryService: CategoryService,
    private listingService: ListingService,
  ) { }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.listingService.getListings().subscribe({
      next: (data) => {
        this.listings = data;
        if (this.listings.length > 0) {
          this.selectedListing = this.listings[0];
        }
      },
      error: (err) => {
        console.error('Failed to fetch listings:', err);
      },
    });
  }

  selectListing(listing: Listing) {
    this.selectedListing = listing;
  }


  toggleVisibility(listing: Listing) {
    const updatedVisibility = !listing.isVisible;

    this.listingService.updateListingVisibility(listing.id, updatedVisibility)
      .subscribe(
        response => {
          listing.isVisible = updatedVisibility;
        },
        error => {
          console.error('Error updating visibility:', error);
        }
      );
  }

  /** Delete a listing */
  deleteListing(listing: Listing): void {
    if (!confirm(`Are you sure you want to delete the listing: ${listing.title}?`)) return;

    this.listingService.deleteListing(listing.id)
      .subscribe({
        next: () => {
          this.listings = this.listings.filter(l => l.id !== listing.id);
          if (this.selectedListing?.id === listing.id) {
            this.selectedListing = this.listings.length > 0 ? this.listings[0] : null;
          }
          console.log('Listing deleted successfully');
        },
        error: err => console.error('Error deleting listing:', err)
      });
  }

  editingSection: string | null = null;
  editSection(section: string): void {
    this.editingSection = section;
    this.isEditListingModalOpen = true;
  }

  isCreateListingModalOpen = false;

  openCreateListingModal(): void {
    this.isCreateListingModalOpen = true;
  }

  closeCreateListingModal(): void {
    this.loadListings();
    this.isCreateListingModalOpen = false;
  }


  isEditListingModalOpen = false;

  openEditListingModal(): void {
    this.isEditListingModalOpen = true;
  }

  closeEditListingModal(): void {
    this.isEditListingModalOpen = false;

    // Reload the updated listing
    if (this.selectedListing) {
      this.listingService.getListing(this.selectedListing.id).subscribe({
        next: (updatedListing) => {
          // Update the selected listing details
          this.selectedListing = updatedListing;

          // Update the listing inside the array
          const index = this.listings.findIndex(l => l.id === updatedListing.id);
          if (index !== -1) {
            this.listings[index] = updatedListing;
          }
        },
        error: (err) => {
          console.error('Failed to reload updated listing:', err);
        }
      });
    }
  }
}
