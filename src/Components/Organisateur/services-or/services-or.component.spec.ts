import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesOrComponent } from './services-or.component';

describe('ServicesOrComponent', () => {
  let component: ServicesOrComponent;
  let fixture: ComponentFixture<ServicesOrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesOrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
