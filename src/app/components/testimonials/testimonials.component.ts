import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-testimonials',
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
    
    CommonModule, FormsModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
  testimonialList = [
    { name: 'Hector', subject: 'Physics', feedback: 'Excellent tutor!', reviewer: 'Vanessa' },
    { name: 'Farida', subject: 'Python', feedback: 'Highly engaging!', reviewer: 'Stacy' },
    // Add more testimonials as needed
  ];

  currentSlide = 0;

  slideRight() {
    const totalSlides = this.testimonialList.length;
    this.currentSlide = (this.currentSlide + 1) % totalSlides; // Loop to the beginning
    this.updateSlider();
  }

  slideLeft() {
    const totalSlides = this.testimonialList.length;
    this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides; // Loop to the end
    this.updateSlider();
  }

  updateSlider() {
    const track = document.querySelector('.testimonial-track') as HTMLElement;
    if (track) {
      track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }

}
