import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  selector: 'app-header',
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
    
    CommonModule,
    RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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
}