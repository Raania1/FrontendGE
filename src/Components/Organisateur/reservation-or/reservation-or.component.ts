import { Component, OnInit } from '@angular/core';
import { NavbarORComponent } from '../navbar-or/navbar-or.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizerService } from '../../../Services/organizer.service';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { ReservationService } from '../../../Services/reservation.service';
import { RouterLink } from '@angular/router';

interface Reservation {
  id: string;
  serviceid: number;
  dateDebut: string;
  prix: number;
  Status: string;
  Service?: any;
}

interface Organizer {
  Reservations: Reservation[];
  // ... other organizer fields
}

@Component({
  selector: 'app-reservation-or',
  standalone: true,
  imports: [NavbarORComponent, FormsModule, CommonModule,RouterLink],
  templateUrl: './reservation-or.component.html',
  styleUrls: ['./reservation-or.component.css']
})
export class ReservationOrComponent implements OnInit {
  mesReservations: Reservation[] = [];
  organisateur: Organizer | null = null;

  constructor(
    private organizerService: OrganizerService,
    private serviceService: ServiceService,
    private prestataireService: PrestataireService,
    private reservation : ReservationService
  ) {}

  ngOnInit(): void {
    this.fetchOrganizerData();
  }
  fetchOrganizerData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id as number | undefined;

    if (id) {
      this.organizerService.getOrganizerById(id.toString()).subscribe(
        (response: any) => {
          this.organisateur = response.organizer as Organizer;
          this.mesReservations = this.organisateur.Reservations || [];

          this.mesReservations.forEach((reservation: Reservation) => {
            this.serviceService.getServiceById(reservation.serviceid.toString()).subscribe(
              (serviceResponse: any) => {
                reservation.Service = serviceResponse.service ;

                this.prestataireService.getPrestataireById(reservation.Service!.Prestataireid).subscribe(
                  (prestResponse: any) => {
                    reservation.Service!.Prestataire = prestResponse.pres; 
                  console.log("Prestataire:",reservation.Service.Prestataire)                 },
                  (prestError: any) => {
                    console.error('Erreur lors de la récupération du prestataire:', prestError);
                  }
                );
              },
              (serviceError: any) => {
                console.error('Erreur lors de la récupération du service:', serviceError);
              }
            );
          });
        },
        (error: any) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }
  getStatusText(Status: string): string {
    switch (Status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Acceptée';
      case 'CANCELED':
        return 'Refusée';
      default:
        return 'Inconnu';
    }
  }

  getStatusBadgeClass(Status: string): string {
    switch (Status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  selectedReservation: Reservation | null = null;
  isDeleteDialogOpen: boolean = false;
  openDeleteDialog(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.isDeleteDialogOpen = true;
  }
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  deleteReservation(): void {
    if (!this.selectedReservation) return;
  
    const reservationId = this.selectedReservation.id;
    this.isLoading = true;
  
    this.reservation.deletereservationById(reservationId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Réservation supprimée avec succès';
        
        this.mesReservations = this.mesReservations.filter(
          res => res.id !== reservationId
        );
        
        this.isDeleteDialogOpen = false;
        this.selectedReservation = null;
  
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error || 'Erreur lors de la suppression';
        
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

  searchQuery: string = '';
  selectedStatus: string = 'all';
  
  // Ajoute cette méthode si tu veux que le nombre de réservations trouvées soit dynamique
  get filteredReservations(): Reservation[] {
    return this.mesReservations.filter(res => {
      const matchesStatus =
        this.selectedStatus === 'all' || res.Status.toLowerCase() === this.selectedStatus;
      const matchesSearch =
        !this.searchQuery || res.Service?.nom?.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }
  

  payerReservation(reservation: Reservation): void {
    alert(`Paiement de ${reservation.prix} € pour ${reservation.Service?.nom} confirmé !`);
    // Ici tu pourras plus tard intégrer un vrai système de paiement
  }
}
