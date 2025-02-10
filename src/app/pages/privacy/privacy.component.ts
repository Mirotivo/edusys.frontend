import { Component } from '@angular/core';
import { HeaderCenterComponent } from '../../components/header-center/header-center.component';
// Angular Material Design
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-privacy',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatRadioModule,
    MatSliderModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
    MatSidenavModule,
    HeaderCenterComponent
  ],
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
