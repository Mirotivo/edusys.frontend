import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-footer-layout',
  imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
  templateUrl: './footer-layout.component.html',
  styleUrl: './footer-layout.component.scss'
})

export class FooterLayoutComponent {

}