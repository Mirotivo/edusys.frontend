import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../components/header-center/header-center.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-states',
  imports: [HeaderCenterComponent, FooterComponent],
  templateUrl: './states.component.html',
  styleUrl: './states.component.scss'
})
export class StatesComponent {

}
