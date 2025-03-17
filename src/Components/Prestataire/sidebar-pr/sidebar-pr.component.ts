import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faTools, faBars, faCalendarCheck, faCalendarAlt, faBullhorn, faUser, faCog, faSignOutAlt, faInfoCircle, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-pr',
  standalone: true,
  imports: [FontAwesomeModule,FormsModule,CommonModule,RouterModule],
  templateUrl: './sidebar-pr.component.html',
  styleUrl: './sidebar-pr.component.css'
})
export class SidebarPRComponent {
  faChartBar = faChartBar;
  faTools = faTools;
  faCalendarCheck = faCalendarCheck;
  faCalendarAlt = faCalendarAlt;
  faBullhorn = faBullhorn;
  faUser = faUser;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faInfoCircle = faInfoCircle;
  faBars = faBars; 

  isSidebarOpen: boolean = false; 
  isSidebarCollapsed: boolean = false;
  isDesktop: boolean = window.innerWidth >= 768; 

  constructor() {}

  toggleSidebar() {
    if (this.isDesktop) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    } else {
      this.isSidebarOpen = !this.isSidebarOpen; 
    }
  }

  closeSidebar() {
    if (!this.isDesktop) {
      this.isSidebarOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.isSidebarOpen = true; 
      this.isSidebarCollapsed = false; 
    } else {
      this.isSidebarCollapsed = false; 
    }
  }
}
