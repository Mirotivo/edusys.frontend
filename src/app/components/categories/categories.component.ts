import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  selector: 'app-categories',
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
  
    CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categoryName: string = '';
  subcategories: { title: string; items: string[] }[] = [];
  routeSubscription: Subscription | null = null; // To manage the subscription

  allData = {
    'arts-hobbies': [
      { title: 'Animal communication', items: ['Animal communication', 'Cat education', 'Dog education'] },
      { title: 'Brain teasers', items: ['Jigsaw', 'Rubik\'s Cube', 'Speed cubing'] },
      { title: 'Card Games', items: ['Blackjack', 'Bridge', 'Poker', 'Rummy', 'Tarot'] },
      { title: 'Cinematographic Arts', items: ['Audio-visual Arts', 'Cinema', 'Film Production', 'Scriptwriting'] },
      { title: 'Crafts', items: ['Origami', 'Knitting', 'Sewing', 'Pottery', 'Woodworking'] },
      { title: 'Performing Arts', items: ['Acting', 'Ballet', 'Contemporary Dance', 'Hip Hop Dance', 'Playwriting'] }
    ],
    'professional-development': [
      { title: 'Skills', items: ['Public Speaking', 'Time Management', 'Investing'] },
      { title: 'Business', items: ['Accounting', 'Business Basics'] },
      { title: 'Law', items: ['Criminal Law', 'Corporate Law', 'Family Law'] },
      { title: 'Psychology', items: ['Behavioral Psychology', 'Clinical Psychology', 'Organizational Psychology'] }
    ],
    'computer-sciences': [
      { title: 'Programming Languages', items: ['Python', 'C++', 'Java', 'JavaScript'] },
      { title: 'Data Science', items: ['Machine Learning', 'Data Analysis', 'Big Data', 'AI Models'] },
      { title: 'Development', items: ['Frontend Development', 'Backend Development', 'Full Stack Development'] },
      { title: 'Technologies', items: ['Blockchain', 'Crypto Currency', 'AWS', 'Cloud Computing'] }
    ],
    'languages': [
      { title: 'Popular Languages', items: ['English', 'Spanish', 'French', 'German', 'Italian'] },
      { title: 'Asian Languages', items: ['Japanese', 'Chinese', 'Korean', 'Vietnamese'] },
      { title: 'Other Languages', items: ['Arabic', 'Russian', 'Hebrew', 'Mandarin', 'Indonesian'] }
    ],
    'music': [
      { title: 'Instruments', items: ['Piano', 'Guitar', 'Bass Guitar', 'Drums', 'Violin', 'Cello'] },
      { title: 'Singing', items: ['Vocal Coaching', 'Choir Singing', 'Solo Singing'] },
      { title: 'Music Production', items: ['Audio Mixing', 'Music Composition', 'Sound Engineering'] }
    ],
    'health-wellbeing': [
      { title: 'Fitness', items: ['Personal Training', 'Yoga', 'Pilates', 'Aerobics'] },
      { title: 'Sports Therapy', items: ['Physical Therapy', 'Injury Prevention', 'Rehabilitation'] },
      { title: 'Mental Wellness', items: ['Meditation', 'Mindfulness', 'Stress Management'] }
    ],  
    'school-support': [
      { title: 'Math & Science', items: ['Maths', 'Physics', 'Chemistry', 'Biology', 'Science'] },
      { title: 'Test Preparation', items: ['IELTS', 'GAMSAT', 'UCAT', 'ESL'] },
      { title: 'Other Subjects', items: ['Geography', 'History', 'Literature'] }
    ],
    'sports': [
      { title: 'Popular Sports', items: ['Soccer', 'Basketball', 'Tennis', 'Swimming'] },
      { title: 'Martial Arts', items: ['Boxing', 'Judo', 'Karate', 'Taekwondo'] },
      { title: 'Outdoor Activities', items: ['Surfing', 'Hiking', 'Rock Climbing', 'Skiing'] }
    ]
  };
  
  friendlyCategoryNames: { [key: string]: string } = {
    'arts-hobbies': 'Arts & Hobbies',
    'professional-development': 'Professional Development',
    'computer-sciences': 'Computer Sciences',
    'languages': 'Languages',
    'music': 'Music',
    'health-wellbeing': 'Health & Well-being',
    'school-support': 'School Support',
    'sports': 'Sports'
  };  

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
      const slug = params.get('name') || '';
      this.categoryName = this.friendlyCategoryNames[slug] || 'Unknown Category';
      this.subcategories = this.allData[slug as keyof typeof this.allData] || [];
    });
  }

  navigateToSearch(item: string): void {
    this.router.navigate(['/search-results'], { queryParams: { query: item } });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.routeSubscription?.unsubscribe();
  }
}

