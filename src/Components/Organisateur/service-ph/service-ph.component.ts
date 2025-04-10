import { Component, OnInit } from '@angular/core';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-service-ph',
  standalone: true,
  imports: [NavbarORComponent, RouterModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './service-ph.component.html',
  styleUrl: './service-ph.component.css'
})
export class ServicePhComponent implements OnInit {
  prestataires: any[] = [];
  page: number = 1;
  limit: number = 6;
  totalPages: number = 1;
  totalItems: number = 0;
  travailFilter: string = '';
  nomFilter: string = '';
  prenomFilter: string = '';
  villeFilter: string = '';

  constructor(private prestataireService: PrestataireService, 
       private location: Location,
  ) {}

  ngOnInit(): void {
    this.fetchPrestataires();
  }

  fetchPrestataires(): void {
    this.prestataireService.getAllPrestataires(
      this.travailFilter, 
      this.nomFilter, 
      this.prenomFilter, 
      this.villeFilter,
      this.page, 
      this.limit
    ).subscribe({
      next: (res) => {
        this.prestataires = res.data;
        this.totalPages = res.pagination.totalPages;
        this.totalItems = res.pagination.total;
      },
      error: (err) => {
        console.error('Erreur:', err);
        // Gérer le cas où aucun prestataire n'est trouvé
        if (err.status === 404) {
          this.prestataires = [];
          this.totalPages = 0;
          this.totalItems = 0;
        }
      }
    });
  }

  changePage(direction: 'next' | 'prev') {
    if (direction === 'next' && this.page < this.totalPages) {
      this.page++;
    } else if (direction === 'prev' && this.page > 1) {
      this.page--;
    }
    this.fetchPrestataires();
  }

  onFilterChange() {
    this.page = 1; // Reset à la première page quand les filtres changent
    this.fetchPrestataires();
  }
  // Dans service-ph.component.ts
getMin(a: number, b: number): number {
  return Math.min(a, b);
}
// Dans service-ph.component.ts
resetFilters(): void {
  this.travailFilter = '';
  this.nomFilter = '';
  this.prenomFilter = '';
  this.villeFilter = '';
  this.page = 1;
  this.fetchPrestataires();
}

goBack(): void {
  this.location.back();
}
}