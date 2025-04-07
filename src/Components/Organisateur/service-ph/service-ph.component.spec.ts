import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePhComponent } from './service-ph.component';

describe('ServicePhComponent', () => {
  let component: ServicePhComponent;
  let fixture: ComponentFixture<ServicePhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePhComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicePhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
