import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser, faTrash, faSearch, faCheck, faTimes, faFilePdf, faUsersSlash, faCheckCircle, faClock, faLayerGroup, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../Services/reservation.service';
import { AdminService } from '../../../Services/admin.service';

@Component({
  selector: 'app-list-prestataire',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './list-prestataire.component.html',
  styleUrls: ['./list-prestataire.component.css']
})
export class ListPrestataireComponent {
  faBell = faBell;
  faUser = faUser;
  faTrash = faTrash;
  faSearch = faSearch;
  faCheck = faCheck;
  faTimes = faTimes;
  faUsersSlash = faUsersSlash;
  faFilePdf = faFilePdf;
  faLayerGroup = faLayerGroup;
  faCheckCircle = faCheckCircle;
  faClock = faClock;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  pres: any[] = [];
  presA: any[] = [];
  currentFilter: 'TOUS' | 'PENDING' | 'CONFIRMED' | 'DISABLED' = 'TOUS';
  searchTerm: string = '';
  showAll: boolean = true;

  currentPage: number = 1;
  itemsPerPage: number = 10; 
  totalPages: number = 1;
adminInfo: any = {};
formData = {
      nom: '',
      prenom: '',
      email: ''
    };
  constructor(private presService: PrestataireService, private reservation: ReservationService,private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchPres();
        this.fetchAdminInfo();
    this.fetchPresN();
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

  fetchPres() {
    this.presService.getAllPres().subscribe(
      (response) => {
        this.pres = response.pres;
        this.updatePagination();
      },
      (error) => {
        console.error('Erreur lors de la récupération des prestataires:', error);
      }
    );
  }

  fetchPresN() {
    this.presService.getAllPresN().subscribe(
      (response) => {
        this.presA = response.prestataires;
        this.updatePagination();
      },
      (error) => {
        console.error('Erreur lors de la récupération des prestataires en attente:', error);
      }
    );
  }

  // Pagination methods
  updatePagination() {
    this.totalPages = Math.ceil(this.totalFilteredPrestataires / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  onItemsPerPageChange() {
    this.currentPage = 1; // Reset to first page when items per page changes
    this.updatePagination();
  }

  // Filtrage et recherche
  setFilter(filter: 'TOUS' | 'PENDING' | 'CONFIRMED' | 'DISABLED'): void {
    this.currentFilter = filter;
    this.showAll = filter === 'TOUS' || filter === 'CONFIRMED' || filter === 'DISABLED' || filter === 'PENDING';
    this.currentPage = 1;
    this.updatePagination();
  }

  get filteredPrestataires() {
    let list: any[];
    if (this.currentFilter === 'PENDING') {
      list = this.pres.filter(p => p.Status === 'PENDING');
    } else if (this.currentFilter === 'CONFIRMED') {
      list = this.pres.filter(p => p.Status === 'CONFIRMED');
    } else if (this.currentFilter === 'DISABLED') {
      list = this.pres.filter(p => p.Status === 'DISABLED');
    } else {
      list = this.pres;
    }
    return this.filterList(list).slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  get totalFilteredPrestataires() {
    let list: any[];
    if (this.currentFilter === 'PENDING') {
      list = this.pres.filter(p => p.Status === 'PENDING');
    } else if (this.currentFilter === 'CONFIRMED') {
      list = this.pres.filter(p => p.Status === 'CONFIRMED');
    } else if (this.currentFilter === 'DISABLED') {
      list = this.pres.filter(p => p.Status === 'DISABLED');
    } else {
      list = this.pres;
    }
    return this.filterList(list).length;
  }

  selectedPrestataire: any = null;
  isProfileModalOpen: boolean = false;
  reservationsCount: number = 0;

  openProfileModal(prestataire: any) {
    this.selectedPrestataire = prestataire;
    this.isProfileModalOpen = true;

    this.reservation.count(prestataire.id).subscribe(
      (response) => this.reservationsCount = response.count,
      (error) => console.error('Erreur récupération réservations:', error)
    );
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
    this.selectedPrestataire = null;
  }

  private filterList(list: any[]) {
    if (!this.searchTerm) {
      return list;
    }

    return list.filter(p =>
      (p.nom && p.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.prenom && p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.ville && p.ville.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get pendingCount(): number {
    return this.presA.length;
  }

  get activeCount(): number {
    return this.pres.filter(p => p.Status === 'CONFIRMED').length;
  }

  get desactiveCount(): number {
    return this.pres.filter(p => p.Status === 'DISABLED').length;
  }

  // Ajoutez ces propriétés à votre classe
prestataireToDelete: any = null;
isDeleteDialogOpen: boolean = false;

// Modifiez la méthode deletePres existante pour utiliser la modale
deletePres(id: string) {
  this.prestataireToDelete = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
  if (this.prestataireToDelete) {
    this.isDeleteDialogOpen = true;
  } else {
    alert('Prestataire non trouvé.');
  }
}

// Ajoutez cette nouvelle méthode pour confirmer la suppression
confirmDelete() {
  if (this.prestataireToDelete) {
    this.presService.deletePresById(this.prestataireToDelete.id).subscribe(
      (response) => {
        this.fetchPres();
        this.fetchPresN();
        this.isDeleteDialogOpen = false;
        this.prestataireToDelete = null;
      },
      (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.isDeleteDialogOpen = false;
        this.prestataireToDelete = null;
      }
    );
  }
}

  prestataireToApprove: any = null;
  isApproveDialogOpen: boolean = false;
  onApprove(id: string) {
    this.prestataireToApprove = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToApprove) {
      this.isApproveDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }

  confirmApprove() {
    if (this.prestataireToApprove) {
      this.presService.approoved(this.prestataireToApprove.id).subscribe(
        (response) => {
          console.log('Prestataire approuvé avec succès :', response);
          this.fetchPres();
          this.fetchPresN();
          this.isApproveDialogOpen = false;
          this.prestataireToApprove = null;
        },
        (error) => {
          console.error('Erreur lors de l\'approbation du prestataire :', error);
          alert('Erreur lors de l\'approbation du prestataire.');
          this.isApproveDialogOpen = false;
          this.prestataireToApprove = null;
        }
      );
    }
  }

  prestataireToDisabl: any = null;
  isDisablDialogOpen: boolean = false;
  onDisabl(id: string) {
    this.prestataireToDisabl = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToDisabl) {
      this.isDisablDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }

  confirmDisabl() {
    if (this.prestataireToDisabl) {
      this.presService.disabl(this.prestataireToDisabl.id).subscribe(
        (response) => {
          console.log('Prestataire désactivé avec succès :', response);
          this.fetchPres();
          this.fetchPresN();
          this.isDisablDialogOpen = false;
          this.prestataireToDisabl = null;
        },
        (error) => {
          console.error('Erreur lors de la désactivation du prestataire :', error);
          alert('Erreur lors de la désactivation du prestataire.');
          this.isDisablDialogOpen = false;
          this.prestataireToDisabl = null;
        }
      );
    }
  }

  prestataireToActivate: any = null;
  isActivateDialogOpen: boolean = false;
  onActivate(id: string) {
    this.prestataireToActivate = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToActivate) {
      this.isActivateDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }

  confirmActivate() {
    if (this.prestataireToActivate) {
      this.presService.activate(this.prestataireToActivate.id).subscribe(
        (response) => {
          console.log('Prestataire activé avec succès :', response);
          this.fetchPres();
          this.fetchPresN();
          this.isActivateDialogOpen = false;
          this.prestataireToActivate = null;
        },
        (error) => {
          console.error('Erreur lors de l\'activation du prestataire :', error);
          alert('Erreur lors de l\'activation du prestataire.');
          this.isActivateDialogOpen = false;
          this.prestataireToActivate = null;
        }
      );
    }
  }

  prestataireToRefuse: any = null;
  isRefuseDialogOpen: boolean = false;
  onRefuse(id: string) {
    this.prestataireToRefuse = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToRefuse) {
      this.isRefuseDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }

  confirmRefuse() {
    if (this.prestataireToRefuse) {
      this.presService.refusePrestataire(this.prestataireToRefuse.id).subscribe(
        (response) => {
          this.fetchPres();
          this.fetchPresN();
          this.isRefuseDialogOpen = false;
          this.prestataireToRefuse = null;
        },
        (error) => {
          console.error('Erreur lors du refus du prestataire :', error);
          alert('Erreur lors du refus du prestataire.');
          this.isRefuseDialogOpen = false;
          this.prestataireToRefuse = null;
        }
      );
    }
  }

  // Utilitaires
  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Fichier PDF';
  }

  showAllPrestataires() {
    this.showAll = true;
    this.currentFilter = 'TOUS';
    this.currentPage = 1;
    this.updatePagination();
  }
 
  showPendingPrestataires() {
    this.showAll = false;
    this.currentFilter = 'PENDING';
    this.currentPage = 1;
    this.updatePagination();
  }
}