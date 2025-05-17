import { Component, OnInit } from '@angular/core';
import { NavbarORComponent } from '../navbar-or/navbar-or.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizerService } from '../../../Services/organizer.service';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { ReservationService } from '../../../Services/reservation.service';
import { RouterLink } from '@angular/router';
import { PaiementService } from '../../../Services/paiement.service';
import { ContractService } from '../../../Services/contrat.service';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface Reservation {
  id: string;
  serviceid: number;
  dateDebut: string;
  prix: number;
  Status: string;
  Service: Service;
  payment: Payment;
}

interface Service {
  id: string;
  nom: string;
  Prestataireid: string;
  Prestataire: Prestataire;
  photoCouverture: string;
}

interface Prestataire {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
}

interface Payment {
  id: string;
}

interface Organizer {
  Reservations: Reservation[];
}

@Component({
  selector: 'app-reservation-or',
  standalone: true,
  imports: [NavbarORComponent, FormsModule, CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './reservation-or.component.html',
  styleUrls: ['./reservation-or.component.css']
})
export class ReservationOrComponent implements OnInit {
  mesReservations: Reservation[] = [];
  organisateur: Organizer | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  pageSizeOptions: number[] = [10, 20, 50];
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  constructor(
    private organizerService: OrganizerService,
    private serviceService: ServiceService,
    private prestataireService: PrestataireService,
    private reservation: ReservationService,
    private contractService: ContractService,
    private paiementService: PaiementService
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
                reservation.Service = serviceResponse.service;
                this.prestataireService.getPrestataireById(reservation.Service!.Prestataireid).subscribe(
                  (prestResponse: any) => {
                    reservation.Service!.Prestataire = prestResponse.pres;
                    console.log("Prestataire:", reservation.Service.Prestataire);
                  },
                  (prestError: any) => {
                    console.error('Erreur lors de la récupération du prestataire:', prestError);
                  }
                );
                if (reservation.Status === 'PAID') {
                  this.paiementService.getPaymentByReservationId(reservation.id).subscribe(
                    (paymentResponse: any) => {
                      reservation.payment = paymentResponse.payment;
                    },
                    (paymentError: any) => {
                      console.error('Erreur lors de la récupération du paiement:', paymentError);
                    }
                  );
                }
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
      case 'PAID':
        return 'Payée';
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
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
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
        
        if (this.totalPages === 0) {
          this.currentPage = 1;
        } else if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }

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

  get filteredReservations(): Reservation[] {
    return this.mesReservations.filter(res => {
      const matchesStatus =
        this.selectedStatus === 'all' || res.Status.toLowerCase() === this.selectedStatus;
      const matchesSearch =
        !this.searchQuery || res.Service?.nom?.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  get paginatedReservations(): Reservation[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredReservations.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReservations.length / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current > delta + 2) {
        pages.push('...');
      }
      const start = Math.max(2, current - delta);
      const end = Math.min(total - 1, current + delta);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (current < total - delta - 1) {
        pages.push('...');
      }
      pages.push(total);
    }
    return pages;
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  } 

  payerReservation(reservation: Reservation): void {
    if (!reservation || !reservation.id) return;

    this.paiementService.payerReservation(reservation.id).subscribe({
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

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(selectElement.value, 10);
    this.currentPage = 1; 
  }
  onItemsPerPageChange(): void {
    this.currentPage = 1; 
  }
}