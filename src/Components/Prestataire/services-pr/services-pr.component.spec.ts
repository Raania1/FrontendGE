import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPrComponent } from './services-pr.component';

describe('ServicesPrComponent', () => {
  let component: ServicesPrComponent;
  let fixture: ComponentFixture<ServicesPrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesPrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
