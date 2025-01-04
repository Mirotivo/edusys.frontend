import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auto-complete-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './auto-complete-input.component.html',
  styleUrl: './auto-complete-input.component.scss'
})
export class AutoCompleteInputComponent implements OnChanges {
  @Input() options: { id: number; name: string }[] = [];
  @Output() selectedOption = new EventEmitter<number>();
  @Output() newOptionCreated = new EventEmitter<string>();

  searchText = '';
  filteredOptions: { id: number; name: string }[] = [];
  selectedOptionId: number | null = null;

  ngOnChanges(): void {
    this.filterOptions();
  }

  filterOptions(): void {
    this.filteredOptions = this.options.filter(option =>
      option.name.toLowerCase().includes(this.searchText.toLowerCase())
    );

    // Automatically select the first result if available
    if (this.filteredOptions.length > 0) {
      const firstOption = this.filteredOptions[0];
      this.selectOption(firstOption);
    } else {
      this.selectedOptionId = null; // Reset selection if no results found
    }
  }

  selectOption(option: { id: number; name: string }): void {
    this.searchText = option.name;
    this.selectedOptionId = option.id;
    this.selectedOption.emit(option.id);
  }

  createNewOption(): void {
    if (this.searchText.trim()) {
      this.newOptionCreated.emit(this.searchText.trim());
      this.filterOptions();
      // Reset the input text field
      setTimeout(() => {
        this.searchText = '';
      }, 100);
    }
  }
}
