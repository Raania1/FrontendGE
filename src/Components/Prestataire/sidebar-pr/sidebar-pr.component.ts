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
  // Icônes
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
  faBars = faBars; // Icône du menu hamburger

  // États
  isSidebarOpen: boolean = false; // Sidebar fermée par défaut sur mobile
  isSidebarCollapsed: boolean = false; // Sidebar non réduite par défaut
  isDesktop: boolean = window.innerWidth >= 768; // Détecte si l'écran est un desktop

  constructor() {}

  // Basculer l'état de la sidebar (ouvert/fermé sur mobile, réduit/étendu sur desktop)
  toggleSidebar() {
    if (this.isDesktop) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed; // Réduire/étendre sur desktop
    } else {
      this.isSidebarOpen = !this.isSidebarOpen; // Ouvrir/fermer sur mobile
    }
  }

  // Fermer la sidebar sur mobile
  closeSidebar() {
    if (!this.isDesktop) {
      this.isSidebarOpen = false;
    }
  }

  // Détecter la taille de l'écran
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.isSidebarOpen = true; // Toujours afficher la sidebar sur desktop
      this.isSidebarCollapsed = false; // Ne pas réduire la sidebar sur desktop
    } else {
      this.isSidebarCollapsed = false; // Ne pas réduire la sidebar sur mobile
    }
  }
}
