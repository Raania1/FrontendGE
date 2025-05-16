import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faChevronLeft, faChevronRight, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { RouterLink } from '@angular/router';
import { PubliciteService } from '../../../Services/publicite.service';

type AdvertisementStatus = 'EN ATTENTE' | 'CONFIRMED' | 'TERMINEE';

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
  imports: [FormsModule, CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './publicite-ad.component.html',
  styleUrl: './publicite-ad.component.css'
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
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private pubService: PubliciteService) {}

  ngOnInit(): void {
    this.fetchAdvertisements();
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

  mapStatus(backendStatus: string): AdvertisementStatus {
    switch (backendStatus) {
      case 'PENDING':
        return 'EN ATTENTE';
      case 'CONFIRMED':
        return 'CONFIRMED';
      case 'TERMINEE':
        return 'TERMINEE';
      default:
        return 'EN ATTENTE';
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
      case 'EN ATTENTE':
        return 'bg-orange-500 text-white';
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'TERMINEE':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    return this.mapStatus(status);
  }

  get pendingCount(): number {
    return this.advertisements.filter(ad => this.mapStatus(ad.Status) === 'EN ATTENTE').length;
  }

  get publicCount(): number {
    return this.advertisements.filter(ad => this.mapStatus(ad.Status) === 'CONFIRMED').length;
  }
}