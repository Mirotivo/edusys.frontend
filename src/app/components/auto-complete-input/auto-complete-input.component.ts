import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  selector: 'app-auto-complete-input',
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
    
    CommonModule, FormsModule],
  templateUrl: './auto-complete-input.component.html',
  styleUrl: './auto-complete-input.component.scss'
})
export class AutoCompleteInputComponent implements OnChanges {
  @Input() options: { id: number; name: string }[] = [];
  @Output() selectedOption = new EventEmitter<number>();
  @Output() searchTextChanged = new EventEmitter<string>();
  @Output() newOptionCreated = new EventEmitter<string>();

  searchText = '';
  filteredOptions: { id: number; name: string }[] = [];
  selectedOptionId: number | null = null;

  // Subject for search text
  private searchTextSubject = new Subject<string>();

  constructor() {
    // Subscribe to debounced search text changes
    this.searchTextSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        // this.filterOptions(searchTerm);
        this.searchTextChanged.emit(searchTerm);
      });
  }

  ngOnChanges(): void {
    this.filterOptions('');
  }
  onInputChange(): void {
    this.searchTextSubject.next(this.searchText);
  }

  filterOptions(searchTerm: string): void {
    // Convert search text to lowercase for case-insensitive comparison
    const searchTextLower = this.searchText.toLowerCase();
  
    // Filter options that include the search text
    this.filteredOptions = this.options.filter(option =>
      option.name.toLowerCase().includes(searchTextLower)
    );
  
    // Determine the best match to select
    let bestMatch = null;
  
    // Check for an exact match
    for (const option of this.filteredOptions) {
      if (option.name.toLowerCase() === searchTextLower) {
        bestMatch = option;
        break;
      }
    }
  
    // If no exact match, find the shortest option that includes the search text
    if (!bestMatch && this.filteredOptions.length > 0) {
      bestMatch = this.filteredOptions.reduce((shortest, current) =>
        current.name.length < shortest.name.length ? current : shortest
      );
    }
  
    // Select the best match if found, otherwise reset selection
    if (bestMatch) {
      this.selectOption(bestMatch);
    } else {
      this.selectedOptionId = null;
    }
  }
  
  onOptionChange(event: MatSelectChange): void {
    const selectedId = Number(event.value);
    const selectedOption = this.filteredOptions.find(option => option.id === selectedId);
    if (selectedOption) {
      this.selectOption(selectedOption);
    }
  }

  selectOption(option: { id: number; name: string }): void {
    // this.searchText = option.name;
    this.selectedOptionId = option.id;
    this.selectedOption.emit(option.id);
  }

  createNewOption(): void {
    if (this.searchText.trim()) {
      this.newOptionCreated.emit(this.searchText.trim());
      this.filterOptions('');
    }
  }
}
