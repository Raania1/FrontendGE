import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicitePrComponent } from './publicite-pr.component';

describe('PublicitePrComponent', () => {
  let component: PublicitePrComponent;
  let fixture: ComponentFixture<PublicitePrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicitePrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicitePrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
