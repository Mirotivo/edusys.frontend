import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
  platformName = 'Avancira';
  email = 'privacy@avancira.com';
  dpoEmail = 'dpo@avancira.com';
  address = '35 Cave Rd, Strathfield, Sydney, Australia';
  lastUpdated = '9 January 2025';
}
