import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPRComponent } from './sidebar-pr.component';

describe('SidebarPRComponent', () => {
  let component: SidebarPRComponent;
  let fixture: ComponentFixture<SidebarPRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarPRComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarPRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
