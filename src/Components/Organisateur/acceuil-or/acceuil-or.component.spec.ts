import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilORComponent } from './acceuil-or.component';

describe('AcceuilORComponent', () => {
  let component: AcceuilORComponent;
  let fixture: ComponentFixture<AcceuilORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilORComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcceuilORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
