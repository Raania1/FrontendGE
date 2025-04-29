import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../Services/reservation.service';
import { Observable } from 'rxjs';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';

interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number;
  promo: number;
  type: string;
  photoCouverture: string;
}

interface Organisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
  ville: string;
  adress: string;
  pdProfile: string;
}

interface Reservation {
  id: string;
  Service: Service;
  Organisateur: Organisateur;
  demande?: string;
  dateDebut: string; 
  Status: ReservationStatus;
  createdAt: string; 
  prix: String
}

@Component({
  selector: 'app-reservation-pr',
  standalone: true,
  imports: [FormsModule, CommonModule,FontAwesomeModule],
  templateUrl: './reservation-pr.component.html',
  styleUrl: './reservation-pr.component.css'
})
export class ReservationPrComponent implements OnInit {
  faClipboardList = faClipboardList;

  reservations: Reservation[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  selectedReservation: Reservation | null = null;
  isDeleteDialogOpen: boolean = false;
  isConfirmDialogOpen: boolean = false
  isCancelDialogOpen: boolean = false
  constructor(private reservation: ReservationService) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.reservation.getAll().subscribe({
      next: (response) => {
        this.reservations = response.reservations.sort((a: any, b:any) => 
           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations :', err);
      }
    });
  }

  get filteredReservations(): Reservation[] {
    return this.reservations.filter((reservation) => {
      const org = reservation.Organisateur;
      const serv = reservation.Service;
  
      const matchesSearch =
        (org?.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (org?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (org?.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (serv?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
  
      const matchesStatus =
        this.statusFilter === 'all' || reservation.Status === this.statusFilter;
  
      return matchesSearch && matchesStatus;
    });
  }
  

  updateStatus(id: string, newStatus: ReservationStatus): void {
    this.reservations = this.reservations.map(reservation =>
      reservation.id === id ? { ...reservation, Status: newStatus } : reservation
    );
  }

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
        
        this.reservations = this.reservations.filter(
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
 
  openCancelDialog(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.isCancelDialogOpen = true; 
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelReservation(): void {
    if (!this.selectedReservation) return;

    const reservationId = this.selectedReservation.id;
    this.isLoading = true;

    this.reservation.cancelReservation(reservationId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Réservation annulée avec succès';
        this.fetchReservations(); 
        this.isCancelDialogOpen = false;
        this.selectedReservation = null;
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.error || 'Erreur lors de l\'annulation';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }

openConfirmDialog(reservation: Reservation): void {
  this.selectedReservation = reservation;
  this.isConfirmDialogOpen = true;
  this.errorMessage = ''; 
  this.successMessage = '';
}
isDetailsDialogOpen: boolean = false;
openDetailsDialog(reservation: Reservation): void {
  this.selectedReservation = reservation;
  this.isDetailsDialogOpen = true;
}

confirmReservation(): void {
  if (!this.selectedReservation) return;

  const reservationId = this.selectedReservation.id;
  this.isLoading = true;

  this.reservation.confirmReservation(reservationId).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.successMessage = res.message || 'Réservation confirmée avec succès';
      this.fetchReservations(); 
      this.isConfirmDialogOpen = false;
      this.selectedReservation = null;
      setTimeout(() => this.successMessage = '', 4000);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err?.error?.error || 'Erreur lors de la confirmation';
      setTimeout(() => this.errorMessage = '', 4000);
    }
  });
}
  getStatusBadgeClass(status: ReservationStatus): string {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-500 text-white';
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'CANCELED':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  }

  getStatusText(status: ReservationStatus): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Acceptée';
      case 'CANCELED':
        return 'Refusée';
      default:
        return status;
    }
  }

  
}   
   

