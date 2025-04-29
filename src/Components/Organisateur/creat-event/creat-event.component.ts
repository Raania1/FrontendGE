import { Component, HostListener } from '@angular/core';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../Services/event.service';
import { Router, RouterLink } from '@angular/router';

interface Event {
  id: string;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
  lieu: string;
  budgetTotale: number;
}

interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number;
  promo?: number;
  eventId: string;
  photoCouverture: string;
}

@Component({
  selector: 'app-creat-event',
  standalone: true,
  imports: [NavbarORComponent, ReactiveFormsModule, CommonModule, FormsModule,RouterLink],
  templateUrl: './creat-event.component.html',
  styleUrl: './creat-event.component.css'
})
export class CreatEventComponent {
  eventForm: FormGroup;
  
  events: Event[] = [];
  eventServices: { [key: string]: Service[] } = {};
  
  showAddServiceModal = false;
  selectedEvent: Event | null = null;
  selectedEventId: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  openedMenuId: string | null = null;

  searchTerm: string = '';
  selectedService: any = null;
  services: Service[] = [];
  filteredServices: any[] = [];
  isLoadingServices = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.loadAllServices();
    this.eventForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      lieu: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
    }, { validators: this.dateValidator });
  }

  ngOnInit(): void {
    this.loadEventsWithServices();
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

  calculateFinalPrice(price: number, discount: number): number {
    return price - (price * discount) / 100;
  }

  private dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const dateDebut = control.get('dateDebut')?.value;
    const dateFin = control.get('dateFin')?.value;
    return dateDebut && dateFin && new Date(dateFin) > new Date(dateDebut) 
      ? null : { dateFinBeforeDateDebut: true };
  };

  private loadAllServices() {
    this.isLoadingServices = true;
    this.eventService.getAllservices().subscribe({
      next: (response) => {
        this.services = response.services;
        this.filteredServices = [...this.services];
        this.isLoadingServices = false;
      },
      error: (error) => {
        console.error('Error loading services', error);
        this.services = [];
        this.filteredServices = [];
        this.isLoadingServices = false;
      }
    });
  }

  filterServices() {
    if (!this.searchTerm) {
      this.filteredServices = [...this.services];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredServices = this.services.filter(service => 
      service.nom.toLowerCase().includes(term) || 
      (service.description && service.description.toLowerCase().includes(term))
    );
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.isLoading = true;
      
      const payload = {
        ...this.eventForm.value,
        dateDebut: new Date(this.eventForm.value.dateDebut).toISOString(),
        dateFin: new Date(this.eventForm.value.dateFin).toISOString(),
        organisateurid: this.getOrganisateurId()
      };
  
      this.eventService.createEvent(payload).subscribe({
        next: (response) => this.handleSuccess(response),
        error: (error) => this.handleError(error)
      });
    }
  }

  private handleSuccess(response: any) {
    this.successMessage = 'Événement créé avec succès';
    this.loadEventsWithServices();
    this.eventForm.reset();
    this.isLoading = false;
    setTimeout(() => this.successMessage = null, 5000);
  }

  toggleActionMenu(eventId: string) {
    this.openedMenuId = this.openedMenuId === eventId ? null : eventId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu-container') && !target.closest('.action-menu')) {
      this.openedMenuId = null;
    }
  }

  private handleError(error: any) {
    console.error('Error creating event', error);
    this.isLoading = false;
    this.errorMessage = error.error?.errors 
      ? 'Erreur de validation: ' + Object.values(error.error.errors).join(', ')
      : error.error?.error || 'Une erreur est survenue lors de la création';
  }

  loadEventsWithServices() {
    this.isLoading = true;
    this.eventService.getAllEventsWithServices().subscribe({
      next: (response) => {
        this.processEventsResponse(response);
      },
      error: (error) => {
        this.handleEventsLoadingError(error);
        console.log(error)
      }
    });
  }

  private processEventsResponse(response: any) {
    this.events = response.events.map((event: any) => ({
      id: event.id,
      nom: event.nom,
      dateDebut: new Date(event.dateDebut),
      dateFin: new Date(event.dateFin),
      lieu: event.lieu,
      budgetTotale: event.budgetTotale || 0
    }));
  
    this.initializeEventServices(response);
    this.isLoading = false;
  }

  private initializeEventServices(response: any) {
    this.eventServices = {};
    response.events.forEach((event: any) => {
      this.eventServices[event.id] = event.services?.map((service: any) => ({
        id: service.id,
        nom: service.nom,
        description: service.description,
        prix: service.prix,
        promo: service.promo || 0,
        eventId: service.eventId,
        photoCouverture: service.photoCouverture
      })) || [];
    });
  }

  private handleEventsLoadingError(error: any) {
    console.error('Error loading events', error);
    this.isLoading = false;
  }

  openAddServiceModal(event: Event) {
    this.selectedEvent = event;
    this.showAddServiceModal = true;
    this.searchTerm = '';
    this.selectedService = null;
    this.filteredServices = [...this.services];
  }

  closeAddServiceModal() {
    this.showAddServiceModal = false;
    this.selectedEvent = null;
  }

  addService() {
    if (this.selectedService && this.selectedEvent) {
      this.isLoading = true;
      
      const payload = {
        eventId: this.selectedEvent.id,
        serviceId: this.selectedService.id
      };
  
      this.eventService.addServiceToEvent(payload).subscribe({
        next: (response) => {
          this.successMessage = 'Service ajouté avec succès';
          
          const eventIndex = this.events.findIndex(e => e.id === this.selectedEvent?.id);
          if (eventIndex !== -1 && this.selectedEvent) {
            const finalPrice = this.selectedService.promo 
              ? this.calculateFinalPrice(this.selectedService.prix, this.selectedService.promo)
              : this.selectedService.prix;
            
            this.events[eventIndex].budgetTotale = 
              (this.events[eventIndex].budgetTotale || 0) + finalPrice;
            
            if (!this.eventServices[this.selectedEvent.id]) {
              this.eventServices[this.selectedEvent.id] = [];
            }
            this.eventServices[this.selectedEvent.id].push({
              ...this.selectedService,
              eventId: this.selectedEvent.id
            });
          }
  
          this.isLoading = false;
          setTimeout(() => this.successMessage = null, 5000);
          this.closeAddServiceModal();
        },
        error: (error) => {
          console.error('Error adding service', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout du service';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    }
  }

  viewServices(event: Event) {
    this.selectedEventId = this.selectedEventId === event.id ? null : event.id;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getOrganisateurId(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    return user.Id;
  }

async removeService(eventId: string, serviceId: string, event: MouseEvent) {
  event.stopPropagation(); 

  if (!confirm('Êtes-vous sûr de vouloir supprimer ce service de l\'événement ?')) {
    return;
  }

  this.isLoading = true;
  
  try {
    await this.eventService.removeServiceFromEvent(eventId, serviceId).toPromise();
    
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    const serviceIndex = this.eventServices[eventId]?.findIndex(s => s.id === serviceId);

    if (eventIndex !== -1 && serviceIndex !== -1) {
      const service = this.eventServices[eventId][serviceIndex];
      const priceToRemove = service.promo && service.promo > 0 
        ? this.calculateFinalPrice(service.prix, service.promo) 
        : service.prix;
      
      this.events[eventIndex].budgetTotale -= priceToRemove;
      
      this.eventServices[eventId].splice(serviceIndex, 1);
    }

    this.successMessage = 'Service supprimé avec succès';
    setTimeout(() => this.successMessage = null, 5000);
  } catch (error) {
    console.error('Error removing service:', error);
    this.errorMessage = 'Erreur lors de la suppression du service';
    setTimeout(() => this.errorMessage = null, 5000);
  } finally {
    this.isLoading = false;
  }
}
isDeleting = false;

async deleteEvent(eventId: string, event: MouseEvent) {
  event.stopPropagation();
  this.openedMenuId = null; 

  if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
    return;
  }

  this.isDeleting = true;
  
  try {
    await this.eventService.deleteEvent(eventId).toPromise();
    
    this.events = this.events.filter(e => e.id !== eventId);
    delete this.eventServices[eventId];
    
    this.successMessage = 'Événement supprimé avec succès';
    setTimeout(() => this.successMessage = null, 5000);
  } catch (error) {
    console.error('Error deleting event:', error);
    setTimeout(() => this.errorMessage = null, 5000);
  } finally {
    this.isDeleting = false;
  }
}
}