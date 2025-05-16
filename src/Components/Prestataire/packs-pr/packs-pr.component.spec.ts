import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacksPrComponent } from './packs-pr.component';

describe('PacksPrComponent', () => {
  let component: PacksPrComponent;
  let fixture: ComponentFixture<PacksPrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacksPrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacksPrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
