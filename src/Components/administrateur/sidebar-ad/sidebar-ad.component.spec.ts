import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdComponent } from './sidebar-ad.component';

describe('SidebarAdComponent', () => {
  let component: SidebarAdComponent;
  let fixture: ComponentFixture<SidebarAdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarAdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
