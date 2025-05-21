import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratPackComponent } from './contrat-pack.component';

describe('ContratPackComponent', () => {
  let component: ContratPackComponent;
  let fixture: ComponentFixture<ContratPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratPackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
