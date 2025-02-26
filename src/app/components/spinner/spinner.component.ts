import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-spinner',
  imports:[CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  loading$;

  constructor(private spinnerService: SpinnerService) {
    this.loading$ = this.spinnerService.loading$;
  }
}
