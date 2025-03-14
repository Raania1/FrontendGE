import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOrComponent } from './profile-or.component';

describe('ProfileOrComponent', () => {
  let component: ProfileOrComponent;
  let fixture: ComponentFixture<ProfileOrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileOrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
