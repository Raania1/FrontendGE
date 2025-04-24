import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
@Component({
  selector: 'app-navbar-or',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,RouterLink,HttpClientModule],
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
    { label: 'Acceuil', url: '/homeOr' },
    { label: 'Evènnements', url: '/creatEvent' },
    { label: 'Réservations', url: '/reservationsOR' },
    
  ];
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  constructor(private authService: OrganizerService,private router: Router) {}

  organisateur: any = {}; 
  formData = { ...this.organisateur };
  ngOnInit(): void {
    this.fetchOrganizerData();  
  }
  fetchOrganizerData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.authService.getOrganizerById(id).subscribe(
        (response) => {
          this.organisateur = response.organizer;  
          this.formData = { ...this.organisateur };  
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  deleteOrganizerById(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id; 
    if (confirm('Êtes-vous sûr de vouloir supprimer cet organisateur ?')) {
      this.authService.deleteOrganizerById(id).subscribe(
        (response) => {
          alert('Organisateur supprimé avec succès!');
          this.router.navigate(['/']); 
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Une erreur est survenue lors de la suppression de l\'organisateur.');
        }
      );
    }
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']); 
  }
}
