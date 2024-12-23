import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-premium',
  imports: [HeaderComponent],
  templateUrl: './premium.component.html',
  styleUrl: './premium.component.scss'
})
export class PremiumComponent {
  constructor(private router: Router) {}

  // Navigate to the subscribe-premium page
  navigateToSubscribePremium(): void {
    this.router.navigate(['/subscribe-premium']);
  }

}
