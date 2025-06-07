import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardList, faBell, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { ReservationService } from '../../../Services/reservation.service';
import { ContractService } from '../../../Services/contrat.service';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'PAID';

interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number; 
  promo: number;
  type: string;
  photoCouverture: string;
  Prestataire: {
    nom: string;
    prenom: string;
    email: string;
    numTel: string;
  };
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
  payment: Payment;
}
interface Payment {
  id: string;
}
@Component({
  selector: 'app-contrat-ad',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './contrat-ad.component.html',
  styleUrl: './contrat-ad.component.css'
})
export class ContratAdComponent implements OnInit {
  faClipboardList = faClipboardList;
  faBell = faBell;
  Math = Math;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  reservations: Reservation[] = [];
  searchTerm: string = '';
  statusFilter: string = 'PAID';
  selectedReservation: Reservation | null = null;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 10; 

  constructor(
    private reservation: ReservationService,   
    private contrat:ContractService,
    private prestataireService: PrestataireService,
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchPresData();
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
    this.reservation.getAll().subscribe({
      next: (response) => {
        this.reservations = response.reservations
          .filter((reservation: Reservation) => reservation.Status === 'PAID')
          .sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          console.log(this.reservations)
      },
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
  
      const matchesStatus = reservation.Status === 'PAID';
  
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

  updateStatus(id: string, newStatus: ReservationStatus): void {
    this.reservations = this.reservations.map(reservation =>
      reservation.id === id ? { ...reservation, Status: newStatus } : reservation
    );
  }

  get paidCount(): number {
    return this.reservations.length;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
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
get paidReservationsCount(): number {
  return this.reservations.filter(reservation => reservation.Status === 'PAID').length;
}


get totalPayments(): number {
  const paymentRate = 0.3; 
  return this.reservations
    .filter(reservation => reservation.Status === 'PAID')
    .reduce((sum, reservation) => {
      const prixString = reservation.prix || '0'; 
      const prix = parseFloat(prixString.replace(' DT', '')) || 0; 
      const amountInMillimes = Math.round(prix * 1000); 
      const afterRate = amountInMillimes * paymentRate;
      return sum + afterRate;
    }, 0);
}

get commission(): number {
  const paymentRate = 0.3; 
  const commissionRate = 0.2;
  return this.reservations
    .filter(reservation => reservation.Status === 'PAID')
    .reduce((sum, reservation) => {
      const prixString = reservation.prix || '0'; 
      const prix = parseFloat(prixString.replace(' DT', '')) || 0; 
      const amountInMillimes = Math.round(prix * 1000); 
      const afterRate = amountInMillimes * paymentRate; 
      const commission = afterRate * commissionRate; 
      return sum + commission;
    }, 0);
}


downloadContract(paymentId: string): void {

  this.contrat.downloadContract(paymentId).subscribe({
    next: (response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrat-${paymentId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Erreur lors du téléchargement du contrat:', err);
      this.errorMessage = 'Échec du téléchargement du contrat.';
    }
  });
}

}