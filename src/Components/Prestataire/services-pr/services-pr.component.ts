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
    { key: 'CONFIRMED', label: 'Activés', icon: faCheckCircle },
    { key: 'PENDING', label: 'En attente', icon: faClock },
    { key: 'CANCELED', label: 'Réfusés', icon: faClock },
    { key: 'DISABLED', label: 'Désactivés', icon: faClock },

    

  ];

  // Filtre les services selon l'onglet actif
  get filteredServices() {
    return this.getFilteredServices(this.activeTab);
  }

  getFilteredServices(tabKey: string) {
    switch(tabKey) {
      case 'CONFIRMED':
        return this.services.filter(s => s.Status === "CONFIRMED");
      case 'PENDING':
        return this.services.filter(s => s.Status === "PENDING");
        case 'CANCELED':
        return this.services.filter(s => s.Status === "CANCELED");
        case 'DISABLED':
        return this.services.filter(s => s.Status === "DISABLED");
        
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


  // Actions
  editService(id: string) {
    this.router.navigate(['/prestataire/EditService', id]);
  }
  isDeleteDialogOpen = false;
  serviceToDelete: any = null;
  openDeleteDialog(service: any): void {
    this.serviceToDelete = service;
    this.isDeleteDialogOpen = true;
  }



  confirmDelete(): void {
    if (!this.serviceToDelete) return;
  
    const id = this.serviceToDelete.id;
    this.service.deleteService(id).subscribe({
      next: (response) => {
        console.log('Service supprimé:', response);
        this.services = this.services.filter((service: any) => service.id !== id);
        this.fetchPresData()
        this.isDeleteDialogOpen = false;
        this.serviceToDelete = null;
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du service:', err);
        this.isDeleteDialogOpen = false;
      }
    });
  }

  isDisableDialogOpen = false;
  serviceToDisabel: any = null;
  openDesabelDialog(service: any): void {
    this.serviceToDisabel = service;
    this.isDisableDialogOpen = true;
  }
  DesabelService(): void {
    if (!this.serviceToDisabel) return;
  
    const id = this.serviceToDisabel.id;
    this.service.desabelService(id).subscribe({
      next: (response) => {
        const updated = this.services.find((s: any) => s.id === id);
        if (updated) {
          this.fetchPresData();
        }
        console.log('Service refusé :', response);
        this.isDisableDialogOpen = false;
        this.serviceToDisabel = null;
      },
      error: (err) => {
        console.error(`Erreur lors de l'approbation du service :`, err);
        this.isDisableDialogOpen = false;
      }
    });
  }

  isActiveDialogOpen = false;
  serviceToActivate: any = null;
  openActivateDialog(service: any): void {
    this.serviceToActivate = service;
    this.isActiveDialogOpen = true;
  }
  ActivateService(): void {
    if (!this.serviceToActivate) return;
  
    const serviceId = this.serviceToActivate.id;
    this.service.activateService(serviceId).subscribe({
      next: (response) => {
        const updated = this.services.find((s: any) => s.id === serviceId);
        if (updated) {
          this.fetchPresData();
        }
        console.log('Service refusé :', response);
        this.isActiveDialogOpen = false;
        this.serviceToActivate = null;
      },
      error: (err) => {
        console.error(`Erreur lors de l'approbation du service :`, err);
        this.isActiveDialogOpen = false;
      }
    });
  }

}

