import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePrComponent } from './profile-pr.component';

describe('ProfilePrComponent', () => {
  let component: ProfilePrComponent;
  let fixture: ComponentFixture<ProfilePrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilePrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
