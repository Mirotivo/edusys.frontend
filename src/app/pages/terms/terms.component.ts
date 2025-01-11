import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  imports: [],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {
  platformName = 'Avancira';
  email = 'support@myplatform.com';
  address = '123 Tech Lane, Innovation City, Techland';
  phone = '+123 456 789';
  registrationNumber = '123456789';
  president = 'John Doe';
  hostingCompany = 'TechHost Inc.';
  hostingAddress = '456 Hosting Blvd, Server City, Cloudland';
}
