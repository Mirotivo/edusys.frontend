import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../layout/customer/header-center/header-center.component';
import { FooterComponent } from '../../layout/landing/footer/footer.component';

@Component({
  selector: 'app-online-courses',
  imports: [HeaderCenterComponent, FooterComponent],
  templateUrl: './online-courses.component.html',
  styleUrl: './online-courses.component.scss'
})
export class OnlineCoursesComponent {

}
