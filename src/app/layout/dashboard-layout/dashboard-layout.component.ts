import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { HeaderCenterComponent } from '../customer/header-center/header-center.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { HeaderComponent } from '../landing/header/header.component';
import { ProfileImageComponent } from '../../components/profile-image/profile-image.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterModule, HeaderComponent, ProfileImageComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent implements OnInit {
  currentPage: string = 'Home'; // Default breadcrumb title
  user!: User;

  constructor(
      private userService: UserService,
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) { }


  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute.firstChild;
      console.log('First Child Route:', route); // Debugging log

      while (route?.firstChild) {
        route = route.firstChild;
        console.log('Navigating deeper:', route);
      }

      if (route?.snapshot.data['title']) {
        this.currentPage = route.snapshot.data['title']; // Get title from route data
        console.log('Updated Current Page:', this.currentPage); // Debugging log
      }
    });

    this.userService.getUser().subscribe({
      next: (userData) => (this.user = userData),
      error: (err) => console.error('Failed to load user data:', err),
    });
  }
}