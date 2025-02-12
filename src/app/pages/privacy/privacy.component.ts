import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../layout/customer/header-center/header-center.component';

@Component({
  selector: 'app-privacy',
  imports: [HeaderCenterComponent],
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
