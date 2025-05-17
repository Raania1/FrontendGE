import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessPrComponent } from './success-pr.component';

describe('SuccessPrComponent', () => {
  let component: SuccessPrComponent;
  let fixture: ComponentFixture<SuccessPrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessPrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuccessPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
