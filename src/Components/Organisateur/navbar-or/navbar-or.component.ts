import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
import { OrganizerService } from '../../../Services/organizer.service';
import { HttpClientModule } from '@angular/common/http';

interface NavItem {
  label: string;
  url?: string;
  children?: { label: string; url: string }[];
}

@Component({
  selector: 'app-navbar-or',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterLink, HttpClientModule],
  templateUrl: './navbar-or.component.html',
  styleUrl: './navbar-or.component.css'
})
export class NavbarORComponent implements OnInit {
  faSearch = faSearch;
  faInbox = faHeart;
  faChevronDown = faChevronDown;
  faUser = faUser;
  faCog = faCog;
  faShieldAlt = faShieldAlt;
  faLightbulb = faLightbulb;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;

  navItems: NavItem[] = [
    { label: 'Acceuil', url: '/homeOr' },
    { label: 'Evènnements', url: '/creatEvent' },
    {
      label: 'Réservations',
      children: [
        { label: 'Réservations Services', url: '/reservationsOR' },
        { label: 'Réservations Packs', url: '/reservationsORP' }
      ]
    },
    { label: 'Packs Publicitaires', url: '/packsOR' }
  ];

  isDropdownOpen = false;
  isMobileMenuOpen = false;
  openSubMenu: string | null = null; // Track which submenu is open

  constructor(private authService: OrganizerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrganizerData();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSubMenu(label: string): void {
    // Toggle submenu: open if closed, close if open, close others
    this.openSubMenu = this.openSubMenu === label ? null : label;
  }

  fetchOrganizerData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.authService.getOrganizerById(id).subscribe({
        next: (response) => {
          this.organisateur = response.organizer;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      });
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  deleteOrganizerById(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;
    if (confirm('Êtes-vous sûr de vouloir supprimer cet organisateur ?')) {
      this.authService.deleteOrganizerById(id).subscribe({
        next: () => {
          alert('Organisateur supprimé avec succès!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Une erreur est survenue lors de la suppression de l\'organisateur.');
        }
      });
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  organisateur: any = {};
}