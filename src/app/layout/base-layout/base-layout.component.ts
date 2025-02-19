import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-base-layout',
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})

export class BaseLayoutComponent {
  isMenuOpen = false;
  roles: string[] = [];
  currentRole: 'student' | 'tutor' = 'student';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.roles = this.authService.getRoles();

    const savedRole = this.authService.getCurrentRole();
    if (savedRole && this.roles.includes(savedRole)) {
      this.currentRole = savedRole as 'student' | 'tutor';
    } else if (this.roles.length > 0) {
      this.currentRole = this.roles[0] as 'student' | 'tutor';
      this.authService.saveCurrentRole(this.currentRole);
    }
  }

  switchRole(role: 'student' | 'tutor'): void {
    if (this.currentRole !== role) {
      this.currentRole = role;
      this.authService.saveCurrentRole(role);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  hasMultipleRoles(): boolean {
    return this.roles.length > 1;
  }

  isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

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