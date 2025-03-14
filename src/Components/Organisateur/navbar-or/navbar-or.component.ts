import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faLink,
  faChevronDown,
  faUser,
  faCog,
  faShieldAlt,
  faLightbulb,
  faSignOutAlt,
  faHeart,
  faBars
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-navbar-or',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,RouterLink],
  templateUrl: './navbar-or.component.html',
  styleUrl: './navbar-or.component.css'
})
export class NavbarORComponent {
  faSearch = faSearch;
  faInbox = faHeart;
  faChevronDown = faChevronDown;
  faUser = faUser;
  faCog = faCog;
  faShieldAlt = faShieldAlt;
  faLightbulb = faLightbulb;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  navItems = [
    { label: 'Acceuil', url: '/profileOR' },
    { label: 'Evènnements', url: '/events' },
    { label: 'Réservations', url: '/orders' },
    
  ];

  isDropdownOpen = false;
  isMobileMenuOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
