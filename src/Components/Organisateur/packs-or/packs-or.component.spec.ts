import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacksORComponent } from './packs-or.component';

describe('PacksORComponent', () => {
  let component: PacksORComponent;
  let fixture: ComponentFixture<PacksORComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacksORComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacksORComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
