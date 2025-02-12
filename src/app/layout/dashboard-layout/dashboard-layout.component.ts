import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent implements OnInit {
  currentPage: string = 'Home'; // Default breadcrumb title

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }


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
  }
}