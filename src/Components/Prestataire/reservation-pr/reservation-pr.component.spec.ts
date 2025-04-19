import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPrComponent } from './reservation-pr.component';

describe('ReservationPrComponent', () => {
  let component: ReservationPrComponent;
  let fixture: ComponentFixture<ReservationPrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
