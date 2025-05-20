import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPackComponent } from './reservation-pack.component';

describe('ReservationPackComponent', () => {
  let component: ReservationPackComponent;
  let fixture: ComponentFixture<ReservationPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
