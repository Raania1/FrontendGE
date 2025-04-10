import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresDetailsComponent } from './pres-details.component';

describe('PresDetailsComponent', () => {
  let component: PresDetailsComponent;
  let fixture: ComponentFixture<PresDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
