import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationPackAdComponent } from './reservation-pack-ad.component';

describe('ReservationPackAdComponent', () => {
  let component: ReservationPackAdComponent;
  let fixture: ComponentFixture<ReservationPackAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPackAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationPackAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
