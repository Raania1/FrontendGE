import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesAdComponent } from './services-ad.component';

describe('ServicesAdComponent', () => {
  let component: ServicesAdComponent;
  let fixture: ComponentFixture<ServicesAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
