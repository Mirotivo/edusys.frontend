import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
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
  selector: 'app-slider',
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
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent<T> implements AfterViewInit {
  @Input() items: T[] = []; // Accepts a generic array of items
  @Input() visibleSlides = 1; // Number of slides visible at a time
  @Input() transitionDuration = 0.5; // Transition duration in seconds
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>; // External template passed via parent
  @ViewChild('sliderTrack') sliderTrack!: ElementRef;

  currentSlide = 0;

  ngAfterViewInit(): void {
    this.updateTrackWidth();
  }

  private updateTrackWidth(): void {
    // Dynamically set the track width based on the number of items and visible slides
    const track = this.sliderTrack.nativeElement;
    track.style.width = `${(this.items.length / this.visibleSlides) * 100}%`;

    // Dynamically set each item's width
    const slides = track.querySelectorAll('.slider-item');
    slides.forEach((slide: HTMLElement) => {
      slide.style.width = `${100 / this.items.length}%`;
    });
  }

  slideRight() {
    const totalSlides = this.items.length;
    this.currentSlide = (this.currentSlide + 1) % totalSlides; // Loop to the beginning
    this.updateSlider();
  }

  slideLeft() {
    const totalSlides = this.items.length;
    this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides; // Loop to the end
    this.updateSlider();
  }

  updateSlider() {
    const track = this.sliderTrack.nativeElement;
    if (track) {
      track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
  }
}
