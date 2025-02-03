import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../components/header-center/header-center.component';

@Component({
  selector: 'app-terms',
  imports: [HeaderCenterComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {
  platformName = 'Avancira';
  email = 'support@avancira.com';
  address = '35 Cave Rd, Strathfield, Sydney';
  phone = '+61 4688 90 677';
  registrationNumber = '683 548 763';
  president = 'Amr Badr';
}
