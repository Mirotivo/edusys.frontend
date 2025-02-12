import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../layout/customer/header-center/header-center.component';
import { FooterComponent } from '../../layout/landing/footer/footer.component';

@Component({
  selector: 'app-states',
  imports: [HeaderCenterComponent, FooterComponent],
  templateUrl: './states.component.html',
  styleUrl: './states.component.scss'
})
export class StatesComponent {

}
