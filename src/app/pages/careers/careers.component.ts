import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../components/header-center/header-center.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-careers',
  imports: [HeaderCenterComponent, FooterComponent],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss'
})
export class CareersComponent {

}
