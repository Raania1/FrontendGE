import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationOrComponent } from './reservation-or.component';

describe('ReservationOrComponent', () => {
  let component: ReservationOrComponent;
  let fixture: ComponentFixture<ReservationOrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationOrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservationOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
