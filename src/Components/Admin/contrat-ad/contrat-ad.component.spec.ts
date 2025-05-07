import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratAdComponent } from './contrat-ad.component';

describe('ContratAdComponent', () => {
  let component: ContratAdComponent;
  let fixture: ComponentFixture<ContratAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContratAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
