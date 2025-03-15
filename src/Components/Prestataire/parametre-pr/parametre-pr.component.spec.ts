import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrePRComponent } from './parametre-pr.component';

describe('ParametrePRComponent', () => {
  let component: ParametrePRComponent;
  let fixture: ComponentFixture<ParametrePRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrePRComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrePRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
