import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Listing } from '../../models/listing';
import { ListingService } from '../../services/listing.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LessonCategory } from '../../models/lesson-category';
import { CategoryService } from '../../services/category.service';
import { AutoCompleteInputComponent } from '../auto-complete-input/auto-complete-input.component';

// Angular Material Design
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-create-listing',
  imports: [
    
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatRadioModule,
    MatSliderModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatSidenavModule,

    CommonModule, FormsModule, ReactiveFormsModule, AutoCompleteInputComponent],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  createListingForm!: FormGroup;
  locationOptions: string[] = ['Webcam', 'TutorLocation', 'StudentLocation'];
  socialPlatformOptions: string[] = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Email'];
  lessonCategories: LessonCategory[] = [];
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private listingService: ListingService
  ) { }

  ngOnInit(): void {
    this.createListingForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      listingImage: [null],
      lessonCategoryId: [null, Validators.required],
      locations: [[]],
      aboutLesson: ['', Validators.required],
      aboutYou: ['', Validators.required],
      rates: this.fb.group({
        hourly: [0, [Validators.min(0)]],
        fiveHours: [0],
        tenHours: [0],
      }),
      socialPlatforms: [[]]
    });

    this.loadLessonCategories('');
  }

  loadLessonCategories(searchText: string): void {
    this.categoryService.getFilteredCategories(searchText).subscribe({
      next: (data) => {
        this.lessonCategories = data;
      },
      error: (err) => {
        console.error('Failed to fetch lesson categories', err);
      }
    });
  }

  calculatePerHour(): void {
    const hourlyRate = this.createListingForm.get('rates.hourly')?.value || 0;
    const fiveHoursRate = hourlyRate * 5;
    const tenHoursRate = hourlyRate * 10;

    this.createListingForm.get('rates')?.patchValue({
      fiveHours: fiveHoursRate,
      tenHours: tenHoursRate
    });
  }

  calculatePerFiveHours(): void {
    const fiveHoursRate = this.createListingForm.get('rates.fiveHours')?.value || 0;
    const tenHoursRate = fiveHoursRate * 2;

    this.createListingForm.get('rates')?.patchValue({
      tenHours: tenHoursRate
    });
  }

  selectOption(selectedCategoryId: number): void {
    this.createListingForm.get('lessonCategoryId')?.patchValue(selectedCategoryId);
  }

  addNewLessonCategory(newCategoryName: string): void {
    this.categoryService.createCategory({ name: newCategoryName }).subscribe({
      next: (createdCategory) => {
        // this.lessonCategories.push(createdCategory);
        this.lessonCategories = [...this.lessonCategories, createdCategory];
        this.createListingForm.get('lessonCategoryId')?.patchValue(createdCategory.id);
    
      },
      error: (err) => {
        console.error('Failed to create new lesson category:', err);
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  submitCreateListing(): void {
    if (this.createListingForm.invalid) {
      return;
    }
  
    const formValues = this.createListingForm.value;
    
    const processedListing: Listing = {
      title: formValues.title,
      listingImage: this.selectedImageFile,
      lessonCategoryId: formValues.lessonCategoryId,
      locations: formValues.locations,
      aboutLesson: formValues.aboutLesson,
      aboutYou: formValues.aboutYou,
      rates: {
        hourly: formValues.rates.hourly,
        fiveHours: formValues.rates.fiveHours,
        tenHours: formValues.rates.tenHours
      },
      socialPlatforms: formValues.socialPlatforms || [],

      id: -1,
      tutorId: "",
      tutorName: "",
      contactedCount: 0,
      reviews: 0,
      lessonCategory: "",
      listingImagePath: "",
    };
  

    this.listingService.createListing(processedListing).subscribe({
      next: (newListing) => {
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to create listing:', err);
      }
    });
  }

  closeModal(): void {
    this.onClose.emit();
  }
}
