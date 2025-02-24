import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-base-layout',
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss'
})

export class BaseLayoutComponent {

}