import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormControl,AbstractControl  } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { OrganizerService } from '../../../Services/organizer.service';
import { EventService } from '../../../Services/event.service';
import { ReservationService } from '../../../Services/reservation.service';

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
  reservationCount?: number; 
}

@Component({
  selector: 'app-services-or',
  standalone: true,
  imports: [NavbarORComponent, CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './services-or.component.html',
  styleUrl: './services-or.component.css'
})
export class ServicesOrComponent implements OnInit {
  filterForm: FormGroup;
  isMobile = false;
  loading = false;
  error: string | null = null;
  filteredServices: Service[] = [];
  pagination = {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 6
  };

  serviceTypes = [
    { id: "Photographe", label: "Photographe" },
    { id: "Traiteur", label: "Traiteur" },
    { id: "Salle des fêtes", label: "Salle des fêtes" },
    { id: "Animation", label: "Animation" },
    { id: "Décoration", label: "Décoration" },
    { id: "Music", label: "Music" },
    { id: "Autres", label: "Autres" },

  ];
  backgroundImages = [
    'https://media.istockphoto.com/id/625147696/fr/photo/fond-musique-dj-night-club-deejay-record-player-retro.jpg?s=612x612&w=0&k=20&c=NyiFv2WxhqHC1ukEpGW3XvnD4-0wq2qKHulwcIEVUso=' ,
    'https://media.istockphoto.com/id/1051348282/fr/photo/enregistrement-dappareil-photo-num%C3%A9rique-professionnel-vid%C3%A9o-au-festival-de-musique-de.jpg?s=612x612&w=0&k=20&c=SYXBfu-Tj2H83dm6A88wySfUByKIBgxhrAZWQ3REDLo=',
    'https://media.istockphoto.com/id/1056074028/fr/photo/gar%C3%A7on-portant-des-plaques-avec-plat-de-viande.jpg?s=612x612&w=0&k=20&c=QZmA01XJlJirGiPJU_mtkPsDmf6llfoKrYB9qpkkTS4=',
    'https://media.istockphoto.com/id/1387884589/fr/photo/r%C3%A9glage-de-la-table-pour-un-%C3%A9v%C3%A9nement.jpg?s=612x612&w=0&k=20&c=ahdHTQL5LebXUPY3IybN1B3zPwAfUJFenjvYLR_Gnjk=',
    'https://media.istockphoto.com/id/964358520/fr/photo/table-riche-en-restaurant-verre-verres-couverts-plats-blancs-vides.jpg?s=612x612&w=0&k=20&c=gdNv-sVogOz8xSGGcPYjjQPxPQnn7TOIFHfVdOixSp4='
  ];
  
  currentIndex = 0;
  currentImage = this.backgroundImages[0];
  private intervalId: any;

  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private preloadImages() {
    this.backgroundImages.forEach(img => {
      const image = new Image();
      image.src = img;
    });
  }

  private startSlideshow() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundImages.length;
      this.currentImage = this.backgroundImages[this.currentIndex];
    }, 2000);
  }



  constructor(
    private fb: FormBuilder,
    private authService: OrganizerService,
    private servicesService: ServiceService, 
    private eventService: EventService,
        private reservation: ReservationService,
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
    this.preloadImages();
    this.startSlideshow();
    this.loadServices();
    this.fetchOrganizerData();  
  
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
      next: async (response) => {
        this.filteredServices = response.services;
        this.pagination = {
          total: response.total,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
          itemsPerPage: this.pagination.itemsPerPage
        };
        for (const service of this.filteredServices) {
          try {
            const countResponse =await this.reservation.countS(service.id).toPromise();
            service.reservationCount = countResponse.count;
          } catch (error) {
            console.error(`Erreur lors du comptage des réservations pour le service ${service.id}:`, error);
            service.reservationCount = 0;
          }
        }
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

  getDiscountedPrice(service: Service): number | null {
    return service.promo > 0 
      ? service.prix - (service.prix * service.promo) / 100 
      : null;
  }

  formatPrice(price: number): string {
    if (isNaN(price)) return '0 DT'; 
    
    const isWholeNumber = price % 1 === 0;
    
    return new Intl.NumberFormat('fr-FR', {
      style: isWholeNumber ? 'decimal' : 'currency', 
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: isWholeNumber ? 0 : 3
    })
    .format(price) + (isWholeNumber ? ' DT' : ''); 
  }

  // getTypeLabel(type: string): string {
  //   console.log(type)
  //   const typeMap: Record<string, string> = {
  //     Photographe: "Photographe",
  //     Traiteur: "Traiteur",
  //     Salle_des_fêtes: "Salle des fêtes",
  //     Animation: "Animation",
  //     Décoration: "Décoration",
  //     Music: "Music",
  //     Autres: "Autres",
  //   };
  //   return typeMap[type] || "Service";
  // }

  applyFilters() {
    this.pagination.currentPage = 1; 
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
    this.applyFilters(); 
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
    return this.filteredServices; 
  }

  handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > this.pagination.totalPages) return;
    
    this.pagination.currentPage = newPage;
    this.loadServices(); 
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
openMenuId: string | null = null;

toggleMenu(serviceId: string) {
  this.openMenuId = this.openMenuId === serviceId ? null : serviceId;
}

isMenuOpen(serviceId: string): boolean {
  return this.openMenuId === serviceId;
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  if (!event.target || !this.openMenuId) return;
  
  const target = event.target as HTMLElement;
  if (!target.closest('.menu-container')) {
    this.openMenuId = null;
  }
}


showModal = false;
selectedEventId: string | null = null;
selectedServiceId: string | null = null;
userEvents: any[] = []; 

organisateur: any = {}; 
  
fetchOrganizerData() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
  const id = user.Id;  

  if (id) {
    this.authService.getOrganizerById(id).subscribe(
      (response) => {
        this.organisateur = response.organizer;  
      },
      (error) => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  } else {
    console.error('Utilisateur non trouvé dans le localStorage');
  }
}
openModal(serviceId: string) {
  this.selectedServiceId = serviceId;
  this.showModal = true;
  document.body.classList.add('modal-open');
  this.loadUserEvents();
}

closeModal() {
  this.showModal = false;
  this.selectedEventId = null;
  this.selectedServiceId = null;
  document.body.classList.remove('modal-open');

}

loadUserEvents() {
  this.userEvents = this.organisateur.Evennements
}



addToEvent() {
  if (this.selectedServiceId && this.selectedEventId) {
    const payload = {
      eventId: this.selectedEventId,
      serviceId: this.selectedServiceId
    };

    this.eventService.addServiceToEvent(payload).subscribe({
      next: (response) => {
        console.log('Service ajouté avec succès à l’événement :', response);
        alert("Service ajouté avec succès !");
        this.closeModal();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du service :', err);
        alert("Erreur lors de l’ajout du service à l’événement.");
      }
    });
  }
}

canConfirm(): boolean {
  return this.userEvents.length > 0 && !!this.selectedEventId;
}

}