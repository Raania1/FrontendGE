import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscritPresComponent } from './inscrit-pres.component';

describe('InscritPresComponent', () => {
  let component: InscritPresComponent;
  let fixture: ComponentFixture<InscritPresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscritPresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InscritPresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
