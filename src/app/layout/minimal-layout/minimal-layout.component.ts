import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-minimal-layout',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './minimal-layout.component.html',
  styleUrl: './minimal-layout.component.scss'
})
export class MinimalLayoutComponent {

}
