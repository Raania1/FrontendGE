import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubliciteAdComponent } from './publicite-ad.component';

describe('PubliciteAdComponent', () => {
  let component: PubliciteAdComponent;
  let fixture: ComponentFixture<PubliciteAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliciteAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PubliciteAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
