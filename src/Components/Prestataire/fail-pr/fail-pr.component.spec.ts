import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailPrComponent } from './fail-pr.component';

describe('FailPrComponent', () => {
  let component: FailPrComponent;
  let fixture: ComponentFixture<FailPrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailPrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FailPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
