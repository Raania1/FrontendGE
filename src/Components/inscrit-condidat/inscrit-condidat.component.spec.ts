import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscritCondidatComponent } from './inscrit-condidat.component';

describe('InscritCondidatComponent', () => {
  let component: InscritCondidatComponent;
  let fixture: ComponentFixture<InscritCondidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscritCondidatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InscritCondidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
