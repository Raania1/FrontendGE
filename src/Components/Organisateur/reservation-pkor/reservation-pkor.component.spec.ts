import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPKORComponent } from './reservation-pkor.component';

describe('ReservationPKORComponent', () => {
  let component: ReservationPKORComponent;
  let fixture: ComponentFixture<ReservationPKORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPKORComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationPKORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
