import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarORComponent } from './navbar-or.component';

describe('NavbarORComponent', () => {
  let component: NavbarORComponent;
  let fixture: ComponentFixture<NavbarORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarORComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
