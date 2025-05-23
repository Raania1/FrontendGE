import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faTools, faClipboardList, faBars, faCalendarCheck, faCalendarAlt, faBullhorn, faUser, faCog, faSignOutAlt, faInfoCircle, faChevronRight, faChevronLeft, faBoxOpen, faChartLine, faComments, faFileInvoice, faListAlt, faUserFriends, faUsers, faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar-ad',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './sidebar-ad.component.html',
  styleUrl: './sidebar-ad.component.css'
})
export class SidebarAdComponent {
  faBell = faBell;
  faChartBar = faChartBar;
  faUser = faUser;
  faUsers = faUsers;
  faUserFriends = faUserFriends;
  faBoxOpen = faClipboardList;
  faListAlt = faListAlt;
  faComments = faComments;
  faFileInvoice = faFileInvoice;
  faChartLine = faChartLine;
  faBullhorn = faBullhorn;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  isSidebarOpen: boolean = false; 
  isSidebarCollapsed: boolean = false;
  isDesktop: boolean = window.innerWidth >= 768; 
  showReservationSubMenu: boolean = false;
  showContractSubMenu: boolean = false; // New flag for Contrats & Paiement sub-menu

  constructor(private router: Router) {}

  toggleReservationSubMenu() {
    this.showReservationSubMenu = !this.showReservationSubMenu;
    if (this.showReservationSubMenu) {
      this.showContractSubMenu = false; // Close the other sub-menu
    }
  }

  toggleContractSubMenu() {
    this.showContractSubMenu = !this.showContractSubMenu;
    if (this.showContractSubMenu) {
      this.showReservationSubMenu = false; // Close the other sub-menu
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']); 
  }

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