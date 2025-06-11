import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordAComponent } from './dashbord-a.component';

describe('DashbordAComponent', () => {
  let component: DashbordAComponent;
  let fixture: ComponentFixture<DashbordAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbordAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashbordAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
