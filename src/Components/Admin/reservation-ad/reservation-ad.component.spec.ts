import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAdComponent } from './reservation-ad.component';

describe('ReservationAdComponent', () => {
  let component: ReservationAdComponent;
  let fixture: ComponentFixture<ReservationAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
