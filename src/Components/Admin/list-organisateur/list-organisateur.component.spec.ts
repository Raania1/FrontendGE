import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrganisateurComponent } from './list-organisateur.component';

describe('ListOrganisateurComponent', () => {
  let component: ListOrganisateurComponent;
  let fixture: ComponentFixture<ListOrganisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOrganisateurComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOrganisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
