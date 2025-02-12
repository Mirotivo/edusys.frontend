import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../layout/customer/header-center/header-center.component';

@Component({
  selector: 'app-about-us',
  imports: [HeaderCenterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  platformName: string = 'Avancira';
  email: string = 'support@avancira.com';
  phone: string = '+61 4688 90 677';
  address: string = '35 Cave Rd, Strathfield, Sydney';
  president: string = 'Amr Badr';
  registrationNumber: string = '683 548 763';
}
