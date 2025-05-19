import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationFormPackComponent } from './reservation-form-pack.component';

describe('ReservationFormPackComponent', () => {
  let component: ReservationFormPackComponent;
  let fixture: ComponentFixture<ReservationFormPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationFormPackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationFormPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
