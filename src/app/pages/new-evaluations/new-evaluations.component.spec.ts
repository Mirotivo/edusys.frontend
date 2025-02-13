import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEvaluationsComponent } from './new-evaluations.component';

describe('NewEvaluationsComponent', () => {
  let component: NewEvaluationsComponent;
  let fixture: ComponentFixture<NewEvaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEvaluationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
