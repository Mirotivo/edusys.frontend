import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  selector: 'app-footer',
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

    CommonModule, FormsModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  platformName = 'Avancira';
  footerLinks = {
    about: [
      { label: 'About Us', route: '/about' },
      { label: 'Terms & Conditions', route: '/terms' },
      { label: 'Privacy Policy', route: '/privacy-policy' },
      // { label: 'Avancira Global', route: '/global' },
      { label: 'Online Courses', route: '/online-courses' },
      { label: 'States', route: '/states' },
      { label: 'Careers', route: '/careers' }
    ],
    subjects: [
      { label: 'Arts & Hobbies', route: '/category/arts-hobbies' },
      { label: 'Professional Development', route: '/category/professional-development' },
      { label: 'Computer Sciences', route: '/category/computer-sciences' },
      { label: 'Languages', route: '/category/languages' },
      { label: 'Music', route: '/category/music' },
      { label: 'Health & Well-being', route: '/category/health-wellbeing' },
      { label: 'School Support', route: '/category/school-support' },
      { label: 'Sports', route: '/category/sports' }
    ],
    adventure: [
      { label: 'The Blog', route: '/blog' }
    ],
    help: [
      { label: 'Help Centre', route: '/help-centre' },
      // { label: 'Contact', route: '/contact' }
    ],
    social: [
      { icon: 'facebook', url: 'https://www.facebook.com/avancira' },
      // { icon: 'twitter', url: 'https://twitter.com' },
      // { icon: 'instagram', url: 'https://instagram.com' },
      { icon: 'linkedin', url: 'https://www.linkedin.com/company/avancira' }
    ]
  };
}
