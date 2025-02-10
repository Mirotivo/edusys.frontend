import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Review } from '../../models/review';
import { EvaluationService } from '../../services/evaluation.service';
import { RatingComponent } from '../rating/rating.component';
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
  selector: 'app-leave-review',
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

    CommonModule, FormsModule, RatingComponent],
  templateUrl: './leave-review.component.html',
  styleUrl: './leave-review.component.scss'
})
export class LeaveReviewComponent {
  @Input() revieweeId!: number; // Accept revieweeId as input
  @Output() onClose = new EventEmitter<void>();

  newReview: Review = {
    revieweeId: 0,
    subject: '',
    feedback: '',
    name: '',
    rating: null
  };

  responseMessage: string = '';

  constructor(private evaluationService: EvaluationService) {}

  ngOnInit() {
    if (this.revieweeId) {
      this.newReview.revieweeId = this.revieweeId; // Initialize revieweeId
    }
  }

  submitReview(form: NgForm) {
    if (form.invalid) {
      this.responseMessage = 'Please fill in all required fields.';
      return;
    }

    this.evaluationService.submitReview(this.newReview).subscribe({
      next: (response: any) => {
        this.responseMessage = response.message;
        form.resetForm(); // Reset the form after successful submission
      },
      error: (error) => {
        this.responseMessage = error.error || 'An error occurred while submitting the review.';
      }
    });
  }

  closeModal(): void {
    this.onClose.emit();
  }
}
