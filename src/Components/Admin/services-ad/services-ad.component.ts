import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faTimes, faInfoCircle, faSpinner, faFilter, faSearch, faCheckCircle, faClock, faLayerGroup, faEye, faTrash, faBan, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { ServicesPrComponent } from '../../Prestataire/services-pr/services-pr.component';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';

@Component({
  selector: 'app-services-ad',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule,FormsModule],
  templateUrl: './services-ad.component.html',
  styleUrl: './services-ad.component.css'
})
export class ServicesAdComponent { 
   faClock = faClock;
   faCheckCircle = faCheckCircle;
   faSearch = faSearch;
   faInfoCircle = faInfoCircle;
   faCheck = faCheck;
   faTimes = faTimes;
   faSpinner = faSpinner;
   faLayerGroup =faLayerGroup;
   faEye = faEye;  
   faTrash = faTrash;
   faBan  = faBan ;

  //  services = [
  //   {
  //     id: 1,
  //     nom: "Service de plomberie",
  //     description: "Réparation de fuites et installation sanitaire",
  //     prestataire: { 
  //       nom: "Dupont", 
  //       prenom: "Jean", 
  //       email: "jean.dupont@example.com",
  //       avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  //     },
  //     approoved: false,
  //     createdAt: new Date('2023-05-15'),
  //     prix: 120,
  //     promo: 10,
  //     type: "standard",
  //     photoCouverture: "https://source.unsplash.com/random/300x200/?plumbing",
  //     photos: [
  //       "https://source.unsplash.com/random/300x200/?plumbing1",
  //       "https://source.unsplash.com/random/300x200/?plumbing2",
  //       "https://source.unsplash.com/random/300x200/?plumbing3"
  //     ]
  //   },
  //   {
  //     id: 2,
  //     nom: "Service de jardinage",
  //     description: "Tonte de pelouse et entretien des espaces verts",
  //     prestataire: { 
  //       nom: "Martin", 
  //       prenom: "Sophie", 
  //       email: "sophie.martin@example.com",
  //       avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  //     },
  //     approoved: true,
  //     createdAt: new Date('2023-06-20'),
  //     prix: 80,
  //     promo: 0,
  //     type: "basique",
  //     photoCouverture: "https://source.unsplash.com/random/300x200/?gardening",
  //     photos: [
  //       "https://source.unsplash.com/random/300x200/?gardening1",
  //       "https://source.unsplash.com/random/300x200/?gardening2"
  //     ]
  //   }
  // ];
  
  selectedService: any = null;
  showModal = false;
  searchTerm = '';
  selectedImageIndex = 0;
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
  nextImage(): void {
    if (this.selectedService) {
      this.selectedImageIndex = 
        (this.selectedImageIndex + 1) % this.selectedService.Photos.length;
    }
  }
  prevImage(): void {
    if (this.selectedService) {
      this.selectedImageIndex = 
        (this.selectedImageIndex - 1 + this.selectedService.Photos.length) % 
        this.selectedService.Photos.length;
    }
  }
 
  tabs = [
    { key: 'all', label: 'Tous les services', icon: this.faLayerGroup },
    { key: 'PENDING', label: 'En attente', icon: this.faClock },
    { key: 'CONFIRMED', label: 'Activés', icon: this.faCheckCircle },
    { key: 'CANCELED', label: 'Refusées', icon: this.faBan  },
    { key: 'DISABLED', label: 'Désactivés', icon: this.faBan  }
  ];
  
activeTab = 'all';
  constructor(private service: ServiceService,private prestataireService:PrestataireService) {}
  services: any = [];
  filteredServices:any = [];
ngOnInit(): void {
  this.fetchservices();
}
async fetchservices() {
  try {
    const response = await this.service.getAllPres().toPromise();
    this.services = response.services || [];
    
    const prestatairePromises = this.services.map(async (service:any) => {
      if (service.Prestataireid) {
        try {
          const prestataireResponse = await this.prestataireService.getPrestataireById(service.Prestataireid)
            .toPromise();
          service.prestataire = prestataireResponse.pres;
        } catch (error) {
          console.error('Erreur prestataire:', error);
          service.prestataire = {};
        }
      }
      return Promise.resolve();
    });
    
    await Promise.all(prestatairePromises);
    this.filterServices();
    
  } catch (error) {
    console.error('Erreur services:', error);
  }
}

filterServices(): void {
  this.filteredServices = this.services.filter((service:any) => {
    const matchesSearch = service.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                        service.description.toLowerCase().includes(this.searchTerm.toLowerCase());
    
    let matchesTab = true;
    switch (this.activeTab) {
      case 'PENDING':
        matchesTab = service.Status === 'PENDING';
        break;
      case 'CONFIRMED':
        matchesTab = service.Status === 'CONFIRMED';
        break;
      case 'CANCELED':
        matchesTab = service.Status === 'CANCELED';
      break;
      case 'DISABLED':
        matchesTab = service.Status === 'DISABLED';
      break;
    }
    
    return matchesSearch && matchesTab;
  });
}

setActiveTab(tabKey: string): void {
  this.activeTab = tabKey;
  this.filterServices();
}
 
openModal(service: any): void {
     this.selectedService = service;
     console.log("Service sélectionné :", this.selectedService);

     this.showModal = true;
   }
closeModal(): void {
     this.showModal = false;
   }
 
isApproveDialogOpen = false;
serviceToApprove: any = null;
approveService(service: any): void {
  this.serviceToApprove = service;
  this.isApproveDialogOpen = true;
}

confirmApprove(): void {
  if (!this.serviceToApprove) return;

  const id = this.serviceToApprove.id;
  this.service.approveService(id, true).subscribe({
    next: (response) => {
      const updated = this.services.find((s: any) => s.id === id);
      if (updated) {
        updated.approoved = true;
        this.filterServices();
      }
      console.log('Service approuvé :', response);
      this.isApproveDialogOpen = false;
      this.serviceToApprove = null;
    },
    error: (err) => {
      console.error(`Erreur lors de l'approbation du service :`, err);
      this.isApproveDialogOpen = false;
    }
  });
}
isDeleteDialogOpen = false;
serviceToDelete: any = null;
rejectService(service: any): void {
  this.serviceToDelete = service;
  this.isDeleteDialogOpen = true;
}
deleteService(): void {
  if (!this.serviceToDelete) return;

  const id = this.serviceToDelete.id;
  this.service.deleteService(id).subscribe({
    next: (response) => {
      console.log('Service supprimé:', response);
      this.services = this.services.filter((service: any) => service.id !== id);
      this.filterServices();
      this.isDeleteDialogOpen = false;
      this.serviceToDelete = null;
    },
    error: (err) => {
      console.error('Erreur lors de la suppression du service:', err);
      this.isDeleteDialogOpen = false;
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

  // Calcul du prix après réduction
  calculateDiscountedPrice(service: any): string {
    if (service.promo > 0) {
      return this.formatPrice(service.prix * (1 - service.promo/100));
    }
    return this.formatPrice(service.prix);
  }
  isCancelDialogOpen = false;
  serviceToCanceled: any = null;
  openCancelDialog(service: any): void {
    this.serviceToCanceled = service;
    this.isCancelDialogOpen = true;
  }
  
  cancelService(): void {
    if (!this.serviceToCanceled) return;
  
    const id = this.serviceToCanceled.id;
    this.service.cancelService(id).subscribe({
      next: (response) => {
        const updated = this.services.find((s: any) => s.id === id);
        if (updated) {
          this.filterServices();
        }
        console.log('Service refusé :', response);
        this.isCancelDialogOpen = false;
        this.serviceToCanceled = null;
      },
      error: (err) => {
        console.error(`Erreur lors de l'approbation du service :`, err);
        this.isCancelDialogOpen = false;
      }
    });
  }
}
