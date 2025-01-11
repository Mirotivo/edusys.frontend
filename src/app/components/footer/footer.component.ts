import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, FormsModule, RouterModule],
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
      { label: 'Avancira Global', route: '/global' },
      { label: 'Online Courses', route: '/online-courses' },
      { label: 'States', route: '/states' },
      { label: 'Careers', route: '/careers' }
    ],
    subjects: [
      { label: 'Arts & Hobbies', route: '/arts-hobbies' },
      { label: 'Professional Development', route: '/professional-development' },
      { label: 'Computer Sciences', route: '/computer-sciences' },
      { label: 'Languages', route: '/languages' },
      { label: 'Music', route: '/music' },
      { label: 'Health & Well-being', route: '/health-wellbeing' },
      { label: 'School Support', route: '/school-support' },
      { label: 'Sports', route: '/sports' }
    ],
    adventure: [
      { label: 'The Blog', route: '/blog' }
    ],
    help: [
      { label: 'Help Centre', route: '/help-centre' },
      { label: 'Contact', route: '/contact' }
    ],
    social: [
      { icon: 'facebook', url: 'https://facebook.com' },
      { icon: 'twitter', url: 'https://twitter.com' },
      { icon: 'instagram', url: 'https://instagram.com' }
    ]
  };
}
