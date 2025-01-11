import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
  platformName = 'Avancira';
  email = 'privacy@myplatform.com';
  dpoEmail = 'dpo@myplatform.com';
  address = '51 rue du Faubourg Saint-Denis, 75010 Paris, France';
  lastUpdated = '23 July 2020';
}
