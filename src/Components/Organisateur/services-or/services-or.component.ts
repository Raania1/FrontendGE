import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormControl,AbstractControl  } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../Services/service.service';

interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number;
  promo: number;
  type: string;
  photoCouverture: string;
  approoved: boolean;
  Photos?: string[];
  Prestataireid?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-services-or',
  standalone: true,
  imports: [NavbarORComponent, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './services-or.component.html',
  styleUrl: './services-or.component.css'
})
export class ServicesOrComponent implements OnInit {
  // Filter state
  filterForm: FormGroup;
  isMobile = false;
  loading = false;
  error: string | null = null;

  // Services data

  filteredServices: Service[] = [];
  
  // Pagination
  pagination = {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 6
  };

  // Constants
  serviceTypes = [
    { id: "Photographe", label: "Photographe" },
    { id: "Traiteur", label: "Traiteur" },
    { id: "Salle des fêtes", label: "Salle des fêtes" },
    { id: "Animation", label: "Animation" },
    { id: "Décoration", label: "Décoration" },
    { id: "Music", label: "Music" },
    { id: "Autres", label: "Autres" },

  ];

  constructor(
    private fb: FormBuilder,
    private servicesService: ServiceService, 
    private route: ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      type: new FormControl(''),
      minPrice: new FormControl(0),
      maxPrice: new FormControl(10000),
      hasPromo: new FormControl(false),
      searchQuery: new FormControl(''),
      sortBy: new FormControl('newest')
    });

    this.isMobile = window.innerWidth < 1024;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1024;
    });
  }

  ngOnInit() {
    this.loadServices();
    
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });
  }
  loadServices() {
    this.loading = true;
    this.error = null;
  
    const params = {
      ...this.filterForm.value,
      page: this.pagination.currentPage,
      limit: this.pagination.itemsPerPage
    };
  
    this.servicesService.getServices(params).subscribe({
      next: (response) => {
        this.filteredServices = response.services; // Contient uniquement les services de la page demandée
        this.pagination = {
          total: response.total,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          itemsPerPage: this.pagination.itemsPerPage
        };
        console.log('Params envoyés :', params);
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = 'Erreur de chargement';
        this.filteredServices = [];
      },
      complete: () => this.loading = false
    });
  }
  private buildApiParams() {
    const formValue = this.filterForm.value;
    return {
      type: formValue.type || '',
      minPrice: formValue.minPrice || 0,
      maxPrice: formValue.maxPrice || 10000,
      hasPromo: formValue.hasPromo || false,
      searchQuery: formValue.searchQuery || '',
      sortBy: formValue.sortBy || 'newest',
      page: this.pagination.currentPage,
      limit: this.pagination.itemsPerPage
    };
  }

  // Service card helpers
  getDiscountedPrice(service: Service): number | null {
    return service.promo > 0 
      ? service.prix - (service.prix * service.promo) / 100 
      : null;
  }

  formatPrice(price: number): string {
    if (isNaN(price)) return '0 DT'; // Handle invalid numbers
    
    // For whole numbers, don't show decimals
    const isWholeNumber = price % 1 === 0;
    
    return new Intl.NumberFormat('fr-FR', {
      style: isWholeNumber ? 'decimal' : 'currency', // Use decimal format for whole numbers
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: isWholeNumber ? 0 : 3
    })
    .format(price) + (isWholeNumber ? ' DT' : ''); // Append DT for whole numbers
  }

  getTypeLabel(type: string): string {
    console.log(type)
    const typeMap: Record<string, string> = {
      Photographe: "Photographe",
      Traiteur: "Traiteur",
      Salle_des_fêtes: "Salle des fêtes",
      Animation: "Animation",
      Décoration: "Décoration",
      Music: "Music",
      Autres: "Autres",

    };
    return typeMap[type] || "Service";
  }

  // Filter and sort logic
  applyFilters() {
    this.pagination.currentPage = 1; // Réinitialise à la première page
    this.loadServices();
  }

  resetFilters() {
    this.filterForm.reset({
      type: '',
      minPrice: 0,
      maxPrice: 10000,
      hasPromo: false,
      searchQuery: '',
      sortBy: 'newest'
    });
    this.applyFilters(); 
    this.updatePagination();
  }
  removeFilter(key: string) {
    if (key === 'minPrice' || key === 'maxPrice') {
      this.filterForm.patchValue({ minPrice: 0, maxPrice: 10000 });
    } else {
      this.filterForm.get(key)?.reset();
    }
    this.applyFilters(); // <-- re-apply filters
  }

  hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return values.type || values.hasPromo || values.minPrice > 0 || values.maxPrice < 10000;
  }

  // Pagination logic
  private updatePaginationData(response: any) {
    this.pagination = {
      total: response.total,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
      itemsPerPage: this.pagination.itemsPerPage
    };
  }

  updatePagination() {
    this.pagination.total = this.filteredServices.length;
    this.pagination.totalPages = Math.ceil(this.filteredServices.length / this.pagination.itemsPerPage);
  }

  getPaginatedServices(): Service[] {
    return this.filteredServices; // Retourne directement ce que le serveur a envoyé
  }

  handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > this.pagination.totalPages) return;
    
    this.pagination.currentPage = newPage;
    this.loadServices(); // Recharge les données pour la nouvelle page
  }

  handleSortChange(newSortBy: string) {
    this.filterForm.get('sortBy')?.setValue(newSortBy);
    this.pagination.currentPage = 1;
    this.loadServices();
  }

  getRange(totalPages: number, currentPage: number): number[] {
    const range = [];
    const delta = 1;
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      range.unshift(-1);
    }
    
    if (currentPage + delta < totalPages - 1) {
      range.push(-1);
    }
    
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    return range;
  }

  getTypeLabelForCurrentFilter(): string {
    const typeId = this.filterForm.get('type')?.value;
    const type = this.serviceTypes.find(t => t.id === typeId);
    return type?.label || '';
  }

  getServiceImage(service: Service): string {
    return service.photoCouverture || '/assets/placeholder.svg';
  }

  getServicePrice(service: Service): string {
    return this.formatPrice(service.prix);
  }

  getDiscountedPriceDisplay(service: Service): string | null {
    const discountedPrice = this.getDiscountedPrice(service);
    return discountedPrice ? this.formatPrice(discountedPrice) : null;
  }

  getPageRange(): number[] {
    return this.getRange(this.pagination.totalPages, this.pagination.currentPage);
  }

  handleInputChange(event: Event, controlName: string) {
    const target = event.target as HTMLInputElement;
    this.filterForm.get(controlName)?.setValue(target.value);
  }

  handleSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.handleSortChange(target.value);
  }
  get searchQuery(): FormControl {
    return this.filterForm.get('searchQuery') as FormControl;
  }
  
  get hasPromo(): FormControl {
    return this.filterForm.get('hasPromo') as FormControl;
  }
}