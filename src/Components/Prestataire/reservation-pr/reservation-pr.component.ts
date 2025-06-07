import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../Services/reservation.service';
import { Observable } from 'rxjs';
import { faBell, faChevronLeft, faChevronRight, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrestataireService } from '../../../Services/prestataire.service';
import { ContractService } from '../../../Services/contrat.service';
import { PaiementService } from '../../../Services/paiement.service';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'PAID';
 
interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number;
  promo: number;
  type: string;
  photoCouverture: string;
}
interface Payment {
  id: string;
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
  prix: string;
  serviceid:String;
  payment: Payment;
}

@Component({
  selector: 'app-reservation-pr',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './reservation-pr.component.html',
  styleUrl: './reservation-pr.component.css'
})
export class ReservationPrComponent implements OnInit {
  faClipboardList = faClipboardList;
  faBell = faBell;
  Math = Math;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  reservations: Reservation[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  selectedReservation: Reservation | null = null;
  isDeleteDialogOpen: boolean = false;
  isConfirmDialogOpen: boolean = false;
  isCancelDialogOpen: boolean = false;
  isDetailsDialogOpen: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 10; 

  constructor(
    private reservation: ReservationService,   
    private prestataireService: PrestataireService,
    private contractService: ContractService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    this.fetchPresData();
    this.fetchReservations();
  }

  prestataire: any = {};

  fetchPresData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.prestataireService.getPrestataireById(id).subscribe(
        (response) => {
          this.prestataire = response.pres;
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

fetchReservations(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const prestataireId = user.Id;

  if (!prestataireId) {
    console.warn('ID prestataire introuvable');
    return;
  }

  this.isLoading = true;
  this.reservation.getServiceReservationsByPrestataireId(prestataireId).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.reservations = response.reservations || [];

      // Optionnel : trier par date de création décroissante
      this.reservations.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Charger les paiements pour les réservations payées si nécessaire
      this.reservations.forEach(reservation => {
        if (reservation.Status === 'PAID' && !reservation.payment) {
          this.paiementService.getPaymentByReservationId(reservation.id).subscribe(
            (paymentResponse: any) => {
              reservation.payment = paymentResponse.payment;
            },
            (paymentError: any) => {
              console.error('Erreur récupération paiement:', paymentError);
            }
          );
        }
      });
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Erreur récupération réservations:', error);
      this.errorMessage = 'Erreur lors du chargement des réservations.';
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

  get paginatedReservations(): Reservation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReservations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReservations.length / this.itemsPerPage);
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
    this.currentPage = 1; // Revenir à la première page
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

  updateStatus(id: string, newStatus: ReservationStatus): void {
    this.reservations = this.reservations.map(reservation =>
      reservation.id === id ? { ...reservation, Status: newStatus } : reservation
    );
  }

  openDeleteDialog(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.isDeleteDialogOpen = true;
  }

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

  get pendingCount(): number {
    return this.reservations.filter(m => m.Status === 'PENDING').length;
  }

  get publicCount(): number {
    return this.reservations.filter(m => m.Status === 'CONFIRMED').length;
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

  openDetailsDialog(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.isDetailsDialogOpen = true;
  }

  getStatusBadgeClass(status: ReservationStatus): string {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-500 text-white';
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'CANCELED':
        return 'bg-gray-800 text-white';
     case 'PAID':
      return 'bg-blue-100 text-blue-800';
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
      case 'PAID':
        return 'Payée';
      default:
        return status;
    }
  }
  downloadContract(paymentId: string): void {
    this.contractService.downloadContract(paymentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contract-${paymentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download error:', err);
        this.errorMessage = 'Erreur lors du téléchargement du contrat.';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }
}