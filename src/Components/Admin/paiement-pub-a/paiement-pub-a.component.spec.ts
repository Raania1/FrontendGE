import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementPubAComponent } from './paiement-pub-a.component';

describe('PaiementPubAComponent', () => {
  let component: PaiementPubAComponent;
  let fixture: ComponentFixture<PaiementPubAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementPubAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaiementPubAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
