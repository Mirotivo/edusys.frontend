import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvoicesComponent } from './new-invoices.component';

describe('NewInvoicesComponent', () => {
  let component: NewInvoicesComponent;
  let fixture: ComponentFixture<NewInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
