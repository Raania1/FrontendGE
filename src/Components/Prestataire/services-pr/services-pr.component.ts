import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { faBell, faUser, faTrash, faPlus, faBoxOpen, faCheckCircle, faClock, faEdit, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FormsModule, NgModel } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../Services/service.service';

@Component({
  selector: 'app-services-pr',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule, RouterLink, CommonModule],
  templateUrl: './services-pr.component.html',
  styleUrl: './services-pr.component.css'
})
export class ServicesPrComponent {
  faBell = faBell;
  faUser = faUser;
  faTrash = faTrash;
  faplus = faPlus;
  activeTab: string = 'tous';

  @Output() tabChange = new EventEmitter<string>();

  constructor(
    private prestataireService: PrestataireService,
    private service: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  prestataire: any = {};
  formData = { ...this.prestataire };
  services: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.fetchPresData();  
  }

  fetchPresData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.prestataireService.getPrestataireById(id).subscribe(
        (response) => {
          this.prestataire = response.pres;  
          this.formData = { ...this.prestataire };  
          this.services = this.prestataire.Services || [];
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  // Icônes
  faPlus = faPlus;
  faEdit = faEdit;
  faBoxOpen = faBoxOpen;

  // Onglets
  tabs = [
    { key: 'tous', label: 'Tous', icon: faLayerGroup },
    { key: 'acceptés', label: 'Acceptés', icon: faCheckCircle },
    { key: 'en attente', label: 'En attente', icon: faClock }
  ];

  // Filtre les services selon l'onglet actif
  get filteredServices() {
    return this.getFilteredServices(this.activeTab);
  }

  getFilteredServices(tabKey: string) {
    switch(tabKey) {
      case 'acceptés':
        return this.services.filter(s => s.approoved);
      case 'en attente':
        return this.services.filter(s => !s.approoved);
      default:
        return this.services;
    }
  }

  // Gestion des onglets
  setActiveTab(tabKey: string) {
    this.activeTab = tabKey;
  }

  getTabClasses(tab: any) {
    const isActive = this.activeTab === tab.key;
    return {
      'text-amber-600 border-b-2 border-amber-600': isActive,
      'text-gray-500 hover:text-gray-800': !isActive,
      'border-transparent': !isActive
    };
  }

  // Formatage des prix en TND
  formatPrice(price: number): string {
    if (isNaN(price)) return '0 DT';
    
    const isWholeNumber = price % 1 === 0;
    
    return new Intl.NumberFormat('fr-FR', {
      style: isWholeNumber ? 'decimal' : 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: isWholeNumber ? 0 : 3
    }).format(price) + (isWholeNumber ? ' DT' : '');
  }

  // Calcul du prix après réduction
  calculateDiscountedPrice(service: any): string {
    if (service.promo > 0) {
      return this.formatPrice(service.prix * (1 - service.promo/100));
    }
    return this.formatPrice(service.prix);
  }

  // Libellé du type de service
  // getTypeLabel(type: string) {
  //   const types: {[key: string]: string} = {
  //     'premium': 'Premium',
  //     'standard': 'Standard',
  //     'default_type': 'Basique'
  //   };
  //   return types[type] || type;
  // }

  // Actions
  editService(id: string) {
    this.router.navigate(['/prestataire/EditService', id]);
  }

  confirmDelete(id: string) {
    if(confirm('Voulez-vous vraiment supprimer ce service ? Cette action est irréversible.')) {
      this.isLoading = true;
      
      this.service.deleteService(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Service supprimé avec succès';
          
          setTimeout(() => {
            this.router.navigate(['/services']);
            this.successMessage = '';
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la suppression du service';
          console.error('Erreur:', err);
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }
}