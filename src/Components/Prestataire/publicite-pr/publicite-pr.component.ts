import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faChevronLeft, faChevronRight, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { RouterLink } from '@angular/router';
import { PubliciteService } from '../../../Services/publicite.service';
import { PaiementService } from '../../../Services/paiement.service';

type AdvertisementStatus = 'En attente' | 'Acceptée' | 'Terminée' | 'Refusée';


interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number;
  promo: number;
  type: string;
  photoCouverture: string;
}

interface Pack {
  id: string;
  title: string;
  description: string;
  price: number; 
  services: Service[];
}

interface PublicitePack {
  id: string;
  DatePublic: string | null;
  prix: number;
  Status: string; 
  paid: boolean;
  packid: string;
  createdAt: string;
  pack: Pack;
}

interface Prestataire {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numTel: number;
  ville: string;
  adress: string;
  pdProfile: string;
}

@Component({
  selector: 'app-publicite-pr',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './publicite-pr.component.html',
  styleUrl: './publicite-pr.component.css'
})
export class PublicitePrComponent implements OnInit {
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
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  prestataire: Prestataire = {
    id: '',
    nom: '',
    prenom: '',
    email: '',
    numTel: 0,
    ville: '',
    adress: '',
    pdProfile: ''
  };

  constructor(private prestataireService: PrestataireService,private pubService: PubliciteService,
    private cdr: ChangeDetectorRef,    private paiementService: PaiementService
    ) {}

  ngOnInit(): void {
    this.fetchPrestataireData();
  }

  fetchPrestataireData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.isLoading = true;
      this.prestataireService.getPrestataireById(id).subscribe({
        next: (response) => {
          this.prestataire = response.pres;
          this.advertisements = response.pres.Pack.flatMap((pack: any) =>
            pack.PublicitePack.map((ad: any) => ({
              ...ad,
              pack: { id: pack.id, title: pack.title, description: pack.description, price: pack.price, services: pack.services }
            }))
          ).sort((a: PublicitePack, b: PublicitePack) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données.';
          console.error('Erreur:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Utilisateur non trouvé dans le localStorage.';
      console.error(this.errorMessage);
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
        return 'Refusée';
      default:
        return 'En attente';
    }
  }

  get filteredAdvertisements(): PublicitePack[] {
    return this.advertisements.filter((ad) => {
      const matchesSearch =
        ad.pack.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ad.pack.description.toLowerCase().includes(this.searchTerm.toLowerCase());

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


  getStatusBadgeClass(status: string): string {
    const mappedStatus = this.mapStatus(status);
    switch (mappedStatus) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Acceptée':
        return 'bg-green-100 text-green-800';
      case 'Terminée':
        return 'bg-gray-800 text-white';
      case 'Refusée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    return this.mapStatus(status);
  }
  isDeleteDialogOpen: boolean = false;
  advertisementToDelete: PublicitePack | null = null;
  openDeleteDialog(advertisement: PublicitePack): void {
  this.advertisementToDelete = advertisement;
  this.isDeleteDialogOpen = true;
}
  openDetailsDialog(advertisement: PublicitePack): void {
    this.selectedAdvertisement = advertisement;
    this.isDetailsDialogOpen = true;
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
  payerPub(advertisement: PublicitePack): void {
    if (!advertisement || !advertisement.id) return;

    this.paiementService.payerPub(advertisement.id).subscribe({
      next: (res: any) => {
        const link = res?.result?.link;
        if (link) {
          window.location.href = link;
        } else {
          alert("Erreur : lien de paiement introuvable");
        }
      },
      error: (err) => {
        console.error('Erreur de paiement Flouci :', err);
        alert("Erreur lors de la tentative de paiement.");
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

}