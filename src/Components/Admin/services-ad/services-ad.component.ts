import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faTimes, faInfoCircle, faSpinner, faFilter, faSearch, faCheckCircle, faClock, faLayerGroup, faEye, faTrash, faBan, faEllipsisV, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { AdminService } from '../../../Services/admin.service';

@Component({
  selector: 'app-services-ad',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
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
  faLayerGroup = faLayerGroup;
  faEye = faEye;  
  faTrash = faTrash;
  faBan = faBan;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  selectedService: any = null;
  showModal = false;
  searchTerm = '';
  selectedImageIndex = 0;
adminInfo: any = {};
formData = {
      nom: '',
      prenom: '',
      email: ''
    };
  // Pagination 
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  tabs = [
    { key: 'all', label: 'Tous les services', icon: this.faLayerGroup },
    { key: 'PENDING', label: 'En attente', icon: this.faClock },
    { key: 'CONFIRMED', label: 'Activés', icon: this.faCheckCircle },
    { key: 'CANCELED', label: 'Refusées', icon: this.faBan },
    { key: 'DISABLED', label: 'Désactivés', icon: this.faBan }
  ];
  
  activeTab = 'all';
  constructor(private service: ServiceService, private prestataireService: PrestataireService,private adminService: AdminService) {}
  services: any = [];
  filteredServices: any = [];
  paginatedServices: any = [];

  ngOnInit(): void {
    this.fetchservices();
    this.fetchAdminInfo();
  }
  fetchAdminInfo() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const adminId = user.Id; 
  if (adminId) {
    this.adminService.getAdminById(adminId).subscribe(
      (response) => {
        this.adminInfo = response.admin;
                  this.formData = { ...this.adminInfo };  

        console.log('Admin récupéré:', this.adminInfo);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l’admin:', error);
      }
    );
  }
}
  async fetchservices() {
    try {
      const response = await this.service.getAllPres().toPromise();
      this.services = response.services || [];
      
      const prestatairePromises = this.services.map(async (service: any) => {
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

  get pendingCount(): number {
    return this.services.filter((s: any) => s.Status === 'PENDING').length;
  }

  get publicCount(): number {
    return this.services.filter((s: any) => s.Status === 'CONFIRMED').length;
  }

  filterServices(): void {
    this.filteredServices = this.services.filter((service: any) => {
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

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredServices.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedServices = this.filteredServices.slice(startIndex, endIndex);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; 
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  setActiveTab(tabKey: string): void {
    this.activeTab = tabKey;
    this.currentPage = 1;
    this.filterServices();
  }
 
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