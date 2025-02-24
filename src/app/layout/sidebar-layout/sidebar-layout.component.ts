import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";

@Component({
  selector: 'app-sidebar-layout',
  imports: [RouterOutlet, RouterModule, SidebarComponent],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.scss'
})
export class SidebarLayoutComponent {

}