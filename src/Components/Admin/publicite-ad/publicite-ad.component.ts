import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faChevronLeft, faChevronRight, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { PubliciteService } from '../../../Services/publicite.service';
import { AdminService } from '../../../Services/admin.service';

type AdvertisementStatus = 'En attente' | 'Acceptée' | 'Terminée' | 'CANCELED';

interface Service {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Prestataire {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numTel: number;
}

interface Pack {
  id: string;
  title: string;
  description: string;
  price: number;
  services: Service[];
  Prestataire: Prestataire;
}

interface PublicitePack {
  id: string;
  DatePublic: string | null;
  prix: number;
  Status: string;
  paid: boolean;
  packid: string;
  createdAt: string;
  Pack: Pack;
}

@Component({
  selector: 'app-publicite-ad',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './publicite-ad.component.html',
  styleUrls: ['./publicite-ad.component.css']
})
export class PubliciteAdComponent implements OnInit {
  faClipboardList = faClipboardList;
  faBell = faBell;
  Math = Math;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  advertisements: PublicitePack[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  selectedAdvertisement: PublicitePack | null = null;
  isDetailsDialogOpen: boolean = false;
  isApproveDialogOpen: boolean = false;
  isRefuseDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  advertisementToApprove: PublicitePack | null = null;
  advertisementToRefuse: PublicitePack | null = null;
  advertisementToDelete: PublicitePack | null = null;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
adminInfo: any = {};
formData = {
      nom: '',
      prenom: '',
      email: ''
    };
  constructor(private pubService: PubliciteService, private cdr: ChangeDetectorRef,private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchAdvertisements();
            this.fetchAdminInfo();
  }

  fetchAdvertisements(): void {
    this.isLoading = true;
    this.pubService.getAll().subscribe({
      next: (response: PublicitePack[]) => {
        this.advertisements = response.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des publicités.';
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
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
  mapStatus(backendStatus: string): AdvertisementStatus {
    switch (backendStatus) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Acceptée';
      case 'TERMINEE':
        return 'Terminée';
      case 'CANCELED':
        return 'CANCELED';
      default:
        return 'En attente';
    }
  }

  get filteredAdvertisements(): PublicitePack[] {
    return this.advertisements.filter((ad) => {
      const matchesSearch =
        ad.Pack.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ad.Pack.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ad.Pack.Prestataire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ad.Pack.Prestataire.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ad.Pack.Prestataire.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'all' || this.mapStatus(ad.Status) === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get paginatedAdvertisements(): PublicitePack[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAdvertisements.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAdvertisements.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    this.currentPage = page;
  }

  resetPagination(): void {
    this.currentPage = 1;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  openDetailsDialog(advertisement: PublicitePack): void {
    this.selectedAdvertisement = advertisement;
    this.isDetailsDialogOpen = true;
  }

  getStatusBadgeClass(status: string): string {
    const mappedStatus = this.mapStatus(status);
    switch (mappedStatus) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Acceptée':
        return 'bg-green-100 text-green-800';
      case 'Terminée':
        return 'bg-gray-800 text-white';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    return this.mapStatus(status);
  }

  get pendingCount(): number {
    return this.advertisements.filter(ad => this.mapStatus(ad.Status) === 'En attente').length;
  }

  get publicCount(): number {
    return this.advertisements.filter(ad => this.mapStatus(ad.Status) === 'Acceptée').length;
  }

  openApproveDialog(advertisement: PublicitePack): void {
    this.advertisementToApprove = advertisement;
    this.isApproveDialogOpen = true;
  }

  openRefuseDialog(advertisement: PublicitePack): void {
    this.advertisementToRefuse = advertisement;
    this.isRefuseDialogOpen = true;
  }

  openDeleteDialog(advertisement: PublicitePack): void {
    this.advertisementToDelete = advertisement;
    this.isDeleteDialogOpen = true;
  }

  confirmApprove(): void {
    if (!this.advertisementToApprove) return;

    this.isLoading = true;
    this.pubService.acceptAdvertisement(this.advertisementToApprove.id).subscribe({
      next: () => {
        this.successMessage = 'Publicité approuvée avec succès.';
        const adToUpdate = this.advertisements.find(ad => ad.id === this.advertisementToApprove!.id);
        if (adToUpdate) {
          adToUpdate.Status = 'CONFIRMED';
        } else {
          console.warn('Publicité non trouvée:', this.advertisementToApprove!.id);
        }
        this.isLoading = false;
        this.isApproveDialogOpen = false;
        this.advertisementToApprove = null;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de l\'approbation de la publicité';
        console.error('Erreur:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      }
    });
  }

  confirmRefuse(): void {
    if (!this.advertisementToRefuse) return;

    this.isLoading = true;
    this.pubService.refuseAdvertisement(this.advertisementToRefuse.id).subscribe({
      next: () => {
        this.successMessage = 'Publicité refusée avec succès.';
        const adToUpdate = this.advertisements.find(ad => ad.id === this.advertisementToRefuse!.id);
        if (adToUpdate) {
          adToUpdate.Status = 'CANCELED';
        } else {
          console.warn('Publicité non trouvée:', this.advertisementToRefuse!.id);
        }
        this.isLoading = false;
        this.isRefuseDialogOpen = false;
        this.advertisementToRefuse = null;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du refus de la publicité';
        console.error('Erreur:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      }
    });
  }

  confirmDelete(): void {
    if (!this.advertisementToDelete) return;

    this.isLoading = true;
    this.pubService.deleteAdvertisement(this.advertisementToDelete.id).subscribe({
      next: () => {
        this.successMessage = 'Publicité supprimée avec succès.';
        this.advertisements = this.advertisements.filter(ad => ad.id !== this.advertisementToDelete!.id);
        this.isLoading = false;
        this.isDeleteDialogOpen = false;
        this.advertisementToDelete = null;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.message === 'Publicité non trouvée' ? 'Publicité non trouvée.' : 'Erreur lors de la suppression de la publicité.';
        console.error('Erreur:', error);
        this.isLoading = false;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      }
    });
  }

  closeMessage(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.markForCheck();
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
}