import { Component, OnInit } from '@angular/core';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../Services/service.service';

@Component({
  selector: 'app-service-ph',
  standalone: true,
  imports: [NavbarORComponent,RouterModule,FormsModule,CommonModule,RouterLink],
  templateUrl: './service-ph.component.html',
  styleUrl: './service-ph.component.css'
})
export class ServicePhComponent implements OnInit {
  services: any[] = [];
  totalServices = 0;
  totalPages = 0;
  currentPage = 1;
  itemsPerPage = 15; // Doit correspondre à la limite dans le backend
  selectedType = 'default_type'; // Type par défaut
  prixMin: number = 0; // Prix minimum
  prixMax: number = 1000000; // Prix maximum
  min(a: number, b: number): number {
    return Math.min(a, b);
  }
  

  constructor(private servicesService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices(this.selectedType);
  }

  isLoading = false;

  loadServices(type: string): void {
    this.isLoading = true;
    this.selectedType = type;
    this.servicesService.getServicesByType(type,this.prixMin, this.prixMax, this.currentPage, this.itemsPerPage).subscribe(
      (data) => {
        this.services = data.services || [];
        this.totalServices = data.total;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors du chargement des services', error);
        this.isLoading = false;
      }
    );
  }

  onSearch(): void {
    this.currentPage = 1; // Réinitialisation de la page à 1 lors de la recherche
    this.loadServices(this.selectedType); // Recharger les services avec les nouveaux filtres
  }
  resetFilters(): void {
    this.prixMin = 0;
    this.prixMax = 1000000;
    this.loadServices(this.selectedType); // Recharger tous les services sans les filtres
  }
  
  calculateDiscount(price: number, promo: number): number {
    return price - (price * (promo / 100));
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadServices(this.selectedType);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadServices(this.selectedType);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadServices(this.selectedType);
    }
  }
  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 15; // Nombre maximum de pages visibles dans la pagination
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}

