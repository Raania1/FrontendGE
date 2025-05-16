import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { faBell, faUser, faTrash, faPlus, faEdit, faBoxOpen, faLayerGroup, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { ServiceService } from '../../../Services/service.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PubliciteService } from '../../../Services/publicite.service';

@Component({
  selector: 'app-packs-pr',
  standalone: true,
  imports: [FontAwesomeModule,FormsModule, RouterLink,CommonModule],
  templateUrl: './packs-pr.component.html',
  styleUrl: './packs-pr.component.css'
})
export class PacksPrComponent {
  faBell = faBell;
  faUser = faUser;
  faTrash = faTrash;
  faPlus = faPlus;
  faEdit = faEdit;
  faBoxOpen = faBoxOpen;
  

  activeTab: string = 'tous';

  @Output() tabChange = new EventEmitter<string>();

  constructor(
    private prestataireService: PrestataireService,
    private service: ServiceService,
    private route: ActivatedRoute,
    private pubService:PubliciteService,
    private router: Router,
  ) {}

  prestataire: any = {};
  formData = { ...this.prestataire };
  packs: any[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.fetchPresData();
  }

 showAdvertisement = true;

removeAdvertisement(): void {
  setTimeout(() => {
    this.showAdvertisement = false;
  }, 300); 
}


  fetchPresData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.prestataireService.getPrestataireById(id).subscribe(
        (response) => {
          this.prestataire = response.pres;
          this.formData = { ...this.prestataire };
          this.packs = this.prestataire.Pack || [];
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  tabs = [
    { key: 'tous', label: 'Tous', icon: faLayerGroup },
    { key: 'CONFIRMED', label: 'Activés', icon: faCheckCircle },
    { key: 'PENDING', label: 'En attente', icon: faClock },
    { key: 'CANCELED', label: 'Réfusés', icon: faClock },
    { key: 'DISABLED', label: 'Désactivés', icon: faClock },
  ];

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

  getFilteredPacks(): any[] {
    if (this.activeTab === 'tous') {
      return this.packs;
    }
    return this.packs.filter(pack => pack.status === this.activeTab);
  }
  selectedPackId: string | null = null;
showConfirmationModal: boolean = false;


  openConfirmationModal(packId: string): void {
  this.selectedPackId = packId;
  this.showConfirmationModal = true;
}

closeConfirmationModal(): void {
  this.selectedPackId = null;
  this.showConfirmationModal = false;
}

confirmCreatePublicite(): void {
  if (!this.selectedPackId) return;

  this.successMessage = '';
  this.errorMessage = '';

  this.pubService.createPubliciteForPack(this.selectedPackId).subscribe({
    next: (res) => {
      this.successMessage = 'Demande Publicité envoyée avec succès.';
      this.showConfirmationModal = false;
      setTimeout(() => (this.successMessage = ''), 4000);
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Erreur lors de la création de la publicité.';
      this.showConfirmationModal = false;
      setTimeout(() => (this.errorMessage = ''), 4000);
    }
  });
}


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

  calculateDiscountedPrice(service: any): string {
    if (service.promo > 0) {
      return this.formatPrice(service.prix * (1 - service.promo / 100));
    }
    return this.formatPrice(service.prix);
  }

  editPack(id: string) {
    this.router.navigate(['/prestataire/EditPack', id]);
  }



 

}


